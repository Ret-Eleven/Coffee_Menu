import { db } from '../database/db.js'

export const getInventory = async (req, res) => {
  try {
    const { category, low_stock, search } = req.query
    let sql = 'SELECT * FROM inventory WHERE 1=1'
    const params = []
    if (category)  { sql += ' AND category=?'; params.push(category) }
    if (low_stock) { sql += ' AND quantity <= min_quantity' }
    if (search)    { sql += ' AND (name LIKE ? OR supplier LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }
    sql += ' ORDER BY name'
    const [rows] = await db.query(sql, params)
    const lowCount = rows.filter(r => r.quantity <= r.min_quantity).length
    res.json({ data: rows, low_stock_count: lowCount })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const createInventoryItem = async (req, res) => {
  try {
    const { name, category, unit, quantity, min_quantity, cost_per_unit, supplier, supplier_contact } = req.body
    const [result] = await db.query(
      'INSERT INTO inventory (name,category,unit,quantity,min_quantity,cost_per_unit,supplier,supplier_contact) VALUES (?,?,?,?,?,?,?,?)',
      [name, category, unit, quantity, min_quantity, cost_per_unit, supplier, supplier_contact])
    const [rows] = await db.query('SELECT * FROM inventory WHERE id=?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const updateInventoryItem = async (req, res) => {
  try {
    const { name, category, unit, quantity, min_quantity, cost_per_unit, supplier, supplier_contact } = req.body
    await db.query(
      'UPDATE inventory SET name=?,category=?,unit=?,quantity=?,min_quantity=?,cost_per_unit=?,supplier=?,supplier_contact=? WHERE id=?',
      [name, category, unit, quantity, min_quantity, cost_per_unit, supplier, supplier_contact, req.params.id])
    const [rows] = await db.query('SELECT * FROM inventory WHERE id=?', [req.params.id])
    res.json(rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const deleteInventoryItem = async (req, res) => {
  try {
    await db.query('DELETE FROM inventory WHERE id=?', [req.params.id])
    res.json({ message: 'Item deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}
