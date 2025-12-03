const pool = require('../config/database');

async function cleanPHP() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🗑️  Eliminando datos PHP incompletos...');
    
    // Eliminar categoría PHP si existe
    await connection.query('DELETE FROM questions WHERE category_id = 4');
    await connection.query('DELETE FROM levels WHERE category_id = 4');
    await connection.query('DELETE FROM categories WHERE id = 4');
    
    console.log('✅ Limpieza completada');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    connection.release();
    process.exit();
  }
}

cleanPHP();
