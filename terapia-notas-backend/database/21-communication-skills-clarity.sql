-- =============================================
-- PÁRRAFOS PARA "CLARITY AND CONCISION" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session focused on enhancing verbal expression through clarity and conciseness. Clients examined how vague or excessive communication can contribute to interpersonal misunderstandings and emotional dysregulation. The therapist guided participants through structured role-play exercises where they practiced articulating thoughts and needs using assertive and succinct language.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Clarity and Concision';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the cognitive-behavioral concept that unclear communication can perpetuate distorted thinking and conflict. Clients were encouraged to reflect on personal communication patterns that rely on assumptions or generalizations. Through therapist modeling and peer feedback, participants practiced converting abstract language into specific, goal-directed statements.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Clarity and Concision';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session exploring the relationship between emotional intensity and disorganized communication. Clients discussed how anxiety or frustration may result in rambling or defensive speech, which can erode relational trust. The group practiced grounding techniques and brief scripting strategies to support more intentional and direct verbal expression.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Clarity and Concision';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational discussion on effective communication, emphasizing the role of clarity in setting boundaries and navigating interpersonal challenges. Clients reviewed examples of indirect or ambiguous statements and worked collaboratively to reformulate them into clear, respectful messages. Insight into the link between communication clarity and self-advocacy was encouraged.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Clarity and Concision';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted an interactive session where clients assessed personal barriers to concise communication, such as fear of rejection or over-explaining. The therapist introduced the "Think-Speak" model to help clients organize internal dialogue before verbalizing responses. Clients practiced reducing verbal clutter and expressing essential ideas with confidence and emotional control.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Clarity and Concision';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session highlighting the importance of linguistic precision in therapeutic and social interactions. Clients explored how ambiguous or overly emotional language can obscure meaning and escalate conflict. The therapist provided sentence restructuring techniques to support clarity, followed by individual practice exercises aimed at improving message delivery.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Clarity and Concision';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a cognitive-behavioral group intervention emphasizing the reduction of cognitive distortions through direct communication. Clients were prompted to recognize when vague language reflected internal uncertainty or self-doubt. The therapist guided the group through reframing activities to strengthen coherent, assertive self-expression.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Clarity and Concision';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of intentional speech, focusing on how mental filtering and emotional reasoning often interfere with concise communication. Clients examined how their emotional state affects the clarity of their interactions and practiced reducing redundant or tangential speech through real-time feedback from the therapist and peers.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Clarity and Concision';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist structured the session around behavioral rehearsal techniques to promote clarity and brevity in client communication. Through discussion and practice, clients learned how to identify their core message and eliminate unnecessary qualifiers. Emphasis was placed on speaking with purpose and minimizing ambiguity in high-stress conversations.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Clarity and Concision';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in a self-reflective group dialogue about the impact of miscommunication on self-esteem and interpersonal relationships. The therapist encouraged participants to analyze recent conversations where misinterpretation occurred due to lack of clarity. Clients demonstrated emerging awareness of the need for clear and concise verbal expression to support relational efficacy.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Clarity and Concision';



