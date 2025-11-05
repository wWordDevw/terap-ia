-- =============================================
-- PÁRRAFOS PARA "BENEFITS OF MANAGING ACTIVITIES MUSIC/EXERCISES" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session exploring the therapeutic benefits of structured engagement in music and physical activity as relaxation techniques. Clients discussed how rhythmic movement and auditory stimulation can support affect regulation, reduce physiological arousal, and increase dopamine release. The therapist guided a reflective exercise on identifying personal preferences and barriers to integrating music and exercise into daily coping routines.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Benefits of Managing Activities Music/Exercises';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced evidence-based findings on how music and exercise promote neurochemical balance and emotional resilience. The group processed how structured engagement in these activities supports stress reduction, particularly through endorphin release and sensory grounding. Clients explored how consistent use of preferred songs or low-impact movement (e.g., stretching, walking) could enhance emotional well-being. Insight varied, with some clients expressing interest in incorporating these practices.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Benefits of Managing Activities Music/Exercises';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session focused on the role of music and physical activity in modulating stress and promoting a parasympathetic response. Clients examined how music-based routines (e.g., drumming, guided playlists) and moderate exercise can redirect maladaptive patterns such as rumination or agitation. The therapist encouraged clients to explore these techniques as preventive tools for managing early signs of dysregulation. Engagement was moderate, with clients identifying potential strategies to try independently.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Benefits of Managing Activities Music/Exercises';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on how participation in music and physical movement can serve as behavioral activation tools that combat inertia associated with depressive and anxious states. The therapist emphasized the psychological importance of rhythm, repetition, and personal meaning in these interventions. Clients identified songs or forms of movement that have previously promoted calm or energy, and were encouraged to use them intentionally during periods of emotional discomfort.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Benefits of Managing Activities Music/Exercises';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational group highlighting the physiological and psychological advantages of incorporating music and exercise into daily routines. Clients were educated on the stress-buffering effects of rhythmic regulation and cardiovascular activation. The therapist discussed how these strategies enhance self-efficacy, increase routine structure, and provide nonverbal emotional expression. Clients responded with mixed levels of interest, with some citing motivation as a barrier to implementation.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Benefits of Managing Activities Music/Exercises';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session examining the use of music and physical activity as accessible, low-cost strategies to manage emotional distress. The group explored how engaging with music that reflects or shifts mood can aid in emotional processing, while exercise contributes to physiological regulation. Clients were prompted to identify specific activities that align with their energy levels and emotional needs. While most demonstrated understanding, few verbalized intent to implement these techniques consistently.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Benefits of Managing Activities Music/Exercises';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group discussion on how integrating music and structured physical activity into daily life can mitigate symptoms of anxiety and depression. Clients reflected on previous experiences with dance, stretching, or calming playlists that brought relief or distraction. The therapist highlighted how such interventions support behavioral activation, self-expression, and routine-building. Although clients shared examples, limited follow-through on personalized action plans was observed.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Benefits of Managing Activities Music/Exercises';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session exploring how music and movement-based interventions can support emotional regulation and sensory grounding. Clients discussed how the tempo and lyrical content of music can influence cognitive focus and reduce intrusive thoughts. Exercise was framed as a method to increase endorphin levels and create a sense of mastery. The therapist encouraged participants to test simple, low-pressure routines, though most expressed uncertainty about where to begin.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Benefits of Managing Activities Music/Exercises';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a mindfulness-based session on how rhythmic activities like music and movement serve as anchors for emotional stability. Clients learned about the role of structured engagement in soothing physiological symptoms of stress and enhancing psychological resilience. The group completed a guided activity using ambient music and light stretching. While clients reported temporary relief, few expressed readiness to integrate these tools outside the group setting.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Benefits of Managing Activities Music/Exercises';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a strengths-based group exploring how self-directed use of music and exercise can promote empowerment and internal control during moments of emotional instability. Clients explored barriers to participation such as lack of time, low motivation, or shame about movement. The therapist emphasized gradual exposure and individual tailoring of activities. Insight was observed, yet behavioral application remained limited, suggesting the need for continued reinforcement.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Relaxation Techniques' AND sa.subactivity_name = 'Benefits of Managing Activities Music/Exercises';



