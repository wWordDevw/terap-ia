-- =============================================
-- PÁRRAFOS PARA "SELF ESTEEM" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on the foundational elements of self-esteem, guiding clients through an exploration of internalized beliefs, self-worth, and perceived competence. Clients were encouraged to identify sources of negative self-perception and to differentiate between global self-esteem and situational confidence. The therapist utilized cognitive restructuring techniques to challenge distorted self-beliefs.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a strengths-based intervention aimed at fostering self-recognition and self-validation. Clients engaged in a structured reflection on past successes, personal attributes, and resilience factors. The therapist highlighted the role of self-narrative in shaping identity and encouraged the practice of affirming language to reinforce a more balanced self-concept.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group discussion on the developmental and environmental factors that influence self-esteem, including attachment history, social reinforcement, and critical self-talk. Clients participated in a journaling activity focused on identifying patterns of self-criticism and formulating alternative, compassionate responses. Therapist emphasized the importance of consistency in positive self-reflection.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a cognitive-behavioral exercise aimed at increasing awareness of automatic thoughts that undermine self-esteem. Clients were invited to monitor internal dialogue and recognize triggers that elicit shame, inadequacy, or self-doubt. The therapist facilitated role-play scenarios to practice assertive responses and boundary-setting as tools for reinforcing self-respect.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an experiential group session using metaphor and guided imagery to help clients reconnect with core values and personal identity. Through narrative therapy techniques, clients externalized their inner critic and began to reconstruct a more affirming self-image. The therapist reinforced the notion that self-esteem is dynamic and responsive to intentional self-care practices.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a goal-oriented session centered on developing clients'' abilities to clearly define personal and interpersonal challenges. The group explored how ambiguous or emotionally charged descriptions of problems can hinder effective resolution. Therapist utilized Socratic questioning to help clients reframe problems in measurable, realistic terms.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in a cognitive-behavioral exercise designed to enhance self-reflection and precision in identifying the root causes of recurring difficulties. Clients were encouraged to move from global complaints to specific, actionable statements. The therapist reinforced the value of this skill in reducing reactivity and promoting proactive coping.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients through a structured problem identification worksheet to distinguish between perceived threats and actual obstacles. Emphasis was placed on increasing self-awareness of habitual patterns of generalization and personalization that cloud problem recognition. Clients practiced articulating concerns with clarity and emotional neutrality.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a skill-building session on pinpointing the central issue within emotionally complex situations. The group discussed how misidentification of problems can perpetuate avoidance and ineffective solutions. Therapist modeled the use of open-ended prompts to deepen insight and foster internal locus of control.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Self Esteem';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session highlighting the link between accurate problem identification and emotional regulation. Clients examined recent stressors and practiced isolating the core issue from secondary emotional responses. Therapist emphasized that this skill enhances decision-making and decreases impulsive behaviors in the face of adversity.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Self Esteem';

