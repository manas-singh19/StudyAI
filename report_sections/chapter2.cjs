module.exports = `
<!-- ==================== CHAPTER 2: SYSTEM REQUIREMENT SPECIFICATIONS (SRS) ==================== -->
<div class="chapter-container">
  <div class="chapter-header">
    <div class="chapter-number">CHAPTER 2</div>
    <h1 class="chapter-title">SYSTEM REQUIREMENT SPECIFICATIONS (SRS)</h1>
  </div>

  <h2 class="sec-heading">2.1 Overall Product Perspective and System Context</h2>

  <p class="body-p">
    The <b>StudyFlow AI</b> system is conceptualized as an autonomous, web-based educational retrieval and recommendation platform. Rather than operating as an isolated client-side utility, it functions as a modern distributed three-tier system comprising a reactive Presentation Layer (React 19), an isomorphic Server Layer (TanStack Start with Nitro SSR), and a secure Database Management Layer (Supabase PostgreSQL with Row-Level Security).
  </p>

  <p class="body-p">
    The software interfaces directly with academic learners across heterogeneous computing devices (desktop workstations, laptops, and tablet computers) via standard modern web browsers. It provides real-time access to a curated repository of computing study materials, maintaining persistent tracking of student search inquiries, viewing behaviors, and peer evaluations.
  </p>

  <h2 class="sec-heading">2.2 User Classes and Characteristics</h2>

  <p class="body-p">
    The system recognizes three distinct user roles, each possessing specific permissions, interface layouts, and operational workflows:
  </p>

  <div class="user-role-card">
    <div class="role-badge student">ROLE 1: STUDENT / LEARNER</div>
    <div class="role-desc">
      <b>Profile:</b> Undergraduate computer science students (primarily BCA, B.Sc. IT, and B.Tech learners) seeking structured, syllabus-aligned study resources.
      <br><b>Technical Competence:</b> Basic computer literacy, familiar with web navigation and search queries.
      <br><b>System Capabilities:</b> Register account, maintain profile, enroll in academic subjects, perform full-text catalog searches, view and download study materials, receive personalized AI recommendations, submit 1&ndash;5 star ratings and written reviews, and track personal search history.
    </div>
  </div>

  <div class="user-role-card">
    <div class="role-badge educator">ROLE 2: EDUCATOR / CONTENT CONTRIBUTOR</div>
    <div class="role-desc">
      <b>Profile:</b> College lecturers, instructors, teaching assistants, or senior student scholars who author or curate educational materials.
      <br><b>Technical Competence:</b> Intermediate to advanced technical proficiency.
      <br><b>System Capabilities:</b> Submit educator verification requests, upload new study materials (lecture notes, slide decks, reference books), organize materials into curated &ldquo;Study Packs&rdquo;, and monitor engagement metrics for their published resources.
    </div>
  </div>

  <div class="user-role-card">
    <div class="role-badge admin">ROLE 3: SYSTEM ADMINISTRATOR</div>
    <div class="role-desc">
      <b>Profile:</b> Department heads, computer science academic coordinators, or institutional IT administrators responsible for catalog governance.
      <br><b>Technical Competence:</b> High technical competence in software administration and data analysis.
      <br><b>System Capabilities:</b> Full CRUD operations over subjects and materials, moderation of pending material approval queues, educator role assignment, review of system security logs, and generation of the comprehensive 5-part administrative analytics reports.
    </div>
  </div>

  <h2 class="sec-heading">2.3 Functional Requirements Specification</h2>

  <p class="body-p">
    The functional capabilities of the system are systematically decomposed into fifteen core Functional Requirements (FR-01 through FR-15). Table 2.1 provides the formal Functional Requirements Traceability Matrix:
  </p>

  <table class="academic-table">
    <thead>
      <tr>
        <th style="width: 10%;">Req ID</th>
        <th style="width: 25%;">Requirement Name</th>
        <th style="width: 45%;">Functional Description</th>
        <th style="width: 10%;">Priority</th>
        <th style="width: 10%;">Module</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>FR-01</b></td>
        <td>User Registration</td>
        <td>System must allow prospective students and educators to register using a valid email address and password with instant client and server validation.</td>
        <td>High</td>
        <td>Auth (P1)</td>
      </tr>
      <tr>
        <td><b>FR-02</b></td>
        <td>Secure Authentication</td>
        <td>System must authenticate user credentials against bcrypt-hashed passwords, issue secure session tokens, and enforce session expiration policies.</td>
        <td>High</td>
        <td>Auth (P1)</td>
      </tr>
      <tr>
        <td><b>FR-03</b></td>
        <td>Profile Management</td>
        <td>Students must be able to view and edit profile details, select their current degree semester, and update enrolled academic subjects.</td>
        <td>Medium</td>
        <td>Profile</td>
      </tr>
      <tr>
        <td><b>FR-04</b></td>
        <td>Server Full-Text Search</td>
        <td>System must provide server-side full-text search querying material titles, descriptions, and topical keywords with sub-second execution.</td>
        <td>High</td>
        <td>Search (P2)</td>
      </tr>
      <tr>
        <td><b>FR-05</b></td>
        <td>Multi-Facet Filtering</td>
        <td>Users must be able to filter search results by Academic Subject, Material Format (Notes, Books, Slides, Papers), and Academic Difficulty Level.</td>
        <td>High</td>
        <td>Search (P2)</td>
      </tr>
      <tr>
        <td><b>FR-06</b></td>
        <td>Content-Based Filtering</td>
        <td>Recommendation engine must tokenize queries and catalog texts, compute smooth IDF weights, and calculate Cosine Similarity across document vectors.</td>
        <td>High</td>
        <td>AI Engine (P3)</td>
      </tr>
      <tr>
        <td><b>FR-07</b></td>
        <td>Collaborative Filtering</td>
        <td>Engine must construct a user-item rating matrix and compute inter-student similarity to predict ratings for unviewed materials.</td>
        <td>High</td>
        <td>AI Engine (P3)</td>
      </tr>
      <tr>
        <td><b>FR-08</b></td>
        <td>Hybrid Score Blending</td>
        <td>System must combine content relevance (50%), collaborative preference (25%), enrolled subject fit (15%), and rating (10%) into a unified score.</td>
        <td>High</td>
        <td>AI Engine (P3)</td>
      </tr>
      <tr>
        <td><b>FR-09</b></td>
        <td>Transparent Explainability</td>
        <td>Every recommendation must be accompanied by an explainable human-readable justification detailing why the resource was selected.</td>
        <td>High</td>
        <td>AI Engine (P3)</td>
      </tr>
      <tr>
        <td><b>FR-10</b></td>
        <td>Material Viewing &amp; Logging</td>
        <td>When a user views a material, the system must log the interaction into the <code>material_views</code> table and increment the item view count.</td>
        <td>Medium</td>
        <td>Catalog</td>
      </tr>
      <tr>
        <td><b>FR-11</b></td>
        <td>Rating &amp; Review Submission</td>
        <td>Authenticated students must be able to rate any material from 1 to 5 stars and submit an optional written review.</td>
        <td>High</td>
        <td>Rating (P5)</td>
      </tr>
      <tr>
        <td><b>FR-12</b></td>
        <td>Atomic Score Recalculation</td>
        <td>Database triggers must immediately recalculate <code>average_rating</code> and <code>rating_count</code> on the parent material upon rating change.</td>
        <td>High</td>
        <td>Database (D3)</td>
      </tr>
      <tr>
        <td><b>FR-13</b></td>
        <td>Admin Material Management</td>
        <td>Administrators must have full capability to create, read, update, delete (CRUD), and moderate pending study materials.</td>
        <td>High</td>
        <td>Admin (P4)</td>
      </tr>
      <tr>
        <td><b>FR-14</b></td>
        <td>Admin Subject Management</td>
        <td>Administrators must be able to add, modify, and manage academic subjects and curriculum disciplines.</td>
        <td>Medium</td>
        <td>Admin (P4)</td>
      </tr>
      <tr>
        <td><b>FR-15</b></td>
        <td>5-Part Section 5.6 Reports</td>
        <td>System must generate all five prescribed admin reports (Student Activity, Most-Recommended, Subject Popularity, Rating Summary, System Usage).</td>
        <td>High</td>
        <td>Reports (P6)</td>
      </tr>
    </tbody>
  </table>

  <h2 class="sec-heading">2.4 Non-Functional Requirements Specification</h2>

  <p class="body-p">
    Non-functional requirements specify qualitative benchmarks and architectural constraints that guarantee enterprise-readiness:
  </p>

  <h3 class="sub-sec-heading">2.4.1 Performance Requirements</h3>
  <ul class="body-ul">
    <li><b>Search Latency:</b> Server-side full-text search queries across the catalog must execute and render in under 500 milliseconds under standard network conditions.</li>
    <li><b>Recommendation Compute Time:</b> The complete hybrid recommendation pipeline (token extraction, TF-IDF vector projection, collaborative score calculation, and top-10 ranking) must execute in under 50 milliseconds.</li>
    <li><b>Initial Page Load:</b> Thanks to TanStack Start SSR pre-rendering, First Contentful Paint (FCP) must occur within 800 milliseconds.</li>
  </ul>

  <h3 class="sub-sec-heading">2.4.2 Security Requirements</h3>
  <ul class="body-ul">
    <li><b>Password Security:</b> All user passwords must be hashed using bcrypt with a minimum work factor of 10 prior to database persistence; plain text passwords must never be stored or logged.</li>
    <li><b>Row-Level Security (RLS):</b> PostgreSQL RLS policies must strictly isolate student private data. Students may only read or mutate their own profiles, search history, and ratings.</li>
    <li><b>Defense in Depth:</b> All database queries must be executed via parameterized statements or ORM interfaces, completely eliminating Structured Query Language (SQL) injection vulnerabilities.</li>
    <li><b>Cross-Site Scripting (XSS) Mitigation:</b> React's automatic virtual DOM escaping guarantees that user-submitted reviews and queries are rendered safely without script execution risks.</li>
  </ul>

  <h3 class="sub-sec-heading">2.4.3 Reliability and Fault Tolerance</h3>
  <ul class="body-ul">
    <li><b>Transactional ACID Compliance:</b> All catalog modifications and rating submissions are executed under strict ACID guarantees within PostgreSQL.</li>
    <li><b>Cold-Start Fallback:</b> In scenarios where a newly registered student has zero search or rating history, the recommendation engine must gracefully fall back to popularity-weighted subject curation without crashing.</li>
  </ul>

  <h3 class="sub-sec-heading">2.4.4 Usability and Accessibility</h3>
  <ul class="body-ul">
    <li><b>Responsive Layout:</b> The interface must adapt dynamically to screen viewports ranging from 360px (smartphones) to 4K desktop displays.</li>
    <li><b>Visual Feedback:</b> All user actions (form submissions, ratings, searches) must provide immediate visual feedback via loading states, toasts, or optimistic UI updates.</li>
  </ul>

  <h2 class="sec-heading">2.5 Software and Hardware Requirements</h2>

  <p class="body-p">
    Table 2.2 specifies the operational hardware and software boundaries for deploying and accessing StudyFlow AI:
  </p>

  <table class="academic-table">
    <thead>
      <tr>
        <th style="width: 25%;">Dimension</th>
        <th style="width: 35%;">Client-Side Requirements (User)</th>
        <th style="width: 40%;">Server-Side Requirements (Host)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Processor (CPU)</b></td>
        <td>Dual-Core 1.5 GHz or higher (x86/x64/ARM)</td>
        <td>Quad-Core 2.4 GHz or higher (Cloud VM / Dedicated)</td>
      </tr>
      <tr>
        <td><b>Memory (RAM)</b></td>
        <td>Minimum 2 GB RAM (4 GB recommended)</td>
        <td>Minimum 4 GB RAM (8 GB recommended for production)</td>
      </tr>
      <tr>
        <td><b>Storage Space</b></td>
        <td>100 MB free browser cache space</td>
        <td>20 GB SSD storage for application and database</td>
      </tr>
      <tr>
        <td><b>Operating System</b></td>
        <td>Windows 10/11, macOS, Linux, Android, iOS</td>
        <td>Ubuntu Server 22.04 LTS / Windows Server 2022</td>
      </tr>
      <tr>
        <td><b>Runtime / Engine</b></td>
        <td>Modern HTML5 Web Browser (Chrome, Edge, Firefox)</td>
        <td>Node.js (v18.0.0+) / Nitro SSR Runtime</td>
      </tr>
      <tr>
        <td><b>Network</b></td>
        <td>Standard Broadband / 4G Internet Connection</td>
        <td>High-speed internet with static IP / domain TLS</td>
      </tr>
    </tbody>
  </table>

  <h2 class="sec-heading">2.6 Use Case Modeling and Detailed Specifications</h2>

  <p class="body-p">
    To formalize behavioral interactions between system actors and functional boundaries, eight core Use Cases (UC-01 through UC-08) were engineered. Figure 2.1 illustrates the Use Case diagram:
  </p>

  <div class="ascii-diagram-box">
<pre>
========================================================================================
                     FIGURE 2.1: SYSTEM USE CASE DIAGRAM
========================================================================================

       +-------------------------------------------------------------------+
       |                 StudyFlow AI (System Boundary)                    |
       |                                                                   |
       |     ( UC-01: Register & Authenticate ) &lt;----------------+         |
       |                                                          |         |
       |     ( UC-02: Manage Academic Profile )                   |         |
       |                                                          |         |
       |     ( UC-03: Search Catalog Materials ) &lt;--+             |         |
       |                                            |             |         |
       |     ( UC-04: Generate AI Recommendations ) |             |         |
       |                                            |             |         |
[ Student ]                                         |        [ Educator ]   |
   |   |     ( UC-05: Rate & Review Material )      |             |         |
   |   |                                            |             |         |
   |   +---&gt; ( UC-06: Upload & Curate Materials ) &lt;--+-------------+         |
   |                                                                        |
   |         ( UC-07: Moderate Approval Queue ) &lt;------------------+        |
   |                                                               |        |
   +-------&gt; ( UC-08: View Administrative Reports ) &lt;--------------+ [ Admin ]
       +-------------------------------------------------------------------+
</pre>
  </div>

  <h3 class="sub-sec-heading">Detailed Use Case Specification: UC-04 (Generate AI Recommendations)</h3>
  <div class="usecase-detail-box">
    <table>
      <tr><td style="width: 25%; font-weight: 600;">Use Case ID:</td><td>UC-04</td></tr>
      <tr><td style="font-weight: 600;">Use Case Name:</td><td>Generate AI-Powered Study Recommendations</td></tr>
      <tr><td style="font-weight: 600;">Primary Actor:</td><td>Student (Authenticated)</td></tr>
      <tr><td style="font-weight: 600;">Preconditions:</td><td>Student is logged in and has an active profile with enrolled academic subjects.</td></tr>
      <tr><td style="font-weight: 600;">Main Success Scenario:</td><td>
        1. Student navigates to the Recommendations page.<br>
        2. System queries student profile, enrolled subjects, and recent search logs from D1.<br>
        3. P3.2 Keyword Extractor extracts and normalizes query tokens.<br>
        4. P3.3 Content Filter computes TF-IDF vectors for catalog items and calculates Cosine Similarity.<br>
        5. P3.4 Collaborative Filter computes predicted peer ratings from D3.<br>
        6. P3.5 Score Aggregator blends scores and generates human-readable explainability strings.<br>
        7. System persists Top-10 recommendations to D4 and displays cards to the student.
      </td></tr>
      <tr><td style="font-weight: 600;">Alternative Flow:</td><td>If student has no search history, system uses enrolled subject catalog items weighted by global ratings and popularity (cold-start mitigation).</td></tr>
      <tr><td style="font-weight: 600;">Postconditions:</td><td>Student receives personalized, explainable Top-10 study resources.</td></tr>
    </table>
  </div>
</div>
`;
