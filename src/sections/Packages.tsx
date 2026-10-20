import { Check, X } from 'lucide-react'
import Magnetic from '../components/Magnetic'
import SectionHead from '../components/SectionHead'
import { Reveal, Stagger } from '../components/Reveal'
import { packages, packagesCommon, packagesIntro, packagesNotIncluded } from '../data/prasath'
import PackageCompare from '../components/PackageCompare'
import CostEstimator from '../components/CostEstimator'
import { scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'

/** Fixed-cost construction packages, priced per sq.ft of built-up area. `more` adds a link to the Packages page. */
export default function Packages({ more = false, compare = false, id = 'packages' }: { more?: boolean; compare?: boolean; id?: string }) {
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
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{p.text}</p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="text-xl font-medium text-ink-2">₹</span>
                <span className="text-[3.2rem] font-semibold leading-none tracking-tight">{p.price}</span>
                <span className="text-sm text-ink-2">/ sq.ft</span>
              </p>
              <p className="mt-1 text-xs text-ink-2">All-inclusive on built-up area</p>
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
                <Magnetic as="button" onClick={() => { setEnquiryPrefill('House Construction'); scrollToId('contact') }} className={`whitespace-nowrap ${p.popular ? 'btn-primary' : 'btn-ghost'}`}>
                  {p.cta}
                </Magnetic>
              </div>
            </article>
          ))}
        </Stagger>

        <Reveal className="mx-auto mt-10 max-w-6xl">
          <div className="card flex flex-col gap-4 !rounded-[28px] p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-7">
            <p className="eyebrow shrink-0 text-olive">In every package</p>
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {packagesCommon.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-[0.95rem] font-medium">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-olive/12 text-olive"><Check size={12} strokeWidth={2.4} /></span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          {packagesNotIncluded.length > 0 && (
            <div className="mt-4 rounded-[28px] border border-graphite/10 bg-white/70 p-6 sm:p-7">
              <p className="eyebrow text-ink-2">Not included</p>
              <ul className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
                {packagesNotIncluded.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[0.95rem] text-graphite/80"><X size={14} strokeWidth={2.2} className="text-ink-3" />{f}</li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>

        {compare && (
          <>
            <PackageCompare />
            <CostEstimator />
          </>
        )}
        {more && (
          <Reveal className="mt-12 text-center">
            <a href="/packages" className="btn-primary">View Packages</a>
          </Reveal>
        )}
      </div>
    </section>
  )
}
