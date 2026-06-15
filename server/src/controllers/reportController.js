import { db } from '../database/db.js'

export const getSalesReport = async (req, res) => {
  try {
    const { from, to, group = 'day' } = req.query
    const start = from || new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)
    const end   = to   || new Date().toISOString().slice(0, 10)
    const fmt = group === 'month' ? '%Y-%m' : group === 'week' ? '%x-W%v' : '%Y-%m-%d'
    const [sales] = await db.query(
      `SELECT DATE_FORMAT(created_at,'${fmt}') AS period, COUNT(*) AS orders, SUM(total) AS revenue
       FROM orders WHERE status='completed' AND DATE(created_at) BETWEEN ? AND ?
       GROUP BY period ORDER BY period`, [start, end])
    res.json({ sales, from: start, to: end })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const getProductReport = async (req, res) => {
  try {
    const { from, to } = req.query
    const start = from || new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)
    const end   = to   || new Date().toISOString().slice(0, 10)
    const [products] = await db.query(
      `SELECT p.name, c.name AS category, SUM(oi.quantity) AS qty_sold, SUM(oi.subtotal) AS revenue
       FROM order_items oi
       JOIN orders o   ON o.id=oi.order_id AND o.status='completed' AND DATE(o.created_at) BETWEEN ? AND ?
       JOIN products p ON p.id=oi.product_id
       LEFT JOIN categories c ON c.id=p.category_id
       GROUP BY p.id ORDER BY qty_sold DESC`, [start, end])
    res.json(products)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const getCustomerReport = async (req, res) => {
  try {
    const [top] = await db.query(
      `SELECT c.name, c.email, c.membership, c.loyalty_points, COUNT(o.id) AS orders, SUM(o.total) AS total_spent
       FROM customers c LEFT JOIN orders o ON o.customer_id=c.id AND o.status='completed'
       GROUP BY c.id ORDER BY total_spent DESC LIMIT 20`)
    res.json(top)
  } catch (err) { res.status(500).json({ message: err.message }) }
}
