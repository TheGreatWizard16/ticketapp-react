import Layout from '../components/Layout'
import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <Layout>
      <div className="card" style={{maxWidth:560, margin:'40px auto', textAlign:'center'}}>
        <h2>Page not found</h2>
        <p>We can’t find that page. Try the dashboard or tickets.</p>
        <div style={{display:'flex',gap:8,justifyContent:'center'}}>
          <Link className="btn" to="/dashboard">Dashboard</Link>
          <Link className="btn ghost" to="/tickets">Tickets</Link>
        </div>
      </div>
    </Layout>
  )
}
