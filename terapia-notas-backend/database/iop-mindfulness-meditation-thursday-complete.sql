-- =============================================
-- IOP: Mindfulness Meditation - JUEVES (COMPLETO)
-- =============================================
-- Este script inserta la actividad "Mindfulness Meditation" para IOP del día JUEVES
-- Incluye: Actividad + 1 subactividad (Breathing Techniques) con TODOS sus párrafos
-- NOTA: NO elimina actividades existentes, solo añade Mindfulness Meditation
-- =============================================

-- Insertar actividad "Mindfulness Meditation" para IOP
DO $$
DECLARE
    v_activity_id UUID;
    v_breathing_techniques_id UUID;
    v_paragraph_count INTEGER;
BEGIN
    -- Buscar si ya existe la actividad "Mindfulness Meditation"
    SELECT activity_id INTO v_activity_id
    FROM activities
    WHERE LOWER(activity_name) = 'mindfulness meditation'
    LIMIT 1;

    -- Si no existe, crearla
    IF v_activity_id IS NULL THEN
        INSERT INTO activities (activity_name, description, is_active)
        VALUES ('Mindfulness Meditation', 'Mindfulness Meditation activities for IOP groups - Thursday', TRUE)
        RETURNING activity_id INTO v_activity_id;
        
        RAISE NOTICE '✅ Actividad "Mindfulness Meditation" creada con ID: %', v_activity_id;
    ELSE
        RAISE NOTICE '✅ Actividad "Mindfulness Meditation" ya existe con ID: %', v_activity_id;
    END IF;

    -- =============================================
    -- SUBACTIVIDAD 1: BREATHING TECHNIQUES (40 párrafos)
    -- =============================================
    SELECT subactivity_id INTO v_breathing_techniques_id
    FROM subactivities
    WHERE activity_id = v_activity_id
    AND LOWER(subactivity_name) = 'breathing techniques'
    LIMIT 1;

    IF v_breathing_techniques_id IS NULL THEN
        INSERT INTO subactivities (activity_id, subactivity_name, description, is_active)
        VALUES (v_activity_id, 'Breathing Techniques', 'Understanding and practicing breathing techniques for mindfulness', TRUE)
        RETURNING subactivity_id INTO v_breathing_techniques_id;
        RAISE NOTICE '✅ Subactividad "Breathing Techniques" creada';
    END IF;

    INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order, is_active)
    VALUES
        -- Primera lista (1-20)
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist facilitated a mindfulness-based session focused on diaphragmatic breathing as a grounding technique. Clients practiced observing the breath to anchor attention in the present moment. The therapist emphasized how slow, controlled breathing reduces physiological arousal and promotes emotional regulation.', 1, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist conducted a psychoeducational group introducing the concept of breath awareness as a tool for stress reduction. Clients learned the difference between shallow and deep breathing and how oxygen regulation influences mood. The therapist guided a brief breathing exercise to model the relaxation response.', 2, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist led a group focused on integrating controlled breathing into daily routines. Clients discussed times of heightened anxiety and practiced using breathwork to manage physiological tension. The therapist reinforced consistency and mindfulness as essential components of emotional stability.', 3, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist facilitated a guided breathing meditation to enhance interoceptive awareness. Clients were encouraged to observe the natural rhythm of their breath without judgment. The therapist highlighted how non-reactive observation cultivates self-awareness and calmness.', 4, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist conducted a mindfulness session using box breathing techniques to regulate emotional arousal. Clients practiced inhaling, holding, exhaling, and pausing in equal intervals. The therapist explained how rhythmic breathing restores nervous system balance and decreases stress reactivity.', 5, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist led a reflective group on the use of breath to interrupt rumination and intrusive thoughts. Clients reported experiencing greater clarity and relaxation following guided practice. The therapist reinforced the importance of conscious breathing as a grounding strategy.', 6, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist facilitated a psychoeducational session on the physiological effects of mindful breathing. Clients learned about the role of the vagus nerve and how slow breathing activates the parasympathetic system. The therapist guided a progressive relaxation exercise to deepen the experience.', 7, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist conducted a group where clients practiced breathing in synchronization with mindfulness cues. Participants described the process of using focused breath to maintain present awareness. The therapist encouraged repetition and integration into morning or evening routines.', 8, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist led a session emphasizing the role of breath regulation in emotional resilience. Clients discussed how breath control enhances self-regulation during moments of anger or fear. The therapist introduced counting and pacing strategies to sustain focus and calm.', 9, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist facilitated a mindfulness meditation focusing on slow nasal breathing and bodily awareness. Clients observed sensations of airflow and muscle relaxation. The therapist reinforced mindfulness as a skill to promote grounding and reduce emotional reactivity.', 10, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist conducted a process group exploring how breath awareness reduces anxiety symptoms. Clients practiced alternating nostril breathing to balance energy and focus. The therapist emphasized how consistent practice can improve concentration and mood regulation.', 11, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist led a guided visualization paired with rhythmic breathing to encourage relaxation and cognitive clarity. Clients shared increased awareness of tension release. The therapist highlighted the link between controlled breath and improved executive functioning.', 12, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist facilitated a group exploring breath as an anchor during distress tolerance. Clients practiced maintaining focus on breathing when experiencing intrusive or racing thoughts. The therapist provided feedback on nonjudgmental observation and redirection of attention.', 13, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist conducted a reflective group where clients discussed personal experiences using breathwork for anxiety management. The therapist modeled calm, intentional breathing and emphasized its utility as a coping mechanism in emotionally charged moments.', 14, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist led a psychoeducational group demonstrating how mindful breathing supports cognitive reframing. Clients practiced short breathing intervals before responding to emotional triggers. The therapist explained how pausing through breath increases mindfulness in communication.', 15, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist facilitated a body scan meditation incorporating breath awareness. Clients were guided to synchronize breathing with muscle relaxation. The therapist encouraged practice outside of session to promote physiological awareness and tension release.', 16, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist conducted a group integrating breathwork with grounding visualization. Clients practiced inhaling strength and exhaling tension. The therapist emphasized the symbolic and physiological benefits of intentional breathing.', 17, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist led a mindfulness exercise where clients focused on counting each breath cycle to build concentration. Participants reflected on the calming effects of repetition. The therapist reinforced that mindful counting enhances self-discipline and focus.', 18, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist facilitated a reflective session exploring the use of breathing to manage panic responses. Clients practiced lengthening the exhale to calm the nervous system. The therapist provided psychoeducation on breath control as an evidence-based anxiety intervention.', 19, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist conducted a closing session integrating mindfulness meditation with paced breathing. Clients reported increased relaxation and reduced muscle tension. The therapist emphasized consistency of practice to strengthen emotional regulation and overall mental well-being.', 20, TRUE),
        -- Segunda lista (21-40)
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist facilitated a mindfulness-based group focused on cultivating present-moment awareness through controlled breathing. Clients were guided to notice the natural flow of inhalation and exhalation while observing intrusive thoughts without attachment. The therapist emphasized the role of breath as a stabilizing anchor during emotional distress.', 21, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist conducted a psychoeducational session introducing deep abdominal breathing to counteract physiological symptoms of anxiety. Clients practiced expanding the diaphragm and lengthening exhalations to activate relaxation responses. The therapist reinforced how regulating breath patterns can reduce heart rate and muscular tension.', 22, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist led a reflective group focused on recognizing the connection between breath and emotional regulation. Clients discussed moments when shallow breathing increased irritability or panic. The therapist modeled mindful breathing techniques to reestablish calm and focus.', 23, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist facilitated a guided meditation session centered on using the breath to enhance body awareness. Clients were encouraged to synchronize attention with each inhalation and exhalation. The therapist explained that mindfulness of breath supports grounding and decreases cognitive overactivation.', 24, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist conducted a skills-based session introducing 4-7-8 breathing for stress management. Clients practiced the technique and reported noticing a decrease in physiological arousal. The therapist highlighted that intentional breathing aids in restoring emotional equilibrium.', 25, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist led a group focusing on how breathing techniques can interrupt automatic stress responses. Clients identified triggers that cause rapid, shallow breathing and practiced slowing down respiration through guided pacing. The therapist reinforced the importance of self-regulation through consistent practice.', 26, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist facilitated a mindfulness training group that integrated breath counting as a concentration exercise. Clients practiced counting each breath cycle to improve focus and attention control. The therapist emphasized that sustained attention on breath increases cognitive flexibility and emotional balance.', 27, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist conducted a reflective session on using breath to manage frustration and anger. Clients discussed the role of breathing in preventing impulsive reactions. The therapist guided a brief breathing exercise and provided feedback on using pauses to maintain composure.', 28, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist led a psychoeducational group examining how chronic stress alters breathing patterns. Clients learned to identify habits such as breath-holding or shallow respiration during anxiety. The therapist introduced corrective exercises to promote mindful oxygen intake.', 29, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist facilitated a mindfulness session incorporating guided visualization with breath awareness. Clients practiced pairing inhalations with imagery of calm and exhalations with release of tension. The therapist reinforced visualization as a complement to mindful breathing for emotional grounding.', 30, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist conducted a process group addressing challenges in maintaining mindfulness during breathing exercises. Clients identified distractions and mental barriers. The therapist modeled acceptance-based strategies to gently redirect focus without self-criticism.', 31, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist led a group emphasizing how intentional breathing enhances emotional resilience. Clients practiced controlled exhalation to reduce hyperarousal and self-monitor internal states. The therapist linked breath regulation to improved stress tolerance and emotional recovery.', 32, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist facilitated a mindfulness practice centered on observing the breath without altering its rhythm. Clients noted sensations in the chest, abdomen, and nostrils to heighten bodily awareness. The therapist explained that mindful observation promotes detachment from intrusive thoughts.', 33, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist conducted a psychoeducational group exploring how mindful breathing affects neural functioning and mood regulation. Clients learned about parasympathetic activation through deep breathing. The therapist emphasized the biological foundation of breath-based stress reduction.', 34, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist led a reflective group exploring emotional shifts following guided breathing practice. Clients described feelings of calm, clarity, and decreased anxiety. The therapist validated these experiences and encouraged daily integration of breathwork.', 35, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist facilitated a meditation session incorporating rhythmic breathing patterns. Clients practiced synchronizing inhalations and exhalations with awareness of internal sensations. The therapist emphasized rhythm as a grounding mechanism for emotional stability.', 36, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist conducted a skill-building group focused on using breathwork during panic or high-stress situations. Clients rehearsed short, structured breathing sequences designed to slow the fight-or-flight response. The therapist reinforced repetition and confidence-building through daily application.', 37, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist led a mindfulness exercise combining breath focus with gratitude awareness. Clients were guided to inhale calm and exhale appreciation. The therapist discussed how intentional breathing fosters emotional positivity and present-moment awareness.', 38, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist facilitated a reflective discussion on how conscious breathing improves sleep quality and relaxation. Clients reported that slow, steady breathing before bedtime reduced restlessness. The therapist encouraged implementing breathwork as part of nighttime routines.', 39, TRUE),
        (v_activity_id, v_breathing_techniques_id, 'IOP Therapist conducted a closing mindfulness session on integrating breathing techniques into everyday stressors. Clients shared personal goals for applying breath awareness in moments of anxiety or frustration. The therapist reinforced consistency, patience, and nonjudgment as key elements in long-term mindfulness practice.', 40, TRUE);

    GET DIAGNOSTICS v_paragraph_count = ROW_COUNT;
    RAISE NOTICE '✅ Insertados % párrafos para "Breathing Techniques"', v_paragraph_count;

    RAISE NOTICE '✅✅✅ COMPLETADO: Mindfulness Meditation con subactividad Breathing Techniques insertada ✅✅✅';

END $$;

-- Verificar inserción
SELECT 
    a.activity_name,
    s.subactivity_name,
    COUNT(ap.paragraph_id) as total_paragraphs
FROM activities a
LEFT JOIN subactivities s ON s.activity_id = a.activity_id
LEFT JOIN activity_paragraphs ap ON ap.subactivity_id = s.subactivity_id
WHERE LOWER(a.activity_name) = 'mindfulness meditation'
GROUP BY a.activity_name, s.subactivity_name
ORDER BY a.activity_name, s.subactivity_name;
