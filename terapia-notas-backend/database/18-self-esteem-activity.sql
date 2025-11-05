-- =============================================
-- MIGRACIÓN: ACTIVIDAD SELF-ESTEEM (MARTES)
-- Terapia Nota System - PostgreSQL 16
-- =============================================

-- =============================================
-- 1. ACTIVIDAD PRINCIPAL: SELF-ESTEEM
-- =============================================

INSERT INTO activities (activity_name, description) VALUES
('Self-Esteem', 'Building and maintaining healthy self-esteem through identification of triggers, self-care practices, and confidence-building activities');

-- =============================================
-- 2. OBJETIVOS (SUBACTIVIDADES)
-- =============================================

INSERT INTO subactivities (activity_id, subactivity_name, description)
SELECT 
    activity_id,
    'Identify Triggers to Low Self Esteem',
    'Recognizing internal and external factors that contribute to diminished self-worth'
FROM activities WHERE activity_name = 'Self-Esteem'
UNION ALL
SELECT 
    activity_id,
    'Identify Triggers to Low',
    'Further exploration of triggers and patterns that undermine self-esteem'
FROM activities WHERE activity_name = 'Self-Esteem'
UNION ALL
SELECT 
    activity_id,
    'Self Esteem',
    'Understanding and developing foundational self-esteem concepts'
FROM activities WHERE activity_name = 'Self-Esteem'
UNION ALL
SELECT 
    activity_id,
    'Practice Self-Care',
    'Learning to prioritize and maintain self-care practices for self-worth'
FROM activities WHERE activity_name = 'Self-Esteem'
UNION ALL
SELECT 
    activity_id,
    'Practicing Enjoyable Activities',
    'Engaging in pleasurable activities to strengthen self-worth and identity'
FROM activities WHERE activity_name = 'Self-Esteem'
UNION ALL
SELECT 
    activity_id,
    'Daily Accomplishments',
    'Recognizing and celebrating daily achievements to build self-efficacy'
FROM activities WHERE activity_name = 'Self-Esteem'
UNION ALL
SELECT 
    activity_id,
    'Building Self-Confidence',
    'Developing skills and strategies to enhance self-confidence and self-assurance'
FROM activities WHERE activity_name = 'Self-Esteem';

-- =============================================
-- 3. PÁRRAFOS PARA "IDENTIFY TRIGGERS TO LOW SELF ESTEEM"
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a reflective group session focused on identifying both internal and external triggers that contribute to diminished self-esteem. Clients were guided through cognitive restructuring techniques to challenge maladaptive beliefs rooted in past experiences of criticism, social rejection, and perceived failure. Emphasis was placed on recognizing how these triggers activate automatic negative thoughts and emotional dysregulation. Several clients demonstrated difficulty articulating specific triggers, indicating the need for further work in emotional insight and self-awareness.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational discussion on the development of self-concept and the influence of early relational dynamics on current self-esteem. Clients explored how invalidating environments, attachment disruptions, and chronic comparison have shaped negative self-appraisals. The therapist introduced the concept of schema activation and encouraged clients to trace specific low-esteem triggers to formative interpersonal experiences. Despite initial resistance, a few clients were able to identify recurring patterns of negative self-talk linked to familial or peer feedback.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients in mapping recent experiences where their self-esteem was impacted, highlighting the role of cognitive distortions such as personalization, catastrophizing, and all-or-nothing thinking. The therapist emphasized the importance of distinguishing between core beliefs and situational self-evaluations. Clients were encouraged to consider how social interactions, perceived judgment, and unmet expectations contribute to a pattern of internalized self-criticism. While some clients engaged actively, others struggled to externalize their inner narrative, suggesting avoidance or low emotional literacy.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a group exercise utilizing guided imagery and journaling to help clients surface and articulate triggers that lower their self-worth. Clients shared experiences involving body image dissatisfaction, professional inadequacy, and fear of abandonment. The therapist normalized these themes and offered psychoeducation on the link between chronic invalidation and internalized shame. The group reflected on how these triggers often escalate symptoms of depression and reinforce withdrawal or self-sabotaging behaviors.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion examining the role of social comparison and cultural messaging in shaping clients'' self-esteem. Clients identified common triggers such as social media exposure, perceived underachievement, and emotionally dismissive interactions. The therapist utilized elements of acceptance and commitment therapy (ACT) to foster values-based self-evaluation rather than external validation. Clients appeared ambivalent about implementing change, though some verbalized increased awareness of how external feedback loops maintain negative self-concept.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group intervention aimed at increasing insight into situational and relational triggers that undermine self-esteem. Clients engaged in discussion about experiences that activate feelings of worthlessness, particularly criticism from authority figures and social exclusion. The therapist encouraged the use of thought-monitoring techniques to help clients recognize the onset of negative self-appraisal and introduced strategies for cognitive reframing. Several clients demonstrated initial resistance but gradually shared relevant examples, indicating early stages of insight development.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a structured session focused on identifying the impact of maladaptive perfectionism on self-esteem. Clients examined how unrealistic self-imposed standards and fear of failure contribute to cycles of self-criticism and emotional withdrawal. The therapist highlighted the role of core beliefs and schema-driven behavior, guiding clients through self-reflective prompts. While a few participants expressed difficulty accessing specific emotional triggers, the group was generally receptive to exploring the connection between external performance and internal validation.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced an experiential exercise designed to help clients identify personal vulnerabilities that lower self-worth. Through group dialogue and therapist modeling, clients explored how invalidating feedback, neglect, or comparison to others activate internal narratives of inadequacy. The therapist utilized principles from Dialectical Behavior Therapy (DBT) to reinforce validation and distress tolerance when facing esteem-related triggers. Clients responded with varying degrees of openness, with some expressing newfound awareness and others remaining guarded.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group process exploring how past trauma and unresolved interpersonal conflicts may serve as chronic triggers to low self-esteem. Clients were encouraged to reflect on how past experiences of rejection or betrayal influence current self-perception and emotional reactivity. The therapist emphasized the role of emotional memory and implicit beliefs in shaping identity and introduced grounding techniques to manage self-critical thoughts. Although full engagement varied, clients began to demonstrate an increased ability to link emotional patterns with esteem disturbances.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients through a cognitive-behavioral framework to deconstruct moments when their self-esteem is compromised. The group explored internal dialogues that emerge in response to perceived failure, judgment, or abandonment. Clients practiced identifying the thoughts, feelings, and behaviors associated with these triggers, with the therapist highlighting common cognitive distortions such as mind reading and labeling. Participation was moderate, with some clients demonstrating improved self-awareness, while others required additional scaffolding to identify emotional connections.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low Self Esteem';

