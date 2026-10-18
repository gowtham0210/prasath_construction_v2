import { useMemo } from 'react'
import { Quote } from 'lucide-react'
import { sampleTestimonials, testimonials, type Testimonial } from '../data/testimonials'
import type { StillId } from '../data/media'
import Still from '../components/Still'
import SectionHead from '../components/SectionHead'
import { Reveal } from '../components/Reveal'
import { usePrefersReducedMotion } from '../hooks/useEnv'

type Item = { kind: 'photo'; id: StillId; label: string } | { kind: 'quote'; t: Testimonial; sample: boolean }

const photos: { id: StillId; label: string }[] = [
  { id: 'p-completed-3', label: 'Thendral Villa, Palacode' },
  { id: 'g-01', label: 'On site' },
  { id: 'p-completed-1', label: "Sanjay's House, Dharmapuri" },
  { id: 'g-07', label: 'Interior fit-out' },
  { id: 'p-completed-2', label: 'Kaveri Residency, Dharmapuri' },
  { id: 'g-06', label: 'Structure rising' },
  { id: 'p-ongoing-2', label: 'Pachai Illam, Pennagaram' },
  { id: 'g-08', label: 'Feature wall' },
  { id: 'p-ongoing-3', label: 'Surya Heights, Nallampalli' },
  { id: 'g-10', label: 'Site visit' },
  { id: 'p-ongoing-1', label: 'Senthil Towers, Harur' },
  { id: 'g-27', label: 'Foundation work' },
]

function Card({ item }: { item: Item }) {
  if (item.kind === 'photo') {
    return (
      <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[26px] shadow-[0_24px_60px_-40px_rgba(40,60,110,0.6)]">
        <Still id={item.id} className="h-full w-full !rounded-none" />
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/85 py-1.5 pl-3 pr-4 text-[0.7rem] font-medium backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-olive" />
          {item.label}
        </span>
      </div>
    )
  }
  const { t, sample } = item
  return (
    <figure className="card mb-5 !rounded-[26px] p-6">
      <Quote size={22} strokeWidth={1.6} className="text-olive" />
      <blockquote className="mt-4 text-[1.02rem] leading-relaxed tracking-tight">{t.quote}</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[#8fb3ea] to-olive text-sm font-semibold text-white">{t.name.charAt(0)}</span>
        <span className="text-sm leading-tight">
          <span className="block font-medium">{t.name}</span>
          <span className="block text-graphite/50">{sample ? 'Sample feedback' : t.detail}</span>
        </span>
      </figcaption>
    </figure>
  )
}

/** One column that scrolls by itself, forever, in the background — independent of the page scroll. */
function Column({ items, seconds, down, className = '' }: { items: Item[]; seconds: number; down?: boolean; className?: string }) {
  const reduced = usePrefersReducedMotion()
  return (
    <div className={`relative h-full overflow-hidden ${className}`} aria-hidden="true">
      <div style={reduced ? undefined : { animation: `${down ? 'colDown' : 'colUp'} ${seconds}s linear infinite`, willChange: 'transform' }}>
        {[...items, ...items].map((it, i) => (
          <Card key={i} item={it} />
        ))}
      </div>
    </div>
  )
}

export default function Testimonials() {
  const real = testimonials.length > 0
  const columns = useMemo(() => {
    const quotes: Item[] = (real ? testimonials : sampleTestimonials).map((t) => ({ kind: 'quote', t, sample: !real }))
    const pics: Item[] = photos.map((p) => ({ kind: 'photo', ...p }))
    // interleave photographs and feedback, then deal them out across three columns
    const mixed: Item[] = []
    pics.forEach((pic, i) => {
      mixed.push(pic)
      if (i % 2 === 1) mixed.push(quotes[(i >> 1) % quotes.length])
    })
    const cols: Item[][] = [[], [], []]
    mixed.forEach((m, i) => cols[i % 3].push(m))
    // rotate the middle column so neighbouring cards differ
    cols[1].push(cols[1].shift() as Item)
    return cols
  }, [real])

  return (
    <section id="testimonials" className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby="testimonials-title">
      <div className="container-x">
        <SectionHead
          className="mx-auto max-w-3xl text-center [&_p]:mx-auto"
          id="testimonials-title"
          chip="Hear from our owners"
          lines={['Loved by 1,240+', 'homeowners.']}
          accent={['homeowners.']}
          text="Real messages from real owners — straight from their chats with our team."
        />

        <Reveal y={80} className="relative mx-auto mt-14 max-w-6xl">
          {/* a screen-reader friendly version of what scrolls past */}
          <ul className="sr-only">
            {(real ? testimonials : sampleTestimonials).map((t) => (
              <li key={t.quote}>{t.quote}{real ? ` — ${t.name}` : ' (sample feedback)'}</li>
            ))}
          </ul>
          <div className="grid h-[640px] gap-5 [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)] sm:grid-cols-2 lg:h-[720px] lg:grid-cols-3 lg:gap-6">
            <Column items={columns[0]} seconds={52} />
            <Column items={columns[1]} seconds={64} down className="" />
            <Column items={columns[2]} seconds={58} className="hidden lg:block" />
          </div>
        </Reveal>
        {!real && (
          <p className="mt-6 text-center text-xs text-graphite/45">Sample feedback is shown here as a preview — it is replaced by real client words, with their permission, once available.</p>
        )}
      </div>
    </section>
  )
}
