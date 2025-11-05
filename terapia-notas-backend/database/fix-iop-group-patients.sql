-- Corregir grupo IOP: remover pacientes duplicados y crear pacientes únicos
-- Los pacientes solo pueden estar en un grupo a la vez
-- Cada grupo debe tener sus propias asistencias

DO $$
DECLARE
    v_php_group_id UUID := '81a01050-1b2c-4da4-9db3-ce4debb41fd0';
    v_iop_group_id UUID := '09f88cff-d7b2-44e8-9789-ab6d8664c941';
    
    -- IDs de pacientes actuales
    v_patient_juan UUID := '014b7c9e-a7a3-4763-ab83-86959ae8466b';
    v_patient_carlos UUID := 'c0014ced-04bc-4e6c-8649-1fe0fce4f03d';
    v_patient_ana UUID := '67e78e19-20c3-464c-832c-ce826a32b122';
    v_patient_patricia UUID := '53a51f58-5e6f-4eb5-bed1-cad15be8e9cb';
    
    -- Nuevos pacientes para IOP (se crearán)
    v_new_juan UUID := gen_random_uuid();
    v_new_carlos UUID := gen_random_uuid();
    v_new_ana UUID := gen_random_uuid();
    v_new_patricia UUID := gen_random_uuid();
    
    v_clinic_id UUID := '669a3f69-e5e4-40a1-9a81-712c1a6ddeff';
BEGIN
    RAISE NOTICE 'Iniciando corrección de grupo IOP...';
    
    -- 1. Desactivar y remover pacientes del grupo IOP (dejarlos solo en PHP)
    RAISE NOTICE '1. Desactivando pacientes del grupo IOP...';
    
    UPDATE group_patients
    SET is_active = false,
        left_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE group_id = v_iop_group_id
      AND is_active = true;
    
    RAISE NOTICE '   ✅ Pacientes desactivados del grupo IOP';
    
    -- 2. Crear nuevos pacientes para el grupo IOP (copias con diferentes números)
    RAISE NOTICE '2. Creando nuevos pacientes para el grupo IOP...';
    
    -- Crear Juan Pérez IOP (P101)
    INSERT INTO patients (
        patient_id,
        patient_number,
        first_name,
        last_name,
        date_of_birth,
        admission_date,
        clinic_id,
        created_at,
        updated_at
    )
    SELECT 
        v_new_juan,
        'P101',
        'Juan',
        'Pérez',
        date_of_birth,
        admission_date,
        clinic_id,
        NOW(),
        NOW()
    FROM patients
    WHERE patient_id = v_patient_juan;
    
    -- Asignar al grupo IOP
    INSERT INTO group_patients (group_patient_id, group_id, patient_id, joined_date, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), v_iop_group_id, v_new_juan, CURRENT_DATE, true, NOW(), NOW());
    
    RAISE NOTICE '   ✅ Juan Pérez IOP creado (P101)';
    
    -- Crear Carlos Rodríguez IOP (P103)
    INSERT INTO patients (
        patient_id,
        patient_number,
        first_name,
        last_name,
        date_of_birth,
        admission_date,
        clinic_id,
        created_at,
        updated_at
    )
    SELECT 
        v_new_carlos,
        'P103',
        'Carlos',
        'Rodríguez',
        date_of_birth,
        admission_date,
        clinic_id,
        NOW(),
        NOW()
    FROM patients
    WHERE patient_id = v_patient_carlos;
    
    INSERT INTO group_patients (group_patient_id, group_id, patient_id, joined_date, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), v_iop_group_id, v_new_carlos, CURRENT_DATE, true, NOW(), NOW());
    
    RAISE NOTICE '   ✅ Carlos Rodríguez IOP creado (P103)';
    
    -- Crear Ana Martínez IOP (P104)
    INSERT INTO patients (
        patient_id,
        patient_number,
        first_name,
        last_name,
        date_of_birth,
        admission_date,
        clinic_id,
        created_at,
        updated_at
    )
    SELECT 
        v_new_ana,
        'P104',
        'Ana',
        'Martínez',
        date_of_birth,
        admission_date,
        clinic_id,
        NOW(),
        NOW()
    FROM patients
    WHERE patient_id = v_patient_ana;
    
    INSERT INTO group_patients (group_patient_id, group_id, patient_id, joined_date, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), v_iop_group_id, v_new_ana, CURRENT_DATE, true, NOW(), NOW());
    
    RAISE NOTICE '   ✅ Ana Martínez IOP creado (P104)';
    
    -- Crear Patricia López IOP (P108)
    INSERT INTO patients (
        patient_id,
        patient_number,
        first_name,
        last_name,
        date_of_birth,
        admission_date,
        clinic_id,
        created_at,
        updated_at
    )
    SELECT 
        v_new_patricia,
        'P108',
        'Patricia',
        'López',
        date_of_birth,
        admission_date,
        clinic_id,
        NOW(),
        NOW()
    FROM patients
    WHERE patient_id = v_patient_patricia;
    
    INSERT INTO group_patients (group_patient_id, group_id, patient_id, joined_date, is_active, created_at, updated_at)
    VALUES (gen_random_uuid(), v_iop_group_id, v_new_patricia, CURRENT_DATE, true, NOW(), NOW());
    
    RAISE NOTICE '   ✅ Patricia López IOP creado (P108)';
    
    -- 3. Copiar diagnósticos de los pacientes originales a los nuevos
    RAISE NOTICE '3. Copiando diagnósticos a los nuevos pacientes...';
    
    INSERT INTO patient_diagnoses (diagnosis_id, patient_id, icd10_code, diagnosis_description, is_primary, created_at, updated_at)
    SELECT 
        gen_random_uuid(),
        v_new_juan,
        icd10_code,
        diagnosis_description,
        is_primary,
        NOW(),
        NOW()
    FROM patient_diagnoses
    WHERE patient_id = v_patient_juan;
    
    INSERT INTO patient_diagnoses (diagnosis_id, patient_id, icd10_code, diagnosis_description, is_primary, created_at, updated_at)
    SELECT 
        gen_random_uuid(),
        v_new_carlos,
        icd10_code,
        diagnosis_description,
        is_primary,
        NOW(),
        NOW()
    FROM patient_diagnoses
    WHERE patient_id = v_patient_carlos;
    
    INSERT INTO patient_diagnoses (diagnosis_id, patient_id, icd10_code, diagnosis_description, is_primary, created_at, updated_at)
    SELECT 
        gen_random_uuid(),
        v_new_ana,
        icd10_code,
        diagnosis_description,
        is_primary,
        NOW(),
        NOW()
    FROM patient_diagnoses
    WHERE patient_id = v_patient_ana;
    
    INSERT INTO patient_diagnoses (diagnosis_id, patient_id, icd10_code, diagnosis_description, is_primary, created_at, updated_at)
    SELECT 
        gen_random_uuid(),
        v_new_patricia,
        icd10_code,
        diagnosis_description,
        is_primary,
        NOW(),
        NOW()
    FROM patient_diagnoses
    WHERE patient_id = v_patient_patricia;
    
    RAISE NOTICE '   ✅ Diagnósticos copiados';
    
    -- 4. Copiar goals de los pacientes originales a los nuevos
    RAISE NOTICE '4. Copiando goals a los nuevos pacientes...';
    
    INSERT INTO patient_goals (goal_id, patient_id, goal_text, goal_number, created_at, updated_at)
    SELECT 
        gen_random_uuid(),
        v_new_juan,
        goal_text,
        goal_number,
        NOW(),
        NOW()
    FROM patient_goals
    WHERE patient_id = v_patient_juan;
    
    INSERT INTO patient_goals (goal_id, patient_id, goal_text, goal_number, created_at, updated_at)
    SELECT 
        gen_random_uuid(),
        v_new_carlos,
        goal_text,
        goal_number,
        NOW(),
        NOW()
    FROM patient_goals
    WHERE patient_id = v_patient_carlos;
    
    INSERT INTO patient_goals (goal_id, patient_id, goal_text, goal_number, created_at, updated_at)
    SELECT 
        gen_random_uuid(),
        v_new_ana,
        goal_text,
        goal_number,
        NOW(),
        NOW()
    FROM patient_goals
    WHERE patient_id = v_patient_ana;
    
    INSERT INTO patient_goals (goal_id, patient_id, goal_text, goal_number, created_at, updated_at)
    SELECT 
        gen_random_uuid(),
        v_new_patricia,
        goal_text,
        goal_number,
        NOW(),
        NOW()
    FROM patient_goals
    WHERE patient_id = v_patient_patricia;
    
    RAISE NOTICE '   ✅ Goals copiados';
    
    RAISE NOTICE '✅ Corrección completada exitosamente';
    RAISE NOTICE '';
    RAISE NOTICE '📊 RESUMEN:';
    RAISE NOTICE '   - Pacientes removidos del grupo IOP';
    RAISE NOTICE '   - Nuevos pacientes creados para IOP:';
    RAISE NOTICE '     • Juan Pérez (P101)';
    RAISE NOTICE '     • Carlos Rodríguez (P103)';
    RAISE NOTICE '     • Ana Martínez (P104)';
    RAISE NOTICE '     • Patricia López (P108)';
    RAISE NOTICE '   - Diagnósticos y goals copiados';
    RAISE NOTICE '';
    RAISE NOTICE '💡 PRÓXIMO PASO: Crear asistencias específicas para el grupo IOP';
    
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Error: %', SQLERRM;
END $$;

