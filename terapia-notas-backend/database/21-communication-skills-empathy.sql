-- =============================================
-- PÁRRAFOS PARA "EMPATHY" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on enhancing empathic communication, emphasizing the role of perspective-taking and emotional mirroring in strengthening interpersonal connections. Clients discussed the difference between sympathy and empathy, and were guided to practice reflective listening. One client struggled to validate others'' emotions during role-play and defaulted to problem-solving responses, indicating difficulty in emotional attunement and the need for further practice in non-directive support.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session focused on identifying emotional cues and responding with empathy in verbal exchanges. The group examined verbal and non-verbal indicators of distress and discussed how emotionally congruent responses build trust. Clients participated in paired exercises where they practiced paraphrasing emotional content. Although most engaged meaningfully, one client maintained a detached tone and struggled to shift from cognitive understanding to emotional resonance.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skills-based session exploring empathic communication as a tool for de-escalating conflict. Clients examined scenarios where invalidation or defensiveness led to relational ruptures. Through guided role-play, participants practiced validating others'' emotions even when disagreeing with their perspective. One client reported this felt "unnatural" and declined to participate, highlighting avoidance patterns and limited exposure to emotionally vulnerable dialogue.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of emotional empathy versus cognitive empathy and facilitated a group discussion on how each contributes to social understanding. Clients reflected on personal barriers to empathy, including trauma, mistrust, or discomfort with emotional expression. The therapist modeled empathic responding and encouraged open sharing. One client remained silent and later stated they "don''t see the point of pretending to care," suggesting underlying emotional disconnection and potential for further exploration in individual sessions.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a reflective group exercise in which clients shared a personal challenge while others practiced empathic listening without interrupting or offering advice. The session emphasized holding emotional space and responding with affirming language. While many demonstrated growth in emotional presence, one client defaulted to humor as a deflection mechanism, minimizing the emotional content of others'' disclosures. Therapist gently challenged this pattern and reinforced the importance of authentic empathic engagement.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational group on empathy as a key interpersonal skill, emphasizing its role in validating others'' experiences and strengthening relational bonds. Clients discussed past situations in which they felt misunderstood, and explored how empathic failure affects emotional safety. During dyadic practice, one client struggled to maintain emotional focus and diverted the conversation to their own experiences, indicating egocentric communication patterns that require continued redirection toward other-oriented listening.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided the group through exercises in active empathic listening, including maintaining soft eye contact, using minimal encouragers, and paraphrasing emotional content. The group explored how empathic listening differs from advice-giving or emotional rescuing. While most clients demonstrated growth in attunement, one client remained disengaged and responded to emotional disclosures with silence or concrete suggestions, suggesting cognitive detachment and a need to strengthen emotional responsiveness.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the neurobiological basis of empathy, explaining mirror neurons and their role in social bonding. Clients explored how early relational experiences may impact their capacity to feel or express empathy. Through journaling and group discussion, clients identified moments of emotional disconnection. One client expressed discomfort recognizing others'' pain and reported "shutting down" when conversations become emotional, reflecting a possible trauma-related empathy barrier.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group focused on practicing empathic responses in emotionally charged scenarios. Clients worked through case vignettes and practiced responding with validation rather than solutions. Emphasis was placed on communicating presence and understanding without minimizing the speaker''s emotions. One client defaulted to dismissive phrases such as "you''ll be fine" and required therapist prompting to reframe comments in a more supportive, emotionally congruent manner.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Empathy';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on the distinction between empathy and emotional enmeshment, helping clients develop boundaries while remaining emotionally available. Clients practiced responding with empathy while maintaining their own emotional regulation. One client reported difficulty "not taking on" others'' emotions, and appeared visibly dysregulated after a peer shared a distressing story. Therapist supported the client in grounding techniques and reinforced the importance of self-regulation in empathic exchanges.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Empathy';



