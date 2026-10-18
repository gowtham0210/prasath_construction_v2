import { company } from '../config/company'

/** Emits LocalBusiness structured data ONLY when real company details have been supplied and marked verified. */
export function injectStructuredData() {
  document.getElementById('ld-business')?.remove()
  const ready = company.verified && company.name && (company.phone || company.email) && company.address
  if (!ready) return
  const data = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    name: company.legalName || company.name,
    url: company.siteUrl,
    description: company.tagline,
    ...(company.phone ? { telephone: company.phone } : {}),
    ...(company.email ? { email: company.email } : {}),
    address: { '@type': 'PostalAddress', streetAddress: company.address },
    ...(company.serviceAreas.length ? { areaServed: company.serviceAreas } : {}),
    sameAs: Object.values(company.social).filter(Boolean),
  }
  const s = document.createElement('script')
  s.type = 'application/ld+json'
  s.id = 'ld-business'
  s.text = JSON.stringify(data)
  document.head.appendChild(s)
}

export function setCanonical() {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = company.siteUrl.replace(/\/$/, '') + '/'
}
