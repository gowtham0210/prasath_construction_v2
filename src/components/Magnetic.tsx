import { useEffect, useRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from 'react'
import gsap from 'gsap'
import { useFinePointer, usePrefersReducedMotion } from '../hooks/useEnv'

type Props<T extends ElementType> = {
  as?: T
  strength?: number
  children: ReactNode
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children'>

/** Wraps a control so it leans gently toward the pointer. Disabled on touch devices and with reduced motion. */
export default function Magnetic<T extends ElementType = 'button'>({ as, strength = 0.28, children, ...rest }: Props<T>) {
  const Tag = (as ?? 'button') as ElementType
  const ref = useRef<HTMLElement | null>(null)
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !fine || reduced) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      xTo(0)
      yTo(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [fine, reduced, strength])

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  )
}
