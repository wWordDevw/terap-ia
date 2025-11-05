-- =============================================
-- PÁRRAFOS PARA "MINDFULNESS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured session on mindfulness as a tool for grounding and emotional regulation. Clients were guided through a sensory-focused mindfulness practice aimed at increasing present-moment awareness and reducing ruminative thinking. The therapist highlighted how non-judgmental observation of thoughts can decrease cognitive fusion and promote distress tolerance. Client engagement varied, with some noting increased awareness of physical sensations and others expressing difficulty remaining focused.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Mindfulness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced mindfulness as a core skill in managing anxiety and emotional dysregulation. The session included a breath-centered guided meditation, followed by group processing of internal experiences. Clients discussed the role of mindfulness in interrupting automatic negative thought patterns and fostering psychological flexibility. The therapist emphasized regular practice to build attentional control and reduce reactivity to stressors.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Mindfulness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session on the principles of mindfulness, including acceptance, non-judgment, and present-moment focus. Clients participated in a brief body scan exercise designed to increase somatic awareness and reduce tension. The group explored how mindfulness can enhance self-regulation and decrease avoidance behaviors commonly associated with anxiety and depression. Several clients reported subtle shifts in bodily awareness and emotional state.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Mindfulness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a mindfulness-based intervention focused on observing thoughts without attachment. The therapist used a metaphor of "leaves on a stream" to illustrate the concept of cognitive defusion. Clients practiced identifying intrusive thoughts and allowing them to pass without engaging. The session concluded with a discussion on how mindfulness may increase psychological distance from distressing cognitions, thereby supporting emotional balance and impulse control.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Mindfulness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on using mindfulness to interrupt maladaptive emotional cycles. Clients explored the "STOP" technique (Stop, Take a breath, Observe, Proceed) and practiced it in real-time scenarios. The therapist linked the use of mindfulness to increased distress tolerance and decreased impulsivity. Clients were encouraged to reflect on how mindful awareness could be applied in moments of interpersonal conflict or internal dysregulation.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Mindfulness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a mindfulness-based group session aimed at fostering emotional regulation through intentional breathwork and focused attention. Clients were guided in anchoring their awareness to the breath and gently redirecting their focus when distracted. The therapist emphasized mindfulness as a non-invasive technique to reduce sympathetic arousal and enhance parasympathetic response. Most clients noted difficulty maintaining focus but acknowledged increased awareness of their internal states.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Mindfulness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of mindfulness as an intervention for intrusive thoughts and emotional reactivity. Clients engaged in a "five senses" grounding practice to redirect attention from cognitive overwhelm to sensory experience. The therapist explored how cultivating mindful presence may serve as a buffer against dissociation and cognitive flooding. Clients processed how this strategy could be integrated into daily routines as a form of self-soothing.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Mindfulness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session on mindfulness, illustrating how sustained attention and non-judgmental awareness can support mood stability. A brief loving-kindness meditation was used to foster self-compassion and reduce internalized self-criticism. The therapist facilitated a discussion on how mindfulness can counteract automatic negative thoughts and improve emotional attunement. Several clients identified barriers to practice, including restlessness and self-judgment.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Mindfulness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a guided mindfulness session incorporating elements of Acceptance and Commitment Therapy (ACT). Clients were taught to observe thoughts and emotions as transient mental events rather than facts. The therapist modeled "noticing" language and encouraged clients to apply mindfulness when encountering distressing internal stimuli. Clients discussed the application of mindfulness in high-stress moments, with mixed levels of insight and engagement.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Mindfulness';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a mindfulness training session utilizing breath anchoring and body awareness to support nervous system regulation. The therapist discussed the impact of chronic stress on somatic tension and introduced mindfulness as a mechanism for physiological downregulation. Clients participated in a silent, timed exercise and were encouraged to track their emotional baseline before and after. Reflection revealed that while some clients found the practice calming, others reported difficulty sustaining non-reactivity.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Mindfulness';



