-- =============================================
-- PÁRRAFOS PARA "DEFENSE MECHANISMS" (23 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session exploring the role of *denial* as a defense mechanism commonly activated under conditions of *reality anxiety*. The therapist highlighted how denial temporarily reduces distress by rejecting threatening stimuli, yet perpetuates maladaptive avoidance. Clients were encouraged to reflect on situations in which they minimized risks or dismissed consequences to alleviate fear. Through guided processing, the therapist emphasized the importance of reality testing and cognitive restructuring as more adaptive alternatives.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational intervention on *projection* as a defense mechanism related to *neurotic anxiety*. Clients explored how unconscious fears of losing control over instinctual impulses often manifest as attributing undesirable feelings to others. The therapist facilitated group exercises where participants identified instances of externalizing internal conflicts, drawing attention to the relational strain this produces. Psychoanalytic interpretation was introduced to increase insight into unconscious dynamics and foster accountability.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a discussion on *moral anxiety* and its link to defense mechanisms such as *reaction formation*. The therapist explained how guilt or shame may be unconsciously transformed into exaggerated opposite behaviors, masking the underlying impulse. Clients analyzed real-life examples where overcompensation was used to preserve self-image while intensifying internal conflict. The therapist guided participants in recognizing the cost of this defense and introduced mindfulness practices to tolerate dissonance without resorting to rigid behavioral extremes.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session examining the defensive operation of *intellectualization* as a response to overwhelming affect. Clients were invited to recognize how reliance on abstract reasoning serves to distance the self from distress, particularly when facing interpersonal challenges. The therapist modeled language that integrates cognitive and emotional domains, underscoring the therapeutic goal of enhancing affect regulation. Group members practiced reframing personal narratives with balanced attention to both thought content and emotional resonance.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided clients through an exploration of *sublimation* as an adaptive defense mechanism contrasted with maladaptive strategies such as *repression*. The discussion focused on how channeling unacceptable drives into socially constructive outlets promotes psychological resilience while preserving internal equilibrium. Clients were encouraged to identify personal activities where sublimation has been spontaneously employed and to consider how this mechanism can be intentionally strengthened. The therapist emphasized sublimation''s role in long-term ego development and conflict resolution.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session addressing *reality anxiety* and its connection to the defensive operation of *avoidance*. The discussion emphasized how fear of tangible threats often activates denial or withdrawal as immediate strategies of tension reduction. Clients were guided to explore recent instances in which they minimized or fled from external stressors. The therapist reframed avoidance as an unconscious attempt at ego protection while introducing grounding techniques to strengthen reality testing and adaptive coping.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group process exploring *neurotic anxiety* as it arises from unconscious conflicts between the Id and the Ego. The therapist highlighted how mechanisms such as *repression* and *displacement* emerge when instinctual drives provoke internal alarm. Participants reflected on moments when they redirected affect toward safer substitutes rather than confronting the original source. The intervention underscored the role of insight and affect regulation in dismantling entrenched avoidance patterns.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session examining *moral anxiety* as the product of the Superego''s internalized prohibitions. The group analyzed how guilt and shame frequently trigger *reaction formation*, wherein unacceptable impulses are masked by exaggerated virtue. The therapist encouraged clients to identify areas in which rigid overcompensation limited authenticity and emotional flexibility. Strategies for balanced self-evaluation were discussed to foster healthier integration of moral standards.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a discussion on *intellectualization* as a defense mechanism often employed when emotional intensity feels overwhelming. Clients were invited to explore how distancing through abstract reasoning can provide temporary relief while also impeding authentic affective processing. The therapist modeled language that blended cognitive interpretation with emotional acknowledgment, reinforcing the therapeutic aim of integrating thought and feeling for more adaptive functioning.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided the group through an exploration of *projection* and its impact on interpersonal relationships. The session emphasized how attributing unwanted internal states to others allows for a temporary reduction of tension but perpetuates conflict and mistrust. Through role-play, clients practiced differentiating between subjective perception and external reality. The therapist introduced reflective questioning techniques to counteract distortion and promote self-awareness in relational dynamics.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an intervention centered on *sublimation* as an adaptive defense mechanism contrasted with maladaptive strategies like *regression*. The discussion highlighted how channeling instinctual drives into creative or prosocial outlets contributes to ego strength and resilience. Clients shared examples of transforming frustration into constructive action, reinforcing sublimation as a mature coping resource. The therapist underscored its role in long-term psychological growth and integration of unconscious material.',
    11
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session exploring the unconscious use of *denial* as a primary defense mechanism in the context of *reality anxiety*. The group examined how individuals often minimize or negate threatening circumstances to avoid psychological discomfort. The therapist emphasized the function of denial as a temporary shield for the Ego, while highlighting its long-term limitations in adaptive coping. Psychoeducation was provided on the importance of gradually confronting avoided realities to promote resilience.',
    12
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational intervention focused on *neurotic anxiety* and the emergence of *repression* as a defense strategy. Clients reflected on how unconscious drives may be forcefully excluded from awareness, leading to heightened internal conflict and somatic tension. The therapist encouraged exploration of how unresolved impulses often resurface in disguised forms. Insight-oriented questions were introduced to foster awareness of repressed material and its role in perpetuating anxiety.',
    13
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group discussion on *moral anxiety* and the Ego''s reliance on *reaction formation* to manage feelings of guilt or shame. Participants analyzed how exaggerated adherence to moral codes can conceal unconscious desires deemed unacceptable by the Superego. The therapist explained the defensive nature of overcompensation, underscoring the importance of authenticity and balanced self-concept. Clients were supported in identifying healthier ways of reconciling personal values with inner conflicts.',
    14
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an intervention centered on *intellectualization* as a means of detaching from distressing affect. The group examined how an overreliance on abstract reasoning can distort emotional processing, leaving individuals disconnected from authentic experience. The therapist provided corrective feedback, modeling integrative responses that combined cognitive analysis with emotional acknowledgment. Clients practiced reframing personal narratives to incorporate both rational thought and affective awareness.',
    15
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on the defensive operation of *projection*, particularly its impact on interpersonal functioning. Clients explored how attributing unwanted impulses or emotions to others provides temporary relief but fosters relational conflict and miscommunication. The therapist facilitated role-play exercises that illuminated discrepancies between internal affect and external attribution. Reflective practices were introduced to strengthen ego awareness and reduce reliance on projection in daily interactions.',
    16
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group exploration of *sublimation* as a mature and adaptive defense mechanism. The therapist emphasized how instinctual impulses, when redirected into creative or socially valued pursuits, can strengthen ego functioning and diminish intrapsychic tension. Participants were encouraged to identify instances in which sublimation had facilitated constructive outcomes in their lives. The session highlighted sublimation as an essential pathway for psychological growth and integration of unconscious material.',
    17
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on the role of *denial* as a primitive defense mechanism often activated under *reality anxiety*. The discussion explored how individuals unconsciously distort threatening external stimuli by refusing to acknowledge their existence. The therapist emphasized that although denial provides temporary relief, it impedes adaptive coping and reality testing. Clients were guided to identify patterns of avoidance and consider more constructive strategies to face distressing circumstances.',
    18
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group intervention examining *neurotic anxiety* and its link to unconscious drives of the Id. The therapist introduced the concept of *displacement* as a defense mechanism, highlighting how intense affect is redirected toward safer targets. Group members reflected on situations in which anger or fear was projected onto substitute objects or relationships. The therapist framed displacement as a protective but ultimately maladaptive strategy that maintains internal conflict.',
    19
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a clinical discussion on *moral anxiety* and its manifestation in feelings of guilt and shame imposed by the Superego. The focus was on *reaction formation* as a defensive process, whereby unacceptable impulses are masked by exaggerated opposing behaviors. Clients processed examples of overcompensatory actions that concealed deeper ambivalence. The therapist underscored the importance of self-reflection and balance in navigating superego demands without rigid overcorrection.',
    20
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an exploration of *intellectualization* as a common strategy to minimize anxiety through excessive reliance on logic. Clients analyzed how emotional detachment allows for temporary stabilization of the Ego but simultaneously obstructs authentic emotional processing. The therapist modeled integrative dialogue combining rational evaluation with affective expression, encouraging participants to practice reframing narratives in ways that included both cognitive and emotional perspectives.',
    21
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a session on *projection* as a defense mechanism that externalizes unwanted impulses by attributing them to others. The discussion illuminated how this distortion of reality reduces intrapsychic tension but creates interpersonal conflict and mistrust. Clients engaged in exercises aimed at differentiating between internal affect and external perception. The therapist introduced reflective questioning techniques to increase ego awareness and diminish reliance on projection as a habitual defense.',
    22
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group process highlighting *sublimation* as a mature defense mechanism that channels instinctual energy into socially acceptable outlets. The therapist contrasted sublimation with maladaptive strategies such as *regression* and *repression*, emphasizing its adaptive role in ego strengthening. Clients shared personal examples of transforming impulses into creative or prosocial pursuits. The session reinforced sublimation as a pathway to psychological growth, adaptive functioning, and tension reduction.',
    23
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Defense Mechanisms';
