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
    <div className="max-w-7xl mx-auto px-4 py-6">
      <button onClick={() => window.history.back()} className="text-text-muted hover:text-white transition-colors mb-4 flex items-center gap-1 text-sm">
        <ChevronRight size={14} className="rotate-180" /> Quay lại
      </button>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-1"
        >
          <div className="glass-card overflow-hidden">
            <div className="aspect-[3/4] flex items-center justify-center">
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
          className="md:col-span-3 space-y-3"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={movie.ageRating}>{movie.ageRating}</Badge>
            {movie.genres?.map(g => (
              <Badge key={g.genreId || g} variant="ACTIVE" className="!bg-galaxy-purple/20 !text-galaxy-purple !border-galaxy-purple/30">{g.name || g}</Badge>
            ))}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold">{movie.title}</h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
            <span className="flex items-center gap-1"><Clock size={14} /> {movie.duration} phút</span>
            <span className="flex items-center gap-1"><Globe size={14} /> {movie.language}</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> Khởi chiếu: {new Date(movie.showingStartDate).toLocaleDateString('vi-VN')}</span>
          </div>

          <p className="text-text-secondary text-sm leading-relaxed">{movie.description}</p>

          {movie.trailerUrl && (
            <div className="aspect-video rounded-xl overflow-hidden glass-card">
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
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Play size={18} className="text-galaxy-cyan" /> Suất chiếu
        </h2>

        {Object.keys(groupedShowtimes).length === 0 ? (
          <div className="glass-card p-6 text-center text-text-muted">Chưa có suất chiếu</div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedShowtimes).map(([date, sts]) => (
              <div key={date}>
                <p className="text-xs font-medium text-text-secondary mb-2">
                  {new Date(date).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2">
                  {sts.map(st => (
                    <Link
                      key={st.showtimeId}
                      to={`/booking/${st.showtimeId}`}
                      className="glass-card p-3 text-center hover:border-galaxy-purple/50 transition-all group"
                    >
                      <p className="text-base font-bold text-galaxy-cyan group-hover:text-galaxy-pink transition-colors">
                        {new Date(st.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-[10px] text-text-muted mt-0.5">
                        {new Date(st.endTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs font-semibold text-white mt-1">{st.basePrice?.toLocaleString()}₫</p>
                      {st.roomName && <p className="text-[10px] text-text-muted mt-0.5">{st.roomName}</p>}
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
