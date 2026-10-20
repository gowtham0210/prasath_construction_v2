import { useMemo } from 'react'
import { ArrowUp } from 'lucide-react'
import Logo from './Logo'
import { Stagger } from './Reveal'
import { company } from '../config/company'
import { services } from '../data/services'
import { projects } from '../data/projects'
import { scrollToId } from '../lib/smooth'
import { setEnquiryPrefill } from '../lib/store'

const nav = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'packages', label: 'Packages' },
  { id: 'contact', label: 'Contact' },
]

/** a tiny seeded generator so the skyline is the same on every visit */
function rng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

interface Block {
  x: number
  w: number
  h: number
  roof: 'flat' | 'gable' | 'step'
  wins: { x: number; y: number; d: number }[]
}

function makeSkyline(seed: number, minH: number, maxH: number, minW: number, maxW: number): Block[] {
  const r = rng(seed)
  const out: Block[] = []
  let x = -20
  while (x < 1460) {
    const w = minW + r() * (maxW - minW)
    const h = minH + r() * (maxH - minH)
    const roof = r() < 0.34 ? 'gable' : r() < 0.5 ? 'step' : 'flat'
    const wins: Block['wins'] = []
    for (let wy = 18; wy < h - 14; wy += 20) {
      for (let wx = 10; wx < w - 14; wx += 18) {
        if (r() < 0.2) wins.push({ x: wx, y: wy, d: r() * 6 })
      }
    }
    out.push({ x, w, h, roof, wins })
    x += w + 2 + r() * 8
  }
  return out
}

/** A neighbourhood skyline: houses and apartment blocks in two soft layers, a few windows glowing on and off. */
function Skyline() {
  const back = useMemo(() => makeSkyline(7, 70, 150, 38, 72), [])
  const front = useMemo(() => makeSkyline(21, 36, 100, 44, 86), [])
  const draw = (blocks: Block[], fill: string, glow: boolean, base: number) =>
    blocks.map((b, i) => (
      <g key={i} transform={`translate(${b.x} ${base - b.h})`}>
        {b.roof === 'gable' ? (
          <path d={`M0 ${b.h} V16 L${b.w / 2} -10 L${b.w} 16 V${b.h} Z`} fill={fill} />
        ) : b.roof === 'step' ? (
          <path d={`M0 ${b.h} V10 H${b.w * 0.62} V-14 H${b.w} V${b.h} Z`} fill={fill} />
        ) : (
          <rect width={b.w} height={b.h} fill={fill} />
        )}
        {glow &&
          b.wins.map((w, k) => (
            <rect key={k} x={w.x} y={w.y + (b.roof === 'gable' ? 10 : 0)} width="6" height="9" rx="1" fill="#fff" style={{ animation: `windowGlow 5s ease-in-out ${w.d}s infinite` }} />
          ))}
      </g>
    ))
  return (
    <svg viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" className="block h-[70px] w-full sm:h-[100px] lg:h-[130px]" aria-hidden="true">
      <rect x="0" y="150" width="1440" height="70" fill="#c3cad8" opacity="0" />
      {draw(back, '#d5dae6', false, 220)}
      {draw(front, '#b9c1d2', true, 220)}
    </svg>
  )
}

export default function Footer() {
  const social = [
    { href: company.social.instagram, label: 'Instagram' },
    { href: company.social.facebook, label: 'Facebook' },
    { href: company.social.linkedin, label: 'LinkedIn' },
    { href: company.social.youtube, label: 'YouTube' },
  ].filter((s) => s.href)
  const hasContact = company.email || company.phone || company.address
  const title = 'text-[1.1rem] font-medium tracking-tight text-graphite'
  const item = 'group inline-flex items-center gap-2.5 text-left text-[0.9rem] text-ink-2 transition-all duration-500 hover:translate-x-1 hover:text-olive'
  const caret = <span className="h-0 w-0 border-y-[4px] border-l-[5px] border-y-transparent border-l-graphite/45 transition-colors duration-500 group-hover:border-l-olive" aria-hidden="true" />

  return (
    <footer className="relative overflow-hidden bg-white/75 pt-10 text-graphite backdrop-blur-xl sm:pt-12">
      <div className="container-x relative">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <Stagger className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4 lg:gap-10" gap={0.12}>
          <div className="col-span-2 lg:col-span-1">
            <h3 className={title}>Contact Info</h3>
            <div className="mt-4 space-y-2 text-[0.9rem] leading-relaxed text-ink-2">
              {company.address && <p>{company.address}</p>}
              {company.phone && <p>Phone: <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="link-line text-graphite/85">{company.phone}</a>{company.phone2 && <span> / <a href={`tel:${company.phone2.replace(/\s/g, '')}`} className="link-line text-graphite/85">{company.phone2}</a></span>}</p>}
              {company.email && <p>Email: <a href={`mailto:${company.email}`} className="link-line text-graphite/85">{company.email}</a></p>}
              {company.hours && <p>{company.hours}</p>}
              {company.serviceAreas.length > 0 && <p>Serving {company.serviceAreas.join(' · ')}</p>}
              {!hasContact && <p>Send an enquiry through the form and we will respond using the details you provide.</p>}
              {social.length > 0 && (
                <p className="flex flex-wrap gap-x-4 pt-1">
                  {social.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="link-line text-graphite/85">{s.label}</a>
                  ))}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className={title}>What We Build</h3>
            <ul className="mt-4 space-y-2">
              {services.map((s) => (
                <li key={s.id}>
                  <a href={`/services/${s.id}`} className={item}>
                    {caret}
                    {s.title.replace(' Construction', '')}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer">
            <h3 className={title}>Explore</h3>
            <ul className="mt-4 space-y-2">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={n.id === 'top' ? '/' : `/${n.id}`} className={item}>
                    {caret}
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className={title}>Featured Projects</h3>
            <ul className="mt-4 space-y-2">
              {projects.slice(0, 5).map((p) => (
                <li key={p.slug}>
                  <a href={`/projects/${p.slug}`} className={item}>
                    {caret}
                    {p.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Stagger>

        <div className="mt-9 flex flex-col gap-2 border-t border-graphite/10 py-4 text-[0.8rem] text-ink-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {company.legalName || company.name}. All rights reserved.</p>
          <a href="/privacy" className="link-line w-fit hover:text-graphite">Privacy policy</a>
        </div>
      </div>

      {/* the neighbourhood */}
      <div className="relative">
        <Skyline />
        <button
          onClick={() => scrollToId('top')}
          className="group absolute bottom-3 right-4 grid h-10 w-10 place-items-center bg-olive text-white shadow-[0_14px_30px_-12px_rgba(68,80,224,0.8)] transition-all duration-500 hover:-translate-y-1 hover:bg-graphite sm:right-8"
          aria-label="Back to top"
        >
          <ArrowUp size={18} strokeWidth={2} className="transition-transform duration-500 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  )
}
