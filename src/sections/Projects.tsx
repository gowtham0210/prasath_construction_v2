import { useEffect, useMemo, useState, type PointerEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Ruler, Home } from 'lucide-react'
import { projectFilters, projects } from '../data/projects'
import Still from '../components/Still'
import SectionHead from '../components/SectionHead'
import { Reveal } from '../components/Reveal'
import { useFinePointer, usePrefersReducedMotion } from '../hooks/useEnv'

type Filter = (typeof projectFilters)[number]

const CYCLE = 6500
const ease = [0.16, 1, 0.3, 1] as const

/** An interactive showcase: a numbered project index on the left drives a large stage on the right. */
export default function Projects({ onOpen }: { onOpen: (slug: string) => void }) {
  const [filter, setFilter] = useState<Filter>('All Projects')
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const fine = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const list = useMemo(() => (filter === 'All Projects' ? projects : projects.filter((p) => p.category === filter)), [filter])
  const idx = Math.min(active, Math.max(list.length - 1, 0))
  const cur = list[idx]
  const go = (n: number) => setActive((n + list.length) % list.length)

  useEffect(() => setActive(0), [filter])

  // gently advance on its own; hovering the showcase or choosing a project stops the clock
  useEffect(() => {
    if (reduced || paused || list.length < 2) return
    const t = setTimeout(() => go(idx + 1), CYCLE)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, paused, reduced, list.length, filter])

  const move = (e: PointerEvent<HTMLElement>) => {
    if (!fine) return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width - 0.5) * -26}px`)
    e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height - 0.5) * -18}px`)
  }
  const leave = (e: PointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--mx', '0px')
    e.currentTarget.style.setProperty('--my', '0px')
  }

  return (
    <section id="projects" className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby="projects-title">
      <div className="container-x">
        <SectionHead id="projects-title" chip="Our projects" lines={['A portfolio built on', 'trust & craftsmanship.']} accent={['craftsmanship.']} text="From compact city homes to sprawling villas — explore the spaces we have delivered, the ones in progress, and what is coming next." />

        <Reveal className="mt-10">
          <div role="tablist" aria-label="Filter projects" className="no-scrollbar flex gap-2 overflow-x-auto pb-2 md:justify-center">
            {projectFilters.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-500 ${filter === f ? 'bg-graphite text-white shadow-[0_12px_30px_-12px_rgba(15,18,24,0.6)]' : 'bg-white/70 text-ink-2 hover:bg-white hover:text-graphite'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        {cur ? (
          <Reveal y={70} className="mt-8">
            <div className="grid gap-5 lg:grid-cols-12 lg:gap-6" onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)} onPointerLeave={(e) => e.pointerType === 'mouse' && setPaused(false)}>
              {/* stage */}
              <div className="lg:order-2 lg:col-span-8" onPointerMove={move} onPointerLeave={leave}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-[#dfe6f2] shadow-[0_40px_90px_-45px_rgba(40,60,110,0.65)] sm:aspect-[16/11] lg:rounded-[44px]">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={cur.slug}
                      className="absolute inset-0"
                      initial={{ clipPath: 'inset(0 0 0 100%)' }}
                      animate={{ clipPath: 'inset(0 0 0 0%)' }}
                      exit={{ opacity: 0.9, transition: { duration: 1.2 } }}
                      transition={{ duration: 1.15, ease: [0.76, 0, 0.24, 1] }}
                    >
                      <div className="absolute -inset-6 transition-transform duration-500 ease-out" style={{ transform: 'translate3d(var(--mx,0px),var(--my,0px),0)' }}>
                        <motion.div className="h-full w-full" initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease }}>
                          <Still id={cur.cover} className="h-full w-full !rounded-none" />
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0f1218]/60 via-transparent to-[#0f1218]/10" />

                  {/* top row: status + counter */}
                  <div className="absolute inset-x-5 top-5 z-10 flex items-center justify-between sm:inset-x-6 sm:top-6">
                    <span className="chip">{cur.isConcept ? 'Concept design' : cur.status}</span>
                    <span className="flex items-center gap-2 rounded-full bg-white/25 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                      <span className="inline-block overflow-hidden tabular-nums">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span key={idx} className="inline-block" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: 0.6, ease }}>
                            {String(idx + 1).padStart(2, '0')}
                          </motion.span>
                        </AnimatePresence>
                      </span>
                      <span className="opacity-60">/ {String(list.length).padStart(2, '0')}</span>
                    </span>
                  </div>

                  {/* bottom: glass details bar */}
                  <div className="absolute inset-x-4 bottom-4 z-10 sm:inset-x-6 sm:bottom-6">
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={cur.slug}
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1, transition: { duration: 0.9, delay: 0.5, ease } }}
                        exit={{ y: -20, opacity: 0, transition: { duration: 0.3 } }}
                        className="rounded-[26px] bg-white/80 p-5 backdrop-blur-xl sm:p-6"
                      >
                        <div className="flex items-end justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="text-[clamp(1.4rem,2.6vw,2.4rem)] font-medium leading-tight tracking-tight">{cur.name}</h3>
                            <p className="mt-1 hidden max-w-lg text-sm text-ink-2 sm:block">{cur.concept}</p>
                          </div>
                          <button onClick={() => onOpen(cur.slug)} className="btn-primary shrink-0" aria-label={`View project: ${cur.name}`}>View</button>
                        </div>
                        <div className="mt-4 hidden flex-wrap gap-2 sm:flex">
                          {[
                            { icon: Home, text: cur.category },
                            { icon: MapPin, text: cur.location },
                            { icon: Ruler, text: cur.builtUp.replace(' (concept)', '') },
                          ].map(({ icon: Icon, text }, k) => (
                            <motion.span key={text} initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.75 + k * 0.1, duration: 0.7, ease }} className="inline-flex items-center gap-1.5 rounded-full bg-graphite/5 px-3 py-1.5 text-xs font-medium text-ink-2">
                              <Icon size={13} strokeWidth={1.7} />
                              {text}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* index */}
              <div className="flex flex-col lg:order-1 lg:col-span-4">
                <ol className="flex-1 space-y-2" aria-label="Projects">
                  {list.map((p, i) => {
                    const on = i === idx
                    return (
                      <li key={p.slug} className={on ? 'max-lg:hidden' : ''}>
                        <button
                          onClick={() => {
                            setActive(i)
                            setPaused(true)
                          }}
                          aria-current={on}
                          className={`group relative flex w-full items-center gap-4 overflow-hidden rounded-[24px] p-3 pr-5 text-left transition-all duration-700 ease-[var(--ease-expo)] ${on ? 'bg-white shadow-[0_24px_60px_-35px_rgba(40,60,110,0.6)]' : 'hover:bg-white/60'}`}
                        >
                          <span className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl transition-all duration-700 ${on ? 'scale-100' : 'scale-90 opacity-70 group-hover:scale-95 group-hover:opacity-100'}`}>
                            <Still id={p.cover} className="h-full w-full !rounded-none" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="eyebrow block text-[0.62rem] text-ink-2">{String(i + 1).padStart(2, '0')} · {p.category}</span>
                            <span className={`mt-0.5 block truncate text-[1.05rem] font-medium tracking-tight transition-colors duration-500 ${on ? 'text-graphite' : 'text-ink-2 group-hover:text-graphite'}`}>{p.name}</span>
                          </span>
                          <ArrowUpRight size={18} strokeWidth={1.6} className={`shrink-0 transition-all duration-500 ${on ? 'translate-x-0 text-olive opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-60'}`} />
                          {on && !reduced && list.length > 1 && (
                            <span
                              key={`${cur.slug}-${paused}`}
                              className="absolute inset-x-3 bottom-0 h-[3px] origin-left rounded-full bg-olive"
                              style={{ animation: paused ? undefined : `fillBar ${CYCLE}ms linear forwards`, transform: paused ? 'scaleX(0)' : undefined }}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ol>
                <div className="mt-5 flex items-center gap-3">
                  <button onClick={() => { go(idx - 1); setPaused(true) }} className="grid h-12 w-12 place-items-center rounded-full bg-white/80 transition-all duration-500 hover:-translate-x-0.5 hover:bg-graphite hover:text-white" aria-label="Previous project">
                    <ArrowLeft size={18} strokeWidth={1.6} />
                  </button>
                  <button onClick={() => { go(idx + 1); setPaused(true) }} className="grid h-12 w-12 place-items-center rounded-full bg-white/80 transition-all duration-500 hover:translate-x-0.5 hover:bg-graphite hover:text-white" aria-label="Next project">
                    <ArrowRight size={18} strokeWidth={1.6} />
                  </button>
                  <span className="ml-1 text-xs text-ink-2">{paused ? 'Paused' : 'Auto-playing'}</span>
                </div>
              </div>
            </div>
          </Reveal>
        ) : (
          <p className="py-20 text-center text-ink-2">No projects in this category yet.</p>
        )}
        <Reveal className="mt-10 text-center">
          <a href="/projects" className="btn-primary">More Projects</a>
        </Reveal>
      </div>
    </section>
  )
}
