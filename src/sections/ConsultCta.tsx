import QuickEnquiry from '../components/QuickEnquiry'
import Magnetic from '../components/Magnetic'
import { Reveal } from '../components/Reveal'
import { consultation } from '../data/prasath'
import { scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'

/** The one closing invitation on the home page: a free consultation (with the free site visit folded in), with buttons to Contact and Packages. */
export default function ConsultCta() {
  return (
    <section id="consult-cta" className="relative pb-[clamp(36px,5vh,64px)] pt-6 text-graphite" aria-labelledby="consult-cta-title">
      <div className="container-x">
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
                <p className="mt-4 max-w-md text-ink-2">{consultation.text}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Magnetic as="button" onClick={() => { setEnquiryPrefill('House Construction'); scrollToId('contact') }} className="btn-primary">{consultation.cta}</Magnetic>
                  <Magnetic as="button" onClick={() => scrollToId('packages')} className="btn-ghost">View Packages</Magnetic>
                </div>
              </div>
              <QuickEnquiry />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
