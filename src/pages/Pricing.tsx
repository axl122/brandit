import { motion, useReducedMotion } from 'framer-motion'
import { useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Zap, ChevronRight } from 'lucide-react'
import Page from '../components/Page'
import { pricingServices } from './pricingData'

type RevealProps = PropsWithChildren<{ delay?: number }>

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

export default function Pricing() {
  const services = useMemo(() => pricingServices, [])

  // Categorize services for anchoring
  const categories = {
    essential: services.find(s => s.key === 'brand_consultation'),
    complete: services.find(s => s.key === 'branding'),
    growth: services.find(s => s.key === 'social_media_management'),
    others: services.filter(s => !['brand_consultation', 'branding', 'social_media_management', 'custom'].includes(s.key))
  }

  return (
    <Page title="PRICING" lead="Choose a service. Pick a tier.">
      <section className="homeSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Flexible Service Options</h2>
          <p className="sectionSubtitle">Pick what you need now — add more as you grow.</p>
        </div>

        {/* Feature Replacement */}
        <Reveal>
          <div className="card card--feature-highlight" style={{ maxWidth: '900px', margin: '0 auto 4rem', textAlign: 'center', padding: '3rem' }}>
            <h3 className="cardTitle" style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>No Hidden Fees. No Complexity.</h3>
            <p className="cardText" style={{ fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
              Transparent pricing. Choose a category below to view tiered packages.
            </p>
          </div>
        </Reveal>

        {/* 3. Trust Bar */}
        <Reveal>
          <div className="trust-bar">
            <div className="trust-item">
              <ShieldCheck size={20} />
              <span>Secure Checkout via Paystack</span>
            </div>
            <div className="trust-divider" />
            <div className="trust-item">
              <Zap size={20} />
              <span>Instant Onboarding Access</span>
            </div>
          </div>
        </Reveal>

        {/* 2. Value Hierarchy Layout */}
        <div className="pricing-gateway">
          <div className="section-pattern section-pattern--grid" aria-hidden="true" />
          
          <div className="grid grid--3">
            {categories.essential && (
              <Reveal delay={0.1}>
                <div className="card pricing-card essential">
                  <div className="kicker">The Essential Start</div>
                  <h3 className="cardTitle">{categories.essential.title}</h3>
                  <p className="cardText">{categories.essential.subtitle}</p>
                  <Link className="btn btn--primary w-full" to={`/pricing/${categories.essential.key}`}>
                    Proceed <ChevronRight size={16} />
                  </Link>
                </div>
              </Reveal>
            )}

            {categories.complete && (
              <Reveal delay={0.2}>
                <div className="card pricing-card complete highlighted">
                  <div className="premium-badge">Most Popular</div>
                  <div className="kicker">The Complete System</div>
                  <h3 className="cardTitle">{categories.complete.title}</h3>
                  <p className="cardText">{categories.complete.subtitle}</p>
                  <Link className="btn btn--primary w-full" to={`/pricing/${categories.complete.key}`}>
                    Proceed <ChevronRight size={16} />
                  </Link>
                </div>
              </Reveal>
            )}

            {categories.growth && (
              <Reveal delay={0.3}>
                <div className="card pricing-card growth">
                  <div className="kicker">The Growth Partner</div>
                  <h3 className="cardTitle">{categories.growth.title}</h3>
                  <p className="cardText">{categories.growth.subtitle}</p>
                  <Link className="btn btn--primary w-full" to={`/pricing/${categories.growth.key}`}>
                    Proceed <ChevronRight size={16} />
                  </Link>
                </div>
              </Reveal>
            )}
          </div>
        </div>

        <div className="grid grid--1" style={{ marginTop: '4rem' }}>
          <Reveal delay={0.5}>
            <div className="card card--cta-inline" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h3 className="cardTitle">Looking for a custom project?</h3>
              <p className="cardText">Tell us what you need and your budget. We’ll recommend the best path.</p>
              <div className="ctaActions" style={{ justifyContent: 'center' }}>
                <Link to="/pricing/custom" className="btn btn--primary">Request custom</Link>
                <Link to="/contact" className="btn">Ask a question</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </Page>
  )
}
