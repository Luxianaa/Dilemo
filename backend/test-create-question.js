const db = require('./config/database');

async function testCreateQuestion() {
    try {
        console.log('Testing database connection...');
        const [categories] = await db.query('SELECT * FROM categories LIMIT 1');
        if (categories.length === 0) {
            console.error('No categories found. Cannot test.');
            process.exit(1);
        }
        const categoryId = categories[0].id;
        console.log('Using Category ID:', categoryId);

        const [levels] = await db.query('SELECT * FROM levels WHERE category_id = ? LIMIT 1', [categoryId]);
        if (levels.length === 0) {
            console.error('No levels found for this category. Cannot test.');
            process.exit(1);
        }
        const levelId = levels[0].id;
        console.log('Using Level ID:', levelId);

        const text = 'Test Question ' + Date.now();
        const isTrue = true;
        const imageName = null;

        console.log('Attempting to insert question...');
        const query = 'INSERT INTO questions (text, is_true, level_id, category_id, image_name) VALUES (?, ?, ?, ?, ?)';
        const values = [text, isTrue, levelId, categoryId, imageName];

        console.log('Query:', query);
        console.log('Values:', values);

        const [result] = await db.query(query, values);
        console.log('✅ Success! Question created with ID:', result.insertId);

    } catch (error) {
        console.error('❌ Error creating question:', error);
    } finally {
        process.exit();
    }
}

testCreateQuestion();
