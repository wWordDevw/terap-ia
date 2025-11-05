-- =============================================
-- IOP: Emotional Intelligence - MIÉRCOLES (COMPLETO)
-- =============================================
-- Este script inserta la actividad "Emotional Intelligence" para IOP del día MIÉRCOLES
-- Incluye: Actividad + 1 subactividad (Management of emotions) con TODOS sus párrafos
-- NOTA: NO elimina actividades existentes, solo añade Emotional Intelligence
-- =============================================

-- Insertar actividad "Emotional Intelligence" para IOP
DO $$
DECLARE
    v_activity_id UUID;
    v_management_of_emotions_id UUID;
    v_paragraph_count INTEGER;
BEGIN
    -- Buscar si ya existe la actividad "Emotional Intelligence"
    SELECT activity_id INTO v_activity_id
    FROM activities
    WHERE LOWER(activity_name) = 'emotional intelligence'
    LIMIT 1;

    -- Si no existe, crearla
    IF v_activity_id IS NULL THEN
        INSERT INTO activities (activity_name, description, is_active)
        VALUES ('Emotional Intelligence', 'Emotional Intelligence activities for IOP groups - Wednesday', TRUE)
        RETURNING activity_id INTO v_activity_id;
        
        RAISE NOTICE '✅ Actividad "Emotional Intelligence" creada con ID: %', v_activity_id;
    ELSE
        RAISE NOTICE '✅ Actividad "Emotional Intelligence" ya existe con ID: %', v_activity_id;
    END IF;

    -- =============================================
    -- SUBACTIVIDAD 1: MANAGEMENT OF EMOTIONS (40 párrafos)
    -- =============================================
    SELECT subactivity_id INTO v_management_of_emotions_id
    FROM subactivities
    WHERE activity_id = v_activity_id
    AND LOWER(subactivity_name) = 'management of emotions'
    LIMIT 1;

    IF v_management_of_emotions_id IS NULL THEN
        INSERT INTO subactivities (activity_id, subactivity_name, description, is_active)
        VALUES (v_activity_id, 'Management of emotions', 'Understanding and managing emotions effectively', TRUE)
        RETURNING subactivity_id INTO v_management_of_emotions_id;
        RAISE NOTICE '✅ Subactividad "Management of emotions" creada';
    END IF;

    INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order, is_active)
    VALUES
        -- Primera lista (1-20)
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist facilitated a psychoeducational group on emotional intelligence with emphasis on managing emotions effectively. Clients explored the relationship between emotional awareness and behavioral control. The therapist guided participants through techniques for recognizing emotional triggers before they escalate.', 1, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist conducted a reflective group session focused on enhancing clients'' capacity for emotional regulation. Participants discussed how impulsive reactions can disrupt relationships and decision-making. The therapist introduced grounding and self-monitoring strategies to promote balanced responses.', 2, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist led a cognitive-behavioral group examining the role of emotional labeling in self-management. Clients practiced identifying and naming complex emotions accurately to reduce confusion and improve insight. The therapist emphasized that labeling emotions helps reduce intensity and supports problem-solving.', 3, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist facilitated a discussion on the influence of thought patterns on emotional regulation. Clients identified cognitive distortions that trigger negative emotions. The therapist modeled reframing techniques to promote healthier interpretations and adaptive coping.', 4, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist conducted a process group exploring how suppression versus expression of emotions impacts overall functioning. Clients reflected on the cost of emotional avoidance. The therapist encouraged balanced expression and provided education on assertive emotional communication.', 5, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist facilitated an experiential group in which clients practiced recognizing the physiological signs of emotional arousal. The therapist guided relaxation and breathing exercises to enhance emotional self-regulation and improve distress tolerance.', 6, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist led a reflective session focusing on emotional triggers in interpersonal relationships. Clients identified recurring patterns of reactivity and the underlying beliefs sustaining them. The therapist emphasized mindfulness as a tool to create emotional distance before responding.', 7, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist conducted a psychoeducational group on adaptive emotion regulation strategies. Clients discussed the differences between reactive and reflective emotional responses. The therapist introduced emotion-focused coping skills such as reappraisal and acceptance.', 8, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist facilitated a group discussion on the relationship between emotional intelligence and resilience. Clients examined how effectively managing emotions strengthens adaptability during stressful circumstances. The therapist reinforced positive self-talk and behavioral activation as resilience-building techniques.', 9, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist led a cognitive-based session addressing the impact of rumination on emotional regulation. Clients explored how repetitive negative thinking prolongs distress. The therapist guided participants in redirecting attention through mindfulness and solution-focused approaches.', 10, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist conducted a group session on emotional regulation in high-stress environments. Clients identified recent situations where emotions interfered with effective functioning. The therapist introduced structured reflection tools to evaluate triggers and responses.', 11, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist facilitated a process group where clients practiced distinguishing between primary and secondary emotions. Participants discussed how unrecognized secondary emotions, such as anger masking sadness, hinder self-awareness. The therapist modeled reflective dialogue to enhance insight.', 12, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist led a psychoeducational group focused on using emotional intelligence to manage frustration and disappointment. Clients explored how unmet expectations influence emotional reactivity. The therapist emphasized cognitive flexibility and tolerance for imperfection.', 13, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist conducted a reflective group session emphasizing emotion regulation as a learned skill. Clients discussed how early life experiences shaped their current emotional habits. The therapist guided exploration of corrective emotional learning within supportive relationships.', 14, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist facilitated a skill-building session integrating mindfulness and emotion regulation. Clients practiced grounding techniques during emotionally charged imagery. The therapist reinforced how mindful attention reduces impulsivity and promotes self-soothing.', 15, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist led a psychoeducational discussion on the link between self-awareness and emotional control. Clients identified how increased awareness of internal states improves behavioral choices. The therapist encouraged journaling and self-reflection to strengthen emotional insight.', 16, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist conducted a process-oriented group on emotional management within social interactions. Clients examined how interpersonal conflict triggers defensive emotional responses. The therapist introduced techniques for emotional containment and empathic communication.', 17, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist facilitated a group exploring emotional regulation through behavioral activation. Clients identified how engaging in structured activities helps reduce emotional volatility. The therapist emphasized consistency and environmental structure as stabilizing factors.', 18, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist led a reflective discussion on the challenges of managing emotions during transitions and change. Clients recognized the importance of self-compassion and flexibility when facing uncertainty. The therapist guided clients through self-validation exercises to increase emotional balance.', 19, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist conducted a closing session reviewing the principles of emotional intelligence. Clients summarized their progress in identifying, understanding, and regulating emotions. The therapist reinforced continued application of these skills in real-life contexts to promote long-term stability and adaptive functioning.', 20, TRUE),
        -- Segunda lista (21-40)
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist facilitated a psychoeducational session on understanding the function of emotions as internal signals. Clients discussed how emotions provide valuable information about unmet needs and boundaries. The therapist emphasized that effective management begins with acknowledging emotions rather than suppressing them.', 21, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist led a reflective group exploring how emotional dysregulation contributes to impulsive decision-making. Clients identified moments when strong emotions led to regrettable actions. The therapist introduced cognitive pauses and grounding strategies to promote emotional containment.', 22, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist conducted a process group examining the connection between emotional awareness and self-control. Clients shared how recognizing emotions early helps prevent escalation. The therapist modeled emotion tracking as a tool for insight and behavioral regulation.', 23, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist facilitated a skill-building group centered on identifying emotional patterns across daily experiences. Clients practiced mapping emotions to specific triggers and outcomes. The therapist reinforced that recognizing consistent emotional cycles supports behavioral change.', 24, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist led a cognitive-behavioral group exploring how beliefs and interpretations influence emotional intensity. Clients practiced identifying automatic thoughts driving emotional reactions. The therapist guided reframing exercises to promote balanced emotional responses.', 25, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist conducted a reflective discussion on emotional vulnerability and its role in personal growth. Clients explored how fear of judgment often leads to emotional avoidance. The therapist encouraged open expression as a means of improving authenticity and connection.', 26, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist facilitated a psychoeducational group addressing how chronic stress undermines emotional regulation. Clients identified physical and psychological symptoms of overwhelm. The therapist provided relaxation and self-care strategies to promote emotional recovery.', 27, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist led a process group focusing on emotion differentiation. Clients discussed difficulty distinguishing between emotions such as anger, anxiety, and disappointment. The therapist guided labeling exercises to strengthen emotional precision.', 28, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist conducted a group session emphasizing emotional acceptance as a key element of regulation. Clients practiced allowing emotions to surface without judgment or avoidance. The therapist introduced mindfulness techniques to cultivate emotional tolerance.', 29, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist facilitated a reflective group on managing frustration in interpersonal contexts. Clients shared experiences of reacting defensively during conflict. The therapist modeled assertive expression and guided role-plays to promote constructive communication.', 30, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist led a psychoeducational session on the physiological impact of emotional suppression. Clients discussed how bottled emotions manifest as fatigue or somatic symptoms. The therapist reinforced the importance of emotional release through healthy outlets.', 31, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist conducted a group discussion about the link between emotional triggers and self-esteem. Clients explored how feelings of inadequacy amplify emotional reactivity. The therapist introduced cognitive restructuring to challenge negative self-appraisals.', 32, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist facilitated a process-oriented session on balancing empathy and self-regulation. Clients reflected on situations where over-identifying with others'' emotions created distress. The therapist emphasized boundary awareness to maintain emotional equilibrium.', 33, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist led a group exploring the relationship between self-compassion and emotional stability. Clients discussed how harsh self-criticism intensifies emotional turmoil. The therapist introduced self-kindness practices to foster resilience and inner calm.', 34, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist conducted a reflective group examining cultural influences on emotional expression. Clients analyzed learned patterns of emotional control or suppression from their upbringing. The therapist encouraged development of adaptive emotional habits aligned with authenticity.', 35, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist facilitated a psychoeducational group on how mood states influence cognitive processing. Clients discussed how sadness or anger distorts perception and problem-solving. The therapist guided awareness exercises to promote objective thinking during emotional activation.', 36, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist led a skill-building group integrating breathing regulation with emotional management. Clients practiced diaphragmatic breathing to lower physiological arousal during distress. The therapist emphasized consistency in practice for long-term emotional control.', 37, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist conducted a reflective discussion on managing emotions during interpersonal feedback. Clients explored reactions to criticism and defensiveness. The therapist guided role-play scenarios to model nonreactive listening and self-regulated communication.', 38, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist facilitated a group addressing the cumulative effects of unresolved emotions. Clients reflected on how unprocessed anger or sadness contributes to burnout. The therapist introduced journaling and expressive writing as healthy outlets for emotional release.', 39, TRUE),
        (v_activity_id, v_management_of_emotions_id, 'IOP Therapist led a process group focusing on emotional adaptability and flexibility. Clients explored how rigidity in emotional responses limits problem-solving. The therapist encouraged openness to multiple perspectives and reappraisal as strategies for balanced emotional management.', 40, TRUE);

    GET DIAGNOSTICS v_paragraph_count = ROW_COUNT;
    RAISE NOTICE '✅ Insertados % párrafos para "Management of emotions"', v_paragraph_count;

    RAISE NOTICE '✅✅✅ COMPLETADO: Emotional Intelligence con subactividad Management of emotions insertada ✅✅✅';

END $$;

-- Verificar inserción
SELECT 
    a.activity_name,
    s.subactivity_name,
    COUNT(ap.paragraph_id) as total_paragraphs
FROM activities a
LEFT JOIN subactivities s ON s.activity_id = a.activity_id
LEFT JOIN activity_paragraphs ap ON ap.subactivity_id = s.subactivity_id
WHERE LOWER(a.activity_name) = 'emotional intelligence'
GROUP BY a.activity_name, s.subactivity_name
ORDER BY a.activity_name, s.subactivity_name;
