const pool = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔄 Ejecutando migración para agregar categoría PHP...');
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'add_php_category.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir por statements (separados por punto y coma)
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    // Ejecutar cada statement
    for (const statement of statements) {
      if (statement.includes('SET @')) {
        // Para variables de sesión, usar query directa
        await connection.query(statement);
      } else {
        await connection.query(statement);
      }
    }
    
    console.log('✅ Migración completada exitosamente');
    
    // Verificar que se agregó
    const [categories] = await connection.query('SELECT * FROM categories WHERE code = "php"');
    const [levels] = await connection.query(
      'SELECT * FROM levels WHERE category_id = (SELECT id FROM categories WHERE code = "php")'
    );
    const [questions] = await connection.query(
      'SELECT COUNT(*) as count FROM questions WHERE category_id = (SELECT id FROM categories WHERE code = "php")'
    );
    
    console.log('📊 Resultados:');
    console.log('  - Categoría PHP:', categories.length > 0 ? '✅ Agregada' : '❌ No encontrada');
    console.log('  - Niveles:', levels.length);
    console.log('  - Preguntas:', questions[0].count);
    
  } catch (error) {
    console.error('❌ Error en migración:', error.message);
  } finally {
    connection.release();
    process.exit();
  }
}

runMigration();
