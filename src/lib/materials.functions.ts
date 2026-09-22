import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'
import { materialReviewSchema, materialSubmissionSchema } from './material-schemas'

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
    query: z.string().default(''),
    subjectId: z.string().default(''),
    type: z.string().default('All'),
    page: z.number().int().default(1),
    limit: z.number().int().default(12),
  }).parse(input))
  .handler(async ({ data, context }) => {
    let query = context.supabase
      .from('materials')
      .select('*, subjects(name), material_authors(*)', { count: 'exact' })
      .eq('approval_status', 'approved')

    if (data.subjectId) {
      query = query.eq('subject_id', data.subjectId)
    }
    if (data.type === 'PDF' || data.type === 'Video' || data.type === 'Article') {
      query = query.eq('type', data.type)
    }

    if (data.query.trim()) {
      const q = data.query.trim()
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    }

    const from = (data.page - 1) * data.limit
    const to = from + data.limit - 1

    const { data: results, error, count } = await query
      .order('average_rating', { ascending: false })
      .range(from, to)

    if (error) throw new Error(error.message)

    return {
      materials: results || [],
      totalCount: count ?? 0,
      page: data.page,
      totalPages: Math.ceil((count ?? 0) / data.limit),
    }
  })