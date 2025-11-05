-- =============================================
-- PÁRRAFOS PARA "PRACTICE SELF-CARE" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session focused on the relationship between self-care behaviors and the development of positive self-esteem. Clients explored the psychological impact of neglecting basic needs and discussed how acts of self-nurturing contribute to identity consolidation and emotional regulation. The therapist introduced a self-care inventory and guided clients to identify specific routines that foster personal agency and reinforce intrinsic self-worth.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practice Self-Care';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational group session highlighting self-care as a fundamental pillar in the maintenance of emotional stability and self-esteem. The group reviewed how neglecting physical, emotional, and social needs often reinforces feelings of inadequacy or self-criticism. Clients were encouraged to identify barriers to consistent self-care and brainstorm achievable daily habits that align with their values and promote psychological well-being.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practice Self-Care';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a discussion examining how chronic stress, emotional dysregulation, and poor self-concept are often linked to neglect of self-care practices. Clients engaged in a reflective activity to identify past moments when intentional self-care resulted in improved mood, motivation, or interpersonal functioning. The therapist encouraged participants to view self-care as a cognitive-behavioral strategy rather than indulgence, and to set weekly intentions to implement one meaningful practice.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practice Self-Care';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the session by defining self-care as an essential component of self-esteem maintenance and resilience. Through guided discussion, clients examined the internalized beliefs that hinder their ability to prioritize their needs, such as guilt or low self-worth. The group collaborated on developing individualized self-care plans that addressed emotional, physical, and psychological domains, with an emphasis on consistency over perfection.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practice Self-Care';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an experiential group activity to reinforce the connection between practicing self-care and strengthening one''s sense of identity and self-respect. Clients were invited to share culturally meaningful or personally symbolic self-care rituals that have contributed to their healing. The therapist emphasized the importance of reframing self-care as a boundary-setting behavior that reinforces autonomy and protects against emotional depletion.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practice Self-Care';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion exploring the impact of daily self-care routines on the development of positive self-esteem. Clients reflected on the emotional consequences of inconsistent self-attention and how neglect of personal needs can reinforce feelings of worthlessness. The therapist encouraged clients to identify and commit to at least one realistic self-care action that aligns with their current emotional state and functional capacity.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practice Self-Care';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients in a session focused on the psychological benefits of routine self-care as a tool for enhancing self-respect and personal value. The group analyzed the role of self-compassion in sustaining healthy self-esteem and discussed the internal narratives that may prevent individuals from prioritizing their well-being. Clients were invited to challenge cognitive distortions that equate self-care with selfishness or weakness.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practice Self-Care';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session on integrating self-care into daily living as a protective factor against depressive symptoms and self-critical thinking. Clients explored how even minor self-care tasks—such as preparing a healthy meal, establishing sleep hygiene, or engaging in enjoyable activities—can serve as affirmations of self-worth. The therapist emphasized the importance of reinforcing these behaviors with positive self-talk.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practice Self-Care';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in a structured activity examining how neglecting self-care can perpetuate cycles of emotional dysregulation and self-devaluation. The group discussed how physical, emotional, and social self-care are interconnected, and clients were encouraged to evaluate which area of self-care they have most consistently avoided. The therapist provided supportive strategies for gradually reintegrating those practices into their daily lives.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practice Self-Care';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a reflective group session in which clients assessed their personal history with self-care and how it has influenced their self-esteem. Clients were encouraged to distinguish between self-soothing and self-care, recognizing that while both may offer temporary relief, intentional self-care is tied to long-term emotional resilience. The therapist supported clients in creating short-term goals to begin rebuilding self-care habits.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Practice Self-Care';

