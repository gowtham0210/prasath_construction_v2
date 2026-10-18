import { Check } from 'lucide-react'
import Magnetic from '../components/Magnetic'
import { Reveal } from '../components/Reveal'
import { consultation, siteVisit } from '../data/prasath'
import { scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'

/** The closing invitation on the home page: a free site visit and a free consultation, each with a button to the Contact page. */
export default function ConsultCta() {
  return (
    <section id="consult-cta" className="relative pb-[clamp(60px,9vh,110px)] pt-6 text-graphite" aria-labelledby="consult-cta-title">
      <div className="container-x space-y-6">
        <Reveal y={60}>
          <div className="card grid items-center gap-8 !rounded-[32px] p-7 sm:p-10 lg:grid-cols-2 lg:!rounded-[44px] lg:p-14">
            <div>
              <span className="chip">{siteVisit.chip}</span>
              <h2 className="display mt-5 text-[clamp(1.9rem,3.6vw,3.2rem)] !leading-[1.05]">{siteVisit.title}</h2>
              <p className="mt-4 max-w-md text-graphite/65">{siteVisit.text}</p>
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

        <Reveal y={70}>
          <div className="hero-sky relative overflow-hidden rounded-[32px] px-7 py-14 sm:px-12 sm:py-20 lg:rounded-[44px]">
            <span className="pointer-events-none absolute -left-16 top-0 h-72 w-72 rounded-full bg-white/55 blur-3xl" style={{ animation: 'drift 16s ease-in-out infinite' }} aria-hidden="true" />
            <span className="pointer-events-none absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-[#ffd9bd]/70 blur-3xl" style={{ animation: 'drift 20s ease-in-out -8s infinite reverse' }} aria-hidden="true" />
            <div className="relative grid items-center gap-10 lg:grid-cols-2">
              <div>
                <span className="chip">{consultation.chip}</span>
                <h2 id="consult-cta-title" className="display mt-5 text-[clamp(2rem,4vw,3.6rem)] !leading-[1.04]">
                  Your dream home is <span className="accent-word">just one conversation away.</span>
                </h2>
                <p className="mt-4 max-w-md text-graphite/65">{consultation.text}</p>
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
  )
}
