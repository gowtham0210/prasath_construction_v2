import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Still from '../components/Still'
import SectionHead from '../components/SectionHead'
import { Stagger } from '../components/Reveal'
import type { StillId } from '../data/media'
import { timeline } from '../data/prasath'
import { getLenis, gsap, ScrollTrigger } from '../lib/smooth'
import { useIsDesktop, usePrefersReducedMotion } from '../hooks/useEnv'

const images: StillId[] = ['g-10', 'p-completed-2', 'p-interior', 'g-08', 'p-completed-3']

/**
 * Our journey, as a ride along a road: the section holds the screen while the years slide past, each with a big
 * outlined numeral and a photo card. A little house travels along the road beneath, and the stops light up as it passes.
 */
export default function AboutJourney() {
  const desktop = useIsDesktop()
  const reduced = usePrefersReducedMotion()
  return desktop && !reduced ? <Ride /> : <Stack />
}

function Ride() {
  const section = useRef<HTMLElement | null>(null)
  const pin = useRef<HTMLDivElement | null>(null)
  const track = useRef<HTMLDivElement | null>(null)
  const fill = useRef<HTMLSpanElement | null>(null)
  const car = useRef<HTMLSpanElement | null>(null)
  const st = useRef<ScrollTrigger | null>(null)
  const [active, setActive] = useState(0)
  const N = timeline.length

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const dist = () => (track.current ? track.current.scrollWidth - window.innerWidth : 0)
      st.current = ScrollTrigger.create({
        trigger: section.current,
        start: 'top top',
        end: () => `+=${dist() * 1.15}`,
        pin: pin.current,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress
          if (track.current) gsap.set(track.current, { x: -p * dist() })
          if (fill.current) fill.current.style.transform = `scaleX(${p})`
          if (car.current) car.current.style.left = `${p * 100}%`
          const i = Math.min(N - 1, Math.round(p * (N - 1)))
          setActive((a) => (a === i ? a : i))
          // the big numerals drift against the track for depth
          gsap.set('[data-year-num]', { x: p * -120 })
        },
      })
    }, section)
    return () => ctx.revert()
  }, [N])

  const goTo = (i: number) => {
    const s = st.current
    if (!s) return
    const target = s.start + (i / (N - 1)) * (s.end - s.start)
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(target, { duration: 1.6 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <section id="about-journey" ref={section} className="relative text-graphite" aria-label="Our journey">
      <div ref={pin} className="relative flex h-[100svh] w-full flex-col justify-between overflow-hidden pb-10 pt-24">
        <div className="container-x">
          <span className="chip">Our journey</span>
          <h2 className="display mt-4 text-[clamp(2rem,3.8vw,3.6rem)] !leading-[1.02]">
            Ten years. <span className="accent-word">One obsession.</span>
          </h2>
        </div>

        {/* the slides */}
        <div ref={track} className="flex w-max items-center gap-[6vw] px-[8vw] will-change-transform">
          {timeline.map((t, i) => (
            <article key={t.year} className={`relative flex w-[min(86vw,1040px)] shrink-0 items-center gap-8 transition-all duration-700 ${i === active ? 'scale-100 opacity-100' : 'scale-[0.94] opacity-40'}`}>
              <span data-year-num className="pointer-events-none select-none text-[clamp(7rem,15vw,15rem)] font-semibold leading-none tracking-tighter text-transparent" style={{ WebkitTextStroke: '1.5px rgba(68,80,224,0.4)' }} aria-hidden="true">
                {t.year}
              </span>
              <div className="card group grid w-[min(34rem,46vw)] shrink-0 overflow-hidden !rounded-[32px] p-3">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[24px]">
                  <Still id={images[i]} className="h-full w-full !rounded-none transition-transform duration-[1600ms] ease-[var(--ease-expo)] group-hover:scale-[1.07]" />
                  <span className="chip absolute left-4 top-4">{String(i + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-[1.5rem] font-medium tracking-tight">{t.title}</h3>
                  <p className="mt-2 text-[0.98rem] leading-relaxed text-graphite/60">{t.text}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* the road */}
        <div className="container-x">
          <div className="relative mt-2 h-14">
            <span className="absolute inset-x-0 top-[26px] h-[3px] rounded-full bg-graphite/10" />
            <span className="absolute inset-x-0 top-[26px] h-[3px] border-t-2 border-dashed border-graphite/25" />
            <span ref={fill} className="absolute inset-x-0 top-[26px] h-[3px] origin-left rounded-full bg-gradient-to-r from-[#8fb3ea] to-olive" style={{ transform: 'scaleX(0)' }} />
            <span ref={car} className="absolute top-[26px] z-10 -translate-x-1/2 -translate-y-1/2" style={{ left: '0%' }} aria-hidden="true">
              <motion.span className="grid h-11 w-11 place-items-center rounded-2xl bg-graphite text-white shadow-[0_14px_30px_-10px_rgba(68,80,224,0.7)]" animate={{ y: [0, -4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M4 20V10l8-6 8 6v10z" /><path d="M10 20v-6h4v6" /></svg>
              </motion.span>
            </span>
            <ol className="absolute inset-x-0 top-0 flex justify-between" aria-label="Milestones">
              {timeline.map((t, i) => (
                <li key={t.year} className="relative" style={{ width: 0 }}>
                  <button onClick={() => goTo(i)} aria-current={i === active ? 'step' : undefined} className="group absolute left-0 top-0 flex -translate-x-1/2 flex-col items-center gap-2">
                    <span className={`mt-[19px] block h-3.5 w-3.5 rounded-full border-2 transition-all duration-500 ${i <= active ? 'scale-110 border-olive bg-olive' : 'border-graphite/30 bg-white'}`} />
                    <span className={`mt-2 text-sm font-semibold transition-colors duration-500 ${i === active ? 'text-graphite' : 'text-graphite/45 group-hover:text-graphite'}`}>{t.year}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Phones and reduced motion: the same story as a calm stack of cards. */
function Stack() {
  return (
    <section id="about-journey" className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby="about-journey-title">
      <div className="container-x">
        <SectionHead id="about-journey-title" chip="Our journey" lines={['Ten years.', 'One obsession.']} accent={['obsession.']} />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2" gap={0.1}>
          {timeline.map((t, i) => (
            <article key={t.year} className="card overflow-hidden !rounded-[28px] p-3">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
                <Still id={images[i]} className="h-full w-full !rounded-none" />
                <span className="chip absolute left-3 top-3">{t.year}</span>
              </div>
              <div className="p-5">
                <h3 className="text-[1.25rem] font-medium tracking-tight">{t.title}</h3>
                <p className="mt-1.5 text-[0.95rem] leading-relaxed text-graphite/60">{t.text}</p>
              </div>
            </article>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
