import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Splash from './components/Preloader'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ProjectDetail from './components/ProjectDetail'
import PrivacyPolicy from './components/PrivacyPolicy'
import PageBackdrop from './components/PageBackdrop'
import ScrollProgress from './components/ScrollProgress'
import MobileActionBar from './components/MobileActionBar'
import Hero from './sections/Hero'
import About from './sections/About'
import Services from './sections/Services'
import Projects from './sections/Projects'
import Testimonials from './sections/Testimonials'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import { services } from './data/services'
import ProjectsPage from './pages/ProjectsPage'
import GalleryPage from './pages/GalleryPage'
import PackagesPage from './pages/PackagesPage'
import ContactPage from './pages/ContactPage'
import Packages from './sections/Packages'
import WhyChoose from './sections/WhyChoose'
import ConsultCta from './sections/ConsultCta'
import { usePrefersReducedMotion } from './hooks/useEnv'
import { useRoute } from './hooks/useRoute'
import { navigate } from './lib/router'
import { getLenis, initSmoothScroll, ScrollTrigger } from './lib/smooth'
import { injectStructuredData, setCanonical, setPageMeta } from './lib/seo'

/** true only for the first page load of a browser session that lands on the home page (the flag is set below, once the page has loaded) */
function firstHomeVisit() {
  try {
    const seen = sessionStorage.getItem('splash-seen') === '1'
    return !seen && location.pathname.replace(/\/+$/, '') === ''
  } catch {
    return true
  }
}

export default function App() {
  const reduced = usePrefersReducedMotion()
  const { route, openProject, close } = useRoute()
  // development shortcut: `?fast` skips the splash
  const fast = import.meta.env.DEV && new URLSearchParams(location.search).has('fast')
  // the splash plays once per visit, and only when the visit starts on the home page: a shared link to Packages or a project opens straight on the content
  const [skip] = useState(() => fast || !firstHomeVisit())
  useEffect(() => {
    try {
      sessionStorage.setItem('splash-seen', '1')
    } catch {
      /* private mode: the splash simply plays each load */
    }
  }, [])
  const [revealed, setRevealed] = useState(skip)
  const [splashDone, setSplashDone] = useState(skip)

  // one smooth-scroll engine for the whole site
  useEffect(() => initSmoothScroll(reduced), [reduced])

  useEffect(() => {
    injectStructuredData()
    setCanonical()
  }, [])

  // layout depends on fonts and the pinned sections — refresh triggers once things settle
  useEffect(() => {
    if (!splashDone) return
    const refresh = () => ScrollTrigger.refresh()
    const t = setTimeout(refresh, 300)
    document.fonts?.ready.then(refresh)
    return () => clearTimeout(t)
  }, [splashDone])

  // every page has its own title, description and canonical address
  useEffect(() => setPageMeta(route), [route])

  // the About page is a page of its own: start it at the top, and re-measure the scroll effects when pages swap
  const pages = ['about', 'services', 'projects', 'gallery', 'packages', 'contact'] as const
  // a project or the privacy policy opens over the page you came from (or the Projects page when opened directly)
  const underlay = useRef<(typeof pages)[number] | 'service' | 'home'>(route?.kind === 'project' ? 'projects' : 'home')
  const overlay = route?.kind === 'project' || route?.kind === 'privacy'
  const page = overlay ? underlay.current : route ? (route.kind === 'service' ? 'service' : (route.kind as (typeof pages)[number])) : 'home'
  if (!overlay) underlay.current = page
  useEffect(() => {
    if (page !== 'home') getLenis()?.scrollTo(0, { immediate: true })
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => clearTimeout(t)
  }, [page, route?.kind === 'service' ? route.slug : ''])

  // a link such as /services#renovation, opened directly, scrolls to its section once the page is in place
  useEffect(() => {
    const id = location.hash.slice(1)
    if (!id || !splashDone) return
    const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }), 1200)
    return () => clearTimeout(t)
  }, [page, splashDone])

  // whenever the page changes height (images load, sections open), re-measure every scroll effect so none is left out of place
  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined
    let last = document.documentElement.scrollHeight
    const ro = new ResizeObserver(() => {
      clearTimeout(t)
      t = setTimeout(() => {
        const h = document.documentElement.scrollHeight
        if (Math.abs(h - last) > 4) {
          last = h
          ScrollTrigger.refresh()
        }
      }, 250)
    })
    ro.observe(document.body)
    return () => {
      clearTimeout(t)
      ro.disconnect()
    }
  }, [])

  const onReveal = useCallback(() => setRevealed(true), [])
  const onDone = useCallback(() => setSplashDone(true), [])

  return (
    <>
      <a href="#main" className="sr-only z-[200] rounded-full bg-graphite px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Nav visible={revealed} />
      <ScrollProgress />
      <PageBackdrop page={page} />
      <main id="main" tabIndex={-1}>
        {page === 'about' ? (
          <AboutPage />
        ) : page === 'service' && route?.kind === 'service' && services.some((x) => x.id === route.slug) ? (
          <ServiceDetailPage key={route.slug} slug={route.slug} />
        ) : page === 'services' || page === 'service' ? (
          <ServicesPage />
        ) : page === 'projects' ? (
          <ProjectsPage />
        ) : page === 'gallery' ? (
          <GalleryPage />
        ) : page === 'packages' ? (
          <PackagesPage />
        ) : page === 'contact' ? (
          <ContactPage />
        ) : (
          <>
            <Hero play={revealed} />
            <Projects onOpen={openProject} />
            <Testimonials />
            <About />
            <Services />
            <WhyChoose />
            <Packages more />
            <ConsultCta />
          </>
        )}
      </main>
      <Footer />

      <AnimatePresence>
        {route?.kind === 'project' && <ProjectDetail key={route.slug} slug={route.slug} onClose={close} onOpen={openProject} />}
        {route?.kind === 'privacy' && <PrivacyPolicy key="privacy" onClose={() => close()} />}
      </AnimatePresence>
      <LinkBridge />

      {splashDone && <MobileActionBar hidden={page === 'contact'} />}
      {!splashDone && <Splash onReveal={onReveal} onDone={onDone} />}
    </>
  )
}

/**
 * Every internal link is a real `<a href="/page">`, so it can be opened in a new tab, shared or crawled.
 * A plain click is handled here instead of reloading the page, and a click on the page you are already on scrolls to the top.
 */
function LinkBridge() {
  useEffect(() => {
    const on = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement).closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return
      const href = a.getAttribute('href') || ''
      if (!href.startsWith('/') || href.startsWith('//')) return
      e.preventDefault()
      const go = () => {
        const path = href.split(/[?#]/)[0].replace(/\/+$/, '') || '/'
        if (path === (location.pathname.replace(/\/+$/, '') || '/') && !href.includes('#')) {
          const l = getLenis()
          if (l) l.scrollTo(0, { duration: 1.2 })
          else window.scrollTo({ top: 0, behavior: 'smooth' })
        } else navigate(href)
        const id = href.split('#')[1]
        if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 900)
      }
      // the full-screen menu is closing: let it finish before the page changes
      if (document.documentElement.dataset.menu === 'open') setTimeout(go, 450)
      else go()
    }
    document.addEventListener('click', on)
    return () => document.removeEventListener('click', on)
  }, [])
  return null
}
