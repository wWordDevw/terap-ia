-- =============================================
-- MIGRACIÓN: ACTIVIDAD STRESS MANAGEMENT (JUEVES)
-- Terapia Nota System - PostgreSQL 16
-- =============================================

-- =============================================
-- 1. ACTIVIDAD PRINCIPAL: STRESS MANAGEMENT
-- =============================================

INSERT INTO activities (activity_name, description) VALUES
('Stress Management', 'Developing skills to identify, understand, and effectively manage various types of stressors through adaptive coping strategies and stress reduction techniques');

-- =============================================
-- 2. OBJETIVOS (SUBACTIVIDADES)
-- =============================================

INSERT INTO subactivities (activity_id, subactivity_name, description)
SELECT 
    activity_id,
    'Types of Stressors',
    'Learning to identify and categorize different types of stressors and their impact on mental health'
FROM activities WHERE activity_name = 'Stress Management'
UNION ALL
SELECT 
    activity_id,
    'Coping Strategies to Manage Stressors',
    'Developing adaptive coping strategies and techniques to effectively manage stress'
FROM activities WHERE activity_name = 'Stress Management'
UNION ALL
SELECT 
    activity_id,
    'Outcomes of Coping Efforts',
    'Evaluating the effectiveness of coping strategies and learning from stress management outcomes'
FROM activities WHERE activity_name = 'Stress Management';

-- =============================================
-- 3. PÁRRAFOS PARA "TYPES OF STRESSORS"
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on identifying and categorizing various types of stressors, including acute, chronic, environmental, interpersonal, and internal. Clients participated in a reflective discussion on how each category impacts emotional regulation and somatic responses. The therapist emphasized the importance of recognizing personal stress patterns to enhance early intervention and promote resilience.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Types of Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided the group through an exploration of primary versus secondary stressors and their compounding effects on mental health. Clients examined how unresolved emotional stressors often manifest in behavioral avoidance and physiological symptoms. The session concluded with the introduction of individualized stress-tracking logs to increase awareness of triggering situations.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Types of Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a cognitive-behavioral session focusing on stress appraisal and subjective perception of stressors. Clients were encouraged to differentiate between real and perceived threats and analyze how cognitive distortions exacerbate stress responses. The therapist introduced grounding techniques as a preparatory step for future stress reduction interventions.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Types of Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in a group process centered on identifying external and internal stressors contributing to emotional dysregulation. Clients shared personal examples, and the therapist provided psychoeducation on the role of neurobiological responses in chronic stress exposure. The group collaborated on strategies for building tolerance to stress using mindfulness and progressive muscle relaxation.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Types of Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session on the behavioral and emotional consequences of unmanaged stressors. Clients discussed how cumulative stress can lead to impulsivity, somatic complaints, and affective instability. The therapist reinforced the use of adaptive coping strategies and encouraged the development of personalized "stress response plans" as part of the client''s broader treatment goals.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Types of Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session aimed at enhancing clients'' ability to recognize the multidimensional nature of stressors, including biological, psychological, and social triggers. The group discussed the cumulative impact of daily microstressors versus major life events. Clients were encouraged to reflect on how unacknowledged stressors contribute to maladaptive coping and emotional dysregulation.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Types of Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of stressor classification using a biopsychosocial framework. Clients explored the interplay between external circumstances (e.g., financial pressure, relational conflict) and internal stressors (e.g., guilt, self-criticism). The therapist emphasized that identifying the source of stress is the first step toward implementing effective emotion regulation strategies.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Types of Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a structured discussion on predictable versus unpredictable stressors, helping clients understand how anticipation or lack of control intensifies stress responses. The session highlighted the link between chronic exposure to unpredictable stress and increased vulnerability to anxiety and depression. Clients were invited to identify one recurring stressor and brainstorm adaptive ways of managing it.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Types of Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted an interactive session exploring environmental, psychological, and interpersonal stressors. Clients were asked to map their recent experiences onto these categories and evaluate their emotional and behavioral responses. The therapist provided normalization around stress reactivity and introduced diaphragmatic breathing as a physiological regulation tool.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Types of Stressors';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a reflective exercise on the role of perception and cognitive framing in the experience of stress. Clients explored how subjective meaning attached to events can amplify emotional responses. The therapist modeled reframing techniques and encouraged participants to begin practicing cognitive flexibility in response to recurring stressors.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Types of Stressors';



