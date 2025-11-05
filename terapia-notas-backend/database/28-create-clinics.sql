-- =============================================
-- Script: 28-create-clinics.sql
-- Descripción: Crear las clínicas del sistema
-- Fecha: 2024-01-15
-- =============================================

-- Insertar clínicas del sistema
INSERT INTO clinics (clinic_id, clinic_name, is_active, created_at, updated_at)
VALUES 
  (
    gen_random_uuid(),
    'FAMILY HEALTH COMMUNITY',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'PHP MENTAL HEALTH CENTER INC.',
    true,
    NOW(),
    NOW()
  );

-- Verificar que se crearon las clínicas
SELECT 
  clinic_id as id,
  clinic_name as "clinicName",
  is_active as "isActive",
  created_at as "createdAt",
  updated_at as "updatedAt"
FROM clinics 
WHERE clinic_name IN ('FAMILY HEALTH COMMUNITY', 'PHP MENTAL HEALTH CENTER INC.')
ORDER BY clinic_name;
