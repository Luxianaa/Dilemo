const pool = require('../config/database');

async function addPHPCategory() {
  const connection = await pool.getConnection();
  
  try {
    console.log('🔄 Verificando esquema de la tabla categories...');
    
    // Verificar estructura de la tabla
    const [columns] = await connection.query('DESCRIBE categories');
    console.log('Columnas en categories:', columns.map(c => c.Field).join(', '));
    
    // Verificar si ya existe PHP
    const [existing] = await connection.query('SELECT * FROM categories WHERE code = "php"');
    
    if (existing.length > 0) {
      console.log('⚠️  La categoría PHP ya existe');
      const phpId = existing[0].id;
      
      // Verificar niveles
      const [levels] = await connection.query('SELECT * FROM levels WHERE category_id = ?', [phpId]);
      console.log(`📊 Niveles existentes: ${levels.length}`);
      
      // Verificar preguntas
      const [questions] = await connection.query('SELECT COUNT(*) as count FROM questions WHERE category_id = ?', [phpId]);
      console.log(`📝 Preguntas existentes: ${questions[0].count}`);
      
      return;
    }
    
    console.log('➕ Agregando categoría PHP...');
    
    // Insertar categoría
    const [categoryResult] = await connection.query(
      'INSERT INTO categories (name, code, description, color) VALUES (?, ?, ?, ?)',
      ['PHP', 'php', 'Preguntas sobre PHP y desarrollo web', '#777BB4']
    );
    
    const phpCategoryId = categoryResult.insertId;
    console.log(`✅ Categoría PHP creada con ID: ${phpCategoryId}`);
    
    // Crear niveles
    const levels = [
      { level_number: 1, name: 'Nivel 1 - PHP Básico' },
      { level_number: 2, name: 'Nivel 2 - PHP Intermedio' },
      { level_number: 3, name: 'Nivel 3 - PHP Avanzado' }
    ];
    
    const levelIds = [];
    for (const level of levels) {
      const [result] = await connection.query(
        'INSERT INTO levels (category_id, level_number, name) VALUES (?, ?, ?)',
        [phpCategoryId, level.level_number, level.name]
      );
      levelIds.push(result.insertId);
      console.log(`✅ Nivel ${level.level_number} creado`);
    }
    
    // Preguntas por nivel
    const questionsData = [
      // Nivel 1 - Básico
      { level: 0, text: 'PHP significa Personal Home Page Tools', is_true: 0 },
      { level: 0, text: 'PHP es un lenguaje del lado del servidor', is_true: 1 },
      { level: 0, text: 'Las variables en PHP empiezan con $', is_true: 1 },
      { level: 0, text: 'PHP requiere compilación antes de ejecutarse', is_true: 0 },
      { level: 0, text: 'echo y print son lo mismo en PHP', is_true: 0 },
      
      // Nivel 2 - Intermedio
      { level: 1, text: 'PDO es una extensión para acceso a bases de datos', is_true: 1 },
      { level: 1, text: 'PHP soporta programación orientada a objetos', is_true: 1 },
      { level: 1, text: 'Los arrays en PHP solo pueden tener índices numéricos', is_true: 0 },
      { level: 1, text: 'session_start() debe llamarse antes de cualquier salida HTML', is_true: 1 },
      { level: 1, text: 'require_once incluye un archivo solo una vez', is_true: 1 },
      
      // Nivel 3 - Avanzado
      { level: 2, text: 'Laravel es un framework de PHP', is_true: 1 },
      { level: 2, text: 'Composer es un manejador de dependencias para PHP', is_true: 1 },
      { level: 2, text: 'PSR-4 es un estándar de autoloading en PHP', is_true: 1 },
      { level: 2, text: 'Traits en PHP permiten herencia múltiple completa', is_true: 0 },
      { level: 2, text: 'Namespace en PHP evita conflictos de nombres', is_true: 1 }
    ];
    
    // Insertar preguntas
    for (const q of questionsData) {
      await connection.query(
        'INSERT INTO questions (category_id, level_id, text, is_true, image_name) VALUES (?, ?, ?, ?, NULL)',
        [phpCategoryId, levelIds[q.level], q.text, q.is_true]
      );
    }
    
    console.log(`✅ ${questionsData.length} preguntas agregadas`);
    
    // Verificar resultado final
    const [finalCheck] = await connection.query(
      'SELECT COUNT(*) as count FROM questions WHERE category_id = ?',
      [phpCategoryId]
    );
    
    console.log('\n📊 Resumen:');
    console.log('  - Categoría: PHP ✅');
    console.log('  - Niveles: 3 ✅');
    console.log(`  - Preguntas: ${finalCheck[0].count} ✅`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    connection.release();
    process.exit();
  }
}

addPHPCategory();
