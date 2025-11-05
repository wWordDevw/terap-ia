-- =============================================
-- PÁRRAFOS PARA "FRIENDLINESS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured session on enhancing friendliness as a core component of prosocial communication. The therapist highlighted how expressions of warmth and openness can increase interpersonal trust and social inclusion. Clients engaged in role-play exercises designed to practice verbal and nonverbal cues associated with friendly interactions, such as appropriate eye contact, open posture, and tone modulation.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Friendliness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group discussion focused on friendliness as a social skill that fosters approachability and builds rapport. Clients were encouraged to reflect on past social interactions where friendliness either facilitated or hindered connection. Through guided feedback and behavioral modeling, clients explored how to authentically convey positive regard in both familiar and unfamiliar social contexts.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Friendliness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational activity centered on the psychological benefits of friendly communication, particularly its role in reducing social anxiety and promoting reciprocal engagement. The therapist utilized cognitive-behavioral strategies to help clients reframe negative automatic thoughts that inhibit friendly behavior. Clients practiced initiating low-stakes conversations in a safe group setting.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Friendliness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session targeting friendliness as a skill often underutilized by individuals with low self-esteem or histories of interpersonal trauma. Clients explored internalized beliefs about rejection and learned how friendliness can be a low-risk, high-reward tool for social reconnection. The therapist introduced techniques such as smiling, active listening, and affirming language as accessible starting points.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Friendliness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged the group in identifying the impact of friendliness on mood regulation and relationship satisfaction. The therapist emphasized how small gestures of kindness and openness can influence emotional reciprocity. Clients were encouraged to observe their current friendliness level in daily interactions and set a behavioral goal for increasing friendly engagement using a self-monitoring worksheet.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Friendliness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a skills-based session on cultivating friendliness in interpersonal settings. The therapist emphasized the role of social approach behaviors in reducing perceived isolation and enhancing peer connectivity. Clients participated in a feedback exercise where they practiced offering compliments and initiating conversations, while reflecting on internal discomfort or cognitive distortions that may act as barriers.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Friendliness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a therapeutic group focused on developing friendliness through intentional social behaviors. Psychoeducation was provided on how friendliness can act as a protective factor against depressive symptoms by encouraging interpersonal reinforcement. Clients were encouraged to identify specific behaviors they associate with being "friendly" and challenged to demonstrate one during the session.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Friendliness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced friendliness as a learned social competency that can be strengthened through repetition and reflection. The therapist guided the group in identifying personal strengths and challenges in initiating warm interactions. Clients engaged in mindfulness-based role-plays to enhance awareness of how facial expression, proximity, and vocal tone impact perceived friendliness.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Friendliness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session addressing how deficits in friendly communication may stem from maladaptive core beliefs or negative past social experiences. The group explored how friendliness is not synonymous with vulnerability, and how it can serve as a bridge to safe and reciprocal relationships. Clients were supported in developing brief, friendly scripts for real-life application.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Friendliness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an experiential group exercise aimed at reinforcing friendliness as a tool for fostering prosocial connections. The therapist underscored how consistent use of friendly behaviors—such as greeting others by name or expressing interest—can incrementally improve social outcomes. Clients collaborated in pairs to simulate first-time conversations, with peer and therapist feedback integrated for reinforcement.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Friendliness';



