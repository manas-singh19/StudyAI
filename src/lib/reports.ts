// Synopsis 5.6 report aggregation (DFD Level 1, process P6). Pure so it can be unit tested.

export type ReportInput = {
  profiles: { id: string; name: string; email: string; created_at: string }[]
  roles: { user_id: string; role: string }[]
  searches: { user_id: string; query: string; subject_id: string | null; created_at: string }[]
  views: { user_id: string; material_id: string; viewed_at: string }[]
  ratings: { user_id: string; material_id: string; score: number; created_at: string; updated_at: string }[]
  runs: { user_id: string; item_count: number; generated_at: string }[]
  history: { user_id: string; material_id: string; score: number | string }[]
  materials: { id: string; title: string; average_rating: number | string; rating_count: number; view_count: number; subject_id: string; approval_status: string }[]
  subjects: { id: string; name: string }[]
}

export type StudentActivity = {
  id: string
  name: string
  email: string
  joinedAt: string
  searchesCount: number
  searchHistory: { query: string; at: string }[]
  viewsCount: number
  viewedMaterials: { title: string; at: string }[]
  ratingsCount: number
  averageRatingGiven: number | null
  lastActiveAt: string | null
}

export type MostRecommended = { materialId: string; title: string; label: string; count: number; students: number; avgScore: number }
export type SubjectPopularity = { name: string; count: number; percent: number }
export type RatingSummary = { id: string; title: string; subjectName: string; averageRating: number; ratingCount: number; viewCount: number }
export type SubjectRating = { subjectId: string; name: string; averageRating: number | null; ratingCount: number; materialsRated: number }
export type DailyActivity = { date: string; activeUsers: number; searches: number; recommendations: number }
export type SystemUsage = {
  totalUsers: number
  totalStudents: number
  dailyActiveUsers: number
  weeklyActiveUsers: number
  totalSearches: number
  searchesThisWeek: number
  totalRecommendations: number
  recommendationRuns: number
  recommendationsThisWeek: number
  totalRatings: number
  totalViews: number
  totalMaterials: number
}

export type AdminReports = {
  studentActivity: StudentActivity[]
  mostRecommended: MostRecommended[]
  subjectPopularity: SubjectPopularity[]
  ratingSummary: RatingSummary[]
  ratingBySubject: SubjectRating[]
  systemUsage: SystemUsage
  dailyActivity: DailyActivity[]
}

const DAY_MS = 24 * 60 * 60 * 1000
const HISTORY_LIMIT = 20
const round = (value: number, digits: number) => Number(value.toFixed(digits))
const newestFirst = <T extends { at: string }>(a: T, b: T) => b.at.localeCompare(a.at)

function groupBy<T>(rows: T[], key: (row: T) => string) {
  const map = new Map<string, T[]>()
  for (const row of rows) {
    const k = key(row)
    const list = map.get(k)
    if (list) list.push(row)
    else map.set(k, [row])
  }
  return map
}

// Postgres returns "+00:00" offsets; normalise so timestamps compare correctly as strings.
const iso = (value: string) => new Date(value).toISOString()

export function buildAdminReports(raw: ReportInput, now: Date = new Date()): AdminReports {
  const input: ReportInput = {
    ...raw,
    searches: raw.searches.map((s) => ({ ...s, created_at: iso(s.created_at) })),
    views: raw.views.map((v) => ({ ...v, viewed_at: iso(v.viewed_at) })),
    ratings: raw.ratings.map((r) => ({ ...r, created_at: iso(r.created_at), updated_at: iso(r.updated_at) })),
    runs: raw.runs.map((r) => ({ ...r, generated_at: iso(r.generated_at) })),
  }
  const materialById = new Map(input.materials.map((m) => [m.id, m]))
  const subjectName = new Map(input.subjects.map((s) => [s.id, s.name]))
  const admins = new Set(input.roles.filter((r) => r.role === 'admin').map((r) => r.user_id))

  // Every timestamped action counts as activity for DAU/WAU and "last active".
  const events: { userId: string; at: string }[] = [
    ...input.searches.map((s) => ({ userId: s.user_id, at: s.created_at })),
    ...input.views.map((v) => ({ userId: v.user_id, at: v.viewed_at })),
    ...input.ratings.map((r) => ({ userId: r.user_id, at: r.updated_at > r.created_at ? r.updated_at : r.created_at })),
    ...input.runs.map((r) => ({ userId: r.user_id, at: r.generated_at })),
  ]
  const lastActive = new Map<string, string>()
  for (const e of events) if ((lastActive.get(e.userId) ?? '') < e.at) lastActive.set(e.userId, e.at)

  // Report 1 – Student Activity
  const searchesByUser = groupBy(input.searches, (s) => s.user_id)
  const viewsByUser = groupBy(input.views, (v) => v.user_id)
  const ratingsByUser = groupBy(input.ratings, (r) => r.user_id)
  const studentActivity: StudentActivity[] = input.profiles
    .filter((p) => !admins.has(p.id))
    .map((p) => {
      const searches = searchesByUser.get(p.id) ?? []
      const views = viewsByUser.get(p.id) ?? []
      const ratings = ratingsByUser.get(p.id) ?? []
      return {
        id: p.id,
        name: p.name,
        email: p.email,
        joinedAt: p.created_at,
        searchesCount: searches.length,
        searchHistory: searches.map((s) => ({ query: s.query, at: s.created_at })).sort(newestFirst).slice(0, HISTORY_LIMIT),
        viewsCount: views.length,
        viewedMaterials: views
          .map((v) => ({ title: materialById.get(v.material_id)?.title ?? 'Removed material', at: v.viewed_at }))
          .sort(newestFirst)
          .slice(0, HISTORY_LIMIT),
        ratingsCount: ratings.length,
        averageRatingGiven: ratings.length ? round(ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length, 1) : null,
        lastActiveAt: lastActive.get(p.id) ?? null,
      }
    })
    .sort((a, b) => (b.lastActiveAt ?? '').localeCompare(a.lastActiveAt ?? '') || a.name.localeCompare(b.name))

  // Report 2 – Most-Recommended Materials (top 20 across all engine runs)
  const mostRecommended: MostRecommended[] = [...groupBy(input.history, (h) => h.material_id).entries()]
    .map(([materialId, rows]) => {
      const title = materialById.get(materialId)?.title ?? 'Removed material'
      return {
        materialId,
        title,
        label: title.length > 24 ? `${title.slice(0, 23)}…` : title,
        count: rows.length,
        students: new Set(rows.map((r) => r.user_id)).size,
        avgScore: round(rows.reduce((sum, r) => sum + Number(r.score), 0) / rows.length, 2),
      }
    })
    .sort((a, b) => b.count - a.count || b.avgScore - a.avgScore)
    .slice(0, 20)

  // Report 3 – Subject Popularity (searches per subject)
  const subjectCounts = new Map<string, number>()
  for (const s of input.searches) {
    const name = (s.subject_id && subjectName.get(s.subject_id)) || 'Unclassified'
    subjectCounts.set(name, (subjectCounts.get(name) ?? 0) + 1)
  }
  const subjectPopularity: SubjectPopularity[] = [...subjectCounts.entries()]
    .map(([name, count]) => ({ name, count, percent: round((count / input.searches.length) * 100, 1) }))
    .sort((a, b) => b.count - a.count)

  // Report 4 – Rating Summary, per material and per subject
  const approved = input.materials.filter((m) => m.approval_status === 'approved')
  const ratingSummary: RatingSummary[] = approved
    .map((m) => ({
      id: m.id,
      title: m.title,
      subjectName: subjectName.get(m.subject_id) ?? 'General',
      averageRating: round(Number(m.average_rating), 2),
      ratingCount: m.rating_count,
      viewCount: m.view_count,
    }))
    .sort((a, b) => b.averageRating - a.averageRating || b.ratingCount - a.ratingCount)

  const ratingsBySubject = groupBy(
    input.ratings.filter((r) => materialById.has(r.material_id)),
    (r) => materialById.get(r.material_id)!.subject_id,
  )
  const ratingBySubject: SubjectRating[] = input.subjects
    .map((s) => {
      const rows = ratingsBySubject.get(s.id) ?? []
      return {
        subjectId: s.id,
        name: s.name,
        averageRating: rows.length ? round(rows.reduce((sum, r) => sum + r.score, 0) / rows.length, 2) : null,
        ratingCount: rows.length,
        materialsRated: new Set(rows.map((r) => r.material_id)).size,
      }
    })
    .sort((a, b) => (b.averageRating ?? -1) - (a.averageRating ?? -1) || b.ratingCount - a.ratingCount)

  // Report 5 – System Usage
  const since = (ms: number) => new Date(now.getTime() - ms).toISOString()
  const dayAgo = since(DAY_MS)
  const weekAgo = since(7 * DAY_MS)
  const activeSince = (from: string) => new Set(events.filter((e) => e.at >= from).map((e) => e.userId)).size

  const dailyActivity: DailyActivity[] = []
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today - i * DAY_MS).toISOString().slice(0, 10)
    dailyActivity.push({
      date,
      activeUsers: new Set(events.filter((e) => e.at.slice(0, 10) === date).map((e) => e.userId)).size,
      searches: input.searches.filter((s) => s.created_at.slice(0, 10) === date).length,
      recommendations: input.runs.filter((r) => r.generated_at.slice(0, 10) === date).reduce((sum, r) => sum + r.item_count, 0),
    })
  }

  const systemUsage: SystemUsage = {
    totalUsers: input.profiles.length,
    totalStudents: studentActivity.length,
    dailyActiveUsers: activeSince(dayAgo),
    weeklyActiveUsers: activeSince(weekAgo),
    totalSearches: input.searches.length,
    searchesThisWeek: input.searches.filter((s) => s.created_at >= weekAgo).length,
    totalRecommendations: input.history.length,
    recommendationRuns: input.runs.length,
    recommendationsThisWeek: input.runs.filter((r) => r.generated_at >= weekAgo).reduce((sum, r) => sum + r.item_count, 0),
    totalRatings: input.ratings.length,
    totalViews: input.views.length,
    totalMaterials: approved.length,
  }

  return { studentActivity, mostRecommended, subjectPopularity, ratingSummary, ratingBySubject, systemUsage, dailyActivity }
}
