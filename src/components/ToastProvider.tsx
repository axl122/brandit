import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export type ToastType = 'success' | 'error' | 'info'

export type Toast = {
  id: string
  type: ToastType
  title: string
  message?: string
  timeoutMs?: number
}

type ToastContextValue = {
  push: (toast: Omit<Toast, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`
    const timeoutMs = toast.timeoutMs ?? 4200
    const next: Toast = { ...toast, id, timeoutMs }

    setToasts((prev) => {
      const capped = prev.length >= 3 ? prev.slice(prev.length - 2) : prev
      return [...capped, next]
    })

    window.setTimeout(() => remove(id), timeoutMs)
  }, [remove])

  const value = useMemo(() => ({ push }), [push])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toastHost" aria-live="polite" aria-relevant="additions removals">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className={`toast toast--${t.type}`}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              role="status"
            >
              <div className="toast__content">
                <div className="toast__title">{t.title}</div>
                {t.message ? <div className="toast__msg">{t.message}</div> : null}
              </div>
              <button className="toast__close" type="button" aria-label="Dismiss" onClick={() => remove(t.id)}>
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
