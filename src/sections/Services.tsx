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
    <section id="services" className="relative py-[clamp(70px,11vh,140px)] text-graphite" aria-labelledby="services-title">
      <div className="container-x">
        <SectionHead id="services-title" chip="Our services" lines={['Everything your home needs,', 'under one roof.']} accent={['roof.']} text="From land-ready plans to move-in-ready interiors — construction, design, and renovation, delivered by one accountable team." />
        <Stagger className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {services.map((s) => (
            <article key={s.id} className="card card-hover group flex flex-col p-3" aria-labelledby={`svc-${s.id}`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[26px]">
                <Still id={s.image} className="h-full w-full !rounded-none transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.07]" />
                <span className="chip absolute left-4 top-4">{s.number}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 id={`svc-${s.id}`} className="text-[1.45rem] font-medium leading-tight tracking-tight">{s.title}</h3>
                <p className="mt-3 flex-1 text-[0.95rem] text-graphite/65">{s.headline}</p>
                <button onClick={() => explore(s.enquiryType)} className="btn-ghost mt-6 w-fit !py-2.5 group-hover:bg-graphite group-hover:text-white" aria-label={`Explore service: ${s.title}`}>
                  Explore <ArrowUpRight size={16} strokeWidth={1.6} />
                </button>
              </div>
            </article>
          ))}
        </Stagger>
        <Reveal className="mt-12 text-center">
          <a href="#/services" className="btn-primary">Explore all services</a>
        </Reveal>
      </div>
    </section>
  )
}
