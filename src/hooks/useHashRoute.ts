import { useCallback, useEffect, useState } from 'react'

export type Route = { kind: 'project'; slug: string } | { kind: 'privacy' } | { kind: 'about' } | { kind: 'services' } | { kind: 'projects' } | { kind: 'gallery' } | { kind: 'packages' } | { kind: 'contact' } | null

/** Tiny hash router: `#/project/<slug>` and `#/privacy` open overlay pages; anything else is the home page. */
const parse = (): Route => {
  const p = location.hash.match(/^#\/project\/([a-z0-9-]+)/i)
  if (p) return { kind: 'project', slug: p[1] }
  if (/^#\/privacy/i.test(location.hash)) return { kind: 'privacy' }
  if (/^#\/about/i.test(location.hash)) return { kind: 'about' }
  if (/^#\/services/i.test(location.hash)) return { kind: 'services' }
  if (/^#\/projects/i.test(location.hash)) return { kind: 'projects' }
  if (/^#\/gallery/i.test(location.hash)) return { kind: 'gallery' }
  if (/^#\/packages/i.test(location.hash)) return { kind: 'packages' }
  if (/^#\/contact/i.test(location.hash)) return { kind: 'contact' }
  return null
}

export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parse())
  useEffect(() => {
    const on = () => setRoute(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const openProject = useCallback((slug: string) => {
    location.hash = `/project/${slug}`
  }, [])
  const openPrivacy = useCallback(() => {
    location.hash = '/privacy'
  }, [])
  const close = useCallback((returnTo = '') => {
    // leave the overlay without adding a history entry for the home page
    history.replaceState(null, '', location.pathname + location.search + (returnTo ? `#${returnTo}` : ''))
    setRoute(null)
    if (returnTo) setTimeout(() => document.getElementById(returnTo)?.scrollIntoView(), 50)
  }, [])
  return { route, openProject, openPrivacy, close }
}
