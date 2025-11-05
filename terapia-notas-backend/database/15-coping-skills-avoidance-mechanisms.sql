-- =============================================
-- PÁRRAFOS PARA "AVOIDANCE MECHANISMS" (26 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on *avoidance* as a common yet maladaptive mechanism for coping with distress. The therapist explained how both physical withdrawal and mental disengagement may provide temporary relief but ultimately reinforce anxiety and unresolved conflict. Clients reflected on situations in which avoidance delayed problem-solving, and strategies for gradual exposure were introduced as healthier alternatives.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group discussion on *denial* as a defensive strategy that refuses to acknowledge painful realities. The therapist highlighted how denial can initially protect the psyche from overwhelming affect but, over time, leads to distorted reality testing and emotional stagnation. Participants examined personal examples of minimizing or rejecting uncomfortable truths, and the therapist guided them toward cognitive reframing techniques to foster acceptance.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided an exploration of *fantasy* as an avoidance mechanism that offers escape from intolerable stressors. The therapist noted how immersion in imagined scenarios can provide short-term comfort but detracts from engagement with concrete challenges. Clients processed examples of withdrawing into fantasy when confronted with difficulties, and the session emphasized grounding practices to maintain balance between imagination and reality.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on *intellectualization* as a strategy to circumvent affective discomfort by overemphasizing logic. The therapist underscored how cognitive detachment may reduce immediate distress but limits emotional processing and relational authenticity. Group members practiced integrating affective awareness with rational analysis, fostering a more holistic response to stressors.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational intervention on *passive aggression* as an indirect form of avoidance. The therapist explained how resistance through sarcasm, procrastination, or intentional inefficiency serves to evade direct confrontation while expressing covert hostility. Clients reflected on interpersonal consequences of this mechanism, and assertive communication was modeled as a corrective approach.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on *regression* as an unconscious retreat to earlier developmental behaviors under stress. The therapist described how reverting to childlike patterns—such as dependency or helplessness—temporarily alleviates distress but undermines adult functioning. Clients examined personal examples of regressive behavior, and the therapist emphasized the importance of strengthening ego capacities through adaptive skills.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on *rationalization* as an avoidance strategy that creates seemingly logical justifications for maladaptive choices. The therapist highlighted how this mechanism masks accountability and reinforces cycles of avoidance. Clients practiced identifying rationalizations in their narratives, and corrective feedback was offered to promote insight and responsibility.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group exploration of *symbolization* as an unconscious avoidance mechanism in which intolerable thoughts are transformed into metaphor or symbolic imagery. The therapist explained how symbolization can displace anxiety into indirect forms of expression, often visible in dreams or repetitive behaviors. Clients processed examples of symbolic substitution and were guided to interpret meaning while moving toward conscious acknowledgment of the underlying issue.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on *avoidance* as a defense that provides temporary relief but maintains long-term dysfunction. The therapist explained how both physical withdrawal and cognitive detachment can shield individuals from distressing stimuli, yet ultimately reinforce anxiety and inhibit adaptive coping. Clients reflected on times they delayed confrontation, and the group explored gradual exposure as an alternative strategy.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session on *denial* as an unconscious mechanism that refuses to acknowledge painful realities. The therapist highlighted how denial protects the psyche in the short term but fosters distorted reality testing and delayed emotional processing. Group members examined personal examples where denial prolonged suffering, and the therapist introduced reframing exercises aimed at fostering acceptance and insight.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational intervention on *distancing* as a method of emotional disengagement. The therapist explained how detachment from situations or people perceived as threatening can prevent immediate discomfort, but it also restricts intimacy and problem resolution. Clients identified scenarios in which they relied on distancing, and the session emphasized healthy boundary-setting as a more adaptive alternative.',
    11
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on *fantasy* as an avoidance mechanism that offers temporary escape into imagined worlds. The therapist underscored how excessive reliance on fantasy can interfere with active problem-solving and engagement with reality. Clients processed their use of fantasy during times of stress, and mindfulness-based grounding techniques were introduced to encourage present-focused coping.',
    12
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group exploration of *intellectualization* as a strategy that prioritizes logic while minimizing affect. The therapist explained how focusing exclusively on rational arguments may reduce emotional intensity but simultaneously block authentic processing. Clients practiced integrating emotional language into narratives, reinforcing the therapeutic value of combining cognition and affect for holistic adaptation.',
    13
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a discussion on *passive aggression* as a covert avoidance mechanism. The therapist clarified how resistance through sarcasm, procrastination, or intentional inefficiency serves to evade direct confrontation. Group members analyzed the relational consequences of such behavior, and assertive communication techniques were modeled to promote healthier expression.',
    14
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on *regression* as a defense in which individuals unconsciously revert to earlier developmental stages. The therapist emphasized how behaviors such as dependency or helplessness may emerge under stress, offering temporary comfort but limiting functional autonomy. Clients identified personal examples and were encouraged to strengthen adult coping skills.',
    15
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on *repression* as an unconscious strategy of keeping unacceptable thoughts outside awareness. The therapist discussed how repressed material often reemerges in disguised forms, contributing to somatic complaints or intrusive thoughts. Clients reflected on the costs of repression, and the therapist underscored the importance of safe therapeutic spaces for gradual integration of suppressed content.',
    16
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group intervention on *trivializing* as an avoidance defense. The therapist explained how minimizing the significance of distressing issues reduces immediate tension but invalidates experiences and delays resolution. Participants reflected on times they downplayed serious problems, and the therapist reframed acknowledgment as a crucial step toward effective coping.',
    17
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on *acting out* as an avoidance mechanism. The therapist explained how impulsive behaviors often serve as a discharge of unresolved inner conflict, allowing individuals to bypass reflection and emotional processing. Clients shared examples of situations where they yielded to urges rather than tolerating discomfort, and the therapist introduced impulse-regulation strategies to support healthier coping.',
    18
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational intervention on *denial* as a defense that protects the Ego from intolerable realities. The therapist highlighted how refusal to acknowledge painful events may create short-term relief but undermines reality testing and emotional adjustment. Clients reflected on instances where denial delayed healing, and the session emphasized acceptance as a prerequisite for adaptive change.',
    19
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a discussion on *distancing* as a subtle avoidance response. The therapist described how emotional withdrawal and relational detachment can prevent immediate tension but also hinder intimacy and problem resolution. Participants examined situations where they created distance to avoid vulnerability, and strategies for maintaining healthy boundaries without withdrawal were introduced.',
    20
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group exploration of *fantasy* as a defensive escape. The therapist explained how retreating into imagined scenarios can soften distress but also impair engagement with real-life challenges. Clients reflected on their use of fantasy during stress, and grounding techniques were practiced to encourage present-moment awareness and balanced coping.',
    21
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session on *performing rituals* as an avoidance mechanism. The therapist explained how repetitive patterns or routines may provide temporary relief from anxiety while covertly delaying confrontation of the core issue. Clients explored their reliance on rituals during stressful moments, and the group discussed the difference between adaptive structure and maladaptive avoidance.',
    22
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on *projection* as an unconscious avoidance defense. The therapist explained how disowning unwanted feelings by attributing them to others helps reduce internal conflict but creates interpersonal distortion. Clients processed examples where projection escalated relational difficulties, and the therapist encouraged reflective practices to strengthen accountability and insight.',
    23
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session on *regression* as a reversion to earlier developmental stages under stress. The therapist highlighted how childlike behaviors such as dependency or helplessness may provide comfort while undermining functional autonomy. Clients reflected on examples of regressive tendencies, and the therapist emphasized the importance of ego strengthening and adult coping strategies.',
    24
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group exploration of *rationalization* as an intellectual strategy that masks avoidance. The therapist explained how creating logical justifications for maladaptive actions minimizes guilt but blocks self-awareness. Participants identified rationalizations in their own narratives, and corrective feedback was provided to promote authentic responsibility and growth.',
    25
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on *trivializing* as a mechanism of avoidance. The therapist discussed how minimizing significant problems can invalidate experiences and delay effective intervention. Clients reflected on times when they downplayed their struggles, and the therapist reframed acknowledgment of difficulties as a necessary step toward constructive resolution.',
    26
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Avoidance Mechanisms';
