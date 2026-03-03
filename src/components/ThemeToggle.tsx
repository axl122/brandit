import { useEffect, useState } from 'react'

function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
  if (stored) return stored
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getInitialTheme())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <button
      type="button"
      className={`themeToggle${theme === 'dark' ? ' is-dark' : ''}`}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
    >
      <span className="themeToggle__icon" aria-hidden="true" />
    </button>
  )
}
