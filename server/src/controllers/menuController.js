import { db } from '../database/db.js'

export const getProducts = async (req, res) => {
  try {
    const { category, search, status, page = 1, limit = 20 } = req.query
    let sql = `SELECT p.*, c.name AS category_name, c.icon AS category_icon
               FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE 1=1`
    const params = []
    if (category) { sql += ' AND c.name=?'; params.push(category) }
    if (status)   { sql += ' AND p.status=?'; params.push(status) }
    if (search)   { sql += ' AND p.name LIKE ?'; params.push(`%${search}%`) }
    sql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit))
    const [rows] = await db.query(sql, params)
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM products')
    res.json({ data: rows, total, page: +page, limit: +limit })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const getCategories = async (_, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY name')
    res.json(rows)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const createProduct = async (req, res) => {
  try {
    const { category_id, name, description, price, has_sizes, stock, status } = req.body
    const image = req.file ? `/uploads/${req.file.filename}` : null
    const [result] = await db.query(
      'INSERT INTO products (category_id,name,description,price,image,has_sizes,stock,status) VALUES (?,?,?,?,?,?,?,?)',
      [category_id, name, description, price, image, has_sizes || 0, stock || 0, status || 'available'])
    const [rows] = await db.query('SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.id=?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { category_id, name, description, price, has_sizes, stock, status } = req.body
    const fields = { category_id, name, description, price, has_sizes, stock, status }
    if (req.file) fields.image = `/uploads/${req.file.filename}`
    const sets = Object.keys(fields).filter(k => fields[k] !== undefined).map(k => `${k}=?`).join(',')
    const vals = Object.keys(fields).filter(k => fields[k] !== undefined).map(k => fields[k])
    await db.query(`UPDATE products SET ${sets} WHERE id=?`, [...vals, id])
    const [rows] = await db.query('SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.id=?', [id])
    res.json(rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const deleteProduct = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id=?', [req.params.id])
    res.json({ message: 'Product deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}
