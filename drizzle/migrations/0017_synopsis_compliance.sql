-- BCSP-064 synopsis compliance: admin report access, full-text search (Module 2),
-- live view counts, recommendation history (Report 2 / Report 5) and rating privacy.

-- 1. Reports & Analytics (P6) must see every learner, not only the admin's own row.
CREATE POLICY "profiles admin select" ON public.profiles
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "roles admin select" ON public.user_roles
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Ratings expose user ids and reviews, so only signed-in users may read them.
DROP POLICY IF EXISTS "ratings public read" ON public.ratings;
REVOKE SELECT ON public.ratings FROM anon;
CREATE POLICY "ratings authenticated read" ON public.ratings
FOR SELECT TO authenticated
USING (true);

-- 3. Full-text index on title + tags + description (synopsis 5.3 "text index").
CREATE OR REPLACE FUNCTION public.material_search_document(_title text, _description text, _tags text[])
RETURNS tsvector
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT setweight(to_tsvector('english'::regconfig, coalesce(_title, '')), 'A')
      || setweight(to_tsvector('english'::regconfig, coalesce(array_to_string(_tags, ' '), '')), 'B')
      || setweight(to_tsvector('english'::regconfig, coalesce(_description, '')), 'C')
$$;

ALTER TABLE public.materials
  ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (public.material_search_document(title, description, tags)) STORED;

CREATE INDEX materials_search_vector_idx ON public.materials USING gin (search_vector);

-- _query is a prefix tsquery built and sanitised by the server (src/lib/search.ts).
-- Enrolled subjects are boosted so logged-in students see their subjects first (Module 2, step 4).
CREATE OR REPLACE FUNCTION public.search_materials(
  _query text DEFAULT NULL,
  _subject_id uuid DEFAULT NULL,
  _type public.material_type DEFAULT NULL,
  _preferred_subjects uuid[] DEFAULT '{}',
  _limit integer DEFAULT 12,
  _offset integer DEFAULT 0
)
RETURNS TABLE (material_id uuid, search_rank double precision, total_count bigint)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  WITH q AS (
    SELECT CASE WHEN coalesce(btrim(_query), '') = '' THEN NULL ELSE to_tsquery('english', _query) END AS tsq
  ),
  matches AS (
    SELECT
      m.id AS mid,
      (CASE WHEN q.tsq IS NULL THEN 0 ELSE ts_rank_cd(m.search_vector, q.tsq) END)::double precision
        + (CASE WHEN m.subject_id = ANY (coalesce(_preferred_subjects, '{}'::uuid[])) THEN 0.5 ELSE 0 END)::double precision
        + (m.average_rating::double precision / 50.0) AS score
    FROM public.materials m
    CROSS JOIN q
    WHERE m.approval_status = 'approved'
      AND (q.tsq IS NULL OR m.search_vector @@ q.tsq)
      AND (_subject_id IS NULL OR m.subject_id = _subject_id)
      AND (_type IS NULL OR m.type = _type)
  )
  SELECT matches.mid, matches.score, count(*) OVER ()
  FROM matches
  ORDER BY matches.score DESC, matches.mid
  LIMIT least(greatest(coalesce(_limit, 12), 1), 50)
  OFFSET greatest(coalesce(_offset, 0), 0)
$$;

REVOKE EXECUTE ON FUNCTION public.search_materials(text, uuid, public.material_type, uuid[], integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.search_materials(text, uuid, public.material_type, uuid[], integer, integer) TO authenticated, service_role;

-- 4. Keep materials.view_count in sync with material_views.
CREATE OR REPLACE FUNCTION public.increment_material_view_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.materials SET view_count = view_count + 1 WHERE id = NEW.material_id;
  RETURN NEW;
END
$$;

REVOKE EXECUTE ON FUNCTION public.increment_material_view_count() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER material_views_increment_count
AFTER INSERT ON public.material_views
FOR EACH ROW EXECUTE FUNCTION public.increment_material_view_count();

UPDATE public.materials m
SET view_count = greatest(m.view_count, (SELECT count(*) FROM public.material_views v WHERE v.material_id = m.id));

-- 5. Recommendation history. public.recommendations stays the current Top-N (DFD store D4);
-- every engine run is logged here so reports count what the engine actually recommended over time.
CREATE TABLE public.recommendation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  trigger text NOT NULL CHECK (trigger IN ('login', 'manual', 'profile_update', 'rating')),
  item_count integer NOT NULL DEFAULT 0 CHECK (item_count >= 0),
  generated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.recommendation_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES public.recommendation_runs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  material_id uuid NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  position integer NOT NULL CHECK (position BETWEEN 1 AND 50),
  score numeric(6,5) NOT NULL CHECK (score BETWEEN 0 AND 1),
  generated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.recommendation_runs TO authenticated;
GRANT SELECT, INSERT ON public.recommendation_history TO authenticated;
GRANT ALL ON public.recommendation_runs TO service_role;
GRANT ALL ON public.recommendation_history TO service_role;
ALTER TABLE public.recommendation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recommendation runs read" ON public.recommendation_runs
FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "recommendation runs insert" ON public.recommendation_runs
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "recommendation history read" ON public.recommendation_history
FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "recommendation history insert" ON public.recommendation_history
FOR INSERT TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (SELECT 1 FROM public.recommendation_runs r WHERE r.id = run_id AND r.user_id = auth.uid())
);

CREATE INDEX recommendation_runs_user_time_idx ON public.recommendation_runs (user_id, generated_at DESC);
CREATE INDEX recommendation_runs_time_idx ON public.recommendation_runs (generated_at DESC);
CREATE INDEX recommendation_history_material_idx ON public.recommendation_history (material_id);
CREATE INDEX recommendation_history_run_idx ON public.recommendation_history (run_id);

-- Backfill one run per learner from the recommendations already stored.
WITH latest AS (
  SELECT user_id, count(*)::integer AS item_count, max(generated_at) AS generated_at
  FROM public.recommendations
  GROUP BY user_id
),
runs AS (
  INSERT INTO public.recommendation_runs (user_id, trigger, item_count, generated_at)
  SELECT user_id, 'login', item_count, generated_at FROM latest
  RETURNING id, user_id
)
INSERT INTO public.recommendation_history (run_id, user_id, material_id, position, score, generated_at)
SELECT
  runs.id,
  r.user_id,
  r.material_id,
  least(row_number() OVER (PARTITION BY r.user_id ORDER BY r.score DESC), 50)::integer,
  r.score,
  r.generated_at
FROM public.recommendations r
JOIN runs ON runs.user_id = r.user_id;
