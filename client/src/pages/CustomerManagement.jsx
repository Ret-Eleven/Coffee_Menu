import { useState, useEffect } from 'react'
import { Plus, Search, Eye, Edit2, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { mockCustomers } from '../utils/mockData'

const EMPTY = { name:'', email:'', phone:'', address:'', membership:'bronze' }
const MEMBERSHIP = { bronze:'badge-brown', silver:'badge-gray', gold:'badge-amber', platinum:'badge-purple' }
const MEMBERSHIP_ICON = { bronze:'🥉', silver:'🥈', gold:'🥇', platinum:'💎' }

export default function CustomerManagement() {
  const [customers, setCustomers] = useState(mockCustomers)
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')
  const [modal, setModal]     = useState(false)
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)

  useEffect(() => {
    api.get('/customers').then(r => setCustomers(r.data.data || r.data)).catch(() => {})
  }, [])

  const filtered = customers.filter(c =>
    (filter === 'all' || c.membership === filter) &&
    [c.name, c.email, c.phone].some(v => v?.toLowerCase().includes(search.toLowerCase())))

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = c  => { setEditing(c); setForm({ ...c }); setModal(true) }

  const save = async e => {
    e.preventDefault()
    try {
      if (editing) {
        const r = await api.put(`/customers/${editing.id}`, form)
        setCustomers(p => p.map(x => x.id === editing.id ? r.data : x))
      } else {
        const r = await api.post('/customers', form)
        setCustomers(p => [r.data, ...p])
      }
    } catch {
      if (editing) setCustomers(p => p.map(x => x.id === editing.id ? { ...x, ...form } : x))
      else setCustomers(p => [{ ...form, id:Date.now(), loyalty_points:0, total_spent:0 }, ...p])
    }
    toast.success(editing ? 'Customer updated!' : 'Customer added!')
    setModal(false)
  }

  const del = async c => {
    if (!confirm(`Remove "${c.name}"?`)) return
    try { await api.delete(`/customers/${c.id}`) } catch {}
    setCustomers(p => p.filter(x => x.id !== c.id))
    toast.success('Customer removed')
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Management</h1>
          <p className="page-subtitle">{customers.length} registered customers</p>
        </div>
        <button className="btn btn-amber" onClick={openAdd}><Plus size={16} /> Add Customer</button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search by name, email or phone…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {['all','bronze','silver','gold','platinum'].map(m => (
            <button key={m} className={`filter-tab${filter===m?' active':''}`} onClick={() => setFilter(m)}
              style={{ textTransform:'capitalize' }}>{m}</button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr><th>Customer</th><th>Contact</th><th>Membership</th><th>Points</th><th>Total Spent</th><th>Since</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:'50%', background:'var(--ch-beige)', color:'var(--ch-brown)',
                                    display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, flexShrink:0 }}>
                        {c.name[0]}
                      </div>
                      <div>
                        <div style={{ fontWeight:600 }}>{c.name}</div>
                        <div className="text-muted text-small">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{c.phone || '—'}</td>
                  <td><span className={`badge ${MEMBERSHIP[c.membership]}`}>{MEMBERSHIP_ICON[c.membership]} {c.membership}</span></td>
                  <td>🏆 {c.loyalty_points?.toLocaleString()}</td>
                  <td><strong>${Number(c.total_spent||0).toFixed(2)}</strong></td>
                  <td className="text-muted text-small">{c.created_at?.slice(0,10)}</td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn-secondary btn-sm btn-icon" onClick={() => setProfile(c)} title="View"><Eye size={14} /></button>
                      <button className="btn btn-secondary btn-sm btn-icon" onClick={() => openEdit(c)} title="Edit"><Edit2 size={14} /></button>
                      <button className="btn btn-danger btn-sm btn-icon" onClick={() => del(c)} title="Delete"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">👥</div><h3>No customers found</h3></div>}
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Customer' : 'Add Customer'}</span>
              <button className="btn btn-icon btn-secondary btn-sm" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" value={form.email||''} onChange={e=>setForm(p=>({...p,email:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={form.phone||''} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea className="form-textarea" rows={2} value={form.address||''} onChange={e=>setForm(p=>({...p,address:e.target.value}))} />
                </div>
                {editing && (
                  <div className="form-group">
                    <label className="form-label">Membership Tier</label>
                    <select className="form-select" value={form.membership} onChange={e=>setForm(p=>({...p,membership:e.target.value}))}>
                      {['bronze','silver','gold','platinum'].map(m=><option key={m} value={m} style={{textTransform:'capitalize'}}>{m}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-amber">{editing ? 'Update' : 'Add Customer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {profile && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setProfile(null)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">Customer Profile</span>
              <button className="btn btn-icon btn-secondary btn-sm" onClick={() => setProfile(null)}><X size={16} /></button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign:'center', padding:'10px 0 20px' }}>
                <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--ch-beige)', color:'var(--ch-brown)',
                              display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'1.8rem', margin:'0 auto 12px' }}>
                  {profile.name[0]}
                </div>
                <h3 style={{ fontWeight:700, marginBottom:4 }}>{profile.name}</h3>
                <span className={`badge ${MEMBERSHIP[profile.membership]}`}>{MEMBERSHIP_ICON[profile.membership]} {profile.membership} Member</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                {[['📧 Email',profile.email||'—'],['📞 Phone',profile.phone||'—'],
                  ['🏆 Points',profile.loyalty_points?.toLocaleString()],['💰 Total Spent',`$${Number(profile.total_spent||0).toFixed(2)}`],
                  ['📅 Member Since',profile.created_at?.slice(0,10)],['📍 Address',profile.address||'—']
                ].map(([l,v])=>(
                  <div key={l} style={{ padding:12, background:'var(--gray-50)', borderRadius:'var(--radius)' }}>
                    <div className="text-muted text-small" style={{ marginBottom:4 }}>{l}</div>
                    <div style={{ fontWeight:600, fontSize:'.9rem', wordBreak:'break-word' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => { setProfile(null); openEdit(profile) }}><Edit2 size={14} /> Edit</button>
              <button className="btn btn-secondary" onClick={() => setProfile(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
