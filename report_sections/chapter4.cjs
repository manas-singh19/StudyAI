module.exports = `
<!-- ==================== CHAPTER 4: SYSTEM DESIGN & AI ALGORITHMS ==================== -->
<div class="chapter-container">
  <div class="chapter-header">
    <div class="chapter-number">CHAPTER 4</div>
    <h1 class="chapter-title">SYSTEM DESIGN &amp; AI ALGORITHMS</h1>
  </div>

  <h2 class="sec-heading">4.1 Architectural Design</h2>

  <p class="body-p">
    Modern software engineering for data-intensive web applications demands an architecture that delivers high interactive responsiveness, sub-second query latency, strict separation of concerns, and robust enterprise data protection. Traditional client-side Single Page Applications (SPAs) suffer from significant initial load latency and security risks when sensitive database keys or business logic are exposed to the browser.
  </p>

  <p class="body-p">
    To overcome these limitations, <b>StudyFlow AI</b> implements a modern <b>3-Tier Server-Side Rendered (SSR) + Backend-as-a-Service (BaaS) Architecture</b>. In this paradigm, initial page markup and heavy vector machine learning computations execute on a high-speed server runtime (TanStack Start powered by Nitro and the V8 engine), delivering pre-rendered, accessible HTML to the browser before hydrating into an interactive React application. Figure 4.1 outlines the architectural tiers:
  </p>

  <div class="ascii-diagram-box">
<pre>
========================================================================================
       FIGURE 4.1: MODERN 3-TIER SSR + BAAS DISTRIBUTED SYSTEM ARCHITECTURE
========================================================================================

  +----------------------------------------------------------------------------------+
  |                       TIER 1: PRESENTATION LAYER (CLIENT)                        |
  |   - Modern Web Browsers (Desktop, Laptop, Tablet, Mobile)                        |
  |   - React 19 Virtual DOM, Concurrent Mode &amp; Optimistic UI Updates                |
  |   - Tailwind CSS Utility Design System + Recharts Interactive SVG Visualizations |
  +----------------------------------------------------------------------------------+
                                           |
                                           | HTTP / HTTPS Requests (JSON RPC over TLS)
                                           v
  +----------------------------------------------------------------------------------+
  |                   TIER 2: APPLICATION &amp; SSR SERVER LAYER                         |
  |   - TanStack Start Server Functions (\`createServerFn\`) on Nitro Engine           |
  |   - Isomorphic Routing, Data Pre-Fetching &amp; HTML Pre-Rendering                   |
  |   - Machine Learning Recommender Engine:                                         |
  |       * Tokenization &amp; Stopword Extractor                                        |
  |       * TF-IDF Smooth Inverse Document Frequency Vectorizer                      |
  |       * Multi-Dimensional Cosine Similarity Matrix Evaluator                     |
  |       * User-Item Collaborative Preference Estimator                             |
  |       * Hybrid Score Synthesis &amp; Explainability Rule Generator                   |
  +----------------------------------------------------------------------------------+
                                           |
                                           | High-Speed TCP / Connection Pool (PostgreSQL)
                                           v
  +----------------------------------------------------------------------------------+
  |                     TIER 3: PERSISTENCE &amp; SECURITY LAYER                         |
  |   - Supabase PostgreSQL Enterprise Relational Database (3NF)                     |
  |   - PL/pgSQL Stored Triggers: Atomic Aggregate Rating Recalculation              |
  |   - Kernel-Level Security: PostgreSQL Row-Level Security (RLS) Policies          |
  |   - Full-Text Search Indexes, Foreign-Key Cascades &amp; ACID Transactions           |
  +----------------------------------------------------------------------------------+
</pre>
  </div>

  <h2 class="sec-heading">4.2 Modularization Details</h2>

  <p class="body-p">
    The software architecture is partitioned into seven highly cohesive, loosely coupled subsystems:
  </p>

  <ol class="body-ol">
    <li><b>Authentication Subsystem:</b> Handles user registration, password verification via bcrypt, role-based session token minting, and profile hydration.</li>
    <li><b>Academic Catalog Management Subsystem:</b> Encapsulates subject creation, material authoring, document format tagging (Notes, Books, Slides, Papers), and administrative approval workflows.</li>
    <li><b>Server-Side Full-Text Search Subsystem:</b> Parses student inquiry strings, validates search filters, queries PostgreSQL indexes, logs inquiries, and returns paginated result cards.</li>
    <li><b>Hybrid AI Recommender Subsystem:</b> Executes natural language preprocessing, computes smooth TF-IDF document vectors, evaluates geometric Cosine Similarity, runs collaborative rating predictions, and generates human-readable explainability strings.</li>
    <li><b>Peer Feedback &amp; Rating Subsystem:</b> Collects 1&ndash;5 star evaluations and qualitative reviews, utilizing PostgreSQL triggers to atomically recalculate item averages.</li>
    <li><b>Administrative Analytics &amp; Reports Subsystem:</b> Aggregates usage metrics, search frequency distributions, and rating statistics to fulfill the Section 5.6 reporting mandate.</li>
    <li><b>Collaborative Learning Subsystem:</b> Facilitates student study packs and educator verification requests.</li>
  </ol>

  <h2 class="sec-heading">4.3 Mathematical Formulation of AI &amp; Machine Learning Algorithms</h2>

  <p class="body-p">
    A foundational highlight of <b>StudyFlow AI</b> is its rigorous mathematical formulation of Information Retrieval (IR) and Machine Learning (ML) algorithms. Unlike superficial keyword-matching scripts, the system implements a formal <b>Vector Space Model (VSM)</b> coupled with <b>Collaborative Filtering</b>.
  </p>

  <h3 class="sub-sec-heading">4.3.1 Text Preprocessing &amp; Stopword Elimination</h3>
  <p class="body-p">
    Before mathematical vectorization, unstructured natural language texts—such as document titles $T$, abstracts/descriptions $D$, and student search queries $Q$—must be transformed into a standardized canonical representation:
  </p>

  <ol class="body-ol">
    <li>
      <b>Case Folding &amp; Character Normalization:</b> All characters are converted to lowercase, and non-alphanumeric punctuation marks are stripped using regular expression tokenization:
      $$\text{Tokenize}(text) = \{ w \in \text{split}(text, \text{non-alphanumeric}) \mid |w| \ge 2 \}$$
    </li>
    <li>
      <b>Stopword Filtering:</b> High-frequency grammatical function words that carry zero topical specificity (e.g., <i>&ldquo;the&rdquo;, &ldquo;is&rdquo;, &ldquo;and&rdquo;, &ldquo;for&rdquo;, &ldquo;with&rdquo;, &ldquo;study&rdquo;, &ldquo;learn&rdquo;</i>) are removed against an academic stopword set $S$:
      $$\text{Tokens}_{\text{clean}} = \{ w \in \text{Tokens} \mid w \notin S \}$$
    </li>
  </ol>

  <h3 class="sub-sec-heading">4.3.2 Term Frequency &ndash; Inverse Document Frequency (TF-IDF) Formulation</h3>
  <p class="body-p">
    TF-IDF is a statistical measure that quantifies how important a word is to a specific study material within the broader collection of $N$ catalog materials:
  </p>

  <p class="body-p">
    <b>1. Term Frequency (TF):</b> Measures the relative frequency of term $t$ in document $d$:
  </p>
  <div class="formula-display-box">
    $$\text{TF}(t, d) = \frac{f_{t, d}}{\sum_{t' \in d} f_{t', d}}$$
  </div>
  <p class="body-p">
    Where $f_{t, d}$ represents the raw occurrence count of term $t$ in document $d$, normalized by the total count of words in $d$ to prevent bias toward longer textbooks over concise revision notes.
  </p>

  <p class="body-p">
    <b>2. Smooth Inverse Document Frequency (IDF):</b> Penalizes terms that appear ubiquitously across all study materials while amplifying rare, highly specialized technical terms (such as <i>&ldquo;backpropagation&rdquo;, &ldquo;b-tree&rdquo;, &ldquo;semaphore&rdquo;</i>). To avoid division by zero when a term does not occur in the catalog, smooth IDF is defined as:
  </p>
  <div class="formula-display-box">
    $$\text{IDF}(t) = \ln\left(\frac{N + 1}{\text{DF}(t) + 1}\right) + 1$$
  </div>
  <p class="body-p">
    Where $N$ is the total number of approved materials in the catalog (e.g., $N = 62$), and $\text{DF}(t)$ is the <i>Document Frequency</i> (the number of materials containing term $t$). Adding $1$ to both numerator and denominator provides mathematical smoothing, ensuring that terms occurring in every document still retain a positive weight and never cause numerical instability.
  </p>

  <p class="body-p">
    <b>3. Composite TF-IDF Weight:</b>
  </p>
  <div class="formula-display-box">
    $$\text{TF-IDF}(t, d) = \text{TF}(t, d) \times \text{IDF}(t)$$
  </div>

  <h3 class="sub-sec-heading">4.3.3 Vector Space Modeling &amp; Cosine Similarity Derivation</h3>
  <p class="body-p">
    Every study material $d$ and student query $q$ is projected as a high-dimensional vector in term space $\mathbb{R}^{|V|}$, where $|V|$ is the vocabulary size:
  </p>
  <div class="formula-display-box">
    $$\mathbf{V}_d = \Big[ \text{TF-IDF}(t_1, d),\, \text{TF-IDF}(t_2, d),\, \dots,\, \text{TF-IDF}(t_k, d) \Big]$$
  </div>

  <p class="body-p">
    To compute the semantic relevance between query vector $\mathbf{V}_q$ and document vector $\mathbf{V}_d$, the system computes the <b>Cosine Similarity</b>—measuring the cosine of the angle $\theta$ between the two multi-dimensional vectors:
  </p>

  <div class="formula-display-box">
    $$\text{Cosine Similarity}(\mathbf{V}_q, \mathbf{V}_d) = \frac{\mathbf{V}_q \cdot \mathbf{V}_d}{\|\mathbf{V}_q\| \|\mathbf{V}_d\|} = \frac{\sum_{i=1}^{k} \mathbf{V}_{q, i} \times \mathbf{V}_{d, i}}{\sqrt{\sum_{i=1}^{k} (\mathbf{V}_{q, i})^2} \times \sqrt{\sum_{i=1}^{k} (\mathbf{V}_{d, i})^2}}$$
  </div>

  <p class="body-p">
    <b>Mathematical Properties &amp; Justification:</b>
  </p>
  <ul class="body-ul">
    <li><b>Bounded Domain:</b> Produces a normalized score in $[0, 1]$ for non-negative vectors, where $1.0$ indicates identical orientation (exact conceptual match) and $0.0$ indicates orthogonal vectors (zero shared terms).</li>
    <li><b>Length Invariance:</b> Unlike Euclidean distance, Cosine Similarity evaluates directional collinearity rather than vector magnitude. A concise 2-page summary note on <i>&ldquo;Normal Forms&rdquo;</i> and a 60-page textbook chapter covering the same topic will exhibit identical cosine similarity to a query on normalization.</li>
  </ul>

  <h3 class="sub-sec-heading">4.3.4 User-Item Collaborative Filtering</h3>
  <p class="body-p">
    Content filtering alone cannot capture peer quality assessments. <b>StudyFlow AI</b> incorporates <b>Collaborative Filtering</b> by constructing a sparse student-item rating matrix $\mathbf{R} \in \mathbb{R}^{|U| \times |M|}$, where $r_{u, m} \in [1, 5]$ denotes the rating student $u$ assigned to material $m$.
  </p>

  <p class="body-p">
    For active student $u$ and unrated candidate material $m$, the predicted score $\hat{r}_{u, m}$ is estimated from peer students $v \in U_m$ who evaluated item $m$:
  </p>
  <div class="formula-display-box">
    $$\text{sim}(u, v) = \frac{\sum_{i \in I_{uv}} r_{u, i} \cdot r_{v, i}}{\sqrt{\sum_{i \in I_{uv}} (r_{u, i})^2} \times \sqrt{\sum_{i \in I_{uv}} (r_{v, i})^2}}$$
    $$\hat{r}_{u, m} = \frac{\sum_{v \in U_m} \text{sim}(u, v) \times r_{v, m}}{\sum_{v \in U_m} |\text{sim}(u, v)|}$$
  </div>

  <p class="body-p">
    <b>Cold-Start Mitigation Strategy:</b> When a new student registers or has evaluated fewer than two items, $\text{sim}(u, v)$ cannot be computed reliably. The system automatically shifts collaborative weight toward the normalized global average rating and popularity volume:
  </p>
  <div class="formula-display-box">
    $$S_{\text{Collab}} = 0.70 \times \left(\frac{\text{average\_rating}}{5.0}\right) + 0.30 \times \min\left(1.0,\, \frac{\text{rating\_count}}{25}\right)$$
  </div>

  <h3 class="sub-sec-heading">4.3.5 Hybrid Multi-Criteria Score Synthesis</h3>
  <p class="body-p">
    The final ranking score $S_{\text{Final}}(m)$ for material $m$ synthesizes all four distinct academic signals according to Table 4.1:
  </p>

  <table class="academic-table">
    <thead>
      <tr>
        <th style="width: 25%;">Signal Component</th>
        <th style="width: 15%;">Weight ($\alpha$)</th>
        <th style="width: 60%;">Algorithmic Rationale &amp; Theoretical Justification</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Content Relevance ($S_{\text{Content}}$)</b></td>
        <td><b>50%</b> (0.50)</td>
        <td>Primary semantic signal. Guarantees that recommended materials directly answer the student's stated topic.</td>
      </tr>
      <tr>
        <td><b>Collaborative Preference ($S_{\text{Collab}}$)</b></td>
        <td><b>25%</b> (0.25)</td>
        <td>Peer consensus signal. Prioritizes materials rated highly by students with similar academic interests.</td>
      </tr>
      <tr>
        <td><b>Subject Fit ($S_{\text{SubjectFit}}$)</b></td>
        <td><b>15%</b> (0.15)</td>
        <td>Curricular alignment signal. Boosts materials belonging to the student's actively enrolled semester subjects.</td>
      </tr>
      <tr>
        <td><b>Baseline Quality ($S_{\text{Rating}}$)</b></td>
        <td><b>10%</b> (0.10)</td>
        <td>Global quality baseline. Prevents obscure, unrated materials from dominating recommendations.</td>
      </tr>
    </tbody>
  </table>

  <div class="formula-display-box">
    $$S_{\text{Final}}(m) = \min\Big(1.0,\, 0.50 \cdot S_{\text{Content}} + 0.25 \cdot S_{\text{Collab}} + 0.15 \cdot S_{\text{SubjectFit}} + 0.10 \cdot S_{\text{Rating}}\Big)$$
  </div>

  <h3 class="sub-sec-heading">4.3.6 Recommendation Explainability Engine</h3>
  <p class="body-p">
    To ensure students understand why each resource was surfaced, the engine evaluates component scores against an explainability decision tree:
  </p>
  <ul class="body-ul">
    <li>If $S_{\text{Content}} \ge 0.40$: Generates <i>&ldquo;High match with your learning interests and search keywords&rdquo;</i>.</li>
    <li>If $S_{\text{Collab}} \ge 0.70$ and rating $\ge 4.5$: Generates <i>&ldquo;Top-rated learning resource across students&rdquo;</i>.</li>
    <li>If $S_{\text{SubjectFit}} = 1.0$: Generates <i>&ldquo;Core curriculum resource for your enrolled subject&rdquo;</i>.</li>
    <li>Default: Generates <i>&ldquo;Curated recommendation based on your academic profile&rdquo;</i>.</li>
  </ul>

  <h2 class="sec-heading">4.4 Database Design &amp; Relational Schema (3NF)</h2>

  <p class="body-p">
    Database schema design was performed following strict relational normalization rules up to <b>Third Normal Form (3NF)</b>. Every non-key attribute is fully functionally dependent on the primary key, eliminating transitive dependencies, insertion anomalies, and data redundancy.
  </p>

  <h3 class="sub-sec-heading">4.4.1 Relational Tables Specification</h3>
  <p class="body-p">
    Table 4.2 presents the formal relational schema specifications across the core database tables:
  </p>

  <table class="academic-table">
    <thead>
      <tr>
        <th style="width: 20%;">Table Name</th>
        <th style="width: 25%;">Primary Key / Columns</th>
        <th style="width: 25%;">Foreign Keys &amp; Indexes</th>
        <th style="width: 30%;">Integrity Constraints &amp; Roles</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>profiles</code></td>
        <td><code>id (UUID PK)</code><br><code>full_name</code><br><code>enrolled_subjects</code></td>
        <td>References <code>auth.users(id)</code> ON DELETE CASCADE</td>
        <td>Stores extended student details; 1:1 with authentication record.</td>
      </tr>
      <tr>
        <td><code>subjects</code></td>
        <td><code>id (UUID PK)</code><br><code>name</code>, <code>code</code><br><code>semester</code>, <code>description</code></td>
        <td>Unique index on <code>code</code></td>
        <td>Stores academic curriculum disciplines (e.g., MCS-011, BCS-041).</td>
      </tr>
      <tr>
        <td><code>materials</code></td>
        <td><code>id (UUID PK)</code><br><code>title</code>, <code>description</code><br><code>subject_id</code>, <code>format</code><br><code>url</code>, <code>average_rating</code><br><code>rating_count</code></td>
        <td>FK &rarr; <code>subjects(id)</code><br>B-Tree index on <code>subject_id</code><br>Full-text index on <code>title, description</code></td>
        <td>Stores approved catalog study resources. <code>average_rating</code> maintained atomically via trigger.</td>
      </tr>
      <tr>
        <td><code>ratings</code></td>
        <td><code>id (UUID PK)</code><br><code>user_id</code>, <code>material_id</code><br><code>score</code>, <code>review_text</code></td>
        <td>FK &rarr; <code>profiles(id)</code><br>FK &rarr; <code>materials(id)</code><br>Unique <code>(user_id, material_id)</code></td>
        <td>CHECK (score BETWEEN 1 AND 5). Prevents duplicate student ratings per material.</td>
      </tr>
      <tr>
        <td><code>search_logs</code></td>
        <td><code>id (UUID PK)</code><br><code>user_id</code>, <code>query</code><br><code>filters</code>, <code>created_at</code></td>
        <td>FK &rarr; <code>profiles(id)</code><br>Index on <code>(user_id, created_at)</code></td>
        <td>Logs search inquiries for user context and Section 5.6 Report 1 and 3.</td>
      </tr>
      <tr>
        <td><code>recommendations</code></td>
        <td><code>id (UUID PK)</code><br><code>user_id</code>, <code>material_id</code><br><code>score</code>, <code>reason</code></td>
        <td>FK &rarr; <code>profiles(id)</code><br>FK &rarr; <code>materials(id)</code></td>
        <td>Persists Top-10 generated AI recommendations for Section 5.6 Report 2.</td>
      </tr>
    </tbody>
  </table>

  <h3 class="sub-sec-heading">4.4.2 Database Triggers for Atomic Rating Recalculation</h3>
  <p class="body-p">
    To guarantee transactional consistency and prevent API race conditions, average star ratings are maintained by a PostgreSQL trigger function attached to the <code>ratings</code> table:
  </p>

  <div class="code-listing-box">
<pre>
CREATE OR REPLACE FUNCTION public.refresh_material_rating()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  target_mat_id UUID;
  new_avg NUMERIC(3,2);
  new_count INTEGER;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_mat_id := OLD.material_id;
  ELSE
    target_mat_id := NEW.material_id;
  END IF;

  SELECT COALESCE(ROUND(AVG(score), 2), 0.00), COUNT(*)
  INTO new_avg, new_count
  FROM public.ratings
  WHERE material_id = target_mat_id;

  UPDATE public.materials
  SET average_rating = new_avg,
      rating_count = new_count,
      updated_at = NOW()
  WHERE id = target_mat_id;

  RETURN NULL;
END;
$$;

CREATE TRIGGER ratings_refresh_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.ratings
FOR EACH ROW EXECUTE FUNCTION public.refresh_material_rating();
</pre>
  </div>

  <h3 class="sub-sec-heading">4.4.3 PostgreSQL Row-Level Security (RLS) Policies</h3>
  <p class="body-p">
    Table 4.3 details the Row-Level Security policies enforced at the database engine level:
  </p>

  <table class="academic-table">
    <thead>
      <tr>
        <th style="width: 18%;">Table</th>
        <th style="width: 22%;">Policy Name</th>
        <th style="width: 15%;">Command</th>
        <th style="width: 45%;">Security Condition (USING / WITH CHECK Expression)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>materials</code></td>
        <td>Allow public catalog reads</td>
        <td>SELECT</td>
        <td><code>approval_status = 'approved' OR auth.role() = 'authenticated'</code></td>
      </tr>
      <tr>
        <td><code>materials</code></td>
        <td>Admin full catalog control</td>
        <td>ALL</td>
        <td><code>public.has_role(auth.uid(), 'admin')</code></td>
      </tr>
      <tr>
        <td><code>profiles</code></td>
        <td>Users view own profile</td>
        <td>SELECT</td>
        <td><code>auth.uid() = id OR public.has_role(auth.uid(), 'admin')</code></td>
      </tr>
      <tr>
        <td><code>profiles</code></td>
        <td>Users update own profile</td>
        <td>UPDATE</td>
        <td><code>auth.uid() = id</code></td>
      </tr>
      <tr>
        <td><code>ratings</code></td>
        <td>Public read ratings</td>
        <td>SELECT</td>
        <td><code>true</code></td>
      </tr>
      <tr>
        <td><code>ratings</code></td>
        <td>Users author own ratings</td>
        <td>INSERT / UPDATE</td>
        <td><code>auth.uid() = user_id</code></td>
      </tr>
      <tr>
        <td><code>search_logs</code></td>
        <td>Users manage search logs</td>
        <td>ALL</td>
        <td><code>auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')</code></td>
      </tr>
    </tbody>
  </table>

  <h2 class="sec-heading">4.5 Procedural Logic and Sequence Modeling</h2>

  <p class="body-p">
    Figure 4.5 details the UML Sequence Diagram modeling the chronological execution of search inquiry, TF-IDF calculation, and recommendation rendering:
  </p>

  <div class="ascii-diagram-box">
<pre>
========================================================================================
     FIGURE 4.5: UML SEQUENCE DIAGRAM (SEARCH &amp; RECOMMENDATION JOURNEY)
========================================================================================

  Student (Browser)           Server Function (Nitro)             PostgreSQL DB
         |                               |                              |
         | 1. Submit Search Inquiry      |                              |
         |------------------------------&gt;|                              |
         |                               | 2. Full-Text SQL Query       |
         |                               |-----------------------------&gt;|
         |                               |                              |
         |                               | 3. Return Matching Materials |
         |                               |&lt;-----------------------------|
         |                               |                              |
         |                               | 4. Log Search Query          |
         |                               |-----------------------------&gt;|
         |                               |                              |
         | 5. Render Search Results      |                              |
         |&lt;------------------------------|                              |
         |                               |                              |
         | 6. Request Recommendations    |                              |
         |------------------------------&gt;|                              |
         |                               | 7. Query Enrolled &amp; Ratings  |
         |                               |-----------------------------&gt;|
         |                               |                              |
         |                               | 8. Return Profile &amp; Matrix   |
         |                               |&lt;-----------------------------|
         |                               |                              |
         |                               | 9. Compute TF-IDF &amp; Cosine   |
         |                               |    (Vector Space Math)       |
         |                               |                              |
         |                               | 10. Synthesize Hybrid Scores |
         |                               |     and Explainability Tags  |
         |                               |                              |
         |                               | 11. Persist Top-10 Items     |
         |                               |-----------------------------&gt;|
         |                               |                              |
         | 12. Deliver Recommended Feed  |                              |
         |&lt;------------------------------|                              |
</pre>
  </div>
</div>
`;
