import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  ArrowRight,
  Zap,
  CheckCircle2
} from 'lucide-react'
import Page from '../components/Page'
import { useToast } from '../components/ToastProvider'
import { API_BASE_URL, fetchWithTimeout } from '../utils/api'

export default function Contact() {
  const { push } = useToast()
  const WHATSAPP_NUMBER = '2348157884986'
  const SUPPORT_EMAIL = 'branditfirm080@gmail.com'

  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string>('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType] = useState('')
  const [budget, setBudget] = useState('')
  const [message, setMessage] = useState('')

  const emailValid = useMemo(() => email.trim().includes('@') && email.trim().length >= 5, [email])

  function openWhatsApp(text: string) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function openConsultation() {
    window.dispatchEvent(new Event('consultation:open'))
  }

  async function sendContactEmail() {
    setError('')
    setSending(true)
    try {
      const subject = 'New contact message — BrandIt'
      const text = [
        `Name: ${name}`,
        `Email: ${email}`,
        `You are: ${type || '(not specified)'}`,
        `Budget: ${budget || '(not specified)'}`,
        '',
        'Message:',
        message,
      ].join('\n')

      const resp = await fetchWithTimeout(`${API_BASE_URL}/api/email/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, text }),
      }, 60000)
      const data = await resp.json().catch(() => null)
      if (!resp.ok || !data?.ok) {
        throw new Error(data?.error || 'Failed to send. Please try again.')
      }

      setSent(true)
      push({
        type: 'success',
        title: 'Message received',
        message: 'We’ve received your details and we’ll get back to you shortly.',
      })
      setName('')
      setEmail('')
      setType('')
      setBudget('')
      setMessage('')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to send. Please try again.'
      setError(msg)
      push({ type: 'error', title: 'Couldn’t send', message: msg })
    } finally {
      setSending(false)
    }
  }

  return (
    <Page title="CONTACT" lead="Start with a consultation. We’ll clarify direction and build from there.">
      <section className="homeSection">
        <div className="section-pattern section-pattern--dots" aria-hidden="true" />
        <div className="sectionHeader">
          <h2 className="sectionTitle">Let’s talk</h2>
          <p className="sectionSubtitle">Choose a fast option — or send a detailed message.</p>
        </div>

        <div className="grid grid--2">
          {/* 1. Preferred Communication Cards */}
          <div className="card card--contact-method">
            <div className="method-badge">Recommended</div>
            <div className="method-header">
              <div>
                <h3 className="cardTitle">Consultation</h3>
                <div className="status-indicator">
                  <span className="status-dot" />
                  <span className="status-text">Booking Available</span>
                </div>
              </div>
            </div>
            <p className="cardText">The fastest way to get clarity and pick the right package.</p>
            <div className="ctaActions">
              <button className="btn btn--primary" type="button" onClick={openConsultation}>Book consultation</button>
              <Link to="/pricing" className="btn">View Pricing</Link>
            </div>
            <div className="method-footer">
              <Clock size={14} />
              <span>Typically within 24 hours</span>
            </div>
          </div>

          <div className="card card--contact-method">
            <div className="method-header">
              <div>
                <h3 className="cardTitle">Quick message</h3>
                <div className="status-indicator">
                  <span className="status-dot status-dot--active" />
                  <span className="status-text">Active Now</span>
                </div>
              </div>
            </div>
            <p className="cardText">If you already know what you need, message us directly.</p>
            <div className="ctaActions">
              <button className="btn btn--primary" type="button" onClick={() => openWhatsApp('Hi BrandIt, I want to ask a question about branding and pricing.')}>WhatsApp</button>
              <a className="btn" href={`mailto:${SUPPORT_EMAIL}`}>Email</a>
            </div>
            <div className="method-footer">
              <Zap size={14} />
              <span>Direct access to the team</span>
            </div>
          </div>
        </div>
      </section>

      <section className="homeSection section--tint">
        <div className="section-pattern section-pattern--grid" aria-hidden="true" />
        <div className="sectionHeader">
          <h2 className="sectionTitle">Send a detailed message</h2>
          <p className="sectionSubtitle">Share your goal and what you need help with.</p>
        </div>

        {/* 2. Strategic Form Layout */}
        <div className="contact-container">
          <div className="contact-grid">
            {/* Sidebar */}
            <div className="contact-sidebar">
              <div className="sidebar-section">
                <h4 className="sidebar-title">Our Response Time</h4>
                <div className="response-badge">
                  <Clock size={18} />
                  <span>Within 24 Hours</span>
                </div>
                <p className="sidebar-text">We value your time. Our team reviews every inquiry personally to provide the best roadmap.</p>
              </div>

              <div className="sidebar-section">
                <h4 className="sidebar-title">Quick Links</h4>
                <ul className="sidebar-links">
                  <li><Link to="/pricing">Looking for pricing? <ChevronRight size={14} /></Link></li>
                  <li><Link to="/process">See our process <ChevronRight size={14} /></Link></li>
                  <li><Link to="/services">Explore services <ChevronRight size={14} /></Link></li>
                </ul>
              </div>

              <div className="sidebar-security">
                <ShieldCheck size={20} className="icon-success" />
                <span>Your information is secure and private.</span>
              </div>
            </div>

            {/* Form */}
            <div className="card contact-form-card">
              {sending ? (
                <div className="branditLoading" aria-live="polite" aria-label="Sending contact message">
                  <div className="branditLoading__card">
                    <div className="branditLoading__logo">
                      <span className="branditLoading__dot" aria-hidden="true" />
                      <span className="branditLoading__word">BrandIt</span>
                    </div>
                    <div className="branditLoading__spinner" aria-hidden="true" />
                    <div className="branditLoading__text">Sending…</div>
                    <div className="branditLoading__sub">Please wait while we deliver your message.</div>
                  </div>
                </div>
              ) : null}
              {sent ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="success-state"
                >
                  <div className="success-icon">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="cardTitle">Message received</h3>
                  <p className="cardText">We’ve received your details and we’ll get back to you shortly.</p>
                  <div className="ctaActions" style={{ justifyContent: 'center' }}>
                    <button className="btn btn--primary" type="button" onClick={() => setSent(false)}>Send another</button>
                    <Link className="btn" to="/home">Back Home</Link>
                  </div>
                </motion.div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    void sendContactEmail()
                  }}
                  className="contact-form"
                >
                  {/* Step 1: The Basics */}
                  <div className="form-step">
                    <div className="form-step-header">
                      <span className="step-num">01</span>
                      <h4 className="step-title">The Basics</h4>
                    </div>
                    <div className="grid grid--2">
                      <div className="field">
                        <label className="label">Full name</label>
                        <input className="input" value={name} onChange={(e) => setName(e.target.value)} required disabled={sending} placeholder="Your name" />
                      </div>
                      <div className="field">
                        <label className="label">Email</label>
                        <input
                          className="input"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={sending}
                          placeholder="you@example.com"
                        />
                        {!emailValid && email.trim().length > 0 ? <div className="formHint formHint--error">Enter a valid email.</div> : null}
                      </div>
                    </div>
                  </div>

                  {/* Step 2: The Context */}
                  <div className="form-step">
                    <div className="form-step-header">
                      <span className="step-num">02</span>
                      <h4 className="step-title">The Context</h4>
                    </div>
                    <div className="grid grid--2">
                      <div className="field">
                        <label className="label">You are</label>
                        <input
                          className="input"
                          placeholder="Business / Individual"
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          disabled={sending}
                        />
                      </div>
                      <div className="field">
                        <label className="label">Budget range (optional)</label>
                        <input
                          className="input"
                          placeholder="e.g. ₦50k - ₦100k"
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          disabled={sending}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 3: The Need */}
                  <div className="form-step">
                    <div className="form-step-header">
                      <span className="step-num">03</span>
                      <h4 className="step-title">The Need</h4>
                    </div>
                    <div className="field">
                      <label className="label">Message</label>
                      <textarea
                        className="textarea"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        disabled={sending}
                        placeholder="Tell us about your project..."
                      />
                    </div>
                  </div>

                  {error ? <div className="formHint formHint--error" style={{ marginBottom: '1.5rem' }}>{error}</div> : null}

                  <div className="form-footer">
                    <button
                      type="submit"
                      className="btn btn--primary btn--large"
                      disabled={sending || !name.trim() || !emailValid || !message.trim()}
                    >
                      {sending ? 'Sending…' : 'Send Message'}
                      <ArrowRight size={18} />
                    </button>
                    <p className="security-text">
                      <ShieldCheck size={14} />
                      Secure end-to-end encrypted message
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </Page>
  )
}
