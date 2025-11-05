-- =============================================
-- PÁRRAFOS PARA "ACCEPTING DIFFERENCES" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on understanding and accepting individual differences. Clients learned about the value of diversity in relationships and how differences can enrich connections. The therapist introduced the concept of tolerance and respect for others'' unique perspectives, values, and experiences. Participants engaged in exercises to identify their own biases and assumptions about others.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on developing empathy and perspective-taking skills. Clients learned to see situations from others'' viewpoints and understand their motivations and experiences. The therapist taught techniques for asking open-ended questions and listening without judgment. The group practiced exercises designed to increase understanding and reduce judgmental thinking about others.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skills-building session on managing disagreements about values and beliefs. Clients learned to respect others'' right to hold different opinions while maintaining their own values. The therapist taught techniques for discussing sensitive topics without trying to change others'' minds. Participants practiced exercises designed to help them navigate value differences constructively.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on cultural differences and how they impact relationships. Clients explored their own cultural background and learned about the importance of cultural sensitivity. The therapist taught techniques for asking respectful questions about others'' cultural practices and beliefs. The group practiced exercises designed to increase cultural awareness and understanding.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on accepting personality differences and communication styles. Clients learned about different personality types and how they affect relationships. The therapist taught techniques for adapting communication to work with different personality styles. Participants practiced exercises designed to help them appreciate and work with various personality differences.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational group on managing expectations and accepting others as they are. Clients learned to distinguish between reasonable expectations and unrealistic demands. The therapist taught techniques for focusing on what they can control in relationships while accepting what they cannot change. The group practiced exercises designed to help them let go of the need to change others.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on building bridges across differences and finding common ground. Clients learned to identify shared values and interests even when they disagree on other issues. The therapist taught techniques for focusing on similarities while respecting differences. Participants practiced exercises designed to help them build connections despite their differences.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a skills-based session on handling criticism and judgment from others about differences. Clients learned to respond constructively when others criticize their choices or beliefs. The therapist taught techniques for maintaining self-confidence while being open to feedback. The group practiced exercises designed to help them handle judgment and maintain their sense of self-worth.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session on celebrating diversity and learning from others'' differences. Clients learned to appreciate how different perspectives can enrich their own understanding and growth. The therapist taught techniques for being curious about others'' experiences and asking respectful questions. Participants practiced exercises designed to help them see differences as opportunities for learning and growth.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on evaluating progress in accepting differences and setting goals for continued growth. Clients reflected on their ability to accept others and identified areas for improvement. The therapist encouraged participants to practice these skills in their daily relationships. The group discussed strategies for maintaining an open and accepting attitude toward others over time.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';



