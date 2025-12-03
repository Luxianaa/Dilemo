const db = require('../config/database');

async function fixUserProgress() {
  try {
    console.log('🔧 Arreglando progreso de usuarios...');

    // Obtener todas las categorías
    const [categories] = await db.query('SELECT id, code FROM categories');
    console.log(`📊 Categorías encontradas: ${categories.length}`);

    // Obtener todos los usuarios
    const [users] = await db.query('SELECT id, username FROM users');
    console.log(`👥 Usuarios encontrados: ${users.length}`);

    for (const user of users) {
      console.log(`\n👤 Procesando usuario: ${user.username} (ID: ${user.id})`);

      for (const category of categories) {
        // Verificar si existe progreso para esta categoría
        const [existing] = await db.query(
          'SELECT id, current_level FROM user_progress WHERE user_id = ? AND category_id = ?',
          [user.id, category.id]
        );

        if (existing.length === 0) {
          // No existe, crear con valores iniciales
          await db.query(
            'INSERT INTO user_progress (user_id, category_id, current_level, total_score) VALUES (?, ?, 1, 0)',
            [user.id, category.id]
          );
          console.log(`  ✅ Inicializado progreso para ${category.code}: Nivel 1`);
        } else {
          // Ya existe, verificar si el nivel es válido
          const currentLevel = existing[0].current_level;
          
          // Verificar cuántos niveles tiene esta categoría
          const [levels] = await db.query(
            'SELECT MAX(level_number) as max_level FROM levels WHERE category_id = ?',
            [category.id]
          );
          
          const maxLevel = levels[0].max_level || 1;
          
          if (currentLevel > maxLevel) {
            // Nivel inválido, resetear a 1
            await db.query(
              'UPDATE user_progress SET current_level = 1 WHERE user_id = ? AND category_id = ?',
              [user.id, category.id]
            );
            console.log(`  🔄 Reseteado ${category.code}: de Nivel ${currentLevel} → Nivel 1 (máx: ${maxLevel})`);
          } else {
            console.log(`  ✔️  ${category.code}: Nivel ${currentLevel} (OK)`);
          }
        }
      }
    }

    console.log('\n✅ Progreso de usuarios arreglado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixUserProgress();
