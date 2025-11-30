-- Agregar campo coins a la tabla users
ALTER TABLE users ADD COLUMN coins INT DEFAULT 0 AFTER total_score;

-- Actualizar usuarios existentes con 0 monedas
UPDATE users SET coins = 0 WHERE coins IS NULL;
