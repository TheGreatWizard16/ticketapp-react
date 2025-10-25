import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { setSession } from '../lib/session'

export default function Signup(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [err,setErr]=useState<string|null>(null)
  const nav=useNavigate()
  const onSubmit=(e:React.FormEvent)=>{
    e.preventDefault()
    setErr(null)
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setErr('Enter a valid email'); return }
    if(password.length<6){ setErr('Password must be at least 6 characters'); return }
    setSession({ token: crypto.randomUUID(), userEmail: email })
    nav('/dashboard',{replace:true})
  }
  return (
    <Layout>
      <div className="card" style={{maxWidth:480, margin:'40px auto'}}>
        <h2>Create account</h2>
        <form onSubmit={onSubmit} className="grid" style={{gap:12}}>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" className="input" value={email} onChange={e=>setEmail(e.target.value)} required />
          <label className="label" htmlFor="pw">Password</label>
          <input id="pw" type="password" className="input" value={password} onChange={e=>setPassword(e.target.value)} required />
          {err && <div className="error" role="alert">{err}</div>}
          <button className="btn" type="submit">Create account</button>
        </form>
      </div>
    </Layout>
  )
}
