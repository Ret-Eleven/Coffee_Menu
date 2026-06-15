import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../database/db.js'

const sign = (user) => jwt.sign(
  { id: user.id, email: user.email, role: user.role, name: user.name },
  process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
)

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND status = "active"', [email])
    const user = rows[0]
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' })

    const { password: _, ...safe } = user
    res.json({ token: sign(user), user: safe })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'staff', phone, hire_date } = req.body
    const [exists] = await db.query('SELECT id FROM users WHERE email = ?', [email])
    if (exists.length) return res.status(409).json({ message: 'Email already in use' })

    const hashed = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      'INSERT INTO users (name,email,password,role,phone,hire_date) VALUES (?,?,?,?,?,?)',
      [name, email, hashed, role, phone || null, hire_date || null]
    )
    const [rows] = await db.query('SELECT id,name,email,role,phone,status,created_at FROM users WHERE id=?', [result.insertId])
    res.status(201).json({ token: sign(rows[0]), user: rows[0] })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const me = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id,name,email,role,phone,avatar,status,hire_date,created_at FROM users WHERE id=?', [req.user.id])
    if (!rows.length) return res.status(404).json({ message: 'User not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body
    const [rows] = await db.query('SELECT password FROM users WHERE id=?', [req.user.id])
    if (!(await bcrypt.compare(current_password, rows[0].password)))
      return res.status(400).json({ message: 'Current password is incorrect' })

    const hashed = await bcrypt.hash(new_password, 10)
    await db.query('UPDATE users SET password=? WHERE id=?', [hashed, req.user.id])
    res.json({ message: 'Password updated successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
