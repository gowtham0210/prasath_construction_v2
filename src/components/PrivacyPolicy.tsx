import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { company } from '../config/company'
import { startScroll, stopScroll } from '../lib/smooth'

/**
 * A plain-language privacy notice for the enquiry form. This is a TEMPLATE: have it reviewed and adapted to the
 * company's actual data handling and local law before launch.
 */
export default function PrivacyPolicy({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    stopScroll()
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    ref.current?.focus()
    return () => {
      document.documentElement.style.overflow = prev
      startScroll()
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <motion.div
      ref={ref}
      tabIndex={-1}
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label="Privacy policy"
      className="fixed inset-0 z-[70] overflow-y-auto bg-ivory text-graphite outline-none"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <button onClick={onClose} className="mb-12 inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em]" aria-label="Close privacy policy">
          <X size={16} strokeWidth={1.4} /> Close
        </button>
        <h1 className="display text-[clamp(2.6rem,6vw,5rem)]">Privacy policy</h1>
        <div className="mt-10 space-y-8 text-graphite/80">
          <p>This notice explains how {company.name} handles the information you send through this website.</p>
          <section>
            <h2 className="font-serif text-2xl text-graphite">What we collect</h2>
            <p className="mt-3">When you submit the enquiry form we receive the details you enter: your name, phone number, email address, project type, plot details, approximate budget, preferred location and project description.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-graphite">How we use it</h2>
            <p className="mt-3">We use this information only to respond to your enquiry and to discuss a potential project with you. We do not sell your information.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-graphite">Storage and sharing</h2>
            <p className="mt-3">Enquiries are stored by our enquiry service and shared only with the people who need them to respond. We keep them for as long as needed to handle your enquiry and any resulting project, unless you ask us to delete them sooner.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-graphite">Your choices</h2>
            <p className="mt-3">You can ask us to access, correct or delete the information you sent us{company.email ? ` by writing to ${company.email}` : ' by contacting us through the details on this site'}.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl text-graphite">Cookies and analytics</h2>
            <p className="mt-3">This site does not set tracking cookies of its own. If analytics or third-party embeds are added later, this notice will be updated.</p>
          </section>
          <p className="text-sm text-ink-2">Last updated {new Date().getFullYear()}. This is a template notice; the company should review it against its actual data practices and applicable law.</p>
        </div>
      </div>
    </motion.div>
  )
}
