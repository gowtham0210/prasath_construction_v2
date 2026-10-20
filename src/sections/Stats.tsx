import { useLayoutEffect, useRef } from 'react'
import SectionHead from '../components/SectionHead'
import { Stagger } from '../components/Reveal'
import { stats } from '../data/prasath'
import { gsap } from '../lib/smooth'
import { usePrefersReducedMotion } from '../hooks/useEnv'

/** Portfolio at a glance: four numbers that count up when they arrive. */
export default function Stats({ id = 'stats' }: { id?: string }) {
  const root = useRef<HTMLElement | null>(null)
  const reduced = usePrefersReducedMotion()

  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const end = Number(el.dataset.count)
        const decimals = Number(el.dataset.decimals ?? 0)
        const o = { v: 0 }
        gsap.to(o, {
          v: end, duration: 2.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => (el.textContent = o.v.toFixed(decimals)),
        })
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])

  return (
    <section id={id} ref={root} className="relative py-[clamp(30px,4.5vh,56px)] text-graphite" aria-labelledby={`${id}-title`}>
      <div className="container-x">
        <SectionHead id={`${id}-title`} chip="Portfolio at a glance" lines={['Numbers that', 'speak for themselves.']} accent={['themselves.']} text="Every figure is from completed projects — tracked, documented, and verified by our clients." />
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6" gap={0.12}>
          {stats.map((s) => (
            <article key={s.label} className="card card-hover group relative overflow-hidden p-7 text-center">
              <img src={`/prasath/stat_${s.image}.png`} alt="" width={72} height={72} loading="lazy" className="pointer-events-none relative mx-auto mb-5 h-16 w-16 object-contain opacity-90 transition-transform duration-700 group-hover:-rotate-6 group-hover:scale-110" aria-hidden="true" />
              <p className="relative text-[clamp(2.8rem,5vw,4.2rem)] font-semibold leading-none tracking-tight">
                <span data-count={s.value} data-decimals={s.decimals ?? 0}>{reduced ? s.value : '0'}</span>
                <span className="accent-word">{s.suffix}</span>
              </p>
              <p className="relative mt-3 text-[1.05rem] font-medium">{s.label}</p>
              <p className="relative mt-1 text-sm text-ink-2">{s.note}</p>
            </article>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
