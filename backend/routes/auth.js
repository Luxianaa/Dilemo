const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register',
  [
    body('username').notEmpty().withMessage('El nombre de usuario es requerido'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida')
  ],
  async (req, res) => {
    // Validar inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, display_name } = req.body;

    try {
      // Verificar si el email ya existe
      const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }

      // Verificar si el username ya existe
      const [existingUsername] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
      if (existingUsername.length > 0) {
        return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
      }

      // Hashear contraseña
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Crear usuario
      const [result] = await db.query(
        'INSERT INTO users (username, email, password_hash, display_name) VALUES (?, ?, ?, ?)',
        [username, email, password_hash, display_name || username]
      );

      const userId = result.insertId;

      // Inicializar progreso para cada categoría
      const [categories] = await db.query('SELECT id FROM categories');
      for (const category of categories) {
        await db.query(
          'INSERT INTO user_progress (user_id, category_id, current_level, total_score) VALUES (?, ?, 1, 0)',
          [userId, category.id]
        );
      }

      // Generar JWT
      const token = jwt.sign(
        { id: userId, username, email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        token,
        user: {
          id: userId,
          username,
          email,
          display_name: display_name || username
        }
      });
    } catch (error) {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }
);

// POST /api/auth/login - Iniciar sesión
router.post('/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Buscar usuario
      const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

      if (users.length === 0) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      const user = users[0];

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.password_hash);

      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      // Actualizar last_login
      await db.query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

      // Generar JWT
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.json({
        message: 'Login exitoso',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          display_name: user.display_name,
          total_score: user.total_score
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  }
);

// GET /api/auth/me - Obtener usuario actual (ruta protegida)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    console.log('👤 Obteniendo datos de usuario:', req.user.id);
    const [users] = await db.query(
      'SELECT id, username, email, display_name, coins, total_score, current_streak, longest_streak, last_played_date, play_history, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      console.warn('⚠️ Usuario no encontrado en DB:', req.user.id);
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Asegurar que el usuario tenga progreso para TODAS las categorías
    const [categories] = await db.query('SELECT id FROM categories');
    const [existingProgress] = await db.query('SELECT category_id FROM user_progress WHERE user_id = ?', [req.user.id]);

    const existingCategoryIds = existingProgress.map(p => p.category_id);

    for (const category of categories) {
      if (!existingCategoryIds.includes(category.id)) {
        console.log(`🆕 Inicializando progreso para categoría ${category.id} - usuario ${req.user.id}`);
        try {
          await db.query(
            'INSERT INTO user_progress (user_id, category_id, current_level, total_score) VALUES (?, ?, 1, 0)',
            [req.user.id, category.id]
          );
        } catch (err) {
          console.error(`❌ Error al inicializar progreso para cat ${category.id}:`, err.message);
          // No fallamos todo el request si falla una inicialización, pero lo logueamos
        }
      }
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('❌ Error crítico al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener datos del usuario', details: error.message });
  }
});

module.exports = router;
