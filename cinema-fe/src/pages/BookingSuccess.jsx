import { useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, ArrowRight, Home, History, Ticket, MapPin, CreditCard } from 'lucide-react'
import bookingApi from '../api/bookingApi'
import Loading from '../components/ui/Loading'

function formatDateTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ' ' +
    d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

export default function BookingSuccess() {
  const [searchParams] = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingApi.getBookingDetail(bookingId).then(r => r.data),
    enabled: !!bookingId,
    refetchInterval: (query) => {
      if (query.state.data?.bookingStatus === 'PAID') return false
      return 3000
    },
  })

  if (!bookingId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 0.9 }} className="text-center glass-card p-12 max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <XCircle size={32} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Đặt vé thất bại</h2>
          <p className="text-text-muted mb-6">Đã có lỗi xảy ra trong quá trình thanh toán.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2"><Home size={16} /> Về trang chủ</Link>
        </motion.div>
      </div>
    )
  }

  if (isLoading) return <Loading text="Đang tải thông tin vé..." />
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 0.9 }} className="text-center glass-card p-12 max-w-md">
          <XCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy thông tin vé</h2>
          <p className="text-text-muted mb-6">Mã vé không hợp lệ hoặc đã bị xóa.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2"><Home size={16} /> Về trang chủ</Link>
        </motion.div>
      </div>
    )
  }

  const isPaid = booking?.bookingStatus === 'PAID'
  const comboText = booking?.combos?.map(c => `${c.comboName} x${c.quantity}`).join(', ') || ''
  const endTime = booking?.showtimeStart
    ? new Date(new Date(booking.showtimeStart).getTime() + 120 * 60000).toISOString()
    : ''

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        {isPaid ? (
          <div className="glass-card p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-galaxy-purple/30 via-galaxy-pink/20 to-galaxy-cyan/20 p-8 text-center border-b border-dashed border-white/10 relative">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}>
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle size={36} className="text-green-400" />
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold">Đặt vé thành công!</h2>
              <p className="text-text-muted text-sm mt-1">Cảm ơn bạn đã đặt vé tại CELESTIA CINEMA</p>
              <div className="mt-3 inline-block bg-white/10 rounded-full px-4 py-1.5 text-xs font-mono tracking-wider">
                Mã vé: {booking.bookingId?.substring(0, 8).toUpperCase()}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-white/5">
                <Ticket size={18} className="text-galaxy-pink shrink-0" />
                <div>
                  <p className="font-bold text-base">{booking.movieTitle}</p>
                  <p className="text-xs text-text-muted">{formatDate(booking.showtimeStart)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-2">
                  <Clock size={16} className="text-galaxy-cyan shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Suất chiếu</p>
                    <p className="font-semibold">{formatTime(booking.showtimeStart)} - {formatTime(endTime)}</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 flex items-center gap-2">
                  <MapPin size={16} className="text-galaxy-purple shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">Phòng chiếu</p>
                    <p className="font-semibold">{booking.roomName}</p>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs text-text-muted block mb-2">Ghế:</span>
                <div className="flex flex-wrap gap-2">
                  {booking.seatLabels?.map(seat => (
                    <span key={seat} className="bg-galaxy-purple/20 text-galaxy-purple border border-galaxy-purple/30 px-3 py-1 rounded-full text-sm font-semibold">
                      {seat}
                    </span>
                  ))}
                </div>
              </div>

              {comboText && (
                <div className="text-sm">
                  <span className="text-xs text-text-muted block mb-1">Combo:</span>
                  <span className="text-white/80">{comboText}</span>
                </div>
              )}

              <hr className="border-white/10" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Tổng tiền</span>
                  <span className="font-bold text-lg galaxy-text-gradient">{booking.totalAmount?.toLocaleString()}₫</span>
                </div>
                {booking.payment?.transactionCode && (
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Mã giao dịch</span>
                    <span className="font-mono text-galaxy-cyan">{booking.payment.transactionCode}</span>
                  </div>
                )}
                {booking.payment?.paidAt && (
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Thanh toán lúc</span>
                    <span>{formatDateTime(booking.payment.paidAt)}</span>
                  </div>
                )}
                {booking.createdAt && (
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Thời gian đặt</span>
                    <span>{formatDateTime(booking.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/5 p-6 flex gap-3 justify-center border-t border-dashed border-white/10">
              <Link to="/" className="btn-secondary inline-flex items-center gap-2 text-sm flex-1 justify-center"><Home size={16} /> Trang chủ</Link>
              <Link to="/bookings" className="btn-primary inline-flex items-center gap-2 text-sm flex-1 justify-center"><History size={16} /> Lịch sử vé</Link>
            </div>
          </div>
        ) : (
          <div className="glass-card p-8 text-center space-y-4">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto">
                <Clock size={32} className="text-yellow-400" />
              </div>
            </motion.div>
            <h2 className="text-xl font-bold">Đang chờ thanh toán</h2>
            <p className="text-text-muted">Vui lòng hoàn tất thanh toán để xác nhận vé.</p>
            {booking && (
              <div className="bg-white/5 rounded-xl p-4 text-left text-sm space-y-2">
                <p><span className="text-text-muted">Phim:</span> <span className="font-medium">{booking.movieTitle}</span></p>
                <p><span className="text-text-muted">Ghế:</span> <span>{booking.seatLabels?.join(', ')}</span></p>
                <p><span className="text-text-muted">Tổng:</span> <span className="font-bold galaxy-text-gradient">{booking.totalAmount?.toLocaleString()}₫</span></p>
              </div>
            )}
            <Link to="/bookings" className="btn-primary inline-flex items-center gap-2"><ArrowRight size={16} /> Xem lịch sử</Link>
          </div>
        )}
      </motion.div>
    </div>
  )
}
