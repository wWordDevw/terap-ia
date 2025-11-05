-- Crear grupo IOP con horarios y actividades para Dr. Carlos Rodriguez
-- Basado en el grupo PHP existente

-- 1. Obtener IDs necesarios
DO $$
DECLARE
    v_clinic_id UUID := '669a3f69-e5e4-40a1-9a81-712c1a6ddeff'; -- FAMILY HEALTH COMMUNITY
    v_therapist_id UUID := '0005bccd-de1e-41d0-833a-ad7002b46d09'; -- Dr. Carlos Rodriguez
    v_new_group_id UUID := gen_random_uuid();
    v_patient_juan UUID;
    v_patient_ana UUID;
    v_patient_carlos UUID;
    v_patient_patricia UUID;
    
    -- Actividades IOP (ya existen en la BD)
    v_life_skills UUID := '561aaf50-9fc1-45e2-8fad-48cd0d41de23';
    v_self_esteem UUID := 'ae6c15ae-4d95-42c5-8d02-f1e11e904554';
    v_health_mgmt UUID := '4fd66edc-1c8f-44a1-8663-2a9bc289439b';
    v_healthy_living UUID := '1ad70234-85cd-4179-9c51-89c24a7316cd';
    v_goal_setting UUID := 'b7b4ebbb-7c93-4424-b9a1-cc16d1e2a9fc';
    v_interpersonal UUID := 'fc3a1577-9427-42f0-9672-7cc4df86f9bd';
    v_stress_mgmt UUID := '76b2b0f5-e437-414d-a1d7-60b02b5861e1';
    v_coping UUID := 'e83c259b-a0dc-4584-a4fe-def8e79cf8a0';
    v_communication UUID := 'de2bd1fe-e655-46a3-949d-d930745b6195';
    v_problem_solving UUID := 'b85259b1-ec56-48fb-ba11-1925aaaae1e4';
    v_emotional_intel UUID := 'f9b86985-0816-4ad8-9b66-7c15384e54d7';
    v_mindfulness UUID := 'aaeee329-7165-4dba-ad93-890887bb9bdd';
BEGIN
    -- Obtener IDs de pacientes
    SELECT patient_id INTO v_patient_juan FROM patients WHERE patient_number = 'P001' LIMIT 1;
    SELECT patient_id INTO v_patient_ana FROM patients WHERE patient_number = 'P004' LIMIT 1;
    SELECT patient_id INTO v_patient_carlos FROM patients WHERE patient_number = 'P003' LIMIT 1;
    SELECT patient_id INTO v_patient_patricia FROM patients WHERE patient_number = 'P008' LIMIT 1;

    -- 2. Crear grupo IOP
    INSERT INTO groups (group_id, group_name, program_type, shift, start_date, end_date, is_active, clinic_id, created_by, created_at, updated_at)
    VALUES (
        v_new_group_id,
        'Grupo IOP Tarde - Enero 2025',
        'IOP',
        'Tarde',
        '2025-01-14',
        '2026-01-29',
        true,
        v_clinic_id,
        v_therapist_id,
        NOW(),
        NOW()
    );

    -- 3. Asignar pacientes al grupo
    IF v_patient_juan IS NOT NULL THEN
        INSERT INTO group_patients (group_patient_id, group_id, patient_id, joined_date, is_active, created_at, updated_at)
        VALUES (gen_random_uuid(), v_new_group_id, v_patient_juan, '2025-01-14', true, NOW(), NOW());
    END IF;

    IF v_patient_ana IS NOT NULL THEN
        INSERT INTO group_patients (group_patient_id, group_id, patient_id, joined_date, is_active, created_at, updated_at)
        VALUES (gen_random_uuid(), v_new_group_id, v_patient_ana, '2025-01-14', true, NOW(), NOW());
    END IF;

    IF v_patient_carlos IS NOT NULL THEN
        INSERT INTO group_patients (group_patient_id, group_id, patient_id, joined_date, is_active, created_at, updated_at)
        VALUES (gen_random_uuid(), v_new_group_id, v_patient_carlos, '2025-01-14', true, NOW(), NOW());
    END IF;

    IF v_patient_patricia IS NOT NULL THEN
        INSERT INTO group_patients (group_patient_id, group_id, patient_id, joined_date, is_active, created_at, updated_at)
        VALUES (gen_random_uuid(), v_new_group_id, v_patient_patricia, '2025-01-14', true, NOW(), NOW());
    END IF;

    -- 4. Crear horarios IOP (Lunes, Miércoles, Viernes) - Horarios de tarde
    -- LUNES (Monday)
    INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
    VALUES (gen_random_uuid(), v_new_group_id, 'monday', '13:00:00', '14:00:00', 1.00, v_life_skills, NULL, NOW(), NOW());

    INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
    VALUES (gen_random_uuid(), v_new_group_id, 'monday', '14:05:00', '15:05:00', 1.00, v_self_esteem, NULL, NOW(), NOW());

    INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
    VALUES (gen_random_uuid(), v_new_group_id, 'monday', '15:20:00', '16:20:00', 1.00, v_health_mgmt, NULL, NOW(), NOW());

    INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
    VALUES (gen_random_uuid(), v_new_group_id, 'monday', '16:25:00', '17:25:00', 1.00, v_healthy_living, NULL, NOW(), NOW());

    -- MIÉRCOLES (Wednesday)
    INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
    VALUES (gen_random_uuid(), v_new_group_id, 'wednesday', '13:00:00', '14:00:00', 1.00, v_communication, NULL, NOW(), NOW());

    INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
    VALUES (gen_random_uuid(), v_new_group_id, 'wednesday', '14:05:00', '15:05:00', 1.00, v_problem_solving, NULL, NOW(), NOW());

    INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
    VALUES (gen_random_uuid(), v_new_group_id, 'wednesday', '15:20:00', '16:20:00', 1.00, v_emotional_intel, NULL, NOW(), NOW());

    INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
    VALUES (gen_random_uuid(), v_new_group_id, 'wednesday', '16:25:00', '17:25:00', 1.00, v_life_skills, NULL, NOW(), NOW());

    -- VIERNES (Friday)
    INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
    VALUES (gen_random_uuid(), v_new_group_id, 'friday', '13:00:00', '14:00:00', 1.00, v_mindfulness, NULL, NOW(), NOW());

    INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
    VALUES (gen_random_uuid(), v_new_group_id, 'friday', '14:05:00', '15:05:00', 1.00, v_goal_setting, NULL, NOW(), NOW());

    INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
    VALUES (gen_random_uuid(), v_new_group_id, 'friday', '15:20:00', '16:20:00', 1.00, v_interpersonal, NULL, NOW(), NOW());

    INSERT INTO group_schedules (schedule_id, group_id, day_of_week, start_time, end_time, units, activity_id, subactivity_id, created_at, updated_at)
    VALUES (gen_random_uuid(), v_new_group_id, 'friday', '16:25:00', '17:25:00', 1.00, v_stress_mgmt, NULL, NOW(), NOW());

    RAISE NOTICE 'Grupo IOP creado con ID: %', v_new_group_id;
    RAISE NOTICE 'Horarios configurados: 12 horarios (4 por día: Lunes, Miércoles, Viernes)';
END $$;

