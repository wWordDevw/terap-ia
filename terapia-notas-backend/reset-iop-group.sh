#!/bin/bash
# Script para eliminar el grupo IOP y crear uno nuevo con pacientes diferentes

docker exec terapia-nota-db psql -U postgres -d terapia_nota_db << 'EOF'
BEGIN;

-- 1. Obtener el ID del grupo IOP actual
SELECT 'Grupos IOP a eliminar:' as info;
SELECT g.group_id, g.group_name, COUNT(gp.group_patient_id) as total_pacientes
FROM groups g
LEFT JOIN group_patients gp ON gp.group_id = g.group_id
WHERE g.program_type = 'IOP' AND g.is_active = true
GROUP BY g.group_id, g.group_name;

-- 2. Eliminar las relaciones de pacientes del grupo IOP
DELETE FROM group_patients 
WHERE group_id IN (
    SELECT group_id FROM groups WHERE program_type = 'IOP' AND is_active = true
);

-- 3. Eliminar las semanas del grupo IOP
DELETE FROM group_weeks 
WHERE group_id IN (
    SELECT group_id FROM groups WHERE program_type = 'IOP' AND is_active = true
);

-- 4. Eliminar los horarios del grupo IOP
DELETE FROM group_schedules 
WHERE group_id IN (
    SELECT group_id FROM groups WHERE program_type = 'IOP' AND is_active = true
);

-- 5. Eliminar el grupo IOP
DELETE FROM groups 
WHERE program_type = 'IOP' AND is_active = true;

-- 6. Crear pacientes NUEVOS y DIFERENTES para el grupo IOP
INSERT INTO patients (
    patient_id, 
    patient_number, 
    first_name, 
    last_name, 
    date_of_birth, 
    admission_date, 
    is_active, 
    clinic_id,
    created_at,
    updated_at
) VALUES
(
    gen_random_uuid(),
    'P201',
    'Maria',
    'González',
    '1985-03-15',
    '2024-02-01',
    true,
    (SELECT clinic_id FROM clinics LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'P203',
    'Roberto',
    'Sánchez',
    '1991-07-22',
    '2024-02-05',
    true,
    (SELECT clinic_id FROM clinics LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'P204',
    'Laura',
    'Fernández',
    '1988-11-08',
    '2024-02-10',
    true,
    (SELECT clinic_id FROM clinics LIMIT 1),
    NOW(),
    NOW()
),
(
    gen_random_uuid(),
    'P208',
    'Miguel',
    'Torres',
    '1992-05-30',
    '2024-02-15',
    true,
    (SELECT clinic_id FROM clinics LIMIT 1),
    NOW(),
    NOW()
);

-- 7. Crear un nuevo grupo IOP
INSERT INTO groups (
    group_id,
    group_name,
    program_type,
    shift,
    start_date,
    end_date,
    is_active,
    clinic_id,
    created_by,
    created_at,
    updated_at
) VALUES
(
    gen_random_uuid(),
    'Grupo IOP Tarde - Enero 2025',
    'IOP',
    'Tarde',
    '2025-01-01',
    '2025-12-31',
    true,
    (SELECT clinic_id FROM clinics LIMIT 1),
    (SELECT user_id FROM users WHERE role = 'therapist' LIMIT 1),
    NOW(),
    NOW()
);

-- 8. Agregar los pacientes NUEVOS al grupo IOP
INSERT INTO group_patients (
    group_patient_id,
    group_id,
    patient_id,
    joined_date,
    is_active,
    created_at
)
SELECT 
    gen_random_uuid(),
    (SELECT group_id FROM groups WHERE program_type = 'IOP' AND is_active = true ORDER BY created_at DESC LIMIT 1),
    patient_id,
    '2025-01-01',
    true,
    NOW()
FROM patients
WHERE patient_number IN ('P201', 'P203', 'P204', 'P208');

-- 9. Verificar que todo se creó correctamente
SELECT 'Nuevo grupo IOP creado:' as info;
SELECT 
    g.group_id,
    g.group_name,
    g.program_type,
    p.patient_number,
    p.first_name,
    p.last_name
FROM groups g
JOIN group_patients gp ON gp.group_id = g.group_id
JOIN patients p ON p.patient_id = gp.patient_id
WHERE g.program_type = 'IOP' AND g.is_active = true
ORDER BY p.patient_number;

COMMIT;
EOF

