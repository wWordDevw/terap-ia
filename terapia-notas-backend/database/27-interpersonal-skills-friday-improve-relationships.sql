-- =============================================
-- PÁRRAFOS PARA "IMPROVE RELATIONSHIPS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on the foundations of healthy relationships. Clients learned about the importance of mutual respect, trust, and effective communication in building strong connections. The therapist introduced the concept of emotional intimacy and how to develop deeper connections with others. Participants engaged in exercises to identify their relationship values and goals.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on active listening skills for improving relationships. Clients learned techniques for giving full attention, asking clarifying questions, and reflecting back what others have said. The therapist emphasized the importance of being present and engaged during conversations. The group practiced these skills through role-playing exercises and received feedback on their listening abilities.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skills-building session on expressing appreciation and positive feedback in relationships. Clients learned to recognize and acknowledge the positive qualities and actions of others. The therapist taught techniques for giving specific, genuine compliments and expressing gratitude. Participants practiced these skills and discussed how appreciation can strengthen relationships over time.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on building trust and reliability in relationships. Clients explored what trust means to them and how to demonstrate trustworthiness to others. The therapist taught techniques for keeping commitments, being consistent, and following through on promises. The group practiced identifying trustworthy behaviors and discussed ways to rebuild trust when it has been broken.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on managing expectations and boundaries in relationships. Clients learned to communicate their needs and limits clearly while respecting others'' boundaries. The therapist taught techniques for negotiating relationship agreements and finding compromises. Participants practiced setting healthy boundaries and discussed how clear expectations can prevent misunderstandings and conflicts.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational group on emotional intelligence in relationships. Clients learned to recognize and manage their own emotions while being sensitive to others'' feelings. The therapist taught techniques for emotional regulation and empathy. The group practiced exercises designed to increase emotional awareness and improve their ability to connect with others on an emotional level.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on resolving past relationship issues and moving forward constructively. Clients learned techniques for addressing unresolved conflicts and letting go of resentment. The therapist taught methods for forgiveness and healing from past hurts. Participants practiced exercises designed to help them process difficult relationship experiences and develop healthier patterns.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a skills-based session on building intimacy and connection in relationships. Clients learned about different types of intimacy and how to develop deeper connections with others. The therapist taught techniques for sharing vulnerabilities, expressing feelings, and creating meaningful experiences together. The group practiced exercises designed to increase emotional closeness and understanding.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session on maintaining relationships during difficult times and life transitions. Clients learned strategies for supporting each other through challenges and changes. The therapist taught techniques for adapting to new circumstances while maintaining connection. Participants practiced exercises designed to help them navigate relationship challenges and build resilience together.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on evaluating and improving relationship skills over time. Clients reflected on their progress and identified areas for continued growth. The therapist encouraged participants to seek feedback from trusted others about their relationship skills. The group discussed strategies for maintaining and improving their ability to build and maintain healthy relationships.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';



