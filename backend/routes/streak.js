const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// POST /api/streak/update - Actualizar racha diaria del usuario
router.post('/update', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Obtener datos actuales del usuario
    const [users] = await db.query(
      'SELECT current_streak, longest_streak, last_played_date, play_history FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];
    let newStreak = user.current_streak || 0;
    let longestStreak = user.longest_streak || 0;
    const lastPlayed = user.last_played_date;

    // Manejar historial de juegos (JSON)
    let playHistory = [];
    try {
      if (user.play_history) {
        playHistory = typeof user.play_history === 'string'
          ? JSON.parse(user.play_history)
          : user.play_history;
      }
    } catch (e) {
      console.error('Error parsing play_history:', e);
      playHistory = [];
    }

    // Si es el mismo día, verificar si está en el historial
    if (lastPlayed === today) {
      // Si hoy no está en el historial (caso de migración o error), agregarlo
      if (!playHistory.includes(today)) {
        playHistory.push(today);

        // Actualizar solo el historial en la BD
        await db.query(
          'UPDATE users SET play_history = ? WHERE id = ?',
          [JSON.stringify(playHistory), userId]
        );
      }

      return res.json({
        message: 'Racha ya actualizada hoy',
        current_streak: newStreak,
        longest_streak: longestStreak,
        last_played_date: today,
        play_history: playHistory
      });
    }

    // Obtener fecha de ayer
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Calcular nueva racha
    if (!lastPlayed) {
      // Primera vez jugando
      newStreak = 1;
    } else if (lastPlayed === yesterdayStr) {
      // Jugó ayer, continúa la racha
      newStreak += 1;
    } else {
      // No jugó ayer, se rompe la racha
      newStreak = 1;
    }

    // Actualizar racha más larga si es necesario
    if (newStreak > longestStreak) {
      longestStreak = newStreak;
    }

    // Agregar hoy al historial
    if (!playHistory.includes(today)) {
      playHistory.push(today);
    }

    // Limitar historial a los últimos 365 días para no saturar la BD innecesariamente
    if (playHistory.length > 365) {
      playHistory = playHistory.slice(-365);
    }

    // Actualizar en la base de datos
    await db.query(
      'UPDATE users SET current_streak = ?, longest_streak = ?, last_played_date = ?, play_history = ? WHERE id = ?',
      [newStreak, longestStreak, today, JSON.stringify(playHistory), userId]
    );

    res.json({
      message: 'Racha actualizada exitosamente',
      current_streak: newStreak,
      longest_streak: longestStreak,
      last_played_date: today,
      play_history: playHistory,
      streak_maintained: lastPlayed === yesterdayStr,
      streak_broken: lastPlayed && lastPlayed !== yesterdayStr && lastPlayed !== today
    });
  } catch (error) {
    console.error('Error updating streak:', error);
    res.status(500).json({ error: 'Error al actualizar racha' });
  }
});

// GET /api/streak - Obtener información de racha del usuario
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [users] = await db.query(
      'SELECT current_streak, longest_streak, last_played_date, play_history FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = users[0];
    const today = new Date().toISOString().split('T')[0];

    // Verificar si la racha está activa hoy
    const isActiveToday = user.last_played_date === today;

    let playHistory = [];
    try {
      if (user.play_history) {
        playHistory = typeof user.play_history === 'string'
          ? JSON.parse(user.play_history)
          : user.play_history;
      }
    } catch (e) {
      console.error('Error parsing play_history:', e);
    }

    res.json({
      current_streak: user.current_streak || 0,
      longest_streak: user.longest_streak || 0,
      last_played_date: user.last_played_date,
      play_history: playHistory,
      is_active_today: isActiveToday
    });
  } catch (error) {
    console.error('Error getting streak:', error);
    res.status(500).json({ error: 'Error al obtener racha' });
  }
});

module.exports = router;
