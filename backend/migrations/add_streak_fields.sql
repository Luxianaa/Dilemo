-- Agregar campos de racha (streak) a la tabla users

ALTER TABLE users
ADD COLUMN current_streak INT DEFAULT 0,
ADD COLUMN longest_streak INT DEFAULT 0,
ADD COLUMN last_played_date DATE DEFAULT NULL;

-- Índice para mejorar las consultas de fecha
CREATE INDEX idx_last_played_date ON users(last_played_date);
