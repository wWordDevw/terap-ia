-- =============================================
-- PÁRRAFOS PARA "ACCEPTING DIFFERENCES" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session focused on increasing clients'' ability to tolerate interpersonal differences without emotional dysregulation. The discussion centered on how rigid belief systems and dichotomous thinking contribute to conflict and withdrawal in social settings. Clients explored strategies such as perspective-taking and nonjudgmental observation. The client listened attentively but did not share any personal examples or attempt to challenge their cognitive rigidity, reflecting no observable movement toward greater relational tolerance.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a structured group on developing cognitive flexibility and openness in relationships characterized by diversity in values, opinions, or lifestyles. Clients were guided in recognizing emotional triggers when confronted with contrasting viewpoints and introduced to skills such as curiosity-driven inquiry and value-based boundary setting. While the client engaged in passive observation, they refrained from offering reflections or role-playing scenarios, indicating minimal internalization of the skills discussed.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session aimed at fostering respectful engagement in the presence of interpersonal and cultural differences. Clients discussed the emotional responses that arise when others express divergent worldviews. The therapist emphasized validation techniques and the use of dialectical thinking to reduce interpersonal friction. The client acknowledged previous experiences of relational tension but did not elaborate or practice the tools introduced, suggesting continued difficulty in navigating diversity within social contexts.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on the psychological mechanisms underlying intolerance of differences, including projection and defensiveness. The group explored the connection between low self-esteem and the rejection of unfamiliar perspectives. Clients were introduced to reflective listening as a means of bridging ideological gaps. The client remained quiet during the session, did not attempt to use any of the tools discussed, and avoided engaging in dyadic practice, indicating no observable behavioral shift.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group activity focused on reducing interpersonal avoidance when confronted with disagreement. Clients identified past situations where they had disengaged or escalated conflict due to an inability to accept differing viewpoints. The therapist modeled assertive and respectful dialogue as an alternative to withdrawal or confrontation. The client demonstrated hesitance throughout the session and did not identify a situation to apply the skill, reflecting continued avoidance and lack of progress in this interpersonal domain.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a cognitive-behavioral group session addressing the role of tolerance in maintaining healthy interpersonal relationships. The group examined how emotional reactivity to contrasting opinions may stem from underlying cognitive distortions such as personalization and overgeneralization. Clients were encouraged to apply mindfulness-based techniques to remain present during disagreements. The client remained reserved, did not contribute to group discussion, and showed no engagement in applying reframing strategies.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a discussion-based session aimed at increasing clients'' awareness of how implicit biases and assumptions can interfere with relationship-building. Clients explored how early family dynamics and social conditioning shape responses to difference. The therapist introduced self-monitoring tools to track judgmental thoughts and promote empathetic engagement. The client acknowledged the topic but did not participate in self-reflection exercises, indicating limited integration of the material presented.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted an experiential session focused on conflict resolution in the context of value-based differences. Clients role-played respectful communication techniques, including the use of "I" statements and curiosity-driven inquiry. The therapist highlighted how acceptance does not equate to agreement, but rather reflects emotional maturity and self-regulation. The client did not engage in the exercises and remained physically disengaged, suggesting continued discomfort with relational diversity.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on emotional intelligence and its role in accepting differing beliefs and behaviors. Clients identified situations where emotional reactions had damaged relationships and discussed healthier alternatives. The therapist introduced the concept of radical acceptance to support emotional regulation. The client passively observed, avoided identifying specific interpersonal challenges, and did not engage in group dialogue, reflecting a lack of progress in emotional openness.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a session on identifying core values and learning to respect those of others even when they conflict. Clients explored the difference between compromise and self-abandonment, and practiced articulating their values while tolerating opposing viewpoints. The therapist provided individualized coaching during a values clarification exercise. The client declined participation and verbalized discomfort discussing opposing perspectives, indicating ongoing difficulty with cognitive and emotional flexibility.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Accepting Differences';
