import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Target,
  Search,
  Quote
} from 'lucide-react'
import Page from '../components/Page'

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
      transition={{ duration: reduceMotion ? 0.2 : 0.6, delay: reduceMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default function About() {
  const [activePhase, setActivePhase] = useState(1)

  return (
    <Page title="WE ARE BRANDIT." lead="The powerhouse for brand identity done the right way">
      <section className="homeSection">
        <div className="sectionHeader">
          <p className="sectionSubtitle">
            People want to be remembered online — but most brands lack direction and consistency.
            BrandIt fixes that with clear positioning and premium execution.
          </p>
        </div>
        <Reveal>
          <div className="card" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <p className="cardText" style={{ fontSize: '1.25rem', lineHeight: '1.6' }}>
              We start with positioning — who you are, what you stand for, and how you should be remembered.
              After that, everything becomes intentional.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Founder's Note / Mission Refinement */}
      <section className="homeSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Our Philosophy</h2>
          <p className="sectionSubtitle">Built on clarity, consistency, and intentionality.</p>
        </div>
        <Reveal>
          <div className="founders-card" style={{ maxWidth: '900px' }}>
            <Quote className="quote-icon" size={48} />
            <div className="founders-content">
              <p className="founders-text">
                "Many brands post and design without direction. The result is noise — mixed visuals, scattered messaging,
                and an audience that doesn’t remember you. BrandIt fixes that with strategy and systems."
              </p>
              <div className="founders-meta">
                <div className="founders-divider" />
                <span className="founders-name">The BrandIt Team</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="homeSection section--tint">
        <div className="section-pattern section-pattern--grid" aria-hidden="true" />
        <div className="sectionHeader">
          <h2 className="sectionTitle">What BrandIt stands for</h2>
          <p className="sectionSubtitle">A studio built around clarity, consistency, and premium execution.</p>
        </div>
        <div className="grid">
          <Reveal>
            <div className="card card--feature">
              <h3 className="cardTitle">Luxury without noise</h3>
              <p className="cardText">Minimal, intentional design that makes your brand feel expensive — and easy to trust.</p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="card card--feature">
              <h3 className="cardTitle">Systems over guesswork</h3>
              <p className="cardText">Guidelines and direction so your brand stays consistent across posts, pages, and platforms.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card card--feature">
              <h3 className="cardTitle">Strategy first</h3>
              <p className="cardText">We align your message and positioning before we touch visuals — so everything lands.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 3. Comparison Table */}
      <section className="homeSection section--tint">
        <div className="section-pattern section-pattern--grid" aria-hidden="true" />
        <div className="sectionHeader">
          <h2 className="sectionTitle">BrandIt vs Typical Design</h2>
          <p className="sectionSubtitle">A premium brand needs more than "nice graphics".</p>
        </div>
        
        <div className="comparison-container">
          <Reveal>
            <div className="comparison-grid">
              <div className="comparison-column typical">
                <h3 className="comparison-heading">Typical approach</h3>
                <ul className="comparison-list">
                  <li><XCircle size={18} className="icon-error" /> Starts with design first</li>
                  <li><XCircle size={18} className="icon-error" /> Inconsistent visuals over time</li>
                  <li><XCircle size={18} className="icon-error" /> Random posting without direction</li>
                  <li><XCircle size={18} className="icon-error" /> No system for tone or standards</li>
                </ul>
              </div>
              <div className="comparison-column brandit-premium">
                <div className="premium-badge">Recommended</div>
                <h3 className="comparison-heading">BrandIt approach</h3>
                <ul className="comparison-list">
                  <li><CheckCircle2 size={18} className="icon-success" /> Starts with positioning</li>
                  <li><CheckCircle2 size={18} className="icon-success" /> Builds identity as a system</li>
                  <li><CheckCircle2 size={18} className="icon-success" /> Plans content intentionally</li>
                  <li><CheckCircle2 size={18} className="icon-success" /> Monthly consistency management</li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4. Interactive Approach (Phases) */}
      <section className="homeSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Our approach</h2>
          <p className="sectionSubtitle">The roadmap to a dominant brand presence.</p>
        </div>

        <div className="phase-tabs">
          <button 
            className={`phase-tab ${activePhase === 1 ? 'active' : ''}`}
            onClick={() => setActivePhase(1)}
          >
            Phase 1: Foundation
          </button>
          <button 
            className={`phase-tab ${activePhase === 2 ? 'active' : ''}`}
            onClick={() => setActivePhase(2)}
          >
            Phase 2: Management
          </button>
        </div>

        <div className="phase-content-wrapper" style={{ maxWidth: '700px' }}>
          <AnimatePresence mode="wait">
            {activePhase === 1 ? (
              <motion.div
                key="phase1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="phase-card"
              >
                <div className="phase-header">
                  <Search className="icon-brand" size={32} />
                  <div>
                    <h3 className="phase-title">Brand Positioning & Branding</h3>
                    <p className="phase-desc">One-time stage that sets direction and builds the assets.</p>
                  </div>
                </div>
                <ul className="phase-list">
                  <li><ArrowRight size={16} /> Consultation & positioning</li>
                  <li><ArrowRight size={16} /> Identity system (logo, colors, type)</li>
                  <li><ArrowRight size={16} /> Core brand assets</li>
                  <li><ArrowRight size={16} /> Website (portfolio or standard)</li>
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="phase2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="phase-card"
              >
                <div className="phase-header">
                  <Target className="icon-brand" size={32} />
                  <div>
                    <h3 className="phase-title">Social Media Management</h3>
                    <p className="phase-desc">Monthly stage focused on consistent execution.</p>
                  </div>
                </div>
                <ul className="phase-list">
                  <li><ArrowRight size={16} /> Content plan & direction</li>
                  <li><ArrowRight size={16} /> Design + creation</li>
                  <li><ArrowRight size={16} /> Scheduling & posting</li>
                  <li><ArrowRight size={16} /> Consistency management</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="homeSection">
        <Reveal>
          <div className="ctaCard">
            <div>
              <h2 className="ctaTitle">Let’s build your brand properly.</h2>
              <p className="ctaText">Start with a positioning consultation — then keep it consistent with us managing your presence.</p>
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
      </section>
    </Page>
  )
}
