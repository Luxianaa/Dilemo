const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar multer para subida de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../src/assets/logos');
    // Crear directorio si no existe
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generar nombre único: timestamp-originalname
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Aceptar solo imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// POST /api/admin/categories - Crear nueva categoría
// NOTA: Agregar authMiddleware en producción para seguridad
router.post('/categories', async (req, res) => {
  try {
    const { name, code, description, color } = req.body;

    if (!name || !code) {
      return res.status(400).json({ error: 'Nombre y código son requeridos' });
    }

    // Verificar si ya existe
    const [existing] = await db.query('SELECT id FROM categories WHERE code = ?', [code]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'La categoría ya existe' });
    }

    // Crear categoría
    const [result] = await db.query(
      'INSERT INTO categories (name, code, description, color) VALUES (?, ?, ?, ?)',
      [name, code, description, color]
    );

    res.json({
      message: 'Categoría creada exitosamente',
      categoryId: result.insertId
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// POST /api/admin/levels - Crear nuevo nivel
// NOTA: Agregar authMiddleware en producción para seguridad
router.post('/levels', async (req, res) => {
  try {
    const { categoryCode, levelNumber, name } = req.body;

    console.log('📥 Received level data:', { categoryCode, levelNumber, name });

    if (!categoryCode || levelNumber === undefined || levelNumber === null || !name) {
      console.error('❌ Validation failed:', { categoryCode, levelNumber, name });
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Obtener category_id desde el código
    const [category] = await db.query('SELECT id FROM categories WHERE code = ?', [categoryCode]);
    
    if (category.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const [result] = await db.query(
      'INSERT INTO levels (category_id, level_number, name) VALUES (?, ?, ?)',
      [category[0].id, levelNumber, name]
    );

    console.log('✅ Level created successfully:', result.insertId);

    res.json({
      message: 'Nivel creado exitosamente',
      levelId: result.insertId
    });
  } catch (error) {
    console.error('Error creating level:', error);
    res.status(500).json({ error: 'Error al crear nivel' });
  }
});

// POST /api/admin/questions - Crear nueva pregunta con imagen
// NOTA: Agregar authMiddleware en producción para seguridad
router.post('/questions', upload.single('image'), async (req, res) => {
  try {
    const { categoryCode, levelNumber, text, isTrue } = req.body;

    console.log('📥 Received question data:', { categoryCode, levelNumber, text, isTrue });

    if (!categoryCode || levelNumber === undefined || levelNumber === null || !text || isTrue === undefined) {
      console.error('❌ Validation failed:', { categoryCode, levelNumber, text, isTrue });
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    // Obtener category_id y level_id
    const [category] = await db.query('SELECT id FROM categories WHERE code = ?', [categoryCode]);
    
    if (category.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const [level] = await db.query(
      'SELECT id FROM levels WHERE category_id = ? AND level_number = ?',
      [category[0].id, levelNumber]
    );

    if (level.length === 0) {
      return res.status(404).json({ error: 'Nivel no encontrado' });
    }

    // Nombre de la imagen si fue subida
    const imageName = req.file ? req.file.filename : null;

    const [result] = await db.query(
      'INSERT INTO questions (category_id, level_id, text, is_true, image_name) VALUES (?, ?, ?, ?, ?)',
      [category[0].id, level[0].id, text, isTrue === 'true' || isTrue === true ? 1 : 0, imageName]
    );

    console.log('✅ Question created successfully:', result.insertId);

    res.json({
      message: 'Pregunta creada exitosamente',
      questionId: result.insertId,
      imageName: imageName
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ error: 'Error al crear pregunta' });
  }
});

// GET /api/admin/categories - Listar categorías
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories ORDER BY id');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// GET /api/admin/questions/:categoryId - Listar preguntas por categoría
router.get('/questions/:categoryId', async (req, res) => {
  try {
    const [questions] = await db.query(`
      SELECT q.*, l.level_number, l.name as level_name
      FROM questions q
      JOIN levels l ON q.level_id = l.id
      WHERE q.category_id = ?
      ORDER BY l.level_number, q.id
    `, [req.params.categoryId]);
    
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Error al obtener preguntas' });
  }
});

module.exports = router;
