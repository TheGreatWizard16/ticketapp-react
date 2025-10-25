import { Navigate, useLocation } from 'react-router-dom'
import { ensureAuthed } from '../lib/session.ts'

export default function Protected({ children }:{children:React.ReactNode}) {
  const ok = ensureAuthed()
  const loc = useLocation()
  if (!ok) {
    return <Navigate to="/auth/login" state={{ from: loc.pathname, reason: 'Your session has expired — please log in again.' }} replace />
  }
  return <>{children}</>
}
