import { db } from '../database/db.js'

export const getSummary = async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10)

    const [[{ daily_revenue }]] = await db.query(
      `SELECT COALESCE(SUM(total),0) AS daily_revenue FROM orders WHERE DATE(created_at)=? AND status='completed'`, [today])

    const [[{ daily_orders }]] = await db.query(
      `SELECT COUNT(*) AS daily_orders FROM orders WHERE DATE(created_at)=?`, [today])

    const [[{ total_customers }]] = await db.query(`SELECT COUNT(*) AS total_customers FROM customers`)
    const [[{ total_products }]] = await db.query(`SELECT COUNT(*) AS total_products FROM products WHERE status='available'`)
    const [[{ pending_orders }]] = await db.query(`SELECT COUNT(*) AS pending_orders FROM orders WHERE status='pending'`)

    const [monthly] = await db.query(`
      SELECT DATE_FORMAT(created_at,'%Y-%m') AS month, SUM(total) AS revenue, COUNT(*) AS orders
      FROM orders WHERE status='completed' AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY month ORDER BY month`)

    const [best_sellers] = await db.query(`
      SELECT p.name, SUM(oi.quantity) AS total_sold, SUM(oi.subtotal) AS revenue
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      JOIN orders o   ON o.id = oi.order_id AND o.status='completed'
      WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY p.id ORDER BY total_sold DESC LIMIT 5`)

    const [recent_orders] = await db.query(`
      SELECT o.id, o.order_number, o.total, o.status, o.created_at,
             c.name AS customer_name
      FROM orders o LEFT JOIN customers c ON c.id=o.customer_id
      ORDER BY o.created_at DESC LIMIT 10`)

    res.json({ daily_revenue, daily_orders, total_customers, total_products, pending_orders, monthly, best_sellers, recent_orders })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
