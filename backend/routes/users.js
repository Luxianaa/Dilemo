const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// POST /api/users/coins - Agregar monedas al usuario
router.post('/coins', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount < 0) {
      return res.status(400).json({ error: 'Cantidad inválida' });
    }

    // Actualizar coins en la BD
    await db.query(
      'UPDATE users SET coins = coins + ? WHERE id = ?',
      [amount, userId]
    );

    // Obtener el nuevo total
    const [rows] = await db.query(
      'SELECT coins FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      message: 'Monedas agregadas exitosamente',
      coins: rows[0].coins
    });
  } catch (error) {
    console.error('Error adding coins:', error);
    res.status(500).json({ error: 'Error al agregar monedas' });
  }
});

module.exports = router;
