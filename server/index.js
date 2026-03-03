import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '.env') })

const app = express()

app.use(
  cors({
    origin: true,
    credentials: true,
  })
)
app.use(express.json({ limit: '1mb' }))

const PORT = Number(process.env.PORT || 8787)

function assertEnv(name) {
  const v = process.env[name]
  if (!v) throw new Error(`Missing env var: ${name}`)
  return v
}

function msToHuman(ms) {
  const s = Math.max(0, Math.round(ms / 1000))
  const m = Math.floor(s / 60)
  const r = s % 60
  if (m <= 0) return `${r}s`
  return `${m}m ${r}s`
}

function safeStr(v, max = 240) {
  if (typeof v !== 'string') return ''
  const s = v.trim()
  if (!s) return ''
  return s.length > max ? s.slice(0, max) : s
}

const analyticsStore = {
  sessions: new Map(),
  startedAt: Date.now(),
  lastDigestAt: 0,
}

function analyticsEnabled() {
  return String(process.env.ANALYTICS_ENABLED || '').toLowerCase() === 'true'
}

function digestEnabled() {
  return String(process.env.ANALYTICS_HOURLY_DIGEST || '').toLowerCase() === 'true'
}

function digestToEmail() {
  return process.env.ANALYTICS_EMAIL_TO || process.env.EMAIL_TO || 'branditfirm080@gmail.com'
}

function getIp(req) {
  const xf = req.headers['x-forwarded-for']
  if (typeof xf === 'string' && xf.trim()) return xf.split(',')[0].trim()
  return req.socket?.remoteAddress || ''
}

app.post('/api/analytics/event', async (req, res) => {
  try {
    if (!analyticsEnabled()) return res.status(404).json({ ok: false })

    const {
      type,
      path,
      durationMs,
      sessionId,
      ref,
      ua,
      tz,
      allowAnalytics,
      ts,
    } = req.body || {}

    if (!allowAnalytics) return res.json({ ok: true })

    const safeType = safeStr(type, 64)
    const safePath = safeStr(path, 240)
    const safeSession = safeStr(sessionId, 96)

    if (!safeType || !safePath || !safeSession) return res.status(400).json({ ok: false, error: 'Invalid event' })
    if (safeType !== 'pageview') return res.json({ ok: true })

    const dur = typeof durationMs === 'number' && Number.isFinite(durationMs) && durationMs >= 0 ? durationMs : 0
    const now = typeof ts === 'number' && Number.isFinite(ts) ? ts : Date.now()

    const key = safeSession
    const existing = analyticsStore.sessions.get(key) || {
      createdAt: now,
      lastAt: now,
      views: [],
      totalMs: 0,
      ip: getIp(req),
      ref: safeStr(ref, 240),
      ua: safeStr(ua, 240),
      tz: safeStr(tz, 64),
    }

    existing.lastAt = now
    existing.totalMs += dur
    existing.views.push({ path: safePath, durationMs: dur, at: now })

    analyticsStore.sessions.set(key, existing)

    return res.json({ ok: true })
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'Server error' })
  }
})

async function sendAnalyticsDigest() {
  if (!analyticsEnabled() || !digestEnabled()) return

  const now = Date.now()
  const hourAgo = now - 60 * 60 * 1000

  if (analyticsStore.lastDigestAt && now - analyticsStore.lastDigestAt < 55 * 60 * 1000) return

  const sessions = []
  for (const [id, s] of analyticsStore.sessions.entries()) {
    const recentViews = (s.views || []).filter((v) => v.at >= hourAgo)
    if (recentViews.length === 0) continue
    sessions.push({ id, ...s, recentViews })
  }

  const totalViews = sessions.reduce((sum, s) => sum + s.recentViews.length, 0)
  if (totalViews === 0) {
    analyticsStore.lastDigestAt = now
    return
  }

  const pageTotals = new Map()
  for (const s of sessions) {
    for (const v of s.recentViews) {
      const prev = pageTotals.get(v.path) || { views: 0, ms: 0 }
      pageTotals.set(v.path, { views: prev.views + 1, ms: prev.ms + (v.durationMs || 0) })
    }
  }

  const topPages = Array.from(pageTotals.entries())
    .map(([path, v]) => ({ path, ...v }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 12)

  const lines = []
  lines.push(`Hourly traffic summary`) 
  lines.push(`Time window: last 60 minutes`) 
  lines.push(`Sessions: ${sessions.length}`)
  lines.push(`Page views: ${totalViews}`)
  lines.push('')
  lines.push('Top pages:')
  for (const p of topPages) {
    lines.push(`- ${p.path} — ${p.views} views, ${msToHuman(p.ms)} total time`)
  }
  lines.push('')
  lines.push('Recent sessions (sample):')
  for (const s of sessions.slice(0, 12)) {
    const first = new Date(s.createdAt).toISOString()
    const last = new Date(s.lastAt).toISOString()
    const totalRecentMs = s.recentViews.reduce((sum, v) => sum + (v.durationMs || 0), 0)
    lines.push(`- Session ${s.id.slice(0, 8)}… | ${s.recentViews.length} views | ${msToHuman(totalRecentMs)} | ${first} -> ${last}`)
    for (const v of s.recentViews.slice(0, 8)) {
      lines.push(`  - ${v.path} (${msToHuman(v.durationMs || 0)})`)
    }
  }

  try {
    const to = digestToEmail()
    const from = process.env.EMAIL_FROM || assertEnv('EMAIL_USER')
    const transporter = await createTransporter()
    const subject = `BrandIt hourly traffic — ${new Date(now).toLocaleString()}`
    await transporter.sendMail({ from, to, subject, text: lines.join('\n') })
    analyticsStore.lastDigestAt = now
  } catch (e) {
    // swallow errors to avoid crashing the server
  }

  // basic pruning: remove sessions inactive for > 24h
  const cutoff = now - 24 * 60 * 60 * 1000
  for (const [id, s] of analyticsStore.sessions.entries()) {
    if (s.lastAt < cutoff) analyticsStore.sessions.delete(id)
  }
}

setInterval(() => {
  void sendAnalyticsDigest()
}, 60 * 1000)

// Send email using Resend API
async function sendEmail({ to, from, subject, text }) {
  const apiKey = process.env.RESEND_API_KEY
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured')
  }

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text,
    }),
  })

  const data = await resp.json().catch(() => ({}))
  
  if (!resp.ok) {
    throw new Error(data.message || data.error?.message || 'Failed to send email')
  }
  
  return data
}

app.post('/api/email/consultation', async (req, res) => {
  try {
    const to = process.env.EMAIL_TO || 'branditfirm080@gmail.com'
    const from = process.env.EMAIL_FROM || 'onboarding@resend.dev'

    const { subject, text } = req.body || {}

    if (!subject || typeof subject !== 'string') {
      return res.status(400).json({ ok: false, error: 'Missing subject' })
    }
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ ok: false, error: 'Missing text' })
    }

    await sendEmail({ from, to, subject, text })
    return res.json({ ok: true })
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'Server error' })
  }
})

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    emailConfigured: Boolean(process.env.RESEND_API_KEY),
    paystackConfigured: Boolean(process.env.PAYSTACK_SECRET_KEY),
    analyticsEnabled: analyticsEnabled(),
  })
})

app.post('/api/email/pricing', async (req, res) => {
  try {
    const to = process.env.EMAIL_TO || 'branditfirm080@gmail.com'
    const from = process.env.EMAIL_FROM || 'onboarding@resend.dev'

    const { subject, text } = req.body || {}

    if (!subject || typeof subject !== 'string') {
      return res.status(400).json({ ok: false, error: 'Missing subject' })
    }
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ ok: false, error: 'Missing text' })
    }

    await sendEmail({ from, to, subject, text })
    return res.json({ ok: true })
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'Server error' })
  }
})

app.post('/api/email/contact', async (req, res) => {
  try {
    const to = process.env.EMAIL_TO || 'branditfirm080@gmail.com'
    const from = process.env.EMAIL_FROM || 'onboarding@resend.dev'

    const { subject, text } = req.body || {}

    if (!subject || typeof subject !== 'string') {
      return res.status(400).json({ ok: false, error: 'Missing subject' })
    }
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ ok: false, error: 'Missing text' })
    }

    await sendEmail({ from, to, subject, text })
    return res.json({ ok: true })
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'Server error' })
  }
})

app.post('/api/paystack/initialize', async (req, res) => {
  try {
    const secret = assertEnv('PAYSTACK_SECRET_KEY')

    const { email, amountNaira, metadata, callbackUrl } = req.body || {}

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ ok: false, error: 'Valid email is required' })
    }
    if (typeof amountNaira !== 'number' || !Number.isFinite(amountNaira) || amountNaira <= 0) {
      return res.status(400).json({ ok: false, error: 'Valid amountNaira is required' })
    }

    const amountKobo = Math.round(amountNaira * 100)

    const meta = metadata && typeof metadata === 'object' ? metadata : {}
    const label = typeof meta.referenceLabel === 'string' ? meta.referenceLabel : ''
    const custom_fields = label
      ? [
          {
            display_name: 'Service',
            variable_name: 'service',
            value: label,
          },
        ]
      : []

    const resp = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        ...(typeof callbackUrl === 'string' && callbackUrl ? { callback_url: callbackUrl } : {}),
        metadata: {
          ...meta,
          custom_fields,
        },
      }),
    })

    const data = await resp.json()

    if (!resp.ok || !data?.status) {
      return res.status(502).json({ ok: false, error: data?.message || 'Paystack init failed' })
    }

    return res.json({ ok: true, authorization_url: data.data.authorization_url, reference: data.data.reference })
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'Server error' })
  }
})

app.post('/api/paystack/start', async (req, res) => {
  try {
    const secret = assertEnv('PAYSTACK_SECRET_KEY')

    const {
      email,
      amountNaira,
      metadata,
      serviceTitle,
      tierName,
      priceLabel,
      contactMethod,
      contactNumber,
      extraInfo,
      callbackUrl,
    } = req.body || {}

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ ok: false, error: 'Valid email is required' })
    }
    if (typeof amountNaira !== 'number' || !Number.isFinite(amountNaira) || amountNaira <= 0) {
      return res.status(400).json({ ok: false, error: 'Valid amountNaira is required' })
    }

    const amountKobo = Math.round(amountNaira * 100)
    const meta = metadata && typeof metadata === 'object' ? metadata : {}
    const label = typeof meta.referenceLabel === 'string' ? meta.referenceLabel : ''
    const custom_fields = label
      ? [
          {
            display_name: 'Service',
            variable_name: 'service',
            value: label,
          },
        ]
      : []

    const resp = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        ...(typeof callbackUrl === 'string' && callbackUrl ? { callback_url: callbackUrl } : {}),
        metadata: {
          ...meta,
          custom_fields,
        },
      }),
    })

    const data = await resp.json()

    if (!resp.ok || !data?.status) {
      return res.status(502).json({ ok: false, error: data?.message || 'Paystack init failed' })
    }

    const authorization_url = data.data.authorization_url
    const reference = data.data.reference

    let emailSent = true
    let emailError = null
    try {
      const to = process.env.EMAIL_TO || 'branditfirm080@gmail.com'
      const from = process.env.EMAIL_FROM || assertEnv('EMAIL_USER')
      const nowIso = new Date().toISOString()
      const subject = `Paystack payment started — ${serviceTitle || 'Service'}${tierName ? ` (${tierName})` : ''}`
      const text = [
        `Time (server): ${nowIso}`,
        `Amount: ₦${amountNaira}`,
        `Service: ${serviceTitle || '(unknown)'}`,
        `Tier: ${tierName || '(unknown)'}`,
        `Price label: ${priceLabel || '(none)'}`,
        '',
        `Paystack email: ${email}`,
        `Contact method: ${contactMethod || '(none)'}`,
        `Contact number: ${contactNumber || '(none)'}`,
        '',
        'Additional info:',
        (typeof extraInfo === 'string' && extraInfo.trim() ? extraInfo : '(none)'),
        '',
        `Reference: ${reference}`,
        `Authorization URL: ${authorization_url}`,
        '',
        'Metadata:',
        JSON.stringify(meta, null, 2),
      ].join('\n')

      const transporter = await createTransporter()
      await transporter.sendMail({ from, to, subject, text })
    } catch (e) {
      emailSent = false
      emailError = e?.message || 'Failed to send payment email'
    }

    return res.json({ ok: true, authorization_url, reference, emailSent, emailError })
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'Server error' })
  }
})

app.get('/api/paystack/verify', async (req, res) => {
  try {
    const secret = assertEnv('PAYSTACK_SECRET_KEY')
    const reference = req.query?.reference

    if (!reference || typeof reference !== 'string') {
      return res.status(400).json({ ok: false, error: 'Missing reference' })
    }

    const resp = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await resp.json().catch(() => null)

    if (!resp.ok || !data?.status) {
      return res.status(502).json({ ok: false, error: data?.message || 'Paystack verify failed' })
    }

    const txn = data.data
    const status = txn?.status
    const paid = status === 'success'

    let emailSent = true
    let emailError = null

    if (paid) {
      try {
        const to = process.env.EMAIL_TO || 'branditfirm080@gmail.com'
        const from = process.env.EMAIL_FROM || assertEnv('EMAIL_USER')
        const nowIso = new Date().toISOString()

        const amountNaira = typeof txn?.amount === 'number' ? txn.amount / 100 : null
        const customerEmail = txn?.customer?.email
        const meta = txn?.metadata

        const subject = `Payment successful — ${meta?.referenceLabel || reference}`
        const text = [
          `Time (server): ${nowIso}`,
          `Status: ${status}`,
          `Reference: ${reference}`,
          '',
          `Amount: ${amountNaira ? `₦${amountNaira}` : '(unknown)'}`,
          `Customer email: ${customerEmail || '(unknown)'}`,
          '',
          'Metadata:',
          JSON.stringify(meta || {}, null, 2),
        ].join('\n')

        const transporter = await createTransporter()
        await transporter.sendMail({ from, to, subject, text })
      } catch (e) {
        emailSent = false
        emailError = e?.message || 'Failed to send success email'
      }
    }

    return res.json({ ok: true, paid, status, reference, emailSent, emailError })
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || 'Server error' })
  }
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
