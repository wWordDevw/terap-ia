-- =============================================
-- PÁRRAFOS PARA "SOCIAL EVENTS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational group session on the therapeutic value of participating in social events as a means of enhancing relational connection and reducing depressive isolation. Clients discussed the psychological barriers to attending gatherings, including anticipatory anxiety, low self-worth, and fear of rejection. Therapist encouraged clients to identify an upcoming community or clubhouse event and verbalize at least one personal benefit of attending.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Social Events';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group discussion highlighting the role of positive social engagement in strengthening emotional resilience. Clients explored how regular participation in structured social events can foster belongingness, stimulate motivation, and serve as a protective factor against relapse. The group practiced reframing avoidant thoughts and developed individualized plans for attending future events with peer accountability.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Social Events';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in a reflective session on previous experiences with social events and their impact on mood and interpersonal functioning. The therapist used motivational interviewing techniques to explore ambivalence and resistance, reinforcing the idea that gradual social reentry can facilitate emotional growth and expand support networks. Clients were prompted to rate their willingness to attend an upcoming event and discuss potential coping tools to manage discomfort.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Social Events';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of therapeutic exposure through social participation. Clients examined how engaging in community events, even in limited ways, can help desensitize social anxiety and foster adaptive interpersonal behavior. The therapist supported clients in identifying low-pressure social settings aligned with their interests and guided them through visualization exercises to mentally prepare for participation.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Social Events';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a strengths-based group session focused on identifying social events as opportunities to practice communication, boundary-setting, and social reciprocity. Clients reviewed the emotional and behavioral skills needed for successful interactions in casual group settings. Therapist encouraged clients to set a realistic, socially-oriented goal for the week and reflect on how their participation might contribute to a greater sense of agency and connection.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Social Events';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session examining how engagement in social events can serve as a catalyst for rebuilding interpersonal trust and reducing social withdrawal. Clients discussed common cognitive distortions that deter them from participating in group settings, such as catastrophizing or personalization. The therapist guided clients in restructuring these beliefs and encouraged experimentation with low-stakes events to increase social comfort.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Social Events';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group discussion focused on the integration of social events into weekly routines as a preventive tool against emotional isolation. Clients were invited to assess the functional impact of avoidance and to brainstorm realistic steps toward attending structured or informal gatherings. The therapist reinforced the link between social contact and neurobiological markers of well-being, such as dopamine release and affective stability.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Social Events';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients through an exploration of how meaningful participation in social events can enhance identity formation and counteract maladaptive self-narratives. Using a narrative therapy lens, clients shared past social successes and identified internalized messages that have limited their social engagement. Therapist encouraged clients to envision and verbalize a preferred social self within future events.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Social Events';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an experiential processing group on emotional responses before, during, and after attending social events. Clients reflected on both reinforcing and discouraging patterns and identified physiological cues (e.g., tension, avoidance urges) that signal the onset of social discomfort. The therapist introduced somatic regulation strategies and emphasized the therapeutic value of sustained social interaction over time.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Social Events';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session on the developmental importance of prosocial engagement through social events. Clients explored how connection and shared experience can foster resilience, especially when facing mood instability or chronic stress. Therapist supported clients in evaluating personal readiness and encouraged setting a specific, time-bound goal to attend a social event as part of their recovery plan.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Social Events';



