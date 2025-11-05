-- =============================================
-- DATOS INICIALES (SEED) - TERAPIA NOTA
-- PostgreSQL 16
-- =============================================

-- =============================================
-- 1. CLÍNICAS
-- =============================================

INSERT INTO clinics (clinic_name, address, phone, email) VALUES
('Centro de Terapia Integral', '123 Main St, Miami, FL', '305-555-0100', 'info@terapiaintegral.com'),
('Clínica de Salud Mental', '456 Ocean Dr, Miami Beach, FL', '305-555-0200', 'contact@saludmental.com');

-- =============================================
-- 2. USUARIOS
-- =============================================

-- Password por defecto: "password123" (debe ser hasheada en producción)
INSERT INTO users (username, email, password_hash, full_name, role, clinic_id)
SELECT
    'admin',
    'admin@terapia.com',
    crypt('password123', gen_salt('bf')),
    'Administrador Sistema',
    'admin',
    clinic_id
FROM clinics
LIMIT 1;

INSERT INTO users (username, email, password_hash, full_name, role, clinic_id)
SELECT
    'therapist1',
    'therapist1@terapia.com',
    crypt('password123', gen_salt('bf')),
    'Dr. María González',
    'therapist',
    clinic_id
FROM clinics
LIMIT 1;

INSERT INTO users (username, email, password_hash, full_name, role, clinic_id)
SELECT
    'nurse1',
    'nurse1@terapia.com',
    crypt('password123', gen_salt('bf')),
    'Enfermera Ana Rodríguez',
    'nurse',
    clinic_id
FROM clinics
LIMIT 1;

-- =============================================
-- 3. ACTIVIDADES Y SUBACTIVIDADES
-- =============================================

-- Actividades principales
INSERT INTO activities (activity_name, description) VALUES
('Group Therapy', 'Terapia grupal estándar'),
('Individual Counseling', 'Consejería individual'),
('Psychoeducation', 'Educación sobre salud mental'),
('Skills Training', 'Entrenamiento en habilidades'),
('Recreation Therapy', 'Terapia recreativa'),
('Art Therapy', 'Terapia de arte'),
('Mindfulness', 'Práctica de mindfulness'),
('Process Group', 'Grupo de proceso');

-- Subactividades para Group Therapy
INSERT INTO subactivities (activity_id, subactivity_name, description)
SELECT
    activity_id,
    'Coping Skills',
    'Desarrollo de habilidades de afrontamiento'
FROM activities WHERE activity_name = 'Group Therapy'
UNION ALL
SELECT
    activity_id,
    'Anger Management',
    'Manejo de la ira'
FROM activities WHERE activity_name = 'Group Therapy'
UNION ALL
SELECT
    activity_id,
    'Relapse Prevention',
    'Prevención de recaídas'
FROM activities WHERE activity_name = 'Group Therapy';

-- Subactividades para Skills Training
INSERT INTO subactivities (activity_id, subactivity_name, description)
SELECT
    activity_id,
    'Communication Skills',
    'Habilidades de comunicación'
FROM activities WHERE activity_name = 'Skills Training'
UNION ALL
SELECT
    activity_id,
    'Problem Solving',
    'Resolución de problemas'
FROM activities WHERE activity_name = 'Skills Training'
UNION ALL
SELECT
    activity_id,
    'Social Skills',
    'Habilidades sociales'
FROM activities WHERE activity_name = 'Skills Training';

-- =============================================
-- 4. PÁRRAFOS PREDEFINIDOS
-- =============================================

-- Párrafos para Group Therapy - Coping Skills
INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT
    a.activity_id,
    sa.subactivity_id,
    'The client actively participated in group discussions about developing healthy coping mechanisms. Client demonstrated understanding of the concepts presented and was able to identify personal triggers.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Group Therapy' AND sa.subactivity_name = 'Coping Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT
    a.activity_id,
    sa.subactivity_id,
    'During today''s group session, the client engaged in role-playing exercises to practice newly learned coping strategies. Client showed willingness to try different approaches when faced with stressful situations.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Group Therapy' AND sa.subactivity_name = 'Coping Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT
    a.activity_id,
    sa.subactivity_id,
    'The client contributed meaningfully to group discussions on stress management techniques. Client identified at least three coping skills that could be implemented in daily life.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Group Therapy' AND sa.subactivity_name = 'Coping Skills';

-- Párrafos para Psychoeducation
INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT
    activity_id,
    NULL,
    'The client attended psychoeducation session and demonstrated comprehension of the material presented. Client asked relevant questions and engaged in discussion with peers.',
    1
FROM activities WHERE activity_name = 'Psychoeducation';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT
    activity_id,
    NULL,
    'During psychoeducational group, the client showed increased awareness of mental health symptoms and treatment options. Client verbalized understanding of the importance of medication compliance and therapy attendance.',
    2
FROM activities WHERE activity_name = 'Psychoeducation';

-- Párrafos para Mindfulness
INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT
    activity_id,
    NULL,
    'The client participated in mindfulness exercises including breathing techniques and body scan meditation. Client reported feeling more relaxed and centered after the session.',
    1
FROM activities WHERE activity_name = 'Mindfulness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT
    activity_id,
    NULL,
    'During mindfulness practice, the client demonstrated ability to focus and remain present. Client verbalized appreciation for learning grounding techniques that can be used outside of treatment.',
    2
FROM activities WHERE activity_name = 'Mindfulness';

-- =============================================
-- 5. GRUPO DE EJEMPLO
-- =============================================

-- Crear un grupo PHP de prueba
INSERT INTO groups (clinic_id, program_type, shift, group_name, start_date)
SELECT
    clinic_id,
    'PHP',
    'Mañana',
    'PHP Morning Group - January 2025',
    '2025-01-06' -- Lunes
FROM clinics
LIMIT 1;

-- Crear horario para el grupo PHP (lunes a viernes)
-- Lunes
INSERT INTO group_schedules (group_id, day_of_week, activity_id, subactivity_id, start_time, end_time, units)
SELECT
    g.group_id,
    'monday',
    a.activity_id,
    NULL,
    '09:00',
    '10:30',
    1.5
FROM groups g
CROSS JOIN activities a
WHERE g.program_type = 'PHP'
  AND a.activity_name = 'Group Therapy'
LIMIT 1;

-- Martes
INSERT INTO group_schedules (group_id, day_of_week, activity_id, subactivity_id, start_time, end_time, units)
SELECT
    g.group_id,
    'tuesday',
    a.activity_id,
    NULL,
    '09:00',
    '11:00',
    2.0
FROM groups g
CROSS JOIN activities a
WHERE g.program_type = 'PHP'
  AND a.activity_name = 'Skills Training'
LIMIT 1;

-- Miércoles
INSERT INTO group_schedules (group_id, day_of_week, activity_id, subactivity_id, start_time, end_time, units)
SELECT
    g.group_id,
    'wednesday',
    a.activity_id,
    NULL,
    '09:00',
    '10:00',
    1.0
FROM groups g
CROSS JOIN activities a
WHERE g.program_type = 'PHP'
  AND a.activity_name = 'Mindfulness'
LIMIT 1;

-- Jueves
INSERT INTO group_schedules (group_id, day_of_week, activity_id, subactivity_id, start_time, end_time, units)
SELECT
    g.group_id,
    'thursday',
    a.activity_id,
    NULL,
    '09:00',
    '11:30',
    2.5
FROM groups g
CROSS JOIN activities a
WHERE g.program_type = 'PHP'
  AND a.activity_name = 'Psychoeducation'
LIMIT 1;

-- Viernes (genera 2 notas distintas según RF-001)
INSERT INTO group_schedules (group_id, day_of_week, activity_id, subactivity_id, start_time, end_time, units, note_code)
SELECT
    g.group_id,
    'friday',
    a.activity_id,
    NULL,
    '09:00',
    '10:30',
    1.5,
    'NOTE1'
FROM groups g
CROSS JOIN activities a
WHERE g.program_type = 'PHP'
  AND a.activity_name = 'Process Group'
LIMIT 1;

INSERT INTO group_schedules (group_id, day_of_week, activity_id, subactivity_id, start_time, end_time, units, note_code)
SELECT
    g.group_id,
    'friday',
    a.activity_id,
    NULL,
    '11:00',
    '12:00',
    1.0,
    'NOTE2'
FROM groups g
CROSS JOIN activities a
WHERE g.program_type = 'PHP'
  AND a.activity_name = 'Recreation Therapy'
LIMIT 1;

-- =============================================
-- COMENTARIOS
-- =============================================

COMMENT ON TABLE clinics IS 'Datos de ejemplo cargados';
COMMENT ON TABLE users IS 'Usuarios de prueba - password: password123';
COMMENT ON TABLE activities IS 'Actividades estándar del sistema';
COMMENT ON TABLE activity_paragraphs IS 'Párrafos predefinidos para rotación en notas';
