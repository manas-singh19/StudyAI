import { describe,expect,it } from 'vitest';
import { buildProfileSearchText,cosineSimilarity,getCachedCorpus,rankMaterials,tokenize,type MaterialDoc } from './recommendation';
import { coldStartSchema, materialReviewSchema, materialSubmissionSchema } from './material-schemas';
const approval={submitted_at:'2026-01-01',uploaded_by:null,approval_status:'approved' as const,reviewed_at:'2026-01-01',reviewed_by:null,rejection_reason:null,file_path:null,file_name:null,file_mime_type:null,file_size_bytes:null,author_id:null};
const docs:MaterialDoc[]=[{...approval,id:'1',title:'Neural Networks',description:'Deep learning foundations',tags:['ai'],average_rating:4.8,rating_count:20,view_count:0,created_at:'2026-01-01',subject_id:'ai',type:'Video',url:'https://example.com',subjects:{name:'Artificial Intelligence'}},{...approval,id:'2',title:'SQL Joins',description:'Relational database queries',tags:['database'],average_rating:4.2,rating_count:5,view_count:0,created_at:'2026-01-01',subject_id:'db',type:'PDF',url:'https://example.com',subjects:{name:'Database Management'}}];
describe('recommendation ranking', () => {
  it('normalizes useful terms', () => expect(tokenize('The Neural Networks!')).toEqual(['neural', 'networks']));
  it('returns one for identical vectors', () => expect(cosineSimilarity(new Map([['ai', 1]]), new Map([['ai', 1]]))).toBe(1));
  it('ranks the strongest content match first using TF-IDF', () => expect(rankMaterials(docs, 'deep neural learning')[0]?.id).toBe('1'));
  it('provides an explainable reason for cold-start results', () => expect(rankMaterials(docs, '')[0]?.reason).toBeTruthy());
  it('incorporates collaborative ratings when provided', () => {
    const ratings = [
      { user_id: 'user1', material_id: '2', score: 5 },
      { user_id: 'user2', material_id: '2', score: 5 },
      { user_id: 'user2', material_id: '1', score: 2 },
      { user_id: 'target', material_id: '1', score: 2 },
    ];
    const ranked = rankMaterials(docs, '', [], ratings, 'target');
    expect(ranked.length).toBe(2);
  });
});
describe('material workflow validation',()=>{it('requires a link or file',()=>expect(materialSubmissionSchema.safeParse({title:'Valid title',description:'A long enough useful description',subjectId:'00000000-0000-4000-8000-000000000000',type:'PDF',url:'',tags:[]}).success).toBe(false));it('requires rejection feedback',()=>expect(materialReviewSchema.safeParse({materialId:'00000000-0000-4000-8000-000000000000',decision:'rejected',reason:'bad'}).success).toBe(false));it('requires all cold-start signals',()=>expect(coldStartSchema.safeParse({subjectId:'00000000-0000-4000-8000-000000000000',topic:'AI',goal:'Pass my semester exam'}).success).toBe(true))});
describe('recommendation engine performance (synopsis 5.5)', () => {
  const words = ['neural','network','database','query','process','scheduling','memory','compiler','graph','sorting','algorithm','security','cloud','python','java','statistics','calculus','physics','economics','marketing'];
  const many: MaterialDoc[] = Array.from({ length: 1200 }, (_, i) => ({
    ...docs[0]!,
    id: `m${i}`,
    title: `${words[i % words.length]} ${words[(i * 7) % words.length]} lesson ${i}`,
    description: `A study guide on ${words[(i * 3) % words.length]} and ${words[(i * 11) % words.length]} for semester exams`,
    tags: [words[(i * 5) % words.length]!],
    subject_id: `s${i % 12}`,
    average_rating: (i % 5) + 1,
    rating_count: i % 20,
  }));
  const ratings = Array.from({ length: 5000 }, (_, i) => ({ user_id: `u${i % 200}`, material_id: `m${(i * 13) % 1200}`, score: (i % 5) + 1 }));

  it('ranks 1200 materials with 5000 ratings in under a second and returns a Top-10', () => {
    const started = performance.now();
    const ranked = rankMaterials(many, 'neural network scheduling', ['s1'], ratings, 'u1');
    expect(performance.now() - started).toBeLessThan(1000);
    expect(ranked).toHaveLength(10);
    expect(ranked[0]!.score).toBeGreaterThanOrEqual(ranked[9]!.score);
  });

  it('reuses cached TF-IDF vectors until a material changes', () => {
    const first = getCachedCorpus(many);
    expect(getCachedCorpus([...many])).toBe(first);
    const edited = many.map((m, i) => (i === 0 ? { ...m, updated_at: '2026-09-23T00:00:00Z' } : m));
    expect(getCachedCorpus(edited)).not.toBe(first);
  });

  it('uses viewed materials as profile signals (P3.1)', () => {
    expect(buildProfileSearchText('ai', ['q1'], ['Neural Networks'])).toBe('ai q1 Neural Networks');
  });
});
