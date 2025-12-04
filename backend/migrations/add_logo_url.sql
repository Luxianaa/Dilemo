-- Agregar campo logo_url a la tabla categories
ALTER TABLE categories ADD COLUMN logo_url VARCHAR(255) DEFAULT NULL AFTER color;
