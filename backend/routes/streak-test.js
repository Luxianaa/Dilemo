const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// 🧪 ENDPOINT DE PRUEBA - Establecer racha manualmente
// POST /api/streak/test/set
router.post('/test/set', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_streak, longest_streak, last_played_date } = req.body;

    // Validar inputs
    if (current_streak === undefined) {
      return res.status(400).json({ error: 'current_streak es requerido' });
    }

    const updateStreak = current_streak || 0;
    const updateLongest = longest_streak || current_streak || 0;
    const updateDate = last_played_date || new Date().toISOString().split('T')[0];

    await db.query(
      'UPDATE users SET current_streak = ?, longest_streak = ?, last_played_date = ? WHERE id = ?',
      [updateStreak, updateLongest, updateDate, userId]
    );

    res.json({
      success: true,
      message: '✅ Racha actualizada manualmente',
      data: {
        current_streak: updateStreak,
        longest_streak: updateLongest,
        last_played_date: updateDate
      }
    });
  } catch (error) {
    console.error('Error in test set:', error);
    res.status(500).json({ error: 'Error al establecer racha de prueba' });
  }
});

// 🧪 ENDPOINT DE PRUEBA - Simular día anterior
// POST /api/streak/test/simulate-yesterday
router.post('/test/simulate-yesterday', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Establecer fecha de ayer
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    await db.query(
      'UPDATE users SET last_played_date = ? WHERE id = ?',
      [yesterdayStr, userId]
    );

    res.json({
      success: true,
      message: '✅ Fecha simulada como ayer',
      data: {
        last_played_date: yesterdayStr,
        info: 'Ahora cuando llames a /api/streak/update incrementará la racha'
      }
    });
  } catch (error) {
    console.error('Error in simulate yesterday:', error);
    res.status(500).json({ error: 'Error al simular día anterior' });
  }
});

// 🧪 ENDPOINT DE PRUEBA - Reset completo
// POST /api/streak/test/reset
router.post('/test/reset', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    await db.query(
      'UPDATE users SET current_streak = 0, longest_streak = 0, last_played_date = NULL WHERE id = ?',
      [userId]
    );

    res.json({
      success: true,
      message: '✅ Racha reseteada completamente',
      data: {
        current_streak: 0,
        longest_streak: 0,
        last_played_date: null
      }
    });
  } catch (error) {
    console.error('Error in test reset:', error);
    res.status(500).json({ error: 'Error al resetear racha' });
  }
});

// 🧪 ENDPOINT DE PRUEBA - Ver estado actual
// GET /api/streak/test/status
router.get('/test/status', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await db.query(
      'SELECT current_streak, longest_streak, last_played_date, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];
    const today = new Date().toISOString().split('T')[0];
    
    res.json({
      success: true,
      message: '📊 Estado actual de racha',
      data: {
        current_streak: user.current_streak || 0,
        longest_streak: user.longest_streak || 0,
        last_played_date: user.last_played_date,
        today: today,
        days_since_last_play: user.last_played_date 
          ? Math.floor((new Date(today) - new Date(user.last_played_date)) / (1000 * 60 * 60 * 24))
          : null
      }
    });
  } catch (error) {
    console.error('Error in test status:', error);
    res.status(500).json({ error: 'Error al obtener estado' });
  }
});

module.exports = router;
