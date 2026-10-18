/**
 * Company details. Everything here is configurable.
 *
 * IMPORTANT: the values below are PLACEHOLDERS. Replace them with verified information before launch.
 * Fields left empty ('' or []) are simply not shown on the site, and local-business structured data
 * (JSON-LD) is only emitted when `verified` is true and the required fields are filled in.
 */
export interface CompanyConfig {
  name: string
  legalName: string
  tagline: string
  email: string
  phone: string
  phone2: string
  hours: string
  /** Digits only, with country code, e.g. 919876543210. Leave empty to hide the WhatsApp link. */
  whatsapp: string
  address: string
  serviceAreas: string[]
  social: { instagram: string; facebook: string; linkedin: string; youtube: string }
  siteUrl: string
  /** Set to true once the details above are real and you want structured data published. */
  verified: boolean
}

export const company: CompanyConfig = {
  name: 'Prasanth Construction',
  legalName: 'Prasanth Construction',
  tagline: 'Architect-led turnkey house construction across Tamilnadu',
  email: import.meta.env.VITE_COMPANY_EMAIL ?? 'prazed93@gmail.com',
  phone: import.meta.env.VITE_COMPANY_PHONE ?? '+91 96884 44573',
  phone2: '+91 93449 58295',
  hours: 'Mon – Sat, 9 AM – 6 PM',
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER ?? '919688444573',
  address: import.meta.env.VITE_COMPANY_ADDRESS ?? 'No.59/A, Vasugoundar street/n, Dharmapuri - 636701',
  serviceAreas: (import.meta.env.VITE_SERVICE_AREAS ?? 'Dharmapuri, Palacode, Harur, Pennagaram, Nallampalli, Morappur, Karimangalam, Papireddipatti').split(',').map((s: string) => s.trim()).filter(Boolean),
  social: { instagram: '', facebook: '', linkedin: '', youtube: 'https://www.youtube.com/@PrasathConstructions' },
  siteUrl: import.meta.env.VITE_SITE_URL ?? 'https://example.com',
  verified: true,
}

export const whatsappLink = (text = 'Hello, I would like to discuss building a home.') =>
  company.whatsapp ? `https://wa.me/${company.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}` : ''
