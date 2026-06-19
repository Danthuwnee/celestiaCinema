import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { motion } from 'framer-motion'
import { ChevronRight, Monitor, Ticket } from 'lucide-react'
import bookingApi from '../api/bookingApi'
import { useAuth } from '../contexts/AuthContext'
import Loading from '../components/ui/Loading'
import Button from '../components/ui/Button'

export default function SeatSelection() {
  const { showtimeId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [lockError, setLockError] = useState('')
  const [locking, setLocking] = useState(false)
  const stompRef = useRef(null)

  const { data: seats, isLoading } = useQuery({
    queryKey: ['seats', showtimeId],
    queryFn: () => bookingApi.getSeatsByShowtime(showtimeId).then(r => r.data),
    refetchInterval: 30000,
  })

  useEffect(() => {
    if (!showtimeId) return
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe(`/topic/seats/${showtimeId}`, () => {
          queryClient.invalidateQueries({ queryKey: ['seats', showtimeId] })
        })
      },
    })
    client.activate()
    stompRef.current = client
    return () => client.deactivate()
  }, [showtimeId, queryClient])

  const toggleSeat = useCallback((seat) => {
    if (!user) return navigate('/login')
    setSelectedSeats(prev =>
      prev.some(s => s.seatId === seat.seatId)
        ? prev.filter(s => s.seatId !== seat.seatId)
        : prev.length >= 8 ? prev : [...prev, seat]
    )
  }, [user, navigate])

  const handleContinue = async () => {
    if (!user) return navigate('/login')
    setLocking(true)
    try {
      await bookingApi.lockSeats({ showtimeId, seatIds: selectedSeats.map(s => s.seatId), sessionId: user.userId })
      navigate('/checkout', { state: { showtimeId, seats: selectedSeats } })
    } catch {
      setLockError('Có ghế đã được người khác giữ, vui lòng kiểm tra lại!')
      setTimeout(() => setLockError(''), 4000)
      queryClient.invalidateQueries({ queryKey: ['seats', showtimeId] })
    } finally {
      setLocking(false)
    }
  }

  if (isLoading) return <Loading />
  if (!seats) return null

  const rows = [...new Set(seats.map(s => s.rowLabel))].sort()
  const total = selectedSeats.reduce((sum, s) => sum + s.calculatedPrice, 0)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-text-muted hover:text-white transition-colors mb-6 flex items-center gap-1">
        <ChevronRight size={16} className="rotate-180" /> Quay lại
      </button>

      <h1 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <Ticket size={24} className="text-galaxy-cyan" /> Chọn ghế
      </h1>

      {lockError && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm text-center mb-4">
          {lockError}
        </motion.div>
      )}

      <div className="glass-card p-6 md:p-10 mb-6">
        {/* Screen */}
        <div className="relative mb-10">
          <div className="w-3/4 h-1 bg-gradient-to-r from-transparent via-galaxy-purple to-transparent mx-auto rounded-full" />
          <div className="w-3/4 h-8 bg-gradient-to-b from-galaxy-purple/20 to-transparent mx-auto rounded-b-full -mt-1" />
          <p className="text-center text-xs text-text-muted mt-1">Màn hình</p>
        </div>

        {/* Seat grid */}
        <div className="space-y-1.5 overflow-x-auto">
          {rows.map(row => (
            <div key={row} className="flex items-center justify-center gap-1 min-w-fit">
              <span className="w-5 text-right text-xs text-text-muted mr-1">{row}</span>
              {seats.filter(s => s.rowLabel === row).sort((a, b) => a.seatNumber - b.seatNumber).map(seat => {
                const isSelected = selectedSeats.some(s => s.seatId === seat.seatId)
                const isLocked = seat.status === 'LOCKED'
                const isSold = seat.status === 'SOLD'
                return (
                  <motion.button
                    key={seat.seatId}
                    whileTap={isLocked || isSold ? {} : { scale: 0.9 }}
                    onClick={() => toggleSeat(seat)}
                    disabled={isLocked || isSold}
                    className={`w-8 h-8 md:w-10 md:h-10 text-xs rounded-lg transition-all duration-200 ${
                      isSold ? 'bg-red-500/30 cursor-not-allowed border border-red-500/20'
                        : isLocked ? 'bg-orange-500/30 cursor-not-allowed border border-orange-500/20'
                          : isSelected ? 'bg-galaxy-pink text-white shadow-lg shadow-galaxy-pink/30 border border-galaxy-pink/50'
                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-white/30'
                    }`}
                    title={
                      isSold ? `${seat.rowLabel}${seat.seatNumber} - Đã bán`
                        : isLocked ? `${seat.rowLabel}${seat.seatNumber} - Có người đang giữ`
                          : `${seat.rowLabel}${seat.seatNumber} - ${seat.calculatedPrice?.toLocaleString()}₫`
                    }
                  >
                    {seat.seatNumber}
                  </motion.button>
                )
              })}
              <span className="w-5 text-left text-xs text-text-muted ml-1">{row}</span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {[
            { color: 'bg-white/30 border border-white/20', label: 'Trống' },
            { color: 'bg-galaxy-pink border border-galaxy-pink/50', label: 'Đang chọn' },
            { color: 'bg-orange-500/30 border border-orange-500/20', label: 'Đang giữ' },
            { color: 'bg-red-500/30 border border-red-500/20', label: 'Đã bán' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${item.color}`} />
              <span className="text-xs text-text-muted">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky bottom bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="glass-card p-4 flex items-center justify-between sticky bottom-4 z-10"
      >
        <div>
          <p className="text-sm text-text-secondary">Đã chọn: <span className="font-semibold text-white">{selectedSeats.length} ghế</span></p>
          <p className="text-xl font-bold galaxy-text-gradient">{total.toLocaleString()}₫</p>
        </div>
        <Button onClick={handleContinue} disabled={selectedSeats.length === 0 || locking} className="flex items-center gap-2 text-lg">
          {locking ? 'Đang xử lý...' : 'Tiếp tục'}
          <ChevronRight size={20} />
        </Button>
      </motion.div>
    </div>
  )
}
