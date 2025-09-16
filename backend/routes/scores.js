import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

// ======================
// INDIVIDUAL SCORES
// ======================

// GET top 10 individual scores
router.get('/scores', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM scores ORDER BY score DESC LIMIT 10')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: 'Error al obtener scores individuales' })
  }
})

// POST new individual score - Con lógica para mantener solo el más alto por iniciales
router.post('/scores', async (req, res) => {
  const { initials, score } = req.body
  if (!initials || score === undefined || score === null) {
    return res.status(400).json({ ok: false, error: 'Faltan datos' })
  }

  try {
    const [existing] = await pool.query(
      'SELECT id, score FROM scores WHERE initials = ?',
      [initials]
    )

    if (existing.length > 0) {
      const currentScore = existing[0].score
      if (score > currentScore) {
        const [result] = await pool.query(
          'UPDATE scores SET score = ?, created_at = CURRENT_TIMESTAMP WHERE initials = ?',
          [score, initials]
        )
        res.json({
          ok: true,
          id: existing[0].id,
          updated: true,
          message: `Score actualizado para ${initials}: ${currentScore} → ${score}`
        })
      } else {
        res.json({
          ok: true,
          kept_existing: true,
          message: `Score existente para ${initials} (${currentScore}) es igual o mayor que el nuevo (${score})`
        })
      }
    } else {
      const [result] = await pool.query(
        'INSERT INTO scores (initials, score) VALUES (?, ?)',
        [initials, score]
      )
      res.json({
        ok: true,
        id: result.insertId,
        inserted: true,
        message: `Nuevo score guardado para ${initials}: ${score}`
      })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: 'Error al guardar score individual' })
  }
})

// ======================
// COUPLES SCORES
// ======================

// GET top 10 couples scores
router.get('/couples', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM couples_scores ORDER BY total_score DESC LIMIT 10')
    res.json(rows)
  } catch (err) {
    console.error(err)
    // Devolvemos array vacío si hay error, como sugiere el cliente
    res.json([])
  }
})

// POST new couples score
router.post('/couples', async (req, res) => {
  const { player1_initials, player1_score, player2_initials, player2_score, total_score } = req.body

  if (!player1_initials || player1_score === undefined || !player2_initials || player2_score === undefined || total_score === undefined) {
    return res.status(400).json({ ok: false, error: 'Faltan datos para la pareja' })
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO couples_scores 
       (player1_initials, player1_score, player2_initials, player2_score, total_score) 
       VALUES (?, ?, ?, ?, ?)`,
      [player1_initials, player1_score, player2_initials, player2_score, total_score]
    )

    res.json({
      ok: true,
      id: result.insertId,
      inserted: true,
      message: `Nuevo score de pareja guardado: ${player1_initials}(${player1_score}) + ${player2_initials}(${player2_score}) = ${total_score}`
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: 'Error al guardar score de pareja' })
  }
})

export default router