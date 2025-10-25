export const SESSION_KEY = "ticketapp_session";

type Session = { token: string; userEmail: string };

export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  try {
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(s: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(s));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function ensureAuthed() {
  return !!getSession();
}
