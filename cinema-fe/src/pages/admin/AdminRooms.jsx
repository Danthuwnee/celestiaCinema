import { useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Home, Trash2, Pencil, Eye, MapPin, X } from 'lucide-react'
import adminApi from '../../api/adminApi'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Loading from '../../components/ui/Loading'

  function parseAisleColumns(str) {
  if (!str || !str.trim()) return []
  return str.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
}

function SeatMap({ rows, cols, aisleAfterColumns, seatTypes, rowSeatTypes, compact, exitMode = 'sides' }) {
  const aisleCols = parseAisleColumns(aisleAfterColumns)
  const cellSize = compact ? 18 : 22
  const gapSize = compact ? 2 : 3
  const hasLeftAisle = aisleCols.includes(0)
  const hasRightAisle = aisleCols.includes(cols)
  const innerAisleCols = aisleCols.filter(n => n > 0 && n < cols)

  const renderSeats = (rowLabel, st) => {
    const color = st?.colorHex || '#4CAF50'
    const isCouple = st?.typeName === 'Couple'
    const seats = []

    if (!isCouple && hasLeftAisle) {
      seats.push(
        <div key="aisle-left" className="shrink-0 flex items-center justify-center"
          style={{ width: compact ? 14 : 18, height: cellSize + 4 }}>
          {!compact && (
            <span className="text-[6px] text-text-muted leading-none -rotate-90 whitespace-nowrap">║</span>
          )}
        </div>
      )
    }

    for (let ci = 0; ci < cols; ci++) {
      const colNum = ci + 1

      if (!isCouple && innerAisleCols.includes(colNum)) {
        seats.push(
          <div key={`aisle-${colNum}`} className="shrink-0 flex items-center justify-center"
            style={{ width: compact ? 14 : 18, height: cellSize + 4 }}>
            {!compact && (
              <span className="text-[6px] text-text-muted leading-none -rotate-90 whitespace-nowrap">║</span>
            )}
          </div>
        )
      }

      if (!compact && isCouple && colNum < cols && colNum % 2 === 1) {
        const next = colNum + 1
        seats.push(
          <div key={`couple-${colNum}`}
            className="rounded-sm flex items-center justify-center text-[7px] font-medium shrink-0"
            style={{ backgroundColor: color, color: '#fff', width: cellSize * 2 + gapSize, height: cellSize }}
            title={`${rowLabel}${colNum}-${rowLabel}${next}`}
          >
            {colNum}-{next}
          </div>
        )
        continue
      }

      if (!isCouple) {
        seats.push(
          <div key={`seat-${colNum}`}
            className="rounded-sm flex items-center justify-center shrink-0"
            style={{
              backgroundColor: color,
              color: '#fff',
              width: cellSize,
              height: cellSize,
              fontSize: compact ? 6 : 8,
            }}
            title={`${rowLabel}${colNum}`}
          >
            {compact ? '' : colNum}
          </div>
        )
      }
    }

    if (!isCouple && hasRightAisle) {
      seats.push(
        <div key="aisle-right" className="shrink-0 flex items-center justify-center"
          style={{ width: compact ? 14 : 18, height: cellSize + 4 }}>
          {!compact && (
            <span className="text-[6px] text-text-muted leading-none -rotate-90 whitespace-nowrap">║</span>
          )}
        </div>
      )
    }

    return seats
  }

  const renderExitRow = () => {
    const items = []

    items.push(
      <span key="label" className="text-[10px] text-text-muted text-center shrink-0" style={{ width: compact ? 12 : 16 }} />
    )

    items.push(
      <div key="exit-left" className="shrink-0 flex items-center justify-center"
        style={{ width: compact ? 14 : 18, height: compact ? 24 : 36 }}>
        <span className="text-red-400 font-bold leading-none -rotate-90 whitespace-nowrap" style={{ fontSize: compact ? 5 : 7 }}>EXIT</span>
      </div>
    )

    for (let ci = 0; ci < cols; ci++) {
      const colNum = ci + 1
      const isInnerAisle = innerAisleCols.includes(colNum)

      if (isInnerAisle) {
        items.push(
          <div key={`exit-gap-${colNum}`} className="shrink-0"
            style={{ width: compact ? 14 : 18, height: compact ? 24 : 36 }} />
        )
        continue
      }

      if (!compact) {
        items.push(
          <div key={`space-${colNum}`} className="shrink-0" style={{ width: cellSize, height: compact ? 24 : 36 }} />
        )
      }
    }

    items.push(
      <div key="exit-right" className="shrink-0 flex items-center justify-center"
        style={{ width: compact ? 14 : 18, height: compact ? 24 : 36 }}>
        <span className="text-red-400 font-bold leading-none -rotate-90 whitespace-nowrap" style={{ fontSize: compact ? 5 : 7 }}>EXIT</span>
      </div>
    )

    return items
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="h-1.5 rounded-full bg-gradient-to-r from-galaxy-purple to-galaxy-cyan w-3/4 mb-1" />
      <p className={compact ? 'text-[8px] text-text-muted tracking-widest mb-2' : 'text-[10px] text-text-muted tracking-widest mb-3'}>
        MÀN HÌNH CHIẾU
      </p>

      {!compact && (
        <div className="flex items-center mb-1" style={{ gap: gapSize }}>
          {renderExitRow()}
        </div>
      )}

      <div className="overflow-x-auto w-full flex justify-center">
        <div className="inline-flex flex-col" style={{ gap: compact ? 1 : 3 }}>
          {Array.from({ length: rows }, (_, ri) => {
            const rowLabel = String.fromCharCode(65 + ri)
            const typeId = rowSeatTypes?.[rowLabel]
            const st = seatTypes?.find(t => t.seatTypeId === typeId)
            return (
              <div key={rowLabel} className="flex items-center" style={{ gap: gapSize }}>
                <span className="text-[10px] text-text-muted text-center shrink-0" style={{ width: compact ? 12 : 16 }}>
                  {compact ? '' : rowLabel}
                </span>
                {renderSeats(rowLabel, st)}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function AdminRooms() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ roomName: '', totalRows: 5, totalColumns: 10, aisleAfterColumns: '4' })
  const [rowSeatTypes, setRowSeatTypes] = useState({})
  const [editModal, setEditModal] = useState(false)
  const [editRoom, setEditRoom] = useState(null)
  const [editForm, setEditForm] = useState({ roomName: '', totalRows: 5, totalColumns: 10, aisleAfterColumns: '4' })
  const [editRowSeatTypes, setEditRowSeatTypes] = useState({})
  const [viewRoom, setViewRoom] = useState(null)
  const [roomSeatTypesMap, setRoomSeatTypesMap] = useState({})

  const { data: rooms, isLoading } = useQuery({
    queryKey: ['admin', 'rooms'],
    queryFn: () => adminApi.getRooms().then(r => r.data),
  })

  const { data: seatTypes } = useQuery({
    queryKey: ['admin', 'seatTypes'],
    queryFn: () => adminApi.getSeatTypes().then(r => r.data),
  })

  useEffect(() => {
    if (!seatTypes?.length) return
    const defaultId = seatTypes[0].seatTypeId
    setRowSeatTypes(prev => {
      const next = { ...prev }
      for (let i = 0; i < form.totalRows; i++) {
        const label = String.fromCharCode(65 + i)
        if (!next[label]) next[label] = defaultId
      }
      Object.keys(next).forEach(k => {
        if (k.charCodeAt(0) - 65 >= form.totalRows) delete next[k]
      })
      return next
    })
  }, [form.totalRows, seatTypes])

  useEffect(() => {
    if (!seatTypes?.length || !editModal) return
    const defaultId = seatTypes[0].seatTypeId
    setEditRowSeatTypes(prev => {
      const next = { ...prev }
      for (let i = 0; i < editForm.totalRows; i++) {
        const label = String.fromCharCode(65 + i)
        if (!next[label]) next[label] = defaultId
      }
      Object.keys(next).forEach(k => {
        if (k.charCodeAt(0) - 65 >= editForm.totalRows) delete next[k]
      })
      return next
    })
  }, [editForm.totalRows, seatTypes, editModal])

  useEffect(() => {
    if (!rooms?.length) return
    const fetchAll = rooms.map(r =>
      adminApi.getRoomSeats(r.roomId || r.id)
        .then(res => ({ id: r.roomId || r.id, types: res.data }))
        .catch(() => ({ id: r.roomId || r.id, types: {} }))
    )
    Promise.all(fetchAll).then(results => {
      const map = {}
      results.forEach(r => { map[r.id] = r.types })
      setRoomSeatTypesMap(map)
    })
  }, [rooms])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.roomName.trim()) {
      alert('Vui lòng nhập tên phòng')
      return
    }
    await adminApi.createRoom({
      roomName: form.roomName,
      totalRows: form.totalRows,
      totalColumns: form.totalColumns,
      aisleAfterColumns: form.aisleAfterColumns,
      rowSeatTypes,
    })
    queryClient.invalidateQueries({ queryKey: ['admin', 'rooms'] })
    setShowForm(false)
  }

  const handleDeactivate = async (id) => {
    if (!window.confirm('Vô hiệu hóa phòng này?')) return
    try {
      await adminApi.updateRoom(id, { status: 'INACTIVE' })
      queryClient.invalidateQueries({ queryKey: ['admin', 'rooms'] })
    } catch (err) {
      alert(err.response?.data?.error || 'Vô hiệu hóa thất bại')
    }
  }

  const handlePermanentDelete = async (id) => {
    if (!window.confirm('Xóa vĩnh viễn phòng này? Hành động này không thể hoàn tác!')) return
    try {
      await adminApi.deleteRoom(id)
      queryClient.invalidateQueries({ queryKey: ['admin', 'rooms'] })
    } catch (err) {
      alert(err.response?.data?.error || 'Xóa phòng thất bại')
    }
  }

  const handleEdit = async (room) => {
    setEditRoom(room)
    setEditForm({
      roomName: room.roomName,
      totalRows: room.totalRows,
      totalColumns: room.totalColumns,
      aisleAfterColumns: room.aisleAfterColumns || '4',
    })
    try {
      const res = await adminApi.getRoomSeats(room.roomId || room.id)
      setEditRowSeatTypes(res.data)
    } catch {
      if (seatTypes?.length) {
        const defaultId = seatTypes[0].seatTypeId
        const types = {}
        for (let i = 0; i < room.totalRows; i++) {
          types[String.fromCharCode(65 + i)] = defaultId
        }
        setEditRowSeatTypes(types)
      }
    }
    setEditModal(true)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editForm.roomName.trim()) {
      alert('Vui lòng nhập tên phòng')
      return
    }
    try {
      await adminApi.updateRoom(editRoom.roomId || editRoom.id, {
        roomName: editForm.roomName,
        totalRows: editForm.totalRows,
        totalColumns: editForm.totalColumns,
        aisleAfterColumns: editForm.aisleAfterColumns,
        rowSeatTypes: editRowSeatTypes,
      })
      queryClient.invalidateQueries({ queryKey: ['admin', 'rooms'] })
      setEditModal(false)
      setEditRoom(null)
    } catch (err) {
      alert(err.response?.data?.error || 'Cập nhật phòng thất bại')
    }
  }

  if (isLoading) return <Loading />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Home size={24} className="text-galaxy-cyan" /> Quản lý Phòng chiếu</h1>
        <Button onClick={() => { setShowForm(!showForm); setRowSeatTypes({}); setForm({ roomName: '', totalRows: 5, totalColumns: 10, aisleAfterColumns: '4' }) }} className="flex items-center gap-2"><Plus size={16} /> Thêm phòng</Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-6 mb-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Thêm phòng</h2>
              <button onClick={() => setShowForm(false)} className="text-text-muted hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-text-secondary">Tên phòng</label>
                    <input type="text" value={form.roomName} onChange={(e) => setForm(p => ({ ...p, roomName: e.target.value }))} className="input-field mt-1" required />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-sm text-text-secondary">Số hàng</label>
                      <input type="number" value={form.totalRows} onChange={(e) => setForm(p => ({ ...p, totalRows: +e.target.value }))} className="input-field mt-1" min={1} />
                    </div>
                    <div>
                      <label className="text-sm text-text-secondary">Số cột</label>
                      <input type="number" value={form.totalColumns} onChange={(e) => setForm(p => ({ ...p, totalColumns: +e.target.value }))} className="input-field mt-1" min={1} />
                    </div>
                    <div>
                      <label className="text-sm text-text-secondary">Lối đi sau cột</label>
                      <input type="text" value={form.aisleAfterColumns} onChange={(e) => setForm(p => ({ ...p, aisleAfterColumns: e.target.value }))} className="input-field mt-1" placeholder="VD: 4,8" />
                    </div>
                  </div>

                  {seatTypes ? (
                    <div>
                      <label className="text-sm text-text-secondary mb-1 block">Loại ghế theo hàng</label>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {Array.from({ length: form.totalRows }, (_, i) => {
                          const rowLabel = String.fromCharCode(65 + i)
                          const currentTypeId = rowSeatTypes[rowLabel] || seatTypes[0]?.seatTypeId
                          const st = seatTypes.find(t => t.seatTypeId === currentTypeId)
                          return (
                            <div key={rowLabel} className="flex items-center gap-2">
                              <span className="text-xs text-text-muted w-12 shrink-0">Hàng {rowLabel}</span>
                              <select
                                value={currentTypeId}
                                onChange={(e) => setRowSeatTypes(p => ({ ...p, [rowLabel]: e.target.value }))}
                                className="input-field bg-space-dark flex-1 text-xs"
                                style={{ colorScheme: 'dark' }}
                              >
                                {seatTypes.map(t => (
                                  <option key={t.seatTypeId} value={t.seatTypeId} className="bg-space-dark text-white">{t.typeName}</option>
                                ))}
                              </select>
                              <span className="w-3 h-3 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: st?.colorHex || '#fff' }} />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-text-muted">Đang tải cấu hình ghế...</p>
                  )}

                  <Button type="submit" className="w-full">Tạo phòng</Button>
                </div>

                <div className="glass-card p-3 flex flex-col items-center justify-center">
                  <SeatMap
                    rows={form.totalRows}
                    cols={form.totalColumns}
                    aisleAfterColumns={form.aisleAfterColumns}
                    seatTypes={seatTypes}
                    rowSeatTypes={rowSeatTypes}
                    compact={false}
                  />
                  <div className="flex items-center gap-3 mt-3">
                    {seatTypes?.map(t => (
                      <div key={t.seatTypeId} className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.colorHex }} />
                        <span className="text-[10px] text-text-muted">{t.typeName}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-text-muted mt-2">
                    {form.totalRows} hàng x {form.totalColumns} cột = {form.totalRows * form.totalColumns} ghế
                    {parseAisleColumns(form.aisleAfterColumns).length > 0 && ` | ${parseAisleColumns(form.aisleAfterColumns).length} lối đi`}
                  </p>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal isOpen={editModal} onClose={() => { setEditModal(false); setEditRoom(null) }} title="Sửa phòng" className="max-w-5xl">
        <form onSubmit={handleSaveEdit} noValidate>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm text-text-secondary">Tên phòng</label>
                <input type="text" value={editForm.roomName} onChange={(e) => setEditForm(p => ({ ...p, roomName: e.target.value }))} className="input-field mt-1" required />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-sm text-text-secondary">Số hàng</label>
                  <input type="number" value={editForm.totalRows} onChange={(e) => setEditForm(p => ({ ...p, totalRows: +e.target.value }))} className="input-field mt-1" min={1} />
                </div>
                <div>
                  <label className="text-sm text-text-secondary">Số cột</label>
                  <input type="number" value={editForm.totalColumns} onChange={(e) => setEditForm(p => ({ ...p, totalColumns: +e.target.value }))} className="input-field mt-1" min={1} />
                </div>
                <div>
                  <label className="text-sm text-text-secondary">Lối đi sau cột</label>
                  <input type="text" value={editForm.aisleAfterColumns} onChange={(e) => setEditForm(p => ({ ...p, aisleAfterColumns: e.target.value }))} className="input-field mt-1" placeholder="VD: 4,8" />
                </div>
              </div>

              {seatTypes ? (
                <div>
                  <label className="text-sm text-text-secondary mb-1 block">Loại ghế theo hàng</label>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {Array.from({ length: editForm.totalRows }, (_, i) => {
                      const rowLabel = String.fromCharCode(65 + i)
                      const currentTypeId = editRowSeatTypes[rowLabel] || seatTypes[0]?.seatTypeId
                      const st = seatTypes.find(t => t.seatTypeId === currentTypeId)
                      return (
                        <div key={rowLabel} className="flex items-center gap-2">
                          <span className="text-xs text-text-muted w-12 shrink-0">Hàng {rowLabel}</span>
                          <select
                            value={currentTypeId}
                            onChange={(e) => setEditRowSeatTypes(p => ({ ...p, [rowLabel]: e.target.value }))}
                            className="input-field bg-space-dark flex-1 text-xs"
                            style={{ colorScheme: 'dark' }}
                          >
                            {seatTypes.map(t => (
                              <option key={t.seatTypeId} value={t.seatTypeId} className="bg-space-dark text-white">{t.typeName}</option>
                            ))}
                          </select>
                          <span className="w-3 h-3 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: st?.colorHex || '#fff' }} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-text-muted">Đang tải cấu hình ghế...</p>
              )}

              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => { setEditModal(false); setEditRoom(null) }}>Hủy</Button>
                <Button type="submit">Lưu thay đổi</Button>
              </div>
            </div>

            <div className="glass-card p-3 flex flex-col items-center justify-center">
              <SeatMap
                rows={editForm.totalRows}
                cols={editForm.totalColumns}
                aisleAfterColumns={editForm.aisleAfterColumns}
                seatTypes={seatTypes}
                rowSeatTypes={editRowSeatTypes}
                compact={false}
              />
              <div className="flex items-center gap-3 mt-3">
                {seatTypes?.map(t => (
                  <div key={t.seatTypeId} className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.colorHex }} />
                    <span className="text-[10px] text-text-muted">{t.typeName}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-text-muted mt-2">
                {editForm.totalRows} hàng x {editForm.totalColumns} cột = {editForm.totalRows * editForm.totalColumns} ghế
                {parseAisleColumns(editForm.aisleAfterColumns).length > 0 && ` | ${parseAisleColumns(editForm.aisleAfterColumns).length} lối đi`}
              </p>
            </div>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!viewRoom} onClose={() => setViewRoom(null)} title={`Sơ đồ - ${viewRoom?.roomName || ''}`} className="max-w-3xl">
        {viewRoom && (
          <div className="flex flex-col items-center py-4">
            <SeatMap
              rows={viewRoom.totalRows}
              cols={viewRoom.totalColumns}
              aisleAfterColumns={viewRoom.aisleAfterColumns || ''}
              seatTypes={seatTypes}
              rowSeatTypes={roomSeatTypesMap[viewRoom.roomId || viewRoom.id] || {}}
              compact={false}
            />
            <div className="flex items-center gap-3 mt-4">
              {seatTypes?.map(t => (
                <div key={t.seatTypeId} className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.colorHex }} />
                  <span className="text-[10px] text-text-muted">{t.typeName}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-3">
              {viewRoom.totalRows} hàng x {viewRoom.totalColumns} cột = {viewRoom.totalRows * viewRoom.totalColumns} ghế
            </p>
          </div>
        )}
      </Modal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(rooms || []).map((room, i) => (
          <motion.div key={room.roomId || room.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="font-semibold truncate">{room.roomName}</h3>
                {room.status === 'ACTIVE' && (
                  <button onClick={() => handleEdit(room)} className="text-text-muted hover:text-white transition-colors shrink-0">
                    <Pencil size={14} />
                  </button>
                )}
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs shrink-0 ${room.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{room.status}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-text-muted">
              <MapPin size={12} />
              <span>{room.totalRows}h x {room.totalColumns}c</span>
              <span className="text-white/20">|</span>
              <span>{room.totalRows * room.totalColumns} ghế</span>
              {room.aisleAfterColumns && (
                <>
                  <span className="text-white/20">|</span>
                  <span className="text-galaxy-cyan">{parseAisleColumns(room.aisleAfterColumns).length} lối đi</span>
                </>
              )}
            </div>

            <div className="mt-2 mb-2">
              <SeatMap
                rows={room.totalRows}
                cols={room.totalColumns}
                aisleAfterColumns={room.aisleAfterColumns || ''}
                seatTypes={seatTypes}
                rowSeatTypes={roomSeatTypesMap[room.roomId || room.id] || {}}
                compact={true}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewRoom(room)}
                className="text-galaxy-cyan hover:text-galaxy-cyan/80 text-xs flex items-center gap-1 transition-colors"
              >
                <Eye size={12} /> Xem sơ đồ
              </button>
              <div>
                {room.status === 'ACTIVE' ? (
                  <button onClick={() => handleDeactivate(room.roomId || room.id)} className="text-orange-400 hover:text-orange-300 text-xs flex items-center gap-1 transition-colors"><Trash2 size={12} /> Vô hiệu hóa</button>
                ) : (
                  <button onClick={() => handlePermanentDelete(room.roomId || room.id)} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors"><Trash2 size={12} /> Xóa</button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
