import { useState } from 'react'
import { Reveal } from './Reveal'
import { packages } from '../data/prasath'
import { scrollToId } from '../lib/smooth'

const rate = (price: string) => Number(price.replace(/,/g, ''))
const inr = (n: number) => '₹' + new Intl.NumberFormat('en-IN').format(Math.round(n))
const lakh = (n: number) => `₹${(n / 100000).toFixed(1).replace(/\.0$/, '')} lakh`

/** Built-up area × the per-sq.ft rate of each package, with the range between the lowest and the highest. */
export default function CostEstimator() {
  const [area, setArea] = useState('1500')
  const sqft = Math.max(0, Math.min(100000, Number(area.replace(/\D/g, '')) || 0))
  const rates = packages.map((p) => rate(p.price))
  const lo = sqft * Math.min(...rates)
  const hi = sqft * Math.max(...rates)

  return (
    <Reveal className="mx-auto mt-16 max-w-6xl">
      <div className="card !rounded-[32px] p-6 sm:p-10">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <h3 className="display text-[clamp(1.7rem,3vw,2.6rem)]">Estimate my cost</h3>
            <p className="mt-2 max-w-xl text-ink-2">Enter your built-up area to see what each package would come to. It is an indication; your fixed-cost estimate is confirmed after a consultation.</p>
          </div>
          <div>
            <label htmlFor="est-area" className="eyebrow mb-1.5 block text-ink-2">Built-up area (sq.ft)</label>
            <input id="est-area" inputMode="numeric" value={area} onChange={(e) => setArea(e.target.value)} className="w-full rounded-2xl border border-graphite/10 bg-white px-4 py-3 text-lg font-medium focus:border-olive focus:shadow-[0_0_0_4px_rgba(68,80,224,0.12)] focus:outline-none lg:w-56" />
          </div>
        </div>

        <ul className="mt-8 grid gap-4 md:grid-cols-3" aria-live="polite">
          {packages.map((p) => (
            <li key={p.name} className={`rounded-[24px] p-5 ${p.popular ? 'bg-olive/10 ring-1 ring-olive/30' : 'bg-white/80'}`}>
              <p className="text-sm font-medium text-ink-2">{p.name} · ₹{p.price} / sq.ft</p>
              <p className="mt-2 text-[1.9rem] font-semibold leading-none tracking-tight">{sqft ? inr(sqft * rate(p.price)) : '—'}</p>
              {sqft > 0 && <p className="mt-1 text-sm text-ink-2">about {lakh(sqft * rate(p.price))}</p>}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[1rem] font-medium">{sqft ? <>Your range: {lakh(lo)} – {lakh(hi)}</> : 'Enter an area to see your range.'}</p>
          <button onClick={() => scrollToId('contact')} className="btn-primary w-fit whitespace-nowrap">Get my fixed estimate</button>
        </div>
      </div>
    </Reveal>
  )
}
