-- =============================================
-- PÁRRAFOS PARA "ATTACK MECHANISMS" (20 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on *acting out* as a maladaptive coping response. The therapist explained how individuals may externalize internal distress through impulsive or disruptive behavior rather than engaging in reflective processing. The group analyzed how acting out provides immediate release but ultimately undermines self-regulation. Clients were encouraged to explore alternative methods of tension management that reinforce ego strength.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group exploration of *displacement* within the spectrum of attack mechanisms. The discussion highlighted how frustration or hostility often becomes redirected toward less threatening targets, creating relational strain. The therapist emphasized that although displacement temporarily relieves internal pressure, it perpetuates conflict when not recognized. Clients reflected on instances where redirected aggression masked the true source of distress.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session on the *fight-or-flight reaction*, emphasizing its evolutionary roots in survival but also its maladaptive manifestation in interpersonal contexts. The therapist explained how aggression may emerge as a defensive response to perceived threat, even in non-threatening environments. Group members examined personal triggers that activate physiological arousal, and grounding strategies were introduced to interrupt automatic attack responses.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a discussion on *passive aggression* as a covert form of hostility. Clients processed how indirect behaviors, such as procrastination, sarcasm, or intentional inefficiency, can serve as disguised attacks against others. The therapist underscored the unconscious dynamics of resentment and avoidance underlying passive aggression, encouraging the development of direct communication as a healthier alternative.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on *projection* as an attack mechanism. The group examined how attributing one''s own unacceptable feelings to others provides temporary relief from guilt but erodes trust and interpersonal functioning. The therapist highlighted the importance of self-reflection in differentiating between internal affect and external reality, reinforcing projection as a defense that distorts relationships.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group intervention on *reaction formation* within the context of aggressive defenses. The therapist explained how individuals unconsciously mask unacceptable impulses by adopting the opposite stance, often in exaggerated form. Clients discussed how rigid adherence to opposite behaviors can conceal unresolved hostility and reinforce internal conflict. The session emphasized the therapeutic value of confronting ambivalence directly.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion on *trivializing* as a defensive attack mechanism. The therapist explained how minimizing the significance of threatening issues may function as a subtle invalidation of others'' experiences, thereby maintaining emotional distance. Clients reflected on times when they downplayed serious matters to avoid confrontation. The therapist reframed trivializing as a defense that can harm trust and encouraged acknowledgment of issues in their true proportion.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on *acting out* as a maladaptive strategy for handling inner conflict. The therapist explained how impulsive or disruptive behaviors serve as external discharges of internal pressure, bypassing reflective processing. Clients identified situations where they gave in to frustration rather than addressing the underlying affect. The intervention emphasized the need for impulse regulation and constructive expression of emotions.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational intervention on *displacement* within the framework of attack mechanisms. The therapist highlighted how anger or hostility often becomes redirected toward safer, less threatening targets. Group members explored the unconscious relief this provides and the collateral damage it causes to relationships. Clients were encouraged to recognize displacement in real time and redirect energy into adaptive outlets.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a discussion on the *fight-or-flight reaction* as a primitive response to perceived threat. The group examined how physiological arousal may predispose individuals to aggressive responses even in non-threatening interpersonal contexts. The therapist explained the neurobiological basis of hyperarousal and guided clients in practicing grounding skills to interrupt automatic aggressive patterns.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group process on *passive aggression* as a covert form of attack. Clients analyzed how indirect resistance, such as procrastination, sarcasm, or intentional inefficiency, allows resentment to be expressed without open confrontation. The therapist emphasized how passive aggression erodes trust and perpetuates interpersonal conflict. Participants were introduced to assertive communication as an alternative strategy.',
    11
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided an exploration of *projection* as an attack mechanism that distorts interpersonal perception. The therapist explained how attributing one''s own unacceptable impulses to others reduces internal guilt but fosters relational hostility. Clients reflected on times when projection created unnecessary conflict and distorted reality testing. The intervention reinforced the importance of self-reflection and accountability to diminish reliance on projection.',
    12
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session on *reaction formation* within the spectrum of aggressive defenses. The therapist explained how adopting a polar-opposite stance conceals underlying hostility, often manifesting in exaggerated displays of virtue or compliance. Clients discussed how this defense complicates authentic communication and perpetuates ambivalence. The group was encouraged to recognize incongruence between inner affect and outward behavior.',
    13
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion on *trivializing* as a mechanism that minimizes significant issues to avoid discomfort. The therapist explained how diminishing the weight of a problem can act as a subtle attack on the experiences of others by invalidating their perspective. Clients explored instances where trivialization escalated interpersonal conflict. The therapist highlighted the importance of acknowledging problems proportionately as a pathway toward resolution.',
    14
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group exploration of *acting out* as an externalized response to unresolved intrapsychic conflict. The therapist explained how impulsive behaviors represent a bypass of reflective capacity, leading to short-term relief but long-term maladjustment. Clients reflected on situations where frustration translated directly into misbehavior, and the session emphasized impulse regulation strategies as healthier alternatives.',
    15
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session on *displacement* as an aggressive defense mechanism. The therapist highlighted how hostility toward an unsafe or inaccessible target is unconsciously redirected to a safer substitute. Clients shared examples where anger was projected onto unrelated relationships, and the therapist emphasized the relational damage caused when underlying conflicts remain unaddressed.',
    16
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group discussion on the *fight-or-flight reaction* as an automatic physiological response to perceived threat. The therapist explained how hyperarousal can manifest in disproportionate aggression, particularly in interpersonal contexts that do not warrant such intensity. Clients examined their own triggers and practiced grounding techniques to reduce reactivity and promote self-control.',
    17
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a process group on *passive aggression* as an indirect manifestation of hostility. The therapist explained how covert resistance, through sarcasm, withdrawal, or intentional inefficiency, serves to undermine relational dynamics. Clients analyzed patterns of masked resentment and were encouraged to practice assertive communication to decrease reliance on passive-aggressive behaviors.',
    18
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session examining *projection* as an attack mechanism that externalizes unwanted impulses. The therapist clarified how attributing unacceptable affect to others may temporarily relieve guilt but distorts interpersonal perception. Group members reflected on past conflicts intensified by projection, and the therapist introduced self-monitoring tools to promote accountability and reduce distortion.',
    19
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion on *trivializing* as a subtle yet harmful attack mechanism. The therapist highlighted how minimizing the significance of important issues invalidates others'' experiences and serves as a covert expression of hostility. Clients processed moments when trivialization escalated relational conflict, and the therapist encouraged proportional acknowledgment of problems as a foundation for conflict resolution.',
    20
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Attack Mechanisms';
