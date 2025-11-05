-- =============================================
-- TEST NUEVOS TRIGGERS - TERAPIA NOTA
-- Este script prueba los triggers recién implementados
-- =============================================

\echo '=============================================';
\echo 'INICIANDO PRUEBAS DE NUEVOS TRIGGERS';
\echo '=============================================';
\echo '';

-- =============================================
-- TEST 1: Trigger validate_week_dates
-- =============================================

\echo 'TEST 1: Validar fechas de semana (validate_week_dates)';
\echo 'Intentando crear una semana con end_date < start_date...';

BEGIN;

DO $$
DECLARE
    test_group_id UUID;
BEGIN
    -- Obtener un group_id existente
    SELECT group_id INTO test_group_id FROM groups LIMIT 1;

    IF test_group_id IS NULL THEN
        RAISE EXCEPTION 'No hay grupos en la base de datos para probar';
    END IF;

    -- Intentar insertar una semana inválida (debe fallar)
    BEGIN
        INSERT INTO group_weeks (group_id, week_number, start_date, end_date)
        VALUES (test_group_id, 999, '2025-01-10', '2025-01-05');

        RAISE EXCEPTION 'ERROR: El trigger NO bloqueó la inserción de fechas inválidas';
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLERRM LIKE '%fecha de fin%' THEN
                RAISE NOTICE '✓ TRIGGER FUNCIONA: %', SQLERRM;
            ELSE
                RAISE;
            END IF;
    END;
END $$;

ROLLBACK;

\echo '';

-- =============================================
-- TEST 2: Trigger validate_discharge_date
-- =============================================

\echo 'TEST 2: Validar fecha de discharge (validate_discharge_date)';
\echo 'Intentando actualizar un paciente con discharge_date < admission_date...';

BEGIN;

DO $$
DECLARE
    test_patient_id UUID;
BEGIN
    -- Obtener un patient_id existente
    SELECT patient_id INTO test_patient_id FROM patients LIMIT 1;

    IF test_patient_id IS NULL THEN
        RAISE EXCEPTION 'No hay pacientes en la base de datos para probar';
    END IF;

    -- Intentar actualizar con fecha inválida (debe fallar)
    BEGIN
        UPDATE patients
        SET discharge_date = admission_date - INTERVAL '5 days'
        WHERE patient_id = test_patient_id;

        RAISE EXCEPTION 'ERROR: El trigger NO bloqueó discharge_date inválida';
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLERRM LIKE '%fecha de alta%' THEN
                RAISE NOTICE '✓ TRIGGER FUNCIONA: %', SQLERRM;
            ELSE
                RAISE;
            END IF;
    END;
END $$;

ROLLBACK;

\echo '';

-- =============================================
-- TEST 3: Trigger log_audit_changes
-- =============================================

\echo 'TEST 3: Auditoría de cambios (log_audit_changes)';
\echo 'Insertando registro de asistencia y verificando auditoría...';

BEGIN;

DO $$
DECLARE
    test_week_id UUID;
    test_patient_id UUID;
    audit_count INTEGER;
BEGIN
    -- Obtener IDs existentes
    SELECT week_id INTO test_week_id FROM group_weeks LIMIT 1;
    SELECT patient_id INTO test_patient_id FROM patients LIMIT 1;

    IF test_week_id IS NULL OR test_patient_id IS NULL THEN
        RAISE EXCEPTION 'No hay datos para probar auditoría';
    END IF;

    -- Contar registros de auditoría antes
    SELECT COUNT(*) INTO audit_count FROM audit_log WHERE table_name = 'attendance';

    -- Insertar asistencia (debe crear registro de auditoría)
    INSERT INTO attendance (week_id, patient_id, attendance_date, status, units_attended)
    VALUES (test_week_id, test_patient_id, CURRENT_DATE, 'P', 3.00);

    -- Verificar que se creó el registro de auditoría
    IF (SELECT COUNT(*) FROM audit_log WHERE table_name = 'attendance') > audit_count THEN
        RAISE NOTICE '✓ TRIGGER FUNCIONA: Registro de auditoría creado correctamente';
    ELSE
        RAISE EXCEPTION 'ERROR: No se creó registro de auditoría';
    END IF;
END $$;

ROLLBACK;

\echo '';

-- =============================================
-- TEST 4: Verificar triggers instalados
-- =============================================

\echo 'TEST 4: Verificando triggers instalados';
\echo '';

SELECT
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND (trigger_name LIKE '%validate%' OR trigger_name LIKE '%audit%')
ORDER BY event_object_table, trigger_name;

\echo '';
\echo '=============================================';
\echo 'PRUEBAS COMPLETADAS';
\echo '=============================================';
