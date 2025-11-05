-- =============================================
-- IOP: Interpersonal Skills - MARTES (COMPLETO)
-- =============================================
-- Este script inserta la actividad "Interpersonal Skills" para IOP del día MARTES
-- Incluye: Actividad + 1 subactividad (Empathy) con TODOS sus párrafos
-- NOTA: NO elimina actividades existentes, solo añade Interpersonal Skills
-- =============================================

-- Insertar actividad "Interpersonal Skills" para IOP
DO $$
DECLARE
    v_activity_id UUID;
    v_empathy_id UUID;
    v_paragraph_count INTEGER;
BEGIN
    -- Buscar si ya existe la actividad "Interpersonal Skills"
    SELECT activity_id INTO v_activity_id
    FROM activities
    WHERE LOWER(activity_name) = 'interpersonal skills'
    LIMIT 1;

    -- Si no existe, crearla
    IF v_activity_id IS NULL THEN
        INSERT INTO activities (activity_name, description, is_active)
        VALUES ('Interpersonal Skills', 'Interpersonal Skills activities for IOP groups - Tuesday', TRUE)
        RETURNING activity_id INTO v_activity_id;
        
        RAISE NOTICE '✅ Actividad "Interpersonal Skills" creada con ID: %', v_activity_id;
    ELSE
        RAISE NOTICE '✅ Actividad "Interpersonal Skills" ya existe con ID: %', v_activity_id;
    END IF;

    -- =============================================
    -- SUBACTIVIDAD 1: EMPATHY (40 párrafos)
    -- =============================================
    SELECT subactivity_id INTO v_empathy_id
    FROM subactivities
    WHERE activity_id = v_activity_id
    AND LOWER(subactivity_name) = 'empathy'
    LIMIT 1;

    IF v_empathy_id IS NULL THEN
        INSERT INTO subactivities (activity_id, subactivity_name, description, is_active)
        VALUES (v_activity_id, 'Empathy', 'Understanding and practicing empathy in relationships', TRUE)
        RETURNING subactivity_id INTO v_empathy_id;
        RAISE NOTICE '✅ Subactividad "Empathy" creada';
    END IF;

    INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order, is_active)
    VALUES
        (v_activity_id, v_empathy_id, 'IOP Therapist facilitated a psychoeducational group exploring empathy as a core interpersonal skill necessary for building and maintaining healthy relationships. Clients reflected on how empathy differs from sympathy and discussed barriers such as defensiveness and emotional detachment. The therapist introduced active listening exercises to strengthen perspective-taking and promote compassionate communication.', 1, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist led a process-oriented session focused on understanding emotional resonance and its role in empathic communication. Clients practiced identifying emotional cues in others through tone, body language, and verbal expression. The therapist emphasized attunement as a skill that supports validation and emotional safety in relationships.', 2, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist conducted a group session centered on the distinction between cognitive and affective empathy. Clients explored how understanding another''s situation intellectually differs from emotionally connecting to their experience. The therapist guided participants in practicing both forms of empathy through guided role-play scenarios.', 3, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist facilitated a reflective group on the challenges of maintaining empathy during interpersonal conflict. Clients shared situations in which anger or self-protection limited their capacity to connect with others'' perspectives. The therapist introduced emotion regulation strategies to help maintain empathy even in moments of tension.', 4, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist led a psychoeducational discussion on empathy fatigue and its impact on relationships. Clients examined how excessive emotional absorption in others'' distress can lead to burnout and withdrawal. The therapist emphasized the importance of emotional boundaries and self-care to preserve healthy empathy.', 5, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist conducted a skill-building group where clients practiced empathy through structured partner exercises. Participants were encouraged to reflect back what they heard, focusing on emotional content rather than advice-giving. The therapist provided feedback on nonverbal communication and tone to enhance authenticity and connection.', 6, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist facilitated a discussion on the developmental roots of empathy and how early attachment experiences influence one''s ability to connect emotionally with others. Clients reflected on patterns learned in childhood and how these continue to affect current relationships. The therapist guided exploration of corrective emotional experiences to promote growth.', 7, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist led a process group addressing empathy breakdowns caused by cognitive biases and assumptions. Clients identified moments when they misinterpreted others'' intentions due to distorted thinking. The therapist introduced cognitive restructuring to improve accuracy in perspective-taking and relational understanding.', 8, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist facilitated a mindfulness-based session emphasizing present-moment awareness as a foundation for empathy. Clients practiced focusing attention on another person''s emotional state without judgment or interruption. The therapist highlighted how mindful listening enhances both emotional attunement and self-regulation.', 9, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist conducted a group exploring the reciprocal nature of empathy in communication. Clients discussed how empathy not only benefits others but also enhances personal emotional insight. The therapist guided reflection on how mutual understanding fosters trust and reduces relational defensiveness.', 10, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist facilitated a reflective discussion about cultural and social factors that shape empathic expression. Clients examined how empathy can be expressed differently across backgrounds and relationships. The therapist encouraged openness and curiosity as key components of cross-cultural empathy.', 11, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist led a psychoeducational group on the connection between empathy and emotional intelligence. Clients identified emotional awareness, regulation, and interpersonal sensitivity as interdependent skills. The therapist provided exercises to help clients label emotions accurately and respond with understanding rather than reactivity.', 12, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist conducted a session focused on empathy as a conflict resolution tool. Clients practiced using validation statements to de-escalate disagreements. The therapist reinforced the idea that empathy promotes collaboration and emotional safety during interpersonal challenges.', 13, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist facilitated a group examining the balance between empathy and assertiveness. Clients reflected on experiences of over-accommodating others'' feelings at the expense of their own boundaries. The therapist guided the group in exploring how authentic empathy includes respecting both self and other.', 14, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist led a process group where clients analyzed their emotional reactions during empathic interactions. Participants identified situations that evoke discomfort or defensiveness when listening to others'' pain. The therapist helped clients link these reactions to personal triggers and introduced grounding techniques for emotional containment.', 15, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist facilitated a group exercise in which clients practiced perspective-taking by narrating a recent disagreement from the other person''s viewpoint. The therapist guided debriefing on insights gained and emphasized how shifting perspective promotes compassion and reduces resentment.', 16, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist conducted a psychoeducational discussion about the neurological basis of empathy, including mirror neuron activation and affective resonance. Clients discussed how biological processes influence their ability to sense and respond to others'' emotions. The therapist highlighted how awareness of these mechanisms can improve intentional empathy.', 17, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist led a reflective session on the barriers to empathy in emotionally charged relationships. Clients explored patterns such as projection, defensiveness, and fear of vulnerability. The therapist encouraged use of self-awareness practices to identify when emotional reactivity replaces understanding.', 18, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist facilitated a group focused on the importance of empathy in repairing interpersonal ruptures. Clients practiced acknowledging others'' feelings without defensiveness and expressing accountability when appropriate. The therapist reinforced empathy as an essential step in restoring trust and relational balance.', 19, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist conducted a process-oriented group on the relationship between empathy and forgiveness. Clients explored how recognizing others'' emotional experiences can soften resentment and promote healing. The therapist guided reflection on how empathic understanding supports emotional release and reconciliation.', 20, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist facilitated a psychoeducational group highlighting empathy as a relational bridge that strengthens communication and trust. Clients explored how emotional awareness enhances the quality of their interactions and helps reduce conflict. The therapist introduced strategies to increase empathic listening and validate others'' experiences without judgment.', 21, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist conducted a group discussion focused on recognizing emotional cues as a key component of empathy. Clients practiced identifying subtle expressions of sadness, frustration, or anxiety in tone and facial gestures. The therapist emphasized the role of emotional literacy in improving relational attunement.', 22, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist led a session on empathy barriers, helping clients identify factors such as resentment, fatigue, or emotional avoidance that block understanding. The therapist facilitated guided reflection on how unresolved personal pain can limit empathic connection and offered cognitive reframing to increase openness.', 23, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist facilitated a mindfulness-based empathy exercise where clients engaged in silent observation of a partner''s nonverbal cues. The therapist guided discussion on how presence and attention foster deeper emotional connection and decrease misunderstandings.', 24, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist conducted a psychoeducational session exploring the distinction between empathy and emotional enmeshment. Clients discussed how over-identifying with others'' suffering can lead to personal distress. The therapist encouraged boundary-setting and self-regulation techniques to maintain healthy emotional balance.', 25, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist led a group exploring empathy within family systems. Clients reflected on generational patterns of emotional expression and recognition. The therapist guided them in identifying ways to introduce empathic dialogue in family communication to promote mutual understanding.', 26, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist facilitated a reflective group on how trauma history can impact empathy. Clients explored how hypervigilance or mistrust may inhibit emotional openness. The therapist provided psychoeducation on trauma-informed empathy and ways to rebuild emotional safety in relationships.', 27, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist conducted a process group where clients shared experiences of being misunderstood or dismissed. The therapist encouraged peers to practice empathic responses, highlighting how validation fosters connection and reduces emotional isolation.', 28, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist led a session on empathy in conflict resolution. Clients discussed how defensiveness often replaces understanding during arguments. The therapist demonstrated empathic communication techniques such as paraphrasing and emotional labeling to improve relational outcomes.', 29, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist facilitated a group focused on empathy toward oneself as a precursor to empathy for others. Clients reflected on self-criticism and its impact on interpersonal dynamics. The therapist guided a self-compassion exercise to reinforce self-acceptance and emotional flexibility.', 30, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist conducted a psychoeducational group emphasizing empathy as a foundation of effective teamwork. Clients explored how recognizing colleagues'' emotions improves cooperation and reduces workplace stress. The therapist modeled empathic communication to support professional growth.', 31, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist facilitated a session on emotional mirroring and its importance in empathy. Clients practiced reflecting back emotional content expressed by peers to demonstrate understanding. The therapist provided feedback on tone and phrasing to enhance authenticity.', 32, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist led a group discussion on empathy fatigue in caregiving roles. Clients described feeling emotionally depleted from constant concern for others. The therapist emphasized self-care strategies and emotional detachment techniques to restore psychological energy.', 33, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist facilitated a process group focused on empathy and boundary awareness. Clients identified moments when excessive empathy led to taking responsibility for others'' emotions. The therapist reinforced that balanced empathy involves compassion without over-functioning.', 34, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist conducted a psychoeducational session exploring empathy''s role in social inclusion. Clients discussed experiences of rejection and how lack of empathy perpetuates isolation. The therapist guided the group in practicing perspective-taking to promote inclusion and relational safety.', 35, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist led a reflective discussion on empathy in romantic relationships. Clients examined how assumptions and unmet expectations interfere with understanding their partners'' emotions. The therapist introduced emotional validation and reflective listening exercises to improve intimacy.', 36, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist facilitated a group exploring the relationship between empathy and forgiveness. Clients reflected on how understanding others'' motives can decrease resentment. The therapist guided discussion on how empathy allows for emotional resolution and healthier boundaries post-conflict.', 37, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist conducted a session emphasizing empathy during self-expression. Clients practiced sharing emotions using "I feel" statements while peers responded with empathic reflections. The therapist provided psychoeducation on the role of vulnerability in strengthening emotional bonds.', 38, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist led a process-oriented group on empathy within peer dynamics. Clients practiced offering support to others in distress using nonjudgmental listening. The therapist highlighted how mutual empathy builds trust and fosters a sense of belonging within the group.', 39, TRUE),
        (v_activity_id, v_empathy_id, 'IOP Therapist facilitated a closing group emphasizing empathy as a daily interpersonal practice. Clients created individualized plans to apply empathic communication at home or work. The therapist reinforced that consistent empathy enhances relational satisfaction and emotional well-being.', 40, TRUE);

    GET DIAGNOSTICS v_paragraph_count = ROW_COUNT;
    RAISE NOTICE '✅ Insertados % párrafos para "Empathy"', v_paragraph_count;

    RAISE NOTICE '✅✅✅ COMPLETADO: Interpersonal Skills con subactividad Empathy insertada ✅✅✅';

END $$;

-- Verificar inserción
SELECT 
    a.activity_name,
    s.subactivity_name,
    COUNT(ap.paragraph_id) as total_paragraphs
FROM activities a
LEFT JOIN subactivities s ON s.activity_id = a.activity_id
LEFT JOIN activity_paragraphs ap ON ap.subactivity_id = s.subactivity_id
WHERE LOWER(a.activity_name) = 'interpersonal skills'
GROUP BY a.activity_name, s.subactivity_name
ORDER BY a.activity_name, s.subactivity_name;
