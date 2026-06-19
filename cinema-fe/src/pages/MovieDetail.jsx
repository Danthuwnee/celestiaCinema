import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, Calendar, Globe, Play, ChevronRight } from 'lucide-react'
import movieApi from '../api/movieApi'
import showtimeApi from '../api/showtimeApi'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Loading from '../components/ui/Loading'

export default function MovieDetail() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [showtimes, setShowtimes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    Promise.all([
      movieApi.getMovieDetail(id),
      showtimeApi.getShowtimesByMovie(id)
    ])
      .then(([movieRes, showtimeRes]) => {
        setMovie(movieRes.data.movie || movieRes.data)
        setShowtimes(showtimeRes.data || [])
      })
      .catch(() => setError('Không tìm thấy phim'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Loading />
  if (error) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-text-muted">{error}</div>
  if (!movie) return null

  const groupedShowtimes = showtimes.reduce((acc, st) => {
    const date = new Date(st.startTime).toDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(st)
    return acc
  }, {})

  const trailerEmbed = movie.trailerUrl?.includes('youtube.com/watch')
    ? movie.trailerUrl.replace('watch?v=', 'embed/')
    : movie.trailerUrl

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={() => window.history.back()} className="text-text-muted hover:text-white transition-colors mb-6 flex items-center gap-1">
        <ChevronRight size={16} className="rotate-180" /> Quay lại
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1"
        >
          <div className="glass-card overflow-hidden">
            <div className="aspect-[2/3] flex items-center justify-center">
              {movie.posterUrl ? (
                <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl font-bold galaxy-text-gradient">{movie.title?.[0] || '?'}</span>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 space-y-4"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={movie.ageRating}>{movie.ageRating}</Badge>
            {movie.genres?.map(g => (
              <Badge key={g.genreId || g} variant="ACTIVE" className="!bg-galaxy-purple/20 !text-galaxy-purple !border-galaxy-purple/30">{g.name || g}</Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1"><Clock size={14} /> {movie.duration} phút</span>
            <span className="flex items-center gap-1"><Globe size={14} /> {movie.language}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> Khởi chiếu: {new Date(movie.showingStartDate).toLocaleDateString('vi-VN')}</span>
          </div>

          <p className="text-text-secondary leading-relaxed">{movie.description}</p>

          {movie.trailerUrl && (
            <div className="aspect-video rounded-2xl overflow-hidden glass-card">
              <iframe
                src={trailerEmbed}
                title="Trailer"
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          )}
        </motion.div>
      </div>

      {/* Showtimes */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Play size={20} className="text-galaxy-cyan" /> Suất chiếu
        </h2>

        {Object.keys(groupedShowtimes).length === 0 ? (
          <div className="glass-card p-8 text-center text-text-muted">Chưa có suất chiếu</div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedShowtimes).map(([date, sts]) => (
              <div key={date}>
                <p className="text-sm font-medium text-text-secondary mb-3">
                  {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {sts.map(st => (
                    <Link
                      key={st.showtimeId}
                      to={`/booking/${st.showtimeId}`}
                      className="glass-card p-4 text-center hover:border-galaxy-purple/50 transition-all group"
                    >
                      <p className="text-lg font-bold text-galaxy-cyan group-hover:text-galaxy-pink transition-colors">
                        {new Date(st.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        {new Date(st.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm font-semibold text-white mt-2">{st.basePrice?.toLocaleString()}₫</p>
                      {st.roomName && <p className="text-xs text-text-muted mt-1">{st.roomName}</p>}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
