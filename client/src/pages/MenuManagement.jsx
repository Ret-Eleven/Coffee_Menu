import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Search, X, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import { mockProducts, mockCategories } from '../utils/mockData'

const EMPTY = { name:'', category_id:'', description:'', price:'', stock:'', status:'available', has_sizes:0 }

export default function MenuManagement() {
  const [products,   setProducts]   = useState(mockProducts)
  const [categories, setCategories] = useState(mockCategories)
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    api.get('/menu').then(r => setProducts(r.data.data || r.data)).catch(() => {})
    api.get('/menu/categories').then(r => setCategories(r.data)).catch(() => {})
  }, [])

  const filtered = products.filter(p =>
    (activeCategory === 'all' || p.category_name === activeCategory) &&
    p.name.toLowerCase().includes(search.toLowerCase()))

  const openAdd  = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = p  => { setEditing(p); setForm({ ...p }); setModal(true) }

  const save = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const updated = await api.put(`/menu/${editing.id}`, form).then(r => r.data)
        setProducts(p => p.map(x => x.id === updated.id ? updated : x))
        toast.success('Product updated!')
      } else {
        const created = await api.post('/menu', form).then(r => r.data)
        setProducts(p => [created, ...p])
        toast.success('Product added!')
      }
    } catch {
      /* demo fallback */
      if (editing) {
        setProducts(p => p.map(x => x.id === editing.id ? { ...x, ...form } : x))
      } else {
        setProducts(p => [{ ...form, id: Date.now(), category_name: categories.find(c=>c.id==form.category_id)?.name }, ...p])
      }
      toast.success(editing ? 'Product updated! (demo)' : 'Product added! (demo)')
    } finally { setSaving(false); setModal(false) }
  }

  const del = async p => {
    if (!confirm(`Delete "${p.name}"?`)) return
    try { await api.delete(`/menu/${p.id}`) } catch {}
    setProducts(prev => prev.filter(x => x.id !== p.id))
    toast.success('Product deleted!')
  }

  const statusColor = s => ({ available:'badge-green', unavailable:'badge-yellow', discontinued:'badge-red' }[s] || 'badge-gray')

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Menu Management</h1>
          <p className="page-subtitle">{products.length} products across {categories.length} categories</p>
        </div>
        <button className="btn btn-amber" onClick={openAdd}><Plus size={16} /> Add Product</button>
      </div>

      {/* Category Tabs */}
      <div style={{ display:'flex', gap:8, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        {[{name:'all',icon:'🍽️'}, ...categories].map(c => (
          <button key={c.name} onClick={() => setActiveCategory(c.name)}
            className={`filter-tab${activeCategory === c.name ? ' active' : ''}`}
            style={{ whiteSpace:'nowrap', flexShrink:0 }}>
            {c.icon} {c.name === 'all' ? 'All Items' : c.name}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span className="text-muted text-small">{filtered.length} items</span>
      </div>

      {/* Product Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:16 }}>
        {filtered.map(p => (
          <div key={p.id} className="card" style={{ transition:'transform .2s', cursor:'default' }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform=''}>
            <div style={{ height:110, background:`linear-gradient(135deg, var(--ch-dark), var(--ch-medium))`,
                          display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>
              {p.emoji || '☕'}
            </div>
            <div className="card-body" style={{ padding:'14px 16px' }}>
              <div style={{ fontWeight:700, fontSize:'.95rem', marginBottom:4 }}>{p.name}</div>
              <div style={{ display:'flex', gap:6, marginBottom:10, flexWrap:'wrap' }}>
                <span className="badge badge-brown">{p.category_name}</span>
                <span className={`badge ${statusColor(p.status)}`}>{p.status}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontWeight:800, fontSize:'1.05rem', color:'var(--ch-amber)' }}>${Number(p.price).toFixed(2)}</span>
                <span className="text-muted text-small">Stock: {p.stock}</span>
              </div>
              <div className="td-actions" style={{ marginTop:12 }}>
                <button className="btn btn-secondary btn-sm" style={{ flex:1 }} onClick={() => openEdit(p)}><Edit2 size={13} /> Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => del(p)}><Trash2 size={13} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state"><div className="empty-state-icon"><Package /></div><h3>No products found</h3><p>Try a different search or category.</p></div>
      )}

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editing ? 'Edit Product' : 'Add New Product'}</span>
              <button className="btn btn-icon btn-secondary btn-sm" onClick={() => setModal(false)}><X size={16} /></button>
            </div>
            <form onSubmit={save}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Product Name *</label>
                    <input className="form-input" required value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-select" required value={form.category_id} onChange={e => setForm(p=>({...p,category_id:e.target.value}))}>
                      <option value="">Select…</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" rows={2} value={form.description || ''} onChange={e => setForm(p=>({...p,description:e.target.value}))} />
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Price ($) *</label>
                    <input className="form-input" type="number" step=".01" min="0" required value={form.price} onChange={e => setForm(p=>({...p,price:e.target.value}))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Stock</label>
                    <input className="form-input" type="number" min="0" value={form.stock} onChange={e => setForm(p=>({...p,stock:e.target.value}))} />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value}))}>
                      <option value="available">Available</option>
                      <option value="unavailable">Unavailable</option>
                      <option value="discontinued">Discontinued</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ justifyContent:'flex-end' }}>
                    <label className="form-label">Size Options</label>
                    <label style={{ display:'flex', alignItems:'center', gap:8, marginTop:8, cursor:'pointer' }}>
                      <input type="checkbox" checked={!!form.has_sizes} onChange={e => setForm(p=>({...p,has_sizes:e.target.checked?1:0}))} />
                      <span style={{ fontSize:'.875rem' }}>Has S / M / L sizes</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-amber" disabled={saving}>{saving ? 'Saving…' : editing ? 'Update Product' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
