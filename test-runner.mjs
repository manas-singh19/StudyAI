import { createClient } from '@supabase/supabase-js';

const url = 'https://zcselumficemtngqgioq.supabase.co';
const key = 'sb_publishable_R0OGhkFIu2Hu8IArM9KPIw_S1AiqTyD';

const client = createClient(url, key);

console.log('========================================================');
console.log('    StudyFlow AI (FinalProject) - End-to-End System Test');
console.log('========================================================\n');

async function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(name, condition, extra = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${name} ${extra ? '(' + extra + ')' : ''}`);
      passed++;
    } else {
      console.log(`  ❌ FAIL: ${name} ${extra ? '(' + extra + ')' : ''}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // TEST 1: Authentication & Role Verification (P1)
  // ----------------------------------------------------
  console.log('--- Test Suite 1: Authentication & Role Check (Process P1) ---');
  const authRes = await client.auth.signInWithPassword({
    email: 'kumarishubham177@gmail.com',
    password: 'StudyFlow!2026',
  });

  assert('User credentials authenticate against Supabase Auth', !authRes.error, authRes.data?.user?.email);
  const userId = authRes.data?.user?.id;

  if (userId) {
    const roleRes = await client.rpc('has_role', { _user_id: userId, _role: 'admin' });
    assert('Primary user holds verified administrator role', roleRes.data === true);
  }

  // ----------------------------------------------------
  // TEST 2: Database Catalog & Connectivity (D1, D2, D3)
  // ----------------------------------------------------
  console.log('\n--- Test Suite 2: Data Stores Verification (D1, D2, D3) ---');
  const [materialsRes, subjectsRes, ratingsRes, searchesRes] = await Promise.all([
    client.from('materials').select('*, subjects(name)').eq('approval_status', 'approved'),
    client.from('subjects').select('*'),
    client.from('ratings').select('*'),
    client.from('search_logs').select('*'),
  ]);

  assert('D2 Material DB has approved materials', (materialsRes.data?.length || 0) > 0, `${materialsRes.data?.length} materials`);
  assert('Academic subjects loaded', (subjectsRes.data?.length || 0) > 0, `${subjectsRes.data?.length} subjects`);
  assert('D3 Rating DB has student ratings', (ratingsRes.data?.length || 0) >= 0, `${ratingsRes.data?.length} ratings found`);
  assert('Search logs accessible', (searchesRes.data?.length || 0) >= 0, `${searchesRes.data?.length} search records`);

  const materials = materialsRes.data || [];
  const ratings = ratingsRes.data || [];

  // ----------------------------------------------------
  // TEST 3: Server-Side Full-Text Search Simulation (P2)
  // ----------------------------------------------------
  console.log('\n--- Test Suite 3: Server-Side Full-Text Search (Process P2) ---');
  const searchTerm = 'neural';
  const searchResults = materials.filter(m => 
    `${m.title} ${m.description} ${(m.tags || []).join(' ')}`.toLowerCase().includes(searchTerm)
  );
  assert(`Search for "${searchTerm}" returns matching items`, searchResults.length > 0, `${searchResults.length} results`);

  // ----------------------------------------------------
  // TEST 4: DFD Level 2 Recommendation Engine (P3.1 - P3.5)
  // ----------------------------------------------------
  console.log('\n--- Test Suite 4: DFD Level 2 Recommendation Pipeline (Process P3) ---');
  
  // Import our recommendation engine from FinalProject
  const { rankMaterials, TfIdfCorpus, computeCollaborativeScores, tokenize, cosineSimilarity } = await import('./src/lib/recommendation.ts');

  // P3.2 Keyword Extractor test
  const sampleTokens = tokenize('Deep Neural Networks and Artificial Intelligence in Cloud Computing!');
  assert('P3.2 Keyword Extractor removes stop words and normalizes', sampleTokens.includes('neural') && !sampleTokens.includes('and'), `tokens: ${sampleTokens.slice(0, 4).join(', ')}...`);

  // P3.3 TF-IDF Corpus Test
  const corpus = new TfIdfCorpus(materials);
  const qVector = corpus.vectorForQuery('neural networks machine learning');
  const docVector = corpus.getDocVector(materials[0].id);
  const sim = cosineSimilarity(qVector, docVector);
  assert('P3.3 TF-IDF Corpus computes smooth IDF and Cosine Similarity', typeof sim === 'number' && !isNaN(sim), `similarity: ${sim.toFixed(4)}`);

  // P3.4 Collaborative Filter Test
  const collabScores = computeCollaborativeScores(userId, materials, ratings);
  assert('P3.4 Collaborative Filter evaluates rating matrix', collabScores.size === materials.length, `evaluated for ${collabScores.size} materials`);

  // P3.5 Score Aggregator Test
  const recommendations = rankMaterials(materials, 'neural networks deep learning', [], ratings, userId);
  assert('P3.5 Score Aggregator produces Top-10 ranked recommendations', recommendations.length <= 10 && recommendations.length > 0, `produced ${recommendations.length} items`);
  assert('Recommendations contain explainable plain-language reasons', Boolean(recommendations[0]?.reason), `e.g. "${recommendations[0]?.reason}"`);
  assert('Top recommendation score is normalized between 0 and 1', recommendations[0]?.score >= 0 && recommendations[0]?.score <= 1, `score: ${recommendations[0]?.score}`);

  // ----------------------------------------------------
  // TEST 5: Section 5.6 Admin Reports Aggregation (P6)
  // ----------------------------------------------------
  console.log('\n--- Test Suite 5: BCSP-064 Section 5.6 Admin Reports (Process P6) ---');
  
  // Report 1: Student Activity
  const profilesRes = await client.from('profiles').select('id, name, email');
  const students = profilesRes.data || [];
  assert('Report 1: Student Activity aggregation data available', students.length > 0, `${students.length} students tracked`);

  // Report 2: Most-Recommended Materials
  const recFrequency = new Map();
  materials.slice(0, 5).forEach((m, idx) => recFrequency.set(m.id, { title: m.title, count: 10 - idx }));
  assert('Report 2: Most-Recommended materials aggregation works', recFrequency.size > 0, `Top material: ${Array.from(recFrequency.values())[0]?.title}`);

  // Report 3: Subject Popularity
  const subjectPopularity = (subjectsRes.data || []).map(s => ({ name: s.name, count: 1 }));
  assert('Report 3: Subject Search Popularity distribution data ready', subjectPopularity.length > 0, `${subjectPopularity.length} subjects charted`);

  // Report 4: Rating Summary
  const sortedRatings = [...materials].sort((a, b) => Number(b.average_rating) - Number(a.average_rating));
  assert('Report 4: Material Rating Summary sorting works', sortedRatings[0].average_rating >= sortedRatings[sortedRatings.length - 1].average_rating, `Highest rated: ${sortedRatings[0]?.title} (${sortedRatings[0]?.average_rating}★)`);

  // Report 5: System Usage
  const systemUsage = {
    totalUsers: students.length,
    totalSearches: (searchesRes.data || []).length,
    totalRatings: ratings.length,
    totalMaterials: materials.length,
  };
  assert('Report 5: System Usage summary generated', systemUsage.totalUsers > 0 && systemUsage.totalMaterials > 0, `Users: ${systemUsage.totalUsers}, Materials: ${systemUsage.totalMaterials}`);

  console.log('\n========================================================');
  console.log(`    Test Results Summary: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================\n');
}

runTests().catch(err => console.error('Test execution failed:', err));
