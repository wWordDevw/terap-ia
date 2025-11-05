-- ============================================
-- Script: Crear Horarios IOP para Grupo
-- ============================================
-- 
-- Este script crea los horarios para un grupo IOP
-- 
-- IMPORTANTE: 
-- - Reemplaza 'de08194c-9edd-4d2d-bb7a-5576eff3956d' con el UUID del grupo IOP real
-- - Ajusta los ACTIVITY_ID según las actividades que quieras asignar
-- - Configura los horarios según el turno (Mañana o Tarde)
--
-- ============================================

-- Grupo IOP para configurar
-- GROUP_ID: de08194c-9edd-4d2d-bb7a-5576eff3956d

-- ============================================
-- HORARIOS DE MAÑANA (8:00 AM a 12:25 PM)
-- ============================================
-- Para grupos IOP de turno Mañana

-- LUNES - 4 sesiones
-- ============================================

-- Sesión 1: 8:00 AM to 9:00 AM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',  -- GROUP_ID del grupo IOP
    'monday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Life Skills' AND activity_type = 'IOP' LIMIT 1),  -- Activity: Life Skills
    NULL,  -- Subactividad (opcional, se puede configurar después)
    '08:00:00',  -- 8:00 AM
    '09:00:00',  -- 9:00 AM
    1.00,  -- 1 unidad
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Sesión 2: 9:05 AM to 10:05 AM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'monday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Self-Esteem' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '09:05:00',  -- 9:05 AM
    '10:05:00',  -- 10:05 AM
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Sesión 3: 10:20 AM to 11:20 AM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'monday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Health Management Addiction' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '10:20:00',  -- 10:20 AM
    '11:20:00',  -- 11:20 AM
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Sesión 4: 11:25 AM to 12:25 PM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'monday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Healthy Living' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '11:25:00',  -- 11:25 AM
    '12:25:00',  -- 12:25 PM
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- MARTES - 4 sesiones
-- ============================================

-- Sesión 1: 8:00 AM to 9:00 AM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'tuesday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Goal Setting' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '08:00:00',
    '09:00:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Sesión 2: 9:05 AM to 10:05 AM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'tuesday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Interpersonal Skills' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '09:05:00',
    '10:05:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Sesión 3: 10:20 AM to 11:20 AM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'tuesday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Stress Management' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '10:20:00',
    '11:20:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Sesión 4: 11:25 AM to 12:25 PM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'tuesday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Coping Skills' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '11:25:00',
    '12:25:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- MIÉRCOLES - 4 sesiones
-- ============================================

-- Sesión 1: 8:00 AM to 9:00 AM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'wednesday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Communication Skills' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '08:00:00',
    '09:00:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Sesión 2: 9:05 AM to 10:05 AM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'wednesday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Problem Solving' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '09:05:00',
    '10:05:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Sesión 3: 10:20 AM to 11:20 AM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'wednesday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Emotional Intelligence' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '10:20:00',
    '11:20:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Sesión 4: 11:25 AM to 12:25 PM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'wednesday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Life Skills' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '11:25:00',
    '12:25:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- JUEVES - 4 sesiones
-- ============================================

-- Sesión 1: 8:00 AM to 9:00 AM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'thursday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Mindfulness Meditation' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '08:00:00',
    '09:00:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Sesión 2: 9:05 AM to 10:05 AM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'thursday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Self-Esteem' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '09:05:00',
    '10:05:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Sesión 3: 10:20 AM to 11:20 AM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'thursday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Health Management Addiction' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '10:20:00',
    '11:20:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Sesión 4: 11:25 AM to 12:25 PM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'thursday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Healthy Living' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '11:25:00',
    '12:25:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- VIERNES - 4 sesiones
-- ============================================

-- Sesión 1: 8:00 AM to 9:00 AM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'friday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Life Skills' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '08:00:00',
    '09:00:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Sesión 2: 9:05 AM to 10:05 AM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'friday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Goal Setting' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '09:05:00',
    '10:05:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Sesión 3: 10:20 AM to 11:20 AM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'friday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Communication Skills' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '10:20:00',
    '11:20:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Sesión 4: 11:25 AM to 12:25 PM
INSERT INTO group_schedules (
    schedule_id, group_id, day_of_week, activity_id, subactivity_id,
    start_time, end_time, units, note_code, is_nurse_session, created_at, updated_at
) VALUES (
    uuid_generate_v4(),
    'de08194c-9edd-4d2d-bb7a-5576eff3956d',
    'friday',
    (SELECT activity_id FROM activities WHERE activity_name = 'Stress Management' AND activity_type = 'IOP' LIMIT 1),
    NULL,
    '11:25:00',
    '12:25:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- ============================================
-- VERIFICACIÓN
-- ============================================

-- Verificar horarios creados:
-- SELECT schedule_id, day_of_week, start_time, end_time, units,
--        (SELECT activity_name FROM activities WHERE activity_id = gs.activity_id) as activity_name
-- FROM group_schedules gs
-- WHERE group_id = 'de08194c-9edd-4d2d-bb7a-5576eff3956d'
-- ORDER BY day_of_week, start_time;

-- Contar horarios por día:
-- SELECT day_of_week, COUNT(*) as total_schedules
-- FROM group_schedules
-- WHERE group_id = 'de08194c-9edd-4d2d-bb7a-5576eff3956d'
-- GROUP BY day_of_week
-- ORDER BY day_of_week;

