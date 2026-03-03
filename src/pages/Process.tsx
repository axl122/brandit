import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import { 
  ChevronDown, 
  CheckCircle2, 
  ArrowRight,
  User,
  Building2,
  Quote,
  FileText,
  Layout,
  Box,
  Share2,
  Settings
} from 'lucide-react'
import Page from '../components/Page'

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

function FAQItem({ question, answer, delay = 0 }: { question: string, answer: string, delay?: number }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Reveal delay={delay}>
      <div className={`faq-accordion ${isOpen ? 'is-open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <div className="faq-accordion__header">
          <h3 className="faq-accordion__title">{question}</h3>
          <ChevronDown className="faq-accordion__icon" size={20} />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="faq-accordion__content"
            >
              <p className="faq-accordion__text">{answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  )
}

export default function Process() {
  return (
    <Page title="PROCESS" lead="Premium results come from a clear process.">
      <section className="homeSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">How BrandIt works</h2>
          <p className="sectionSubtitle">A step-by-step system that builds your brand — then keeps it consistent.</p>
        </div>

        <div className="vertical-timeline">
          <div className="timeline-journey-line" />
          
          {/* Step 1 */}
          <div className="timeline-item">
            <div className="timeline-marker">1</div>
            <Reveal>
              <div className="card timeline-card">
                <div className="timeline-card__header">
                  <h3 className="cardTitle">Discovery & Positioning</h3>
                </div>
                <p className="cardText">
                  We clarify your purpose, audience, and perception — so everything has direction.
                </p>
                <div className="deliverable-tag"><FileText size={14} /> Action Roadmap</div>
              </div>
            </Reveal>
          </div>

          {/* Step 2 */}
          <div className="timeline-item">
            <div className="timeline-marker">2</div>
            <Reveal delay={0.1}>
              <div className="card timeline-card">
                <div className="timeline-card__header">
                  <h3 className="cardTitle">Brand Identity Development</h3>
                </div>
                <p className="cardText">
                  We translate strategy into a clear identity system: look, feel, tone, and standards.
                </p>
                <div className="deliverable-tag"><Box size={14} /> Brand Package</div>
              </div>
            </Reveal>
          </div>

          {/* Step 3 */}
          <div className="timeline-item">
            <div className="timeline-marker">3</div>
            <Reveal delay={0.2}>
              <div className="card timeline-card">
                <div className="timeline-card__header">
                  <h3 className="cardTitle">Guidelines & Assets</h3>
                </div>
                <p className="cardText">
                  We create the assets and guidelines that keep everything consistent across platforms.
                </p>
                <div className="deliverable-tag"><Layout size={14} /> Style Guide</div>
              </div>
            </Reveal>
          </div>

          {/* Step 4 */}
          <div className="timeline-item">
            <div className="timeline-marker">4</div>
            <Reveal delay={0.3}>
              <div className="card timeline-card">
                <div className="timeline-card__header">
                  <h3 className="cardTitle">Brand Launch Content</h3>
                </div>
                <p className="cardText">
                  We plan your launch so you show up with clarity from day one.
                </p>
                <div className="deliverable-tag"><Share2 size={14} /> Launch Kit</div>
              </div>
            </Reveal>
          </div>

          {/* Step 5 */}
          <div className="timeline-item">
            <div className="timeline-marker">5</div>
            <Reveal delay={0.4}>
              <div className="card timeline-card">
                <div className="timeline-card__header">
                  <h3 className="cardTitle">Monthly Presence Management</h3>
                </div>
                <p className="cardText">
                  We manage your presence with consistent design, content, scheduling, and refinement.
                </p>
                <div className="deliverable-tag"><Settings size={14} /> Monthly Report</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="homeSection section--tint">
        <div className="section-pattern section-pattern--grid" aria-hidden="true" />
        <div className="sectionHeader">
          <h2 className="sectionTitle">The Handover</h2>
          <p className="sectionSubtitle">You bring the context, we build the system.</p>
        </div>

        <div className="handover-container">
          <div className="handover-grid">
            <Reveal>
              <div className="handover-column client">
                <div className="handover-header">
                  <User size={32} className="icon-subtle" />
                  <h3 className="cardTitle">You provide</h3>
                </div>
                <ul className="list list--premium">
                  <li><CheckCircle2 size={16} /> Brand name & goals</li>
                  <li><CheckCircle2 size={16} /> Audience & offer details</li>
                  <li><CheckCircle2 size={16} /> Inspiration & links</li>
                </ul>
              </div>
            </Reveal>

            <div className="handover-connector">
              <ArrowRight className="connector-icon" size={24} />
            </div>

            <Reveal delay={0.1}>
              <div className="handover-column brandit">
                <div className="handover-header">
                  <Building2 size={32} className="icon-brand" />
                  <h3 className="cardTitle">We handle</h3>
                </div>
                <ul className="list list--premium">
                  <li><CheckCircle2 size={16} /> Positioning & Strategy</li>
                  <li><CheckCircle2 size={16} /> Identity & Assets</li>
                  <li><CheckCircle2 size={16} /> Content & Management</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="homeSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Our Philosophy</h2>
          <p className="sectionSubtitle">Clarity first. Credibility next. Consistency always.</p>
        </div>
        <Reveal>
          <div className="founders-card" style={{ maxWidth: '900px' }}>
            <Quote className="quote-icon" size={48} />
            <div className="founders-content">
              <p className="founders-text">
                "Process separates guessing from strategy. We build foundations so your brand is understood, remembered, and trusted."
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
        <div className="section-pattern section-pattern--dots" aria-hidden="true" />
        <div className="sectionHeader">
          <h2 className="sectionTitle">FAQ</h2>
          <p className="sectionSubtitle">Quick answers to clear the path.</p>
        </div>
        <div className="faq-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <FAQItem 
            question="What is the first step?" 
            answer="We start with discovery: goals, audience, and context before any design." 
          />
          <FAQItem 
            question="How long does the branding process take?" 
            answer="Typically 2–4 weeks for identity setup, depending on deliverables." 
          />
          <FAQItem 
            question="Do you provide source files?" 
            answer="Yes — final assets and source files are included." 
          />
        </div>
      </section>

      <section className="homeSection">
        <Reveal>
          <div className="ctaCard">
            <div>
              <h2 className="ctaTitle">Ready to start the process?</h2>
              <p className="ctaText">Start with a consultation — then build and maintain consistency.</p>
            </div>
            <div className="ctaActions">
              <Link to="/services" className="btn">Explore Services</Link>
              <Link
                to="/contact"
                className="btn btn--primary"
                onClick={(e) => {
                  e.preventDefault()
                  window.dispatchEvent(new Event('consultation:open'))
                }}
              >
                Book a consultation
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </Page>
  )
}
