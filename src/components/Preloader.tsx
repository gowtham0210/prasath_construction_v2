import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { company } from '../config/company'
import { usePrefersReducedMotion } from '../hooks/useEnv'

interface Props {
  /** called as the splash starts to lift, so the page can begin its own entrance */
  onReveal: () => void
  /** called once the splash has fully left the screen */
  onDone: () => void
}

const draw = (delay: number, dur = 0.9) => ({
  pathLength: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  style: { animation: `drawLine ${dur}s ${delay}s cubic-bezier(0.65,0,0.35,1) forwards` },
})

/**
 * Splash screen, in the same sky-to-peach light as the hero: a modern home draws itself line by line, its windows
 * light up, the name rises letter by letter, and the whole screen lifts away like the rounded frames used across the site.
 */
export default function Splash({ onReveal, onDone }: Props) {
  const reduced = usePrefersReducedMotion()
  const [leave, setLeave] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => {
      setLeave(true)
      onReveal()
    }, reduced ? 400 : 2500)
    return () => clearTimeout(t)
  }, [reduced, onReveal])

  const words = company.name.toUpperCase().split(' ')
  let n = 0

  return (
    <motion.div
      className={`hero-sky fixed inset-0 z-[100] grid place-items-center overflow-hidden text-graphite ${leave ? 'rounded-b-[44px]' : ''}`}
      role="status"
      aria-label={`${company.name} — welcome`}
      initial={false}
      animate={leave ? { y: '-104%' } : { y: 0 }}
      transition={{ duration: reduced ? 0.01 : 1.05, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => leave && onDone()}
    >
      <span className="pointer-events-none absolute -left-24 top-16 h-[420px] w-[420px] rounded-full bg-white/55 blur-3xl" style={{ animation: 'drift 14s ease-in-out infinite' }} aria-hidden="true" />
      <span className="pointer-events-none absolute -right-16 bottom-10 h-[380px] w-[380px] rounded-full bg-[#ffd9bd]/70 blur-3xl" style={{ animation: 'drift 18s ease-in-out -6s infinite reverse' }} aria-hidden="true" />
      <span className="pointer-events-none absolute left-1/2 top-1/3 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[#7f8bff]/25 blur-3xl" style={{ animation: 'drift 20s ease-in-out -10s infinite' }} aria-hidden="true" />

      <div className="relative flex flex-col items-center gap-7 px-6 text-center">
        <svg viewBox="0 0 160 110" className="h-28 w-40 sm:h-32 sm:w-48" fill="none" aria-hidden="true">
          <path d="M4 100H156" stroke="#0f1218" strokeWidth="1.6" strokeLinecap="round" {...draw(0.1, 0.8)} />
          <path d="M18 100V58H112V100" stroke="#0f1218" strokeWidth="2" strokeLinejoin="round" {...draw(0.4)} />
          <path d="M34 58V30H98V58" stroke="#0f1218" strokeWidth="2" strokeLinejoin="round" {...draw(0.8)} />
          <path d="M12 58H118M28 30H104" stroke="#0f1218" strokeWidth="2.2" strokeLinecap="round" {...draw(1.2, 0.7)} />
          <path d="M112 100V44H140V100" stroke="#0f1218" strokeWidth="2" strokeLinejoin="round" {...draw(1.0)} />
          <path d="M60 100V76H78V100" stroke="#4450e0" strokeWidth="2.4" strokeLinejoin="round" {...draw(1.5, 0.6)} />
          {[
            { x: 40, y: 38, w: 22, h: 14 },
            { x: 70, y: 38, w: 22, h: 14 },
            { x: 26, y: 68, w: 24, h: 18 },
            { x: 88, y: 68, w: 16, h: 18 },
          ].map((w, i) => (
            <g key={i}>
              <rect x={w.x} y={w.y} width={w.w} height={w.h} rx="1.5" stroke="#0f1218" strokeWidth="1.6" {...draw(1.4 + i * 0.1, 0.6)} />
              <rect x={w.x} y={w.y} width={w.w} height={w.h} rx="1.5" fill="#f0c9ae" style={{ opacity: 0, animation: `windowOn 0.9s ${1.9 + i * 0.12}s ease-out forwards` }} />
            </g>
          ))}
        </svg>

        <div className="flex flex-col items-center gap-1 text-[clamp(1.5rem,6vw,2.6rem)] font-semibold tracking-[0.3em]" aria-hidden="true">
          {words.map((w, wi) => (
            <div key={wi} className="flex overflow-hidden">
              {w.split('').map((l) => (
                <motion.span key={n} initial={{ y: '115%' }} animate={{ y: 0 }} transition={{ delay: 1.1 + n++ * 0.045, duration: 0.85, ease: [0.16, 1, 0.3, 1] }} className="inline-block">
                  {l}
                </motion.span>
              ))}
            </div>
          ))}
        </div>

        <motion.p className="text-sm text-graphite/60" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.8 }}>
          Your vision. Our foundation.
        </motion.p>

        <div className="flex items-center gap-3 text-xs font-medium text-graphite/55" aria-hidden="true">
          {['Design', 'Build', 'Handover'].map((t, i) => (
            <motion.span key={t} className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5 backdrop-blur" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.9 + i * 0.18, duration: 0.6 }}>
              <span className="h-1.5 w-1.5 rounded-full bg-olive" style={{ animation: `pulseDot 1.6s ease-out ${2 + i * 0.18}s infinite` }} />
              {t}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
