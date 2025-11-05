-- =============================================
-- TRIGGERS DE DISCHARGE - TERAPIA NOTA
-- PostgreSQL 16
-- Implementación de RF-012: Prevenir asistencia post-alta
-- =============================================

-- =============================================
-- 1. TRIGGER: Prevenir asistencia después de discharge
-- RF-012: No se permite registrar asistencia después del alta
-- =============================================

CREATE OR REPLACE FUNCTION prevent_post_discharge_attendance()
RETURNS TRIGGER AS $$
DECLARE
    v_discharge_date DATE;
    v_patient_name TEXT;
BEGIN
    -- Obtener fecha de discharge del paciente
    SELECT discharge_date, first_name || ' ' || last_name
    INTO v_discharge_date, v_patient_name
    FROM patients
    WHERE patient_id = NEW.patient_id;

    -- Validar que no se registre asistencia después del alta
    IF v_discharge_date IS NOT NULL AND NEW.attendance_date > v_discharge_date THEN
        RAISE EXCEPTION
            'No se puede registrar asistencia después de la fecha de alta. Paciente: %, Fecha alta: %, Fecha asistencia: % (RF-012)',
            v_patient_name,
            v_discharge_date,
            NEW.attendance_date;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_post_discharge_attendance
BEFORE INSERT OR UPDATE ON attendance
FOR EACH ROW
EXECUTE FUNCTION prevent_post_discharge_attendance();

COMMENT ON FUNCTION prevent_post_discharge_attendance() IS
'RF-012: Previene el registro de asistencia después de la fecha de alta del paciente';

-- =============================================
-- 2. TRIGGER: Auto-marcar asistencia "D" al dar de alta
-- RF-012: Crear automáticamente registro de asistencia con status "D"
-- cuando se marca discharge_date
-- =============================================

CREATE OR REPLACE FUNCTION auto_mark_discharge_attendance()
RETURNS TRIGGER AS $$
DECLARE
    v_week_id UUID;
    v_group_id UUID;
BEGIN
    -- Solo ejecutar cuando se establece discharge_date por primera vez
    IF NEW.discharge_date IS NOT NULL AND (OLD.discharge_date IS NULL OR OLD.discharge_date <> NEW.discharge_date) THEN

        -- Buscar la semana activa del grupo del paciente en la fecha de discharge
        SELECT gw.week_id, gw.group_id
        INTO v_week_id, v_group_id
        FROM group_weeks gw
        INNER JOIN group_patients gp ON gp.group_id = gw.group_id
        WHERE gp.patient_id = NEW.patient_id
          AND gw.start_date <= NEW.discharge_date
          AND gw.end_date >= NEW.discharge_date
          AND gp.is_active = true
        ORDER BY gw.start_date DESC
        LIMIT 1;

        -- Si se encontró una semana activa, crear registro de asistencia "D"
        IF v_week_id IS NOT NULL THEN
            INSERT INTO attendance (
                week_id,
                patient_id,
                attendance_date,
                status,
                units_attended,
                notes
            )
            VALUES (
                v_week_id,
                NEW.patient_id,
                NEW.discharge_date,
                'D', -- D = Discharged
                0.00,
                'Auto-generated: Patient discharged on this date'
            )
            ON CONFLICT (week_id, patient_id, attendance_date)
            DO UPDATE SET
                status = 'D',
                units_attended = 0.00,
                notes = COALESCE(attendance.notes || ' | ', '') || 'Updated: Patient discharged';

            RAISE NOTICE 'Auto-created discharge attendance for patient % on %', NEW.patient_id, NEW.discharge_date;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_mark_discharge_attendance
AFTER INSERT OR UPDATE ON patients
FOR EACH ROW
WHEN (NEW.discharge_date IS NOT NULL)
EXECUTE FUNCTION auto_mark_discharge_attendance();

COMMENT ON FUNCTION auto_mark_discharge_attendance() IS
'RF-012: Crea automáticamente un registro de asistencia con status "D" cuando se marca la fecha de alta del paciente';

-- =============================================
-- FIN DE TRIGGERS DE DISCHARGE
-- =============================================
