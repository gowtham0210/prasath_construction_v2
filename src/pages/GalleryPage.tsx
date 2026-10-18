import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import Magnetic from '../components/Magnetic'
import PageHero from '../components/PageHero'
import { Reveal } from '../components/Reveal'
import { galleryIds, GALLERY_RATIOS, STILLS } from '../data/media'
import { consultation } from '../data/prasath'
import { gsap, scrollToId, startScroll, stopScroll } from '../lib/smooth'
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useEnv'

/** The Gallery page: every site photograph in a flowing grid with a full-screen viewer. */
export default function GalleryPage() {
  const root = useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const [open, setOpen] = useState<number | null>(null)

  const mobile = useIsMobile()
  const cols = mobile ? 2 : 4

  // deal the photographs out to the shortest column each time, so the columns end at nearly the same height
  const columns = useMemo(() => {
    const out: number[][] = Array.from({ length: cols }, () => [])
    const heights = new Array(cols).fill(0)
    galleryIds.forEach((_, i) => {
      const c = heights.indexOf(Math.min(...heights))
      out[c].push(i)
      heights[c] += 1 / GALLERY_RATIOS[i]
    })
    return out
  }, [cols])

  // each photograph opens when it really appears on screen (measured after the columns have moved)
  useEffect(() => {
    const tiles = Array.from(document.querySelectorAll<HTMLElement>('[data-tile]'))
    if (reduced || !('IntersectionObserver' in window)) {
      tiles.forEach((t) => t.classList.add('is-in'))
      return
    }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('is-in'), io.unobserve(e.target))), { rootMargin: '0px 0px -6% 0px' })
    tiles.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [reduced, cols])

  // four columns that travel at different speeds as you scroll, each photograph opening with a mask
  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const speeds = mobile ? [60, -60] : [90, -110, 60, -140]
      gsap.utils.toArray<HTMLElement>('[data-col]').forEach((col, i) => {
        gsap.fromTo(col, { y: speeds[i] }, { y: -speeds[i], ease: 'none', scrollTrigger: { trigger: '#gallery-grid', start: 'top bottom', end: 'bottom top', scrub: 0.8 } })
      })
    }, root)
    return () => ctx.revert()
  }, [reduced, mobile])

  // full-screen viewer: lock page scrolling, arrow keys and Escape
  useEffect(() => {
    if (open === null) return
    stopScroll()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null)
      if (e.key === 'ArrowRight') setOpen((o) => (o === null ? o : (o + 1) % galleryIds.length))
      if (e.key === 'ArrowLeft') setOpen((o) => (o === null ? o : (o - 1 + galleryIds.length) % galleryIds.length))
    }
    window.addEventListener('keydown', onKey)
    return () => {
      startScroll()
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const step = (d: number) => setOpen((o) => (o === null ? o : (o + d + galleryIds.length) % galleryIds.length))

  return (
    <div ref={root}>
      <PageHero
        id="gallery-hero"
        crumb="Gallery"
        chip="Gallery"
        lines={['Every site', 'tells a story.']}
        accent={['story.']}
        text="Foundations, framing, finishing and handover — a real look at how we build, straight from our sites across Tamilnadu."
        image="p-ongoing-3"
        focus="50% 45%"
        pills={['Foundations', 'Framing', 'Finishing', 'Handover']}
        facts={[{ v: '54', l: 'Site photographs' }, { v: '4', l: 'Stages shown' }, { v: 'Live', l: 'Real sites' }]}
        seal="Our gallery • Real sites •"
        sealTo="gallery-grid"
        actions={<><Magnetic as="button" onClick={() => scrollToId('contact')} className="btn-primary on-dark">Book a Consultation</Magnetic><Magnetic as="button" onClick={() => scrollToId('projects')} className="btn-ghost on-dark text-white">See the projects</Magnetic></>}
      />

      <section id="gallery-grid" className="relative overflow-hidden py-[clamp(30px,4.5vh,56px)] text-graphite" aria-label="Photographs">
        <div className="container-x">
          <div className="grid items-start gap-4 lg:gap-5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {columns.map((idxs, c) => (
              <div key={c} data-col className="flex flex-col gap-4 will-change-transform lg:gap-5">
                {idxs.map((i) => { const id = galleryIds[i]; return (
                  <button key={id} data-tile onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-[24px] shadow-[0_24px_60px_-40px_rgba(40,60,110,0.6)]" style={{ aspectRatio: GALLERY_RATIOS[i] }} aria-label={`Open photograph ${i + 1} of ${galleryIds.length}`}>
                    <img src={STILLS[id].image} alt={STILLS[id].alt} loading="lazy" decoding="async" className="block h-full w-full object-cover group-hover:!scale-[1.08]" />
                    <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="pointer-events-none absolute bottom-3 left-3 flex translate-y-3 items-center gap-2 rounded-full bg-white/90 py-1.5 pl-3 pr-4 text-xs font-medium opacity-0 backdrop-blur transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-olive" />
                      View {String(i + 1).padStart(2, '0')}
                    </span>
                  </button>
                ) })}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery-cta" className="relative pb-[clamp(36px,5vh,64px)] pt-6 text-graphite" aria-labelledby="gallery-cta-title">
        <div className="container-x">
          <Reveal y={70}>
            <div className="hero-sky relative overflow-hidden rounded-[32px] px-7 py-14 text-center sm:px-12 sm:py-20 lg:rounded-[44px]">
              <div className="relative">
                <span className="chip">{consultation.chip}</span>
                <h2 id="gallery-cta-title" className="display mx-auto mt-5 max-w-3xl text-[clamp(2rem,4.4vw,4rem)] !leading-[1.04]">
                  Your dream home is <span className="accent-word">just one conversation away.</span>
                </h2>
                <div className="mt-8">
                  <Magnetic as="button" onClick={() => scrollToId('contact')} className="btn-primary">{consultation.cta}</Magnetic>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <AnimatePresence>
        {open !== null && (
          <motion.div className="fixed inset-0 z-[80] grid place-items-center bg-graphite/92 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Photograph viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}>
            <button className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white hover:text-graphite" aria-label="Close" onClick={() => setOpen(null)}>
              <X size={18} strokeWidth={1.6} />
            </button>
            <button className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white hover:text-graphite" aria-label="Previous photograph" onClick={(e) => { e.stopPropagation(); step(-1) }}>
              <ArrowLeft size={18} strokeWidth={1.6} />
            </button>
            <button className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white hover:text-graphite" aria-label="Next photograph" onClick={(e) => { e.stopPropagation(); step(1) }}>
              <ArrowRight size={18} strokeWidth={1.6} />
            </button>
            <motion.img key={open} src={STILLS[galleryIds[open]].image} alt={STILLS[galleryIds[open]].alt} className="max-h-[86vh] max-w-[92vw] rounded-[20px] object-contain shadow-[0_40px_100px_-30px_rgba(0,0,0,0.8)]" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} onClick={(e) => e.stopPropagation()} />
            <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium text-white backdrop-blur">{open + 1} / {galleryIds.length}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
