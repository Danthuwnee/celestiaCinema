import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Home, Trash2 } from 'lucide-react'
import adminApi from '../../api/adminApi'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Loading from '../../components/ui/Loading'

export default function AdminRooms() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ roomName: '', totalRows: 5, totalColumns: 10 })

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['admin', 'rooms'],
    queryFn: () => adminApi.getRooms().then(r => r.data),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await adminApi.createRoom(form)
    queryClient.invalidateQueries({ queryKey: ['admin', 'rooms'] })
    setShowForm(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa phòng này?')) return
    await adminApi.updateRoom(id, { status: 'INACTIVE' })
    queryClient.invalidateQueries({ queryKey: ['admin', 'rooms'] })
  }

  if (isLoading) return <Loading />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Home size={24} className="text-galaxy-cyan" /> Quản lý Phòng chiếu</h1>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2"><Plus size={16} /> Thêm phòng</Button>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Thêm phòng">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div><label className="text-sm text-text-secondary">Tên phòng</label><input type="text" value={form.roomName} onChange={(e) => setForm(p => ({ ...p, roomName: e.target.value }))} className="input-field mt-1" required /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm text-text-secondary">Số hàng</label><input type="number" value={form.totalRows} onChange={(e) => setForm(p => ({ ...p, totalRows: +e.target.value }))} className="input-field mt-1" min={1} /></div>
            <div><label className="text-sm text-text-secondary">Số cột</label><input type="number" value={form.totalColumns} onChange={(e) => setForm(p => ({ ...p, totalColumns: +e.target.value }))} className="input-field mt-1" min={1} /></div>
          </div>
          <Button type="submit" className="w-full">Tạo phòng</Button>
        </form>
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(rooms || []).map((room, i) => (
          <motion.div key={room.roomId || room.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{room.roomName}</h3>
                <p className="text-xs text-text-muted mt-1">{room.totalRows} hàng x {room.totalColumns} cột = {room.totalRows * room.totalColumns} ghế</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs ${room.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{room.status}</span>
            </div>
            <button onClick={() => handleDelete(room.roomId || room.id)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1 transition-colors"><Trash2 size={14} /> Xóa</button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
