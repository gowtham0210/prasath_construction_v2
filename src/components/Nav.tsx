import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import Logo from './Logo'
import Magnetic from './Magnetic'
import { company, whatsappLink } from '../config/company'
import { ScrollTrigger, scrollToId, startScroll, stopScroll } from '../lib/smooth'

const links = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'packages', label: 'Packages' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav({ visible }: { visible: boolean }) {
  const [solid, setSolid] = useState(false)
  const [active, setActive] = useState('top')
  const [open, setOpen] = useState(false)
  const firstLink = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 90)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // the underline marks the page you are on: it stays on Home however far you scroll the home page
  useEffect(() => {
    const onHash = () => {
      const h = location.hash
      const page = h.match(/^#\/(about|services|projects|gallery|packages|contact)/)
      if (page) {
        setActive(page[1])
      } else if (!/^#\/(project|privacy)/.test(h)) {
        setActive('top')
      }
    }
    onHash()
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // full-screen menu: lock scrolling, close on Escape
  useEffect(() => {
    if (!open) return
    stopScroll()
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    firstLink.current?.focus()
    return () => {
      startScroll()
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    setTimeout(() => scrollToId(id), open ? 450 : 0)
  }

  return (
    <>
      <motion.header
        data-top={!solid && !open ? 'true' : 'false'}
        className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color,box-shadow,color] duration-500 ${open ? 'text-white' : 'text-graphite'} ${
          solid && !open ? 'border-b border-graphite/10 bg-white/75 shadow-[0_14px_40px_-24px_rgba(30,50,100,0.35)] backdrop-blur-xl' : 'border-b border-transparent'
        }`}
        initial={{ y: -40, opacity: 0 }}
        animate={visible ? { y: 0, opacity: 1 } : { y: -40, opacity: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="container-x flex h-[76px] items-center justify-between gap-6" aria-label="Primary">
          <button onClick={() => go('top')} aria-label={`${company.name} — back to top`} className="shrink-0">
            <Logo />
          </button>

          <ul className="hidden items-center gap-9 lg:flex">
            {links.map((l) => (
              <li key={l.id} className="relative">
                <button
                  onClick={() => go(l.id)}
                  aria-current={active === l.id ? 'true' : undefined}
                  className={`py-2 text-[0.95rem] font-medium transition-colors duration-300 ${active === l.id ? 'text-graphite' : 'text-graphite/55 hover:text-graphite'}`}
                >
                  {l.label}
                </button>
                {active === l.id && <motion.span layoutId="nav-indicator" className="absolute inset-x-0 -bottom-0.5 h-px bg-olive" transition={{ type: 'spring', stiffness: 380, damping: 36 }} />}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Magnetic as="button" onClick={() => go('contact')} className="btn-primary hidden sm:inline-flex">
              Book a Consultation
              <ArrowUpRight size={15} strokeWidth={1.6} />
            </Magnetic>
            <button
              className="grid h-11 w-11 place-items-center rounded-full border border-current/25 lg:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={20} strokeWidth={1.4} /> : <Menu size={20} strokeWidth={1.4} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto hero-sky px-6 pb-10 pt-28 text-graphite"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1, transition: { delay: 0.3 + i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <button ref={i === 0 ? firstLink : undefined} onClick={() => go(l.id)} className="flex w-full items-baseline gap-5 py-2 text-left">
                    <span className="eyebrow w-8 text-olive">{String(i + 1).padStart(2, '0')}</span>
                    <span className="display text-[clamp(2.4rem,11vw,4rem)]">{l.label}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-5">
              <button onClick={() => go('contact')} className="btn-primary justify-between">
                Book a Consultation
                <ArrowUpRight size={16} strokeWidth={1.6} />
              </button>
              <div className="space-y-1 text-sm text-graphite/60">
                {company.email && <a href={`mailto:${company.email}`} className="block">{company.email}</a>}
                {company.phone && <a href={`tel:${company.phone.replace(/\s/g, '')}`} className="block">{company.phone}</a>}
                {whatsappLink() && <a href={whatsappLink()} target="_blank" rel="noreferrer" className="block">WhatsApp us</a>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
