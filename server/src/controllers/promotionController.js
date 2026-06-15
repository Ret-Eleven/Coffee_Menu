import { db } from '../database/db.js'

export const getPromotions = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM promotions ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const createPromotion = async (req, res) => {
  try {
    const { title, description, type, value, code, min_order, max_uses, start_date, end_date } = req.body
    const [result] = await db.query(
      'INSERT INTO promotions (title,description,type,value,code,min_order,max_uses,start_date,end_date) VALUES (?,?,?,?,?,?,?,?,?)',
      [title, description, type, value, code || null, min_order || 0, max_uses || null, start_date, end_date])
    const [rows] = await db.query('SELECT * FROM promotions WHERE id=?', [result.insertId])
    res.status(201).json(rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const updatePromotion = async (req, res) => {
  try {
    const { title, description, type, value, code, min_order, max_uses, start_date, end_date, status } = req.body
    await db.query(
      'UPDATE promotions SET title=?,description=?,type=?,value=?,code=?,min_order=?,max_uses=?,start_date=?,end_date=?,status=? WHERE id=?',
      [title, description, type, value, code, min_order, max_uses, start_date, end_date, status, req.params.id])
    const [rows] = await db.query('SELECT * FROM promotions WHERE id=?', [req.params.id])
    res.json(rows[0])
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const deletePromotion = async (req, res) => {
  try {
    await db.query('DELETE FROM promotions WHERE id=?', [req.params.id])
    res.json({ message: 'Promotion deleted' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const validateCoupon = async (req, res) => {
  try {
    const { code, order_total } = req.body
    const [rows] = await db.query(
      `SELECT * FROM promotions WHERE code=? AND status='active' AND (start_date IS NULL OR start_date<=CURDATE()) AND (end_date IS NULL OR end_date>=CURDATE())`, [code])
    if (!rows.length) return res.status(404).json({ message: 'Invalid or expired coupon' })
    const promo = rows[0]
    if (promo.min_order && order_total < promo.min_order)
      return res.status(400).json({ message: `Minimum order $${promo.min_order} required` })
    if (promo.max_uses && promo.used_count >= promo.max_uses)
      return res.status(400).json({ message: 'Coupon usage limit reached' })
    const discount = promo.type === 'percentage' ? (order_total * promo.value) / 100 : promo.value
    res.json({ valid: true, promo, discount })
  } catch (err) { res.status(500).json({ message: err.message }) }
}
