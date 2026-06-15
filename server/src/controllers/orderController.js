import { db } from '../database/db.js'

const generateOrderNumber = () => `ORD-${Date.now().toString(36).toUpperCase()}`

export const getOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query
    let sql = `SELECT o.*, c.name AS customer_name, u.name AS served_by_name
               FROM orders o
               LEFT JOIN customers c ON c.id=o.customer_id
               LEFT JOIN users u     ON u.id=o.served_by
               WHERE 1=1`
    const params = []
    if (status) { sql += ' AND o.status=?'; params.push(status) }
    if (search) { sql += ' AND (o.order_number LIKE ? OR c.name LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }
    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit))
    const [rows] = await db.query(sql, params)
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM orders')
    res.json({ data: rows, total, page: +page, limit: +limit })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const getOrder = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.*, c.name AS customer_name, u.name AS served_by_name
       FROM orders o LEFT JOIN customers c ON c.id=o.customer_id LEFT JOIN users u ON u.id=o.served_by
       WHERE o.id=?`, [req.params.id])
    if (!orders.length) return res.status(404).json({ message: 'Order not found' })
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id=?', [req.params.id])
    res.json({ ...orders[0], items })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const createOrder = async (req, res) => {
  const conn = await db.getConnection()
  try {
    await conn.beginTransaction()
    const { customer_id, items, payment_method, discount = 0, notes } = req.body
    const subtotal = items.reduce((s, i) => s + i.unit_price * i.quantity, 0)
    const tax  = subtotal * 0.08
    const total = subtotal + tax - discount
    const order_number = generateOrderNumber()

    const [result] = await conn.query(
      'INSERT INTO orders (customer_id,order_number,payment_method,subtotal,tax,discount,total,notes,served_by) VALUES (?,?,?,?,?,?,?,?,?)',
      [customer_id || null, order_number, payment_method, subtotal, tax, discount, total, notes, req.user.id])

    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id,product_id,product_name,size,quantity,unit_price,subtotal) VALUES (?,?,?,?,?,?,?)',
        [result.insertId, item.product_id, item.product_name, item.size || null, item.quantity, item.unit_price, item.unit_price * item.quantity])
    }
    await conn.commit()
    const [order] = await conn.query('SELECT * FROM orders WHERE id=?', [result.insertId])
    res.status(201).json(order[0])
  } catch (err) {
    await conn.rollback()
    res.status(500).json({ message: err.message })
  } finally { conn.release() }
}

export const updateOrderStatus = async (req, res) => {
  try {
    await db.query('UPDATE orders SET status=? WHERE id=?', [req.body.status, req.params.id])
    const [rows] = await db.query('SELECT * FROM orders WHERE id=?', [req.params.id])
    res.json(rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}
