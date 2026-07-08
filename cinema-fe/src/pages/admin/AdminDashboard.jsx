import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  DollarSign, CheckCircle, Film, Clock,
  TrendingUp, Ticket
} from 'lucide-react'
import {
  ComposedChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from 'recharts'
import adminApi from '../../api/adminApi'
import Loading from '../../components/ui/Loading'

const COLORS = ['#6C3BFF', '#FF4FD8', '#00D4FF', '#FFB800', '#00E896', '#FF6B6B', '#A78BFA', '#F97316']

function MetricCard({ icon: Icon, label, value, sub, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6"
    >
      <div className="flex items-center gap-3">
        <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-secondary truncate">{label}</p>
          <h4 className="mt-1 font-bold text-2xl text-white">{value}</h4>
          {sub && (
            <span className="text-xs text-emerald-400">{sub}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function StatusBadge({ status }) {
  const map = {
    PAID: 'bg-emerald-500/20 text-emerald-400',
    PENDING: 'bg-amber-500/20 text-amber-400',
    CANCELLED: 'bg-red-500/20 text-red-400',
    REFUNDED: 'bg-purple-500/20 text-purple-400',
  }
  const labels = {
    PAID: 'Đã thanh toán',
    PENDING: 'Chờ thanh toán',
    CANCELLED: 'Đã huỷ',
    REFUNDED: 'Hoàn tiền',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-500/20 text-gray-400'}`}>
      {labels[status] || status}
    </span>
  )
}

export default function AdminDashboard() {
  const [period, setPeriod] = useState('7d')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const today = new Date()
  const fmt = (d) => d.toISOString().split('T')[0]

  let startDate
  if (period === 'custom' && customStart) {
    startDate = customStart
  } else {
    const d = new Date(today)
    if (period === '1m') d.setMonth(d.getMonth() - 1)
    else if (period === '1y') d.setFullYear(d.getFullYear() - 1)
    else d.setDate(d.getDate() - 7)
    startDate = fmt(d)
  }
  const endDate = customEnd || fmt(today)

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminApi.getDashboard().then(r => r.data),
    refetchInterval: 30000,
  })

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['admin', 'revenue', period, startDate, endDate],
    queryFn: () => adminApi.getRevenue(startDate, endDate).then(r => r.data),
    placeholderData: period === '7d' ? { dailyRevenue: stats?.dailyRevenue || [] } : undefined,
    refetchInterval: 30000,
  })

  if (isLoading) return <Loading />

  const {
    totalRevenue = 0, paidBookings = 0, pendingBookings = 0,
    activeMovies = 0, comingSoonMovies = 0, totalMovies = 0,
    dailyRevenue = [], recentBookings = [], popularMovies = [],
    genreDistribution = [],
  } = stats || {}

  const totalBookings = paidBookings + pendingBookings

  const cards = [
    { icon: DollarSign, label: 'Doanh thu', value: `${totalRevenue?.toLocaleString()}₫`, sub: 'Tổng doanh thu', color: 'bg-emerald-500/20' },
    { icon: CheckCircle, label: 'Đã thanh toán', value: paidBookings?.toLocaleString(), sub: `/${totalBookings} đặt vé`, color: 'bg-blue-500/20' },
    { icon: Film, label: 'Phim đang chiếu', value: activeMovies, sub: `+${comingSoonMovies} sắp chiếu`, color: 'bg-purple-500/20' },
    { icon: Clock, label: 'Chờ thanh toán', value: pendingBookings, sub: 'Cần xử lý', color: 'bg-amber-500/20' },
  ]

  const chartData = revenueData?.dailyRevenue || []
  const todayRevenue = dailyRevenue?.length > 0 ? dailyRevenue[dailyRevenue.length - 1]?.revenue || 0 : 0
  const periodLabels = { '7d': '7 ngày', '1m': '1 tháng', '1y': '1 năm' }
  const periodLabel = period === 'custom' ? `${customStart || '...'} → ${customEnd || '...'}` : periodLabels[period] || ''

  const isMonthly = period === '1y' && chartData.length > 0
  const displayData = isMonthly
    ? Object.values(
        chartData.reduce((acc, d) => {
          const m = d.date.substring(0, 7)
          if (!acc[m]) acc[m] = { date: m, revenue: 0 }
          acc[m].revenue += d.revenue
          return acc
        }, {})
      )
    : chartData

  const lastRevenue = displayData?.length > 0 ? displayData[displayData.length - 1]?.revenue || 0 : 0
  const prevRevenue = displayData?.length > 1 ? displayData[displayData.length - 2]?.revenue || 0 : 0
  const revenueChange = prevRevenue > 0 ? ((lastRevenue - prevRevenue) / prevRevenue * 100).toFixed(1) : null

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-white flex items-center gap-2">
          <TrendingUp size={22} className="text-galaxy-cyan" /> Dashboard
        </h1>
        <p className="mt-1 text-sm text-text-secondary">Tổng quan hệ thống rạp chiếu phim Celestia</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, i) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>

      {/* Chart Row */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Revenue Bar Chart */}
        <div className="col-span-12 xl:col-span-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6 h-full">
            <div className="flex items-start justify-between mb-5 gap-3">
              <div className="shrink-0">
                <h3 className="text-base font-semibold text-white">Doanh thu {periodLabel}</h3>
                <p className="mt-0.5 text-xs text-text-secondary">Biến động doanh thu</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-end">
                <div className="flex bg-white/[0.03] rounded-xl p-0.5 border border-white/10">
                  {['7d', '1m', '1y'].map(p => (
                    <button key={p} onClick={() => { setPeriod(p); setCustomStart(''); setCustomEnd('') }}
                      className={`px-3 py-1.5 text-xs rounded-lg transition-colors font-medium ${period === p ? 'bg-[#6C3BFF] text-white' : 'text-text-muted hover:text-white'}`}>
                      {periodLabels[p]}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <input type="date" value={customStart} onChange={(e) => { setCustomStart(e.target.value); setPeriod('custom') }}
                    max={customEnd || fmt(today)} className="bg-white/[0.03] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white w-[130px] [color-scheme:dark]" />
                  <span className="text-text-muted text-xs">→</span>
                  <input type="date" value={customEnd} onChange={(e) => { setCustomEnd(e.target.value); setPeriod('custom') }}
                    min={customStart} max={fmt(today)} className="bg-white/[0.03] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white w-[130px] [color-scheme:dark]" />
                </div>
                {revenueChange !== null && period !== 'custom' && (
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                    revenueChange >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    <TrendingUp size={12} />
                    {revenueChange >= 0 ? '+' : ''}{revenueChange}%
                  </span>
                )}
              </div>
            </div>
            {revenueLoading && chartData.length === 0 ? (
              <div className="flex items-center justify-center h-[280px] text-text-muted text-sm">Đang tải...</div>
            ) : chartData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={displayData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: '#7A859F', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    interval={isMonthly ? 0 : period === '7d' ? 0 : 'preserveStart'}
                    tickFormatter={(v) => {
                      if (isMonthly) {
                        const d = new Date(v + '-02')
                        return `Th${d.getMonth() + 1}`
                      }
                      const d = new Date(v)
                      return `${d.getDate()}/${d.getMonth() + 1}`
                    }}
                  />
                  <YAxis
                    tick={{ fill: '#7A859F', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1A1F3A',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      color: '#fff',
                      fontSize: 13,
                    }}
                    formatter={(value, name) => [`${value?.toLocaleString()}₫`, name === 'revenue' ? 'Doanh thu' : name]}
                    labelFormatter={(v) => {
                      if (isMonthly) {
                        const d = new Date(v + '-02')
                        return `Tháng ${d.getMonth() + 1}/${d.getFullYear()}`
                      }
                      const d = new Date(v)
                      return d.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })
                    }}
                  />
                  <Bar dataKey="revenue" fill="#6C3BFF" radius={[6, 6, 0, 0]} maxBarSize={isMonthly ? 60 : 40} />
                  <Line type="monotone" dataKey="revenue" stroke="#00D4FF" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-text-muted text-sm">Chưa có dữ liệu</div>
            )}
          </div>
        </div>

        {/* Summary Card */}
        <div className="col-span-12 xl:col-span-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6 h-full flex flex-col">
            <div>
              <h3 className="text-base font-semibold text-white">Tổng quan</h3>
              <p className="mt-0.5 text-xs text-text-secondary mb-5">Thông số hệ thống</p>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <DollarSign size={15} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Hôm nay</p>
                    <p className="text-sm font-semibold text-white">{todayRevenue?.toLocaleString()}₫</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/15 flex items-center justify-center">
                    <Film size={15} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Tổng phim</p>
                    <p className="text-sm font-semibold text-white">{totalMovies} phim</p>
                  </div>
                </div>
                <span className="text-xs text-text-muted">{activeMovies} đang chiếu</span>
              </div>

              <div className="flex items-center justify-between py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
                    <Ticket size={15} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Tổng đặt vé</p>
                    <p className="text-sm font-semibold text-white">{totalBookings} vé</p>
                  </div>
                </div>
                <span className="text-xs text-text-muted">{paidBookings} đã TT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Đặt vé gần đây</h3>
            <p className="mt-0.5 text-xs text-text-secondary">{recentBookings?.length || 0} giao dịch mới nhất</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-3 pr-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Phim</th>
                <th className="py-3 pr-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Khách hàng</th>
                <th className="py-3 pr-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Suất</th>
                <th className="py-3 pr-4 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Trạng thái</th>
                <th className="py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">Tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentBookings?.length > 0 ? recentBookings.slice(0, 8).map((b, i) => (
                <tr key={b.bookingId || i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4">
                    <p className="text-sm font-medium text-white truncate max-w-[180px]">{b.movieTitle}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="text-sm text-text-secondary">{b.customerName}</p>
                  </td>
                  <td className="py-3 pr-4">
                    <p className="text-sm text-text-secondary text-xs">
                      {b.showtime ? new Date(b.showtime).toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </p>
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-sm font-medium text-white">{b.totalAmount?.toLocaleString()}₫</span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-muted text-sm">Chưa có giao dịch nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Popular Movies */}
        <div className="col-span-12 xl:col-span-7">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
            <h3 className="text-base font-semibold text-white mb-4">Phim bán chạy</h3>
            {popularMovies?.length > 0 ? (
              <div className="space-y-3">
                {popularMovies.map((m, i) => {
                  const maxBookings = popularMovies[0]?.totalBookings || 1
                  const pct = (m.totalBookings / maxBookings) * 100
                  return (
                    <div key={m.title} className="flex items-center gap-3">
                      <span className="w-5 text-xs font-medium text-text-muted text-right">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-white truncate">{m.title}</p>
                          <span className="text-xs text-text-muted shrink-0 ml-2">{m.totalBookings} vé</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: COLORS[i % COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-text-muted text-sm">Chưa có dữ liệu</div>
            )}
          </div>
        </div>

        {/* Genre Distribution */}
        <div className="col-span-12 xl:col-span-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6">
            <h3 className="text-base font-semibold text-white mb-4">Thể loại phim</h3>
            {genreDistribution?.length > 0 ? (
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={genreDistribution}
                      dataKey="movieCount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {genreDistribution.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#1A1F3A',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 12,
                        color: '#fff',
                        fontSize: 12,
                      }}
                      formatter={(value, name) => [`${value} phim`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mt-2">
                  {genreDistribution.map((g, i) => (
                    <div key={g.name} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-xs text-text-secondary">{g.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-text-muted text-sm">Chưa có dữ liệu</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
