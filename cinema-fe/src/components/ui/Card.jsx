import { motion } from 'framer-motion'

export default function Card({ children, className = '', hover = false, onClick, ...props }) {
  const Comp = onClick ? motion.button : motion.div
  return (
    <Comp
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={`glass-card-hover p-6 ${onClick ? 'cursor-pointer text-left w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </Comp>
  )
}
