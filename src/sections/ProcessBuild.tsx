import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHead from '../components/SectionHead'
import { journey } from '../data/journey'
import { STILLS } from '../data/media'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Our process: a sticky frame shows a real site photograph for the stage you are reading, while the seven stages sit beside it and light up in turn.
 */
export default function ProcessBuild({ id = 'projects-process' }: { id?: string }) {
  const [stage, setStage] = useState(0)
  const items = useRef<(HTMLLIElement | null)[]>([])
  const list = useRef<HTMLOListElement | null>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setStage(Number((e.target as HTMLElement).dataset.i))
        })
      },
      { rootMargin: '-42% 0px -42% 0px' },
    )
    items.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const N = journey.length
  const cur = journey[stage]

  return (
    <section id={id} className="relative py-[clamp(36px,5vh,64px)] text-graphite" aria-labelledby={`${id}-title`}>
      <div className="container-x">
        <SectionHead id={`${id}-title`} chip="Our process" lines={['From napkin sketch', 'to handover keys.']} accent={['keys.']} text="A clear, milestone-driven process so you always know what's happening — and what's next." />

        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* the home that builds itself */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="card relative overflow-hidden !rounded-[36px] p-5 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="chip">Stage</span>
                  <span className="flex items-baseline gap-1 text-sm font-semibold text-ink-2">
                    <span className="relative inline-block h-[1.4em] w-[1.6em] overflow-hidden text-right text-[1.4rem] leading-[1.4em] text-graphite">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span key={stage} className="absolute inset-0" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.6, ease }}>
                          {String(stage + 1).padStart(2, '0')}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    / {String(N).padStart(2, '0')}
                  </span>
                </div>
                <div className="relative mx-auto mt-4 aspect-square w-full max-w-md overflow-hidden rounded-[26px] bg-[#cfe0f5]">
                  {journey.map((j, i) => (
                    <img
                      key={j.number}
                      src={STILLS[j.image].image}
                      alt={i === stage ? `${j.title}: ${STILLS[j.image].alt}` : ''}
                      aria-hidden={i === stage ? undefined : true}
                      loading="lazy"
                      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${i === stage ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" aria-hidden="true" />
                </div>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-graphite/10">
                  <span className="block h-full origin-left rounded-full bg-gradient-to-r from-[#8fb3ea] to-olive transition-transform duration-700 ease-[var(--ease-expo)]" style={{ transform: `scaleX(${(stage + 1) / N})` }} />
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={cur.number} className="mt-4" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.45, ease }}>
                    <p className="text-[1.25rem] font-medium tracking-tight">{cur.title}</p>
                    <p className="mt-1 text-sm text-ink-2">{cur.text}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* the stages */}
          <ol ref={list} className="space-y-5 lg:col-span-7 lg:space-y-8">
            {journey.map((s, i) => {
              const done = i < stage
              const now = i === stage
              return (
                <li key={s.number} ref={(el) => { items.current[i] = el }} data-i={i} className="relative">
                  <button
                    onClick={() => document.getElementById(`${id}-step-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    id={`${id}-step-${i}`}
                    className={`card group flex w-full items-start gap-5 p-6 text-left transition-all duration-700 ease-[var(--ease-expo)] sm:p-7 lg:min-h-[9.5rem] ${now ? 'shadow-[0_40px_90px_-45px_rgba(68,80,224,0.6)] ring-2 ring-olive/35' : 'opacity-60'}`}
                    aria-current={now ? 'step' : undefined}
                  >
                    <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-sm font-semibold transition-all duration-700 ${now ? 'scale-110 bg-olive text-white shadow-[0_0_0_8px_rgba(68,80,224,0.16)]' : done ? 'bg-graphite text-white' : 'bg-graphite/8 text-ink-2'}`}>{s.number}</span>
                    <span>
                      <span className="block text-[1.35rem] font-medium tracking-tight">{s.title}</span>
                      <span className="mt-1.5 block max-w-md text-[0.98rem] leading-relaxed text-ink-2">{s.text}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
