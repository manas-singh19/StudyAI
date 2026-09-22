module.exports = `
<!-- ==================== CHAPTER 3: SYSTEM ANALYSIS ==================== -->
<div class="chapter-container">
  <div class="chapter-header">
    <div class="chapter-number">CHAPTER 3</div>
    <h1 class="chapter-title">SYSTEM ANALYSIS</h1>
  </div>

  <h2 class="sec-heading">3.1 Software Development Life Cycle (SDLC) Model</h2>

  <p class="body-p">
    Selecting an appropriate Software Development Life Cycle (SDLC) model is a foundational prerequisite for engineering robust software systems. Traditional software engineering methodologies—most notably the linear sequential <b>Waterfall Model</b>—mandate that each developmental stage (Requirements, Analysis, Design, Coding, Testing, Deployment) must achieve full finality before the subsequent phase commences.
  </p>

  <p class="body-p">
    While the Waterfall model suits projects with rigidly static, unchanging requirements (such as payroll calculators or basic ledger tools), it is fundamentally ill-suited for systems incorporating <b>Machine Learning and Information Retrieval</b>. In recommendation systems engineering, algorithmic models cannot be treated as static code blocks. Mathematical weighting parameters, vector space representations, term-frequency normalization equations, and user similarity thresholds require empirical experimentation, tuning, and iterative refinement.
  </p>

  <p class="body-p">
    Consequently, <b>StudyFlow AI</b> was engineered utilizing the <b>Iterative / Agile SDLC Model</b>. This methodology partitions project development into manageable, time-boxed increments, allowing continuous testing, validation, and algorithmic enhancement. Figure 3.1 illustrates the iterative engineering lifecycle:
  </p>

  <div class="ascii-diagram-box">
<pre>
========================================================================================
             FIGURE 3.1: ITERATIVE / AGILE SDLC METHODOLOGY
========================================================================================

    [ Phase 1: Inception &amp; SRS ]
               |
               v
    +-------------------------------------------------------------------+
    |                 ITERATIVE DEVELOPMENT SPRINTS                     |
    |                                                                   |
    |   Sprint 1: Database Schema, Relational 3NF &amp; RLS Policies        |
    |      |                                                            |
    |      v                                                            |
    |   Sprint 2: Auth Subsystem (P1) &amp; Server-Side Search (P2)         |
    |      |                                                            |
    |      v                                                            |
    |   Sprint 3: AI Vector Space (TF-IDF) &amp; Collaborative Engine (P3)  |
    |      |                                                            |
    |      v                                                            |
    |   Sprint 4: Atomic Rating Triggers (P5) &amp; Material CRUD (P4)       |
    |      |                                                            |
    |      v                                                            |
    |   Sprint 5: Section 5.6 Administrative Analytics Intelligence (P6)|
    +-------------------------------------------------------------------+
               |
               v
    [ Phase 6: System Testing, End-to-End Verification (18/18) &amp; Viva Prep ]
</pre>
  </div>

  <p class="body-p">
    The iterative lifecycle consisted of five tightly coupled phases:
  </p>

  <ol class="body-ol">
    <li>
      <b>Phase 1: Inception &amp; Requirements Analysis:</b> Formulated user stories, identified stakeholder personas, developed DFD Level 0/1/2 diagrams, and established the Functional Requirements Traceability Matrix.
    </li>
    <li>
      <b>Phase 2: Architectural &amp; Database Design:</b> Designed the 3-tier SSR + BaaS architecture, established Third Normal Form (3NF) relational tables in PostgreSQL, configured foreign-key constraints, and authored Row-Level Security (RLS) policies.
    </li>
    <li>
      <b>Phase 3: Core Implementation &amp; Server RPCs:</b> Developed TanStack Start server functions for authentication, subject filtering, and server-side full-text catalog queries.
    </li>
    <li>
      <b>Phase 4: AI Recommender Engine Formulation:</b> Implemented natural language tokenization, smooth Inverse Document Frequency calculation, multi-dimensional Cosine Similarity, and collaborative user-item preference scoring.
    </li>
    <li>
      <b>Phase 5: Verification, Quality Assurance &amp; Reporting:</b> Executed 8 Vitest mathematical unit tests, authored the 18-step end-to-end automated system test runner, and built the Section 5.6 administrative intelligence suite.
    </li>
  </ol>

  <h2 class="sec-heading">3.2 Feasibility Study</h2>

  <p class="body-p">
    A comprehensive feasibility analysis was conducted across five standard dimensions to evaluate operational viability and compliance with IGNOU BCSP-064 guidelines. Table 3.1 summarizes the findings:
  </p>

  <table class="academic-table">
    <thead>
      <tr>
        <th style="width: 20%;">Dimension</th>
        <th style="width: 35%;">Evaluation Criteria</th>
        <th style="width: 45%;">Feasibility Finding &amp; Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Technical Feasibility</b></td>
        <td>Hardware, software, programming languages, and ML algorithms capability.</td>
        <td><b>FEASIBLE:</b> The selected stack (React 19, TypeScript, PostgreSQL, TanStack Start) is mature, stable, and executes high-dimensional vector math in milliseconds.</td>
      </tr>
      <tr>
        <td><b>Operational Feasibility</b></td>
        <td>User acceptance, ease of navigation, and operational workflow.</td>
        <td><b>FEASIBLE:</b> Browser-based responsive client requires zero installation. Students navigate familiar search/feed interfaces, while admins access automated reports.</td>
      </tr>
      <tr>
        <td><b>Economic Feasibility</b></td>
        <td>Cost of development, software licensing, and operational maintenance.</td>
        <td><b>FEASIBLE:</b> 100% of frameworks and libraries utilized (React, TypeScript, Tailwind, Recharts, Vitest) are open-source under permissive MIT licenses. Zero licensing fees.</td>
      </tr>
      <tr>
        <td><b>Schedule Feasibility</b></td>
        <td>Adherence to academic semester timelines and evaluation milestones.</td>
        <td><b>FEASIBLE:</b> Development was completed across five iterative sprints within the designated BCA 6th semester timeline.</td>
      </tr>
      <tr>
        <td><b>Legal &amp; Ethical Feasibility</b></td>
        <td>Data privacy, user data governance, and academic integrity.</td>
        <td><b>FEASIBLE:</b> Uses PostgreSQL RLS to isolate private student records. Open-access study materials comply with Fair Use educational standards.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="sec-heading">3.3 Data Flow Architecture (Structured Systems Analysis)</h2>

  <p class="body-p">
    Structured Systems Analysis &amp; Design (SSAD) employs <b>Data Flow Diagrams (DFDs)</b> to model the transformation of data as it moves through external entities, computational processes, and persistent data repositories. In compliance with IGNOU BCSP-064 syllabus requirements, the system architecture is decomposed across Level 0, Level 1, and Level 2 DFDs.
  </p>

  <h3 class="sub-sec-heading">3.3.1 DFD Level 0: Context Diagram</h3>
  <p class="body-p">
    The Context Diagram represents the highest abstraction level of the system, modeling StudyFlow AI as a single bounded process interacting with two primary external entities: the <b>Student (User)</b> and the <b>Administrator</b>. Figure 3.2 illustrates DFD Level 0:
  </p>

  <div class="ascii-diagram-box">
<pre>
========================================================================================
                      FIGURE 3.2: DFD LEVEL 0 (CONTEXT DIAGRAM)
========================================================================================

                 +-----------------------------------------------+
                 |                STUDENT (USER)                 |
                 +-----------------------------------------------+
                   | Search Query / Credentials       ^ Recommendations /
                   | &amp; Ratings                        | Search Results
                   v                                  |
            +----------------------------------------------------+
            |                                                    |
            |                       ( 0 )                        |
            |         AI STUDY MATERIAL RECOMMENDER              |
            |                 (StudyFlow AI)                     |
            |                                                    |
            +----------------------------------------------------+
                   | Reports / Catalog Stats          ^ Material Uploads /
                   v                                  | Admin Commands
                 +-----------------------------------------------+
                 |                 ADMINISTRATOR                 |
                 +-----------------------------------------------+
</pre>
  </div>

  <p class="body-p">
    <b>Data Flow Interactions in Level 0:</b>
  </p>
  <ul class="body-ul">
    <li><b>Student &rarr; System:</b> Sends authentication credentials, subject enrollment selections, search inquiry strings, and 1&ndash;5 star material evaluations.</li>
    <li><b>System &rarr; Student:</b> Delivers authenticated session tokens, paginated full-text catalog results, personalized AI recommendation cards with explainability justifications, and material viewing streams.</li>
    <li><b>Admin &rarr; System:</b> Submits curriculum subject definitions, creates/updates study material metadata, and issues approval/moderation commands.</li>
    <li><b>System &rarr; Admin:</b> Transmits comprehensive Section 5.6 administrative intelligence reports, system usage metrics, and review queue statuses.</li>
  </ul>

  <h3 class="sub-sec-heading">3.3.2 DFD Level 1: System Process Decomposition</h3>
  <p class="body-p">
    DFD Level 1 decomposes the monolithic context process into six discrete, interacting functional sub-processes (<b>P1 through P6</b>) and four persistent data stores (<b>D1 through D4</b>):
  </p>

  <ul class="body-ul">
    <li><b>P1 (User Registration &amp; Authentication):</b> Validates credentials, hashes passwords, manages sessions, and reads/writes user profiles in <b>D1 (User DB)</b>.</li>
    <li><b>P2 (Subject &amp; Topic Search):</b> Parses search terms, executes server-side queries against <b>D2 (Material DB)</b>, logs user searches into D1, and delivers paginated results.</li>
    <li><b>P3 (AI Recommendation Engine):</b> Aggregates learner history from D1, catalog metadata from D2, and peer evaluations from <b>D3 (Rating DB)</b> to compute ranked recommendations stored in <b>D4 (Recommendations DB)</b>.</li>
    <li><b>P4 (Study Material Management):</b> Provides administrators with full catalog CRUD workflows, persisting verified resources into D2.</li>
    <li><b>P5 (Rating &amp; Review System):</b> Accepts student feedback, inserts reviews into D3, and atomically updates aggregate ratings in D2 via database triggers.</li>
    <li><b>P6 (Reports &amp; Analytics):</b> Queries and aggregates logs, ratings, and recommendations across D1, D2, D3, and D4 to render the five Section 5.6 admin reports.</li>
  </ul>

  <div class="ascii-diagram-box">
<pre>
========================================================================================
                   FIGURE 3.3: DFD LEVEL 1 (PROCESS DECOMPOSITION)
========================================================================================

  [ Student ]                                                         [ Admin ]
     |                                                                    |
     | Credentials             +--------------------+                     |
     +-----------------------&gt; | P1: User Auth      | &lt;-------------------+
     |                         +--------------------+
     |                                |   ^
     |                                v   |
     |                         +--------------------+
     |                         | D1: User DB        |
     |                         +--------------------+
     |                                |
     | Search Query                   v
     +-----------------------&gt; +--------------------+
     |                         | P2: Catalog Search | &lt;---+ Material CRUD
     | &lt;-----------------------+--------------------+     |
     | Search Results                 |   ^               |
     |                                v   |               |
     |                         +--------------------+     |
     |                         | D2: Material DB    | ----+
     |                         +--------------------+
     |                            |           ^
     |                            v           | (Atomic Update)
     |                         +--------------------+
     |                         | D3: Rating DB      | &lt;---+ Rating &amp; Review
     |                         +--------------------+     |
     |                                |                   |
     |                                v                   |
     |                         +--------------------+     |
     | Recommendations         | P3: Recommend Eng  |     |
     | &lt;-----------------------+--------------------+     |
     |                                |                   |
     |                                v                   |
     |                         +--------------------+     |
     |                         | D4: Recommend DB   |     |
     |                         +--------------------+     |
     |                                |                   |
     |                                v                   |
     |                         +--------------------+     |
     | Reports / Analytics     | P6: Reports &amp; Stats| &lt;---+ Request Reports
     +------------------------ |--------------------+
</pre>
  </div>

  <h3 class="sub-sec-heading">3.3.3 DFD Level 2: AI Recommendation Subsystem Decomposition</h3>
  <p class="body-p">
    DFD Level 2 performs an in-depth mathematical decomposition of <b>Process P3 (Recommendation Engine)</b>. It formalizes the five internal sub-processes responsible for generating hybrid, explainable recommendations:
  </p>

  <ol class="body-ol">
    <li>
      <b>P3.1 Profile Analyzer:</b> Queries <b>D1 (User DB)</b> to retrieve the student's active enrolled subjects, recent search history strings, and viewed materials. It synthesizes these attributes into a dynamic <i>User Profile Vector</i>.
    </li>
    <li>
      <b>P3.2 Keyword Extractor:</b> Normalizes raw query strings and document texts by lowercasing, removing special characters and punctuation, and filtering out non-informative English and academic stop-words.
    </li>
    <li>
      <b>P3.3 Content Filter (TF-IDF &amp; Cosine Similarity):</b> Analyzes the entire approved catalog in <b>D2 (Material DB)</b> to compute Document Frequencies ($DF$), calculates smooth Inverse Document Frequencies ($IDF$), constructs term-frequency vectors, and evaluates geometric Cosine Similarity against the student's query vector.
    </li>
    <li>
      <b>P3.4 Collaborative Filter:</b> Evaluates the sparse user-item interaction matrix from <b>D3 (Rating DB)</b>. For any unrated candidate material, it identifies other students who evaluated that item, computes inter-student similarity weights, and predicts expected student satisfaction.
    </li>
    <li>
      <b>P3.5 Score Aggregator &amp; Explainability Generator:</b> Blends the content score (50%), collaborative score (25%), subject fit (15%), and quality score (10%). It sorts candidate items, attaches human-readable reasoning strings, persists the Top-10 items into <b>D4 (Recommendations DB)</b>, and returns them to the student.
    </li>
  </ol>

  <div class="ascii-diagram-box">
<pre>
========================================================================================
             FIGURE 3.4: DFD LEVEL 2 (P3 RECOMMENDATION PIPELINE DECOMPOSITION)
========================================================================================

  [ D1: User DB ]                     [ D2: Material DB ]              [ D3: Rating DB ]
         |                                     |                              |
         v                                     v                              v
  +------------------+                 +------------------+            +------------------+
  | P3.1: Profile    |                 | P3.2: Keyword    |            | P3.4: Collab     |
  | Analyzer         |                 | Extractor        |            | Filter Matrix    |
  +------------------+                 +------------------+            +------------------+
         |                                     |                              |
         | User Profile Vector                 | Normalized Tokens            | Predicted Score
         |                                     v                              |
         |                             +------------------+                   |
         |                             | P3.3: TF-IDF &amp;   |                   |
         |                             | Cosine Engine    |                   |
         |                             +------------------+                   |
         |                                     |                              |
         |                                     | Content Sim Score            |
         v                                     v                              v
  +---------------------------------------------------------------------------------------+
  |                     P3.5: MULTI-CRITERIA SCORE AGGREGATOR                             |
  |   Score = 0.50*Content + 0.25*Collaborative + 0.15*SubjectFit + 0.10*Rating           |
  |   Explainability Rule Engine: Generates human-readable recommendation reasons         |
  +---------------------------------------------------------------------------------------+
                                        |
                 +----------------------+----------------------+
                 |                                             |
                 v                                             v
        [ D4: Recommend DB ]                           [ Student UI Cards ]
        (Persisted Top-10)                             (Ranked Top-10 Feed)
</pre>
  </div>

  <h2 class="sec-heading">3.4 Comprehensive Data Dictionary</h2>

  <p class="body-p">
    A formal Data Dictionary serves as the central authoritative catalog of all data elements, formats, domains, and storage specifications. Table 3.2 defines the primary data elements:
  </p>

  <table class="academic-table">
    <thead>
      <tr>
        <th style="width: 18%;">Entity / Store</th>
        <th style="width: 20%;">Field / Element</th>
        <th style="width: 17%;">Data Type</th>
        <th style="width: 15%;">Constraints</th>
        <th style="width: 30%;">Operational Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td rowspan="4"><b>D1: Profiles<br>(User DB)</b></td>
        <td><code>id</code></td>
        <td>UUID</td>
        <td>PK, Not Null</td>
        <td>Unique user identifier linked to Supabase Auth.</td>
      </tr>
      <tr>
        <td><code>full_name</code></td>
        <td>VARCHAR(255)</td>
        <td>Nullable</td>
        <td>Full legal name of the registered student/educator.</td>
      </tr>
      <tr>
        <td><code>enrolled_subjects</code></td>
        <td>TEXT[]</td>
        <td>Default '{}'</td>
        <td>Array of Subject IDs representing active curriculum enrollments.</td>
      </tr>
      <tr>
        <td><code>created_at</code></td>
        <td>TIMESTAMPTZ</td>
        <td>DEFAULT now()</td>
        <td>Timestamp of student account creation.</td>
      </tr>

      <tr>
        <td rowspan="6"><b>D2: Materials<br>(Material DB)</b></td>
        <td><code>id</code></td>
        <td>UUID</td>
        <td>PK, Not Null</td>
        <td>Unique study material identifier.</td>
      </tr>
      <tr>
        <td><code>title</code></td>
        <td>VARCHAR(255)</td>
        <td>Not Null</td>
        <td>Academic title of the learning object.</td>
      </tr>
      <tr>
        <td><code>description</code></td>
        <td>TEXT</td>
        <td>Nullable</td>
        <td>Detailed abstract and topic summary utilized in TF-IDF.</td>
      </tr>
      <tr>
        <td><code>subject_id</code></td>
        <td>UUID</td>
        <td>FK &rarr; subjects</td>
        <td>Foreign key referencing parent academic subject.</td>
      </tr>
      <tr>
        <td><code>average_rating</code></td>
        <td>DECIMAL(3,2)</td>
        <td>DEFAULT 0.00</td>
        <td>Atomic aggregate star score (1.00 to 5.00).</td>
      </tr>
      <tr>
        <td><code>rating_count</code></td>
        <td>INTEGER</td>
        <td>DEFAULT 0</td>
        <td>Total count of student reviews submitted.</td>
      </tr>

      <tr>
        <td rowspan="4"><b>D3: Ratings<br>(Rating DB)</b></td>
        <td><code>id</code></td>
        <td>UUID</td>
        <td>PK, Not Null</td>
        <td>Unique rating record identifier.</td>
      </tr>
      <tr>
        <td><code>user_id</code></td>
        <td>UUID</td>
        <td>FK &rarr; profiles</td>
        <td>Student authoring the review.</td>
      </tr>
      <tr>
        <td><code>material_id</code></td>
        <td>UUID</td>
        <td>FK &rarr; materials</td>
        <td>Study material being evaluated.</td>
      </tr>
      <tr>
        <td><code>score</code></td>
        <td>INTEGER</td>
        <td>CHECK (1..5)</td>
        <td>Integer evaluation score from 1 (poor) to 5 (excellent).</td>
      </tr>

      <tr>
        <td rowspan="4"><b>D4: Recommendations<br>(Recommend DB)</b></td>
        <td><code>id</code></td>
        <td>UUID</td>
        <td>PK, Not Null</td>
        <td>Unique recommendation record identifier.</td>
      </tr>
      <tr>
        <td><code>user_id</code></td>
        <td>UUID</td>
        <td>FK &rarr; profiles</td>
        <td>Target student receiving the recommendation.</td>
      </tr>
      <tr>
        <td><code>material_id</code></td>
        <td>UUID</td>
        <td>FK &rarr; materials</td>
        <td>Recommended learning resource.</td>
      </tr>
      <tr>
        <td><code>score</code></td>
        <td>DECIMAL(5,4)</td>
        <td>CHECK (0..1)</td>
        <td>Normalized hybrid score synthesized by P3.5.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="sec-heading">3.5 Entity-Relationship (E-R) Diagram</h2>

  <p class="body-p">
    Conceptual data modeling requires mapping real-world educational entities and their structural associations. Figure 3.5 presents the formal Entity-Relationship (E-R) diagram illustrating entity attributes, primary keys (PK), foreign keys (FK), and cardinality mappings:
  </p>

  <div class="ascii-diagram-box">
<pre>
========================================================================================
                  FIGURE 3.5: ENTITY-RELATIONSHIP (E-R) DIAGRAM
========================================================================================

  +-----------------------+              1 : N             +-----------------------+
  |       SUBJECTS        | &lt;----------------------------&gt; |       MATERIALS       |
  +-----------------------+                                +-----------------------+
  | PK  id                |                                | PK  id                |
  |     name              |                                |     title             |
  |     code              |                                |     description       |
  |     semester          |                                | FK  subject_id        |
  +-----------------------+                                |     format, url       |
                                                           |     average_rating    |
                                                           |     rating_count      |
                                                           +-----------------------+
                                                                       ^
                                                                       | 1 : N
                                                                       v
  +-----------------------+              1 : N             +-----------------------+
  |       PROFILES        | &lt;----------------------------&gt; |        RATINGS        |
  +-----------------------+                                +-----------------------+
  | PK  id (auth.uid)     |                                | PK  id                |
  |     full_name         |                                | FK  user_id           |
  |     enrolled_subjects |                                | FK  material_id       |
  |     created_at        |                                |     score (1..5)      |
  +-----------------------+                                |     review_text       |
      ^               ^                                    +-----------------------+
      | 1 : N         | 1 : N                                          
      v               v                                                
  +---------------+  +-------------------+                             
  |  SEARCH_LOGS  |  |  RECOMMENDATIONS  |                             
  +---------------+  +-------------------+                             
  | PK  id        |  | PK  id            |                             
  | FK  user_id   |  | FK  user_id       |                             
  |     query     |  | FK  material_id   |                             
  |     filters   |  |     score (0..1)  |                             
  |     created_at|  |     created_at    |                             
  +---------------+  +-------------------+                             
</pre>
  </div>

  <p class="body-p">
    <b>Cardinality &amp; Relationship Rules:</b>
  </p>
  <ul class="body-ul">
    <li><b>Subject &ndash; Material (1 : N):</b> A single academic subject (e.g., <i>Data Structures</i>) encompasses zero or many study materials. Each study material belongs to exactly one parent academic subject.</li>
    <li><b>Profile &ndash; Rating (1 : N):</b> A registered student may author zero or many material reviews. Each rating is authored by exactly one student.</li>
    <li><b>Material &ndash; Rating (1 : N):</b> A study material may accumulate multiple ratings. A unique constraint ensures that a student can rate a specific material at most once.</li>
    <li><b>Profile &ndash; Recommendation (1 : N):</b> A student receives multiple recommended materials. Each recommendation entry links a specific student to a recommended material with its calculated hybrid score.</li>
  </ul>
</div>
`;
