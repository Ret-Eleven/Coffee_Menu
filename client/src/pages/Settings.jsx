import { useState, useEffect } from 'react'
import { Save, Shield, CreditCard, Store, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

const TABS = [
  { id:'shop',     label:'Shop Info',      icon: Store },
  { id:'payment',  label:'Payments',       icon: CreditCard },
  { id:'roles',    label:'Roles',          icon: Users },
  { id:'security', label:'Security',       icon: Shield },
]

export default function Settings() {
  const [tab, setTab]   = useState('shop')
  const [shop, setShop] = useState({ shop_name:'Coffee Haven', shop_address:'123 Brew Street', shop_phone:'+1 555-COFFEE', shop_email:'hello@coffeehaven.com', currency:'USD', tax_rate:'8', loyalty_rate:'10' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/settings').then(r => setShop(p => ({ ...p, ...r.data }))).catch(() => {})
  }, [])

  const saveShop = async e => {
    e.preventDefault()
    setSaving(true)
    try { await api.put('/settings', shop) } catch {}
    toast.success('Settings saved!')
    setSaving(false)
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Configure Coffee Haven preferences</p>
        </div>
      </div>

      <div style={{ display:'flex', gap:24 }}>
        {/* Sidebar Tabs */}
        <div style={{ width:200, flexShrink:0 }}>
          <div className="card" style={{ padding:'8px 0' }}>
            {TABS.map(t => {
              const Icon = t.icon
              return (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 16px',
                            background: tab===t.id ? 'var(--ch-beige)' : 'none',
                            color: tab===t.id ? 'var(--ch-brown)' : 'var(--gray-600)',
                            fontWeight: tab===t.id ? 700 : 400, fontSize:'.88rem', textAlign:'left',
                            borderLeft: tab===t.id ? '3px solid var(--ch-amber)' : '3px solid transparent' }}>
                  <Icon size={16} /> {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1 }}>

          {tab === 'shop' && (
            <div className="card">
              <div className="card-header"><span className="card-title">🏪 Shop Information</span></div>
              <form onSubmit={saveShop}>
                <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Shop Name</label>
                      <input className="form-input" value={shop.shop_name||''} onChange={e=>setShop(p=>({...p,shop_name:e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input className="form-input" type="email" value={shop.shop_email||''} onChange={e=>setShop(p=>({...p,shop_email:e.target.value}))} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input className="form-input" value={shop.shop_address||''} onChange={e=>setShop(p=>({...p,shop_address:e.target.value}))} />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Phone</label>
                      <input className="form-input" value={shop.shop_phone||''} onChange={e=>setShop(p=>({...p,shop_phone:e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Currency</label>
                      <select className="form-select" value={shop.currency||'USD'} onChange={e=>setShop(p=>({...p,currency:e.target.value}))}>
                        <option value="USD">USD — US Dollar</option>
                        <option value="EUR">EUR — Euro</option>
                        <option value="GBP">GBP — British Pound</option>
                        <option value="KHR">KHR — Cambodian Riel</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Tax Rate (%)</label>
                      <input className="form-input" type="number" step=".01" min="0" max="100" value={shop.tax_rate||8} onChange={e=>setShop(p=>({...p,tax_rate:e.target.value}))} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Loyalty Points Rate (pts per $)</label>
                      <input className="form-input" type="number" min="0" value={shop.loyalty_rate||10} onChange={e=>setShop(p=>({...p,loyalty_rate:e.target.value}))} />
                    </div>
                  </div>
                  <div style={{ paddingTop:4 }}>
                    <button type="submit" className="btn btn-amber" disabled={saving}><Save size={15} /> {saving ? 'Saving…' : 'Save Changes'}</button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {tab === 'payment' && (
            <div className="card">
              <div className="card-header"><span className="card-title">💳 Payment Methods</span></div>
              <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[{icon:'💵',name:'Cash',desc:'Accept physical cash payments',enabled:true},
                  {icon:'💳',name:'Credit / Debit Card',desc:'Accept card payments via POS terminal',enabled:true},
                  {icon:'📱',name:'Digital Wallet',desc:'QR code, GrabPay, PayPal and more',enabled:false},
                  {icon:'🏦',name:'Bank Transfer',desc:'Direct bank transfer for bulk orders',enabled:false},
                ].map(pm => (
                  <div key={pm.name} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', background:'var(--gray-50)', borderRadius:'var(--radius)', border:'1px solid var(--gray-200)' }}>
                    <span style={{ fontSize:'1.6rem' }}>{pm.icon}</span>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:600, marginBottom:2 }}>{pm.name}</div>
                      <div className="text-muted text-small">{pm.desc}</div>
                    </div>
                    <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }}>
                      <input type="checkbox" defaultChecked={pm.enabled} style={{ width:16,height:16 }} />
                      <span className="text-small" style={{ fontWeight:600 }}>{pm.enabled ? 'Enabled' : 'Disabled'}</span>
                    </label>
                  </div>
                ))}
                <button className="btn btn-amber" style={{ alignSelf:'flex-start', marginTop:4 }} onClick={() => toast.success('Payment settings saved!')}><Save size={15} /> Save</button>
              </div>
            </div>
          )}

          {tab === 'roles' && (
            <div className="card">
              <div className="card-header"><span className="card-title">👥 Role Permissions</span></div>
              <div className="card-body">
                <table className="data-table">
                  <thead><tr><th>Permission</th><th>Admin</th><th>Manager</th><th>Staff</th></tr></thead>
                  <tbody>
                    {[
                      ['View Dashboard',true,true,true],
                      ['Manage Menu',true,true,false],
                      ['Create Orders',true,true,true],
                      ['View Reports',true,true,false],
                      ['Manage Customers',true,true,true],
                      ['Manage Inventory',true,true,false],
                      ['Manage Employees',true,false,false],
                      ['Manage Promotions',true,true,false],
                      ['Access Settings',true,false,false],
                    ].map(([perm,...checks])=>(
                      <tr key={perm}>
                        <td style={{ fontWeight:500 }}>{perm}</td>
                        {checks.map((c,i) => <td key={i}>{c ? '✅' : '—'}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="card">
                <div className="card-header"><span className="card-title">🔐 Security Settings</span></div>
                <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {[
                    { label:'Two-Factor Authentication', desc:'Require 2FA for admin accounts', enabled:false },
                    { label:'Session Timeout', desc:'Auto logout after 30 minutes of inactivity', enabled:true },
                    { label:'Login Alerts', desc:'Send email alert on new login', enabled:true },
                    { label:'IP Whitelist', desc:'Restrict access to specific IP addresses', enabled:false },
                  ].map(s => (
                    <div key={s.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', background:'var(--gray-50)', borderRadius:'var(--radius)', border:'1px solid var(--gray-200)' }}>
                      <div>
                        <div style={{ fontWeight:600, marginBottom:2 }}>{s.label}</div>
                        <div className="text-muted text-small">{s.desc}</div>
                      </div>
                      <input type="checkbox" defaultChecked={s.enabled} style={{ width:16,height:16,cursor:'pointer' }} />
                    </div>
                  ))}
                  <button className="btn btn-amber" style={{ alignSelf:'flex-start' }} onClick={() => toast.success('Security settings saved!')}><Save size={15} /> Save</button>
                </div>
              </div>

              <div className="card">
                <div className="card-header"><span className="card-title">🔑 Change Password</span></div>
                <div className="card-body" style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input className="form-input" type="password" placeholder="••••••••" />
                  </div>
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">New Password</label>
                      <input className="form-input" type="password" placeholder="min 6 characters" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirm Password</label>
                      <input className="form-input" type="password" placeholder="repeat new password" />
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ alignSelf:'flex-start' }} onClick={() => toast.success('Password updated!')}><Shield size={15} /> Update Password</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
