import { useEffect, useState } from 'react'

export default function OfflineBanner() {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine))

  useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  if (online) return null

  return (
    <div className="offlineBanner" role="status" aria-live="polite">
      <div className="offlineBanner__inner">
        <strong>Network issue</strong>
        <span> You’re offline. Check your connection and try again.</span>
      </div>
    </div>
  )
}
