import bcrypt from 'bcryptjs'
import { db } from '../database/db.js'

export const getEmployees = async (req, res) => {
  try {
    const { role, status, search } = req.query
    let sql = 'SELECT id,name,email,role,phone,avatar,status,hire_date,created_at FROM users WHERE 1=1'
    const params = []
    if (role)   { sql += ' AND role=?';   params.push(role) }
    if (status) { sql += ' AND status=?'; params.push(status) }
    if (search) { sql += ' AND (name LIKE ? OR email LIKE ?)'; params.push(`%${search}%`, `%${search}%`) }
    sql += ' ORDER BY name'
    const [rows] = await db.query(sql, params)
    res.json(rows)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, role, phone, hire_date } = req.body
    const hashed = await bcrypt.hash(password, 10)
    const avatar = req.file ? `/uploads/${req.file.filename}` : null
    const [result] = await db.query(
      'INSERT INTO users (name,email,password,role,phone,avatar,hire_date) VALUES (?,?,?,?,?,?,?)',
      [name, email, hashed, role || 'staff', phone || null, avatar, hire_date || null])
    const [rows] = await db.query('SELECT id,name,email,role,phone,avatar,status,hire_date FROM users WHERE id=?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const updateEmployee = async (req, res) => {
  try {
    const { name, email, role, phone, status, hire_date } = req.body
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined
    const sql = avatar
      ? 'UPDATE users SET name=?,email=?,role=?,phone=?,status=?,hire_date=?,avatar=? WHERE id=?'
      : 'UPDATE users SET name=?,email=?,role=?,phone=?,status=?,hire_date=? WHERE id=?'
    const params = avatar
      ? [name, email, role, phone, status, hire_date, avatar, req.params.id]
      : [name, email, role, phone, status, hire_date, req.params.id]
    await db.query(sql, params)
    const [rows] = await db.query('SELECT id,name,email,role,phone,avatar,status,hire_date FROM users WHERE id=?', [req.params.id])
    res.json(rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const deleteEmployee = async (req, res) => {
  try {
    if (req.params.id == req.user.id) return res.status(400).json({ message: 'Cannot delete yourself' })
    await db.query('DELETE FROM users WHERE id=?', [req.params.id])
    res.json({ message: 'Employee deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}
