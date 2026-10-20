import { ArrowUpRight, Check } from 'lucide-react'
import Magnetic from '../components/Magnetic'
import PageHero from '../components/PageHero'
import Still from '../components/Still'
import SectionHead from '../components/SectionHead'
import ProcessBuild from '../sections/ProcessBuild'
import { Reveal, Stagger } from '../components/Reveal'
import { services } from '../data/services'
import { consultation } from '../data/prasath'
import { scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'

/** One page per service: what it covers, the process behind it, the other services, and a way to enquire about it. */
export default function ServiceDetailPage({ slug }: { slug: string }) {
  const s = services.find((x) => x.id === slug)
  if (!s) return null
  const others = services.filter((x) => x.id !== s.id)
  const enquire = () => {
    setEnquiryPrefill(s.enquiryType)
    scrollToId('contact')
  }

  return (
    <div>
      <PageHero
        id="svc-detail-hero"
        crumb={s.title}
        chip={`Service ${s.number}`}
        lines={[s.headline]}
        text={s.summary}
        image={s.image}
        focus="50% 50%"
        pills={s.points.slice(0, 3)}
        seal={`${s.title} • Prasanth Construction •`}
        sealTo="svc-detail"
        actions={<><Magnetic as="button" onClick={enquire} className="btn-primary on-dark">Enquire about {s.title}</Magnetic><Magnetic as="a" href="/services" className="btn-ghost on-dark text-white">All services</Magnetic></>}
      />

      <section id="svc-detail" className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby="svc-detail-title">
        <div className="container-x">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal y={70} className="lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] shadow-[0_40px_90px_-50px_rgba(40,60,110,0.7)] lg:rounded-[40px]">
                <Still id={s.image} className="h-full w-full !rounded-none" />
                <span className="chip absolute left-5 top-5">{s.number}</span>
              </div>
            </Reveal>
            <div className="lg:col-span-6">
              <Reveal><span className="chip">What is included</span></Reveal>
              <Reveal delay={0.05}>
                <h2 id="svc-detail-title" className="display mt-5 text-[clamp(1.9rem,3.4vw,3rem)] !leading-[1.05]">{s.title}, <span className="accent-word">done properly.</span></h2>
              </Reveal>
              <Reveal delay={0.1} className="mt-4 text-[1.02rem] leading-relaxed text-ink-2">{s.summary}</Reveal>
              <Stagger as="ul" className="mt-7 space-y-3" gap={0.08}>
                {s.points.map((p) => (
                  <li key={p} className="card flex items-center gap-4 !rounded-2xl p-4 text-[1.02rem] font-medium">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-olive/12 text-olive"><Check size={16} strokeWidth={2.4} /></span>
                    {p}
                  </li>
                ))}
              </Stagger>
              <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Magnetic as="button" onClick={enquire} className="btn-primary">Get a quote</Magnetic>
                <a href="/packages" className="link-line font-medium">See package prices</a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <ProcessBuild id="svc-process" />

      <section id="svc-others" className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby="svc-others-title">
        <div className="container-x">
          <SectionHead id="svc-others-title" chip="More from us" lines={['Our other', 'services.']} accent={['services.']} />
          <Stagger as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" gap={0.09}>
            {others.map((o) => (
              <li key={o.id}>
                <a href={`/services/${o.id}`} className="card card-hover group flex h-full flex-col p-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
                    <Still id={o.image} className="h-full w-full !rounded-none transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.07]" />
                  </div>
                  <div className="flex flex-1 items-center justify-between gap-3 p-4">
                    <span className="text-[1.1rem] font-medium tracking-tight">{o.title}</span>
                    <ArrowUpRight size={18} strokeWidth={1.6} className="shrink-0 transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" />
                  </div>
                </a>
              </li>
            ))}
          </Stagger>
        </div>
      </section>

      <section id="svc-detail-cta" className="relative pb-[clamp(36px,5vh,64px)] pt-6 text-graphite" aria-labelledby="svc-detail-cta-title">
        <div className="container-x">
          <Reveal y={70}>
            <div className="hero-sky relative overflow-hidden rounded-[32px] px-7 py-14 text-center sm:px-12 sm:py-20 lg:rounded-[44px]">
              <div className="relative">
                <span className="chip">{consultation.chip}</span>
                <h2 id="svc-detail-cta-title" className="display mx-auto mt-5 max-w-3xl text-[clamp(2rem,4.4vw,4rem)] !leading-[1.04]">
                  Talk to us about <span className="accent-word">{s.title.toLowerCase()}.</span>
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-ink-2">{consultation.text}</p>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <Magnetic as="button" onClick={enquire} className="btn-primary">{consultation.cta}</Magnetic>
                  <a href="/services" className="btn-ghost">All services</a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
