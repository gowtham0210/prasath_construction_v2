import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, MapPin, Ruler } from 'lucide-react'
import Magnetic from '../components/Magnetic'
import ProcessBuild from '../sections/ProcessBuild'
import PageHero from '../components/PageHero'
import SectionHead from '../components/SectionHead'
import Still from '../components/Still'
import Stats from '../sections/Stats'
import { Reveal, Stagger } from '../components/Reveal'
import { projectFilters, projects } from '../data/projects'
import { consultation, trust } from '../data/prasath'
import { journey } from '../data/journey'
import { scrollToId } from '../lib/smooth'

type Filter = (typeof projectFilters)[number]

/** The Projects page: every project with Completed / Ongoing / Upcoming filters, the numbers, the process and why owners trust us. */
export default function ProjectsPage() {
  const [filter, setFilter] = useState<Filter>('All Projects')
  const list = useMemo(() => (filter === 'All Projects' ? projects : projects.filter((p) => p.category === filter)), [filter])

  return (
    <div>
      <PageHero
        id="projects-hero"
        crumb="Projects"
        chip="Our projects"
        lines={['Spaces we’ve built.', 'Stories we’ve shaped.']}
        accent={['shaped.']}
        text="A growing portfolio of architect-led homes — each one delivered on time, on budget, and with measurable owner happiness."
        image="p-completed-3"
        focus="50% 40%"
        pills={['Completed', 'Ongoing', 'Upcoming']}
        facts={[{ v: '320+', l: 'Completed' }, { v: '42+', l: 'Ongoing' }, { v: '18+', l: 'Upcoming' }]}
        seal="Our projects • Built to last •"
        sealTo="projects-grid"
        actions={<><Magnetic as="button" onClick={() => scrollToId('contact')} className="btn-primary on-dark">Book a Consultation</Magnetic><Magnetic as="button" onClick={() => scrollToId('packages')} className="btn-ghost on-dark text-white">View Packages</Magnetic></>}
      />

      <section id="projects-grid" className="relative py-[clamp(30px,4.5vh,56px)] text-graphite" aria-label="All projects">
        <div className="container-x">
          <div role="tablist" aria-label="Filter projects" className="no-scrollbar flex gap-2 overflow-x-auto pb-2 md:justify-center">
            {projectFilters.map((f) => (
              <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-500 ${filter === f ? 'bg-graphite text-white shadow-[0_12px_30px_-12px_rgba(15,18,24,0.6)]' : 'bg-white/70 text-graphite/65 hover:bg-white hover:text-graphite'}`}>
                {f}
              </button>
            ))}
          </div>

          <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8" aria-live="polite">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <motion.a
                  key={p.slug}
                  layout
                  href={`#/project/${p.slug}`}
                  initial={{ opacity: 0, y: 50, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.8, delay: Math.min(i, 5) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="card card-hover group block overflow-hidden !rounded-[32px] p-3"
                  aria-label={`${p.name}, ${p.location} — ${p.category}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[24px]">
                    <Still id={p.cover} className="h-full w-full !rounded-none transition-transform duration-[1500ms] ease-[var(--ease-expo)] group-hover:scale-[1.07]" />
                    <span className="chip absolute left-4 top-4">{p.category}</span>
                    <span className="absolute bottom-3 right-3 grid h-11 w-11 place-items-center rounded-full bg-graphite text-white transition-all duration-500 group-hover:rotate-45 group-hover:bg-olive">
                      <ArrowUpRight size={18} strokeWidth={1.7} />
                    </span>
                  </div>
                  <div className="p-5">
                    <h2 className="text-[1.35rem] font-medium tracking-tight">{p.name}</h2>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-graphite/60"><MapPin size={14} strokeWidth={1.7} />{p.location}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-graphite/70">
                      <span className="rounded-full bg-graphite/5 px-3 py-1.5">{p.concept.split(' residence')[0]}</span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-graphite/5 px-3 py-1.5"><Ruler size={12} strokeWidth={1.8} />{p.builtUp.replace(' built-up', '')}</span>
                    </div>
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <Stats id="projects-stats" />

      <ProcessBuild id="projects-process" />

      <section id="projects-trust" className="relative py-[clamp(30px,4.5vh,56px)] text-graphite" aria-labelledby="projects-trust-title">
        <div className="container-x">
          <Reveal y={60}>
            <div className="hero-sky relative overflow-hidden rounded-[32px] px-7 py-14 text-center sm:px-12 sm:py-20 lg:rounded-[44px]">
              <div className="relative">
                <span className="chip">{trust.chip}</span>
                <h2 id="projects-trust-title" className="display mx-auto mt-5 max-w-3xl text-[clamp(2rem,4.4vw,4rem)] !leading-[1.04]">
                  {trust.lines[0]} <span className="accent-word">{trust.lines[1]}</span>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-graphite/65">{trust.text}</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2.5">
                  {trust.badges.map((b) => <span key={b} className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium backdrop-blur">{b}</span>)}
                </div>
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
