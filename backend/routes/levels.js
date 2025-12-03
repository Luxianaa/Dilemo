const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/levels/:categoryCode - Obtener niveles de una categoría
router.get('/:categoryCode', async (req, res) => {
  try {
    const [levels] = await db.query(`
      SELECT l.* 
      FROM levels l
      JOIN categories c ON l.category_id = c.id
      WHERE c.code = ?
      ORDER BY l.level_number
    `, [req.params.categoryCode]);

    res.json(levels);
  } catch (error) {
    console.error('Error al obtener niveles:', error);
    res.status(500).json({ error: 'Error al obtener niveles' });
  }
});

// GET /api/levels/:categoryCode/:levelNumber - Obtener un nivel específico
router.get('/:categoryCode/:levelNumber', async (req, res) => {
  try {
    const [levels] = await db.query(`
      SELECT l.* 
      FROM levels l
      JOIN categories c ON l.category_id = c.id
      WHERE c.code = ? AND l.level_number = ?
    `, [req.params.categoryCode, req.params.levelNumber]);

    if (levels.length === 0) {
      return res.status(404).json({ error: 'Nivel no encontrado' });
    }

    res.json(levels[0]);
  } catch (error) {
    console.error('Error al obtener nivel:', error);
    res.status(500).json({ error: 'Error al obtener nivel' });
  }
});

// POST /api/levels - Crear nuevo nivel
router.post('/', async (req, res) => {
  const { categoryId, levelNumber } = req.body;

  if (!categoryId || !levelNumber) {
    return res.status(400).json({ error: 'Categoría y número de nivel son requeridos' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO levels (category_id, level_number) VALUES (?, ?)',
      [categoryId, levelNumber]
    );
    res.status(201).json({ id: result.insertId, categoryId, levelNumber });
  } catch (error) {
    console.error('Error al crear nivel:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Este nivel ya existe para esta categoría' });
    }
    res.status(500).json({ error: 'Error al crear nivel' });
  }
});

module.exports = router;
