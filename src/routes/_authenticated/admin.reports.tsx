import { createFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  ArrowUpDown,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  MessageCircleQuestion,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  UserCheck,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { AdminGuard } from '@/components/study/admin-guard'
import { getAdminComprehensiveReports } from '@/lib/activity.functions'
import { listAdminFeedback, resolveMaterialFeedback } from '@/lib/feedback.functions'
import type { AdminReports } from '@/lib/reports'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type Feedback = {
  id: string
  type: 'question' | 'comment'
  message: string
  status: 'open' | 'resolved'
  created_at: string
  materials: { title: string; subjects: { name: string } | null } | null
}

export const Route = createFileRoute('/_authenticated/admin/reports')({
  head: () => ({
    meta: [
      { title: 'Reports & Analytics | StudyFlow AI' },
      { name: 'description', content: 'Student activity, most-recommended materials, subject popularity, rating summary and system usage reports.' },
      { property: 'og:title', content: 'Reports | StudyFlow AI' },
      { property: 'og:description', content: 'Live academic reports for StudyFlow administrators.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Reports,
})

// Fixed categorical order (validated for colour-blind separation); slices beyond 5 fold into "Other".
const SERIES = ['var(--report-series-1)', 'var(--report-series-2)', 'var(--report-series-3)', 'var(--report-series-4)', 'var(--report-series-5)']
const OTHER = 'var(--report-series-other)'
const AXIS_TICK = { fill: 'var(--muted-foreground)', fontSize: 11 }
const TOOLTIP_STYLE = { background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--popover-foreground)', fontSize: 12 }

const EMPTY: AdminReports = {
  studentActivity: [],
  mostRecommended: [],
  subjectPopularity: [],
  ratingSummary: [],
  ratingBySubject: [],
  dailyActivity: [],
  systemUsage: {
    totalUsers: 0,
    totalStudents: 0,
    dailyActiveUsers: 0,
    weeklyActiveUsers: 0,
    totalSearches: 0,
    searchesThisWeek: 0,
    totalRecommendations: 0,
    recommendationRuns: 0,
    recommendationsThisWeek: 0,
    totalRatings: 0,
    totalViews: 0,
    totalMaterials: 0,
  },
}

function downloadCsv(filename: string, header: string[], rows: (string | number | null)[][]) {
  const text = [header, ...rows].map((row) => row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
  const anchor = document.createElement('a')
  anchor.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }))
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(anchor.href)
}

const formatDate = (value: string | null) => (value ? new Date(value).toLocaleString() : '—')
const shortDay = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' })

function ReportHeading({ number, title, description, onExport }: { number: number; title: string; description: string; onExport?: () => void }) {
  return (
    <div className="section-heading flex items-start justify-between gap-3">
      <div>
        <p className="eyebrow">Report {number}</p>
        <h2>{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {onExport && (
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="size-3.5" /> CSV
        </Button>
      )}
    </div>
  )
}

function EmptyChart({ message }: { message: string }) {
  return <div className="grid h-full place-items-center text-center text-sm text-muted-foreground">{message}</div>
}

function Reports() {
  const { user } = Route.useRouteContext()
  const listFeedback = useServerFn(listAdminFeedback)
  const resolveFeedback = useServerFn(resolveMaterialFeedback)
  const getReports = useServerFn(getAdminComprehensiveReports)

  const [reports, setReports] = useState<AdminReports>(EMPTY)
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [studentFilter, setStudentFilter] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [materialSortAsc, setMaterialSortAsc] = useState(false)
  const [subjectSortAsc, setSubjectSortAsc] = useState(false)
  const [showAllMaterials, setShowAllMaterials] = useState(false)

  async function loadFeedback() {
    try {
      setFeedback((await listFeedback()) as Feedback[])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not load feedback')
    }
  }

  async function loadAllReports() {
    try {
      setLoading(true)
      setReports(await getReports())
    } catch (err) {
      console.error('Failed to load reports:', err)
      toast.error('Failed to load live database reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAllReports()
    void loadFeedback()
  }, [])

  async function resolve(id: string) {
    try {
      await resolveFeedback({ data: { feedbackId: id, status: 'resolved' } })
      toast.success('Feedback resolved')
      await loadFeedback()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update feedback')
    }
  }

  const { systemUsage: usage } = reports

  const students = useMemo(() => {
    const needle = studentFilter.trim().toLowerCase()
    return needle
      ? reports.studentActivity.filter((s) => s.name.toLowerCase().includes(needle) || s.email.toLowerCase().includes(needle))
      : reports.studentActivity
  }, [reports.studentActivity, studentFilter])

  const subjectSlices = useMemo(() => {
    const top = reports.subjectPopularity.slice(0, SERIES.length).map((s, i) => ({ ...s, color: SERIES[i]! }))
    const rest = reports.subjectPopularity.slice(SERIES.length)
    if (!rest.length) return top
    const count = rest.reduce((sum, s) => sum + s.count, 0)
    const percent = Number(rest.reduce((sum, s) => sum + s.percent, 0).toFixed(1))
    return [...top, { name: `Other (${rest.length} subjects)`, count, percent, color: OTHER }]
  }, [reports.subjectPopularity])

  const materialRows = useMemo(() => {
    const sorted = [...reports.ratingSummary].sort((a, b) =>
      materialSortAsc ? a.averageRating - b.averageRating : b.averageRating - a.averageRating,
    )
    return showAllMaterials ? sorted : sorted.slice(0, 15)
  }, [reports.ratingSummary, materialSortAsc, showAllMaterials])

  const subjectRows = useMemo(
    () =>
      [...reports.ratingBySubject].sort((a, b) => {
        const x = a.averageRating ?? (subjectSortAsc ? Infinity : -Infinity)
        const y = b.averageRating ?? (subjectSortAsc ? Infinity : -Infinity)
        return subjectSortAsc ? x - y : y - x
      }),
    [reports.ratingBySubject, subjectSortAsc],
  )

  const openCount = feedback.filter((item) => item.status === 'open').length
  const chartHeight = Math.max(240, reports.mostRecommended.length * 30 + 40)

  const usageTiles = [
    { Icon: UserCheck, value: usage.dailyActiveUsers, label: 'Daily active users (24h)' },
    { Icon: CalendarDays, value: usage.weeklyActiveUsers, label: 'Weekly active users (7d)' },
    { Icon: Users, value: usage.totalStudents, label: `Students (${usage.totalUsers} accounts)` },
    { Icon: Search, value: usage.totalSearches, label: `Searches (${usage.searchesThisWeek} this week)` },
    { Icon: Sparkles, value: usage.totalRecommendations, label: `Recommendations generated (${usage.recommendationsThisWeek} this week)` },
    { Icon: Star, value: usage.totalRatings, label: 'Ratings given' },
    { Icon: Eye, value: usage.totalViews, label: 'Material views' },
    { Icon: BookOpen, value: usage.totalMaterials, label: 'Published materials' },
  ]

  return (
    <AdminGuard userId={user.id}>
      <div className="page-wrap">
        <div className="page-title flex-row">
          <div>
            <p className="eyebrow">Reports &amp; analytics</p>
            <h1>System reports</h1>
            <p>Five live reports on learner activity, recommendations, subject demand, ratings and system usage.</p>
          </div>
          <Button onClick={() => void loadAllReports()} disabled={loading}>
            <RefreshCw className="size-4" /> {loading ? 'Loading…' : 'Refresh reports'}
          </Button>
        </div>

        {/* Report 5 – System Usage */}
        <section className="section-block mb-10">
          <ReportHeading
            number={5}
            title="System Usage Report"
            description="Daily and weekly active users, total searches and recommendations generated."
            onExport={() =>
              downloadCsv(
                'studyflow-system-usage.csv',
                ['Date', 'Active users', 'Searches', 'Recommendations generated'],
                reports.dailyActivity.map((d) => [d.date, d.activeUsers, d.searches, d.recommendations]),
              )
            }
          />
          <div className="stats-grid admin-stats">
            {usageTiles.map(({ Icon, value, label }) => (
              <article className="stat" key={label}>
                <span><Icon /></span>
                <div>
                  <b>{value}</b>
                  <p>{label}</p>
                </div>
              </article>
            ))}
          </div>
          <article className="chart-card mt-6">
            <h2>Daily active users – last 14 days</h2>
            <p>Distinct learners who searched, viewed, rated or received recommendations each day (UTC).</p>
            <div className="h-64">
              {reports.dailyActivity.some((d) => d.activeUsers > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reports.dailyActivity} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                    <CartesianGrid vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="date" tickFormatter={shortDay} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--border)' }} />
                    <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: 'var(--muted)' }}
                      contentStyle={TOOLTIP_STYLE}
                      labelFormatter={(date) => shortDay(String(date))}
                      formatter={(value, _name, item) => [
                        `${value} active · ${item.payload.searches} searches · ${item.payload.recommendations} recommendations`,
                        'Activity',
                      ]}
                    />
                    <Bar dataKey="activeUsers" name="Active users" fill="var(--report-series-1)" radius={[4, 4, 0, 0]} maxBarSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No learner activity in the last 14 days." />
              )}
            </div>
          </article>
        </section>

        <div className="charts-grid mb-10">
          {/* Report 2 – Most-Recommended Materials */}
          <article className="chart-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Report 2</p>
                <h2>Most-Recommended Materials</h2>
                <p>Top 20 materials by number of times the AI engine placed them in a learner’s Top-10.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadCsv(
                    'studyflow-most-recommended.csv',
                    ['Material', 'Times recommended', 'Students reached', 'Average match score'],
                    reports.mostRecommended.map((m) => [m.title, m.count, m.students, m.avgScore]),
                  )
                }
              >
                <Download className="size-3.5" /> CSV
              </Button>
            </div>
            <div style={{ height: reports.mostRecommended.length ? chartHeight : 240 }}>
              {reports.mostRecommended.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reports.mostRecommended} layout="vertical" margin={{ top: 8, right: 16, bottom: 0, left: 8 }}>
                    <CartesianGrid horizontal={false} stroke="var(--border)" />
                    <XAxis type="number" allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="label" width={170} tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: 'var(--border)' }} interval={0} />
                    <Tooltip
                      cursor={{ fill: 'var(--muted)' }}
                      contentStyle={TOOLTIP_STYLE}
                      labelFormatter={(_label, payload) => payload?.[0]?.payload.title ?? ''}
                      formatter={(value, _name, item) => [
                        `${value} times · ${item.payload.students} students · avg match ${Math.round(item.payload.avgScore * 100)}%`,
                        'Recommended',
                      ]}
                    />
                    <Bar dataKey="count" name="Times recommended" fill="var(--report-series-1)" radius={[0, 4, 4, 0]} maxBarSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyChart message="No recommendations generated yet. They appear once learners open their dashboards." />
              )}
            </div>
          </article>

          {/* Report 3 – Subject Popularity */}
          <article className="chart-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">Report 3</p>
                <h2>Subject Popularity</h2>
                <p>Share of searches per subject (subject filter, or the subject of the top results).</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadCsv(
                    'studyflow-subject-popularity.csv',
                    ['Subject', 'Searches', 'Share %'],
                    reports.subjectPopularity.map((s) => [s.name, s.count, s.percent]),
                  )
                }
              >
                <Download className="size-3.5" /> CSV
              </Button>
            </div>
            {subjectSlices.length ? (
              <div className="grid items-center gap-4 sm:grid-cols-2">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={subjectSlices} dataKey="count" nameKey="name" innerRadius="55%" outerRadius="90%" paddingAngle={2} stroke="var(--card)" strokeWidth={2}>
                        {subjectSlices.map((slice) => (
                          <Cell key={slice.name} fill={slice.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value, name, item) => [`${value} searches (${item.payload.percent}%)`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <ul className="grid gap-2 text-sm">
                  {subjectSlices.map((slice) => (
                    <li key={slice.name} className="flex items-center gap-2">
                      <span className="size-3 shrink-0 rounded-sm" style={{ background: slice.color }} />
                      <span className="flex-1 truncate">{slice.name}</span>
                      <span className="tabular-nums text-muted-foreground">{slice.count} · {slice.percent}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="h-64">
                <EmptyChart message="No searches recorded yet." />
              </div>
            )}
          </article>
        </div>

        {/* Report 1 – Student Activity */}
        <section className="section-block mb-10">
          <ReportHeading
            number={1}
            title="Student Activity Report"
            description="Each student’s search history, viewed materials and average rating given. Select a row for full history."
            onExport={() =>
              downloadCsv(
                'studyflow-student-activity.csv',
                ['Name', 'Email', 'Joined', 'Searches', 'Search history', 'Materials viewed', 'Viewed materials', 'Ratings given', 'Avg rating given', 'Last active'],
                reports.studentActivity.map((s) => [
                  s.name,
                  s.email,
                  s.joinedAt,
                  s.searchesCount,
                  s.searchHistory.map((h) => h.query).join('; '),
                  s.viewsCount,
                  s.viewedMaterials.map((v) => v.title).join('; '),
                  s.ratingsCount,
                  s.averageRatingGiven,
                  s.lastActiveAt,
                ]),
              )
            }
          />
          <Input className="mb-3 max-w-sm" placeholder="Filter by name or email" value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)} aria-label="Filter students" />
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                <tr>
                  <th className="p-3">Student</th>
                  <th className="p-3 text-center">Searches</th>
                  <th className="p-3">Latest searches</th>
                  <th className="p-3 text-center">Viewed</th>
                  <th className="p-3 text-center">Ratings</th>
                  <th className="p-3 text-center">Avg rating given</th>
                  <th className="p-3">Last active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((student) => {
                  const open = expanded === student.id
                  return (
                    <Fragment key={student.id}>
                      <tr className="cursor-pointer hover:bg-muted/20" onClick={() => setExpanded(open ? null : student.id)} aria-expanded={open}>
                        <td className="p-3">
                          <div className="flex items-center gap-2 font-medium">
                            {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                            <div>
                              {student.name}
                              <div className="text-xs font-normal text-muted-foreground">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-center font-semibold">{student.searchesCount}</td>
                        <td className="max-w-xs truncate p-3 text-xs text-muted-foreground">
                          {student.searchHistory.slice(0, 3).map((h) => h.query).join(', ') || 'None'}
                        </td>
                        <td className="p-3 text-center">{student.viewsCount}</td>
                        <td className="p-3 text-center">{student.ratingsCount}</td>
                        <td className="p-3 text-center">{student.averageRatingGiven ?? '—'}</td>
                        <td className="p-3 text-xs text-muted-foreground">{formatDate(student.lastActiveAt)}</td>
                      </tr>
                      {open && (
                        <tr className="bg-muted/10">
                          <td colSpan={7} className="p-4">
                            <div className="grid gap-6 md:grid-cols-2">
                              <div>
                                <h3 className="mb-2 text-sm font-semibold">Search history</h3>
                                {student.searchHistory.length ? (
                                  <ul className="grid gap-1 text-sm">
                                    {student.searchHistory.map((h, i) => (
                                      <li key={`${h.at}-${i}`} className="flex justify-between gap-3">
                                        <span>{h.query}</span>
                                        <time className="shrink-0 text-xs text-muted-foreground">{formatDate(h.at)}</time>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-muted-foreground">No searches yet.</p>
                                )}
                              </div>
                              <div>
                                <h3 className="mb-2 text-sm font-semibold">Viewed materials</h3>
                                {student.viewedMaterials.length ? (
                                  <ul className="grid gap-1 text-sm">
                                    {student.viewedMaterials.map((v, i) => (
                                      <li key={`${v.at}-${i}`} className="flex justify-between gap-3">
                                        <span>{v.title}</span>
                                        <time className="shrink-0 text-xs text-muted-foreground">{formatDate(v.at)}</time>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-sm text-muted-foreground">No materials viewed yet.</p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
                {!students.length && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-muted-foreground">
                      {loading ? 'Loading…' : 'No student activity recorded yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Report 4 – Rating Summary */}
        <section className="section-block mb-10">
          <ReportHeading
            number={4}
            title="Rating Summary Report"
            description="Average rating per subject and per material, sortable by score."
            onExport={() =>
              downloadCsv(
                'studyflow-rating-summary.csv',
                ['Level', 'Name', 'Subject', 'Average rating', 'Ratings', 'Views'],
                [
                  ...reports.ratingBySubject.map((s) => ['Subject', s.name, s.name, s.averageRating, s.ratingCount, null]),
                  ...reports.ratingSummary.map((m) => ['Material', m.title, m.subjectName, m.averageRating, m.ratingCount, m.viewCount]),
                ],
              )
            }
          />

          <div className="mb-3 mt-2 flex items-center justify-between">
            <h3 className="font-semibold">By subject</h3>
            <Button variant="outline" size="sm" onClick={() => setSubjectSortAsc(!subjectSortAsc)}>
              <ArrowUpDown className="mr-1 size-3.5" /> {subjectSortAsc ? 'Lowest first' : 'Highest first'}
            </Button>
          </div>
          <div className="mb-8 overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                <tr>
                  <th className="p-3">Subject</th>
                  <th className="p-3 text-center">Average rating</th>
                  <th className="p-3 text-center">Ratings</th>
                  <th className="p-3 text-center">Materials rated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subjectRows.map((s) => (
                  <tr key={s.subjectId} className="hover:bg-muted/20">
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3 text-center">
                      {s.averageRating === null ? '—' : (
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <Star className="size-3.5 fill-current text-rating" /> {s.averageRating.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">{s.ratingCount}</td>
                    <td className="p-3 text-center">{s.materialsRated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">By material</h3>
            <Button variant="outline" size="sm" onClick={() => setMaterialSortAsc(!materialSortAsc)}>
              <ArrowUpDown className="mr-1 size-3.5" /> {materialSortAsc ? 'Lowest first' : 'Highest first'}
            </Button>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                <tr>
                  <th className="p-3">Material</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3 text-center">Average rating</th>
                  <th className="p-3 text-center">Ratings</th>
                  <th className="p-3 text-center">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {materialRows.map((m) => (
                  <tr key={m.id} className="hover:bg-muted/20">
                    <td className="p-3 font-medium">{m.title}</td>
                    <td className="p-3 text-muted-foreground">{m.subjectName}</td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 font-semibold">
                        <Star className="size-3.5 fill-current text-rating" /> {m.averageRating.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-3 text-center">{m.ratingCount}</td>
                    <td className="p-3 text-center">{m.viewCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {reports.ratingSummary.length > 15 && (
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => setShowAllMaterials(!showAllMaterials)}>
              {showAllMaterials ? 'Show top 15' : `Show all ${reports.ratingSummary.length} materials`}
            </Button>
          )}
        </section>

        {/* Learner feedback */}
        <section className="section-block">
          <div className="section-heading flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow"><MessageCircleQuestion /> Learner feedback</p>
              <h2>{openCount} open questions and comments</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                downloadCsv(
                  'studyflow-feedback-report.csv',
                  ['Type', 'Status', 'Material', 'Subject', 'Message', 'Date'],
                  feedback.map((item) => [item.type, item.status, item.materials?.title ?? '', item.materials?.subjects?.name ?? '', item.message, new Date(item.created_at).toISOString()]),
                )
              }
            >
              <Download className="size-3.5" /> CSV
            </Button>
          </div>
          <div className="feedback-list">
            {feedback.map((item) => (
              <article key={item.id}>
                <div>
                  <h3>{item.type} · {item.materials?.title}</h3>
                  <p>{item.message}</p>
                  <time>{item.materials?.subjects?.name} · {new Date(item.created_at).toLocaleString()}</time>
                </div>
                {item.status === 'open' ? (
                  <Button variant="outline" onClick={() => void resolve(item.id)}>
                    <Check /> Resolve
                  </Button>
                ) : (
                  <span className="status-badge status-approved">Resolved</span>
                )}
              </article>
            ))}
            {!feedback.length && (
              <div className="empty-state compact">
                <MessageCircleQuestion />
                <h2>No feedback yet</h2>
                <p>Student questions and comments will appear here.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminGuard>
  )
}
