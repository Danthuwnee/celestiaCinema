import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Film, Home, Clock, Ticket, Popcorn, BarChart3,
  ChevronLeft, ChevronRight, LogOut, ExternalLink, Star
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
  { path: '/admin/statistics', icon: BarChart3, label: 'Thống kê' },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen flex">
      <StarsBackground />

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        className="relative z-20 bg-space-dark/90 backdrop-blur-xl border-r border-white/10 flex flex-col shrink-0"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center gap-2 border-b border-white/10 px-3">
          <div className="w-7 h-7 rounded-full bg-button-glow flex items-center justify-center shrink-0">
            <Star size={14} className="text-white" fill="white" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
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

        {/* Nav items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
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
                {!collapsed && (
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
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all w-full"
          >
            <ExternalLink size={18} className="shrink-0" />
            <AnimatePresence mode="wait">
              {!collapsed && (
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
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut size={18} className="shrink-0" />
            <AnimatePresence mode="wait">
              {!collapsed && (
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
            className="flex items-center justify-center w-full py-2 rounded-xl text-text-muted hover:text-white hover:bg-white/5 transition-all mt-2"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <main className="flex-1 relative z-10 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
