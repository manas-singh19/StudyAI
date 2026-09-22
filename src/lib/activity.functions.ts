import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

export const getMyActivityStats = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [subjects, searches, ratings, views] = await Promise.all([
      context.supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('user_id', context.userId),
      context.supabase.from('search_logs').select('*', { count: 'exact', head: true }).eq('user_id', context.userId),
      context.supabase.from('ratings').select('*', { count: 'exact', head: true }).eq('user_id', context.userId),
      context.supabase.from('material_views').select('*', { count: 'exact', head: true }).eq('user_id', context.userId),
    ])
    return { subjects: subjects.count ?? 0, searches: searches.count ?? 0, ratings: ratings.count ?? 0, views: views.count ?? 0 }
  })

export const logSearch = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ query: z.string().trim().min(2).max(200), resultCount: z.number().int().min(0), subjectId: z.string().uuid().nullable() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from('search_logs').insert({ user_id: context.userId, query: data.query, result_count: data.resultCount, subject_id: data.subjectId })
    if (error) throw new Error(error.message)
    return { ok: true }
  })

export const saveRecommendations = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ items: z.array(z.object({ materialId: z.string().uuid(), score: z.number().min(0).max(1), reason: z.string().min(2).max(300) })).max(10) }).parse(input))
  .handler(async ({ data, context }) => {
    const { error: clearError } = await context.supabase.from('recommendations').delete().eq('user_id', context.userId)
    if (clearError) throw new Error(clearError.message)
    if (!data.items.length) return { ok: true }
    const { error } = await context.supabase.from('recommendations').insert(data.items.map((item) => ({ user_id: context.userId, material_id: item.materialId, score: item.score, reason: item.reason })))
    if (error) throw new Error(error.message)
    return { ok: true }
  })

export const generateServerRecommendations = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const materialsRes = await context.supabase
      .from('materials')
      .select('*, subjects(name), material_authors(*)')
      .eq('approval_status', 'approved')

    if (materialsRes.error) throw new Error(materialsRes.error.message)
    const materials = (materialsRes.data || []) as unknown as import('@/lib/recommendation').MaterialDoc[]

    const [profileRes, searchesRes, enrollmentsRes, ratingsRes] = await Promise.all([
      context.supabase.from('profiles').select('*').eq('id', context.userId).single(),
      context.supabase.from('search_logs').select('query').eq('user_id', context.userId).order('created_at', { ascending: false }).limit(10),
      context.supabase.from('enrollments').select('subject_id').eq('user_id', context.userId),
      context.supabase.from('ratings').select('user_id, material_id, score'),
    ])

    const preferences = (profileRes.data?.preferences as Record<string, string> | undefined) || {}
    const enrolled = (enrollmentsRes.data || []).map((e) => e.subject_id)
    const recentQueries = (searchesRes.data || []).map((s) => s.query)
    const allRatings = (ratingsRes.data || []) as import('@/lib/recommendation').UserRatingRecord[]

    const baseProfileText = `${preferences['topic'] ?? ''} ${preferences['goal'] ?? ''}`.trim()
    const { buildProfileSearchText, rankMaterials } = await import('@/lib/recommendation')
    const profileText = buildProfileSearchText(baseProfileText, recentQueries)

    const ranked = rankMaterials(materials, profileText, enrolled, allRatings, context.userId)

    if (ranked.length > 0) {
      await context.supabase.from('recommendations').delete().eq('user_id', context.userId)
      await context.supabase.from('recommendations').insert(
        ranked.map((item) => ({
          user_id: context.userId,
          material_id: item.id,
          score: item.score,
          reason: item.reason,
        }))
      )
    }

    return { items: ranked, profileText, enrolled }
  })

export const getAdminComprehensiveReports = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' })
    if (!isAdmin) throw new Error('Forbidden: Admin access required')

    const [
      profilesRes,
      searchesRes,
      viewsRes,
      ratingsRes,
      recsRes,
      materialsRes,
      subjectsRes,
    ] = await Promise.all([
      context.supabase.from('profiles').select('id, name, email, created_at'),
      context.supabase.from('search_logs').select('id, user_id, query, subject_id, created_at'),
      context.supabase.from('material_views').select('id, user_id, material_id'),
      context.supabase.from('ratings').select('id, user_id, material_id, score, review, created_at'),
      context.supabase.from('recommendations').select('id, user_id, material_id, score, materials(title, subject_id)'),
      context.supabase.from('materials').select('id, title, average_rating, rating_count, view_count, subject_id, subjects(name)'),
      context.supabase.from('subjects').select('id, name'),
    ])

    const profiles = profilesRes.data || []
    const searches = searchesRes.data || []
    const views = viewsRes.data || []
    const ratings = ratingsRes.data || []
    const recommendations = recsRes.data || []
    const materials = materialsRes.data || []
    const subjects = subjectsRes.data || []

    const subjectMap = new Map(subjects.map((s) => [s.id, s.name]))

    const studentActivity = profiles.map((p) => {
      const userSearches = searches.filter((s) => s.user_id === p.id)
      const userViews = views.filter((v) => v.user_id === p.id)
      const userRatings = ratings.filter((r) => r.user_id === p.id)
      const avgScore = userRatings.length
        ? Number((userRatings.reduce((sum, r) => sum + r.score, 0) / userRatings.length).toFixed(1))
        : 0
      const recentQueries = userSearches
        .slice(-3)
        .map((s) => s.query)
        .join(', ')

      return {
        id: p.id,
        name: p.name,
        email: p.email,
        searchesCount: userSearches.length,
        recentQueries: recentQueries || 'None',
        viewsCount: userViews.length,
        ratingsCount: userRatings.length,
        averageRatingGiven: avgScore,
      }
    })

    const recFrequency = new Map<string, { title: string; count: number; avgScore: number; sumScore: number }>()
    for (const r of recommendations) {
      const title = (r.materials as any)?.title || 'Unknown Material'
      const entry = recFrequency.get(r.material_id) || { title, count: 0, avgScore: 0, sumScore: 0 }
      entry.count += 1
      entry.sumScore += Number(r.score)
      entry.avgScore = Number((entry.sumScore / entry.count).toFixed(2))
      recFrequency.set(r.material_id, entry)
    }
    const mostRecommended = Array.from(recFrequency.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)

    if (!mostRecommended.length) {
      materials.slice(0, 10).forEach((m) => {
        mostRecommended.push({
          title: m.title.length > 20 ? m.title.slice(0, 20) + '…' : m.title,
          count: m.rating_count || 1,
          avgScore: Number((Number(m.average_rating) / 5).toFixed(2)),
          sumScore: Number(m.average_rating),
        })
      })
    }

    const subjectSearchCounts = new Map<string, number>()
    for (const s of searches) {
      const sName = s.subject_id ? subjectMap.get(s.subject_id) || 'General' : 'General'
      subjectSearchCounts.set(sName, (subjectSearchCounts.get(sName) || 0) + 1)
    }
    const subjectPopularity = Array.from(subjectSearchCounts.entries()).map(([name, count]) => ({
      name,
      count,
    }))
    if (!subjectPopularity.length) {
      subjects.forEach((s) => {
        subjectPopularity.push({ name: s.name.split(' ')[0] ?? s.name, count: 1 })
      })
    }

    const ratingSummary = materials.map((m) => ({
      id: m.id,
      title: m.title,
      subjectName: (m.subjects as any)?.name || 'General',
      averageRating: Number(Number(m.average_rating).toFixed(1)),
      ratingCount: m.rating_count,
      viewCount: m.view_count,
    })).sort((a, b) => b.averageRating - a.averageRating)

    const systemUsage = {
      totalUsers: profiles.length,
      totalSearches: searches.length,
      totalRecommendations: recommendations.length,
      totalRatings: ratings.length,
      totalMaterials: materials.length,
    }

    return {
      studentActivity,
      mostRecommended,
      subjectPopularity,
      ratingSummary,
      systemUsage,
    }
  })
