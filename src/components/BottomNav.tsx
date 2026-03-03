import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const NAV = [
  { label: 'Home', to: '/home' },
  { label: 'About', to: '/about' },
  { label: 'Process', to: '/process' },
  { label: 'Services', to: '/services' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

export default function BottomNav() {
  const reduceMotion = useReducedMotion()
  const location = useLocation()
  const [expanded, setExpanded] = useState(false)
  const collapseTimer = useRef<number | null>(null)
  const lastScrollY = useRef<number>(0)
  const collapseOnScrollRef = useRef<number | null>(null)

  const startCollapseTimer = () => {
    if (collapseTimer.current) window.clearTimeout(collapseTimer.current)
    collapseTimer.current = window.setTimeout(() => setExpanded(false), 6000)
  }

  useEffect(() => {
    return () => {
      if (collapseTimer.current) window.clearTimeout(collapseTimer.current)
    }
  }, [])

  // When expanded, scale whole panel on scroll/wheel/touch within limits
  useEffect(() => {
    if (!expanded) return
    lastScrollY.current = window.scrollY
    const handler = () => {
      const y = window.scrollY
      const dy = y - lastScrollY.current
      if (Math.abs(dy) < 5) return // Ignore tiny jitters
      
      if (dy !== 0) {
        lastScrollY.current = y
      }
      if (!collapseOnScrollRef.current) {
        collapseOnScrollRef.current = window.setTimeout(() => {
          setExpanded(false)
          collapseOnScrollRef.current = null
        }, 300) // Increased delay for better stability
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    window.addEventListener('wheel', handler, { passive: true })
    window.addEventListener('touchmove', handler, { passive: true })
    return () => {
      window.removeEventListener('scroll', handler)
      window.removeEventListener('wheel', handler)
      window.removeEventListener('touchmove', handler)
      if (collapseOnScrollRef.current) {
        window.clearTimeout(collapseOnScrollRef.current)
        collapseOnScrollRef.current = null
      }
    }
  }, [expanded])

  // On route change: close and reset scale
  useEffect(() => {
    setExpanded(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <div className="bottomNav" aria-label="Bottom navigation">
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="scrim"
            className="bottomNav__scrim"
            onClick={() => setExpanded(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.2 }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.nav
            key="panel"
            className="bottomNav__panel"
            aria-label="Primary"
            style={{ zIndex: 2 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="bottomNav__links">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setExpanded(false)}
                  className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        className={`bottomNav__fab${expanded ? ' is-open' : ''}`}
        aria-label={expanded ? 'Close navigation' : 'Open navigation'}
        onClick={() => {
          setExpanded((v) => {
            const next = !v
            if (next) startCollapseTimer()
            return next
          })
        }}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: reduceMotion ? 0.12 : 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className={`hamburger${expanded ? ' is-open' : ''}`} aria-hidden="true">
          <span className="hamburger__bar" />
          <span className="hamburger__bar" />
          <span className="hamburger__bar" />
        </span>
      </motion.button>
    </div>
  )
}
