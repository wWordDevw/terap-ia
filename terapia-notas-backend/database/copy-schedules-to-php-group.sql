-- Copiar horarios del grupo IOP al grupo PHP
-- Grupo origen (IOP): de08194c-9edd-4d2d-bb7a-5576eff3956d
-- Grupo destino (PHP): 81a01050-1b2c-4da4-9db3-ce4debb41fd0

-- LUNES (MONDAY) - 4 horarios
INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'monday', '08:00:00', '09:00:00', 1.00, '561aaf50-9fc1-45e2-8fad-48cd0d41de23', NULL, NOW(), NOW());

INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'monday', '09:05:00', '10:05:00', 1.00, 'ae6c15ae-4d95-42c5-8d02-f1e11e904554', NULL, NOW(), NOW());

INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'monday', '10:20:00', '11:20:00', 1.00, '4fd66edc-1c8f-44a1-8663-2a9bc289439b', NULL, NOW(), NOW());

INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'monday', '11:25:00', '12:25:00', 1.00, '1ad70234-85cd-4179-9c51-89c24a7316cd', NULL, NOW(), NOW());

-- MARTES (TUESDAY) - 4 horarios
INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'tuesday', '08:00:00', '09:00:00', 1.00, 'b7b4ebbb-7c93-4424-b9a1-cc16d1e2a9fc', NULL, NOW(), NOW());

INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'tuesday', '09:05:00', '10:05:00', 1.00, 'fc3a1577-9427-42f0-9672-7cc4df86f9bd', NULL, NOW(), NOW());

INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'tuesday', '10:20:00', '11:20:00', 1.00, '76b2b0f5-e437-414d-a1d7-60b02b5861e1', NULL, NOW(), NOW());

INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'tuesday', '11:25:00', '12:25:00', 1.00, 'e83c259b-a0dc-4584-a4fe-def8e79cf8a0', NULL, NOW(), NOW());

-- MIÉRCOLES (WEDNESDAY) - 4 horarios
INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'wednesday', '08:00:00', '09:00:00', 1.00, 'de2bd1fe-e655-46a3-949d-d930745b6195', NULL, NOW(), NOW());

INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'wednesday', '09:05:00', '10:05:00', 1.00, 'b85259b1-ec56-48fb-ba11-1925aaaae1e4', NULL, NOW(), NOW());

INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'wednesday', '10:20:00', '11:20:00', 1.00, 'f9b86985-0816-4ad8-9b66-7c15384e54d7', NULL, NOW(), NOW());

INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'wednesday', '11:25:00', '12:25:00', 1.00, '561aaf50-9fc1-45e2-8fad-48cd0d41de23', NULL, NOW(), NOW());

-- JUEVES (THURSDAY) - 4 horarios
INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'thursday', '08:00:00', '09:00:00', 1.00, 'aaeee329-7165-4dba-ad93-890887bb9bdd', NULL, NOW(), NOW());

INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'thursday', '09:05:00', '10:05:00', 1.00, 'ae6c15ae-4d95-42c5-8d02-f1e11e904554', NULL, NOW(), NOW());

INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'thursday', '10:20:00', '11:20:00', 1.00, '4fd66edc-1c8f-44a1-8663-2a9bc289439b', NULL, NOW(), NOW());

INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'thursday', '11:25:00', '12:25:00', 1.00, '1ad70234-85cd-4179-9c51-89c24a7316cd', NULL, NOW(), NOW());

-- VIERNES (FRIDAY) - 4 horarios
INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'friday', '08:00:00', '09:00:00', 1.00, '561aaf50-9fc1-45e2-8fad-48cd0d41de23', NULL, NOW(), NOW());

INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'friday', '09:05:00', '10:05:00', 1.00, 'b7b4ebbb-7c93-4424-b9a1-cc16d1e2a9fc', NULL, NOW(), NOW());

INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'friday', '10:20:00', '11:20:00', 1.00, 'de2bd1fe-e655-46a3-949d-d930745b6195', NULL, NOW(), NOW());

INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
VALUES (gen_random_uuid(), '81a01050-1b2c-4da4-9db3-ce4debb41fd0', 'friday', '11:25:00', '12:25:00', 1.00, '76b2b0f5-e437-414d-a1d7-60b02b5861e1', NULL, NOW(), NOW());

