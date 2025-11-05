-- =============================================
-- VISTAS - TERAPIA NOTA
-- PostgreSQL 16
-- =============================================

-- Vista de pacientes activos con su información completa
CREATE OR REPLACE VIEW v_active_patients AS
SELECT
    p.patient_id,
    p.patient_number,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    p.date_of_birth,
    p.admission_date,
    p.discharge_date,
    COALESCE(p.discharge_date, CURRENT_DATE) - p.admission_date AS days_in_program,
    c.clinic_name,
    pd.icd10_code AS primary_diagnosis,
    pd.diagnosis_description
FROM patients p
JOIN clinics c ON p.clinic_id = c.clinic_id
LEFT JOIN patient_diagnoses pd ON p.patient_id = pd.patient_id AND pd.is_primary = TRUE
WHERE p.is_active = TRUE;

COMMENT ON VIEW v_active_patients IS 'Vista de pacientes activos con información completa';

-- Vista de próximos MTRPs pendientes
CREATE OR REPLACE VIEW v_upcoming_mtprs AS
SELECT
    ms.mtpr_schedule_id,
    ms.patient_id,
    p.patient_number,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    ms.review_number,
    ms.scheduled_date,
    ms.scheduled_date - CURRENT_DATE AS days_until_due,
    ms.is_completed
FROM mtpr_schedules ms
JOIN patients p ON ms.patient_id = p.patient_id
WHERE ms.is_completed = FALSE
  AND ms.scheduled_date >= CURRENT_DATE
ORDER BY ms.scheduled_date;

COMMENT ON VIEW v_upcoming_mtprs IS 'Vista de próximos MTRPs pendientes (RF-018)';

-- Vista de asistencia semanal
CREATE OR REPLACE VIEW v_weekly_attendance AS
SELECT
    gw.week_id,
    gw.group_id,
    g.program_type,
    gw.week_number,
    gw.start_date,
    gw.end_date,
    a.patient_id,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    a.attendance_date,
    a.status,
    a.units_attended
FROM group_weeks gw
JOIN groups g ON gw.group_id = g.group_id
JOIN attendance a ON gw.week_id = a.week_id
JOIN patients p ON a.patient_id = p.patient_id
ORDER BY gw.start_date, a.attendance_date, p.last_name;

COMMENT ON VIEW v_weekly_attendance IS 'Vista de asistencia semanal completa';

-- Vista de pacientes por grupo y semana
CREATE OR REPLACE VIEW v_group_week_patients AS
SELECT
    gw.week_id,
    gw.group_id,
    g.program_type,
    g.shift,
    gw.week_number,
    gw.start_date,
    gw.end_date,
    p.patient_id,
    p.patient_number,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    p.discharge_date,
    CASE
        WHEN p.discharge_date IS NOT NULL AND p.discharge_date <= gw.start_date THEN 'discharged'
        WHEN p.discharge_date IS NOT NULL AND p.discharge_date BETWEEN gw.start_date AND gw.end_date THEN 'discharging'
        ELSE 'active'
    END AS patient_status
FROM group_weeks gw
JOIN groups g ON gw.group_id = g.group_id
JOIN group_patients gp ON gw.group_id = gp.group_id
JOIN patients p ON gp.patient_id = p.patient_id
WHERE gp.is_active = TRUE
ORDER BY gw.start_date, p.last_name, p.first_name;

COMMENT ON VIEW v_group_week_patients IS 'Pacientes por grupo y semana (RF-005, RF-006)';

-- Vista de horarios de grupo
CREATE OR REPLACE VIEW v_group_schedules AS
SELECT
    gs.schedule_id,
    gs.group_id,
    g.program_type,
    g.shift,
    gs.day_of_week,
    a.activity_name,
    sa.subactivity_name,
    gs.start_time,
    gs.end_time,
    gs.units,
    gs.is_nurse_session,
    gs.note_code
FROM group_schedules gs
JOIN groups g ON gs.group_id = g.group_id
JOIN activities a ON gs.activity_id = a.activity_id
LEFT JOIN subactivities sa ON gs.subactivity_id = sa.subactivity_id
ORDER BY
    gs.group_id,
    CASE gs.day_of_week
        WHEN 'monday' THEN 1
        WHEN 'tuesday' THEN 2
        WHEN 'wednesday' THEN 3
        WHEN 'thursday' THEN 4
        WHEN 'friday' THEN 5
        WHEN 'saturday' THEN 6
        WHEN 'sunday' THEN 7
    END,
    gs.start_time;

COMMENT ON VIEW v_group_schedules IS 'Vista de horarios de grupo ordenados por día y hora';

-- Vista de metas de pacientes
CREATE OR REPLACE VIEW v_patient_goals AS
SELECT
    p.patient_id,
    p.patient_number,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    pg.goal_number,
    pg.goal_text
FROM patients p
JOIN patient_goals pg ON p.patient_id = pg.patient_id
WHERE p.is_active = TRUE
ORDER BY p.last_name, p.first_name, pg.goal_number;

COMMENT ON VIEW v_patient_goals IS 'Vista de metas de pacientes (RF-004, RF-013)';

-- Vista de diagnósticos de pacientes
CREATE OR REPLACE VIEW v_patient_diagnoses AS
SELECT
    p.patient_id,
    p.patient_number,
    CONCAT(p.first_name, ' ', p.last_name) AS patient_name,
    pd.diagnosis_id,
    pd.icd10_code,
    pd.diagnosis_description,
    pd.is_primary
FROM patients p
JOIN patient_diagnoses pd ON p.patient_id = pd.patient_id
WHERE p.is_active = TRUE
ORDER BY p.last_name, p.first_name, pd.is_primary DESC;

COMMENT ON VIEW v_patient_diagnoses IS 'Vista de diagnósticos de pacientes (RF-004, RF-021)';
