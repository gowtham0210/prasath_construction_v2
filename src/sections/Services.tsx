import { ArrowUpRight } from 'lucide-react'
import { services } from '../data/services'
import Still from '../components/Still'
import SectionHead from '../components/SectionHead'
import { Reveal, Stagger } from '../components/Reveal'
import { scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'

export default function Services() {
  const explore = (type: string) => {
    setEnquiryPrefill(type)
    scrollToId('contact')
  }
  return (
    <section id="services" className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby="services-title">
      <div className="container-x">
        <SectionHead id="services-title" chip="Our services" lines={['Everything your home needs,', 'under one roof.']} accent={['roof.']} text="From land-ready plans to move-in-ready interiors — construction, design, and renovation, delivered by one accountable team." />
        {/* three across, then two wider cards: five services fill the grid with no empty slot */}
        <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-6 lg:gap-8">
          {services.map((s, i) => (
            <article key={s.id} className={`card card-hover group flex flex-col p-3 ${i >= 3 ? 'lg:col-span-3' : 'lg:col-span-2'} ${i === services.length - 1 && services.length % 2 === 1 ? 'md:col-span-2' : ''}`} aria-labelledby={`svc-${s.id}`}>
              <div className={`relative overflow-hidden rounded-[26px] ${i >= 3 ? 'aspect-[4/3] lg:aspect-[16/9]' : 'aspect-[4/3]'}`}>
                <Still id={s.image} className="h-full w-full !rounded-none transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.07]" />
                <span className="chip absolute left-4 top-4">{s.number}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 id={`svc-${s.id}`} className="text-[1.45rem] font-medium leading-tight tracking-tight">{s.title}</h3>
                <p className="mt-3 flex-1 text-[0.95rem] text-ink-2">{s.headline}</p>
                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <a href={`/services/${s.id}`} className="btn-ghost w-fit !py-2.5 group-hover:bg-graphite group-hover:text-white" aria-label={`Explore service: ${s.title}`}>
                    Explore <ArrowUpRight size={16} strokeWidth={1.6} />
                  </a>
                  <button onClick={() => explore(s.enquiryType)} className="link-line text-[0.95rem] font-medium" aria-label={`Get a quote for ${s.title}`}>
                    Get a quote
                  </button>
                </div>
              </div>
            </article>
          ))}
        </Stagger>
        <Reveal className="mt-12 text-center">
          <a href="/services" className="btn-primary">Explore all services</a>
        </Reveal>
      </div>
    </section>
  )
}
