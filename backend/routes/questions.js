const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/questions/level/:levelId - Obtener preguntas de un nivel
router.get('/level/:levelId', async (req, res) => {
  try {
    const [questions] = await db.query(`
      SELECT 
        q.id,
        q.text,
        q.is_true as answer,
        q.image_name as img
      FROM questions q
      WHERE q.level_id = ?
      ORDER BY RAND()
    `, [req.params.levelId]);
    
    // Transformar para incluir ruta completa de imagen si existe
    const transformedQuestions = questions.map(q => ({
      ...q,
      img: q.img ? `/logos/${q.img}` : null,
      answer: Boolean(q.answer)
    }));
    
    res.json(transformedQuestions);
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    res.status(500).json({ error: 'Error al obtener preguntas' });
  }
});

// GET /api/questions/:categoryCode/:levelNumber - Obtener preguntas por categoría y nivel
router.get('/:categoryCode/:levelNumber', async (req, res) => {
  try {
    const [questions] = await db.query(`
      SELECT 
        q.id,
        q.text,
        q.is_true as answer,
        q.image_name as img
      FROM questions q
      JOIN levels l ON q.level_id = l.id
      JOIN categories c ON l.category_id = c.id
      WHERE c.code = ? AND l.level_number = ?
      ORDER BY RAND()
    `, [req.params.categoryCode, req.params.levelNumber]);
    
    // Transformar para incluir ruta completa de imagen si existe
    const transformedQuestions = questions.map(q => ({
      ...q,
      img: q.img ? `/logos/${q.img}` : null,
      answer: Boolean(q.answer)
    }));
    
    res.json(transformedQuestions);
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    res.status(500).json({ error: 'Error al obtener preguntas' });
  }
});

module.exports = router;
