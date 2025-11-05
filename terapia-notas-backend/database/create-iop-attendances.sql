-- Crear asistencias específicas para el grupo IOP
-- Cada grupo debe tener sus propias asistencias independientes

DO $$
DECLARE
    v_iop_group_id UUID := '09f88cff-d7b2-44e8-9789-ab6d8664c941';
    v_iop_week_id UUID := '523554c8-f355-4344-acc5-9e37f7b3cbf7'; -- Semana 44 del grupo IOP
    
    -- IDs de los nuevos pacientes IOP
    v_patient_juan_iop UUID;
    v_patient_carlos_iop UUID;
    v_patient_ana_iop UUID;
    v_patient_patricia_iop UUID;
    
    -- Fechas de la semana 44 para IOP (Lunes, Miércoles, Viernes)
    v_monday DATE := '2025-10-28'; -- Lunes
    v_wednesday DATE := '2025-10-30'; -- Miércoles
    v_friday DATE := '2025-11-01'; -- Viernes
BEGIN
    RAISE NOTICE 'Iniciando creación de asistencias para grupo IOP...';
    
    -- Obtener IDs de los nuevos pacientes IOP
    SELECT patient_id INTO v_patient_juan_iop FROM patients WHERE patient_number = 'P101' LIMIT 1;
    SELECT patient_id INTO v_patient_carlos_iop FROM patients WHERE patient_number = 'P103' LIMIT 1;
    SELECT patient_id INTO v_patient_ana_iop FROM patients WHERE patient_number = 'P104' LIMIT 1;
    SELECT patient_id INTO v_patient_patricia_iop FROM patients WHERE patient_number = 'P108' LIMIT 1;
    
    RAISE NOTICE 'Pacientes IOP encontrados:';
    RAISE NOTICE '  - Juan (P101): %', v_patient_juan_iop;
    RAISE NOTICE '  - Carlos (P103): %', v_patient_carlos_iop;
    RAISE NOTICE '  - Ana (P104): %', v_patient_ana_iop;
    RAISE NOTICE '  - Patricia (P108): %', v_patient_patricia_iop;
    
    -- Crear asistencias para LUNES
    RAISE NOTICE 'Creando asistencias para LUNES (%):', v_monday;
    
    -- Juan - Lunes
    INSERT INTO attendance (attendance_id, patient_id, attendance_date, status, week_id, units_attended, created_at, updated_at)
    VALUES (gen_random_uuid(), v_patient_juan_iop, v_monday, 'P', v_iop_week_id, 4.00, NOW(), NOW())
    ON CONFLICT DO NOTHING;
    
    -- Carlos - Lunes
    INSERT INTO attendance (attendance_id, patient_id, attendance_date, status, week_id, units_attended, created_at, updated_at)
    VALUES (gen_random_uuid(), v_patient_carlos_iop, v_monday, 'P', v_iop_week_id, 4.00, NOW(), NOW())
    ON CONFLICT DO NOTHING;
    
    -- Ana - Lunes
    INSERT INTO attendance (attendance_id, patient_id, attendance_date, status, week_id, units_attended, created_at, updated_at)
    VALUES (gen_random_uuid(), v_patient_ana_iop, v_monday, 'P', v_iop_week_id, 4.00, NOW(), NOW())
    ON CONFLICT DO NOTHING;
    
    -- Patricia - Lunes
    INSERT INTO attendance (attendance_id, patient_id, attendance_date, status, week_id, units_attended, created_at, updated_at)
    VALUES (gen_random_uuid(), v_patient_patricia_iop, v_monday, 'P', v_iop_week_id, 4.00, NOW(), NOW())
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE '  ✅ Asistencias de Lunes creadas';
    
    -- Crear asistencias para MIÉRCOLES
    RAISE NOTICE 'Creando asistencias para MIÉRCOLES (%):', v_wednesday;
    
    -- Juan - Miércoles
    INSERT INTO attendance (attendance_id, patient_id, attendance_date, status, week_id, units_attended, created_at, updated_at)
    VALUES (gen_random_uuid(), v_patient_juan_iop, v_wednesday, 'P', v_iop_week_id, 4.00, NOW(), NOW())
    ON CONFLICT DO NOTHING;
    
    -- Carlos - Miércoles
    INSERT INTO attendance (attendance_id, patient_id, attendance_date, status, week_id, units_attended, created_at, updated_at)
    VALUES (gen_random_uuid(), v_patient_carlos_iop, v_wednesday, 'P', v_iop_week_id, 4.00, NOW(), NOW())
    ON CONFLICT DO NOTHING;
    
    -- Ana - Miércoles
    INSERT INTO attendance (attendance_id, patient_id, attendance_date, status, week_id, units_attended, created_at, updated_at)
    VALUES (gen_random_uuid(), v_patient_ana_iop, v_wednesday, 'P', v_iop_week_id, 4.00, NOW(), NOW())
    ON CONFLICT DO NOTHING;
    
    -- Patricia - Miércoles (Ausente)
    INSERT INTO attendance (attendance_id, patient_id, attendance_date, status, week_id, units_attended, created_at, updated_at)
    VALUES (gen_random_uuid(), v_patient_patricia_iop, v_wednesday, 'A', v_iop_week_id, 0.00, NOW(), NOW())
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE '  ✅ Asistencias de Miércoles creadas';
    
    -- Crear asistencias para VIERNES
    RAISE NOTICE 'Creando asistencias para VIERNES (%):', v_friday;
    
    -- Juan - Viernes
    INSERT INTO attendance (attendance_id, patient_id, attendance_date, status, week_id, units_attended, created_at, updated_at)
    VALUES (gen_random_uuid(), v_patient_juan_iop, v_friday, 'P', v_iop_week_id, 4.00, NOW(), NOW())
    ON CONFLICT DO NOTHING;
    
    -- Carlos - Viernes
    INSERT INTO attendance (attendance_id, patient_id, attendance_date, status, week_id, units_attended, created_at, updated_at)
    VALUES (gen_random_uuid(), v_patient_carlos_iop, v_friday, 'P', v_iop_week_id, 4.00, NOW(), NOW())
    ON CONFLICT DO NOTHING;
    
    -- Ana - Viernes
    INSERT INTO attendance (attendance_id, patient_id, attendance_date, status, week_id, units_attended, created_at, updated_at)
    VALUES (gen_random_uuid(), v_patient_ana_iop, v_friday, 'P', v_iop_week_id, 4.00, NOW(), NOW())
    ON CONFLICT DO NOTHING;
    
    -- Patricia - Viernes
    INSERT INTO attendance (attendance_id, patient_id, attendance_date, status, week_id, units_attended, created_at, updated_at)
    VALUES (gen_random_uuid(), v_patient_patricia_iop, v_friday, 'P', v_iop_week_id, 4.00, NOW(), NOW())
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE '  ✅ Asistencias de Viernes creadas';
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ Asistencias creadas exitosamente para el grupo IOP';
    RAISE NOTICE '';
    RAISE NOTICE '📊 RESUMEN:';
    RAISE NOTICE '   - Grupo IOP: %', v_iop_group_id;
    RAISE NOTICE '   - Semana IOP: % (Semana 44)', v_iop_week_id;
    RAISE NOTICE '   - Asistencias creadas: 12 (3 días × 4 pacientes)';
    RAISE NOTICE '   - Lunes: 4 presentes';
    RAISE NOTICE '   - Miércoles: 3 presentes, 1 ausente (Patricia)';
    RAISE NOTICE '   - Viernes: 4 presentes';
    
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Error: %', SQLERRM;
END $$;

