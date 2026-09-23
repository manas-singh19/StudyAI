import { describe, expect, it } from 'vitest'
import { buildAdminReports, type ReportInput } from './reports'

const now = new Date('2026-09-23T12:00:00Z')

const input: ReportInput = {
  profiles: [
    { id: 'admin', name: 'Admin', email: 'admin@example.com', created_at: '2026-01-01T00:00:00Z' },
    { id: 'asha', name: 'Asha', email: 'asha@example.com', created_at: '2026-02-01T00:00:00Z' },
    { id: 'ravi', name: 'Ravi', email: 'ravi@example.com', created_at: '2026-03-01T00:00:00Z' },
  ],
  roles: [
    { user_id: 'admin', role: 'admin' },
    { user_id: 'admin', role: 'student' },
    { user_id: 'asha', role: 'student' },
    { user_id: 'ravi', role: 'student' },
  ],
  searches: [
    { user_id: 'asha', query: 'neural networks', subject_id: 'ai', created_at: '2026-09-23T10:00:00+00:00' },
    { user_id: 'asha', query: 'sql joins', subject_id: 'db', created_at: '2026-09-20T10:00:00+00:00' },
    { user_id: 'ravi', query: 'backprop', subject_id: 'ai', created_at: '2026-09-01T10:00:00+00:00' },
    { user_id: 'ravi', query: 'misc', subject_id: null, created_at: '2026-09-01T11:00:00+00:00' },
  ],
  views: [{ user_id: 'asha', material_id: 'm1', viewed_at: '2026-09-22T09:00:00+00:00' }],
  ratings: [
    { user_id: 'asha', material_id: 'm1', score: 5, created_at: '2026-09-10T00:00:00+00:00', updated_at: '2026-09-10T00:00:00+00:00' },
    { user_id: 'ravi', material_id: 'm1', score: 3, created_at: '2026-09-01T00:00:00+00:00', updated_at: '2026-09-01T00:00:00+00:00' },
    { user_id: 'ravi', material_id: 'm2', score: 4, created_at: '2026-09-01T00:00:00+00:00', updated_at: '2026-09-01T00:00:00+00:00' },
  ],
  runs: [
    { user_id: 'asha', item_count: 2, generated_at: '2026-09-23T11:00:00+00:00' },
    { user_id: 'ravi', item_count: 1, generated_at: '2026-09-01T00:00:00+00:00' },
  ],
  history: [
    { user_id: 'asha', material_id: 'm1', score: '0.9' },
    { user_id: 'asha', material_id: 'm2', score: '0.5' },
    { user_id: 'ravi', material_id: 'm1', score: '0.7' },
  ],
  materials: [
    { id: 'm1', title: 'Neural Networks', average_rating: '4.00', rating_count: 2, view_count: 1, subject_id: 'ai', approval_status: 'approved' },
    { id: 'm2', title: 'SQL Joins', average_rating: '4.00', rating_count: 1, view_count: 0, subject_id: 'db', approval_status: 'approved' },
    { id: 'm3', title: 'Pending draft', average_rating: '0', rating_count: 0, view_count: 0, subject_id: 'db', approval_status: 'pending' },
  ],
  subjects: [
    { id: 'ai', name: 'Artificial Intelligence' },
    { id: 'db', name: 'Databases' },
    { id: 'os', name: 'Operating Systems' },
  ],
}

describe('admin reports (synopsis 5.6)', () => {
  const reports = buildAdminReports(input, now)

  it('Report 1 lists students only, with their history and average rating given', () => {
    expect(reports.studentActivity.map((s) => s.id)).toEqual(['asha', 'ravi'])
    const asha = reports.studentActivity[0]!
    expect(asha.searchHistory.map((h) => h.query)).toEqual(['neural networks', 'sql joins'])
    expect(asha.viewedMaterials[0]?.title).toBe('Neural Networks')
    expect(asha.averageRatingGiven).toBe(5)
    expect(reports.studentActivity[1]!.averageRatingGiven).toBe(3.5)
  })

  it('Report 2 counts real recommendation history', () => {
    expect(reports.mostRecommended[0]).toMatchObject({ materialId: 'm1', count: 2, students: 2, avgScore: 0.8 })
  })

  it('Report 3 groups searches by subject without inventing data', () => {
    expect(reports.subjectPopularity).toEqual([
      { name: 'Artificial Intelligence', count: 2, percent: 50 },
      { name: 'Databases', count: 1, percent: 25 },
      { name: 'Unclassified', count: 1, percent: 25 },
    ])
    expect(buildAdminReports({ ...input, searches: [], history: [] }, now).subjectPopularity).toEqual([])
    expect(buildAdminReports({ ...input, searches: [], history: [] }, now).mostRecommended).toEqual([])
  })

  it('Report 4 summarises ratings per material and per subject', () => {
    expect(reports.ratingSummary.map((m) => m.id)).toEqual(['m1', 'm2'])
    const bySubject = Object.fromEntries(reports.ratingBySubject.map((s) => [s.subjectId, s]))
    expect(bySubject['ai']).toMatchObject({ averageRating: 4, ratingCount: 2, materialsRated: 1 })
    expect(bySubject['db']).toMatchObject({ averageRating: 4, ratingCount: 1 })
    expect(bySubject['os']).toMatchObject({ averageRating: null, ratingCount: 0 })
  })

  it('Report 5 computes daily and weekly active users and totals', () => {
    expect(reports.systemUsage).toMatchObject({
      totalUsers: 3,
      totalStudents: 2,
      dailyActiveUsers: 1,
      weeklyActiveUsers: 1,
      totalSearches: 4,
      searchesThisWeek: 2,
      totalRecommendations: 3,
      recommendationRuns: 2,
      recommendationsThisWeek: 2,
      totalMaterials: 2,
    })
    expect(reports.dailyActivity).toHaveLength(14)
    expect(reports.dailyActivity.at(-1)).toEqual({ date: '2026-09-23', activeUsers: 1, searches: 1, recommendations: 2 })
  })
})
