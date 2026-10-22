import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, motion, useInView, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Home, Layers, MapPin, Maximize2, Ruler, X } from 'lucide-react'
import { getProject, projects } from '../data/projects'
import Still from './Still'
import { company } from '../config/company'
import { startScroll, stopScroll, scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'
import { LogoMark } from './Logo'
import { usePrefersReducedMotion } from '../hooks/useEnv'

interface Props {
  slug: string
  onClose: (returnTo?: string) => void
  onOpen: (slug: string) => void
}

const ease = [0.16, 1, 0.3, 1] as const
const num = (s: string) => Number(s.replace(/[^\d.]/g, '')) || 0
/** "4,800 sq.ft built-up" → 4800 */
const sqft = (s: string) => num(s.split(' ')[0].replace(/,/g, ''))

/** A number that counts up from zero the first time it scrolls into view. */
function CountUp({ to, suffix = '', className = '' }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduced = usePrefersReducedMotion()
  useEffect(() => {
    if (!inView || !ref.current) return
    const el = ref.current
    if (reduced) {
      el.textContent = to.toLocaleString('en-IN') + suffix
      return
    }
    const c = animate(0, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => (el.textContent = Math.round(v).toLocaleString('en-IN') + suffix) })
    return () => c.stop()
  }, [inView, to, suffix, reduced])
  return <span ref={ref} className={className}>{reduced ? to.toLocaleString('en-IN') + suffix : '0' + suffix}</span>
}

/** Words that rise out of a mask one after another. */
function RiseWords({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i, all) => (
        <span key={i} aria-hidden="true">
          <span className="-mb-[0.2em] inline-block overflow-hidden pb-[0.2em] align-bottom">
            <motion.span className="inline-block" initial={{ y: '115%', rotate: 4 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: 1.2, ease, delay: delay + i * 0.09 }}>
              {w}
            </motion.span>
          </span>
          {i < all.length - 1 ? ' ' : ''}
        </span>
      ))}
    </span>
  )
}

const rise = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '0px 0px -12% 0px' }, transition: { duration: 1, ease } }

/** Immersive project page: a parallax hero, count-up facts, a self-drawing process line, the photograph, more projects and an enquiry. */
export default function ProjectDetail({ slug, onClose, onOpen }: Props) {
  const project = getProject(slug)
  const scroller = useRef<HTMLDivElement | null>(null)
  const processList = useRef<HTMLOListElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const [zoom, setZoom] = useState(false)
  const next = useMemo(() => {
    const i = projects.findIndex((p) => p.slug === slug)
    return projects[(i + 1) % projects.length]
  }, [slug])
  const others = useMemo(() => projects.filter((p) => p.slug !== slug).slice(0, 4), [slug])

  const { scrollY, scrollYProgress } = useScroll({ container: scroller })
  const bar = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 })
  const heroY = useTransform(scrollY, [0, 700], [0, reduced ? 0 : 170])
  const heroScale = useTransform(scrollY, [0, 700], [1, reduced ? 1 : 1.12])
  const heroText = useTransform(scrollY, [0, 420], [1, 0])
  const { scrollYProgress: line } = useScroll({ container: scroller, target: processList, offset: ['start 75%', 'end 55%'] })
  const lineScale = useSpring(line, { stiffness: 120, damping: 26 })

  // own scroll area: pause page scrolling underneath and restore it on close
  useEffect(() => {
    stopScroll()
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') (zoom ? setZoom(false) : onClose('projects'))
    }
    window.addEventListener('keydown', onKey)
    scroller.current?.focus()
    return () => {
      document.documentElement.style.overflow = prev
      startScroll()
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, zoom])

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 })
  }, [slug, project])

  if (!project) {
    return (
      <div className="fixed inset-0 z-[70] grid place-items-center bg-ivory p-8 text-center text-graphite">
        <div>
          <h1 className="font-serif text-4xl">Project not found</h1>
          <button className="btn-primary mt-8" onClick={() => onClose('projects')}>Back to projects</button>
        </div>
      </div>
    )
  }

  const enquire = () => {
    setEnquiryPrefill('House Construction')
    onClose('contact')
    setTimeout(() => scrollToId('contact'), 120)
  }

  const built = sqft(project.builtUp)
  const plot = num(project.specs.find((s) => s.label === 'Plot area')?.value.replace(/,/g, '') ?? '0')
  const portions = project.specs.find((s) => s.label === 'Portions')?.value ?? ''
  const floors = Number(portions.replace(/\D/g, '')) + 1 || 0
  const live = project.category === 'Ongoing'
  const facts = [
    { Icon: Ruler, label: 'Plot area', to: plot, suffix: ' sq.ft' },
    { Icon: Maximize2, label: 'Built-up area', to: built, suffix: ' sq.ft' },
    { Icon: Layers, label: portions ? `Floors (${portions})` : 'Floors', to: floors, suffix: '' },
  ].filter((f) => f.to > 0)

  return (
    <motion.div
      className="fixed inset-0 z-[70] overflow-y-auto overflow-x-hidden bg-ivory text-graphite outline-none"
      ref={scroller}
      tabIndex={-1}
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={project.name}
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      animate={{ clipPath: 'inset(0% 0 0 0)' }}
      exit={{ clipPath: 'inset(100% 0 0 0)' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <header className="sticky top-0 z-20 bg-ivory/85 backdrop-blur-md">
        <div className="flex items-center justify-between px-[clamp(20px,4vw,64px)] py-4">
          <button onClick={() => onClose('projects')} className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em]" aria-label="Back to projects">
            <ArrowLeft size={16} strokeWidth={1.4} /> Projects
          </button>
          <span className="hidden items-center gap-3 md:inline-flex"><LogoMark className="h-6 w-6" /><span className="font-serif text-lg uppercase tracking-[0.2em]">{company.name}</span></span>
          <button onClick={() => onClose('projects')} className="grid h-10 w-10 place-items-center rounded-full border border-graphite/25 transition-colors hover:bg-graphite hover:text-white" aria-label="Close project">
            <X size={18} strokeWidth={1.4} />
          </button>
        </div>
        <motion.span className="block h-[3px] origin-left bg-gradient-to-r from-[#8fb3ea] via-olive to-[#ff9a3c]" style={{ scaleX: bar }} aria-hidden="true" />
      </header>

      {/* hero */}
      <div className="relative h-[82svh] min-h-[480px] w-full overflow-hidden bg-graphite">
        <motion.div className="absolute -inset-x-0 -top-[10%] h-[120%]" style={{ y: heroY, scale: heroScale }}>
          <motion.div className="h-full w-full" initial={{ scale: 1.25 }} animate={{ scale: 1 }} transition={{ duration: 2.6, ease, delay: 0.3 }}>
            <Still id={project.cover} className="h-full w-full" priority />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/90 via-graphite/25 to-graphite/10" />
        <motion.div className="container-x absolute inset-x-0 bottom-0 pb-10 text-white sm:pb-14" style={{ opacity: heroText }}>
          <motion.div className="flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.9 }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
              <span className="relative grid h-2 w-2 place-items-center">
                {live && <span className="absolute inset-0 rounded-full bg-[#2fbf71]" style={{ animation: 'pulseRing 1.8s ease-out infinite' }} />}
                <span className={`h-2 w-2 rounded-full ${live ? 'bg-[#2fbf71]' : project.category === 'Completed' ? 'bg-bronze' : 'bg-[#ffb347]'}`} />
              </span>
              {project.category}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium backdrop-blur-md"><MapPin size={14} strokeWidth={1.8} aria-hidden="true" /> {project.location}</span>
          </motion.div>
          <h1 className="display mt-5 text-[clamp(2.6rem,7.4vw,7.2rem)] !leading-[1]">
            <RiseWords text={project.name} delay={0.5} />
          </h1>
          <motion.p className="mt-4 max-w-xl text-[1.05rem] text-white/85" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 1.1 }}>{project.concept}</motion.p>
        </motion.div>
        <motion.span className="absolute bottom-5 right-[clamp(20px,4vw,64px)] hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/80 md:inline-flex" style={{ opacity: heroText }} aria-hidden="true">
          Scroll <ArrowDown size={14} style={{ animation: 'bob 2s ease-in-out infinite' }} />
        </motion.span>
      </div>

      {/* facts that count up */}
      <section className="container-x relative z-10 -mt-10 sm:-mt-14" aria-label="Project facts">
        <ul className={`grid gap-4 ${facts.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
          {facts.map(({ Icon, label, to, suffix }, i) => (
            <motion.li key={label} {...rise} transition={{ duration: 1, ease, delay: i * 0.12 }} className="card !rounded-[28px] p-6 sm:p-7">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-olive/10 text-olive"><Icon size={20} strokeWidth={1.6} aria-hidden="true" /></span>
              <p className="mt-5 text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-none tracking-tight"><CountUp to={to} suffix={suffix} /></p>
              <p className="mt-2 text-sm font-medium text-ink-2">{label}</p>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* overview and details */}
      <div className="container-x grid gap-14 py-20 lg:grid-cols-12 lg:py-28">
        <div className="lg:col-span-7">
          <motion.p {...rise} className="eyebrow text-olive">Overview</motion.p>
          <motion.p {...rise} transition={{ duration: 1, ease, delay: 0.1 }} className="display mt-6 text-[clamp(1.7rem,3vw,2.7rem)] !leading-[1.15]">{project.concept}.</motion.p>
          <motion.p {...rise} transition={{ duration: 1, ease, delay: 0.2 }} className="mt-8 max-w-2xl text-[1.05rem] leading-relaxed text-ink-2">{project.overview}</motion.p>
          {plot > 0 && built > 0 && (
            <motion.div {...rise} transition={{ duration: 1, ease, delay: 0.3 }} className="mt-10 max-w-xl space-y-4">
              {[
                { label: 'Plot area', value: plot },
                { label: 'Built-up area', value: built },
              ].map((r, i) => (
                <div key={r.label}>
                  <div className="flex justify-between text-sm"><span className="font-medium text-ink-2">{r.label}</span><span className="font-semibold">{r.value.toLocaleString('en-IN')} sq.ft</span></div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-graphite/10">
                    <motion.span className={`block h-full origin-left rounded-full ${i === 0 ? 'bg-gradient-to-r from-[#cfe0f5] to-[#8fb3ea]' : 'bg-gradient-to-r from-[#8fb3ea] to-olive'}`} initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease, delay: 0.3 + i * 0.25 }} style={{ width: `${(r.value / Math.max(plot, built)) * 100}%` }} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>
        <aside className="lg:col-span-4 lg:col-start-9">
          <motion.div {...rise} className="card !rounded-[28px] p-6 sm:p-8 lg:sticky lg:top-28">
            <p className="eyebrow text-olive">Project details</p>
            <dl className="mt-5 divide-y divide-graphite/10 text-sm">
              {project.specs.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease, delay: 0.1 + i * 0.08 }} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3.5">
                  <dt className="text-ink-2">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </motion.div>
              ))}
            </dl>
            <button onClick={enquire} className="btn-primary mt-6 w-full justify-center">Enquire about a similar home <ArrowUpRight size={16} strokeWidth={1.5} /></button>
          </motion.div>
        </aside>
      </div>

      {/* the photograph */}
      <div className="container-x pb-20 lg:pb-28">
        <motion.p {...rise} className="eyebrow text-olive">Photograph</motion.p>
        <motion.button
          {...rise}
          onClick={() => setZoom(true)}
          className="group relative mt-8 block aspect-[4/3] w-full overflow-hidden rounded-[32px] shadow-[0_40px_90px_-50px_rgba(40,60,110,0.7)] sm:aspect-[16/9] lg:rounded-[44px]"
          aria-label="View the photograph full size"
        >
          <Still id={project.gallery[0]} className="h-full w-full transition-transform duration-[1600ms] ease-[var(--ease-expo)] group-hover:scale-[1.06]" />
          <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100 sm:opacity-100"><Maximize2 size={14} aria-hidden="true" /> View full size</span>
        </motion.button>
      </div>

      {/* how every project is built, with a line that draws as you scroll */}
      <div className="bg-sky-grad py-20 lg:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <motion.p {...rise} className="eyebrow text-olive">Construction process</motion.p>
            <motion.h2 {...rise} transition={{ duration: 1, ease, delay: 0.1 }} className="display mt-5 text-[clamp(1.9rem,3.4vw,3.2rem)] !leading-[1.05]">How every home is <span className="accent-word">built.</span></motion.h2>
            <motion.p {...rise} transition={{ duration: 1, ease, delay: 0.2 }} className="mt-4 max-w-sm text-ink-2">Seven milestones, the same fixed-cost process on every project, from the first meeting to the keys.</motion.p>
          </div>
          <div className="relative lg:col-span-8">
            <span className="absolute bottom-6 left-[27px] top-6 w-[2px] rounded-full bg-graphite/12" aria-hidden="true" />
            <motion.span className="absolute bottom-6 left-[27px] top-6 w-[2px] origin-top rounded-full bg-gradient-to-b from-[#8fb3ea] to-olive" style={{ scaleY: lineScale }} aria-hidden="true" />
            <ol ref={processList} className="relative space-y-5">
              {project.process.map((s, i) => {
                const [title, ...rest] = s.split(' — ')
                return (
                  <motion.li key={s} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }} transition={{ duration: 0.9, ease, delay: 0.05 }} className="card flex items-start gap-5 !rounded-[26px] p-5 sm:p-6">
                    <motion.span initial={{ scale: 0.4 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 260, damping: 16 }} className="relative z-10 grid h-[54px] w-[54px] shrink-0 place-items-center rounded-full bg-graphite text-sm font-semibold text-white shadow-[0_0_0_6px_rgba(245,247,251,0.9)]">
                      {String(i + 1).padStart(2, '0')}
                    </motion.span>
                    <span className="pt-1">
                      <span className="block text-[1.2rem] font-medium tracking-tight">{title}</span>
                      {rest.length > 0 && <span className="mt-1 block text-[0.95rem] leading-relaxed text-ink-2">{rest.join(' — ')}</span>}
                    </span>
                  </motion.li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>

      {/* more projects */}
      <div className="container-x py-20 lg:py-28">
        <div className="flex items-end justify-between gap-6">
          <div>
            <motion.p {...rise} className="eyebrow text-olive">More projects</motion.p>
            <motion.h2 {...rise} transition={{ duration: 1, ease, delay: 0.1 }} className="display mt-4 text-[clamp(1.9rem,3.4vw,3.2rem)] !leading-[1.05]">Keep exploring.</motion.h2>
          </div>
          <motion.a {...rise} href="/projects" className="link-line hidden shrink-0 font-medium sm:inline-block" onClick={(e) => { e.preventDefault(); onClose('projects') }}>All projects</motion.a>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {others.map((p, i) => (
            <motion.li key={p.slug} {...rise} transition={{ duration: 1, ease, delay: i * 0.1 }}>
              <button onClick={() => onOpen(p.slug)} className="group block w-full text-left" aria-label={`Open ${p.name}`}>
                <span className="relative block aspect-[4/5] overflow-hidden rounded-[24px] shadow-[0_30px_70px_-45px_rgba(40,60,110,0.7)]">
                  <Still id={p.cover} className="h-full w-full transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.08]" />
                  <span className="absolute inset-0 bg-gradient-to-t from-graphite/70 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-[0.7rem] font-semibold backdrop-blur">{p.category}</span>
                  <span className="absolute inset-x-4 bottom-4 text-white">
                    <span className="block text-[1.1rem] font-medium leading-tight tracking-tight">{p.name}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-xs text-white/80"><MapPin size={12} aria-hidden="true" /> {p.location}</span>
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* closing: enquire, or go on to the next project */}
      <div className="container-x pb-24">
        <motion.div {...rise} className="hero-sky relative overflow-hidden rounded-[32px] px-7 py-14 sm:px-12 sm:py-20 lg:rounded-[44px]">
          <span className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-white/55 blur-3xl" style={{ animation: 'drift 16s ease-in-out infinite' }} aria-hidden="true" />
          <span className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-[#ffd9bd]/70 blur-3xl" style={{ animation: 'drift 20s ease-in-out -8s infinite reverse' }} aria-hidden="true" />
          <div className="relative grid items-end gap-10 md:grid-cols-2">
            <div>
              <h2 className="display text-[clamp(2.2rem,5vw,4.6rem)] !leading-[1.02]">Imagine it on <span className="accent-word">your plot.</span></h2>
              <p className="mt-5 max-w-md text-ink-2">Tell us about your plot and your plans, and we will explore what is possible together.</p>
              <ul className="mt-5 space-y-2 text-[0.95rem]">
                {['Free consultation with a senior architect', 'Fixed-cost estimate, no hidden costs'].map((t) => (
                  <li key={t} className="flex items-center gap-2.5"><span className="grid h-5 w-5 place-items-center rounded-full bg-olive text-white"><Check size={12} strokeWidth={2.6} /></span>{t}</li>
                ))}
              </ul>
              <button onClick={enquire} className="btn-primary mt-8">
                Start an enquiry <ArrowUpRight size={16} strokeWidth={1.5} />
              </button>
            </div>
            <button onClick={() => onOpen(next.slug)} className="group rounded-[28px] bg-white/70 p-6 text-left backdrop-blur-xl transition-colors hover:bg-white md:justify-self-end" aria-label={`Next project: ${next.name}`}>
              <span className="eyebrow text-ink-2">Next project</span>
              <span className="mt-3 flex items-center gap-4 text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium tracking-tight">
                {next.name}
                <ArrowRight className="shrink-0 transition-transform duration-500 group-hover:translate-x-2" strokeWidth={1.4} />
              </span>
              <span className="mt-1 flex items-center gap-1.5 text-sm text-ink-2"><Home size={14} aria-hidden="true" /> {next.category} · {next.location}</span>
            </button>
          </div>
        </motion.div>
      </div>

      {zoom && (
        <motion.div className="fixed inset-0 z-[80] grid place-items-center bg-graphite/95 p-4" role="dialog" aria-modal="true" aria-label="Image viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setZoom(false)}>
          <button className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-white/30 text-ivory" aria-label="Close image" onClick={() => setZoom(false)}>
            <X size={18} strokeWidth={1.4} />
          </button>
          <motion.div className="relative aspect-[16/9] w-full max-w-[1400px]" initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease }} onClick={(e) => e.stopPropagation()}>
            <Still id={project.gallery[0]} className="h-full w-full !rounded-[20px]" />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
