import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ArrowUpRight, CheckCircle2, Clock, Loader2, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { company, whatsappLink } from '../config/company'
import Magnetic from '../components/Magnetic'
import { Reveal, RevealWords, Stagger } from '../components/Reveal'
import { budgetOptions, EnquiryError, plotOptions, projectTypes, submitEnquiry, validate, type EnquiryErrors, type EnquiryPayload } from '../lib/enquiry'
import { useEnquiryPrefill } from '../lib/store'

const empty: EnquiryPayload = {
  fullName: '', phone: '', email: '', projectType: '', plotAvailability: '', budget: budgetOptions[0], location: '', message: '', website: '',
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

const fieldBase =
  'w-full rounded-2xl border border-graphite/10 bg-white px-4 py-3 text-graphite shadow-[0_8px_24px_-18px_rgba(40,60,110,0.5)] placeholder:text-graphite/35 transition-all duration-300 focus:border-olive focus:shadow-[0_0_0_4px_rgba(68,80,224,0.12)] focus:outline-none [&:-webkit-autofill]:[-webkit-text-fill-color:#0f1218]'

const required: (keyof EnquiryPayload)[] = ['fullName', 'phone', 'email', 'projectType', 'plotAvailability', 'message']
const steps = ['Book your free 60-minute session.', 'A senior architect calls you for a consultation.', 'You walk away with a floor-plan direction and a fixed estimate.']

export default function Contact() {
  const prefill = useEnquiryPrefill()
  const [vals, setVals] = useState<EnquiryPayload>(empty)
  const [errors, setErrors] = useState<EnquiryErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState('')
  const form = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    if (prefill) setVals((v) => ({ ...v, projectType: prefill }))
  }, [prefill])

  const set = (k: keyof EnquiryPayload) => (e: { target: { value: string } }) => {
    setVals((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    const er = validate(vals)
    setErrors(er)
    const first = Object.keys(er)[0]
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setStatus('sending')
    setServerError('')
    try {
      await submitEnquiry(vals)
      setStatus('sent')
    } catch (err) {
      setServerError(err instanceof EnquiryError ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const wa = whatsappLink(`Hello, I would like to discuss building a home. ${vals.projectType ? `(${vals.projectType})` : ''}`)

  const label = (id: string, text: string, req = true) => (
    <label htmlFor={id} className="eyebrow mb-1.5 block text-graphite/60">
      {text}
      {req && <span className="text-olive"> *</span>}
    </label>
  )
  const err = (k: keyof EnquiryPayload) =>
    errors[k] ? (
      <p id={`${k}-err`} role="alert" className="mt-2 flex items-center gap-2 text-sm text-[#c0452a]">
        <AlertCircle size={14} /> {errors[k]}
      </p>
    ) : null
  const aria = (k: keyof EnquiryPayload) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${k}-err` : undefined })

  const done = required.filter((k) => String(vals[k]).trim().length > 0).length
  const methods = [
    company.email && { icon: Mail, text: company.email, href: `mailto:${company.email}` },
    company.phone && { icon: Phone, text: company.phone, href: `tel:${company.phone.replace(/\s/g, '')}` },
    company.phone2 && { icon: Phone, text: company.phone2, href: `tel:${company.phone2.replace(/\s/g, '')}` },
    company.address && { icon: MapPin, text: company.address, href: undefined as string | undefined },
    company.hours && { icon: Clock, text: company.hours, href: undefined as string | undefined },
  ].filter(Boolean) as { icon: typeof Mail; text: string; href?: string }[]
  const pill = 'group flex items-center gap-3 rounded-[28px] bg-white/75 p-1.5 pr-5 backdrop-blur transition-all duration-500'

  return (
    <section id="contact" className="relative py-[clamp(70px,11vh,140px)] text-graphite" aria-labelledby="contact-form-title">
      <div className="container-x">
        <Reveal y={90}>
          <div className="grid overflow-hidden rounded-[32px] bg-white/70 shadow-[0_50px_110px_-50px_rgba(40,60,110,0.6)] backdrop-blur-xl lg:grid-cols-12 lg:rounded-[44px]">
            {/* left: the invitation */}
            <div className="hero-sky relative overflow-hidden p-7 sm:p-10 lg:col-span-5 lg:p-12">
              <span className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-white/50 blur-3xl" style={{ animation: 'drift 16s ease-in-out infinite' }} aria-hidden="true" />
              <span className="pointer-events-none absolute -bottom-10 right-0 h-72 w-72 rounded-full bg-[#ffd9bd]/60 blur-3xl" style={{ animation: 'drift 20s ease-in-out -7s infinite reverse' }} aria-hidden="true" />
              <div className="relative">
                <Reveal>
                  <span className="chip">Contact</span>
                </Reveal>
                <h2 id="contact-form-title" className="display mt-5 text-[clamp(2.2rem,4vw,3.8rem)] !leading-[1.02]" aria-label="Book your free 60-min session.">
                  <RevealWords as="span" lines={['Book your free', '60-min session.']} italic={['session']} stagger={0.09} />
                </h2>
                <Reveal className="mt-4 max-w-sm text-[1rem] leading-relaxed text-graphite/65" delay={0.1}>
                  No obligations. Walk away with a floor-plan direction and a fixed estimate.
                </Reveal>

                {(methods.length > 0 || wa) && (
                  <Stagger className="mt-7 flex flex-col gap-2.5" gap={0.1}>
                    {methods.map(({ icon: Icon, text, href }) => {
                      const inner = (
                        <>
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-graphite text-white transition-transform duration-500 group-hover:rotate-12">
                            <Icon size={16} strokeWidth={1.7} />
                          </span>
                          <span className="min-w-0 text-sm font-medium leading-snug py-1.5">{text}</span>
                        </>
                      )
                      return href ? (
                        <a key={text} href={href} className={`${pill} hover:-translate-y-0.5 hover:bg-white`}>{inner}</a>
                      ) : (
                        <div key={text} className={pill}>{inner}</div>
                      )
                    })}
                    {wa && (
                      <a href={wa} target="_blank" rel="noreferrer" className={`${pill} hover:-translate-y-0.5 hover:bg-white`}>
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-olive text-white transition-transform duration-500 group-hover:rotate-12">
                          <MessageCircle size={16} strokeWidth={1.7} />
                        </span>
                        <span className="text-sm font-medium">Chat on WhatsApp</span>
                      </a>
                    )}
                  </Stagger>
                )}

                {/* what happens next */}
                <div className="mt-9">
                  <p className="eyebrow text-graphite/50">What happens next</p>
                  <div className="relative mt-4">
                    <span className="absolute bottom-4 left-[15px] top-4 w-px bg-graphite/15" aria-hidden="true" />
                    <Stagger as="ol" className="space-y-4" gap={0.18}>
                      {steps.map((t, i) => (
                        <li key={t} className="relative flex items-center gap-4">
                          <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-xs font-semibold shadow-[0_8px_20px_-8px_rgba(40,60,110,0.5)]">
                            <span className="absolute inset-0 rounded-full border border-olive/40" style={{ animation: `pulseRing 2.8s ease-out ${i * 0.7}s infinite` }} />
                            {i + 1}
                          </span>
                          <span className="text-sm text-graphite/70">{t}</span>
                        </li>
                      ))}
                    </Stagger>
                  </div>
                </div>
              </div>
            </div>

            {/* right: the form */}
            <div className="relative p-6 sm:p-10 lg:col-span-7 lg:p-12">
              <AnimatePresence mode="wait">
                {status === 'sent' ? (
                  <motion.div key="sent" initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="grid min-h-[420px] place-content-center text-center" role="status" aria-live="polite">
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.2 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-olive/10">
                      <CheckCircle2 className="text-olive" size={40} strokeWidth={1.4} />
                    </motion.span>
                    <h3 className="display mt-6 text-[clamp(1.8rem,3.4vw,2.8rem)]">Thank you, {vals.fullName.split(' ')[0]}.</h3>
                    <p className="mx-auto mt-3 max-w-sm text-graphite/65">Your enquiry has been received. We will get back to you using the details you provided.</p>
                    <button
                      className="btn-ghost mx-auto mt-7"
                      onClick={() => {
                        setVals(empty)
                        setStatus('idle')
                      }}
                    >
                      Send another enquiry
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" ref={form} onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-x-5 gap-y-5 md:grid-cols-2" aria-describedby="form-status">
                    {/* a bar that fills as the form is completed */}
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between text-xs font-medium text-graphite/50">
                        <span>Your enquiry</span>
                        <span>{done} of {required.length} filled</span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-graphite/10">
                        <span className="block h-full w-full origin-left rounded-full bg-gradient-to-r from-[#8fb3ea] to-olive transition-transform duration-700 ease-[var(--ease-expo)]" style={{ transform: `scaleX(${done / required.length})` }} />
                      </div>
                    </div>

                    {/* honeypot: real visitors never see or fill this */}
                    <div className="absolute -left-[9999px]" aria-hidden="true">
                      <label htmlFor="website">Website</label>
                      <input id="website" name="website" tabIndex={-1} autoComplete="off" value={vals.website} onChange={set('website')} />
                    </div>

                    <div>
                      {label('fullName', 'Full name')}
                      <input id="fullName" name="fullName" autoComplete="name" className={fieldBase} placeholder="Your name" value={vals.fullName} onChange={set('fullName')} {...aria('fullName')} />
                      {err('fullName')}
                    </div>
                    <div>
                      {label('phone', 'Phone number')}
                      <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className={fieldBase} placeholder="+91 …" value={vals.phone} onChange={set('phone')} {...aria('phone')} />
                      {err('phone')}
                    </div>
                    <div className="md:col-span-2">
                      {label('email', 'Email address')}
                      <input id="email" name="email" type="email" autoComplete="email" className={fieldBase} placeholder="you@example.com" value={vals.email} onChange={set('email')} {...aria('email')} />
                      {err('email')}
                    </div>
                    <div>
                      {label('projectType', 'Preferred project type')}
                      <select id="projectType" name="projectType" className={`${fieldBase} [&>option]:text-graphite`} value={vals.projectType} onChange={set('projectType')} {...aria('projectType')}>
                        <option value="">Select…</option>
                        {projectTypes.map((t) => <option key={t}>{t}</option>)}
                      </select>
                      {err('projectType')}
                    </div>
                    <div>
                      {label('plotAvailability', 'Plot availability')}
                      <select id="plotAvailability" name="plotAvailability" className={`${fieldBase} [&>option]:text-graphite`} value={vals.plotAvailability} onChange={set('plotAvailability')} {...aria('plotAvailability')}>
                        <option value="">Select…</option>
                        {plotOptions.map((t) => <option key={t}>{t}</option>)}
                      </select>
                      {err('plotAvailability')}
                    </div>
                    <div>
                      {label('budget', 'Approximate budget', false)}
                      <select id="budget" name="budget" className={`${fieldBase} [&>option]:text-graphite`} value={vals.budget} onChange={set('budget')}>
                        {budgetOptions.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      {label('location', 'Preferred location', false)}
                      <input id="location" name="location" autoComplete="address-level2" className={fieldBase} placeholder="City or area" value={vals.location} onChange={set('location')} />
                    </div>
                    <div className="md:col-span-2">
                      {label('message', 'Project description')}
                      <textarea id="message" name="message" rows={4} className={`${fieldBase} resize-y`} placeholder="Your plot, your plans, the home you imagine…" value={vals.message} onChange={set('message')} {...aria('message')} />
                      {err('message')}
                    </div>

                    <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
                      <Magnetic as="button" type="submit" disabled={status === 'sending'} className="btn-primary disabled:cursor-progress disabled:opacity-70">
                        {status === 'sending' ? (<><Loader2 size={16} className="animate-spin" /> Sending…</>) : (<>Send enquiry <ArrowUpRight size={16} strokeWidth={1.6} /></>)}
                      </Magnetic>
                      <p className="max-w-xs text-xs text-graphite/50">By sending this form you agree to be contacted about your enquiry. See our <a href="#/privacy" className="link-line text-graphite/80">privacy policy</a>.</p>
                    </div>

                    <div id="form-status" className="md:col-span-2" role="status" aria-live="polite">
                      {status === 'error' && (
                        <div className="flex items-start gap-3 rounded-2xl border border-[#c0452a]/30 bg-[#c0452a]/10 p-4 text-sm text-[#8f2f18]">
                          <AlertCircle size={18} className="mt-0.5 shrink-0" />
                          <div>
                            <p>{serverError}</p>
                            {wa && <p className="mt-2"><a href={wa} target="_blank" rel="noreferrer" className="link-line text-graphite">Message us on WhatsApp instead</a></p>}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
