import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { testimonials } from '../data/testimonials'
import Still from '../components/Still'
import { Reveal } from '../components/Reveal'
import type { StillId } from '../data/media'
import { useIsMobile } from '../hooks/useEnv'

const ease = [0.16, 1, 0.3, 1] as const
/** decorative photographs of finished homes, one for each card (they are not the owners' own homes) */
const decor: StillId[] = ['g-40', 'g-41', 'g-01', 'g-45', 'g-42', 'p-completed-3']

type Pos = 'left' | 'center' | 'right'

function Card({ i, pos, total }: { i: number; pos: Pos; total: number }) {
  const t = testimonials[i]
  const center = pos === 'center'
  return (
    <figure className="relative flex h-full min-h-[22rem] flex-col justify-between overflow-hidden rounded-[30px] border border-white/80 bg-white/75 p-7 text-graphite shadow-[0_40px_90px_-55px_rgba(40,60,110,0.55)] backdrop-blur-xl sm:p-9">
      {/* a photograph fading in from the side */}
      <span
        className={`pointer-events-none absolute inset-y-0 w-[44%] ${pos === 'left' ? 'left-0 [mask-image:linear-gradient(to_right,#000_0%,transparent_100%)]' : 'right-0 [mask-image:linear-gradient(to_left,#000_0%,transparent_100%)]'} ${center ? 'opacity-50' : 'opacity-70'} max-lg:hidden`}
        aria-hidden="true"
      >
        <Still id={decor[i % decor.length]} className="h-full w-full !rounded-none" />
      </span>

      <div className={`relative flex items-start justify-between ${pos === 'left' ? 'lg:pl-[22%]' : ''}`}>
        <span className={`grid h-12 w-12 place-items-center rounded-full bg-olive/10 text-olive`}>
          <Quote size={20} strokeWidth={2} fill="currentColor" aria-hidden="true" />
        </span>
        <span className={`text-sm font-medium tabular-nums text-ink-2`} aria-hidden="true">{String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      </div>

      <blockquote className={`relative mt-6 text-[1.05rem] leading-[1.7] ${pos === 'left' ? 'lg:pl-[22%]' : ''}`}>“{t.quote}”</blockquote>

      <figcaption className={`relative mt-6 flex items-center gap-4 border-t border-graphite/10 pt-5 ${pos === 'left' ? 'lg:ml-[22%]' : ''}`}>
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-base font-semibold bg-gradient-to-br from-[#8fb3ea] to-olive text-white`} aria-hidden="true">{t.name.charAt(0)}</span>
        <span className="leading-tight">
          <span className="block font-semibold">{t.name}</span>
          {t.detail && <span className={`mt-0.5 block text-sm text-ink-2`}>{t.detail}</span>}
        </span>
      </figcaption>
    </figure>
  )
}

/**
 * Owner feedback as a three-card carousel: three glass cards that move one place at a time, always numbered in order (01 02 03, then 02 03 04 ...).
 * Use the arrows, the dots or the left / right keys. Nothing changes on its own, so every quote can be read to the end.
 */
export default function Testimonials() {
  const N = testimonials.length
  // on a phone one card shows at a time; otherwise three do
  const mobile = useIsMobile()
  const last = Math.max(0, mobile ? N - 1 : N - 3) // the first card of the last window
  const [start, setStart] = useState(0)
  useEffect(() => setStart((s) => Math.min(s, last)), [last])
  const [dir, setDir] = useState(1)
  const go = (n: number) => {
    const next = Math.min(last, Math.max(0, n))
    if (next === start) return
    setDir(next > start ? 1 : -1)
    setStart(next)
  }
  const left = start
  const mid = Math.min(N - 1, start + 1)
  const right = Math.min(N - 1, start + 2)

  return (
    <section id="testimonials" className="relative overflow-hidden py-[clamp(48px,7vh,90px)] text-graphite" aria-labelledby="testimonials-title">
      {/* a finished home, fading out into the page from the top right */}
      <div className="pointer-events-none absolute right-0 top-0 hidden h-[26rem] w-[52%] opacity-80 [mask-image:linear-gradient(to_left,#000_35%,transparent_100%),linear-gradient(to_bottom,#000_55%,transparent_100%)] [mask-composite:intersect] lg:block" aria-hidden="true">
        <Still id="p-completed-1" className="h-full w-full !rounded-none" focus="50% 40%" />
      </div>

      <div className="container-x relative" onKeyDown={(e) => { if (e.key === 'ArrowRight') go(start + 1); if (e.key === 'ArrowLeft') go(start - 1) }}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl border-l-2 border-olive pl-6">
            <Reveal><p className="eyebrow text-olive">Real stories. Real dreams.</p></Reveal>
            <h2 id="testimonials-title" className="display mt-4 text-[clamp(2.2rem,4.6vw,4rem)] !leading-[1.05]">
              <Reveal as="span">What Our Owners <span className="accent-word -mb-[0.15em] block pb-[0.15em]">Say About Us</span></Reveal>
            </h2>
            <Reveal delay={0.1} className="mt-5 max-w-md text-[1.02rem] leading-relaxed text-ink-2">
              Real messages from real owners, straight from their chats with our team: trust, quality and care.
            </Reveal>
          </div>

          <Reveal delay={0.15} className="flex items-center gap-6 lg:mr-[8%]">
            <div className="flex items-center gap-4 rounded-full bg-white/85 py-3 pl-3 pr-7 shadow-[0_24px_60px_-35px_rgba(40,60,110,0.6)] backdrop-blur-xl">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#fff4d6] text-[#f5a623]"><Star size={24} fill="currentColor" strokeWidth={0} aria-hidden="true" /></span>
              <span className="leading-tight">
                <span className="block font-semibold">Rated 4.9/5</span>
                <span className="block text-sm text-ink-2">by our owners</span>
              </span>
            </div>
            <div className="hidden h-12 w-px bg-graphite/15 sm:block" aria-hidden="true" />
            <div className="hidden leading-tight sm:block">
              <ul className="flex -space-x-2" aria-hidden="true">
                {testimonials.slice(0, 5).map((t) => (
                  <li key={t.name} className="grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-gradient-to-br from-[#8fb3ea] to-olive text-xs font-semibold text-white">{t.name.charAt(0)}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-ink-2">320+ homes delivered</p>
            </div>
          </Reveal>
        </div>

        {/* the three cards: the one in the middle is in focus */}
        <Reveal y={60} className="mt-12">
          <div role="group" aria-roledescription="carousel" aria-label="Owner feedback" aria-live="polite">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.div
                key={start}
                custom={dir}
                initial={{ opacity: 0, x: 60 * dir }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.7, ease } }}
                exit={{ opacity: 0, x: -40 * dir, transition: { duration: 0.25 } }}
                className="grid items-stretch gap-4 min-[821px]:grid-cols-[1fr_1.08fr_1fr] min-[821px]:gap-5 lg:gap-7"
              >
                {mobile ? (
                  <Card i={start} pos="center" total={N} />
                ) : (
                  <>
                    <div className="lg:pt-3"><Card i={left} pos="left" total={N} /></div>
                    <div className="lg:-mt-2"><Card i={mid} pos="center" total={N} /></div>
                    <div className="lg:pt-3"><Card i={right} pos="right" total={N} /></div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        <div className="relative mt-9 flex items-center justify-center gap-6">
          <button onClick={() => go(start - 1)} disabled={start === 0} aria-label="Previous owners" className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-[0_14px_34px_-18px_rgba(40,60,110,0.6)] transition-all hover:-translate-x-0.5 hover:bg-graphite hover:text-white disabled:pointer-events-none disabled:opacity-40"><ChevronLeft size={20} strokeWidth={1.8} /></button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose an owner">
            {Array.from({ length: last + 1 }, (_, n) => (
              <button key={n} role="tab" aria-selected={n === start} aria-label={mobile ? `Show owner ${n + 1}` : `Show owners ${n + 1} to ${n + 3}`} onClick={() => go(n)} className="grid h-6 place-items-center px-0.5">
                <span className={`block h-1.5 rounded-full transition-all duration-500 ${n === start ? 'w-8 bg-olive' : 'w-3 bg-graphite/20 hover:bg-graphite/40'}`} />
              </button>
            ))}
          </div>
          <button onClick={() => go(start + 1)} disabled={start === last} aria-label="Next owners" className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-[0_14px_34px_-18px_rgba(40,60,110,0.6)] transition-all hover:translate-x-0.5 hover:bg-graphite hover:text-white disabled:pointer-events-none disabled:opacity-40"><ChevronRight size={20} strokeWidth={1.8} /></button>
          <p className="absolute right-0 hidden font-serif text-lg italic text-olive/80 xl:block" aria-hidden="true">Building better tomorrows</p>
        </div>
      </div>
    </section>
  )
}
