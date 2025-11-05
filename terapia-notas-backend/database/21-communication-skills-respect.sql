-- =============================================
-- PÁRRAFOS PARA "RESPECT" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured session on respectful communication, emphasizing the importance of acknowledging others'' perspectives, using inclusive language, and regulating tone in interpersonal exchanges. Clients engaged in role-play scenarios involving boundary-setting and disagreement. One client demonstrated difficulty distinguishing assertiveness from confrontation, often interrupting peers during practice. Therapist provided corrective feedback and highlighted how respectful turn-taking fosters psychological safety in relationships.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients through a discussion on the role of respect in communication, especially in managing emotional intensity and disagreement. The group examined cultural, familial, and cognitive factors that shape perceptions of respect. One client acknowledged a tendency to become dismissive during conflict and practiced using reflective statements. Therapist encouraged continued monitoring of nonverbal communication, such as eye rolling or crossed arms, which may unintentionally convey contempt.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of reciprocal respect as a foundation for prosocial behavior and mutual trust. Clients explored how microaggressions, invalidation, or sarcasm erode communication. During group processing, one client expressed frustration with feeling unheard in past relationships and defaulted to aggressive tones during role-play. Therapist intervened to model respectful language and invited the client to reframe their message with emotional neutrality and boundary clarity.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an experiential activity focused on using "I" statements to express feelings while maintaining respect for others'' boundaries. Clients identified scenarios where their communication had been perceived as disrespectful, either due to volume, timing, or content. One client expressed insight into how past invalidation has made them hypersensitive to tone, prompting a discussion on self-regulation and empathy as core components of respectful dialogue.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group session on fostering respect during group dynamics, particularly when navigating differences in values or communication styles. The group discussed how respect involves intentional pauses, withholding judgment, and practicing presence. A client acknowledged a history of interrupting or correcting others due to discomfort with silence. Therapist reinforced mindfulness techniques to improve tolerance for emotional and cognitive differences in group settings.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session aimed at increasing awareness of respectful interaction patterns, focusing on active listening, tone modulation, and acknowledgment of others'' viewpoints. Clients discussed the impact of interrupting, sarcasm, or dismissive body language. One participant recognized a tendency to dominate conversations as a defense mechanism. The therapist introduced grounding strategies to promote self-awareness and respectful conversational pacing.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session exploring the relationship between respect and emotional intelligence in communication. Clients examined how impulsive responses and unchecked frustration can undermine mutual respect. The therapist guided the group in identifying respectful alternatives to reactive communication, such as intentional pausing and using validating phrases. Clients practiced reframing statements to preserve interpersonal dignity.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an interactive session on cultivating mutual respect during group and interpersonal exchanges. The group reflected on past experiences of being disrespected and how those experiences influenced their own communication habits. A client disclosed difficulty giving space in conversation due to fear of being misunderstood. Therapist introduced empathy-focused strategies to support more respectful, two-way interactions.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skill-building session on respectful disagreement and conflict resolution. Clients were encouraged to share beliefs without diminishing the perspectives of others. Through guided dialogue, the therapist highlighted how respectful communication promotes trust and psychological safety. A client who typically withdraws during disagreement was supported in practicing verbal expression with tone awareness and mutual regard.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Respect';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of boundaries as a form of self-respect and respect for others. Clients explored how failure to respect others'' limits—whether verbal, emotional, or physical—can damage relationships. In group dialogue, a client identified a pattern of over-sharing and violating conversational boundaries. Therapist worked with the group to define and rehearse respectful boundary-setting language in emotionally charged situations.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Communication Skills' AND sa.subactivity_name = 'Respect';



