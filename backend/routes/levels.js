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

module.exports = router;
