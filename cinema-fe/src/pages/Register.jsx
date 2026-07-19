import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Lock, UserPlus } from 'lucide-react'
import authApi from '../api/authApi'
import { useAuth } from '../contexts/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import BrandSide from '../components/auth/BrandSide'

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

  const validateField = (field, value) => {
    switch (field) {
      case 'fullName':
        if (!value.trim()) return 'Vui lòng nhập họ tên'
        if (value.trim().split(/\s+/).length < 2) return 'Họ tên phải có ít nhất 2 từ'
        return null
      case 'email':
        if (!value.trim()) return 'Vui lòng nhập email'
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email không hợp lệ'
        return null
      case 'phone':
        if (!value.trim()) return 'Vui lòng nhập số điện thoại'
        if (!value.startsWith('0')) return 'Số điện thoại phải bắt đầu bằng số 0'
        if (!/^\d+$/.test(value)) return 'Số điện thoại chỉ được chứa chữ số'
        if (value.length !== 10) return 'Số điện thoại phải có đúng 10 số'
        return null
      case 'password':
        return validatePassword(value)
      case 'confirmPassword':
        if (!form.password) return null
        if (value !== form.password) return 'Mật khẩu không khớp'
        return null
      default:
        return null
    }
  }

  const validate = () => {
    const fields = ['fullName', 'email', 'phone', 'password', 'confirmPassword']
    const errs = {}
    for (const field of fields) {
      const err = validateField(field, form[field])
      if (err) errs[field] = err
    }
    return errs
  }

  const handleBlur = (field) => {
    const err = validateField(field, form[field])
    setErrors(prev => ({ ...prev, [field]: err }))
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
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-gradient-to-br from-galaxy-purple/10 via-space-dark to-galaxy-cyan/10">
      <BrandSide />
      <div className="w-full lg:w-2/5 h-full overflow-y-auto flex items-start justify-center pt-3 p-4 bg-space-dark/20 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="glass-card p-3.5 space-y-1.5">
            <div className="text-center">
              <h1 className="text-base font-bold">Đăng ký</h1>
              <p className="text-text-muted text-[11px] mt-0.5">Tham gia CELESTIA CINEMA ngay hôm nay</p>
            </div>

            {success && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-3 py-2 rounded-xl text-xs text-center">
                Đăng ký thành công! Đang chuyển hướng...
              </div>
            )}

            {serverError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-2 rounded-xl text-xs text-center">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-1.5">
              <Input label="Họ tên" type="text" placeholder="Nguyễn Văn A" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} onBlur={() => handleBlur('fullName')} icon={User} error={errors.fullName} />
              <Input label="Email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => { update('email', e.target.value); setEmailTaken(false) }} onBlur={() => handleBlur('email')} icon={Mail} error={errors.email || (emailTaken && 'Email đã được sử dụng')} />
              <Input label="Số điện thoại" type="tel" placeholder="0901234567" value={form.phone} onChange={(e) => update('phone', e.target.value)} onBlur={() => handleBlur('phone')} icon={Phone} error={errors.phone} />
              <Input label="Mật khẩu" type="password" placeholder="••••••••" value={form.password} onChange={(e) => update('password', e.target.value)} onBlur={() => handleBlur('password')} icon={Lock} error={errors.password} />
              <Input label="Xác nhận mật khẩu" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} onBlur={() => handleBlur('confirmPassword')} error={errors.confirmPassword} />

              <Button type="submit" disabled={loading || success || emailTaken || Object.values(errors).some(Boolean)} className="w-full flex items-center justify-center gap-2 text-base py-2">
                <UserPlus size={18} />
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </Button>
            </form>

            <p className="text-center text-xs text-text-muted">
              Đã có tài khoản?{' '}
              <Link to="/login" className="text-galaxy-purple hover:text-galaxy-pink transition-colors font-medium">
                Đăng nhập
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
