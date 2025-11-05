-- =============================================
-- Script: 29-create-therapists.sql
-- Descripción: Crear terapeutas adicionales para el sistema
-- Fecha: 2024-01-15
-- =============================================

-- Crear terapeutas adicionales
INSERT INTO users (
  user_id,
  username,
  email,
  password_hash,
  full_name,
  role,
  is_active,
  created_at,
  updated_at
) VALUES 
  (
    gen_random_uuid(),
    'therapist2',
    'therapist2@terapia.com',
    '$2a$06$EMUfi5LwhhJAJ7KUQup1kuGyZ4camB8nElmykIqs.qR6hEO0.petS', -- password123
    'Dr. Carlos Rodriguez',
    'therapist',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'therapist3',
    'therapist3@terapia.com',
    '$2a$06$EMUfi5LwhhJAJ7KUQup1kuGyZ4camB8nElmykIqs.qR6hEO0.petS', -- password123
    'Dra. Ana Martinez',
    'therapist',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'therapist4',
    'therapist4@terapia.com',
    '$2a$06$EMUfi5LwhhJAJ7KUQup1kuGyZ4camB8nElmykIqs.qR6hEO0.petS', -- password123
    'Dr. Luis Fernandez',
    'therapist',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'therapist5',
    'therapist5@terapia.com',
    '$2a$06$EMUfi5LwhhJAJ7KUQup1kuGyZ4camB8nElmykIqs.qR6hEO0.petS', -- password123
    'Dra. Sofia Herrera',
    'therapist',
    true,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'therapist6',
    'therapist6@terapia.com',
    '$2a$06$EMUfi5LwhhJAJ7KUQup1kuGyZ4camB8nElmykIqs.qR6hEO0.petS', -- password123
    'Dr. Miguel Torres',
    'therapist',
    true,
    NOW(),
    NOW()
  )
ON CONFLICT (email) DO NOTHING;

-- Verificar terapeutas creados
SELECT 
  user_id as id,
  username,
  email,
  full_name as "fullName",
  role,
  is_active as "isActive",
  created_at as "createdAt",
  updated_at as "updatedAt"
FROM users 
WHERE role = 'therapist' 
ORDER BY full_name;
