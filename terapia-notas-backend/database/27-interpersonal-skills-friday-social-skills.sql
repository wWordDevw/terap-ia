-- =============================================
-- PÁRRAFOS PARA "SOCIAL SKILLS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on fundamental social interaction skills. Clients learned about the importance of making eye contact, using appropriate body language, and maintaining good posture in social situations. The therapist introduced basic conversation starters and techniques for engaging with others. Participants practiced these skills through role-playing exercises in a supportive environment.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on developing conversation skills and maintaining engaging dialogue. Clients learned techniques for asking open-ended questions, sharing personal experiences appropriately, and showing genuine interest in others. The therapist taught methods for keeping conversations flowing and handling awkward silences. The group practiced these skills through structured conversation exercises.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skills-building session on reading social cues and understanding nonverbal communication. Clients learned to interpret facial expressions, body language, and tone of voice in social interactions. The therapist taught techniques for matching others'' energy and responding appropriately to social signals. Participants practiced exercises designed to increase their social awareness and sensitivity.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on building confidence in social situations. Clients explored their social anxieties and learned techniques for managing nervousness and self-doubt. The therapist taught relaxation exercises and positive self-talk strategies for social interactions. The group practiced exercises designed to build self-confidence and reduce social anxiety.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on developing empathy and emotional intelligence in social interactions. Clients learned to recognize and respond to others'' emotions appropriately. The therapist taught techniques for offering support and validation in social situations. Participants practiced exercises designed to increase their emotional awareness and ability to connect with others.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational group on handling social rejection and criticism. Clients learned strategies for coping with social setbacks and maintaining self-esteem. The therapist taught techniques for learning from social mistakes and moving forward constructively. The group practiced exercises designed to help them build resilience in social situations.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on building and maintaining friendships and social connections. Clients learned about the importance of reciprocity, reliability, and mutual support in relationships. The therapist taught techniques for initiating friendships, maintaining contact, and deepening connections over time. Participants practiced exercises designed to help them build meaningful social relationships.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a skills-based session on adapting social behavior to different contexts and situations. Clients learned to adjust their communication style and behavior based on the social setting and audience. The therapist taught techniques for reading social norms and expectations in different environments. The group practiced exercises designed to help them navigate various social situations appropriately.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session on developing assertiveness and boundary-setting in social situations. Clients learned to express their needs and preferences while maintaining respect for others. The therapist taught techniques for saying no gracefully and standing up for themselves in social contexts. Participants practiced exercises designed to help them maintain their integrity while being socially appropriate.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on evaluating social skills progress and setting goals for continued improvement. Clients reflected on their social interactions and identified areas for continued growth. The therapist encouraged participants to practice these skills in their daily lives and seek feedback from trusted others. The group discussed strategies for maintaining and improving social skills over time.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';



