-- =============================================
-- MIGRACIÓN: ACTIVIDAD COPING SKILLS (LUNES)
-- Terapia Nota System - PostgreSQL 16
-- =============================================

-- =============================================
-- 1. ACTIVIDAD PRINCIPAL: COPING SKILLS
-- =============================================

INSERT INTO activities (activity_name, description) VALUES
('Coping Skills', 'Teaching and practicing various coping mechanisms and strategies for managing stress, emotions, and challenging situations');

-- =============================================
-- 2. OBJETIVOS (SUBACTIVIDADES)
-- =============================================

INSERT INTO subactivities (activity_id, subactivity_name, description)
SELECT 
    activity_id,
    'Behavioral Mechanisms',
    'Understanding and practicing behavioral coping strategies and mechanisms'
FROM activities WHERE activity_name = 'Coping Skills'
UNION ALL
SELECT 
    activity_id,
    'Defense Mechanisms',
    'Exploring defense mechanisms and their adaptive and maladaptive uses'
FROM activities WHERE activity_name = 'Coping Skills'
UNION ALL
SELECT 
    activity_id,
    'Adaptive Mechanisms',
    'Learning adaptive coping mechanisms for healthy functioning'
FROM activities WHERE activity_name = 'Coping Skills'
UNION ALL
SELECT 
    activity_id,
    'Attack Mechanisms',
    'Understanding and managing aggressive coping responses'
FROM activities WHERE activity_name = 'Coping Skills'
UNION ALL
SELECT 
    activity_id,
    'Avoidance Mechanisms',
    'Recognizing and addressing avoidance-based coping strategies'
FROM activities WHERE activity_name = 'Coping Skills'
UNION ALL
SELECT 
    activity_id,
    'Cognitive Mechanisms',
    'Exploring cognitive coping strategies and thought patterns'
FROM activities WHERE activity_name = 'Coping Skills'
UNION ALL
SELECT 
    activity_id,
    'Conversion Mechanisms',
    'Understanding conversion and somatization as coping strategies'
FROM activities WHERE activity_name = 'Coping Skills';

-- =============================================
-- 3. PÁRRAFOS PARA "BEHAVIORAL MECHANISMS"
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session focused on the behavioral mechanism of "acting out" and its function as an avoidance strategy. Clients explored how impulsive behaviors often serve to discharge emotional discomfort rather than address its source. Through guided discussion, clients identified situations where they "act out" and reflected on the emotional triggers behind those behaviors. The therapist introduced self-monitoring techniques and grounding strategies to interrupt the impulsive response cycle.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on the behavioral mechanism of "aim inhibition" and its impact on self-esteem and motivation. Clients explored how lowering expectations can temporarily reduce stress but may also limit personal growth. The group discussed personal goals that have been avoided or minimized due to fear of failure. The therapist introduced graded goal-setting techniques to build tolerance for discomfort and promote incremental success.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational group on altruism as a behavioral coping mechanism. Clients discussed how helping others can serve both as emotional regulation and as a means to reduce internal distress. The therapist guided the group in identifying past instances where altruistic behavior provided emotional relief, and introduced a weekly prosocial action plan as a form of behavioral activation.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group discussion on the use of aggression and confrontation as behavioral coping responses. Clients explored how attack behaviors may be used to mask fear, shame, or insecurity. Through role-play exercises, clients identified less threatening ways to assert their needs. The therapist emphasized the use of assertiveness training and emotional labeling to foster more adaptive responses.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on avoidance behaviors and their role in maintaining depressive and anxious states. Clients identified daily situations they tend to avoid and examined the emotional experiences underlying those behaviors. The therapist introduced behavioral experiments to challenge avoidance patterns and increase emotional resilience through graded exposure.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session focused on compensation as a behavioral strategy for managing perceived inadequacies. Clients explored how overachievement in certain areas can serve to mask vulnerabilities in others. The therapist guided clients in recognizing compensatory behaviors and introduced self-compassion techniques to foster a more balanced self-view.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a reflective group session on crying and emotional expression as coping tools. Clients shared personal experiences around crying, including social stigma and relief. The therapist normalized emotional expression and discussed the regulation function of tearful release, encouraging clients to observe their body''s response to emotional processing.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session on displacement as a behavioral mechanism. Clients identified instances in which they redirected emotions such as anger or frustration toward unrelated targets. The therapist used case examples to help clients connect these patterns to deeper emotional experiences and introduced mindfulness strategies for emotion tracking.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group activity focused on identification as a behavioral coping strategy. Clients examined how they may imitate others as a way of coping with insecurity or uncertainty. The therapist guided the group in differentiating between healthy modeling and loss of authenticity, encouraging the development of a personal strengths inventory.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on reaction formation and how behaviors may reflect opposite emotions. Clients explored how exaggerated kindness or politeness can be used to conceal anger or resentment. The therapist introduced emotional awareness journaling as a tool for uncovering incongruent responses and promoting honest self-reflection.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on emotional withdrawal as a behavioral coping mechanism. Clients discussed how pulling away from others often serves to protect against rejection or perceived failure but may reinforce feelings of isolation. The therapist encouraged clients to identify recent instances of withdrawal and introduced graded social engagement strategies to promote healthier interpersonal functioning.',
    11
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group session on "undoing" as a behavioral response to guilt or internal conflict. Clients explored actions they may perform to symbolically "erase" or neutralize distressing thoughts or behaviors. Through discussion and journaling, clients reflected on patterns of compulsive apologies, overcompensation, or repetitive behaviors. The therapist introduced cognitive restructuring tools to help manage guilt more adaptively.',
    12
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session on regression as a behavioral response to stress. Clients identified instances where they have reverted to childlike behaviors—such as dependence, helplessness, or tantrums—during overwhelming situations. The therapist guided the group in building self-soothing and self-regulatory techniques that promote adult-level functioning under distress.',
    13
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational group on displacement through physical behavior, such as slamming objects or redirecting frustration. Clients reflected on how physical displacement can mask emotional discomfort. The therapist introduced healthier forms of physical release (e.g., exercise, art, breathing techniques) as a behavioral alternative for emotional processing.',
    14
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group discussion on the behavioral mechanism of reaction formation in social and familial contexts. Clients shared examples where they may have expressed the opposite of their true feelings, such as excessive politeness toward someone they dislike. The therapist introduced strategies for safe and honest emotional expression in complex interpersonal scenarios.',
    15
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on the behavioral mechanism of help-rejecting complaining. Clients explored how frequently seeking assistance while simultaneously dismissing it may serve to reinforce feelings of helplessness or maintain control. The therapist guided the group in identifying these patterns and encouraged the practice of asking for and accepting help as a form of vulnerability and growth.',
    16
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group session on avoidance through over-scheduling or "productive procrastination." Clients discussed how excessive busyness can be used as a behavioral strategy to avoid distressing emotional content or decisions. The therapist introduced mindfulness and values-based prioritization to help realign behavior with meaningful goals.',
    17
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session on performance rituals as behavioral coping mechanisms. Clients discussed habitual or superstitious actions used to delay tasks or reduce anxiety (e.g., needing a "perfect" setup before beginning something). The therapist introduced behavioral activation tools to reduce ritual dependency and increase task engagement.',
    18
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on the behavioral coping strategy of symbolic gestures. Clients reflected on behaviors they use to indirectly express internal conflict, such as giving gifts instead of verbal apologies. The therapist guided clients in exploring the emotional significance behind these actions and encouraged more direct forms of communication and repair.',
    19
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a discussion on passive-aggressive behaviors as a behavioral coping mechanism. Clients identified how indirect resistance, sarcasm, or silent treatment may be used to avoid direct conflict. The therapist introduced assertiveness training techniques and guided role-plays to practice healthier forms of boundary-setting and expression.',
    20
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Behavioral Mechanisms';
