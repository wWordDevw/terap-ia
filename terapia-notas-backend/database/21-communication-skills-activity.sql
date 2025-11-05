-- =============================================
-- MIGRACIÓN: ACTIVIDAD COMMUNICATION SKILLS (MIÉRCOLES)
-- Terapia Nota System - PostgreSQL 16
-- =============================================

-- =============================================
-- 1. ACTIVIDAD PRINCIPAL: COMMUNICATION SKILLS
-- =============================================

INSERT INTO activities (activity_name, description) VALUES
('Communication Skills', 'Developing effective interpersonal communication skills including listening, assertiveness, empathy, and respectful dialogue to enhance relationships and social functioning');

-- =============================================
-- 2. OBJETIVOS (SUBACTIVIDADES)
-- =============================================

INSERT INTO subactivities (activity_id, subactivity_name, description)
SELECT 
    activity_id,
    'Listening',
    'Developing active listening skills as a foundational component of effective communication'
FROM activities WHERE activity_name = 'Communication Skills'
UNION ALL
SELECT 
    activity_id,
    'Types of Communication',
    'Learning to identify and differentiate between passive, aggressive, and assertive communication styles'
FROM activities WHERE activity_name = 'Communication Skills'
UNION ALL
SELECT 
    activity_id,
    'Clarity and Concision',
    'Enhancing verbal expression through clear and concise communication'
FROM activities WHERE activity_name = 'Communication Skills'
UNION ALL
SELECT 
    activity_id,
    'Friendliness',
    'Developing friendliness as a core component of prosocial communication'
FROM activities WHERE activity_name = 'Communication Skills'
UNION ALL
SELECT 
    activity_id,
    'Confidence',
    'Building confidence in communication and verbal assertiveness'
FROM activities WHERE activity_name = 'Communication Skills'
UNION ALL
SELECT 
    activity_id,
    'Empathy',
    'Enhancing empathic communication and emotional attunement in relationships'
FROM activities WHERE activity_name = 'Communication Skills'
UNION ALL
SELECT 
    activity_id,
    'Respect',
    'Developing respectful communication skills and mutual regard in interactions'
FROM activities WHERE activity_name = 'Communication Skills';

-- =============================================
-- 3. PÁRRAFOS PARA "LISTENING"
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session centered on the development of active listening as a foundational component of interpersonal effectiveness. Clients were guided through techniques such as maintaining eye contact, using verbal affirmations, and reflecting content to demonstrate understanding. The group engaged in dyadic exercises where they practiced withholding judgment and responding with empathy. Clients discussed how impaired listening contributes to relational conflict and emotional dysregulation.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Listening';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of therapeutic listening and its role in fostering validation and emotional safety within relationships. Through role-play and structured prompts, clients practiced remaining present while their partners expressed a concern, focusing on nonverbal cues and emotional tone. The therapist emphasized the importance of intentional silence and receptive body language to convey openness and support.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Listening';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session on identifying barriers to effective listening, including cognitive distortions, emotional reactivity, and internal distractions. Clients reflected on how these obstacles have impacted their communication patterns and contributed to interpersonal misunderstandings. The therapist modeled reflective listening and encouraged participants to apply paraphrasing and clarifying questions in peer exchanges.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Listening';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group exercise aimed at increasing mindfulness during conversation. Clients were prompted to identify instances where they mentally rehearsed responses rather than attending to the speaker''s message. The therapist introduced the STOP technique (Stop, Take a breath, Observe, Proceed mindfully) to interrupt impulsive tendencies and enhance active listening. Clients reported increased awareness of their attentional patterns.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Listening';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist explored the link between effective listening and emotional intelligence. Clients examined how validating another''s experience through listening can de-escalate conflict and promote relational harmony. The therapist provided psychoeducation on the difference between hearing and listening, highlighting the value of curiosity and attunement. Clients practiced exercises in which they were required to summarize and reflect the emotional content shared by their partners.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Listening';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group session emphasizing the impact of listening skills on emotional regulation and relational functioning. Clients explored the concept of "listening to understand" rather than "listening to respond." Through guided dialogue, the therapist illustrated how premature interpretation and assumption can distort communication, encouraging clients to remain grounded in the speaker''s message before forming conclusions.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Listening';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an experiential exercise focused on deep listening, in which clients paired off to practice providing undivided attention without offering advice or interrupting. The therapist debriefed with the group, highlighting the therapeutic value of simply being present and offering validation through silence and empathy. Clients identified discomfort with silence as a common barrier to effective listening.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Listening';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist presented a cognitive-behavioral model of communication, linking active listening to reduced interpersonal conflict and increased self-efficacy in social interactions. Clients engaged in a structured dialogue activity where they alternated between the roles of speaker and listener, incorporating affirming statements and emotional summarization. The therapist provided corrective feedback and reinforced the importance of regulating internal distractions.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Listening';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist explored the psychological function of reflective listening in establishing rapport and trust. Clients discussed how miscommunications in their personal lives often stem from inattentiveness or emotionally reactive responses. Using real-life scenarios, the therapist guided participants through exercises to practice listening for emotional content beneath surface-level statements.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Listening';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a discussion on the influence of early attachment patterns on present-day listening habits. Clients reflected on how their upbringing shaped their ability to stay present during conversations and tolerate emotional disclosures. The therapist introduced grounding techniques to help anchor attention and foster deeper, more compassionate listening in emotionally charged interactions.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Listening';



