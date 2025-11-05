-- =============================================
-- PÁRRAFOS PARA "ACCEPTANCE OF CRITICS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session focused on the psychological barriers to receiving constructive criticism. Clients examined how early experiences with punitive feedback may contribute to defensiveness or shame responses. The therapist guided clients through cognitive reframing exercises to help differentiate between personal attacks and growth-oriented feedback. Several clients expressed difficulty tolerating perceived judgment and were encouraged to identify emotional triggers associated with criticism.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Acceptance of Critics';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a structured discussion on the role of feedback in social learning and self-awareness. Clients explored how maladaptive schemas—particularly those tied to perfectionism or rejection sensitivity—can distort the intention behind criticism. The therapist modeled how to respond to feedback with curiosity rather than reactivity, encouraging clients to practice neutralizing negative self-talk when receiving input from others.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Acceptance of Critics';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skills-based session on enhancing tolerance for critique in interpersonal contexts. The session emphasized the distinction between constructive and destructive criticism, and the role of intent and delivery in perception. Clients engaged in role-play exercises to practice non-defensive listening and assertive clarification when receiving unclear or emotionally charged feedback. One client reflected on avoiding feedback altogether to protect their self-esteem, highlighting the need for further cognitive flexibility.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Acceptance of Critics';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session examining the emotional regulation challenges associated with accepting feedback. Clients discussed common automatic reactions such as anger, withdrawal, or internalization. The therapist introduced mindfulness techniques to support emotional neutrality in moments of perceived criticism. Clients were encouraged to reflect on one past situation where feedback was misinterpreted and how reframing could have altered the outcome.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Acceptance of Critics';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group discussion on the importance of receiving feedback as a social skill essential for personal and professional growth. Clients processed their emotional responses to recent experiences of criticism and identified underlying core beliefs that influenced those reactions. The therapist supported clients in exploring how defensive behavior can inadvertently limit social connection and learning, and introduced techniques to validate one''s own emotional response while remaining open to external perspectives.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Acceptance of Critics';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a reflective group session focused on enhancing clients'' receptivity to feedback. Clients explored how fear of inadequacy and low self-concept may interfere with their ability to accept constructive criticism without emotional dysregulation. Through group processing, the therapist encouraged clients to view feedback as an opportunity for refinement rather than personal failure, emphasizing the development of self-validation skills in the face of perceived disapproval.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Acceptance of Critics';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session examining clients'' typical responses to feedback within interpersonal settings. Clients identified patterns such as avoidance, justification, or over-apologizing. The therapist introduced behavioral rehearsal strategies that included pausing, paraphrasing, and requesting clarification when receiving critique. Emphasis was placed on regulating internal narratives that equate feedback with rejection or diminished worth.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Acceptance of Critics';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a cognitive restructuring session aimed at challenging distorted beliefs surrounding criticism. Clients discussed familial or cultural messages that framed critique as punishment rather than support. The therapist facilitated a group activity in which clients reworded past critical statements into constructive feedback, fostering greater resilience and self-awareness in evaluative contexts.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Acceptance of Critics';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a psychoeducational session on emotional intelligence and its role in managing interpersonal critique. Clients practiced identifying their initial emotional response to criticism and the cognitive distortions that often follow, such as catastrophizing or personalization. The group explored strategies to respond non-defensively, including grounding techniques and intentional self-affirmation.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Acceptance of Critics';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an interactive session focused on feedback tolerance in collaborative environments. Clients discussed how excessive self-monitoring or fear of conflict may result in passive or hostile reactions to feedback. The therapist modeled assertive communication strategies and supported clients in understanding how receiving and integrating critique can strengthen both confidence and relational trust.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Acceptance of Critics';



