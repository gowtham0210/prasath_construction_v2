import { useLayoutEffect, useRef, type PointerEvent } from 'react'
import { ArrowUpRight, Layers, Radio, ReceiptText, UserRound } from 'lucide-react'
import SectionHead from '../components/SectionHead'
import Still from '../components/Still'
import { whyChoose } from '../data/prasath'
import { gsap } from '../lib/smooth'
import { useFinePointer, usePrefersReducedMotion } from '../hooks/useEnv'

/**
 * Why choose us, as a bento board: one large photograph tile, a dark tile with a counting number, a gradient tile,
 * two light tiles and a wide closing strip — each arriving from a different direction.
 */
export default function WhyChoose({ id = 'home-why' }: { id?: string }) {
  const root = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()
  const [eng, onTime, turnkey, client, updates, pricing] = whyChoose

  // the tiles arrive when they truly come into view (measured on screen, so a shifting page cannot leave them hidden)
  useLayoutEffect(() => {
    if (reduced) return
    const el = root.current
    if (!el) return
    const tiles = Array.from(el.querySelectorAll<HTMLElement>('[data-tile]'))
    const from = [{ x: -90 }, { y: 80 }, { x: 90 }, { x: -70, y: 40 }, { x: 70, y: 40 }, { y: 70 }]
    gsap.set(tiles, { opacity: 0 })
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const i = tiles.indexOf(e.target as HTMLElement)
          gsap.fromTo(e.target, { ...from[i], opacity: 0, scale: 0.92 }, { x: 0, y: 0, opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out', delay: (i % 3) * 0.08, clearProps: 'transform' })
          io.unobserve(e.target)
        }),
      { rootMargin: '0px 0px -8% 0px' },
    )
    tiles.forEach((t) => io.observe(t))
    // the percentage counts up when the dark tile appears
    const num = el.querySelector<HTMLElement>('[data-count]')
    const numIo = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || !num) return
      const o = { v: 0 }
      gsap.to(o, { v: 98, duration: 2.2, ease: 'power3.out', onUpdate: () => (num.textContent = String(Math.round(o.v))) })
      numIo.disconnect()
    })
    if (num) numIo.observe(num)
    return () => {
      io.disconnect()
      numIo.disconnect()
      gsap.set(tiles, { clearProps: 'all' })
    }
  }, [reduced])

  const move = (e: PointerEvent<HTMLElement>) => {
    if (!fine || reduced) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    el.style.setProperty('--gx', `${((e.clientX - r.left) / r.width) * 100}%`)
    el.style.setProperty('--gy', `${((e.clientY - r.top) / r.height) * 100}%`)
  }
  const glow = (c: string) => ({ background: `radial-gradient(380px circle at var(--gx,50%) var(--gy,50%), ${c}, transparent 60%)` })
  const tile = 'group relative overflow-hidden rounded-[32px] transition-[transform,box-shadow] duration-700 ease-[var(--ease-expo)] hover:-translate-y-1.5'

  return (
    <section id={id} ref={root} className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby={`${id}-title`}>
      <div className="container-x">
        <SectionHead id={`${id}-title`} chip="Why choose us" lines={['Built different.', 'Built better.']} accent={['better.']} text="Six reasons families trust us with the biggest build of their lives." />

        <ul className="mt-8 flex flex-wrap justify-center gap-3" aria-label="Key numbers">
          {[['320+', 'Homes delivered'], ['15+', 'Areas covered']].map(([v, l]) => (
            <li key={l} className="flex items-center gap-3 rounded-full border border-graphite/10 bg-white/70 py-2 pl-5 pr-6 backdrop-blur-md">
              <span className="text-[1.3rem] font-semibold leading-none tracking-tight">{v}</span>
              <span className="text-sm font-medium text-ink-2">{l}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {/* A — photograph */}
          <article data-tile onPointerMove={move} className={`${tile} min-h-[22rem] bg-graphite text-white shadow-[0_40px_90px_-45px_rgba(15,18,24,0.8)] md:col-span-2 lg:col-span-5 lg:row-span-2`}>
            <div className="absolute inset-0 transition-transform duration-[1600ms] ease-[var(--ease-expo)] group-hover:scale-[1.07]">
              <Still id="p-about" className="h-full w-full !rounded-none" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
            <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={glow('rgba(255,255,255,0.25)')} />
            <div className="relative flex h-full flex-col justify-between p-7 lg:p-9">
              <span className="chip w-fit">01</span>
              <div>
                <UserRound size={30} strokeWidth={1.4} className="text-white/80" />
                <h3 className="mt-4 text-[clamp(1.8rem,2.6vw,2.4rem)] font-medium leading-tight tracking-tight">{eng.title}</h3>
                <p className="mt-3 max-w-sm text-[0.98rem] leading-relaxed text-white/75">{eng.text}</p>
              </div>
            </div>
          </article>

          {/* B — dark, counting */}
          <article data-tile onPointerMove={move} className={`${tile} bg-graphite p-7 text-white shadow-[0_40px_90px_-45px_rgba(15,18,24,0.8)] lg:col-span-4 lg:p-8`}>
            <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={glow('rgba(127,139,255,0.35)')} />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="flex items-center justify-between"><span className="chip">02</span><ArrowUpRight size={20} strokeWidth={1.5} className="text-white/50 transition-transform duration-500 group-hover:rotate-45" /></div>
              <div>
                <p className="text-[clamp(3.4rem,6vw,5.2rem)] font-semibold leading-none tracking-tight"><span data-count>{reduced ? 98 : 0}</span><span className="accent-word">%</span></p>
                <h3 className="mt-3 text-[1.3rem] font-medium tracking-tight">{onTime.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/60">{onTime.text}</p>
              </div>
            </div>
          </article>

          {/* C — gradient */}
          <article data-tile onPointerMove={move} className={`${tile} bg-gradient-to-br from-[#4450e0] to-[#8fb3ea] p-7 text-white shadow-[0_40px_90px_-45px_rgba(68,80,224,0.8)] lg:col-span-3 lg:p-8`}>
            <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={glow('rgba(255,255,255,0.3)')} />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="flex items-center justify-between"><span className="chip">03</span><Layers size={24} strokeWidth={1.4} className="transition-transform duration-500 group-hover:rotate-12" /></div>
              <div>
                <p className="text-[2.6rem] font-semibold leading-none tracking-tight">1 contract</p>
                <h3 className="mt-2 text-[1.25rem] font-medium tracking-tight">{turnkey.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/80">One accountable team, from design to handover.</p>
              </div>
            </div>
          </article>

          {/* D — light */}
          <article data-tile onPointerMove={move} className={`${tile} card p-7 lg:col-span-4 lg:p-8`}>
            <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={glow('rgba(143,179,234,0.35)')} />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="flex items-center justify-between"><span className="chip">04</span><UserRound size={24} strokeWidth={1.4} className="text-olive" /></div>
              <div>
                <p className="text-[clamp(2.6rem,4.4vw,3.6rem)] font-semibold leading-none tracking-tight">4.9<span className="accent-word">★</span></p>
                <h3 className="mt-3 text-[1.3rem] font-medium tracking-tight">{client.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{client.text}</p>
              </div>
            </div>
          </article>

          {/* E — live */}
          <article data-tile onPointerMove={move} className={`${tile} card p-7 lg:col-span-3 lg:p-8`}>
            <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={glow('rgba(240,201,174,0.45)')} />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="flex items-center justify-between"><span className="chip">05</span><Radio size={24} strokeWidth={1.4} className="text-olive" /></div>
              <div>
                <p className="flex items-center gap-3 text-[2.2rem] font-semibold leading-none tracking-tight">
                  Daily
                  <span className="relative grid h-3 w-3 place-items-center"><span className="absolute inset-0 rounded-full bg-[#2fbf71]" style={{ animation: 'pulseRing 1.8s ease-out infinite' }} /><span className="h-3 w-3 rounded-full bg-[#2fbf71]" /></span>
                </p>
                <h3 className="mt-3 text-[1.25rem] font-medium tracking-tight">{updates.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">Progress updates and a tracking app, from anywhere.</p>
              </div>
            </div>
          </article>

          {/* F — wide strip */}
          <article data-tile onPointerMove={move} className={`${tile} card flex flex-col gap-5 p-7 md:col-span-2 lg:col-span-12 lg:flex-row lg:items-center lg:justify-between lg:p-9`}>
            <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={glow('rgba(143,179,234,0.3)')} />
            <div className="relative flex items-center gap-5">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-graphite text-white transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"><ReceiptText size={24} strokeWidth={1.5} /></span>
              <div>
                <span className="chip">06</span>
                <h3 className="mt-2 text-[1.5rem] font-medium tracking-tight">{pricing.title}</h3>
              </div>
            </div>
            <p className="relative max-w-xl text-[1rem] leading-relaxed text-ink-2">{pricing.text}</p>
            <div className="relative flex shrink-0 flex-wrap gap-2">
              {['Fixed-cost BOQ', 'Brand-wise specs', 'No hidden costs'].map((t) => <span key={t} className="rounded-full bg-graphite/5 px-4 py-2 text-sm font-medium">{t}</span>)}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
