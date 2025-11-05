-- =============================================
-- TRIGGERS Y FUNCIONES - TERAPIA NOTA
-- PostgreSQL 16
-- =============================================

-- =============================================
-- 1. TRIGGER: Calcular fechas de MTPR al crear paciente
-- RF-018, RF-041
-- =============================================

CREATE OR REPLACE FUNCTION calculate_mtpr_dates()
RETURNS TRIGGER AS $$
DECLARE
    first_mtpr_date DATE;
    next_mtpr_date DATE;
    period_start DATE;
    i INTEGER;
    max_reviews INTEGER := 10; -- Máximo de MTRPs a crear anticipadamente
BEGIN
    -- Calcular primer MTPR (18 días después de admission_date)
    first_mtpr_date := NEW.admission_date + INTERVAL '18 days';

    -- Asegurarse que sea día hábil (lunes a sábado, no domingo)
    WHILE EXTRACT(DOW FROM first_mtpr_date) = 0 LOOP -- 0 = Domingo
        first_mtpr_date := first_mtpr_date + INTERVAL '1 day';
    END LOOP;

    -- Insertar primer MTPR
    INSERT INTO mtpr_schedules (patient_id, review_number, scheduled_date)
    VALUES (NEW.patient_id, 1, first_mtpr_date);

    -- Insertar primer multidisciplinary
    INSERT INTO multidisciplinary_schedules (
        patient_id,
        mtpr_schedule_id,
        review_number,
        period_start_date,
        period_end_date
    )
    SELECT
        NEW.patient_id,
        mtpr_schedule_id,
        1,
        NEW.admission_date,
        first_mtpr_date
    FROM mtpr_schedules
    WHERE patient_id = NEW.patient_id AND review_number = 1;

    -- Calcular siguientes MTRPs (cada 30 días)
    period_start := first_mtpr_date;

    FOR i IN 2..max_reviews LOOP
        -- Calcular siguiente fecha (30 días después del anterior)
        next_mtpr_date := first_mtpr_date + ((i - 1) * INTERVAL '30 days');

        -- Si hay discharge_date y ya pasamos esa fecha, salir del loop
        IF NEW.discharge_date IS NOT NULL AND next_mtpr_date >= NEW.discharge_date THEN
            EXIT;
        END IF;

        -- Ajustar si cae en domingo
        WHILE EXTRACT(DOW FROM next_mtpr_date) = 0 LOOP
            next_mtpr_date := next_mtpr_date + INTERVAL '1 day';
        END LOOP;

        -- Insertar MTPR
        INSERT INTO mtpr_schedules (patient_id, review_number, scheduled_date)
        VALUES (NEW.patient_id, i, next_mtpr_date);

        -- Insertar multidisciplinary correspondiente
        INSERT INTO multidisciplinary_schedules (
            patient_id,
            mtpr_schedule_id,
            review_number,
            period_start_date,
            period_end_date
        )
        SELECT
            NEW.patient_id,
            mtpr_schedule_id,
            i,
            period_start,
            next_mtpr_date
        FROM mtpr_schedules
        WHERE patient_id = NEW.patient_id AND review_number = i;

        -- Actualizar period_start para el siguiente
        period_start := next_mtpr_date;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_patient_insert
AFTER INSERT ON patients
FOR EACH ROW
EXECUTE FUNCTION calculate_mtpr_dates();

COMMENT ON FUNCTION calculate_mtpr_dates() IS 'Calcula automáticamente fechas de MTPR: primer MTPR a los 18 días, siguientes cada 30 días (RF-018, RF-041)';

-- =============================================
-- 2. TRIGGER: Bloquear modificación de asistencia
-- RF-009
-- =============================================

CREATE OR REPLACE FUNCTION prevent_locked_attendance_update()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.is_locked = TRUE THEN
        RAISE EXCEPTION 'No se puede modificar una asistencia ya registrada (RF-009)';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_before_attendance_update
BEFORE UPDATE ON attendance
FOR EACH ROW
EXECUTE FUNCTION prevent_locked_attendance_update();

COMMENT ON FUNCTION prevent_locked_attendance_update() IS 'Bloquea cambios en asistencia una vez registrada (RF-009)';

-- =============================================
-- 3. TRIGGER: Marcar automáticamente discharge en asistencia
-- RF-006, RF-042
-- =============================================

CREATE OR REPLACE FUNCTION auto_mark_discharge_attendance()
RETURNS TRIGGER AS $$
DECLARE
    patient_discharge DATE;
BEGIN
    -- Obtener fecha de discharge del paciente
    SELECT discharge_date INTO patient_discharge
    FROM patients
    WHERE patient_id = NEW.patient_id;

    -- Si la fecha de asistencia es >= discharge_date, marcar como D
    IF patient_discharge IS NOT NULL AND NEW.attendance_date >= patient_discharge THEN
        NEW.status := 'D';
        NEW.units_attended := 0;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_before_attendance_insert
BEFORE INSERT ON attendance
FOR EACH ROW
EXECUTE FUNCTION auto_mark_discharge_attendance();

COMMENT ON FUNCTION auto_mark_discharge_attendance() IS 'Marca automáticamente con D la asistencia en fecha de discharge y posteriores (RF-006, RF-042)';

-- =============================================
-- 4. TRIGGER: Auditoría de cambios en pacientes
-- =============================================

CREATE OR REPLACE FUNCTION audit_patient_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_log (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values
    )
    VALUES (
        NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID,
        'UPDATE',
        'patients',
        NEW.patient_id,
        jsonb_build_object(
            'first_name', OLD.first_name,
            'last_name', OLD.last_name,
            'discharge_date', OLD.discharge_date,
            'is_active', OLD.is_active
        ),
        jsonb_build_object(
            'first_name', NEW.first_name,
            'last_name', NEW.last_name,
            'discharge_date', NEW.discharge_date,
            'is_active', NEW.is_active
        )
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_patient_update
AFTER UPDATE ON patients
FOR EACH ROW
EXECUTE FUNCTION audit_patient_changes();

COMMENT ON FUNCTION audit_patient_changes() IS 'Registra cambios en pacientes para auditoría';

-- =============================================
-- 5. TRIGGER: Actualizar timestamp automáticamente
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER trg_update_clinics_updated_at
BEFORE UPDATE ON clinics
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_update_groups_updated_at
BEFORE UPDATE ON groups
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_update_group_weeks_updated_at
BEFORE UPDATE ON group_weeks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_update_patients_updated_at
BEFORE UPDATE ON patients
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_update_patient_goals_updated_at
BEFORE UPDATE ON patient_goals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_update_attendance_updated_at
BEFORE UPDATE ON attendance
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_update_mtpr_schedules_updated_at
BEFORE UPDATE ON mtpr_schedules
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_update_multi_schedules_updated_at
BEFORE UPDATE ON multidisciplinary_schedules
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

COMMENT ON FUNCTION update_updated_at_column() IS 'Actualiza automáticamente el campo updated_at';

-- =============================================
-- 6. TRIGGER: Validar asistencia para generar MTPR
-- RF-040
-- =============================================

CREATE OR REPLACE FUNCTION validate_attendance_for_mtpr()
RETURNS TRIGGER AS $$
DECLARE
    patient_present BOOLEAN;
BEGIN
    -- Solo validar cuando se marca como completado
    IF NEW.is_completed = TRUE AND OLD.is_completed = FALSE THEN
        -- Verificar que el paciente estuvo presente ese día
        SELECT EXISTS (
            SELECT 1
            FROM attendance
            WHERE patient_id = NEW.patient_id
              AND attendance_date = NEW.scheduled_date
              AND status = 'P'
        ) INTO patient_present;

        IF NOT patient_present THEN
            RAISE EXCEPTION 'No se puede generar MTPR: el paciente no estuvo presente el % (RF-040)', NEW.scheduled_date;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_mtpr_attendance
BEFORE UPDATE ON mtpr_schedules
FOR EACH ROW
EXECUTE FUNCTION validate_attendance_for_mtpr();

COMMENT ON FUNCTION validate_attendance_for_mtpr() IS 'Valida que el paciente estuvo presente antes de generar MTPR (RF-040)';

-- =============================================
-- 7. TRIGGER: Bloquear asistencia en días de discharge
-- RF-006, RF-042
-- =============================================

CREATE OR REPLACE FUNCTION prevent_attendance_after_discharge()
RETURNS TRIGGER AS $$
DECLARE
    patient_discharge DATE;
BEGIN
    -- Obtener fecha de discharge
    SELECT discharge_date INTO patient_discharge
    FROM patients
    WHERE patient_id = NEW.patient_id;

    -- Bloquear si intentan registrar asistencia después del discharge (excepto D)
    IF patient_discharge IS NOT NULL
       AND NEW.attendance_date > patient_discharge
       AND NEW.status != 'D' THEN
        RAISE EXCEPTION 'No se puede registrar asistencia después de la fecha de discharge (%) (RF-006)', patient_discharge;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_post_discharge_attendance
BEFORE INSERT ON attendance
FOR EACH ROW
EXECUTE FUNCTION prevent_attendance_after_discharge();

COMMENT ON FUNCTION prevent_attendance_after_discharge() IS 'Evita registrar asistencia después del discharge (RF-006)';

-- =============================================
-- 8. TRIGGER: Validar fechas de semana
-- =============================================

CREATE OR REPLACE FUNCTION validate_week_dates()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.end_date < NEW.start_date THEN
        RAISE EXCEPTION 'La fecha de fin (%) no puede ser anterior a la fecha de inicio (%)', NEW.end_date, NEW.start_date;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_week_dates
BEFORE INSERT OR UPDATE ON group_weeks
FOR EACH ROW
EXECUTE FUNCTION validate_week_dates();

COMMENT ON FUNCTION validate_week_dates() IS 'Valida que end_date >= start_date en group_weeks';

-- =============================================
-- 9. TRIGGER: Validar fecha de discharge
-- =============================================

CREATE OR REPLACE FUNCTION validate_discharge_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.discharge_date IS NOT NULL AND NEW.discharge_date < NEW.admission_date THEN
        RAISE EXCEPTION 'La fecha de alta (%) no puede ser anterior a la fecha de admisión (%)', NEW.discharge_date, NEW.admission_date;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_discharge_date
BEFORE INSERT OR UPDATE ON patients
FOR EACH ROW
EXECUTE FUNCTION validate_discharge_date();

COMMENT ON FUNCTION validate_discharge_date() IS 'Valida que discharge_date >= admission_date en patients';

-- =============================================
-- 10. TRIGGER: Actualizar flag de notas generadas
-- =============================================

CREATE OR REPLACE FUNCTION update_notes_generated_flag()
RETURNS TRIGGER AS $$
BEGIN
    -- Marcar semana como "notas generadas"
    UPDATE group_weeks
    SET notes_generated = true,
        notes_generated_at = CURRENT_TIMESTAMP
    WHERE week_id = NEW.week_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- NOTA: Este trigger se aplicará a la tabla 'generated_notes' cuando se cree el NotesModule
-- CREATE TRIGGER trg_update_notes_generated_flag
-- AFTER INSERT ON generated_notes
-- FOR EACH ROW
-- EXECUTE FUNCTION update_notes_generated_flag();

COMMENT ON FUNCTION update_notes_generated_flag() IS 'Marca semana como "notas generadas" cuando se genera una nota diaria';

-- =============================================
-- 11. TRIGGER: Auditoría general para tablas críticas
-- =============================================

CREATE OR REPLACE FUNCTION log_audit_changes()
RETURNS TRIGGER AS $$
DECLARE
    operation_type TEXT;
    record_uuid UUID;
    new_json JSONB;
    old_json JSONB;
BEGIN
    -- Determinar el tipo de operación
    IF TG_OP = 'INSERT' THEN
        operation_type := 'INSERT';
    ELSIF TG_OP = 'UPDATE' THEN
        operation_type := 'UPDATE';
    ELSIF TG_OP = 'DELETE' THEN
        operation_type := 'DELETE';
    END IF;

    -- Convertir registros a JSON
    new_json := CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW)::JSONB ELSE NULL END;
    old_json := CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN row_to_json(OLD)::JSONB ELSE NULL END;

    -- Extraer el UUID del registro (intentar diferentes campos comunes)
    record_uuid := COALESCE(
        (new_json->>(TG_TABLE_NAME || '_id'))::UUID,
        (old_json->>(TG_TABLE_NAME || '_id'))::UUID
    );

    -- Insertar registro de auditoría
    INSERT INTO audit_log (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values
    )
    VALUES (
        NULLIF(current_setting('app.current_user_id', TRUE), '')::UUID,
        operation_type,
        TG_TABLE_NAME,
        record_uuid,
        old_json,
        new_json
    );

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Aplicar a tabla de attendance (asistencia es crítica)
CREATE TRIGGER trg_audit_attendance
AFTER INSERT OR UPDATE OR DELETE ON attendance
FOR EACH ROW
EXECUTE FUNCTION log_audit_changes();

-- Aplicar a tabla de clinics
CREATE TRIGGER trg_audit_clinics
AFTER INSERT OR UPDATE OR DELETE ON clinics
FOR EACH ROW
EXECUTE FUNCTION log_audit_changes();

-- Aplicar a tabla de groups
CREATE TRIGGER trg_audit_groups
AFTER INSERT OR UPDATE OR DELETE ON groups
FOR EACH ROW
EXECUTE FUNCTION log_audit_changes();

COMMENT ON FUNCTION log_audit_changes() IS 'Registra todos los cambios en tablas críticas para auditoría completa';
