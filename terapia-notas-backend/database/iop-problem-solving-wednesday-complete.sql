-- =============================================
-- IOP: Problem Solving - MIÉRCOLES (COMPLETO)
-- =============================================
-- Este script inserta la actividad "Problem Solving" para IOP del día MIÉRCOLES
-- Incluye: Actividad + 1 subactividad (Problem Identification) con TODOS sus párrafos
-- NOTA: NO elimina actividades existentes, solo añade Problem Solving
-- =============================================

-- Insertar actividad "Problem Solving" para IOP
DO $$
DECLARE
    v_activity_id UUID;
    v_problem_identification_id UUID;
    v_paragraph_count INTEGER;
BEGIN
    -- Buscar si ya existe la actividad "Problem Solving"
    SELECT activity_id INTO v_activity_id
    FROM activities
    WHERE LOWER(activity_name) = 'problem solving'
    LIMIT 1;

    -- Si no existe, crearla
    IF v_activity_id IS NULL THEN
        INSERT INTO activities (activity_name, description, is_active)
        VALUES ('Problem Solving', 'Problem Solving activities for IOP groups - Wednesday', TRUE)
        RETURNING activity_id INTO v_activity_id;
        
        RAISE NOTICE '✅ Actividad "Problem Solving" creada con ID: %', v_activity_id;
    ELSE
        RAISE NOTICE '✅ Actividad "Problem Solving" ya existe con ID: %', v_activity_id;
    END IF;

    -- =============================================
    -- SUBACTIVIDAD 1: PROBLEM IDENTIFICATION (40 párrafos)
    -- =============================================
    SELECT subactivity_id INTO v_problem_identification_id
    FROM subactivities
    WHERE activity_id = v_activity_id
    AND LOWER(subactivity_name) = 'problem identification'
    LIMIT 1;

    IF v_problem_identification_id IS NULL THEN
        INSERT INTO subactivities (activity_id, subactivity_name, description, is_active)
        VALUES (v_activity_id, 'Problem Identification', 'Identifying and defining problems accurately', TRUE)
        RETURNING subactivity_id INTO v_problem_identification_id;
        RAISE NOTICE '✅ Subactividad "Problem Identification" creada';
    END IF;

    INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order, is_active)
    VALUES
        -- Primera lista (1-20)
        (v_activity_id, v_problem_identification_id, 'IOP Therapist facilitated a cognitive-based group session on the foundational step of problem-solving: accurate problem identification. Clients were guided to differentiate between subjective emotional reactions and objective situational challenges. The therapist emphasized the importance of specificity when articulating problems, as vague or global thinking tends to reinforce helplessness and inhibit goal-directed behavior.', 1, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist introduced a psychoeducational activity aimed at enhancing clients'' metacognitive awareness related to problem formulation. Through structured exercises, clients learned to separate their automatic thoughts from the actual circumstances triggering distress. The therapist modeled a step-by-step approach to clarifying internal versus external problems, promoting insight and self-efficacy.', 2, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist led a group focused on the psychological barriers to effective problem identification, including cognitive distortions such as catastrophizing and emotional reasoning. Clients engaged in a guided journaling activity to reframe perceived crises into specific, solvable issues. The therapist provided clinical feedback to reinforce the use of neutral, observable language in defining problems.', 3, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist facilitated an interactive discussion on how avoidance behaviors often stem from poorly defined or overwhelming problems. Clients were encouraged to dissect current challenges into concrete components. The therapist highlighted how clear problem definition supports activation of executive functioning and reduces affective dysregulation commonly seen in mood disorders.', 4, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist implemented a problem-identification skills group, integrating elements of solution-focused therapy. Clients were asked to describe a recent interpersonal or internal difficulty and examine the facts versus interpretations. The therapist emphasized the therapeutic impact of clarity and precision in language to foster accountability and emotional regulation.', 5, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist conducted a goal-oriented session centered on developing clients'' abilities to clearly define personal and interpersonal challenges. The group explored how ambiguous or emotionally charged descriptions of problems can hinder effective resolution. The therapist utilized Socratic questioning to help clients reframe problems in measurable, realistic terms.', 6, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist engaged clients in a cognitive-behavioral exercise designed to enhance self-reflection and precision in identifying the root causes of recurring difficulties. Clients were encouraged to move from global complaints to specific, actionable statements. The therapist reinforced the value of this skill in reducing reactivity and promoting proactive coping.', 7, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist guided clients through a structured problem identification worksheet to distinguish between perceived threats and actual obstacles. Emphasis was placed on increasing self-awareness of habitual patterns of generalization and personalization that cloud problem recognition. Clients practiced articulating concerns with clarity and emotional neutrality.', 8, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist facilitated a skill-building session on pinpointing the central issue within emotionally complex situations. The group discussed how misidentification of problems can perpetuate avoidance and ineffective solutions. The therapist modeled the use of open-ended prompts to deepen insight and foster internal locus of control.', 9, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist led a session highlighting the link between accurate problem identification and emotional regulation. Clients examined recent stressors and practiced isolating the core issue from secondary emotional responses. The therapist emphasized that this skill enhances decision-making and decreases impulsive behaviors in the face of adversity.', 10, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist facilitated a group session focused on problem identification as a foundation for adaptive coping. Clients explored the distinction between primary stressors and secondary emotional reactions. The therapist encouraged the use of cognitive restructuring to isolate the core issue and minimize distortions caused by heightened affect. This process supported greater clarity in defining problems before moving into solution-focused strategies.', 11, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist guided clients through an exploration of recent stressors, highlighting how mislabeling or generalizing difficulties can exacerbate emotional dysregulation. Clients practiced narrowing down overwhelming scenarios into specific, manageable problems. The therapist reinforced the use of mindfulness and reflective questioning to enhance awareness and improve self-regulation.', 12, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist conducted an intervention designed to strengthen clients'' executive functioning by teaching them to differentiate between surface complaints and underlying problems. The discussion emphasized how accurate identification of the problem enhances decision-making and reduces impulsivity. Clients were encouraged to apply behavioral activation once clarity was achieved.', 13, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist introduced structured problem identification techniques, emphasizing the importance of separating facts from interpretations. Clients engaged in exercises to reframe vague or globalized worries into defined challenges. The therapist validated client efforts and highlighted how this skill promotes emotional stability and adaptive coping responses.', 14, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist facilitated a group discussion centered on recognizing the role of distorted cognitions in problem misidentification. Clients reflected on personal situations where emotional reactivity obscured the actual issue. The therapist modeled problem deconstruction and encouraged clients to practice identifying controllable elements within broader concerns, fostering empowerment and resilience.', 15, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist facilitated a group session addressing the relevance of accurate problem identification in cognitive-behavioral frameworks. Clients were encouraged to disentangle emotional reactivity from the objective features of their stressors. The therapist emphasized how this skill enhances affect regulation and allows for the implementation of evidence-based coping strategies.', 16, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist guided clients through a structured exploration of recent challenges, focusing on the distinction between primary triggers and secondary consequences. The group discussed how misinterpretation of events can perpetuate maladaptive patterns. The therapist reinforced the application of analytical thinking and reflective processing to increase clarity and reduce impulsivity.', 17, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist engaged clients in exercises that highlighted how global or generalized complaints can obscure the central problem. By breaking down complex scenarios into manageable components, clients were able to conceptualize their stressors more effectively. The therapist introduced cognitive mapping tools to strengthen insight and promote adaptive problem-solving.', 18, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist conducted a session centered on the cognitive distortions that interfere with precise problem identification. Clients examined how catastrophizing or personalization often magnify difficulties beyond their true scope. The therapist validated these insights and demonstrated how restructuring techniques can help redirect focus toward realistic and controllable aspects of a situation.', 19, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist led a group discussion aimed at fostering metacognitive awareness of the problem-solving process. Clients were encouraged to differentiate between external obstacles and internalized emotional responses. The therapist modeled the use of Socratic questioning as a method to clarify underlying issues and support the development of healthier coping pathways.', 20, TRUE),
        -- Segunda lista (21-40)
        (v_activity_id, v_problem_identification_id, 'IOP Therapist facilitated a cognitive-behavioral group on the skill of identifying problems with accuracy and specificity. Clients practiced distinguishing between emotional perceptions and objective details. The therapist highlighted that precise problem definition increases clarity and self-efficacy.', 21, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist conducted a psychoeducational session focused on separating emotions from factual circumstances. Clients worked through structured exercises to identify the true source of distress. The therapist emphasized that clear identification allows for more targeted interventions and emotional regulation.', 22, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist led a group exploring how distorted thinking impacts problem recognition. Clients identified examples of catastrophizing and all-or-nothing thinking that clouded problem-solving. The therapist provided corrective feedback and guided reframing exercises.', 23, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist facilitated a reflective session on the role of avoidance in problem misidentification. Clients examined how minimizing or ignoring issues increases anxiety over time. The therapist encouraged gradual exposure and proactive problem clarification.', 24, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist implemented a structured group exercise integrating solution-focused questioning. Clients discussed recent challenges and separated interpretation from observation. The therapist modeled neutral language to promote realistic thinking and accountability.', 25, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist guided clients in identifying how generalized complaints hinder progress. Participants practiced breaking down broad frustrations into measurable and solvable issues. The therapist emphasized the importance of cognitive precision in reducing helplessness.', 26, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist conducted a process group on the emotional consequences of poorly defined problems. Clients reflected on how ambiguity intensifies frustration and avoidance. The therapist modeled cognitive restructuring techniques to enhance clarity and self-awareness.', 27, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist facilitated an interactive discussion on self-monitoring as part of effective problem identification. Clients were encouraged to observe thought patterns that distort accuracy. The therapist introduced journaling tools to track triggers and cognitive biases.', 28, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist led a group on the link between misinterpreted stressors and emotional dysregulation. Clients learned to isolate specific triggers within complex emotional reactions. The therapist provided feedback emphasizing how clarity supports emotional balance.', 29, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist conducted a psychoeducational group focusing on problem deconstruction. Clients practiced dissecting broad conflicts into core elements. The therapist highlighted the benefit of this process for improving decision-making and executive functioning.', 30, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist facilitated a cognitive-based group addressing common barriers to accurate problem identification. Clients identified habitual patterns of blame and overgeneralization. The therapist encouraged responsibility-taking and perspective broadening.', 31, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist guided clients through exercises emphasizing the role of perception in problem mislabeling. Participants analyzed how assumptions influence judgment. The therapist reinforced objective language as a method to minimize emotional bias.', 32, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist conducted a reflective session on recognizing root causes rather than surface complaints. Clients discussed how focusing on symptoms distracts from actual problems. The therapist encouraged deeper analysis using structured self-inquiry techniques.', 33, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist led a psychoeducational discussion on separating situational stressors from internalized emotional reactions. Clients practiced using factual observation statements. The therapist modeled mindful awareness and cognitive labeling as regulation tools.', 34, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist facilitated a group focused on strengthening analytical thinking during problem-solving. Clients practiced transforming emotional complaints into action-based goals. The therapist reinforced problem clarity as an essential precursor to change.', 35, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist conducted a process-oriented group where clients explored recent interpersonal challenges. Through guided reflection, participants distinguished between behavioral triggers and emotional responses. The therapist emphasized self-awareness and cognitive control.', 36, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist led a skill-building session on identifying manageable aspects of larger stressors. Clients practiced differentiating what they can influence from external factors. The therapist highlighted this awareness as key to reducing powerlessness and frustration.', 37, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist facilitated a group on developing insight into habitual thinking that distorts problem definition. Clients explored personal cognitive patterns that obscure understanding. The therapist guided metacognitive exercises to strengthen objectivity.', 38, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist conducted a session addressing the link between problem clarity and self-regulation. Clients reflected on how confusion fuels impulsivity. The therapist reinforced emotional containment and structured analysis before action.', 39, TRUE),
        (v_activity_id, v_problem_identification_id, 'IOP Therapist led a closing group integrating problem-identification skills into daily stress management. Clients reviewed previous discussions and applied techniques for clarity and focus. The therapist encouraged continued use of reflective questioning and mindfulness to support adaptive coping.', 40, TRUE);

    GET DIAGNOSTICS v_paragraph_count = ROW_COUNT;
    RAISE NOTICE '✅ Insertados % párrafos para "Problem Identification"', v_paragraph_count;

    RAISE NOTICE '✅✅✅ COMPLETADO: Problem Solving con subactividad Problem Identification insertada ✅✅✅';

END $$;

-- Verificar inserción
SELECT 
    a.activity_name,
    s.subactivity_name,
    COUNT(ap.paragraph_id) as total_paragraphs
FROM activities a
LEFT JOIN subactivities s ON s.activity_id = a.activity_id
LEFT JOIN activity_paragraphs ap ON ap.subactivity_id = s.subactivity_id
WHERE LOWER(a.activity_name) = 'problem solving'
GROUP BY a.activity_name, s.subactivity_name
ORDER BY a.activity_name, s.subactivity_name;
