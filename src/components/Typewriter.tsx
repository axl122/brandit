import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

type TypewriterProps = {
  lines: string[]
  speed?: number // ms per character
  startDelay?: number // ms before typing starts
  lineDelay?: number // ms between lines
}

export default function Typewriter({
  lines,
  speed = 32,
  startDelay = 250,
  lineDelay = 500,
}: TypewriterProps) {
  const reduceMotion = useReducedMotion()
  const [currentLine, setCurrentLine] = useState(0)
  const [typed, setTyped] = useState<string[]>(Array.from({ length: lines.length }, () => ''))
  const [done, setDone] = useState(false)
  const started = useRef(false)

  useEffect(() => {
    if (reduceMotion) {
      setTyped([...lines])
      setDone(true)
      return
    }

    let startTimer: number | undefined
    let charTimer: number | undefined
    let nextLineTimer: number | undefined

    const typeNext = () => {
      const full = lines[currentLine]
      const current = typed[currentLine]
      if (current.length < full.length) {
        const next = full.slice(0, current.length + 1)
        setTyped((t) => {
          const copy = [...t]
          copy[currentLine] = next
          return copy
        })
        charTimer = window.setTimeout(typeNext, speed)
      } else {
        if (currentLine < lines.length - 1) {
          nextLineTimer = window.setTimeout(() => setCurrentLine((i) => i + 1), lineDelay)
        } else {
          setDone(true)
        }
      }
    }

    if (!started.current) {
      started.current = true
      startTimer = window.setTimeout(typeNext, startDelay)
    } else {
      // when currentLine changes, continue typing that line
      typeNext()
    }

    return () => {
      if (startTimer) window.clearTimeout(startTimer)
      if (charTimer) window.clearTimeout(charTimer)
      if (nextLineTimer) window.clearTimeout(nextLineTimer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLine, reduceMotion, lines.join('\n'), speed, startDelay, lineDelay])

  return (
    <span className="typewriter" aria-live="polite">
      {lines.map((_, i) => (
        <span key={i} className="typewriter__line">
          {typed[i]}
          {!reduceMotion && !done && i === currentLine ? <span className="typewriter__cursor" aria-hidden="true" /> : null}
          {i < lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </span>
  )
}
