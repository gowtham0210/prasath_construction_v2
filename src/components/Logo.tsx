import { company } from '../config/company'

/** The brand mark: the phoenix, as on the company's own website. */
export function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  return <img src="/logo.png" alt="" width={160} height={152} draggable={false} className={`${className} object-contain`} aria-hidden="true" />
}

export default function Logo({ className = '' }: { className?: string }) {
  const [first, ...rest] = company.name.split(' ')
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.15rem] font-semibold uppercase tracking-[0.2em]">{first}</span>
        {rest.length > 0 && <span className="mt-1 text-[0.62rem] font-medium uppercase tracking-[0.34em] opacity-65">{rest.join(' ')}</span>}
      </span>
    </span>
  )
}
