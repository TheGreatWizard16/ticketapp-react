import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './styles/tokens.css'
import Landing from './pages/Landing'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Tickets from './pages/Tickets.tsx'
import Protected from './routes/Protected.tsx'


const router = createBrowserRouter([
  { path: '/', element: <Landing/> },
  { path: '/auth/login', element: <Login/> },
  { path: '/auth/signup', element: <Signup/> },
  { path: '/dashboard', element: <Protected><Dashboard/></Protected> },
  { path: '/tickets', element: <Protected><Tickets/></Protected> },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>
)
