import { useMemo, useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link, Navigate, useParams } from 'react-router-dom'
import Page from '../components/Page'
import type { Service, ServiceKey, Tier } from './pricingData'
import { pricingServices } from './pricingData'
import { useToast } from '../components/ToastProvider'
import { API_BASE_URL, fetchWithTimeout } from '../utils/api'

export default function PricingService() {
  const { push } = useToast()
  const WHATSAPP_NUMBER = '2348157884986'
  const { key } = useParams<{ key: ServiceKey }>()

  useEffect(() => {
    const head = document.head
    const links: HTMLLinkElement[] = []

    const add = (rel: string, href: string, extra?: (l: HTMLLinkElement) => void) => {
      const el = document.createElement('link')
      el.rel = rel
      el.href = href
      if (extra) extra(el)
      head.appendChild(el)
      links.push(el)
    }

    add('dns-prefetch', 'https://checkout.paystack.com')
    add('preconnect', 'https://checkout.paystack.com', (l) => {
      l.crossOrigin = 'anonymous'
    })

    return () => {
      for (const l of links) l.remove()
    }
  }, [])

  const service: Service | undefined = useMemo(() => pricingServices.find((s) => s.key === key), [key])

  const [customName, setCustomName] = useState('')
  const [customContact, setCustomContact] = useState('')
  const [customEmail, setCustomEmail] = useState('')
  const [customRows, setCustomRows] = useState<Array<{ service: string; amount: string }>>([{ service: '', amount: '' }])
  const [customNote, setCustomNote] = useState('')
  const [customSending, setCustomSending] = useState(false)
  const [customSent, setCustomSent] = useState(false)
  const [customError, setCustomError] = useState('')

  const [smmName, setSmmName] = useState('')
  const [smmContact, setSmmContact] = useState('')
  const [smmEmail, setSmmEmail] = useState('')
  const [smmMessage, setSmmMessage] = useState('')
  const [smmSending, setSmmSending] = useState(false)
  const [smmSent, setSmmSent] = useState(false)
  const [smmError, setSmmError] = useState('')

  const [payOpen, setPayOpen] = useState(false)
  const [payStep, setPayStep] = useState(0)
  const [payLoading, setPayLoading] = useState(false)
  const [payError, setPayError] = useState('')
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null)
  const [payEmail, setPayEmail] = useState('')
  const [payEmailTouched, setPayEmailTouched] = useState(false)
  const payEmailRef = useRef<HTMLInputElement | null>(null)
  const [payContactMethod, setPayContactMethod] = useState<'call' | 'whatsapp'>('call')
  const [payContactNumber, setPayContactNumber] = useState('')
  const [payExtraInfo, setPayExtraInfo] = useState('')

  const payEmailValid = payEmail.trim().includes('@')
  const showPayEmailError = payEmailTouched && !payEmailValid

  const payStepsTotal = 3

  if (!key) return <Navigate to="/pricing" replace />
  if (!service) return <Navigate to="/pricing" replace />

  function amountForPriceLabel(price: string): number {
    const amountMap: Record<string, number> = {
      '₦50': 50,
      '₦9,999': 9999,
      '₦12,999': 12999,
      '₦34,999': 34999,
      '₦64,999': 64999,
      '₦99,999': 99999,
    }
    return amountMap[price] || 0
  }

  async function sendMail(subject: string, body: string) {
    const resp = await fetchWithTimeout(`${API_BASE_URL}/api/email/pricing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, text: body }),
    }, 60000)
    const data = await resp.json().catch(() => null)
    if (!resp.ok || !data?.ok) {
      throw new Error(data?.error || 'Failed to send message. Please try again.')
    }
    return true
  }

  function resetSmm() {
    setSmmSent(false)
    setSmmSending(false)
    setSmmError('')
    setSmmName('')
    setSmmContact('')
    setSmmEmail('')
    setSmmMessage('')
  }

  function resetCustom() {
    setCustomSent(false)
    setCustomSending(false)
    setCustomError('')
    setCustomName('')
    setCustomContact('')
    setCustomEmail('')
    setCustomRows([{ service: '', amount: '' }])
    setCustomNote('')
  }

  function openWhatsApp(message: string) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function startPayment(args: {
    amountNaira: number
    email: string
    metadata: unknown
    serviceTitle: string
    tierName: string
    priceLabel: string
    contactMethod: 'call' | 'whatsapp'
    contactNumber: string
    extraInfo: string
    callbackUrl: string
  }) {
    try {
      const resp = await fetchWithTimeout(`${API_BASE_URL}/api/paystack/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      }, 60000)
      const data = await resp.json().catch(() => null)
      if (!resp.ok || !data?.ok || !data?.authorization_url) {
        const msg = data?.error || 'Unable to start payment. Please try again.'
        setPayError(msg)
        push({ type: 'error', title: 'Payment couldn’t start', message: msg })
        return false
      }
      window.location.href = data.authorization_url
      return true
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Network error. Please try again.'
      setPayError(msg)
      push({ type: 'error', title: 'Network error', message: msg })
      return false
    }
  }

  function openPayFlow(tier: Tier) {
    setSelectedTier(tier)
    setPayOpen(true)
    setPayStep(0)
    setPayLoading(false)
    setPayError('')
    setPayEmail('')
    setPayEmailTouched(false)
    setPayContactMethod('call')
    setPayContactNumber('')
    setPayExtraInfo('')
    requestAnimationFrame(() => payEmailRef.current?.focus())
  }

  function closePayFlow() {
    if (payLoading) return
    setPayOpen(false)
  }

  const title = service.title.toUpperCase()

  return (
    <Page title={title} lead={service.subtitle}>
      <section className="homeSection">
        <div className="sectionHeader">
          <h2 className="sectionTitle">{service.title}</h2>
          <p className="sectionSubtitle">Pick a tier below to proceed.</p>
        </div>

        <div className="card">
          <h3 className="cardTitle">What happens next</h3>
          <ul className="list">
            <li>Choose a tier and complete payment (Paystack)</li>
            <li>You’ll be redirected back to confirm your payment status</li>
            <li>We contact you immediately to begin the process</li>
          </ul>
        </div>

        <div className="ctaActions">
          <Link className="btn" to="/pricing">Back to Pricing</Link>
          <Link className="btn" to="/services">View Services</Link>
        </div>

        {service.key !== 'custom' ? (
          <>
            <div className="card">
              <h3 className="cardTitle">Tier comparison</h3>
              <p className="cardText">A quick overview before you choose.</p>
              <div className="grid grid--2">
                {service.tiers.map((t) => (
                  <div key={`summary-${t.name}`} className="card" style={{ boxShadow: 'none' }}>
                    <h4 style={{ margin: 0 }}>{t.name}</h4>
                    <div style={{ marginTop: 6 }}>
                      <strong>{t.price}</strong>
                    </div>
                    <div className="formHint" style={{ marginTop: 6 }}>{t.items.length} deliverables</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid--2">
              {service.tiers.map((t) => (
                <div key={t.name} className="card">
                  <h3 className="cardTitle">{t.name}</h3>
                  <p className="cardText" style={{ marginTop: 6 }}>
                    <strong>{t.price}</strong>
                  </p>
                  <ul className="list">
                    {t.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                  <div className="ctaActions">
                    <button
                      className="btn btn--primary"
                      type="button"
                      onClick={() => {
                        openPayFlow(t)
                      }}
                    >
                      Pay now
                    </button>
                    <button
                      className="btn"
                      type="button"
                      onClick={() => {
                        const msg = `Hi BrandIt, I want to pay for ${service.title} - ${t.name} (${t.price}).`
                        openWhatsApp(msg)
                      }}
                    >
                      Message us
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {service.key === 'social_media_management' && service.hasOther ? (
              <div className="card">
                <h3 className="cardTitle">Other</h3>
                <p className="cardText">Send your preferred duration, platforms, and posting frequency.</p>

                {smmSending ? (
                  <div className="branditLoading" aria-live="polite" aria-label="Sending message">
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

                {smmSent ? (
                  <div style={{ marginTop: 12 }}>
                    <div className="formHint" style={{ marginTop: 0 }}>Message sent successfully.</div>
                    <p className="cardText" style={{ marginTop: 8 }}>Thanks — we’ll get back to you shortly.</p>
                    <div className="ctaActions">
                      <button className="btn btn--primary" type="button" onClick={resetSmm}>
                        Send another
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {smmError ? <div className="formHint formHint--error" style={{ marginTop: 12 }}>{smmError}</div> : null}

                <div className="grid grid--2">
                  <div className="field">
                    <div className="label">Name</div>
                    <input className="input" value={smmName} onChange={(e) => setSmmName(e.target.value)} disabled={smmSending} />
                  </div>
                  <div className="field">
                    <div className="label">Email or phone</div>
                    <input className="input" value={smmContact} onChange={(e) => setSmmContact(e.target.value)} disabled={smmSending} />
                  </div>
                </div>

                <div className="grid grid--2">
                  <div className="field">
                    <div className="label">Email (optional)</div>
                    <input className="input" type="email" value={smmEmail} onChange={(e) => setSmmEmail(e.target.value)} disabled={smmSending} />
                  </div>
                  <div className="field">
                    <div className="label">Message</div>
                    <textarea className="textarea" value={smmMessage} onChange={(e) => setSmmMessage(e.target.value)} disabled={smmSending} />
                  </div>
                </div>

                <div className="ctaActions">
                  <button className="btn" type="button" onClick={() => openWhatsApp('Hi BrandIt, I want to discuss Social media management (Other).')}>
                    Message us
                  </button>
                  <button
                    className="btn btn--primary"
                    type="button"
                    onClick={() => {
                      const body = [
                        `Name: ${smmName}`,
                        `Contact: ${smmContact}`,
                        `Email: ${smmEmail}`,
                        '',
                        `Request: Social media management (Other)`,
                        '',
                        smmMessage,
                      ].join('\n')
                      void (async () => {
                        setSmmError('')
                        setSmmSending(true)
                        try {
                          await sendMail('Social media management — custom request', body)
                          setSmmSent(true)
                          push({
                            type: 'success',
                            title: 'Message sent',
                            message: 'Thanks — we’ll get back to you shortly.',
                          })
                        } catch (e: unknown) {
                          const msg = e instanceof Error ? e.message : 'Failed to send message. Please try again.'
                          setSmmError(msg)
                          push({ type: 'error', title: 'Couldn’t send', message: msg })
                        } finally {
                          setSmmSending(false)
                        }
                      })()
                    }}
                    disabled={!smmName.trim() || !smmContact.trim() || !smmMessage.trim()}
                  >
                    Send
                  </button>
                </div>
                  </>
                )}
              </div>
            ) : null}
          </>
        ) : (
          <div className="card">
            <h3 className="cardTitle">Custom request</h3>
            <p className="cardText">Specify the services you want and the amount you want for each.</p>

            {customSending ? (
              <div className="branditLoading" aria-live="polite" aria-label="Sending message">
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

            {customSent ? (
              <div style={{ marginTop: 12 }}>
                <div className="formHint" style={{ marginTop: 0 }}>Message sent successfully.</div>
                <p className="cardText" style={{ marginTop: 8 }}>Thanks — we’ll get back to you shortly.</p>
                <div className="ctaActions">
                  <button className="btn btn--primary" type="button" onClick={resetCustom}>
                    Send another
                  </button>
                </div>
              </div>
            ) : (
              <>
                {customError ? <div className="formHint formHint--error" style={{ marginTop: 12 }}>{customError}</div> : null}

            <div className="grid grid--2">
              <div className="field">
                <div className="label">Name</div>
                <input className="input" value={customName} onChange={(e) => setCustomName(e.target.value)} disabled={customSending} />
              </div>
              <div className="field">
                <div className="label">Email or phone</div>
                <input className="input" value={customContact} onChange={(e) => setCustomContact(e.target.value)} disabled={customSending} />
              </div>
            </div>

            <div className="grid grid--2">
              <div className="field">
                <div className="label">Email (optional)</div>
                <input className="input" type="email" value={customEmail} onChange={(e) => setCustomEmail(e.target.value)} disabled={customSending} />
              </div>
              <div className="field">
                <div className="label">Note (optional)</div>
                <input className="input" value={customNote} onChange={(e) => setCustomNote(e.target.value)} disabled={customSending} />
              </div>
            </div>

            <div className="field">
              <div className="label">Services + budgets</div>
              <div className="pricingRows">
                {customRows.map((row, i) => (
                  <div key={i} className="pricingRow">
                    <input
                      className="input"
                      placeholder="Service (e.g. website, flyers, video edit)"
                      value={row.service}
                      onChange={(e) =>
                        setCustomRows((r) => r.map((x, idx) => (idx === i ? { ...x, service: e.target.value } : x)))
                      }
                      disabled={customSending}
                    />
                    <input
                      className="input"
                      placeholder="Amount (₦)"
                      value={row.amount}
                      onChange={(e) =>
                        setCustomRows((r) => r.map((x, idx) => (idx === i ? { ...x, amount: e.target.value } : x)))
                      }
                      disabled={customSending}
                    />
                    <button
                      className="btn"
                      type="button"
                      onClick={() => setCustomRows((r) => r.filter((_, idx) => idx !== i))}
                      disabled={customSending || customRows.length === 1}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <div>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => setCustomRows((r) => [...r, { service: '', amount: '' }])}
                    disabled={customSending}
                  >
                    Add another service
                  </button>
                </div>
              </div>
            </div>

            <div className="ctaActions">
              <button
                className="btn"
                type="button"
                onClick={() => openWhatsApp('Hi BrandIt, I want a custom service pricing quote.')}
              >
                Message us
              </button>
              <button
                className="btn btn--primary"
                type="button"
                onClick={() => {
                  const rows = customRows
                    .filter((r) => r.service.trim() || r.amount.trim())
                    .map((r) => `- ${r.service.trim() || '(service)'} — ${r.amount.trim() || '(amount)'}`)
                    .join('\n')
                  const body = [
                    `Name: ${customName}`,
                    `Contact: ${customContact}`,
                    `Email: ${customEmail}`,
                    '',
                    'Requested services:',
                    rows || '- (none)',
                    '',
                    'Details:',
                    customNote || '(none)',
                  ].join('\n')
                  void (async () => {
                    setCustomError('')
                    setCustomSending(true)
                    try {
                      await sendMail('Custom pricing request', body)
                      setCustomSent(true)
                      push({
                        type: 'success',
                        title: 'Message sent',
                        message: 'Thanks — we’ll get back to you shortly.',
                      })
                    } catch (e: unknown) {
                      const msg = e instanceof Error ? e.message : 'Failed to send message. Please try again.'
                      setCustomError(msg)
                      push({ type: 'error', title: 'Couldn’t send', message: msg })
                    } finally {
                      setCustomSending(false)
                    }
                  })()
                }}
                disabled={customSending || !customName.trim() || !customContact.trim()}
              >
                Send
              </button>
            </div>
              </>
            )}
          </div>
        )}
      </section>

      {payOpen && selectedTier
        ? createPortal(
            <div className="modalOverlay" role="dialog" aria-modal="true" aria-label="Payment details">
              <div className="modalCard">
                <div className="modalHeader">
                  <h3 className="modalTitle">Complete payment</h3>
                  <button className="modalClose" aria-label="Close" onClick={closePayFlow} disabled={payLoading}>
                    ×
                  </button>
                </div>

                <div className="modalBody">
                  {payLoading ? (
                    <div className="branditLoading" aria-live="polite" aria-label="Starting Paystack">
                      <div className="branditLoading__card">
                        <div className="branditLoading__logo">
                          <span className="branditLoading__dot" aria-hidden="true" />
                          <span className="branditLoading__word">BrandIt</span>
                        </div>
                        <div className="branditLoading__spinner" aria-hidden="true" />
                        <div className="branditLoading__text">Opening Paystack…</div>
                        <div className="branditLoading__sub">Please wait — do not close this window.</div>
                      </div>
                    </div>
                  ) : null}
                  {payError ? (
                    <div className="formHint formHint--error" style={{ marginTop: 0 }}>
                      {payError}
                    </div>
                  ) : null}
                  <div className="formHint" style={{ marginTop: 0 }}>
                    Step {payStep + 1} of {payStepsTotal}
                  </div>
                  <p className="cardText" style={{ marginTop: 0 }}>
                    <strong>{service.title}</strong> — {selectedTier.name} ({selectedTier.price})
                  </p>

                  {payStep === 0 ? (
                    <div className="field">
                      <div className="label">Paystack email</div>
                      <input
                        className="input"
                        type="email"
                        placeholder="you@example.com"
                        value={payEmail}
                        onChange={(e) => setPayEmail(e.target.value)}
                        onBlur={() => setPayEmailTouched(true)}
                        ref={payEmailRef}
                      />
                      {showPayEmailError ? (
                        <div className="formHint formHint--error">Enter a valid email to start payment.</div>
                      ) : (
                        <div className="formHint">Used for your Paystack receipt only.</div>
                      )}
                    </div>
                  ) : null}

                  {payStep === 1 ? (
                    <>
                      <div className="field">
                        <div className="label">How do we contact you?</div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <button
                            className={`btn${payContactMethod === 'call' ? ' btn--primary' : ''}`}
                            type="button"
                            onClick={() => setPayContactMethod('call')}
                            disabled={payLoading}
                          >
                            Call
                          </button>
                          <button
                            className={`btn${payContactMethod === 'whatsapp' ? ' btn--primary' : ''}`}
                            type="button"
                            onClick={() => setPayContactMethod('whatsapp')}
                            disabled={payLoading}
                          >
                            WhatsApp
                          </button>
                        </div>
                      </div>
                      <div className="field">
                        <div className="label">Phone number</div>
                        <input
                          className="input"
                          type="tel"
                          placeholder="+234..."
                          value={payContactNumber}
                          onChange={(e) => setPayContactNumber(e.target.value)}
                          disabled={payLoading}
                        />
                        <div className="formHint">We will use this number to reach you based on your choice.</div>
                      </div>
                    </>
                  ) : null}

                  {payStep === 2 ? (
                    <div className="field">
                      <div className="label">Additional info (optional)</div>
                      <textarea
                        className="textarea"
                        placeholder="Any extra information we should know before we start?"
                        value={payExtraInfo}
                        onChange={(e) => setPayExtraInfo(e.target.value)}
                        disabled={payLoading}
                      />
                      <div className="formHint">If you don’t have any, you can click Pay.</div>
                      <div className="ctaActions">
                        <button
                          className="btn"
                          type="button"
                          onClick={() => {
                            const msg = `Hi BrandIt, I want to pay for ${service.title} - ${selectedTier.name} (${selectedTier.price}).`
                            openWhatsApp(msg)
                          }}
                          disabled={payLoading}
                        >
                          Prefer WhatsApp?
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="modalActions">
                    {payStep > 0 ? (
                      <button className="btn" type="button" onClick={() => setPayStep((s) => s - 1)} disabled={payLoading}>
                        Back
                      </button>
                    ) : (
                      <span />
                    )}

                    {payStep < 2 ? (
                      <button
                        className="btn btn--primary"
                        type="button"
                        onClick={() => {
                          if (payStep === 0) setPayEmailTouched(true)
                          setPayStep((s) => s + 1)
                        }}
                        disabled={
                          payLoading ||
                          (payStep === 0 && !payEmailValid) ||
                          (payStep === 1 && payContactNumber.replace(/\D/g, '').length < 7)
                        }
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        className="btn btn--primary"
                        type="button"
                        onClick={async () => {
                          const amount = amountForPriceLabel(selectedTier.price)
                          if (!amount) {
                            setPayError('Amount not configured for this tier.')
                            return
                          }
                          const enteredEmail = payEmail.trim()
                          if (!enteredEmail.includes('@')) {
                            setPayEmailTouched(true)
                            return
                          }

                          setPayError('')

                          setPayLoading(true)
                          const ok = await startPayment({
                            amountNaira: amount,
                            email: enteredEmail,
                            metadata: {
                              service: service.title,
                              tier: selectedTier.name,
                              price: selectedTier.price,
                              referenceLabel: `${service.title} — ${selectedTier.name} (${selectedTier.price})`,
                            },
                            serviceTitle: service.title,
                            tierName: selectedTier.name,
                            priceLabel: selectedTier.price,
                            contactMethod: payContactMethod,
                            contactNumber: payContactNumber,
                            extraInfo: payExtraInfo,
                            callbackUrl: `${window.location.origin}/payment/complete`,
                          })
                          setPayLoading(false)
                          if (!ok) setPayOpen(true)
                        }}
                        disabled={payLoading}
                      >
                        Pay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </Page>
  )
}
