import { useEffect, useRef } from 'react'

export default function StarsBackground() {
  const ref = useRef(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return
    const frag = document.createDocumentFragment()
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div')
      star.className = 'star'
      star.style.left = Math.random() * 100 + '%'
      star.style.top = Math.random() * 100 + '%'
      star.style.width = star.style.height = Math.random() * 3 + 1 + 'px'
      star.style.animationDelay = Math.random() * 5 + 's'
      star.style.animationDuration = Math.random() * 3 + 2 + 's'
      frag.appendChild(star)
    }
    container.appendChild(frag)
  }, [])

  return <div ref={ref} className="stars" />
}
