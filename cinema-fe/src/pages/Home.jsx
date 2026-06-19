import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronRight, Play, Clock, Star } from 'lucide-react'
import movieApi from '../api/movieApi'
import Badge from '../components/ui/Badge'
import Loading from '../components/ui/Loading'

const tabs = [
  { key: 'now-showing', label: 'Phim đang chiếu' },
  { key: 'coming-soon', label: 'Phim sắp chiếu' },
]

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'now-showing'
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [heroMovie, setHeroMovie] = useState(null)

  useEffect(() => {
    movieApi.getGenres().then(r => setGenres(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetch = activeTab === 'now-showing' ? movieApi.getNowShowing() : movieApi.getComingSoon()
    fetch
      .then(r => {
        const data = r.data?.content || r.data || []
        setMovies(data)
        if (data.length > 0 && activeTab === 'now-showing') setHeroMovie(data[0])
      })
      .catch(() => setMovies([]))
      .finally(() => setLoading(false))
  }, [activeTab])

  const filtered = movies.filter(m => {
    const matchSearch = m.title?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchGenre = selectedGenres.length === 0 || m.genres?.some(g => selectedGenres.includes(g.genreId))
    return matchSearch && matchGenre
  })

  return (
    <div>
      {/* Hero Section */}
      {heroMovie && activeTab === 'now-showing' && (
        <section className="relative h-[55vh] min-h-[380px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-space-dark/40 via-space-dark/70 to-space-dark" />
          <div className="absolute inset-0 bg-galaxy-hero" />
          <div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${heroMovie.posterUrl})`, filter: 'blur(8px) brightness(0.3)' }}
          />
          <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={heroMovie.ageRating}>{heroMovie.ageRating}</Badge>
                <span className="text-text-muted text-sm flex items-center gap-1">
                  <Clock size={14} /> {heroMovie.duration} phút
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3">{heroMovie.title}</h1>
              <p className="text-text-secondary text-base mb-4 line-clamp-2">{heroMovie.description}</p>
              <div className="flex items-center gap-3">
                <Link
                  to={`/movies/${heroMovie.movieId || heroMovie.id}`}
                  className="btn-primary flex items-center gap-2 py-2.5 px-6"
                >
                  <Play size={18} /> Đặt Vé Ngay
                </Link>
                <Link
                  to={`/movies/${heroMovie.movieId || heroMovie.id}`}
                  className="btn-secondary flex items-center gap-2 py-2.5 px-6"
                >
                  Xem Trailer
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20 mb-8">
        {/* Search */}
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

      <div className="max-w-7xl mx-auto px-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 glass-card p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSearchParams({ tab: tab.key })}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-button-glow text-white shadow-lg shadow-galaxy-purple/20'
                  : 'text-text-secondary hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

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
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-muted">Không tìm thấy phim phù hợp</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((movie, i) => (
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
                    <div className="p-3">
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
      </div>
    </div>
  )
}
