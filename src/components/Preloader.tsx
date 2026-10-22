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

/** small sparks that drift up from the phoenix (fixed values, so the splash looks the same every time) */
const embers = [
  { x: 14, s: 4, h: 120, dx: -14, d: 0.0, t: 2.1 },
  { x: 24, s: 3, h: 150, dx: 10, d: 0.5, t: 2.6 },
  { x: 33, s: 5, h: 110, dx: -8, d: 1.1, t: 2.2 },
  { x: 42, s: 3, h: 170, dx: 16, d: 0.3, t: 2.8 },
  { x: 50, s: 4, h: 130, dx: -12, d: 0.9, t: 2.3 },
  { x: 58, s: 3, h: 160, dx: 12, d: 1.4, t: 2.7 },
  { x: 66, s: 5, h: 115, dx: -10, d: 0.2, t: 2.2 },
  { x: 75, s: 3, h: 145, dx: 14, d: 0.8, t: 2.5 },
  { x: 84, s: 4, h: 125, dx: -6, d: 1.2, t: 2.4 },
  { x: 38, s: 2, h: 185, dx: 8, d: 1.7, t: 3.0 },
  { x: 62, s: 2, h: 180, dx: -9, d: 0.6, t: 2.9 },
  { x: 20, s: 2, h: 140, dx: 6, d: 1.9, t: 2.6 },
]

/**
 * Splash screen, in the same sky-to-peach light as the hero: the phoenix logo rises out of a turning glow with rings of light and rising embers, the name rises letter by letter,
 * a line fills along the bottom, and the whole screen lifts away like the rounded frames used across the site.
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

      {!reduced && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-graphite/10" aria-hidden="true">
          <span className="block h-full origin-left bg-gradient-to-r from-[#8fb3ea] via-[#ff9a3c] to-[#4450e0]" style={{ animation: 'fillBar 2.5s cubic-bezier(0.65,0,0.35,1) forwards' }} />
        </span>
      )}

      <div className="relative flex flex-col items-center gap-7 px-6 text-center">
        {/* the phoenix: a glowing halo turns behind it, rings of light spread out, embers rise, and it settles with a slow breath */}
        <div className="relative grid h-40 w-48 place-items-center sm:h-48 sm:w-56">
          {!reduced && (
            <>
              <span
                className="absolute left-1/2 top-1/2 h-[19rem] w-[19rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-2xl"
                style={{ background: 'conic-gradient(from 0deg, rgba(255,140,40,0) 0deg, rgba(255,150,50,0.55) 70deg, rgba(255,210,120,0) 140deg, rgba(255,120,40,0.45) 230deg, rgba(255,140,40,0) 300deg)', animation: 'spinGlow 7s linear infinite' }}
                aria-hidden="true"
              />
              {[0, 0.9, 1.8].map((d) => (
                <motion.span
                  key={d}
                  className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ff9a3c]/60"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: [0.5, 2.6], opacity: [0, 0.7, 0] }}
                  transition={{ duration: 2.4, delay: 0.5 + d, repeat: Infinity, ease: 'easeOut' }}
                  aria-hidden="true"
                />
              ))}
              {embers.map((e, i) => (
                <motion.span
                  key={i}
                  className="absolute bottom-6 rounded-full bg-[#ffb347]"
                  style={{ left: `${e.x}%`, width: e.s, height: e.s, boxShadow: '0 0 10px 2px rgba(255,150,40,0.8)' }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: [0, -e.h], x: [0, e.dx], opacity: [0, 1, 0] }}
                  transition={{ duration: e.t, delay: 0.7 + e.d, repeat: Infinity, ease: 'easeOut' }}
                  aria-hidden="true"
                />
              ))}
            </>
          )}
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.4, y: 40, rotate: -6, filter: 'blur(14px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src="/logo.png"
              alt=""
              width={160}
              height={152}
              draggable={false}
              className="h-28 w-auto object-contain sm:h-36"
              animate={reduced ? undefined : { scale: [1, 1.05, 1], filter: ['drop-shadow(0 14px 28px rgba(240,120,40,0.35))', 'drop-shadow(0 18px 48px rgba(255,140,40,0.8))', 'drop-shadow(0 14px 28px rgba(240,120,40,0.35))'] }}
              transition={{ duration: 2.2, delay: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
          </motion.div>
        </div>

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

        <motion.p className="text-sm text-ink-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.8 }}>
          Your vision. Our foundation.
        </motion.p>

        <div className="flex items-center gap-3 text-xs font-medium text-ink-2" aria-hidden="true">
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
