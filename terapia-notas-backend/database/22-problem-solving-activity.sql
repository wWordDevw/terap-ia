-- =============================================
-- MIGRACIÓN: ACTIVIDAD PROBLEM SOLVING (MIÉRCOLES)
-- Terapia Nota System - PostgreSQL 16
-- =============================================

-- =============================================
-- 1. ACTIVIDAD PRINCIPAL: PROBLEM SOLVING
-- =============================================

INSERT INTO activities (activity_name, description) VALUES
('Problem Solving', 'Developing structured problem-solving skills including problem identification, solution generation, decision-making, and alternative thinking to enhance adaptive coping and decision-making abilities');

-- =============================================
-- 2. OBJETIVOS (SUBACTIVIDADES)
-- =============================================

INSERT INTO subactivities (activity_id, subactivity_name, description)
SELECT 
    activity_id,
    'Problem Identification',
    'Learning to accurately identify and define problems as the foundational step in effective problem-solving'
FROM activities WHERE activity_name = 'Problem Solving'
UNION ALL
SELECT 
    activity_id,
    'Possible Solution',
    'Developing skills to generate and explore multiple possible solutions to identified problems'
FROM activities WHERE activity_name = 'Problem Solving'
UNION ALL
SELECT 
    activity_id,
    'Decision Making',
    'Building structured decision-making skills to evaluate and select the most adaptive solutions'
FROM activities WHERE activity_name = 'Problem Solving'
UNION ALL
SELECT 
    activity_id,
    'Generating Alternatives',
    'Enhancing cognitive flexibility to generate diverse alternatives and creative problem-solving approaches'
FROM activities WHERE activity_name = 'Problem Solving';

-- =============================================
-- 3. PÁRRAFOS PARA "PROBLEM IDENTIFICATION"
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a cognitive-based group session on the foundational step of problem-solving: accurate problem identification. Clients were guided to differentiate between subjective emotional reactions and objective situational challenges. The therapist emphasized the importance of specificity when articulating problems, as vague or global thinking tends to reinforce helplessness and inhibit goal-directed behavior.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a psychoeducational activity aimed at enhancing clients'' metacognitive awareness related to problem formulation. Through structured exercises, clients learned to separate their automatic thoughts from the actual circumstances triggering distress. The therapist modeled a step-by-step approach to clarifying internal versus external problems, promoting insight and self-efficacy.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group focused on the psychological barriers to effective problem identification, including cognitive distortions such as catastrophizing and emotional reasoning. Clients engaged in a guided journaling activity to reframe perceived crises into specific, solvable issues. Therapist provided clinical feedback to reinforce the use of neutral, observable language in defining problems.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an interactive discussion on how avoidance behaviors often stem from poorly defined or overwhelming problems. Clients were encouraged to dissect current challenges into concrete components. The therapist highlighted how clear problem definition supports activation of executive functioning and reduces affective dysregulation commonly seen in mood disorders.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist implemented a problem-identification skills group, integrating elements of solution-focused therapy. Clients were asked to describe a recent interpersonal or internal difficulty and examine the facts versus interpretations. The therapist emphasized the therapeutic impact of clarity and precision in language to foster accountability and emotional regulation.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a goal-oriented session centered on developing clients'' abilities to clearly define personal and interpersonal challenges. The group explored how ambiguous or emotionally charged descriptions of problems can hinder effective resolution. Therapist utilized Socratic questioning to help clients reframe problems in measurable, realistic terms.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in a cognitive-behavioral exercise designed to enhance self-reflection and precision in identifying the root causes of recurring difficulties. Clients were encouraged to move from global complaints to specific, actionable statements. The therapist reinforced the value of this skill in reducing reactivity and promoting proactive coping.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients through a structured problem identification worksheet to distinguish between perceived threats and actual obstacles. Emphasis was placed on increasing self-awareness of habitual patterns of generalization and personalization that cloud problem recognition. Clients practiced articulating concerns with clarity and emotional neutrality.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a skill-building session on pinpointing the central issue within emotionally complex situations. The group discussed how misidentification of problems can perpetuate avoidance and ineffective solutions. Therapist modeled the use of open-ended prompts to deepen insight and foster internal locus of control.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session highlighting the link between accurate problem identification and emotional regulation. Clients examined recent stressors and practiced isolating the core issue from secondary emotional responses. Therapist emphasized that this skill enhances decision-making and decreases impulsive behaviors in the face of adversity.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session focused on problem identification as a foundation for adaptive coping. Clients explored the distinction between primary stressors and secondary emotional reactions. The therapist encouraged the use of cognitive restructuring to isolate the core issue and minimize distortions caused by heightened affect. This process supported greater clarity in defining problems before moving into solution-focused strategies.',
    11
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients through an exploration of recent stressors, highlighting how mislabeling or generalizing difficulties can exacerbate emotional dysregulation. Clients practiced narrowing down overwhelming scenarios into specific, manageable problems. The therapist reinforced the use of mindfulness and reflective questioning to enhance awareness and improve self-regulation.',
    12
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted an intervention designed to strengthen clients'' executive functioning by teaching them to differentiate between surface complaints and underlying problems. The discussion emphasized how accurate identification of the problem enhances decision-making and reduces impulsivity. Clients were encouraged to apply behavioral activation once clarity was achieved.',
    13
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced structured problem identification techniques, emphasizing the importance of separating facts from interpretations. Clients engaged in exercises to reframe vague or globalized worries into defined challenges. The therapist validated client efforts and highlighted how this skill promotes emotional stability and adaptive coping responses.',
    14
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion centered on recognizing the role of distorted cognitions in problem misidentification. Clients reflected on personal situations where emotional reactivity obscured the actual issue. The therapist modeled problem deconstruction and encouraged clients to practice identifying controllable elements within broader concerns, fostering empowerment and resilience.',
    15
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session addressing the relevance of accurate problem identification in cognitive-behavioral frameworks. Clients were encouraged to disentangle emotional reactivity from the objective features of their stressors. The therapist emphasized how this skill enhances affect regulation and allows for the implementation of evidence-based coping strategies.',
    16
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients through a structured exploration of recent challenges, focusing on the distinction between primary triggers and secondary consequences. The group discussed how misinterpretation of events can perpetuate maladaptive patterns. The therapist reinforced the application of analytical thinking and reflective processing to increase clarity and reduce impulsivity.',
    17
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in exercises that highlighted how global or generalized complaints can obscure the central problem. By breaking down complex scenarios into manageable components, clients were able to conceptualize their stressors more effectively. The therapist introduced cognitive mapping tools to strengthen insight and promote adaptive problem-solving.',
    18
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session centered on the cognitive distortions that interfere with precise problem identification. Clients examined how catastrophizing or personalization often magnify difficulties beyond their true scope. The therapist validated these insights and demonstrated how restructuring techniques can help redirect focus toward realistic and controllable aspects of a situation.',
    19
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group discussion aimed at fostering metacognitive awareness of the problem-solving process. Clients were encouraged to differentiate between external obstacles and internalized emotional responses. The therapist modeled the use of Socratic questioning as a method to clarify underlying issues and support the development of healthier coping pathways.',
    20
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Problem Identification';



