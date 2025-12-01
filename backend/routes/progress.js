const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// GET /api/progress - Obtener progreso del usuario autenticado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [progress] = await db.query(`
      SELECT 
        c.code as category_code,
        c.name as category_name,
        up.current_level,
        up.total_score,
        up.lives
      FROM user_progress up
      JOIN categories c ON up.category_id = c.id
      WHERE up.user_id = ?
    `, [req.user.id]);

    // Transformar a objeto más fácil de usar
    const progressObj = {};
    progress.forEach(p => {
      progressObj[p.category_code] = {
        name: p.category_name,
        level: p.current_level,
        score: p.total_score,
        lives: p.lives
      };
    });

    res.json({ progress: progressObj });
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    res.status(500).json({ error: 'Error al obtener progreso' });
  }
});

// PUT /api/progress/:categoryCode - Actualizar progreso de una categoría
router.put('/:categoryCode', authMiddleware, async (req, res) => {
  const { categoryCode } = req.params;
  const { current_level, total_score, lives } = req.body;

  try {
    // Obtener ID de categoría
    const [categories] = await db.query('SELECT id FROM categories WHERE code = ?', [categoryCode]);
    
    if (categories.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const categoryId = categories[0].id;

    // Actualizar progreso
    await db.query(`
      UPDATE user_progress 
      SET current_level = COALESCE(?, current_level),
          total_score = COALESCE(?, total_score),
          lives = COALESCE(?, lives),
          last_played = NOW()
      WHERE user_id = ? AND category_id = ?
    `, [current_level, total_score, lives, req.user.id, categoryId]);

    // Actualizar total_score global del usuario sumando todos los scores de todas las categorías
    await db.query(`
      UPDATE users 
      SET total_score = (SELECT COALESCE(SUM(total_score), 0) FROM user_progress WHERE user_id = ?)
      WHERE id = ?
    `, [req.user.id, req.user.id]);

    res.json({ message: 'Progreso actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar progreso:', error);
    res.status(500).json({ error: 'Error al actualizar progreso' });
  }
});

// POST /api/progress/:categoryCode/answer - Guardar una respuesta
router.post('/:categoryCode/answer', authMiddleware, async (req, res) => {
  const { categoryCode } = req.params;
  const { question_id, user_answer, is_correct, time_taken } = req.body;

  try {
    await db.query(`
      INSERT INTO user_answers (user_id, question_id, user_answer, is_correct, time_taken)
      VALUES (?, ?, ?, ?, ?)
    `, [req.user.id, question_id, user_answer, is_correct, time_taken || null]);

    res.status(201).json({ message: 'Respuesta guardada' });
  } catch (error) {
    console.error('Error al guardar respuesta:', error);
    res.status(500).json({ error: 'Error al guardar respuesta' });
  }
});

module.exports = router;
