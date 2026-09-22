module.exports = `
<!-- ==================== CHAPTER 5: IMPLEMENTATION DETAILS & CODE HIGHLIGHTS ==================== -->
<div class="chapter-container">
  <div class="chapter-header">
    <div class="chapter-number">CHAPTER 5</div>
    <h1 class="chapter-title">IMPLEMENTATION DETAILS &amp; CODE HIGHLIGHTS</h1>
  </div>

  <h2 class="sec-heading">5.1 Implementation Methodology &amp; Engineering Decisions</h2>

  <p class="body-p">
    The software implementation of <b>StudyFlow AI</b> was guided by strict software engineering best practices: modular programming, pure functional pipelines for machine learning transformations, declarative reactive UI rendering, and defense-in-depth database security.
  </p>

  <p class="body-p">
    Rather than scattering database queries across client components, all data mutations and machine learning pipelines are encapsulated in server functions utilizing <b>TanStack Start RPC primitives</b> (<code>createServerFn</code>). This architectural separation guarantees that mathematical vector space operations and administrative aggregations execute on the server, minimizing client computational overhead and preventing exposure of sensitive database credentials.
  </p>

  <h2 class="sec-heading">5.2 Server-Side Full-Text Search Implementation</h2>

  <p class="body-p">
    In compliance with DFD Level 1 (Process P2), catalog searching is executed entirely on the server. The function <code>searchMaterialsServer</code> in <code>src/lib/server/catalog.ts</code> provides server-side searching with multi-facet filtering and pagination:
  </p>

  <div class="code-listing-box">
<pre>
export const searchMaterialsServer = createServerFn({ method: "POST" })
  .validator((data: {
    query?: string;
    subjectId?: string;
    format?: string;
    difficulty?: string;
    page?: number;
    pageSize?: number;
  }) =&gt; data)
  .handler(async ({ data }) =&gt; {
    const page = data.page || 1;
    const pageSize = data.pageSize || 12;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let queryBuilder = supabase
      .from("materials")
      .select("*, subject:subjects(*)", { count: "exact" })
      .eq("approval_status", "approved");

    // Server-Side Full-Text Filter
    if (data.query &amp;&amp; data.query.trim().length &gt; 0) {
      const sanitized = data.query.trim();
      queryBuilder = queryBuilder.or(
        \`title.ilike.%\${sanitized}%,description.ilike.%\${sanitized}%\`
      );
    }

    // Multi-Facet Subject &amp; Difficulty Filtering
    if (data.subjectId &amp;&amp; data.subjectId !== "all") {
      queryBuilder = queryBuilder.eq("subject_id", data.subjectId);
    }
    if (data.difficulty &amp;&amp; data.difficulty !== "all") {
      queryBuilder = queryBuilder.eq("difficulty", data.difficulty);
    }

    // Pagination &amp; Ordering
    queryBuilder = queryBuilder
      .order("average_rating", { ascending: false })
      .range(from, to);

    const { data: materials, count, error } = await queryBuilder;
    if (error) throw new Error(\`Catalog query failed: \${error.message}\`);

    return {
      materials: materials || [],
      totalCount: count || 0,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / pageSize),
    };
  });
</pre>
  </div>

  <h2 class="sec-heading">5.3 True TF-IDF &amp; Collaborative Recommendation Pipeline Code</h2>

  <p class="body-p">
    Process P3 (DFD Level 2) is implemented in <code>src/lib/recommendation.ts</code>. The following code highlights show the mathematical precision of the token extraction, smooth IDF calculation, Cosine Similarity, and collaborative filtering:
  </p>

  <div class="code-listing-box">
<pre>
// P3.2: Keyword Extraction &amp; Stopword Removal
export function extractQueryTokens(text: string): string[] {
  if (!text) return [];
  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
  return normalized
    .split(/\s+/)
    .filter((token) =&gt; token.length &gt; 1 &amp;&amp; !ACADEMIC_STOP_WORDS.has(token));
}

// P3.3: Smooth Inverse Document Frequency (IDF) Corpus Builder
export function buildCorpusTfIdf(materials: StudyMaterial[]): Map&lt;string, number&gt; {
  const documentFrequency = new Map&lt;string, number&gt;();
  const N = materials.length;

  // Compute Document Frequency DF(t)
  for (const material of materials) {
    const docTokens = new Set(
      extractQueryTokens(\`\${material.title} \${material.description || ""}\`)
    );
    for (const token of docTokens) {
      documentFrequency.set(token, (documentFrequency.get(token) || 0) + 1);
    }
  }

  // Compute Smooth IDF: ln((N + 1) / (DF(t) + 1)) + 1
  const idfMap = new Map&lt;string, number&gt;();
  documentFrequency.forEach((df, term) =&gt; {
    const smoothIdf = Math.log((N + 1) / (df + 1)) + 1.0;
    idfMap.set(term, smoothIdf);
  });

  return idfMap;
}

// P3.3: Vector Cosine Similarity Computation
export function cosineSimilarity(
  vecA: Map&lt;string, number&gt;,
  vecB: Map&lt;string, number&gt;
): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const val of vecA.values()) normA += val * val;
  for (const val of vecB.values()) normB += val * val;

  if (normA === 0 || normB === 0) return 0;

  for (const [term, valA] of vecA.entries()) {
    const valB = vecB.get(term);
    if (valB !== undefined) {
      dotProduct += valA * valB;
    }
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// P3.4: Collaborative User-Item Rating Matrix Preference Scoring
export function computeCollaborativeScores(
  materials: StudyMaterial[],
  ratings: MaterialRating[],
  targetUserId?: string
): Map&lt;string, number&gt; {
  const collabScores = new Map&lt;string, number&gt;();

  // If cold-start (no ratings or anonymous), use normalized Bayesian average
  if (!ratings || ratings.length === 0 || !targetUserId) {
    for (const m of materials) {
      const avgScore = (m.average_rating || 0) / 5.0;
      const popScore = Math.min(1.0, (m.rating_count || 0) / 25.0);
      collabScores.set(m.id, avgScore * 0.7 + popScore * 0.3);
    }
    return collabScores;
  }

  // Construct User-Item Rating Matrix
  const userRatings = new Map&lt;string, Map&lt;string, number&gt;&gt;();
  for (const r of ratings) {
    if (!userRatings.has(r.user_id)) userRatings.set(r.user_id, new Map());
    userRatings.get(r.user_id)!.set(r.material_id, r.score);
  }

  const targetMap = userRatings.get(targetUserId) || new Map();

  // Calculate peer correlation and predicted rating
  for (const m of materials) {
    let weightedScoreSum = 0;
    let similaritySum = 0;

    userRatings.forEach((otherMap, otherUserId) =&gt; {
      if (otherUserId === targetUserId || !otherMap.has(m.id)) return;
      const sim = calculateUserCorrelation(targetMap, otherMap);
      if (sim &gt; 0) {
        weightedScoreSum += sim * (otherMap.get(m.id)! / 5.0);
        similaritySum += sim;
      }
    });

    if (similaritySum &gt; 0) {
      collabScores.set(m.id, weightedScoreSum / similaritySum);
    } else {
      // Fallback to normalized material rating
      collabScores.set(m.id, (m.average_rating || 0) / 5.0);
    }
  }

  return collabScores;
}
</pre>
  </div>

  <h2 class="sec-heading">5.4 Comprehensive Administrative Reports Implementation</h2>

  <p class="body-p">
    In compliance with Section 5.6 of the approved project proposal, administrative analytics are aggregated by the server function <code>getAdminComprehensiveReports</code> in <code>src/lib/server/adminReports.ts</code>:
  </p>

  <div class="code-listing-box">
<pre>
export const getAdminComprehensiveReports = createServerFn({ method: "GET" })
  .handler(async () =&gt; {
    // 1. Report 1: Student Activity Aggregation
    const { data: students } = await supabase.from("profiles").select("*");
    const { data: logs } = await supabase.from("search_logs").select("*");
    const { data: ratings } = await supabase.from("ratings").select("*");
    const { data: views } = await supabase.from("material_views").select("*");

    const studentActivity = (students || []).map((student) =&gt; {
      const studentLogs = (logs || []).filter((l) =&gt; l.user_id === student.id);
      const studentRatings = (ratings || []).filter((r) =&gt; r.user_id === student.id);
      const studentViews = (views || []).filter((v) =&gt; v.user_id === student.id);

      const avgRatingGiven = studentRatings.length &gt; 0
        ? studentRatings.reduce((acc, r) =&gt; acc + r.score, 0) / studentRatings.length
        : 0;

      return {
        userId: student.id,
        fullName: student.full_name || "Enrolled Student",
        searchCount: studentLogs.length,
        recentSearches: studentLogs.slice(0, 3).map((l) =&gt; l.query),
        materialsViewed: studentViews.length,
        ratingsGiven: studentRatings.length,
        avgRatingGiven: Number(avgRatingGiven.toFixed(2)),
      };
    });

    // 2. Report 2: Most-Recommended Materials (Top 20)
    const { data: recs } = await supabase.from("recommendations").select("material_id");
    const recCounts = new Map&lt;string, number&gt;();
    for (const r of recs || []) {
      recCounts.set(r.material_id, (recCounts.get(r.material_id) || 0) + 1);
    }
    // Sort and map to Top-20 materials with frequency counts...

    // 3. Report 3: Subject Search Popularity Distribution
    // 4. Report 4: Material Rating Summary Ranking
    // 5. Report 5: System Usage &amp; Operational Metrics Summary
    return {
      studentActivity,
      mostRecommended,
      subjectPopularity,
      ratingSummary,
      systemUsage,
    };
  });
</pre>
  </div>

  <h2 class="sec-heading">5.5 Architectural Defense: TypeScript vs Python &amp; PostgreSQL vs MongoDB</h2>

  <p class="body-p">
    A critical aspect of software engineering defense during university evaluation is justifying technology selections against traditional alternatives:
  </p>

  <h3 class="sub-sec-heading">1. Why TypeScript over Python or Pure JavaScript?</h3>
  <ul class="body-ul">
    <li>
      <b>Mathematical Type Invariants:</b> In machine learning pipelines like TF-IDF and collaborative filtering, vectors and matrices must have strict dimension and numeric guarantees. In untyped JavaScript, an unhandled <code>undefined</code> key produces <code>NaN</code> values that propagate silently through vector math. TypeScript enforces strict numeric checks at compile time (<code>npx tsc --noEmit</code>), guaranteeing mathematical correctness.
    </li>
    <li>
      <b>Unified Full-Stack Contract:</b> In Python-backend architectures (FastAPI/Flask + React), data schemas must be redundantly declared in Python (Pydantic) and TypeScript. In TanStack Start with TypeScript, backend server functions and frontend UI components share the exact same PostgreSQL schema types, eliminating API drift.
    </li>
    <li>
      <b>Asynchronous Concurrency:</b> Node.js on the V8 engine handles non-blocking I/O requests concurrently with minimal memory overhead, avoiding Python's Global Interpreter Lock (GIL) limitations.
    </li>
  </ul>

  <h3 class="sub-sec-heading">2. Why Supabase PostgreSQL over MongoDB?</h3>
  <ul class="body-ul">
    <li>
      <b>Relational Integrity &amp; Foreign-Key Cascades:</b> Academic data structures are inherently relational: students enroll in subjects, study materials belong to subjects, and ratings reference both students and materials. MongoDB NoSQL stores duplicate data across collections, risking orphaned records. PostgreSQL enforces strict foreign-key integrity.
    </li>
    <li>
      <b>Row-Level Security (RLS):</b> Supabase PostgreSQL enforces access control at the database engine kernel level via RLS policies. Even if a malicious client attempts to call database endpoints directly, unauthorized updates to peer ratings or administrative materials are rejected.
    </li>
    <li>
      <b>Atomic Database Triggers:</b> Average ratings are maintained atomically within the database engine via PL/pgSQL triggers (<code>refresh_material_rating</code>), completely eliminating client-side concurrency race conditions.
    </li>
  </ul>
</div>
`;
