-- =============================================
-- BASE DE DATOS: dilemo_trivia
-- Script completo para XAMPP/MySQL
-- =============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS dilemo_trivia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dilemo_trivia;

-- =============================================
-- TABLA: categories
-- =============================================
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: levels
-- =============================================
CREATE TABLE levels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    level_number INT NOT NULL,
    name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_category_level (category_id, level_number)
);

-- =============================================
-- TABLA: questions
-- =============================================
CREATE TABLE questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT NOT NULL,
    level_id INT NOT NULL,
    text TEXT NOT NULL,
    is_true BOOLEAN NOT NULL,
    image_name VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
    INDEX idx_level (level_id)
);

-- =============================================
-- INSERTAR CATEGORÍAS
-- =============================================
INSERT INTO categories (name, code, description, color) VALUES
('Logo Quiz', 'logoquiz', 'Adivina los logos de marcas y tecnologías famosas', '#39d3f7'),
('Python', 'python', 'Preguntas sobre el lenguaje de programación Python', '#4ecdc4'),
('Git', 'git', 'Preguntas sobre Git y control de versiones', '#ff4d6d');

-- =============================================
-- INSERTAR NIVELES
-- =============================================

-- Logo Quiz: 3 niveles
INSERT INTO levels (category_id, level_number, name) VALUES
(1, 1, 'Nivel 1 - Logos Básicos'),
(1, 2, 'Nivel 2 - Logos Intermedios'),
(1, 3, 'Nivel 3 - Logos Avanzados');

-- Python: 4 niveles
INSERT INTO levels (category_id, level_number, name) VALUES
(2, 1, 'Nivel 1 - Python Básico'),
(2, 2, 'Nivel 2 - Python Intermedio'),
(2, 3, 'Nivel 3 - Python Avanzado'),
(2, 4, 'Nivel 4 - Python Experto');

-- Git: 4 niveles
INSERT INTO levels (category_id, level_number, name) VALUES
(3, 1, 'Nivel 1 - Git Básico'),
(3, 2, 'Nivel 2 - Git Intermedio'),
(3, 3, 'Nivel 3 - Git Avanzado'),
(3, 4, 'Nivel 4 - Git Experto');

-- =============================================
-- INSERTAR PREGUNTAS - LOGO QUIZ
-- =============================================

-- Nivel 1
INSERT INTO questions (category_id, level_id, text, is_true, image_name) VALUES
(1, 1, 'Este es el logo de CoffeeCode', FALSE, 'java.svg'),
(1, 1, 'Este es el logo de Dart', TRUE, 'dart.svg'),
(1, 1, 'Este es el logo de Gemini', TRUE, 'gemini.svg'),
(1, 1, 'Este es el logo de PostgreSQL', FALSE, 'mysql-icon-light.svg'),
(1, 1, 'Este es el logo de MariaDB', FALSE, 'postgresql.svg');

-- Nivel 2
INSERT INTO questions (category_id, level_id, text, is_true, image_name) VALUES
(1, 2, 'Este es el logo de AWS', FALSE, 'linux.svg'),
(1, 2, 'Este es el logo de Laravel', FALSE, 'deepseek.svg'),
(1, 2, 'Este es el logo de Grok', TRUE, 'grok-light.svg'),
(1, 2, 'Este es el logo de MongoDB', TRUE, 'mongodb-icon-dark.svg'),
(1, 2, 'Este es el logo de Opera', TRUE, 'opera.svg');

-- Nivel 3
INSERT INTO questions (category_id, level_id, text, is_true, image_name) VALUES
(1, 3, 'Esto es una base de datos', FALSE, 'jwt.svg'),
(1, 3, 'Es un lenguaje de programación', TRUE, 'kotlin.svg'),
(1, 3, 'Esto es LouvreUI', FALSE, 'laravel.svg'),
(1, 3, 'Esto es plataforma de desarrollo de código abierto', TRUE, 'dotnet.svg'),
(1, 3, 'Esto es un Framework', FALSE, 'duckduckgo.svg');

-- =============================================
-- INSERTAR PREGUNTAS - PYTHON
-- =============================================

-- Nivel 1
INSERT INTO questions (category_id, level_id, text, is_true, image_name) VALUES
(2, 4, 'Python fue creado por Guido van Rossum en 1991.', TRUE, NULL),
(2, 4, 'En Python, las listas se definen con llaves {}.', FALSE, NULL),
(2, 4, 'Python usa indentación para definir bloques.', TRUE, NULL),
(2, 4, 'Los comentarios en Python se escriben con //.', FALSE, NULL),
(2, 4, 'print() requiere paréntesis en Python 3.', TRUE, NULL);

-- Nivel 2
INSERT INTO questions (category_id, level_id, text, is_true, image_name) VALUES
(2, 5, 'El operador \'is\' compara identidad.', TRUE, NULL),
(2, 5, 'Las cadenas en Python son mutables.', FALSE, NULL),
(2, 5, 'Python permite herencia múltiple.', TRUE, NULL),
(2, 5, 'range(5) genera 0,1,2,3,4,5', FALSE, NULL),
(2, 5, 'type(3.0) es float.', TRUE, NULL);

-- Nivel 3
INSERT INTO questions (category_id, level_id, text, is_true, image_name) VALUES
(2, 6, 'Los generadores usan yield.', TRUE, NULL),
(2, 6, 'Un diccionario permite claves duplicadas.', FALSE, NULL),
(2, 6, '\'pass\' evita errores en bloques vacíos.', TRUE, NULL),
(2, 6, 'Las lambdas pueden tener varias expresiones.', FALSE, NULL),
(2, 6, 'set() elimina duplicados.', TRUE, NULL);

-- Nivel 4
INSERT INTO questions (category_id, level_id, text, is_true, image_name) VALUES
(2, 7, 'async/await se usa para código asíncrono.', TRUE, NULL),
(2, 7, 'map() retorna una lista.', FALSE, NULL),
(2, 7, 'enumerate() devuelve índice y valor.', TRUE, NULL),
(2, 7, 'Python no soporta clases abstractas.', FALSE, NULL),
(2, 7, 'zip() combina listas.', TRUE, NULL);

-- =============================================
-- INSERTAR PREGUNTAS - GIT
-- =============================================

-- Nivel 1
INSERT INTO questions (category_id, level_id, text, is_true, image_name) VALUES
(3, 8, 'Git es un sistema de control de versiones distribuido.', TRUE, NULL),
(3, 8, 'El comando \'git init\' crea un nuevo repositorio.', TRUE, NULL),
(3, 8, 'GitHub y Git son lo mismo.', FALSE, NULL),
(3, 8, 'Un commit es una captura de los cambios.', TRUE, NULL),
(3, 8, 'git add . agrega todos los archivos al staging area.', TRUE, NULL);

-- Nivel 2
INSERT INTO questions (category_id, level_id, text, is_true, image_name) VALUES
(3, 9, 'git clone sirve para copiar un repositorio remoto.', TRUE, NULL),
(3, 9, 'git status muestra los archivos modificados.', TRUE, NULL),
(3, 9, 'git push envía cambios del repositorio local al remoto.', TRUE, NULL),
(3, 9, 'git pull solo descarga cambios pero no los fusiona.', FALSE, NULL),
(3, 9, 'Un branch permite trabajar sin afectar la rama principal.', TRUE, NULL);

-- Nivel 3
INSERT INTO questions (category_id, level_id, text, is_true, image_name) VALUES
(3, 10, 'git merge combina dos ramas.', TRUE, NULL),
(3, 10, 'git checkout -b crea una nueva rama.', TRUE, NULL),
(3, 10, 'git stash guarda cambios temporalmente.', TRUE, NULL),
(3, 10, 'git reset --hard conserva los cambios del working directory.', FALSE, NULL),
(3, 10, 'HEAD apunta al commit actual.', TRUE, NULL);

-- Nivel 4
INSERT INTO questions (category_id, level_id, text, is_true, image_name) VALUES
(3, 11, 'git rebase reescribe la historia del repositorio.', TRUE, NULL),
(3, 11, 'git cherry-pick toma commits específicos de otra rama.', TRUE, NULL),
(3, 11, 'git revert elimina commits sin modificar el historial.', FALSE, NULL),
(3, 11, 'git log muestra el historial de commits.', TRUE, NULL),
(3, 11, 'git tag se usa para marcar versiones específicas.', TRUE, NULL);

-- =============================================
-- VERIFICAR DATOS INSERTADOS
-- =============================================

-- Ver categorías
SELECT * FROM categories;

-- Ver niveles por categoría
SELECT c.name as categoria, l.level_number, l.name as nivel
FROM levels l
JOIN categories c ON l.category_id = c.id
ORDER BY c.id, l.level_number;

-- Contar preguntas por categoría
SELECT c.name as categoria, COUNT(q.id) as total_preguntas
FROM questions q
JOIN categories c ON q.category_id = c.id
GROUP BY c.id;

-- Ver preguntas de Logo Quiz Nivel 1
SELECT text, is_true, image_name 
FROM questions 
WHERE level_id = 1;
