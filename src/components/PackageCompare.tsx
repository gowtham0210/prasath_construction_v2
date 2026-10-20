import { Check, Minus } from 'lucide-react'
import { Reveal } from './Reveal'
import { packages, packagesCompare } from '../data/prasath'

/** The three packages side by side, one row per part of the build. On phones each row becomes a small card. */
export default function PackageCompare() {
  return (
    <Reveal className="mx-auto mt-16 max-w-6xl">
      <h3 className="display text-center text-[clamp(1.7rem,3vw,2.6rem)]">Compare the packages</h3>

      <div className="card mt-8 hidden overflow-hidden !rounded-[32px] md:block">
        <table className="w-full table-fixed border-collapse text-left">
          <caption className="sr-only">What each construction package includes</caption>
          <thead>
            <tr className="border-b border-graphite/10">
              <th scope="col" className="w-[22%] p-5"><span className="sr-only">Part of the build</span></th>
              {packages.map((p) => (
                <th key={p.name} scope="col" className={`p-5 align-bottom ${p.popular ? 'bg-olive/8' : ''}`}>
                  <span className="eyebrow block text-olive">{p.tag}</span>
                  <span className="mt-1 block text-[1.25rem] font-medium tracking-tight">{p.name}</span>
                  <span className="mt-1 block text-sm font-normal text-ink-2">₹{p.price} / sq.ft</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {packagesCompare.map((r) => (
              <tr key={r.label} className="border-b border-graphite/10 last:border-0">
                <th scope="row" className="p-5 text-[0.95rem] font-medium">{r.label}</th>
                {r.cells.map((c, i) => (
                  <td key={i} className={`p-5 text-[0.92rem] ${packages[i].popular ? 'bg-olive/8' : ''}`}>
                    {c ? (
                      <span className="flex items-start gap-2.5"><Check size={15} strokeWidth={2.4} className="mt-0.5 shrink-0 text-olive" />{c}</span>
                    ) : (
                      <span className="flex items-center gap-2 text-ink-3"><Minus size={15} aria-hidden="true" /> <span>Not listed</span></span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="mt-8 space-y-4 md:hidden">
        {packagesCompare.map((r) => (
          <li key={r.label} className="card !rounded-[24px] p-5">
            <p className="text-[1.05rem] font-medium">{r.label}</p>
            <dl className="mt-3 space-y-2.5">
              {r.cells.map((c, i) => (
                <div key={i} className="flex items-start justify-between gap-4 text-[0.9rem]">
                  <dt className="shrink-0 font-medium text-graphite/80">{packages[i].name}</dt>
                  <dd className={`text-right ${c ? '' : 'text-ink-3'}`}>{c ?? 'Not listed'}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      <p className="mx-auto mt-5 max-w-2xl text-center text-sm text-ink-2">“Not listed” means that item is not named for that package. Ask us and we will confirm it in your written estimate.</p>
    </Reveal>
  )
}
