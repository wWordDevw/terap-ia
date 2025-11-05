-- =============================================
-- MIGRACIÓN: ACTIVIDAD SOCIAL SKILLS (MIÉRCOLES)
-- Terapia Nota System - PostgreSQL 16
-- =============================================

-- =============================================
-- 1. ACTIVIDAD PRINCIPAL: SOCIAL SKILLS
-- =============================================

INSERT INTO activities (activity_name, description) VALUES
('Social Skills', 'Developing essential interpersonal skills including assertiveness, communication, empathy, respect, and rapport-building to enhance social functioning and relationship quality');

-- =============================================
-- 2. OBJETIVOS (SUBACTIVIDADES)
-- =============================================

INSERT INTO subactivities (activity_id, subactivity_name, description)
SELECT 
    activity_id,
    'Assertiveness',
    'Learning to communicate needs and boundaries assertively while maintaining respect for others'
FROM activities WHERE activity_name = 'Social Skills'
UNION ALL
SELECT 
    activity_id,
    'Communication',
    'Enhancing verbal and nonverbal communication skills for effective social interaction'
FROM activities WHERE activity_name = 'Social Skills'
UNION ALL
SELECT 
    activity_id,
    'Acceptance of Critics',
    'Developing skills to receive and process constructive criticism without defensiveness'
FROM activities WHERE activity_name = 'Social Skills'
UNION ALL
SELECT 
    activity_id,
    'Respect',
    'Cultivating mutual respect as a foundation for healthy interpersonal relationships'
FROM activities WHERE activity_name = 'Social Skills'
UNION ALL
SELECT 
    activity_id,
    'Empathy',
    'Building empathy and emotional attunement to enhance social connection and understanding'
FROM activities WHERE activity_name = 'Social Skills'
UNION ALL
SELECT 
    activity_id,
    'Rapport',
    'Developing skills to build and maintain rapport in social and professional relationships'
FROM activities WHERE activity_name = 'Social Skills';

-- =============================================
-- 3. PÁRRAFOS PARA "ASSERTIVENESS"
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational group focused on assertiveness training within interpersonal dynamics. Clients examined the continuum between passive, assertive, and aggressive communication, identifying personal tendencies and relational outcomes. The therapist employed modeling and role-play to reinforce the use of "I" statements, boundary-setting, and respectful expression of needs.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on the development of assertive communication as a protective factor against emotional dysregulation and interpersonal conflict. Clients were encouraged to reflect on past situations where assertiveness was lacking or misapplied, and to identify alternative responses. Emphasis was placed on maintaining self-respect while honoring the rights of others.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced assertiveness as a key component of emotional self-efficacy and social functioning. Clients participated in guided activities that differentiated assertive statements from manipulative or avoidant ones. The session focused on increasing self-awareness around discomfort with confrontation and replacing avoidance with direct, respectful expression.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged the group in identifying personal and cultural barriers to assertiveness, exploring how early relational patterns and maladaptive beliefs contribute to passive or aggressive behaviors. Through therapist-facilitated role-play, clients practiced maintaining calm tone, appropriate posture, and clear verbal boundaries in hypothetical conflict scenarios.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session aimed at enhancing clients'' ability to express themselves assertively in emotionally charged contexts. The discussion highlighted how assertiveness contributes to healthier relationships, self-validation, and reduced internalized anger. Clients were encouraged to apply assertiveness scripts to real-life interpersonal challenges and reflect on perceived obstacles.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured group discussion on assertiveness as a means of fostering autonomy and reducing interpersonal resentment. Clients explored the emotional consequences of people-pleasing behaviors and practiced formulating assertive responses that balanced self-respect with empathy toward others.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced assertiveness as a proactive communication tool, helping clients differentiate between assertiveness and compliance under pressure. The group examined common cognitive distortions that inhibit assertive behavior, such as catastrophizing or mind-reading, and identified ways to reframe these thoughts.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients through scenarios emphasizing the role of assertiveness in boundary maintenance and emotional regulation. Participants engaged in reflective journaling followed by sharing examples of situations where assertiveness could have changed the emotional or relational outcome.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led an experiential activity focused on assertive expression of disagreement. Clients were encouraged to voice opposing views using calm tone and confident posture while maintaining mutual respect. The exercise highlighted how assertiveness can minimize passive aggression and promote authentic communication.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an assertiveness workshop where clients learned to identify physiological signs of anxiety during conflict and employed breathing techniques to stay regulated. Assertiveness was reframed as a skill that promotes clarity, prevents miscommunication, and strengthens self-worth in complex relational dynamics.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Assertiveness';



