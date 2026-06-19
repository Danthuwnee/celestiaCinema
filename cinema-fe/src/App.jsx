import { Routes, Route } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import Home from './pages/Home'
import MovieDetail from './pages/MovieDetail'
import SeatSelection from './pages/SeatSelection'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Profile from './pages/Profile'
import BookingHistory from './pages/BookingHistory'
import BookingSuccess from './pages/BookingSuccess'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMovies from './pages/admin/AdminMovies'
import AdminRooms from './pages/admin/AdminRooms'
import AdminShowtimes from './pages/admin/AdminShowtimes'
import AdminCoupons from './pages/admin/AdminCoupons'
import AdminCombos from './pages/admin/AdminCombos'
import AdminStatistics from './pages/admin/AdminStatistics'

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/booking/:showtimeId" element={<SeatSelection />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookings" element={<BookingHistory />} />
        <Route path="/booking/success" element={<BookingSuccess />} />
        <Route path="/booking/failed" element={<BookingSuccess />} />
      </Route>
      {user?.role === 'ADMIN' && (
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="rooms" element={<AdminRooms />} />
          <Route path="showtimes" element={<AdminShowtimes />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="combos" element={<AdminCombos />} />
          <Route path="statistics" element={<AdminStatistics />} />
        </Route>
      )}
    </Routes>
  )
}
