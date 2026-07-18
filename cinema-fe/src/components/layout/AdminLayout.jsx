import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Film, Home, Clock, Ticket, Popcorn,
  ChevronLeft, ChevronRight, LogOut, ExternalLink, Star, Menu, X
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import StarsBackground from '../ui/StarsBackground'

const sidebarItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/movies', icon: Film, label: 'Phim' },
  { path: '/admin/rooms', icon: Home, label: 'Phòng chiếu' },
  { path: '/admin/showtimes', icon: Clock, label: 'Suất chiếu' },
  { path: '/admin/coupons', icon: Ticket, label: 'Mã giảm giá' },
  { path: '/admin/combos', icon: Popcorn, label: 'Combo' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)
    const handler = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const showLabels = !collapsed || mobileOpen

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex">
      <StarsBackground />

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-30 md:hidden p-2.5 rounded-xl bg-space-dark/80 backdrop-blur-xl border border-white/10 text-white shadow-lg hover:bg-white/10 transition-all"
      >
        <Menu size={20} />
      </button>

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-20 bg-black/60 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={isMobile ? {} : { width: collapsed ? 72 : 240 }}
        className={`
          flex flex-col shrink-0
          bg-space-dark/90 backdrop-blur-xl border-r border-white/10
          overflow-y-auto
          /* Mobile drawer */
          fixed inset-y-0 left-0 z-30 w-60
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          /* Desktop */
          md:relative md:z-20 md:translate-x-0 md:transition-none
        `}
      >
        {/* Logo + close */}
        <div className="h-16 flex items-center justify-between gap-2 border-b border-white/10 px-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-button-glow flex items-center justify-center shrink-0">
              <Star size={14} className="text-white" fill="white" />
            </div>
            <AnimatePresence mode="wait">
              {showLabels && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-display text-sm galaxy-text-gradient font-bold whitespace-nowrap"
                >
                  CELESTIA
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 text-text-secondary hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-button-glow text-white shadow-lg shadow-galaxy-purple/20'
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon size={18} className="shrink-0" />
              <AnimatePresence mode="wait">
                {showLabels && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <button
            onClick={() => { navigate('/'); setMobileOpen(false) }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all w-full"
          >
            <ExternalLink size={18} className="shrink-0" />
            <AnimatePresence mode="wait">
              {showLabels && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  Về trang chủ
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => { handleLogout(); setMobileOpen(false) }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut size={18} className="shrink-0" />
            <AnimatePresence mode="wait">
              {showLabels && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="whitespace-nowrap"
                >
                  Đăng xuất
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex items-center justify-center w-full py-2 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-all mt-2"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 pt-20 md:pt-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
