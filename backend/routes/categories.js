const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/categories - Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY id');
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// GET /api/categories/:code - Obtener una categoría por código
router.get('/:code', async (req, res) => {
  try {
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE code = ?',
      [req.params.code]
    );

    if (categories.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(categories[0]);
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ error: 'Error al obtener categoría' });
  }
});

// POST /api/categories - Crear nueva categoría
router.post('/', async (req, res) => {
  const { name, code } = req.body;

  if (!name || !code) {
    return res.status(400).json({ error: 'Nombre y código son requeridos' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO categories (name, code) VALUES (?, ?)',
      [name, code]
    );
    res.status(201).json({ id: result.insertId, name, code });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El código de categoría ya existe' });
    }
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

module.exports = router;
