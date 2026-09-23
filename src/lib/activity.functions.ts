import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'
import type { MaterialDoc, UserRatingRecord } from '@/lib/recommendation'
import { buildAdminReports } from '@/lib/reports'

type RankedMaterial = MaterialDoc & { score: number; reason: string }

// Stored Top-N (D4) is reused on the dashboard until it is this old; explicit triggers always recompute.
const RECOMMENDATION_TTL_MS = 6 * 60 * 60 * 1000
const PAGE_SIZE = 1000

// PostgREST caps responses at 1000 rows, so report queries page through everything.
async function fetchAll<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>): Promise<T[]> {
  const rows: T[] = []
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await page(from, from + PAGE_SIZE - 1)
    if (error) throw new Error(error.message)
    rows.push(...(data ?? []))
    if (!data || data.length < PAGE_SIZE) return rows
  }
}

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

export const getRecommendations = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({
    refresh: z.boolean().default(false),
    trigger: z.enum(['login', 'manual', 'profile_update', 'rating']).default('login'),
  }).parse(input ?? {}))
  .handler(async ({ data, context }): Promise<{ items: RankedMaterial[]; generatedAt: string | null; cached: boolean }> => {
    if (!data.refresh) {
      const { data: stored, error } = await context.supabase
        .from('recommendations')
        .select('score, reason, generated_at, materials(*, subjects(name), material_authors(*))')
        .eq('user_id', context.userId)
        .order('score', { ascending: false })
      if (error) throw new Error(error.message)
      const items = (stored ?? [])
        .filter((row) => (row.materials as unknown as MaterialDoc | null)?.approval_status === 'approved')
        .map((row) => ({ ...(row.materials as unknown as MaterialDoc), score: Number(row.score), reason: row.reason }))
      const generatedAt = stored?.[0]?.generated_at ?? null
      if (items.length && generatedAt && Date.now() - new Date(generatedAt).getTime() < RECOMMENDATION_TTL_MS) {
        return { items, generatedAt, cached: true }
      }
    }

    // P3 Recommendation Engine
    const materialsRes = await context.supabase
      .from('materials')
      .select('*, subjects(name), material_authors(*)')
      .eq('approval_status', 'approved')
    if (materialsRes.error) throw new Error(materialsRes.error.message)
    const materials = (materialsRes.data || []) as unknown as MaterialDoc[]

    const [profileRes, searchesRes, enrollmentsRes, viewsRes, allRatings] = await Promise.all([
      context.supabase.from('profiles').select('preferences').eq('id', context.userId).single(),
      context.supabase.from('search_logs').select('query').eq('user_id', context.userId).order('created_at', { ascending: false }).limit(10),
      context.supabase.from('enrollments').select('subject_id').eq('user_id', context.userId),
      context.supabase.from('material_views').select('materials(title)').eq('user_id', context.userId).order('viewed_at', { ascending: false }).limit(10),
      fetchAll<UserRatingRecord>((from, to) => context.supabase.from('ratings').select('user_id, material_id, score').order('id').range(from, to)),
    ])

    // P3.1 Profile Analyzer: preferences + recent searches + recently viewed materials
    const preferences = (profileRes.data?.preferences as Record<string, string> | undefined) || {}
    const enrolled = (enrollmentsRes.data || []).map((e) => e.subject_id)
    const recentQueries = (searchesRes.data || []).map((s) => s.query)
    const viewedTitles = [...new Set((viewsRes.data || []).map((v) => (v.materials as { title: string } | null)?.title).filter((t): t is string => Boolean(t)))]
    const baseProfileText = `${preferences['topic'] ?? ''} ${preferences['goal'] ?? ''}`.trim()

    const { buildProfileSearchText, getCachedCorpus, rankMaterials } = await import('@/lib/recommendation')
    const profileText = buildProfileSearchText(baseProfileText, recentQueries, viewedTitles)
    const ranked = rankMaterials(materials, profileText, enrolled, allRatings, context.userId, getCachedCorpus(materials))

    // Store the Top-N in D4 and log the run for the reports.
    const generatedAt = new Date().toISOString()
    const { error: clearError } = await context.supabase.from('recommendations').delete().eq('user_id', context.userId)
    if (clearError) throw new Error(clearError.message)
    if (ranked.length) {
      const { error } = await context.supabase.from('recommendations').insert(
        ranked.map((item) => ({ user_id: context.userId, material_id: item.id, score: item.score, reason: item.reason, generated_at: generatedAt })),
      )
      if (error) throw new Error(error.message)
    }
    const { data: run, error: runError } = await context.supabase
      .from('recommendation_runs')
      .insert({ user_id: context.userId, trigger: data.refresh ? data.trigger : 'login', item_count: ranked.length, generated_at: generatedAt })
      .select('id')
      .single()
    if (runError) throw new Error(runError.message)
    if (ranked.length) {
      const { error } = await context.supabase.from('recommendation_history').insert(
        ranked.map((item, index) => ({ run_id: run.id, user_id: context.userId, material_id: item.id, position: index + 1, score: item.score, generated_at: generatedAt })),
      )
      if (error) throw new Error(error.message)
    }

    return { items: ranked, generatedAt, cached: false }
  })

export const getAdminComprehensiveReports = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' })
    if (!isAdmin) throw new Error('Forbidden: Admin access required')

    const db = context.supabase
    const [profiles, roles, searches, views, ratings, runs, history, materials, subjects] = await Promise.all([
      fetchAll((from, to) => db.from('profiles').select('id, name, email, created_at').order('id').range(from, to)),
      fetchAll((from, to) => db.from('user_roles').select('user_id, role').order('id').range(from, to)),
      fetchAll((from, to) => db.from('search_logs').select('user_id, query, subject_id, created_at').order('id').range(from, to)),
      fetchAll((from, to) => db.from('material_views').select('user_id, material_id, viewed_at').order('id').range(from, to)),
      fetchAll((from, to) => db.from('ratings').select('user_id, material_id, score, created_at, updated_at').order('id').range(from, to)),
      fetchAll((from, to) => db.from('recommendation_runs').select('user_id, item_count, generated_at').order('id').range(from, to)),
      fetchAll((from, to) => db.from('recommendation_history').select('user_id, material_id, score').order('id').range(from, to)),
      fetchAll((from, to) => db.from('materials').select('id, title, average_rating, rating_count, view_count, subject_id, approval_status').order('id').range(from, to)),
      fetchAll((from, to) => db.from('subjects').select('id, name').order('name').range(from, to)),
    ])

    return buildAdminReports({ profiles, roles, searches, views, ratings, runs, history, materials, subjects })
  })
