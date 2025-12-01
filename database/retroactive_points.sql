-- Script para dar puntos retroactivos a usuarios basados en niveles completados
-- Fórmula: (current_level - 1) * 200 puntos promedio por nivel
-- Asumimos que completaron cada nivel con 2 vidas promedio: (2*100) + (nivel*50)

USE dilemo_db;

-- Actualizar puntos en user_progress basados en niveles completados
UPDATE user_progress
SET total_score = (current_level - 1) * 200
WHERE current_level > 1;

-- Actualizar puntos globales en users sumando todos los totales de user_progress
UPDATE users u
SET total_score = (
  SELECT COALESCE(SUM(total_score), 0) 
  FROM user_progress 
  WHERE user_id = u.id
);

-- Verificar resultados
SELECT 
  u.username,
  u.total_score as 'Puntos Globales',
  GROUP_CONCAT(
    CONCAT(c.code, ': ', up.total_score, ' pts (Niv. ', up.current_level, ')')
    SEPARATOR ', '
  ) as 'Desglose por Categoría'
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN categories c ON up.category_id = c.id
GROUP BY u.id, u.username, u.total_score
ORDER BY u.total_score DESC;
