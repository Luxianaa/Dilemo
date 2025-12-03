const db = require('../config/database');

async function checkImages() {
  try {
    const [rows] = await db.query(`
      SELECT 
        q.id,
        q.text,
        q.image_name,
        c.code as category,
        l.level_number
      FROM questions q
      JOIN levels l ON q.level_id = l.id
      JOIN categories c ON l.category_id = c.id
      WHERE c.code IN ('php', 'logoquiz')
      LIMIT 5
    `);
    
    console.log('📊 Preguntas en BD:\n');
    rows.forEach(row => {
      console.log(`${row.category.toUpperCase()} Nivel ${row.level_number}:`);
      console.log(`  Texto: ${row.text.substring(0, 50)}...`);
      console.log(`  Imagen: ${row.image_name || 'SIN IMAGEN'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

checkImages();
