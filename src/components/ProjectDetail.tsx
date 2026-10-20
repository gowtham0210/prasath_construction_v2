import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react'
import { getProject, projects } from '../data/projects'
import Still from './Still'
import { company } from '../config/company'
import { scrollToId, startScroll, stopScroll } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'
import { LogoMark } from './Logo'

interface Props {
  slug: string
  onClose: (returnTo?: string) => void
  onOpen: (slug: string) => void
}

/** Immersive project page: hero, overview, specifications, gallery, process and an enquiry call to action. */
export default function ProjectDetail({ slug, onClose, onOpen }: Props) {
  const project = getProject(slug)
  const scroller = useRef<HTMLDivElement | null>(null)
  const [zoom, setZoom] = useState<number | null>(null)
  const next = useMemo(() => {
    const i = projects.findIndex((p) => p.slug === slug)
    return projects[(i + 1) % projects.length]
  }, [slug])

  // own scroll area: pause page scrolling underneath and restore it on close
  useEffect(() => {
    stopScroll()
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') (zoom !== null ? setZoom(null) : onClose('projects'))
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

  return (
    <motion.div
      className="fixed inset-0 z-[70] overflow-y-auto bg-ivory text-graphite outline-none"
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
      <header className="sticky top-0 z-20 flex items-center justify-between bg-ivory/85 px-[clamp(20px,4vw,64px)] py-4 backdrop-blur-md">
        <button onClick={() => onClose('projects')} className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em]" aria-label="Back to projects">
          <ArrowLeft size={16} strokeWidth={1.4} /> Projects
        </button>
        <span className="hidden items-center gap-3 md:inline-flex"><LogoMark className="h-5 w-5" /><span className="font-serif text-lg uppercase tracking-[0.2em]">{company.name}</span></span>
        <button onClick={() => onClose('projects')} className="grid h-10 w-10 place-items-center border border-graphite/25" aria-label="Close project">
          <X size={18} strokeWidth={1.4} />
        </button>
      </header>

      <div className="relative h-[72svh] min-h-[420px] w-full overflow-hidden bg-graphite">
        <motion.div className="absolute inset-0" initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}>
          <Still id={project.cover} className="h-full w-full" priority />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-graphite/80 via-graphite/10 to-transparent" />
        <div className="container-x absolute inset-x-0 bottom-0 pb-12 text-ivory">
          <p className="eyebrow text-bronze">{project.category} · {project.location}</p>
          <h1 className="display mt-4 text-[clamp(2.6rem,7vw,7rem)]">{project.name}</h1>
        </div>
      </div>

      <div className="container-x grid gap-16 py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow text-olive">Overview</p>
          <p className="mt-6 font-serif text-[clamp(1.5rem,2.4vw,2.2rem)] leading-snug">{project.concept}</p>
          <p className="mt-8 max-w-2xl text-ink-2">{project.overview}</p>
        </div>
        <aside className="lg:col-span-4 lg:col-start-9">
          <p className="eyebrow text-olive">Project details</p>
          <dl className="mt-6 divide-y divide-graphite/15 border-y border-graphite/15 text-sm">
            {[
              ['Project', project.name],
              ['Type', project.category],
              ['Location', project.location],
              ['Built-up area', project.builtUp],
              
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 py-4">
                <dt className="text-ink-2">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <div className="container-x pb-20">
        <p className="eyebrow text-olive">Gallery</p>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6">
          {project.gallery.map((g, i) => (
            <button
              key={g}
              onClick={() => setZoom(i)}
              className={`group relative overflow-hidden ${i === 0 ? 'col-span-2 aspect-[16/9] md:col-span-8' : i === 1 ? 'aspect-[4/5] md:col-span-4 md:aspect-auto' : 'aspect-[4/3] md:col-span-4'}`}
              aria-label={`View image ${i + 1} of ${project.gallery.length} full size`}
            >
              <Still id={g} className="h-full w-full transition-transform duration-[1200ms] ease-[var(--ease-expo)] group-hover:scale-[1.06]" />
            </button>
          ))}
        </div>
      </div>

      <div className="bg-sky-grad py-20 text-graphite">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-olive">Specifications</p>
            <dl className="mt-6 divide-y divide-graphite/10 border-y border-graphite/10 text-sm">
              {project.specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[8rem_1fr] gap-4 py-4">
                  <dt className="text-ink-2">{s.label}</dt>
                  <dd>{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="eyebrow text-olive">Construction process</p>
            <ol className="mt-6 space-y-6">
              {project.process.map((s, i) => (
                <li key={s} className="flex items-baseline gap-6 border-b border-graphite/10 pb-6">
                  <span className="font-serif text-3xl text-olive">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-lg">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-10 py-24 md:grid-cols-2 md:items-end">
        <div>
          <h2 className="display text-[clamp(2.2rem,5vw,4.6rem)]">Imagine it on <em className="text-olive">your plot.</em></h2>
          <p className="mt-5 max-w-md text-ink-2">Tell us about your plot and your plans, and we will explore what is possible together.</p>
          <button onClick={enquire} className="btn-primary mt-8">
            Start an enquiry <ArrowUpRight size={16} strokeWidth={1.5} />
          </button>
        </div>
        <button onClick={() => onOpen(next.slug)} className="group text-left md:justify-self-end" aria-label={`Next project: ${next.name}`}>
          <span className="eyebrow text-ink-2">Next project</span>
          <span className="mt-3 flex items-center gap-4 font-serif text-3xl md:text-4xl">
            {next.name}
            <ArrowRight className="transition-transform duration-500 group-hover:translate-x-2" strokeWidth={1.2} />
          </span>
        </button>
      </div>

      {zoom !== null && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-graphite/95 p-4" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={() => setZoom(null)}>
          <button className="absolute right-5 top-5 grid h-11 w-11 place-items-center border border-white/30 text-ivory" aria-label="Close image" onClick={() => setZoom(null)}>
            <X size={18} strokeWidth={1.4} />
          </button>
          <div className="relative aspect-[16/9] w-full max-w-[1400px]" onClick={(e) => e.stopPropagation()}>
            <Still id={project.gallery[zoom]} className="h-full w-full" />
          </div>
        </div>
      )}
    </motion.div>
  )
}
