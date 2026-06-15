import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent]   = useState(false)

  const handle = e => {
    e.preventDefault()
    setSent(true)
    toast.success('Reset link sent! (demo)')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">☕</div>
          <div className="auth-logo-name">Coffee Haven</div>
        </div>

        {sent ? (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:'3rem', marginBottom:12 }}>📧</div>
            <h2 style={{ fontSize:'1.1rem', fontWeight:700, marginBottom:8 }}>Check your email</h2>
            <p style={{ fontSize:'.875rem', color:'var(--gray-500)', marginBottom:20 }}>
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Link to="/login" className="btn btn-primary w-full" style={{ display:'flex', justifyContent:'center' }}>Back to Sign In</Link>
          </div>
        ) : (
          <>
            <div className="auth-title">Forgot Password</div>
            <div className="auth-subtitle">Enter your email and we'll send a reset link</div>
            <form onSubmit={handle} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="you@coffeehaven.com"
                  value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <button className="btn btn-primary btn-lg w-full" type="submit">Send Reset Link</button>
            </form>
            <div className="auth-footer-link"><Link to="/login">← Back to Sign In</Link></div>
          </>
        )}
      </div>
    </div>
  )
}
