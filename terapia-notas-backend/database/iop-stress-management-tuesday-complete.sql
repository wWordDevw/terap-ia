-- =============================================
-- IOP: Stress Management - MARTES (COMPLETO)
-- =============================================
-- Este script inserta la actividad "Stress Management" para IOP del día MARTES
-- Incluye: Actividad + 2 subactividades (Stressors, Types of stress) con TODOS sus párrafos
-- NOTA: NO elimina actividades existentes, solo añade Stress Management
-- =============================================

-- Insertar actividad "Stress Management" para IOP
DO $$
DECLARE
    v_activity_id UUID;
    v_stressors_id UUID;
    v_types_of_stress_id UUID;
    v_paragraph_count INTEGER;
BEGIN
    -- Buscar si ya existe la actividad "Stress Management"
    SELECT activity_id INTO v_activity_id
    FROM activities
    WHERE LOWER(activity_name) = 'stress management'
    LIMIT 1;

    -- Si no existe, crearla
    IF v_activity_id IS NULL THEN
        INSERT INTO activities (activity_name, description, is_active)
        VALUES ('Stress Management', 'Stress Management activities for IOP groups - Tuesday', TRUE)
        RETURNING activity_id INTO v_activity_id;
        
        RAISE NOTICE '✅ Actividad "Stress Management" creada con ID: %', v_activity_id;
    ELSE
        RAISE NOTICE '✅ Actividad "Stress Management" ya existe con ID: %', v_activity_id;
    END IF;

    -- =============================================
    -- SUBACTIVIDAD 1: STRESSORS (60 párrafos)
    -- =============================================
    SELECT subactivity_id INTO v_stressors_id
    FROM subactivities
    WHERE activity_id = v_activity_id
    AND LOWER(subactivity_name) = 'stressors'
    LIMIT 1;

    IF v_stressors_id IS NULL THEN
        INSERT INTO subactivities (activity_id, subactivity_name, description, is_active)
        VALUES (v_activity_id, 'Stressors', 'Identifying and understanding stressors in daily life', TRUE)
        RETURNING subactivity_id INTO v_stressors_id;
        RAISE NOTICE '✅ Subactividad "Stressors" creada';
    END IF;

    INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order, is_active)
    VALUES
        -- Primera lista (1-20)
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a psychoeducational group focused on identifying primary and secondary stressors in daily life. Clients explored how environmental demands, interpersonal tension, and internal pressures contribute to heightened stress responses. The therapist guided the group in differentiating between controllable and uncontrollable stressors to enhance emotional regulation.', 1, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a reflective group session on the relationship between chronic stressors and emotional exhaustion. Clients shared personal experiences of prolonged strain and its impact on mood and functioning. The therapist introduced psychoeducation on the cumulative effect of minor stressors and discussed coping strategies for managing sustained distress.', 2, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a discussion centered on recognizing early physiological and cognitive signs of stress activation. Clients practiced identifying triggers such as time pressure, interpersonal conflict, and self-imposed expectations. The therapist encouraged the use of mindfulness-based awareness to intervene before escalation.', 3, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a group on differentiating external stressors from internalized stress patterns. Clients explored how self-critical thoughts often amplify external challenges. The therapist provided tools for cognitive restructuring and self-compassion to reduce internal pressure.', 4, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a process-oriented group examining workplace and role-related stressors. Clients discussed how performance anxiety, unclear boundaries, and workload imbalance contribute to emotional fatigue. The therapist guided the group in problem-solving and prioritization skills to enhance occupational coping.', 5, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a psychoeducational session on how relational dynamics serve as significant stress triggers. Clients reflected on patterns of communication that lead to frustration or withdrawal. The therapist provided techniques for assertive dialogue and boundary setting to reduce relational strain.', 6, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a group focusing on the role of financial and environmental stressors in maintaining chronic tension. Clients examined how uncertainty and instability contribute to anxiety and helplessness. The therapist introduced practical stress management plans emphasizing organization and emotional grounding.', 7, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a reflective group exploring health-related stressors and their connection to emotional well-being. Clients discussed how medical issues or caregiving responsibilities affect mood and energy levels. The therapist emphasized balanced routines and self-care as protective factors.', 8, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a discussion about internal stressors associated with perfectionism and unrealistic expectations. Clients identified how striving for control increases emotional reactivity. The therapist guided clients through exercises to set flexible goals and practice self-acceptance.', 9, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a psychoeducational group addressing the link between social isolation and stress. Clients discussed how avoidance or disconnection from support systems exacerbates distress. The therapist encouraged intentional social engagement as a buffer against chronic stress.', 10, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a group session focused on identifying stressors associated with transitions and change. Clients shared personal experiences of adaptation difficulties in areas such as employment, relationships, or housing. The therapist introduced emotional adjustment strategies to strengthen resilience.', 11, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a process group examining the impact of digital overload and information fatigue as modern stressors. Clients reflected on how constant connectivity contributes to restlessness and poor concentration. The therapist encouraged technology boundaries and mindful digital use to restore balance.', 12, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a reflective group on family-related stressors and emotional boundaries. Clients explored how unresolved family roles or expectations influence current distress. The therapist introduced detachment strategies and communication techniques to improve family interactions.', 13, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a psychoeducational group addressing cumulative stress and its influence on cognitive functioning. Clients learned about the relationship between chronic stress exposure, attentional fatigue, and irritability. The therapist provided grounding and time management tools to enhance recovery.', 14, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a discussion on interpersonal stressors in peer and romantic relationships. Clients analyzed how miscommunication and unmet expectations perpetuate emotional tension. The therapist guided participants through empathy and active listening exercises to promote healthier exchanges.', 15, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a group focusing on environmental triggers such as noise, crowding, or disorganization. Clients reflected on how sensory and contextual overload contribute to irritability. The therapist emphasized structured routines and environmental modification as part of stress reduction.', 16, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a session exploring the role of unresolved grief or loss as hidden stressors. Clients discussed how suppressed emotions can manifest as irritability or anxiety. The therapist facilitated journaling and emotional processing techniques to increase self-awareness.', 17, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a psychoeducational group on the intersection of stress and lifestyle habits. Clients examined how poor nutrition, sleep disruption, or inactivity exacerbate stress reactivity. The therapist provided education on lifestyle balance and incremental behavioral changes.', 18, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a reflective group examining anticipatory stress related to uncertainty and fear of future events. Clients described patterns of rumination and avoidance. The therapist taught grounding exercises and cognitive reframing techniques to reduce worry-based activation.', 19, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a process-oriented group exploring the cumulative effect of multiple minor stressors. Clients discussed how unresolved daily frustrations accumulate into significant distress over time. The therapist encouraged use of stress journals and behavioral tracking to improve coping awareness and early intervention.', 20, TRUE),
        -- Segunda lista (21-40)
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a psychoeducational group examining how unrecognized daily stressors influence emotional reactivity. Clients reflected on the difference between acute and chronic stress. The therapist emphasized the importance of self-monitoring and early intervention to prevent emotional escalation.', 21, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a reflective session focused on stressors related to personal responsibility and caregiving roles. Clients identified how excessive caretaking can lead to emotional depletion. The therapist introduced self-boundary awareness and prioritization as protective coping mechanisms.', 22, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a group session addressing the physiological effects of stress exposure. Clients discussed how headaches, muscle tension, and sleep disturbances often signal overload. The therapist provided psychoeducation on body-mind awareness and relaxation response training.', 23, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a process group focused on the stress of unmet personal goals. Clients explored the frustration that arises when progress is slower than expected. The therapist introduced acceptance-based strategies and reframing techniques to maintain motivation.', 24, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a psychoeducational group on emotional labor as a stressor. Clients discussed the toll of suppressing emotions in professional and family roles. The therapist guided discussion on emotional authenticity and self-expression to reduce internal tension.', 25, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a reflective discussion exploring relational stressors related to miscommunication and assumption-making. Clients identified how unclear expectations contribute to conflict. The therapist emphasized assertive communication and clarification as preventative tools.', 26, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a group exploring cultural and societal stressors. Clients reflected on pressures related to identity, performance, and belonging. The therapist encouraged clients to examine internalized beliefs and develop resilience through community and self-validation.', 27, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a psychoeducational group addressing the connection between stress and avoidance behaviors. Clients examined how procrastination temporarily relieves stress but increases anxiety long-term. The therapist introduced behavioral activation strategies to promote follow-through and control.', 28, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a reflective group on stressors connected to overcommitment and perfectionistic standards. Clients discussed difficulty saying no to demands. The therapist guided participants through exercises on assertiveness and realistic expectation setting.', 29, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a process group exploring the effects of unpredictable stressors such as emergencies or sudden change. Clients shared their emotional responses to uncertainty. The therapist provided grounding and flexibility-building exercises to improve adaptability.', 30, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a psychoeducational discussion on the impact of interpersonal rejection as a significant emotional stressor. Clients reflected on past experiences of exclusion and their coping responses. The therapist highlighted self-validation and social support as buffers against rejection stress.', 31, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a group exploring the cumulative effects of micro-stressors throughout the day. Clients learned to recognize how small frustrations accumulate to impact mood. The therapist taught pacing and decompression techniques to reduce emotional overload.', 32, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a session examining anticipatory anxiety as a cognitive stressor. Clients discussed how worry about future events heightens current distress. The therapist introduced cognitive defusion and present-moment awareness techniques to manage anticipatory tension.', 33, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a reflective group exploring the impact of unresolved conflict as a stressor. Clients analyzed patterns of avoidance and escalation. The therapist introduced structured problem-solving steps to promote resolution and emotional closure.', 34, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a psychoeducational session on academic and performance-related stressors. Clients identified how achievement pressure and comparison contribute to anxiety. The therapist emphasized intrinsic motivation and balanced self-assessment to manage stress effectively.', 35, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a group discussion focused on stressors associated with social media exposure. Clients reflected on how comparison, negative content, and overstimulation affect mood. The therapist encouraged digital mindfulness and intentional consumption habits.', 36, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a process group addressing existential and meaning-related stressors. Clients explored feelings of purposelessness or stagnation. The therapist guided reflection on values clarification and goal alignment to restore direction.', 37, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a psychoeducational group focusing on stress related to uncertainty in relationships. Clients discussed fear of abandonment and inconsistency from others. The therapist introduced emotion labeling and communication tools to manage relational insecurity.', 38, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a group session addressing the stress of conflicting priorities between work, family, and self-care. Clients reflected on guilt associated with neglecting personal needs. The therapist reinforced balance through time allocation and self-permission techniques.', 39, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a reflective group examining environmental unpredictability as a chronic stressor. Clients discussed the anxiety of unstable living or community conditions. The therapist provided psychoeducation on resilience development and encouraged focus on controllable variables.', 40, TRUE),
        -- Tercera lista (41-60)
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a psychoeducational group identifying cumulative stressors that affect daily functioning. Clients examined how ongoing minor frustrations compound over time, resulting in irritability and fatigue. The therapist introduced stress mapping as a tool for recognizing patterns and prioritizing effective coping responses.', 41, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a reflective group discussing the emotional impact of unrealistic personal standards as chronic stressors. Clients shared experiences of self-imposed pressure leading to burnout. The therapist guided them through self-compassion exercises to promote balanced self-expectations.', 42, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a group session examining environmental and sensory overload as stress triggers. Clients identified noise, clutter, or overstimulation as factors contributing to agitation. The therapist provided psychoeducation on environmental regulation and mindful awareness techniques.', 43, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a discussion on the stress associated with loss of control. Clients explored how unpredictability in life circumstances heightens anxiety. The therapist introduced grounding and acceptance-based coping techniques to promote psychological flexibility.', 44, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a group focused on interpersonal conflict as a recurrent stressor. Clients described cycles of miscommunication that increase tension. The therapist emphasized reflective listening and emotion labeling as strategies for de-escalation.', 45, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a psychoeducational session on role strain as a stressor. Clients discussed the pressure of balancing multiple responsibilities such as parent, employee, or caregiver. The therapist guided participants to explore boundary setting and task delegation to reduce strain.', 46, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a process group examining how chronic stressors can mimic symptoms of anxiety and depression. Clients reflected on their physical and cognitive signs of stress overload. The therapist encouraged early recognition and adaptive coping behaviors to prevent emotional decline.', 47, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a reflective group centered on the impact of relationship instability as a stressor. Clients explored fear of abandonment, inconsistent communication, and unmet emotional needs. The therapist provided psychoeducation on attachment dynamics and strategies for self-soothing.', 48, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a group exploring financial insecurity as a primary stressor. Clients shared how economic strain influences their sleep, mood, and motivation. The therapist introduced problem-solving skills and emotional reframing to manage financial stress adaptively.', 49, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a psychoeducational discussion about stressors related to identity and self-concept. Clients reflected on how internal conflict between self-image and expectations contributes to distress. The therapist guided exploration of authenticity and self-acceptance as stabilizing factors.', 50, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a group addressing stress from prolonged uncertainty and decision paralysis. Clients discussed how indecision amplifies emotional discomfort. The therapist introduced structured decision-making frameworks to restore a sense of control.', 51, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a process-oriented session on the stress associated with social evaluation and fear of judgment. Clients reflected on how perceived criticism affects self-esteem and behavior. The therapist provided exposure and cognitive reframing exercises to reduce evaluation anxiety.', 52, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a group exploring physical health stressors and psychosomatic responses. Clients examined how chronic pain or medical diagnoses contribute to emotional strain. The therapist emphasized the importance of integrated self-care and adaptive pacing strategies.', 53, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a reflective group on stress linked to personal growth and change. Clients identified the emotional discomfort that accompanies progress. The therapist normalized transitional stress and introduced reframing as a way to maintain perspective during periods of adjustment.', 54, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a psychoeducational session addressing moral and ethical conflicts as stressors. Clients shared experiences of internal tension when actions misalign with values. The therapist guided value clarification exercises to foster integrity and reduce guilt-related stress.', 55, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a group examining stress connected to over-responsibility for others'' emotions. Clients identified patterns of people-pleasing and emotional caretaking. The therapist introduced assertiveness training and detachment techniques to restore emotional balance.', 56, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a discussion on anticipatory stress before social or performance situations. Clients reflected on physiological sensations such as rapid heartbeat and muscle tension. The therapist introduced progressive muscle relaxation and visualization exercises to reduce anticipatory arousal.', 57, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist conducted a group session exploring stress arising from unmet needs for stability and predictability. Clients discussed how constant change or uncertainty undermines their sense of safety. The therapist provided psychoeducation on self-grounding and environmental consistency as coping anchors.', 58, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist facilitated a reflective group on the link between self-neglect and increased vulnerability to stress. Clients explored how skipping meals, rest, or recreation intensifies irritability and fatigue. The therapist reinforced self-care as a preventative approach to emotional dysregulation.', 59, TRUE),
        (v_activity_id, v_stressors_id, 'IOP Therapist led a psychoeducational group highlighting cumulative stress within family systems. Clients examined how unresolved relational tension contributes to chronic emotional pressure. The therapist encouraged use of healthy communication, perspective-taking, and boundary setting to alleviate familial stress.', 60, TRUE);

    GET DIAGNOSTICS v_paragraph_count = ROW_COUNT;
    RAISE NOTICE '✅ Insertados % párrafos para "Stressors"', v_paragraph_count;

    -- =============================================
    -- SUBACTIVIDAD 2: TYPES OF STRESS (40 párrafos)
    -- =============================================
    SELECT subactivity_id INTO v_types_of_stress_id
    FROM subactivities
    WHERE activity_id = v_activity_id
    AND LOWER(subactivity_name) = 'types of stress'
    LIMIT 1;

    IF v_types_of_stress_id IS NULL THEN
        INSERT INTO subactivities (activity_id, subactivity_name, description, is_active)
        VALUES (v_activity_id, 'Types of stress', 'Understanding different types of stress and their impact', TRUE)
        RETURNING subactivity_id INTO v_types_of_stress_id;
        RAISE NOTICE '✅ Subactividad "Types of stress" creada';
    END IF;

    INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order, is_active)
    VALUES
        -- Primera lista (1-20)
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist facilitated a psychoeducational group focused on differentiating between acute, episodic, and chronic stress. Clients explored how each type of stress manifests physiologically and emotionally. The therapist guided reflection on how awareness of stress types informs more targeted coping interventions.', 1, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist conducted a reflective group exploring the impact of acute stressors on daily functioning. Clients discussed sudden stress triggers such as conflict or time pressure. The therapist emphasized grounding techniques to manage immediate physiological arousal.', 2, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist led a psychoeducational session examining episodic stress patterns in clients who experience frequent crises or overcommitment. Participants identified behavioral tendencies that perpetuate cycles of tension. The therapist introduced pacing and boundary-setting skills to prevent burnout.', 3, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist facilitated a group discussion on chronic stress and its long-term psychological consequences. Clients analyzed how persistent stress can lead to fatigue, irritability, and emotional detachment. The therapist provided psychoeducation on resilience-building and long-term self-regulation strategies.', 4, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist conducted a cognitive-behavioral session helping clients recognize their dominant type of stress response. Through guided discussion, participants identified whether their stressors were primarily situational, relational, or internalized. The therapist encouraged individualized coping plans.', 5, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist led a reflective group exploring the cumulative nature of micro-stressors. Clients discussed how small, repetitive frustrations accumulate into chronic strain. The therapist guided participants in developing awareness of early signs of stress buildup.', 6, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist facilitated a psychoeducational group differentiating between eustress and distress. Clients examined how moderate levels of stress can enhance motivation and focus, while excessive stress impairs performance. The therapist introduced techniques for maintaining optimal arousal balance.', 7, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist conducted a group exploring stress vulnerability factors. Clients identified personal, biological, and environmental contributors to their stress reactivity. The therapist emphasized the importance of self-care and self-awareness in minimizing stress intensity.', 8, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist led a process group analyzing how cognitive distortions contribute to perceived stress. Clients practiced identifying irrational thoughts that amplify stress responses. The therapist guided reframing exercises to foster cognitive flexibility.', 9, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist facilitated a reflective session focused on understanding how chronic exposure to stress influences emotional regulation. Clients discussed how prolonged hyperarousal leads to exhaustion and detachment. The therapist provided education on stress recovery cycles and rest scheduling.', 10, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist conducted a psychoeducational discussion highlighting the relationship between occupational stress and identity. Clients explored how role expectations and workload create ongoing tension. The therapist introduced assertiveness training and prioritization skills.', 11, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist led a group exploring the connection between relational stress and attachment styles. Clients reflected on how insecure attachment patterns intensify emotional responses to conflict. The therapist guided discussion toward building self-regulated, secure coping mechanisms.', 12, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist facilitated a process group addressing how chronic stress can manifest as physical symptoms such as headaches, tension, and sleep disruption. Clients shared personal experiences of somatic responses. The therapist emphasized holistic approaches to mind-body regulation.', 13, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist conducted a psychoeducational group on the physiological mechanisms of stress. Clients learned about the role of the sympathetic and parasympathetic nervous systems. The therapist provided breathing and grounding exercises to support autonomic balance.', 14, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist led a reflective group exploring environmental and contextual stressors such as noise, clutter, or instability. Clients discussed how sensory overload affects focus and patience. The therapist introduced strategies for environmental modification and time management.', 15, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist facilitated a session exploring developmental differences in stress responses. Clients analyzed how early life experiences influence current stress tolerance. The therapist provided psychoeducation on resilience-building through reconditioning emotional responses.', 16, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist conducted a group focused on distinguishing external stressors from internal self-imposed pressures. Clients discussed perfectionism, guilt, and unrealistic standards as contributors to chronic distress. The therapist guided cognitive reframing to promote self-compassion.', 17, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist led a process group on cultural and societal influences in shaping stress experiences. Clients reflected on collective expectations and the stigma surrounding rest or emotional vulnerability. The therapist reinforced normalization of stress and the importance of adaptive coping.', 18, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist facilitated a reflective group on anticipatory stress. Clients discussed how fear of future outcomes and uncertainty sustain anxiety. The therapist introduced grounding and cognitive restructuring to reduce preoccupation with hypothetical stressors.', 19, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist conducted a closing session integrating knowledge of stress types into personalized management plans. Clients identified their predominant stress patterns and corresponding coping mechanisms. The therapist encouraged continued self-monitoring and flexibility in applying learned strategies.', 20, TRUE),
        -- Segunda lista (21-40)
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist facilitated a psychoeducational session reviewing the psychological and physiological distinctions among acute, episodic, and chronic stress. Clients examined how the body''s "fight-or-flight" system activates differently in each case. The therapist emphasized awareness of one''s personal stress response profile as a foundation for targeted self-regulation.', 21, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist conducted a reflective group focused on the hidden impact of low-grade, chronic stress. Clients explored how prolonged exposure to mild stressors contributes to fatigue, irritability, and concentration difficulties. The therapist encouraged mindfulness-based interventions to restore balance and prevent exhaustion.', 22, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist led a cognitive-behavioral session helping clients distinguish between controllable and uncontrollable stressors. Participants reflected on how mislabeling events as uncontrollable increases helplessness. The therapist guided problem-focused and emotion-focused coping strategies to address both types effectively.', 23, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist facilitated a process group discussing how episodic stress patterns often result from overcommitment or rigid perfectionism. Clients shared examples of "self-induced urgency." The therapist modeled cognitive reframing to promote flexible goal-setting and time management.', 24, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist conducted a psychoeducational discussion about how acute stress, when appropriately managed, can increase alertness and motivation. Clients reflected on times when short-term stress helped them meet challenges. The therapist reinforced distinguishing between productive activation and harmful overload.', 25, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist led a group examining the role of cumulative stress from multiple life domains. Clients identified overlapping stressors from work, relationships, and health concerns. The therapist encouraged prioritization and compartmentalization to enhance emotional clarity.', 26, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist facilitated a reflective discussion exploring the relationship between chronic stress and maladaptive coping behaviors such as avoidance or substance use. Clients identified patterns of escapism and discussed healthier alternatives. The therapist emphasized self-awareness as the first step toward behavioral change.', 27, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist conducted a psychoeducational session introducing the transactional model of stress. Clients learned how perception and appraisal influence the intensity of stress responses. The therapist guided them in reframing situations to reduce emotional reactivity.', 28, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist led a mindfulness-based group aimed at helping clients recognize early warning signs of acute stress. Participants practiced body scans and breath awareness to detect tension before escalation. The therapist emphasized the benefits of immediate intervention techniques.', 29, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist facilitated a session focused on identifying the emotional signatures of different stress types. Clients explored how acute stress may produce anxiety, while chronic stress often leads to numbness or apathy. The therapist introduced emotion labeling and tracking as monitoring tools.', 30, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist conducted a reflective group on how stress responses vary across individuals. Clients discussed the influence of temperament, resilience, and environmental stability on stress perception. The therapist reinforced self-compassion and non-comparison in managing stress.', 31, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist led a psychoeducational group on occupational stress syndromes, such as compassion fatigue and burnout. Clients examined how prolonged exposure to emotionally demanding environments contributes to chronic stress. The therapist provided education on prevention and recovery strategies.', 32, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist facilitated a cognitive restructuring session focused on reframing catastrophic interpretations of acute stress events. Clients practiced identifying distorted thinking that amplifies perceived danger. The therapist modeled realistic appraisals to encourage balanced responses.', 33, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist conducted a discussion exploring how relational conflict creates episodic stress. Clients examined cycles of tension and resolution within interpersonal dynamics. The therapist introduced assertiveness and communication skills to minimize repetitive conflict-based stress.', 34, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist led a reflective group on the interplay between physical health and chronic stress. Clients discussed how persistent tension affects appetite, sleep, and energy. The therapist emphasized the importance of integrated self-care routines involving rest, movement, and nutrition.', 35, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist facilitated a process-oriented session exploring delayed stress responses. Clients shared experiences of emotional detachment during crises followed by later emotional flooding. The therapist guided participants in recognizing delayed processing as a normal response to trauma and stress.', 36, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist conducted a psychoeducational group examining the impact of societal and technological overstimulation as modern stressors. Clients discussed how constant connectivity sustains low-level anxiety. The therapist encouraged digital boundaries and intentional downtime.', 37, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist led a mindfulness-based discussion addressing anticipatory stress and worry about potential outcomes. Clients practiced grounding exercises to reorient attention to the present. The therapist emphasized cognitive defusion to decrease over-identification with future-oriented thoughts.', 38, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist facilitated a group exploring stress contagion within family systems. Clients reflected on how others'' anxiety influences their emotional state. The therapist introduced boundary-setting techniques and co-regulation practices to mitigate secondary stress.', 39, TRUE),
        (v_activity_id, v_types_of_stress_id, 'IOP Therapist conducted a closing psychoeducational session integrating understanding of stress types into daily functioning. Clients identified their dominant patterns—acute, episodic, or chronic—and developed personalized coping plans. The therapist reinforced ongoing reflection and proactive stress management as part of emotional maintenance.', 40, TRUE);

    GET DIAGNOSTICS v_paragraph_count = ROW_COUNT;
    RAISE NOTICE '✅ Insertados % párrafos para "Types of stress"', v_paragraph_count;

    RAISE NOTICE '✅✅✅ COMPLETADO: Stress Management con subactividades Stressors y Types of stress insertadas ✅✅✅';

END $$;

-- Verificar inserción
SELECT 
    a.activity_name,
    s.subactivity_name,
    COUNT(ap.paragraph_id) as total_paragraphs
FROM activities a
LEFT JOIN subactivities s ON s.activity_id = a.activity_id
LEFT JOIN activity_paragraphs ap ON ap.subactivity_id = s.subactivity_id
WHERE LOWER(a.activity_name) = 'stress management'
GROUP BY a.activity_name, s.subactivity_name
ORDER BY a.activity_name, s.subactivity_name;
