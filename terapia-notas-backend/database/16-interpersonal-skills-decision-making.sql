-- =============================================
-- PÁRRAFOS PARA "DECISION MAKING" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session centered on the role of emotional regulation in interpersonal decision-making. Clients were encouraged to explore how impulsivity, fear of rejection, or people-pleasing behaviors can interfere with assertive and values-based choices. Therapist guided participants through a decision-making model aimed at enhancing self-awareness, promoting agency, and reducing conflict within relationships.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a structured discussion on decision-making within interpersonal contexts, highlighting the connection between cognitive distortions and ineffective choices. Clients practiced identifying distorted thinking that may lead to poor interpersonal outcomes, such as catastrophizing or overgeneralization. The group reviewed techniques to delay impulsive decisions and evaluate outcomes based on long-term relational goals.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of collaborative decision-making as a tool for improving communication and trust in relationships. Clients engaged in role-playing scenarios to practice negotiating interpersonal needs while respecting boundaries. Therapist emphasized perspective-taking and the importance of assertive expression when navigating conflict-laden decisions.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a cognitive-behavioral intervention targeting the process of interpersonal decision-making. The group examined how unprocessed emotions and unresolved trauma may influence present-day relational choices. Clients were guided through exercises aimed at integrating emotional insight with rational problem-solving to support healthier interpersonal dynamics.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session on the impact of low self-esteem and anxiety on interpersonal decision-making. Clients discussed tendencies to avoid decisions, defer to others, or seek excessive reassurance. Therapist provided a decision-making framework emphasizing clarity of values, emotional boundaries, and reflective thinking as a foundation for more autonomous and confident interactions.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session focused on identifying the internal and external factors that influence decision-making in interpersonal relationships. Clients explored the role of past relational experiences, family dynamics, and attachment styles in current decision patterns. The therapist emphasized the development of insight and intentionality as protective factors against impulsive or avoidant decisions.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led an experiential activity where clients mapped out recent interpersonal decisions, identifying the emotions, thoughts, and perceived consequences involved. The therapist highlighted how emotional dysregulation and cognitive rigidity can limit effective decision-making. Clients were encouraged to reframe challenging interpersonal situations as opportunities for growth and boundary-setting.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a mindfulness-based approach to enhance decision-making in interpersonal contexts. Clients practiced grounding techniques before engaging in hypothetical social dilemmas, allowing them to approach decisions from a more regulated emotional state. The therapist reinforced the importance of self-reflection, delayed response, and congruence with personal values in healthy relational functioning.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion on assertiveness in interpersonal decision-making, particularly in high-stress or emotionally charged situations. Clients examined how passive, aggressive, and passive-aggressive styles can distort decision outcomes. The therapist provided assertive communication scripts and coached clients through applying them in common relational scenarios.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged the group in cognitive restructuring techniques to support more adaptive interpersonal decisions. Clients analyzed how automatic negative thoughts (e.g., "I''ll be abandoned if I say no") can lead to self-sabotaging behaviors. The therapist guided clients in replacing maladaptive beliefs with more balanced alternatives that support autonomy and emotional safety in relationships.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';
