import { useState, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { EnquiryError, projectTypes, submitEnquiry, validate, type EnquiryErrors, type EnquiryPayload } from '../lib/enquiry'

const empty: EnquiryPayload = { fullName: '', phone: '', email: '', projectType: '', contactPref: 'Call me', plotAvailability: '', budget: '', location: '', message: 'Quick enquiry from the home page.', quick: true, website: '' }
const field = 'w-full rounded-2xl border border-graphite/10 bg-white px-4 py-3 text-graphite placeholder:text-ink-3 focus:border-olive focus:shadow-[0_0_0_4px_rgba(68,80,224,0.12)] focus:outline-none'

/** A three-field enquiry (name, phone, what you want to build) for the home page; the full form lives on the Contact page. */
export default function QuickEnquiry() {
  const [vals, setVals] = useState<EnquiryPayload>(empty)
  const [errors, setErrors] = useState<EnquiryErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [serverError, setServerError] = useState('')

  const set = (k: keyof EnquiryPayload) => (e: { target: { value: string } }) => {
    setVals((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }))
  }
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    const er = validate(vals)
    setErrors(er)
    if (Object.keys(er).length) return
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
  const err = (k: keyof EnquiryPayload) => (errors[k] ? <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm text-[#c0452a]"><AlertCircle size={14} /> {errors[k]}</p> : null)

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-[28px] bg-white/85 p-6 text-center backdrop-blur-xl sm:p-8">
        <CheckCircle2 size={36} className="mx-auto text-olive" />
        <p className="mt-3 text-[1.2rem] font-medium tracking-tight">Thank you, we will call you soon.</p>
        <p className="mt-1 text-sm text-ink-2">Want to share more about your plot and budget? <a href="/contact" className="link-line text-graphite">Use the full form</a>.</p>
      </div>
    )
  }
  return (
    <form onSubmit={submit} noValidate className="rounded-[28px] bg-white/80 p-6 backdrop-blur-xl sm:p-8" aria-label="Quick enquiry">
      <p className="text-[1.15rem] font-medium tracking-tight">Request a free call-back</p>
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="q-name" className="sr-only">Full name</label>
          <input id="q-name" name="fullName" autoComplete="name" placeholder="Your name" value={vals.fullName} onChange={set('fullName')} className={field} aria-invalid={!!errors.fullName} />
          {err('fullName')}
        </div>
        <div>
          <label htmlFor="q-phone" className="sr-only">Phone number</label>
          <input id="q-phone" name="phone" type="tel" autoComplete="tel" placeholder="Phone number" value={vals.phone} onChange={set('phone')} className={field} aria-invalid={!!errors.phone} />
          {err('phone')}
        </div>
        <div>
          <label htmlFor="q-type" className="sr-only">What do you want to build?</label>
          <select id="q-type" name="projectType" value={vals.projectType} onChange={set('projectType')} className={field} aria-invalid={!!errors.projectType}>
            <option value="">What do you want to build?</option>
            {projectTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
          {err('projectType')}
        </div>
        {/* honeypot: people never see or fill this */}
        <input name="website" value={vals.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      </div>
      {status === 'error' && <p role="alert" className="mt-4 flex items-start gap-2 text-sm text-[#c0452a]"><AlertCircle size={16} className="mt-0.5 shrink-0" /> {serverError}</p>}
      <button type="submit" disabled={status === 'sending'} className="btn-primary mt-6 w-full justify-center disabled:opacity-70">
        {status === 'sending' ? <><Loader2 size={16} className="animate-spin" /> Sending…</> : 'Call me back'}
      </button>
      <p className="mt-3 text-xs text-ink-2">We use your details only to reply to this enquiry. <a href="/privacy" className="link-line">Privacy policy</a>.</p>
    </form>
  )
}
