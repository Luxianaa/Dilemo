-- Agregar categoría PHP si no existe
INSERT INTO categories (name, code, description, color) 
SELECT 'PHP', 'php', 'Preguntas sobre PHP y desarrollo web', '#777BB4'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE code = 'php');

-- Obtener ID de la categoría PHP
SET @php_category_id = (SELECT id FROM categories WHERE code = 'php');

-- Crear niveles para PHP si no existen
INSERT INTO levels (category_id, level_number, name, description, points_reward)
SELECT @php_category_id, 1, 'PHP Básico', 'Fundamentos de PHP', 50
WHERE NOT EXISTS (SELECT 1 FROM levels WHERE category_id = @php_category_id AND level_number = 1);

INSERT INTO levels (category_id, level_number, name, description, points_reward)
SELECT @php_category_id, 2, 'PHP Intermedio', 'Conceptos intermedios de PHP', 75
WHERE NOT EXISTS (SELECT 1 FROM levels WHERE category_id = @php_category_id AND level_number = 2);

INSERT INTO levels (category_id, level_number, name, description, points_reward)
SELECT @php_category_id, 3, 'PHP Avanzado', 'PHP avanzado y frameworks', 100
WHERE NOT EXISTS (SELECT 1 FROM levels WHERE category_id = @php_category_id AND level_number = 3);

-- Obtener IDs de niveles
SET @php_level_1 = (SELECT id FROM levels WHERE category_id = @php_category_id AND level_number = 1);
SET @php_level_2 = (SELECT id FROM levels WHERE category_id = @php_category_id AND level_number = 2);
SET @php_level_3 = (SELECT id FROM levels WHERE category_id = @php_category_id AND level_number = 3);

-- Agregar preguntas para nivel 1 (Básico)
INSERT INTO questions (category_id, level_id, text, is_true, image_name) VALUES
(@php_category_id, @php_level_1, 'PHP significa Personal Home Page Tools', 0, NULL),
(@php_category_id, @php_level_1, 'PHP es un lenguaje del lado del servidor', 1, NULL),
(@php_category_id, @php_level_1, 'Las variables en PHP empiezan con $', 1, NULL),
(@php_category_id, @php_level_1, 'PHP requiere compilación antes de ejecutarse', 0, NULL),
(@php_category_id, @php_level_1, 'echo y print son lo mismo en PHP', 0, NULL);

-- Agregar preguntas para nivel 2 (Intermedio)
INSERT INTO questions (category_id, level_id, text, is_true, image_name) VALUES
(@php_category_id, @php_level_2, 'PDO es una extensión para acceso a bases de datos', 1, NULL),
(@php_category_id, @php_level_2, 'PHP soporta programación orientada a objetos', 1, NULL),
(@php_category_id, @php_level_2, 'Los arrays en PHP solo pueden tener índices numéricos', 0, NULL),
(@php_category_id, @php_level_2, 'session_start() debe llamarse antes de cualquier salida HTML', 1, NULL),
(@php_category_id, @php_level_2, 'require_once incluye un archivo solo una vez', 1, NULL);

-- Agregar preguntas para nivel 3 (Avanzado)
INSERT INTO questions (category_id, level_id, text, is_true, image_name) VALUES
(@php_category_id, @php_level_3, 'Laravel es un framework de PHP', 1, NULL),
(@php_category_id, @php_level_3, 'Composer es un manejador de dependencias para PHP', 1, NULL),
(@php_category_id, @php_level_3, 'PSR-4 es un estándar de autoloading en PHP', 1, NULL),
(@php_category_id, @php_level_3, 'Traits en PHP permiten herencia múltiple completa', 0, NULL),
(@php_category_id, @php_level_3, 'Namespace en PHP evita conflictos de nombres', 1, NULL);
