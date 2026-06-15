import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

const DEMO_USER = { id:1, name:'Admin User', email:'admin@coffeehaven.com', role:'admin' }

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('ch_token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.get('/auth/me')
        .then(r => setUser(r.data))
        .catch(() => {
          /* Backend not connected — use demo user */
          const saved = localStorage.getItem('ch_user')
          if (saved) setUser(JSON.parse(saved))
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('ch_token', data.token)
      localStorage.setItem('ch_user', JSON.stringify(data.user))
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      setUser(data.user)
      return { ok: true }
    } catch {
      /* Demo fallback */
      if (email === 'admin@coffeehaven.com' && password === 'admin123') {
        const fakeToken = 'demo-token'
        localStorage.setItem('ch_token', fakeToken)
        localStorage.setItem('ch_user', JSON.stringify(DEMO_USER))
        setUser(DEMO_USER)
        return { ok: true }
      }
      return { ok: false, message: 'Invalid credentials. Try admin@coffeehaven.com / admin123' }
    }
  }

  const logout = () => {
    localStorage.removeItem('ch_token')
    localStorage.removeItem('ch_user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}
