import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Clock, XCircle } from 'lucide-react'
import adminApi from '../../api/adminApi'
import Loading from '../../components/ui/Loading'

export default function AdminShowtimes() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'showtimes'],
    queryFn: () => adminApi.getShowtimes().then(r => r.data),
  })

  const showtimes = data?.content || data || []

  const handleCancel = async (id) => {
    if (!window.confirm('Hủy suất chiếu này?')) return
    await adminApi.cancelShowtime(id)
    queryClient.invalidateQueries({ queryKey: ['admin', 'showtimes'] })
  }

  if (isLoading) return <Loading />

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Clock size={24} className="text-galaxy-cyan" /> Quản lý Suất chiếu</h1>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-text-muted">
              <th className="text-left p-4">Phim</th>
              <th className="text-left p-4 hidden md:table-cell">Phòng</th>
              <th className="text-left p-4">Bắt đầu</th>
              <th className="text-left p-4 hidden md:table-cell">Kết thúc</th>
              <th className="text-right p-4 hidden lg:table-cell">Giá vé</th>
              <th className="text-right p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {showtimes.map((st, i) => (
              <motion.tr key={st.showtimeId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium">{st.movieTitle || st.movie?.title}</td>
                <td className="p-4 hidden md:table-cell text-text-muted">{st.roomName || st.room?.roomName}</td>
                <td className="p-4 text-galaxy-cyan">{new Date(st.startTime).toLocaleString('vi-VN')}</td>
                <td className="p-4 hidden md:table-cell text-text-muted">{new Date(st.endTime).toLocaleString('vi-VN')}</td>
                <td className="p-4 text-right hidden lg:table-cell">{st.basePrice?.toLocaleString()}₫</td>
                <td className="p-4 text-right">
                  {st.status !== 'CANCELLED' && (
                    <button onClick={() => handleCancel(st.showtimeId)} className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 ml-auto text-xs"><XCircle size={14} /> Hủy</button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
