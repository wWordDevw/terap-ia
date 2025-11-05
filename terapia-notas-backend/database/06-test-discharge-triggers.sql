-- =============================================
-- TESTS PARA TRIGGERS DE DISCHARGE
-- =============================================

\echo '========================================'
\echo 'TEST 1: Auto-crear asistencia "D" al marcar discharge'
\echo '========================================'

BEGIN;

-- Crear paciente de prueba
INSERT INTO patients (
    patient_id,
    clinic_id,
    patient_number,
    first_name,
    last_name,
    date_of_birth,
    admission_date
)
VALUES (
    'test-discharge-001'::UUID,
    (SELECT clinic_id FROM clinics LIMIT 1),
    'TEST-DISCHARGE-001',
    'Test',
    'Discharge Patient',
    '1990-01-01',
    '2025-10-01'
);

-- Crear grupo de prueba
INSERT INTO groups (
    group_id,
    clinic_id,
    group_name,
    program_type,
    shift
)
VALUES (
    'test-group-discharge'::UUID,
    (SELECT clinic_id FROM clinics LIMIT 1),
    'Test Group Discharge',
    'PHP',
    'Mañana'
);

-- Asignar paciente al grupo
INSERT INTO group_patients (patient_id, group_id, enrollment_date)
VALUES ('test-discharge-001'::UUID, 'test-group-discharge'::UUID, '2025-10-01');

-- Crear semana del grupo
INSERT INTO group_weeks (
    week_id,
    group_id,
    week_number,
    start_date,
    end_date,
    is_current
)
VALUES (
    'test-week-discharge'::UUID,
    'test-group-discharge'::UUID,
    1,
    '2025-10-01',
    '2025-10-07',
    true
);

-- Marcar discharge_date (debe crear automáticamente asistencia "D")
UPDATE patients
SET discharge_date = '2025-10-05'
WHERE patient_id = 'test-discharge-001'::UUID;

-- Verificar que se creó asistencia "D"
SELECT
    patient_id,
    attendance_date,
    status,
    units_attended,
    notes
FROM attendance
WHERE patient_id = 'test-discharge-001'::UUID
  AND attendance_date = '2025-10-05';

\echo 'Resultado esperado: 1 registro con status = "D", units_attended = 0.00'

ROLLBACK;

\echo ''
\echo '========================================'
\echo 'TEST 2: Prevenir asistencia después de discharge'
\echo '========================================'

BEGIN;

-- Crear paciente ya dado de alta
INSERT INTO patients (
    patient_id,
    clinic_id,
    patient_number,
    first_name,
    last_name,
    date_of_birth,
    admission_date,
    discharge_date
)
VALUES (
    'test-discharge-002'::UUID,
    (SELECT clinic_id FROM clinics LIMIT 1),
    'TEST-DISCHARGE-002',
    'Test',
    'Discharged Patient',
    '1990-01-01',
    '2025-10-01',
    '2025-10-05' -- Ya dado de alta
);

-- Crear grupo y semana
INSERT INTO groups (group_id, clinic_id, group_name, program_type, shift)
VALUES ('test-group-discharge-2'::UUID, (SELECT clinic_id FROM clinics LIMIT 1), 'Test Group 2', 'PHP', 'Mañana');

INSERT INTO group_patients (patient_id, group_id, enrollment_date)
VALUES ('test-discharge-002'::UUID, 'test-group-discharge-2'::UUID, '2025-10-01');

INSERT INTO group_weeks (week_id, group_id, week_number, start_date, end_date, is_current)
VALUES ('test-week-discharge-2'::UUID, 'test-group-discharge-2'::UUID, 1, '2025-10-01', '2025-10-07', true);

-- Intentar registrar asistencia DESPUÉS del discharge (debe fallar)
\echo 'Intentando registrar asistencia después del alta (debe fallar)...'
INSERT INTO attendance (
    week_id,
    patient_id,
    attendance_date,
    status,
    units_attended
)
VALUES (
    'test-week-discharge-2'::UUID,
    'test-discharge-002'::UUID,
    '2025-10-06', -- Después del discharge (2025-10-05)
    'P',
    3.0
);

ROLLBACK;

\echo ''
\echo '========================================'
\echo 'TEST 3: Permitir asistencia ANTES del discharge'
\echo '========================================'

BEGIN;

-- Crear paciente
INSERT INTO patients (
    patient_id,
    clinic_id,
    patient_number,
    first_name,
    last_name,
    date_of_birth,
    admission_date,
    discharge_date
)
VALUES (
    'test-discharge-003'::UUID,
    (SELECT clinic_id FROM clinics LIMIT 1),
    'TEST-DISCHARGE-003',
    'Test',
    'Valid Attendance',
    '1990-01-01',
    '2025-10-01',
    '2025-10-05'
);

-- Crear grupo y semana
INSERT INTO groups (group_id, clinic_id, group_name, program_type, shift)
VALUES ('test-group-discharge-3'::UUID, (SELECT clinic_id FROM clinics LIMIT 1), 'Test Group 3', 'PHP', 'Mañana');

INSERT INTO group_patients (patient_id, group_id, enrollment_date)
VALUES ('test-discharge-003'::UUID, 'test-group-discharge-3'::UUID, '2025-10-01');

INSERT INTO group_weeks (week_id, group_id, week_number, start_date, end_date, is_current)
VALUES ('test-week-discharge-3'::UUID, 'test-group-discharge-3'::UUID, 1, '2025-10-01', '2025-10-07', true);

-- Registrar asistencia ANTES del discharge (debe funcionar correctamente)
\echo 'Intentando registrar asistencia antes del alta (debe funcionar)...'
INSERT INTO attendance (
    week_id,
    patient_id,
    attendance_date,
    status,
    units_attended
)
VALUES (
    'test-week-discharge-3'::UUID,
    'test-discharge-003'::UUID,
    '2025-10-03', -- Antes del discharge (2025-10-05)
    'P',
    3.0
);

SELECT
    patient_id,
    attendance_date,
    status,
    units_attended
FROM attendance
WHERE patient_id = 'test-discharge-003'::UUID
  AND attendance_date = '2025-10-03';

\echo 'Resultado esperado: 1 registro con status = "P", units_attended = 3.0'

ROLLBACK;

\echo ''
\echo '========================================'
\echo 'TESTS COMPLETADOS'
\echo '========================================'
