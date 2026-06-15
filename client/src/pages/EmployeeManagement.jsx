import { useState, useEffect } from 'react'
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { mockEmployees } from '../utils/mockData'

const EMPTY = { name:'', email:'', password:'', role:'staff', phone:'', status:'active', hire_date:'' }
const ROLE_BADGE = { admin:'badge-red', manager:'badge-amber', staff:'badge-blue' }

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState(mockEmployees)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [modal, setModal]   = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState(EMPTY)

  useEffect(() => {
    api.get('/employees').then(r => setEmployees(r.data)).catch(() => {})
  }, [])

  const filtered = employees.filter(e =>
    (filter === 'all' || e.role === filter) &&
    [e.name, e.email, e.phone].some(v => v?.toLowerCase().includes(search.toLowerCase())))

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = e  => { setEditing(e); setForm({ ...e, password:'' }); setModal(true) }

  const save = async ev => {
    ev.preventDefault()
    const payload = { ...form }
    if (!payload.password) delete payload.password
    try {
      if (editing) {
        const r = await api.put(`/employees/${editing.id}`, payload)
        setEmployees(p => p.map(x => x.id === editing.id ? r.data : x))
      } else {
        const r = await api.post('/employees', payload)
        setEmployees(p => [...p, r.data])
      }
    } catch {
      if (editing) setEmployees(p => p.map(x => x.id === editing.id ? { ...x, ...payload } : x))
      else setEmployees(p => [...p, { ...payload, id:Date.now(), password:undefined }])
    }
    toast.success(editing ? 'Employee updated!' : 'Employee added!')
    setModal(false)
  }

  const del = async e => {
    if (!confirm(`Remove "${e.name}"?`)) return
    try { await api.delete(`/employees/${e.id}`) } catch {}
    setEmployees(p => p.filter(x => x.id !== e.id))
    toast.success('Employee removed')
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Management</h1>
          <p className="page-subtitle">{employees.length} staff members</p>
        </div>
        <button className="btn btn-amber" onClick={openAdd}><Plus size={16} /> Add Employee</button>
      </div>

      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search employees…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="filter-tabs">
          {['all','admin','manager','staff'].map(r => (
            <button key={r} className={`filter-tab${filter===r?' active':''}`} onClick={() => setFilter(r)}
              style={{ textTransform:'capitalize' }}>{r}</button>
          ))}
        </div>
      </div>

      {/* Employee Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:16 }}>
        {filtered.map(emp => (
          <div key={emp.id} className="card" style={{ padding:0 }}>
            <div style={{ background:'linear-gradient(135deg, var(--ch-dark), var(--ch-medium))', height:64, borderRadius:'var(--radius-lg) var(--radius-lg) 0 0' }} />
            <div style={{ padding:'0 20px 20px', marginTop:-28 }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:'var(--ch-amber)', color:'#fff',
                            display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:'1.3rem',
                            border:'3px solid #fff', marginBottom:10 }}>
                {emp.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
              </div>
              <div style={{ fontWeight:700, fontSize:'1rem', marginBottom:4 }}>{emp.name}</div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
                <span className={`badge ${ROLE_BADGE[emp.role]}`}>{emp.role}</span>
                <span className={`badge ${emp.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{emp.status}</span>
              </div>
              <div style={{ fontSize:'.8rem', color:'var(--gray-500)', display:'flex', flexDirection:'column', gap:3 }}>
                <span>📧 {emp.email}</span>
                <span>📞 {emp.phone || '—'}</span>
                <span>📅 Hired: {emp.hire_date?.slice(0,10) || '—'}</span>
              </div>
              <div className="td-actions" style={{ marginTop:14 }}>
                <button className="btn btn-secondary btn-sm" style={{ flex:1 }} onClick={() => openEdit(emp)}><Edit2 size={13} /> Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => del(emp)}><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">👤</div><h3>No employees found</h3></div>}

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Employee' : 'Add Employee'}</span>
              <button className="btn btn-icon btn-secondary btn-sm" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" required value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">{editing ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                  <input className="form-input" type="password" required={!editing} minLength={6} value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select className="form-select" value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}>
                      <option value="staff">Staff</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={form.phone||''} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Hire Date</label>
                    <input className="form-input" type="date" value={form.hire_date||''} onChange={e=>setForm(p=>({...p,hire_date:e.target.value}))} />
                  </div>
                  {editing && (
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select className="form-select" value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-amber">{editing ? 'Update' : 'Add Employee'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
