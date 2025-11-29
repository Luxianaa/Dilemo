-- =============================================
-- TABLAS ADICIONALES PARA SISTEMA DE USUARIOS
-- Ejecutar DESPUÉS de setup_complete.sql
-- =============================================

USE dilemo_trivia;

-- =============================================
-- TABLA: users (Usuarios)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url VARCHAR(255),
    total_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- =============================================
-- TABLA: user_progress (Progreso por categoría)
-- =============================================
CREATE TABLE IF NOT EXISTS user_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    current_level INT DEFAULT 1,
    total_score INT DEFAULT 0,
    lives INT DEFAULT 3,
    last_played TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_category (user_id, category_id)
);

-- =============================================
-- TABLA: user_answers (Historial de respuestas)
-- =============================================
CREATE TABLE IF NOT EXISTS user_answers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    user_answer BOOLEAN NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_taken INT,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_question (question_id),
    INDEX idx_answered_at (answered_at)
);

-- =============================================
-- TABLA: achievements (Logros)
-- =============================================
CREATE TABLE IF NOT EXISTS achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    points INT DEFAULT 0,
    requirement_type ENUM('score', 'streak', 'level', 'questions') DEFAULT 'score',
    requirement_value INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: user_achievements (Logros desbloqueados)
-- =============================================
CREATE TABLE IF NOT EXISTS user_achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    achievement_id INT NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_achievement (user_id, achievement_id)
);

-- =============================================
-- TABLA: leaderboard (Tabla de clasificación)
-- =============================================
CREATE TABLE IF NOT EXISTS leaderboard (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    category_id INT,
    score INT DEFAULT 0,
    rank INT,
    period ENUM('daily', 'weekly', 'monthly', 'all_time') DEFAULT 'all_time',
    period_start DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_period_score (period, score DESC),
    INDEX idx_category_score (category_id, score DESC)
);

-- =============================================
-- INSERTAR LOGROS INICIALES
-- =============================================
INSERT INTO achievements (name, description, points, requirement_type, requirement_value) VALUES
('Primera Victoria', 'Completa tu primer nivel', 10, 'level', 1),
('Racha de 5', 'Responde 5 preguntas correctas seguidas', 25, 'streak', 5),
('Maestro del Quiz', 'Alcanza 1000 puntos', 50, 'score', 1000),
('Perfeccionista', 'Completa un nivel sin errores', 100, 'questions', 10);

-- =============================================
-- VERIFICAR CREACIÓN
-- =============================================
SELECT 'Tablas creadas exitosamente' as mensaje;

SHOW TABLES;
