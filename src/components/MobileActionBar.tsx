import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Phone, Send } from 'lucide-react'
import { company, whatsappLink } from '../config/company'
import { scrollToId } from '../lib/smooth'

const track = (cta: string) => {
  // lets any analytics tool count the taps (for example Google Tag Manager's dataLayer)
  ;(window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'cta_click', cta, placement: 'mobile_bar' })
  window.dispatchEvent(new CustomEvent('cta_click', { detail: { cta, placement: 'mobile_bar' } }))
}

/**
 * On phones, a bar fixed to the bottom of the screen with the three actions people take first: call, WhatsApp, or ask for a quote.
 * It steps out of the way while the menu is open and on the Contact page, where the form is already on screen.
 */
export default function MobileActionBar({ hidden = false }: { hidden?: boolean }) {
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    const el = document.documentElement
    const read = () => setMenu(el.dataset.menu === 'open')
    const mo = new MutationObserver(read)
    mo.observe(el, { attributes: true, attributeFilter: ['data-menu'] })
    read()
    return () => mo.disconnect()
  }, [])

  const wa = whatsappLink('Hello, I would like to get a quote for building a home.')
  const tel = company.phone ? `tel:${company.phone.replace(/\s/g, '')}` : ''
  const actions = [
    tel && { key: 'call', label: 'Call', href: tel, Icon: Phone },
    wa && { key: 'whatsapp', label: 'WhatsApp', href: wa, Icon: MessageCircle, external: true },
  ].filter(Boolean) as { key: string; label: string; href: string; Icon: typeof Phone; external?: boolean }[]
  if (hidden || menu) return null

  const base = 'flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-3 text-[0.85rem] font-medium whitespace-nowrap'
  return (
    <motion.nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-2 sm:hidden"
      initial={{ y: 90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
    >
      <div className="mx-auto flex max-w-md gap-2 rounded-full border border-white/70 bg-white/85 p-1.5 shadow-[0_20px_50px_-18px_rgba(15,18,24,0.55)] backdrop-blur-xl">
        {actions.map(({ key, label, href, Icon, external }) => (
          <a key={key} href={href} onClick={() => track(key)} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} className={`${base} bg-graphite/5 text-graphite active:bg-graphite active:text-white`}>
            <Icon size={16} strokeWidth={1.8} />
            {label}
          </a>
        ))}
        <button
          onClick={() => {
            track('quote')
            scrollToId('contact')
          }}
          className={`${base} bg-graphite text-white`}
        >
          <Send size={16} strokeWidth={1.8} />
          Get a quote
        </button>
      </div>
    </motion.nav>
  )
}
