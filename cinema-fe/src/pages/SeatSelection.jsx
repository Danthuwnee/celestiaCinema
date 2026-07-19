import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ChevronRight, Monitor, Ticket } from 'lucide-react'
import bookingApi from '../api/bookingApi'
import { useAuth } from '../contexts/AuthContext'
import { useSocket } from '../contexts/SocketContext'
import Loading from '../components/ui/Loading'
import Button from '../components/ui/Button'

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function parseAisleColumns(val) {
  if (!val || val.trim() === '') return []
  return val.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
}

export default function SeatSelection() {
  const { showtimeId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [lockError, setLockError] = useState('')
  const [locking, setLocking] = useState(false)
  const { client } = useSocket()

  const { data: seats, isLoading } = useQuery({
    queryKey: ['seats', showtimeId],
    queryFn: () => bookingApi.getSeatsByShowtime(showtimeId).then(r => r.data),
    refetchInterval: 30000,
  })

  useEffect(() => {
    if (!client || !showtimeId) return

    const subscription = client.subscribe(`/topic/seats/${showtimeId}`, () => {
      queryClient.invalidateQueries({ queryKey: ['seats', showtimeId] })
    })

    return () => subscription.unsubscribe()
  }, [showtimeId, queryClient, client])

  const toggleSeat = useCallback((seat) => {
    if (!user) return navigate('/login')
    if (user.role === 'ADMIN') {
      alert('Tài khoản admin không thể đặt vé')
      return
    }
    setSelectedSeats(prev =>
      prev.some(s => s.seatId === seat.seatId)
        ? prev.filter(s => s.seatId !== seat.seatId)
        : prev.length >= 8 ? prev : [...prev, seat]
    )
  }, [user, navigate])

  const toggleCouplePair = useCallback((first, second) => {
    if (!user) return navigate('/login')
    if (user.role === 'ADMIN') {
      alert('Tài khoản admin không thể đặt vé')
      return
    }
    const pair = second ? [first, second] : [first]
    setSelectedSeats(prev => {
      const hasAny = pair.some(s => prev.some(p => p.seatId === s.seatId))
      if (hasAny) {
        return prev.filter(s => !pair.some(p => p.seatId === s.seatId))
      }
      return prev.length + pair.length > 8 ? prev : [...prev, ...pair]
    })
  }, [user, navigate])

  const handleContinue = async () => {
    if (!user) return navigate('/login')
    if (user.role === 'ADMIN') {
      alert('Tài khoản admin không thể đặt vé')
      return
    }
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

  const seatTypeMap = new Map()
  seats.forEach(s => {
    if (!seatTypeMap.has(s.seatTypeName)) {
      seatTypeMap.set(s.seatTypeName, { name: s.seatTypeName, color: s.colorHex })
    }
  })
  const seatTypes = [...seatTypeMap.values()]

  const cols = Math.max(...seats.map(s => s.seatNumber), 0)
  const aisleAfterColumns = seats[0]?.aisleAfterColumns || ''
  const aisleCols = parseAisleColumns(aisleAfterColumns)
  const innerAisleCols = aisleCols.filter(n => n > 0 && n < cols)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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

        {/* EXIT row */}
        <div className="flex items-center justify-center gap-1 mb-2">
          <span className="w-5 text-right text-xs text-text-muted mr-1" />
          <div className="w-5 shrink-0 flex items-center justify-center">
            <span className="text-red-400 font-bold text-[7px] -rotate-90 whitespace-nowrap">EXIT</span>
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: cols }, (_, ci) => {
              const colNum = ci + 1
              return (
                <div key={colNum}
                  className={innerAisleCols.includes(colNum) ? 'w-3 shrink-0' : 'w-8 md:w-10 shrink-0'} />
              )
            })}
          </div>
          <div className="w-5 shrink-0 flex items-center justify-center">
            <span className="text-red-400 font-bold text-[7px] -rotate-90 whitespace-nowrap">EXIT</span>
          </div>
          <span className="w-5 text-left text-xs text-text-muted ml-1" />
        </div>

        {/* Seat grid */}
        <div className="space-y-1.5 overflow-x-auto">
          {rows.map(row => {
            const rowSeats = seats.filter(s => s.rowLabel === row)
              .sort((a, b) => a.seatNumber - b.seatNumber)
            const isCoupleRow = rowSeats[0]?.seatTypeName === 'Couple'

            return (
              <div key={row} className="flex items-center justify-center gap-1 min-w-fit">
                <span className="w-5 text-right text-xs text-text-muted mr-1">{row}</span>

                {isCoupleRow ? (
                  Array.from(
                    { length: Math.ceil(rowSeats.length / 2) },
                    (_, i) => rowSeats.slice(i * 2, i * 2 + 2)
                  ).map((pair) => {
                    const [first, second] = pair
                    const color = first.colorHex || '#4CAF50'
                    const isSelected = pair.some(s => selectedSeats.some(p => p.seatId === s.seatId))
                    const isLocked = pair.some(s => s.status === 'LOCKED')
                    const isSold = pair.some(s => s.status === 'SOLD')
                    const pairPrice = pair.reduce((sum, s) => sum + (s.calculatedPrice || 0), 0)

                    let bgColor, borderColor, shadow, textColor, extraBg
                    if (isSold) {
                      bgColor = 'rgba(128,128,128,0.15)'
                      borderColor = 'rgba(128,128,128,0.1)'
                      textColor = 'rgba(128,128,128,0.5)'
                      extraBg = 'linear-gradient(135deg, transparent 45%, rgba(160,160,160,0.35) 48%, rgba(160,160,160,0.35) 52%, transparent 55%), linear-gradient(225deg, transparent 45%, rgba(160,160,160,0.35) 48%, rgba(160,160,160,0.35) 52%, transparent 55%)'
                    } else if (isLocked) {
                      bgColor = hexToRgba(color, 0.35)
                      borderColor = hexToRgba(color, 0.2)
                      textColor = hexToRgba(color, 0.7)
                    } else if (isSelected) {
                      bgColor = color
                      borderColor = color
                      shadow = `0 0 12px ${hexToRgba(color, 0.5)}`
                      textColor = '#fff'
                    } else {
                      bgColor = hexToRgba(color, 0.15)
                      borderColor = hexToRgba(color, 0.3)
                      textColor = color
                    }

                    const tooltipLabel = isSold
                      ? `${first.rowLabel}${first.seatNumber}${second ? '-' + second.seatNumber : ''} - Đã bán`
                      : isLocked
                        ? `${first.rowLabel}${first.seatNumber}${second ? '-' + second.seatNumber : ''} - Có người đang giữ`
                        : `${first.rowLabel}${first.seatNumber}${second ? '-' + second.seatNumber : ''} - ${pairPrice.toLocaleString()}₫`

                    return (
                      <motion.button
                        key={first.seatId}
                        whileTap={isLocked || isSold ? {} : { scale: 0.95 }}
                        whileHover={isLocked || isSold ? {} : { scale: 1.04 }}
                        onClick={() => toggleCouplePair(first, second)}
                        disabled={isLocked || isSold}
                        className="h-8 md:h-10 text-xs rounded-lg transition-all duration-200 flex items-center justify-center font-medium"
                        style={{
                          width: second ? '68px' : '32px',
                          background: extraBg ? `${extraBg}, ${bgColor}` : bgColor,
                          borderColor: borderColor,
                          borderWidth: 1,
                          borderStyle: 'solid',
                          color: textColor,
                          boxShadow: shadow || 'none',
                          cursor: isLocked || isSold ? 'not-allowed' : 'pointer',
                        }}
                        title={tooltipLabel}
                      >
                        {first.seatNumber}{second ? `-${second.seatNumber}` : ''}
                      </motion.button>
                    )
                  })
                ) : (
                  Array.from({ length: cols }, (_, ci) => {
                    const colNum = ci + 1
                    if (innerAisleCols.includes(colNum)) {
                      return (
                        <div key={`aisle-${colNum}`} className="w-3 shrink-0 flex items-center justify-center">
                          <span className="text-[6px] text-text-muted leading-none">║</span>
                        </div>
                      )
                    }
                    const seat = rowSeats.find(s => s.seatNumber === colNum)
                    if (!seat) {
                      return <div key={`empty-${colNum}`} className="w-8 md:w-10 shrink-0" />
                    }
                    const color = seat.colorHex || '#4CAF50'
                    const isSelected = selectedSeats.some(s => s.seatId === seat.seatId)
                    const isLocked = seat.status === 'LOCKED'
                    const isSold = seat.status === 'SOLD'

                    let bgColor, borderColor, shadow, textColor, extraBg
                    if (isSold) {
                      bgColor = 'rgba(128,128,128,0.15)'
                      borderColor = 'rgba(128,128,128,0.1)'
                      textColor = 'rgba(128,128,128,0.5)'
                      extraBg = 'linear-gradient(135deg, transparent 45%, rgba(160,160,160,0.35) 48%, rgba(160,160,160,0.35) 52%, transparent 55%), linear-gradient(225deg, transparent 45%, rgba(160,160,160,0.35) 48%, rgba(160,160,160,0.35) 52%, transparent 55%)'
                    } else if (isLocked) {
                      bgColor = hexToRgba(color, 0.35)
                      borderColor = hexToRgba(color, 0.2)
                      textColor = hexToRgba(color, 0.7)
                    } else if (isSelected) {
                      bgColor = color
                      borderColor = color
                      shadow = `0 0 12px ${hexToRgba(color, 0.5)}`
                      textColor = '#fff'
                    } else {
                      bgColor = hexToRgba(color, 0.15)
                      borderColor = hexToRgba(color, 0.3)
                      textColor = color
                    }

                    return (
                      <motion.button
                        key={seat.seatId}
                        whileTap={isLocked || isSold ? {} : { scale: 0.9 }}
                        whileHover={isLocked || isSold ? {} : { scale: 1.08 }}
                        onClick={() => toggleSeat(seat)}
                        disabled={isLocked || isSold}
                        className="w-8 md:w-10 h-8 md:h-10 text-xs rounded-lg transition-all duration-200 flex items-center justify-center font-medium"
                        style={{
                          background: extraBg ? `${extraBg}, ${bgColor}` : bgColor,
                          borderColor: borderColor,
                          borderWidth: 1,
                          borderStyle: 'solid',
                          color: textColor,
                          boxShadow: shadow || 'none',
                          cursor: isLocked || isSold ? 'not-allowed' : 'pointer',
                        }}
                        title={
                          isSold
                            ? `${seat.rowLabel}${seat.seatNumber} - Đã bán`
                            : isLocked
                              ? `${seat.rowLabel}${seat.seatNumber} - Có người đang giữ`
                              : `${seat.rowLabel}${seat.seatNumber} - ${seat.calculatedPrice?.toLocaleString()}₫`
                        }
                      >
                        {seat.seatNumber}
                      </motion.button>
                    )
                  })
                )}

                <span className="w-5 text-left text-xs text-text-muted ml-1">{row}</span>
              </div>
            )
          })}
        </div>

        {/* Status legend */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {[
            { bg: 'rgba(59,130,246,0.2)', border: 'rgba(59,130,246,0.4)', label: 'Trống' },
            { bg: '#ffffff', border: '#ffffff', label: 'Đang chọn', glow: true },
            { bg: 'rgba(251,146,60,0.35)', border: 'rgba(251,146,60,0.2)', label: 'Đang giữ' },
            { bg: 'rgba(160,160,160,0.2)', border: 'rgba(160,160,160,0.1)', label: 'Đã bán', crossHatch: true },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border"
                style={{
                  borderColor: item.border,
                  boxShadow: item.glow ? '0 0 6px rgba(255,255,255,0.4)' : 'none',
                  background: item.crossHatch
                    ? 'linear-gradient(135deg, transparent 45%, rgba(160,160,160,0.45) 48%, rgba(160,160,160,0.45) 52%, transparent 55%), linear-gradient(225deg, transparent 45%, rgba(160,160,160,0.45) 48%, rgba(160,160,160,0.45) 52%, transparent 55%) rgba(160,160,160,0.2)'
                    : item.bg,
                }}
              />
              <span className="text-xs text-text-muted">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Seat type legend */}
        {seatTypes.length > 1 && (
          <div className="flex flex-wrap justify-center gap-4 mt-3 pt-3 border-t border-white/10">
            {seatTypes.map(t => (
              <div key={t.name} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: t.color }} />
                <span className="text-xs text-text-muted">{t.name}</span>
              </div>
            ))}
          </div>
        )}
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
