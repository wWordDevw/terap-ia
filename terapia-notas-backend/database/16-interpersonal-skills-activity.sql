-- =============================================
-- MIGRACIÓN: ACTIVIDAD INTERPERSONAL SKILLS (LUNES)
-- Terapia Nota System - PostgreSQL 16
-- =============================================

-- =============================================
-- 1. ACTIVIDAD PRINCIPAL: INTERPERSONAL SKILLS
-- =============================================

INSERT INTO activities (activity_name, description) VALUES
('Interpersonal Skills', 'Developing and practicing effective communication, conflict resolution, and relationship-building skills for improved social functioning');

-- =============================================
-- 2. OBJETIVOS (SUBACTIVIDADES)
-- =============================================

INSERT INTO subactivities (activity_id, subactivity_name, description)
SELECT 
    activity_id,
    'Problem Solving',
    'Learning structured approaches to resolving interpersonal conflicts and challenges'
FROM activities WHERE activity_name = 'Interpersonal Skills'
UNION ALL
SELECT 
    activity_id,
    'Decision Making',
    'Developing skills for making effective decisions in interpersonal contexts'
FROM activities WHERE activity_name = 'Interpersonal Skills'
UNION ALL
SELECT 
    activity_id,
    'Assertiveness',
    'Learning to express needs and boundaries in a respectful and confident manner'
FROM activities WHERE activity_name = 'Interpersonal Skills'
UNION ALL
SELECT 
    activity_id,
    'Conflict Resolution',
    'Developing strategies for resolving interpersonal conflicts constructively'
FROM activities WHERE activity_name = 'Interpersonal Skills'
UNION ALL
SELECT 
    activity_id,
    'Improve Relationships',
    'Building and maintaining healthy interpersonal relationships'
FROM activities WHERE activity_name = 'Interpersonal Skills'
UNION ALL
SELECT 
    activity_id,
    'Accepting Differences',
    'Learning to tolerate and respect differences in others'
FROM activities WHERE activity_name = 'Interpersonal Skills'
UNION ALL
SELECT 
    activity_id,
    'Social Skills',
    'Developing fundamental social interaction and communication skills'
FROM activities WHERE activity_name = 'Interpersonal Skills';

-- =============================================
-- 3. PÁRRAFOS PARA "PROBLEM SOLVING"
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a cognitive-behavioral group session on interpersonal problem-solving, introducing the five-step model including problem definition, brainstorming options, evaluating consequences, selecting a course of action, and reflecting on outcomes. Clients were guided to apply this process to recent interpersonal challenges. Emphasis was placed on emotional regulation and cognitive flexibility to reduce impulsivity. While most clients engaged in discussion, one client expressed difficulty identifying a specific problem and needed additional support reframing vague concerns into solvable issues.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a structured group intervention targeting interpersonal problem-solving skills, highlighting the relationship between maladaptive conflict responses and emotional dysregulation. The session involved role-playing common interpersonal dilemmas, focusing on assertive communication and empathy. Clients were encouraged to identify patterns of avoidance or aggression in their relational dynamics. Several clients were able to recognize habitual responses, though one client remained guarded and reluctant to explore alternatives to confrontational behavior.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational group focused on developing interpersonal problem-solving abilities using experiential learning. Clients collaborated in pairs to navigate simulated conflict scenarios, employing active listening, option generation, and negotiation techniques. The therapist reinforced the importance of metacognitive awareness and the impact of unresolved interpersonal tension on mood. One client showed improvement in articulating needs, though continued to struggle with emotional reactivity during feedback.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session focusing on interpersonal effectiveness through structured problem-solving. Clients engaged in journaling exercises to identify a recent interpersonal issue, then processed the situation in group discussion using the SODAS model (Situation, Options, Disadvantages, Advantages, Solution). The therapist reinforced the role of perspective-taking and assertiveness in preventing escalation of relational tension. Participation was mixed, with some clients requiring support to challenge black-and-white thinking.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on interpersonal problem-solving, incorporating Dialectical Behavior Therapy principles to explore the balance between self-respect, goals, and relationship effectiveness. Clients were encouraged to analyze recent conflicts and identify whether their responses aligned with their long-term interpersonal values. The therapist modeled the DEAR MAN strategy and invited clients to practice through role-play. While some participants engaged actively, others demonstrated ambivalence in asserting personal needs without guilt or avoidance.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a process-oriented group focused on interpersonal problem-solving within the context of emotional dysregulation. Clients were guided to identify triggers that impair effective conflict resolution, and the therapist introduced grounding techniques to increase distress tolerance during interpersonal tension. The session highlighted the impact of cognitive distortions—such as personalization and catastrophizing—on conflict escalation. Several clients reflected on recent relational challenges but needed continued support to generalize these strategies outside the therapeutic setting.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a group-based intervention targeting deficits in interpersonal problem-solving. Clients reviewed a structured template for evaluating interpersonal conflicts, including contextual factors, emotional responses, and desired outcomes. Emphasis was placed on increasing self-awareness and accountability within relationship dynamics. Group members were encouraged to differentiate between passive, aggressive, and assertive patterns. Although clients demonstrated interest in the model, several expressed difficulty applying abstract concepts to real-life scenarios without concrete examples.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a skill-building session focused on identifying and resolving interpersonal problems through constructive communication. Clients explored how unresolved relational stress contributes to mood instability and avoidance. Using case vignettes, the therapist facilitated discussion around realistic compromise, boundary-setting, and emotional validation. Clients collaborated in pairs to reframe maladaptive responses into solution-focused alternatives. Engagement varied, with one client reporting increased insight into how unresolved conflicts exacerbate feelings of helplessness.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced an evidence-based interpersonal problem-solving framework to help clients enhance relational decision-making. The session emphasized recognizing emotional cues, differentiating between urgent and non-urgent conflicts, and implementing communication strategies conducive to resolution. Clients practiced identifying irrational beliefs that often obstruct collaborative dialogue. One client verbalized increased insight into their tendency to withdraw during conflict, identifying this as a future target for change.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an interpersonal problem-solving session using a narrative approach, encouraging clients to externalize interpersonal conflicts and explore multiple resolutions through structured storytelling. This technique allowed for emotional distance and reflective processing. Clients examined the consequences of previous choices and generated new scripts using assertive dialogue and mutual respect. The therapist highlighted the relationship between unresolved conflict and depressive symptomatology. While some clients demonstrated cognitive flexibility, others remained rigid in their conflict narratives, requiring further clinical support.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';
