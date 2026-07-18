import { useState, useEffect, useRef, useMemo } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Play, Clock, Star, Calendar, ChevronLeft, ChevronRight, Tag } from 'lucide-react'
import movieApi from '../api/movieApi'
import couponApi from '../api/couponApi'
import Badge from '../components/ui/Badge'
import Loading from '../components/ui/Loading'

const tabs = [
  { key: 'now-showing', label: 'Phim đang chiếu' },
  { key: 'coming-soon', label: 'Phim sắp chiếu' },
  { key: 'schedule', label: 'Lịch chiếu' },
]

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const activeTab = searchParams.get('tab') || 'now-showing'
  const [movies, setMovies] = useState([])
  const [heroMovies, setHeroMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [heroIndex, setHeroIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])
  const [schedule, setSchedule] = useState([])
  const [scheduleLoading, setScheduleLoading] = useState(false)
  const [scheduleError, setScheduleError] = useState('')
  const [dateStartIndex, setDateStartIndex] = useState(0)
  const [activeCoupons, setActiveCoupons] = useState([])
  const couponScrollRef = useRef(null)
  const pageSize = 12

  useEffect(() => {
    movieApi.getGenres().then(r => setGenres(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    movieApi.getHeroMovies({ page: 0, size: 10 })
      .then(r => setHeroMovies(r.data?.content || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      setCurrentPage(0)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setCurrentPage(0)
  }, [activeTab])

  useEffect(() => {
    setCurrentPage(0)
  }, [selectedGenres])

  useEffect(() => {
    if (activeTab === 'schedule') return
    setLoading(true)
    const params = { page: currentPage, size: pageSize }
    let fetch
    if (debouncedQuery) {
      fetch = movieApi.searchMovies(debouncedQuery, params)
    } else if (selectedGenres.length > 0) {
      fetch = movieApi.filterByGenres(selectedGenres, params)
    } else {
      fetch = activeTab === 'now-showing' ? movieApi.getNowShowing(params) : movieApi.getComingSoon(params)
    }
    fetch
      .then(r => {
        const data = r.data?.content || []
        setMovies(data)
        setTotalPages(r.data?.totalPages || 0)
      })
      .catch(() => setMovies([]))
      .finally(() => setLoading(false))
  }, [activeTab, currentPage, debouncedQuery, selectedGenres])

  const heroSlides = useMemo(() => {
    if (activeTab === 'schedule') return []
    return heroMovies.map(m => ({ type: 'movie', data: m }))
  }, [heroMovies, activeTab])

  useEffect(() => {
    if (heroSlides.length <= 1) return
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides])

  useEffect(() => {
    if (activeTab !== 'schedule') return
    setSelectedDate(new Date().toISOString().split('T')[0])
  }, [activeTab])

  useEffect(() => {
    if (activeTab !== 'schedule') return
    setScheduleLoading(true)
    setScheduleError('')
    movieApi.getSchedule(selectedDate)
      .then(r => { setSchedule(r.data || []); setScheduleError('') })
      .catch(() => { setSchedule([]); setScheduleError('Không thể tải lịch chiếu — thử lại sau') })
      .finally(() => setScheduleLoading(false))
  }, [activeTab, selectedDate])

  useEffect(() => {
    couponApi.getActiveCoupons()
      .then(r => { setActiveCoupons(r.data || []); setHeroIndex(0) })
      .catch(() => {})
  }, [])

  const weekdays = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
  const months = ['tháng 1','tháng 2','tháng 3','tháng 4','tháng 5','tháng 6','tháng 7','tháng 8','tháng 9','tháng 10','tháng 11','tháng 12']

  const dateOptions = Array.from({ length: 17 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const dow = d.getDay()
    return {
      value: d.toISOString().split('T')[0],
      dayLabel: i === 0 ? 'Hôm nay' : weekdays[dow],
      dayNumber: d.getDate(),
      fullDate: `${weekdays[dow]}, ${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`,
    }
  })

  return (
    <div>
      {/* Hero Section */}
      {activeTab !== 'schedule' && heroSlides.length > 0 && heroSlides[heroIndex] && (() => {
        const slide = heroSlides[heroIndex]
        return (
        <section className="relative h-[55vh] min-h-[380px] overflow-hidden">
          {slide.type === 'movie' && (
            <>
          <div className="absolute inset-0 bg-gradient-to-b from-space-dark/40 via-space-dark/70 to-space-dark" />
          <div className="absolute inset-0 bg-galaxy-hero" />
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${slide.data.posterUrl})`, filter: 'blur(8px) brightness(0.3)' }}
          />
          <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={slide.data.ageRating}>{slide.data.ageRating}</Badge>
                <span className="text-text-muted text-sm flex items-center gap-1">
                  <Clock size={14} /> {slide.data.duration} phút
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3">{slide.data.title}</h1>
              <p className="text-text-secondary text-base mb-4 line-clamp-2">{slide.data.description}</p>
              <div className="flex items-center gap-3">
                <Link
                  to={`/movies/${slide.data.movieId || slide.data.id}`}
                  className="btn-primary flex items-center gap-2 py-2.5 px-6"
                >
                  <Play size={18} /> Đặt Vé Ngay
                </Link>
                <Link
                  to={`/movies/${slide.data.movieId || slide.data.id}`}
                  className="btn-secondary flex items-center gap-2 py-2.5 px-6"
                >
                  Xem Trailer
                </Link>
              </div>
            </motion.div>
          </div>
            </>
          )}

          {heroSlides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === heroIndex
                      ? 'w-6 bg-galaxy-cyan'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </section>
      )})()}

      {activeTab !== 'schedule' && (
        <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-2 flex items-center gap-2"
          >
            <Search size={20} className="text-text-muted ml-2 shrink-0" />
            <input
              type="text"
              placeholder="Tìm kiếm phim yêu thích..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-text-muted py-2"
            />
          </motion.div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 glass-card p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSearchParams({ tab: tab.key })}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-button-glow text-white shadow-lg shadow-galaxy-purple/20'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              {tab.key === 'schedule' && <Calendar size={14} />}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'schedule' ? (
          <>

            {/* Date selector */}
            <div className="flex items-center gap-1.5 mb-1">
              <button
                onClick={() => setDateStartIndex(prev => Math.max(0, prev - 7))}
                disabled={dateStartIndex === 0}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center shrink-0 transition-all"
              >
                <ChevronLeft size={16} />
              </button>

              {dateOptions.slice(dateStartIndex, dateStartIndex + 7).map(d => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDate(d.value)}
                  className={`px-2 py-3 min-w-[85px] flex-1 rounded-xl text-sm font-medium transition-all text-center leading-tight ${
                    selectedDate === d.value
                      ? 'bg-button-glow text-white shadow-lg shadow-galaxy-purple/20'
                      : 'bg-white/5 text-text-secondary hover:text-white'
                  }`}
                >
                  <span className="block text-xs">{d.dayLabel}</span>
                  <span className="block text-lg font-bold">{d.dayNumber}</span>
                </button>
              ))}

              <button
                onClick={() => setDateStartIndex(prev => Math.min(10, prev + 7))}
                disabled={dateStartIndex >= 10}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center shrink-0 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <p className="text-sm text-text-secondary text-center mb-4">
              {dateOptions.find(d => d.value === selectedDate)?.fullDate}
            </p>

            {/* Schedule list */}
            {scheduleLoading ? (
              <Loading />
            ) : scheduleError ? (
              <div className="text-center py-20">
                <p className="text-red-400">{scheduleError}</p>
              </div>
            ) : schedule.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-text-muted">Không có suất chiếu trong ngày này</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 ml-9">
                {schedule.map((item, i) => (
                  <div key={item.movieId}>
                    <div className="glass-card p-4 flex gap-4">
                      <Link to={`/movies/${item.movieId}`} className="shrink-0">
                        <div className="w-[130px] h-[185px] rounded-lg overflow-hidden bg-white/5">
                          <img
                            src={item.posterUrl || '/placeholder.jpg'}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-lg font-bold galaxy-text-gradient">${(item.title || '?')[0]}</div>` }}
                          />
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/movies/${item.movieId}`} className="hover:text-galaxy-cyan transition-colors">
                          <h3 className="font-semibold text-base flex items-center gap-2">
                            {item.title}
                            <Badge variant={item.ageRating}>{item.ageRating}</Badge>
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-text-muted mt-0.5">
                          <span className="truncate">{item.genres?.map(g => g.name).join(', ')}</span>
                          {item.duration && <><span className="text-white/10">·</span><Clock size={10} className="shrink-0" /> {item.duration} phút</>}
                        </div>
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {item.showtimes?.map(st => {
                            const time = new Date(st.startTime)
                            const timeStr = time.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                            return (
                              <Link
                                key={st.showtimeId}
                                to={`/booking/${st.showtimeId}`}
                                className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap bg-gradient-to-r from-galaxy-purple to-galaxy-pink text-white hover:shadow-lg hover:shadow-galaxy-purple/30 transition-all"
                              >
                                {timeStr}
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Coupons section */}
            {activeCoupons.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Tag size={16} className="text-galaxy-cyan" />
                  <h2 className="text-sm font-semibold text-white">Khuyến mãi đặc biệt</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { if (couponScrollRef.current) couponScrollRef.current.scrollBy({ left: -280, behavior: 'smooth' }) }}
                    className="shrink-0 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <div ref={couponScrollRef} className="flex gap-3 overflow-x-auto no-scrollbar pb-2 flex-1">
                    {activeCoupons.map((cp, i) => (
                      <motion.div
                        key={cp.couponId || cp.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="shrink-0 w-[260px] glass-card p-4 flex items-start gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-button-glow flex items-center justify-center shrink-0">
                          <Tag size={18} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold galaxy-text-gradient mb-0.5">{cp.code}</p>
                          <p className="text-white text-xs font-semibold">
                            {cp.discountType === 'PERCENTAGE'
                              ? `Giảm ${cp.discountValue}%`
                              : `Giảm ${cp.discountValue?.toLocaleString()}₫`}
                          </p>
                          {cp.minOrderValue > 0 && (
                            <p className="text-[10px] text-text-muted mt-0.5">
                              Đơn từ {cp.minOrderValue?.toLocaleString()}₫
                            </p>
                          )}
                          <Link
                            to="/?tab=schedule"
                            onClick={() => sessionStorage.setItem('preselectedCoupon', cp.code)}
                            className="inline-block mt-2 text-[10px] font-medium text-galaxy-cyan hover:underline"
                          >
                            Đặt ngay →
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <button
                    onClick={() => { if (couponScrollRef.current) couponScrollRef.current.scrollBy({ left: 280, behavior: 'smooth' }) }}
                    className="shrink-0 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Genre filters */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {genres.map((genre) => (
                  <button
                    key={genre.genreId || genre.id}
                    onClick={() => setSelectedGenres(prev =>
                      prev.includes(genre.genreId || genre.id)
                        ? prev.filter(g => g !== (genre.genreId || genre.id))
                        : [...prev, genre.genreId || genre.id]
                    )}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedGenres.includes(genre.genreId || genre.id)
                        ? 'bg-galaxy-purple/30 text-galaxy-purple border border-galaxy-purple/50 shadow-lg shadow-galaxy-purple/10'
                        : 'bg-white/5 text-text-secondary border border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            )}

            {/* Movie grid */}
            {loading ? (
              <Loading />
            ) : movies.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-text-muted">Không tìm thấy phim phù hợp</p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 mb-8"
              >
                <AnimatePresence mode="popLayout">
                  {movies.map((movie, i) => (
                    <motion.div
                      key={movie.movieId || movie.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.05 }}
                      className="group relative glass-card-hover overflow-hidden"
                    >
                      <Link to={`/movies/${movie.movieId || movie.id}`}>
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <img
                            src={movie.posterUrl || '/placeholder.jpg'}
                            alt={movie.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => { e.target.src = ''; e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-4xl font-bold galaxy-text-gradient">${(movie.title || '?')[0]}</div>` }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-space-dark/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 gap-2">
                            <span className="btn-primary text-xs py-1 px-3 flex items-center gap-1">
                              Đặt Vé
                            </span>
                          </div>
                          <div className="absolute top-2 left-2 flex gap-1">
                            <Badge variant={movie.ageRating}>{movie.ageRating}</Badge>
                          </div>
                          {movie.rating && (
                            <div className="absolute top-1.5 right-1.5 bg-space-dark/80 backdrop-blur-sm rounded-md px-1.5 py-0.5 flex items-center gap-0.5">
                              <Star size={10} fill="#FF4FD8" color="#FF4FD8" />
                              <span className="text-[10px] font-semibold">{movie.rating}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <h3 className="font-medium text-xs leading-tight line-clamp-1 group-hover:text-galaxy-cyan transition-colors">
                            {movie.title}
                          </h3>
                          <div className="flex items-center gap-1 mt-1 text-[10px] text-text-muted">
                            <Clock size={10} />
                            <span>{movie.duration} phút</span>
                          </div>
                          {movie.genres && (
                            <div className="flex flex-wrap gap-0.5 mt-1.5">
                              {movie.genres.slice(0, 2).map(g => (
                                <span key={g.genreId || g} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-text-muted">
                                  {g.name || g}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mb-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all text-sm"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      i === currentPage
                        ? 'bg-galaxy-cyan text-space-dark'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all text-sm"
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
