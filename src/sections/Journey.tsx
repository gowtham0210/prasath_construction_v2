import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { journey } from '../data/journey'
import { getLenis, gsap, ScrollTrigger } from '../lib/smooth'
import { usePrefersReducedMotion } from '../hooks/useEnv'

const VIDEO = '/media/process.mp4'
const ease = [0.16, 1, 0.3, 1] as const

/**
 * Our process: the time-lapse of a home being built plays full-screen behind the section and is scrubbed by scroll,
 * so the house rises as you scroll down and un-builds as you scroll back. The six stages appear over it one at a time.
 */
export default function Journey() {
  const reduced = usePrefersReducedMotion()
  return reduced ? <JourneyStatic /> : <JourneyScrub />
}

function JourneyScrub() {
  const section = useRef<HTMLElement | null>(null)
  const pin = useRef<HTMLDivElement | null>(null)
  const video = useRef<HTMLVideoElement | null>(null)
  const bar = useRef<HTMLSpanElement | null>(null)
  const st = useRef<ScrollTrigger | null>(null)
  const [stage, setStage] = useState(0)
  const [ready, setReady] = useState(false)
  const N = journey.length

  useLayoutEffect(() => {
    const v = video.current
    if (!v) return
    let target = 0
    let raf = 0
    const ctx = gsap.context(() => {
      st.current = ScrollTrigger.create({
        trigger: section.current,
        start: 'top top',
        end: '+=520%',
        pin: pin.current,
        anticipatePin: 1,
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          if (v.duration) target = p * (v.duration - 0.05)
          if (bar.current) bar.current.style.transform = `scaleX(${p})`
          const s = Math.min(N - 1, Math.floor(p * N))
          setStage((a) => (a === s ? a : s))
        },
      })
    }, section)

    // ease the playhead toward the scroll position so the building motion feels fluid, not steppy
    const tick = () => {
      if (v.readyState >= 2 && Math.abs(v.currentTime - target) > 0.012) {
        v.currentTime += (target - v.currentTime) * 0.18
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ctx.revert()
    }
  }, [N])

  const goTo = useCallback((i: number) => {
    const s = st.current
    if (!s) return
    const target = s.start + ((i + 0.5) / N) * (s.end - s.start)
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(target, { duration: 1.6 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }, [N])

  const cur = journey[stage]

  return (
    <section id="process" ref={section} className="relative text-graphite" aria-label="Our process: from napkin sketch to handover keys">
      <div ref={pin} className="relative h-[100svh] w-full overflow-hidden bg-[#cfe0f5]">
        <video
          ref={video}
          src={VIDEO}
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden="true"
        />
        {/* soft veil keeps the text readable without hiding the build */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/55 via-white/10 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/60 to-transparent" aria-hidden="true" />

        <div className="container-x relative z-10 flex h-full flex-col justify-between pb-8 pt-[96px] lg:pb-10">
          <div className="max-w-md">
            <span className="chip">Our process</span>
            <h2 id="process-title" className="display mt-4 text-[clamp(1.9rem,3.6vw,3.4rem)] !leading-[1.02]">From napkin sketch to <span className="accent-word">handover keys.</span></h2>
          </div>

          <div className="flex flex-col gap-6">
            {/* current stage */}
            <div className="glass min-h-[11.5rem] max-w-[26rem] rounded-[28px] p-6 sm:p-7">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={cur.number} initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { duration: 0.8, ease } }} exit={{ y: -18, opacity: 0, transition: { duration: 0.25 } }}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-graphite text-xs font-semibold text-white">{cur.number}</span>
                    <span className="eyebrow text-graphite/50">Stage {stage + 1} of {N}</span>
                  </div>
                  <h3 className="mt-4 text-[1.6rem] font-medium tracking-tight">{cur.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-graphite/65">{cur.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* progress rail */}
            <div>
              <div className="relative h-[3px] overflow-hidden rounded-full bg-graphite/15">
                <span ref={bar} className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-[#8fb3ea] to-olive" style={{ transform: 'scaleX(0)' }} />
              </div>
              <ol className="mt-3 flex justify-between" aria-label="Stages">
                {journey.map((s, i) => (
                  <li key={s.number}>
                    <button onClick={() => goTo(i)} aria-current={i === stage ? 'step' : undefined} className="group flex items-center gap-2">
                      <span className={`block h-2.5 w-2.5 rounded-full transition-all duration-500 ${i <= stage ? 'scale-110 bg-olive' : 'bg-graphite/25'} ${i === stage ? 'shadow-[0_0_0_5px_rgba(68,80,224,0.2)]' : ''}`} />
                      <span className={`hidden text-xs font-medium transition-colors duration-500 sm:block ${i === stage ? 'text-graphite' : 'text-graphite/45 group-hover:text-graphite'}`}>{s.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Reduced motion: the film simply plays on a loop (it is silent) beside a plain list of the stages. */
function JourneyStatic() {
  return (
    <section id="process" className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-label="Our process">
      <div className="container-x">
        <span className="chip">Our process</span>
        <h2 id="process-title" className="display mt-4 text-[clamp(2rem,4vw,3.6rem)]">From napkin sketch to <span className="accent-word">handover keys.</span></h2>
        <video src={VIDEO} muted playsInline loop autoPlay className="mt-8 aspect-video w-full rounded-[32px] object-cover" aria-hidden="true" />
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {journey.map((s) => (
            <li key={s.number} className="card p-6">
              <span className="chip">Stage {s.number}</span>
              <h3 className="mt-3 text-xl font-medium">{s.title}</h3>
              <p className="mt-2 text-sm text-graphite/65">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
