import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Popcorn } from 'lucide-react'
import adminApi from '../../api/adminApi'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Loading from '../../components/ui/Loading'

export default function AdminCombos() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingCombo, setEditingCombo] = useState(null)
  const [form, setForm] = useState({ comboName: '', description: '', price: 0, imageUrl: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'combos'],
    queryFn: () => adminApi.getCombos().then(r => r.data),
  })

  const combos = data?.content || data || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingCombo) {
      await adminApi.updateCombo(editingCombo.comboId, form)
    } else {
      await adminApi.createCombo(form)
    }
    queryClient.invalidateQueries({ queryKey: ['admin', 'combos'] })
    setShowForm(false)
    setEditingCombo(null)
    setForm({ comboName: '', description: '', price: 0, imageUrl: '' })
  }

  const handleEdit = (combo) => {
    setForm({ comboName: combo.comboName, description: combo.description || '', price: combo.price, imageUrl: combo.imageUrl || '' })
    setEditingCombo(combo)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa combo này?')) return
    await adminApi.deleteCombo(id)
    queryClient.invalidateQueries({ queryKey: ['admin', 'combos'] })
  }

  if (isLoading) return <Loading />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Popcorn size={24} className="text-galaxy-cyan" /> Combo bắp nước</h1>
        <Button onClick={() => { setForm({ comboName: '', description: '', price: 0, imageUrl: '' }); setEditingCombo(null); setShowForm(true) }} className="flex items-center gap-2"><Plus size={16} /> Thêm combo</Button>
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditingCombo(null) }} title={editingCombo ? 'Sửa combo' : 'Thêm combo'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div><label className="text-sm text-text-secondary">Tên combo</label><input type="text" value={form.comboName} onChange={(e) => setForm(p => ({ ...p, comboName: e.target.value }))} className="input-field mt-1" required /></div>
          <div><label className="text-sm text-text-secondary">Mô tả</label><textarea rows={2} value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} className="input-field mt-1" /></div>
          <div><label className="text-sm text-text-secondary">Giá</label><input type="number" value={form.price} onChange={(e) => setForm(p => ({ ...p, price: +e.target.value }))} className="input-field mt-1" /></div>
          <div>
            <label className="text-sm text-text-secondary">Hình ảnh URL</label>
            <input type="text" value={form.imageUrl} onChange={(e) => setForm(p => ({ ...p, imageUrl: e.target.value }))} className="input-field mt-1" />
            {form.imageUrl && (
              <div className="mt-2">
                <img src={form.imageUrl} alt="Preview"
                  className="w-24 h-24 object-cover rounded-lg border border-white/10"
                  onError={(e) => { e.target.style.display = 'none' }} />
              </div>
            )}
          </div>
          <Button type="submit" className="w-full">{editingCombo ? 'Cập nhật' : 'Lưu'}</Button>
        </form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(combos || []).map((combo, i) => (
          <motion.div key={combo.comboId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 flex items-start gap-4">
            {combo.imageUrl ? (
              <img src={combo.imageUrl} alt={combo.comboName} className="w-24 h-24 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <Popcorn size={28} className="text-text-muted" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold truncate">{combo.comboName}</h3>
                <button onClick={() => handleEdit(combo)} className="text-text-muted hover:text-white transition-colors shrink-0 ml-2">
                  <Pencil size={14} />
                </button>
              </div>
              <p className="text-lg font-bold galaxy-text-gradient mb-2">{combo.price?.toLocaleString()}₫</p>
              <button onClick={() => handleDelete(combo.comboId)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"><Trash2 size={14} /> Xóa</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
