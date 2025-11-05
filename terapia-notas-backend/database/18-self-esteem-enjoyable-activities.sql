-- =============================================
-- PÁRRAFOS PARA "PRACTICING ENJOYABLE ACTIVITIES" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session exploring the therapeutic value of engaging in pleasurable activities as a means of strengthening internal self-worth. Clients reflected on how reduced engagement in enjoyable experiences contributes to anhedonia and self-neglect. The client demonstrated difficulty identifying any current interests or hobbies and remained passive during the group discussion, indicating limited activation of behavioral reinforcement strategies.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practicing Enjoyable Activities';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a cognitive-behavioral session focused on how participation in leisure activities can counteract cognitive distortions related to worthlessness. The group explored how routine pleasurable engagement fosters positive reinforcement, mood elevation, and self-efficacy. Although the client acknowledged past enjoyment in creative expression, they did not verbalize intent to reintegrate any activities, suggesting no observed effort toward behavioral activation.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practicing Enjoyable Activities';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the behavioral activation model, emphasizing the importance of incorporating intrinsically enjoyable activities to challenge self-defeating beliefs and emotional withdrawal. Clients participated in a values-based mapping exercise to connect pleasurable activities with internal strengths. The client was able to identify one past interest but declined to discuss barriers or create an implementation plan, reflecting limited integration of the session''s content.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practicing Enjoyable Activities';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion on how consistent participation in meaningful and enjoyable routines reinforces identity, promotes emotional regulation, and combats depressive symptomatology. Clients generated a list of small, manageable activities that could be incorporated weekly. While peers shared ideas, the client remained reserved and did not volunteer examples or future goals, suggesting poor engagement with self-affirming behavioral strategies.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practicing Enjoyable Activities';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist utilized a psychoeducational framework to examine the relationship between self-esteem and behavioral activation. The group processed how avoidance of joyful experiences reinforces negative self-concept and contributes to emotional disengagement. Although multiple strategies were introduced to support re-engagement in preferred activities, the client demonstrated limited participation and offered no examples of preferred outlets, indicating no current application of the intervention.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practicing Enjoyable Activities';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session emphasizing the restorative effects of engaging in pleasurable activities on self-perception and mood regulation. Clients discussed how withdrawal from enjoyable experiences reinforces negative thought patterns. The client appeared disengaged, provided minimal input when prompted, and did not identify any activity of interest, reflecting a lack of initiative in rebuilding self-affirming routines.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practicing Enjoyable Activities';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of "behavioral enrichment" as a tool to counteract low self-esteem and depressive inertia. The session included structured planning of simple, pleasurable tasks aimed at reinforcing self-efficacy and emotional wellbeing. Despite the group''s engagement, the client reported difficulty recalling any recent enjoyable experience and declined to commit to a future activity, indicating emotional detachment and low behavioral activation.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practicing Enjoyable Activities';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided the group through an exercise designed to reconnect clients with previously enjoyed activities as a pathway to strengthening self-identity and internal validation. The therapist encouraged reflection on past routines that promoted joy and confidence. While others shared openly, the client maintained a flat affect and did not engage in personal reflection, suggesting continued emotional withdrawal and avoidance of self-enhancing behaviors.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practicing Enjoyable Activities';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a strengths-based session in which clients explored how regular engagement in personally meaningful activities can improve self-worth and provide structure to daily living. The client listened attentively but did not participate in the group''s brainstorming exercise or articulate a personal plan for activity engagement, highlighting ongoing passivity and low motivation.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practicing Enjoyable Activities';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational discussion focused on the role of pleasure-based behaviors in buffering against self-critical thinking and learned helplessness. Clients identified barriers such as guilt, fatigue, or lack of purpose that interfere with doing things they enjoy. The client expressed agreement with some points discussed but did not elaborate on personal experiences or attempt to identify an action step, showing minimal engagement in the therapeutic process.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practicing Enjoyable Activities';

