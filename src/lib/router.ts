export type Route =
  | { kind: 'project'; slug: string }
  | { kind: 'privacy' }
  | { kind: 'service'; slug: string }
  | { kind: 'about' }
  | { kind: 'services' }
  | { kind: 'projects' }
  | { kind: 'gallery' }
  | { kind: 'packages' }
  | { kind: 'contact' }
  | null

export const PAGE_PATHS = { about: '/about', services: '/services', projects: '/projects', gallery: '/gallery', packages: '/packages', contact: '/contact' } as const

/** Reads a real URL path: `/packages`, `/projects/<slug>`, `/privacy`; anything else is the home page. */
export function parsePath(path: string = location.pathname): Route {
  const p = path.replace(/\/+$/, '') || '/'
  const proj = p.match(/^\/projects\/([a-z0-9-]+)$/i)
  if (proj) return { kind: 'project', slug: proj[1].toLowerCase() }
  const svc = p.match(/^\/services\/([a-z0-9-]+)$/i)
  if (svc) return { kind: 'service', slug: svc[1].toLowerCase() }
  if (p === '/privacy') return { kind: 'privacy' }
  const page = (Object.keys(PAGE_PATHS) as (keyof typeof PAGE_PATHS)[]).find((k) => PAGE_PATHS[k] === p)
  return page ? { kind: page } : null
}

const EVENT = 'routechange'
export const onRouteChange = (cb: () => void) => {
  window.addEventListener('popstate', cb)
  window.addEventListener(EVENT, cb)
  return () => {
    window.removeEventListener('popstate', cb)
    window.removeEventListener(EVENT, cb)
  }
}

const idx = () => (history.state && typeof history.state.idx === 'number' ? history.state.idx : 0)
/** true when the visitor got here from another page of this site (so "back" stays on the site) */
export const canGoBack = () => idx() > 0

/** Moves to another page of the site without a reload. */
export function navigate(to: string, replace = false) {
  const url = new URL(to, location.origin)
  if (url.pathname === location.pathname && url.search === location.search && url.hash === location.hash) return
  const state = { idx: replace ? idx() : idx() + 1 }
  if (replace) history.replaceState(state, '', url.pathname + url.search + url.hash)
  else history.pushState(state, '', url.pathname + url.search + url.hash)
  window.dispatchEvent(new Event(EVENT))
}
