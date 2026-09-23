import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Clock3, ExternalLink, Search, Star } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { openMaterial } from '@/lib/catalog'
import type { MaterialDoc } from '@/lib/recommendation'
import { Button } from '@/components/ui/button'

type SearchRow = { id: string; query: string; result_count: number; created_at: string; subjects: { name: string } | null }
type ViewRow = { id: string; viewed_at: string; materials: MaterialDoc | null }
type RatingRow = { id: string; score: number; review: string | null; updated_at: string; materials: { id: string; title: string; subjects: { name: string } | null } | null }

// Module 5 – the learner's past searches, viewed materials and ratings (the same signals the engine uses).
export function LearningHistory({ userId, limit = 30 }: { userId: string; limit?: number }) {
  const [searches, setSearches] = useState<SearchRow[]>([])
  const [views, setViews] = useState<ViewRow[]>([])
  const [ratings, setRatings] = useState<RatingRow[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    void Promise.all([
      supabase.from('search_logs').select('id,query,result_count,created_at,subjects(name)').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit),
      supabase.from('material_views').select('id,viewed_at,materials(*,subjects(name))').eq('user_id', userId).order('viewed_at', { ascending: false }).limit(limit),
      supabase.from('ratings').select('id,score,review,updated_at,materials(id,title,subjects(name))').eq('user_id', userId).order('updated_at', { ascending: false }).limit(limit),
    ]).then(([s, v, r]) => {
      setSearches((s.data ?? []) as unknown as SearchRow[])
      setViews((v.data ?? []) as unknown as ViewRow[])
      setRatings((r.data ?? []) as unknown as RatingRow[])
      setLoaded(true)
    })
  }, [userId, limit])

  if (!loaded) return <div className="skeleton-block" />

  return (
    <div className="grid gap-8">
      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold"><Search className="size-5 text-primary" /> Recent searches</h2>
        {searches.length ? (
          <ul className="grid gap-2">
            {searches.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
                <div>
                  <Link to="/search" search={{ subject: '', q: s.query }} className="font-medium hover:underline">{s.query}</Link>
                  <p className="text-xs text-muted-foreground">
                    {s.result_count} results{s.subjects?.name ? ` · ${s.subjects.name}` : ''} · {new Date(s.created_at).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No searches yet. Searches you submit on Explore are saved here.</p>
        )}
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold"><Clock3 className="size-5 text-primary" /> Viewed materials</h2>
        {views.length ? (
          <div className="timeline">
            {views.map((v) => (
              <article key={v.id}>
                <span className="timeline-icon"><Clock3 /></span>
                <div>
                  <p className="eyebrow">{v.materials?.subjects?.name} · {v.materials?.type}</p>
                  <h2>{v.materials?.title ?? 'Material no longer available'}</h2>
                  <time>{new Date(v.viewed_at).toLocaleString()}</time>
                </div>
                {v.materials && (
                  <Button variant="outline" size="icon" onClick={() => void openMaterial(v.materials!, userId)} aria-label={`Open ${v.materials.title}`}>
                    <ExternalLink />
                  </Button>
                )}
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Resources you open will appear here.</p>
        )}
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold"><Star className="size-5 text-primary" /> Your ratings</h2>
        {ratings.length ? (
          <ul className="grid gap-2">
            {ratings.map((r) => (
              <li key={r.id} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center justify-between gap-3">
                  {r.materials ? (
                    <Link to="/materials/$id" params={{ id: r.materials.id }} className="font-medium hover:underline">{r.materials.title}</Link>
                  ) : (
                    <span className="font-medium">Material no longer available</span>
                  )}
                  <span className="flex items-center gap-1 text-sm font-semibold" aria-label={`${r.score} out of 5 stars`}>
                    <Star className="size-4 fill-current text-rating" /> {r.score}/5
                  </span>
                </div>
                {r.review && <p className="mt-1 text-sm text-muted-foreground">{r.review}</p>}
                <p className="mt-1 text-xs text-muted-foreground">{r.materials?.subjects?.name} · {new Date(r.updated_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">You haven’t rated any materials yet.</p>
        )}
      </section>
    </div>
  )
}
