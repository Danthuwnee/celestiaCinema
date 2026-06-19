export default function Loading({ text = 'Đang tải...' }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-galaxy-purple/30" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-galaxy-pink animate-spin" />
        <div className="absolute inset-2 rounded-full bg-galaxy-gradient animate-pulse" />
      </div>
      <p className="text-text-muted text-sm animate-pulse">{text}</p>
    </div>
  )
}
