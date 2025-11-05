-- =============================================
-- Buscar grupo PHP con requisitos para generar notas semanales
-- =============================================

-- 1. Buscar grupos PHP con al menos 4 pacientes activos
SELECT 
    g.group_id,
    g.group_name,
    g.program_type,
    g.shift,
    g.start_date,
    COUNT(gp.group_patient_id) AS total_patients
FROM groups g
JOIN group_patients gp ON g.group_id = gp.group_id
WHERE g.program_type = 'PHP'
  AND g.is_active = TRUE
  AND gp.is_active = TRUE
GROUP BY g.group_id, g.group_name, g.program_type, g.shift, g.start_date
HAVING COUNT(gp.group_patient_id) >= 4
ORDER BY g.created_at DESC
LIMIT 10;

-- 2. Verificar que el grupo tenga schedule definida (al menos 4 actividades por día)
SELECT 
    g.group_id,
    g.group_name,
    gs.day_of_week,
    COUNT(gs.schedule_id) AS activities_count
FROM groups g
JOIN group_schedules gs ON g.group_id = gs.group_id
WHERE g.program_type = 'PHP'
  AND g.is_active = TRUE
GROUP BY g.group_id, g.group_name, gs.day_of_week
HAVING COUNT(gs.schedule_id) >= 4
ORDER BY g.group_id, 
    CASE gs.day_of_week
        WHEN 'monday' THEN 1
        WHEN 'tuesday' THEN 2
        WHEN 'wednesday' THEN 3
        WHEN 'thursday' THEN 4
        WHEN 'friday' THEN 5
        ELSE 6
    END;

-- 3. Verificar que tenga asistencia (presentes y ausentes) para una semana
SELECT 
    gw.week_id,
    gw.group_id,
    g.group_name,
    gw.week_number,
    gw.start_date,
    gw.end_date,
    COUNT(DISTINCT a.patient_id) AS patients_with_attendance,
    COUNT(CASE WHEN a.status = 'P' THEN 1 END) AS present_count,
    COUNT(CASE WHEN a.status = 'A' THEN 1 END) AS absent_count
FROM group_weeks gw
JOIN groups g ON gw.group_id = g.group_id
JOIN attendance a ON gw.week_id = a.week_id
WHERE g.program_type = 'PHP'
  AND g.is_active = TRUE
GROUP BY gw.week_id, gw.group_id, g.group_name, gw.week_number, gw.start_date, gw.end_date
HAVING COUNT(CASE WHEN a.status = 'P' THEN 1 END) > 0
   AND COUNT(CASE WHEN a.status = 'A' THEN 1 END) > 0
ORDER BY gw.start_date DESC
LIMIT 10;

-- 4. Consulta completa: Grupo PHP con todos los requisitos
WITH valid_groups AS (
    SELECT 
        g.group_id,
        g.group_name,
        g.program_type,
        g.shift
    FROM groups g
    JOIN group_patients gp ON g.group_id = gp.group_id
    WHERE g.program_type = 'PHP'
      AND g.is_active = TRUE
      AND gp.is_active = TRUE
    GROUP BY g.group_id, g.group_name, g.program_type, g.shift
    HAVING COUNT(gp.group_patient_id) >= 4
),
groups_with_schedule AS (
    SELECT DISTINCT
        g.group_id
    FROM groups g
    JOIN group_schedules gs ON g.group_id = gs.group_id
    WHERE g.group_id IN (SELECT group_id FROM valid_groups)
    GROUP BY g.group_id, gs.day_of_week
    HAVING COUNT(gs.schedule_id) >= 4
),
groups_with_attendance AS (
    SELECT DISTINCT
        gw.group_id,
        gw.week_id,
        gw.week_number,
        gw.start_date,
        gw.end_date
    FROM group_weeks gw
    JOIN attendance a ON gw.week_id = a.week_id
    WHERE gw.group_id IN (SELECT group_id FROM valid_groups)
    GROUP BY gw.group_id, gw.week_id, gw.week_number, gw.start_date, gw.end_date
    HAVING COUNT(CASE WHEN a.status = 'P' THEN 1 END) > 0
       AND COUNT(CASE WHEN a.status = 'A' THEN 1 END) > 0
)
SELECT 
    vg.group_id,
    vg.group_name,
    vg.program_type,
    vg.shift,
    gwa.week_id,
    gwa.week_number,
    gwa.start_date AS week_start,
    gwa.end_date AS week_end,
    (SELECT COUNT(*) FROM group_patients gp WHERE gp.group_id = vg.group_id AND gp.is_active = TRUE) AS total_patients,
    (SELECT COUNT(*) FROM attendance a WHERE a.week_id = gwa.week_id AND a.status = 'P') AS present_count,
    (SELECT COUNT(*) FROM attendance a WHERE a.week_id = gwa.week_id AND a.status = 'A') AS absent_count
FROM valid_groups vg
JOIN groups_with_schedule gws ON vg.group_id = gws.group_id
JOIN groups_with_attendance gwa ON vg.group_id = gwa.group_id
ORDER BY gwa.start_date DESC
LIMIT 5;

-- 5. Ver estructura de actividades para un grupo específico
-- Reemplazar 'GROUP_ID_AQUI' con el group_id encontrado
/*
SELECT 
    gs.day_of_week,
    a.activity_name,
    sa.subactivity_name,
    gs.start_time,
    gs.end_time,
    gs.units,
    ap.paragraph_text
FROM group_schedules gs
JOIN activities a ON gs.activity_id = a.activity_id
LEFT JOIN subactivities sa ON gs.subactivity_id = sa.subactivity_id
LEFT JOIN activity_paragraphs ap ON sa.subactivity_id = ap.subactivity_id
WHERE gs.group_id = 'GROUP_ID_AQUI'
ORDER BY 
    CASE gs.day_of_week
        WHEN 'monday' THEN 1
        WHEN 'tuesday' THEN 2
        WHEN 'wednesday' THEN 3
        WHEN 'thursday' THEN 4
        WHEN 'friday' THEN 5
        ELSE 6
    END,
    gs.start_time;
*/


