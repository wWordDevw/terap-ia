-- =============================================
-- PÁRRAFOS PARA "OUTCOMES OF COPING EFFORTS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured session on evaluating the effectiveness of coping strategies used in response to stress. Clients were encouraged to reflect on recent stress-inducing situations and assess the outcomes of their coping efforts—whether they were emotion-focused, problem-focused, or avoidant. The group processed how adaptive strategies foster resilience and long-term regulation, while maladaptive approaches often lead to emotional exhaustion or functional impairment.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Outcomes of Coping Efforts';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients through a reflective exercise analyzing the short- and long-term outcomes of different coping mechanisms. Clients explored how efforts such as distraction, substance use, rumination, or withdrawal may provide immediate relief but contribute to heightened stress over time. Therapist emphasized the importance of self-monitoring and feedback in refining one''s coping toolkit for sustainable emotional regulation.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Outcomes of Coping Efforts';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a cognitive-behavioral group session exploring the discrepancy between perceived and actual outcomes of coping efforts. Clients were invited to identify situations where their chosen strategy did not align with the intended emotional or behavioral goal. Through group dialogue, clients practiced evaluating effectiveness, adjusting expectations, and developing more congruent responses to internal and external stressors.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Outcomes of Coping Efforts';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an interactive group discussion focused on recognizing patterns in coping outcomes. Clients examined how specific coping efforts (e.g., assertive communication, seeking social support, practicing mindfulness) impacted their stress levels across multiple domains, including somatic symptoms, sleep, and interpersonal functioning. The therapist reinforced the role of intentional coping as a modifiable factor in emotional and psychological resilience.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Outcomes of Coping Efforts';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session examining how the efficacy of coping strategies can be influenced by contextual variables such as perceived control, emotional intensity, and support systems. Clients compared outcomes of previous coping attempts across varying environments and were encouraged to develop a personalized coping hierarchy based on observed effectiveness and feasibility. Therapist provided feedback on aligning coping choices with functional outcomes.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Outcomes of Coping Efforts';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a reflective group session focused on identifying the emotional and behavioral consequences of recent coping efforts. Clients explored how some strategies—such as avoidance, overthinking, or isolating—offered temporary relief but ultimately led to increased distress. The group discussed alternative, adaptive coping techniques and the therapist emphasized the importance of evaluating not only immediate relief but also long-term functional outcomes.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Outcomes of Coping Efforts';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a psychoeducational group session in which clients were invited to assess the patterns and results of their coping mechanisms in stressful scenarios. Using a strengths-based lens, clients identified which strategies led to reduced anxiety, improved interpersonal functioning, or emotional regulation. The therapist encouraged the reinforcement of adaptive patterns and the modification of ineffective approaches.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Outcomes of Coping Efforts';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a cognitive review activity where clients tracked the outcomes of their coping behaviors over the past week. The group identified which methods were effective in reducing emotional intensity and which led to escalation or stagnation. The therapist provided feedback on the importance of coping flexibility and encouraged ongoing experimentation with evidence-based strategies tailored to individual needs.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Outcomes of Coping Efforts';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a discussion on the connection between coping efforts and perceived control in stress management. Clients analyzed past experiences where they attempted to manage stress through action or reappraisal, reflecting on the psychological outcomes of those efforts. The therapist reinforced the idea that evaluating effectiveness is key to refining coping strategies and strengthening a sense of agency.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Outcomes of Coping Efforts';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group exploration of how clients measure the success or failure of their coping efforts. Through guided discussion, clients shared how emotional clarity, relationship outcomes, and physical symptoms serve as feedback on the utility of their coping choices. The therapist emphasized intentional self-reflection and the adoption of proactive tools to improve regulation, especially in high-stress situations.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Stress Management' AND sa.subactivity_name = 'Outcomes of Coping Efforts';



