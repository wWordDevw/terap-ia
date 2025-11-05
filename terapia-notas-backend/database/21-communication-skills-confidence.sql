-- =============================================
-- PÁRRAFOS PARA "CONFIDENCE" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a cognitive-behavioral group session aimed at enhancing verbal assertiveness and communication confidence. The therapist introduced the concept of cognitive distortions that undermine self-expression, such as catastrophizing and mind reading. Clients participated in structured dialogue exercises to practice direct, confident speech. While some clients verbalized increased self-awareness of their internal narrative during communication, one client hesitated to engage and cited fear of judgment, indicating ongoing difficulty with social self-efficacy.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational group focused on the development of communication confidence through self-monitoring and restructuring negative self-talk. Clients were guided through identifying internal barriers to self-expression, including perfectionism, fear of criticism, and low self-worth. The therapist facilitated a self-affirmation exercise followed by a discussion on performance anxiety in conversations. Although several participants attempted to use more confident phrasing, one client remained withdrawn and did not engage in the activity, reflecting limited progress.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a structured group activity targeting the connection between nonverbal communication and perceived confidence. Clients explored the psychological impact of posture, eye contact, and vocal tone on self-presentation. Role-play exercises were used to challenge discomfort in interpersonal interactions. The therapist provided real-time feedback to reinforce assertive behavior. One client acknowledged avoidance behaviors but was unable to apply any techniques during the session, showing continued social inhibition.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a solution-focused group session on building confidence in communication by setting small, achievable interactional goals. Clients were encouraged to share recent successes in initiating conversations or expressing needs. The therapist introduced a stepwise approach to reduce anxiety in social situations and increase consistency in voice modulation and clarity. One client verbalized awareness of progress but did not share examples or strategies, indicating cognitive insight without behavioral implementation.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a discussion on the role of core beliefs in shaping communication confidence. Clients explored early experiences that contributed to fear of rejection and difficulty asserting thoughts and opinions. The therapist introduced a guided imagery exercise aimed at reinforcing a confident self-image during social interaction. While many clients participated actively, one client appeared emotionally distant and provided minimal input, suggesting limited internalization of concepts discussed.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session focused on the impact of self-concept on communicative confidence. Clients were guided to identify situations in which they minimized their input or remained silent due to perceived inadequacy. The therapist introduced the concept of behavioral experimentation, encouraging clients to take small risks in social contexts. One client expressed recognition of their passive tendencies but did not engage in discussion or planning, indicating avoidance and lack of behavioral follow-through.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led an interactive session examining how self-stigmatizing thoughts influence confidence during verbal exchanges. Clients engaged in group reflection about how past rejection or invalidation has impacted their willingness to speak openly. The therapist modeled assertive yet respectful phrasing, then invited clients to practice statements of opinion. While several participants attempted the exercise, one client refrained from contributing, citing "I never say the right thing," suggesting entrenched negative beliefs inhibiting participation.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the "confidence ladder" technique, helping clients identify and rank feared social situations from least to most distressing. The group explored personal triggers for low communication confidence, such as speaking in groups or expressing disagreement. Clients were encouraged to select a low-anxiety scenario to practice within the week. One client listened attentively but declined to set a target, demonstrating insight but no movement toward exposure or skill application.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a strengths-based session designed to reinforce intrinsic competencies that support confident communication. Clients completed a self-inventory of skills and personal qualities they felt proud of and were prompted to articulate these aloud in a supportive environment. The therapist emphasized how internal validation reinforces confidence. Although some clients engaged fully, one appeared visibly uncomfortable and avoided speaking, reflecting internal resistance and low comfort with self-affirmation.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a session integrating cognitive and behavioral strategies to improve communication self-efficacy. The group explored the role of internalized criticism in diminishing verbal assertiveness and practiced using counterstatements to challenge these thoughts. Role-play scenarios encouraged participants to verbalize a need or opinion with confidence. One client acknowledged the usefulness of the tools presented but remained silent throughout, showing no observable engagement with the material or willingness to practice.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Confidence';



