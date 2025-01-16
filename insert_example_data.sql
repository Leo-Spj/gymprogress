-- Insertar usuarios
INSERT INTO users (id, name, email, password) VALUES
(1, 'Leonardo', 'leo@email.com', 'gymprogress'),
(2, 'Valeria', 'vale@email.com', 'gymprogress');

-- Insertar ejercicios para Juan (user_id = 1)
INSERT INTO exercises (id, user_id, name, type) VALUES
(1, 1, 'Press de banca', 'pecho'),
(2, 1, 'Sentadillas', 'piernas'),
(3, 1, 'Dominadas', 'espalda');

-- Insertar ejercicios para María (user_id = 2)
INSERT INTO exercises (id, user_id, name, type) VALUES
(4, 2, 'Peso muerto', 'espalda'),
(5, 2, 'Curl de bíceps', 'brazos'),
(6, 2, 'Zancadas', 'piernas');

-- Insertar workouts para los ejercicios de Juan
INSERT INTO workouts (id, user_id, workout_date) VALUES
(1, 1, '2023-11-01'), (2, 1, '2023-11-03'), (3, 1, '2023-11-05'), (4, 1, '2023-11-07'),
(5, 1, '2023-11-02'), (6, 1, '2023-11-04'), (7, 1, '2023-11-06'), (8, 1, '2023-11-08'),
(9, 1, '2023-11-01'), (10, 1, '2023-11-03'), (11, 1, '2023-11-05'), (12, 1, '2023-11-07');

-- Insertar workouts para los ejercicios de María
INSERT INTO workouts (id, user_id, workout_date) VALUES
(13, 2, '2023-11-01'), (14, 2, '2023-11-03'), (15, 2, '2023-11-05'), (16, 2, '2023-11-07'),
(17, 2, '2023-11-02'), (18, 2, '2023-11-04'), (19, 2, '2023-11-06'), (20, 2, '2023-11-08'),
(21, 2, '2023-11-01'), (22, 2, '2023-11-03'), (23, 2, '2023-11-05'), (24, 2, '2023-11-07');

-- Insertar series para los ejercicios de Juan
INSERT INTO workout_sets (workout_id, exercise_id, reps, weight) VALUES
-- Press de banca (exercise_id = 1)
(1, 1, 12, 60), (1, 1, 10, 65), (1, 1, 8, 70),
(2, 1, 12, 62.5), (2, 1, 10, 67.5), (2, 1, 8, 72.5),
(3, 1, 12, 65), (3, 1, 10, 70), (3, 1, 8, 75),
(4, 1, 12, 67.5), (4, 1, 10, 72.5), (4, 1, 8, 77.5),

-- Sentadillas (exercise_id = 2)
(5, 2, 15, 80), (5, 2, 12, 85), (5, 2, 10, 90),
(6, 2, 15, 82.5), (6, 2, 12, 87.5), (6, 2, 10, 92.5),
(7, 2, 15, 85), (7, 2, 12, 90), (7, 2, 10, 95),
(8, 2, 15, 87.5), (8, 2, 12, 92.5), (8, 2, 10, 97.5),

-- Dominadas (exercise_id = 3)
(9, 3, 10, 0), (9, 3, 8, 0), (9, 3, 6, 0),
(10, 3, 10, 5), (10, 3, 8, 5), (10, 3, 6, 5),
(11, 3, 10, 10), (11, 3, 8, 10), (11, 3, 6, 10),
(12, 3, 10, 15), (12, 3, 8, 15), (12, 3, 6, 15);

-- Insertar series para los ejercicios de María
INSERT INTO workout_sets (workout_id, exercise_id, reps, weight) VALUES
-- Peso muerto (exercise_id = 4)
(13, 4, 12, 70), (13, 4, 10, 75), (13, 4, 8, 80),
(14, 4, 12, 72.5), (14, 4, 10, 77.5), (14, 4, 8, 82.5),
(15, 4, 12, 75), (15, 4, 10, 80), (15, 4, 8, 85),
(16, 4, 12, 77.5), (16, 4, 10, 82.5), (16, 4, 8, 87.5),

-- Curl de bíceps (exercise_id = 5)
(17, 5, 15, 20), (17, 5, 12, 22.5), (17, 5, 10, 25),
(18, 5, 15, 22.5), (18, 5, 12, 25), (18, 5, 10, 27.5),
(19, 5, 15, 25), (19, 5, 12, 27.5), (19, 5, 10, 30),
(20, 5, 15, 27.5), (20, 5, 12, 30), (20, 5, 10, 32.5),

-- Zancadas (exercise_id = 6)
(21, 6, 12, 40), (21, 6, 10, 45), (21, 6, 8, 50),
(22, 6, 12, 42.5), (22, 6, 10, 47.5), (22, 6, 8, 52.5),
(23, 6, 12, 45), (23, 6, 10, 50), (23, 6, 8, 55),
(24, 6, 12, 47.5), (24, 6, 10, 52.5), (24, 6, 8, 57.5);
