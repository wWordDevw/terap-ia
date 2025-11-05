-- =============================================
-- NUEVOS TRIGGERS - TERAPIA NOTA
-- PostgreSQL 16
-- Estos son los triggers faltantes mencionados en PENDING-WORK.md
-- =============================================

-- =============================================
-- 1. TRIGGER: Validar fechas de semana
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
-- 2. TRIGGER: Validar fecha de discharge
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
-- 3. TRIGGER: Actualizar flag de notas generadas
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
-- 4. TRIGGER: Auditoría general para tablas críticas
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

-- =============================================
-- FIN DE NUEVOS TRIGGERS
-- =============================================
