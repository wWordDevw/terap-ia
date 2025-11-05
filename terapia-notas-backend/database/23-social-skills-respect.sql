-- =============================================
-- PÁRRAFOS PARA "RESPECT" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session focused on fostering mutual respect as a foundational component of healthy interpersonal functioning. Clients explored how respect is demonstrated through boundary recognition, turn-taking, and validation of others'' perspectives. Through role-play, the therapist guided participants in practicing verbal and nonverbal cues that communicate dignity and consideration, particularly in moments of disagreement.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational discussion on respect as a prosocial behavior essential to emotional safety within relationships. Clients examined how unresolved anger, impulsivity, or defensive communication may hinder their ability to maintain respectful interactions. The therapist introduced cognitive reframing techniques to help participants manage assumptions and reduce reactivity when feeling challenged by others.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an experiential group exercise centered on recognizing and responding to perceived disrespect without escalating conflict. Clients processed previous situations in which they felt disrespected and were guided to differentiate between assertive and aggressive responses. The session emphasized internal regulation and empathy-building as mechanisms for preserving respectful communication.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skills-building session in which clients examined how respect is often mirrored in social exchanges. The group discussed how modeling respectful behavior can influence relational dynamics and reduce the likelihood of interpersonal tension. The therapist supported clients in identifying personal barriers to showing respect, such as mistrust, pride, or perceived vulnerability.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group activity aimed at enhancing awareness of cultural, generational, and individual differences in expressing respect. Clients were encouraged to reflect on their own definitions of respect and identify moments where unintentional disrespect may have arisen due to differing expectations. The therapist emphasized curiosity, openness, and flexibility as tools for navigating diverse social environments with integrity.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured group session on cultivating respectful interactions in emotionally charged situations. Clients explored the link between emotional regulation and respectful behavior, especially when personal boundaries are tested. The therapist introduced grounding techniques to promote pause before reaction, allowing for deliberate, value-based responses.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a reflective discussion on how respect serves as a protective factor in both personal and community settings. Clients identified specific behaviors—such as listening attentively, avoiding interrupting, and honoring personal space—that contribute to a climate of mutual regard. Group members processed how feeling respected impacts self-worth and motivation for social engagement.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a cognitive-behavioral session examining the internal beliefs that may obstruct respectful communication. Clients explored themes such as entitlement, unresolved resentment, or rigid thinking patterns that interfere with treating others with courtesy. The therapist encouraged clients to reframe disrespectful impulses through empathy-driven thought restructuring.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a role-play-based session focused on practicing respectful disagreement. Clients were presented with scenarios involving value differences or opposing opinions and coached on maintaining respectful tone, posture, and word choice. The session emphasized that respect does not equate to agreement but involves honoring the other''s humanity and right to express.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a group dialogue exploring respect as a reciprocal process. Clients examined how unmet emotional needs may provoke disrespectful behavior and discussed how assertive communication can restore relational balance. The therapist reinforced the concept of "mutual dignity" as a cornerstone of sustainable and healthy social interactions.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Respect';



