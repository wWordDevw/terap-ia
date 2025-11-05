-- =============================================
-- MIGRACIÓN: ACTIVIDAD GOAL SETTING (LUNES)
-- Terapia Nota System - PostgreSQL 16
-- =============================================

-- =============================================
-- 1. ACTIVIDAD PRINCIPAL: GOAL SETTING
-- =============================================

INSERT INTO activities (activity_name, description) VALUES
('Goal Setting', 'Setting and achieving realistic goals using SMART criteria to promote emotional recovery and motivation');

-- =============================================
-- 2. OBJETIVOS (SUBACTIVIDADES)
-- =============================================

INSERT INTO subactivities (activity_id, subactivity_name, description)
SELECT 
    activity_id,
    'Identifying Realistic Goals',
    'Helping clients identify realistic and achievable goals using SMART criteria'
FROM activities WHERE activity_name = 'Goal Setting'
UNION ALL
SELECT 
    activity_id,
    'Short/Long Term Goals',
    'Differentiating between short-term and long-term objectives'
FROM activities WHERE activity_name = 'Goal Setting'
UNION ALL
SELECT 
    activity_id,
    'Process Achieving',
    'Understanding the process of achieving goals'
FROM activities WHERE activity_name = 'Goal Setting'
UNION ALL
SELECT 
    activity_id,
    'Maintaining Balance',
    'Maintaining balance while pursuing goals'
FROM activities WHERE activity_name = 'Goal Setting';

-- =============================================
-- 3. PÁRRAFOS PARA "IDENTIFYING REALISTIC GOALS"
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on identifying realistic goals using the SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound). Clients were guided through an exercise where they brainstormed personal goals and discussed how unrealistic or vague goals can lead to frustration and decreased motivation. Clients were encouraged to reflect on recent experiences of setting goals and to identify one attainable goal they could work toward within the next week. Minimal participation was observed, with most clients struggling to articulate specific and achievable objectives.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Identifying Realistic Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the topic of setting realistic goals by discussing common obstacles, such as perfectionism, fear of failure, and lack of clarity. Clients engaged in a group discussion about previous attempts to achieve goals and the emotions associated with success and failure. Clients were encouraged to reframe setbacks as learning opportunities. Although several clients listened attentively, few were able to verbalize a realistic goal by the end of the session, indicating minimal progress in applying the skills discussed.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Identifying Realistic Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an interactive activity where clients created a list of short-term and long-term goals, followed by a group exercise evaluating which goals were realistic and which needed modification. The importance of breaking larger goals into smaller, manageable steps was emphasized. While clients were able to generate ideas, many had difficulty narrowing their goals into specific, actionable steps, and required significant prompting. The level of independent goal-setting progress was minimal.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Identifying Realistic Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist used role-playing exercises to demonstrate the difference between unrealistic and realistic goal setting. Clients practiced adjusting exaggerated goals to more achievable ones and discussed the emotional benefits of setting attainable milestones. Despite therapist support and encouragement, the majority of clients remained hesitant and expressed pessimism about the utility of goal-setting in their current circumstances. Minimal progress was observed in their ability to independently formulate realistic goals.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Identifying Realistic Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session focused on helping clients differentiate between aspirational desires and realistic, achievable goals. Clients were guided through a discussion on setting specific, measurable, attainable, relevant, and time-bound (SMART) goals to promote emotional recovery and motivation. The therapist introduced strategies for overcoming procrastination and perfectionism. Clients were invited to reflect on one short-term goal they could begin working toward within the next week.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Identifying Realistic Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the exercise of creating a personal action plan based on realistic short- and long-term goals. Clients explored barriers such as fear of failure, self-doubt, and lack of structure that interfere with goal attainment. Through group discussion and therapist modeling, participants were encouraged to reframe setbacks as learning opportunities and to commit to taking one small step toward a meaningful goal by the next session.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Identifying Realistic Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session emphasizing the importance of setting realistic goals aligned with personal values and current life circumstances. The group explored the emotional benefits of goal achievement, such as enhanced self-esteem and hopefulness. Clients participated in identifying one long-term aspiration and breaking it down into manageable, actionable short-term steps. The therapist reinforced that consistency and flexibility are key components of success.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Identifying Realistic Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a goal-setting workshop where clients reviewed examples of unrealistic versus realistic objectives. Clients engaged in exercises to identify one specific, measurable goal they could reasonably accomplish within a two-week period. Barriers such as avoidance and perfectionistic thinking were addressed. Therapist encouraged clients to share their goals with the group for accountability and support, highlighting how small successes can build momentum for emotional recovery.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Identifying Realistic Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on how setting realistic and achievable goals can provide structure and a sense of purpose during recovery. Clients were encouraged to focus on short-term objectives that support long-term aspirations. The therapist highlighted the importance of self-compassion when encountering setbacks and guided clients to select one attainable goal to focus on during the upcoming week.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Identifying Realistic Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a structured goal-setting activity designed to help clients improve emotional resilience. Clients discussed personal experiences with unrealistic goals leading to feelings of failure or discouragement. The therapist emphasized breaking large goals into smaller, actionable steps and celebrated small achievements as critical markers of progress. Clients practiced identifying one goal that was personally meaningful and realistically attainable within the next month.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Identifying Realistic Goals';

-- =============================================
-- 4. PÁRRAFOS PARA "SHORT/LONG TERM GOALS"
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session focused on helping clients differentiate between short- and long-term goals. Clients discussed how setting small, achievable goals can improve motivation and provide a roadmap for broader life changes. The therapist encouraged clients to identify at least one immediate goal to work toward during the upcoming week, linking it to a larger long-term aspiration.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Short/Long Term Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session aimed at enhancing clients'' ability to differentiate between short-term and long-term goals. Emphasis was placed on the role of goal-setting in fostering a sense of agency and promoting self-efficacy. Clients explored common cognitive barriers, such as fear of failure and procrastination, and practiced articulating SMART (Specific, Measurable, Achievable, Relevant, Time-bound) goals to strengthen motivation and emotional regulation.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Short/Long Term Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted an interactive group activity focused on developing adaptive goal-setting strategies to support affect regulation and behavioral activation. Clients were guided to identify short-term objectives that align with broader long-term aspirations, recognizing how incremental progress can mitigate depressive cognitions and learned helplessness. Therapist provided psychoeducation on the relationship between goal achievement and dopamine reward pathways.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Short/Long Term Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of structured goal planning to address executive functioning deficits commonly exacerbated by mood disturbances. Through guided discussion, clients examined how unrealistic expectations and cognitive distortions can interfere with sustained goal pursuit. Clients were encouraged to set attainable short-term goals to reinforce mastery experiences, a critical component in combating anhedonia and low self-esteem.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Short/Long Term Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session emphasizing the therapeutic benefit of realistic goal-setting as a means of cognitive restructuring and behavioral activation. Clients engaged in exercises to differentiate between aspirational versus attainable goals, with focus placed on identifying barriers rooted in negative core beliefs. The therapist provided modeling and reinforcement for setting goals that promote incremental success and psychological resilience.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Short/Long Term Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a cognitive-behavioral intervention aimed at enhancing clients'' capacity to formulate realistic short- and long-term goals. Clients explored how goal-directed behavior serves as a protective factor against depressive relapse by promoting a sense of competence and future orientation. Clients practiced setting achievable milestones, linking each to adaptive coping mechanisms.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Short/Long Term Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group session emphasizing how structured goal-setting can counteract cognitive patterns of hopelessness and defeatism. Clients identified barriers such as self-sabotage and avoidance, and collaboratively reframed these challenges into actionable, time-sensitive objectives. The therapist reinforced the value of incremental success in building psychological resilience and behavioral activation.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Short/Long Term Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist provided psychoeducation on the significance of differentiating immediate objectives from long-term aspirations to manage emotional dysregulation and enhance executive functioning. Clients engaged in reflective exercises that emphasized self-monitoring, prioritization, and emotional awareness when pursuing goals. Therapist highlighted how sustained engagement in purposeful activity mitigates depressive symptomatology.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Short/Long Term Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a strengths-based activity focused on helping clients identify personal values and translate them into realistic, structured goals. Clients examined the psychological impact of unattainable expectations and practiced adjusting goals to promote self-efficacy and intrinsic motivation. Therapist emphasized the importance of flexibility and cognitive reframing in maintaining momentum toward long-term recovery.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Short/Long Term Goals';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients through a behavioral activation framework, linking goal-setting to improvements in mood and functioning. Clients practiced breaking down complex long-term goals into concrete, manageable steps to prevent cognitive overload and discouragement. Discussion included how maladaptive schemas related to failure and worthlessness can interfere with goal pursuit and how cognitive restructuring can support sustained effort.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Short/Long Term Goals';

-- =============================================
-- 5. PÁRRAFOS PARA "PROCESS ACHIEVING"
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on the importance of focusing on the *process* rather than solely the *outcome* when setting and pursuing goals. Clients explored how process-oriented thinking enhances perseverance, intrinsic motivation, and psychological flexibility. Therapist introduced self-monitoring techniques and reinforced the concept that consistent effort toward valued goals mitigates depressive and anxious symptomatology.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Process Achieving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in cognitive restructuring exercises aimed at shifting maladaptive perfectionistic beliefs toward a process-centered framework. Clients practiced identifying specific behavioral steps necessary for goal achievement and discussed how reinforcing progress, rather than fixating on results, promotes emotional resilience and reduces self-critical thought patterns.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Process Achieving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group activity emphasizing *task persistence* and *behavioral activation* strategies within goal attainment. Clients were encouraged to recognize small, incremental successes and use positive self-reinforcement. Therapist highlighted how process-oriented focus decreases learned helplessness and strengthens adaptive coping mechanisms, improving overall emotional regulation.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Process Achieving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of process-focused goal setting as a tool to build *self-efficacy* and counteract cognitive distortions related to failure and inadequacy. Clients participated in a reflective exercise identifying the emotional benefits of consistent effort, even when immediate success is not evident. Therapist emphasized how embracing the process enhances autonomy and psychological endurance.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Process Achieving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients in understanding how focusing on daily, purposeful actions associated with long-term goals supports emotional stability and reduces avoidance behaviors. Clients identified recent situations where rigid outcome dependency exacerbated distress. Therapist promoted the use of mindfulness-based approaches to stay engaged in the process, strengthening present-moment awareness and emotional tolerance.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Process Achieving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational group focused on enhancing *goal-directed behavior* by emphasizing the value of the process over the outcome. Clients explored how sustained engagement in purposeful actions fosters *behavioral activation* and counters the cognitive patterns associated with hopelessness. The session highlighted how minor achievements accumulate toward broader personal growth.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Process Achieving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients in distinguishing between *process-focused* and *outcome-focused* thinking. Clients discussed how excessive preoccupation with end results can trigger *cognitive distortions* such as catastrophizing or all-or-nothing thinking. Therapist emphasized process engagement as a protective factor against depressive relapse and encouraged self-monitoring of emotional responses during goal pursuit.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Process Achieving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a cognitive-behavioral framework for setting *process-oriented goals*, reinforcing that measurable, incremental progress enhances *self-efficacy* and emotional regulation. Clients participated in exercises identifying current goals and reframing them into actionable steps, promoting a shift from outcome dependency toward resilience-based motivation.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Process Achieving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist discussed the relationship between process engagement and *intrinsic motivation*, highlighting research that supports the link between consistent effort and improved mood regulation. Clients were encouraged to track behavioral activation patterns rather than solely outcome attainment, reinforcing the therapeutic goal of stabilizing mood through structured, meaningful activities.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Process Achieving';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on dismantling *avoidant coping strategies* by focusing on short, attainable process steps linked to broader value-based goals. Clients reflected on past experiences where avoidance perpetuated depressive symptoms and brainstormed strategies to maintain engagement with tasks despite emotional discomfort. Therapist emphasized the role of *psychological flexibility* in adaptive goal striving.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Process Achieving';

-- =============================================
-- 6. PÁRRAFOS PARA "MAINTAINING BALANCE"
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on the role of *homeostasis* in emotional and behavioral regulation. Clients discussed how maintaining a balance between personal, social, and occupational domains supports *affective stability* and reduces vulnerability to mood dysregulation. Clients were encouraged to identify strategies for sustaining equilibrium during periods of stress.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Maintaining Balance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of *emotional self-regulation* and its critical role in maintaining balance across various life areas. Clients explored how setting flexible yet structured goals can protect against *cognitive distortions* such as perfectionism or catastrophizing, both of which exacerbate depressive symptoms. The group practiced reframing rigid goal expectations into adaptive, process-focused alternatives.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Maintaining Balance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist emphasized the importance of *behavioral activation* while maintaining realistic limits to avoid emotional burnout. Clients reflected on how overcommitment can lead to emotional exhaustion and were guided through setting achievable, value-congruent goals that promote *psychological resilience* and long-term mood stabilization.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Maintaining Balance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion on *self-monitoring techniques* to maintain balance between achievement and self-care. Clients identified personal warning signs of imbalance, such as irritability, sleep disturbances, or withdrawal, and developed individualized coping plans incorporating mindfulness, scheduling, and assertive communication strategies to prevent emotional decompensation.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Maintaining Balance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a cognitive-behavioral approach to maintaining life balance, focusing on the relationship between *cognitive schemas* (e.g., "I must be productive at all times") and the erosion of emotional well-being. Clients worked on restructuring maladaptive beliefs and integrating *adaptive coping mechanisms* to sustain engagement in balanced, fulfilling routines.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Maintaining Balance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a cognitive-behavioral intervention emphasizing the identification of *early warning signs* of imbalance in daily routines. Clients were guided to recognize behavioral patterns that disrupt emotional regulation, such as overcommitment or neglect of self-care activities. The group practiced setting incremental, attainable goals that reinforce *emotional homeostasis*.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Maintaining Balance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the importance of maintaining balance between *approach behaviors* (goal-directed actions) and *avoidance behaviors* (self-protective mechanisms). Clients explored how disproportionate focus on one domain (e.g., work) can exacerbate depressive symptoms, and developed individualized strategies to promote *adaptive functioning* across multiple life areas.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Maintaining Balance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist discussed how chronic stress and emotional dysregulation compromise the maintenance of a balanced lifestyle. Clients engaged in a self-assessment exercise to evaluate their current coping resources and set realistic goals to strengthen *psychosocial resilience* and reduce susceptibility to *emotional exhaustion*.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Maintaining Balance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients in exploring the interplay between *self-efficacy* and maintaining balance in daily activities. Through structured group dialogue, clients examined how building small, consistent successes in goal-setting can enhance perceived competence, counteract learned helplessness, and foster sustained *emotional regulation*.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Maintaining Balance';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session focusing on *behavioral flexibility* as a protective factor in maintaining emotional balance. Clients identified rigid thinking patterns (e.g., all-or-nothing beliefs) that interfere with adaptive goal pursuit and practiced reframing these patterns into flexible, growth-oriented perspectives to support *functional emotional stability*.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Goal Setting' AND sa.subactivity_name = 'Maintaining Balance';

-- =============================================
-- VERIFICACIÓN
-- =============================================

-- Verificar que la actividad se creó correctamente
SELECT 'Actividad creada:' as status, activity_name, description 
FROM activities WHERE activity_name = 'Goal Setting';

-- Verificar que se crearon los 4 objetivos
SELECT 'Objetivos creados:' as status, COUNT(*) as total 
FROM subactivities sa 
JOIN activities a ON sa.activity_id = a.activity_id 
WHERE a.activity_name = 'Goal Setting';

-- Verificar que se crearon los 40 párrafos
SELECT 'Párrafos creados:' as status, COUNT(*) as total 
FROM activity_paragraphs ap 
JOIN activities a ON ap.activity_id = a.activity_id 
WHERE a.activity_name = 'Goal Setting';

-- Mostrar resumen por objetivo
SELECT 
    sa.subactivity_name as objetivo,
    COUNT(ap.paragraph_id) as total_parrafos
FROM subactivities sa 
JOIN activities a ON sa.activity_id = a.activity_id 
LEFT JOIN activity_paragraphs ap ON sa.subactivity_id = ap.subactivity_id
WHERE a.activity_name = 'Goal Setting'
GROUP BY sa.subactivity_name, sa.subactivity_id
ORDER BY sa.subactivity_name;
