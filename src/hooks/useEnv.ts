import { useEffect, useState, useSyncExternalStore } from 'react'

function useMedia(query: string, server = false) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => server,
  )
}

export const usePrefersReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
export const useIsMobile = () => useMedia('(max-width: 820px)')
export const useIsTablet = () => useMedia('(max-width: 1100px)')
export const useIsDesktop = () => useMedia('(min-width: 1024px)')
export const useFinePointer = () => useMedia('(pointer: fine)')

let webglCache: boolean | null = null
export function detectWebGL(): boolean {
  if (webglCache !== null) return webglCache
  try {
    const c = document.createElement('canvas')
    webglCache = !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    webglCache = false
  }
  return webglCache
}

export function useWebGL() {
  const [ok, setOk] = useState(true)
  useEffect(() => setOk(detectWebGL()), [])
  return ok
}
