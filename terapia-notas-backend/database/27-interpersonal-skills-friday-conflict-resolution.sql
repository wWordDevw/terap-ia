-- =============================================
-- PÁRRAFOS PARA "CONFLICT RESOLUTION" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on constructive conflict resolution strategies. Clients learned the importance of addressing conflicts early before they escalate. The therapist introduced active listening techniques and the concept of finding win-win solutions. Participants practiced identifying the underlying needs and interests in conflicts rather than focusing on positions.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on managing emotions during conflict resolution. Clients learned techniques for staying calm and focused when disagreements arise. The therapist taught deep breathing exercises and grounding techniques to use during heated discussions. The group practiced de-escalation strategies and learned to recognize when to take breaks from difficult conversations.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skills-building session on effective communication during conflicts. Clients practiced using "I" statements to express their feelings without blaming others. The therapist taught techniques for paraphrasing and reflecting back what others have said to ensure understanding. Participants engaged in role-playing exercises to practice these communication skills.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on identifying common conflict patterns and triggers. Clients explored their personal conflict styles and learned to recognize early warning signs of escalating disagreements. The therapist introduced techniques for interrupting negative patterns and redirecting conversations toward resolution. The group practiced identifying their own triggers and developing coping strategies.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on collaborative problem-solving in conflict situations. Clients learned to focus on shared interests and common goals rather than differences. The therapist taught brainstorming techniques for generating creative solutions that meet everyone''s needs. Participants practiced working together to find mutually acceptable resolutions to various conflict scenarios.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational group on the role of empathy in conflict resolution. Clients learned to see situations from others'' perspectives and understand their underlying concerns. The therapist taught techniques for validating others'' feelings while still expressing their own needs. The group practiced exercises designed to build empathy and understanding in difficult situations.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on setting boundaries and knowing when to walk away from conflicts. Clients learned to recognize when conflicts are not resolvable or when others are not willing to engage constructively. The therapist taught techniques for protecting themselves while maintaining dignity and respect. Participants practiced assertive communication for ending unproductive conflicts.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a skills-based session on repairing relationships after conflicts. Clients learned techniques for making genuine apologies and rebuilding trust. The therapist taught methods for acknowledging mistakes and taking responsibility for their part in conflicts. The group practiced strategies for moving forward constructively after disagreements.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session on preventing future conflicts through improved communication and relationship skills. Clients learned to address small issues before they become major problems. The therapist taught techniques for regular check-ins and maintaining open communication channels. Participants practiced proactive strategies for maintaining healthy relationships and preventing conflicts.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on evaluating conflict resolution skills and setting goals for improvement. Clients reflected on their progress and identified areas for continued growth. The therapist encouraged participants to practice these skills in their daily relationships. The group discussed strategies for maintaining and improving conflict resolution abilities over time.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';



