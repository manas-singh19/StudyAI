module.exports = `
<!-- ==================== CHAPTER 8: SECURITY, LIMITATIONS & FUTURE SCOPE ==================== -->
<div class="chapter-container">
  <div class="chapter-header">
    <div class="chapter-number">CHAPTER 8</div>
    <h1 class="chapter-title">SECURITY IMPLEMENTATION, LIMITATIONS &amp; FUTURE APPLICATIONS</h1>
  </div>

  <h2 class="sec-heading">8.1 Security Architecture &amp; Implementation</h2>

  <p class="body-p">
    Information security is an indispensable pillar of modern web applications. In academic software platforms that store student credentials, private search logs, and peer evaluations, compromising data confidentiality or system integrity undermines institutional trust.
  </p>

  <p class="body-p">
    In accordance with the security specifications laid down in the official IGNOU BCSP-064 guidelines, <b>StudyFlow AI</b> employs a multi-layered <b>Defense-in-Depth</b> security architecture:
  </p>

  <ul class="body-ul">
    <li>
      <b>Cryptographic Credential Hashing:</b> User passwords are encrypted using the industry-standard <b>bcrypt</b> hashing algorithm with a minimum cost factor of 10. Salting is performed automatically per user, guaranteeing immunity against rainbow-table and dictionary attacks. Plaintext passwords are never persisted to disk or emitted in logs.
    </li>
    <li>
      <b>Session Token Security (JWT over HTTP-Only Cookies):</b> Authentication tokens are formatted as signed JSON Web Tokens (JWT) containing cryptographically signed claims. Tokens are transmitted over secure, encrypted TLS channels and stored in secure browser session storage with automatic expiration and refresh cycles.
    </li>
    <li>
      <b>Kernel-Level Database Row-Level Security (RLS):</b> Rather than relying solely on application-layer route guards, data access boundaries are enforced directly by the PostgreSQL database engine via Row-Level Security policies. Students cannot read or manipulate search logs, profile records, or ratings belonging to other learners.
    </li>
    <li>
      <b>Parameterized Query Execution (SQL Injection Immunity):</b> All database queries execute via Supabase PostgREST client libraries that employ strict parameterized SQL statements. Input strings containing SQL metacharacters (e.g., <code>' OR 1=1 --</code>) are parsed as literal string values, completely precluding SQL injection exploits.
    </li>
    <li>
      <b>Automatic Cross-Site Scripting (XSS) Mitigation:</b> React's Virtual DOM architecture automatically escapes all dynamic text bindings before rendering them into the Document Object Model (DOM). Malicious JavaScript strings submitted in material reviews or search queries are treated as inert text nodes, preventing script injection.
    </li>
    <li>
      <b>Role-Based Access Control (RBAC):</b> High-privilege actions—such as managing curriculum subjects, modifying catalog materials, or reviewing educator credentials—are guarded by the PostgreSQL security definer function <code>public.has_role(auth.uid(), 'admin')</code>.
    </li>
  </ul>

  <h2 class="sec-heading">8.2 Current Limitations of the Project</h2>

  <p class="body-p">
    While StudyFlow AI achieves all specified functional and performance milestones, academic objectivity requires acknowledging current engineering limitations:
  </p>

  <ol class="body-ol">
    <li>
      <b>Catalog Scaling &amp; In-Memory Tokenization:</b> The current TF-IDF corpus builder computes document frequencies in-memory on the server across the active catalog of 62 materials in under 50 milliseconds. For institutional digital libraries scaling beyond 500,000 documents, in-memory corpus processing must be migrated to a dedicated distributed vector index (such as pgvector, FAISS, or Pinecone).
    </li>
    <li>
      <b>Extreme Cold-Start Scenarios:</b> When a newly registered student has zero search queries and zero material ratings, collaborative correlation cannot be computed mathematically. Although the system gracefully falls back to global popularity heuristics, initial recommendations lack deep individual personalization until the learner performs two or more interactions.
    </li>
    <li>
      <b>Linguistic Scope (English Only):</b> The current NLP tokenizer filters English and standard computer science academic stopwords. Study materials written in regional Indian languages (e.g., Hindi, Tamil, Bengali) cannot currently be tokenized with morphological accuracy.
    </li>
    <li>
      <b>Text-Based Metadata Dependence:</b> The content-based TF-IDF filter evaluates document titles, abstracts, and topic tags. It does not extract text from inside embedded binary PDF files or video lecture audio tracks directly.
    </li>
  </ol>

  <h2 class="sec-heading">8.3 Future Applications &amp; Research Roadmap</h2>

  <p class="body-p">
    In alignment with Section 8 of the approved project proposal, several compelling avenues for future enhancement have been identified:
  </p>

  <ol class="body-ol">
    <li>
      <b>Deep Learning &amp; Neural Collaborative Filtering (NCF):</b> Future iterations will replace the linear matrix dot-product with deep multi-layer neural networks (NCF) that capture complex non-linear student-material interactions and latent cognitive affinities.
    </li>
    <li>
      <b>Dense Semantic Embeddings via Transformers (BERT):</b> Integrating pretrained Transformer models (such as <code>Sentence-BERT</code> or <code>RoBERTa</code>) will enable true semantic understanding, matching search queries with relevant materials even when vocabulary terms share zero literal overlap (e.g., understanding that <i>&ldquo;asymptotic notation&rdquo;</i> relates directly to <i>&ldquo;Big-O analysis&rdquo;</i>).
    </li>
    <li>
      <b>Companion Mobile Application (React Native):</b> Developing a cross-platform mobile client for Android and iOS using React Native, allowing distance-learning students to receive push notifications for newly curated notes and download materials for offline reading.
    </li>
    <li>
      <b>Learning Management System (LMS) Interoperability:</b> Implementing Learning Tools Interoperability (LTI) standards to embed StudyFlow AI recommendation feeds directly inside institutional LMS platforms like Moodle, Canvas, and Google Classroom.
    </li>
    <li>
      <b>Automated Document Quality &amp; Plagiarism Auditing:</b> Building automated text analytics pipelines that evaluate uploaded student notes for readability scores (Flesch-Kincaid), completeness against syllabus topics, and originality.
    </li>
  </ol>
</div>
`;
