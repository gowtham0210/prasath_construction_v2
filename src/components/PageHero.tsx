import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { ArrowDown } from 'lucide-react'
import Still from './Still'
import { RevealWords } from './Reveal'
import type { StillId } from '../data/media'
import { gsap, scrollToId } from '../lib/smooth'
import { useFinePointer, usePrefersReducedMotion } from '../hooks/useEnv'

interface Fact {
  v: string
  l: string
}

interface Props {
  id: string
  crumb: string
  chip: string
  /** the headline, one string per line */
  lines: string[]
  /** words in the headline that take the shimmering accent */
  accent?: string[]
  text: string
  image: StillId
  focus?: string
  pills?: string[]
  facts?: Fact[]
  /** text around the rotating seal, and the section it scrolls to */
  seal: string
  sealTo: string
  actions?: ReactNode
}

const factPos = ['right-[6%] top-[270px]', 'right-[13%] top-[380px]', 'right-[6%] top-[490px]']
const factDelay = ['0s', '-1.6s', '-3s']

/**
 * The opening frame shared by every inner page, matching the home and About heroes: a full-bleed photograph that
 * breathes, a pale sky from the top for the menu, a large white headline, floating facts and a rotating seal.
 */
export default function PageHero({ id, crumb, chip, lines, accent = [], text, image, focus = '50% 50%', pills = [], facts = [], seal, sealTo, actions }: Props) {
  const root = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const fine = useFinePointer()
  const ring = `${seal.toUpperCase()} `

  useLayoutEffect(() => {
    if (reduced) return
    const el = root.current
    if (!el) return
    const cleanups: (() => void)[] = []
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 })
      tl.from('[data-film]', { scale: 1.2, opacity: 0, duration: 2.4, ease: 'power3.out' }, 0)
        .from('[data-c]', { y: 34, opacity: 0, duration: 1.2, stagger: 0.12 }, 0.5)
        .from('[data-tag]', { y: 30, scale: 0.6, opacity: 0, duration: 1, stagger: 0.18, ease: 'back.out(1.8)' }, 1.1)
        .from('[data-seal]', { scale: 0, rotate: -90, opacity: 0, duration: 1.5, ease: 'back.out(1.4)' }, 1.3)

      const st = { trigger: el, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('[data-film-scroll]', { scale: 1.12, yPercent: 6, ease: 'none', scrollTrigger: st })
      gsap.to('[data-words]', { yPercent: -14, opacity: 0.2, ease: 'none', scrollTrigger: st })

      if (fine) {
        const layers: [string, number, number][] = [['[data-par="film"]', -18, -12], ['[data-par="tags"]', -34, -22], ['[data-par="seal"]', 24, 16]]
        const q = layers.map(([sel, dx, dy]) => ({ x: gsap.quickTo(sel, 'x', { duration: 1.1, ease: 'power3.out' }), y: gsap.quickTo(sel, 'y', { duration: 1.1, ease: 'power3.out' }), dx, dy }))
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width - 0.5
          const py = (e.clientY - r.top) / r.height - 0.5
          q.forEach((l) => {
            l.x(px * l.dx)
            l.y(py * l.dy)
          })
        }
        const leave = () => q.forEach((l) => (l.x(0), l.y(0)))
        el.addEventListener('pointermove', move)
        el.addEventListener('pointerleave', leave)
        cleanups.push(() => {
          el.removeEventListener('pointermove', move)
          el.removeEventListener('pointerleave', leave)
        })
      }
    }, root)
    return () => {
      cleanups.forEach((c) => c())
      ctx.revert()
    }
  }, [reduced, fine])

  return (
    <section id={id} ref={root} className="bg-ivory p-2 text-white sm:p-3 lg:p-4" aria-labelledby={`${id}-title`}>
      <div className="relative overflow-hidden rounded-[30px] bg-graphite lg:min-h-[min(640px,80svh)] lg:rounded-[44px]">
        {/* the picture */}
        <div data-film data-film-scroll className="absolute inset-0">
          <div data-par="film" className="absolute -inset-6">
            <div className="h-full w-full" style={{ animation: reduced ? undefined : 'kenburns 28s ease-in-out infinite alternate' }}>
              <Still id={image} className="h-full w-full !rounded-none" focus={focus} priority />
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/90 via-white/45 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(15,18,24,0.9)_0%,rgba(15,18,24,0.62)_55%,rgba(15,18,24,0.25)_85%)]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(15,18,24,0.5),transparent_60%)]" aria-hidden="true" />
        <span className="pointer-events-none absolute -left-24 bottom-16 h-80 w-80 rounded-full bg-[#4450e0]/30 blur-[90px]" style={{ animation: 'drift 18s ease-in-out infinite' }} aria-hidden="true" />
        <span className="pointer-events-none absolute -right-10 top-1/3 h-72 w-72 rounded-full bg-[#f0c9ae]/30 blur-[90px]" style={{ animation: 'drift 22s ease-in-out -9s infinite reverse' }} aria-hidden="true" />

        {/* floating facts + rotating seal (desktop) */}
        {facts.length > 0 && (
          <div data-par="tags" className="pointer-events-none absolute inset-0 z-[5] hidden min-[1440px]:block" aria-hidden="true">
            {facts.slice(0, 3).map((f, i) => (
              <div key={f.l} data-tag className={`absolute ${factPos[i]}`}>
                <span className="flex items-center gap-3 rounded-full border border-white/30 bg-white/15 py-2 pl-5 pr-6 backdrop-blur-md" style={{ animation: `bob 6s ease-in-out ${factDelay[i]} infinite` }}>
                  <span className="text-[1.5rem] font-semibold leading-none tracking-tight">{f.v}</span>
                  <span className="text-sm font-medium text-white/85">{f.l}</span>
                </span>
              </div>
            ))}
          </div>
        )}
        <div data-par="seal" className="absolute right-[5%] top-[104px] z-[5] hidden min-[1440px]:block">
          <button data-seal onClick={() => document.getElementById(sealTo)?.scrollIntoView({ behavior: 'smooth' })} className="group relative grid h-32 w-32 place-items-center rounded-full border border-white/30 bg-white/15 backdrop-blur-md transition-transform duration-500 hover:scale-105" aria-label={`Scroll to ${crumb}`}>
            <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" style={{ animation: reduced ? undefined : 'spinSlow 22s linear infinite' }} aria-hidden="true">
              <defs>
                <path id={`${id}-seal`} d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
              </defs>
              <text fontSize="9.4" fontWeight="600" letterSpacing="2.4" fill="#fff">
                <textPath href={`#${id}-seal`}>{ring + ring}</textPath>
              </text>
            </svg>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-graphite transition-transform duration-500 group-hover:rotate-45">
              <ArrowDown size={18} strokeWidth={1.8} className="-rotate-[135deg]" />
            </span>
          </button>
        </div>

        {/* words */}
        <div className="relative z-10 flex min-h-[inherit] flex-col justify-start px-5 pb-16 pt-28 sm:px-9 lg:px-[clamp(28px,4.5vw,72px)] lg:pb-20 lg:pt-28">
          <div data-words className="max-w-[56rem]">
            <nav data-c aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-white/70">
              <a href="/" className="link-line hover:text-white">Home</a>
              <span aria-hidden="true">/</span>
              <span className="text-white">{crumb}</span>
            </nav>
            <span data-c className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-[0.8rem] font-medium backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8fb3ea]" style={{ animation: 'pulseDot 2s ease-out infinite' }} />
              {chip}
            </span>
            <h1 id={`${id}-title`} className="hero-dark display mt-5 text-[clamp(2.3rem,5vw,5rem)] !leading-[0.98]" aria-label={lines.join(' ')}>
              <RevealWords as="span" lines={lines} italic={accent} delay={0.4} stagger={0.07} />
            </h1>
            <p data-c className="mt-6 max-w-xl text-[1.05rem] leading-relaxed text-white/80">{text}</p>
            {pills.length > 0 && (
              <ul data-c className="mt-6 flex flex-wrap gap-2.5">
                {pills.map((p) => (
                  <li key={p} className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/12 px-4 py-2 text-sm font-medium backdrop-blur-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#8fb3ea]" />
                    {p}
                  </li>
                ))}
              </ul>
            )}
            {actions && <div data-c className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>}
            {facts.length > 0 && <ul data-c className="mt-7 flex flex-wrap gap-2.5 min-[1440px]:hidden" aria-label="Key numbers">
                {facts.map((f) => (
                  <li key={f.l} className="flex items-center gap-2.5 rounded-full border border-white/30 bg-white/15 py-1.5 pl-4 pr-5 backdrop-blur-md">
                    <span className="text-[1.15rem] font-semibold leading-none tracking-tight">{f.v}</span>
                    <span className="text-[0.8rem] font-medium text-white/85">{f.l}</span>
                  </li>
                ))}
              </ul>}
          </div>
        </div>
      </div>
    </section>
  )
}
