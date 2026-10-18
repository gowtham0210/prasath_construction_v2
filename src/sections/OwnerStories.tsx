import { Play } from 'lucide-react'
import SectionHead from '../components/SectionHead'
import { Reveal, Stagger } from '../components/Reveal'
import { company } from '../config/company'
import { videos } from '../data/prasath'

/** Videos from the YouTube channel: real homes, real stories. */
export default function OwnerStories() {
  return (
    <section id="stories" className="relative py-[clamp(36px,5vh,64px)] text-graphite" aria-labelledby="stories-title">
      <div className="container-x">
        <SectionHead id="stories-title" chip="Hear from our owners" lines={['Real homes.', 'Real stories.']} accent={['stories.']} />
        <Stagger className="no-scrollbar -mx-[clamp(20px,4vw,56px)] mt-12 flex snap-x gap-5 overflow-x-auto px-[clamp(20px,4vw,56px)] pb-4" gap={0.08}>
          {videos.map((v) => (
            <a key={v.id} href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noreferrer" className="group relative w-[78vw] max-w-[22rem] shrink-0 snap-start overflow-hidden rounded-[28px] bg-white/80 shadow-[0_30px_70px_-45px_rgba(40,60,110,0.6)] transition-all duration-500 hover:-translate-y-2 sm:w-[22rem]" aria-label={`Watch on YouTube: ${v.title}`}>
              <div className="relative aspect-video overflow-hidden">
                <img src={`https://i.ytimg.com/vi/${v.id}/hq720.jpg`} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.08]" />
                <span className="absolute inset-0 grid place-items-center bg-black/10 transition-colors duration-500 group-hover:bg-black/25">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-graphite shadow-[0_14px_30px_-10px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-110">
                    <Play size={20} fill="currentColor" className="translate-x-0.5" />
                  </span>
                </span>
              </div>
              <p className="p-5 text-[1.02rem] font-medium leading-snug tracking-tight">{v.title}</p>
            </a>
          ))}
        </Stagger>
        {company.social.youtube && (
          <Reveal className="mt-8 text-center">
            <a href={company.social.youtube} target="_blank" rel="noreferrer" className="btn-primary">Subscribe on YouTube</a>
          </Reveal>
        )}
      </div>
    </section>
  )
}
