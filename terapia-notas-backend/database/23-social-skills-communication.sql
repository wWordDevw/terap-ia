-- =============================================
-- PÁRRAFOS PARA "COMMUNICATION" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session focused on enhancing verbal and nonverbal communication within social interactions. The therapist emphasized the role of tone, body language, and active listening in fostering mutual understanding. Clients engaged in role-play exercises to practice maintaining eye contact, using open body posture, and giving affirming responses. The group discussed how miscommunication can reinforce isolation or misinterpretation in interpersonal settings.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session addressing the distinction between passive, aggressive, and assertive communication styles. Through guided examples and structured feedback, clients explored the impact of their habitual communication patterns on relationship quality and self-esteem. The therapist encouraged the use of "I" statements and boundary-setting as core components of healthy social interaction.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced cognitive distortions that commonly interfere with effective social communication, such as mind reading and personalization. Clients reflected on recent conversations where assumptions or emotional reactivity led to conflict or withdrawal. The therapist modeled reframing techniques and facilitated small-group discussions to encourage corrective interpersonal experiences.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an interactive session centered on building empathy and perspective-taking as fundamental communication skills. Clients engaged in a structured activity where they practiced paraphrasing others'' emotional content and validating opposing viewpoints. The therapist provided corrective feedback to enhance social attunement and reduce defensiveness during interpersonal exchanges.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided the group through an exploration of communication breakdowns in high-stress scenarios. Clients were invited to share experiences in which dysregulated emotions hindered effective dialogue. The therapist introduced regulation strategies such as diaphragmatic breathing and brief time-outs, highlighting their usefulness in promoting clear and respectful exchanges during conflict.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session aimed at improving clients'' ability to initiate and maintain conversations in various social settings. The group explored common barriers such as social anxiety, fear of rejection, and low self-confidence. Clients practiced structured greetings, topic transitions, and reflective listening in dyads. The therapist emphasized the importance of practice and self-monitoring to enhance interpersonal effectiveness.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skills-building group focused on recognizing and adjusting maladaptive communication habits, including interrupting, over-talking, and defensiveness. Clients participated in feedback-based exercises to increase self-awareness of their conversational tendencies. Psychoeducation was provided on how these behaviors can hinder social connection and trust.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session emphasizing the integration of emotional intelligence into social communication. Clients discussed how identifying and naming their emotions prior to expressing themselves can reduce conflict and misunderstanding. The therapist introduced a step-by-step communication strategy involving emotion regulation, perspective-taking, and goal-oriented dialogue.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session exploring the connection between unmet needs and indirect communication patterns. Clients discussed how passive-aggressive behaviors and sarcasm often mask underlying emotional distress. The group practiced identifying unmet needs and articulating them using direct, non-blaming language, guided by therapist modeling and structured prompts.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Communication';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist provided instruction on communication repair strategies, particularly following conflict or misunderstanding. Clients learned the steps for offering sincere apologies, clarifying intent, and validating others'' feelings. The therapist facilitated partner exercises in which clients role-played repairing ruptures in communication, promoting accountability and empathy.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Skills' AND sa.subactivity_name = 'Communication';



