import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Login          from './pages/auth/Login'
import Register       from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard        from './pages/Dashboard'
import MenuManagement   from './pages/MenuManagement'
import OrderManagement  from './pages/OrderManagement'
import CustomerManagement   from './pages/CustomerManagement'
import InventoryManagement  from './pages/InventoryManagement'
import EmployeeManagement   from './pages/EmployeeManagement'
import Reports    from './pages/Reports'
import Promotions from './pages/Promotions'
import Settings   from './pages/Settings'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontSize:'1.2rem',color:'#8B5E3C'}}>☕ Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"           element={<Login />} />
      <Route path="/register"        element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="menu"      element={<MenuManagement />} />
        <Route path="orders"    element={<OrderManagement />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="employees" element={<ProtectedRoute roles={['admin','manager']}><EmployeeManagement /></ProtectedRoute>} />
        <Route path="reports"   element={<ProtectedRoute roles={['admin','manager']}><Reports /></ProtectedRoute>} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="settings"  element={<ProtectedRoute roles={['admin']}><Settings /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
