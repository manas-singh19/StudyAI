import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  Check,
  Download,
  MessageCircleQuestion,
  Users,
  Search,
  Sparkles,
  Star,
  BookOpen,
  ArrowUpDown,
} from 'lucide-react'
import { toast } from 'sonner'
import { AdminGuard } from '@/components/study/admin-guard'
import { getAdminComprehensiveReports } from '@/lib/activity.functions'
import { listAdminFeedback, resolveMaterialFeedback } from '@/lib/feedback.functions'
import { Button } from '@/components/ui/button'

type Feedback = {
  id: string
  type: 'question' | 'comment'
  message: string
  status: 'open' | 'resolved'
  created_at: string
  materials: { title: string; subjects: { name: string } | null } | null
}

type StudentActivity = {
  id: string
  name: string
  email: string
  searchesCount: number
  recentQueries: string
  viewsCount: number
  ratingsCount: number
  averageRatingGiven: number
}

type MostRecommended = {
  title: string
  count: number
  avgScore: number
}

type SubjectPopularity = {
  name: string
  count: number
}

type RatingSummary = {
  id: string
  title: string
  subjectName: string
  averageRating: number
  ratingCount: number
  viewCount: number
}

type SystemUsage = {
  totalUsers: number
  totalSearches: number
  totalRecommendations: number
  totalRatings: number
  totalMaterials: number
}

export const Route = createFileRoute('/_authenticated/admin/reports')({
  head: () => ({
    meta: [
      { title: 'BCSP-064 DFD Reports & Analytics | StudyFlow AI' },
      { name: 'description', content: 'Comprehensive DFD Level 1 P6 reports: student activity, top recommendations, search popularity, and rating summaries.' },
      { property: 'og:title', content: 'Reports | StudyFlow AI' },
      { property: 'og:description', content: 'Live academic reports conforming to BCSP-064 specifications.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: Reports,
})

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1']

function Reports() {
  const { user } = Route.useRouteContext()
  const listFeedback = useServerFn(listAdminFeedback)
  const resolveFeedback = useServerFn(resolveMaterialFeedback)
  const getReports = useServerFn(getAdminComprehensiveReports)

  const [studentActivity, setStudentActivity] = useState<StudentActivity[]>([])
  const [mostRecommended, setMostRecommended] = useState<MostRecommended[]>([])
  const [subjectPopularity, setSubjectPopularity] = useState<SubjectPopularity[]>([])
  const [ratingSummary, setRatingSummary] = useState<RatingSummary[]>([])
  const [systemUsage, setSystemUsage] = useState<SystemUsage>({
    totalUsers: 0,
    totalSearches: 0,
    totalRecommendations: 0,
    totalRatings: 0,
    totalMaterials: 0,
  })

  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [sortAsc, setSortAsc] = useState(false)
  const [loading, setLoading] = useState(true)

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
      const data = await getReports()
      setStudentActivity(data.studentActivity)
      setMostRecommended(data.mostRecommended)
      setSubjectPopularity(data.subjectPopularity)
      setRatingSummary(data.ratingSummary)
      setSystemUsage(data.systemUsage)
    } catch (err) {
      console.error('Failed to load comprehensive reports:', err)
      toast.error('Failed to load live database reports')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAllReports()
    void loadFeedback()
  }, [])

  function csv() {
    const text = [
      'Type,Status,Material,Subject,Message,Date',
      ...feedback.map((item) =>
        [
          item.type,
          item.status,
          item.materials?.title ?? '',
          item.materials?.subjects?.name ?? '',
          item.message,
          new Date(item.created_at).toISOString(),
        ]
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(',')
      ),
    ].join('\n')
    const anchor = document.createElement('a')
    anchor.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }))
    anchor.download = 'studyflow-feedback-report.csv'
    anchor.click()
  }

  async function resolve(id: string) {
    try {
      await resolveFeedback({ data: { feedbackId: id, status: 'resolved' } })
      toast.success('Feedback resolved')
      await loadFeedback()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update feedback')
    }
  }

  const sortedRatingSummary = [...ratingSummary].sort((a, b) =>
    sortAsc ? a.averageRating - b.averageRating : b.averageRating - a.averageRating
  )

  const openCount = feedback.filter((item) => item.status === 'open').length

  return (
    <AdminGuard userId={user.id}>
      <div className="page-wrap">
        <div className="page-title flex-row">
          <div>
            <p className="eyebrow">BCSP-064 Section 5.6 Analytics</p>
            <h1>System Reports &amp; Intelligence</h1>
            <p>Full 5-part reporting suite conforming to DFD Level 1 (Process P6).</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={csv}>
              <Download className="size-4" /> Export feedback CSV
            </Button>
            <Button variant="default" onClick={() => void loadAllReports()}>
              Refresh Reports
            </Button>
          </div>
        </div>

        {/* Report 5: System Usage Report */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Users className="size-5 text-primary" /> Report 5: System Usage Overview
          </h2>
          <div className="stats-grid admin-stats">
            <article className="stat">
              <span><Users /></span>
              <div>
                <b>{systemUsage.totalUsers}</b>
                <p>Active Students</p>
              </div>
            </article>
            <article className="stat">
              <span><Search /></span>
              <div>
                <b>{systemUsage.totalSearches}</b>
                <p>Total Searches</p>
              </div>
            </article>
            <article className="stat">
              <span><Sparkles /></span>
              <div>
                <b>{systemUsage.totalRecommendations}</b>
                <p>AI Recommendations</p>
              </div>
            </article>
            <article className="stat">
              <span><Star /></span>
              <div>
                <b>{systemUsage.totalRatings}</b>
                <p>Ratings Given</p>
              </div>
            </article>
            <article className="stat">
              <span><BookOpen /></span>
              <div>
                <b>{systemUsage.totalMaterials}</b>
                <p>Catalog Materials</p>
              </div>
            </article>
          </div>
        </section>

        {/* Charts Grid: Report 2 & Report 3 */}
        <div className="charts-grid mb-10">
          {/* Report 2: Most-Recommended Materials Report */}
          <article className="chart-card">
            <h2>Report 2: Most-Recommended Materials</h2>
            <p>Top learning resources suggested by the AI recommendation engine</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mostRecommended} margin={{ bottom: 25 }}>
                  <XAxis dataKey="title" fontSize={10} interval={0} angle={-25} textAnchor="end" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Times Recommended" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          {/* Report 3: Subject Popularity Report */}
          <article className="chart-card">
            <h2>Report 3: Subject Popularity Report</h2>
            <p>Distribution of student queries across subject categories</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectPopularity}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={95}
                    paddingAngle={3}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {subjectPopularity.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>
        </div>

        {/* Report 1: Student Activity Report */}
        <section className="section-block mb-10">
          <div className="section-heading">
            <div>
              <p className="eyebrow">BCSP-064 Mandatory Report 1</p>
              <h2>Student Activity Report</h2>
              <p className="text-sm text-muted-foreground">
                Individual student search histories, material engagements, and rating behavior.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                <tr>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3 text-center">Searches</th>
                  <th className="p-3">Recent Search Queries</th>
                  <th className="p-3 text-center">Materials Viewed</th>
                  <th className="p-3 text-center">Ratings Given</th>
                  <th className="p-3 text-center">Avg Rating Given</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {studentActivity.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/20">
                    <td className="p-3 font-medium">{student.name}</td>
                    <td className="p-3 text-muted-foreground">{student.email}</td>
                    <td className="p-3 text-center font-semibold">{student.searchesCount}</td>
                    <td className="p-3 max-w-xs truncate text-xs text-muted-foreground" title={student.recentQueries}>
                      {student.recentQueries}
                    </td>
                    <td className="p-3 text-center">{student.viewsCount}</td>
                    <td className="p-3 text-center">{student.ratingsCount}</td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                        <Star className="size-3.5 fill-amber-500 text-amber-500" />
                        {student.averageRatingGiven || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
                {!studentActivity.length && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-muted-foreground">
                      No student activity recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Report 4: Rating Summary Report */}
        <section className="section-block mb-10">
          <div className="section-heading flex justify-between items-center">
            <div>
              <p className="eyebrow">BCSP-064 Mandatory Report 4</p>
              <h2>Rating Summary Report</h2>
              <p className="text-sm text-muted-foreground">
                Material quality analysis sorted by student rating score and volume.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setSortAsc(!sortAsc)}>
              <ArrowUpDown className="size-3.5 mr-1" />
              Sort: {sortAsc ? 'Lowest First' : 'Highest First'}
            </Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                <tr>
                  <th className="p-3">Material Title</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3 text-center">Average Rating</th>
                  <th className="p-3 text-center">Review Count</th>
                  <th className="p-3 text-center">Views</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedRatingSummary.slice(0, 15).map((mat) => (
                  <tr key={mat.id} className="hover:bg-muted/20">
                    <td className="p-3 font-medium">{mat.title}</td>
                    <td className="p-3 text-muted-foreground">{mat.subjectName}</td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-600">
                        <Star className="size-3.5 fill-amber-500 text-amber-500" />
                        {mat.averageRating.toFixed(1)}
                      </span>
                    </td>
                    <td className="p-3 text-center">{mat.ratingCount}</td>
                    <td className="p-3 text-center">{mat.viewCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Learner Feedback Section */}
        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><MessageCircleQuestion /> Learner feedback</p>
              <h2>{openCount} open questions and comments</h2>
            </div>
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