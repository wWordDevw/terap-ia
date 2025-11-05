-- =============================================
-- PÁRRAFOS PARA "POSSIBLE SOLUTION" (20 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session centered on the exploration of possible solutions as a critical phase of the structured problem-solving model. Clients were encouraged to generate a variety of alternatives without immediate judgment, fostering cognitive flexibility and creative thinking. The therapist emphasized the importance of brainstorming as a strategy to overcome cognitive rigidity often associated with depressive and anxious symptomatology.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a problem-solving framework with a focus on expanding the client''s repertoire of adaptive responses. Clients worked in small groups to develop multiple solutions to hypothetical interpersonal dilemmas. The therapist highlighted how the ability to generate diverse options increases a sense of agency and reduces the likelihood of impulsive or avoidant behaviors when under emotional distress.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session in which clients identified a current problem and then engaged in a guided activity to explore at least three potential solutions. Emphasis was placed on evaluating the feasibility, risks, and emotional implications of each option. The therapist reinforced the value of solution-focused thinking in disrupting maladaptive behavioral cycles and promoting goal-directed action.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an experiential exercise aimed at helping clients shift from problem-saturated narratives toward proactive planning. Clients were supported in reframing challenges into solvable scenarios and were guided through the process of identifying potential steps toward resolution. Therapist provided psychoeducation on how emotional reasoning can obstruct effective problem-solving and encouraged evidence-based decision making.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients through a cognitive-behavioral process of examining possible solutions to personal stressors. Clients practiced distinguishing between short-term relief strategies and sustainable long-term resolutions. The therapist modeled balanced problem analysis and promoted collaborative dialogue to help clients practice assertive communication when implementing chosen solutions.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured group discussion focused on the identification and evaluation of possible solutions to self-identified problems. Clients were encouraged to approach issues from multiple perspectives, enhancing problem-solving efficacy and emotional regulation. The therapist emphasized the importance of considering both internal and external resources when formulating action plans.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged the group in a cognitive-behavioral task designed to generate and assess alternative solutions to emotionally charged situations. Clients learned to distinguish between reactive and reflective decision-making processes, and discussed how exploring various options can reduce perceived helplessness and promote adaptive functioning.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist presented a scenario-based exercise where clients collaboratively identified possible responses to common interpersonal stressors. The group processed how personal values, prior experiences, and emotional states can influence solution selection. Therapist reinforced the importance of selecting responses aligned with long-term well-being rather than immediate emotional relief.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a problem-solving workshop that involved role-play and peer feedback to explore alternative strategies to current challenges. Clients were supported in identifying at least two viable solutions to a real-life concern and discussed barriers to implementation. Therapist highlighted the therapeutic value of practicing mental flexibility in distress tolerance.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a solution-focused intervention aimed at enhancing clients'' confidence in navigating daily challenges. Clients explored the difference between passive avoidance and active coping, and were encouraged to commit to testing at least one adaptive strategy. The therapist provided validation and modeled realistic thinking throughout the session to support cognitive restructuring.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group intervention on generating possible solutions to identified problems. Clients were encouraged to brainstorm adaptive responses without immediate judgment or self-criticism. The therapist highlighted the importance of divergent thinking and cognitive flexibility, emphasizing that a wider range of options increases the likelihood of effective problem resolution.',
    11
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients in exploring alternative strategies for managing current stressors. The discussion focused on the role of creativity and cognitive reframing in solution generation. Clients practiced identifying both short-term and long-term approaches, while the therapist reinforced the value of evaluating feasibility before implementation.',
    12
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a structured session in which clients engaged in collaborative problem-solving exercises. Participants examined the benefits and limitations of potential solutions, learning to weigh risks and rewards. The therapist modeled decision-making processes grounded in rational-emotive principles, supporting clients in enhancing their coping repertoire.',
    13
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced techniques for expanding possible solutions beyond habitual or automatic responses. Clients reflected on past tendencies toward rigid thinking and practiced generating alternatives using guided prompts. The therapist validated individual contributions and emphasized the role of adaptability in promoting resilience and self-efficacy.',
    14
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group activity focused on solution-focused thinking. Clients were encouraged to shift attention from barriers to possibilities, formulating realistic action steps aligned with personal values and goals. The therapist underscored the therapeutic value of practicing proactive strategies, linking the exercise to improved emotional regulation and functional outcomes.',
    15
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group exercise centered on the development of possible solutions once a problem was clearly defined. Clients were guided to generate multiple alternatives through brainstorming, with an emphasis on suspending premature judgment. The therapist reinforced the cognitive-behavioral principle that expanding options enhances autonomy and reduces reliance on maladaptive coping.',
    16
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session designed to increase clients'' ability to formulate potential solutions for everyday stressors. Participants practiced weighing the pros and cons of each alternative, focusing on both short-term relief and long-term outcomes. The therapist highlighted the relevance of evaluating feasibility and aligning responses with personal values to strengthen decision-making capacity.',
    17
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients through structured problem-solving steps that involved exploring various possible solutions without attachment to a single outcome. Clients reflected on barriers to creativity, such as rigid thinking or avoidance. The therapist modeled cognitive flexibility and encouraged adaptive experimentation, linking this process to improved problem management and resilience.',
    18
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged the group in generating solution pathways by using scenario-based practice. Clients were encouraged to propose both conventional and innovative responses, then assess their potential impact. The therapist emphasized the therapeutic benefit of shifting focus from obstacles to opportunities, cultivating a proactive stance toward stress regulation.',
    19
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on possible solutions to interpersonal and intrapersonal conflicts. Clients identified realistic strategies, including assertive communication, time management, and use of social supports. The therapist validated these contributions and reinforced the importance of translating abstract ideas into concrete action steps that can be monitored for effectiveness.',
    20
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Possible Solution';



