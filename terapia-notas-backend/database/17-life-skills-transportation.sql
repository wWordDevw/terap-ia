-- =============================================
-- PÁRRAFOS PARA "USE OF TRANSPORTATION" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session focused on enhancing clients'' functional independence through increased understanding of public and private transportation systems. Clients explored emotional and cognitive barriers to using transportation (e.g., anxiety, fear of getting lost, lack of confidence), and were encouraged to share personal experiences. The therapist emphasized the role of planning, problem-solving, and gradual exposure in fostering greater autonomy.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Use of Transportation';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced practical strategies for navigating transportation challenges, including reading schedules, using navigation apps, and planning alternative routes. The group discussed the connection between reduced mobility and feelings of isolation or helplessness. The therapist highlighted how successful use of transportation can increase community engagement, self-efficacy, and psychosocial functioning.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Use of Transportation';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in a structured activity where they identified individual goals related to transportation use (e.g., attending appointments, visiting family). Clients evaluated their current skill level and discussed perceived obstacles. The therapist addressed avoidance behaviors and reinforced the use of graduated tasks and supportive accountability to build confidence and reduce transportation-related anxiety.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Use of Transportation';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced an evidence-based interpersonal problem-solving framework to help clients enhance relational decision-making. The session emphasized recognizing emotional cues, differentiating between urgent and non-urgent conflicts, and implementing communication strategies conducive to resolution. Clients practiced identifying irrational beliefs that often obstruct collaborative dialogue. One client verbalized increased insight into their tendency to withdraw during conflict, identifying this as a future target for change.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Use of Transportation';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session focusing on interpersonal effectiveness through structured problem-solving. Clients engaged in journaling exercises to identify a recent interpersonal issue, then processed the situation in group discussion using the SODAS model (Situation, Options, Disadvantages, Advantages, Solution). The therapist reinforced the role of perspective-taking and assertiveness in preventing escalation of relational tension. Participation was mixed, with some clients requiring support to challenge black-and-white thinking.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Use of Transportation';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session centered on evaluating clients'' confidence and competence in using various modes of transportation. Clients completed a self-assessment identifying emotional, cognitive, and logistical barriers. The therapist emphasized the link between perceived competence and actual behavior, highlighting cognitive distortions that may hinder independent travel.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Use of Transportation';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of transportation as a core component of independent living and recovery-oriented functioning. Clients were guided through a visual mapping exercise to identify essential destinations and public routes. The therapist provided psychoeducation on anxiety management techniques for use during travel, including grounding and paced breathing.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Use of Transportation';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist explored the intersection of social skills and transportation use, noting how asking for assistance or interacting with transit personnel can provoke avoidance in socially anxious individuals. Clients practiced assertive communication scripts and identified coping strategies for managing in-the-moment discomfort. Therapist reinforced the value of desensitization and behavioral rehearsal.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Use of Transportation';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a problem-solving activity in which clients addressed common transportation dilemmas, such as delays, missed stops, or unfamiliar environments. The group collaborated to generate adaptive responses and increase distress tolerance in unpredictable situations. The therapist linked flexibility in problem-solving to improved emotional regulation and resilience.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Use of Transportation';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group discussion on the emotional significance of mobility and how regaining autonomy through transportation can foster self-determination and improve depressive symptoms. Clients shared transportation goals tied to personal values (e.g., visiting loved ones, attending events). Therapist encouraged the development of action plans incorporating small, achievable transportation-related tasks.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Use of Transportation';

