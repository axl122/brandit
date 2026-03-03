import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

export default function WhatsAppWidget() {
  const reduceMotion = useReducedMotion()
  const WHATSAPP_NUMBER = '2348157884986'
  const SUPPORT_EMAIL = 'branditfirm080@gmail.com'

  const isDesktop = useMemo(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 561px)').matches
  }, [])

  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement | null>(null)

  const [mode, setMode] = useState<'menu' | 'faq'>('menu')
  const [faqQuery, setFaqQuery] = useState('')

  const faq = useMemo(
    () =>
      [
        {
          q: 'What is the best way to start?'
          ,
          a: 'Start with a consultation. We audit your current presence, define positioning, then recommend the right service and tier.'
        },
        {
          q: 'Do I need branding before management?'
          ,
          a: 'If you don’t have a consistent identity system, branding first is recommended. Management works best when the brand system already exists.'
        },
        {
          q: 'How fast do you respond?'
          ,
          a: 'Typically within 24 hours. If you’ve made a payment, we respond immediately using the contact details provided.'
        },
        {
          q: 'Can I get a custom quote?'
          ,
          a: 'Yes. Use the Custom option on Pricing or send a message here with your needs and budget.'
        },
      ] as const,
    []
  )

  const filteredFaq = useMemo(() => {
    const q = faqQuery.trim().toLowerCase()
    if (!q) return faq
    return faq.filter((item) => {
      const hay = `${item.q} ${item.a}`.toLowerCase()
      return hay.includes(q)
    })
  }, [faq, faqQuery])

  function openWhatsApp(text: string) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function openEmail(subject: string) {
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`
    window.location.href = url
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setMode('menu')
        setFaqQuery('')
      }
    }

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null
      if (!target) return
      if (panelRef.current && panelRef.current.contains(target)) return
      setOpen(false)
      setMode('menu')
      setFaqQuery('')
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('mousedown', onPointerDown, true)
    window.addEventListener('touchstart', onPointerDown, true)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousedown', onPointerDown, true)
      window.removeEventListener('touchstart', onPointerDown, true)
    }
  }, [open])

  return (
    <div className="waWidget" aria-label="WhatsApp chat">
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            ref={panelRef}
            key="panel"
            className="waWidget__panel"
            id="waWidgetPanel"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.18, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="false"
            aria-label="BrandIt support"
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <div className="waWidget__header">
              <div className="waWidget__title">
                <strong>BrandIt Support</strong>
                <span>Quick answers or message us</span>
              </div>
              <button className="waWidget__close" type="button" aria-label="Close" onClick={() => setOpen(false)}>
                ×
              </button>
            </div>

            <div className="waWidget__body">
              {mode === 'menu' ? (
                <>
                  <div className="waWidget__bubble">
                    Choose what you want to do.
                  </div>

                  <div className="ctaActions">
                    <button className="btn" type="button" onClick={() => setMode('faq')}>
                      View FAQ
                    </button>
                    {isDesktop ? (
                      <button
                        className="btn btn--primary"
                        type="button"
                        onClick={() => {
                          openWhatsApp('Hi BrandIt, I want to ask a question about branding and pricing.')
                          setOpen(false)
                        }}
                      >
                        Message us
                      </button>
                    ) : (
                      <button
                        className="btn btn--primary"
                        type="button"
                        onClick={() => {
                          openEmail('Question about BrandIt')
                          setOpen(false)
                        }}
                      >
                        Email us
                      </button>
                    )}
                  </div>

                  <div className="ctaActions">
                    <button
                      className="btn"
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(new Event('consultation:open'))
                        setOpen(false)
                      }}
                    >
                      Book consultation
                    </button>
                    <a className="btn" href="/pricing">Pricing</a>
                  </div>

                  <div className="ctaActions">
                    <a className="btn" href="/contact">Contact</a>
                  </div>

                  <div className="formHint">
                    {isDesktop ? 'Messaging opens WhatsApp to send your message.' : 'Email opens your mail app to send your message.'}
                  </div>
                </>
              ) : (
                <>
                  <div className="ctaActions">
                    <button className="btn" type="button" onClick={() => setMode('menu')}>
                      Back
                    </button>
                    {isDesktop ? (
                      <button
                        className="btn btn--primary"
                        type="button"
                        onClick={() => {
                          openWhatsApp('Hi BrandIt, I read your FAQ and I want to book a consultation.')
                          setOpen(false)
                        }}
                      >
                        Book via WhatsApp
                      </button>
                    ) : (
                      <button
                        className="btn btn--primary"
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new Event('consultation:open'))
                          setOpen(false)
                        }}
                      >
                        Book consultation
                      </button>
                    )}
                  </div>

                  <div className="field waWidget__search">
                    <div className="label">Search</div>
                    <input
                      className="input"
                      value={faqQuery}
                      onChange={(e) => setFaqQuery(e.target.value)}
                      placeholder="Search FAQ…"
                    />
                  </div>

                  <div className="waWidget__faqList">
                    {filteredFaq.length ? (
                      filteredFaq.map((item) => (
                        <div key={item.q} className="waWidget__faqItem">
                          <h4 className="waWidget__faqQ">{item.q}</h4>
                          <p className="waWidget__faqA">{item.a}</p>
                        </div>
                      ))
                    ) : (
                      <div className="waWidget__faqItem">
                        <h4 className="waWidget__faqQ">No results</h4>
                        <p className="waWidget__faqA">
                          Try a different keyword, or message us directly.
                        </p>
                        <div className="ctaActions">
                          <button
                            className="btn btn--primary"
                            type="button"
                            onClick={() => {
                              if (isDesktop) {
                                openWhatsApp('Hi BrandIt, I couldn\'t find my question in the FAQ. I want to ask: ...')
                              } else {
                                openEmail('Question from FAQ')
                              }
                              setOpen(false)
                            }}
                          >
                            {isDesktop ? 'Message us' : 'Email us'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <button
        type="button"
        className="waWidget__fab"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => {
            const next = !v
            if (!next) {
              setMode('menu')
              setFaqQuery('')
            }
            return next
          })
        }}
        aria-expanded={open}
        aria-controls="waWidgetPanel"
      >
        <span className="waWidget__dot" aria-hidden="true" />
        <span style={{ fontSize: 13, letterSpacing: '0.02em' }}>{open ? 'Close' : 'Help'}</span>
      </button>
    </div>
  )
}
