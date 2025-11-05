-- =============================================
-- IOP: Coping Skills - MARTES (ACTIVIDAD SIN OBJETIVOS)
-- =============================================
-- Este script inserta la actividad "Coping Skills" para IOP del día MARTES
-- NOTA: Esta actividad se crea sin subactividades ni párrafos por ahora
-- NOTA: NO elimina actividades existentes, solo añade Coping Skills
-- =============================================

-- Insertar actividad "Coping Skills" para IOP
DO $$
DECLARE
    v_activity_id UUID;
BEGIN
    -- Buscar si ya existe la actividad "Coping Skills"
    SELECT activity_id INTO v_activity_id
    FROM activities
    WHERE LOWER(activity_name) = 'coping skills'
    LIMIT 1;

    -- Si no existe, crearla
    IF v_activity_id IS NULL THEN
        INSERT INTO activities (activity_name, description, is_active)
        VALUES ('Coping Skills', 'Coping Skills activities for IOP groups - Tuesday', TRUE)
        RETURNING activity_id INTO v_activity_id;
        
        RAISE NOTICE '✅ Actividad "Coping Skills" creada con ID: %', v_activity_id;
    ELSE
        RAISE NOTICE '✅ Actividad "Coping Skills" ya existe con ID: %', v_activity_id;
    END IF;

    RAISE NOTICE '✅✅✅ COMPLETADO: Coping Skills creada (sin subactividades ni párrafos por ahora) ✅✅✅';

END $$;

-- Verificar inserción
SELECT 
    a.activity_name,
    COUNT(DISTINCT s.subactivity_id) as total_subactivities,
    COUNT(ap.paragraph_id) as total_paragraphs
FROM activities a
LEFT JOIN subactivities s ON s.activity_id = a.activity_id
LEFT JOIN activity_paragraphs ap ON ap.subactivity_id = s.subactivity_id
WHERE LOWER(a.activity_name) = 'coping skills'
GROUP BY a.activity_name
ORDER BY a.activity_name;
