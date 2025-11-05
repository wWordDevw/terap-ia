-- =============================================
-- PÁRRAFOS PARA "TYPES OF COMMUNICATION" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational group session focused on identifying and differentiating between passive, aggressive, and assertive communication styles. Clients engaged in discussions around the psychological and relational impacts of each style and were guided through self-assessments to reflect on their typical communication patterns. The therapist emphasized how assertiveness supports boundary setting, emotional clarity, and healthier interpersonal functioning.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Types of Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the topic of communication styles by reviewing characteristics and behavioral indicators of passive, aggressive, passive-aggressive, and assertive communication. Clients participated in a structured activity where they analyzed scripted dialogues and labeled the style used. Therapist encouraged reflection on the emotional consequences and relational dynamics associated with each pattern, emphasizing the goal of increasing assertive interactions.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Types of Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted an experiential session on communication styles, integrating cognitive-behavioral strategies to help clients recognize the internal beliefs that often drive ineffective communication. Clients explored how fear of conflict, low self-esteem, or emotional dysregulation may lead to passive or aggressive behaviors. The group practiced reframing these patterns into more balanced, assertive expressions through therapist-led role-play.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Types of Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group exploration of communication types by examining real-life scenarios where miscommunication escalated interpersonal conflict. Clients were encouraged to identify the communication styles used and how these contributed to relational breakdowns. Therapist introduced techniques to shift from reactive to responsive communication, including use of "I-statements" and emotional validation.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Types of Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session focused on enhancing clients'' insight into their habitual communication responses under stress. The group reviewed the core traits of each communication style and evaluated how these patterns may contribute to either resolution or disconnection in relationships. Clients practiced distinguishing between tone, body language, and verbal cues associated with each style, increasing their awareness of both expressive and receptive communication roles.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Types of Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on the four main types of communication—passive, aggressive, passive-aggressive, and assertive—highlighting how each impacts psychological well-being and interpersonal boundaries. Clients participated in a worksheet-based activity to identify how their current communication style may contribute to relational stress or misunderstanding. The therapist encouraged exploration of barriers to assertiveness and promoted awareness of internalized beliefs that sustain maladaptive patterns.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Types of Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session where clients learned how communication style reflects emotional regulation and cognitive appraisal. Using visual aids and group discussion, the therapist helped clients map their typical response patterns during conflict and evaluate the long-term consequences of ineffective communication. Clients were encouraged to begin recognizing opportunities to shift from passive or aggressive behaviors toward more assertive engagement.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Types of Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients in a reflective discussion on how early family dynamics and social conditioning shape their preferred style of communication. Clients shared how past reinforcement or punishment may have contributed to the development of passive or aggressive styles. The therapist emphasized assertiveness as a learned skill that enhances autonomy, emotional safety, and mutual respect in relationships.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Types of Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led an interactive group activity in which clients role-played conversations demonstrating various communication styles. After each scenario, the group analyzed how verbal and non-verbal elements influenced the effectiveness of the interaction. Therapist provided real-time feedback, reinforcing assertive language use and helping clients reframe aggressive or passive statements into more constructive alternatives.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Types of Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a self-monitoring tool to help clients track their daily communication behaviors and associated emotional outcomes. The session focused on increasing metacognitive awareness of the interplay between thought patterns, self-esteem, and communication style. Clients discussed how adopting a more assertive stance could support emotional resilience and reduce interpersonal reactivity.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Types of Communication';



