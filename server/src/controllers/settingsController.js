import { db } from '../database/db.js'

export const getSettings = async (_, res) => {
  try {
    const [rows] = await db.query('SELECT `key`, value, type FROM settings')
    const settings = Object.fromEntries(rows.map(r => [r.key, r.type === 'number' ? +r.value : r.value]))
    res.json(settings)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const updateSettings = async (req, res) => {
  try {
    const entries = Object.entries(req.body)
    for (const [key, value] of entries) {
      await db.query('INSERT INTO settings (`key`,value) VALUES (?,?) ON DUPLICATE KEY UPDATE value=?', [key, value, value])
    }
    const [rows] = await db.query('SELECT `key`,value,type FROM settings')
    const settings = Object.fromEntries(rows.map(r => [r.key, r.type === 'number' ? +r.value : r.value]))
    res.json(settings)
  } catch (err) { res.status(500).json({ message: err.message }) }
}
