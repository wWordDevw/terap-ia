-- =============================================
-- PÁRRAFOS PARA "MEDITATION AND VISUALIZATION" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on the psychological and physiological benefits of meditation and guided visualization. Clients explored how these relaxation techniques can reduce sympathetic nervous system arousal and promote affect regulation. The therapist led a brief mindfulness meditation focused on breath awareness, followed by a guided visualization exercise designed to elicit feelings of safety and calm. Clients were encouraged to reflect on the internal shifts experienced and identify settings in which these techniques could be applied independently.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Meditation and Visualization';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the session by reviewing the neurocognitive effects of regular meditation and imagery-based practices. Emphasis was placed on the use of mental visualization to restructure maladaptive emotional responses to stress. Clients participated in a forest visualization exercise and were invited to identify internal anchors (e.g., sensory details or affirmations) to reinforce emotional grounding. The group discussed perceived barriers to practicing these techniques consistently and explored ways to incorporate them into daily routines.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Meditation and Visualization';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a structured experiential group in which clients engaged in progressive muscle relaxation followed by a visualization technique intended to induce tranquility and enhance present-moment awareness. Psychoeducation was provided on the role of parasympathetic activation in emotional regulation. Clients shared varied levels of receptivity to the exercises; the therapist normalized initial discomfort and reinforced the importance of repeated practice in building tolerance for stillness.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Meditation and Visualization';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on cultivating internal safety using mindfulness meditation and guided imagery. Clients explored the mind-body connection and the therapeutic potential of creating mental safe spaces as a coping tool during moments of emotional distress. The therapist guided a "calm place" visualization and encouraged clients to identify personal cues that signal dysregulation, highlighting meditation as a skill to redirect cognitive focus and enhance self-soothing.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Meditation and Visualization';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist provided psychoeducation on the cognitive-emotional benefits of meditation, including enhanced self-observation, reduced intrusive thoughts, and improved impulse control. Clients were guided through a breathing-focused mindfulness meditation and a structured visualization intended to promote resilience and inner clarity. The therapist processed individual reactions to the exercise and encouraged clients to create personalized scripts for continued use outside of the program.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Meditation and Visualization';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a therapeutic group session focused on integrating meditation and visualization into clients'' coping toolkits. The therapist introduced diaphragmatic breathing as a preparatory step to deepen mental imagery and guided the group through a beach-based visualization intended to foster emotional detachment from intrusive thoughts. Clients were prompted to reflect on shifts in physiological arousal and explore the relevance of these techniques for managing anxiety and depressive symptoms.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Meditation and Visualization';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session emphasizing the restorative effects of mindfulness-based meditation and visual grounding strategies. Clients examined how intentional redirection of attention through imagery can reduce hypervigilance and ruminative cycles. A guided visualization of a healing light was used to support affect regulation and somatic awareness. Clients were encouraged to verbalize their emotional experience and identify cognitive distortions they noticed dissipating during the practice.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Meditation and Visualization';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced clients to the role of visualization in cognitive restructuring, particularly for those struggling with anticipatory anxiety. After discussing how imagery can interrupt maladaptive thought patterns, the therapist guided the group through a visualization of successfully navigating a personal challenge. Clients shared their emotional responses and discussed the potential of this practice for enhancing motivation and self-efficacy in future stress-inducing scenarios.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Meditation and Visualization';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on body-mind regulation using mindfulness meditation followed by a personalized visualization journey. Clients were invited to co-create a safe internal environment using sensory detail and symbolic representation of resilience. The therapist emphasized the role of visualization in activating neural pathways associated with calm and safety. Reflections included increased self-awareness, transient emotional release, and interest in using the technique as part of a daily regulation routine.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Meditation and Visualization';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in a structured exploration of meditation and guided visualization as tools for increasing emotional resilience. Psychoeducational content highlighted the evidence-based benefits of these practices in reducing cortisol levels and enhancing emotion regulation. The therapist facilitated a visualization centered on emotional grounding during interpersonal conflict. Clients were prompted to identify emotional triggers and envision self-soothing responses, reinforcing the link between visualization and proactive coping.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Meditation and Visualization';



