import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react'
import { testimonials } from '../data/testimonials'
import SectionHead from '../components/SectionHead'
import { Reveal } from '../components/Reveal'

/**
 * Owner feedback as a swipeable row: big cards that snap into place as you swipe, drag the scroll bar, use the arrow buttons or the arrow keys.
 * A thin progress line shows how far along you are. Nothing moves until you move it.
 */
export default function Testimonials() {
  const rail = useRef<HTMLUListElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [edge, setEdge] = useState<'start' | 'mid' | 'end'>('start')

  const measure = useCallback(() => {
    const el = rail.current
    if (!el) return
    const cards = el.querySelectorAll('li')
    const box = el.getBoundingClientRect()
    const first = cards[0]?.getBoundingClientRect()
    const last = cards[cards.length - 1]?.getBoundingClientRect()
    // the row has reached an end when the first / last card is fully in view
    const atStart = !first || first.left >= box.left - 1
    const atEnd = !last || last.right <= box.right + 1
    const max = el.scrollWidth - el.clientWidth
    setProgress(max > 0 ? Math.min(1, el.scrollLeft / max) : 0)
    setEdge(atStart ? 'start' : atEnd ? 'end' : 'mid')
  }, [])

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  const step = (dir: 1 | -1) => {
    const el = rail.current
    const card = el?.querySelector('li')
    if (!el || !card) return
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 20), behavior: 'smooth' })
  }

  return (
    <section id="testimonials" className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby="testimonials-title">
      <div className="container-x">
        <SectionHead
          className="mx-auto max-w-3xl text-center [&_p]:mx-auto"
          id="testimonials-title"
          chip="Hear from our owners"
          lines={['Rated 4.9★', 'by our owners.']}
          accent={['owners.']}
          text="Real messages from real owners — straight from their chats with our team."
        />

        <Reveal y={70} className="mt-14">
          <ul
            ref={rail}
            onScroll={measure}
            tabIndex={0}
            aria-label="Owner feedback, scroll sideways for more"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
              if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
            }}
            className="no-scrollbar -mx-5 flex snap-x snap-mandatory scroll-px-5 sm:scroll-px-8 lg:scroll-px-0 gap-5 overflow-x-auto scroll-smooth px-5 pb-8 pt-3 focus-visible:outline-none sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0"
          >
            {testimonials.map((t, n) => (
              <li key={t.quote} className="w-[86%] shrink-0 snap-start sm:w-[58%] lg:w-[calc((100%-2.5rem)/3)]">
                <figure className="card card-hover flex h-full flex-col !rounded-[30px] p-7 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-graphite">
                      <Quote size={20} strokeWidth={1.6} className="text-white" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-ink-3" aria-hidden="true">{String(n + 1).padStart(2, '0')}</span>
                  </div>
                  <blockquote className="mt-6 flex-1 text-[1.1rem] leading-[1.6] tracking-tight">{t.quote}</blockquote>
                  <figcaption className="mt-7 flex items-center gap-3 border-t border-graphite/10 pt-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#8fb3ea] to-olive text-sm font-semibold text-white" aria-hidden="true">{t.name.charAt(0)}</span>
                    <span className="leading-tight">
                      <span className="block font-semibold">{t.name}</span>
                      {t.detail && <span className="block text-sm text-ink-2">{t.detail}</span>}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center gap-5">
            <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-graphite/12" aria-hidden="true">
              <span className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-gradient-to-r from-[#8fb3ea] to-olive transition-transform duration-300" style={{ transform: `scaleX(${0.18 + progress * 0.82})` }} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => step(-1)} disabled={edge === 'start'} aria-label="Previous owners" className="grid h-12 w-12 place-items-center rounded-full border border-graphite/15 bg-white transition-all hover:bg-graphite hover:text-white disabled:pointer-events-none disabled:opacity-40"><ArrowLeft size={18} strokeWidth={1.6} /></button>
              <button onClick={() => step(1)} disabled={edge === 'end'} aria-label="Next owners" className="grid h-12 w-12 place-items-center rounded-full bg-graphite text-white transition-all hover:bg-olive disabled:pointer-events-none disabled:opacity-40"><ArrowRight size={18} strokeWidth={1.6} /></button>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-12 text-center">
          <a href="/projects" className="btn-ghost">See the homes we've built</a>
        </Reveal>
      </div>
    </section>
  )
}
