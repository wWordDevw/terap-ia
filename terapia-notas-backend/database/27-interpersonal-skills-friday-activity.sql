-- =============================================
-- MIGRACIÓN: ACTIVIDAD INTERPERSONAL SKILLS (VIERNES)
-- Terapia Nota System - PostgreSQL 16
-- =============================================

-- =============================================
-- 1. ACTIVIDAD PRINCIPAL: INTERPERSONAL SKILLS
-- =============================================

INSERT INTO activities (activity_name, description) VALUES
('Interpersonal Skills', 'Developing essential skills for effective communication, conflict resolution, and building healthy relationships with others');

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
    'PHP Therapist facilitated a structured group session on interpersonal problem-solving strategies. Clients were introduced to the IDEAL problem-solving model (Identify, Define, Explore, Act, Look back) and practiced applying it to real-life scenarios. The therapist emphasized the importance of active listening and empathy in understanding others'' perspectives during conflict resolution. Clients engaged in role-playing exercises to practice these skills in a safe environment.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session on cognitive restructuring techniques for interpersonal conflicts. Clients learned to identify and challenge negative thought patterns that escalate disagreements. The group practiced reframing statements from accusatory to collaborative language. The therapist highlighted how effective problem-solving requires emotional regulation and clear communication of needs and boundaries.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skills-building session focused on collaborative problem-solving in group settings. Clients practiced the "I" statement technique to express concerns without blame or judgment. The therapist guided participants through exercises that emphasized finding win-win solutions and compromise. Several clients reported increased confidence in addressing interpersonal challenges constructively.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on identifying common barriers to effective problem-solving in relationships. Clients explored how past experiences, fear of conflict, and communication styles can hinder resolution. The therapist introduced techniques for managing emotional reactivity during disagreements, including taking breaks and using grounding exercises. Participants practiced de-escalation strategies and active listening skills.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led an experiential session on problem-solving in high-stress interpersonal situations. Clients practiced remaining calm and focused while addressing conflicts with family members, friends, or colleagues. The therapist emphasized the importance of timing and choosing appropriate settings for difficult conversations. Group members shared personal examples and received feedback on their approach to challenging interpersonal dynamics.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session on creative problem-solving techniques for complex interpersonal issues. Clients learned to brainstorm multiple solutions and evaluate their potential outcomes. The therapist introduced the concept of "thinking outside the box" and encouraged participants to consider unconventional approaches to relationship challenges. The group practiced generating alternative perspectives and solutions collaboratively.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational group on the role of emotional intelligence in interpersonal problem-solving. Clients explored how understanding and managing emotions can improve conflict resolution outcomes. The therapist taught techniques for recognizing emotional triggers in others and responding with empathy. Participants practiced identifying underlying needs and concerns in difficult conversations.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on systematic problem-solving approaches for recurring interpersonal issues. Clients learned to identify patterns in their relationships and develop proactive strategies for addressing common conflicts. The therapist emphasized the importance of setting clear expectations and boundaries to prevent future problems. Group members practiced creating action plans for improving specific relationship dynamics.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skills-based session on problem-solving communication techniques. Clients practiced using open-ended questions to better understand others'' perspectives and needs. The therapist taught active listening skills, including paraphrasing and reflecting feelings. Participants engaged in role-playing exercises to practice these techniques in realistic scenarios, with feedback from the group.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on evaluating and learning from problem-solving attempts. Clients reflected on past interpersonal conflicts and analyzed what worked or didn''t work in their approach. The therapist emphasized the importance of self-reflection and continuous improvement in relationship skills. Participants practiced identifying lessons learned and developing strategies for future similar situations.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Problem Solving';



