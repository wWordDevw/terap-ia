-- =============================================
-- PÁRRAFOS PARA "BUILDING SELF-CONFIDENCE" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session focused on enhancing self-confidence through cognitive restructuring of internalized negative beliefs. Clients explored how early messages and past failures have shaped their self-concept. The therapist guided the group in identifying personal strengths and practicing affirmations. The client demonstrated limited engagement, verbalizing discomfort with self-praise and expressing uncertainty about their competencies.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Building Self-Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session examining the relationship between self-efficacy and behavioral mastery. Clients were encouraged to reflect on moments of resilience and define personal values that support confident action. While others shared empowering experiences, the client remained quiet and avoided discussing examples, indicating persistent difficulty in accessing or affirming internal sources of confidence.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Building Self-Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a skill-building exercise aimed at challenging perfectionistic thinking and fostering realistic self-appraisal. Clients discussed how setting achievable expectations supports the development of stable self-confidence. The client acknowledged setting excessively high standards but struggled to generate alternative self-talk, revealing cognitive rigidity and low tolerance for perceived imperfection.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Building Self-Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group activity on identifying daily behaviors that reinforce self-confidence, such as assertive communication, self-advocacy, and goal persistence. The session highlighted the importance of consistency in reinforcing self-worth. The client participated briefly but expressed doubts about the relevance of the techniques, suggesting limited internalization of the strategies presented.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Building Self-Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an experiential session in which clients role-played scenarios requiring self-assured decision-making. Emphasis was placed on posture, voice tone, and language that conveys confidence. Although the client observed attentively, they declined to participate in the role-play and later reported feeling "unqualified," demonstrating avoidance behavior and lack of emerging confidence in interpersonal contexts.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Building Self-Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a strengths-based group focused on reconstructing the client''s self-narrative to foster confidence and personal agency. Clients identified key traits they admired in themselves and how these traits have helped them overcome adversity. The client required prompting to name even one strength and minimized their contributions, indicating entrenched self-doubt and low self-affirmation capacity.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Building Self-Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group session addressing the role of internal dialogue in shaping self-confidence. Clients explored the impact of automatic negative thoughts and engaged in reframing exercises to replace self-critical language with balanced affirmations. The client appeared hesitant to engage, citing disbelief in positive self-statements and showing minimal cognitive flexibility.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Building Self-Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured activity where clients visualized a future self grounded in confidence and emotional resilience. Clients were encouraged to describe behaviors, thoughts, and routines of their envisioned self. The client struggled to generate a vision and expressed fear of disappointment, underscoring internalized hopelessness and limited future-oriented self-efficacy.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Building Self-Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a reflective discussion on how interpersonal validation can support or undermine self-confidence. Clients shared how they interpret feedback from others and discussed strategies to internalize positive affirmations while reducing dependency on external approval. The client reported difficulty accepting praise and questioned its sincerity, reflecting impaired receptivity to affirming interpersonal cues.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Building Self-Confidence';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of "confidence anchors," encouraging clients to identify tangible actions or habits that reliably boost self-esteem (e.g., completing a task, dressing intentionally, practicing a hobby). Clients were guided to build a personalized confidence routine. The client expressed interest but did not select or commit to any specific anchor, citing lack of motivation and skepticism toward effectiveness.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Building Self-Confidence';

