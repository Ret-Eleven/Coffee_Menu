import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { mockPromotions } from '../utils/mockData'

const EMPTY = { title:'', description:'', type:'percentage', value:'', code:'', min_order:'0', max_uses:'', start_date:'', end_date:'', status:'active' }
const TYPE_LABEL = { percentage:'% Discount', fixed:'Fixed ($)', buy_x_get_y:'Buy X Get Y', free_item:'Free Item' }
const STATUS_BADGE = { active:'badge-green', inactive:'badge-yellow', expired:'badge-red' }

export default function Promotions() {
  const [promos, setPromos] = useState(mockPromotions)
  const [filter, setFilter] = useState('all')
  const [modal, setModal]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState(EMPTY)

  useEffect(() => {
    api.get('/promotions').then(r => setPromos(r.data)).catch(() => {})
  }, [])

  const filtered = promos.filter(p => filter === 'all' || p.status === filter)

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = p  => { setEditing(p); setForm({ ...p }); setModal(true) }

  const save = async e => {
    e.preventDefault()
    try {
      if (editing) {
        const r = await api.put(`/promotions/${editing.id}`, form)
        setPromos(p => p.map(x => x.id === editing.id ? r.data : x))
      } else {
        const r = await api.post('/promotions', form)
        setPromos(p => [r.data, ...p])
      }
    } catch {
      if (editing) setPromos(p => p.map(x => x.id === editing.id ? { ...x, ...form } : x))
      else setPromos(p => [{ ...form, id:Date.now(), used_count:0 }, ...p])
    }
    toast.success(editing ? 'Promotion updated!' : 'Promotion created!')
    setModal(false)
  }

  const del = async p => {
    if (!confirm(`Delete "${p.title}"?`)) return
    try { await api.delete(`/promotions/${p.id}`) } catch {}
    setPromos(prev => prev.filter(x => x.id !== p.id))
    toast.success('Promotion deleted')
  }

  const toggleStatus = async p => {
    const newStatus = p.status === 'active' ? 'inactive' : 'active'
    try { await api.put(`/promotions/${p.id}`, { ...p, status:newStatus }) } catch {}
    setPromos(prev => prev.map(x => x.id === p.id ? { ...x, status:newStatus } : x))
    toast.success(`Promotion ${newStatus}`)
  }

  const discountLabel = p => p.type === 'percentage' ? `${p.value}% OFF` : p.type === 'fixed' ? `$${p.value} OFF` : TYPE_LABEL[p.type]

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Promotions</h1>
          <p className="page-subtitle">Manage discounts, coupons, and loyalty rewards</p>
        </div>
        <button className="btn btn-amber" onClick={openAdd}><Plus size={16} /> Create Promotion</button>
      </div>

      <div className="toolbar">
        <div className="filter-tabs">
          {['all','active','inactive','expired'].map(s => (
            <button key={s} className={`filter-tab${filter===s?' active':''}`} onClick={() => setFilter(s)} style={{ textTransform:'capitalize' }}>{s}</button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:18 }}>
        {filtered.map(p => (
          <div key={p.id} className="card">
            <div style={{ background:`linear-gradient(135deg, var(--ch-dark) 0%, var(--ch-amber) 100%)`,
                          padding:'20px 22px', color:'#fff', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', right:-8, top:-8, fontSize:'5rem', opacity:.1 }}>🏷️</div>
              <div style={{ fontSize:'1.6rem', fontWeight:800, marginBottom:4 }}>{discountLabel(p)}</div>
              <div style={{ fontSize:'.88rem', opacity:.85 }}>{p.title}</div>
              {p.code && (
                <div style={{ display:'inline-block', background:'rgba(255,255,255,.15)', border:'1px dashed rgba(255,255,255,.4)',
                              borderRadius:6, padding:'3px 10px', fontSize:'.78rem', fontWeight:700, marginTop:8, letterSpacing:1.5 }}>
                  {p.code}
                </div>
              )}
            </div>
            <div className="card-body">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <span className={`badge ${STATUS_BADGE[p.status]}`}>{p.status}</span>
                <span className="text-muted text-small">Used: {p.used_count}{p.max_uses ? ` / ${p.max_uses}` : ''}</span>
              </div>
              {p.description && <p style={{ fontSize:'.8rem', color:'var(--gray-500)', marginBottom:10 }}>{p.description}</p>}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, fontSize:'.78rem', color:'var(--gray-500)', marginBottom:14 }}>
                <span>📅 {p.start_date || '—'}</span>
                <span>📅 {p.end_date || '—'}</span>
                <span>💵 Min: ${p.min_order || 0}</span>
                <span>🏷️ {TYPE_LABEL[p.type]}</span>
              </div>
              <div className="td-actions">
                <button className={`btn btn-sm ${p.status==='active'?'btn-secondary':'btn-success'}`} style={{ flex:1 }} onClick={() => toggleStatus(p)}>
                  {p.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(p)}><Edit2 size={14} /></button>
                <button className="btn btn-danger btn-sm btn-icon" onClick={() => del(p)}><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon"><Tag size={48} /></div><h3>No promotions found</h3></div>}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal modal-lg">
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Promotion' : 'Create Promotion'}</span>
              <button className="btn btn-icon btn-secondary btn-sm" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input className="form-input" required value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" rows={2} value={form.description||''} onChange={e=>setForm(p=>({...p,description:e.target.value}))} />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-select" value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))}>
                      {Object.entries(TYPE_LABEL).map(([v,l])=><option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Value {form.type==='percentage'?'(%)':'($)'}</label>
                    <input className="form-input" type="number" step=".01" min="0" value={form.value} onChange={e=>setForm(p=>({...p,value:e.target.value}))} />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Coupon Code</label>
                    <input className="form-input" placeholder="e.g. SAVE20" value={form.code||''} onChange={e=>setForm(p=>({...p,code:e.target.value.toUpperCase()}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Min. Order ($)</label>
                    <input className="form-input" type="number" step=".01" min="0" value={form.min_order||0} onChange={e=>setForm(p=>({...p,min_order:e.target.value}))} />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Max Uses</label>
                    <input className="form-input" type="number" min="0" placeholder="Unlimited" value={form.max_uses||''} onChange={e=>setForm(p=>({...p,max_uses:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Start Date</label>
                    <input className="form-input" type="date" value={form.start_date||''} onChange={e=>setForm(p=>({...p,start_date:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">End Date</label>
                    <input className="form-input" type="date" value={form.end_date||''} onChange={e=>setForm(p=>({...p,end_date:e.target.value}))} />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-amber">{editing ? 'Update' : 'Create Promotion'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
