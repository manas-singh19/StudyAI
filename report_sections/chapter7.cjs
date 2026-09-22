module.exports = `
<!-- ==================== CHAPTER 7: REPORTS GENERATION & SCREEN LAYOUTS ==================== -->
<div class="chapter-container">
  <div class="chapter-header">
    <div class="chapter-number">CHAPTER 7</div>
    <h1 class="chapter-title">REPORTS GENERATION &amp; SCREEN LAYOUTS</h1>
  </div>

  <h2 class="sec-heading">7.1 Overview of Administrative Intelligence System</h2>

  <p class="body-p">
    In academic software engineering, administrative visibility is paramount. Course coordinators, department heads, and digital librarians require actionable intelligence to understand student learning behaviors, assess resource quality, and allocate pedagogical efforts effectively.
  </p>

  <p class="body-p">
    Section 5.6 of the approved IGNOU BCSP-064 Project Synopsis explicitly mandates the implementation of <b>five comprehensive administrative reports</b>. In <b>StudyFlow AI</b>, these reports are powered by the server aggregation function <code>getAdminComprehensiveReports</code> and rendered dynamically in the administrative analytics view (<code>admin.reports.tsx</code>) utilizing interactive Recharts SVG visualizations and sortable data tables.
  </p>

  <h2 class="sec-heading">7.2 Detailed Analysis of the Five Mandatory Section 5.6 Reports</h2>

  <h3 class="sub-sec-heading">7.2.1 Report 1: Student Activity Report</h3>
  <p class="body-p">
    <b>Objective:</b> Provides granular tracking of student engagement across search inquiries, learning object views, and peer evaluations.
    <br><b>Layout Format:</b> Tabular display with sortable headers and expandable search inquiry badges.
    <br><b>Data Source:</b> Multi-table SQL aggregation joining <code>profiles</code>, <code>search_logs</code>, <code>ratings</code>, and <code>material_views</code>.
  </p>

  <table class="academic-table">
    <thead>
      <tr>
        <th style="width: 25%;">Student Name</th>
        <th style="width: 15%; text-align: center;">Search Count</th>
        <th style="width: 30%;">Recent Search Queries</th>
        <th style="width: 15%; text-align: center;">Materials Viewed</th>
        <th style="width: 15%; text-align: center;">Avg Rating Given</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Shubham Kumari</b> (Admin)</td>
        <td style="text-align: center;">12</td>
        <td><code>"neural"</code>, <code>"database"</code>, <code>"sorting"</code></td>
        <td style="text-align: center;">18</td>
        <td style="text-align: center;"><b>4.80 ★</b></td>
      </tr>
      <tr>
        <td><b>Student Scholar A</b></td>
        <td style="text-align: center;">8</td>
        <td><code>"b-tree"</code>, <code>"recursion"</code>, <code>"stacks"</code></td>
        <td style="text-align: center;">11</td>
        <td style="text-align: center;"><b>4.50 ★</b></td>
      </tr>
      <tr>
        <td><b>Student Scholar B</b></td>
        <td style="text-align: center;">5</td>
        <td><code>"operating systems"</code>, <code>"paging"</code></td>
        <td style="text-align: center;">7</td>
        <td style="text-align: center;"><b>4.00 ★</b></td>
      </tr>
    </tbody>
  </table>

  <h3 class="sub-sec-heading">7.2.2 Report 2: Most-Recommended Materials Report</h3>
  <p class="body-p">
    <b>Objective:</b> Tracks algorithmic frequency to identify which study resources are most frequently surfaced by the AI recommendation engine.
    <br><b>Layout Format:</b> Horizontal Recharts SVG bar chart ranking the Top 20 materials by recommendation count.
    <br><b>Data Source:</b> Aggregated frequency counts from the persistent <code>recommendations</code> table (D4).
  </p>

  <div class="ascii-diagram-box">
<pre>
========================================================================================
     FIGURE 7.1: SECTION 5.6 REPORT 2 (MOST-RECOMMENDED MATERIALS FREQUENCY)
========================================================================================

  Material Title                                Recommendation Frequency
  --------------------------------------------------------------------------------------
  1. Stanford CS229 Neural Networks Notes       |############################## (28)
  2. Searching &amp; Hashing Algorithms Guide       |######################### (24)
  3. Relational DB Normalization 1NF to BCNF    |####################### (22)
  4. Operating System Deadlocks &amp; Semaphores    |#################### (19)
  5. Python for Data Science Quick Handbook     |################# (16)
  --------------------------------------------------------------------------------------
</pre>
  </div>

  <h3 class="sub-sec-heading">7.2.3 Report 3: Subject Search Popularity Report</h3>
  <p class="body-p">
    <b>Objective:</b> Visualizes the distribution of student search queries across academic disciplines, highlighting curriculum demand.
    <br><b>Layout Format:</b> Interactive Recharts SVG donut / pie chart with proportional percentage callouts.
    <br><b>Data Source:</b> Keyword cross-referencing between <code>search_logs</code> and <code>subjects</code>.
  </p>

  <div class="ascii-diagram-box">
<pre>
========================================================================================
     FIGURE 7.2: SECTION 5.6 REPORT 3 (SUBJECT SEARCH POPULARITY DISTRIBUTION)
========================================================================================

                 [ Artificial Intelligence: 32% ]
                             /        \\
                            /          \\
  [ Data Structures: 28% ] &lt;              &gt; [ Database Systems: 20% ]
                            \\          /
                             \\        /
                 [ Operating Systems &amp; Others: 20% ]
</pre>
  </div>

  <h3 class="sub-sec-heading">7.2.4 Report 4: Material Rating Summary Report</h3>
  <p class="body-p">
    <b>Objective:</b> Sortable catalog review table enabling administrators to inspect the highest-rated and lowest-rated materials.
    <br><b>Layout Format:</b> Tabular view with dynamic sorting by Average Star Rating, Total Reviews, and Total Views.
  </p>

  <table class="academic-table">
    <thead>
      <tr>
        <th style="width: 35%;">Study Material Title</th>
        <th style="width: 20%;">Subject Discipline</th>
        <th style="width: 15%;">Format</th>
        <th style="width: 15%; text-align: center;">Average Rating</th>
        <th style="width: 15%; text-align: center;">Total Reviews</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><b>Searching and Hashing Comprehensive Guide</b></td>
        <td>Data Structures</td>
        <td>Notes</td>
        <td style="text-align: center;"><b>5.00 ★</b></td>
        <td style="text-align: center;">6</td>
      </tr>
      <tr>
        <td><b>Stanford CS229 Neural Networks Review Notes</b></td>
        <td>Artificial Intelligence</td>
        <td>Notes</td>
        <td style="text-align: center;"><b>4.85 ★</b></td>
        <td style="text-align: center;">14</td>
      </tr>
      <tr>
        <td><b>Relational Database Normalization Handbook</b></td>
        <td>Database Management</td>
        <td>Book</td>
        <td style="text-align: center;"><b>4.70 ★</b></td>
        <td style="text-align: center;">9</td>
      </tr>
    </tbody>
  </table>

  <h3 class="sub-sec-heading">7.2.5 Report 5: System Usage &amp; Operational Metrics Summary</h3>
  <p class="body-p">
    <b>Objective:</b> High-level KPI metric cards providing immediate system health and volume oversight for institutional leadership.
  </p>

  <div class="metric-card-grid">
    <div class="m-card">
      <div class="m-val">62</div>
      <div class="m-label">Approved Study Materials</div>
    </div>
    <div class="m-card">
      <div class="m-val">8</div>
      <div class="m-label">Academic Subjects</div>
    </div>
    <div class="m-card">
      <div class="m-val">100%</div>
      <div class="m-label">Automated Tests Passed</div>
    </div>
    <div class="m-card">
      <div class="m-val">&lt; 50ms</div>
      <div class="m-label">AI Recommender Latency</div>
    </div>
  </div>

  <h2 class="sec-heading">7.3 User Interface Screens and Navigation Layouts</h2>

  <p class="body-p">
    The user interface was designed following modern human-computer interaction (HCI) principles: high color contrast, accessible typography, clear visual hierarchy, and instant feedback. Figures 7.3 through 7.6 illustrate key interface layouts:
  </p>

  <div class="ascii-diagram-box">
<pre>
========================================================================================
           FIGURE 7.3: USER INTERFACE - PERSONALIZED STUDENT DASHBOARD
========================================================================================

 +------------------------------------------------------------------------------------+
 | StudyFlow AI       [Catalog]  [Recommendations]  [Study Packs]      (User Profile) |
 +------------------------------------------------------------------------------------+
 | Welcome back, Shubham Kumari! (BCA 6th Semester)                                   |
 | [ Enrolled Subjects: MCS-011, BCS-041, BCS-051 ]                                   |
 +------------------------------------------------------------------------------------+
 | [ STATS ]                                                                          |
 | Enrolled Subjects: 8    Searches: 12    Ratings Given: 6    Materials Viewed: 18   |
 +------------------------------------------------------------------------------------+
 | QUICK ACTIONS:                                                                     |
 |  [ Search Catalog ]      [ Explore AI Recommendations ]      [ View Study Packs ]  |
 +------------------------------------------------------------------------------------+
</pre>
  </div>

  <div class="ascii-diagram-box" style="margin-top: 20px;">
<pre>
========================================================================================
          FIGURE 7.4: USER INTERFACE - SERVER SEARCH &amp; MULTI-FACET FILTERING
========================================================================================

 +------------------------------------------------------------------------------------+
 | Search Inquiry: [ neural networks                                        ] [Search]|
 | Filters: Subject: [ Artificial Intelligence v ]  Format: [ All v ]  Level: [ All v]|
 +------------------------------------------------------------------------------------+
 | Results Found: 2 matching materials (Server Query Time: 32ms)                      |
 |                                                                                    |
 | +------------------------------------+  +------------------------------------+     |
 | | Stanford CS229 Neural Networks     |  | Deep Learning Architectures Notes  |     |
 | | Subject: Artificial Intelligence   |  | Subject: Artificial Intelligence   |     |
 | | Format: Notes | Rating: 4.85 ★     |  | Format: Slides | Rating: 4.60 ★    |     |
 | | [ View Resource ]  [ Rate &amp; Review]|  | [ View Resource ]  [ Rate &amp; Review]|     |
 | +------------------------------------+  +------------------------------------+     |
 +------------------------------------------------------------------------------------+
</pre>
  </div>

  <div class="ascii-diagram-box" style="margin-top: 20px;">
<pre>
========================================================================================
       FIGURE 7.5: USER INTERFACE - AI RECOMMENDATIONS WITH EXPLAINABILITY
========================================================================================

 +------------------------------------------------------------------------------------+
 | Top 10 Personalized Recommendations for You                                        |
 | Generated via Hybrid TF-IDF &amp; Collaborative Filtering Engine                       |
 +------------------------------------------------------------------------------------+
 | 1. Stanford CS229 Neural Networks Review Notes              [ 94% Match Score ]    |
 |    Subject: Artificial Intelligence | Difficulty: Advanced                         |
 |    &gt;&gt; REASON: "High match with your learning interests and recent searches"        |
 |    [ Open Document ]   [ Bookmark ]                                                |
 | ---------------------------------------------------------------------------------- |
 | 2. Searching and Hashing Comprehensive Notes               [ 88% Match Score ]    |
 |    Subject: Data Structures | Difficulty: Intermediate                             |
 |    &gt;&gt; REASON: "Top-rated learning resource across peer students"                  |
 |    [ Open Document ]   [ Bookmark ]                                                |
 +------------------------------------------------------------------------------------+
</pre>
  </div>
</div>
`;
