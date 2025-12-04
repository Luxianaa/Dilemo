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

// Servir archivos subidos (uploads de categorías, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Importar rutas
const categoriesRoutes = require('./routes/categories');
const levelsRoutes = require('./routes/levels');
const questionsRoutes = require('./routes/questions');
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const leaderboardRoutes = require('./routes/leaderboard');
const streakRoutes = require('./routes/streak');
const streakTestRoutes = require('./routes/streak-test');

// Usar rutas
app.use('/api/categories', categoriesRoutes);
app.use('/api/levels', levelsRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/streak', streakRoutes);
app.use('/api/streak', streakTestRoutes); // Endpoints de prueba

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
app.listen(PORT, '0.0.0.0', () => {
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  let localIP = 'localhost';
  
  // Encontrar la IP de red local
  Object.keys(networkInterfaces).forEach((interfaceName) => {
    networkInterfaces[interfaceName].forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIP = iface.address;
      }
    });
  });

  console.log(`🚀 Servidor corriendo en:`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://${localIP}:${PORT}`);
  console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
  console.log(`📱 Para probar en celular, abre: http://${localIP}:5173`);
});
