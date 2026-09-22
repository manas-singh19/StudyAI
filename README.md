# StudyAI (BCSP-064)
**AI-Powered Study Material Recommender**

> **Candidate**: Shubham Kumari  
> **Enrollment No**: 2400625700  
> **Programme**: Bachelor of Computer Applications (BCA)  
> **Course Code**: BCSP-064 (Major Project)  
> **Project Title**: AI – Powered Study Material Recommender  

---

## 1. Project Overview

StudyFlow AI is an intelligent academic study material recommender designed to optimize student learning workflows. It combines:
- **Server-Side Full-Text Search** across materials and subjects
- **Dual-Model Explainable AI Recommendation Engine**:
  - **TF-IDF Content-Based Filtering** with Cosine Similarity
  - **Collaborative Filtering** leveraging student rating matrices
- **Student Profile & Learning History Tracking** (searches, views, enrollments, ratings)
- **Role-Protected Administration & Analytics Suite** implementing all 5 BCSP-064 Section 5.6 mandatory reports

---

## 2. System Architecture & DFD Implementation

This project implements the complete data flow architecture described in the BCSP-064 synopsis:

### DFD Level 0 (Context Diagram)
- **Student (User)**: Submits login credentials and search queries; receives personalized recommendations and search results.
- **Administrator**: Manages learning materials, reviews submissions, monitors system metrics and reports.
- **AI Study Material Recommender**: Central system coordinating authentication, recommendation pipelines, indexing, and analytics.

### DFD Level 1 (Process Decomposition)
- **P1 (User Authentication)**: Role-aware session management with student and administrator privileges.
- **P2 (Subject & Topic Search)**: Server-side database full-text search with subject filtering and pagination.
- **P3 (Recommendation Engine)**: Server-side pipeline reading **D1 (User Profile DB)**, **D2 (Material DB)**, and **D3 (Rating DB)** to generate Top-N recommendations stored in **D4 (Recommendations DB)**.
- **P4 (Material Management)**: Administrator catalog CRUD, material approvals, and author linking.
- **P5 (Rating & Review)**: Student ratings (1–5) and reviews; atomic database trigger updates average ratings and counts.
- **P6 (Reports & Analytics)**: 5-part reporting suite visualizing system activity, recommendations, search popularity, and ratings.

### DFD Level 2 (Recommendation Engine P3 Decomposition)
- **P3.1 (Profile Analyzer)**: Dynamically constructs rich profile text from student search history, viewed materials, and enrolled subjects.
- **P3.2 (Keyword Extractor)**: Tokenizes, normalizes, and filters noise words.
- **P3.3 (Content Filter - True TF-IDF)**:
  - Computes Term Frequency ($TF$) and Inverse Document Frequency ($IDF$):
    $$IDF(t) = \ln\left(\frac{N + 1}{DF(t) + 1}\right) + 1$$
  - Builds TF-IDF vectors and computes Cosine Similarity against student query/profile vectors.
- **P3.4 (Collaborative Filter)**:
  - Constructs user-item rating matrices from the `ratings` table.
  - Calculates user similarity scores across co-rated materials to predict ratings.
- **P3.5 (Score Aggregator)**:
  - Blends weights: **50% Content Relevance + 25% Collaborative Signal + 15% Subject Fit + 10% Quality Rating**.
  - Stores ranked results in `recommendations` table and returns top 10 with explainable reasons.

---

## 3. Mandatory Administrator Reports (Section 5.6)

Navigating to `/admin/reports` displays the complete BCSP-064 reporting suite:
1. **Report 1: Student Activity Report**: Detailed table listing each student's search count, recent search terms, materials viewed, ratings given, and average rating given.
2. **Report 2: Most-Recommended Materials Report**: Bar chart displaying the top 20 learning resources most frequently recommended by the AI engine.
3. **Report 3: Subject Popularity Report**: Pie chart displaying the distribution of searches across academic subjects.
4. **Report 4: Rating Summary Report**: Sortable table analyzing material quality, review count, and view counts.
5. **Report 5: System Usage Report**: System summary of active users, total searches, AI recommendations generated, and catalog items.

---

## 4. Local Development & Running

### Prerequisites
- Node.js (v18+)
- npm (v10+)

### Start the Server
From the `studyAI` directory:
```bash
cd d:\finalTest\studyAI
npm run dev
```

The application will start on:
**`http://localhost:5173/`**

### Default Administrator Credentials
- **Email**: `kumarishubham177@gmail.com`
- **Password**: `StudyFlow!2026`

---

## 5. Running Automated Tests
To run unit and algorithm verification tests:
```bash
npx vitest run src/lib/recommendation.test.ts
```
"# StudyAI" 
