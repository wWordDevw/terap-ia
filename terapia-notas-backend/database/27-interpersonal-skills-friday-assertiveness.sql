-- =============================================
-- PÁRRAFOS PARA "ASSERTIVENESS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on assertive communication techniques. Clients learned the difference between passive, aggressive, and assertive communication styles. The therapist introduced the "I" statement formula and practiced expressing needs and boundaries respectfully. Participants engaged in role-playing exercises to practice assertive responses in various interpersonal situations.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on identifying personal rights and boundaries in relationships. Clients explored their values and learned to recognize when their boundaries are being violated. The therapist taught techniques for setting clear limits while maintaining respect for others. The group practiced identifying situations where assertiveness is needed and developing appropriate responses.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skills-building session on managing anxiety and fear when being assertive. Clients learned relaxation techniques to use before difficult conversations. The therapist introduced strategies for building confidence and practicing assertiveness in low-risk situations first. Participants shared their fears about being assertive and received support and encouragement from the group.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on handling resistance and pushback when being assertive. Clients learned techniques for staying calm and firm when others react negatively to their boundaries. The therapist taught methods for de-escalating conflict while maintaining assertive communication. The group practiced responding to common resistance patterns in a supportive environment.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on assertive body language and nonverbal communication. Clients practiced maintaining eye contact, using appropriate gestures, and projecting confidence through posture. The therapist emphasized the importance of matching verbal and nonverbal messages when being assertive. Participants engaged in exercises to practice confident body language in various scenarios.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational group on the benefits of assertive communication for relationship health. Clients explored how assertiveness can improve mutual respect and reduce resentment in relationships. The therapist taught techniques for expressing appreciation and positive feedback assertively. The group discussed how assertiveness contributes to healthier, more authentic connections with others.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on assertive communication in professional and workplace settings. Clients learned to distinguish between appropriate and inappropriate assertiveness in different contexts. The therapist taught techniques for making requests, giving feedback, and handling difficult conversations at work. Participants practiced scenarios involving workplace communication challenges.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a skills-based session on building assertiveness gradually and safely. Clients learned to start with small, low-risk situations and gradually work up to more challenging interactions. The therapist introduced the concept of "assertiveness practice" and encouraged participants to set realistic goals. The group created individual plans for developing assertiveness skills over time.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session on assertive communication in family relationships and close friendships. Clients explored the unique challenges of being assertive with people they care about deeply. The therapist taught techniques for maintaining relationships while setting necessary boundaries. Participants practiced expressing needs and concerns to family members in a respectful but firm manner.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on evaluating and improving assertiveness skills over time. Clients reflected on their progress and identified areas for continued growth. The therapist encouraged participants to seek feedback from trusted others about their communication style. The group discussed strategies for maintaining assertiveness skills and continuing to practice in daily life.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';



