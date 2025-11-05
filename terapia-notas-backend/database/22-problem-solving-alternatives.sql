-- =============================================
-- PÁRRAFOS PARA "GENERATING ALTERNATIVES" (20 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured group session on generating alternatives within the problem-solving process. The therapist highlighted how cognitive rigidity and emotional overwhelm often limit clients'' ability to perceive multiple solutions. Through guided brainstorming and scenario-based exercises, clients practiced cognitive flexibility and were encouraged to list at least three possible responses to a current personal challenge.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skills-building session focused on expanding clients'' capacity to generate multiple alternatives in response to everyday problems. Emphasis was placed on the role of divergent thinking in adaptive functioning. Clients were supported in identifying automatic negative thoughts that inhibit solution-focused thinking and engaged in collaborative group discussions to explore alternative approaches.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the importance of generating alternatives as a critical component of effective problem-solving. Clients were encouraged to move beyond binary thinking and explore nuanced responses to interpersonal and intrapersonal challenges. Using a values-based decision-making worksheet, the group explored the emotional and practical implications of each alternative identified.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session exploring how impulsivity and emotional reactivity can impair the ability to generate adaptive solutions. The therapist utilized role-playing scenarios to help clients pause and explore at least three viable options before acting. The group processed how developing this skill enhances autonomy and reduces patterns of avoidance or escalation.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a cognitive-behavioral exercise focused on brainstorming diverse alternatives when confronted with stressors. Clients explored how limiting beliefs and past conditioning may interfere with creative problem-solving. The therapist reinforced the utility of open-ended questioning and curiosity as tools for broadening perspective and reducing the likelihood of maladaptive coping.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session aimed at enhancing clients'' problem-solving repertoire through the generation of alternative strategies. The group explored how emotional distress often narrows thinking, leading to impulsive or avoidant behaviors. Clients were guided through a cognitive restructuring task, identifying at least three new behavioral or cognitive responses to a past unresolved issue.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group intervention focused on cultivating flexible thinking through the generation of multiple alternatives in challenging situations. Clients engaged in a structured worksheet that prompted analysis of situational triggers, perceived barriers, and potential actions. The therapist emphasized that generating diverse responses increases resilience and supports emotion regulation.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted an experiential session where clients were encouraged to apply lateral thinking strategies to generate alternatives to current difficulties. The session focused on reducing cognitive distortions such as catastrophizing and all-or-nothing thinking. Group discussion included feedback on the feasibility and consequences of the alternatives proposed.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist provided psychoeducation on the role of problem-solving flexibility in mental health recovery. Clients were prompted to consider how automatic reactions may limit their ability to evaluate different courses of action. Through group brainstorming and peer input, each participant developed a list of potential alternatives to an identified personal stressor.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of "solution generation" as a foundational component of effective coping. The therapist modeled how to shift from reactive to proactive thinking by illustrating how one challenge could yield several adaptive solutions. Clients practiced this process using guided prompts, focusing on internal and external resources available to them.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session focused on generating alternatives as a critical step in problem-solving. Clients were encouraged to practice divergent thinking, allowing multiple potential strategies to emerge without immediate evaluation. The therapist emphasized that expanding the range of options increases flexibility and reduces reliance on rigid or maladaptive coping patterns.',
    11
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients in brainstorming exercises to strengthen their capacity for generating alternatives. Participants were reminded of the importance of suspending judgment while considering creative or unconventional solutions. The therapist validated client efforts and highlighted how an expanded repertoire of responses supports resilience and adaptive functioning.',
    12
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted an intervention in which clients explored barriers to generating alternatives, such as cognitive rigidity and negative self-talk. Through guided prompts, participants practiced reframing challenges and identifying multiple pathways forward. The therapist reinforced the therapeutic value of maintaining openness and curiosity when confronted with obstacles.',
    13
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged the group in scenario-based practice where clients collaboratively generated alternative solutions to common stressors. The session underscored the role of collaboration, creativity, and critical thinking in strengthening problem-solving skills. The therapist modeled flexibility and encouraged the evaluation of both practical and innovative options.',
    14
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion highlighting the relationship between generating alternatives and emotional regulation. Clients reflected on how narrowing focus to one rigid solution can heighten anxiety or hopelessness. The therapist introduced techniques such as cognitive mapping and role-play to promote the discovery of diverse and realistic alternatives.',
    15
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on generating alternatives, guiding clients to expand their problem-solving repertoire beyond habitual responses. The discussion emphasized the role of divergent thinking, encouraging participants to brainstorm multiple strategies before narrowing down to one. The therapist highlighted that cultivating flexibility in generating options enhances resilience and decreases cognitive rigidity.',
    16
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in structured exercises designed to promote the generation of alternatives when addressing personal or interpersonal stressors. Participants practiced suspending judgment while producing a range of possibilities. The therapist underscored the therapeutic value of broadening perspective, as it increases adaptive coping and reduces reliance on avoidance behaviors.',
    17
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session focused on overcoming barriers that limit the ability to generate alternatives, such as negative automatic thoughts and overgeneralization. Clients were encouraged to reframe challenges through guided prompts and identify at least three potential courses of action. The therapist validated their efforts and emphasized the link between creativity and problem-solving efficacy.',
    18
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided the group through scenario-based practice to strengthen skills in generating alternatives. Clients collaborated to propose both conventional and innovative strategies for managing stressors, discussing the potential impact of each. The therapist reinforced how practicing open-mindedness in solution generation fosters emotional regulation and decisional confidence.',
    19
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion on the importance of generating alternatives as a means to prevent impulsive or maladaptive decision-making. Clients reflected on past experiences where limited options led to ineffective outcomes. The therapist modeled brainstorming techniques and encouraged participants to integrate cognitive flexibility into their daily coping strategies.',
    20
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Generating Alternatives';



