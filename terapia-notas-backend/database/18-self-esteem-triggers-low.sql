-- =============================================
-- PÁRRAFOS PARA "IDENTIFY TRIGGERS TO LOW" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational group focused on increasing client insight into internal and external triggers that contribute to diminished self-esteem. Through guided discussion, clients explored early experiences, cognitive distortions, and interpersonal dynamics that activate self-critical thoughts. Participants identified personal examples and began to differentiate between situational versus longstanding core beliefs impacting their self-worth.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session centered on recognizing cognitive, emotional, and behavioral patterns associated with low self-esteem. Clients were encouraged to reflect on specific events, relationships, and internal dialogues that elicit feelings of inadequacy or failure. The group discussed how shame-based narratives and perfectionistic thinking maintain negative self-perceptions.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of esteem-lowering triggers and their connection to negative self-concept development. Using structured prompts, clients identified personal scenarios where self-esteem tends to deteriorate, such as perceived rejection or underperformance. The therapist highlighted the role of emotional reasoning and guided participants in exploring alternative interpretations of these events.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a cognitive-behavioral intervention designed to help clients map out personal triggers contributing to self-esteem erosion. Clients examined internalized critical voices and external validation-seeking behaviors. The group collaboratively discussed how past invalidating environments may shape current self-appraisal processes and coping styles.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted an interactive session aimed at identifying situational and relational contexts that provoke self-deprecating beliefs. Clients explored the link between automatic thoughts, emotional reactivity, and self-worth judgments. Psychoeducation was provided on the role of self-compassion and cognitive restructuring in interrupting the cycle of negative self-evaluation.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a session focused on increasing self-awareness of patterns that lead to diminished self-esteem. Clients participated in journaling exercises to trace the emotional aftermath of specific situations where their self-worth felt compromised. The therapist emphasized the connection between recurring interpersonal conflicts and internalized negative self-assessments.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion aimed at deconstructing the influence of past invalidating experiences on current self-esteem vulnerabilities. Clients examined how early criticism, neglect, or bullying established maladaptive self-beliefs. The therapist supported the identification of core schemas that continue to be triggered in present-day contexts.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a framework for identifying emotional and cognitive cues that signal declining self-esteem. Through group dialogue, clients shared common themes such as fear of failure, rejection sensitivity, and comparison with others. Psychoeducation focused on reframing these triggers as opportunities for self-reflection and growth rather than confirmation of inadequacy.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led an experiential exercise in which clients explored specific moments when their self-esteem was challenged. Clients identified physical sensations, emotions, and thoughts associated with these experiences. The therapist highlighted the importance of recognizing early warning signs to prevent escalation into depressive thinking patterns.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a cognitive restructuring activity in which clients listed recent situations that elicited feelings of worthlessness or self-doubt. Participants were guided in identifying the automatic thoughts associated with these incidents and challenged to generate more balanced, realistic alternatives. The therapist emphasized how insight into triggers empowers emotional regulation and self-validation.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Self-Esteem' AND sa.subactivity_name = 'Identify Triggers to Low';

