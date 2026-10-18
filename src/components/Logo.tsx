import { company } from '../config/company'

export function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <rect x="1" y="1" width="30" height="30" stroke="currentColor" strokeWidth="1.2" />
      <path d="M7 25V12l9-6.5 9 6.5v13" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M13 25v-7h6v7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
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
