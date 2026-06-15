import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Coffee } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const [form, setForm]       = useState({ email:'admin@coffeehaven.com', password:'admin123' })
  const [show, setShow]       = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handle = async e => {
    e.preventDefault()
    setLoading(true)
    const res = await login(form.email, form.password)
    setLoading(false)
    if (res.ok) { toast.success('Welcome back! ☕'); navigate('/') }
    else toast.error(res.message)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">☕</div>
          <div className="auth-logo-name">Coffee Haven</div>
          <div className="auth-logo-sub">Management System</div>
        </div>

        <div className="auth-title">Welcome back</div>
        <div className="auth-subtitle">Sign in to your account to continue</div>

        <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="admin@coffeehaven.com"
              value={form.email} onChange={e => setForm(p => ({ ...p, email:e.target.value }))} required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position:'relative' }}>
              <input className="form-input" type={show ? 'text' : 'password'} placeholder="••••••••"
                value={form.password} onChange={e => setForm(p => ({ ...p, password:e.target.value }))}
                required style={{ paddingRight:42 }} />
              <button type="button" onClick={() => setShow(p => !p)}
                style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', color:'var(--gray-400)', background:'none', border:'none', cursor:'pointer' }}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <Link to="/forgot-password" style={{ fontSize:'.82rem', color:'var(--ch-amber)', fontWeight:600 }}>
              Forgot password?
            </Link>
          </div>

          <button className="btn btn-primary btn-lg w-full" type="submit" disabled={loading}>
            <Coffee size={16} /> {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop:16, padding:12, background:'var(--ch-cream)', borderRadius:'var(--radius)', fontSize:'.78rem', color:'var(--gray-600)' }}>
          <strong>Demo credentials:</strong><br />
          Email: admin@coffeehaven.com<br />
          Password: admin123
        </div>

        <div className="auth-footer-link">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  )
}
