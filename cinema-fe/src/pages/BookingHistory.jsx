import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Clock, Film, Ticket, ChevronRight, AlertCircle } from 'lucide-react'
import bookingApi from '../api/bookingApi'
import Badge from '../components/ui/Badge'
import Loading from '../components/ui/Loading'

const statusMap = { PAID: 'Đã thanh toán', PENDING: 'Chờ thanh toán', CANCELLED: 'Đã hủy' }

export default function BookingHistory() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingApi.getUserBookings({ page: 0, size: 20 }).then(r => r.data),
  })

  const bookings = data?.content || data || []

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Clock size={24} className="text-galaxy-cyan" /> Lịch sử đặt vé
      </h1>

      {isLoading ? <Loading /> : error ? (
        <div className="glass-card p-12 text-center">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-3" />
          <p className="text-red-400">Không thể tải lịch sử đặt vé. Vui lòng thử lại sau.</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Film size={48} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-muted">Chưa có giao dịch nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking, i) => (
            <motion.div
              key={booking.bookingId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold">{booking.movieTitle}</h3>
                  <p className="text-xs text-text-muted">{new Date(booking.showtimeStart).toLocaleDateString('vi-VN')} — {booking.roomName}</p>
                  <p className="text-sm text-text-secondary flex items-center gap-1">
                    <Ticket size={14} /> Ghế: {booking.seatLabels?.join(', ')}
                  </p>
                  {booking.combos?.length > 0 && (
                    <p className="text-xs text-text-muted">Combo: {booking.combos.map(c => `${c.comboName} x${c.quantity}`).join(', ')}</p>
                  )}
                </div>
                <Badge variant={booking.bookingStatus}>{statusMap[booking.bookingStatus] || booking.bookingStatus}</Badge>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="font-bold galaxy-text-gradient">{booking.totalAmount?.toLocaleString()}₫</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
