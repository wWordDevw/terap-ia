-- =============================================
-- PÁRRAFOS PARA "DAILY ROUTINES" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on the importance of consistent daily routines in promoting psychological stability and executive functioning. Clients examined how irregular sleep, meal, and hygiene schedules contribute to mood dysregulation and increased stress. The client acknowledged personal difficulties with time structure but did not articulate specific goals or changes, indicating continued challenges in implementing functional self-management strategies.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Daily Routines';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a structured discussion on how maintaining daily routines supports behavioral activation and reduces avoidance behaviors commonly associated with depressive states. Clients reviewed the cognitive-behavioral rationale for establishing morning and evening routines and were prompted to identify one task they could complete consistently each day. The client listened but expressed ambivalence and failed to select a routine to implement, reflecting low motivation and no observable behavioral planning.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Daily Routines';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided the group through an activity mapping out individual daily schedules to identify patterns of dysregulation, inactivity, or overcommitment. Clients explored how disorganized routines exacerbate anxiety and impair focus. While the group practiced restructuring routines to promote balance, the client remained passive and did not participate in planning exercises, indicating ongoing executive dysfunction and limited insight into the functional impact of routine instability.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Daily Routines';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session on how predictable routines enhance a sense of control and self-efficacy, particularly in managing symptoms of depression and anxiety. The discussion emphasized the connection between task completion and reward systems in the brain. Although the client was receptive to the information, they did not engage in the behavioral rehearsal of setting a basic daily routine, suggesting low engagement with skill acquisition at this stage.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Daily Routines';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group focused on rebuilding daily structure following periods of inactivity or crisis. Clients were encouraged to reflect on how lack of routine contributes to cognitive fatigue and emotional lability. The therapist introduced visual tools such as habit trackers and checklists. The client observed the process but declined to create or share a routine plan, demonstrating limited initiation and lack of measurable progress toward functional independence.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Daily Routines';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session emphasizing the regulatory impact of structured daily activities on mood stabilization and task persistence. Clients discussed barriers to maintaining routines, such as low energy, distractibility, and inconsistent motivation. The client acknowledged that disorganization contributes to feeling overwhelmed but was unable to identify specific behavioral adjustments, indicating limited readiness to initiate routine restructuring.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Daily Routines';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of behavioral momentum, illustrating how consistent engagement in low-effort daily tasks can increase the likelihood of completing more demanding responsibilities. Clients were guided in identifying "anchor" habits to build their routine around. The client showed understanding of the concept but did not identify any anchor behaviors or demonstrate intent to implement them, reflecting no observable integration of skill-building.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Daily Routines';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group exercise on differentiating between essential, flexible, and avoidant components of daily routines. Clients mapped current activities and examined how avoidance patterns displace necessary tasks. The client identified excessive screen time as a barrier but did not propose a time-management strategy to address it, suggesting limited application of insight into behavioral modification.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Daily Routines';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session focused on the role of predictability and structure in emotional containment. Clients reviewed examples of daily routines that support stability, such as consistent wake times, scheduled meals, and brief planning sessions. Although the client agreed with the rationale presented, they did not contribute a personalized routine or reflect on past efforts, indicating low engagement in skill internalization.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Daily Routines';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a cognitive-behavioral discussion on how disorganized daily routines can perpetuate negative thought cycles and impair task completion. Clients practiced reframing unproductive beliefs tied to routine failure, such as "I''ll never stay consistent," into action-oriented alternatives. The client observed but did not attempt to reframe personal beliefs or participate in examples, reflecting limited activation of therapeutic insight into daily functioning.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Daily Routines';

