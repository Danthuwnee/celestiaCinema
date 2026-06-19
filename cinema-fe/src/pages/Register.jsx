import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import StarsBackground from '../components/ui/StarsBackground'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ tên'
    if (!form.email.trim()) errs.email = 'Vui lòng nhập email'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email không hợp lệ'
    if (form.phone && !/^0\d{9,10}$/.test(form.phone)) errs.phone = 'Số điện thoại không hợp lệ (10-11 số)'
    if (!form.password) errs.password = 'Vui lòng nhập mật khẩu'
    else if (form.password.length < 6) errs.password = 'Mật khẩu tối thiểu 6 ký tự'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Mật khẩu không khớp'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setServerError('')
    setLoading(true)
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone || undefined,
        password: form.password,
      })
      setSuccess(true)
      setTimeout(() => navigate('/login?registered=true'), 1500)
    } catch (err) {
      setServerError(err.response?.data?.error || 'Đăng ký thất bại, vui lòng thử lại')
    } finally {
      setLoading(false)
    }
  }

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      <StarsBackground />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Đăng ký</h1>
            <p className="text-text-muted text-sm mt-1">Tham gia CELESTIA CINEMA ngay hôm nay</p>
          </div>

          {success && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm text-center">
              Đăng ký thành công! Đang chuyển hướng...
            </div>
          )}

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Họ tên" type="text" placeholder="Nguyễn Văn A" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} icon={User} error={errors.fullName} required />
            <Input label="Email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => update('email', e.target.value)} icon={Mail} error={errors.email} required />
            <Input label="Số điện thoại" type="tel" placeholder="0901234567" value={form.phone} onChange={(e) => update('phone', e.target.value)} icon={Phone} error={errors.phone} />
            <Input label="Mật khẩu" type="password" placeholder="••••••••" value={form.password} onChange={(e) => update('password', e.target.value)} icon={Lock} error={errors.password} required />
            <Input label="Xác nhận mật khẩu" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} error={errors.confirmPassword} required />

            <Button type="submit" disabled={loading || success} className="w-full flex items-center justify-center gap-2 text-lg py-3">
              <UserPlus size={20} />
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </form>

          <p className="text-center text-sm text-text-muted">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-galaxy-purple hover:text-galaxy-pink transition-colors font-medium">
              Đăng nhập
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
