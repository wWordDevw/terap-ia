-- =============================================
-- PÁRRAFOS PARA "HEALTH LIMITATIONS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session focused on the psychological impact of physical health limitations on autonomy and self-concept. Clients discussed how chronic or acute medical conditions interfere with daily functioning, goal attainment, and emotional regulation. The therapist introduced cognitive reframing techniques to help recontextualize perceived limitations. One client acknowledged frustration with dependency but did not identify any adaptive strategies, indicating ongoing difficulty accepting physical constraints.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Limitations';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group session exploring the emotional consequences of living with health-related restrictions. Clients processed feelings of grief, shame, and helplessness associated with the loss of previous abilities. The therapist guided a journaling activity designed to externalize internalized frustration. While some clients engaged in reflective writing, one client verbalized a sense of resignation and remained emotionally withdrawn throughout the session.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Limitations';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a discussion on adaptive functioning within the context of physical limitations. The group explored realistic modifications to routines, responsibilities, and roles to enhance quality of life despite medical constraints. Clients were encouraged to identify one area of their routine they could modify using supportive tools or assistance. One client observed but did not participate in planning or goal identification, reflecting no measurable progress toward adjustment.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Limitations';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured group exercise examining the relationship between perceived limitations and self-efficacy. Clients were prompted to evaluate how internal beliefs about their health influence their motivation and behavior. The therapist introduced motivational interviewing strategies to promote behavioral activation. Despite the structured format, one client struggled to verbalize any action steps, suggesting continued cognitive rigidity around their condition.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Limitations';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist provided psychoeducation on managing the emotional impact of fluctuating health conditions and their unpredictability. Clients were guided to develop personalized contingency plans for flare-ups and days of limited mobility or stamina. The therapist emphasized the value of self-compassion and flexibility in these plans. One client expressed feeling overwhelmed by the unpredictability of their condition and declined to create a plan, indicating no progress in developing proactive coping responses.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Limitations';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational group session centered on the importance of recognizing and adapting to individual health limitations without compromising psychological well-being. The group discussed how unrealistic expectations of physical performance can lead to discouragement and depressive symptoms. Clients were encouraged to practice self-monitoring and pacing. One client listened attentively but did not contribute to the discussion or identify any personal area for adjustment, suggesting no active engagement with the material.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Limitations';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group discussion examining how chronic health issues may impact identity and perceived worth. Clients explored the intersection between illness and self-esteem, particularly when physical limitations affect work, social interaction, or independence. The therapist introduced strategies for reconstructing self-worth beyond physical capacity. One client expressed difficulty separating their identity from their illness, indicating a need for continued therapeutic support and cognitive restructuring.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Limitations';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session on increasing self-advocacy in medical and daily contexts despite health limitations. Clients role-played scenarios involving setting boundaries, requesting accommodations, and expressing medical needs to others. The therapist emphasized assertive communication and self-empowerment. While several clients participated in the role-play, one remained passive and did not demonstrate use of any skills introduced, indicating no observable improvement in confidence or autonomy.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Limitations';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a reflective session on the emotional toll of fluctuating health and energy levels. Clients identified patterns of guilt, frustration, or self-criticism that emerge when physical symptoms prevent task completion. The therapist normalized emotional responses and encouraged self-kindness. Although the group engaged in identifying compassionate self-talk, one client reported difficulty believing alternative thoughts and showed no evidence of cognitive flexibility or emotional relief.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Limitations';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group focused on building routines that accommodate physical limitations while promoting a sense of purpose. Clients brainstormed meaningful activities that could be maintained even on low-functioning days. The therapist highlighted the role of structure in mood stabilization and self-efficacy. One client expressed uncertainty about what they were capable of and did not formulate any adapted routine, reflecting continued avoidance and difficulty redefining personal productivity.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Health Limitations';



