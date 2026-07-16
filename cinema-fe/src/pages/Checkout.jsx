import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Minus, Plus, Ticket, ShoppingBag, CreditCard, Clock, CheckCircle, X, AlertCircle, Smartphone } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import bookingApi from '../api/bookingApi'
import paymentApi from '../api/paymentApi'
import comboApi from '../api/comboApi'
import couponApi from '../api/couponApi'
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
  const { user } = useAuth()
  const { showtimeId, seats } = location.state || {}

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      alert('Tài khoản admin không thể đặt vé')
      navigate('/', { replace: true })
    }
  }, [user, navigate])
  const [couponCode, setCouponCode] = useState('')
  const [comboQtys, setComboQtys] = useState({})
  const [step, setStep] = useState('review')
  const [bookingId, setBookingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [polling, setPolling] = useState(false)
  const [showBankQr, setShowBankQr] = useState(false)
  const pollRef = useRef(null)
  const startTimeRef = useRef(null)

  const { data: combos } = useQuery({
    queryKey: ['combos'],
    queryFn: () => comboApi.getCombos().then(r => r.data),
  })

  const [checkingCoupon, setCheckingCoupon] = useState(false)
  const [couponResult, setCouponResult] = useState(null)

  const handleCheckCoupon = async () => {
    if (!couponCode) return
    setCheckingCoupon(true)
    setCouponResult(null)
    try {
      const rawTotal = seatTotal + comboTotal
      if (rawTotal <= 0) {
        setCouponResult({ valid: false, error: 'Chưa có sản phẩm trong giỏ hàng' })
        return
      }
      const res = await couponApi.applyCoupon({ code: couponCode, orderAmount: rawTotal })
      const data = res.data
      setCouponResult({
        valid: true,
        discountText: data.discountType === 'PERCENTAGE'
          ? `${data.discountValue}% (giảm ${data.discountedAmount.toLocaleString()}₫)`
          : `${data.discountedAmount.toLocaleString()}₫`,
        discountedAmount: data.discountedAmount,
      })
    } catch (err) {
      setCouponResult({
        valid: false,
        error: err.response?.data?.error || 'Mã giảm giá không hợp lệ',
      })
    } finally {
      setCheckingCoupon(false)
    }
  }

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
  const displayTotal = couponResult?.valid ? totalAmount - couponResult.discountedAmount : totalAmount
  const selectedCombos = combos ? combos.filter(c => comboQtys[c.comboId] > 0).map(c => ({ comboId: c.comboId, quantity: comboQtys[c.comboId] })) : []

  const vietQrUrl = useMemo(() => {
    if (!bookingId || !displayTotal) return ''
    const content = `CINEMA${bookingId.substring(0, 8).toUpperCase()}`
    return `https://img.vietqr.io/image/${bankInfo.bankCode}-${bankInfo.accountNumber}-compact.png?amount=${Math.round(displayTotal)}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(bankInfo.accountHolder)}`
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
      setBookingId(res.data.bookingId)
      setStep('payment')
    } catch (err) {
      setError(err.response?.data?.error || 'Đặt vé thất bại, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  const handleZaloPayPayment = async () => {
    if (!bookingId) return
    setLoading(true)
    setError('')
    try {
      const res = await paymentApi.createZaloPayPayment(bookingId)
      const { orderUrl, appTransId } = res.data
      setPolling(true)
      startTimeRef.current = Date.now()
      window.open(orderUrl, '_blank')
    } catch (err) {
      setError(err.response?.data?.error || 'Kết nối ZaloPay thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleBankPayment = async () => {
    if (!bookingId) return
    setLoading(true)
    setError('')
    try {
      await paymentApi.initiateBankPayment(bookingId)
      setShowBankQr(true)
      setPolling(true)
      startTimeRef.current = Date.now()
    } catch (err) {
      setError(err.response?.data?.error || 'Khởi tạo thanh toán thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => { stopPolling(); setStep('review'); setBookingId(null); setShowBankQr(false); setError('') }
  const elapsedSeconds = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 0

  if (step === 'payment') {
    const content = `CINEMA${bookingId?.substring(0, 8).toUpperCase()}`
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-button-glow flex items-center justify-center mx-auto mb-3">
              <CreditCard size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold">Thanh toán</h1>
            <p className="text-text-muted text-sm mt-1">Chọn phương thức thanh toán</p>
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

          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Smartphone size={24} className="text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold">ZaloPay</p>
                  <p className="text-xs text-text-muted">Thanh toán qua ứng dụng ZaloPay</p>
                </div>
              </div>
              <Button onClick={handleZaloPayPayment} disabled={loading || polling} className="shrink-0">
                {loading ? 'Đang kết nối...' : 'Thanh toán ZaloPay'}
              </Button>
            </div>

            {!showBankQr && (
              <div className="flex justify-between items-center p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CreditCard size={24} className="text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold">Chuyển khoản ngân hàng</p>
                    <p className="text-xs text-text-muted">Quét mã QR bằng app ngân hàng</p>
                  </div>
                </div>
                <Button onClick={handleBankPayment} disabled={loading || polling} variant="secondary" className="shrink-0">
                  Chuyển khoản
                </Button>
              </div>
            )}
          </div>

          {showBankQr && (
            <>
              <hr className="border-white/10" />
              <div className="text-center">
                <h2 className="font-semibold mb-2">Quét mã QR để chuyển khoản</h2>
              </div>
              <div className="flex justify-center py-2">
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
              <p className="text-center text-xs text-text-muted">App ngân hàng sẽ tự điền số tiền và nội dung.</p>
            </>
          )}

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
        <h2 className="font-semibold mb-1 flex items-center gap-2"><ShoppingBag size={16} className="text-galaxy-pink" /> Bắp nước</h2>
        {combos && (
          <div className="flex flex-wrap gap-1.5 mb-4 min-h-[28px]">
            {combos.some(c => (comboQtys[c.comboId] || 0) > 0) ? (
              combos.filter(c => (comboQtys[c.comboId] || 0) > 0).map(c => (
                <span key={c.comboId} className="inline-flex items-center gap-1 text-xs bg-galaxy-cyan/15 text-galaxy-cyan border border-galaxy-cyan/30 px-2 py-1 rounded-full">
                  {c.comboName}
                  <span className="font-bold">x{comboQtys[c.comboId]}</span>
                  <button onClick={() => setComboQtys(prev => ({ ...prev, [c.comboId]: 0 }))} className="hover:text-white transition-colors ml-0.5">
                    <X size={12} />
                  </button>
                </span>
              ))
            ) : (
              <span className="text-xs text-text-muted italic">(Chưa chọn bắp nước)</span>
            )}
          </div>
        )}
        {!combos ? (
          <Loading text="Đang tải..." />
        ) : (
          <div className="space-y-1">
            {combos.map(combo => {
              const qty = comboQtys[combo.comboId] || 0
              return (
                <div key={combo.comboId} className={`flex items-center justify-between py-2.5 px-3 rounded-xl border transition-all duration-200 ${qty > 0 ? 'bg-galaxy-cyan/5 border-galaxy-cyan/40' : 'border-transparent hover:bg-white/[0.03]'}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      {combo.imageUrl && (
                        <img src={combo.imageUrl} alt={combo.comboName} className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      {qty > 0 && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-galaxy-cyan rounded-full flex items-center justify-center">
                          <CheckCircle size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{combo.comboName}</p>
                      <p className="text-xs text-text-muted truncate">{combo.description}</p>
                      <p className="text-sm text-galaxy-cyan font-semibold">{combo.price.toLocaleString()}₫</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <button onClick={() => setComboQtys(prev => ({ ...prev, [combo.comboId]: Math.max(0, (prev[combo.comboId] || 0) - 1) }))} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"><Minus size={14} /></button>
                    <motion.span key={qty} initial={{ scale: 1 }} animate={{ scale: [1, 1.35, 1] }} transition={{ duration: 0.25 }} className="w-6 text-center font-semibold tabular-nums">{qty}</motion.span>
                    <button onClick={() => setComboQtys(prev => ({ ...prev, [combo.comboId]: (prev[combo.comboId] || 0) + 1 }))} className="w-8 h-8 rounded-full bg-button-glow flex items-center justify-center transition-all hover:shadow-lg hover:shadow-galaxy-purple/30"><Plus size={14} /></button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Coupon */}
      <div className="glass-card p-6 mb-4">
        <h2 className="font-semibold mb-3">Mã giảm giá</h2>
        <div className="flex gap-2">
          <input type="text" value={couponCode}
            onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponResult(null) }}
            placeholder="Nhập mã giảm giá..." className="input-field flex-1" />
          <Button onClick={handleCheckCoupon} disabled={!couponCode || checkingCoupon}
            className="shrink-0 px-4 text-sm">
            {checkingCoupon ? 'Đang kiểm tra...' : 'Xác nhận'}
          </Button>
        </div>
        {couponResult && (
          <div className="mt-3 text-sm flex items-center gap-2">
            {couponResult.valid ? (
              <>
                <CheckCircle size={14} className="text-green-400 shrink-0" />
                <span className="text-green-400">Giảm {couponResult.discountText}</span>
              </>
            ) : (
              <>
                <AlertCircle size={14} className="text-red-400 shrink-0" />
                <span className="text-red-400">{couponResult.error}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Total */}
      <div className="glass-card p-6 mb-6 space-y-2">
        <div className="flex justify-between"><span className="text-text-secondary">Tiền ghế</span><span>{seatTotal.toLocaleString()}₫</span></div>
        {comboTotal > 0 && <div className="flex justify-between"><span className="text-text-secondary">Bắp nước</span><span>{comboTotal.toLocaleString()}₫</span></div>}
        {couponResult?.valid && <div className="flex justify-between text-green-400 text-sm"><span>Giảm giá</span><span>-{couponResult.discountText}</span></div>}
        <hr className="border-white/10" />
        <div className="flex justify-between text-xl font-bold"><span>Tổng cộng</span><span className="galaxy-text-gradient">{displayTotal.toLocaleString()}₫</span></div>
      </div>

      <Button onClick={handleCreateBooking} disabled={loading} className="w-full flex items-center justify-center gap-2 text-lg py-4">
        {loading ? 'Đang xử lý...' : 'Đặt vé & Thanh toán'}
        <ChevronRight size={20} />
      </Button>
    </div>
  )
}
