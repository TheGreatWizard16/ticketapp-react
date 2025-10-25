import { useEffect, useMemo, useState } from 'react'
import Layout from '../components/Layout'         
import type { Ticket } from '../lib/store'
import { useTickets } from '../lib/store'

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
type Status = 'open' | 'in_progress' | 'closed'

const isValidStatus = (s: string): s is Status =>
  s === 'open' || s === 'in_progress' || s === 'closed'

const sanitize = (s: string) => s.replace(/\s+/g, ' ').trim()

function validateCreateInput(title: string, status: Status, description: string) {
  const t = sanitize(title)
  const d = description.trim()
  if (!t) throw new Error('Title is required')
  if (t.length > 120) throw new Error('Title too long (max 120)')
  if (!isValidStatus(status)) throw new Error('Invalid status')
  if (d && d.length > 2000) throw new Error('Description too long (max 2000)')
  return { t, d }
}

function validateUpdateInput(title: string, status: Status, description: string) {
  const t = sanitize(title)
  const d = description.trim()
  if (!t) throw new Error('Title is required')
  if (t.length > 120) throw new Error('Title too long (max 120)')
  if (!isValidStatus(status)) throw new Error('Invalid status')
  if (d && d.length > 2000) throw new Error('Description too long (max 2000)')
  return { t, d }
}

/* lightweight local toast (keeps your current behavior) */
function Toast({ msg }: { msg: string }) {
  return <div className="toast" role="status" aria-live="polite">{msg}</div>
}

/* ------------------------------------------------------------------ */
/* Page: Tickets                                                       */
/* ------------------------------------------------------------------ */
export default function Tickets() {
  const { tickets, load, create, update, remove } = useTickets()
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState<Status>('open')
  const [description, setDescription] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => { load() }, [load])

  useEffect(() => {
    if (!toast) return
    const id = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(id)
  }, [toast])

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { t, d } = validateCreateInput(title, status, description)
      create({ title: t, status, description: d })
      setTitle(''); setDescription(''); setStatus('open')
      setErr(null); setToast('Ticket created')
    } catch (ex: any) {
      setErr(ex?.message || 'Validation error')
    }
  }

  const sorted = useMemo(
    () => tickets.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [tickets]
  )

  return (
    <Layout>
      <h2>Tickets</h2>

      {/* Create form */}
      <form
        onSubmit={onCreate}
        className="card"
        style={{ margin: '16px 0', display: 'grid', gap: 12 }}
        aria-label="Create ticket"
      >
        <div>
          <label className="label" htmlFor="title">Title *</label>
          <input
            id="title"
            className="input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Short summary"
            required
            aria-invalid={!!err}
          />
          <div className="label" aria-hidden>1–120 chars</div>
        </div>

        <div>
          <label className="label" htmlFor="status">Status *</label>
          <select
            id="status"
            className="input"
            value={status}
            onChange={e => {
              const val = e.target.value
              setStatus(isValidStatus(val) ? val : 'open')
            }}
            required
          >
            <option value="open">open</option>
            <option value="in_progress">in_progress</option>
            <option value="closed">closed</option>
          </select>
        </div>

        <div>
          <label className="label" htmlFor="desc">Description</label>
          <textarea
            id="desc"
            className="input"
            rows={4}
            value={description}
            onChange={e => setDescription(e.target.value)}
            aria-describedby="desc-help"
          />
          <div id="desc-help" className="label" aria-hidden>Optional ≤ 2000 chars</div>
        </div>

        {err && <div className="error" role="alert">{err}</div>}

        <div>
          <button className="btn" type="submit">Create</button>
        </div>
      </form>

      {/* List */}
      <div className="grid" style={{ gap: 16 }} role="list" aria-label="Ticket list">
        {sorted.map(t => (
          <TicketCard key={t.id} t={t} onUpdate={update} onDelete={remove} />
        ))}
        {sorted.length === 0 && <div className="card">No tickets yet.</div>}
      </div>

      {toast && <Toast msg={toast} />}
    </Layout>
  )
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */
function TicketCard({
  t,
  onUpdate,
  onDelete
}: {
  t: Ticket
  onUpdate: (id: string, patch: Partial<Ticket>) => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(t.title)
  const [status, setStatus] = useState<Status>(t.status as Status)
  const [description, setDescription] = useState(t.description || '')
  const [err, setErr] = useState<string | null>(null)

  // Keep local edits in sync with store updates for this ticket
  useEffect(() => {
    if (!editing) {
      setTitle(t.title)
      setStatus((t.status as Status) ?? 'open')
      setDescription(t.description || '')
    }
  }, [t.id, t.title, t.status, t.description, editing])

  const isDirty =
    title !== t.title ||
    status !== (t.status as Status) ||
    (description || '') !== (t.description || '')

  const save = () => {
    try {
      const { t: validTitle, d: validDesc } = validateUpdateInput(title, status, description)
      onUpdate(t.id, { title: validTitle, status, description: validDesc })
      setEditing(false)
      setErr(null)
    } catch (ex: any) {
      setErr(ex?.message || 'Validation error')
    }
  }

  const cancel = () => {
    setTitle(t.title)
    setStatus((t.status as Status) ?? 'open')
    setDescription(t.description || '')
    setErr(null)
    setEditing(false)
  }

  const del = () => {
    if (confirm('Delete this ticket?')) onDelete(t.id)
  }

  return (
    <div className="card" role="listitem" aria-label={`Ticket ${t.title}`}>
      {editing ? (
        <div className="grid" style={{ gap: 10 }}>
          <input
            className="input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            aria-label="Title"
          />
          <select
            className="input"
            value={status}
            onChange={e => {
              const val = e.target.value
              setStatus(isValidStatus(val) ? val : 'open')
            }}
            aria-label="Status"
          >
            <option value="open">open</option>
            <option value="in_progress">in_progress</option>
            <option value="closed">closed</option>
          </select>
          <textarea
            className="input"
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            aria-label="Description"
          />
          {err && <div className="error" role="alert">{err}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" type="button" onClick={save} disabled={!isDirty}>
              Save
            </button>
            <button className="btn ghost" type="button" onClick={cancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>{t.title}</h3>
            <span className={`status ${t.status}`}>{t.status}</span>
          </div>
          {t.description && (
            <p style={{ margin: 0, color: 'var(--muted)' }}>{t.description}</p>
          )}
          <small style={{ color: 'var(--muted)' }}>
            Created {new Date(t.createdAt).toLocaleString()} • Updated {new Date(t.updatedAt).toLocaleString()}
          </small>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" type="button" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button className="btn ghost" type="button" onClick={del}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
