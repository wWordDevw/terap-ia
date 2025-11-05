-- =============================================
-- PÁRRAFOS PARA "ASSERTIVENESS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured group session on assertiveness, highlighting its distinction from passive and aggressive communication styles. Clients explored the psychological value of assertiveness in maintaining boundaries, expressing needs, and improving interpersonal dynamics. Through role-play and guided discussion, clients identified personal barriers to assertiveness, such as fear of rejection or guilt, and began developing alternative, confident responses.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session focused on assertive communication as a key interpersonal skill. Clients examined how assertiveness fosters mutual respect and emotional safety in relationships. The therapist introduced "I" statements and boundary-setting techniques as practical tools for expressing needs without violating others'' rights. Clients were invited to share recent interpersonal challenges and evaluate how assertiveness could have altered the outcome.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted an interactive session addressing the importance of assertiveness in reducing interpersonal conflict and supporting emotional regulation. Clients explored how unexpressed emotions often result in passive-aggressive behaviors or emotional withdrawal. The therapist modeled assertive dialogue, and participants engaged in scenario-based exercises to practice articulating their thoughts in a respectful and clear manner.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients in recognizing how deficits in assertiveness may contribute to low self-esteem and relationship dissatisfaction. The session focused on identifying cognitive distortions that hinder assertive expression, such as catastrophizing or overgeneralizing social consequences. Clients engaged in cognitive restructuring tasks to reframe unhelpful beliefs and discussed small, real-life opportunities to implement assertive behaviors.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session centered on assertiveness training within emotionally charged interactions. Emphasis was placed on the use of tone, body language, and verbal cues to convey confidence without hostility. Clients analyzed personal tendencies toward compliance or defensiveness and were encouraged to identify moments where assertiveness could promote healthier relational boundaries.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational group on assertiveness as a foundational component of emotional well-being and autonomy. Clients explored how consistently asserting one''s needs and limits can reduce internalized resentment and foster healthier interpersonal dynamics. The therapist supported clients in identifying one situation where they felt unable to speak up and guided them through assertive rephrasing techniques using cognitive-behavioral frameworks.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a skills-based session focused on increasing assertive behavior in settings involving power imbalances, such as within family or workplace dynamics. The discussion included barriers such as fear of confrontation or learned submissiveness. Clients practiced role-plays to rehearse assertive responses, focusing on staying grounded in their values while respectfully disagreeing with others.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist delivered a group session on assertiveness and its correlation with self-advocacy and emotional safety. The therapist discussed the role of self-respect and mutual respect in assertive interactions, as well as the difference between assertiveness and aggressiveness. Clients participated in a reflective activity, identifying recent situations where assertiveness could have improved clarity and reduced miscommunication.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group intervention designed to increase clients'' insight into their communication patterns, emphasizing assertiveness as a corrective approach to chronic passivity or people-pleasing behaviors. Through guided journaling and cognitive rehearsal exercises, clients examined the emotional consequences of unassertiveness and began formulating specific, behaviorally anchored responses for future interactions.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided the group in exploring assertiveness as a tool for emotional regulation and boundary-setting. Clients discussed the psychological effects of silencing one''s needs and how this contributes to emotional dysregulation. Using dialectical strategies, the therapist modeled how to validate both personal experiences and the perspectives of others while maintaining assertive clarity in expression.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Assertiveness';
