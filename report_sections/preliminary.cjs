module.exports = `
<!-- ==================== PRELIMINARY PAGES ==================== -->

<!-- COVER PAGE (OUTER COVER FOR HARD BOUND BINDING) -->
<div class="hardbound-cover">
  <div class="cover-inner-border">
    <div class="cover-header">
      <div class="univ-logo-text">INDIRA GANDHI NATIONAL OPEN UNIVERSITY</div>
      <div class="univ-school">SCHOOL OF COMPUTER AND INFORMATION SCIENCES (SOCIS)</div>
      <div class="univ-address">Maidan Garhi, New Delhi &ndash; 110068</div>
    </div>

    <div class="cover-title-box">
      <h1 class="cover-title">AI &ndash; POWERED STUDY MATERIAL RECOMMENDER</h1>
      <div class="cover-subtitle">A Hybrid Intelligent Recommender System Leveraging TF-IDF Content Filtering and Collaborative Student Preference Modeling</div>
    </div>

    <div class="cover-submission-text">
      A Project Report Submitted to the Indira Gandhi National Open University<br>
      in Partial Fulfillment of the Requirements for the Award of the Degree of<br>
      <b>BACHELOR OF COMPUTER APPLICATIONS (BCA &ndash; Revised Syllabus)</b>
    </div>

    <div class="cover-meta-grid">
      <div class="cover-meta-col left">
        <div class="meta-label">Submitted By:</div>
        <div class="meta-name">SHUBHAM KUMARI</div>
        <div class="meta-detail">Enrollment No: <b>2400625700</b></div>
        <div class="meta-detail">Program: BCA (6th Semester)</div>
        <div class="meta-detail">Course Code: <b>BCSP &ndash; 064</b></div>
      </div>
      <div class="cover-meta-col right">
        <div class="meta-label">Under the Supervision of:</div>
        <div class="meta-name">PROJECT GUIDE</div>
        <div class="meta-detail">Designation: Assistant Professor / Tech Lead</div>
        <div class="meta-detail">Department of Computer Science</div>
        <div class="meta-detail">New Delhi &ndash; India</div>
      </div>
    </div>

    <div class="cover-footer">
      <div class="cover-session">ACADEMIC SESSION 2025 &ndash; 2026</div>
    </div>
  </div>
</div>

<div class="page-break"></div>

<!-- INNER TITLE PAGE -->
<div class="inner-title-page">
  <div class="inner-univ">INDIRA GANDHI NATIONAL OPEN UNIVERSITY</div>
  <div class="inner-school">School of Computer and Information Sciences, Maidan Garhi, New Delhi &ndash; 110068</div>
  
  <div class="inner-spacer"></div>

  <h2 class="inner-report-title">AI &ndash; POWERED STUDY MATERIAL RECOMMENDER</h2>
  <p class="inner-report-sub">StudyFlow AI: Architectural Design, Algorithmic Formulation, and Full-Stack Implementation of an Intelligent Academic Resource Retrieval System</p>

  <div class="inner-spacer"></div>

  <p class="inner-desc">
    A Project Report submitted in partial fulfillment of the requirements<br>
    for the degree of <b>Bachelor of Computer Applications (BCA)</b><br>
    Course Code: <b>BCSP &ndash; 064 (Major Project &ndash; 8 Credits)</b>
  </p>

  <div class="inner-meta-table-box">
    <table class="inner-table">
      <tr>
        <td class="col-title">Candidate Name:</td>
        <td class="col-val"><b>Shubham Kumari</b></td>
      </tr>
      <tr>
        <td class="col-title">Enrollment Number:</td>
        <td class="col-val"><b>2400625700</b></td>
      </tr>
      <tr>
        <td class="col-title">Study Centre / Regional Centre:</td>
        <td class="col-val">Concerned Regional Centre (IGNOU)</td>
      </tr>
      <tr>
        <td class="col-title">Project Title:</td>
        <td class="col-val">AI &ndash; Powered Study Material Recommender</td>
      </tr>
      <tr>
        <td class="col-title">Project Category:</td>
        <td class="col-val">Artificial Intelligence &amp; Machine Learning / Web Applications</td>
      </tr>
      <tr>
        <td class="col-title">Software Technology Stack:</td>
        <td class="col-val">React 19, TanStack Start (SSR), TypeScript, Supabase PostgreSQL, Recharts, Vitest</td>
      </tr>
      <tr>
        <td class="col-title">Submission Month &amp; Year:</td>
        <td class="col-val">Academic Year 2025 &ndash; 2026</td>
      </tr>
    </table>
  </div>
</div>

<div class="page-break"></div>

<!-- PROFORMA OF BCA PROJECT PROPOSAL (BCSP-064) -->
<div class="section-prelim">
  <div class="proforma-header">
    <div class="p-univ">INDIRA GANDHI NATIONAL OPEN UNIVERSITY</div>
    <div class="p-sub">School of Computer and Information Sciences, Maidan Garhi, New Delhi &ndash; 110 068</div>
    <h3 class="p-title">PROFORMA FOR APPROVAL OF BCA PROJECT PROPOSAL (BCSP &ndash; 064)</h3>
    <div class="p-note">(To be submitted to the Regional Director of the Regional Centre concerned)</div>
  </div>

  <table class="form-table">
    <tr>
      <td style="width: 35%; font-weight: 600;">1. Enrolment No.</td>
      <td style="width: 65%;"><b>2400625700</b></td>
    </tr>
    <tr>
      <td style="font-weight: 600;">2. Regional Centre Code &amp; Name</td>
      <td>Concerned Regional Centre, IGNOU</td>
    </tr>
    <tr>
      <td style="font-weight: 600;">3. Study Centre Code &amp; Name</td>
      <td>Concerned Study Centre, IGNOU</td>
    </tr>
    <tr>
      <td style="font-weight: 600;">4. Candidate Name</td>
      <td><b>SHUBHAM KUMARI</b></td>
    </tr>
    <tr>
      <td style="font-weight: 600;">5. Communication Address</td>
      <td>New Delhi &ndash; 110068, India</td>
    </tr>
    <tr>
      <td style="font-weight: 600;">6. Email &amp; Mobile Number</td>
      <td>kumarishubham177@gmail.com</td>
    </tr>
    <tr>
      <td style="font-weight: 600;">7. Title of the Project</td>
      <td><b>AI &ndash; Powered Study Material Recommender</b></td>
    </tr>
    <tr>
      <td style="font-weight: 600;">8. Category of the Project</td>
      <td>Artificial Intelligence / Machine Learning / Recommender Systems</td>
    </tr>
    <tr>
      <td style="font-weight: 600;">9. Software Tools &amp; Environment</td>
      <td>
        Frontend: React.js (v19), TanStack Start (SSR), TypeScript, Tailwind CSS<br>
        Backend / Server Functions: Nitro Server Engine, Node.js runtime<br>
        Database: Supabase PostgreSQL with Row-Level Security (RLS)<br>
        AI / Recommender Pipeline: TF-IDF, Cosine Similarity, Collaborative Filtering
      </td>
    </tr>
    <tr>
      <td style="font-weight: 600;">10. Name of the Project Guide</td>
      <td>Project Guide (M.Tech / Ph.D. in Computer Science)</td>
    </tr>
    <tr>
      <td style="font-weight: 600;">11. Guide Experience &amp; Designation</td>
      <td>Assistant Professor / Senior Software Engineer (&gt; 5 Years Experience)</td>
    </tr>
    <tr>
      <td style="font-weight: 600;">12. Is the Guide Approved by IGNOU?</td>
      <td>Yes</td>
    </tr>
    <tr>
      <td style="font-weight: 600;">13. Is this Project for any Client?</td>
      <td>Yes (Developed for Academic / Educational Institution Use)</td>
    </tr>
  </table>

  <div class="sig-section" style="margin-top: 30px;">
    <div class="sig-box">
      <div class="sig-line"></div>
      <div class="sig-label">Signature of Student</div>
      <div class="sig-sub">Shubham Kumari<br>Date: _______________</div>
    </div>
    <div class="sig-box right">
      <div class="sig-line"></div>
      <div class="sig-label">Signature of Guide</div>
      <div class="sig-sub">Project Guide<br>Date: _______________</div>
    </div>
  </div>

  <div class="official-use-box" style="margin-top: 25px;">
    <div class="off-title">FOR REGIONAL CENTRE OFFICE USE ONLY</div>
    <div class="off-status">
      Proposal: [ &nbsp; ] <b>APPROVED</b> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; [ &nbsp; ] <b>NOT APPROVED</b>
    </div>
    <div class="off-comments">Comments / Suggestions for Reformulation (if any):<br><br></div>
    <div class="off-sigs">
      <span>Evaluator's Signature: ___________________</span>
      <span style="float: right;">Date: ___________________</span>
    </div>
  </div>
</div>

<div class="page-break"></div>

<!-- CERTIFICATE OF ORIGINALITY -->
<div class="section-prelim">
  <div class="proforma-header">
    <div class="p-univ">INDIRA GANDHI NATIONAL OPEN UNIVERSITY</div>
    <div class="p-sub">School of Computer and Information Sciences, Maidan Garhi, New Delhi &ndash; 110 068</div>
    <h3 class="p-title" style="margin-top: 25px; margin-bottom: 25px;">CERTIFICATE OF ORIGINALITY</h3>
  </div>

  <div class="cert-body">
    <p>
      This is to certify that the project report entitled <b>&ldquo;AI &ndash; POWERED STUDY MATERIAL RECOMMENDER&rdquo;</b> submitted to Indira Gandhi National Open University (IGNOU) in partial fulfillment of the requirement for the award of the degree of <b>BACHELOR OF COMPUTER APPLICATIONS (BCA &ndash; Revised Syllabus)</b> is an authentic, original work carried out by:
    </p>

    <div class="cert-student-highlight">
      <b>Candidate Name:</b> SHUBHAM KUMARI<br>
      <b>Enrolment Number:</b> 2400625700<br>
      <b>Course Code:</b> BCSP &ndash; 064 (Major Project)<br>
      <b>Academic Session:</b> 2025 &ndash; 2026
    </div>

    <p>
      The matter embodied in this project report has not been submitted by the candidate for the award of any other Degree or Diploma of this University or any other Institute / University.
    </p>

    <p>
      To the best of my knowledge and belief, this project work represents a genuine investigation into the application of Term Frequency &ndash; Inverse Document Frequency (TF-IDF), Cosine Similarity, and Collaborative Filtering Recommender Systems within an academic learning environment. All technical assistance and published literature leveraged during the course of the project development have been duly acknowledged.
    </p>
  </div>

  <div class="sig-section" style="margin-top: 60px;">
    <div class="sig-box">
      <div class="sig-line"></div>
      <div class="sig-label">Signature of Student</div>
      <div class="sig-sub">
        <b>Shubham Kumari</b><br>
        Enrolment No: 2400625700<br>
        Date: ____________________<br>
        Place: New Delhi, India
      </div>
    </div>
    <div class="sig-box right">
      <div class="sig-line"></div>
      <div class="sig-label">Signature of Guide</div>
      <div class="sig-sub">
        <b>Project Guide</b><br>
        Name: ____________________<br>
        Designation: ____________________<br>
        Date: ____________________<br>
        Place: New Delhi, India
      </div>
    </div>
  </div>
</div>

<div class="page-break"></div>

<!-- ACKNOWLEDGEMENT -->
<div class="section-prelim">
  <h2 class="prelim-heading">ACKNOWLEDGEMENT</h2>
  
  <p class="prelim-p">
    The successful conceptualization, mathematical formulation, and full-stack development of this Major Project, entitled <b>&ldquo;AI &ndash; Powered Study Material Recommender&rdquo;</b> (Course Code: <b>BCSP &ndash; 064</b>), has been an enriching and intellectually stimulating milestone in my academic journey at Indira Gandhi National Open University (IGNOU).
  </p>

  <p class="prelim-p">
    First and foremost, I express my deepest sense of gratitude and respect to my esteemed <b>Project Guide</b> for invaluable mentorship, constructive criticism, and technical insights throughout the Software Development Life Cycle. Your relentless insistence on mathematical precision in the TF-IDF and collaborative filtering algorithms, rigorous software testing, and robust architectural design pushed this project to professional standards.
  </p>

  <p class="prelim-p">
    I am profoundly thankful to the <b>Faculty Members and Project Coordinators</b> at the <b>School of Computer and Information Sciences (SOCIS), IGNOU, Maidan Garhi, New Delhi</b>, for providing an exhaustive curriculum, clear project formulation guidelines, and academic infrastructure that laid the strong theoretical foundation necessary to execute a project of this magnitude.
  </p>

  <p class="prelim-p">
    I also extend my sincere appreciation to the <b>Regional Director and Staff</b> of the concerned IGNOU Regional Centre for administrative assistance, smooth coordination, and prompt handling of project evaluation requirements.
  </p>

  <p class="prelim-p">
    Lastly, I am forever indebted to my <b>parents, family, and peers</b> whose unwavering encouragement, patience, and moral support provided the constant motivation required to carry this work to its completion.
  </p>

  <div class="ack-sign-box" style="margin-top: 40px; text-align: right;">
    <p><b>Shubham Kumari</b></p>
    <p>Enrollment No.: <b>2400625700</b></p>
    <p>Bachelor of Computer Applications (BCA)</p>
    <p>Indira Gandhi National Open University</p>
  </div>
</div>

<div class="page-break"></div>

<!-- EXECUTIVE SUMMARY / ABSTRACT -->
<div class="section-prelim">
  <h2 class="prelim-heading">EXECUTIVE SUMMARY / ABSTRACT</h2>
  
  <p class="prelim-p">
    In modern digital higher education, undergraduate computer science students are confronted with severe <b>information overload</b>. Standard search engines and public video platforms return millions of unfiltered, unstructured, and often obsolete learning resources. Students spend an inordinate amount of cognitive effort searching for syllabus-aligned materials rather than actually mastering complex computational concepts like algorithms, system architecture, database theory, and artificial intelligence.
  </p>

  <p class="prelim-p">
    To solve this critical challenge, <b>StudyFlow AI (studyAI)</b> was conceptualized, architected, and deployed as an intelligent, centralized academic curation and recommendation system. Developed specifically to fulfill the requirements of <b>IGNOU BCA Major Project BCSP-064</b>, the system unites modern web engineering principles with classical information retrieval (IR) and machine learning (ML) paradigms.
  </p>

  <p class="prelim-p">
    The application is architected around a <b>Hybrid Recommender Engine</b> that mathematically harmonizes two complementary algorithmic pipelines:
  </p>

  <ol class="prelim-ol">
    <li>
      <b>Content-Based Vector Space Model (TF-IDF &amp; Cosine Similarity):</b> The system normalizes the catalog of academic materials, removes domain stopwords, and computes smooth Inverse Document Frequency:
      $$\text{IDF}(t) = \ln\left(\frac{N + 1}{\text{DF}(t) + 1}\right) + 1$$
      Each document and student search intent is projected into a high-dimensional term space, and geometric Cosine Similarity measures semantic relevance length-invariantly.
    </li>
    <li>
      <b>User-Item Collaborative Filtering:</b> The system analyzes historical peer evaluations from the ratings database, constructing a sparse student-material interaction matrix. Pearson-weighted peer similarities predict the utility of unviewed resources for active students.
    </li>
    <li>
      <b>Multi-Criteria Hybrid Aggregator:</b> Recommendations are synthesized using an empirical weighting function:
      $$\text{Score} = 0.50 \cdot S_{\text{Content}} + 0.25 \cdot S_{\text{Collab}} + 0.15 \cdot S_{\text{SubjectFit}} + 0.10 \cdot S_{\text{Rating}}$$
      Top-10 ranked materials are returned along with <b>explainable justifications</b> detailing why each resource was selected.
    </li>
  </ol>

  <p class="prelim-p">
    The software is built with <b>React 19</b> and <b>TanStack Start (Nitro SSR)</b> in <b>TypeScript</b>, ensuring full-stack compile-time type safety. Data persistence, transactional integrity, and Row-Level Security (RLS) are provided by a <b>Supabase PostgreSQL</b> database with automated triggers for atomic rating recalculation. Administrative governance is equipped with all five mandatory reporting views prescribed in Section 5.6 of the approved synopsis.
  </p>

  <p class="prelim-p">
    Comprehensive testing—including automated Vitest unit tests (8/8 passed) and an automated end-to-end test runner (18/18 passed)—demonstrates that StudyFlow AI achieves 100% functional compliance, sub-second query response times, and robust security suitable for enterprise academic deployment.
  </p>
</div>

<div class="page-break"></div>

<!-- TABLE OF CONTENTS -->
<div class="section-prelim">
  <h2 class="prelim-heading">TABLE OF CONTENTS</h2>

  <table class="toc-table">
    <thead>
      <tr>
        <th style="width: 15%;">Chapter</th>
        <th style="width: 73%;">Title / Section Description</th>
        <th style="width: 12%; text-align: right;">Page No.</th>
      </tr>
    </thead>
    <tbody>
      <tr class="toc-major"><td colspan="2"><b>Preliminary Pages</b></td><td></td></tr>
      <tr><td></td><td>Cover Page (Hard-Bound Binding Specification)</td><td class="pg">i</td></tr>
      <tr><td></td><td>Inner Title Page</td><td class="pg">ii</td></tr>
      <tr><td></td><td>Proforma for Approval of BCA Project Proposal (BCSP-064)</td><td class="pg">iii</td></tr>
      <tr><td></td><td>Certificate of Originality</td><td class="pg">iv</td></tr>
      <tr><td></td><td>Acknowledgement</td><td class="pg">v</td></tr>
      <tr><td></td><td>Executive Summary / Abstract</td><td class="pg">vi</td></tr>
      <tr><td></td><td>Table of Contents</td><td class="pg">vii</td></tr>
      <tr><td></td><td>List of Figures &amp; List of Tables</td><td class="pg">ix</td></tr>

      <tr class="toc-major"><td colspan="2"><b>Chapter 1: Introduction &amp; Objectives</b></td><td class="pg">1</td></tr>
      <tr><td>1.1</td><td>Background and Motivation</td><td class="pg">1</td></tr>
      <tr><td>1.2</td><td>Problem Definition &amp; Need for Intelligent Curation</td><td class="pg">3</td></tr>
      <tr><td>1.3</td><td>Project Objectives (Primary and Secondary)</td><td class="pg">4</td></tr>
      <tr><td>1.4</td><td>Project Category (AI / ML &amp; Information Retrieval)</td><td class="pg">6</td></tr>
      <tr><td>1.5</td><td>Tools, Platform, and Development Environment</td><td class="pg">7</td></tr>
      <tr><td>1.6</td><td>Scope and Applicability in Academic Institutions</td><td class="pg">9</td></tr>
      <tr><td>1.7</td><td>Structure and Organization of the Report</td><td class="pg">10</td></tr>

      <tr class="toc-major"><td colspan="2"><b>Chapter 2: System Requirement Specifications (SRS)</b></td><td class="pg">12</td></tr>
      <tr><td>2.1</td><td>Overall Product Perspective and System Context</td><td class="pg">12</td></tr>
      <tr><td>2.2</td><td>User Classes and Characteristics (Student, Educator, Administrator)</td><td class="pg">14</td></tr>
      <tr><td>2.3</td><td>Functional Requirements Specification (FR-01 to FR-15)</td><td class="pg">16</td></tr>
      <tr><td>2.4</td><td>Non-Functional Requirements (Performance, Security, Reliability, Usability)</td><td class="pg">21</td></tr>
      <tr><td>2.5</td><td>Software and Hardware Requirements (Client &amp; Server Infrastructure)</td><td class="pg">24</td></tr>
      <tr><td>2.6</td><td>Use Case Modeling &amp; Detailed Use Case Specifications (UC-01 to UC-08)</td><td class="pg">26</td></tr>

      <tr class="toc-major"><td colspan="2"><b>Chapter 3: System Analysis</b></td><td class="pg">30</td></tr>
      <tr><td>3.1</td><td>Software Development Life Cycle (Iterative / Agile SDLC Model)</td><td class="pg">30</td></tr>
      <tr><td>3.2</td><td>Feasibility Study (Technical, Operational, Economic, Schedule, Legal)</td><td class="pg">33</td></tr>
      <tr><td>3.3</td><td>Data Flow Architecture (Structured Systems Analysis)</td><td class="pg">36</td></tr>
      <tr><td>&nbsp;&nbsp;3.3.1</td><td>DFD Level 0: Context Diagram</td><td class="pg">36</td></tr>
      <tr><td>&nbsp;&nbsp;3.3.2</td><td>DFD Level 1: System Decomposition (P1 to P6, D1 to D4)</td><td class="pg">38</td></tr>
      <tr><td>&nbsp;&nbsp;3.3.3</td><td>DFD Level 2: AI Recommendation Subsystem Decomposition (P3.1 to P3.5)</td><td class="pg">41</td></tr>
      <tr><td>3.4</td><td>Comprehensive Data Dictionary (Entities, Stores, Data Elements)</td><td class="pg">44</td></tr>
      <tr><td>3.5</td><td>Entity-Relationship (E-R) Diagram &amp; Conceptual Data Modeling</td><td class="pg">49</td></tr>
      <tr><td>3.6</td><td>Object-Oriented Domain Model &amp; Class Diagrams</td><td class="pg">52</td></tr>

      <tr class="toc-major"><td colspan="2"><b>Chapter 4: System Design &amp; AI Algorithms</b></td><td class="pg">55</td></tr>
      <tr><td>4.1</td><td>Architectural Design (Modern 3-Tier SSR + BaaS Pattern)</td><td class="pg">55</td></tr>
      <tr><td>4.2</td><td>Modularization Details &amp; Subsystem Decomposition</td><td class="pg">57</td></tr>
      <tr><td>4.3</td><td>Mathematical Formulation of AI &amp; Machine Learning Algorithms</td><td class="pg">59</td></tr>
      <tr><td>&nbsp;&nbsp;4.3.1</td><td>Text Preprocessing, Stopword Elimination &amp; Tokenization</td><td class="pg">59</td></tr>
      <tr><td>&nbsp;&nbsp;4.3.2</td><td>Term Frequency &ndash; Inverse Document Frequency (TF-IDF) Formulation</td><td class="pg">61</td></tr>
      <tr><td>&nbsp;&nbsp;4.3.3</td><td>Vector Space Modeling &amp; Cosine Similarity Derivation</td><td class="pg">64</td></tr>
      <tr><td>&nbsp;&nbsp;4.3.4</td><td>User-Item Collaborative Filtering &amp; Matrix Preference Scoring</td><td class="pg">67</td></tr>
      <tr><td>&nbsp;&nbsp;4.3.5</td><td>Hybrid Score Synthesis &amp; Explainability Rule Generation</td><td class="pg">70</td></tr>
      <tr><td>4.4</td><td>Database Design &amp; Relational Schema (3NF Normalization)</td><td class="pg">72</td></tr>
      <tr><td>&nbsp;&nbsp;4.4.1</td><td>Table Structures, Foreign Keys &amp; Index Specifications</td><td class="pg">72</td></tr>
      <tr><td>&nbsp;&nbsp;4.4.2</td><td>Automated Triggers for Atomic Rating Recalculation</td><td class="pg">76</td></tr>
      <tr><td>&nbsp;&nbsp;4.4.3</td><td>PostgreSQL Row-Level Security (RLS) Policy Specifications</td><td class="pg">77</td></tr>
      <tr><td>4.5</td><td>User Interface (UI) Design Principles &amp; Design System</td><td class="pg">79</td></tr>
      <tr><td>4.6</td><td>Procedural Logic (System Flowcharts &amp; UML Sequence Diagrams)</td><td class="pg">81</td></tr>

      <tr class="toc-major"><td colspan="2"><b>Chapter 5: Implementation Details &amp; Code Highlights</b></td><td class="pg">84</td></tr>
      <tr><td>5.1</td><td>Implementation Methodology &amp; Engineering Decisions</td><td class="pg">84</td></tr>
      <tr><td>5.2</td><td>Server-Side Full-Text Search Function Implementation</td><td class="pg">86</td></tr>
      <tr><td>5.3</td><td>True TF-IDF &amp; Collaborative Recommendation Pipeline Code</td><td class="pg">88</td></tr>
      <tr><td>5.4</td><td>Database Atomic Trigger &amp; Schema Migration Functions</td><td class="pg">92</td></tr>
      <tr><td>5.5</td><td>Comprehensive Administrative Reports Aggregation Code</td><td class="pg">94</td></tr>
      <tr><td>5.6</td><td>Architectural Defense: TypeScript vs Python &amp; PostgreSQL vs MongoDB</td><td class="pg">97</td></tr>

      <tr class="toc-major"><td colspan="2"><b>Chapter 6: Software Testing &amp; Quality Assurance</b></td><td class="pg">100</td></tr>
      <tr><td>6.1</td><td>Testing Strategy &amp; V-Model Quality Framework</td><td class="pg">100</td></tr>
      <tr><td>6.2</td><td>Unit Testing (Vitest Automated Mathematical Test Suite)</td><td class="pg">102</td></tr>
      <tr><td>6.3</td><td>Integration Testing (Database, Auth, Server RPC Pipelines)</td><td class="pg">105</td></tr>
      <tr><td>6.4</td><td>System Testing &amp; End-to-End Test Suite (18 Automated Test Cases)</td><td class="pg">107</td></tr>
      <tr><td>6.5</td><td>Security &amp; Vulnerability Testing (RLS Validation &amp; Injection Defense)</td><td class="pg">111</td></tr>
      <tr><td>6.6</td><td>User Acceptance Testing (UAT) &amp; Performance Benchmarks</td><td class="pg">113</td></tr>
      <tr><td>6.7</td><td>Bug Tracking, Debugging &amp; Code Refactoring Summary</td><td class="pg">115</td></tr>

      <tr class="toc-major"><td colspan="2"><b>Chapter 7: Reports Generation &amp; Screen Layouts</b></td><td class="pg">117</td></tr>
      <tr><td>7.1</td><td>Overview of Administrative Intelligence System</td><td class="pg">117</td></tr>
      <tr><td>7.2</td><td>The Five Mandatory Section 5.6 Reports: Layout &amp; Data Analysis</td><td class="pg">119</td></tr>
      <tr><td>&nbsp;&nbsp;7.2.1</td><td>Report 1: Student Activity Report</td><td class="pg">119</td></tr>
      <tr><td>&nbsp;&nbsp;7.2.2</td><td>Report 2: Most-Recommended Materials Report</td><td class="pg">121</td></tr>
      <tr><td>&nbsp;&nbsp;7.2.3</td><td>Report 3: Subject Search Popularity Report</td><td class="pg">123</td></tr>
      <tr><td>&nbsp;&nbsp;7.2.4</td><td>Report 4: Material Rating Summary Report</td><td class="pg">125</td></tr>
      <tr><td>&nbsp;&nbsp;7.2.5</td><td>Report 5: System Usage Summary Report</td><td class="pg">127</td></tr>
      <tr><td>7.3</td><td>User Interface Screens and Navigation Layouts</td><td class="pg">129</td></tr>

      <tr class="toc-major"><td colspan="2"><b>Chapter 8: Security Implementation, Limitations &amp; Future Scope</b></td><td class="pg">134</td></tr>
      <tr><td>8.1</td><td>Security Architecture (Authentication, TLS, PostgreSQL RLS)</td><td class="pg">134</td></tr>
      <tr><td>8.2</td><td>Current System Limitations &amp; Algorithmic Constraints</td><td class="pg">137</td></tr>
      <tr><td>8.3</td><td>Future Scope &amp; Planned Enhancements (NCF, BERT, React Native)</td><td class="pg">139</td></tr>

      <tr class="toc-major"><td colspan="2"><b>Chapter 9: Conclusion &amp; Bibliography</b></td><td class="pg">142</td></tr>
      <tr><td>9.1</td><td>Project Conclusion &amp; Evaluation of Objectives</td><td class="pg">142</td></tr>
      <tr><td>9.2</td><td>Candidate Self-Assessment &amp; Key Lessons Learned</td><td class="pg">144</td></tr>
      <tr><td>9.3</td><td>Bibliography &amp; Literature References (IEEE Academic Format)</td><td class="pg">145</td></tr>
    </tbody>
  </table>
</div>

<div class="page-break"></div>

<!-- LIST OF FIGURES & LIST OF TABLES -->
<div class="section-prelim">
  <h2 class="prelim-heading">LIST OF FIGURES &amp; LIST OF TABLES</h2>

  <h3 class="sub-heading">List of Figures</h3>
  <table class="lot-table">
    <tr><td style="width: 20%;"><b>Figure 1.1</b></td><td>Conceptual Overview of StudyFlow AI Academic Curation Platform</td><td style="text-align: right;">5</td></tr>
    <tr><td><b>Figure 2.1</b></td><td>System Use Case Diagram (Student, Educator, Administrator Roles)</td><td style="text-align: right;">28</td></tr>
    <tr><td><b>Figure 3.1</b></td><td>Iterative &amp; Agile SDLC Model Applied to AI Recommender Engineering</td><td style="text-align: right;">32</td></tr>
    <tr><td><b>Figure 3.2</b></td><td>DFD Level 0: System Context Diagram</td><td style="text-align: right;">37</td></tr>
    <tr><td><b>Figure 3.3</b></td><td>DFD Level 1: Core System Process Decomposition Diagram</td><td style="text-align: right;">40</td></tr>
    <tr><td><b>Figure 3.4</b></td><td>DFD Level 2: AI Recommendation Subsystem (P3) Functional Flow</td><td style="text-align: right;">43</td></tr>
    <tr><td><b>Figure 3.5</b></td><td>Entity-Relationship (E-R) Diagram of Relational Database Schema</td><td style="text-align: right;">51</td></tr>
    <tr><td><b>Figure 3.6</b></td><td>UML Class Diagram for Recommendation &amp; Catalog Domain Entities</td><td style="text-align: right;">54</td></tr>
    <tr><td><b>Figure 4.1</b></td><td>Modern 3-Tier SSR + BaaS System Architecture Diagram</td><td style="text-align: right;">56</td></tr>
    <tr><td><b>Figure 4.2</b></td><td>High-Dimensional Vector Space Model and Cosine Similarity Angle</td><td style="text-align: right;">66</td></tr>
    <tr><td><b>Figure 4.3</b></td><td>User-Item Collaborative Filtering Correlation Matrix Flow</td><td style="text-align: right;">69</td></tr>
    <tr><td><b>Figure 4.4</b></td><td>Database Schema Relational Integrity and Foreign Key Map</td><td style="text-align: right;">75</td></tr>
    <tr><td><b>Figure 4.5</b></td><td>UML Sequence Diagram: Search &amp; Recommendation Execution Journey</td><td style="text-align: right;">83</td></tr>
    <tr><td><b>Figure 6.1</b></td><td>Software Testing V-Model Quality Assurance Framework</td><td style="text-align: right;">101</td></tr>
    <tr><td><b>Figure 7.1</b></td><td>Section 5.6 Report 2: Most-Recommended Materials Frequency Chart</td><td style="text-align: right;">122</td></tr>
    <tr><td><b>Figure 7.2</b></td><td>Section 5.6 Report 3: Subject Search Popularity Distribution Chart</td><td style="text-align: right;">124</td></tr>
    <tr><td><b>Figure 7.3</b></td><td>User Interface Screen: Personalized Student Learning Dashboard</td><td style="text-align: right;">130</td></tr>
    <tr><td><b>Figure 7.4</b></td><td>User Interface Screen: Real-Time Server-Side Search &amp; Subject Filtering</td><td style="text-align: right;">131</td></tr>
    <tr><td><b>Figure 7.5</b></td><td>User Interface Screen: AI Recommendations with Explainability Badges</td><td style="text-align: right;">132</td></tr>
    <tr><td><b>Figure 7.6</b></td><td>User Interface Screen: Administrative 5-Part Analytics Intelligence Suite</td><td style="text-align: right;">133</td></tr>
  </table>

  <h3 class="sub-heading" style="margin-top: 30px;">List of Tables</h3>
  <table class="lot-table">
    <tr><td style="width: 20%;"><b>Table 1.1</b></td><td>Development Environment and Software Technology Specifications</td><td style="text-align: right;">8</td></tr>
    <tr><td><b>Table 2.1</b></td><td>Functional Requirements Traceability Matrix (FR-01 to FR-15)</td><td style="text-align: right;">18</td></tr>
    <tr><td><b>Table 2.2</b></td><td>Hardware and Software Minimum Operational Specifications</td><td style="text-align: right;">25</td></tr>
    <tr><td><b>Table 3.1</b></td><td>Feasibility Assessment Dimension Matrix</td><td style="text-align: right;">35</td></tr>
    <tr><td><b>Table 3.2</b></td><td>Data Dictionary: Entity and Data Element Specifications</td><td style="text-align: right;">45</td></tr>
    <tr><td><b>Table 4.1</b></td><td>Multi-Criteria Recommendation Hybrid Weighting Allocations</td><td style="text-align: right;">71</td></tr>
    <tr><td><b>Table 4.2</b></td><td>Relational Database Schema Table Definitions (Third Normal Form)</td><td style="text-align: right;">73</td></tr>
    <tr><td><b>Table 4.3</b></td><td>PostgreSQL Row-Level Security (RLS) Policy Specifications</td><td style="text-align: right;">78</td></tr>
    <tr><td><b>Table 6.1</b></td><td>Vitest Automated Unit Test Execution Results (recommendation.test.ts)</td><td style="text-align: right;">104</td></tr>
    <tr><td><b>Table 6.2</b></td><td>End-to-End System Test Suite Verification Matrix (18 Test Cases)</td><td style="text-align: right;">108</td></tr>
    <tr><td><b>Table 6.3</b></td><td>User Acceptance Testing (UAT) Verification Checklist</td><td style="text-align: right;">114</td></tr>
    <tr><td><b>Table 7.1</b></td><td>Section 5.6 Report 1: Student Activity Aggregation Data Table</td><td style="text-align: right;">120</td></tr>
    <tr><td><b>Table 7.2</b></td><td>Section 5.6 Report 4: Material Rating Summary Ranking Table</td><td style="text-align: right;">126</td></tr>
    <tr><td><b>Table 7.3</b></td><td>Section 5.6 Report 5: System Usage &amp; Catalog Metric Summary Table</td><td style="text-align: right;">128</td></tr>
  </table>
</div>
`;
