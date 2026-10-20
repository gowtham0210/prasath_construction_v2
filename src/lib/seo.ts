import { company } from '../config/company'
import meta from '../data/pageMeta.json'
import { projects } from '../data/projects'
import { services } from '../data/services'
import type { Route } from './router'

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

const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
  let el = document.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

/** Gives every page its own title, description and canonical address (also used for sharing previews). */
export function setPageMeta(route: Route) {
  let m: { path: string; title: string; description: string } = meta.home
  if (route?.kind === 'project') {
    const p = projects.find((x) => x.slug === route.slug)
    m = p
      ? { path: `/projects/${p.slug}`, title: `${p.name} — ${p.location} | Prasanth Construction`, description: `${p.name} in ${p.location}: ${p.concept}. ${p.overview}`.slice(0, 300) }
      : meta.projects
  } else if (route?.kind === 'service') {
    const sv = services.find((x) => x.id === route.slug)
    m = sv ? { path: `/services/${sv.id}`, title: `${sv.title} | Prasanth Construction`, description: `${sv.headline} ${sv.summary}`.slice(0, 300) } : meta.services
  } else if (route) m = meta[route.kind]
  document.title = m.title
  setMeta('meta[name="description"]', 'name', 'description', m.description)
  setMeta('meta[property="og:title"]', 'property', 'og:title', m.title)
  setMeta('meta[property="og:description"]', 'property', 'og:description', m.description)
  const link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (link) link.href = company.siteUrl.replace(/\/$/, '') + (m.path === '/' ? '/' : m.path)
}
