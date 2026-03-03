import { ArrowLeft } from 'lucide-react'
import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function BackButton({ fallbackTo = '/home', label = 'Back' }: { fallbackTo?: string; label?: string }) {
  const navigate = useNavigate()
  const location = useLocation()

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      navigate(-1)
      return
    }
    navigate(fallbackTo)
  }, [navigate, fallbackTo])

  if (location.pathname === '/' || location.pathname === '/home') return null

  return (
    <button type="button" className="pageBack" onClick={goBack} aria-label="Go back">
      <ArrowLeft size={16} aria-hidden="true" />
      {label}
    </button>
  )
}
