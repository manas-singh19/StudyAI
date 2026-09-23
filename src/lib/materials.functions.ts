import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'
import { materialReviewSchema, materialSubmissionSchema } from './material-schemas'
import type { MaterialDoc } from './recommendation'
import { buildPrefixTsQuery, dominantSubject } from './search'

async function requireAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' })
  if (error || !data) throw new Error('Forbidden')
}

export const submitMaterial = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => materialSubmissionSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase.from('materials').insert({
      title: data.title,
      description: data.description,
      subject_id: data.subjectId,
      type: data.type,
      url: data.url,
      tags: data.tags,
      author_id: data.authorId ?? null,
      uploaded_by: context.userId,
      approval_status: 'pending',
      file_path: data.filePath ?? null,
      file_name: data.fileName ?? null,
      file_mime_type: data.fileMimeType ?? null,
      file_size_bytes: data.fileSizeBytes ?? null,
    }).select('id').single()
    if (error) throw new Error(error.message)
    return { id: row.id }
  })

export const publishMaterial = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => materialSubmissionSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context)
    const { data: row, error } = await context.supabase.from('materials').insert({
      title: data.title,
      description: data.description,
      subject_id: data.subjectId,
      type: data.type,
      url: data.url,
      tags: data.tags,
      author_id: data.authorId ?? null,
      uploaded_by: context.userId,
      approval_status: 'approved',
      reviewed_by: context.userId,
      reviewed_at: new Date().toISOString(),
      file_path: data.filePath ?? null,
      file_name: data.fileName ?? null,
      file_mime_type: data.fileMimeType ?? null,
      file_size_bytes: data.fileSizeBytes ?? null,
    }).select('id').single()
    if (error) throw new Error(error.message)
    return { id: row.id }
  })

export const reviewMaterial = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => materialReviewSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context)
    const { error } = await context.supabase.from('materials').update({
      approval_status: data.decision,
      reviewed_by: context.userId,
      reviewed_at: new Date().toISOString(),
      rejection_reason: data.decision === 'rejected' ? data.reason : null,
    }).eq('id', data.materialId)
    if (error) throw new Error(error.message)
    return { ok: true }
  })

export const searchMaterialsServer = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({
    query: z.string().max(200).default(''),
    subjectId: z.union([z.string().uuid(), z.literal('')]).default(''),
    type: z.enum(['All', 'PDF', 'Video', 'Article']).default('All'),
    page: z.number().int().min(1).max(1000).default(1),
    limit: z.number().int().min(1).max(50).default(12),
  }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: enrollments } = await context.supabase.from('enrollments').select('subject_id').eq('user_id', context.userId)
    const { data: hits, error } = await context.supabase.rpc('search_materials', {
      _query: buildPrefixTsQuery(data.query) || null,
      _subject_id: data.subjectId || null,
      _type: data.type === 'All' ? null : data.type,
      _preferred_subjects: (enrollments ?? []).map((row) => row.subject_id),
      _limit: data.limit,
      _offset: (data.page - 1) * data.limit,
    })
    if (error) throw new Error(error.message)

    const ids = (hits ?? []).map((hit) => hit.material_id)
    const totalCount = Number(hits?.[0]?.total_count ?? 0)
    let materials: MaterialDoc[] = []
    if (ids.length) {
      const { data: rows, error: rowsError } = await context.supabase
        .from('materials')
        .select('*, subjects(name), material_authors(*)')
        .in('id', ids)
      if (rowsError) throw new Error(rowsError.message)
      const byId = new Map((rows as unknown as MaterialDoc[]).map((row) => [row.id, row]))
      materials = ids.map((id) => byId.get(id)).filter((row): row is MaterialDoc => Boolean(row))
    }

    return {
      materials,
      totalCount,
      page: data.page,
      totalPages: Math.max(1, Math.ceil(totalCount / data.limit)),
      topSubjectId: dominantSubject(materials),
    }
  })