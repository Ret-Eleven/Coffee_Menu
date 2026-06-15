import { useState, useEffect } from 'react'
import { Search, Eye, X, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { mockOrders } from '../utils/mockData'

const STATUS_FLOW = ['pending','preparing','ready','completed','cancelled']
const STATUS_COLOR = { pending:'badge-yellow', preparing:'badge-blue', ready:'badge-purple', completed:'badge-green', cancelled:'badge-red' }
const PAY_ICON = { cash:'💵', card:'💳', digital:'📱' }

export default function OrderManagement() {
  const [orders, setOrders] = useState(mockOrders)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    api.get('/orders').then(r => setOrders(r.data.data || r.data)).catch(() => {})
  }, [])

  const counts = STATUS_FLOW.reduce((a,s) => ({ ...a, [s]: orders.filter(o=>o.status===s).length }), {})

  const filtered = orders.filter(o =>
    (filter === 'all' || o.status === filter) &&
    (o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
     o.customer_name?.toLowerCase().includes(search.toLowerCase())))

  const changeStatus = async (order, status) => {
    try { await api.patch(`/orders/${order.id}`, { status }) } catch {}
    setOrders(p => p.map(o => o.id === order.id ? { ...o, status } : o))
    if (detail?.id === order.id) setDetail(p => ({ ...p, status }))
    toast.success(`Order ${order.order_number} → ${status}`)
  }

  const fmt = n => `$${Number(n).toFixed(2)}`

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Order Management</h1>
          <p className="page-subtitle">{orders.length} total orders</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid" style={{ marginBottom:20 }}>
        {[{l:'Total',s:null,v:orders.length,icon:'📋'}, ...STATUS_FLOW.map(s=>({l:s,s,v:counts[s]||0,icon:{pending:'⏳',preparing:'👨‍🍳',ready:'✅',completed:'🏆',cancelled:'❌'}[s]}))].map(x=>(
          <div key={x.l} className={`stat-card${filter===x.s?'':''}`}
            style={{ cursor:'pointer', borderColor: filter===(x.s||'all') ? 'var(--ch-amber)' : '', border:'2px solid transparent' }}
            onClick={() => setFilter(x.s || 'all')}>
            <div className="stat-icon brown">{x.icon}</div>
            <div>
              <div className="stat-label" style={{ textTransform:'capitalize' }}>{x.l}</div>
              <div className="stat-value">{x.v}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search by order # or customer…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {['all','pending','preparing','ready','completed','cancelled'].map(s => (
            <button key={s} className={`filter-tab${filter===s?' active':''}`} onClick={() => setFilter(s)}
              style={{ textTransform:'capitalize' }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order #</th><th>Customer</th><th>Date</th>
                <th>Payment</th><th>Total</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td><code style={{ color:'var(--ch-brown)', fontWeight:700 }}>{o.order_number}</code></td>
                  <td>{o.customer_name || <span className="text-muted">Walk-in</span>}</td>
                  <td className="text-muted text-small">{new Date(o.created_at).toLocaleString()}</td>
                  <td>{PAY_ICON[o.payment_method]} {o.payment_method}</td>
                  <td><strong>{fmt(o.total)}</strong></td>
                  <td><span className={`badge ${STATUS_COLOR[o.status]}`}>{o.status}</span></td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setDetail(o)} title="View"><Eye size={14} /></button>
                      {o.status !== 'completed' && o.status !== 'cancelled' && (
                        <div style={{ position:'relative', display:'inline-block' }}>
                          <select className="form-select" style={{ fontSize:'.75rem', padding:'5px 8px', cursor:'pointer' }}
                            value={o.status} onChange={e => changeStatus(o, e.target.value)}>
                            {STATUS_FLOW.map(s => <option key={s} value={s} style={{ textTransform:'capitalize' }}>{s}</option>)}
                          </select>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="empty-state"><div className="empty-state-icon">📋</div><h3>No orders found</h3></div>
        )}
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDetail(null)}>
          <div className="modal modal-lg">
            <div className="modal-header">
              <span className="modal-title">Order {detail.order_number}</span>
              <button className="btn btn-icon btn-secondary btn-sm" onClick={() => setDetail(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div><span className="form-label">Customer</span><p style={{ marginTop:4 }}>{detail.customer_name || 'Walk-in'}</p></div>
                <div><span className="form-label">Date</span><p style={{ marginTop:4 }}>{new Date(detail.created_at).toLocaleString()}</p></div>
                <div><span className="form-label">Payment</span><p style={{ marginTop:4 }}>{PAY_ICON[detail.payment_method]} {detail.payment_method}</p></div>
                <div><span className="form-label">Status</span><p style={{ marginTop:4 }}><span className={`badge ${STATUS_COLOR[detail.status]}`}>{detail.status}</span></p></div>
              </div>
              <div style={{ marginTop:4, padding:'12px 16px', background:'var(--gray-50)', borderRadius:'var(--radius)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontWeight:700, marginBottom:8, fontSize:'.82rem', color:'var(--gray-500)' }}>
                  <span>ITEM</span><span>TOTAL</span>
                </div>
                {detail.items?.map((item, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid var(--gray-200)' }}>
                    <span>{item.product_name || item.name} {item.size && `(${item.size})`} × {item.quantity}</span>
                    <span style={{ fontWeight:600 }}>{fmt(item.subtotal || item.unit_price * item.quantity)}</span>
                  </div>
                )) || <p className="text-muted text-small">No items detail available in demo</p>}
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end', flexDirection:'column', alignItems:'flex-end', gap:4, marginTop:8 }}>
                <span className="text-muted text-small">Subtotal: {fmt(detail.subtotal || detail.total)}</span>
                <span className="text-muted text-small">Tax: {fmt(detail.tax || 0)}</span>
                <strong style={{ fontSize:'1.05rem', color:'var(--ch-brown)' }}>Total: {fmt(detail.total)}</strong>
              </div>
            </div>
            <div className="modal-footer">
              {detail.status !== 'completed' && detail.status !== 'cancelled' && (
                <select className="form-select" style={{ width:'auto' }} value={detail.status}
                  onChange={e => changeStatus(detail, e.target.value)}>
                  {STATUS_FLOW.map(s => <option key={s} value={s} style={{ textTransform:'capitalize' }}>{s}</option>)}
                </select>
              )}
              <button className="btn btn-secondary" onClick={() => setDetail(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
