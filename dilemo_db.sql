-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-12-2025 a las 18:28:23
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

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
-- Estructura de tabla para la tabla `achievements`
--

CREATE TABLE `achievements` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `icon_url` varchar(255) DEFAULT NULL,
  `points` int(11) DEFAULT 0,
  `requirement_type` enum('score','streak','level','questions') DEFAULT 'score',
  `requirement_value` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `achievements`
--

INSERT INTO `achievements` (`id`, `name`, `description`, `icon_url`, `points`, `requirement_type`, `requirement_value`, `created_at`) VALUES
(1, 'Primera Victoria', 'Completa tu primer nivel', NULL, 10, 'level', 1, '2025-11-28 23:47:18'),
(2, 'Racha de 5', 'Responde 5 preguntas correctas seguidas', NULL, 25, 'streak', 5, '2025-11-28 23:47:18'),
(3, 'Maestro del Quiz', 'Alcanza 1000 puntos', NULL, 50, 'score', 1000, '2025-11-28 23:47:18'),
(4, 'Perfeccionista', 'Completa un nivel sin errores', NULL, 100, 'questions', 10, '2025-11-28 23:47:18');

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categories`
--

INSERT INTO `categories` (`id`, `name`, `code`, `description`, `color`, `created_at`) VALUES
(1, 'Logo Quiz', 'logoquiz', 'Adivina los logos de marcas y tecnologías famosas', '#39d3f7', '2025-11-28 23:02:54'),
(2, 'Python', 'python', 'Preguntas sobre el lenguaje de programación Python', '#4ecdc4', '2025-11-28 23:02:54'),
(3, 'Git', 'git', 'Preguntas sobre Git y control de versiones', '#ff4d6d', '2025-11-28 23:02:54');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `leaderboard`
--

CREATE TABLE `leaderboard` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT 0,
  `rank` int(11) DEFAULT NULL,
  `period` enum('daily','weekly','monthly','all_time') DEFAULT 'all_time',
  `period_start` date DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `display_name`, `avatar_url`, `total_score`, `coins`, `created_at`, `last_login`, `current_streak`, `longest_streak`, `last_played_date`, `play_history`) VALUES
(1, 'Luxiana', 'lu@gmail.com', '$2b$10$358/XKytS7K65g4ojSfJn.1HPRTqF10nD1qdb0pYEpdbSnUV/wlj.', 'Luxianaa', NULL, 0, 0, '2025-11-28 23:48:31', NULL, 0, 0, NULL, NULL),
(2, 'Luca', 'luca@gmail.com', '$2b$10$HhwQv1beGz3b3rF1BWOUHeuYzSvM4Ik57Mqxl9qSxg7Z/vg7RvM9G', 'Luca', NULL, 0, 0, '2025-11-28 23:50:55', NULL, 0, 0, NULL, NULL),
(3, 'Lu1', 'lduue@duek.com', '$2b$10$sWd2zHFp5EKaf4X/vCGwtOmwCkJNbb4TZa1iS7B22MTYYiHysQ2V2', 'Lu1', NULL, 0, 0, '2025-11-28 23:53:29', NULL, 0, 0, NULL, NULL),
(5, 'Luxiana122', 'lucha@gmail.com', '$2b$10$1tOZk.bwuuKLyhZw5D4ig.iEOKUgXa4LqleOAthcTA2ubkT68p.XO', 'Luxiana122', NULL, 0, 0, '2025-11-29 00:43:47', NULL, 0, 0, NULL, NULL),
(6, 'ponaxudow', 'vefoqop@mailinator.com', '$2b$10$4Mkwk0iHJ7AV7F40Px6BhuTAYAZGVgWQp9IbOAqFRhWijWQoEChpa', 'Colin Ochoa', NULL, 0, 0, '2025-11-29 00:47:21', NULL, 0, 0, NULL, NULL),
(7, 'nyjedu', 'byjux@mailinator.com', '$2b$10$D2d.90iqbGlPWKwX0K4/0.nfjmKUu0uttP8Di3pXZsv4grTUc/fMa', 'Karina Trujillo', NULL, 0, 0, '2025-11-29 01:12:21', NULL, 0, 0, NULL, NULL),
(8, 'lu12', 'lu12@gmail.com', '$2b$10$UDNpEe1amDh9P/gfKMiUQ.O1eywP1VpKBbK0cTpA6MK.aVIffQ41i', 'lu', NULL, 0, 0, '2025-11-29 01:23:40', '2025-11-29 01:27:07', 0, 0, NULL, NULL),
(9, 'nisanjoaquin', 'nusita@gmail.com', '$2b$10$Bt9pK.nq3czSXF03m2EqqOLX1OuPykNZQdfkMC9p6TRXKeoSHepk2', 'joaquin chulo', NULL, 5, 2250, '2025-11-30 02:38:24', '2025-12-01 01:34:59', 1, 1, '2025-12-01', '[\"2025-12-01\"]');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_achievements`
--

CREATE TABLE `user_achievements` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `achievement_id` int(11) NOT NULL,
  `unlocked_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_answers`
--

CREATE TABLE `user_answers` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `user_answer` tinyint(1) NOT NULL,
  `is_correct` tinyint(1) NOT NULL,
  `time_taken` int(11) DEFAULT NULL,
  `answered_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Volcado de datos para la tabla `user_progress`
--

INSERT INTO `user_progress` (`id`, `user_id`, `category_id`, `current_level`, `total_score`, `lives`, `last_played`) VALUES
(1, 1, 3, 1, 0, 3, '2025-11-28 23:48:31'),
(2, 1, 1, 1, 0, 3, '2025-11-28 23:48:31'),
(3, 1, 2, 1, 0, 3, '2025-11-28 23:48:31'),
(4, 2, 3, 1, 0, 3, '2025-11-28 23:50:55'),
(5, 2, 1, 1, 0, 3, '2025-11-28 23:50:55'),
(6, 2, 2, 1, 0, 3, '2025-11-28 23:50:55'),
(7, 3, 3, 1, 0, 3, '2025-11-28 23:53:29'),
(8, 3, 1, 1, 0, 3, '2025-11-28 23:53:29'),
(9, 3, 2, 1, 0, 3, '2025-11-28 23:53:29'),
(13, 5, 3, 1, 0, 3, '2025-11-29 00:43:47'),
(14, 5, 1, 1, 0, 3, '2025-11-29 00:43:47'),
(15, 5, 2, 1, 0, 3, '2025-11-29 00:43:47'),
(16, 6, 3, 1, 0, 3, '2025-11-29 00:47:21'),
(17, 6, 1, 4, 0, 3, '2025-11-29 00:59:44'),
(18, 6, 2, 3, 0, 3, '2025-11-29 01:01:02'),
(19, 7, 3, 1, 0, 3, '2025-11-29 01:12:21'),
(20, 7, 1, 1, 0, 3, '2025-11-29 01:12:21'),
(21, 7, 2, 1, 0, 3, '2025-11-29 01:12:21'),
(22, 8, 3, 1, 0, 3, '2025-11-29 01:23:40'),
(23, 8, 1, 2, 0, 3, '2025-11-29 01:28:26'),
(24, 8, 2, 1, 0, 3, '2025-11-29 01:23:40'),
(25, 9, 3, 4, 0, 2, '2025-12-01 04:18:56'),
(26, 9, 1, 7, 0, 1, '2025-12-01 04:19:21'),
(27, 9, 2, 4, 0, 2, '2025-12-01 01:37:09');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indices de la tabla `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_period_score` (`period`,`score`),
  ADD KEY `idx_category_score` (`category_id`,`score`);

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
-- Indices de la tabla `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_achievement` (`user_id`,`achievement_id`),
  ADD KEY `achievement_id` (`achievement_id`);

--
-- Indices de la tabla `user_answers`
--
ALTER TABLE `user_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_question` (`question_id`),
  ADD KEY `idx_answered_at` (`answered_at`);

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
-- AUTO_INCREMENT de la tabla `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `leaderboard`
--
ALTER TABLE `leaderboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `user_achievements`
--
ALTER TABLE `user_achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user_answers`
--
ALTER TABLE `user_answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `user_progress`
--
ALTER TABLE `user_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `leaderboard`
--
ALTER TABLE `leaderboard`
  ADD CONSTRAINT `leaderboard_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `leaderboard_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

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
-- Filtros para la tabla `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD CONSTRAINT `user_achievements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_achievements_ibfk_2` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_answers`
--
ALTER TABLE `user_answers`
  ADD CONSTRAINT `user_answers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_answers_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE;

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
