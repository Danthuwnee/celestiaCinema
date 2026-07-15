import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react'
import authApi from '../api/authApi'
import { useAuth } from '../contexts/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Register() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [emailChecking, setEmailChecking] = useState(false)
  const [emailTaken, setEmailTaken] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const emailTimer = useRef(null)

  useEffect(() => {
    const email = form.email.trim()
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailTaken(false)
      return
    }
    setEmailChecking(true)
    clearTimeout(emailTimer.current)
    emailTimer.current = setTimeout(async () => {
      try {
        const res = await authApi.checkEmail(email)
        setEmailTaken(!res.data.available)
      } catch {
        setEmailTaken(false)
      } finally {
        setEmailChecking(false)
      }
    }, 500)
    return () => clearTimeout(emailTimer.current)
  }, [form.email])

  const validatePassword = (pw) => {
    if (!pw) return 'Vui lòng nhập mật khẩu'
    if (pw.length < 6) return 'Mật khẩu tối thiểu 6 ký tự'
    if (!/[A-Z]/.test(pw)) return 'Mật khẩu phải có chữ hoa'
    if (!/[a-z]/.test(pw)) return 'Mật khẩu phải có chữ thường'
    if (!/\d/.test(pw)) return 'Mật khẩu phải có số'
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) return 'Mật khẩu phải có ký tự đặc biệt'
    return null
  }

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ tên'
    else if (form.fullName.trim().length < 2) errs.fullName = 'Họ tên tối thiểu 2 ký tự'

    if (!form.email.trim()) errs.email = 'Vui lòng nhập email'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Email không hợp lệ'

    if (!form.phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại'
    else if (!/^0\d{9}$/.test(form.phone)) errs.phone = 'Số điện thoại phải có 10 số'

    const passwordErr = validatePassword(form.password)
    if (passwordErr) errs.password = passwordErr

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
        phone: form.phone,
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

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input label="Họ tên" type="text" placeholder="Nguyễn Văn A" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} icon={User} error={errors.fullName} />
            <Input label="Email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => { update('email', e.target.value); setEmailTaken(false) }} icon={Mail} error={errors.email || (emailTaken && 'Email đã được sử dụng')} />
            <Input label="Số điện thoại" type="tel" placeholder="0901234567" value={form.phone} onChange={(e) => update('phone', e.target.value)} icon={Phone} error={errors.phone} />
            <Input label="Mật khẩu" type="password" placeholder="••••••••" value={form.password} onChange={(e) => update('password', e.target.value)} icon={Lock} error={errors.password} />
            <Input label="Xác nhận mật khẩu" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} error={errors.confirmPassword} />

            <Button type="submit" disabled={loading || success || emailTaken} className="w-full flex items-center justify-center gap-2 text-lg py-3">
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
