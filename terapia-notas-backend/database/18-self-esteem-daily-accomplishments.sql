-- =============================================
-- PÁRRAFOS PARA "DAILY ACCOMPLISHMENTS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session focused on the cognitive-behavioral link between daily accomplishments and the development of internal self-worth. Clients explored how small, completed tasks contribute to a sense of competence and counteract feelings of inadequacy. The client listened attentively but did not share personal examples or commit to tracking accomplishments, suggesting low self-recognition and limited internal reinforcement.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Daily Accomplishments';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients in identifying overlooked daily achievements as a method to promote intrinsic motivation and build self-efficacy. The group discussed the tendency to dismiss routine efforts due to perfectionistic thinking. The client appeared reflective but struggled to name any recent accomplishment, indicating persistent cognitive distortions that minimize personal progress.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Daily Accomplishments';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a structured group session on developing self-esteem through recognition of attainable, daily goals. Emphasis was placed on the cumulative psychological benefits of consistency and task completion. Although the client acknowledged understanding the rationale, they refrained from participating in the journaling activity, showing ongoing difficulty internalizing personal progress.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Daily Accomplishments';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a strengths-based exercise where clients created lists of their micro-accomplishments from the previous 48 hours. The goal was to help shift focus from global deficits to specific efforts that reflect agency and resilience. The client demonstrated limited insight into their achievements and expressed self-critical beliefs, highlighting a cognitive barrier to internalizing positive self-appraisal.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Daily Accomplishments';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist encouraged the group to reframe mundane tasks, such as hygiene or making the bed, as valid markers of functioning and progress, particularly in the context of depressive symptoms. Clients explored how acknowledging these moments can buffer against negative self-concept. The client appeared withdrawn and declined to contribute, reflecting a lack of engagement in redefining self-worth through small, daily wins.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Daily Accomplishments';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group exercise aimed at helping clients track small tasks completed throughout the week, reinforcing the idea that consistency fosters self-confidence. The therapist introduced the concept of behavioral activation and its role in disrupting depressive cycles. The client verbalized skepticism about the significance of minor tasks, showing resistance to reframing progress and limited insight into self-worth indicators.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Daily Accomplishments';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a strengths-based intervention centered on identifying and affirming daily efforts often dismissed due to low self-regard. Clients were encouraged to write one positive action per day and explore the emotional outcome. The client reported difficulty with the assignment and expressed that most days feel "unproductive," demonstrating low behavioral activation and limited internal motivation.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Daily Accomplishments';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a cognitive-behavioral framework that links daily accomplishments to positive self-concept. Clients reflected on personal achievements often overshadowed by self-criticism. Despite group modeling, the client did not share or identify any concrete accomplishments, revealing ongoing difficulties with self-validation and entrenched patterns of negative self-talk.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Daily Accomplishments';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on cultivating self-worth through conscious acknowledgment of goal-directed behaviors. Emphasis was placed on the psychological value of recognizing completion, effort, and follow-through. Although the client appeared attentive, they avoided participation during the goal-sharing portion and expressed feelings of inadequacy, reflecting impaired self-evaluation and poor reinforcement of success.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Daily Accomplishments';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on cultivating self-worth through conscious acknowledgment of goal-directed behaviors. Emphasis was placed on the psychological value of recognizing completion, effort, and follow-through. Although the client appeared attentive, they avoided participation during the goal-sharing portion and expressed feelings of inadequacy, reflecting impaired self-evaluation and poor reinforcement of success.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Daily Accomplishments';

