-- =============================================
-- MIGRACIÓN: ACTIVIDAD RELAXATION TECHNIQUES (JUEVES)
-- Terapia Nota System - PostgreSQL 16
-- =============================================

-- =============================================
-- 1. ACTIVIDAD PRINCIPAL: RELAXATION TECHNIQUES
-- =============================================

INSERT INTO activities (activity_name, description) VALUES
('Relaxation Techniques', 'Learning and practicing various relaxation methods including breathing techniques, meditation, mindfulness, and music/exercise to reduce stress and promote emotional regulation');

-- =============================================
-- 2. OBJETIVOS (SUBACTIVIDADES)
-- =============================================

INSERT INTO subactivities (activity_id, subactivity_name, description)
SELECT 
    activity_id,
    'Breathing Techniques',
    'Learning diaphragmatic breathing, paced breathing, and other breathwork techniques for stress reduction and emotional regulation'
FROM activities WHERE activity_name = 'Relaxation Techniques'
UNION ALL
SELECT 
    activity_id,
    'Meditation and Visualization',
    'Practicing meditation and guided visualization techniques to promote calm, safety, and emotional grounding'
FROM activities WHERE activity_name = 'Relaxation Techniques'
UNION ALL
SELECT 
    activity_id,
    'Mindfulness',
    'Developing mindfulness skills for present-moment awareness, cognitive defusion, and emotional regulation'
FROM activities WHERE activity_name = 'Relaxation Techniques'
UNION ALL
SELECT 
    activity_id,
    'Benefits of Managing Activities Music/Exercises',
    'Exploring the therapeutic benefits of music and physical exercise as relaxation and coping strategies'
FROM activities WHERE activity_name = 'Relaxation Techniques';

-- =============================================
-- 3. PÁRRAFOS PARA "BREATHING TECHNIQUES"
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on diaphragmatic breathing as a core relaxation strategy for reducing physiological arousal associated with anxiety and emotional dysregulation. Clients were guided through a paced breathing exercise and encouraged to observe changes in bodily tension and mental clarity. The therapist emphasized the use of breathwork as a grounding tool during episodes of acute distress.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Breathing Techniques';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced breathing techniques as part of a broader cognitive-behavioral framework for emotional self-regulation. The group practiced 4-7-8 breathing and box breathing to activate the parasympathetic nervous system. Clients discussed challenges with staying present and were encouraged to incorporate short breathing intervals into their daily routines as preventative measures against emotional escalation.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Breathing Techniques';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led an experiential group focused on body-mind integration through controlled breathing. The therapist highlighted the role of breath awareness in interrupting cognitive distortions and impulsive reactions. Clients engaged in synchronized breathing exercises, and shared observations of reduced somatic tension, increased calm, or resistance to mindfulness. The session concluded with a reflection on readiness to use these techniques independently.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Breathing Techniques';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist provided psychoeducation on the neurobiological effects of slow, deep breathing in mitigating the stress response. Emphasis was placed on how intentional breathwork can help modulate heart rate variability and restore emotional balance. Clients explored individual breathing patterns under stress and received guidance on creating a personalized breathing routine to enhance emotional resilience.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Breathing Techniques';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skill-building session using progressive breath awareness to support clients in cultivating interoceptive awareness and mindfulness. The therapist explained how shallow, rapid breathing perpetuates anxiety symptoms, while slow, regulated breathing fosters a sense of control. Clients practiced anchoring their attention to breath sensations and were encouraged to track emotional shifts throughout the exercise.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Breathing Techniques';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured session focusing on the therapeutic benefits of rhythmic breathing in managing acute psychological distress. Clients learned to differentiate between automatic, stress-induced breathing patterns and intentional breath regulation. The group participated in guided breathing drills aimed at enhancing present-moment awareness and reducing internal agitation.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Breathing Techniques';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced controlled breathing as a foundational tool for grounding and reducing hyperarousal associated with anxiety and trauma-related symptoms. Clients practiced inhalation and exhalation techniques synchronized with verbal cues, and discussed their individual responses. The session reinforced the connection between breath control and emotional modulation.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Breathing Techniques';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a mindfulness-based intervention emphasizing breath observation as a method for interrupting ruminative thought patterns and fostering cognitive clarity. Clients were encouraged to observe thoughts nonjudgmentally while redirecting focus to their breath. The therapist facilitated a discussion on internal resistance and the challenges of sustaining attention during stress.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Breathing Techniques';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an interactive group focused on leveraging breathwork to regulate affect and decrease physiological symptoms of stress. Clients were introduced to progressive inhalation-hold-exhalation techniques and encouraged to assess perceived emotional intensity pre- and post-exercise. The group reflected on the potential use of these strategies in high-stress interpersonal or environmental contexts.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Breathing Techniques';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided the group through a psychoeducational and experiential session on breath-based relaxation strategies. The therapist explained the use of breath control to interrupt the sympathetic nervous system response and promote parasympathetic activation. Clients were encouraged to incorporate breathing pauses into daily transitions to build tolerance for emotional discomfort.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Breathing Techniques';



