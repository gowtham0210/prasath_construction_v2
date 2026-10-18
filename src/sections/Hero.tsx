import { useLayoutEffect, useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { RevealWords } from '../components/Reveal'
import Magnetic from '../components/Magnetic'
import LoopVideo from '../components/LoopVideo'
import { services } from '../data/services'
import { hero, heroStats } from '../data/prasath'
import { gsap, scrollToId } from '../lib/smooth'
import { useFinePointer, usePrefersReducedMotion } from '../hooks/useEnv'

interface Props {
  play: boolean
}

const tagPos = ['right-[22%] top-[26%]', 'right-[9%] top-[40%]', 'right-[24%] top-[54%]']
const tagDelay = ['0s', '-1.6s', '-3s']

/** Hero: the finished home in motion across the whole frame, a pale sky melting in from the top, a large white headline, project counts and a rotating seal. */
export default function Hero({ play }: Props) {
  const root = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced) return
      gsap.set('[data-in="film"]', { scale: 1.18, opacity: 0 })
      gsap.set('[data-c]', { y: 34, opacity: 0 })
      gsap.set('[data-in="tag"]', { y: 30, scale: 0.6, opacity: 0 })
      gsap.set('[data-in="seal"]', { scale: 0, rotate: -90, opacity: 0 })
      gsap.set('[data-in="bar"]', { y: 70, opacity: 0 })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  useLayoutEffect(() => {
    if (!play || reduced) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.to('[data-in="film"]', { scale: 1, opacity: 1, duration: 2.6, ease: 'power3.out' }, 0)
        .to('[data-c]', { y: 0, opacity: 1, duration: 1.2, stagger: 0.13 }, 0.8)
        .to('[data-in="bar"]', { y: 0, opacity: 1, duration: 1.3 }, 1.2)
        .to('[data-in="tag"]', { y: 0, scale: 1, opacity: 1, duration: 1, stagger: 0.18, ease: 'back.out(1.8)' }, 1.5)
        .to('[data-in="seal"]', { scale: 1, rotate: 0, opacity: 1, duration: 1.6, ease: 'back.out(1.4)' }, 1.7)
    }, root)
    return () => ctx.revert()
  }, [play, reduced])

  useLayoutEffect(() => {
    if (reduced || !fine) return
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      const layers: [string, number, number][] = [['[data-par="film"]', -18, -12], ['[data-par="tags"]', -34, -22], ['[data-par="seal"]', 24, 16]]
      const q = layers.map(([sel, dx, dy]) => ({ x: gsap.quickTo(sel, 'x', { duration: 1.1, ease: 'power3.out' }), y: gsap.quickTo(sel, 'y', { duration: 1.1, ease: 'power3.out' }), dx, dy }))
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        q.forEach((s) => {
          s.x(px * s.dx)
          s.y(py * s.dy)
        })
      }
      const leave = () => q.forEach((s) => (s.x(0), s.y(0)))
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', leave)
      return () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', leave)
      }
    }, root)
    return () => ctx.revert()
  }, [reduced, fine])

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('[data-scroll="film"]', { scale: 1.14, yPercent: 6, ease: 'none', scrollTrigger: st })
      gsap.to('[data-scroll="words"]', { yPercent: -18, opacity: 0, ease: 'none', scrollTrigger: st })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  const strip = services.map((s) => s.title)
  const ring = 'ARCHITECT-LED • FIXED COST • ON TIME • '

  return (
    <section id="top" ref={root} className="bg-ivory p-2 text-white sm:p-3 lg:p-4" aria-labelledby="hero-title">
      <div className="relative min-h-[calc(100svh-16px)] overflow-hidden rounded-[30px] bg-graphite sm:min-h-[calc(100svh-24px)] lg:min-h-[calc(100svh-32px)] lg:rounded-[44px]">
        <div data-in="film" data-scroll="film" className="absolute inset-0">
          <div data-par="film" className="absolute -inset-6">
            <div className="h-full w-full" style={{ animation: reduced ? undefined : 'kenburns 28s ease-in-out infinite alternate' }}>
              <LoopVideo src="/media/twostorey.mp4" poster="two-front" className="h-full w-full" focus="50% 40%" />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/90 via-white/45 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(15,18,24,0.82)_0%,rgba(15,18,24,0.35)_42%,transparent_70%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(15,18,24,0.45),transparent_55%)]" aria-hidden="true" />
        <span className="pointer-events-none absolute -left-24 bottom-20 h-80 w-80 rounded-full bg-[#4450e0]/30 blur-[90px]" style={{ animation: 'drift 18s ease-in-out infinite' }} aria-hidden="true" />
        <span className="pointer-events-none absolute -right-10 top-1/3 h-72 w-72 rounded-full bg-[#f0c9ae]/30 blur-[90px]" style={{ animation: 'drift 22s ease-in-out -9s infinite reverse' }} aria-hidden="true" />

        <div data-par="tags" className="pointer-events-none absolute inset-0 z-[5] hidden lg:block" aria-hidden="true">
          {heroStats.map((s, i) => (
            <div key={s.label} data-in="tag" className={`absolute ${tagPos[i]}`}>
              <span className="flex items-center gap-3 rounded-full border border-white/30 bg-white/15 py-2 pl-5 pr-6 text-white backdrop-blur-md" style={{ animation: `bob 6s ease-in-out ${tagDelay[i]} infinite` }}>
                <span className="text-[1.5rem] font-semibold leading-none tracking-tight">{s.value}</span>
                <span className="text-sm font-medium text-white/85">{s.label}</span>
              </span>
            </div>
          ))}
        </div>
        <div data-par="seal" className="absolute right-[5%] top-[18%] z-[5] hidden lg:block">
          <button data-in="seal" onClick={() => scrollToId('projects')} className="group relative grid h-32 w-32 place-items-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md transition-transform duration-500 hover:scale-105" aria-label="See the projects">
            <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" style={{ animation: reduced ? undefined : 'spinSlow 22s linear infinite' }} aria-hidden="true">
              <defs>
                <path id="seal-ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
              </defs>
              <text fontSize="9.4" fontWeight="600" letterSpacing="2.4" fill="#fff">
                <textPath href="#seal-ring">{ring + ring}</textPath>
              </text>
            </svg>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-graphite transition-transform duration-500 group-hover:rotate-45">
              <ArrowDown size={18} strokeWidth={1.8} className="-rotate-[135deg]" />
            </span>
          </button>
        </div>

        <div className="relative z-10 flex min-h-[inherit] flex-col justify-center px-5 pb-28 pt-28 sm:px-9 lg:px-[clamp(28px,4.5vw,72px)] lg:pb-28 lg:pt-28">
          <div data-scroll="words" className="max-w-[56rem]">
            <span data-c className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-[0.8rem] font-medium backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8fb3ea]" style={{ animation: 'pulseDot 2s ease-out infinite' }} />
              {hero.eyebrow}
            </span>
            <h1 id="hero-title" className="hero-dark display mt-6 text-[clamp(2.8rem,6.6vw,6.6rem)] !leading-[0.96]" aria-label={hero.lines.join(' ')}>
              <RevealWords as="span" lines={hero.lines} play={play} delay={0.5} italic={['Legacy']} stagger={0.1} />
            </h1>
            <p data-c className="mt-6 max-w-xl text-[1.08rem] leading-relaxed text-white/80">{hero.text}</p>
            <div data-c className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic as="button" onClick={() => scrollToId('contact')} className="btn-primary on-dark">{hero.primary}</Magnetic>
              <Magnetic as="button" onClick={() => scrollToId('about')} className="btn-ghost on-dark text-white">{hero.secondary}</Magnetic>
            </div>
          </div>
        </div>

        <div data-in="bar" className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-white/20 bg-white/10 backdrop-blur-xl" aria-label="Services">
          <div className="[mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_5%,#000_95%,transparent)]">
            <div className="flex w-max items-center gap-12 whitespace-nowrap py-5 text-lg font-medium tracking-tight text-white/85 hover:[animation-play-state:paused]" style={{ animation: reduced ? undefined : 'marquee 34s linear infinite' }}>
              {[...strip, ...strip, ...strip, ...strip].map((t, i) => (
                <span key={i} className="inline-flex items-center gap-12">
                  {t}
                  <span className="h-1.5 w-1.5 rounded-full bg-[#8fb3ea]" />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
