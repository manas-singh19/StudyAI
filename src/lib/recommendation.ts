export type MaterialDoc = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  average_rating: number;
  rating_count: number;
  view_count: number;
  created_at: string;
  submitted_at: string;
  subject_id: string;
  type: 'PDF' | 'Video' | 'Article';
  url: string;
  uploaded_by: string | null;
  approval_status: 'pending' | 'approved' | 'rejected';
  reviewed_at: string | null;
  reviewed_by: string | null;
  rejection_reason: string | null;
  file_path: string | null;
  file_name: string | null;
  file_mime_type: string | null;
  file_size_bytes: number | null;
  author_id: string | null;
  subjects?: { name: string } | null;
  material_authors?: {
    id: string;
    name: string;
    affiliation: string;
    biography: string;
    expertise: string[];
    website_url: string | null;
    image_url: string | null;
  } | null;
};

export type UserRatingRecord = {
  user_id: string;
  material_id: string;
  score: number;
};

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'her', 'here',
  'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'its', 'itself',
  'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very',
  'was', 'wasn\'t', 'we', 'were', 'weren\'t', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'won\'t', 'would', 'wouldn\'t',
  'you', 'your', 'yours', 'yourself', 'yourselves'
]);

// P3.2 Keyword Extractor
export const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((x) => x.length > 1 && !STOP_WORDS.has(x));
};

// Term Frequency
export const tf = (tokens: string[]): Map<string, number> => {
  const m = new Map<string, number>();
  if (!tokens.length) return m;
  for (const t of tokens) {
    m.set(t, (m.get(t) || 0) + 1);
  }
  return m;
};

// P3.3 TF-IDF Computation Engine
export class TfIdfCorpus {
  private idfMap = new Map<string, number>();
  private docTfIdfMap = new Map<string, Map<string, number>>();
  private totalDocs = 0;

  constructor(materials: MaterialDoc[]) {
    this.totalDocs = materials.length;
    const docTokens = new Map<string, string[]>();
    const docFrequency = new Map<string, number>();

    for (const mat of materials) {
      const subject = mat.subjects?.name || '';
      const text = `${mat.title} ${mat.description} ${subject} ${mat.tags.join(' ')}`;
      const tokens = tokenize(text);
      docTokens.set(mat.id, tokens);

      const uniqueTokens = new Set(tokens);
      for (const token of uniqueTokens) {
        docFrequency.set(token, (docFrequency.get(token) || 0) + 1);
      }
    }

    // IDF formula: ln((totalDocs + 1) / (DF + 1)) + 1
    for (const [token, df] of docFrequency.entries()) {
      const idf = Math.log((this.totalDocs + 1) / (df + 1)) + 1;
      this.idfMap.set(token, idf);
    }

    for (const mat of materials) {
      const tokens = docTokens.get(mat.id) || [];
      const termFreq = tf(tokens);
      const vector = new Map<string, number>();

      for (const [term, freq] of termFreq.entries()) {
        const idf = this.idfMap.get(term) || 1;
        const normalizedTf = freq / Math.max(1, tokens.length);
        vector.set(term, normalizedTf * idf);
      }

      this.docTfIdfMap.set(mat.id, vector);
    }
  }

  public vectorForQuery(queryText: string): Map<string, number> {
    const tokens = tokenize(queryText);
    const termFreq = tf(tokens);
    const vector = new Map<string, number>();

    for (const [term, freq] of termFreq.entries()) {
      const idf = this.idfMap.get(term) || (Math.log(this.totalDocs + 1) + 1);
      const normalizedTf = freq / Math.max(1, tokens.length);
      vector.set(term, normalizedTf * idf);
    }
    return vector;
  }

  public getDocVector(materialId: string): Map<string, number> {
    return this.docTfIdfMap.get(materialId) || new Map();
  }
}

// Vector Cosine Similarity
export function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  if (a.size === 0 || b.size === 0) return 0;
  const keys = new Set([...a.keys(), ...b.keys()]);
  let dot = 0, aa = 0, bb = 0;
  for (const k of keys) {
    const x = a.get(k) || 0;
    const y = b.get(k) || 0;
    dot += x * y;
    aa += x * x;
    bb += y * y;
  }
  return aa > 0 && bb > 0 ? dot / (Math.sqrt(aa) * Math.sqrt(bb)) : 0;
}

// P3.4 Collaborative Filter
export function computeCollaborativeScores(
  targetUserId: string | null,
  materials: MaterialDoc[],
  ratings: UserRatingRecord[] = []
): Map<string, number> {
  const scores = new Map<string, number>();
  if (!ratings.length) {
    for (const m of materials) scores.set(m.id, 0);
    return scores;
  }

  const userRatings = new Map<string, Map<string, number>>();
  const materialRatings = new Map<string, Map<string, number>>();

  for (const r of ratings) {
    if (!userRatings.has(r.user_id)) userRatings.set(r.user_id, new Map());
    userRatings.get(r.user_id)!.set(r.material_id, r.score);

    if (!materialRatings.has(r.material_id)) materialRatings.set(r.material_id, new Map());
    materialRatings.get(r.material_id)!.set(r.user_id, r.score);
  }

  const currentUserRatings = targetUserId ? userRatings.get(targetUserId) : null;

  for (const mat of materials) {
    const matRaters = materialRatings.get(mat.id);
    if (!matRaters || matRaters.size === 0) {
      scores.set(mat.id, 0);
      continue;
    }

    if (!currentUserRatings || currentUserRatings.size === 0) {
      const avg = Number(mat.average_rating) / 5;
      const pop = Math.min(1, mat.rating_count / 15);
      scores.set(mat.id, Math.min(1, avg * 0.7 + pop * 0.3));
      continue;
    }

    let weightedScoreSum = 0;
    let simSum = 0;

    for (const [otherUserId, otherScore] of matRaters.entries()) {
      if (otherUserId === targetUserId) continue;
      const otherRatings = userRatings.get(otherUserId);
      if (!otherRatings) continue;

      let dot = 0, sumU = 0, sumO = 0;
      let overlapCount = 0;

      for (const [mid, uScore] of currentUserRatings.entries()) {
        if (otherRatings.has(mid)) {
          const oScore = otherRatings.get(mid)!;
          dot += uScore * oScore;
          sumU += uScore * uScore;
          sumO += oScore * oScore;
          overlapCount++;
        }
      }

      if (overlapCount > 0 && sumU > 0 && sumO > 0) {
        const sim = dot / (Math.sqrt(sumU) * Math.sqrt(sumO));
        weightedScoreSum += sim * (otherScore / 5);
        simSum += Math.abs(sim);
      }
    }

    if (simSum > 0) {
      scores.set(mat.id, Math.min(1, weightedScoreSum / simSum));
    } else {
      const avg = Number(mat.average_rating) / 5;
      const pop = Math.min(1, mat.rating_count / 15);
      scores.set(mat.id, Math.min(1, avg * 0.7 + pop * 0.3));
    }
  }

  return scores;
}

// P3.1 Profile Analyzer
export function buildProfileSearchText(
  profileText: string,
  searchHistoryQueries: string[] = [],
  viewedTitles: string[] = []
): string {
  const parts = [profileText];
  if (searchHistoryQueries.length) {
    parts.push(...searchHistoryQueries.slice(0, 5));
  }
  if (viewedTitles.length) {
    parts.push(...viewedTitles.slice(0, 3));
  }
  return parts.filter(Boolean).join(' ');
}

// P3.5 Score Aggregator
export function rankMaterials(
  materials: MaterialDoc[],
  profileText: string,
  enrolled: string[] = [],
  ratings: UserRatingRecord[] = [],
  userId: string | null = null
) {
  if (!materials.length) return [];

  const corpus = new TfIdfCorpus(materials);
  const queryVector = corpus.vectorForQuery(profileText);
  const collabScores = computeCollaborativeScores(userId, materials, ratings);

  return materials
    .map((material) => {
      const docVector = corpus.getDocVector(material.id);
      const content = cosineSimilarity(queryVector, docVector);
      const subjectScore = enrolled.includes(material.subject_id) ? 1 : 0;
      const quality = Math.min(1, Number(material.average_rating) / 5);
      const collabScore = collabScores.get(material.id) ?? (quality * 0.7);

      const score = Math.min(
        1,
        content * 0.5 + collabScore * 0.25 + subjectScore * 0.15 + quality * 0.1
      );

      let reason = 'Popular learning resource';
      if (content > 0.18) {
        reason = 'High match with your learning interests (TF-IDF similarity)';
      } else if (collabScore > 0.75) {
        reason = 'Recommended based on positive ratings from similar learners';
      } else if (subjectScore) {
        reason = 'Recommended for your enrolled subject';
      } else if (quality > 0.8) {
        reason = 'Top-rated learning resource across students';
      }

      return {
        ...material,
        score: Number(score.toFixed(4)),
        reason,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}
