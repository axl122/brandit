import { useEffect, useMemo, useState } from 'react'

type CookiePrefs = {
  necessary: true
  analytics: boolean
  decision: 'accept' | 'decline'
  timestamp: string
}

const STORAGE_KEY = 'brandit_cookie_consent_v1'

function safeParse(raw: string | null): CookiePrefs | null {
  if (!raw) return null
  try {
    const obj = JSON.parse(raw)
    if (!obj || typeof obj !== 'object') return null
    if (obj.necessary !== true) return null
    if (typeof obj.analytics !== 'boolean') return null
    if (obj.decision !== 'accept' && obj.decision !== 'decline') return null
    if (typeof obj.timestamp !== 'string') return null
    return obj as CookiePrefs
  } catch {
    return null
  }
}

function readPrefs(): CookiePrefs | null {
  try {
    return safeParse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export default function CookieConsent() {
  const [open, setOpen] = useState(() => {
    const existing = readPrefs()
    return !existing
  })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [analytics, setAnalytics] = useState(() => {
    const existing = readPrefs()
    return existing ? existing.analytics : false
  })

  useEffect(() => {
    const existing = readPrefs()
    if (existing) {
      setOpen(false)
      setAnalytics(existing.analytics)
    }
  }, [])

  const text = useMemo(
    () =>
      'This website uses cookies to ensure secure payments and improve your experience. By continuing, you agree to our use of cookies.',
    []
  )

  function save(prefs: CookiePrefs) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {
      // ignore
    }
    setOpen(false)
    setSettingsOpen(false)
  }

  if (!open) return null

  return (
    <div className="cookieBanner" role="dialog" aria-modal="true" aria-label="Cookie preferences">
      <div className="cookieBanner__panel">
        <div className="cookieBanner__content">
          <div className="cookieBanner__title">Cookies</div>
          <div className="cookieBanner__text">{text}</div>
        </div>

        {settingsOpen ? (
          <div className="cookieBanner__settings">
            <label className="cookieBanner__row">
              <input type="checkbox" checked disabled />
              <span>
                <strong>Necessary</strong>
                <span className="cookieBanner__muted">Required for core functionality and security.</span>
              </span>
            </label>
            <label className="cookieBanner__row">
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} />
              <span>
                <strong>Analytics</strong>
                <span className="cookieBanner__muted">Helps us improve the website experience.</span>
              </span>
            </label>
          </div>
        ) : null}

        <div className="cookieBanner__actions">
          <button
            className="btn"
            type="button"
            onClick={() => {
              save({ necessary: true, analytics: false, decision: 'decline', timestamp: new Date().toISOString() })
            }}
          >
            Decline
          </button>

          <button
            className="btn"
            type="button"
            onClick={() => setSettingsOpen((s) => !s)}
          >
            {settingsOpen ? 'Close settings' : 'Cookie settings'}
          </button>

          <button
            className="btn btn--primary"
            type="button"
            onClick={() => {
              save({ necessary: true, analytics: settingsOpen ? analytics : true, decision: 'accept', timestamp: new Date().toISOString() })
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
