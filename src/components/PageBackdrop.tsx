import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from '../hooks/useEnv'

const clips = ['/media/exterior.mp4', '/media/twostorey.mp4', '/media/walkthrough.mp4']

/** which clip sits behind which section */
const byId: Record<string, number> = {
  about: 1, services: 0, projects: 2, testimonials: 1, contact: 0, stats: 0, packages: 2, stories: 1, 'home-gallery': 0, 'home-why': 2, 'consult-cta': 1,
  'projects-grid': 2, 'projects-stats': 0, 'projects-process': 1, 'packages-list': 0, 'packages-process': 2, 'gallery-grid': 1, 'about-mvv': 1, 'about-journey': 0, 'about-trust': 2, 'about-visit': 0,
  'about-story': 1, 'about-why': 0, 'about-gallery': 2, 'about-cta': 1,
  'svc-hero': 1, 'svc-list': 0, 'svc-included': 2, 'svc-cta': 1,
}

/**
 * The film behind the whole page: three looping clips stacked in a fixed layer that cross-fade as you move between sections.
 * A pale veil keeps every card and headline readable. Only the visible clip plays, and a clip downloads only when it is first needed.
 */
export default function PageBackdrop({ page = 'home' }: { page?: string }) {
  const reduced = usePrefersReducedMotion()
  const [active, setActive] = useState(0)
  const [wanted, setWanted] = useState<number[]>([0])
  const refs = useRef<(HTMLVideoElement | null)[]>([])

  useEffect(() => {
    if (reduced) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.id in byId) {
            const i = byId[e.target.id]
            setActive(i)
            setWanted((w) => (w.includes(i) ? w : [...w, i]))
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    document.querySelectorAll('main section').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [reduced, page])

  // play only the clip that is showing
  useEffect(() => {
    refs.current.forEach((v, i) => {
      if (!v) return
      if (i === active) v.play().catch(() => {})
      else v.pause()
    })
  }, [active, wanted])

  if (reduced) return null
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#dbe7f7]" aria-hidden="true">
      {clips.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            refs.current[i] = el
          }}
          src={wanted.includes(i) ? src : undefined}
          muted
          loop
          playsInline
          preload="none"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ${i === active ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,247,251,0.8),rgba(219,231,247,0.72)_50%,rgba(247,232,218,0.76))] backdrop-blur-[3px]" />
    </div>
  )
}
