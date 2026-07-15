import { Star, Film, Ticket, Popcorn } from 'lucide-react'

export default function BrandSide() {
  return (
    <div className="hidden lg:flex w-3/5 relative items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center px-12 max-w-lg">
        <div className="w-16 h-16 mx-auto rounded-full bg-button-glow flex items-center justify-center">
          <Star size={28} className="text-galaxy-cyan" fill="#00D4FF" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold galaxy-text-gradient mt-6 leading-tight">
          CELESTIA<br />CINEMA
        </h1>
        <p className="text-lg text-text-secondary mt-4 leading-relaxed">
          Your Gateway to Cinematic Experiences
        </p>
        <div className="mt-10 flex justify-center gap-6 text-text-muted">
          <div className="flex flex-col items-center gap-2">
            <Film size={22} className="text-galaxy-cyan" />
            <span className="text-sm">Phim HD</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Ticket size={22} className="text-galaxy-purple" />
            <span className="text-sm">Đặt vé nhanh</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Popcorn size={22} className="text-galaxy-pink" />
            <span className="text-sm">Combo ngon</span>
          </div>
        </div>
      </div>
    </div>
  )
}
