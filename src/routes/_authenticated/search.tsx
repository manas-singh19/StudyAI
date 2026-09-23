import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { toast } from 'sonner';
import { Search as SearchIcon, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCatalog, openMaterial, type Subject } from '@/lib/catalog';
import { logSearch } from '@/lib/activity.functions';
import { searchMaterialsServer } from '@/lib/materials.functions';
import type { MaterialDoc } from '@/lib/recommendation';
import { MaterialCard } from '@/components/study/material-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/_authenticated/search')({
  validateSearch: (s: Record<string, unknown>): { subject: string; q?: string } => ({
    subject: typeof s['subject'] === 'string' ? s['subject'] : '',
    ...(typeof s['q'] === 'string' && s['q'] ? { q: s['q'] } : {}),
  }),
  head: () => ({
    meta: [
      { title: 'Explore study materials | StudyFlow AI' },
      { name: 'description', content: 'Search and filter curated academic resources.' },
      { property: 'og:title', content: 'Explore | StudyFlow AI' },
      { property: 'og:description', content: 'Find trusted study materials by topic and subject.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Explore,
});

function Explore() {
  const { user } = Route.useRouteContext();
  const logSearchFn = useServerFn(logSearch);
  const searchServerFn = useServerFn(searchMaterialsServer);
  const initial = Route.useSearch();

  const [materials, setMaterials] = useState<MaterialDoc[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [q, setQ] = useState(initial.q ?? '');
  const [type, setType] = useState('All');
  const [subject, setSubject] = useState(initial.subject);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCatalog().then((x) => setSubjects(x.subjects));
  }, []);

  async function executeSearch(queryText: string, subjectId: string, materialType: string, pageNumber: number) {
    setLoading(true);
    try {
      const res = await searchServerFn({
        data: {
          query: queryText,
          subjectId: subjectId || '',
          type: materialType as 'All' | 'PDF' | 'Video' | 'Article',
          page: pageNumber,
          limit: 12,
        },
      });
      setMaterials(res.materials as MaterialDoc[]);
      setTotalCount(res.totalCount);
      setTotalPages(res.totalPages || 1);
      return res;
    } catch (err) {
      console.error('Search failed:', err);
      toast.error('Search failed. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      executeSearch(q, subject, type, page);
    }, 200);
    return () => clearTimeout(timer);
  }, [q, subject, type, page]);

  async function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    if (q.trim().length < 2) {
      toast.error('Enter at least two characters');
      return;
    }
    setPage(1);
    const res = await executeSearch(q, subject, type, 1);
    if (!res) return;
    try {
      // Log the fresh result count; when no subject filter is set, classify by the top results' subject.
      await logSearchFn({
        data: {
          query: q.trim(),
          resultCount: res.totalCount,
          subjectId: subject || res.topSubjectId,
        },
      });
      toast.success('Search saved to your learning history');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save search');
    }
  }

  return (
    <div className="page-wrap">
      <div className="page-title">
        <p className="eyebrow">Curated knowledge library</p>
        <h1>Explore materials</h1>
        <p>Search across trusted resources, topics, and disciplines powered by server-side text indexing.</p>
      </div>

      <section className="search-panel">
        <form className="search-box" onSubmit={submitSearch}>
          <SearchIcon />
          <Input
            aria-label="Search materials"
            placeholder="Try “process scheduling” or “neural networks”"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
          <Button disabled={loading}>{loading ? 'Searching…' : 'Search'}</Button>
        </form>

        <div className="filter-row">
          <SlidersHorizontal />
          <select
            aria-label="Subject"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="segmented">
            {['All', 'PDF', 'Video', 'Article'].map((x) => (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                key={x}
                className={type === x ? 'active' : ''}
                onClick={() => {
                  setType(x);
                  setPage(1);
                }}
              >
                {x}
              </Button>
            ))}
          </div>

          {(q || subject || type !== 'All') && (
            <Button
              variant="ghost"
              onClick={() => {
                setQ('');
                setSubject('');
                setType('All');
                setPage(1);
              }}
            >
              <X />
              Clear
            </Button>
          )}
        </div>
      </section>

      <div className="results-line">
        <b>{totalCount}</b> resources found <span>Database full-text indexed</span>
      </div>

      <div className="card-grid">
        {materials.map((m) => (
          <MaterialCard key={m.id} material={m} onOpen={(x) => openMaterial(x, user.id)} />
        ))}
      </div>

      {!materials.length && !loading && (
        <div className="empty-state">
          <SearchIcon />
          <h2>No materials found</h2>
          <p>Try a broader term or clear a filter.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="size-4" /> Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
