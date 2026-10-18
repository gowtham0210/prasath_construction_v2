import { Check } from 'lucide-react'
import Magnetic from '../components/Magnetic'
import SectionHead from '../components/SectionHead'
import { Reveal, Stagger } from '../components/Reveal'
import { packages, packagesIntro } from '../data/prasath'
import { scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'

/** Fixed-cost construction packages, priced per sq.ft of built-up area. `more` adds a link to the Packages page. */
export default function Packages({ more = false, id = 'packages' }: { more?: boolean; id?: string }) {
  return (
    <section id={id} className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby={`${id}-title`}>
      <div className="container-x">
        <SectionHead id={`${id}-title`} chip={packagesIntro.chip} lines={packagesIntro.lines} accent={['surprises.']} text={packagesIntro.text} />
        <Stagger className="mx-auto mt-14 grid max-w-6xl items-stretch gap-6 lg:grid-cols-3 lg:gap-8" gap={0.14}>
          {packages.map((p) => (
            <article key={p.name} className={`card card-hover relative flex flex-col p-8 ${p.popular ? 'ring-2 ring-olive/40 lg:-translate-y-4' : ''}`}>
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-olive px-4 py-1 text-xs font-semibold text-white shadow-[0_10px_24px_-8px_rgba(68,80,224,0.8)]">Most popular</span>}
              <p className="eyebrow text-olive">{p.tag}</p>
              <h3 className="mt-3 text-[1.6rem] font-medium tracking-tight">{p.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-graphite/60">{p.text}</p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="text-xl font-medium text-graphite/60">₹</span>
                <span className="text-[3.2rem] font-semibold leading-none tracking-tight">{p.price}</span>
                <span className="text-sm text-graphite/55">/ sq.ft</span>
              </p>
              <p className="mt-1 text-xs text-graphite/50">All-inclusive on built-up area</p>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[0.92rem] text-graphite/80">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-olive/12 text-olive">
                      <Check size={12} strokeWidth={2.4} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Magnetic as="button" onClick={() => { setEnquiryPrefill('House Construction'); scrollToId('contact') }} className={p.popular ? 'btn-primary' : 'btn-ghost'}>
                  {p.cta}
                </Magnetic>
              </div>
            </article>
          ))}
        </Stagger>
        {more && (
          <Reveal className="mt-12 text-center">
            <a href="#/packages" className="btn-primary">View Packages</a>
          </Reveal>
        )}
      </div>
    </section>
  )
}
