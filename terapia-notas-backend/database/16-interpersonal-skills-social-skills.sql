-- =============================================
-- PÁRRAFOS PARA "SOCIAL SKILLS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational group focused on the foundational components of effective social interaction, including initiation of conversation, turn-taking, and active listening. The session emphasized the impact of social skill deficits on isolation and emotional dysregulation. Clients participated in structured role-plays to practice reciprocal dialogue and verbal affirmation. The client observed but did not engage in the exercises, indicating continued avoidance of social rehearsal and difficulty with interpersonal reciprocity.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a structured group session designed to improve prosocial behavior through modeling and reinforcement of appropriate social cues. Clients examined barriers such as fear of rejection, low self-confidence, and difficulty reading nonverbal communication. The therapist provided feedback on eye contact, tone modulation, and respectful interruption during a collaborative activity. The client made brief eye contact during the session but did not initiate conversation or provide feedback to peers, showing limited activation of social engagement strategies.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group intervention aimed at increasing social competence through cognitive-behavioral training. The session focused on decoding social situations, using flexible communication, and adjusting behavior to different interpersonal contexts. Clients were guided in identifying ineffective social habits and replacing them with assertive alternatives. The client listened attentively but declined to discuss personal experiences or participate in behavioral rehearsal, suggesting ongoing inhibition in peer interactions.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on rebuilding and maintaining social connections, highlighting the role of empathy, validation, and emotional attunement in forming meaningful relationships. The therapist used peer feedback exercises to enhance awareness of personal impact on others. Despite observing interactions between peers, the client did not offer input or request feedback, reflecting persistent difficulties with emotional expression and reciprocal social behavior.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group session on recognizing and adjusting maladaptive social patterns. Clients explored how social avoidance, dominance, or excessive self-disclosure can disrupt relationship development. The therapist introduced corrective role-play as a tool to rehearse socially adaptive responses to common triggers such as disagreement, silence, or rejection. The client remained passive throughout the practice and verbalized uncertainty about their social role, showing no measurable advancement in social functioning.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session centered on enhancing adaptive social interactions by teaching clients how to identify social cues, respond appropriately to verbal and nonverbal communication, and repair ruptures in social exchanges. Clients discussed previous interpersonal miscommunications and explored corrective strategies. Although the client appeared attentive, they did not share a personal example or attempt to apply any of the discussed techniques, reflecting continued difficulty with applied social cognition.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a behavioral rehearsal session aimed at increasing social fluency. Emphasis was placed on initiating greetings, maintaining mutual interest in conversation, and appropriately exiting interactions. Clients engaged in role-play scenarios reflecting real-world environments such as cafés and community events. The client observed but expressed discomfort in participating, suggesting anxiety related to social exposure and ongoing avoidance of interpersonal risk.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group discussion exploring the emotional underpinnings of social withdrawal, such as shame, fear of rejection, and cognitive distortions about worthiness. Clients practiced reframing unhelpful thoughts and challenged assumptions about others'' perceptions. While the client acknowledged the relevance of the topic, they did not verbalize specific beliefs or participate in the reframing exercise, indicating no observable shift in internal barriers to social engagement.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced assertive and prosocial behaviors as essential components of successful social functioning. Clients examined the distinction between assertiveness, passivity, and aggression, and practiced formulating respectful responses in scenarios involving disagreement. The client initially hesitated but eventually contributed a short example, demonstrating slight effort toward social risk-taking, though sustained practice was not observed.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group focused on strengthening group cohesion through structured social skill-building activities. Clients participated in cooperative games designed to elicit collaboration, listening, and flexible thinking. Debriefing emphasized emotional regulation during group interaction and tolerance of frustration. The client engaged briefly during the activity but did not offer reflections or initiate peer interaction afterward, reflecting limited follow-through in reinforcing social learning.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Social Skills';
