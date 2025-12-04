-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Base de datos limpia - Dilemo
-- Eliminadas tablas sin uso: leaderboard, achievements, user_achievements, user_answers
-- Reseteados datos de usuarios para empezar de cero

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dilemo_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `code` varchar(20) NOT NULL,
  `description` text DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `name`, `code`, `description`, `color`, `logo_url`, `created_at`) VALUES
(1, 'Logo Quiz', 'logoquiz', 'Adivina los logos de marcas y tecnologías famosas', '#39d3f7', NULL, '2025-11-28 23:02:54'),
(2, 'Python', 'python', 'Preguntas sobre el lenguaje de programación Python', '#4ecdc4', NULL, '2025-11-28 23:02:54'),
(3, 'Git', 'git', 'Preguntas sobre Git y control de versiones', '#ff4d6d', NULL, '2025-11-28 23:02:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `levels`
--

CREATE TABLE `levels` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `level_number` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `levels`
--

INSERT INTO `levels` (`id`, `category_id`, `level_number`, `name`, `created_at`) VALUES
(1, 1, 1, 'Nivel 1 - Logos Básicos', '2025-11-28 23:02:55'),
(2, 1, 2, 'Nivel 2 - Logos Intermedios', '2025-11-28 23:02:55'),
(3, 1, 3, 'Nivel 3 - Logos Avanzados', '2025-11-28 23:02:55'),
(4, 2, 1, 'Nivel 1 - Python Básico', '2025-11-28 23:02:55'),
(5, 2, 2, 'Nivel 2 - Python Intermedio', '2025-11-28 23:02:55'),
(6, 2, 3, 'Nivel 3 - Python Avanzado', '2025-11-28 23:02:55'),
(7, 2, 4, 'Nivel 4 - Python Experto', '2025-11-28 23:02:55'),
(8, 3, 1, 'Nivel 1 - Git Básico', '2025-11-28 23:02:55'),
(9, 3, 2, 'Nivel 2 - Git Intermedio', '2025-11-28 23:02:55'),
(10, 3, 3, 'Nivel 3 - Git Avanzado', '2025-11-28 23:02:55'),
(11, 3, 4, 'Nivel 4 - Git Experto', '2025-11-28 23:02:55');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `level_id` int(11) NOT NULL,
  `text` text NOT NULL,
  `is_true` tinyint(1) NOT NULL,
  `image_name` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `questions`
--

INSERT INTO `questions` (`id`, `category_id`, `level_id`, `text`, `is_true`, `image_name`, `created_at`) VALUES
(1, 1, 1, 'Este es el logo de CoffeeCode', 0, 'java.svg', '2025-11-28 23:02:55'),
(2, 1, 1, 'Este es el logo de Dart', 1, 'dart.svg', '2025-11-28 23:02:55'),
(3, 1, 1, 'Este es el logo de Gemini', 1, 'gemini.svg', '2025-11-28 23:02:55'),
(4, 1, 1, 'Este es el logo de PostgreSQL', 0, 'mysql-icon-light.svg', '2025-11-28 23:02:55'),
(5, 1, 1, 'Este es el logo de MariaDB', 0, 'postgresql.svg', '2025-11-28 23:02:55'),
(6, 1, 2, 'Este es el logo de AWS', 0, 'linux.svg', '2025-11-28 23:02:55'),
(7, 1, 2, 'Este es el logo de Laravel', 0, 'deepseek.svg', '2025-11-28 23:02:55'),
(8, 1, 2, 'Este es el logo de Grok', 1, 'grok-light.svg', '2025-11-28 23:02:55'),
(9, 1, 2, 'Este es el logo de MongoDB', 1, 'mongodb-icon-dark.svg', '2025-11-28 23:02:55'),
(10, 1, 2, 'Este es el logo de Opera', 1, 'opera.svg', '2025-11-28 23:02:55'),
(11, 1, 3, 'Esto es una base de datos', 0, 'jwt.svg', '2025-11-28 23:02:55'),
(12, 1, 3, 'Es un lenguaje de programación', 1, 'kotlin.svg', '2025-11-28 23:02:55'),
(13, 1, 3, 'Esto es LouvreUI', 0, 'laravel.svg', '2025-11-28 23:02:55'),
(14, 1, 3, 'Esto es plataforma de desarrollo de código abierto', 1, 'dotnet.svg', '2025-11-28 23:02:55'),
(15, 1, 3, 'Esto es un Framework', 0, 'duckduckgo.svg', '2025-11-28 23:02:55'),
(16, 2, 4, 'Python fue creado por Guido van Rossum en 1991.', 1, NULL, '2025-11-28 23:02:55'),
(17, 2, 4, 'En Python, las listas se definen con llaves {}.', 0, NULL, '2025-11-28 23:02:55'),
(18, 2, 4, 'Python usa indentación para definir bloques.', 1, NULL, '2025-11-28 23:02:55'),
(19, 2, 4, 'Los comentarios en Python se escriben con //.', 0, NULL, '2025-11-28 23:02:55'),
(20, 2, 4, 'print() requiere paréntesis en Python 3.', 1, NULL, '2025-11-28 23:02:55'),
(21, 2, 5, 'El operador \'is\' compara identidad.', 1, NULL, '2025-11-28 23:02:55'),
(22, 2, 5, 'Las cadenas en Python son mutables.', 0, NULL, '2025-11-28 23:02:55'),
(23, 2, 5, 'Python permite herencia múltiple.', 1, NULL, '2025-11-28 23:02:55'),
(24, 2, 5, 'range(5) genera 0,1,2,3,4,5', 0, NULL, '2025-11-28 23:02:55'),
(25, 2, 5, 'type(3.0) es float.', 1, NULL, '2025-11-28 23:02:55'),
(26, 2, 6, 'Los generadores usan yield.', 1, NULL, '2025-11-28 23:02:55'),
(27, 2, 6, 'Un diccionario permite claves duplicadas.', 0, NULL, '2025-11-28 23:02:55'),
(28, 2, 6, '\'pass\' evita errores en bloques vacíos.', 1, NULL, '2025-11-28 23:02:55'),
(29, 2, 6, 'Las lambdas pueden tener varias expresiones.', 0, NULL, '2025-11-28 23:02:55'),
(30, 2, 6, 'set() elimina duplicados.', 1, NULL, '2025-11-28 23:02:55'),
(31, 2, 7, 'async/await se usa para código asíncrono.', 1, NULL, '2025-11-28 23:02:55'),
(32, 2, 7, 'map() retorna una lista.', 0, NULL, '2025-11-28 23:02:55'),
(33, 2, 7, 'enumerate() devuelve índice y valor.', 1, NULL, '2025-11-28 23:02:55'),
(34, 2, 7, 'Python no soporta clases abstractas.', 0, NULL, '2025-11-28 23:02:55'),
(35, 2, 7, 'zip() combina listas.', 1, NULL, '2025-11-28 23:02:55'),
(36, 3, 8, 'Git es un sistema de control de versiones distribuido.', 1, NULL, '2025-11-28 23:02:55'),
(37, 3, 8, 'El comando \'git init\' crea un nuevo repositorio.', 1, NULL, '2025-11-28 23:02:55'),
(38, 3, 8, 'GitHub y Git son lo mismo.', 0, NULL, '2025-11-28 23:02:55'),
(39, 3, 8, 'Un commit es una captura de los cambios.', 1, NULL, '2025-11-28 23:02:55'),
(40, 3, 8, 'git add . agrega todos los archivos al staging area.', 1, NULL, '2025-11-28 23:02:55'),
(41, 3, 9, 'git clone sirve para copiar un repositorio remoto.', 1, NULL, '2025-11-28 23:02:55'),
(42, 3, 9, 'git status muestra los archivos modificados.', 1, NULL, '2025-11-28 23:02:55'),
(43, 3, 9, 'git push envía cambios del repositorio local al remoto.', 1, NULL, '2025-11-28 23:02:55'),
(44, 3, 9, 'git pull solo descarga cambios pero no los fusiona.', 0, NULL, '2025-11-28 23:02:55'),
(45, 3, 9, 'Un branch permite trabajar sin afectar la rama principal.', 1, NULL, '2025-11-28 23:02:55'),
(46, 3, 10, 'git merge combina dos ramas.', 1, NULL, '2025-11-28 23:02:55'),
(47, 3, 10, 'git checkout -b crea una nueva rama.', 1, NULL, '2025-11-28 23:02:55'),
(48, 3, 10, 'git stash guarda cambios temporalmente.', 1, NULL, '2025-11-28 23:02:55'),
(49, 3, 10, 'git reset --hard conserva los cambios del working directory.', 0, NULL, '2025-11-28 23:02:55'),
(50, 3, 10, 'HEAD apunta al commit actual.', 1, NULL, '2025-11-28 23:02:55'),
(51, 3, 11, 'git rebase reescribe la historia del repositorio.', 1, NULL, '2025-11-28 23:02:55'),
(52, 3, 11, 'git cherry-pick toma commits específicos de otra rama.', 1, NULL, '2025-11-28 23:02:55'),
(53, 3, 11, 'git revert elimina commits sin modificar el historial.', 0, NULL, '2025-11-28 23:02:55'),
(54, 3, 11, 'git log muestra el historial de commits.', 1, NULL, '2025-11-28 23:02:55'),
(55, 3, 11, 'git tag se usa para marcar versiones específicas.', 1, NULL, '2025-11-28 23:02:55');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `display_name` varchar(100) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `total_score` int(11) DEFAULT 0,
  `coins` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL,
  `current_streak` int(11) DEFAULT 0,
  `longest_streak` int(11) DEFAULT 0,
  `last_played_date` date DEFAULT NULL,
  `play_history` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`play_history`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tabla vacía - Los usuarios empezarán desde cero
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_progress`
--

CREATE TABLE `user_progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `current_level` int(11) DEFAULT 1,
  `total_score` int(11) DEFAULT 0,
  `lives` int(11) DEFAULT 3,
  `last_played` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Tabla vacía - El progreso se creará automáticamente al registrarse
--

-- --------------------------------------------------------

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indices de la tabla `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_category_level` (`category_id`,`level_number`);

--
-- Indices de la tabla `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `idx_level` (`level_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_last_played_date` (`last_played_date`);

--
-- Indices de la tabla `user_progress`
--
ALTER TABLE `user_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_category` (`user_id`,`category_id`),
  ADD KEY `category_id` (`category_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `levels`
--
ALTER TABLE `levels`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `user_progress`
--
ALTER TABLE `user_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `levels`
--
ALTER TABLE `levels`
  ADD CONSTRAINT `levels_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`level_id`) REFERENCES `levels` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_progress`
--
ALTER TABLE `user_progress`
  ADD CONSTRAINT `user_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_progress_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
