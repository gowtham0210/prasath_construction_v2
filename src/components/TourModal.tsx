import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { startScroll, stopScroll } from '../lib/smooth'

/** Lightbox for the short home-tour film. The 12 MB video is only requested when the visitor opens it. */
export default function TourModal({ onClose }: { onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    stopScroll()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    closeBtn.current?.focus()
    return () => {
      document.documentElement.style.overflow = ''
      startScroll()
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[90] grid place-items-center bg-graphite/80 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Home tour film"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-5xl overflow-hidden rounded-[28px] bg-black shadow-2xl"
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <video className="aspect-video w-full" src="/media/tour.mp4" poster="/images/tour-balcony.jpg" controls autoPlay playsInline preload="metadata" />
        <button ref={closeBtn} onClick={onClose} aria-label="Close home tour" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-graphite shadow">
          <X size={18} strokeWidth={1.6} />
        </button>
      </motion.div>
    </motion.div>
  )
}
