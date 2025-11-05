-- =============================================
-- PÁRRAFOS PARA "RAPPORT" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on the development of interpersonal rapport, emphasizing its foundational role in building trust and emotional safety in relationships. Clients explored verbal and nonverbal elements that foster connection, such as mirroring, shared interest, and reciprocal self-disclosure. The therapist guided clients through dyadic exercises to practice initiating rapport in socially appropriate ways.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Rapport';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a structured group focused on recognizing and overcoming barriers to rapport-building. Clients identified personal tendencies, such as social withdrawal, misinterpretation of cues, or fear of rejection, that interfere with relational connection. Therapist introduced communication techniques rooted in attunement and validation to facilitate relational warmth and engagement.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Rapport';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a cognitive-behavioral session on rapport as a relational skill influenced by self-perception and emotional regulation. Clients examined how internal schemas and defensive postures can inhibit rapport development. Through role-play, clients practiced expressing openness and curiosity, key components of relational attunement and trust-building.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Rapport';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group discussion on how rapport supports long-term relational satisfaction and social resilience. Clients analyzed the role of empathy, pacing, and active listening in creating meaningful social exchanges. The therapist emphasized the importance of consistent, respectful engagement to maintain rapport across varying contexts.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Rapport';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced rapport-building within the framework of motivational interviewing, helping clients understand the therapeutic relevance of alliance and mutual respect. Clients engaged in scenario-based exercises to distinguish rapport from superficial friendliness, and practiced deepening interactions through reflective statements and non-defensive posture.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Rapport';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an experiential group focused on cultivating rapport through presence and attunement. Clients explored how emotional congruence, tone modulation, and appropriate self-disclosure serve as tools to enhance interpersonal engagement. Therapist highlighted the role of authenticity and consistency in fostering trust across varying relational contexts.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Rapport';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients in identifying the micro-skills involved in rapport-building, including reflective listening, open-ended questioning, and appropriate affirmations. Clients participated in a series of interactive exchanges designed to increase comfort with initiating and sustaining reciprocal dialogue. The group processed how rapport can reduce feelings of alienation and promote social belonging.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Rapport';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session on rapport as a dynamic process essential for meaningful connection. Clients reviewed the psychological mechanisms that support relational resonance, such as emotional mirroring and validation. Through modeling and rehearsal, the therapist supported clients in practicing intentional behaviors that convey safety and empathy.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Rapport';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group intervention on the cognitive distortions that disrupt rapport-building, such as personalization or all-or-nothing thinking in social interactions. Clients worked to reframe negative assumptions and practice adaptive interpretations of others'' behavior. Therapist reinforced the importance of patience and curiosity in fostering mutual understanding.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Rapport';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in a structured group on rapport-building within peer and professional relationships. Clients identified patterns of disengagement or mistrust that interfere with relational flow. The therapist facilitated a role-play series where participants explored how rapport emerges through shared vulnerability, active empathy, and respectful pacing in conversation.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Rapport';



