-- =============================================
-- Script: 32-cleanup-clinics-final.sql
-- Descripción: Limpiar clínicas completamente, mantener solo FAMILY HEALTH COMMUNITY y PHP MENTAL HEALTH CENTER INC.
-- Fecha: 2024-01-15
-- =============================================

-- Obtener IDs de las clínicas que queremos mantener
-- FAMILY HEALTH COMMUNITY
-- PHP MENTAL HEALTH CENTER INC.

-- Mover usuarios de "Centro de Terapia Integral Miami" a "FAMILY HEALTH COMMUNITY"
UPDATE users 
SET clinic_id = (
  SELECT clinic_id 
  FROM clinics 
  WHERE clinic_name = 'FAMILY HEALTH COMMUNITY'
)
WHERE clinic_id = (
  SELECT clinic_id 
  FROM clinics 
  WHERE clinic_name = 'Centro de Terapia Integral Miami'
);

-- Eliminar datos relacionados con clínicas que no queremos mantener
-- Orden correcto para evitar violaciones de clave foránea

-- 1. Eliminar attendance
DELETE FROM attendance 
WHERE patient_id IN (
  SELECT p.patient_id 
  FROM patients p 
  WHERE p.clinic_id IN (
    SELECT clinic_id 
    FROM clinics 
    WHERE clinic_name NOT IN ('FAMILY HEALTH COMMUNITY', 'PHP MENTAL HEALTH CENTER INC.')
  )
);

-- 2. Eliminar group_patients
DELETE FROM group_patients 
WHERE group_id IN (
  SELECT g.group_id 
  FROM groups g 
  WHERE g.clinic_id IN (
    SELECT clinic_id 
    FROM clinics 
    WHERE clinic_name NOT IN ('FAMILY HEALTH COMMUNITY', 'PHP MENTAL HEALTH CENTER INC.')
  )
);

-- 3. Eliminar group_weeks
DELETE FROM group_weeks 
WHERE group_id IN (
  SELECT g.group_id 
  FROM groups g 
  WHERE g.clinic_id IN (
    SELECT clinic_id 
    FROM clinics 
    WHERE clinic_name NOT IN ('FAMILY HEALTH COMMUNITY', 'PHP MENTAL HEALTH CENTER INC.')
  )
);

-- 4. Eliminar groups
DELETE FROM groups 
WHERE clinic_id IN (
  SELECT clinic_id 
  FROM clinics 
  WHERE clinic_name NOT IN ('FAMILY HEALTH COMMUNITY', 'PHP MENTAL HEALTH CENTER INC.')
);

-- 5. Eliminar patients
DELETE FROM patients 
WHERE clinic_id IN (
  SELECT clinic_id 
  FROM clinics 
  WHERE clinic_name NOT IN ('FAMILY HEALTH COMMUNITY', 'PHP MENTAL HEALTH CENTER INC.')
);

-- 6. Eliminar las clínicas que no necesitamos
DELETE FROM clinics 
WHERE clinic_name NOT IN ('FAMILY HEALTH COMMUNITY', 'PHP MENTAL HEALTH CENTER INC.');

-- Verificar clínicas restantes
SELECT 
  clinic_id as id,
  clinic_name as "clinicName",
  is_active as "isActive",
  created_at as "createdAt",
  updated_at as "updatedAt"
FROM clinics 
ORDER BY clinic_name;

-- Verificar usuarios y sus clínicas
SELECT 
  u.full_name as "fullName",
  u.email,
  u.role,
  c.clinic_name as "clinicName"
FROM users u 
LEFT JOIN clinics c ON u.clinic_id = c.clinic_id
ORDER BY u.full_name;
