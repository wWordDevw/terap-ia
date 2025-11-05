-- =============================================
-- PÁRRAFOS PARA "DECISION MAKING" (20 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured cognitive-behavioral session focused on the role of decision-making in effective problem resolution. Clients were introduced to a stepwise framework that included identifying the issue, listing possible options, anticipating outcomes, and selecting the most adaptive response. The therapist encouraged clients to reflect on recent impulsive decisions and guided them through reconstructing those scenarios using the model.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session aimed at enhancing executive functioning through improved decision-making skills. Emphasis was placed on the intersection between emotional dysregulation and poor decision outcomes. Clients participated in a guided activity that highlighted the importance of pausing, evaluating alternatives, and utilizing logical reasoning before acting on emotionally charged situations.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session emphasizing the cognitive distortions that interfere with rational decision-making, such as catastrophizing and all-or-nothing thinking. Clients were encouraged to identify how these distortions have impacted past choices and to apply reframing techniques to more accurately assess risk and consequence. The therapist reinforced the value of delayed responses in emotionally complex scenarios.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced an evidence-based decision-making model grounded in solution-focused therapy. Clients examined personal dilemmas and were supported in generating multiple potential actions, assessing pros and cons, and forecasting emotional and functional outcomes. The therapist modeled reflective questioning to facilitate insight and intentionality in the decision-making process.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group process wherein clients explored the influence of interpersonal dynamics on decision-making. The session focused on identifying patterns of acquiescence, avoidance, or excessive control within relationships. Through discussion and role-play, clients practiced asserting preferences and making decisions that align with their personal values and treatment goals.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session exploring the connection between indecision and underlying anxiety symptoms. Clients were encouraged to identify recent situations where avoidance of decision-making increased distress. The therapist introduced grounding strategies and a rational choice model to help clients feel more empowered when facing everyday decisions.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a cognitive-behavioral group focused on enhancing problem-solving abilities through structured decision-making. Clients engaged in an exercise where they identified a recent conflict, analyzed it objectively, and generated at least two viable solutions. The therapist emphasized the importance of self-reflection, outcome forecasting, and behavioral activation in the decision-making process.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led an interactive discussion on barriers to effective decision-making, such as fear of failure, perfectionism, and impulsivity. Clients were guided to recognize how these factors impact their problem-solving skills and were encouraged to use a pros-and-cons matrix to support more adaptive choices. The session promoted emotional insight and cognitive flexibility.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of values-based decision-making as a tool for increasing congruence between actions and long-term goals. Clients were invited to clarify core personal values and assess how their recent decisions align with these principles. The therapist provided individualized feedback to reinforce autonomy and self-efficacy in problem-solving.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a solution-focused group session emphasizing the use of past successes to inform future decisions. Clients reflected on previous effective problem-solving experiences and extracted strategies that could be generalized to current stressors. The therapist reinforced the idea that structured decision-making is a skill that improves with practice and self-awareness.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on decision-making as the final step in structured problem-solving. Clients were guided to analyze previously generated solutions and select the most adaptive choice based on feasibility, long-term benefit, and alignment with personal goals. The therapist highlighted how intentional decision-making strengthens self-efficacy and decreases impulsive behavior.',
    11
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted an intervention emphasizing the cognitive processes underlying effective decision-making. Clients practiced comparing alternatives through cost-benefit analysis and discussed how emotional regulation plays a role in evaluating outcomes. The therapist reinforced the use of rational evaluation strategies to reduce avoidance and enhance accountability.',
    12
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients in applying executive functioning skills to decision-making tasks. The session emphasized prioritization, risk assessment, and the impact of values on final choices. The therapist modeled the use of reflective questioning, encouraging clients to slow down their cognitive process to prevent reactive or maladaptive responses.',
    13
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged the group in scenario-based decision-making exercises to strengthen problem-solving abilities. Clients practiced selecting a course of action from multiple possible solutions while considering both short-term relief and long-term consequences. The therapist validated their reasoning and emphasized the importance of adaptive decision-making for resilience and behavioral activation.',
    14
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion focused on barriers to effective decision-making, such as cognitive distortions, fear of failure, or overgeneralization. Clients explored strategies for overcoming these obstacles by applying structured frameworks. The therapist underscored the therapeutic value of cultivating decisional confidence, linking this process to improved problem-solving competence and affect regulation.',
    15
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured group session on decision-making, guiding clients to recognize the cognitive steps involved in moving from identifying a problem to selecting an adaptive solution. The discussion emphasized the importance of weighing potential risks and benefits, promoting the use of reflective reasoning to support healthier behavioral outcomes.',
    16
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in exercises designed to strengthen decisional capacity by practicing prioritization of options. Participants examined how impulsivity or emotional bias can interfere with judgment. The therapist reinforced the application of rational analysis and problem-solving frameworks to enhance executive functioning and self-regulation.',
    17
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session in which clients practiced evaluating multiple possible solutions through comparative analysis. Emphasis was placed on distinguishing between short-term gratification and long-term effectiveness. The therapist modeled the use of critical thinking strategies and validated client progress toward more deliberate decision-making.',
    18
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients in scenario-based activities where they were asked to make decisions under simulated stress. Clients explored how anxiety or avoidance can hinder the decision-making process. The therapist highlighted strategies such as cognitive reframing and mindfulness to improve tolerance for uncertainty and strengthen adaptive choices.',
    19
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on the psychological barriers that affect decision-making, including fear of error, overgeneralization, and indecisiveness. Clients were encouraged to verbalize strategies for overcoming these barriers. The therapist emphasized the therapeutic value of decisional confidence and its role in reinforcing problem-solving competence and emotional stability.',
    20
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Problem Solving' AND sa.subactivity_name = 'Decision Making';



