import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { 
  CheckCircle2, 
  ChevronDown, 
  Building2,
  User,
  Layout,
  Calendar,
  PenTool,
  Video,
  Settings,
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

export default function Services() {
  const [openKey, setOpenKey] = useState<null | 'consultation' | 'oneoff' | 'identity' | 'management'>(null)

  const modalContent = (key: NonNullable<typeof openKey>) => {
    switch (key) {
      case 'consultation':
        return {
          title: 'Brand Consultation',
          body: (
            <>
              <p className="cardText" style={{ marginTop: 0 }}>
                If you feel unsure about what your brand should say, who it’s really for, or what to fix first, this is where we start.
              </p>
              <p className="cardText">
                BrandIt reviews your current presence, identifies what’s holding you back, and gives you a clear direction you can act on.
                You leave with priorities, positioning guidance, and a simple plan.
              </p>
              <p className="cardText">
                You can use the roadmap yourself, or you can let BrandIt handle the next step (identity, content, or management) once the direction is clear.
              </p>
              <p className="cardText" style={{ marginBottom: 0 }}>
                Best for founders and businesses that want clarity before spending on design.
              </p>
            </>
          ),
        }
      case 'oneoff':
        return {
          title: 'One-off Services',
          body: (
            <>
              <p className="cardText" style={{ marginTop: 0 }}>
                Need one deliverable done properly without committing to a full package? One-off services are perfect.
              </p>
              <p className="cardText">
                BrandIt designs the exact asset you need (website, graphics, video edits, or a content calendar) and makes sure it matches your brand.
                The output is clean and premium, and it is ready to use.
              </p>
              <p className="cardText">
                If you already have branding, we align to it. If you don’t, we keep it simple and consistent so your content still looks professional.
              </p>
              <p className="cardText" style={{ marginBottom: 0 }}>
                Best for quick upgrades, launches, or when you need results fast.
              </p>
            </>
          ),
        }
      case 'identity':
        return {
          title: 'Brand Identity & Assets',
          body: (
            <>
              <p className="cardText" style={{ marginTop: 0 }}>
                This is for building a full identity system, not just a logo.
              </p>
              <p className="cardText">
                BrandIt creates the look and feel your audience will recognize: logo direction, typography, color system, and assets/templates that keep everything consistent.
                You get a brand that feels intentional across every platform.
              </p>
              <p className="cardText">
                The goal is simple: when people see your pages, they instantly know it’s you, and it feels premium.
              </p>
              <p className="cardText" style={{ marginBottom: 0 }}>
                Best for new brands, rebrands, or businesses ready to look premium.
              </p>
            </>
          ),
        }
      case 'management':
        return {
          title: 'Brand Management',
          body: (
            <>
              <p className="cardText" style={{ marginTop: 0 }}>
                If consistency is the problem, management is the solution.
              </p>
              <p className="cardText">
                BrandIt handles monthly planning, design, and content standards so your pages stay active and professional.
                You don’t have to guess what to post. We keep the system running.
              </p>
              <p className="cardText">
                You approve the direction, and we execute it with the same look and message every month.
              </p>
              <p className="cardText" style={{ marginBottom: 0 }}>
                Best for brands that want steady growth and a reliable presence.
              </p>
            </>
          ),
        }
    }
  }

  return (
    <Page
      title="SERVICES"
      lead="Clarity, identity, and digital presence — delivered through four service categories."
    >
      <section className="homeSection section--tint">
        <div className="section-pattern section-pattern--dots" aria-hidden="true" />
        <div className="sectionHeader">
          <h2 className="sectionTitle">Service categories</h2>
          <p className="sectionSubtitle">Choose what you need now; add more as you grow.</p>
        </div>

        <div className="container">
          <div className="serviceVideo">
            <video
              className="serviceVideo__player"
              src="/showcase/video 1.mp4"
              muted
              playsInline
              autoPlay
              loop
              preload="metadata"
              controls
            />
          </div>
        </div>

        <div className="grid grid--2">
          <Reveal>
            <div className="card card--service">
              <div className="stepMedia" aria-hidden="true">
                <img
                  className="stepMedia__img"
                  src="/showcase/consult.webp"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={800}
                />
              </div>
              <h3 className="cardTitle">1. BRAND CONSULTATION</h3>
              <p className="cardText">For clarity and direction before execution.</p>
              <div className="ctaActions" style={{ marginTop: 10 }}>
                <button type="button" className="btn btn--primary" onClick={() => setOpenKey('consultation')}>
                  Read more
                </button>
              </div>
              <div className="service-details">
                <strong>Includes:</strong>
                <ul className="list list--premium">
                  <li><CheckCircle2 size={16} /> Brand audit & diagnostics</li>
                  <li><CheckCircle2 size={16} /> Brand positioning recommendations</li>
                  <li><CheckCircle2 size={16} /> Messaging & perception analysis</li>
                  <li><CheckCircle2 size={16} /> Action roadmap</li>
                </ul>
              </div>
              <p className="cardText cardText--outcome"><strong>Outcome:</strong> Clear next steps.</p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="card card--service">
              <div className="stepMedia" aria-hidden="true">
                <img
                  className="stepMedia__img"
                  src="/showcase/ui.webp"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={800}
                />
              </div>
              <h3 className="cardTitle">2. ONE-OFF SERVICES</h3>
              <p className="cardText">For one specific deliverable.</p>
              <div className="ctaActions" style={{ marginTop: 10 }}>
                <button type="button" className="btn btn--primary" onClick={() => setOpenKey('oneoff')}>
                  Read more
                </button>
              </div>
              <div className="service-details">
                <strong>Includes:</strong>
                <ul className="list list--premium">
                  <li><Layout size={16} /> Website Design</li>
                  <li><PenTool size={16} /> Graphic Design</li>
                  <li><Video size={16} /> Video Editing</li>
                  <li><Calendar size={16} /> Content Calendar</li>
                </ul>
              </div>
              <p className="cardText cardText--outcome"><strong>Outcome:</strong> Professional output.</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card card--service">
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
              <h3 className="cardTitle">3. BRAND IDENTITY & ASSETS</h3>
              <p className="cardText">For building your full identity system.</p>
              <div className="ctaActions" style={{ marginTop: 10 }}>
                <button type="button" className="btn btn--primary" onClick={() => setOpenKey('identity')}>
                  Read more
                </button>
              </div>
              <div className="service-details">
                <strong>Includes:</strong>
                <ul className="list list--premium">
                  <li><CheckCircle2 size={16} /> Logo & identity system</li>
                  <li><CheckCircle2 size={16} /> Style guide + brand theme</li>
                  <li><CheckCircle2 size={16} /> Digital brand assets</li>
                  <li><CheckCircle2 size={16} /> Brand motion visuals</li>
                </ul>
              </div>
              <p className="cardText cardText--outcome"><strong>Outcome:</strong> A consistent, premium brand.</p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="card card--service">
              <div className="stepMedia" aria-hidden="true">
                <img
                  className="stepMedia__img"
                  src="/showcase/management.webp"
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={1200}
                  height={800}
                />
              </div>
              <h3 className="cardTitle">4. BRAND MANAGEMENT</h3>
              <p className="cardText">For monthly consistency and growth.</p>
              <div className="ctaActions" style={{ marginTop: 10 }}>
                <button type="button" className="btn btn--primary" onClick={() => setOpenKey('management')}>
                  Read more
                </button>
              </div>
              <div className="service-details">
                <strong>Includes:</strong>
                <ul className="list list--premium">
                  <li><Settings size={16} /> Content strategy</li>
                  <li><Settings size={16} /> Content design + production</li>
                  <li><Settings size={16} /> Page optimization</li>
                  <li><Settings size={16} /> Analytics + refinement</li>
                </ul>
              </div>
              <p className="cardText cardText--outcome"><strong>Outcome:</strong> Sustained recognition.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {openKey
        ? createPortal(
            <div
              className="modalOverlay"
              role="dialog"
              aria-modal="true"
              aria-label="Service details"
              onClick={() => setOpenKey(null)}
            >
              <div className="modalCard" onClick={(e) => e.stopPropagation()}>
                <div className="modalHeader">
                  <div className="modalTitle">{modalContent(openKey).title}</div>
                  <button type="button" className="modalClose" onClick={() => setOpenKey(null)} aria-label="Close">
                    ×
                  </button>
                </div>
                <div className="modalBody">{modalContent(openKey).body}</div>
              </div>
            </div>,
            document.body
          )
        : null}

      <section className="homeSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Recommended path</h2>
          <p className="sectionSubtitle">A strategic sequence for maximum impact.</p>
        </div>
        
        <div className="timeline-container">
          <div className="timeline-line" />
          <div className="grid grid--3">
            <Reveal>
              <div className="timeline-step">
                <div className="timeline-dot">1</div>
                <h3 className="cardTitle">Consultation</h3>
                <p className="cardText">Positioning, message, and roadmap.</p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="timeline-step">
                <div className="timeline-dot">2</div>
                <h3 className="cardTitle">Identity & Assets</h3>
                <p className="cardText">Your system: logo, theme, and assets.</p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="timeline-step">
                <div className="timeline-dot">3</div>
                <h3 className="cardTitle">Management</h3>
                <p className="cardText">Monthly planning and execution.</p>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.3}>
          <div className="card card--cta-inline" style={{ maxWidth: '700px', margin: '3rem auto 0' }}>
            <h3 className="cardTitle">Need a custom mix?</h3>
            <p className="cardText">Tell us what you need and your budget. We’ll recommend the best path.</p>
            <div className="ctaActions" style={{ justifyContent: 'center' }}>
              <Link to="/pricing/custom" className="btn btn--primary">Request custom</Link>
              <Link to="/pricing" className="btn">View Pricing</Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="homeSection section--tint">
        <div className="section-pattern section-pattern--grid" aria-hidden="true" />
        <div className="sectionHeader">
          <h2 className="sectionTitle">FAQ</h2>
          <p className="sectionSubtitle">Quick answers before you book.</p>
        </div>

        <div className="faq-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <FAQItem 
            question="Do I need consultation first?" 
            answer="Yes if you want clarity and direction. If you already know exactly what you need, you can pick a service directly." 
            delay={0}
          />
          <FAQItem 
            question="Can I do branding now and management later?" 
            answer="Absolutely. Most clients start with identity first, then move into monthly management once the system is built." 
            delay={0.05}
          />
          <FAQItem 
            question="What if I have a small budget?" 
            answer="Start with consultation. We’ll prioritize what matters most so you can grow into the full system." 
            delay={0.1}
          />
          <FAQItem 
            question="Do you work with individuals?" 
            answer="Yes. We build personal brands for founders, professionals, and creators who want authority and consistency." 
            delay={0.15}
          />
        </div>
      </section>

      <section className="homeSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Who it’s for</h2>
          <p className="sectionSubtitle">Tailored strategies for different goals.</p>
        </div>
        <div className="grid grid--2">
          <Reveal>
            <div className="card card--feature">
              <Building2 className="icon-brand" size={32} />
              <h3 className="cardTitle">Businesses</h3>
              <p className="cardText">Startups & companies that need credibility and trust to scale.</p>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="card card--feature">
              <User className="icon-brand" size={32} />
              <h3 className="cardTitle">Individuals</h3>
              <p className="cardText">Founders and creators who want influence and clear authority.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="homeSection">
        <Reveal>
          <div className="ctaCard">
            <div>
              <h2 className="ctaTitle">Ready to build your presence?</h2>
              <p className="ctaText">Pick a one-time setup, monthly management, or consultation-only plan.</p>
            </div>
            <div>
              <Link to="/pricing" className="btn btn--primary">View Pricing</Link>
            </div>
          </div>
        </Reveal>
      </section>
    </Page>
  )
}
