import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

// GET top 10 scores
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM scores ORDER BY score DESC LIMIT 10')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: 'Error al obtener scores' })
  }
})

// POST new score
router.post('/', async (req, res) => {
  const { initials, score } = req.body
  if (!initials || !score) {
    return res.status(400).json({ ok: false, error: 'Faltan datos' })
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO scores (initials, score) VALUES (?, ?)',
      [initials, score]
    )
    res.json({ ok: true, id: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: 'Error al guardar score' })
  }
})

export default router
