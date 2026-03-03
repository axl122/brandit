import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Page from '../components/Page'
import { useToast } from '../components/ToastProvider'
import { API_BASE_URL, fetchWithTimeout } from '../utils/api'

export default function PaymentComplete() {
  const { push } = useToast()
  const [params] = useSearchParams()
  const reference = params.get('reference') || params.get('trxref') || ''

  const [loading, setLoading] = useState(true)
  const [paid, setPaid] = useState(false)
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')

  const title = useMemo(() => (paid ? 'PAYMENT SUCCESSFUL' : 'PAYMENT STATUS'), [paid])

  async function copyReference() {
    try {
      if (!reference) return
      await navigator.clipboard.writeText(reference)
      push({ type: 'success', title: 'Copied', message: 'Reference copied.' })
    } catch {
      try {
        const el = document.createElement('textarea')
        el.value = reference
        el.style.position = 'fixed'
        el.style.left = '-9999px'
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        push({ type: 'success', title: 'Copied', message: 'Reference copied.' })
      } catch {
        push({ type: 'error', title: 'Copy failed', message: 'Unable to copy reference.' })
      }
    }
  }

  useEffect(() => {
    let alive = true

    async function run() {
      if (!reference) {
        setError('Missing payment reference.')
        setLoading(false)
        return
      }

      try {
        const resp = await fetchWithTimeout(`${API_BASE_URL}/api/paystack/verify?reference=${encodeURIComponent(reference)}`, {
          method: 'GET',
        }, 60000)
        const data = await resp.json().catch(() => null)
        if (!resp.ok || !data?.ok) {
          throw new Error(data?.error || 'Unable to verify payment')
        }

        if (!alive) return
        setPaid(Boolean(data.paid))
        setStatus(String(data.status || ''))
        setLoading(false)
      } catch (e: unknown) {
        if (!alive) return
        const msg = e instanceof Error ? e.message : 'Unable to verify payment'
        setError(msg)
        setLoading(false)
      }
    }

    void run()

    return () => {
      alive = false
    }
  }, [reference])

  if (loading) {
    return (
      <div className="loaderOverlay" role="status" aria-live="polite" aria-label="Verifying payment">
        <div className="loaderWord" aria-hidden="true">
          <span>B</span>
          <span>r</span>
          <span>a</span>
          <span>n</span>
          <span>d</span>
          <span>I</span>
          <span>t</span>
        </div>
      </div>
    )
  }

  return (
    <Page title={title} lead={paid ? 'We will contact you immediately.' : 'We are checking your payment status.'}>
      <section className="homeSection">
        <div className="card">
          {paid ? (
            <>
              <h3 className="cardTitle">Thank you</h3>
              <p className="cardText" style={{ marginTop: 8 }}>
                Your payment was successful. We will contact you immediately.
              </p>
              <p className="cardText" style={{ marginTop: 8 }}>
                Reference: <strong>{reference}</strong>
              </p>
              <div className="ctaActions">
                <button className="btn" type="button" onClick={() => void copyReference()}>
                  Copy reference
                </button>
              </div>

              <div className="card" style={{ boxShadow: 'none' }}>
                <h4 style={{ margin: 0 }}>Next steps</h4>
                <ul className="list" style={{ marginTop: 10 }}>
                  <li>We’ll reach you using the contact details you provided.</li>
                  <li>Prepare your brand links (Instagram, website, etc.) if available.</li>
                  <li>We’ll confirm timeline and deliverables before starting.</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <h3 className="cardTitle">Payment not confirmed</h3>
              <p className="cardText" style={{ marginTop: 8 }}>
                Status: <strong>{status || 'unknown'}</strong>
              </p>
              <p className="cardText" style={{ marginTop: 8 }}>
                Reference: <strong>{reference}</strong>
              </p>
              {error ? (
                <p className="cardText" style={{ marginTop: 8 }}>
                  {error}
                </p>
              ) : null}

              <div className="ctaActions">
                <button className="btn" type="button" onClick={() => void copyReference()}>
                  Copy reference
                </button>
              </div>

              <div className="formHint">
                If you just paid, wait 10–30 seconds and refresh. If it still doesn’t confirm, contact us with your reference.
              </div>
            </>
          )}

          <div className="ctaActions">
            <Link className="btn btn--primary" to="/pricing">
              Back to Pricing
            </Link>
            <Link className="btn" to="/home">
              Go Home
            </Link>
          </div>
        </div>
      </section>
    </Page>
  )
}
