import { useLayoutEffect, useRef } from 'react'
import { Check } from 'lucide-react'
import Magnetic from '../components/Magnetic'
import PageHero from '../components/PageHero'
import Still from '../components/Still'
import SectionHead from '../components/SectionHead'
import { MaskReveal, Reveal } from '../components/Reveal'
import { services } from '../data/services'
import { consultation } from '../data/prasath'
import { gsap, scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useEnv'

/** The Services page: every service in detail, with a way to start an enquiry for any of them. */
export default function ServicesPage() {
  const root = useRef<HTMLDivElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const mobile = useIsMobile()

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      if (!mobile) {
        gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((el) => {
          gsap.fromTo(el, { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
        })
      }
    }, root)
    return () => ctx.revert()
  }, [reduced, mobile])

  const enquire = (type: string) => {
    setEnquiryPrefill(type)
    scrollToId('contact')
  }

  return (
    <div ref={root}>
      <PageHero
        id="svc-hero"
        crumb="Services"
        chip="Our services"
        lines={['Everything your home needs,', 'under one roof.']}
        accent={['roof.']}
        text="From land-ready plans to move-in-ready interiors — construction, design, and renovation, delivered by one accountable team."
        image="p-interior"
        focus="50% 50%"
        pills={services.map((x) => x.title)}
        facts={[{ v: '5', l: 'Services' }, { v: '7', l: 'Build stages' }, { v: '10-year', l: 'Structural warranty' }]}
        seal="Our services • Under one roof •"
        sealTo="svc-list"
        actions={<><Magnetic as="button" onClick={() => scrollToId('contact')} className="btn-primary on-dark">Book a Consultation</Magnetic><Magnetic as="button" onClick={() => scrollToId('packages')} className="btn-ghost on-dark text-white">View Packages</Magnetic></>}
      />

      <section id="svc-list" className="relative py-[clamp(70px,11vh,140px)] text-graphite" aria-labelledby="svc-list-title">
        <div className="container-x">
          <SectionHead id="svc-list-title" chip="What we do" lines={['Five services,', 'one accountable team.']} accent={['team.']} text="Construction, design and renovation — each delivered on the same fixed-cost, milestone-driven process." />
          <div className="mt-16 space-y-8 lg:space-y-12">
            {services.map((s, i) => {
              const flip = i % 2 === 1
              return (
                <Reveal key={s.id} y={80}>
                  <article id={s.id} className="card group grid overflow-hidden !rounded-[32px] p-3 lg:grid-cols-12 lg:!rounded-[40px]" aria-labelledby={`svc-${s.id}`}>
                    <MaskReveal className={`relative aspect-[4/3] overflow-hidden rounded-[26px] lg:col-span-6 lg:aspect-auto lg:min-h-[26rem] ${flip ? 'lg:order-2' : ''}`} from={flip ? 'right' : 'left'}>
                      <div data-drift className="absolute -inset-[8%]">
                        <Still id={s.image} className="h-full w-full !rounded-none transition-transform duration-[1600ms] ease-[var(--ease-expo)] group-hover:scale-[1.05]" />
                      </div>
                      <span className="chip absolute left-4 top-4">{s.number}</span>
                    </MaskReveal>
                    <div className={`flex flex-col justify-center p-6 sm:p-9 lg:col-span-6 lg:p-12 ${flip ? 'lg:order-1' : ''}`}>
                      <p className="eyebrow text-olive">{s.title}</p>
                      <h2 id={`svc-${s.id}`} className="display mt-3 text-[clamp(1.6rem,2.8vw,2.4rem)] !leading-[1.08]">{s.headline}</h2>
                      <p className="mt-4 text-[0.98rem] leading-relaxed text-graphite/65">{s.summary}</p>
                      <ul className="mt-6 space-y-3">
                        {s.points.map((p) => (
                          <li key={p} className="flex items-start gap-3 text-[0.95rem] text-graphite/80">
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-olive/12 text-olive">
                              <Check size={12} strokeWidth={2.4} />
                            </span>
                            {p}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8">
                        <Magnetic as="button" onClick={() => enquire(s.enquiryType)} className="btn-primary">Enquire about {s.title}</Magnetic>
                      </div>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section id="svc-cta" className="relative pb-[clamp(60px,9vh,110px)] pt-6 text-graphite" aria-labelledby="svc-cta-title">
        <div className="container-x">
          <Reveal y={70}>
            <div className="hero-sky relative overflow-hidden rounded-[32px] px-7 py-14 text-center sm:px-12 sm:py-20 lg:rounded-[44px]">
              <span className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-white/55 blur-3xl" style={{ animation: 'drift 16s ease-in-out infinite' }} aria-hidden="true" />
              <span className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-[#ffd9bd]/70 blur-3xl" style={{ animation: 'drift 20s ease-in-out -8s infinite reverse' }} aria-hidden="true" />
              <div className="relative">
                <span className="chip">{consultation.chip}</span>
                <h2 id="svc-cta-title" className="display mx-auto mt-5 max-w-3xl text-[clamp(2.2rem,4.8vw,4.4rem)] !leading-[1.02]">
                  Your dream home is <span className="accent-word">just one conversation away.</span>
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-graphite/65">{consultation.text}</p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Magnetic as="button" onClick={() => scrollToId('contact')} className="btn-primary">{consultation.cta}</Magnetic>
                  <a href="#/about" className="btn-ghost">About us</a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
