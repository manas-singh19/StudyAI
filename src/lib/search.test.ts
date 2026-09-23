import { describe, expect, it } from 'vitest'
import { buildPrefixTsQuery, dominantSubject } from './search'

describe('full-text search query builder', () => {
  it('builds an AND prefix query from useful terms', () => expect(buildPrefixTsQuery('Process Scheduling')).toBe('process:* & scheduling:*'))
  it('drops stop words and duplicates', () => expect(buildPrefixTsQuery('the basics of the basics')).toBe('basics:*'))
  it('splits hyphenated words', () => expect(buildPrefixTsQuery('peer-to-peer')).toBe('peer:*'))
  it('strips tsquery and PostgREST syntax so input cannot inject filters', () => {
    expect(buildPrefixTsQuery("sql),title.eq.x & !foo | bar:* 'x'")).toBe('sql:* & title:* & eq:* & foo:* & bar:*')
  })
  it('returns an empty query for input with no searchable terms', () => expect(buildPrefixTsQuery('  !!  the ')).toBe(''))
  it('caps the number of terms', () => expect(buildPrefixTsQuery('aa bb cc dd ee ff gg hh ii jj').split(' & ')).toHaveLength(8))
})

describe('dominant subject', () => {
  it('picks the most common subject among the top results', () =>
    expect(dominantSubject([{ subject_id: 'ai' }, { subject_id: 'db' }, { subject_id: 'ai' }])).toBe('ai'))
  it('returns null without results', () => expect(dominantSubject([])).toBeNull())
})
