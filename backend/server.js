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

// Usar rutas
app.use('/api/categories', categoriesRoutes);
app.use('/api/levels', levelsRoutes);
app.use('/api/questions', questionsRoutes);

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
