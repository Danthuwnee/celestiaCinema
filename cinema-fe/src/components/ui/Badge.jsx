const colorMap = {
  P: 'bg-green-500/20 text-green-400 border-green-500/30',
  T13: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  T16: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  T18: 'bg-red-500/20 text-red-400 border-red-500/30',
  ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
  COMING_SOON: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PAID: 'bg-green-500/20 text-green-400 border-green-500/30',
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
  ADMIN: 'bg-galaxy-purple/20 text-galaxy-purple border-galaxy-purple/30',
  CUSTOMER: 'bg-cosmic-cyan/20 text-cosmic-cyan border-cosmic-cyan/30',
}

export default function Badge({ children, variant = 'ACTIVE', className = '', size = 'sm' }) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
  return (
    <span className={`inline-block rounded-full border font-medium ${sizeClass} ${colorMap[variant] || 'bg-white/10 text-text-secondary border-white/20'} ${className}`}>
      {children}
    </span>
  )
}
