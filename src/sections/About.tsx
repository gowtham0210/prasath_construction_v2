import { useLayoutEffect, useRef, type PointerEvent } from 'react'
import { Hammer, Home, Ruler, Sparkles } from 'lucide-react'
import LoopVideo from '../components/LoopVideo'
import type { StillId } from '../data/media'
import { MaskReveal, Reveal, RevealWords } from '../components/Reveal'
import { aboutIntro, mvv, whyChoose } from '../data/prasath'
import { gsap } from '../lib/smooth'
import { useFinePointer, useIsMobile, usePrefersReducedMotion } from '../hooks/useEnv'

interface Pillar {
  title: string
  text: string
  tag: string
  image: StillId
  video: string
  speed?: number
  focus: string
}

const media: Pick<Pillar, 'image' | 'video' | 'speed' | 'focus'>[] = [
  { image: 'two-front', video: '/media/twostorey.mp4', focus: '30% 40%' },
  { image: 'tour-living', video: '/media/walkthrough.mp4', speed: 0.45, focus: '50% 50%' },
  { image: 'ext-slats', video: '/media/exterior.mp4', focus: '50% 50%' },
]
const pillars: Pillar[] = mvv.map((m, i) => ({ title: m.title, tag: m.tag, text: m.text, ...media[i] }))

const values = [...whyChoose.map((w) => w.title)]

const stars = [
  { pos: 'left-[22%] top-[2%]', s: 16, d: '0s' }, { pos: 'right-[24%] top-[0%]', s: 12, d: '-1.2s' }, { pos: 'left-[3%] top-[34%]', s: 12, d: '-2.4s' },
  { pos: 'right-[2%] top-[38%]', s: 18, d: '-0.6s' }, { pos: 'left-[28%] top-[88%]', s: 10, d: '-3.1s' }, { pos: 'right-[30%] top-[92%]', s: 14, d: '-1.9s' },
]

const floaters = [
  { Icon: Ruler, pos: 'left-[6%] top-[4%]', delay: '0s' },
  { Icon: Home, pos: 'right-[7%] top-[10%]', delay: '-1.8s' },
  { Icon: Hammer, pos: 'left-[12%] top-[58%]', delay: '-3.1s' },
  { Icon: Sparkles, pos: 'right-[13%] top-[62%]', delay: '-4.4s' },
]

/** About the company: a centred headline with floating icons, three living cards that tilt toward the pointer, and a ribbon of values. */
export default function About() {
  const root = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()
  const mobile = useIsMobile()
  const fine = useFinePointer()

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      const dir = [
        { x: -140, y: 60, rotate: -7 },
        { x: 0, y: 140, rotate: 0 },
        { x: 140, y: 60, rotate: 7 },
      ]
      gsap.utils.toArray<HTMLElement>('[data-card]').forEach((el, i) => {
        const d = mobile ? { x: 0, y: 80, rotate: 0 } : dir[i]
        gsap.fromTo(el, { ...d, opacity: 0, scale: 0.9 }, {
          x: 0, y: 0, rotate: 0, opacity: 1, scale: 1, duration: 1.6, ease: 'expo.out', delay: mobile ? 0 : i * 0.08,
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        })
        if (!mobile) {
          gsap.to(el.querySelector('[data-float]'), { y: i === 1 ? 14 : -14, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
        }
      })
      const path = root.current?.querySelector<SVGPathElement>('[data-path]')
      if (path) {
        const len = path.getTotalLength()
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len })
        gsap.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '[data-cards]', start: 'top 80%', end: 'bottom 60%', scrub: 0.6 } })
      }
    }, root)
    return () => ctx.revert()
  }, [reduced, mobile])

  const move = (e: PointerEvent<HTMLElement>) => {
    if (!fine || reduced) return
    const el = e.currentTarget
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--ry', `${(px - 0.5) * 9}deg`)
    el.style.setProperty('--rx', `${(0.5 - py) * 7}deg`)
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
  }
  const leave = (e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--rx', '0deg')
  }

  return (
    <section id="about" ref={root} className="relative py-[clamp(40px,6vh,76px)] text-graphite" aria-labelledby="about-title">
      <div className="container-x">
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="pointer-events-none absolute -inset-x-24 -inset-y-6 hidden lg:block" aria-hidden="true">
            {floaters.map(({ Icon, pos, delay }, i) => (
              <span key={i} className={`absolute ${pos} grid h-12 w-12 place-items-center rounded-2xl bg-white/80 text-olive shadow-[0_18px_40px_-18px_rgba(40,60,110,0.6)] backdrop-blur`} style={{ animation: `bob 6s ease-in-out ${delay} infinite` }}>
                <Icon size={20} strokeWidth={1.6} />
              </span>
            ))}
          </div>
          {stars.map((st, i) => (
            <svg key={i} viewBox="0 0 24 24" width={st.s} height={st.s} className={`pointer-events-none absolute ${st.pos} text-olive`} style={{ animation: `twinkle 3.6s ease-in-out ${st.d} infinite` }} aria-hidden="true">
              <path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" fill="currentColor" />
            </svg>
          ))}
          <Reveal>
            <span className="chip">{aboutIntro.chip}</span>
          </Reveal>
          <h2 id="about-title" className="display mt-6 text-[clamp(2.2rem,4.8vw,4.6rem)] !leading-[1.04]" aria-label={aboutIntro.lines.join(' ')}>
            <RevealWords as="span" lines={aboutIntro.lines} italic={['home.']} stagger={0.09} />
          </h2>
          <Reveal className="mx-auto mt-6 max-w-xl text-[1.05rem] leading-relaxed text-graphite/65" delay={0.1}>
            {aboutIntro.text}</Reveal>
          <Reveal className="mt-8" delay={0.2}>
            <a href="#/about" className="btn-primary">Our Story</a>
          </Reveal>
        </div>

        <div data-cards className="relative mx-auto mt-16 max-w-6xl">
          <svg className="pointer-events-none absolute inset-x-0 top-10 hidden h-40 w-full md:block" viewBox="0 0 1000 160" preserveAspectRatio="none" fill="none" aria-hidden="true">
            <path data-path d="M60 110 C 220 -10, 330 -10, 500 100 S 790 220, 940 60" stroke="#4450e0" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="6 8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>

          <div className="grid items-start gap-6 md:grid-cols-3 lg:gap-10">
            {pillars.map((p, i) => (
              <article key={p.title} data-card className={i === 1 ? 'md:mt-14' : ''} style={{ perspective: '1100px' }}>
                <div data-float>
                  <div
                    onPointerMove={move}
                    onPointerLeave={leave}
                    className="group relative overflow-hidden rounded-[28px] bg-white/85 shadow-[0_30px_70px_-45px_rgba(40,60,110,0.55)] transition-[transform,box-shadow] duration-500 ease-out hover:shadow-[0_50px_100px_-40px_rgba(68,80,224,0.55)]"
                    style={{ transform: 'rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))', transformStyle: 'preserve-3d' }}
                  >
                    <MaskReveal className="relative aspect-[4/5] w-full overflow-hidden" from="bottom" delay={i * 0.08}>
                      <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[var(--ease-expo)] group-hover:scale-[1.07]">
                        <LoopVideo src={p.video} poster={p.image} className="h-full w-full" focus={p.focus} speed={p.speed} />
                      </div>
                      <span className="absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-full border border-graphite/10 bg-white/90 py-1.5 pl-3 pr-4 text-[0.7rem] font-medium backdrop-blur transition-transform duration-500 group-hover:-translate-y-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-olive" style={{ animation: 'pulseDot 2s ease-out infinite' }} />
                        {p.tag}
                      </span>
                    </MaskReveal>
                    <div className="relative overflow-hidden bg-[#e4e9fb] px-6 py-3 text-sm font-semibold tracking-wide">
                      <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-[#8fb3ea] to-olive transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" aria-hidden="true" />
                      <span className="relative transition-colors duration-500 group-hover:text-white">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <div className="p-6 pb-8">
                      <h3 className="text-[1.5rem] font-medium tracking-tight"><RevealWords as="span" lines={[p.title]} stagger={0.05} delay={0.3} /></h3>
                      <p className="mt-3 text-sm leading-relaxed text-graphite/60">{p.text}</p>
                    </div>
                    <span className="pointer-events-none absolute -inset-px rounded-[28px] opacity-0 transition-opacity duration-700 group-hover:opacity-100" style={{ background: 'conic-gradient(from 0deg, transparent 0 55%, rgba(68,80,224,0.55) 75%, rgba(240,201,174,0.7) 90%, transparent)', animation: 'spinGlow 4s linear infinite', mask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)', WebkitMask: 'linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)', padding: '2px' }} aria-hidden="true" />
                    <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: 'radial-gradient(420px circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.45), transparent 55%)' }} aria-hidden="true" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <Reveal y={50} className="mx-auto mt-16 max-w-6xl">
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
            <div className="flex w-max items-center gap-3" style={{ animation: reduced ? undefined : 'marquee 40s linear infinite' }}>
              {[...values, ...values, ...values, ...values].map((v, i) => (
                <span key={i} className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-white/80 px-5 py-2.5 text-sm font-medium shadow-[0_12px_30px_-20px_rgba(40,60,110,0.6)] backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-olive" />
                  {v}
                </span>
              ))}
            </div>
            <div className="mt-3 flex w-max items-center gap-3" style={{ animation: reduced ? undefined : 'marqueeBack 52s linear infinite' }}>
              {[...aboutIntro.pillars, ...aboutIntro.pillars, ...aboutIntro.pillars, ...aboutIntro.pillars, ...aboutIntro.pillars].map((v, i) => (
                <span key={i} className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-white/70 bg-white/45 px-5 py-2.5 text-sm font-medium backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f0c9ae]" />
                  {v}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
