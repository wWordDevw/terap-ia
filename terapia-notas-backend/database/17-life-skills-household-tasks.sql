-- =============================================
-- PÁRRAFOS PARA "MANAGING HOUSEHOLD TASKS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session aimed at increasing client awareness of the role that structured household routines play in fostering autonomy and reducing environmental stress. Clients explored the psychological benefits of organization, time-blocking, and incremental task management. Resistance stemming from executive dysfunction and motivational deficits was discussed in the group setting.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Managing Household Tasks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group discussion on the intersection between household management and self-efficacy. Clients were encouraged to reflect on their current level of functioning in maintaining their living space and how perceived task overload can exacerbate depressive symptoms. The session introduced behavioral activation strategies to initiate engagement with domestic responsibilities.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Managing Household Tasks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced an activity focused on identifying barriers to completing routine household tasks, such as cognitive disorganization, poor time management, and emotional avoidance. Clients collaboratively developed practical solutions, including chore scheduling, task simplification, and the use of visual cues. Emphasis was placed on the link between environmental order and emotional regulation.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Managing Household Tasks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a goal-oriented session in which clients practiced breaking down complex household duties into manageable steps using task analysis. The group examined how small accomplishments in managing domestic spaces can reinforce a sense of competence and contribute to mood stabilization. Clients shared strategies to overcome procrastination and apathy.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Managing Household Tasks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skills-training session emphasizing the role of executive functioning in successful household task management. Clients discussed how impaired planning and initiation often lead to disorganized living environments and emotional dysregulation. The therapist modeled adaptive strategies such as prioritization matrices and cue-based habit formation.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Managing Household Tasks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in a session focused on the psychological implications of maintaining a clean and functional living environment. The discussion addressed how clutter and disorganization can contribute to cognitive overload and emotional fatigue. Clients were encouraged to identify one area in their home that they could improve as part of a behavioral activation goal.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Managing Household Tasks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on developing consistent routines to manage daily household responsibilities. Clients explored how lack of structure often correlates with increased anxiety and a sense of helplessness. The therapist introduced the concept of habit stacking to support the internalization of new domestic behaviors.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Managing Household Tasks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a cognitive-behavioral group exercise in which clients identified maladaptive thoughts that interfere with household task completion, such as perfectionism or all-or-nothing thinking. Clients practiced reframing these beliefs and were provided with reinforcement strategies to encourage incremental progress at home.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Managing Household Tasks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a solution-focused framework to help clients address difficulties with household management. Clients examined how unresolved tasks can become stress triggers and were guided in creating a simple action plan using SMART goals. Peer support was encouraged to promote accountability.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Managing Household Tasks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a process group to explore the emotional meaning attached to managing one''s home environment. Clients reflected on early family dynamics and how these experiences shaped their current attitudes toward domestic responsibilities. The therapist supported clients in differentiating avoidance rooted in trauma from skill-based deficits, offering tailored interventions.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Managing Household Tasks';

