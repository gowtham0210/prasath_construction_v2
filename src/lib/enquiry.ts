export interface EnquiryPayload {
  fullName: string
  phone: string
  email: string
  projectType: string
  plotAvailability: string
  budget: string
  location: string
  message: string
  /** honeypot — must stay empty */
  website?: string
}

export type EnquiryErrors = Partial<Record<keyof EnquiryPayload, string>>

export const projectTypes = ['House Construction', 'Interior Design', 'Turnkey Solutions', 'Architecture', 'Renovation', 'Not sure yet']
export const plotOptions = ['I own a plot', 'I am looking for a plot', 'I am renovating an existing home', 'Not decided yet']
export const budgetOptions = ['Not decided yet', 'Under ₹50 lakh', '₹50 lakh – ₹1 crore', '₹1 crore – ₹2 crore', 'Above ₹2 crore']

export function validate(v: EnquiryPayload): EnquiryErrors {
  const e: EnquiryErrors = {}
  if (v.fullName.trim().length < 2) e.fullName = 'Please enter your full name.'
  const digits = v.phone.replace(/\D/g, '')
  if (digits.length < 8 || digits.length > 15) e.phone = 'Please enter a valid phone number (8–15 digits).'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (!v.projectType) e.projectType = 'Please choose a project type.'
  if (!v.plotAvailability) e.plotAvailability = 'Please tell us about your plot.'
  if (v.message.trim().length < 10) e.message = 'Please tell us a little about your project (at least 10 characters).'
  return e
}

export class EnquiryError extends Error {
  kind: 'not-configured' | 'network' | 'server' | 'rejected'
  constructor(kind: EnquiryError['kind'], message: string) {
    super(message)
    this.kind = kind
  }
}

const endpoint = () => import.meta.env.VITE_FORM_ENDPOINT || '/api/enquiry'

/**
 * Sends the enquiry to the configured backend. Resolves only when the server confirms success —
 * any failure rejects with an EnquiryError so the UI never pretends a failed request was sent.
 */
export async function submitEnquiry(payload: EnquiryPayload): Promise<void> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 15000)
  let res: Response
  try {
    res = await fetch(endpoint(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString(), page: location.href }),
      signal: ctrl.signal,
    })
  } catch {
    throw new EnquiryError('network', 'We could not reach the server. Please check your connection and try again.')
  } finally {
    clearTimeout(timer)
  }
  if (res.status === 404 || res.status === 405) {
    throw new EnquiryError('not-configured', 'The enquiry service is not configured yet. Please contact us directly instead.')
  }
  if (res.status === 400 || res.status === 422) {
    let msg = 'Some details were not accepted. Please review the form and try again.'
    try {
      const data = await res.json()
      if (data?.message) msg = String(data.message)
    } catch {
      /* ignore */
    }
    throw new EnquiryError('rejected', msg)
  }
  if (!res.ok) throw new EnquiryError('server', 'Something went wrong on our side. Please try again in a moment or contact us directly.')
  try {
    const data = await res.json()
    if (data && data.ok === false) throw new EnquiryError('server', String(data.message || 'The enquiry could not be saved.'))
  } catch (err) {
    if (err instanceof EnquiryError) throw err
    /* a non-JSON 2xx from a hosted form service is treated as success */
  }
}
