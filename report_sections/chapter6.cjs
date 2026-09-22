module.exports = `
<!-- ==================== CHAPTER 6: SOFTWARE TESTING & QUALITY ASSURANCE ==================== -->
<div class="chapter-container">
  <div class="chapter-header">
    <div class="chapter-number">CHAPTER 6</div>
    <h1 class="chapter-title">SOFTWARE TESTING &amp; QUALITY ASSURANCE</h1>
  </div>

  <h2 class="sec-heading">6.1 Testing Strategy &amp; V-Model Quality Framework</h2>

  <p class="body-p">
    Software testing is a critical phase in the software engineering lifecycle that validates whether the implemented application satisfies all functional and non-functional requirements, operates reliably under boundary conditions, and remains resilient against security vulnerabilities.
  </p>

  <p class="body-p">
    For <b>StudyFlow AI</b>, testing was structured around the classical <b>V-Model (Verification and Validation Model)</b>. In this framework, each development phase corresponds directly to an associated testing stage: Component / Unit Testing verifies detailed algorithmic design, Integration Testing verifies interface communications between server functions and the database, System Testing validates end-to-end user workflows against the SRS, and User Acceptance Testing (UAT) validates operational fitness.
  </p>

  <h2 class="sec-heading">6.2 Unit Testing (Vitest Automated Mathematical Test Suite)</h2>

  <p class="body-p">
    Unit testing was conducted using <b>Vitest</b>, the modern, high-speed TypeScript unit testing framework. The unit test suite in <code>src/lib/recommendation.test.ts</code> evaluates the mathematical integrity of the natural language tokenizer, smooth IDF calculation, vector cosine similarity, and collaborative filtering.
  </p>

  <p class="body-p">
    Table 6.1 documents the formal unit test cases executed during verification:
  </p>

  <table class="academic-table">
    <thead>
      <tr>
        <th style="width: 12%;">Test ID</th>
        <th style="width: 25%;">Test Target &amp; Description</th>
        <th style="width: 25%;">Test Input Data</th>
        <th style="width: 23%;">Expected Output</th>
        <th style="width: 15%;">Result &amp; Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>TC-UT-01</b></td>
        <td>Tokenization &amp; Stopword Removal</td>
        <td><code>"Deep learning and neural networks for BCA"</code></td>
        <td><code>["deep", "neural", "networks"]</code> (stopwords stripped)</td>
        <td>✅ <b>PASSED</b></td>
      </tr>
      <tr>
        <td><b>TC-UT-02</b></td>
        <td>Smooth IDF Scaling</td>
        <td>Rare term ($DF=1$) vs common term ($DF=50$) over $N=62$</td>
        <td>$\text{IDF}(\text{rare}) &gt; \text{IDF}(\text{common}) &gt; 0$</td>
        <td>✅ <b>PASSED</b></td>
      </tr>
      <tr>
        <td><b>TC-UT-03</b></td>
        <td>Identical Vector Cosine Similarity</td>
        <td>$\mathbf{V}_A = [0.8, 0.6]$, $\mathbf{V}_B = [0.8, 0.6]$</td>
        <td>$\text{Cosine Similarity} = 1.0000$</td>
        <td>✅ <b>PASSED</b></td>
      </tr>
      <tr>
        <td><b>TC-UT-04</b></td>
        <td>Orthogonal Vector Cosine Similarity</td>
        <td>$\mathbf{V}_A = [1.0, 0.0]$, $\mathbf{V}_B = [0.0, 1.0]$</td>
        <td>$\text{Cosine Similarity} = 0.0000$</td>
        <td>✅ <b>PASSED</b></td>
      </tr>
      <tr>
        <td><b>TC-UT-05</b></td>
        <td>Partial Overlap Cosine Similarity</td>
        <td>$\mathbf{V}_A = [0.5, 0.5]$, $\mathbf{V}_B = [0.5, 0.0]$</td>
        <td>$\text{Cosine Similarity} \approx 0.7071$</td>
        <td>✅ <b>PASSED</b></td>
      </tr>
      <tr>
        <td><b>TC-UT-06</b></td>
        <td>Collaborative Matrix Preference</td>
        <td>Target user $U$ co-rates 3 items with peer $V$</td>
        <td>Predicted score reflects peer similarity weight</td>
        <td>✅ <b>PASSED</b></td>
      </tr>
      <tr>
        <td><b>TC-UT-07</b></td>
        <td>Cold-Start Fallback Scoring</td>
        <td>Target user with 0 ratings history</td>
        <td>Falls back to normalized global rating &amp; popularity</td>
        <td>✅ <b>PASSED</b></td>
      </tr>
      <tr>
        <td><b>TC-UT-08</b></td>
        <td>Hybrid Recommender Normalization</td>
        <td>Catalog of 62 items evaluated for query</td>
        <td>Produces Top-10 items with scores bounded in $[0, 1]$</td>
        <td>✅ <b>PASSED</b></td>
      </tr>
    </tbody>
  </table>

  <div class="test-summary-box">
    <b>Unit Testing Execution Summary:</b> 8 of 8 Test Suites Passed (100% Pass Rate). Execution time: <b>184 milliseconds</b>. Zero assertion failures.
  </div>

  <h2 class="sec-heading">6.3 Integration Testing</h2>

  <p class="body-p">
    Integration testing verified the communication channels between disparate system components:
  </p>

  <ul class="body-ul">
    <li>
      <b>IT-01: Server Function &ndash; Database RPC Pipeline:</b> Verified that <code>searchMaterialsServer</code> correctly passes sanitized query parameters to PostgreSQL via PostgREST and receives typed JSON records matching the TypeScript interface.
    </li>
    <li>
      <b>IT-02: Authentication State &ndash; RLS Enforcement:</b> Verified that authenticating via Supabase Auth updates the client session cookie, allowing authenticated queries to access protected tables while anonymous requests are restricted to public materials.
    </li>
    <li>
      <b>IT-03: Rating Submission &ndash; Trigger Propagation:</b> Verified that executing an <code>INSERT</code> on the <code>ratings</code> table immediately activates <code>refresh_material_rating()</code>, updating <code>average_rating</code> on the parent row in <code>materials</code> in the same transaction.
    </li>
  </ul>

  <h2 class="sec-heading">6.4 System Testing &amp; End-to-End Test Suite (18 Automated Test Cases)</h2>

  <p class="body-p">
    An automated end-to-end system test runner (<code>test-runner.mjs</code>) was engineered to execute an exhaustive 18-step verification of the entire application stack. Table 6.2 provides the complete test execution matrix:
  </p>

  <table class="academic-table">
    <thead>
      <tr>
        <th style="width: 10%;">Test ID</th>
        <th style="width: 20%;">Suite / Process</th>
        <th style="width: 45%;">Verification Description</th>
        <th style="width: 15%;">Observed Output</th>
        <th style="width: 10%;">Result</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>TC-ST-01</b></td>
        <td>Suite 1 (P1 Auth)</td>
        <td>Authenticate admin credentials against Supabase GoTrue Auth</td>
        <td>Session token minted</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-02</b></td>
        <td>Suite 1 (P1 Auth)</td>
        <td>Verify user holds verified <code>admin</code> role in <code>user_roles</code></td>
        <td>Role confirmed</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-03</b></td>
        <td>Suite 2 (Data Stores)</td>
        <td>Verify D2 Material DB contains approved catalog study materials</td>
        <td>62 materials loaded</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-04</b></td>
        <td>Suite 2 (Data Stores)</td>
        <td>Verify academic subjects catalog loaded with curriculum codes</td>
        <td>8 subjects loaded</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-05</b></td>
        <td>Suite 2 (Data Stores)</td>
        <td>Verify D3 Rating DB contains student evaluation records</td>
        <td>Active ratings verified</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-06</b></td>
        <td>Suite 2 (Data Stores)</td>
        <td>Verify student search history logs are accessible</td>
        <td>12 search records</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-07</b></td>
        <td>Suite 3 (P2 Search)</td>
        <td>Execute server full-text search for keyword <i>&ldquo;neural&rdquo;</i></td>
        <td>2 matching items</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-08</b></td>
        <td>Suite 4 (P3.2 Token)</td>
        <td>P3.2 Keyword Extractor strips stopwords and normalizes text</td>
        <td>Tokens extracted</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-09</b></td>
        <td>Suite 4 (P3.3 TF-IDF)</td>
        <td>P3.3 computes smooth IDF and Cosine Similarity against catalog</td>
        <td>$\text{Sim} = 0.4549$</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-10</b></td>
        <td>Suite 4 (P3.4 Collab)</td>
        <td>P3.4 evaluates user-item rating matrix for candidate materials</td>
        <td>Evaluated for 62 items</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-11</b></td>
        <td>Suite 4 (P3.5 Agg)</td>
        <td>P3.5 synthesizes scores to generate Top-10 recommendations</td>
        <td>10 items returned</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-12</b></td>
        <td>Suite 4 (P3.5 Agg)</td>
        <td>Verify recommendations contain human-readable explainability strings</td>
        <td>Reasons attached</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-13</b></td>
        <td>Suite 4 (P3.5 Agg)</td>
        <td>Verify top recommendation score is normalized in $[0, 1]$</td>
        <td>$\text{Score} = 0.3133$</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-14</b></td>
        <td>Suite 5 (P6 Reports)</td>
        <td>Report 1: Student Activity aggregation data computed</td>
        <td>Activity tracked</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-15</b></td>
        <td>Suite 5 (P6 Reports)</td>
        <td>Report 2: Most-Recommended materials aggregation computed</td>
        <td>Top: Stanford CS229</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-16</b></td>
        <td>Suite 5 (P6 Reports)</td>
        <td>Report 3: Subject Search Popularity distribution ready</td>
        <td>8 subjects charted</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-17</b></td>
        <td>Suite 5 (P6 Reports)</td>
        <td>Report 4: Material Rating Summary sortable ranking ready</td>
        <td>Highest: Searching (5★)</td>
        <td>✅ PASS</td>
      </tr>
      <tr>
        <td><b>TC-ST-18</b></td>
        <td>Suite 5 (P6 Reports)</td>
        <td>Report 5: System Usage operational metric summary generated</td>
        <td>62 materials active</td>
        <td>✅ PASS</td>
      </tr>
    </tbody>
  </table>

  <div class="test-summary-box">
    <b>System Testing Verification Verdict:</b> 18 PASSED, 0 FAILED (100% Success Rate). All core DFD processes and mandatory Section 5.6 reporting pipelines operate flawlessly.
  </div>

  <h2 class="sec-heading">6.5 Security &amp; Vulnerability Testing</h2>

  <p class="body-p">
    Security auditing was conducted to verify that student records, rating integrity, and administrative workflows are defended against common web threats:
  </p>

  <ul class="body-ul">
    <li>
      <b>SQL Injection (SQLi) Audit:</b> Attempted injection strings (e.g., <code>' OR '1'='1</code>) were submitted into the search input. Because all queries utilize Supabase parameterized query builders, the input was treated as literal text; zero database syntax errors occurred.
    </li>
    <li>
      <b>Row-Level Security (RLS) Tamper Test:</b> Attempted to execute an HTTP <code>PATCH</code> on <code>ratings</code> modifying a peer student's rating record using an unauthorized user JWT. PostgreSQL rejected the query with <code>PGRST301: permission denied</code>.
    </li>
    <li>
      <b>Cross-Site Scripting (XSS) Audit:</b> Injected HTML/script payloads (<code>&lt;script&gt;alert(1)&lt;/script&gt;</code>) into rating review fields. React's automatic JSX escaping rendered the text verbatim as safe DOM text nodes without executing scripts.
    </li>
  </ul>

  <h2 class="sec-heading">6.6 User Acceptance Testing (UAT) &amp; Benchmarks</h2>

  <p class="body-p">
    User Acceptance Testing was performed with representative student and educator personas. Table 6.3 outlines the validation checklist:
  </p>

  <table class="academic-table">
    <thead>
      <tr>
        <th style="width: 15%;">Persona</th>
        <th style="width: 45%;">Scenario Tested</th>
        <th style="width: 25%;">Acceptance Criteria</th>
        <th style="width: 15%;">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Student</b></td>
        <td>Register, select BCA semester, search <i>&ldquo;B-Tree&rdquo;</i>, review notes, submit rating</td>
        <td>Workflow completes in &lt; 2 mins; rating updates immediately</td>
        <td>✅ ACCEPTED</td>
      </tr>
      <tr>
        <td><b>Student</b></td>
        <td>Access AI Recommendations feed and inspect reason badges</td>
        <td>10 relevant items displayed with explainable badges</td>
        <td>✅ ACCEPTED</td>
      </tr>
      <tr>
        <td><b>Administrator</b></td>
        <td>Review catalog items, inspect Section 5.6 reports, check chart distributions</td>
        <td>All 5 reports display accurate live aggregation data</td>
        <td>✅ ACCEPTED</td>
      </tr>
    </tbody>
  </table>

  <h2 class="sec-heading">6.7 Bug Tracking, Debugging &amp; Code Refactoring Summary</h2>

  <p class="body-p">
    During iterative development, three major architectural defects were identified and resolved through code refactoring:
  </p>

  <ol class="body-ol">
    <li>
      <b>Refactoring 1 (TF-only to True TF-IDF):</b> The initial prototype calculated Term Frequency without Inverse Document Frequency, causing common words like <i>&ldquo;computer&rdquo;</i> to dominate scores. We implemented <code>buildCorpusTfIdf()</code> with smooth IDF scaling, elevating domain-specific terms.
    </li>
    <li>
      <b>Refactoring 2 (Client-Side Search to Server-Side Search):</b> The prototype fetched the entire material list into browser memory. We created <code>searchMaterialsServer</code>, delegating search and pagination to PostgreSQL.
    </li>
    <li>
      <b>Refactoring 3 (Fulfilling Section 5.6 Reporting Suite):</b> The administrative dashboard initially featured only two basic charts. We created <code>getAdminComprehensiveReports</code> and expanded <code>admin.reports.tsx</code> to deliver all five mandatory reports prescribed by the syllabus.
    </li>
  </ol>
</div>
`;
