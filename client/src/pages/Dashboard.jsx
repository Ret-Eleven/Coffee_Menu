import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp, ShoppingCart, Users, Package, Clock } from 'lucide-react'
import api from '../services/api'
import { mockStats } from '../utils/mockData'

const fmt  = n => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits:2 })}`
const statusBadge = s => {
  const m = { completed:'badge-green', preparing:'badge-amber', pending:'badge-yellow', cancelled:'badge-red', ready:'badge-blue' }
  return <span className={`badge ${m[s] || 'badge-gray'}`}>{s}</span>
}

export default function Dashboard() {
  const [data, setData] = useState(mockStats)

  useEffect(() => {
    api.get('/dashboard/summary').then(r => setData(r.data)).catch(() => {})
  }, [])

  const monthLabels = data.monthly?.map(m => m.month?.slice(5)) || []
  const chartData = data.monthly?.map((m, i) => ({ month: monthLabels[i], revenue: +m.revenue, orders: +m.orders })) || []

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening at Coffee Haven today.</p>
        </div>
        <span style={{ fontSize:'.82rem', color:'var(--gray-500)' }}>
          {new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
        </span>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon brown"><span>💰</span></div>
          <div>
            <div className="stat-label">Daily Revenue</div>
            <div className="stat-value">{fmt(data.daily_revenue)}</div>
            <div className="stat-change up">↑ 12.5% vs yesterday</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber"><ShoppingCart size={22} color="var(--ch-amber)" /></div>
          <div>
            <div className="stat-label">Today's Orders</div>
            <div className="stat-value">{data.daily_orders}</div>
            <div className="stat-change up">↑ 8 more than yesterday</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green"><Users size={22} color="var(--success)" /></div>
          <div>
            <div className="stat-label">Total Customers</div>
            <div className="stat-value">{data.total_customers?.toLocaleString()}</div>
            <div className="stat-change up">↑ 23 new this week</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue"><Package size={22} color="var(--info)" /></div>
          <div>
            <div className="stat-label">Active Products</div>
            <div className="stat-value">{data.total_products}</div>
            <div className="stat-change" style={{ color:'var(--gray-400)' }}>across 8 categories</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><Clock size={22} color="var(--danger)" /></div>
          <div>
            <div className="stat-label">Pending Orders</div>
            <div className="stat-value">{data.pending_orders}</div>
            <div className="stat-change down">Needs attention</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple"><TrendingUp size={22} color="#7c3aed" /></div>
          <div>
            <div className="stat-label">Monthly Revenue</div>
            <div className="stat-value">{fmt(data.monthly?.at(-1)?.revenue || 0)}</div>
            <div className="stat-change up">↑ 9.7% vs last month</div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom:24 }}>
        {/* Revenue Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">📈 Revenue — Last 6 Months</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize:12 }} />
                <YAxis tick={{ fontSize:12 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={v => [`$${v.toLocaleString()}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="var(--ch-amber)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🛒 Orders — Last 6 Months</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize:12 }} />
                <YAxis tick={{ fontSize:12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="var(--ch-brown)" strokeWidth={2.5} dot={{ fill:'var(--ch-brown)', r:4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Best Sellers */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">⭐ Best Sellers</span>
            <span className="text-muted text-small">This month</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Product</th><th>Sold</th><th>Revenue</th></tr></thead>
              <tbody>
                {data.best_sellers?.map((p, i) => (
                  <tr key={i}>
                    <td><strong>#{i+1}</strong> {p.name}</td>
                    <td>{p.total_sold}</td>
                    <td>{fmt(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">🧾 Recent Transactions</span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {data.recent_orders?.map(o => (
                  <tr key={o.id}>
                    <td><code style={{ fontSize:'.75rem', color:'var(--ch-brown)' }}>{o.order_number}</code></td>
                    <td>{o.customer_name || 'Walk-in'}</td>
                    <td><strong>{fmt(o.total)}</strong></td>
                    <td>{statusBadge(o.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
