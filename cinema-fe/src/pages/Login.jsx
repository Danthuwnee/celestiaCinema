import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import StarsBackground from '../components/ui/StarsBackground'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      const redirect = searchParams.get('redirect') || '/'
      navigate(redirect)
    } catch (err) {
      setError(err.response?.data?.error || 'Email hoặc mật khẩu không đúng')
    } finally {
      setLoading(false)
    }
  }

  const registered = searchParams.get('registered')

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
            <h1 className="text-2xl font-bold">Đăng nhập</h1>
            <p className="text-text-muted text-sm mt-1">Chào mừng trở lại CELESTIA CINEMA</p>
          </div>

          {registered && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm text-center">
              Đăng ký thành công! Vui lòng đăng nhập.
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 accent-galaxy-purple"
                />
                <span className="text-sm text-text-secondary">Ghi nhớ đăng nhập</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-galaxy-purple hover:text-galaxy-pink transition-colors">
                Quên mật khẩu?
              </Link>
            </div>

            <Button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 text-lg py-3">
              <LogIn size={20} />
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>

          <p className="text-center text-sm text-text-muted">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-galaxy-purple hover:text-galaxy-pink transition-colors font-medium">
              Đăng ký
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
