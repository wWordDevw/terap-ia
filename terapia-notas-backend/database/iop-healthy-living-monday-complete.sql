-- =============================================
-- IOP: Healthy Living - LUNES (COMPLETO)
-- =============================================
-- Este script inserta la actividad "Healthy Living" para IOP del día LUNES
-- Incluye: Actividad + 1 subactividad con TODOS sus párrafos
-- NOTA: NO elimina actividades existentes, solo añade Healthy Living
-- =============================================

-- Insertar actividad "Healthy Living" para IOP
DO $$
DECLARE
    v_activity_id UUID;
    v_physical_health_id UUID;
    v_paragraph_count INTEGER;
BEGIN
    -- Buscar si ya existe la actividad "Healthy Living"
    SELECT activity_id INTO v_activity_id
    FROM activities
    WHERE LOWER(activity_name) = 'healthy living'
    LIMIT 1;

    -- Si no existe, crearla
    IF v_activity_id IS NULL THEN
        INSERT INTO activities (activity_name, description, is_active)
        VALUES ('Healthy Living', 'Healthy Living activities for IOP groups - Monday', TRUE)
        RETURNING activity_id INTO v_activity_id;
        
        RAISE NOTICE '✅ Actividad "Healthy Living" creada con ID: %', v_activity_id;
    ELSE
        RAISE NOTICE '✅ Actividad "Healthy Living" ya existe con ID: %', v_activity_id;
    END IF;

    -- =============================================
    -- SUBACTIVIDAD 1: PHYSICAL HEALTH (40 párrafos)
    -- =============================================
    SELECT subactivity_id INTO v_physical_health_id
    FROM subactivities
    WHERE activity_id = v_activity_id
    AND LOWER(subactivity_name) = 'physical health'
    LIMIT 1;

    IF v_physical_health_id IS NULL THEN
        INSERT INTO subactivities (activity_id, subactivity_name, description, is_active)
        VALUES (v_activity_id, 'Physical Health', 'Physical health and wellness practices', TRUE)
        RETURNING subactivity_id INTO v_physical_health_id;
        RAISE NOTICE '✅ Subactividad "Physical Health" creada';
    END IF;

    INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order, is_active)
    VALUES
        (v_activity_id, v_physical_health_id, 'IOP Therapist facilitated a psychoeducational session emphasizing the connection between physical health and emotional regulation. Clients explored how consistent movement, nutrition, and sleep patterns enhance mood stability. The therapist reinforced self-awareness as key to maintaining holistic well-being.', 1, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist conducted a reflective group highlighting how sedentary habits contribute to depressive symptoms. Clients discussed barriers such as fatigue and low motivation. The therapist encouraged small, achievable goals to promote gradual lifestyle improvement.', 2, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist led a psychoeducational session exploring how physical activity influences neurotransmitter balance. Clients learned how exercise increases dopamine and serotonin levels. The therapist emphasized exercise as a natural mood stabilizer and coping mechanism.', 3, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist facilitated a group discussion on the role of nutrition in emotional and physical resilience. Clients identified unhealthy eating patterns linked to stress. The therapist promoted mindful eating and balanced meal planning to improve energy and concentration.', 4, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist conducted a mindfulness-based group connecting body awareness with physical health. Clients practiced grounding through breathing and light stretching. The therapist reinforced the body-mind relationship as central to recovery and emotional stability.', 5, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist led a reflective session addressing how chronic stress impacts physical health through muscle tension, headaches, and fatigue. Clients identified personal stress triggers. The therapist taught relaxation techniques to restore physiological balance.', 6, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist facilitated a psychoeducational group on the importance of hydration for physical and cognitive function. Clients discussed how dehydration affects mood and attention. The therapist encouraged daily tracking of fluid intake as part of self-care.', 7, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist conducted a group emphasizing the relationship between sleep hygiene and overall functioning. Clients explored the impact of irregular sleep on irritability and focus. The therapist guided them in creating bedtime routines that support restorative rest.', 8, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist led a session on physical self-neglect as a symptom of low motivation or depression. Clients discussed the emotional roots of neglecting exercise or nutrition. The therapist reinforced the idea that caring for the body strengthens self-worth.', 9, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist facilitated a cognitive-behavioral group exploring distorted thoughts around health habits. Clients challenged "all or nothing" beliefs about fitness and self-care. The therapist introduced flexible, self-compassionate approaches to change.', 10, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist conducted a psychoeducational group about cardiovascular health and its link to emotional regulation. Clients discussed how improved circulation and endurance can reduce anxiety symptoms. The therapist encouraged consistent moderate activity as preventive care.', 11, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist led a process group exploring how substance use impacts physical wellness. Clients identified ways addiction disrupts metabolism, appetite, and energy. The therapist reinforced rebuilding routines through nutrition and hydration.', 12, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist facilitated a reflective group addressing how emotional eating can mask distress. Clients explored the connection between craving patterns and unprocessed emotions. The therapist encouraged mindfulness and emotional labeling to break unhealthy cycles.', 13, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist conducted a psychoeducational session on the immune system''s response to chronic stress. Clients learned how cortisol imbalance weakens defense mechanisms. The therapist emphasized exercise, sleep, and relaxation as immune-supportive behaviors.', 14, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist led a mindfulness-based group focused on breathing awareness and posture correction. Clients practiced aligning physical and emotional states through slow, intentional movement. The therapist reinforced body-centered awareness for stress reduction.', 15, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist facilitated a group discussion on realistic goal setting in physical wellness. Clients identified short-term objectives such as walking or stretching daily. The therapist highlighted consistency over intensity as key for sustainable change.', 16, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist conducted a psychoeducational group about how hormonal balance is affected by diet and lifestyle. Clients discussed how poor nutrition can mimic emotional instability. The therapist promoted balanced eating and consistent routines to restore stability.', 17, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist led a reflective session exploring the role of body image in self-esteem. Clients examined how unrealistic standards influence motivation to maintain health. The therapist guided self-acceptance and compassionate body awareness.', 18, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist facilitated a group addressing the importance of preventive health practices such as medical checkups and screenings. Clients discussed avoidance due to fear or neglect. The therapist reinforced proactive health behavior as empowerment.', 19, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist conducted a closing session integrating all aspects of physical wellness, including nutrition, sleep, exercise, and stress regulation. Clients reflected on how body care improves emotional clarity and self-confidence. The therapist reinforced ongoing self-monitoring and accountability.', 20, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist facilitated a psychoeducational group discussing how consistent physical activity can alleviate symptoms of anxiety and depression. Clients identified barriers such as low energy and poor time management. The therapist emphasized the therapeutic role of movement in emotional regulation.', 21, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist conducted a reflective group highlighting the relationship between chronic pain and emotional distress. Clients explored how neglecting physical health perpetuates irritability and hopelessness. The therapist encouraged adaptive coping techniques and medical follow-up.', 22, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist led a mindfulness-based session promoting awareness of how breathing patterns influence physical and emotional states. Clients practiced diaphragmatic breathing to reduce stress. The therapist reinforced the mind-body feedback loop in maintaining wellness.', 23, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist facilitated a psychoeducational group on the importance of posture and mobility in sustaining energy levels. Clients discussed how prolonged inactivity contributes to fatigue. The therapist encouraged frequent stretching and body movement to enhance circulation.', 24, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist conducted a group addressing the psychological barriers to exercise adherence. Clients identified negative self-talk and perfectionism as deterrents. The therapist introduced behavioral activation strategies to increase consistency.', 25, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist led a discussion exploring how nutrition affects mood stability and concentration. Clients shared experiences of emotional fluctuation after poor eating habits. The therapist encouraged balanced meals to regulate blood sugar and enhance cognitive function.', 26, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist facilitated a reflective group examining the emotional connection to physical self-care. Clients discussed how feeling physically stronger improved confidence and motivation. The therapist reinforced that physical health supports resilience and identity rebuilding.', 27, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist conducted a psychoeducational session on sleep deprivation and its cognitive consequences. Clients discussed how irregular schedules impair attention and impulse control. The therapist guided them in developing structured nighttime routines.', 28, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist led a group exploring how regular physical activity supports recovery from addiction. Clients identified how exercise reduces cravings and increases dopamine naturally. The therapist reinforced healthy replacements for maladaptive behaviors.', 29, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist facilitated a discussion on hydration and its role in physical and mental alertness. Clients explored how dehydration contributes to headaches, fatigue, and irritability. The therapist encouraged daily water intake as part of self-care.', 30, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist conducted a mindfulness-based group integrating light physical activity with relaxation. Clients practiced stretching combined with mindful breathing. The therapist highlighted how gentle movement reduces somatic tension.', 31, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist led a psychoeducational group about how prolonged stress affects physical systems. Clients examined how chronic tension leads to muscle pain, digestive issues, and fatigue. The therapist promoted self-regulation techniques and scheduled rest.', 32, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist facilitated a reflective group addressing the fear of starting fitness routines after long periods of inactivity. Clients expressed self-consciousness and doubt. The therapist provided motivation-focused strategies to rebuild confidence gradually.', 33, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist conducted a group focusing on the impact of processed foods and high sugar intake on mood dysregulation. Clients discussed personal habits contributing to irritability or sluggishness. The therapist encouraged small nutritional improvements to enhance vitality.', 34, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist led a psychoeducational session about how sunlight exposure and vitamin D influence mental and physical health. Clients explored the benefits of spending time outdoors. The therapist encouraged engagement with nature for emotional balance.', 35, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist facilitated a process group emphasizing the role of consistency over intensity in physical health. Clients identified previous attempts at unsustainable routines. The therapist highlighted pacing and self-compassion as essential for long-term progress.', 36, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist conducted a reflective session exploring the mind-body relationship through journaling. Clients described how physical sensations mirror emotional states. The therapist encouraged somatic awareness to detect early signs of stress or imbalance.', 37, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist led a psychoeducational group on the benefits of balanced nutrition during recovery. Clients examined how specific nutrients aid cognitive repair and mood stabilization. The therapist provided practical meal-planning suggestions to encourage adherence.', 38, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist facilitated a discussion on the psychological effects of neglecting medical care. Clients expressed avoidance due to fear or shame. The therapist normalized medical follow-up as an act of self-respect and self-preservation.', 39, TRUE),
        (v_activity_id, v_physical_health_id, 'IOP Therapist conducted a closing session integrating emotional and physical health practices. Clients reflected on progress in improving sleep, hydration, and movement. The therapist reinforced lifestyle consistency as foundational for sustained mental wellness.', 40, TRUE);

    GET DIAGNOSTICS v_paragraph_count = ROW_COUNT;
    RAISE NOTICE '✅ Insertados % párrafos para "Physical Health"', v_paragraph_count;

    RAISE NOTICE '✅✅✅ COMPLETADO: Healthy Living con todas sus subactividades y párrafos insertados ✅✅✅';
    RAISE NOTICE '🎉🎉🎉 LUNES DE IOP COMPLETADO: 4 actividades con todas sus subactividades y párrafos 🎉🎉🎉';

END $$;

-- Verificar inserción
SELECT 
    a.activity_name,
    s.subactivity_name,
    COUNT(ap.paragraph_id) as total_paragraphs
FROM activities a
LEFT JOIN subactivities s ON s.activity_id = a.activity_id
LEFT JOIN activity_paragraphs ap ON ap.subactivity_id = s.subactivity_id
WHERE LOWER(a.activity_name) = 'healthy living'
GROUP BY a.activity_name, s.subactivity_name
ORDER BY a.activity_name, s.subactivity_name;

-- Verificar todas las actividades IOP del lunes
SELECT 
    a.activity_name,
    COUNT(DISTINCT s.subactivity_id) as total_subactivities,
    COUNT(ap.paragraph_id) as total_paragraphs
FROM activities a
LEFT JOIN subactivities s ON s.activity_id = a.activity_id
LEFT JOIN activity_paragraphs ap ON ap.subactivity_id = s.subactivity_id
WHERE LOWER(a.activity_name) IN ('life skills', 'self-esteem', 'health management addiction', 'healthy living')
GROUP BY a.activity_name
ORDER BY a.activity_name;
