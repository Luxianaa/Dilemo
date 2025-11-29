const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir imágenes estáticas (logos)
app.use('/logos', express.static(path.join(__dirname, '../src/assets/logos')));

// Importar rutas
const categoriesRoutes = require('./routes/categories');
const levelsRoutes = require('./routes/levels');
const questionsRoutes = require('./routes/questions');
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const leaderboardRoutes = require('./routes/leaderboard');

// Usar rutas
app.use('/api/categories', categoriesRoutes);
app.use('/api/levels', levelsRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Dilemo Trivia funcionando correctamente',
    endpoints: {
      categories: '/api/categories',
      levels: '/api/levels/:categoryCode',
      questions: '/api/questions/level/:levelId'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
});
