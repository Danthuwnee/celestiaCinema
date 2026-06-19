import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { DollarSign, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import adminApi from '../../api/adminApi'
import Loading from '../../components/ui/Loading'

const iconMap = { 'Doanh thu': DollarSign, 'Đã thanh toán': CheckCircle, 'Chờ thanh toán': Clock, 'Đã hủy': XCircle }
const colorMap = { 'Doanh thu': 'from-green-500 to-emerald-600', 'Đã thanh toán': 'from-blue-500 to-indigo-600', 'Chờ thanh toán': 'from-yellow-500 to-orange-600', 'Đã hủy': 'from-red-500 to-pink-600' }

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminApi.getDashboard().then(r => r.data),
  })

  if (isLoading) return <Loading />

  const cards = [
    { label: 'Doanh thu', value: `${(stats?.totalRevenue || 0)?.toLocaleString()}₫` },
    { label: 'Đã thanh toán', value: stats?.paidBookings || 0 },
    { label: 'Chờ thanh toán', value: stats?.pendingBookings || 0 },
    { label: 'Đã hủy', value: stats?.cancelledBookings || 0 },
  ]

  const chartData = stats?.dailyRevenue || []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <TrendingUp size={24} className="text-galaxy-cyan" /> Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = iconMap[card.label]
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`glass-card p-6 bg-gradient-to-br ${colorMap[card.label]} border-0`}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon size={24} className="text-white/80" />
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-sm text-white/70 mt-1">{card.label}</p>
            </motion.div>
          )
        })}
      </div>

      {chartData.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="font-semibold mb-4">Doanh thu theo ngày</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" tick={{ fill: '#7A859F', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7A859F', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1A1F3A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
                formatter={(value) => `${value?.toLocaleString()}₫`}
              />
              <Bar dataKey="revenue" fill="#6C3BFF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
