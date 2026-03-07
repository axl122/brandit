import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { API_BASE_URL } from './utils/api'
import BottomNav from './components/BottomNav'
import CookieConsent from './components/CookieConsent'
import ConsultationModal from './components/ConsultationModal'
import OfflineBanner from './components/OfflineBanner'
import WhatsAppWidget from './components/WhatsAppWidget'
import About from './pages/About'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import Home from './pages/Home'
import PaymentComplete from './pages/PaymentComplete'
import Pricing from './pages/Pricing'
import PricingService from './pages/PricingService'
import Process from './pages/Process'
import Services from './pages/Services'
import Splash from './pages/Splash'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import './App.css'

function getOrCreateSessionId(): string {
  const key = 'brandit_analytics_session_v1'
  try {
    const existing = sessionStorage.getItem(key)
    if (existing) return existing
    const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
    sessionStorage.setItem(key, id)
    return id
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  }
}

function App() {
  const location = useLocation()
  const [consultOpen, setConsultOpen] = useState(false)

  useEffect(() => {
    const sessionId = getOrCreateSessionId()
    const path = `${location.pathname}${location.search || ''}`
    const start = performance.now()

    const send = (durationMs: number) => {
      try {
        const payload = {
          type: 'pageview',
          path,
          durationMs: Math.max(0, Math.round(durationMs)),
          sessionId,
          ref: document.referrer || '',
          ua: navigator.userAgent || '',
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
          allowAnalytics: true,
          ts: Date.now(),
        }
        const body = JSON.stringify(payload)
        if (navigator.sendBeacon) {
          navigator.sendBeacon(`${API_BASE_URL}/api/analytics/event`, new Blob([body], { type: 'application/json' }))
        } else {
          void fetch(`${API_BASE_URL}/api/analytics/event`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
            keepalive: true,
          })
        }
      } catch {
        // ignore
      }
    }

    const onHide = () => send(performance.now() - start)
    window.addEventListener('pagehide', onHide)

    return () => {
      window.removeEventListener('pagehide', onHide)
      send(performance.now() - start)
    }
  }, [location.pathname, location.search])

  useEffect(() => {
    const pathname = location.pathname

    const baseTitle = 'BrandIt'
    const baseSuffix = 'Brand Building & Management Studio'
    const baseDescription =
      'BrandIt helps startups, growing businesses, and individuals build a clear brand identity — then maintain a consistent, premium presence over time.'

    const metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement | null

    const page = (() => {
      if (pathname === '/' || pathname === '/home') {
        return { title: `${baseTitle} — ${baseSuffix}`, description: baseDescription }
      }
      if (pathname === '/about') {
        return {
          title: `${baseTitle} — About`,
          description: 'Learn what BrandIt stands for and how we build brands with clarity, consistency, and premium execution.',
        }
      }
      if (pathname === '/services') {
        return {
          title: `${baseTitle} — Services`,
          description: 'Explore our brand positioning, identity design, social media management, and website services — built to make you remembered.',
        }
      }
      if (pathname === '/process') {
        return {
          title: `${baseTitle} — Process`,
          description: 'See the step-by-step process BrandIt uses to clarify positioning, build identity systems, and maintain brand consistency.',
        }
      }
      if (pathname.startsWith('/pricing')) {
        return {
          title: `${baseTitle} — Pricing`,
          description: 'View BrandIt pricing for branding and monthly management packages, including custom options.',
        }
      }
      if (pathname === '/blog') {
        return {
          title: `${baseTitle} — Blog`,
          description: 'Insights on brand strategy, consistency, content direction, and building a premium presence.',
        }
      }
      if (pathname === '/contact') {
        return {
          title: `${baseTitle} — Contact`,
          description: 'Book a free consultation with BrandIt or reach out via email/WhatsApp to start your project.',
        }
      }
      if (pathname === '/privacy') {
        return {
          title: `${baseTitle} — Privacy`,
          description: 'BrandIt privacy policy: what we collect, how we use it, cookies, and how to contact us about privacy questions.',
        }
      }
      if (pathname === '/terms') {
        return {
          title: `${baseTitle} — Terms`,
          description: 'BrandIt terms: acceptable use, payments, project delivery expectations, and how to contact us.',
        }
      }
      if (pathname === '/payment/complete') {
        return {
          title: `${baseTitle} — Payment Complete`,
          description: 'Payment confirmation received. BrandIt will follow up with next steps to start your project.',
        }
      }
      return { title: `${baseTitle} — ${baseSuffix}`, description: baseDescription }
    })()

    document.title = page.title
    if (metaDescription) metaDescription.content = page.description
  }, [location.pathname])

  useEffect(() => {
    const open = () => setConsultOpen(true)
    window.addEventListener('consultation:open', open as EventListener)
    return () => {
      window.removeEventListener('consultation:open', open as EventListener)
    }
  }, [])

  useEffect(() => {
    if (!consultOpen) return
    // Don't close on scroll - mobile browser auto-scrolls to inputs
    // Modal closes only via X button or clicking outside
    return () => {}
  }, [consultOpen])

  useEffect(() => {
    const scrollTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    // Run after layout/route transition to avoid ending up at bottom.
    const raf1 = window.requestAnimationFrame(() => {
      scrollTop()
      window.requestAnimationFrame(scrollTop)
    })

    return () => window.cancelAnimationFrame(raf1)
  }, [location.pathname, location.search])

  return (
    <>
      <AnimatePresence mode="sync">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Splash />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/process" element={<Process />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/pricing/:key" element={<PricingService />} />
          <Route path="/payment/complete" element={<PaymentComplete />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      {location.pathname !== '/' ? <BottomNav /> : null}
      <CookieConsent />
      {location.pathname !== '/' ? <OfflineBanner /> : null}
      {location.pathname !== '/' ? <WhatsAppWidget /> : null}
      <ConsultationModal open={consultOpen} onClose={() => setConsultOpen(false)} />
    </>
  )
}

export default App
