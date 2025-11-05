-- =============================================
-- IOP: Goal Setting - MARTES (COMPLETO)
-- =============================================
-- Este script inserta la actividad "Goal Setting" para IOP del día MARTES
-- Incluye: Actividad + 1 subactividad con TODOS sus párrafos
-- NOTA: NO elimina actividades existentes, solo añade Goal Setting
-- =============================================

-- Insertar actividad "Goal Setting" para IOP
DO $$
DECLARE
    v_activity_id UUID;
    v_identifying_realistic_goals_id UUID;
    v_paragraph_count INTEGER;
BEGIN
    -- Buscar si ya existe la actividad "Goal Setting"
    SELECT activity_id INTO v_activity_id
    FROM activities
    WHERE LOWER(activity_name) = 'goal setting'
    LIMIT 1;

    -- Si no existe, crearla
    IF v_activity_id IS NULL THEN
        INSERT INTO activities (activity_name, description, is_active)
        VALUES ('Goal Setting', 'Goal Setting activities for IOP groups - Tuesday', TRUE)
        RETURNING activity_id INTO v_activity_id;
        
        RAISE NOTICE '✅ Actividad "Goal Setting" creada con ID: %', v_activity_id;
    ELSE
        RAISE NOTICE '✅ Actividad "Goal Setting" ya existe con ID: %', v_activity_id;
    END IF;

    -- =============================================
    -- SUBACTIVIDAD 1: IDENTIFYING REALISTIC GOALS (40 párrafos)
    -- =============================================
    SELECT subactivity_id INTO v_identifying_realistic_goals_id
    FROM subactivities
    WHERE activity_id = v_activity_id
    AND LOWER(subactivity_name) = 'identifying realistic goals'
    LIMIT 1;

    IF v_identifying_realistic_goals_id IS NULL THEN
        INSERT INTO subactivities (activity_id, subactivity_name, description, is_active)
        VALUES (v_activity_id, 'Identifying Realistic Goals', 'Identifying and setting realistic goals', TRUE)
        RETURNING subactivity_id INTO v_identifying_realistic_goals_id;
        RAISE NOTICE '✅ Subactividad "Identifying Realistic Goals" creada';
    END IF;

    INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order, is_active)
    VALUES
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist facilitated a psychoeducational group centered on developing insight into the process of identifying realistic and attainable goals. Clients explored how impulsivity, unrealistic expectations, and emotional dysregulation often lead to premature discouragement. Through guided dialogue, the therapist introduced the SMART framework, emphasizing specificity and achievable pacing. Clients were encouraged to replace vague ambitions with measurable steps to increase self-efficacy and long-term consistency.', 1, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist conducted a reflective group focused on addressing perfectionism as a barrier to setting attainable objectives. Clients discussed the emotional toll of unrealistic standards, including chronic dissatisfaction and fear of failure. The therapist introduced cognitive reframing to challenge rigid thought patterns and guided participants in identifying small, meaningful achievements that validate progress without overwhelming pressure.', 2, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist led a process-oriented session highlighting the psychological difference between aspirational and achievable goals. Clients often equated self-worth with grand outcomes, which the therapist identified as an avoidance mechanism rooted in low self-esteem. Through structured dialogue, participants learned to value progress-oriented actions, emphasizing consistency and emotional regulation over perfection.', 3, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist facilitated a cognitive-behavioral group exploring how distorted thinking impacts realistic goal-setting. Clients identified self-defeating beliefs such as "if I can''t do it perfectly, it''s not worth trying." The therapist modeled cognitive restructuring techniques to promote self-compassion and introduced behavioral activation strategies to sustain engagement despite uncertainty or discomfort.', 4, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist conducted a psychoeducational discussion about the emotional connection between motivation and realistic expectations. Clients explored how inflated or unclear goals trigger anxiety and avoidance. The therapist guided them in setting smaller, task-oriented objectives that encourage daily mastery experiences, reinforcing self-confidence and perceived control.', 5, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist led a mindfulness-integrated session on balancing ambition with acceptance. Clients practiced grounding exercises to reduce performance pressure and reflect on intrinsic motivation rather than external validation. The therapist emphasized the importance of patience, reminding participants that sustainable change develops through incremental progress.', 6, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist facilitated a group exploring how impulsivity and emotional reactivity undermine goal consistency. Clients identified patterns of starting tasks enthusiastically but abandoning them when immediate results aren''t achieved. The therapist introduced self-monitoring and delay-of-gratification techniques to promote perseverance and emotional regulation.', 7, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist conducted a reflective session examining how self-criticism interferes with realistic goal achievement. Clients discussed internalized negative beliefs from early life experiences that influence current self-expectations. The therapist modeled compassionate self-dialogue and encouraged participants to set affirming, self-supportive objectives aligned with their current capacities.', 8, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist led a cognitive-behavioral group analyzing avoidance as a defense mechanism in goal pursuit. Clients reflected on how fear of failure or judgment leads to procrastination. The therapist implemented problem-solving exercises to break large goals into smaller, achievable segments, reinforcing behavioral momentum and accountability.', 9, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist facilitated a psychoeducational session focused on identifying emotional triggers that distort one''s sense of what is realistic. Clients recognized that heightened stress or depressive episodes impair judgment and goal orientation. The therapist emphasized emotional regulation as a prerequisite for effective decision-making and realistic planning.', 10, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist conducted a group activity designed to help clients distinguish between short-term behavioral goals and long-term life aspirations. Participants practiced linking immediate objectives—such as attending appointments or maintaining structure—to broader personal values. The therapist reinforced that purpose-driven goals increase motivation and resilience.', 11, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist led a process group emphasizing the importance of accountability in maintaining realistic goals. Clients discussed difficulties following through when external support is lacking. The therapist encouraged the use of peer check-ins, journaling, and progress tracking to sustain focus and self-discipline.', 12, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist facilitated a reflective group helping clients reframe setbacks as opportunities for feedback rather than personal failure. Clients shared recent experiences of discouragement. The therapist used motivational interviewing techniques to promote self-reflection and adaptive coping, highlighting the therapeutic value of persistence.', 13, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist conducted a psychoeducational session on emotional resilience in goal pursuit. Clients explored how unrealistic goals often stem from perfectionism or fear-based control. The therapist guided them in establishing attainable milestones and celebrating incremental victories to strengthen intrinsic motivation.', 14, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist led a strengths-based group encouraging clients to identify personal competencies and external resources that support realistic goal attainment. The therapist reinforced the idea that acknowledging limitations is not a weakness but a form of self-awareness critical to sustainable growth. Clients demonstrated improved insight into aligning goals with current readiness.', 15, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist facilitated a cognitive-processing group on the emotional discomfort of adjusting or abandoning unrealistic goals. Clients expressed guilt or disappointment associated with perceived "failure." The therapist validated these emotions and emphasized that flexibility is a hallmark of psychological maturity and self-acceptance.', 16, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist conducted a reflective discussion examining how impulsivity and low frustration tolerance affect persistence toward goals. Clients acknowledged abandoning objectives when results are delayed. The therapist provided psychoeducation on delayed reinforcement and taught self-reward strategies for maintaining motivation.', 17, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist led a psychoeducational group exploring how external comparison undermines authentic goal-setting. Clients reflected on societal pressures and social media influences shaping unrealistic expectations. The therapist emphasized self-referenced progress and intrinsic satisfaction as healthier motivational anchors.', 18, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist facilitated a mindfulness and values-based session on aligning goals with personal meaning. Clients engaged in guided reflection to identify which goals reflect their authentic needs versus external demands. The therapist reinforced that congruence between values and behavior fosters self-esteem and emotional clarity.', 19, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist conducted a closing session integrating all principles discussed during the goal-setting module. Clients reviewed previous goals and redefined them to reflect realistic expectations, measurable outcomes, and emotional balance. The therapist commended progress and emphasized the importance of ongoing reflection, flexibility, and self-compassion as part of lifelong goal achievement.', 20, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist facilitated a group exploring how unrealistic expectations often lead to chronic frustration and emotional burnout. Clients reflected on previous experiences where setting overly ambitious goals triggered avoidance or self-criticism. The therapist introduced cognitive restructuring exercises to challenge perfectionistic thinking and guided participants toward creating specific, measurable objectives that align with their current functioning and emotional capacity.', 21, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist conducted a psychoeducational session emphasizing the psychological benefits of breaking goals into smaller, attainable steps. Clients discussed feelings of overwhelm when facing large-scale objectives. The therapist modeled behavioral sequencing and reinforced how incremental success enhances dopamine activation, motivation, and self-efficacy.', 22, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist led a mindfulness-based group focused on reducing cognitive pressure associated with long-term goal pursuit. Clients practiced grounding exercises to manage anxiety about timelines. The therapist encouraged presence-oriented progress tracking, reminding clients that sustainable change develops through consistency, not urgency.', 23, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist facilitated a reflective discussion on the emotional connection between self-worth and goal achievement. Clients explored how equating success with identity leads to shame and hopelessness when goals aren''t met. The therapist encouraged redefinition of success based on personal growth, self-awareness, and adaptive persistence.', 24, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist conducted a cognitive-behavioral group addressing avoidance and procrastination. Clients identified defense mechanisms such as rationalization and minimization that prevent active progress. The therapist guided participants through behavioral activation planning, promoting accountability and emotional regulation through structured daily action.', 25, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist led a process group focused on managing disappointment when goals require adjustment. Clients expressed frustration about perceived "failure" when plans didn''t unfold as expected. The therapist reframed flexibility as resilience, encouraging clients to view adaptation as psychological strength rather than defeat.', 26, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist facilitated a psychoeducational session introducing the "Zone of Proximal Growth" model to help clients define attainable goals. Participants discussed how striving slightly beyond current comfort zones fosters engagement and achievement. The therapist emphasized self-assessment as a tool for maintaining progress without self-sabotage.', 27, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist conducted a group where clients explored how impulsive decision-making undermines long-term consistency. Participants described initiating goals during emotional highs but losing focus when motivation declined. The therapist introduced emotional pacing and reflective journaling to strengthen insight and behavioral continuity.', 28, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist led a reflective session centered on the role of patience in goal development. Clients acknowledged difficulty tolerating delayed gratification and the desire for rapid change. The therapist highlighted emotional endurance as a therapeutic goal, teaching mindfulness as a method to manage discomfort during slower progress phases.', 29, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist facilitated a goal-planning workshop where clients translated abstract ideas into structured, achievable objectives. Participants practiced identifying potential barriers and supports. The therapist reinforced problem-solving and contingency planning as essential elements of realistic goal maintenance.', 30, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist conducted a strengths-based group encouraging clients to identify personal competencies and external resources. Clients shared how focusing on existing strengths increased motivation. The therapist underscored that recognizing one''s own capability promotes autonomy, internal locus of control, and confidence in achieving realistic objectives.', 31, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist led a psychoeducational group on emotional self-monitoring during goal pursuit. Clients discussed the importance of tracking mood fluctuations that influence focus and consistency. The therapist taught self-reflection as a feedback loop for emotional regulation and effective planning.', 32, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist facilitated a reflective group where clients explored the influence of external pressures on goal formulation. Many identified cultural, familial, or social expectations as sources of unrealistic standards. The therapist encouraged clients to reframe their goals based on intrinsic motivation and authentic personal values.', 33, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist conducted a process group examining ambivalence toward goal commitment. Clients expressed both excitement and fear around accountability. The therapist used motivational interviewing techniques to explore readiness for change, reinforcing autonomy and self-determination in the goal-setting process.', 34, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist led a mindfulness-based discussion on emotional resilience and goal perseverance. Clients practiced identifying discouraging self-talk during setbacks. The therapist modeled compassionate inner dialogue and encouraged reframing obstacles as neutral events rather than personal shortcomings.', 35, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist facilitated a psychoeducational group illustrating the role of executive functioning in goal setting. Clients learned how planning, organization, and impulse control interact in behavioral follow-through. The therapist introduced cognitive organization strategies such as visual planning tools and daily prioritization exercises.', 36, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist conducted a reflective session focusing on emotional regulation when progress stalls. Clients expressed frustration about delayed results and self-judgment. The therapist validated these feelings and emphasized the therapeutic importance of tolerating uncertainty as part of emotional growth.', 37, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist led a problem-solving group encouraging clients to identify external supports—such as mentors, peers, or family—that facilitate accountability. Participants discussed how isolation decreases motivation. The therapist highlighted collaboration and shared responsibility as mechanisms for maintaining realistic expectations.', 38, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist facilitated a psychoeducational discussion about self-efficacy theory and its role in sustaining realistic goals. Clients examined how small, consistent successes reshape internal beliefs about competence. The therapist encouraged reflection on past achievements to reinforce confidence and persistence.', 39, TRUE),
        (v_activity_id, v_identifying_realistic_goals_id, 'IOP Therapist conducted a closing integrative group summarizing therapeutic principles of realistic goal formation. Clients reviewed strategies learned—such as breaking tasks into steps, tracking emotional patterns, and embracing flexibility. The therapist reinforced that progress is cyclical, not linear, and that realistic goals evolve alongside personal growth and psychological maturity.', 40, TRUE);

    GET DIAGNOSTICS v_paragraph_count = ROW_COUNT;
    RAISE NOTICE '✅ Insertados % párrafos para "Identifying Realistic Goals"', v_paragraph_count;

    RAISE NOTICE '✅✅✅ COMPLETADO: Goal Setting con todas sus subactividades y párrafos insertados ✅✅✅';

END $$;

-- Verificar inserción
SELECT 
    a.activity_name,
    s.subactivity_name,
    COUNT(ap.paragraph_id) as total_paragraphs
FROM activities a
LEFT JOIN subactivities s ON s.activity_id = a.activity_id
LEFT JOIN activity_paragraphs ap ON ap.subactivity_id = s.subactivity_id
WHERE LOWER(a.activity_name) = 'goal setting'
GROUP BY a.activity_name, s.subactivity_name
ORDER BY a.activity_name, s.subactivity_name;
