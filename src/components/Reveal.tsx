import { useLayoutEffect, useRef, type ElementType, type ReactNode } from 'react'
import { gsap } from '../lib/smooth'
import { usePrefersReducedMotion } from '../hooks/useEnv'

interface WordsProps {
  /** each entry is one line of the headline */
  lines: string[]
  as?: ElementType
  className?: string
  /** start when scrolled into view (default) or immediately when `play` becomes true */
  play?: boolean
  delay?: number
  /** words that should be set in italic bronze */
  italic?: string[]
  stagger?: number
}

/** Word-by-word headline reveal: each word rises out of its own mask. */
export function RevealWords({ lines, as: Tag = 'h2', className = '', play, delay = 0, italic = [], stagger = 0.07 }: WordsProps) {
  const ref = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const controlled = play !== undefined

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const words = el.querySelectorAll<HTMLElement>('[data-w]')
    if (reduced) {
      gsap.set(words, { yPercent: 0, rotateX: 0, opacity: 1, filter: 'none' })
      return
    }
    gsap.set(words, { yPercent: 118, rotateX: -65, opacity: 0, filter: 'blur(6px)', transformOrigin: '0% 100%' })
    if (controlled) {
      if (!play) return
      const t = gsap.to(words, { yPercent: 0, rotateX: 0, opacity: 1, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out', stagger, delay })
      return () => {
        t.kill()
      }
    }
    const t = gsap.to(words, {
      yPercent: 0,
      rotateX: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.4,
      ease: 'expo.out',
      stagger,
      delay,
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
    })
    return () => {
      t.scrollTrigger?.kill()
      t.kill()
    }
  }, [play, controlled, reduced, delay, stagger])

  return (
    <Tag ref={ref} className={className} aria-label={lines.join(' ')}>
      {lines.map((line, i) => (
        <span key={i} className="mask-line" aria-hidden="true">
          {line.split(' ').map((w, j, arr) => (
            <span key={j} className="inline-block overflow-hidden align-bottom">
              <span data-w className={`inline-block ${italic.map((x) => x.replace(/[.,]/g, '')).includes(w.replace(/[.,]/g, '')) ? 'accent-word' : ''}`}>
                {w}
                {j < arr.length - 1 ? ' ' : ''}
              </span>
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: ElementType
}

/** Fades and lifts a block into place when it enters the viewport. */
export function Reveal({ children, className = '', delay = 0, y = 36, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    gsap.set(el, { y, opacity: 0 })
    const t = gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 1.1,
      ease: 'expo.out',
      delay,
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
    })
    return () => {
      t.scrollTrigger?.kill()
      t.kill()
    }
  }, [reduced, delay, y])
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}

interface MaskProps {
  children: ReactNode
  className?: string
  /** direction the image is uncovered from */
  from?: 'bottom' | 'left' | 'right' | 'top'
  delay?: number
}

/** Image mask entrance: the frame is uncovered with a clip-path while the picture settles from a slight zoom. */
export function MaskReveal({ children, className = '', from = 'bottom', delay = 0 }: MaskProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const inset = { bottom: 'inset(100% 0% 0% 0%)', top: 'inset(0% 0% 100% 0%)', left: 'inset(0% 100% 0% 0%)', right: 'inset(0% 0% 0% 100%)' }[from]
    const inner = el.firstElementChild as HTMLElement | null
    gsap.set(el, { clipPath: inset })
    if (inner) gsap.set(inner, { scale: 1.18 })
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' }, delay })
    tl.to(el, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' })
    if (inner) tl.to(inner, { scale: 1, duration: 1.8, ease: 'expo.out' }, 0)
    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [reduced, from, delay])
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

interface StaggerProps {
  children: ReactNode
  className?: string
  as?: ElementType
  /** seconds between each child */
  gap?: number
}

/** Direct children rise in one after another (with a soft scale) when the group scrolls into view. */
export function Stagger({ children, className = '', as: Tag = 'div', gap = 0.11 }: StaggerProps) {
  const ref = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const kids = Array.from(el.children) as HTMLElement[]
    gsap.set(kids, { y: 70, opacity: 0, scale: 0.95 })
    const t = gsap.to(kids, {
      y: 0, opacity: 1, scale: 1, duration: 1.3, ease: 'expo.out', stagger: gap,
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
    })
    return () => {
      t.scrollTrigger?.kill()
      t.kill()
      gsap.set(kids, { clearProps: 'all' })
    }
  }, [reduced, gap])
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
