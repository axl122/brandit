import { useState } from 'react'
import { useToast } from './ToastProvider'
import { API_BASE_URL, fetchWithTimeout } from '../utils/api'

export default function ConsultationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { push } = useToast()
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email')
  const [contactValue, setContactValue] = useState('')
  const [services, setServices] = useState<string[]>([])
  const [industry, setIndustry] = useState('')
  const [timeline, setTimeline] = useState('')
  const [budget, setBudget] = useState('')
  const [note, setNote] = useState('')

  function resetForm() {
    setSubmitted(false)
    setSending(false)
    setError('')
    setStep(0)
    setName('')
    setContactMethod('email')
    setContactValue('')
    setServices([])
    setIndustry('')
    setTimeline('')
    setBudget('')
    setNote('')
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  async function sendConsultationEmail() {
    setError('')
    setSending(true)
    const subject = 'New consultation request — BrandIt'
    const chosenServices = services.join(', ') || '(not selected)'
    const text = [
      `Name: ${name}`,
      `Contact method: ${contactMethod}`,
      `Contact: ${contactValue}`,
      `Industry: ${industry || '(not provided)'}`,
      `Timeline: ${timeline || '(not provided)'}`,
      `Budget: ${budget || '(not provided)'}`,
      `Services: ${chosenServices}`,
      '',
      'Note:',
      note || '(none)',
    ].join('\n')

    try {
      const resp = await fetchWithTimeout(`${API_BASE_URL}/api/email/consultation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, text }),
      }, 60000)
      const data = await resp.json().catch(() => null)
      if (!resp.ok || !data?.ok) {
        throw new Error(data?.error || 'Failed to send. Please try again.')
      }
      push({
        type: 'success',
        title: 'Request submitted',
        message: 'Thanks — we’ll get back to you within 24 hours.',
      })
      return true
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to send. Please try again.'
      setError(msg)
      push({ type: 'error', title: 'Couldn’t send', message: msg })
      return false
    } finally {
      setSending(false)
    }
  }

  const isNameValid = name.trim().length > 0
  const isContactValid =
    contactMethod === 'email'
      ? contactValue.trim().includes('@') && contactValue.trim().length >= 5
      : contactValue.replace(/\D/g, '').length >= 7
  const isServicesValid = services.length > 0

  const canGoNext =
    !sending &&
    (step === 0 ? isNameValid : true) &&
    (step === 1 ? isContactValid : true) &&
    (step === 3 ? isServicesValid : true)

  const canSubmit = !sending && isNameValid && isContactValid && isServicesValid

  if (!open) return null
  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-label="Book a free consultation questionnaire">
      <div className="modalCard">
        <div className="modalHeader">
          <h3 className="modalTitle">Book a free consultation</h3>
          <button className="modalClose" aria-label="Close" onClick={handleClose} disabled={sending}>×</button>
        </div>

        {sending ? (
          <div className="branditLoading" aria-live="polite" aria-label="Sending consultation request">
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

        {submitted ? (
          <div className="modalBody">
            <p className="cardText">Thanks — your request was submitted successfully.</p>
            <p className="cardText" style={{ marginTop: 10 }}>We’ll review it and get back to you within 24 hours.</p>
            <div className="modalActions">
              <button className="btn btn--primary" onClick={handleClose}>Close</button>
            </div>
          </div>
        ) : (
          <div className="modalBody">
            {error ? <div className="formHint formHint--error" style={{ marginTop: 0 }}>{error}</div> : null}
            {step === 0 && (
              <div className="field">
                <div className="label">Full name</div>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} required disabled={sending} />
              </div>
            )}
            {step === 1 && (
              <>
                <div className="field">
                  <div className="label">Preferred contact</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      className={`btn${contactMethod === 'email' ? ' btn--primary' : ''}`}
                      type="button"
                      onClick={() => setContactMethod('email')}
                      disabled={sending}
                    >
                      Email
                    </button>
                    <button
                      className={`btn${contactMethod === 'phone' ? ' btn--primary' : ''}`}
                      type="button"
                      onClick={() => setContactMethod('phone')}
                      disabled={sending}
                    >
                      Phone number
                    </button>
                  </div>
                </div>
                <div className="field">
                  <div className="label">{contactMethod === 'email' ? 'Email' : 'Phone number'}</div>
                  <input
                    className="input"
                    type={contactMethod === 'email' ? 'email' : 'tel'}
                    placeholder={contactMethod === 'email' ? 'you@example.com' : '+234 ...'}
                    value={contactValue}
                    onChange={(e) => setContactValue(e.target.value)}
                    required
                    disabled={sending}
                  />
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <div className="field">
                  <div className="label">Industry</div>
                  <input
                    className="input"
                    placeholder="e.g., Beauty, Real estate, Tech, Food"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    disabled={sending}
                  />
                </div>
                <div className="field">
                  <div className="label">Timeline</div>
                  <select className="input" value={timeline} onChange={(e) => setTimeline(e.target.value)} disabled={sending}>
                    <option value="">Select</option>
                    <option value="asap">ASAP</option>
                    <option value="2-4 weeks">2–4 weeks</option>
                    <option value="1-2 months">1–2 months</option>
                    <option value="3+ months">3+ months</option>
                    <option value="not sure">Not sure yet</option>
                  </select>
                </div>
                <div className="field">
                  <div className="label">Budget</div>
                  <select className="input" value={budget} onChange={(e) => setBudget(e.target.value)} disabled={sending}>
                    <option value="">Select</option>
                    <option value="under 100k">Under ₦100k</option>
                    <option value="100k-300k">₦100k–₦300k</option>
                    <option value="300k-700k">₦300k–₦700k</option>
                    <option value="700k+">₦700k+</option>
                    <option value="not sure">Not sure yet</option>
                  </select>
                </div>
              </>
            )}
            {step === 3 && (
              <div className="field">
                <div className="label">Services needed</div>
                <div className="chipRow" style={{ marginTop: 8, justifyContent: 'flex-start' }}>
                  {[
                    { key: 'positioning', label: 'Brand positioning' },
                    { key: 'branding', label: 'Brand identity' },
                    { key: 'smm', label: 'Social media management' },
                    { key: 'website', label: 'Website' },
                  ].map((opt) => {
                    const active = services.includes(opt.key)
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        className={`chip${active ? ' is-active' : ''}`}
                        disabled={sending}
                        onClick={() => {
                          setServices((prev) => (prev.includes(opt.key) ? prev.filter((k) => k !== opt.key) : [...prev, opt.key]))
                        }}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
                {!services.length ? (
                  <div style={{ marginTop: 10, color: 'rgba(17, 17, 36, 0.65)', fontSize: 13 }}>
                    Select at least one.
                  </div>
                ) : null}
              </div>
            )}
            {step === 4 && (
              <div className="field">
                <div className="label">Short note</div>
                <textarea
                  className="textarea"
                  placeholder="Tell us about your brand or the service you need."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={sending}
                />
              </div>
            )}

            <div className="modalActions">
              {step > 0 ? (
                <button className="btn" onClick={() => setStep((s) => s - 1)}>Back</button>
              ) : (
                <span />
              )}
              {step < 4 ? (
                <button
                  className="btn btn--primary"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canGoNext}
                >
                  Next
                </button>
              ) : (
                <button
                  className="btn btn--primary"
                  onClick={() => {
                    void (async () => {
                      if (!canSubmit) {
                        setError('Please complete the required fields before submitting.')
                        return
                      }
                      const ok = await sendConsultationEmail()
                      if (ok) setSubmitted(true)
                    })()
                  }}
                  disabled={!canSubmit}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
