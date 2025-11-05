-- =============================================
-- IOP: Life Skills - LUNES (COMPLETO)
-- =============================================
-- Este script inserta TODAS las actividades IOP Life Skills del día LUNES
-- Incluye: Actividad + 5 subactividades con todos sus párrafos
-- =============================================

-- 1. Buscar o crear la actividad "Life Skills" para IOP
DO $$
DECLARE
    v_activity_id UUID;
    v_paragraph_count INTEGER;
BEGIN
    -- Buscar si ya existe la actividad "Life Skills"
    SELECT activity_id INTO v_activity_id
    FROM activities
    WHERE LOWER(activity_name) = 'life skills'
    LIMIT 1;

    -- Si no existe, crearla
    IF v_activity_id IS NULL THEN
        INSERT INTO activities (activity_name, description, is_active)
        VALUES ('Life Skills', 'Life Skills activities for IOP groups - Monday', TRUE)
        RETURNING activity_id INTO v_activity_id;
        
        RAISE NOTICE '✅ Actividad "Life Skills" creada con ID: %', v_activity_id;
    ELSE
        RAISE NOTICE '✅ Actividad "Life Skills" ya existe con ID: %', v_activity_id;
    END IF;

    -- =============================================
    -- SUBACTIVIDAD 1: DECISION MAKING (40 párrafos)
    -- =============================================
    DECLARE
        v_decision_making_id UUID;
    BEGIN
        SELECT subactivity_id INTO v_decision_making_id
        FROM subactivities
        WHERE activity_id = v_activity_id
        AND LOWER(subactivity_name) = 'decision making'
        LIMIT 1;

        IF v_decision_making_id IS NULL THEN
            INSERT INTO subactivities (activity_id, subactivity_name, description, is_active)
            VALUES (v_activity_id, 'Decision making', 'Decision making skills and processes', TRUE)
            RETURNING subactivity_id INTO v_decision_making_id;
            RAISE NOTICE '✅ Subactividad "Decision making" creada';
        END IF;

        -- Insertar TODOS los párrafos de Decision making (1-40)
        INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order, is_active)
        SELECT v_activity_id, v_decision_making_id, paragraph_text, paragraph_order, TRUE
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
            (10, 'IOP Therapist facilitated a values-based decision-making exercise, encouraging clients to identify actions aligned with personal ethics and long-term goals. The discussion focused on differentiating between short-term gratification and sustainable growth. The therapist highlighted how congruence between decisions and values contributes to emotional stability and reduced regret.'),
            (11, 'IOP Therapist led a goal-oriented group exploring how problem-solving and decision-making intersect. Clients were invited to analyze a current dilemma using step-by-step reasoning. The therapist modeled techniques such as identifying options, anticipating consequences, and evaluating realistic outcomes. Participants practiced applying these methods to everyday scenarios to strengthen executive functioning.'),
            (12, 'IOP Therapist conducted a group exploring the role of social pressure in personal decision-making. Clients processed experiences of conforming to others'' expectations at the expense of self-direction. The therapist facilitated assertiveness exercises and boundary-setting discussions to reinforce independent thinking. Participants reflected on the empowerment that comes from making self-driven choices.'),
            (13, 'IOP Therapist guided clients in examining how avoidance behaviors delay or prevent important decisions. Clients identified specific fears that lead to procrastination and indecision. The therapist introduced behavioral activation strategies to counter avoidance and build momentum through small, achievable actions. Group members reported increased awareness of how fear impacts follow-through.'),
            (14, 'IOP Therapist introduced the concept of "decision fatigue" and its psychological impact on consistency and motivation. Clients discussed how excessive options or overthinking contribute to burnout and disengagement. The therapist encouraged participants to simplify routines and create structured systems to reduce cognitive overload. Emphasis was placed on setting priorities and maintaining mental clarity.'),
            (15, 'IOP Therapist facilitated a collaborative activity where clients role-played real-life decision-making situations, practicing communication, negotiation, and compromise. The therapist observed and provided constructive feedback, focusing on how assertiveness and emotional regulation improve outcomes. Participants reflected on the importance of maintaining self-respect while being receptive to others'' perspectives.'),
            (16, 'IOP Therapist conducted a reflection-based session examining how past trauma or negative experiences shape current decision-making tendencies. Clients identified patterns of overcontrol, avoidance, or dependency rooted in past events. The therapist provided grounding interventions and cognitive reframing to promote empowered and adaptive decision-making in the present.'),
            (17, 'IOP Therapist facilitated a discussion on the connection between self-awareness and decision outcomes. Clients were encouraged to identify automatic thoughts that often precede poor choices. The therapist introduced cognitive delay techniques, teaching participants to pause and question the accuracy of their assumptions before acting. The group emphasized self-reflection as a foundation for consistent and rational decision-making.'),
            (18, 'IOP Therapist led a solution-focused session exploring how unrealistic expectations and perfectionism can interfere with decision-making. Clients processed experiences of overanalyzing minor details and delaying choices out of fear of error. The therapist modeled acceptance-based strategies to help clients tolerate imperfection and take committed action toward progress rather than paralysis.'),
            (19, 'IOP Therapist conducted a group exercise designed to highlight the impact of external influences—such as family, culture, or peers—on personal decision-making. Clients reflected on the difference between internal motivation and external validation. The therapist guided participants toward building autonomy and reinforcing self-determination as indicators of psychological maturity.'),
            (20, 'IOP Therapist facilitated an experiential learning session where clients mapped out recent decision pathways, tracing the emotions, triggers, and outcomes associated with each. The activity promoted metacognitive awareness and insight into habitual response patterns. The therapist reinforced the concept of behavioral accountability and the importance of learning from prior decisions without self-criticism.'),
            (21, 'IOP Therapist led a structured activity on the role of intuition and logic in the decision-making process. Clients explored the balance between emotional instinct and rational analysis. The therapist encouraged integrating both systems to achieve more holistic and confident choices. Group discussion emphasized that neither impulsivity nor overthinking leads to adaptive functioning.'),
            (22, 'IOP Therapist guided a group focused on risk assessment and realistic goal-setting as integral parts of decision-making. Clients practiced evaluating the potential benefits and consequences of hypothetical situations. The therapist emphasized tolerance for uncertainty as a sign of emotional growth and promoted gradual exposure to decision-making challenges to build confidence.'),
            (23, 'IOP Therapist provided psychoeducation on how stress physiology impacts cognitive clarity and executive functioning. Clients learned how chronic anxiety can narrow perspective and impair decision quality. The therapist introduced grounding and relaxation exercises to reduce arousal levels before making important choices, highlighting the mind-body connection in effective decision-making.'),
            (24, 'IOP Therapist facilitated a motivational interviewing group aimed at strengthening commitment to responsible decision-making. Clients identified ambivalence about certain life changes and explored internal conflicts between comfort and growth. The therapist used reflective questioning to elicit self-motivated reasons for change, enhancing intrinsic motivation and self-trust.'),
            (25, 'IOP Therapist led a session centered on the consequences of avoidance and inaction. Clients discussed how postponing decisions can maintain feelings of helplessness and anxiety. The therapist introduced behavioral activation principles, encouraging participants to take small, manageable steps toward unresolved goals. The discussion emphasized the emotional relief that follows proactive engagement.'),
            (26, 'IOP Therapist facilitated a mindfulness-based decision-making exercise focusing on the present moment. Clients practiced grounding before evaluating a current dilemma, learning to differentiate between impulsive urges and thoughtful intentions. The therapist highlighted the role of self-compassion in reducing fear-based decision errors and promoting clarity through emotional balance.'),
            (27, 'IOP Therapist facilitated a cognitive-behavioral group exploring the influence of negative self-talk on daily decision-making. Clients identified how internalized criticism contributes to hesitation or impulsivity. The therapist introduced cognitive reframing techniques to replace self-defeating thoughts with constructive alternatives, fostering confidence and psychological flexibility in choice-making.'),
            (28, 'IOP Therapist guided clients through an exercise on emotional forecasting and its role in anticipating future consequences. Participants practiced evaluating how current emotions distort perception of long-term results. The therapist emphasized metacognitive strategies for identifying emotional bias, encouraging clients to delay decisions until a more neutral mindset is achieved.'),
            (29, 'IOP Therapist led a reflective group discussion addressing decision-making in relationships. Clients explored how attachment styles and fear of rejection shape interpersonal choices. The therapist encouraged insight into patterns of people-pleasing or emotional withdrawal and introduced assertiveness techniques to promote healthier relational decisions.'),
            (30, 'IOP Therapist facilitated a practical skills-building session on time management as a component of effective decision-making. Clients examined how disorganization and avoidance contribute to rushed or poorly considered decisions. The therapist modeled prioritization methods, encouraging structure, routine, and consistency to enhance executive functioning and goal attainment.'),
            (31, 'IOP Therapist conducted a group on identifying impulsive thought patterns and their connection to reward-seeking behavior. Clients processed instances where the need for instant gratification led to regret or guilt. The therapist emphasized mindfulness-based impulse control strategies and encouraged reflection on delayed gratification as a marker of emotional maturity.'),
            (32, 'IOP Therapist led a psychoeducational session on self-determination theory, highlighting autonomy, competence, and relatedness as factors that enhance healthy decision-making. Clients were encouraged to assess whether their choices align with intrinsic motivation or external validation. The therapist promoted the idea that authentic decision-making strengthens identity coherence and self-worth.'),
            (33, 'IOP Therapist facilitated a discussion exploring moral reasoning and ethical dilemmas in personal decision-making. Clients engaged in scenario-based exercises analyzing how values, empathy, and situational context influence behavior. The therapist highlighted the cognitive and emotional integration required for moral maturity and adaptive functioning.'),
            (34, 'IOP Therapist guided clients in examining how uncertainty tolerance impacts decision outcomes. Participants identified discomfort with ambiguity as a trigger for avoidance or control-seeking behaviors. The therapist provided grounding and acceptance-based interventions to build resilience in the face of unknown outcomes, fostering more adaptive responses.'),
            (35, 'IOP Therapist conducted a group focusing on the concept of "learned helplessness" and its effect on decision-making confidence. Clients recognized patterns of passivity formed through repeated negative experiences. The therapist implemented empowerment-based interventions, encouraging small, success-oriented decisions to rebuild self-efficacy and a sense of personal agency.'),
            (36, 'IOP Therapist facilitated a strengths-based session encouraging clients to draw upon personal values, resilience, and coping resources when faced with challenging choices. Participants reflected on times when perseverance led to positive results. The therapist reinforced the use of self-awareness and gratitude as grounding mechanisms for stable and mindful decision-making.'),
            (37, 'IOP Therapist facilitated a group discussion centered on the connection between cognitive distortions and everyday decision-making. Clients examined how all-or-nothing thinking, catastrophizing, and emotional reasoning can distort judgment and contribute to impulsive actions. The therapist provided psychoeducation on identifying and challenging these patterns through self-monitoring and cognitive reframing to enhance rational decision processes.'),
            (38, 'IOP Therapist led a skills-based session designed to strengthen critical thinking during high-stress situations. Clients discussed how external pressure and perceived urgency often lead to reactive decision-making. The therapist guided participants through structured problem-solving techniques, emphasizing the value of pausing, gathering information, and evaluating multiple perspectives before taking action.'),
            (39, 'IOP Therapist conducted a reflective session exploring how self-esteem and identity influence decision-making. Clients processed how internalized beliefs about competence or worthiness affect confidence when facing choices. The therapist introduced affirmations and behavioral experiments aimed at increasing trust in one''s judgment and promoting assertive, value-aligned decisions.'),
            (40, 'IOP Therapist facilitated a cognitive-behavioral group emphasizing accountability and follow-through as integral components of effective decision-making. Clients reviewed past choices and evaluated outcomes based on consistency between intentions and actions. The therapist encouraged the development of realistic action plans, reinforcing the concept of personal responsibility as a foundation for long-term behavioral change.')
        ) AS paragraphs(paragraph_order, paragraph_text)
        WHERE NOT EXISTS (
            SELECT 1 FROM activity_paragraphs ap
            WHERE ap.activity_id = v_activity_id
            AND ap.subactivity_id = v_decision_making_id
            AND ap.paragraph_text = paragraphs.paragraph_text
        );
        
        GET DIAGNOSTICS v_paragraph_count = ROW_COUNT;
        RAISE NOTICE '✅ Insertados % párrafos nuevos para "Decision making"', v_paragraph_count;
    END;

    -- =============================================
    -- SUBACTIVIDAD 2: MANAGEMENT OF EMOTIONS (8 párrafos)
    -- =============================================
    DECLARE
        v_emotions_id UUID;
    BEGIN
        SELECT subactivity_id INTO v_emotions_id
        FROM subactivities
        WHERE activity_id = v_activity_id
        AND LOWER(subactivity_name) = 'management of emotions'
        LIMIT 1;

        IF v_emotions_id IS NULL THEN
            INSERT INTO subactivities (activity_id, subactivity_name, description, is_active)
            VALUES (v_activity_id, 'Management of emotions', 'Emotional regulation and management strategies', TRUE)
            RETURNING subactivity_id INTO v_emotions_id;
            RAISE NOTICE '✅ Subactividad "Management of emotions" creada';
        END IF;

        INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order, is_active)
        SELECT v_activity_id, v_emotions_id, paragraph_text, paragraph_order, TRUE
        FROM (VALUES
            (1, 'IOP Therapist facilitated a psychoeducational session on recognizing emotional triggers and their physiological manifestations. Clients learned to identify early warning signs of distress such as muscle tension, racing thoughts, and irritability. The therapist introduced grounding and mindfulness techniques to increase emotional regulation and prevent reactive behaviors.'),
            (2, 'IOP Therapist conducted a cognitive-behavioral group focused on understanding the connection between thoughts, feelings, and actions. Clients explored how distorted thinking patterns escalate emotional intensity. The therapist guided participants in restructuring maladaptive thoughts to promote balanced emotional responses and healthier coping mechanisms.'),
            (3, 'IOP Therapist led a process-oriented group exploring the difference between suppression, repression, and emotional regulation. Clients discussed personal tendencies to avoid or minimize difficult emotions. The therapist emphasized emotional labeling and acceptance as foundational tools for psychological resilience and self-awareness.'),
            (4, 'IOP Therapist facilitated an experiential session emphasizing the importance of emotional literacy. Clients practiced identifying and naming a wide range of emotions beyond the basic categories of anger, sadness, and fear. The therapist reinforced that expanding emotional vocabulary enhances communication, empathy, and interpersonal effectiveness.'),
            (5, 'IOP Therapist guided a group discussion on managing anger and frustration constructively. Clients analyzed situations that trigger reactive behavior and explored the role of unmet needs and perceived injustice. The therapist introduced techniques such as deep breathing, time-outs, and assertive expression to reduce escalation and promote self-control.'),
            (6, 'IOP Therapist conducted a session addressing emotional avoidance and its impact on long-term well-being. Clients reflected on patterns of distraction, overworking, or withdrawal used to escape uncomfortable emotions. The therapist provided psychoeducation on the paradox of avoidance and encouraged gradual exposure to distressing feelings to foster adaptive processing.'),
            (7, 'IOP Therapist led a mindfulness-based session aimed at improving clients'' tolerance for distressing emotions. Participants engaged in guided meditation and body-awareness exercises designed to observe emotions without immediate reaction. The therapist discussed the difference between reacting and responding, promoting emotional stability and cognitive clarity.'),
            (8, 'IOP Therapist facilitated a dialectical-behavioral group focused on emotion regulation and distress tolerance. Clients identified recent emotional episodes and analyzed the factors that intensified them. The therapist introduced DBT skills such as "Check the Facts" and "Opposite Action" to promote balanced emotional functioning and reduce impulsivity.')
        ) AS paragraphs(paragraph_order, paragraph_text)
        WHERE NOT EXISTS (
            SELECT 1 FROM activity_paragraphs ap
            WHERE ap.activity_id = v_activity_id
            AND ap.subactivity_id = v_emotions_id
            AND ap.paragraph_text = paragraphs.paragraph_text
        );
        
        GET DIAGNOSTICS v_paragraph_count = ROW_COUNT;
        RAISE NOTICE '✅ Insertados % párrafos nuevos para "Management of emotions"', v_paragraph_count;
    END;

    -- CONTINUARÁ CON LAS SIGUIENTES SUBACTIVIDADES...
    -- Por tamaño del archivo, continuaré en la siguiente parte

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
GROUP BY a.activity_name, s.subactivity_name
ORDER BY s.subactivity_name;
