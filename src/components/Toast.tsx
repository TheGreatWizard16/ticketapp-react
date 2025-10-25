import { createContext, useContext, useState, useCallback, useEffect } from 'react'

type ToastMsg = { id: string; text: string }
type Ctx = { push: (text: string) => void }

const ToastCtx = createContext<Ctx | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastMsg[]>([])
  const push = useCallback((text: string) => {
    const id = crypto.randomUUID()
    setItems(prev => [...prev, { id, text }])
    setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), 2200)
  }, [])
  // keyboard a11y: dismiss last toast with Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setItems([]) }
    addEventListener('keydown', onKey); return () => removeEventListener('keydown', onKey)
  }, [])
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div aria-live="polite" aria-atomic="true" style={{position:'fixed',right:16,bottom:16,display:'grid',gap:8,zIndex:50}}>
        {items.map(t => <div key={t.id} className="toast">{t.text}</div>)}
      </div>
    </ToastCtx.Provider>
  )
}
export const useToast = () => {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}
