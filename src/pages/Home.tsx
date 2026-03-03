import { motion, useReducedMotion } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import Footer from '../components/Footer'

type RevealProps = PropsWithChildren<{
  delay?: number
}>

function Reveal({ children, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{
        duration: reduceMotion ? 0.2 : 0.7,
        delay: reduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

export default function Home() {
  const reduceMotion = useReducedMotion()
  const heroRef = useRef<HTMLDivElement | null>(null)
  const [showcaseOpen, setShowcaseOpen] = useState(false)

  const heroWords = useMemo(
    () => ['reliably', 'clearly', 'intentionally', 'professionally', 'confidently', 'strategically'],
    []
  )
  const [heroWordIndex, setHeroWordIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroWordIndex((i) => (i + 1) % heroWords.length)
    }, 2200)
    return () => window.clearInterval(id)
  }, [heroWords.length])

  const showcase = [
    { src: '/showcase/port%201.webp', alt: 'BrandIt portfolio preview 1' },
    { src: '/showcase/port%202.webp', alt: 'BrandIt portfolio preview 2' },
    { src: '/showcase/image%201.webp', alt: 'BrandIt showcase image 1' },
    { src: '/showcase/image%202.webp', alt: 'BrandIt showcase image 2' },
    { src: '/showcase/image%203.webp', alt: 'BrandIt showcase image 3' },
    { src: '/showcase/image%204.webp', alt: 'BrandIt showcase image 4' },
    { src: '/showcase/image%205.webp', alt: 'BrandIt showcase image 5' },
    { src: '/showcase/image%206.webp', alt: 'BrandIt showcase image 6' },
  ]

  const showcasePreview = showcase.slice(0, 6)
  const showcaseMore = showcase.slice(6)

  return (
    <div className="home">
      <SiteHeader />

      <section className="homeHero">
        <div className="container">
          <div className="homeHero__watermark" aria-hidden="true">BRANDIT</div>
          <motion.div
            className="heroCard"
            ref={heroRef}
            initial={{ opacity: 0, y: 18, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: reduceMotion ? 0.25 : 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="heroCard__inner">
              <div className="kicker">Brand Building & Management Studio</div>

              <h1 className="heroTitle">
                Be <span className="heroTitle__accent">remembered</span> the right way.
                <span className="heroTitle__break">
                  Build it right. Show up <span className="heroWord">{heroWords[heroWordIndex]}.</span>
                </span>
              </h1>

              <p className="heroLead">
                Branding and management for startups, growing businesses, and personal brands.
              </p>

              <div className="heroCred" aria-label="Credibility">
                <div className="heroCred__item">Strategy-first before design</div>
                <div className="heroCred__dot" aria-hidden="true" />
                <div className="heroCred__item">Premium execution, clear systems</div>
              </div>

              <div className="heroActions">
                <Link
                  to="/contact"
                  className="btn btn--primary"
                  onClick={(e) => {
                    e.preventDefault()
                    window.dispatchEvent(new Event('consultation:open'))
                  }}
                >
                  Book a free consultation
                </Link>
                <Link to="/pricing" className="btn">
                  View pricing
                </Link>
              </div>

              <div className="chipRow" aria-label="Who we help">
                <div className="chip">Startups building from scratch</div>
                <div className="chip">Growing businesses that feel scattered</div>
                <div className="chip">Personal brands that want authority</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="who" className="homeSection">
        <div className="container">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Who BrandIt helps</h2>
            <p className="sectionSubtitle">
              If your brand feels unclear or inconsistent, we help you fix it.
            </p>
          </div>

          <div className="grid">
            <Reveal>
              <div className="card">
                <h3 className="cardTitle">Startups</h3>
                <p className="cardText">Launch with clarity: positioning first, then identity.</p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="card">
                <h3 className="cardTitle">Growing businesses</h3>
                <p className="cardText">Align your message and content so everything feels intentional.</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card">
                <h3 className="cardTitle">Personal brands</h3>
                <p className="cardText">Build authority with a cohesive identity and consistent presence.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="how" className="homeSection">
        <div className="container">
          <div className="sectionHeader">
            <h2 className="sectionTitle">How it works</h2>
            <p className="sectionSubtitle">A simple path: clarity, identity, consistency.</p>
          </div>

          <div className="grid">
            <Reveal>
              <div className="card">
                <div className="stepHead">
                  <div className="stepBadge">STEP 1</div>
                  <div className="stepLine" aria-hidden="true" />
                </div>
                <div className="stepMedia" aria-hidden="true">
                  <img
                    className="stepMedia__img"
                    src="/showcase/consultation.webp"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={1200}
                    height={800}
                  />
                </div>
                <h3 className="cardTitle">Start with a consultation</h3>
                <p className="cardText">We clarify your positioning and priorities.</p>
                <ul className="stepList">
                  <li>Brand audit</li>
                  <li>Clarity call</li>
                </ul>
                <div className="ctaActions">
                  <Link
                    to="/contact"
                    className="btn btn--primary"
                    onClick={(e) => {
                      e.preventDefault()
                      window.dispatchEvent(new Event('consultation:open'))
                    }}
                  >
                    Book a free consultation
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="card">
                <div className="stepHead">
                  <div className="stepBadge">STEP 2</div>
                  <div className="stepLine" aria-hidden="true" />
                </div>
                <div className="stepMedia" aria-hidden="true">
                  <img
                    className="stepMedia__img"
                    src="/showcase/identity.webp"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={1200}
                    height={800}
                  />
                </div>
                <h3 className="cardTitle">Build the identity</h3>
                <p className="cardText">We design the visuals and assets your brand needs.</p>
                <ul className="stepList">
                  <li>Identity system</li>
                  <li>Templates</li>
                </ul>
                <div className="ctaActions">
                  <Link to="/services" className="btn">Explore Services</Link>
                  <Link to="/process" className="btn">View Process</Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="card">
                <div className="stepHead">
                  <div className="stepBadge">STEP 3</div>
                </div>
                <div className="stepMedia" aria-hidden="true">
                  <img
                    className="stepMedia__img"
                    src="/showcase/calender.jpg"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={1200}
                    height={800}
                  />
                </div>
                <h3 className="cardTitle">Stay consistent monthly</h3>
                <p className="cardText">We manage content and standards so your brand stays consistent.</p>
                <ul className="stepList">
                  <li>Planning + scheduling</li>
                  <li>Design + creation</li>
                </ul>
                <div className="ctaActions">
                  <Link to="/pricing" className="btn btn--primary">View Pricing</Link>
                  <Link to="/pricing/custom" className="btn">Need custom?</Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="what" className="homeSection section--tint">
        <div className="container">
          <div className="sectionHeader">
            <h2 className="sectionTitle">What BrandIt does</h2>
            <p className="sectionSubtitle">
              Two stages: build the brand, then manage it consistently.
            </p>
          </div>

          <div className="grid grid--2">
            <Reveal>
              <div className="card">
                <h3 className="cardTitle">Phase 1. Brand Positioning & Branding (one-time)</h3>
                <p className="cardText">We set direction first, then build the identity.</p>
                <ul className="list">
                  <li>Consultation & strategy (purpose, audience, perception)</li>
                  <li>Logo + brand theme (colors, typography, visual direction)</li>
                  <li>Flyers, banner, motion advert, content calendar, website</li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.07}>
              <div className="card">
                <h3 className="cardTitle">Phase 2. Social Media Management (monthly)</h3>
                <p className="cardText">We keep your brand visible and consistent.</p>
                <ul className="list">
                  <li>Content strategy (what to post, why, and how often)</li>
                  <li>Design + creation (carousels, visuals, edited videos)</li>
                  <li>Scheduling + consistency management across platforms</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="why" className="homeSection section--tint">
        <div className="container">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Why BrandIt</h2>
            <p className="sectionSubtitle">
              We don’t guess — we build systems that keep your brand consistent.
            </p>
          </div>

          <div className="grid">
            <Reveal>
              <div className="card">
                <h3 className="cardTitle">Positioning before aesthetics</h3>
                <p className="cardText">Design works best when your message is clear.</p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="card">
                <h3 className="cardTitle">Consistency beats randomness</h3>
                <p className="cardText">Memorability comes from repeating the right message and visuals.</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card">
                <h3 className="cardTitle">Built to be scalable</h3>
                <p className="cardText">Standards and templates that make content easier to produce.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="showcase" className="homeSection section--tint">
        <div className="container">
          <div className="sectionHeader">
            <h2 className="sectionTitle">Showcase preview</h2>
            <p className="sectionSubtitle">A glimpse of how a consistent system feels across surfaces.</p>
          </div>

          <div className="gallery">
            {showcasePreview.map((img) => (
              <div key={img.src} className="gallery__item">
                <img
                  className="gallery__img"
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  width={1000}
                  height={800}
                />
              </div>
            ))}
          </div>

          {showcaseMore.length ? (
            <div className="galleryActions">
              <button type="button" className="btn" onClick={() => setShowcaseOpen(true)}>
                View more
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {showcaseOpen ? (
        <div
          className="modalOverlay"
          role="dialog"
          aria-modal="true"
          aria-label="Showcase gallery"
          onClick={() => setShowcaseOpen(false)}
        >
          <div className="modalCard" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div className="modalTitle">More showcase</div>
              <button type="button" className="modalClose" onClick={() => setShowcaseOpen(false)} aria-label="Close">
                ×
              </button>
            </div>
            <div className="modalBody">
              <div className="gallery gallery--modal">
                {showcaseMore.map((img) => (
                  <div key={img.src} className="gallery__item">
                    <img
                      className="gallery__img"
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      decoding="async"
                      width={1200}
                      height={900}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}


      <section id="cta" className="homeSection">
        <div className="container">
          <Reveal>
            <div className="ctaCard">
              <div>
                <h2 className="ctaTitle">Ready to build a brand that’s remembered?</h2>
                <p className="ctaText">
                  Start with a consultation. We’ll clarify your direction and recommend the best next step.
                </p>
              </div>
              <div>
                <Link
                  to="/contact"
                  className="btn btn--primary"
                  onClick={(e) => {
                    e.preventDefault()
                    window.dispatchEvent(new Event('consultation:open'))
                  }}
                >
                  Book a free consultation
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="homeLogo" aria-label="BrandIt logo">
        <div className="container">
          <div className="homeLogo__card">
            <img
              className="homeLogo__img"
              src="/showcase/logo.jpeg"
              alt="BrandIt logo"
              loading="lazy"
              decoding="async"
              width={1200}
              height={800}
            />
          </div>
        </div>
      </section>

      <section className="homeMarquee" aria-label="Brand positioning">
        <div className="homeMarquee__viewport">
          <div className="homeMarquee__track">
            <span className="homeMarquee__item">Positioning</span>
            <span className="homeMarquee__item">Brand identity</span>
            <span className="homeMarquee__item">Content systems</span>
            <span className="homeMarquee__item">Monthly management</span>

            <span className="homeMarquee__item" aria-hidden="true">Positioning</span>
            <span className="homeMarquee__item" aria-hidden="true">Brand identity</span>
            <span className="homeMarquee__item" aria-hidden="true">Content systems</span>
            <span className="homeMarquee__item" aria-hidden="true">Monthly management</span>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
