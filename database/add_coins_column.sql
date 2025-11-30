-- Agregar columna coins a la tabla users si no existe
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS coins INT DEFAULT 0 AFTER total_score;

-- Actualizar usuarios existentes para que tengan 0 monedas si no las tienen
UPDATE users SET coins = 0 WHERE coins IS NULL;
