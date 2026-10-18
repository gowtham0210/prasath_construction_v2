import { useEffect, useRef, useState } from 'react'
import type { StillId } from '../data/media'
import { stillSrc } from './Still'
import { usePrefersReducedMotion } from '../hooks/useEnv'

interface Props {
  src: string
  poster: StillId
  className?: string
  /** CSS object-position */
  focus?: string
  /** 1 = normal speed, below 1 = slow motion */
  speed?: number
}

/** A silent looping clip that downloads only when it nears the screen and plays only while visible. The photograph shows first. */
export default function LoopVideo({ src, poster, className = '', focus = '50% 50%', speed = 1 }: Props) {
  const ref = useRef<HTMLVideoElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const [load, setLoad] = useState(false)
  const [playing, setPlaying] = useState(false)
  const visibleRef = useRef(false)

  useEffect(() => {
    const v = ref.current
    if (!v || reduced) return
    const near = new IntersectionObserver(([e]) => e.isIntersecting && setLoad(true), { rootMargin: '600px' })
    const visible = new IntersectionObserver(([e]) => {
      visibleRef.current = e.isIntersecting
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.25 })
    near.observe(v)
    visible.observe(v)
    return () => {
      near.disconnect()
      visible.disconnect()
    }
  }, [reduced])

  // the clip may become visible before its file has been attached: start it as soon as it is
  useEffect(() => {
    const v = ref.current
    if (load && v && visibleRef.current) v.play().catch(() => {})
  }, [load])

  return (
    <div className={`relative overflow-hidden bg-[#dfe6f2] ${className}`}>
      <img src={stillSrc(poster)} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ objectPosition: focus }} loading="lazy" decoding="async" />
      {!reduced && (
        <video
          ref={ref}
          src={load ? src : undefined}
          muted
          loop
          playsInline
          preload={load ? 'auto' : 'none'}
          onLoadedData={(e) => (e.currentTarget.playbackRate = speed)}
          onPlaying={(e) => {
            e.currentTarget.playbackRate = speed
            setPlaying(true)
          }}
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${playing ? 'opacity-100' : 'opacity-0'}`}
          style={{ objectPosition: focus }}
        />
      )}
    </div>
  )
}
