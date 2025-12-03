const db = require('../config/database');

async function checkProgress() {
  try {
    console.log('🔍 Verificando progreso en base de datos...\n');

    // Ver progreso de PHP para todos los usuarios
    const [progress] = await db.query(`
      SELECT 
        u.username,
        c.code as category,
        up.current_level,
        up.total_score
      FROM user_progress up
      JOIN users u ON up.user_id = u.id
      JOIN categories c ON up.category_id = c.id
      WHERE c.code = 'php'
      ORDER BY u.username
    `);

    console.log('📊 Progreso de PHP:\n');
    progress.forEach(p => {
      console.log(`  ${p.username}: Nivel ${p.current_level} - ${p.total_score} puntos`);
    });

    // Ver niveles disponibles para PHP
    const [levels] = await db.query(`
      SELECT l.level_number, l.name, COUNT(q.id) as question_count
      FROM levels l
      JOIN categories c ON l.category_id = c.id
      LEFT JOIN questions q ON l.id = q.level_id
      WHERE c.code = 'php'
      GROUP BY l.id
      ORDER BY l.level_number
    `);

    console.log('\n🎯 Niveles de PHP disponibles:\n');
    levels.forEach(l => {
      console.log(`  Nivel ${l.level_number}: ${l.name} - ${l.question_count} preguntas`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkProgress();
