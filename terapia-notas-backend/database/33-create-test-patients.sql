-- =============================================
-- Script: 33-create-test-patients.sql
-- Descripción: Crear pacientes de prueba para el frontend
-- Fecha: 2024-01-15
-- =============================================

-- Obtener ID de FAMILY HEALTH COMMUNITY
-- Crear pacientes de prueba
INSERT INTO patients (
  patient_id,
  patient_number,
  first_name,
  last_name,
  date_of_birth,
  admission_date,
  clinic_id,
  is_active,
  created_at,
  updated_at
) VALUES 
  (
    gen_random_uuid(),
    'P001',
    'Juan',
    'Pérez',
    '1990-05-15',
    '2024-01-15',
    (SELECT clinic_id FROM clinics WHERE clinic_name = 'FAMILY HEALTH COMMUNITY'),
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'P002',
    'María',
    'González',
    '1985-08-22',
    '2024-01-16',
    (SELECT clinic_id FROM clinics WHERE clinic_name = 'FAMILY HEALTH COMMUNITY'),
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'P003',
    'Carlos',
    'Rodríguez',
    '1992-03-10',
    '2024-01-17',
    (SELECT clinic_id FROM clinics WHERE clinic_name = 'FAMILY HEALTH COMMUNITY'),
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'P004',
    'Ana',
    'Martínez',
    '1988-11-30',
    '2024-01-18',
    (SELECT clinic_id FROM clinics WHERE clinic_name = 'FAMILY HEALTH COMMUNITY'),
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'P005',
    'Luis',
    'Fernández',
    '1995-07-08',
    '2024-01-19',
    (SELECT clinic_id FROM clinics WHERE clinic_name = 'FAMILY HEALTH COMMUNITY'),
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'P006',
    'Sofia',
    'Herrera',
    '1991-12-14',
    '2024-01-20',
    (SELECT clinic_id FROM clinics WHERE clinic_name = 'PHP MENTAL HEALTH CENTER INC.'),
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'P007',
    'Miguel',
    'Torres',
    '1987-04-25',
    '2024-01-21',
    (SELECT clinic_id FROM clinics WHERE clinic_name = 'PHP MENTAL HEALTH CENTER INC.'),
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'P008',
    'Patricia',
    'López',
    '1993-09-12',
    '2024-01-22',
    (SELECT clinic_id FROM clinics WHERE clinic_name = 'PHP MENTAL HEALTH CENTER INC.'),
    true,
    NOW(),
    NOW()
  );

-- Crear metas para cada paciente (4 metas por paciente)
INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  goal_num,
  CASE goal_num
    WHEN 1 THEN 'Mejorar habilidades de comunicación interpersonal'
    WHEN 2 THEN 'Desarrollar estrategias de manejo del estrés'
    WHEN 3 THEN 'Aumentar la autoestima y confianza personal'
    WHEN 4 THEN 'Establecer rutinas saludables de sueño y alimentación'
  END,
  NOW(),
  NOW()
FROM patients p
CROSS JOIN generate_series(1, 4) AS goal_num
WHERE p.is_active = true;

-- Crear diagnósticos para cada paciente
INSERT INTO patient_diagnoses (patient_id, icd10_code, diagnosis_description, is_primary, created_at, updated_at)
SELECT 
  p.patient_id,
  'F41.1',
  'Trastorno de ansiedad generalizada',
  true,
  NOW(),
  NOW()
FROM patients p
WHERE p.is_active = true;

-- Verificar pacientes creados
SELECT 
  p.patient_id as id,
  p.patient_number as "patientNumber",
  p.first_name as "firstName",
  p.last_name as "lastName",
  p.date_of_birth as "dateOfBirth",
  p.admission_date as "admissionDate",
  c.clinic_name as "clinicName",
  p.is_active as "isActive"
FROM patients p
LEFT JOIN clinics c ON p.clinic_id = c.clinic_id
WHERE p.is_active = true
ORDER BY p.patient_number;
