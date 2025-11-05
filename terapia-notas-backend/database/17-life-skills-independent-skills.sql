-- =============================================
-- PÁRRAFOS PARA "INDEPENDENT SKILLS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on the development of independent living skills necessary for functional autonomy. Clients explored the psychological barriers to independence, such as learned helplessness, low self-efficacy, and fear of failure. The group discussed practical strategies for improving task initiation, self-management, and follow-through with daily responsibilities.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Independent Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a skills-building group focused on fostering client autonomy through the practice of independent living tasks. Clients identified areas in which they experience dependence, such as time management, financial decision-making, or personal hygiene. The therapist reinforced the connection between independent functioning and increased self-esteem, and guided clients in setting individualized behavioral goals.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Independent Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of independent functioning within the context of psychosocial recovery. Clients engaged in a reflective discussion on how past experiences, familial roles, and cognitive distortions may impact their ability to live independently. The therapist supported clients in creating a stepwise plan to increase responsibility in areas such as meal preparation, medication adherence, and transportation.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Independent Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session centered on the emotional regulation necessary to sustain independent behaviors. Clients explored how anxiety, depression, and executive dysfunction can interfere with consistency in daily routines. Through guided role-play and structured worksheets, clients practiced problem-solving common challenges to independence and shared adaptive coping strategies.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Independent Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group intervention targeting the reinforcement of adaptive routines that support independent functioning. Clients examined how structure, planning, and environmental cues can facilitate greater self-sufficiency. The therapist emphasized the role of accountability and incremental change, and encouraged clients to track one independent task per day to promote mastery and motivation.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Independent Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session emphasizing the importance of developing independent life skills as a component of psychological stability and personal empowerment. Clients discussed the impact of dependency on self-concept and autonomy. The therapist introduced the use of behavioral activation techniques to increase engagement in routine independent tasks and minimize avoidance behaviors.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Independent Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session focused on enhancing functional independence through the practice of daily living skills. The group identified specific barriers—such as cognitive disorganization, low motivation, and reliance on others—that interfere with autonomy. Clients were encouraged to develop short-term behavioral goals aimed at strengthening self-regulation and task completion.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Independent Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist provided psychoeducation on how the acquisition and reinforcement of independent living skills contribute to a sense of competence and resilience. Clients reflected on past successes and setbacks related to independence and examined how internalized beliefs may limit their perceived capabilities. Cognitive restructuring techniques were introduced to challenge self-defeating thoughts.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Independent Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group session addressing the connection between independent functioning and mental health recovery. Clients explored how routine-building, problem-solving, and prioritization of responsibilities can improve their overall functioning. The therapist encouraged clients to create a personalized checklist of independent tasks to implement and review weekly.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Independent Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured discussion around the psychological readiness for independent living. Clients explored how emotional dysregulation, lack of confidence, or poor planning skills can compromise progress. The therapist modeled planning and scheduling strategies, and clients were guided in identifying one independent task they could begin to execute consistently over the next week.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Independent Skills';

