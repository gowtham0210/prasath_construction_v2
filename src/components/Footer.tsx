import { useState, type FormEvent, type ReactElement } from 'react'
import { AlertCircle, ArrowRight, CheckCircle2, ChevronRight, Clock, Loader2, Mail, MapPin, Phone } from 'lucide-react'
import Logo from './Logo'
import { Stagger } from './Reveal'
import { company } from '../config/company'
import { services } from '../data/services'
import { projects } from '../data/projects'
import { STILLS } from '../data/media'
import { submitSubscribe } from '../lib/enquiry'

const quick = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/packages', label: 'Packages' },
  { href: '/contact', label: 'Contact' },
]

const icon = (d: ReactElement) => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
    {d}
  </svg>
)
const socialIcons: Record<string, ReactElement> = {
  Facebook: icon(<path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z" />),
  Instagram: icon(<path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9zM12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 1.8a2.7 2.7 0 1 0 0 5.4 2.7 2.7 0 0 0 0-5.4zm4.7-2.6a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" />),
  YouTube: icon(<path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8C22 15.2 22 12 22 12s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z" />),
  LinkedIn: icon(<path d="M5.2 8.8h3V19h-3V8.8zM6.7 4a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zM10.6 8.8h2.9v1.4c.4-.8 1.5-1.7 3.1-1.7 3.2 0 3.8 2.1 3.8 4.8V19h-3v-5c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6V19h-3V8.8z" />),
}

/** The site footer: brand and contact, quick links, services, featured projects and an email sign-up. */
export default function Footer() {
  const social = [
    { href: company.social.facebook, label: 'Facebook' },
    { href: company.social.instagram, label: 'Instagram' },
    { href: company.social.youtube, label: 'YouTube' },
    { href: company.social.linkedin, label: 'LinkedIn' },
  ].filter((s) => s.href)

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const subscribe = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }
    setStatus('sending')
    try {
      await submitSubscribe(email.trim())
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  const heading = 'text-[1.1rem] font-semibold tracking-tight text-graphite'
  const rule = <span className="mt-3 block h-[2px] w-8 rounded-full bg-olive" aria-hidden="true" />
  const link = 'group inline-flex items-center gap-2 text-[0.9rem] text-ink-2 transition-colors duration-300 hover:text-olive'
  const row = 'flex items-start gap-3 text-[0.9rem] leading-relaxed text-ink-2'
  const featured = projects.slice(0, 5)

  return (
    <footer className="relative bg-white/75 pt-12 text-graphite backdrop-blur-xl sm:pt-14">
      <div className="container-x">
        <Stagger className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_1fr_1.2fr_1.25fr]" gap={0.1}>
          {/* brand and contact */}
          <div>
            <a href="/" aria-label={`${company.name} — home`} className="inline-block"><Logo /></a>
            <p className="mt-5 max-w-xs text-[0.9rem] leading-relaxed text-ink-2">Building modern homes with innovation, quality and trust. We turn your vision into beautiful, lasting spaces.</p>
            <ul className="mt-5 space-y-3">
              {company.address && <li className={row}><MapPin size={16} strokeWidth={1.8} className="mt-1 shrink-0 text-olive" aria-hidden="true" /><span>{company.address}</span></li>}
              {company.phone && (
                <li className={row}>
                  <Phone size={16} strokeWidth={1.8} className="mt-1 shrink-0 text-olive" aria-hidden="true" />
                  <span>
                    <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="link-line">{company.phone}</a>
                    {company.phone2 && <> / <a href={`tel:${company.phone2.replace(/\s/g, '')}`} className="link-line">{company.phone2}</a></>}
                  </span>
                </li>
              )}
              {company.email && <li className={row}><Mail size={16} strokeWidth={1.8} className="mt-1 shrink-0 text-olive" aria-hidden="true" /><a href={`mailto:${company.email}`} className="link-line break-all">{company.email}</a></li>}
              {company.hours && <li className={row}><Clock size={16} strokeWidth={1.8} className="mt-1 shrink-0 text-olive" aria-hidden="true" /><span>{company.hours}</span></li>}
            </ul>
            {social.length > 0 && (
              <ul className="mt-5 flex gap-3" aria-label="Social media">
                {social.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="grid h-10 w-10 place-items-center rounded-full bg-graphite/6 text-graphite transition-colors duration-300 hover:bg-olive hover:text-white">
                      {socialIcons[s.label]}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* quick links */}
          <nav aria-label="Footer">
            <h3 className={heading}>Quick Links</h3>
            {rule}
            <ul className="mt-5 space-y-3">
              {quick.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className={link}><ChevronRight size={14} strokeWidth={2} className="text-graphite/60 transition-colors group-hover:text-olive" aria-hidden="true" />{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* services */}
          <div>
            <h3 className={heading}>Explore</h3>
            {rule}
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.id}>
                  <a href={`/services/${s.id}`} className={link}><ChevronRight size={14} strokeWidth={2} className="text-graphite/60 transition-colors group-hover:text-olive" aria-hidden="true" />{s.title}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* featured projects */}
          <div>
            <h3 className={heading}>Featured Projects</h3>
            {rule}
            <ul className="mt-5 space-y-3">
              {featured.map((p) => (
                <li key={p.slug}>
                  <a href={`/projects/${p.slug}`} className="group flex items-center gap-3 text-[0.9rem] text-ink-2 transition-colors duration-300 hover:text-olive">
                    <img src={STILLS[p.cover].image} alt="" width={56} height={42} loading="lazy" decoding="async" className="h-[42px] w-14 shrink-0 rounded-md bg-[#dfe6f2] object-cover" />
                    <span className="min-w-0 flex-1 truncate">{p.name}</span>
                    <ArrowRight size={14} strokeWidth={1.8} className="shrink-0 opacity-50 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* subscribe */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className={heading}>Subscribe to Our Updates</h3>
            {rule}
            <p className="mt-5 max-w-xs text-[0.9rem] leading-relaxed text-ink-2">Get the latest projects, design ideas and construction tips.</p>
            {status === 'sent' ? (
              <p role="status" className="mt-5 flex items-center gap-2.5 rounded-full bg-olive/10 px-5 py-3 text-[0.9rem] font-medium text-olive"><CheckCircle2 size={18} aria-hidden="true" /> Thank you, you are subscribed.</p>
            ) : (
              <form onSubmit={subscribe} noValidate className="mt-5" aria-label="Subscribe to updates">
                <div className="flex items-center gap-2 rounded-full border border-graphite/12 bg-white py-1.5 pl-4 pr-1.5 focus-within:border-olive focus-within:shadow-[0_0_0_4px_rgba(68,80,224,0.12)]">
                  <Mail size={16} strokeWidth={1.7} className="shrink-0 text-ink-3" aria-hidden="true" />
                  <label htmlFor="footer-email" className="sr-only">Email address</label>
                  <input id="footer-email" type="email" autoComplete="email" inputMode="email" placeholder="Enter your email address" value={email} onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }} className="min-w-0 flex-1 bg-transparent py-2 text-[0.9rem] text-graphite placeholder:text-ink-3 focus:outline-none" aria-invalid={status === 'error'} />
                  <button type="submit" disabled={status === 'sending'} aria-label="Subscribe" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-graphite text-white transition-colors hover:bg-olive disabled:opacity-70">
                    {status === 'sending' ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} strokeWidth={1.8} />}
                  </button>
                </div>
                {status === 'error' && <p role="alert" className="mt-2 flex items-start gap-2 text-sm text-[#c0452a]"><AlertCircle size={15} className="mt-0.5 shrink-0" /> {message}</p>}
              </form>
            )}
            <div className="mt-6 flex items-end gap-5 text-ink-3" aria-hidden="true">
              <p className="font-serif text-[1.15rem] italic leading-tight">Build Better<br />Live Better</p>
              <svg viewBox="0 0 120 60" className="h-12 w-24 text-graphite/25" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"><path d="M6 56V26L40 6l34 20v30M20 56V32h20v24M74 56V30l16-10 24 14v22" /></svg>
            </div>
          </div>
        </Stagger>

        <div className="mt-12 flex flex-col gap-2 border-t border-graphite/10 py-5 text-[0.8rem] text-ink-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {company.legalName || company.name}. All rights reserved.</p>
          <a href="/privacy" className="link-line w-fit hover:text-graphite">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}
