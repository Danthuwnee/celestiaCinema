import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Calendar, Edit2, Save, X, ChevronRight } from 'lucide-react'
import authApi from '../api/authApi'
import { useAuth } from '../contexts/AuthContext'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Loading from '../components/ui/Loading'

export default function Profile() {
  const { user, updateUser, loading: authLoading } = useAuth()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ fullName: '', phone: '', gender: '', dateOfBirth: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const startEditing = () => {
    setForm({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      gender: user?.gender || '',
      dateOfBirth: user?.dateOfBirth || '',
    })
    setEditing(true)
    setError('')
    setSuccess(false)
  }

  const handleSave = async () => {
    setError('')
    setSaving(true)
    try {
      const res = await authApi.updateProfile(form)
      updateUser(res.data)
      setSuccess(true)
      setEditing(false)
    } catch (err) {
      setError(err.response?.data?.error || 'Cập nhật thất bại')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) return <Loading />

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button onClick={() => window.history.back()} className="text-text-muted hover:text-white transition-colors mb-6 flex items-center gap-1">
        <ChevronRight size={16} className="rotate-180" /> Quay lại
      </button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="glass-card p-8 space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-button-glow flex items-center justify-center mx-auto text-2xl font-bold mb-3">
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {!editing && (
              <h1 className="text-xl font-bold">{user?.fullName}</h1>
            )}
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm text-center">{error}</div>}
          {success && <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl text-sm text-center">Cập nhật thành công!</div>}

          {!editing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 py-3 border-b border-white/5">
                <Mail size={16} className="text-text-muted" />
                <div><p className="text-xs text-text-muted">Email</p><p className="text-sm">{user?.email}</p></div>
              </div>
              <div className="flex items-center gap-3 py-3 border-b border-white/5">
                <Phone size={16} className="text-text-muted" />
                <div><p className="text-xs text-text-muted">Số điện thoại</p><p className="text-sm">{user?.phone || '-'}</p></div>
              </div>
              <div className="flex items-center gap-3 py-3 border-b border-white/5">
                <User size={16} className="text-text-muted" />
                <div><p className="text-xs text-text-muted">Giới tính</p><p className="text-sm">{user?.gender || '-'}</p></div>
              </div>
              <div className="flex items-center gap-3 py-3">
                <Calendar size={16} className="text-text-muted" />
                <div><p className="text-xs text-text-muted">Ngày sinh</p><p className="text-sm">{user?.dateOfBirth || '-'}</p></div>
              </div>
              <Button onClick={startEditing} className="w-full flex items-center justify-center gap-2 mt-4">
                <Edit2 size={16} /> Chỉnh sửa
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input label="Họ tên" value={form.fullName} onChange={(e) => setForm(prev => ({ ...prev, fullName: e.target.value }))} />
              <div><label className="text-sm text-text-secondary">Email</label><p className="text-text-muted text-sm mt-1">{user?.email}</p></div>
              <Input label="Số điện thoại" type="tel" value={form.phone} onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))} />
              <div className="space-y-1.5">
                <label className="text-sm text-text-secondary">Giới tính</label>
                <select value={form.gender} onChange={(e) => setForm(prev => ({ ...prev, gender: e.target.value }))} className="input-field">
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <Input label="Ngày sinh" type="date" value={form.dateOfBirth} onChange={(e) => setForm(prev => ({ ...prev, dateOfBirth: e.target.value }))} />
              <div className="flex gap-3 mt-4">
                <Button onClick={handleSave} disabled={saving} className="flex-1 flex items-center justify-center gap-2">
                  <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu'}
                </Button>
                <Button variant="secondary" onClick={() => setEditing(false)} className="flex items-center justify-center gap-2">
                  <X size={16} /> Hủy
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
