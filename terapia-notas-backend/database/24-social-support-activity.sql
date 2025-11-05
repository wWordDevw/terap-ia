-- =============================================
-- MIGRACIÓN: ACTIVIDAD SOCIAL SUPPORT (MIÉRCOLES)
-- Terapia Nota System - PostgreSQL 16
-- =============================================

-- =============================================
-- 1. ACTIVIDAD PRINCIPAL: SOCIAL SUPPORT
-- =============================================

INSERT INTO activities (activity_name, description) VALUES
('Social Support', 'Building and utilizing social support networks including support groups, emergency systems, community resources, and social events to enhance resilience and reduce isolation');

-- =============================================
-- 2. OBJETIVOS (SUBACTIVIDADES)
-- =============================================

INSERT INTO subactivities (activity_id, subactivity_name, description)
SELECT 
    activity_id,
    'Support Groups',
    'Learning to participate in and benefit from peer-led support groups for emotional validation and shared experiences'
FROM activities WHERE activity_name = 'Social Support'
UNION ALL
SELECT 
    activity_id,
    'Using Emergency Systems',
    'Understanding when and how to access emergency mental health services and crisis support systems'
FROM activities WHERE activity_name = 'Social Support'
UNION ALL
SELECT 
    activity_id,
    'Community Resources',
    'Identifying and utilizing community-based resources to strengthen social support networks'
FROM activities WHERE activity_name = 'Social Support'
UNION ALL
SELECT 
    activity_id,
    'Social Events',
    'Participating in social events and community activities to build connections and reduce isolation'
FROM activities WHERE activity_name = 'Social Support';

-- =============================================
-- 3. PÁRRAFOS PARA "SUPPORT GROUPS"
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on the psychological and emotional benefits of participating in peer-led support groups. Clients explored the concept of shared experiences as a mechanism for normalizing emotional responses and reducing feelings of isolation. The group processed barriers such as trust issues and stigma, and discussed gradual steps to increase openness within safe environments.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Support Groups';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a reflective discussion on the role of support groups in emotional stabilization and long-term recovery. Clients examined how peer validation and mutual accountability can reinforce adaptive behaviors and challenge maladaptive thinking. Emphasis was placed on developing a sense of belonging and reducing shame through collective healing.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Support Groups';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients in identifying the functions of structured support networks, highlighting how group cohesion and emotional resonance can buffer against stress. The group explored internal resistance to joining or participating actively in support groups, linking these to previous relational trauma and avoidance patterns. Strategies for gradual exposure and engagement were discussed.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Support Groups';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the use of support groups as a therapeutic adjunct to individual treatment. Clients examined how hearing others'' experiences can enhance perspective-taking and emotional insight. The group was encouraged to identify potential community or in-program groups that aligned with their needs, interests, or current treatment goals.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Support Groups';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an experiential exercise in which clients practiced offering and receiving supportive feedback in a mock peer group format. The activity underscored the importance of active listening, empathy, and nonjudgmental language. Clients reflected on how supportive environments could serve as protective factors against relapse and emotional dysregulation.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Support Groups';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session exploring the therapeutic value of social connection within support groups. Clients examined how consistent participation can foster emotional containment, validation, and the modeling of adaptive coping strategies. The discussion included identifying personal barriers to engagement, such as fear of vulnerability or past group-related disappointments.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Support Groups';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a discussion emphasizing the role of support groups in enhancing resilience and reducing emotional isolation. Clients identified key characteristics of effective support environments, including confidentiality, mutual respect, and shared goals. The group explored personal readiness to participate and how structured group interactions can complement individual therapeutic work.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Support Groups';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced support groups as an evidence-based intervention to increase perceived social support and promote recovery-oriented behavior. Clients reflected on past experiences of connection or disconnection within group settings and how these influence current relational dynamics. Cognitive distortions related to trust and belonging were gently challenged during the session.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Support Groups';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an activity focused on distinguishing between informal social networks and formal support groups. Clients explored the impact of emotionally responsive groups in buffering against relapse and promoting insight. Therapeutic discussion centered on increasing motivation to access these resources and identifying one concrete step toward group involvement.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Support Groups';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a conversation around the psychological impact of shared emotional narratives within peer support systems. Clients discussed how witnessing others'' progress can instill hope and offer new behavioral models. The therapist supported clients in identifying how support group participation could align with their treatment goals and personal growth trajectories.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Support Groups';



