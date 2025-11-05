-- =============================================
-- PÁRRAFOS PARA "COPING STRATEGIES TO MANAGE STRESSORS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session focused on equipping clients with adaptive coping strategies to manage environmental and internal stressors. Clients engaged in discussion about personal triggers and the impact of chronic stress on emotional regulation and physical health. The therapist introduced emotion-focused and problem-focused coping techniques, encouraging clients to assess which approaches may be most effective for their current challenges.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Coping Strategies to Manage Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational group centered on identifying maladaptive versus adaptive responses to stress. Clients explored how ineffective strategies such as avoidance or rumination can intensify psychological distress. The therapist guided participants in a cognitive-behavioral exercise aimed at reframing stress-inducing thoughts and promoting self-regulatory behaviors like paced breathing and activity scheduling.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Coping Strategies to Manage Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group session on stress management, emphasizing the role of self-awareness and intentional behavioral choices in reducing distress. Clients were supported in identifying recent stressors and analyzing their coping responses. The therapist introduced coping skills such as journaling, social support seeking, and grounding techniques, while highlighting the importance of consistent practice for long-term effectiveness.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Coping Strategies to Manage Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a therapeutic discussion on the physiological and emotional manifestations of stress, and the necessity of early intervention through proactive coping mechanisms. Clients reflected on personal patterns of escalation and were introduced to structured strategies including progressive muscle relaxation, cognitive reframing, and assertive communication to reduce cumulative stress impact.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Coping Strategies to Manage Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an interactive session where clients reviewed the short- and long-term consequences of unmanaged stress. Through guided exercises, clients identified situations where they felt overwhelmed and explored healthier ways to cope, including mindfulness practices, time management, and constructive distraction techniques. The therapist reinforced the value of individualized coping plans to enhance resilience and self-efficacy.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Coping Strategies to Manage Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured group discussion on developing personalized coping toolkits to manage various types of stressors. Clients were encouraged to identify stress triggers within daily routines and examine the emotional, behavioral, and cognitive responses associated with them. The therapist emphasized the application of proactive strategies such as problem-solving, structured self-care, and social connection to mitigate stress impact.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Coping Strategies to Manage Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session highlighting the cognitive-behavioral relationship between stress perception and coping responses. Clients were guided in identifying unhelpful thinking patterns that escalate stress and participated in a group exercise practicing cognitive reframing. The therapist encouraged implementation of constructive strategies like prioritization, boundary setting, and behavioral activation to promote emotional stability.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Coping Strategies to Manage Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced stress management techniques grounded in dialectical behavior therapy, including distress tolerance and emotion regulation skills. Clients discussed real-life stressors and reflected on their current responses, while exploring new adaptive options such as sensory grounding, guided visualization, and radical acceptance. The therapist supported each client in selecting one strategy to practice before the next session.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Coping Strategies to Manage Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session focused on evaluating the effectiveness of current coping responses to acute and chronic stress. Clients were invited to rate their strategies using a self-assessment worksheet and share insights with the group. The therapist offered psychoeducation on adaptive techniques like structured breathing, thought challenging, and leveraging supportive relationships during high-stress periods.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Coping Strategies to Manage Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a skills-building session aimed at expanding clients'' repertoire of coping strategies to address emotional overload. The group reviewed the physiological responses to stress and discussed the importance of early detection of stress cues. The therapist modeled the use of internal coping dialogue and behavioral distraction, encouraging clients to integrate these techniques into their daily routines.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Coping Strategies to Manage Stressors';



