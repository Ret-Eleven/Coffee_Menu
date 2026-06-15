import { db } from '../database/db.js'

export const getCustomers = async (req, res) => {
  try {
    const { search, membership, page = 1, limit = 20 } = req.query
    let sql = 'SELECT * FROM customers WHERE 1=1'
    const params = []
    if (search)     { sql += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)'; params.push(...Array(3).fill(`%${search}%`)) }
    if (membership) { sql += ' AND membership=?'; params.push(membership) }
    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit))
    const [rows] = await db.query(sql, params)
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM customers')
    res.json({ data: rows, total, page: +page, limit: +limit })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const getCustomer = async (req, res) => {
  try {
    const [customers] = await db.query('SELECT * FROM customers WHERE id=?', [req.params.id])
    if (!customers.length) return res.status(404).json({ message: 'Customer not found' })
    const [orders] = await db.query(
      'SELECT id,order_number,total,status,created_at FROM orders WHERE customer_id=? ORDER BY created_at DESC LIMIT 10', [req.params.id])
    res.json({ ...customers[0], recent_orders: orders })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body
    const [result] = await db.query('INSERT INTO customers (name,email,phone,address) VALUES (?,?,?,?)', [name, email || null, phone || null, address || null])
    const [rows] = await db.query('SELECT * FROM customers WHERE id=?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, membership } = req.body
    await db.query('UPDATE customers SET name=?,email=?,phone=?,address=?,membership=? WHERE id=?',
      [name, email, phone, address, membership, req.params.id])
    const [rows] = await db.query('SELECT * FROM customers WHERE id=?', [req.params.id])
    res.json(rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const deleteCustomer = async (req, res) => {
  try {
    await db.query('DELETE FROM customers WHERE id=?', [req.params.id])
    res.json({ message: 'Customer deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}
