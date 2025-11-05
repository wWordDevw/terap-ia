-- =============================================
-- IOP: Coping Skills - MARTES - Behavioral Mechanisms
-- =============================================
-- Este script inserta los 50 párrafos para "Behavioral Mechanisms"
-- de la actividad "Coping Skills" para IOP del día MARTES
-- =============================================

DO $$
DECLARE
    v_activity_id UUID;
    v_subactivity_id UUID;
    v_paragraph_count INTEGER;
BEGIN
    -- Obtener o crear la actividad "Coping Skills"
    SELECT activity_id INTO v_activity_id
    FROM activities
    WHERE LOWER(activity_name) = 'coping skills'
    LIMIT 1;

    IF v_activity_id IS NULL THEN
        INSERT INTO activities (activity_name, description, activity_type, is_active)
        VALUES ('Coping Skills', 'Coping Skills activities for IOP groups - Tuesday', 'IOP', TRUE)
        RETURNING activity_id INTO v_activity_id;
        RAISE NOTICE '✅ Actividad "Coping Skills" creada con ID: %', v_activity_id;
    ELSE
        RAISE NOTICE '✅ Actividad "Coping Skills" ya existe con ID: %', v_activity_id;
    END IF;

    -- Obtener o crear la subactividad "Behavioral Mechanisms"
    SELECT subactivity_id INTO v_subactivity_id
    FROM subactivities
    WHERE activity_id = v_activity_id
    AND LOWER(subactivity_name) = 'behavioral mechanisms'
    LIMIT 1;

    IF v_subactivity_id IS NULL THEN
        INSERT INTO subactivities (activity_id, subactivity_name, description, is_active)
        VALUES (v_activity_id, 'Behavioral Mechanisms', 'Understanding and practicing behavioral coping strategies and mechanisms', TRUE)
        RETURNING subactivity_id INTO v_subactivity_id;
        RAISE NOTICE '✅ Subactividad "Behavioral Mechanisms" creada con ID: %', v_subactivity_id;
    ELSE
        RAISE NOTICE '✅ Subactividad "Behavioral Mechanisms" ya existe con ID: %', v_subactivity_id;
    END IF;

    -- Eliminar párrafos existentes para esta subactividad (para evitar duplicados)
    DELETE FROM activity_paragraphs
    WHERE activity_id = v_activity_id
    AND subactivity_id = v_subactivity_id;

    RAISE NOTICE '🗑️  Párrafos existentes eliminados para evitar duplicados';

    -- Insertar los 50 párrafos
    INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
    VALUES
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational session focused on the behavioral mechanism of acting out and its use as an avoidance strategy. Clients explored how impulsive reactions often serve to discharge emotional distress rather than process its source. Through guided discussion, participants identified personal situations where they acted out and connected those moments to underlying emotional triggers. The therapist introduced self-monitoring and grounding strategies to promote emotional regulation and interruption of the impulsive cycle in real-life settings.', 1),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group discussion on the behavioral mechanism of aim inhibition and its influence on motivation and self-concept. Clients reflected on how setting excessively low expectations may temporarily decrease stress but hinder growth. The group identified personal goals they have minimized out of fear of failure. The therapist introduced graded goal-setting and exposure techniques to help clients increase self-confidence through incremental progress.', 2),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a psychoeducational session exploring altruism as a behavioral coping mechanism. Clients discussed how helping others can reduce emotional distress and reinforce a sense of purpose. The therapist encouraged reflection on times when altruistic acts promoted emotional relief and guided the group in developing a weekly prosocial action plan as part of their behavioral activation routine.', 3),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a process group on the use of aggression and confrontation as behavioral responses to fear or insecurity. Clients analyzed moments when defensive anger masked underlying shame or anxiety. Through role-play, they practiced assertive communication techniques to express needs safely. The therapist emphasized emotional labeling and boundaries as adaptive alternatives to aggressive reactions.', 4),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational session on avoidance behaviors and their reinforcing cycle in anxiety and depression. Clients identified daily tasks or interactions they often avoid and processed the emotions underlying those choices. The therapist introduced graded exposure and cognitive restructuring to challenge avoidance patterns and promote adaptive engagement.', 5),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a group session on compensation as a behavioral response to feelings of inadequacy. Clients examined how overperformance in certain areas can mask perceived deficits in others. The therapist encouraged self-reflection and introduced mindfulness and self-compassion strategies to promote a more balanced sense of identity and self-worth.', 6),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a reflective group on emotional expression and crying as forms of self-regulation. Clients discussed personal experiences with crying, its perceived stigma, and its physiological relief. The therapist normalized the emotional release process, emphasizing that acknowledging and expressing sadness supports resilience and emotional integration.', 7),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a psychoeducational group examining displacement as a behavioral defense. Clients identified situations in which they redirected anger or frustration toward unrelated targets. The therapist provided psychoeducation on emotional redirection and guided clients through mindfulness exercises to identify the original source of distress before reacting.', 8),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a group exploring identification as a coping strategy used to manage uncertainty or insecurity. Clients reflected on how emulating others can provide comfort but may reduce authenticity. The therapist guided participants in differentiating between healthy modeling and dependency, introducing self-inventory tools to strengthen individuality.', 9),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group discussion on reaction formation and the emotional incongruence it produces. Clients explored experiences where they displayed exaggerated friendliness or compliance to conceal anger or resentment. The therapist introduced emotional journaling and mindfulness practices to support authenticity and self-awareness in social interactions.', 10),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a reflective group on emotional withdrawal as a defense mechanism. Clients discussed how distancing behaviors may protect from perceived rejection but increase isolation. The therapist guided the group in identifying recent examples of withdrawal and introduced graded re-engagement strategies to enhance interpersonal functioning.', 11),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a session on undoing as a behavioral response to guilt and internal conflict. Clients explored actions taken to symbolically erase uncomfortable thoughts or behaviors such as over-apologizing or compensating excessively. The therapist introduced journaling and cognitive restructuring techniques to manage guilt adaptively.', 12),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational group on regression as a stress response. Clients shared experiences where they reverted to childlike reactions such as helplessness, dependence, or avoidance during distress. The therapist introduced grounding and self-soothing techniques to promote adult-level coping and emotional stability.', 13),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a group on physical displacement behaviors such as slamming doors or throwing objects as outlets for frustration. Clients examined how these behaviors mask emotional pain. The therapist encouraged physical alternatives like exercise, breathing regulation, or creative outlets as healthier means of tension release.', 14),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a reflective group focused on reaction formation within interpersonal relationships. Clients discussed scenarios where they acted overly kind toward individuals who elicited anger or discomfort. The therapist guided participants in identifying emotional incongruence and practicing assertive communication to achieve authentic expression.', 15),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group exploring help-rejecting complaining as a behavioral defense. Clients reflected on patterns of seeking assistance while dismissing solutions, reinforcing helplessness. The therapist emphasized the emotional need for control behind this behavior and introduced vulnerability exercises and self-acceptance practices.', 16),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a psychoeducational session on avoidance through over-scheduling or productive procrastination. Clients examined how constant busyness serves to distract from unresolved emotional issues. The therapist guided clients in identifying avoidance disguised as productivity and introduced values-based prioritization techniques to restore balance.', 17),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a group discussion on performance rituals as behavioral attempts to manage anxiety or perfectionism. Clients recognized rituals they use to delay tasks or relieve tension, such as repetitive checking or preparation routines. The therapist provided psychoeducation on behavioral activation and encouraged flexible thinking to reduce ritual dependence.', 18),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a reflective group on symbolic gestures as indirect forms of emotional communication. Clients shared how giving gifts or performing favors replaced verbal expressions of remorse or affection. The therapist helped participants explore the underlying emotions and practice more direct, assertive interpersonal repair.', 19),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a process group addressing passive-aggressive behavior as a coping mechanism. Clients identified how indirect expressions of anger, sarcasm, or avoidance function to maintain control in conflict situations. The therapist guided role-play scenarios to promote assertiveness, emotional transparency, and effective boundary-setting.', 20),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational group on behavioral coping mechanisms, focusing on the ways individuals unconsciously adapt to stress through observable behaviors. The therapist explained how actions such as acting out, avoidance, or displacement often emerge as attempts to manage distress. Clients identified personal behavioral responses to anxiety and discussed how awareness of these mechanisms can foster self-regulation and insight into underlying emotions.', 21),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a group session exploring acting out as a behavioral mechanism characterized by impulsive or disruptive behavior used to release internal tension. The therapist explained how this response bypasses emotional processing and perpetuates maladaptive cycles. Clients examined moments when they reacted impulsively under stress, and behavioral alternatives such as grounding and delayed response techniques were introduced.', 22),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a psychoeducational session on aim inhibition as a mechanism through which individuals unconsciously lower personal goals to reduce fear of failure. The therapist emphasized how this strategy can temporarily protect self-esteem but may limit long-term growth. Clients explored ways to balance realistic goal-setting with self-challenge to strengthen motivation and resilience.', 23),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a discussion on altruism as an adaptive behavioral mechanism in which helping others becomes a means of emotional regulation. The therapist highlighted how prosocial behavior can reduce distress and enhance a sense of purpose. Clients reflected on experiences of finding relief through acts of kindness and were encouraged to integrate altruism intentionally as a healthy coping strategy.', 24),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a group exploration of attack behaviors as defensive reactions to perceived threat. The therapist explained how aggression or hostility may serve as a form of self-protection when individuals feel vulnerable or powerless. Clients examined triggers for aggressive impulses and discussed assertiveness as a more adaptive alternative for expressing needs without harm.', 25),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a psychoeducational session on avoidance as a common behavioral response to stress and anxiety. The therapist explained how physical or mental withdrawal provides short-term relief but maintains long-term dysfunction. Clients reflected on avoidance patterns in their daily lives and practiced cognitive-behavioral techniques to gradually face distressing situations.', 26),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group activity on compensation as a mechanism of balancing perceived weaknesses by excelling in other areas. The therapist emphasized how this strategy can promote growth when used consciously but may also mask feelings of inadequacy. Clients identified situations where compensation contributed to both progress and avoidance, highlighting the importance of authenticity in self-improvement.', 27),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a session focused on crying as a natural behavioral release mechanism. The therapist normalized crying as an adaptive outlet for emotional regulation and discussed the physiological benefits of tearful expression. Clients explored societal stigmas around emotional vulnerability and reflected on how allowing tears can promote connection and catharsis.', 28),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a discussion on displacement as a behavioral coping strategy in which emotions such as anger or frustration are redirected toward a safer target. The therapist explained how displacement reduces immediate tension but can strain relationships. Clients identified examples of emotional redirection and practiced mindfulness to increase awareness of underlying triggers.', 29),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group session on identification as a behavioral adaptation involving imitation of others to internalize perceived strengths or traits. The therapist discussed how identification can support ego development but may hinder individuality when overused. Clients reflected on role models they have unconsciously mirrored and explored ways to integrate learned strengths into their authentic selves.', 30),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a group on reaction formation as a behavioral defense mechanism characterized by adopting the opposite behavior of one''s true feelings. The therapist explained how exaggerated politeness or kindness can mask hostility or fear. Clients examined instances of incongruent behavior and practiced emotional awareness to promote congruence between affect and action.', 31),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a psychoeducational session on regression as a behavioral return to earlier developmental patterns during stress. The therapist highlighted how behaviors such as dependence, avoidance of responsibility, or emotional outbursts may serve as temporary self-soothing strategies. Clients explored their own regressive responses and discussed adult coping alternatives to enhance self-efficacy.', 32),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group discussion on undoing as a behavioral attempt to symbolically reverse perceived wrongdoings. The therapist explained how overcompensatory acts, apologies, or rituals may momentarily reduce guilt but avoid true resolution. Clients reflected on times they engaged in undoing behaviors and learned cognitive strategies to address guilt through accountability and repair.', 33),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided an integrative group discussion on the visibility of behavioral mechanisms as reflections of inner conflict. The therapist emphasized how observable actions often signal unmet emotional needs and that recognizing these behaviors in oneself and others promotes empathy and emotional intelligence. Clients practiced reframing judgmental perceptions into compassionate understanding.', 34),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a psychoeducational exploration on how behavioral mechanisms, though diverse in form, serve the same core purpose of protecting the psyche from distress. The therapist discussed how insight into these unconscious patterns allows individuals to transition from reactive behaviors to intentional coping. Clients shared reflections on identifying their primary behavioral defenses and developing healthier alternatives for emotional regulation.', 35),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a session on differentiating adaptive and maladaptive behavioral mechanisms. The therapist explained how mechanisms like altruism and sublimation promote growth, whereas avoidance or acting out hinder progress. Clients engaged in self-assessment exercises to evaluate which behavioral patterns contribute to resilience and which perpetuate dysfunction.', 36),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a group intervention on compensation and displacement as interconnected behavioral defenses. The therapist highlighted how redirecting frustration toward external targets or overperforming in unrelated areas may disguise deeper insecurity. Clients explored patterns of these defenses in relationships and practiced grounding and reflection to enhance emotional awareness.', 37),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a session emphasizing the role of self-awareness in behavioral regulation. The therapist explained how recognizing the function of defenses such as avoidance or aggression helps clients respond rather than react. Group members discussed strategies for identifying early behavioral cues of distress and implementing mindfulness-based interventions to promote emotional control.', 38),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational group on crying and altruism as dual expressions of emotion—one inwardly releasing and the other outwardly channeling. The therapist explained how both mechanisms can restore psychological balance when used consciously. Clients shared experiences of emotional release through empathy and service, reinforcing the link between vulnerability and connection.', 39),
    (v_activity_id, v_subactivity_id, 'IOP Therapist concluded a reflective session on the importance of understanding behavioral mechanisms as signals of internal struggle rather than moral failings. The therapist emphasized that behavior often communicates unspoken emotional needs and that developing insight into these mechanisms allows for more compassionate interpersonal interactions. Clients identified one behavioral response they aim to modify through conscious coping strategies.', 40),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational group on acting out as a dysregulated behavioral discharge of affect. The discussion highlighted how impulsive conduct bypasses reflective processing and reinforces maladaptive reinforcement loops. Clients practiced pause-and-plan skills to replace urge-driven responses with goal-consistent behaviors.', 41),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a session on aim inhibition as a protective downscaling of goals to mitigate fear of failure. The group examined costs to mastery and self-efficacy when aspirations are chronically lowered. Graduated goal ladders and behavioral shaping were introduced to restore adaptive challenge.', 42),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted an intervention on altruism as prosocial regulation of distress. Clients explored how service behaviors can increase meaning, agency, and mood stabilization when used intentionally rather than as self-erasure. The therapist coached boundaries to prevent role overextension.', 43),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a discussion on attack responses as defensive mobilization under perceived threat. Psychoeducation covered physiological arousal, appraisal error, and the distinction between assertiveness and aggression. Clients rehearsed de-escalation and needs-based "I" statements to protect relationships.', 44),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a group on avoidance as negative reinforcement of anxiety. Members mapped experiential avoidance across situations and learned graded exposure with response prevention to increase tolerance for discomfort and reengage valued activities.', 45),
    (v_activity_id, v_subactivity_id, 'IOP Therapist presented compensation as a self-esteem regulation strategy that offsets perceived deficits by overdevelopment elsewhere. The group differentiated adaptive skill building from perfectionistic overcompensation. Values clarification was used to align effort with authentic competencies.', 46),
    (v_activity_id, v_subactivity_id, 'IOP Therapist normalized crying as a somatic-affective release that down-regulates sympathetic activation and signals attachment needs. Clients identified inhibitory rules about tears and practiced emotion labeling to permit safe, contained expression.', 47),
    (v_activity_id, v_subactivity_id, 'IOP Therapist taught displacement as redirection of affect toward safer targets when the primary trigger feels inaccessible. Case examples illustrated relational misattribution and conflict proliferation. Clients practiced trigger tracking and direct communication with the appropriate recipient.', 48),
    (v_activity_id, v_subactivity_id, 'IOP Therapist explored identification as modeling that internalizes observed strengths and norms. Discussion emphasized selective, intentional imitation that enhances ego functions without eroding authenticity. Participants created strengths inventories from chosen role models.', 49),
    (v_activity_id, v_subactivity_id, 'IOP Therapist examined reaction formation as a polarity flip that masks unacceptable impulses with exaggerated opposites. Clients identified incongruent behaviors and practiced congruence skills: name the primary affect, tolerate ambivalence, and express proportionately.', 50);

    -- Verificar inserción
    SELECT COUNT(*) INTO v_paragraph_count
    FROM activity_paragraphs
    WHERE activity_id = v_activity_id
    AND subactivity_id = v_subactivity_id;

    RAISE NOTICE '✅✅✅ COMPLETADO: % párrafos insertados para "Behavioral Mechanisms" ✅✅✅', v_paragraph_count;

END $$;

-- Verificar inserción
SELECT 
    a.activity_name,
    sa.subactivity_name,
    COUNT(ap.paragraph_id) as total_paragraphs,
    MIN(ap.paragraph_order) as min_order,
    MAX(ap.paragraph_order) as max_order
FROM activities a
JOIN subactivities sa ON sa.activity_id = a.activity_id
JOIN activity_paragraphs ap ON ap.subactivity_id = sa.subactivity_id
WHERE LOWER(a.activity_name) = 'coping skills'
AND LOWER(sa.subactivity_name) = 'behavioral mechanisms'
GROUP BY a.activity_name, sa.subactivity_name
ORDER BY a.activity_name, sa.subactivity_name;

