import { useLayoutEffect, useRef, type PointerEvent } from 'react'
import { ArrowDown, Check, ShieldCheck } from 'lucide-react'
import Magnetic from '../components/Magnetic'
import AboutJourney from '../sections/AboutJourney'
import WhyChoose from '../sections/WhyChoose'
import Still from '../components/Still'
import SectionHead from '../components/SectionHead'
import { MaskReveal, Reveal, RevealWords, Stagger } from '../components/Reveal'
import { aboutIntro, consultation, mvv, siteVisit, stats, timeline, trust, whyChoose } from '../data/prasath'
import { galleryIds } from '../data/media'
import { gsap, scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'
import { useFinePointer, usePrefersReducedMotion } from '../hooks/useEnv'

/** The About page: story, mission, journey, why owners trust us, and how to start. */
export default function AboutPage() {
  const root = useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      // the opening: the photograph settles, then words, pills and the seal arrive in turn
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 })
      tl.from('[data-film]', { scale: 1.2, opacity: 0, duration: 2.4, ease: 'power3.out' }, 0)
        .from('[data-c]', { y: 34, opacity: 0, duration: 1.2, stagger: 0.12 }, 0.5)
        .from('[data-tag]', { y: 30, scale: 0.6, opacity: 0, duration: 1, stagger: 0.18, ease: 'back.out(1.8)' }, 1.1)
        .from('[data-seal]', { scale: 0, rotate: -90, opacity: 0, duration: 1.5, ease: 'back.out(1.4)' }, 1.3)
      // leaving the hero: the picture pushes in and the words drift away
      const st = { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('[data-film-scroll]', { scale: 1.12, yPercent: 6, ease: 'none', scrollTrigger: st })
      gsap.to('[data-words]', { yPercent: -14, opacity: 0.2, ease: 'none', scrollTrigger: st })
      // mouse depth
      const hero = root.current?.querySelector<HTMLElement>('[data-hero]')
      if (hero && fine) {
        const layers: [string, number, number][] = [['[data-par="film"]', -18, -12], ['[data-par="tags"]', -34, -22], ['[data-par="seal"]', 24, 16]]
        const q = layers.map(([sel, dx, dy]) => ({ x: gsap.quickTo(sel, 'x', { duration: 1.1, ease: 'power3.out' }), y: gsap.quickTo(sel, 'y', { duration: 1.1, ease: 'power3.out' }), dx, dy }))
        hero.addEventListener('pointermove', (e) => {
          const r = hero.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width - 0.5
          const py = (e.clientY - r.top) / r.height - 0.5
          q.forEach((l) => { l.x(px * l.dx); l.y(py * l.dy) })
        })
        hero.addEventListener('pointerleave', () => q.forEach((l) => { l.x(0); l.y(0) }))
      }
      const line = root.current?.querySelector('[data-line]')
      if (line) gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-timeline]', start: 'top 65%', end: 'bottom 60%', scrub: 0.5 } })
      gsap.utils.toArray<HTMLElement>('[data-year]').forEach((el, i) => {
        gsap.from(el, { x: i % 2 ? 80 : -80, opacity: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' } })
      })
    }, root)
    return () => ctx.revert()
  }, [reduced, fine])

  const move = (e: PointerEvent<HTMLElement>) => {
    if (!fine || reduced) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`)
  }

  return (
    <div ref={root}>
      <section id="about-hero" data-hero className="bg-ivory p-2 text-white sm:p-3 lg:p-4" aria-labelledby="about-page-title">
        <div className="relative overflow-hidden rounded-[30px] bg-graphite lg:min-h-[min(640px,80svh)] lg:rounded-[44px]">
          {/* the picture */}
          <div data-film data-film-scroll className="absolute inset-0">
            <div data-par="film" className="absolute -inset-6">
              <div className="h-full w-full" style={{ animation: reduced ? undefined : 'kenburns 28s ease-in-out infinite alternate' }}>
                <Still id="p-about" className="h-full w-full !rounded-none" focus="50% 45%" priority />
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/90 via-white/45 to-transparent" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(15,18,24,0.9)_0%,rgba(15,18,24,0.62)_55%,rgba(15,18,24,0.25)_85%)]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(15,18,24,0.5),transparent_60%)]" aria-hidden="true" />
          <span className="pointer-events-none absolute -left-24 bottom-16 h-80 w-80 rounded-full bg-[#4450e0]/30 blur-[90px]" style={{ animation: 'drift 18s ease-in-out infinite' }} aria-hidden="true" />
          <span className="pointer-events-none absolute -right-10 top-1/3 h-72 w-72 rounded-full bg-[#f0c9ae]/30 blur-[90px]" style={{ animation: 'drift 22s ease-in-out -9s infinite reverse' }} aria-hidden="true" />

          {/* floating facts + rotating seal (desktop) */}
          <div data-par="tags" className="pointer-events-none absolute inset-0 z-[5] hidden min-[1440px]:block" aria-hidden="true">
            {[{ v: '2014', l: 'Founded', pos: 'right-[6%] top-[270px]', d: '0s' }, { v: '320+', l: 'Homes delivered', pos: 'right-[13%] top-[380px]', d: '-1.6s' }, { v: '4.9★', l: 'Owner rating', pos: 'right-[6%] top-[490px]', d: '-3s' }].map((t) => (
              <div key={t.l} data-tag className={`absolute ${t.pos}`}>
                <span className="flex items-center gap-3 rounded-full border border-white/30 bg-white/15 py-2 pl-5 pr-6 backdrop-blur-md" style={{ animation: `bob 6s ease-in-out ${t.d} infinite` }}>
                  <span className="text-[1.5rem] font-semibold leading-none tracking-tight">{t.v}</span>
                  <span className="text-sm font-medium text-white/85">{t.l}</span>
                </span>
              </div>
            ))}
          </div>
          <div data-par="seal" className="absolute right-[5%] top-[104px] z-[5] hidden min-[1440px]:block">
            <button data-seal onClick={() => scrollToId('about-mvv')} className="group relative grid h-32 w-32 place-items-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md transition-transform duration-500 hover:scale-105" aria-label="Read our story">
              <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" style={{ animation: reduced ? undefined : 'spinSlow 22s linear infinite' }} aria-hidden="true">
                <defs><path id="about-seal" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" /></defs>
                <text fontSize="9.4" fontWeight="600" letterSpacing="2.4" fill="#fff"><textPath href="#about-seal">OUR STORY • SINCE 2014 • OUR STORY • SINCE 2014 • </textPath></text>
              </svg>
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-graphite transition-transform duration-500 group-hover:rotate-45"><ArrowDown size={18} strokeWidth={1.8} className="-rotate-[135deg]" /></span>
            </button>
          </div>

          {/* words */}
          <div className="relative z-10 flex min-h-[inherit] flex-col justify-start px-5 pb-16 pt-28 sm:px-9 lg:px-[clamp(28px,4.5vw,72px)] lg:pb-20 lg:pt-28">
            <div data-words className="max-w-[56rem]">
              <nav data-c aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/70">
                <a href="/" className="link-line hover:text-white">Home</a>
                <span aria-hidden="true">/</span>
                <span className="text-white">About</span>
              </nav>
              <span data-c className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-[0.8rem] font-medium backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8fb3ea]" style={{ animation: 'pulseDot 2s ease-out infinite' }} />
                About us
              </span>
              <h1 id="about-page-title" className="hero-dark display mt-5 text-[clamp(2.3rem,5vw,5rem)] !leading-[0.98]" aria-label={aboutIntro.heroTitle}>
                <RevealWords as="span" lines={['Architects, engineers', '& craftspeople building', 'Tamilnadu’s most-loved homes.']} italic={['most-loved']} delay={0.4} stagger={0.07} />
              </h1>
              <p data-c className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/80">{aboutIntro.heroText}</p>
              <ul data-c className="mt-6 flex flex-wrap gap-2.5">
                {aboutIntro.pillars.map((p) => (
                  <li key={p} className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-sm font-medium backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8fb3ea]" />
                    {p}
                  </li>
                ))}
              </ul>
              <div data-c className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic as="button" onClick={() => scrollToId('contact')} className="btn-primary on-dark">Book a Consultation</Magnetic>
                <Magnetic as="button" onClick={() => scrollToId('projects')} className="btn-ghost on-dark text-white">See our projects</Magnetic>
              </div>
              <ul data-c className="mt-7 flex flex-wrap gap-2.5 min-[1440px]:hidden" aria-label="Key numbers">
                {[{ v: '2014', l: 'Founded' }, { v: '320+', l: 'Homes delivered' }, { v: '4.9★', l: 'Owner rating' }].map((f) => (
                  <li key={f.l} className="flex items-center gap-2.5 rounded-full border border-white/30 bg-white/15 py-1.5 pl-4 pr-5 backdrop-blur-md">
                    <span className="text-[1.15rem] font-semibold leading-none tracking-tight">{f.v}</span>
                    <span className="text-[0.8rem] font-medium text-white/85">{f.l}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="about-mvv" className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby="about-mvv-title">
        <div className="container-x">
          <SectionHead id="about-mvv-title" chip={aboutIntro.chip} lines={aboutIntro.lines} accent={['home.']} text={aboutIntro.text} />
          <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8" gap={0.14}>
            {mvv.map((m, i) => (
              <article key={m.title} onPointerMove={move} className="card card-hover group relative overflow-hidden !rounded-[32px] p-3 last:md:col-span-2 last:lg:col-span-1">
                <span className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(360px circle at var(--gx,50%) var(--gy,50%), rgba(143,179,234,0.28), transparent 60%)' }} aria-hidden="true" />
                <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                  <Still id={m.image} className="h-full w-full !rounded-none transition-transform duration-[1500ms] ease-[var(--ease-expo)] group-hover:scale-[1.07]" />
                  <span className="chip absolute left-4 top-4">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="p-6">
                  <p className="eyebrow text-olive">{m.tag}</p>
                  <h3 className="mt-2 text-[1.5rem] font-medium tracking-tight">{m.title}</h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-2">{m.text}</p>
                </div>
              </article>
            ))}
          </Stagger>
        </div>
      </section>

      <AboutJourney />

      <WhyChoose id="about-why" />

      <section id="about-trust" className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby="about-trust-title">
        <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <MaskReveal className="relative aspect-[4/5] overflow-hidden rounded-[36px] shadow-[0_40px_90px_-45px_rgba(40,60,110,0.65)]" from="left">
              <Still id="p-completed-3" className="h-full w-full !rounded-none" />
            </MaskReveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal>
              <span className="chip">{trust.chip}</span>
            </Reveal>
            <h2 id="about-trust-title" className="display mt-5 text-[clamp(2.2rem,4.4vw,4.2rem)] !leading-[1.02]">
              {trust.lines[0]} <span className="accent-word">{trust.lines[1]}</span>
            </h2>
            <Reveal className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-ink-2" delay={0.1}>{trust.text}</Reveal>
            <Reveal className="mt-7 flex flex-wrap gap-2.5" delay={0.15}>
              {trust.badges.map((b) => (
                <span key={b} className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium shadow-[0_12px_30px_-20px_rgba(40,60,110,0.6)] backdrop-blur">
                  <ShieldCheck size={16} strokeWidth={1.8} className="text-olive" />
                  {b}
                </span>
              ))}
            </Reveal>
            <Stagger className="mt-9 grid grid-cols-2 gap-4" gap={0.1}>
              {stats.map((s) => (
                <div key={s.label} className="card !rounded-[24px] p-5">
                  <p className="text-[2rem] font-semibold leading-none tracking-tight">{s.value}<span className="accent-word">{s.suffix}</span></p>
                  <p className="mt-2 text-sm font-medium">{s.label}</p>
                  <p className="text-xs text-ink-2">{s.note}</p>
                </div>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <section id="about-visit" className="relative py-[clamp(30px,4.5vh,56px)] text-graphite" aria-labelledby="about-visit-title">
        <div className="container-x">
          <Reveal y={60}>
            <div className="card grid items-center gap-8 !rounded-[32px] p-7 sm:p-10 lg:grid-cols-2 lg:!rounded-[44px] lg:p-14">
              <div>
                <span className="chip">{siteVisit.chip}</span>
                <h2 id="about-visit-title" className="display mt-5 text-[clamp(1.9rem,3.6vw,3.2rem)] !leading-[1.05]">{siteVisit.title}</h2>
                <p className="mt-4 max-w-md text-ink-2">{siteVisit.text}</p>
                <div className="mt-7">
                  <Magnetic as="button" onClick={() => { setEnquiryPrefill('House Construction'); scrollToId('contact') }} className="btn-primary">{siteVisit.cta}</Magnetic>
                </div>
              </div>
              <ul className="space-y-3">
                {siteVisit.points.map((p) => (
                  <li key={p} className="flex items-center gap-4 rounded-2xl bg-white/80 p-4 text-[1.02rem] font-medium">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-olive/12 text-olive"><Check size={16} strokeWidth={2.4} /></span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="about-gallery" className="relative py-[clamp(36px,5vh,64px)] text-graphite" aria-labelledby="about-gallery-title">
        <div className="container-x">
          <SectionHead id="about-gallery-title" chip="Gallery" lines={['Every site', 'tells a story.']} accent={['story.']} text="Foundations, framing, finishing and handover — a real look at how we build, straight from our sites across Tamilnadu." />
          <Stagger className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-5" gap={0.07}>
            {galleryIds.slice(0, 8).map((id) => (
              <a key={id} href="/gallery" className="group relative aspect-square overflow-hidden rounded-[24px] shadow-[0_24px_60px_-40px_rgba(40,60,110,0.6)]">
                <Still id={id} className="h-full w-full !rounded-none transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.1]" />
              </a>
            ))}
          </Stagger>
          <Reveal className="mt-10 text-center">
            <a href="/gallery" className="btn-primary">View Full Gallery</a>
          </Reveal>
        </div>
      </section>

      <section id="about-cta" className="relative pb-[clamp(36px,5vh,64px)] pt-6 text-graphite" aria-labelledby="about-cta-title">
        <div className="container-x">
          <Reveal y={70}>
            <div className="hero-sky relative overflow-hidden rounded-[32px] px-7 py-14 sm:px-12 sm:py-20 lg:rounded-[44px]">
              <span className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-white/55 blur-3xl" style={{ animation: 'drift 16s ease-in-out infinite' }} aria-hidden="true" />
              <span className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-[#ffd9bd]/70 blur-3xl" style={{ animation: 'drift 20s ease-in-out -8s infinite reverse' }} aria-hidden="true" />
              <div className="relative grid items-center gap-10 lg:grid-cols-2">
                <div>
                  <span className="chip">{consultation.chip}</span>
                  <h2 id="about-cta-title" className="display mt-5 text-[clamp(2rem,4vw,3.6rem)] !leading-[1.04]">
                    Your dream home is <span className="accent-word">just one conversation away.</span>
                  </h2>
                  <p className="mt-4 max-w-md text-ink-2">{consultation.text}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Magnetic as="button" onClick={() => scrollToId('contact')} className="btn-primary">{consultation.cta}</Magnetic>
                    <Magnetic as="button" onClick={() => scrollToId('packages')} className="btn-ghost">View Packages</Magnetic>
                  </div>
                </div>
                <div className="rounded-[28px] bg-white/75 p-6 backdrop-blur-xl sm:p-8">
                  <p className="text-[1.15rem] font-medium tracking-tight">{consultation.card}</p>
                  <ul className="mt-5 space-y-3">
                    {consultation.points.map((p) => (
                      <li key={p} className="flex items-center gap-3 text-[0.98rem]">
                        <span className="grid h-6 w-6 place-items-center rounded-full bg-olive text-white"><Check size={13} strokeWidth={2.6} /></span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
