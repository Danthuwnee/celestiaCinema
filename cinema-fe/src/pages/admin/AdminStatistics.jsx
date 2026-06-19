import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { BarChart3, Calendar } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import adminApi from '../../api/adminApi'
import Loading from '../../components/ui/Loading'

export default function AdminStatistics() {
  const today = new Date().toISOString().split('T')[0]
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]
  const [fromDate, setFromDate] = useState(thirtyDaysAgo)
  const [toDate, setToDate] = useState(today)

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'statistics', fromDate, toDate],
    queryFn: () => adminApi.getRevenue({ from: fromDate, to: toDate }).then(r => r.data),
  })

  const chartData = data?.dailyRevenue || []

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><BarChart3 size={24} className="text-galaxy-cyan" /> Thống kê doanh thu</h1>

      <div className="glass-card p-4 mb-6 flex flex-wrap items-end gap-4">
        <div><label className="text-xs text-text-secondary block mb-1">Từ ngày</label><input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="input-field" /></div>
        <div><label className="text-xs text-text-secondary block mb-1">Đến ngày</label><input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="input-field" /></div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-text-muted" />
          <p className="text-sm">Tổng: <span className="font-bold galaxy-text-gradient">{(data?.totalRevenue || 0)?.toLocaleString()}₫</span></p>
        </div>
      </div>

      {isLoading ? <Loading /> : chartData.length === 0 ? (
        <div className="glass-card p-12 text-center text-text-muted">Không có dữ liệu</div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
          <h3 className="font-semibold mb-4">Doanh thu theo ngày</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" tick={{ fill: '#7A859F', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#7A859F', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1A1F3A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff' }}
                formatter={(value) => `${value?.toLocaleString()}₫`}
              />
              <Bar dataKey="revenue" fill="#6C3BFF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </div>
  )
}
