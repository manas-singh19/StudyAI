import { tokenize } from './recommendation'

const MAX_TERMS = 8

// Module 2 – turns free text into a safe prefix tsquery ("neural:* & network:*").
// Only [a-z0-9] survives, so user input can never inject tsquery or PostgREST syntax.
export function buildPrefixTsQuery(text: string): string {
  const terms = tokenize(text.replace(/-/g, ' ')).filter((term) => /^[a-z0-9]+$/.test(term))
  return [...new Set(terms)].slice(0, MAX_TERMS).map((term) => `${term}:*`).join(' & ')
}

// The subject shared by most of the top results; used to classify a search for the Subject Popularity report.
export function dominantSubject(rows: { subject_id: string }[]): string | null {
  const counts = new Map<string, number>()
  for (const row of rows.slice(0, 5)) counts.set(row.subject_id, (counts.get(row.subject_id) ?? 0) + 1)
  let best: string | null = null
  let bestCount = 0
  for (const [subjectId, count] of counts) {
    if (count > bestCount) {
      best = subjectId
      bestCount = count
    }
  }
  return best
}
