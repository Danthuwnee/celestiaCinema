import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Plus, Pencil, Trash2, Ticket } from 'lucide-react'
import adminApi from '../../api/adminApi'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Loading from '../../components/ui/Loading'

function generateCouponCode(existingCodes) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code
  do {
    code = 'GG'
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
  } while (existingCodes.includes(code))
  return code
}

export default function AdminCoupons() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [formError, setFormError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: () => adminApi.getCoupons().then(r => r.data),
  })

  const coupons = (data?.content || data || [])

  const couponSchema = z.object({
    code: z.string().min(1, 'Vui lòng nhập mã code'),
    discountType: z.string(),
    discountValue: z.number({ invalid_type_error: 'Vui lòng nhập giá trị' }).min(1, 'Giá trị phải lớn hơn 0'),
    quantity: z.number({ invalid_type_error: 'Vui lòng nhập số lượng' }).min(0),
    minOrderValue: z.number().min(0),
    expiredAt: z.string().optional(),
  })

  const getDefaultCouponValues = (existingCodes = []) => ({
    code: generateCouponCode(existingCodes),
    discountType: 'PERCENTAGE',
    discountValue: 10,
    quantity: 100,
    minOrderValue: 0,
    expiredAt: '',
  })

  const { register, handleSubmit: rhfHandleSubmit, formState: { errors, isValid }, setValue, reset } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: getDefaultCouponValues(),
    mode: 'onChange',
  })

  const resetForm = () => {
    reset(getDefaultCouponValues(coupons.map(c => c.code)))
    setEditingCoupon(null)
    setFormError('')
  }

  const handleEdit = (coupon) => {
    reset({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      quantity: coupon.quantity,
      minOrderValue: coupon.minOrderValue,
      expiredAt: coupon.expiredAt ? coupon.expiredAt.substring(0, 10) : '',
    })
    setEditingCoupon(coupon)
    setShowForm(true)
  }

  const onSubmit = rhfHandleSubmit(async (data) => {
    setFormError('')
    const payload = {
      ...data,
      expiredAt: data.expiredAt ? data.expiredAt + 'T23:59:59' : null,
    }
    try {
      if (editingCoupon) {
        await adminApi.updateCoupon(editingCoupon.couponId, payload)
      } else {
        await adminApi.createCoupon(payload)
      }
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
      setShowForm(false)
      resetForm()
    } catch (err) {
      setFormError(err.response?.data?.error || 'Thao tác thất bại')
    }
  })

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa mã giảm giá này?')) return
    try {
      await adminApi.deleteCoupon(id)
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
    } catch (err) {
      console.error(err)
    }
  }

  if (isLoading) return <Loading />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Ticket size={24} className="text-galaxy-cyan" /> Mã giảm giá</h1>
        <Button onClick={() => { resetForm(); setShowForm(true) }} className="flex items-center gap-2"><Plus size={16} /> Thêm mã</Button>
      </div>

      <Modal isOpen={showForm} onClose={() => { setShowForm(false); resetForm() }} title={editingCoupon ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'}>
        <form onSubmit={onSubmit} className="space-y-3">
          {formError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm text-center">{formError}</div>}
          <div>
            <label className="text-sm text-text-secondary">Mã code</label>
            <div className="flex items-center gap-2 mt-1">
              <input type="text" {...register('code', { setValueAs: (v) => v.toUpperCase() })} className={`input-field flex-1 ${errors.code ? 'ring-2 ring-red-500' : ''}`} />
              {errors.code && <p className="text-red-400 text-xs mt-1">{errors.code.message}</p>}
              {!editingCoupon && (
                <button type="button" onClick={() => setValue('code', generateCouponCode(coupons.map(c => c.code)), { shouldValidate: true })} className="text-xs text-galaxy-cyan hover:text-white transition-colors shrink-0">
                  Sinh mã
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm text-text-secondary">Loại</label>
            <select {...register('discountType')} className="input-field mt-1">
              <option value="PERCENTAGE">Phần trăm</option>
              <option value="FIXED_AMOUNT">Số tiền cố định</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-text-secondary">Giá trị</label>
              <input type="number" {...register('discountValue', { valueAsNumber: true })} className={`input-field mt-1 ${errors.discountValue ? 'ring-2 ring-red-500' : ''}`} />
              {errors.discountValue && <p className="text-red-400 text-xs mt-1">{errors.discountValue.message}</p>}
            </div>
            <div>
              <label className="text-sm text-text-secondary">Số lượng</label>
              <input type="number" {...register('quantity', { valueAsNumber: true })} className={`input-field mt-1 ${errors.quantity ? 'ring-2 ring-red-500' : ''}`} />
              {errors.quantity && <p className="text-red-400 text-xs mt-1">{errors.quantity.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-text-secondary">Đơn tối thiểu</label>
              <input type="number" {...register('minOrderValue', { valueAsNumber: true })} className="input-field mt-1" />
            </div>
            <div>
              <label className="text-sm text-text-secondary">Hết hạn</label>
              <input type="date" {...register('expiredAt')} className="input-field mt-1" min={new Date().toISOString().split('T')[0]} />
            </div>
          </div>
          <Button type="submit" disabled={!isValid} className="w-full">{editingCoupon ? 'Cập nhật' : 'Lưu'}</Button>
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
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  <button onClick={() => handleEdit(c)} className="text-text-muted hover:text-white transition-colors"><Pencil size={16} /></button>
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
