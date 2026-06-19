import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Minus, Plus, Ticket, ShoppingBag, CreditCard, Clock, CheckCircle } from 'lucide-react'
import bookingApi from '../api/bookingApi'
import paymentApi from '../api/paymentApi'
import comboApi from '../api/comboApi'
import Button from '../components/ui/Button'
import Loading from '../components/ui/Loading'

const bankInfo = {
  bankCode: 'VCB',
  accountNumber: '1031323071',
  accountHolder: 'TRAN MINH NHUT',
  bankName: 'Vietcombank',
}

const POLL_INTERVAL = 3000
const TIMEOUT_MS = 180_000

export default function Checkout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { showtimeId, seats } = location.state || {}
  const [couponCode, setCouponCode] = useState('')
  const [comboQtys, setComboQtys] = useState({})
  const [step, setStep] = useState('review')
  const [bookingId, setBookingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [polling, setPolling] = useState(false)
  const pollRef = useRef(null)
  const startTimeRef = useRef(null)

  const { data: combos } = useQuery({
    queryKey: ['combos'],
    queryFn: () => comboApi.getCombos().then(r => r.data),
  })

  useEffect(() => {
    if (combos) {
      const initial = {}
      combos.forEach(c => { initial[c.comboId] = 0 })
      setComboQtys(initial)
    }
  }, [combos])

  if (!showtimeId || !seats) {
    navigate('/')
    return null
  }

  const seatTotal = seats.reduce((sum, s) => sum + s.calculatedPrice, 0)
  const comboTotal = combos ? combos.reduce((sum, c) => sum + c.price * (comboQtys[c.comboId] || 0), 0) : 0
  const totalAmount = seatTotal + comboTotal
  const selectedCombos = combos ? combos.filter(c => comboQtys[c.comboId] > 0).map(c => ({ comboId: c.comboId, quantity: comboQtys[c.comboId] })) : []

  const vietQrUrl = useMemo(() => {
    if (!bookingId || !totalAmount) return ''
    const content = `CINEMA${bookingId.substring(0, 8).toUpperCase()}`
    return `https://img.vietqr.io/image/${bankInfo.bankCode}-${bankInfo.accountNumber}-compact.png?amount=${Math.round(totalAmount)}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(bankInfo.accountHolder)}`
  }, [bookingId, totalAmount])

  const stopPolling = useCallback(() => {
    setPolling(false)
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
  }, [])

  const checkPaymentStatus = useCallback(async () => {
    if (!bookingId) return
    try {
      const res = await paymentApi.getPaymentStatus(bookingId)
      const { bookingStatus } = res.data
      if (bookingStatus === 'PAID') {
        stopPolling()
        navigate(`/booking/success?bookingId=${bookingId}`)
      } else if (Date.now() - startTimeRef.current > TIMEOUT_MS) {
        stopPolling()
        setError('Quá thời gian thanh toán. Vui lòng thử lại.')
      }
    } catch { /* ignore */ }
  }, [bookingId, navigate, stopPolling])

  useEffect(() => {
    if (polling && bookingId) {
      pollRef.current = setInterval(checkPaymentStatus, POLL_INTERVAL)
      checkPaymentStatus()
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [polling, bookingId, checkPaymentStatus])

  const handleCreateBooking = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await bookingApi.createBooking({ showtimeId, seatIds: seats.map(s => s.seatId), combos: selectedCombos.length > 0 ? selectedCombos : null, couponCode: couponCode || null })
      const id = res.data.bookingId
      setBookingId(id)
      await paymentApi.initiateBankPayment(id)
      setStep('payment')
      setPolling(true)
      startTimeRef.current = Date.now()
    } catch (err) {
      setError(err.response?.data?.error || 'Đặt vé thất bại, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => { stopPolling(); setStep('review'); setBookingId(null); setError('') }
  const elapsedSeconds = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0

  if (step === 'payment') {
    const content = `CINEMA${bookingId?.substring(0, 8).toUpperCase()}`
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-button-glow flex items-center justify-center mx-auto mb-3">
              <CreditCard size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold">Chuyển khoản ngân hàng</h1>
            <p className="text-text-muted text-sm mt-1">Quét mã QR bằng app ngân hàng</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
              {error} <button onClick={handleRetry} className="underline ml-1">Thử lại</button>
            </div>
          )}

          {polling && !error && (
            <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-xl text-sm text-center flex items-center justify-center gap-2">
              <Clock size={16} /> Đang chờ thanh toán ({Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')})
            </div>
          )}

          <div className="flex justify-center py-4">
            {vietQrUrl ? (
              <img src={vietQrUrl} alt="QR thanh toán" className="w-56 h-56 rounded-xl shadow-lg shadow-galaxy-purple/20" />
            ) : (
              <div className="w-56 h-56 bg-white/5 rounded-xl flex items-center justify-center"><Loading text="Đang tạo mã..." /></div>
            )}
          </div>

          <div className="space-y-3 text-sm">
            {[
              { label: 'Ngân hàng', value: bankInfo.bankName },
              { label: 'Số tài khoản', value: bankInfo.accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ') },
              { label: 'Chủ tài khoản', value: bankInfo.accountHolder },
              { label: 'Số tiền', value: `${totalAmount.toLocaleString()}₫`, highlight: true },
              { label: 'Nội dung', value: content, highlight: true },
            ].map(item => (
              <div key={item.label} className={`flex justify-between py-2 ${item.highlight ? '' : 'border-b border-white/5'}`}>
                <span className="text-text-muted">{item.label}</span>
                <span className={`font-medium ${item.highlight ? 'text-galaxy-cyan' : 'text-white'}`}>{item.value}</span>
              </div>
            ))}
          </div>

          {!error && <p className="text-center text-xs text-text-muted">App ngân hàng sẽ tự điền số tiền và nội dung.</p>}

          {error && <Button onClick={handleRetry} className="w-full">Đặt vé lại</Button>}
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="text-text-muted hover:text-white transition-colors mb-6 flex items-center gap-1">
        <ChevronRight size={16} className="rotate-180" /> Quay lại
      </button>

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Ticket size={24} className="text-galaxy-cyan" /> Xác nhận đặt vé
      </h1>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>}

      {/* Seats summary */}
      <div className="glass-card p-6 mb-4 space-y-3">
        <h2 className="font-semibold flex items-center gap-2"><Ticket size={16} className="text-galaxy-pink" /> Ghế đã chọn</h2>
        <div className="flex flex-wrap gap-2">
          {seats.map(seat => (
            <span key={seat.seatId} className="bg-galaxy-purple/20 text-galaxy-purple border border-galaxy-purple/30 px-3 py-1 rounded-full text-sm">
              {seat.rowLabel}{seat.seatNumber} — {seat.calculatedPrice?.toLocaleString()}₫
            </span>
          ))}
        </div>
      </div>

      {/* Combos */}
      <div className="glass-card p-6 mb-4">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><ShoppingBag size={16} className="text-galaxy-pink" /> Bắp nước</h2>
        {!combos ? (
          <Loading text="Đang tải..." />
        ) : (
          <div className="space-y-3">
            {combos.map(combo => (
              <div key={combo.comboId} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="font-medium text-sm">{combo.comboName}</p>
                  <p className="text-xs text-text-muted">{combo.description}</p>
                  <p className="text-sm text-galaxy-cyan font-semibold">{combo.price.toLocaleString()}₫</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setComboQtys(prev => ({ ...prev, [combo.comboId]: Math.max(0, (prev[combo.comboId] || 0) - 1) }))} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"><Minus size={14} /></button>
                  <span className="w-6 text-center font-semibold">{comboQtys[combo.comboId] || 0}</span>
                  <button onClick={() => setComboQtys(prev => ({ ...prev, [combo.comboId]: (prev[combo.comboId] || 0) + 1 }))} className="w-8 h-8 rounded-full bg-button-glow flex items-center justify-center transition-all hover:shadow-lg hover:shadow-galaxy-purple/30"><Plus size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coupon */}
      <div className="glass-card p-6 mb-4">
        <h2 className="font-semibold mb-3">Mã giảm giá</h2>
        <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Nhập mã giảm giá..." className="input-field" />
      </div>

      {/* Total */}
      <div className="glass-card p-6 mb-6 space-y-2">
        <div className="flex justify-between"><span className="text-text-secondary">Tiền ghế</span><span>{seatTotal.toLocaleString()}₫</span></div>
        {comboTotal > 0 && <div className="flex justify-between"><span className="text-text-secondary">Bắp nước</span><span>{comboTotal.toLocaleString()}₫</span></div>}
        {couponCode && <div className="flex justify-between text-green-400 text-sm"><span>Giảm giá</span><span>(áp dụng khi thanh toán)</span></div>}
        <hr className="border-white/10" />
        <div className="flex justify-between text-xl font-bold"><span>Tổng cộng</span><span className="galaxy-text-gradient">{totalAmount.toLocaleString()}₫</span></div>
      </div>

      <Button onClick={handleCreateBooking} disabled={loading} className="w-full flex items-center justify-center gap-2 text-lg py-4">
        {loading ? 'Đang xử lý...' : 'Đặt vé & Thanh toán'}
        <ChevronRight size={20} />
      </Button>
    </div>
  )
}
