-- =============================================
-- Script: 34-create-real-patient-goals.sql
-- Descripción: Crear goals reales para los pacientes mencionados
-- Fecha: 2025-11-03
-- 
-- Pacientes PHP Mañana:
-- - Juan Pérez (P001)
-- - Carlos Rodríguez (P003)
-- - Ana Martínez (P004)
-- - Patricia López (P008)
--
-- Pacientes IOP Tarde:
-- - Maria González (P201)
-- - Miguel Torres (P208)
-- - Roberto Sánchez (P203)
-- - Laura Fernández (P204)
-- =============================================

-- Eliminar goals existentes para estos pacientes (si existen)
DELETE FROM patient_goals 
WHERE patient_id IN (
  SELECT patient_id FROM patients WHERE patient_number IN ('P001', 'P003', 'P004', 'P008', 'P201', 'P203', 'P204', 'P208')
);

-- =============================================
-- JUAN PÉREZ (P001) - PHP Mañana
-- =============================================
INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  1,
  'Client will identify and resolve the underlying causes of depression, thus elevating mood and interest/pleasure in life.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P001'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  2,
  'Client will significantly reduce the overall frequency and intensity of the anxiety symptoms so that daily functioning is improved.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P001'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  3,
  'Client will feel refreshed and energetic during wakeful hours.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P001'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  4,
  'Client will reach a personal balance between solitary time and interpersonal interaction with others.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P001'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

-- =============================================
-- CARLOS RODRÍGUEZ (P003) - PHP Mañana
-- =============================================
INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  1,
  'Client will develop effective coping strategies to manage anxiety symptoms and prevent panic episodes.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P003'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  2,
  'Client will improve sleep quality and establish a consistent sleep routine to support emotional regulation.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P003'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  3,
  'Client will enhance social skills and build meaningful connections with peers and family members.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P003'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  4,
  'Client will increase self-esteem and develop a positive self-image through self-compassion practices.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P003'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

-- =============================================
-- ANA MARTÍNEZ (P004) - PHP Mañana
-- =============================================
INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  1,
  'Client will learn to identify early warning signs of depressive episodes and implement preventative strategies.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P004'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  2,
  'Client will stabilize mood fluctuations and improve emotional regulation through cognitive-behavioral techniques.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P004'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  3,
  'Client will establish healthy daily routines including medication adherence, exercise, and self-care activities.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P004'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

-- NOTA: Ana Martínez solo tiene 3 goals (NO 4)

-- =============================================
-- PATRICIA LÓPEZ (P008) - PHP Mañana
-- =============================================
INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  1,
  'Client will reduce symptoms of anxiety and depression through consistent application of learned coping skills.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P008'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  2,
  'Client will improve interpersonal relationships by developing effective communication and boundary-setting skills.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P008'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  3,
  'Client will enhance problem-solving abilities and decision-making skills to navigate daily life challenges.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P008'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  4,
  'Client will develop resilience and adaptive strategies to manage stress and prevent relapse.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P008'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

-- =============================================
-- MARIA GONZÁLEZ (P201) - IOP Tarde
-- =============================================
INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  1,
  'Client will develop healthy coping mechanisms to manage stress and reduce anxiety-related symptoms.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P201'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  2,
  'Client will improve emotional awareness and expression through mindfulness and emotion regulation techniques.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P201'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  3,
  'Client will strengthen social support networks and improve relationship quality with family and friends.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P201'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  4,
  'Client will establish and maintain a balanced lifestyle including work, relationships, and self-care activities.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P201'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

-- =============================================
-- MIGUEL TORRES (P208) - IOP Tarde
-- =============================================
INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  1,
  'Client will identify and challenge negative thought patterns that contribute to depression and low mood.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P208'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  2,
  'Client will increase engagement in meaningful activities and restore interest in previously enjoyed hobbies.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P208'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  3,
  'Client will improve sleep hygiene and establish a regular sleep-wake cycle to support mood stability.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P208'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

-- NOTA: Miguel Torres solo tiene 3 goals (NO 4)

-- =============================================
-- ROBERTO SÁNCHEZ (P203) - IOP Tarde
-- =============================================
INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  1,
  'Client will develop effective stress management techniques to reduce anxiety and prevent panic attacks.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P203'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  2,
  'Client will enhance self-esteem and build confidence through positive self-talk and achievement tracking.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P203'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  3,
  'Client will improve communication skills and assertiveness to express needs and boundaries effectively.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P203'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  4,
  'Client will establish healthy routines and lifestyle habits that support overall mental health and well-being.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P203'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

-- =============================================
-- LAURA FERNÁNDEZ (P204) - IOP Tarde
-- =============================================
INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  1,
  'Client will learn to manage depressive symptoms through cognitive restructuring and behavioral activation.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P204'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

INSERT INTO patient_goals (patient_id, goal_number, goal_text, created_at, updated_at)
SELECT 
  p.patient_id,
  2,
  'Client will develop healthy relationships and improve social functioning through interpersonal skills training.',
  NOW(),
  NOW()
FROM patients p
WHERE p.patient_number = 'P204'
ON CONFLICT (patient_id, goal_number) DO UPDATE SET
  goal_text = EXCLUDED.goal_text,
  updated_at = NOW();

-- NOTA: Laura Fernández solo tiene 2 goals (NO 3 ni 4)

-- =============================================
-- Verificación de goals creados
-- =============================================
SELECT 
  p.patient_number,
  p.first_name || ' ' || p.last_name AS patient_name,
  COUNT(pg.goal_number) AS total_goals,
  STRING_AGG(pg.goal_number::text, ', ' ORDER BY pg.goal_number) AS goal_numbers
FROM patients p
LEFT JOIN patient_goals pg ON p.patient_id = pg.patient_id
WHERE p.patient_number IN ('P001', 'P003', 'P004', 'P008', 'P201', 'P203', 'P204', 'P208')
GROUP BY p.patient_number, p.first_name, p.last_name
ORDER BY p.patient_number;

