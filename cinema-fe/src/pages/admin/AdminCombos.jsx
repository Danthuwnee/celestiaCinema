import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Trash2, Popcorn } from 'lucide-react'
import adminApi from '../../api/adminApi'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Loading from '../../components/ui/Loading'

export default function AdminCombos() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ comboName: '', description: '', price: 0, imageUrl: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'combos'],
    queryFn: () => adminApi.getCombos().then(r => r.data),
  })

  const combos = data?.content || data || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    await adminApi.createCombo(form)
    queryClient.invalidateQueries({ queryKey: ['admin', 'combos'] })
    setShowForm(false)
    setForm({ comboName: '', description: '', price: 0, imageUrl: '' })
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
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2"><Plus size={16} /> Thêm combo</Button>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Thêm combo">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div><label className="text-sm text-text-secondary">Tên combo</label><input type="text" value={form.comboName} onChange={(e) => setForm(p => ({ ...p, comboName: e.target.value }))} className="input-field mt-1" required /></div>
          <div><label className="text-sm text-text-secondary">Mô tả</label><textarea rows={2} value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} className="input-field mt-1" /></div>
          <div><label className="text-sm text-text-secondary">Giá</label><input type="number" value={form.price} onChange={(e) => setForm(p => ({ ...p, price: +e.target.value }))} className="input-field mt-1" /></div>
          <div><label className="text-sm text-text-secondary">Hình ảnh URL</label><input type="text" value={form.imageUrl} onChange={(e) => setForm(p => ({ ...p, imageUrl: e.target.value }))} className="input-field mt-1" /></div>
          <Button type="submit" className="w-full">Lưu</Button>
        </form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(combos || []).map((combo, i) => (
          <motion.div key={combo.comboId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold">{combo.comboName}</h3>
                <p className="text-xs text-text-muted mt-1">{combo.description}</p>
              </div>
            </div>
            <p className="text-lg font-bold galaxy-text-gradient mb-3">{combo.price?.toLocaleString()}₫</p>
            <button onClick={() => handleDelete(combo.comboId)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"><Trash2 size={14} /> Xóa</button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
