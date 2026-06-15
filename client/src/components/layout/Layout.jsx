import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header  from './Header'

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [pendingCount] = useState(6)

  return (
    <div className="app-layout">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} pendingCount={pendingCount} />
      <div className={`main-content${collapsed ? ' collapsed' : ''}`}>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
