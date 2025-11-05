-- ============================================
-- Script de Ejemplo: Crear Horarios IOP
-- ============================================
-- 
-- Este script muestra cómo crear horarios para grupos IOP
-- 
-- IMPORTANTE: Reemplaza los valores según tu configuración:
-- - GROUP_ID: UUID del grupo IOP
-- - ACTIVITY_ID: UUID de la actividad IOP
-- - SUBACTIVITY_ID: UUID de la subactividad (opcional)
--
-- ============================================

-- Ejemplo: Crear horarios IOP para un grupo
-- Horarios de mañana (8:00 AM a 12:25 PM)
-- Horarios de tarde (1:00 PM a 5:25 PM)

-- HORARIOS DE MAÑANA (8:00 AM a 12:25 PM)
-- ============================================

-- Lunes - Sesión 1: 8:00 AM to 9:00 AM
INSERT INTO group_schedules (
    schedule_id,
    group_id,
    day_of_week,
    activity_id,
    subactivity_id,
    start_time,
    end_time,
    units,
    note_code,
    is_nurse_session,
    created_at,
    updated_at
) VALUES (
    uuid_generate_v4(),
    'REEMPLAZA_CON_GROUP_ID',  -- Reemplaza con el UUID del grupo IOP
    'monday',
    'REEMPLAZA_CON_ACTIVITY_ID_1',  -- Reemplaza con el UUID de la actividad IOP
    NULL,  -- O usa el UUID de la subactividad si está configurada
    '08:00:00',
    '09:00:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Lunes - Sesión 2: 9:05 AM to 10:05 AM
INSERT INTO group_schedules (
    schedule_id,
    group_id,
    day_of_week,
    activity_id,
    subactivity_id,
    start_time,
    end_time,
    units,
    note_code,
    is_nurse_session,
    created_at,
    updated_at
) VALUES (
    uuid_generate_v4(),
    'REEMPLAZA_CON_GROUP_ID',
    'monday',
    'REEMPLAZA_CON_ACTIVITY_ID_2',
    NULL,
    '09:05:00',
    '10:05:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Lunes - Sesión 3: 10:20 AM to 11:20 AM
INSERT INTO group_schedules (
    schedule_id,
    group_id,
    day_of_week,
    activity_id,
    subactivity_id,
    start_time,
    end_time,
    units,
    note_code,
    is_nurse_session,
    created_at,
    updated_at
) VALUES (
    uuid_generate_v4(),
    'REEMPLAZA_CON_GROUP_ID',
    'monday',
    'REEMPLAZA_CON_ACTIVITY_ID_3',
    NULL,
    '10:20:00',
    '11:20:00',
    1.00,
    NULL,
    FALSE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Lunes - Sesión 4: 11:25 AM to 12:25 PM
INSERT INTO group_schedules (
    schedule_id,
    group_id,
    day_of_week,
    activity_id,
    subactivity_id,
    start_time,
    end_time,
    units,
    note_code,
    is_nurse_session,
    created_at,
    updated_at
) VALUES (
    uuid_generate_v4(),
    'REEMPLAZA_CON_GROUP_ID',
    'monday',
    'REEMPLAZA_CON_ACTIVITY_ID_4',
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
-- Repetir para los demás días de la semana:
-- - tuesday
-- - wednesday
-- - thursday
-- - friday
-- - saturday (si aplica para IOP)
-- ============================================

-- HORARIOS DE TARDE (1:00 PM a 5:25 PM)
-- ============================================
-- Si el grupo IOP es de tarde, usar estos horarios:

-- Lunes - Sesión 1: 1:00 PM to 2:00 PM
-- INSERT INTO group_schedules (...) VALUES (... '13:00:00', '14:00:00', ...);

-- Lunes - Sesión 2: 2:05 PM to 3:05 PM
-- INSERT INTO group_schedules (...) VALUES (... '14:05:00', '15:05:00', ...);

-- Lunes - Sesión 3: 3:20 PM to 4:20 PM
-- INSERT INTO group_schedules (...) VALUES (... '15:20:00', '16:20:00', ...);

-- Lunes - Sesión 4: 4:25 PM to 5:25 PM
-- INSERT INTO group_schedules (...) VALUES (... '16:25:00', '17:25:00', ...);

-- ============================================
-- QUERIES ÚTILES PARA OBTENER IDs
-- ============================================

-- Ver grupos IOP disponibles:
-- SELECT group_id, group_name, program_type FROM groups WHERE program_type = 'IOP';

-- Ver actividades IOP disponibles:
-- SELECT activity_id, activity_name, activity_type FROM activities WHERE activity_type = 'IOP';

-- Ver subactividades de una actividad IOP:
-- SELECT subactivity_id, subactivity_name, activity_id 
-- FROM subactivities 
-- WHERE activity_id = 'ACTIVITY_ID_AQUI';

-- Ver horarios existentes de un grupo:
-- SELECT schedule_id, day_of_week, start_time, end_time, units 
-- FROM group_schedules 
-- WHERE group_id = 'GROUP_ID_AQUI' 
-- ORDER BY day_of_week, start_time;

