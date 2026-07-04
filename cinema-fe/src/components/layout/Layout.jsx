import { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Film, User, Clock, LogOut, Star, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import StarsBackground from '../ui/StarsBackground'

const navLinks = [
  { path: '/', label: 'Trang chủ' },
  { path: '/?tab=now-showing', label: 'Phim đang chiếu' },
  { path: '/?tab=coming-soon', label: 'Phim sắp chiếu' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname)

  return (
    <div className="min-h-screen text-white">
      <StarsBackground />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-space-dark/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-galaxy-purple/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 bg-button-glow rounded-full blur-sm group-hover:blur-md transition-all" />
              <div className="relative w-8 h-8 rounded-full bg-space-dark border border-galaxy-purple/50 flex items-center justify-center">
                <Star size={16} className="text-galaxy-cyan" fill="#00D4FF" />
              </div>
            </div>
            <span className="font-display text-lg font-bold galaxy-text-gradient">
              CELESTIA
            </span>
          </Link>

          {/* Desktop Nav */}
          {!isAuthPage && (
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path || location.search === link.path.split('?')[1]
                      ? 'text-white bg-white/10'
                      : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-button-glow flex items-center justify-center text-xs font-bold">
                    {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user.fullName}</span>
                  <ChevronDown size={14} className={`text-text-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-56 glass-card p-2 space-y-1"
                    >
                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"
                        >
                          <Film size={16} />
                          Admin Dashboard
                        </Link>
                      )}
                      {user.role !== 'ADMIN' && (
                        <Link
                          to="/bookings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"
                        >
                          <Clock size={16} />
                          Lịch sử đặt vé
                        </Link>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all"
                      >
                        <User size={16} />
                        Hồ sơ cá nhân
                      </Link>
                      <hr className="border-white/10 my-1" />
                      <button
                        onClick={() => { setProfileOpen(false); handleLogout() }}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all w-full"
                      >
                        <LogOut size={16} />
                        Đăng xuất
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={location.pathname === '/login' ? 'btn-primary text-sm py-2 px-4' : 'px-4 py-2 text-sm font-medium text-text-secondary hover:text-white transition-colors'}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className={location.pathname === '/register' ? 'btn-primary text-sm py-2 px-4' : 'px-4 py-2 text-sm font-medium text-text-secondary hover:text-white transition-colors'}
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden ml-2 p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-all"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {!isAuthPage && (
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-16 left-0 right-0 z-30 bg-space-dark/95 backdrop-blur-xl border-b border-white/10 md:hidden"
            >
              <nav className="p-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-white hover:bg-white/5 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Main content */}
      <main className="pt-16 min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      {!isAuthPage && (
        <footer className="border-t border-white/10 bg-space-deeper/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="col-span-2 md:col-span-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-button-glow flex items-center justify-center">
                    <Star size={12} className="text-white" fill="white" />
                  </div>
                  <span className="font-display font-bold galaxy-text-gradient text-sm">CELESTIA</span>
                </div>
                <p className="text-text-muted text-xs">Your Gateway to Cinematic Experiences</p>
              </div>
              <div>
                <h4 className="font-semibold text-xs mb-2">Danh mục</h4>
                <ul className="space-y-1">
                  <li><Link to="/" className="text-text-muted text-xs hover:text-galaxy-cyan transition-colors">Phim đang chiếu</Link></li>
                  <li><Link to="/?tab=coming-soon" className="text-text-muted text-xs hover:text-galaxy-cyan transition-colors">Phim sắp chiếu</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-xs mb-2">Hỗ trợ</h4>
                <ul className="space-y-1">
                  <li><span className="text-text-muted text-xs">Trung tâm trợ giúp</span></li>
                  <li><span className="text-text-muted text-xs">Điều khoản sử dụng</span></li>
                  <li><span className="text-text-muted text-xs">Chính sách bảo mật</span></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-xs mb-2">Kết nối</h4>
                <ul className="space-y-1">
                  <li className="text-text-muted text-xs">Facebook</li>
                  <li className="text-text-muted text-xs">Instagram</li>
                  <li className="text-text-muted text-xs">TikTok</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-center text-text-muted text-[10px]">
              &copy; 2026 CELESTIA CINEMA. All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
