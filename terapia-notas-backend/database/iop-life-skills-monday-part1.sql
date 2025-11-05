-- =============================================
-- IOP: Life Skills - LUNES (Parte 1)
-- =============================================
-- Este script inserta la actividad Life Skills para IOP del día LUNES
-- Parte 1: Actividad y subactividad "Decision making" (primeros 10 párrafos)
-- =============================================

-- 1. Buscar o crear la actividad "Life Skills" para IOP
DO $$
DECLARE
    v_activity_id UUID;
BEGIN
    -- Buscar si ya existe la actividad "Life Skills"
    SELECT activity_id INTO v_activity_id
    FROM activities
    WHERE LOWER(activity_name) = 'life skills'
    LIMIT 1;

    -- Si no existe, crearla
    IF v_activity_id IS NULL THEN
        INSERT INTO activities (activity_name, description, is_active)
        VALUES ('Life Skills', 'Life Skills activities for IOP groups', TRUE)
        RETURNING activity_id INTO v_activity_id;
        
        RAISE NOTICE '✅ Actividad "Life Skills" creada con ID: %', v_activity_id;
    ELSE
        RAISE NOTICE '✅ Actividad "Life Skills" ya existe con ID: %', v_activity_id;
    END IF;

    -- 2. Crear subactividad "Decision making"
    DECLARE
        v_subactivity_id UUID;
    BEGIN
        -- Verificar si ya existe la subactividad
        SELECT subactivity_id INTO v_subactivity_id
        FROM subactivities
        WHERE activity_id = v_activity_id
        AND LOWER(subactivity_name) = 'decision making'
        LIMIT 1;

        IF v_subactivity_id IS NULL THEN
            INSERT INTO subactivities (activity_id, subactivity_name, description, is_active)
            VALUES (v_activity_id, 'Decision making', 'Decision making skills and processes', TRUE)
            RETURNING subactivity_id INTO v_subactivity_id;
            
            RAISE NOTICE '✅ Subactividad "Decision making" creada con ID: %', v_subactivity_id;
        ELSE
            RAISE NOTICE '✅ Subactividad "Decision making" ya existe con ID: %', v_subactivity_id;
        END IF;

        -- 3. Insertar primeros 10 párrafos de "Decision making"
        -- Solo insertar si no existen ya
        INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order, is_active)
        SELECT 
            v_activity_id,
            v_subactivity_id,
            paragraph_text,
            paragraph_order,
            TRUE
        FROM (VALUES
            (1, 'IOP Therapist facilitated a session focused on understanding the psychological processes underlying decision-making. Clients explored how emotional regulation, impulsivity, and cognitive distortions influence the quality of their choices. Through guided discussion, participants identified past decisions made under stress and examined the role of automatic thinking. The therapist emphasized mindfulness as a grounding tool to improve problem-solving and promote deliberate, value-based decisions.'),
            (2, 'IOP Therapist conducted a cognitive-behavioral group aimed at enhancing clients'' ability to make adaptive choices in daily life. The discussion centered on identifying internal and external barriers such as fear of failure, avoidance, and perfectionistic thinking. Clients were encouraged to use structured frameworks—such as pros and cons analysis—to improve insight and confidence. The therapist reinforced self-efficacy and accountability as key components of autonomous decision-making.'),
            (3, 'IOP Therapist led a psychoeducational session on the stages of effective decision-making, emphasizing awareness, evaluation, and implementation. Clients practiced identifying the emotional triggers that cloud judgment and engaged in a scenario-based exercise to practice choosing alternatives aligned with long-term goals. The therapist provided feedback on each participant''s reasoning process and reinforced the importance of reflective thinking before action.'),
            (4, 'IOP Therapist guided clients through a problem-solving activity focused on distinguishing reactive from intentional decisions. The group discussed how anxiety, peer influence, and uncertainty contribute to indecisive behavior. Clients were taught strategies to tolerate ambiguity and delay impulsive responses. The therapist encouraged the use of self-monitoring techniques to track decision outcomes and strengthen adaptive behavioral patterns.'),
            (5, 'IOP Therapist facilitated a group discussion on the relationship between emotional awareness and decision quality. Clients explored how avoidance and emotional suppression can result in poor or inconsistent choices. Through collaborative exercises, participants practiced labeling emotions prior to acting and linking decisions to personal values. The therapist highlighted the role of emotional intelligence in fostering self-directed growth and healthier interpersonal dynamics.'),
            (6, 'IOP Therapist introduced the concept of cognitive flexibility as a determinant of effective decision-making. Clients analyzed how rigid thought patterns and black-and-white thinking hinder the ability to evaluate multiple perspectives. The therapist provided interventions to promote adaptability, including reframing and perspective-taking. Group members reflected on recent choices and identified alternative paths that could have produced more balanced outcomes.'),
            (7, 'IOP Therapist facilitated an interactive session addressing impulsive versus deliberate decision-making. Clients examined personal situations where acting without reflection led to negative outcomes. Through cognitive restructuring exercises, participants practiced pausing before reacting to impulses. The therapist reinforced self-regulation techniques to improve behavioral control and promote mindful decision processes.'),
            (8, 'IOP Therapist led a group on decision-making under emotional distress. Clients discussed how intense affective states—such as anger or sadness—impair judgment. The therapist guided participants through grounding and breathing techniques to reduce emotional reactivity prior to making important choices. Group members verbalized strategies for maintaining clarity and consistency in future decision-making situations.'),
            (9, 'IOP Therapist provided psychoeducation on how core beliefs and schemas influence decision-making patterns. Clients explored how self-doubt, guilt, or the need for approval distort rational thinking. Through guided journaling, participants identified cognitive biases that repeatedly affect their ability to choose effectively. The therapist emphasized cognitive restructuring and confidence-building as mechanisms for healthier autonomy.'),
            (10, 'IOP Therapist facilitated a values-based decision-making exercise, encouraging clients to identify actions aligned with personal ethics and long-term goals. The discussion focused on differentiating between short-term gratification and sustainable growth. The therapist highlighted how congruence between decisions and values contributes to emotional stability and reduced regret.')
        ) AS paragraphs(paragraph_order, paragraph_text)
        WHERE NOT EXISTS (
            SELECT 1 FROM activity_paragraphs ap
            WHERE ap.activity_id = v_activity_id
            AND ap.subactivity_id = v_subactivity_id
            AND ap.paragraph_text = paragraphs.paragraph_text
        );
        
        GET DIAGNOSTICS v_paragraph_count = ROW_COUNT;
        RAISE NOTICE '✅ Insertados % párrafos nuevos para "Decision making"', v_paragraph_count;
    END;
END $$;

-- Verificar inserción
SELECT 
    a.activity_name,
    s.subactivity_name,
    COUNT(ap.paragraph_id) as total_paragraphs
FROM activities a
JOIN subactivities s ON s.activity_id = a.activity_id
LEFT JOIN activity_paragraphs ap ON ap.subactivity_id = s.subactivity_id
WHERE LOWER(a.activity_name) = 'life skills'
AND LOWER(s.subactivity_name) = 'decision making'
GROUP BY a.activity_name, s.subactivity_name;
