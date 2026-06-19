import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Trash2, Film } from 'lucide-react'
import adminApi from '../../api/adminApi'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Loading from '../../components/ui/Loading'

export default function AdminMovies() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', duration: 120, language: 'Tiếng Việt', ageRating: 'T13', showingStartDate: '', showingEndDate: '', trailerUrl: '', posterUrl: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'movies'],
    queryFn: () => adminApi.getMovies().then(r => r.data),
  })

  const movies = data?.content || data || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    await adminApi.createMovie(form)
    queryClient.invalidateQueries({ queryKey: ['admin', 'movies'] })
    setShowForm(false)
    setForm({ title: '', description: '', duration: 120, language: 'Tiếng Việt', ageRating: 'T13', showingStartDate: '', showingEndDate: '', trailerUrl: '', posterUrl: '' })
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
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2"><Plus size={16} /> Thêm phim</Button>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Thêm phim">
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            { label: 'Tên phim', field: 'title', type: 'text' },
            { label: 'Thời lượng (phút)', field: 'duration', type: 'number' },
            { label: 'Ngôn ngữ', field: 'language', type: 'text' },
            { label: 'Trailer URL', field: 'trailerUrl', type: 'text' },
            { label: 'Poster URL', field: 'posterUrl', type: 'text' },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="text-sm text-text-secondary">{label}</label>
              <input type={type} value={form[field]} onChange={(e) => setForm(p => ({ ...p, [field]: e.target.value }))} className="input-field mt-1" required={field !== 'trailerUrl' && field !== 'posterUrl'} />
            </div>
          ))}
          <div>
            <label className="text-sm text-text-secondary">Mô tả</label>
            <textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} className="input-field mt-1" rows={3} />
          </div>
          <div>
            <label className="text-sm text-text-secondary">Phân loại</label>
            <select value={form.ageRating} onChange={(e) => setForm(p => ({ ...p, ageRating: e.target.value }))} className="input-field mt-1">
              {['P', 'T13', 'T16', 'T18'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm text-text-secondary">Ngày khởi chiếu</label><input type="date" value={form.showingStartDate} onChange={(e) => setForm(p => ({ ...p, showingStartDate: e.target.value }))} className="input-field mt-1" /></div>
            <div><label className="text-sm text-text-secondary">Ngày kết thúc</label><input type="date" value={form.showingEndDate} onChange={(e) => setForm(p => ({ ...p, showingEndDate: e.target.value }))} className="input-field mt-1" /></div>
          </div>
          <Button type="submit" className="w-full">Lưu</Button>
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
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(m.movieId || m.id)} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 size={16} /></button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
