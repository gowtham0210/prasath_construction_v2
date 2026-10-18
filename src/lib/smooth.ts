import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

const PAGES: Record<string, string> = { about: '/about', services: '/services', projects: '/projects', gallery: '/gallery', packages: '/packages', contact: '/contact' }

export function scrollToId(id: string, offset = 0) {
  const here = Object.values(PAGES).find((p) => location.hash.startsWith('#' + p))
  // About and Services are pages of their own: their ids open the page, and any other target first returns home
  if (id in PAGES) {
    if (location.hash.startsWith('#' + PAGES[id])) {
      if (lenis) lenis.scrollTo(0, { duration: 1.2 })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    } else location.hash = PAGES[id]
    return
  }
  if (here) {
    history.pushState(null, '', location.pathname + location.search)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    setTimeout(() => {
      lenis?.resize()
      ScrollTrigger.refresh()
      scrollToId(id, offset)
    }, 800)
    return
  }
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.7, easing: (t: number) => 1 - Math.pow(1 - t, 4) })
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export const stopScroll = () => lenis?.stop()
export const startScroll = () => lenis?.start()

export { gsap, ScrollTrigger }
