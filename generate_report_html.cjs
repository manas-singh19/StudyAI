const fs = require('fs');
const path = require('path');

const preliminary = require('./report_sections/preliminary.cjs');
const chapter1 = require('./report_sections/chapter1.cjs');
const chapter2 = require('./report_sections/chapter2.cjs');
const chapter3 = require('./report_sections/chapter3.cjs');
const chapter4 = require('./report_sections/chapter4.cjs');
const chapter5 = require('./report_sections/chapter5.cjs');
const chapter6 = require('./report_sections/chapter6.cjs');
const chapter7 = require('./report_sections/chapter7.cjs');
const chapter8 = require('./report_sections/chapter8.cjs');
const chapter9 = require('./report_sections/chapter9.cjs');

console.log('Assembling master BCSP-064 Project Report HTML...');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>IGNOU BCSP-064 Final Project Report - Shubham Kumari (2400625700)</title>
<style>
  @page {
    size: A4 portrait;
    margin: 24mm 20mm 24mm 28mm; /* Extra left margin for spine hard-binding */
    @top-left {
      content: "AI-Powered Study Material Recommender";
      font-family: "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 8pt;
      color: #64748b;
      font-weight: 500;
      border-bottom: 0.5pt solid #cbd5e1;
      padding-bottom: 4px;
    }
    @top-right {
      content: "IGNOU BCA (BCSP-064)";
      font-family: "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 8pt;
      color: #64748b;
      font-weight: 600;
      border-bottom: 0.5pt solid #cbd5e1;
      padding-bottom: 4px;
    }
    @bottom-left {
      content: "Candidate: Shubham Kumari (Enrolment: 2400625700)";
      font-family: "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 8pt;
      color: #64748b;
      border-top: 0.5pt solid #cbd5e1;
      padding-top: 4px;
    }
    @bottom-right {
      content: "Page " counter(page);
      font-family: "Segoe UI", Roboto, Arial, sans-serif;
      font-size: 8pt;
      color: #0f172a;
      font-weight: 700;
      border-top: 0.5pt solid #cbd5e1;
      padding-top: 4px;
    }
  }

  @page :first {
    @top-left { content: none; }
    @top-right { content: none; }
    @bottom-left { content: none; }
    @bottom-right { content: none; }
    margin: 0;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: "Times New Roman", Times, Georgia, serif;
    color: #111827;
    background: #ffffff;
    font-size: 11pt;
    line-height: 1.65; /* Conforms to IGNOU 1.5 to double-spaced requirement */
    text-align: justify;
  }

  .page-break {
    page-break-before: always;
    break-before: page;
  }

  /* HARD-BOUND COVER STYLING */
  .hardbound-cover {
    width: 100vw;
    min-height: 100vh;
    padding: 30mm 25mm;
    background: #0f172a;
    color: #f8fafc;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    page-break-after: always;
  }

  .cover-inner-border {
    border: 3px double #d97706; /* Golden academic double rule */
    padding: 24mm 18mm;
    min-height: calc(100vh - 60mm);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
  }

  .univ-logo-text {
    font-size: 15pt;
    font-weight: 800;
    letter-spacing: 1.5px;
    color: #fbbf24;
    text-transform: uppercase;
    margin-bottom: 6px;
    font-family: "Segoe UI", Arial, sans-serif;
  }
  .univ-school {
    font-size: 10.5pt;
    font-weight: 600;
    letter-spacing: 0.5px;
    color: #cbd5e1;
    margin-bottom: 4px;
    font-family: "Segoe UI", Arial, sans-serif;
  }
  .univ-address {
    font-size: 9.5pt;
    color: #94a3b8;
    font-family: "Segoe UI", Arial, sans-serif;
  }

  .cover-title-box {
    margin: 35px 0;
  }
  .cover-title {
    font-size: 22pt;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 1px;
    line-height: 1.3;
    margin-bottom: 15px;
    text-transform: uppercase;
    font-family: "Segoe UI", Arial, sans-serif;
  }
  .cover-subtitle {
    font-size: 11pt;
    color: #cbd5e1;
    font-style: italic;
    max-width: 80%;
    margin: 0 auto;
  }

  .cover-submission-text {
    font-size: 10.5pt;
    line-height: 1.6;
    color: #e2e8f0;
    margin: 20px 0;
  }

  .cover-meta-grid {
    display: flex;
    justify-content: space-between;
    text-align: left;
    margin-top: 30px;
    border-top: 1px solid #334155;
    padding-top: 20px;
    font-family: "Segoe UI", Arial, sans-serif;
  }
  .cover-meta-col {
    width: 48%;
  }
  .cover-meta-col.right {
    text-align: right;
  }
  .meta-label {
    font-size: 8.5pt;
    color: #94a3b8;
    text-transform: uppercase;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .meta-name {
    font-size: 12pt;
    font-weight: 700;
    color: #fbbf24;
    margin-bottom: 4px;
  }
  .meta-detail {
    font-size: 9.5pt;
    color: #e2e8f0;
    line-height: 1.4;
  }

  .cover-session {
    font-size: 11pt;
    font-weight: 700;
    letter-spacing: 1.5px;
    color: #fbbf24;
    margin-top: 25px;
    font-family: "Segoe UI", Arial, sans-serif;
  }

  /* INNER TITLE PAGE */
  .inner-title-page {
    text-align: center;
    padding: 30px 10px;
    page-break-after: always;
  }
  .inner-univ {
    font-size: 16pt;
    font-weight: 800;
    color: #0f172a;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }
  .inner-school {
    font-size: 10pt;
    color: #475569;
    margin-bottom: 25px;
  }
  .inner-report-title {
    font-size: 20pt;
    font-weight: 800;
    color: #1e3a8a;
    line-height: 1.3;
    margin-bottom: 12px;
  }
  .inner-report-sub {
    font-size: 11pt;
    color: #334155;
    font-style: italic;
    margin-bottom: 25px;
  }
  .inner-desc {
    font-size: 11pt;
    line-height: 1.6;
    margin-bottom: 30px;
  }
  .inner-table {
    margin: 0 auto;
    width: 90%;
    border-collapse: collapse;
    text-align: left;
    font-size: 10pt;
  }
  .inner-table td {
    padding: 6px 12px;
    border-bottom: 1px solid #e2e8f0;
  }
  .inner-table td.col-title {
    width: 38%;
    font-weight: 600;
    color: #475569;
  }
  .inner-table td.col-val {
    color: #0f172a;
  }

  /* PROFORMA & FORM TABLES */
  .proforma-header {
    text-align: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #0f172a;
    padding-bottom: 12px;
  }
  .p-univ { font-size: 13pt; font-weight: 800; color: #0f172a; }
  .p-sub { font-size: 9.5pt; color: #475569; }
  .p-title { font-size: 12pt; font-weight: 800; margin-top: 8px; color: #1e3a8a; }
  .p-note { font-size: 8.5pt; color: #64748b; font-style: italic; }

  .form-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9.5pt;
    margin-bottom: 20px;
  }
  .form-table td {
    border: 1px solid #94a3b8;
    padding: 6px 10px;
    vertical-align: top;
  }

  .sig-section {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
  }
  .sig-box {
    width: 42%;
    text-align: center;
  }
  .sig-box.right {
    text-align: center;
  }
  .sig-line {
    border-bottom: 1px solid #0f172a;
    margin-bottom: 6px;
    height: 35px;
  }
  .sig-label {
    font-size: 10pt;
    font-weight: 700;
    color: #0f172a;
  }
  .sig-sub {
    font-size: 8.5pt;
    color: #475569;
    margin-top: 2px;
  }

  .official-use-box {
    border: 1.5px dashed #475569;
    padding: 12px 16px;
    border-radius: 4px;
    background: #f8fafc;
    font-size: 9pt;
  }
  .off-title {
    font-weight: 800;
    color: #0f172a;
    text-align: center;
    margin-bottom: 6px;
  }
  .off-status {
    margin-bottom: 8px;
    text-align: center;
  }

  /* PRELIMINARY COMMON */
  .section-prelim {
    padding-top: 10px;
    page-break-after: always;
  }
  .prelim-heading {
    font-size: 16pt;
    font-weight: 800;
    color: #0f172a;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 2px solid #cbd5e1;
    padding-bottom: 8px;
    margin-bottom: 24px;
  }
  .prelim-p {
    font-size: 10.5pt;
    line-height: 1.7;
    margin-bottom: 14px;
    text-indent: 28px;
  }
  .prelim-ol {
    margin-left: 30px;
    margin-bottom: 16px;
    font-size: 10pt;
    line-height: 1.6;
  }
  .prelim-ol li {
    margin-bottom: 8px;
  }

  .cert-student-highlight {
    background: #f8fafc;
    border-left: 4px solid #1e3a8a;
    padding: 12px 18px;
    margin: 20px 0;
    font-size: 10pt;
    line-height: 1.6;
  }

  /* TABLE OF CONTENTS */
  .toc-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9.5pt;
  }
  .toc-table th {
    border-bottom: 2px solid #0f172a;
    padding: 6px 4px;
    text-align: left;
    font-weight: 700;
  }
  .toc-table td {
    padding: 4px 4px;
    border-bottom: 1px dotted #cbd5e1;
  }
  .toc-table td.pg {
    text-align: right;
    font-weight: 600;
    font-family: monospace;
  }
  .toc-table tr.toc-major td {
    padding-top: 10px;
    font-weight: 700;
    color: #1e3a8a;
    border-bottom: 1px solid #94a3b8;
  }

  .lot-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9.5pt;
    margin-bottom: 20px;
  }
  .lot-table td {
    padding: 4px 6px;
    border-bottom: 1px dotted #cbd5e1;
  }

  /* CHAPTER STYLING */
  .chapter-container {
    padding-top: 15px;
    page-break-before: always;
  }
  .chapter-header {
    text-align: center;
    border-bottom: 2.5px solid #0f172a;
    padding-bottom: 12px;
    margin-bottom: 24px;
  }
  .chapter-number {
    font-size: 12pt;
    font-weight: 800;
    letter-spacing: 2px;
    color: #64748b;
    text-transform: uppercase;
    font-family: "Segoe UI", Arial, sans-serif;
    margin-bottom: 4px;
  }
  .chapter-title {
    font-size: 18pt;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .sec-heading {
    font-size: 13pt;
    font-weight: 800;
    color: #1e3a8a;
    margin-top: 24px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
    page-break-after: avoid;
  }
  .sub-sec-heading {
    font-size: 11pt;
    font-weight: 700;
    color: #0f172a;
    margin-top: 16px;
    margin-bottom: 6px;
    page-break-after: avoid;
  }

  .body-p {
    font-size: 10.5pt;
    line-height: 1.68;
    margin-bottom: 12px;
    text-indent: 24px;
  }
  .body-ul, .body-ol {
    margin-left: 28px;
    margin-bottom: 14px;
    font-size: 10pt;
    line-height: 1.6;
  }
  .body-ul li, .body-ol li {
    margin-bottom: 6px;
  }

  /* ACADEMIC TABLES */
  .academic-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9pt;
    line-height: 1.45;
    margin: 16px 0;
    page-break-inside: avoid;
  }
  .academic-table th {
    background: #f1f5f9;
    color: #0f172a;
    border: 1px solid #94a3b8;
    padding: 7px 8px;
    font-weight: 700;
    text-align: left;
  }
  .academic-table td {
    border: 1px solid #cbd5e1;
    padding: 6px 8px;
    vertical-align: top;
  }
  .academic-table tr:nth-child(even) {
    background: #f8fafc;
  }

  /* CODE & ASCII DIAGRAMS */
  .code-listing-box {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-left: 3.5px solid #2563eb;
    border-radius: 4px;
    padding: 10px 14px;
    margin: 14px 0;
    font-family: "Consolas", "Courier New", monospace;
    font-size: 8.5pt;
    line-height: 1.4;
    color: #0f172a;
    overflow-x: auto;
    page-break-inside: avoid;
  }

  .ascii-diagram-box {
    background: #ffffff;
    border: 1px solid #94a3b8;
    border-radius: 4px;
    padding: 12px 14px;
    margin: 16px 0;
    font-family: "Consolas", "Courier New", monospace;
    font-size: 7.8pt;
    line-height: 1.25;
    color: #0f172a;
    overflow-x: auto;
    page-break-inside: avoid;
  }

  .formal-definition-box {
    background: #f8fafc;
    border-left: 4px solid #d97706;
    padding: 10px 16px;
    margin: 14px 0;
    font-size: 10pt;
    line-height: 1.55;
    color: #1e293b;
    border-radius: 2px;
  }

  .formula-display-box {
    background: #f1f5f9;
    border: 1px dashed #64748b;
    border-radius: 4px;
    padding: 8px 14px;
    margin: 12px 0;
    font-family: "Cambria Math", "Times New Roman", serif;
    font-size: 11pt;
    color: #0f172a;
    text-align: center;
    page-break-inside: avoid;
  }

  .user-role-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 14px;
    margin-bottom: 12px;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }
  .role-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
    font-family: "Segoe UI", Arial, sans-serif;
  }
  .role-badge.student { background: #dbeafe; color: #1e40af; }
  .role-badge.educator { background: #dcfce7; color: #166534; }
  .role-badge.admin { background: #fef3c7; color: #92400e; }

  .metric-card-grid {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin: 16px 0;
    page-break-inside: avoid;
  }
  .m-card {
    flex: 1;
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    padding: 12px;
    text-align: center;
  }
  .m-val {
    font-size: 16pt;
    font-weight: 800;
    color: #1e3a8a;
    font-family: "Segoe UI", Arial, sans-serif;
  }
  .m-label {
    font-size: 8pt;
    color: #475569;
    margin-top: 4px;
    font-weight: 600;
    text-transform: uppercase;
  }

  .test-summary-box {
    background: #f0fdf4;
    border-left: 4px solid #16a34a;
    padding: 8px 14px;
    font-size: 9.5pt;
    color: #166534;
    margin: 12px 0;
    border-radius: 2px;
  }

  .usecase-detail-box {
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    margin: 12px 0;
    font-size: 9pt;
  }
  .usecase-detail-box table { width: 100%; border-collapse: collapse; }
  .usecase-detail-box td { padding: 6px 10px; border-bottom: 1px solid #f1f5f9; }

  .biblio-box {
    margin-top: 15px;
    font-size: 9.5pt;
    line-height: 1.6;
  }
  .biblio-list {
    margin-left: 25px;
  }
  .biblio-list li {
    margin-bottom: 8px;
    text-align: left;
  }
</style>
</head>
<body>

${preliminary}

${chapter1}

${chapter2}

${chapter3}

${chapter4}

${chapter5}

${chapter6}

${chapter7}

${chapter8}

${chapter9}

</body>
</html>
`;

const reportHtmlPath = path.resolve('d:/finalTest/studyAI/docs/BCSP064_Final_Project_Report.html');
fs.writeFileSync(reportHtmlPath, htmlContent, 'utf8');
console.log('Successfully wrote:', reportHtmlPath, 'Size:', fs.statSync(reportHtmlPath).size, 'bytes');

// Also write a copy to d:/finalTest/docs/BCSP064_Final_Project_Report.html
const rootHtmlPath = path.resolve('d:/finalTest/docs/BCSP064_Final_Project_Report.html');
fs.writeFileSync(rootHtmlPath, htmlContent, 'utf8');
console.log('Successfully wrote copy to:', rootHtmlPath);
