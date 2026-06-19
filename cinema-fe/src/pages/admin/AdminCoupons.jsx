import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Trash2, Ticket } from 'lucide-react'
import adminApi from '../../api/adminApi'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Loading from '../../components/ui/Loading'

export default function AdminCoupons() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', discountType: 'PERCENTAGE', discountValue: 10, quantity: 100, minOrderValue: 0, expiredAt: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: () => adminApi.getCoupons().then(r => r.data),
  })

  const coupons = data?.content || data || []

  const handleSubmit = async (e) => {
    e.preventDefault()
    await adminApi.createCoupon(form)
    queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
    setShowForm(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa mã giảm giá này?')) return
    await adminApi.deleteCoupon(id)
    queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
  }

  if (isLoading) return <Loading />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Ticket size={24} className="text-galaxy-cyan" /> Mã giảm giá</h1>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2"><Plus size={16} /> Thêm mã</Button>
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="Thêm mã giảm giá">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div><label className="text-sm text-text-secondary">Mã code</label><input type="text" value={form.code} onChange={(e) => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} className="input-field mt-1" required /></div>
          <div>
            <label className="text-sm text-text-secondary">Loại</label>
            <select value={form.discountType} onChange={(e) => setForm(p => ({ ...p, discountType: e.target.value }))} className="input-field mt-1">
              <option value="PERCENTAGE">Phần trăm</option>
              <option value="FIXED_AMOUNT">Số tiền cố định</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm text-text-secondary">Giá trị</label><input type="number" value={form.discountValue} onChange={(e) => setForm(p => ({ ...p, discountValue: +e.target.value }))} className="input-field mt-1" /></div>
            <div><label className="text-sm text-text-secondary">Số lượng</label><input type="number" value={form.quantity} onChange={(e) => setForm(p => ({ ...p, quantity: +e.target.value }))} className="input-field mt-1" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm text-text-secondary">Đơn tối thiểu</label><input type="number" value={form.minOrderValue} onChange={(e) => setForm(p => ({ ...p, minOrderValue: +e.target.value }))} className="input-field mt-1" /></div>
            <div><label className="text-sm text-text-secondary">Hết hạn</label><input type="date" value={form.expiredAt} onChange={(e) => setForm(p => ({ ...p, expiredAt: e.target.value }))} className="input-field mt-1" /></div>
          </div>
          <Button type="submit" className="w-full">Lưu</Button>
        </form>
      </Modal>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-text-muted">
              <th className="text-left p-4">Code</th>
              <th className="text-left p-4 hidden md:table-cell">Loại</th>
              <th className="text-left p-4">Giá trị</th>
              <th className="text-left p-4 hidden md:table-cell">Còn lại</th>
              <th className="text-left p-4 hidden lg:table-cell">HSD</th>
              <th className="text-right p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c, i) => (
              <motion.tr key={c.couponId} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-galaxy-cyan">{c.code}</td>
                <td className="p-4 hidden md:table-cell text-text-muted">{c.discountType === 'PERCENTAGE' ? 'Phần trăm' : 'Số tiền'}</td>
                <td className="p-4">{c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `${c.discountValue?.toLocaleString()}₫`}</td>
                <td className="p-4 hidden md:table-cell">{c.quantity}</td>
                <td className="p-4 hidden lg:table-cell text-text-muted">{c.expiredAt ? new Date(c.expiredAt).toLocaleDateString('vi-VN') : '-'}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(c.couponId)} className="text-red-400 hover:text-red-300 transition-colors"><Trash2 size={16} /></button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
