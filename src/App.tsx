import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Splash from './components/Preloader'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ProjectDetail from './components/ProjectDetail'
import PrivacyPolicy from './components/PrivacyPolicy'
import PageBackdrop from './components/PageBackdrop'
import ScrollProgress from './components/ScrollProgress'
import Hero from './sections/Hero'
import About from './sections/About'
import Services from './sections/Services'
import Projects from './sections/Projects'
import Journey from './sections/Journey'
import Testimonials from './sections/Testimonials'
import AboutPage from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import ProjectsPage from './pages/ProjectsPage'
import GalleryPage from './pages/GalleryPage'
import PackagesPage from './pages/PackagesPage'
import ContactPage from './pages/ContactPage'
import Stats from './sections/Stats'
import Packages from './sections/Packages'
import OwnerStories from './sections/OwnerStories'
import WhyChoose from './sections/WhyChoose'
import GalleryPreview from './sections/GalleryPreview'
import ConsultCta from './sections/ConsultCta'
import { usePrefersReducedMotion } from './hooks/useEnv'
import { useRoute } from './hooks/useHashRoute'
import { getLenis, initSmoothScroll, ScrollTrigger } from './lib/smooth'
import { injectStructuredData, setCanonical } from './lib/seo'

export default function App() {
  const reduced = usePrefersReducedMotion()
  const { route, openProject, openPrivacy, close } = useRoute()
  // development shortcut: `?fast` skips the splash
  const fast = import.meta.env.DEV && new URLSearchParams(location.search).has('fast')
  const [revealed, setRevealed] = useState(fast)
  const [splashDone, setSplashDone] = useState(fast)

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

  useEffect(() => {
    if (!route) document.title = 'Prasanth Construction — Thoughtfully designed homes, expertly built'
    if (route && route.kind !== 'project' && route.kind !== 'privacy') document.title = `${route.kind[0].toUpperCase()}${route.kind.slice(1)} — Prasanth Construction`
  }, [route])

  // the About page is a page of its own: start it at the top, and re-measure the scroll effects when pages swap
  const pages = ['about', 'services', 'projects', 'gallery', 'packages', 'contact'] as const
  const page = route && (pages as readonly string[]).includes(route.kind) ? route.kind : 'home'
  useEffect(() => {
    if (page !== 'home') getLenis()?.scrollTo(0, { immediate: true })
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => clearTimeout(t)
  }, [page])

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
      <a href="#about" className="sr-only z-[200] rounded-full bg-graphite px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Nav visible={revealed} />
      <ScrollProgress />
      <PageBackdrop page={page} />
      <main>
        {page === 'about' ? (
          <AboutPage />
        ) : page === 'services' ? (
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
            <OwnerStories />
            <About />
            <Stats />
            <Services />
            <WhyChoose />
            <Packages more />
            <Journey />
            <Testimonials />
            <GalleryPreview />
            <ConsultCta />
          </>
        )}
      </main>
      <Footer />

      <AnimatePresence>
        {route?.kind === 'project' && <ProjectDetail key={route.slug} slug={route.slug} onClose={close} onOpen={openProject} />}
        {route?.kind === 'privacy' && <PrivacyPolicy key="privacy" onClose={() => close()} />}
      </AnimatePresence>
      <PrivacyLinkBridge onOpen={openPrivacy} />

      {!splashDone && <Splash onReveal={onReveal} onDone={onDone} />}
    </>
  )
}

/** Footer/form links use plain `#/privacy` hrefs; this keeps the router in sync when they are clicked. */
function PrivacyLinkBridge({ onOpen }: { onOpen: () => void }) {
  useEffect(() => {
    const on = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href="#/privacy"]')
      if (a) {
        e.preventDefault()
        onOpen()
      }
    }
    document.addEventListener('click', on)
    return () => document.removeEventListener('click', on)
  }, [onOpen])
  return null
}
