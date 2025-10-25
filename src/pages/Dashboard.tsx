import Layout from '../components/Layout'
import { useEffect } from 'react'
import { useTickets } from '../lib/store'

export default function Dashboard(){
  const { tickets, load } = useTickets()
  useEffect(()=>{ load() },[load])
  const total=tickets.length
  const open=tickets.filter(t=>t.status==='open').length
  const resolved=tickets.filter(t=>t.status==='closed').length
  return (
    <Layout>
      <h2>Dashboard</h2>
      <div className="grid cols-3" style={{marginTop:16}}>
        <div className="card"><strong>Total</strong><div style={{fontSize:36}}>{total}</div></div>
        <div className="card"><strong>Open</strong><div style={{fontSize:36,color:'var(--green)'}}>{open}</div></div>
        <div className="card"><strong>Resolved</strong><div style={{fontSize:36,color:'var(--gray)'}}>{resolved}</div></div>
      </div>
    </Layout>
  )
}
