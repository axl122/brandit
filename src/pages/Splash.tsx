import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TAGLINE = 'THE POWERHOUSE OF BRAND IDENTITY, DONE THE RIGHT WAY'

type Phase = 'enter' | 'exit'

export default function Splash() {
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>('enter')
  const [isMobile, setIsMobile] = useState(false)
  const [mountKey, setMountKey] = useState(0)

  const words = TAGLINE.split(' ')

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 560px)')
    const update = () => setIsMobile(Boolean(mq.matches))
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    setMountKey((k) => k + 1)
    setPhase('enter')
  }, [])

  useEffect(() => {
    const exitAfterMs = reduceMotion ? 650 : isMobile ? 1200 : 2400
    const navigateAfterMs = reduceMotion ? 950 : isMobile ? 1550 : 2900

    const exitTimer = window.setTimeout(() => setPhase('exit'), exitAfterMs)
    const navTimer = window.setTimeout(() => navigate('/home', { replace: true }), navigateAfterMs)

    return () => {
      window.clearTimeout(exitTimer)
      window.clearTimeout(navTimer)
    }
  }, [navigate, reduceMotion, isMobile])

  return (
    <motion.section
      key={mountKey}
      className="splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.2 : 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
        <div className="splash__bg" aria-hidden="true">
          <motion.div
            className="splash__orb splash__orb--a"
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [0, 18, 0],
                    y: [0, -12, 0],
                    scale: [1, 1.03, 1],
                  }
            }
            transition={{ duration: isMobile ? 12 : 11, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="splash__orb splash__orb--b"
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [0, -14, 0],
                    y: [0, 14, 0],
                    scale: [1, 1.04, 1],
                  }
            }
            transition={{ duration: isMobile ? 14 : 13, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="splash__orb splash__orb--c"
            animate={reduceMotion ? undefined : { rotate: [0, 4, 0] }}
            transition={{ duration: isMobile ? 16 : 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="splash__grid" />
        </div>

        <motion.div
          className="splash__content"
          animate={phase === 'exit' ? { opacity: 0, scale: 0.985 } : { opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="splash__brand"
            initial={{ opacity: 0, y: 16, filter: reduceMotion || isMobile ? 'none' : 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: reduceMotion || isMobile ? 'none' : 'blur(0px)' }}
            transition={{ duration: reduceMotion ? 0.2 : 0.7, delay: reduceMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="splash__logoText" aria-label="BrandIt">
              BrandIt
            </div>
            <motion.div
              className="splash__divider"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: reduceMotion ? 0.2 : 0.75, delay: reduceMotion ? 0.03 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>

          <motion.p
            className="splash__tagline"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: reduceMotion ? 0 : isMobile ? 0.015 : 0.02,
                  delayChildren: reduceMotion ? 0.05 : isMobile ? 0.38 : 0.48,
                },
              },
            }}
          >
            {words.map((word, idx) => (
              <motion.span
                key={`${word}-${idx}`}
                className="splash__word"
                variants={{
                  hidden: { opacity: 0, y: 10, filter: reduceMotion || isMobile ? 'none' : 'blur(8px)' },
                  show: { opacity: 1, y: 0, filter: reduceMotion || isMobile ? 'none' : 'blur(0px)' },
                }}
                transition={{ duration: reduceMotion ? 0.2 : 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            ))}
          </motion.p>

          <motion.div
            className="splash__sheen"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={reduceMotion ? { opacity: 0.4 } : { opacity: [0.12, 0.45, 0.12], x: ['-18%', '18%', '-18%'] }}
            transition={{ duration: isMobile ? 6.5 : 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
    </motion.section>
  )
}
