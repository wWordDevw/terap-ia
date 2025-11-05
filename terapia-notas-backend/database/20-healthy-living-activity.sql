-- =============================================
-- MIGRACIÓN: ACTIVIDAD HEALTHY LIVING (MARTES)
-- Terapia Nota System - PostgreSQL 16
-- =============================================

-- =============================================
-- 1. ACTIVIDAD PRINCIPAL: HEALTHY LIVING
-- =============================================

INSERT INTO activities (activity_name, description) VALUES
('Healthy Living', 'Promoting holistic wellness through physical, emotional, and mental health integration, nutrition, exercise, and healthy coping strategies');

-- =============================================
-- 2. OBJETIVOS (SUBACTIVIDADES)
-- =============================================

INSERT INTO subactivities (activity_id, subactivity_name, description)
SELECT 
    activity_id,
    'Physical, Emotional and Mental Health',
    'Understanding the integration of physical, emotional, and mental health as interdependent systems'
FROM activities WHERE activity_name = 'Healthy Living'
UNION ALL
SELECT 
    activity_id,
    'Nutrition, Exercise and Lifestyle Changes',
    'Learning about the relationship between nutrition, exercise, and lifestyle choices for overall wellness'
FROM activities WHERE activity_name = 'Healthy Living'
UNION ALL
SELECT 
    activity_id,
    'Coping Alternatives',
    'Developing healthy coping strategies as alternatives to maladaptive behaviors'
FROM activities WHERE activity_name = 'Healthy Living';

-- =============================================
-- 3. PÁRRAFOS PARA "PHYSICAL, EMOTIONAL AND MENTAL HEALTH"
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on the integration of physical, emotional, and mental health as interdependent systems. The discussion highlighted how dysregulation in one area can precipitate dysfunction in others. Clients identified personal imbalances, such as emotional eating, sleep disturbances, or social withdrawal, that contribute to deteriorated well-being. The therapist encouraged clients to conceptualize health holistically and to begin implementing one daily behavior that promotes equilibrium across these domains.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Physical, Emotional and Mental Health';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session emphasizing the biopsychosocial model of health, inviting clients to examine how physical activity, emotional awareness, and cognitive flexibility interact to influence resilience. Clients engaged in a self-assessment activity rating their current functioning in each area. The therapist reinforced the importance of routine, stress management, and proactive care, fostering insight into how small lifestyle adjustments can produce compounding psychological benefits over time.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Physical, Emotional and Mental Health';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group focused on recognizing the warning signs of decline in physical, emotional, and mental health. Clients were guided to identify recent shifts in energy, mood, appetite, sleep, and cognition. The therapist introduced early intervention strategies, such as grounding techniques for anxiety, consistent hydration and nutrition, and establishing a structured sleep routine. Clients expressed increased awareness of how neglected wellness habits perpetuate emotional instability.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Physical, Emotional and Mental Health';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion centered on the role of self-regulation and behavioral activation in sustaining a healthy lifestyle. Clients explored barriers such as avoidance, negative self-talk, and low self-efficacy. The therapist modeled cognitive restructuring techniques and emphasized how integrating positive coping skills (e.g., journaling, walking, peer support) into daily routines contributes to emotional balance and mental clarity. Clients were encouraged to select one target area for improvement during the upcoming week.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Physical, Emotional and Mental Health';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a reflective session addressing the psychosomatic interplay between unmanaged stress and physical illness. Clients discussed how somatic complaints (e.g., fatigue, muscle tension, gastrointestinal issues) often coincide with emotional suppression or cognitive overload. The therapist emphasized emotional expression, balanced nutrition, and consistent movement as tools to recalibrate both body and mind. Clients were prompted to reflect on past periods of wellness and what habits had contributed to that sense of stability.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Physical, Emotional and Mental Health';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of integrated wellness, emphasizing how lifestyle choices influence psychological and physiological functioning. Clients participated in a guided activity examining their daily routines, identifying habits that contribute to or hinder their well-being. The therapist encouraged the use of behavioral tracking to increase accountability and reinforce positive health behaviors, such as hydration, rest, and emotional regulation techniques.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Physical, Emotional and Mental Health';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on the importance of preventive care and emotional hygiene in maintaining psychological health. Clients explored the cumulative effects of neglecting self-care in areas such as sleep, nutrition, and social connection. Through open discussion, the therapist helped clients connect patterns of emotional dysregulation with unhealthy routines and supported them in developing a weekly action plan to foster holistic wellness.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Physical, Emotional and Mental Health';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in a discussion about the reciprocal relationship between emotional distress and physical health outcomes. The group reviewed how unprocessed emotions can manifest somatically and impact immune function, energy levels, and motivation. Clients were encouraged to identify personal health goals and to explore how attending to both mental and physical needs can promote greater emotional stability and cognitive clarity.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Physical, Emotional and Mental Health';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group focused on the role of daily structure and routine in supporting overall health. Clients discussed the psychological impact of irregular sleep, poor dietary habits, and inactivity. The therapist highlighted how implementing predictable patterns can reduce emotional volatility and increase a sense of control. Clients were invited to create a health-promoting schedule, integrating at least one behavior from each wellness domain.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Physical, Emotional and Mental Health';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session exploring the impact of chronic stress on physical and emotional health. The group discussed symptoms of burnout, such as fatigue, irritability, and impaired concentration. The therapist introduced strategies for restoring balance, including time management, progressive muscle relaxation, and digital boundaries. Clients reflected on recent stressors and identified specific self-care practices to reduce psychological overload.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Physical, Emotional and Mental Health';



