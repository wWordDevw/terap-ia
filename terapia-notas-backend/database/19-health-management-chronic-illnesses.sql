-- =============================================
-- PÁRRAFOS PARA "CHRONIC ILLNESSES" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session focused on the psychological impact of living with chronic illnesses, including identity shifts, anticipatory grief, and long-term adjustment processes. Clients were guided to explore how persistent health conditions affect emotional regulation, motivation, and interpersonal functioning. Several participants identified maladaptive coping responses such as avoidance and irritability. One client verbalized difficulty accepting physical limitations and showed minimal engagement in exploring adaptive strategies for long-term adjustment.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Chronic Illnesses';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group session on the biopsychosocial model of chronic illness management, emphasizing the interplay between physical symptoms, emotional well-being, and social roles. Clients participated in identifying personal health-related challenges and barriers to treatment adherence. The therapist introduced pacing techniques and emotional acceptance as tools for managing fatigue and frustration. One client appeared withdrawn and did not share personal experiences or reflect on their current health behaviors.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Chronic Illnesses';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a structured discussion on the role of self-efficacy in the daily management of chronic conditions. Topics included medication adherence, energy conservation, and proactive communication with healthcare providers. Clients discussed internalized stigma and emotional responses such as shame and helplessness. Despite encouragement, one participant demonstrated cognitive rigidity and externalized blame, showing no observable movement toward behavioral accountability.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Chronic Illnesses';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a reflective group session examining how chronic illnesses can trigger depressive thought patterns and increased anxiety. Clients explored the emotional toll of unpredictability, lifestyle restrictions, and medical dependency. The therapist guided participants in identifying cognitive distortions and reframing beliefs to promote psychological resilience. One client remained passive and did not engage in cognitive restructuring exercises, reflecting limited insight into the emotional sequelae of chronic illness.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Chronic Illnesses';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group session on health behavior modification in the context of chronic illness. The discussion focused on the importance of consistency, routine adaptation, and stress reduction strategies to improve long-term outcomes. Clients were encouraged to set one specific health-related intention for the week. While some clients expressed readiness to initiate small changes, one individual dismissed the activity as irrelevant and did not identify a goal, suggesting resistance to proactive self-care integration.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Chronic Illnesses';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational group exploring the emotional and behavioral challenges commonly associated with chronic illness. Clients examined the psychological burden of managing ongoing symptoms and treatment plans. The therapist introduced stress-reduction techniques and encouraged the use of acceptance-based coping strategies. While some clients shared examples of resilience, one client verbalized feeling emotionally numb and unable to envision change, indicating no observable integration of coping tools.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Chronic Illnesses';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session focused on understanding the long-term psychological impact of chronic illness on identity and daily functioning. Clients reflected on how their conditions have altered roles, routines, and personal goals. The therapist facilitated group processing around grief and loss of prior functioning. One client verbalized frustration but struggled to name adaptive outlets for emotional processing, showing continued difficulty accepting their condition.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Chronic Illnesses';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group discussion addressing the importance of collaborative healthcare communication in managing chronic illness. Clients were guided through role-play scenarios designed to build confidence when advocating for needs with medical providers. Despite group participation, one client remained silent and did not engage in the skill-building exercise, reflecting ongoing avoidance of health-related assertiveness.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Chronic Illnesses';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured session highlighting the link between emotional dysregulation and symptom exacerbation in chronic illness. Clients were encouraged to track emotional patterns that precede physical flare-ups and identify internal triggers. Although the therapist provided guided examples, one client reported feeling overwhelmed and declined to complete the exercise, suggesting low engagement with self-monitoring strategies.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Chronic Illnesses';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a session on adaptive problem-solving skills related to chronic health conditions. The group explored barriers to medication adherence, follow-up care, and lifestyle adjustments. The therapist introduced action planning as a tool to break large health goals into smaller, achievable steps. One client expressed skepticism toward goal-setting, did not identify a health-related objective, and remained emotionally disengaged throughout the session.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Chronic Illnesses';



