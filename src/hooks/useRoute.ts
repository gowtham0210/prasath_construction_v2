import { useCallback, useEffect, useState } from 'react'
import { canGoBack, navigate, onRouteChange, parsePath, type Route } from '../lib/router'

export type { Route }

/** Path router: every page has its own URL (`/about`, `/projects/<slug>`); the History API keeps back/forward working. */
export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parsePath())
  useEffect(() => onRouteChange(() => setRoute(parsePath())), [])
  const openProject = useCallback((slug: string) => navigate(`/projects/${slug}`), [])
  const openPrivacy = useCallback(() => navigate('/privacy'), [])
  // leave an overlay: go back if the visitor came from the site, otherwise land on a sensible page
  const close = useCallback((returnTo = '') => {
    if (canGoBack()) history.back()
    else navigate(returnTo === 'projects' ? '/projects' : returnTo === 'contact' ? '/contact' : '/', true)
  }, [])
  return { route, openProject, openPrivacy, close }
}
