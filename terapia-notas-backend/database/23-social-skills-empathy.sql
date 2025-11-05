-- =============================================
-- PÁRRAFOS PARA "EMPATHY" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured session focused on enhancing clients'' capacity for empathy within interpersonal interactions. Clients explored the cognitive and affective components of empathy, including perspective-taking and emotional attunement. The group engaged in guided exercises to practice identifying the emotions behind others'' words and behaviors, aiming to increase social sensitivity and relational connectedness.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational group on distinguishing empathy from sympathy and emotional fusion. Clients were introduced to the concept of empathic boundaries, where one can validate others'' experiences without internalizing their distress. The session emphasized empathy as an interpersonal skill that supports compassion while preserving individual emotional regulation.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group session that utilized storytelling and scenario analysis to explore empathy deficits in common social conflicts. Clients were encouraged to examine moments where misunderstandings escalated due to assumptions and lack of emotional resonance. The therapist facilitated reflection on how responding empathetically might have altered the outcomes.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of emotional mirroring and its role in empathetic communication. Clients practiced paraphrasing others'' emotional statements to ensure accurate emotional reflection. The therapist emphasized how this technique strengthens rapport, reduces defensiveness, and supports conflict de-escalation in strained relationships.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion-oriented session examining barriers to empathy, such as emotional numbness, cognitive biases, or self-focused stress responses. Clients worked collaboratively to identify internal blocks to empathy and explored behavioral alternatives that could foster genuine understanding. Group members shared personal experiences where the presence or absence of empathy significantly impacted relational outcomes.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an experiential group focused on building empathy through role reversal exercises. Clients were guided to temporarily adopt another person''s perspective in emotionally charged scenarios, aiming to cultivate greater understanding of others'' emotional experiences. The group reflected on how empathy can reduce interpersonal tension and foster inclusive social interactions.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session on the neurobiological and developmental aspects of empathy, helping clients understand how empathy can be strengthened through intentional practice. The group discussed how early attachment experiences shape empathic responsiveness and how awareness of this can support more conscious emotional attunement in adulthood.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a structured group session in which clients analyzed real-life examples of interpersonal conflict to identify missed opportunities for empathy. Clients were challenged to reframe harsh or dismissive responses with more compassionate and validating alternatives, enhancing their emotional literacy and capacity to connect.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a mindfulness-based empathy training, combining present-moment awareness with guided imagery to increase receptivity to others'' emotional states. Clients practiced pausing before reacting in conversations and tuning into emotional cues. The therapist emphasized the role of empathy in reducing social misinterpretation and fostering prosocial behavior.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged the group in a discussion on cultural and contextual influences on the expression of empathy. Clients explored how empathy may be misunderstood or underutilized in certain environments due to stigma, emotional suppression, or trauma histories. Emphasis was placed on using empathy as a skill for bridging diverse perspectives and creating psychologically safe spaces.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Empathy';



