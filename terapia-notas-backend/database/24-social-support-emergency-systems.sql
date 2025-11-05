-- =============================================
-- PÁRRAFOS PARA "USING EMERGENCY SYSTEMS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on the appropriate use of emergency systems in mental health crises. The group reviewed scenarios in which contacting 911, crisis hotlines, or mobile response teams is clinically indicated. Emphasis was placed on overcoming internalized stigma and recognizing when external support is necessary to ensure safety. Clients were encouraged to create a personalized crisis response plan.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Using Emergency Systems';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session focused on enhancing clients'' awareness of available emergency resources, including psychiatric walk-in centers, community stabilization units, and crisis text lines. Clients discussed personal barriers to seeking emergency assistance, such as fear of hospitalization or mistrust of responders. The therapist guided a discussion on risk vs. benefit and reinforced the importance of self-advocacy during acute emotional dysregulation.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Using Emergency Systems';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a skills group on identifying early warning signs of psychiatric decompensation and implementing the use of emergency systems accordingly. Clients were instructed on differentiating urgent versus non-urgent symptoms and the protocols for activating emergency contacts. A structured worksheet was used to map out individual safety networks and points of access for crisis intervention.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Using Emergency Systems';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist provided education on how to effectively engage with first responders during a mental health emergency. Clients learned how to clearly communicate symptoms, medications, and psychiatric history when contacting emergency personnel. The therapist introduced grounding techniques to assist clients in remaining composed during high-stress calls and emphasized the role of emergency systems in preventing harm.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Using Emergency Systems';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session that normalized the use of emergency systems as a responsible and proactive step in managing mental health. Clients explored past experiences with crisis services, identifying both positive and negative perceptions. The therapist guided clients through role-playing exercises to practice initiating emergency contact, including what to say and how to request help assertively.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Using Emergency Systems';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion on recognizing internal and external cues that indicate the need to utilize emergency services. Clients explored the emotional, behavioral, and physiological markers that precede crises. The therapist supported the development of individualized safety plans, encouraging the inclusion of specific contacts such as crisis hotlines, trusted supports, and emergency departments.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Using Emergency Systems';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided the group in identifying common misconceptions that prevent individuals from seeking emergency mental health support. Through cognitive restructuring techniques, clients examined irrational beliefs such as "I''m a burden if I ask for help." The therapist emphasized the life-saving role of emergency systems and encouraged clients to reframe help-seeking as a strength.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Using Emergency Systems';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group session on the functional role of emergency services in managing acute psychological distress. Clients were introduced to various crisis support resources and instructed on how to access them effectively. Case examples were provided to illustrate appropriate utilization, and clients shared personal experiences and hesitations related to emergency service use.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Using Emergency Systems';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session centered on empowering clients to take preemptive steps in moments of emotional escalation. Clients learned how to assess risk levels and when to bypass informal support in favor of immediate professional intervention. The therapist used visual tools and flowcharts to simplify decision-making during crisis situations.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Using Emergency Systems';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in a structured activity designed to map out their personal emergency response systems. Each participant identified key individuals, facilities, and phone numbers relevant to their support network. The therapist underscored the importance of accessibility and reviewed steps to follow if the primary plan fails, reinforcing the concept of layered crisis intervention strategies.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Using Emergency Systems';



