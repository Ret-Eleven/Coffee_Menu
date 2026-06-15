import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, X, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { mockInventory } from '../utils/mockData'

const EMPTY = { name:'', category:'Coffee Beans', unit:'kg', quantity:'', min_quantity:'', cost_per_unit:'', supplier:'', supplier_contact:'' }
const CATS   = ['Coffee Beans','Dairy','Syrups','Pastries','Packaging','Cleaning','Other']

export default function InventoryManagement() {
  const [items, setItems] = useState(mockInventory)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [modal, setModal]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState(EMPTY)

  useEffect(() => {
    api.get('/inventory').then(r => setItems(r.data.data || r.data)).catch(() => {})
  }, [])

  const lowStock = items.filter(i => Number(i.quantity) <= Number(i.min_quantity))
  const filtered = items.filter(i =>
    (filter === 'all' || (filter === 'low' ? Number(i.quantity) <= Number(i.min_quantity) : i.category === filter)) &&
    i.name.toLowerCase().includes(search.toLowerCase()))

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = i  => { setEditing(i); setForm({ ...i }); setModal(true) }

  const save = async e => {
    e.preventDefault()
    try {
      if (editing) {
        const r = await api.put(`/inventory/${editing.id}`, form)
        setItems(p => p.map(x => x.id === editing.id ? r.data : x))
      } else {
        const r = await api.post('/inventory', form)
        setItems(p => [...p, r.data])
      }
    } catch {
      if (editing) setItems(p => p.map(x => x.id === editing.id ? { ...x, ...form } : x))
      else setItems(p => [...p, { ...form, id:Date.now() }])
    }
    toast.success(editing ? 'Item updated!' : 'Item added!')
    setModal(false)
  }

  const del = async i => {
    if (!confirm(`Delete "${i.name}"?`)) return
    try { await api.delete(`/inventory/${i.id}`) } catch {}
    setItems(p => p.filter(x => x.id !== i.id))
    toast.success('Item deleted')
  }

  const stockPct = i => Math.min(100, Math.round((Number(i.quantity) / Math.max(Number(i.min_quantity)*2,1)) * 100))
  const stockColor = i => Number(i.quantity) <= Number(i.min_quantity) ? '#dc2626' : Number(i.quantity) <= Number(i.min_quantity)*1.5 ? '#d97706' : '#16a34a'

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Management</h1>
          <p className="page-subtitle">{items.length} items tracked</p>
        </div>
        <button className="btn btn-amber" onClick={openAdd}><Plus size={16} /> Add Item</button>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div style={{ background:'#fef3c7', border:'1.5px solid #fbbf24', borderRadius:'var(--radius)', padding:'12px 16px', marginBottom:20, display:'flex', gap:12, alignItems:'center' }}>
          <AlertTriangle size={20} color="#d97706" />
          <div>
            <strong style={{ color:'#92400e' }}>Low Stock Alert</strong>
            <p style={{ fontSize:'.82rem', color:'#78350f', marginTop:2 }}>
              {lowStock.map(i => i.name).join(', ')} — reorder needed
            </p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search items or supplier…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {['all','low',...CATS].map(f => (
            <button key={f} className={`filter-tab${filter===f?' active':''}`} onClick={() => setFilter(f)}
              style={{ textTransform:'capitalize' }}>{f === 'low' ? '⚠️ Low Stock' : f}</button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Item</th><th>Category</th><th>Quantity</th><th>Min. Level</th><th>Unit Cost</th><th>Supplier</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(i => {
                const pct = stockPct(i)
                const col = stockColor(i)
                const isLow = Number(i.quantity) <= Number(i.min_quantity)
                return (
                  <tr key={i.id}>
                    <td><strong>{i.name}</strong></td>
                    <td><span className="badge badge-brown">{i.category}</span></td>
                    <td>
                      <div>
                        <div style={{ fontWeight:600 }}>{i.quantity} {i.unit}</div>
                        <div style={{ height:4, background:'var(--gray-200)', borderRadius:99, marginTop:4, width:80 }}>
                          <div style={{ height:'100%', width:`${pct}%`, background:col, borderRadius:99, transition:'width .3s' }} />
                        </div>
                      </div>
                    </td>
                    <td>{i.min_quantity} {i.unit}</td>
                    <td>${Number(i.cost_per_unit).toFixed(2)}</td>
                    <td>
                      <div style={{ fontWeight:500 }}>{i.supplier || '—'}</div>
                      <div className="text-muted text-small">{i.supplier_contact}</div>
                    </td>
                    <td>
                      {isLow
                        ? <span className="badge badge-red">⚠️ Low Stock</span>
                        : <span className="badge badge-green">✓ OK</span>}
                    </td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(i)}><Edit2 size={14} /></button>
                        <button className="btn btn-danger btn-sm btn-icon" onClick={() => del(i)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">📦</div><h3>No items found</h3></div>}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal modal-lg">
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Item' : 'Add Inventory Item'}</span>
              <button className="btn btn-icon btn-secondary btn-sm" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Item Name *</label>
                    <input className="form-input" required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={form.category} onChange={e=>setForm(p=>({...p,category:e.target.value}))}>
                      {CATS.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">Current Qty *</label>
                    <input className="form-input" type="number" step=".01" min="0" required value={form.quantity} onChange={e=>setForm(p=>({...p,quantity:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Min. Qty</label>
                    <input className="form-input" type="number" step=".01" min="0" value={form.min_quantity} onChange={e=>setForm(p=>({...p,min_quantity:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Unit</label>
                    <input className="form-input" value={form.unit} onChange={e=>setForm(p=>({...p,unit:e.target.value}))} placeholder="kg, L, pcs…" />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Cost per Unit ($)</label>
                    <input className="form-input" type="number" step=".01" min="0" value={form.cost_per_unit} onChange={e=>setForm(p=>({...p,cost_per_unit:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Supplier Name</label>
                    <input className="form-input" value={form.supplier||''} onChange={e=>setForm(p=>({...p,supplier:e.target.value}))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Supplier Contact</label>
                  <input className="form-input" value={form.supplier_contact||''} onChange={e=>setForm(p=>({...p,supplier_contact:e.target.value}))} placeholder="email or phone" />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-amber">{editing ? 'Update' : 'Add Item'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
