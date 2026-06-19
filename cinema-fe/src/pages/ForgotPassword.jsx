import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Key, CheckCircle } from 'lucide-react'
import authApi from '../api/authApi'
import StarsBackground from '../components/ui/StarsBackground'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function ForgotPassword() {
  const [step, setStep] = useState(0)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setMessage('Mã xác nhận đã gửi đến email của bạn')
      setTimeout(() => setStep(1), 500)
    } catch (err) {
      setError(err.response?.data?.error || 'Gửi mã thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) { setError('Mật khẩu không khớp'); return }
    if (newPassword.length < 6) { setError('Mật khẩu tối thiểu 6 ký tự'); return }
    setLoading(true)
    try {
      await authApi.resetPassword({ email, code: otp, newPassword })
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.error || 'Đặt lại mật khẩu thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      <StarsBackground />
      <div className="w-full max-w-md">
        <div className="glass-card p-8">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.form key="step0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSendOtp} className="space-y-4">
                <div className="text-center mb-4">
                  <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
                  <p className="text-text-muted text-sm mt-1">Nhập email để nhận mã xác nhận</p>
                </div>
                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm text-center">{error}</div>}
                {message && <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-xl text-sm text-center">{message}</div>}
                <Input label="Email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} required />
                <Button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3">{loading ? 'Đang gửi...' : 'Gửi mã xác nhận'}</Button>
                <p className="text-center text-sm text-text-muted"><Link to="/login" className="text-galaxy-purple hover:text-galaxy-pink transition-colors">Quay lại đăng nhập</Link></p>
              </motion.form>
            )}

            {step === 1 && (
              <motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleReset} className="space-y-4">
                <div className="text-center mb-4">
                  <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>
                  <p className="text-text-muted text-sm mt-1">Nhập mã OTP và mật khẩu mới</p>
                </div>
                {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm text-center">{error}</div>}
                <Input label="Mã xác nhận" type="text" placeholder="6 số" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} icon={Key} required />
                <Input label="Mật khẩu mới" type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                <Input label="Xác nhận mật khẩu" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <Button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3">{loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}</Button>
                <p className="text-center text-sm text-text-muted"><Link to="/login" className="text-galaxy-purple hover:text-galaxy-pink transition-colors">Quay lại đăng nhập</Link></p>
              </motion.form>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle size={32} className="text-green-400" />
                </div>
                <h2 className="text-2xl font-bold">Đặt lại mật khẩu thành công!</h2>
                <p className="text-text-muted">Mật khẩu của bạn đã được cập nhật</p>
                <Link to="/login" className="btn-primary inline-block mt-4">Đăng nhập ngay</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
