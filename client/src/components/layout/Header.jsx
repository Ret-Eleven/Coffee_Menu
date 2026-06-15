import { Bell, Search, Menu } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLocation } from 'react-router-dom'

const TITLES = {
  '/':           'Dashboard',
  '/menu':       'Menu Management',
  '/orders':     'Order Management',
  '/customers':  'Customer Management',
  '/inventory':  'Inventory Management',
  '/employees':  'Employee Management',
  '/reports':    'Reports & Analytics',
  '/promotions': 'Promotions',
  '/settings':   'Settings',
}

export default function Header({ collapsed, setCollapsed }) {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const title = TITLES[pathname] || 'Coffee Haven'

  return (
    <header className={`top-header${collapsed ? ' collapsed' : ''}`}>
      <div className="header-left">
        <button className="header-btn" onClick={() => setCollapsed(p => !p)} aria-label="Toggle sidebar">
          <Menu size={20} />
        </button>
        <div className="header-breadcrumb">
          ☕ Coffee Haven &nbsp;/&nbsp; <strong>{title}</strong>
        </div>
      </div>

      <div className="header-right">
        <button className="header-btn" aria-label="Search">
          <Search size={18} />
        </button>
        <button className="header-btn" aria-label="Notifications" style={{ position:'relative' }}>
          <Bell size={18} />
          <span className="header-notif-dot" />
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginLeft:4,
                      padding:'6px 10px', borderRadius:10, background:'var(--gray-50)',
                      border:'1px solid var(--gray-200)' }}>
          <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--ch-amber)',
                        color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
                        fontWeight:700, fontSize:'.78rem' }}>
            {user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
          </div>
          <div style={{ lineHeight:1.2 }}>
            <div style={{ fontSize:'.8rem', fontWeight:600, color:'var(--gray-800)' }}>{user?.name}</div>
            <div style={{ fontSize:'.68rem', color:'var(--gray-500)', textTransform:'capitalize' }}>{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
