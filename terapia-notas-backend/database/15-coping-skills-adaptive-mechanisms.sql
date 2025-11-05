-- =============================================
-- PÁRRAFOS PARA "ADAPTIVE MECHANISMS" (22 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on *adaptation* as an essential human capacity for maintaining psychological equilibrium. The therapist emphasized how individuals recalibrate internal responses to align with external demands, thereby reducing distress and enhancing resilience. Clients were invited to identify situations in which adaptive flexibility promoted stability during periods of change, highlighting adaptation as a foundation for healthy coping.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group exploration of *compartmentalization* as an adaptive mechanism that allows the Ego to separate conflicting cognitions or emotions into distinct domains. The therapist discussed how this strategy can protect individuals from being overwhelmed by dissonant thoughts, while also warning against rigid fragmentation that may inhibit integration. Clients reflected on experiences where compartmentalization created short-term relief but required eventual reconciliation for sustained well-being.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a discussion on *compensation* as a constructive coping mechanism. The group examined how individuals may overinvest in one area of functioning to balance perceived deficits in another. The therapist highlighted how compensation, when consciously directed, can enhance self-esteem and mastery rather than masking vulnerabilities. Participants were encouraged to reframe compensatory behaviors as opportunities for growth rather than avoidance.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on *crying* as a natural release mechanism associated with emotional catharsis. Clients explored how tears not only serve as a biological discharge of tension but also signal vulnerability and elicit social support. The therapist normalized crying as a restorative process, emphasizing its role in affect regulation and relational bonding. Group members reflected on cultural and personal barriers that limit acceptance of this adaptive behavior.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group discussion on *idealization* as an adaptive mechanism that can promote hope and motivation when directed appropriately. The therapist highlighted how focusing on the positive qualities of people or circumstances may help individuals navigate stress, while also cautioning against over-idealization that distorts reality. Clients processed examples where selective attention to strengths fostered resilience and facilitated perseverance during adversity.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational intervention on *post-traumatic growth*, underscoring how trauma, while distressing, can catalyze profound personal development. The therapist introduced narratives of individuals who transformed suffering into opportunities for meaning-making, spiritual expansion, and redefined values. Clients were invited to consider ways in which their own adversity had generated inner strength, reinforcing post-traumatic growth as an advanced adaptive process.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group activity on *sublimation* as one of the most mature adaptive mechanisms. Clients explored how channeling instinctual energy into socially constructive pursuits enhances ego functioning and provides a safe outlet for tension. The therapist encouraged participants to identify personal practices, such as art, exercise, or community service, where sublimation operates naturally. The session emphasized sublimation''s role in transforming inner conflict into productive action.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session exploring *compartmentalization* as a strategy for managing internal conflict. The therapist explained how individuals separate contradictory thoughts or emotions into distinct mental categories, thus reducing cognitive dissonance and preserving ego stability. The group discussed both the short-term relief this provides and the long-term need for integration to avoid fragmentation.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group intervention on *compensation* as a mechanism for balancing perceived inadequacies. Clients reflected on how overinvesting in certain abilities or roles can bolster self-esteem when other areas feel deficient. The therapist emphasized the adaptive potential of compensation when used consciously, while noting that excessive reliance may mask deeper vulnerabilities that require acknowledgment.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational discussion on *crying* as a natural form of emotional release. The group examined how tears not only facilitate physiological regulation but also invite social support and comfort. The therapist normalized crying as an adaptive outlet for distress, counteracting cultural stigmas that often frame it as weakness. Participants identified moments when allowing themselves to cry fostered clarity and relief.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an exploration of *identification* as an adaptive coping strategy. The therapist highlighted how modeling oneself after valued figures can support ego development, foster social belonging, and strengthen resilience. Clients considered examples of internalizing positive traits from mentors, peers, or cultural figures. The session reinforced the importance of discerning which characteristics enhance self-concept versus those that perpetuate dependency.',
    11
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group process on *intellectualization* as a way of maintaining equilibrium by prioritizing logic over affect. The therapist guided clients to recognize how focusing on rational explanations can provide a buffer against overwhelming emotions but may also hinder authentic processing. Group members practiced integrating factual reasoning with emotional awareness, cultivating a more balanced coping approach.',
    12
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on *performing rituals* as an adaptive mechanism that provides structure and cognitive space. Clients reflected on how routines and repetitive actions can reduce anxiety by offering predictability during times of uncertainty. The therapist reframed ritualistic behaviors as opportunities for grounding and reflection, while distinguishing between adaptive ritualization and compulsive patterns.',
    13
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion on *post-traumatic growth*, highlighting how adversity can catalyze transformative change. The therapist underscored how trauma, while painful, can foster resilience, redefined priorities, and deeper meaning-making. Clients shared examples of personal strengths that emerged from hardship, reframing suffering as a potential source of psychological expansion rather than limitation.',
    14
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided the group in exploring *undoing* as a coping strategy aimed at symbolically reversing perceived wrongdoings. The therapist explained how corrective actions may reduce guilt and restore a sense of equilibrium for the Ego. Clients reflected on situations where reparative gestures alleviated inner conflict. The session emphasized the distinction between symbolic undoing and genuine accountability in interpersonal repair.',
    15
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on *adaptation* as a fundamental mechanism of coping. The therapist highlighted how the capacity to adjust to new circumstances allows individuals to restore equilibrium in the face of stressors. Clients reflected on recent life changes where flexibility promoted stability, and the discussion underscored adaptation as a marker of psychological resilience.',
    16
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational intervention on *displacement* as an adaptive mechanism for managing affect. The group explored how shifting emotional energy toward safer targets can prevent direct confrontation with threatening stimuli. While recognizing its protective function, the therapist emphasized the need to channel displacement into constructive outlets to avoid relational strain.',
    17
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a discussion on *idealization* as a coping strategy that can reinforce hope and motivation during adversity. Clients examined how emphasizing the strengths of a person or circumstance can buffer against despair, while also acknowledging the risks of neglecting limitations. The therapist guided participants toward using idealization consciously, as a temporary support rather than a distortion of reality.',
    18
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group exploration of *identification* as an ego-strengthening process. The therapist explained how modeling oneself after admired figures may foster belonging and internalize adaptive traits. Clients shared examples of adopting positive characteristics from mentors or peers, reinforcing identification as a mechanism that supports development and social integration.',
    19
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a session on *substitution* as an adaptive approach to redirect harmful patterns. The group examined how replacing maladaptive behaviors with healthier alternatives facilitates both self-regulation and growth. The therapist highlighted substitution as a practical strategy for habit change, encouraging clients to view it as a stepping stone toward deeper therapeutic work.',
    20
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session on *undoing* as a mechanism that symbolically repairs guilt-inducing behaviors. The therapist explained how corrective gestures can reduce inner conflict and restore self-coherence. Clients processed examples of attempts to "make things right" after interpersonal tension, distinguishing between symbolic undoing and authentic accountability.',
    21
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion on *post-traumatic growth* as an advanced form of coping. The therapist introduced the concept of transforming traumatic experiences into opportunities for meaning-making, resilience, and personal redefinition. Clients reflected on strengths gained from adversity, with the session emphasizing growth as an integrative outcome of adaptive processing.',
    22
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Adaptive Mechanisms';
