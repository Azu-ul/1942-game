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

// POST new score - Con lógica para mantener solo el más alto por iniciales
router.post('/', async (req, res) => {
  const { initials, score } = req.body
  if (!initials || score === undefined || score === null) {
    return res.status(400).json({ ok: false, error: 'Faltan datos' })
  }


  try {
    // Primero verificamos si ya existe un record con esas iniciales
    const [existing] = await pool.query(
      'SELECT id, score FROM scores WHERE initials = ?',
      [initials]
    )

    if (existing.length > 0) {
      // Si existe, comparamos los scores
      const currentScore = existing[0].score

      if (score > currentScore) {
        // El nuevo score es más alto, actualizamos
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
        // El score actual es igual o más alto, no hacemos nada
        res.json({
          ok: true,
          kept_existing: true,
          message: `Score existente para ${initials} (${currentScore}) es igual o mayor que el nuevo (${score})`
        })
      }
    } else {
      // No existe, insertamos nuevo record
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
    res.status(500).json({ ok: false, error: 'Error al guardar score' })
  }
})

// DELETE endpoint para limpiar scores (opcional, para testing)
router.delete('/clear', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM scores')
    res.json({
      ok: true,
      message: `${result.affectedRows} records eliminados`
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: 'Error al limpiar scores' })
  }
})

export default router