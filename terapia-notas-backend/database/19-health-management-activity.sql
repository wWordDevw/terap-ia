-- =============================================
-- MIGRACIÓN: ACTIVIDAD HEALTH MANAGEMENT (MARTES)
-- Terapia Nota System - PostgreSQL 16
-- =============================================

-- =============================================
-- 1. ACTIVIDAD PRINCIPAL: HEALTH MANAGEMENT
-- =============================================

INSERT INTO activities (activity_name, description) VALUES
('Health Management', 'Developing skills for managing health conditions, medication compliance, and understanding health limitations to promote overall wellness');

-- =============================================
-- 2. OBJETIVOS (SUBACTIVIDADES)
-- =============================================

INSERT INTO subactivities (activity_id, subactivity_name, description)
SELECT 
    activity_id,
    'Health Compliance',
    'Learning to maintain consistent adherence to medical recommendations and treatment plans'
FROM activities WHERE activity_name = 'Health Management'
UNION ALL
SELECT 
    activity_id,
    'Drug Interactions, Side Effects, Risks',
    'Understanding medication interactions, side effects, and associated risks'
FROM activities WHERE activity_name = 'Health Management'
UNION ALL
SELECT 
    activity_id,
    'Adverse Reactions and Risks of Drug Use',
    'Recognizing and managing adverse reactions and risks associated with substance use'
FROM activities WHERE activity_name = 'Health Management'
UNION ALL
SELECT 
    activity_id,
    'Chronic Illnesses',
    'Learning to manage and cope with chronic health conditions'
FROM activities WHERE activity_name = 'Health Management'
UNION ALL
SELECT 
    activity_id,
    'Health Limitations',
    'Adapting to and managing physical health limitations and constraints'
FROM activities WHERE activity_name = 'Health Management';

-- =============================================
-- 3. PÁRRAFOS PARA "HEALTH COMPLIANCE"
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational group focused on improving clients'' understanding of health compliance as a core component of overall wellness. Clients discussed common barriers to adhering to medical recommendations, including forgetfulness, mistrust of providers, and low motivation. The therapist introduced behavioral activation strategies and emphasized the importance of medication adherence, regular follow-ups, and consistent self-monitoring. Several clients verbalized ambivalence toward maintaining health routines, indicating a need for ongoing support in promoting accountability and behavioral consistency.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Compliance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group session aimed at enhancing insight into the psychological factors that influence health compliance. Clients explored how mood symptoms, such as depression or anxiety, can interfere with the ability to follow through on treatment plans. The therapist utilized motivational interviewing techniques to elicit internal motivations for health maintenance and to highlight the connection between self-care and self-worth. Client engagement was variable, though some participants acknowledged recent lapses in compliance and identified one small step toward improvement.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Compliance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the topic of health management by guiding clients through a discussion on the psychological impact of non-compliance. Using examples, the therapist illustrated how avoidance, denial, and cognitive distortions often contribute to neglecting essential medical care. Clients were encouraged to identify specific instances where poor compliance led to adverse outcomes, and to generate more adaptive coping strategies. The session emphasized the role of self-efficacy and personal responsibility in health outcomes, fostering a sense of empowerment despite initial resistance from some participants.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Compliance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an interactive group designed to strengthen routines that support medical adherence and chronic illness management. The therapist reviewed the principles of habit formation and provided tools for building structure around medication schedules, dietary changes, and physical activity. Clients shared current challenges, including executive functioning difficulties and lack of external support. The therapist worked collaboratively with the group to generate practical solutions, such as using visual reminders and peer check-ins, to increase compliance and long-term follow-through.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Compliance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session exploring the emotional and behavioral patterns that compromise health compliance. Clients reflected on the role of shame, fear, and hopelessness in sabotaging medical routines. The therapist applied cognitive restructuring techniques to challenge all-or-nothing thinking related to illness management and introduced self-compassion as a countermeasure to self-defeating beliefs. Although some clients struggled to engage fully with the material, others expressed appreciation for reframing health compliance as an act of self-respect rather than obligation.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Compliance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session examining the link between psychological readiness and medical compliance. Clients discussed personal patterns of resistance to treatment, often rooted in past negative healthcare experiences or emotional avoidance. The therapist provided psychoeducation on how compliance is influenced by insight, emotional regulation, and perceived control. Clients were guided through an exercise identifying internal and external motivators for health management. While participation varied, some clients reported increased awareness of the emotional blocks affecting their adherence.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Compliance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session focused on identifying the cognitive and behavioral contributors to inconsistent health compliance. The discussion explored maladaptive beliefs such as "it won''t make a difference" or "I''ll deal with it later." The therapist challenged these distortions using Socratic questioning and encouraged clients to develop individualized action plans for medical follow-through. Clients were prompted to reflect on how health avoidance may correlate with underlying depressive symptoms. Several expressed increased openness to establishing accountability strategies.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Compliance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a health compliance group where clients were asked to track and review their recent engagement with medical recommendations. The therapist introduced a health behavior checklist and reinforced the use of self-monitoring tools. Clients discussed the role of impulsivity, executive dysfunction, and low frustration tolerance in missing appointments or mismanaging medications. The therapist guided the group in exploring methods of building consistency through structure, routine, and social support.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Compliance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist provided a structured group on the role of health compliance in long-term psychological stability and independence. Clients were invited to identify how untreated medical issues may exacerbate emotional dysregulation and impair functioning. The therapist emphasized that proactive health behavior can serve as a form of self-care and resilience-building. Clients responded with varying levels of insight, and the group collaboratively discussed strategies to overcome passive patterns of noncompliance, including the use of external prompts and community resources.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Compliance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in a cognitive-behavioral exploration of the internal dialogue that reinforces poor health compliance. Using a thought-recording technique, clients identified negative automatic thoughts related to health obligations and examined their accuracy and impact. The therapist introduced reframing techniques and highlighted the emotional benefits of following through on medical care. Clients were encouraged to commit to one compliance-related goal for the week, though some hesitated to fully engage, citing low motivation or fear of failure.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Compliance';

