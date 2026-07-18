import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Film, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import movieApi from '../../api/movieApi'
import adminApi from '../../api/adminApi'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Loading from '../../components/ui/Loading'

export default function AdminMovies() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [keyword, setKeyword] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const pageSize = 12
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchKeyword(keyword)
      if (keyword !== searchKeyword) setCurrentPage(0)
    }, 300)
    return () => clearTimeout(timer)
  }, [keyword])

  const movieSchema = z.object({
    title: z.string().min(1, 'Vui lòng nhập tên phim'),
    duration: z.number({ invalid_type_error: 'Vui lòng nhập thời lượng' }).min(1, 'Thời lượng phải lớn hơn 0'),
    language: z.string().min(1, 'Vui lòng nhập ngôn ngữ'),
    ageRating: z.string(),
    showingStartDate: z.string().optional(),
    showingEndDate: z.string().optional(),
    trailerUrl: z.string().optional(),
    posterUrl: z.union([z.string().url('URL không hợp lệ'), z.literal('')]).optional(),
    director: z.string().optional(),
    actors: z.string().optional(),
    description: z.string().optional(),
    genreIds: z.array(z.string()).min(1, 'Chọn ít nhất 1 thể loại'),
  }).refine((data) => {
    if (!data.showingEndDate || !data.showingStartDate) return true
    return new Date(data.showingEndDate) >= new Date(data.showingStartDate)
  }, { message: 'Ngày kết thúc phải sau ngày khởi chiếu', path: ['showingEndDate'] })

  const defaultMovieValues = { title: '', description: '', duration: 120, language: 'Tiếng Việt', ageRating: 'T13', showingStartDate: '', showingEndDate: '', trailerUrl: '', posterUrl: '', director: '', actors: '', genreIds: [] }

  const { register, handleSubmit: rhfHandleSubmit, formState: { errors, isValid }, watch, reset, setValue } = useForm({
    resolver: zodResolver(movieSchema),
    defaultValues: defaultMovieValues,
    mode: 'onChange',
  })
  const posterUrl = watch('posterUrl')
  const trailerUrl = watch('trailerUrl')
  const showingStartDate = watch('showingStartDate')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'movies', currentPage, searchKeyword],
    queryFn: () => adminApi.getMovies({ page: currentPage, size: pageSize, keyword: searchKeyword || undefined }).then(r => {
      setTotalPages(r.data?.totalPages || 0)
      return r.data
    }),
    keepPreviousData: true,
  })

  const { data: genreList } = useQuery({
    queryKey: ['genres'],
    queryFn: () => movieApi.getGenres().then(r => r.data),
  })

  const movies = data?.content || data || []

  const onSubmit = rhfHandleSubmit(async (data) => {
    if (editingMovie) {
      await adminApi.updateMovie(editingMovie.movieId || editingMovie.id, data)
    } else {
      await adminApi.createMovie(data)
    }
    queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] })
    setShowForm(false)
    setEditingMovie(null)
    reset(defaultMovieValues)
  })

  const handleEdit = (movie) => {
    reset({
      title: movie.title,
      description: movie.description || '',
      duration: movie.duration,
      language: movie.language,
      ageRating: movie.ageRating || 'T13',
      showingStartDate: movie.showingStartDate || '',
      showingEndDate: movie.showingEndDate || '',
      trailerUrl: movie.trailerUrl || '',
      posterUrl: movie.posterUrl || '',
      director: movie.director || '',
      actors: movie.actors || '',
      genreIds: movie.genres?.map(g => g.genreId || g.id) || [],
    })
    setEditingMovie(movie)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa phim này?')) return
    await adminApi.deleteMovie(id)
    queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] })
  }

  if (isLoading) return <Loading />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Film size={24} className="text-galaxy-cyan" /> Quản lý Phim</h1>
        <Button onClick={() => { reset(defaultMovieValues); setEditingMovie(null); setShowForm(true) }} className="flex items-center gap-2"><Plus size={16} /> Thêm phim</Button>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm kiếm theo tên phim..."
          className="input-field pl-9 w-full"
        />
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditingMovie(null); reset(defaultMovieValues) }} title={editingMovie ? 'Sửa phim' : 'Thêm phim'}>
        <form onSubmit={onSubmit} className="space-y-3">
          {[
            { label: 'Tên phim', field: 'title', type: 'text' },
            { label: 'Thời lượng (phút)', field: 'duration', type: 'number' },
            { label: 'Ngôn ngữ', field: 'language', type: 'text' },
            { label: 'Trailer URL', field: 'trailerUrl', type: 'text' },
            { label: 'Poster URL', field: 'posterUrl', type: 'text' },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="text-sm text-text-secondary">{label}</label>
              <input type={type} {...register(field, field === 'duration' ? { valueAsNumber: true } : {})} className={`input-field mt-1 ${errors[field] ? 'ring-2 ring-red-500' : ''}`} />
              {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field].message}</p>}
            </div>
          ))}
          {posterUrl && (
            <div>
              <label className="text-sm text-text-secondary">Xem trước Poster</label>
              <img src={posterUrl} alt="Poster preview" className="mt-1 h-40 w-auto rounded object-cover border border-white/10" onError={(e) => { e.target.style.display = 'none' }} />
            </div>
          )}
          {trailerUrl && trailerUrl.includes('youtube.com') && (
            <div>
              <label className="text-sm text-text-secondary">Xem trước Trailer</label>
              <div className="mt-1 aspect-video rounded overflow-hidden bg-black/50">
                <iframe src={trailerUrl.replace('watch?v=', 'embed/')} className="w-full h-full" allowFullScreen title="Trailer preview" />
              </div>
            </div>
          )}
          <div>
            <label className="text-sm text-text-secondary">Đạo diễn</label>
            <input type="text" {...register('director')} className="input-field mt-1" />
          </div>
          <div>
            <label className="text-sm text-text-secondary">Diễn viên</label>
            <textarea {...register('actors')} className="input-field mt-1" rows={2} />
          </div>
          <div>
            <label className="text-sm text-text-secondary">Mô tả</label>
            <textarea {...register('description')} className="input-field mt-1" rows={3} />
          </div>
          <div>
            <label className="text-sm text-text-secondary">Thể loại</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {genreList?.map(genre => {
                const selected = watch('genreIds') || []
                const isSelected = selected.includes(genre.genreId || genre.id)
                return (
                  <button
                    key={genre.genreId || genre.id}
                    type="button"
                    onClick={() => {
                      const current = watch('genreIds') || []
                      const updated = isSelected
                        ? current.filter(id => id !== (genre.genreId || genre.id))
                        : [...current, genre.genreId || genre.id]
                      setValue('genreIds', updated, { shouldValidate: true })
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-galaxy-cyan text-space-dark'
                        : 'bg-white/10 text-text-muted hover:bg-white/20'
                    }`}
                  >
                    {genre.name}
                  </button>
                )
              })}
            </div>
            {errors.genreIds && <p className="text-red-400 text-xs mt-1">{errors.genreIds.message}</p>}
          </div>
          <div>
            <label className="text-sm text-text-secondary">Phân loại</label>
            <select {...register('ageRating')} className="input-field mt-1">
              {['P', 'T13', 'T16', 'T18'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm text-text-secondary">Ngày khởi chiếu</label><input type="date" min={today} {...register('showingStartDate')} className={`input-field mt-1 ${errors.showingStartDate ? 'ring-2 ring-red-500' : ''}`} /></div>
            <div><label className="text-sm text-text-secondary">Ngày kết thúc</label><input type="date" min={showingStartDate || today} {...register('showingEndDate')} className={`input-field mt-1 ${errors.showingEndDate ? 'ring-2 ring-red-500' : ''}`} /></div>
          </div>
          {errors.showingEndDate && <p className="text-red-400 text-xs text-center">{errors.showingEndDate.message}</p>}
          <Button type="submit" disabled={!isValid} className="w-full">{editingMovie ? 'Cập nhật' : 'Lưu'}</Button>
        </form>
      </Modal>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-text-muted">
              <th className="text-left p-4">Tên phim</th>
              <th className="text-left p-4 hidden md:table-cell">Thời lượng</th>
              <th className="text-left p-4 hidden md:table-cell">Ngôn ngữ</th>
              <th className="text-left p-4 hidden lg:table-cell">Trạng thái</th>
              <th className="text-right p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m, i) => (
              <motion.tr key={m.movieId || m.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium">{m.title}</td>
                <td className="p-4 hidden md:table-cell text-text-muted">{m.duration} phút</td>
                <td className="p-4 hidden md:table-cell text-text-muted">{m.language}</td>
                <td className="p-4 hidden lg:table-cell"><span className={`px-2 py-0.5 rounded-full text-xs ${m.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{m.status}</span></td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  <button onClick={() => handleEdit(m)} className="text-text-muted hover:text-white transition-colors"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(m.movieId || m.id)} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 size={16} /></button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all text-sm"
          >
            <ChevronLeft size={14} /> Trước
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
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/20 transition-all text-sm"
          >
            Sau <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  )
}
