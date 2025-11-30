const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// POST /api/users/coins - Agregar monedas al usuario
router.post('/coins', authMiddleware, async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: 'Cantidad inválida' });
    }

    try {
        // Actualizar monedas
        await db.query(
            'UPDATE users SET coins = coins + ? WHERE id = ?',
            [amount, userId]
        );

        // Obtener monedas actualizadas
        const [user] = await db.query('SELECT coins FROM users WHERE id = ?', [userId]);

        res.json({ coins: user[0].coins });
    } catch (error) {
        console.error('Error al agregar monedas:', error);
        res.status(500).json({ error: 'Error al actualizar monedas' });
    }
});

module.exports = router;
