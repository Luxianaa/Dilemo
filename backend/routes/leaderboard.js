const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// GET /api/leaderboard/global - Top 10 jugadores globales
router.get('/global', async (req, res) => {
  try {
    const [rankings] = await db.query(`
      SELECT 
        u.id,
        u.username,
        u.display_name,
        u.total_score as score,
        u.created_at
      FROM users u
      ORDER BY u.total_score DESC
      LIMIT 10
    `);
    
    // Agregar rank
    const rankingsWithRank = rankings.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    res.json({ rankings: rankingsWithRank });
  } catch (error) {
    console.error('Error al obtener leaderboard global:', error);
    res.status(500).json({ error: 'Error al obtener rankings' });
  }
});

// GET /api/leaderboard/:categoryCode - Top 10 de una categoría
router.get('/:categoryCode', async (req, res) => {
  try {
    const { categoryCode } = req.params;
    
    // Obtener ID de categoría
    const [categories] = await db.query(
      'SELECT id FROM categories WHERE code = ?',
      [categoryCode]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const categoryId = categories[0].id;

    const [rankings] = await db.query(`
      SELECT 
        u.id,
        u.username,
        u.display_name,
        up.total_score as score,
        up.current_level as level
      FROM user_progress up
      JOIN users u ON up.user_id = u.id
      WHERE up.category_id = ?
      ORDER BY up.total_score DESC, up.current_level DESC
      LIMIT 10
    `, [categoryId]);
    
    // Agregar rank
    const rankingsWithRank = rankings.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));

    res.json({ rankings: rankingsWithRank });
  } catch (error) {
    console.error('Error al obtener leaderboard:', error);
    res.status(500).json({ error: 'Error al obtener rankings' });
  }
});

// GET /api/leaderboard/user/:userId - Posición de un usuario específico
router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Obtener posición global
    const [globalRank] = await db.query(`
      SELECT COUNT(*) + 1 as rank
      FROM users
      WHERE total_score > (SELECT total_score FROM users WHERE id = ?)
    `, [userId]);

    // Obtener puntaje del usuario
    const [userData] = await db.query(
      'SELECT username, display_name, total_score FROM users WHERE id = ?',
      [userId]
    );

    res.json({ 
      rank: globalRank[0].rank,
      ...userData[0]
    });
  } catch (error) {
    console.error('Error al obtener posición de usuario:', error);
    res.status(500).json({ error: 'Error al obtener posición' });
  }
});

// POST /api/leaderboard/update - Actualizar puntaje (protegido)
router.post('/update', authMiddleware, async (req, res) => {
  try {
    const { categoryCode, scoreToAdd } = req.body;

    if (!categoryCode || scoreToAdd === undefined) {
      return res.status(400).json({ error: 'Faltan parámetros' });
    }

    // Obtener ID de categoría
    const [categories] = await db.query(
      'SELECT id FROM categories WHERE code = ?',
      [categoryCode]
    );

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const categoryId = categories[0].id;

    // Actualizar progreso de categoría
    await db.query(`
      UPDATE user_progress
      SET total_score = total_score + ?
      WHERE user_id = ? AND category_id = ?
    `, [scoreToAdd, req.user.id, categoryId]);

    // Actualizar puntaje global del usuario
    await db.query(`
      UPDATE users
      SET total_score = total_score + ?
      WHERE id = ?
    `, [scoreToAdd, req.user.id]);

    res.json({ 
      message: 'Puntaje actualizado exitosamente',
      scoreAdded: scoreToAdd
    });
  } catch (error) {
    console.error('Error al actualizar puntaje:', error);
    res.status(500).json({ error: 'Error al actualizar puntaje' });
  }
});

module.exports = router;
