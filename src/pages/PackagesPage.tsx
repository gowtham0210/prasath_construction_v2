import Magnetic from '../components/Magnetic'
import ProcessBuild from '../sections/ProcessBuild'
import PageHero from '../components/PageHero'
import SectionHead from '../components/SectionHead'
import Packages from '../sections/Packages'
import { Reveal, Stagger } from '../components/Reveal'
import { journey } from '../data/journey'
import { consultation } from '../data/prasath'
import { scrollToId } from '../lib/smooth'

/** The Packages page: the three fixed-cost packages, the process behind them and a way to get a quote. */
export default function PackagesPage() {
  return (
    <div>
      <PageHero
        id="packages-hero"
        crumb="Packages"
        chip="Construction packages"
        lines={['Pick your package.', 'Lock the price.', 'Build with confidence.']}
        accent={['confidence.']}
        text="Every package is all-inclusive — design, approvals, materials, labor, and supervision. Send an enquiry and we'll share a personalised estimate within 24 hours."
        image="p-completed-1"
        focus="50% 40%"
        pills={['Fixed cost', 'All-inclusive', 'Upgrade anytime']}
        facts={[{ v: '₹1,899', l: 'Starting / sq.ft' }, { v: '3', l: 'Packages' }, { v: '24h', l: 'Estimate' }]}
        seal="Fixed-cost packages • Zero surprises •"
        sealTo="packages-list"
        actions={<><Magnetic as="button" onClick={() => scrollToId('contact')} className="btn-primary on-dark">Book a Consultation</Magnetic><Magnetic as="button" onClick={() => scrollToId('services')} className="btn-ghost on-dark text-white">Our services</Magnetic></>}
      />

      <Packages id="packages-list" />

      <ProcessBuild id="packages-process" />

      <section id="packages-cta" className="relative pb-[clamp(36px,5vh,64px)] pt-6 text-graphite" aria-labelledby="packages-cta-title">
        <div className="container-x">
          <Reveal y={70}>
            <div className="hero-sky relative overflow-hidden rounded-[32px] px-7 py-14 text-center sm:px-12 sm:py-20 lg:rounded-[44px]">
              <div className="relative">
                <span className="chip">{consultation.chip}</span>
                <h2 id="packages-cta-title" className="display mx-auto mt-5 max-w-3xl text-[clamp(2rem,4.4vw,4rem)] !leading-[1.04]">
                  Not sure which fits? <span className="accent-word">Let’s talk it through.</span>
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-graphite/65">{consultation.text}</p>
                <div className="mt-8">
                  <Magnetic as="button" onClick={() => scrollToId('contact')} className="btn-primary">{consultation.cta}</Magnetic>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
