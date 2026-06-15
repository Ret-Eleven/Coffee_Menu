import { useState, useEffect } from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Download } from 'lucide-react'
import api from '../services/api'
import { mockStats } from '../utils/mockData'

const COLORS = ['#C8832A','#4A2C2A','#8B5E3C','#E8A84A','#2D7A4A','#7B3FA0','#2563eb','#dc2626']

export default function Reports() {
  const [period, setPeriod]     = useState('month')
  const [salesData, setSalesData] = useState(mockStats.monthly?.map(m => ({ period:m.month?.slice(5), revenue:+m.revenue, orders:+m.orders })))
  const [productData, setProductData] = useState(mockStats.best_sellers || [])
  const [tab, setTab] = useState('sales')

  useEffect(() => {
    api.get(`/reports/sales?group=${period}`).then(r => {
      const d = r.data.sales?.map(s => ({ period:s.period, revenue:+s.revenue, orders:+s.orders }))
      if (d) setSalesData(d)
    }).catch(() => {})
    api.get('/reports/products').then(r => {
      if (r.data.length) setProductData(r.data)
    }).catch(() => {})
  }, [period])

  const totalRevenue = salesData?.reduce((s,d) => s+d.revenue,0) || 0
  const totalOrders  = salesData?.reduce((s,d) => s+d.orders,0) || 0
  const avgOrder     = totalOrders ? (totalRevenue / totalOrders) : 0

  const pieData = productData.slice(0,6).map(p => ({ name:p.name?.split(' ').slice(-1)[0], value:+(p.qty_sold||p.total_sold||0) }))

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Insights to help you grow Coffee Haven</p>
        </div>
        <button className="btn btn-secondary" onClick={() => window.print()}><Download size={15} /> Export</button>
      </div>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ marginBottom:24 }}>
        <div className="stat-card"><div className="stat-icon brown"><span>💰</span></div><div><div className="stat-label">Period Revenue</div><div className="stat-value">${totalRevenue.toLocaleString('en-US',{minimumFractionDigits:2})}</div></div></div>
        <div className="stat-card"><div className="stat-icon amber"><span>🛒</span></div><div><div className="stat-label">Total Orders</div><div className="stat-value">{totalOrders.toLocaleString()}</div></div></div>
        <div className="stat-card"><div className="stat-icon green"><span>💵</span></div><div><div className="stat-label">Avg Order Value</div><div className="stat-value">${avgOrder.toFixed(2)}</div></div></div>
        <div className="stat-card"><div className="stat-icon blue"><span>⭐</span></div><div><div className="stat-label">Top Product</div><div className="stat-value" style={{ fontSize:'1rem' }}>{productData[0]?.name?.split(' ')[0] || '—'}</div></div></div>
      </div>

      {/* Tabs & Period */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, flexWrap:'wrap', gap:10 }}>
        <div className="filter-tabs">
          {['sales','products'].map(t => (
            <button key={t} className={`filter-tab${tab===t?' active':''}`} onClick={() => setTab(t)} style={{ textTransform:'capitalize' }}>{t}</button>
          ))}
        </div>
        {tab === 'sales' && (
          <div className="filter-tabs">
            {['day','week','month'].map(p => (
              <button key={p} className={`filter-tab${period===p?' active':''}`} onClick={() => setPeriod(p)} style={{ textTransform:'capitalize' }}>{p}ly</button>
            ))}
          </div>
        )}
      </div>

      {tab === 'sales' && (
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div className="card">
            <div className="card-header"><span className="card-title">📈 Revenue Trend</span></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" tick={{ fontSize:11 }} />
                  <YAxis tick={{ fontSize:11 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v,n) => [`$${v.toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="var(--ch-amber)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">🛒 Order Volume</span></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="period" tick={{ fontSize:11 }} />
                  <YAxis tick={{ fontSize:11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="var(--ch-brown)" strokeWidth={2.5} dot={{ r:4, fill:'var(--ch-brown)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {tab === 'products' && (
        <div className="grid-2">
          <div className="card">
            <div className="card-header"><span className="card-title">🏆 Top Products by Sales</span></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`}>
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><span className="card-title">📊 Product Performance</span></div>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>#</th><th>Product</th><th>Qty Sold</th><th>Revenue</th></tr></thead>
                <tbody>
                  {productData.slice(0,10).map((p,i) => (
                    <tr key={i}>
                      <td style={{ color:'var(--gray-400)', fontWeight:600 }}>#{i+1}</td>
                      <td><strong>{p.name}</strong>{p.category&&<span className="badge badge-brown" style={{marginLeft:6}}>{p.category}</span>}</td>
                      <td>{(p.qty_sold||p.total_sold||0).toLocaleString()}</td>
                      <td>${Number(p.revenue||0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
