const express = require('express');
const router = express.Router();
const db = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurar multer para guardar logos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../public/uploads/categories');
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único: categoryCode_timestamp.ext
    const ext = path.extname(file.originalname);
    const categoryCode = req.body.code || 'category';
    cb(null, `${categoryCode}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // Límite de 2MB
  },
  fileFilter: function (req, file, cb) {
    // Solo aceptar imágenes
    const allowedTypes = /jpeg|jpg|png|svg|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, svg, webp)'));
    }
  }
});

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

// POST /api/categories - Crear nueva categoría con logo opcional
router.post('/', upload.single('logo'), async (req, res) => {
  const { name, code, color, description } = req.body;

  if (!name || !code) {
    return res.status(400).json({ error: 'Nombre y código son requeridos' });
  }

  try {
    // Construir ruta del logo si se subió un archivo
    const logoUrl = req.file ? `/uploads/categories/${req.file.filename}` : null;

    const [result] = await db.query(
      'INSERT INTO categories (name, code, color, description, logo_url) VALUES (?, ?, ?, ?, ?)',
      [name, code, color || '#4D96FF', description || '', logoUrl]
    );

    res.status(201).json({ 
      id: result.insertId, 
      name, 
      code, 
      color: color || '#4D96FF',
      description: description || '',
      logo_url: logoUrl
    });
  } catch (error) {
    // Si hubo error, eliminar la imagen subida
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Error al crear categoría:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El código de categoría ya existe' });
    }
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

module.exports = router;
