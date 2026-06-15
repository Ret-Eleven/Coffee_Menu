import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, UtensilsCrossed, ShoppingCart, Users, Package,
  UserCheck, BarChart3, Tag, Settings, LogOut, ChevronLeft, ChevronRight, Coffee
} from 'lucide-react'

const NAV = [
  { section: 'Main' },
  { label:'Dashboard',   path:'/',            icon: LayoutDashboard },
  { label:'Orders',      path:'/orders',      icon: ShoppingCart,   badge: 'pending' },
  { section: 'Management' },
  { label:'Menu',        path:'/menu',        icon: UtensilsCrossed },
  { label:'Customers',   path:'/customers',   icon: Users },
  { label:'Inventory',   path:'/inventory',   icon: Package },
  { label:'Employees',   path:'/employees',   icon: UserCheck,      roles:['admin','manager'] },
  { section: 'Analytics' },
  { label:'Reports',     path:'/reports',     icon: BarChart3,      roles:['admin','manager'] },
  { label:'Promotions',  path:'/promotions',  icon: Tag },
  { section: 'System' },
  { label:'Settings',    path:'/settings',    icon: Settings,       roles:['admin'] },
]

export default function Sidebar({ collapsed, setCollapsed, pendingCount }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || 'U'

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <Coffee className="sidebar-logo" size={28} color="#C8832A" />
        <span className="sidebar-name">Coffee Haven</span>
      </div>

      {/* Toggle */}
      <button
        onClick={() => setCollapsed(p => !p)}
        style={{ position:'absolute', top:22, right:-12, width:24, height:24, borderRadius:'50%',
                 background:'#fff', border:'1.5px solid #e5e7eb', display:'flex', alignItems:'center',
                 justifyContent:'center', cursor:'pointer', zIndex:201, boxShadow:'0 2px 6px rgba(0,0,0,.12)' }}>
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV.map((item, i) => {
          if (item.section) return (
            <div key={i} className="nav-section-label">{item.section}</div>
          )
          if (item.roles && !item.roles.includes(user?.role)) return null
          const Icon = item.icon
          const count = item.badge === 'pending' ? pendingCount : 0
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
              <span className="nav-icon"><Icon size={18} /></span>
              <span className="nav-label">{item.label}</span>
              {count > 0 && <span className="nav-badge">{count}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="nav-item" style={{ marginTop:8, width:'100%', color:'rgba(255,255,255,.5)' }}>
          <span className="nav-icon"><LogOut size={16} /></span>
          <span className="nav-label">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
