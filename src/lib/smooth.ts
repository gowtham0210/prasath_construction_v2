import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { navigate, PAGE_PATHS } from './router'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

/**
 * One Lenis instance driven by the GSAP ticker, with ScrollTrigger updated from Lenis' scroll events.
 * This keeps smooth scrolling and every ScrollTrigger animation on the same clock.
 * With reduced motion, native scrolling is used and nothing is created.
 */
export function initSmoothScroll(reduced: boolean): () => void {
  if (reduced) return () => {}
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.3, anchors: false })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time: number) => lenis?.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

export const getLenis = () => lenis

const PAGES: Record<string, string> = PAGE_PATHS

export function scrollToId(id: string, offset = 0) {
  // About, Services, Projects, Gallery, Packages and Contact are pages of their own: their ids open the page
  if (id in PAGES) {
    if (location.pathname.replace(/\/+$/, '') === PAGES[id]) {
      if (lenis) lenis.scrollTo(0, { duration: 1.2 })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    } else navigate(PAGES[id])
    return
  }
  const here = document.getElementById(id)
  // any other target lives on the page you are on, or else on the home page
  if (!here && location.pathname !== '/') {
    navigate('/')
    setTimeout(() => {
      lenis?.resize()
      ScrollTrigger.refresh()
      scrollToId(id, offset)
    }, 800)
    return
  }
  const el = here
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.7, easing: (t: number) => 1 - Math.pow(1 - t, 4) })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export const stopScroll = () => lenis?.stop()
export const startScroll = () => lenis?.start()

export { gsap, ScrollTrigger }
