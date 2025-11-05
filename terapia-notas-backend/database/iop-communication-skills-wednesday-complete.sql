-- =============================================
-- IOP: Communication Skills - MIÉRCOLES (COMPLETO)
-- =============================================
-- Este script inserta la actividad "Communication Skills" para IOP del día MIÉRCOLES
-- Incluye: Actividad + 1 subactividad (Active Listening) con TODOS sus párrafos
-- NOTA: NO elimina actividades existentes, solo añade Communication Skills
-- =============================================

-- Insertar actividad "Communication Skills" para IOP
DO $$
DECLARE
    v_activity_id UUID;
    v_active_listening_id UUID;
    v_paragraph_count INTEGER;
BEGIN
    -- Buscar si ya existe la actividad "Communication Skills"
    SELECT activity_id INTO v_activity_id
    FROM activities
    WHERE LOWER(activity_name) = 'communication skills'
    LIMIT 1;

    -- Si no existe, crearla
    IF v_activity_id IS NULL THEN
        INSERT INTO activities (activity_name, description, is_active)
        VALUES ('Communication Skills', 'Communication Skills activities for IOP groups - Wednesday', TRUE)
        RETURNING activity_id INTO v_activity_id;
        
        RAISE NOTICE '✅ Actividad "Communication Skills" creada con ID: %', v_activity_id;
    ELSE
        RAISE NOTICE '✅ Actividad "Communication Skills" ya existe con ID: %', v_activity_id;
    END IF;

    -- =============================================
    -- SUBACTIVIDAD 1: ACTIVE LISTENING (40 párrafos)
    -- =============================================
    SELECT subactivity_id INTO v_active_listening_id
    FROM subactivities
    WHERE activity_id = v_activity_id
    AND LOWER(subactivity_name) = 'active listening'
    LIMIT 1;

    IF v_active_listening_id IS NULL THEN
        INSERT INTO subactivities (activity_id, subactivity_name, description, is_active)
        VALUES (v_activity_id, 'Active Listening', 'Understanding and practicing active listening skills', TRUE)
        RETURNING subactivity_id INTO v_active_listening_id;
        RAISE NOTICE '✅ Subactividad "Active Listening" creada';
    END IF;

    INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order, is_active)
    VALUES
        -- Primera lista (1-20)
        (v_activity_id, v_active_listening_id, 'IOP Therapist facilitated a psychoeducational group on the fundamentals of active listening as a core component of effective communication. Clients explored the difference between hearing and truly understanding, emphasizing the role of attention, empathy, and nonverbal cues. The therapist guided practice exercises to reinforce reflective and paraphrasing techniques.', 1, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist led a skill-building group focused on identifying barriers to active listening. Clients reflected on how distractions, assumptions, and emotional reactivity interfere with communication. The therapist introduced mindfulness and grounding methods to maintain presence during conversations.', 2, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist conducted a reflective group exploring how validation enhances active listening. Clients practiced acknowledging others'' emotions without judgment or problem-solving. The therapist reinforced the therapeutic value of emotional validation in fostering trust and rapport.', 3, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist facilitated a process group where clients engaged in paired listening exercises. Participants practiced paraphrasing and summarizing what they heard to ensure accuracy. The therapist provided feedback on tone, pacing, and body language to enhance attentiveness.', 4, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist led a psychoeducational session focused on nonverbal communication and its influence on active listening. Clients discussed how eye contact, posture, and facial expressions communicate empathy and understanding. The therapist encouraged awareness of physical presence during interpersonal exchanges.', 5, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist conducted a group emphasizing the importance of curiosity and open-ended questions in active listening. Clients practiced formulating questions that invite elaboration rather than closure. The therapist guided participants in developing genuine curiosity toward others'' experiences.', 6, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist facilitated a group discussion about emotional regulation during active listening. Clients examined how internal reactions, such as impatience or defensiveness, interfere with comprehension. The therapist introduced breathing and grounding techniques to support emotional neutrality.', 7, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist led a reflective group highlighting the role of empathy in active listening. Clients identified differences between listening to respond versus listening to understand. The therapist encouraged adopting a mindset of compassion and perspective-taking in all interactions.', 8, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist conducted a skill-based group exploring how paraphrasing strengthens communication clarity. Clients practiced restating messages using their own words to demonstrate comprehension. The therapist emphasized that reflective listening helps minimize misunderstandings and conflict.', 9, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist facilitated a psychoeducational group on how cultural and contextual factors influence listening behaviors. Clients discussed how tone, silence, and conversational pacing differ across backgrounds. The therapist encouraged cultural sensitivity and adaptability in communication.', 10, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist led a group focused on improving attention span during conversations. Clients identified habits such as multitasking and mental rehearsing that disrupt engagement. The therapist introduced focus-enhancing exercises and intentional pause strategies.', 11, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist conducted a process-oriented group exploring the link between self-awareness and active listening. Clients reflected on how personal biases shape what they hear and interpret. The therapist guided participants in mindfulness-based reflection to reduce projection.', 12, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist facilitated a psychoeducational discussion about defensive listening patterns. Clients identified how anticipating criticism or counterarguments limits understanding. The therapist modeled neutral listening and encouraged emotional detachment from perceived judgment.', 13, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist led a group activity in which clients practiced giving undivided attention for set periods. Participants observed the difference between passive and active listening through feedback. The therapist reinforced consistency, patience, and nonverbal alignment as essential components.', 14, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist conducted a reflective group exploring power dynamics in communication. Clients discussed how authority, status, or emotional dominance can inhibit listening. The therapist emphasized equality and mutual respect as prerequisites for open dialogue.', 15, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist facilitated a session addressing cognitive distortions that impair listening accuracy. Clients practiced distinguishing between facts and assumptions during exchanges. The therapist provided psychoeducation on cognitive reframing and reflective inquiry.', 16, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist led a group discussion on how emotional triggers interrupt active listening. Clients examined situations where strong feelings led to selective attention or misinterpretation. The therapist encouraged emotional labeling and self-monitoring before responding.', 17, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist conducted a psychoeducational group on compassionate listening in conflict situations. Clients practiced staying calm and validating others'' perspectives under pressure. The therapist reinforced de-escalation techniques and emotional containment as integral skills.', 18, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist facilitated a group emphasizing the reciprocal nature of listening. Clients discussed how mutual attention fosters connection and emotional safety. The therapist guided participants in practicing balanced dialogue and reflective feedback exchanges.', 19, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist led a closing session integrating all aspects of active listening. Clients reviewed skills such as empathy, validation, paraphrasing, and emotional regulation. The therapist encouraged continued application of these tools to strengthen interpersonal effectiveness both inside and outside treatment.', 20, TRUE),
        -- Segunda lista (21-40)
        (v_activity_id, v_active_listening_id, 'IOP Therapist facilitated a psychoeducational group on how active listening promotes emotional attunement in relationships. Clients examined how consistent attention and validation can improve trust and mutual understanding. The therapist encouraged intentional listening as a method for reducing relational misunderstandings.', 21, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist led a reflective group exploring the difference between surface-level listening and deep empathic engagement. Clients practiced identifying emotions behind spoken words. The therapist guided exercises emphasizing presence, patience, and accurate emotional mirroring.', 22, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist conducted a skill-based session addressing interruptions as a barrier to active listening. Clients analyzed the impulse to respond prematurely. The therapist introduced mindful pause techniques to allow for full comprehension before reacting.', 23, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist facilitated a group discussion on how listening patterns are influenced by early family dynamics. Clients reflected on whether they learned to listen or compete for attention in childhood. The therapist encouraged exploration of corrective communication experiences within the group.', 24, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist led a psychoeducational group addressing selective listening during emotionally charged interactions. Clients identified how defensiveness distorts what is heard. The therapist provided strategies for grounding and emotional containment to promote objectivity.', 25, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist conducted a process group focused on nonverbal signals that enhance or undermine active listening. Clients practiced synchronizing body language with verbal empathy. The therapist emphasized awareness of congruence between message and posture.', 26, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist facilitated a reflective session where clients examined the link between listening and emotional validation. Participants practiced acknowledging others'' feelings without judgment. The therapist highlighted how emotional acknowledgment fosters psychological safety in relationships.', 27, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist led a group session centered on the use of silence as a therapeutic tool in active listening. Clients practiced allowing pauses to give others space for expression. The therapist explained how silence communicates respect and emotional presence.', 28, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist conducted a psychoeducational group on listening distortions influenced by assumptions and personal filters. Clients reflected on moments when they misinterpreted others'' words based on expectations. The therapist introduced metacognitive awareness techniques to increase listening accuracy.', 29, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist facilitated a process group examining empathy fatigue and its impact on listening capacity. Clients discussed how overexposure to others'' emotions can reduce attention. The therapist emphasized self-care and boundaries to preserve effective listening skills.', 30, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist led a skills-training session focusing on reflective questioning as part of active listening. Clients learned to use clarifying questions to deepen understanding. The therapist reinforced curiosity and nonjudgmental engagement as key behaviors.', 31, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist conducted a reflective discussion about the internal dialogue that competes with genuine listening. Clients practiced quieting mental distractions and self-referential thoughts. The therapist introduced mindfulness techniques to promote full presence.', 32, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist facilitated a psychoeducational group on emotional resonance during listening. Clients explored how they absorb and mirror others'' affective states. The therapist guided discussion on regulating empathy to avoid emotional overidentification.', 33, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist led a group focusing on active listening as a foundation for conflict prevention. Clients discussed experiences where being heard defused tension. The therapist demonstrated verbal acknowledgment techniques that validate emotions without escalation.', 34, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist conducted a session on cross-cultural listening barriers. Clients reflected on how communication norms differ by background. The therapist encouraged respect for diverse expression styles and awareness of nonverbal nuance.', 35, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist facilitated a process-oriented group addressing listening avoidance as a defense mechanism. Clients discussed how fear of confrontation or intimacy leads to tuning out. The therapist explored emotional resistance and promoted openness to vulnerability.', 36, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist led a psychoeducational session examining the role of active listening in teamwork and collaboration. Clients practiced cooperative dialogue exercises. The therapist emphasized feedback loops and shared understanding as essential to effective group functioning.', 37, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist conducted a reflective group exploring projection during communication. Clients analyzed how attributing their own emotions to others distorts listening. The therapist provided techniques for checking assumptions and verifying accuracy.', 38, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist facilitated a group on listening in emotionally intense environments. Clients practiced slowing their responses and recognizing emotional tone before reacting. The therapist reinforced affect regulation and verbal empathy as tools for stabilization.', 39, TRUE),
        (v_activity_id, v_active_listening_id, 'IOP Therapist led a closing integration session emphasizing consistency in active listening practices. Clients shared insights from using reflective and empathic listening in daily life. The therapist encouraged continued awareness of tone, body language, and attention as ongoing relational skills.', 40, TRUE);

    GET DIAGNOSTICS v_paragraph_count = ROW_COUNT;
    RAISE NOTICE '✅ Insertados % párrafos para "Active Listening"', v_paragraph_count;

    RAISE NOTICE '✅✅✅ COMPLETADO: Communication Skills con subactividad Active Listening insertada ✅✅✅';

END $$;

-- Verificar inserción
SELECT 
    a.activity_name,
    s.subactivity_name,
    COUNT(ap.paragraph_id) as total_paragraphs
FROM activities a
LEFT JOIN subactivities s ON s.activity_id = a.activity_id
LEFT JOIN activity_paragraphs ap ON ap.subactivity_id = s.subactivity_id
WHERE LOWER(a.activity_name) = 'communication skills'
GROUP BY a.activity_name, s.subactivity_name
ORDER BY a.activity_name, s.subactivity_name;
