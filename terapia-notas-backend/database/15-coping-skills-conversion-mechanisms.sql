-- =============================================
-- PÁRRAFOS PARA "CONVERSION MECHANISMS" (28 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on *conversion* as a defense mechanism where unresolved psychological distress manifests in physical symptoms. The therapist explained how unconscious intrapsychic conflict can present as bodily pain or dysfunction, masking the true emotional root. Clients reflected on personal experiences of somatic complaints linked to stress, and the group was guided to explore the importance of addressing psychological rather than purely physical dimensions.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group discussion on *somatization* as a conversion mechanism. The therapist highlighted how emotional conflict or anxiety may be unconsciously expressed through chronic fatigue, headaches, or gastrointestinal discomfort. Participants shared instances where their bodies "spoke" the unexpressed distress of their minds, and the therapist emphasized the therapeutic goal of integrating emotional awareness into health management.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a session on *sublimation* as a transformative coping strategy. The therapist described how instinctual drives and unresolved psychic tension can be redirected into socially acceptable or creative outlets. Clients examined examples where frustration or aggression had been channeled into art, exercise, or productive work, underscoring sublimation as one of the most adaptive forms of conversion.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group exploration of *substitution* as a cognitive conversion mechanism. The therapist explained how unmet desires or maladaptive behaviors are often replaced with safer alternatives, reducing distress while preserving functionality. Clients processed experiences of substituting unhealthy habits with constructive activities, reinforcing substitution as a stepping stone toward long-term adaptive change.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational intervention on *reaction formation* within the spectrum of conversion mechanisms. The therapist described how individuals unconsciously overcompensate by adopting an exaggerated opposite stance to conceal unacceptable impulses. Group members reflected on relational patterns where excessive virtue or compliance masked underlying hostility, and the session emphasized authenticity as a corrective path.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a discussion on *symbolization* as a conversion mechanism that translates forbidden or intolerable thoughts into metaphorical representations. The therapist explained how this process is often evident in dreams, symbolic rituals, or displaced imagery. Clients reflected on their own experiences of indirect expression, and the therapist guided them toward exploring the latent meaning beneath symbolic behaviors.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on *post-traumatic growth* as a constructive conversion process. The therapist highlighted how traumatic experiences, though painful, can be transformed into sources of resilience, meaning-making, and personal development. Clients shared examples of strength gained through adversity, and the therapist emphasized growth as a form of psychological reorganization that integrates suffering into a broader narrative of survival.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group intervention on *trivializing* as a subtle conversion mechanism. The therapist explained how minimizing the significance of painful events serves as a way to disguise the real issue behind a smaller frame, creating the illusion of reduced threat. Clients identified times when they trivialized distress to avoid confrontation, and the therapist reframed acknowledgment of difficulties as an essential step toward authentic coping.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group exploration of *conversion* as a defense mechanism where unresolved psychological stress manifests in somatic form. The therapist explained how unconscious intrapsychic conflict may be expressed through physical symptoms such as paralysis, loss of sensation, or chronic pain without medical explanation. Clients reflected on experiences of physical discomfort linked to emotional distress, and the session emphasized the need to address underlying psychological roots.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session on *somatization* as a conversion process. The therapist highlighted how anxiety, guilt, or unresolved conflict can surface as bodily complaints, masking emotional suffering. Clients discussed personal examples of psychosomatic illness, and the therapist reinforced the importance of integrating psychological assessment into physical health care.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a discussion on *sublimation* as one of the most adaptive conversion mechanisms. The therapist emphasized how psychic energy stemming from unacceptable impulses or stress can be redirected into socially constructive activities such as art, sports, or creative expression. Clients identified personal situations where sublimation transformed distress into productivity, underscoring its value for resilience.',
    11
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group intervention on *substitution* as a coping strategy that replaces harmful or unattainable objectives with safer alternatives. The therapist explained how this mechanism allows individuals to reduce frustration while maintaining functionality. Clients reflected on instances where they redirected maladaptive behaviors into healthier replacements, reinforcing substitution as a stepping stone toward long-term change.',
    12
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a session on *reaction formation* as a conversion defense. The therapist explained how intolerable impulses are concealed by exaggerated opposite behaviors, creating incongruence between internal states and external expression. Group members explored relational examples where rigid moral or virtuous postures masked underlying hostility, and authenticity was emphasized as a therapeutic objective.',
    13
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational intervention on *aim inhibition*. The therapist explained how individuals may unconsciously lower goals to shield themselves from the anxiety of potential failure. Clients reflected on personal experiences of setting "safer" objectives, and the therapist emphasized how incremental goal expansion can foster both self-efficacy and resilience.',
    14
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion on *post-traumatic growth* as a constructive conversion mechanism. The therapist underscored how traumatic experiences can catalyze meaning-making, personal transformation, and increased resilience. Clients shared examples of finding new strengths after adversity, and the session reframed trauma not only as loss, but also as an opportunity for profound reorganization.',
    15
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group discussion on *symbolization* as a conversion process in which distressing thoughts are transformed into metaphorical or symbolic representations. The therapist explained its frequent expression in dreams, rituals, or creative output. Clients processed examples of symbolic displacement in their lives, and the therapist encouraged them to explore the underlying meaning hidden beneath these representations.',
    16
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session on *trivializing* as a defense that diminishes the significance of distressing experiences. The therapist highlighted how this conversion mechanism reduces perceived threat but invalidates authentic emotions. Clients reflected on moments when they minimized personal struggles, and the group emphasized the importance of acknowledgment as the first step toward adaptive resolution.',
    17
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on *conversion* as a defense mechanism that translates unresolved psychological conflict into physical symptoms. The therapist explained how stress or inner conflict may manifest as bodily sensations, such as pain or paralysis, without a medical cause. Clients were encouraged to explore how somatic complaints can serve as a mask for unprocessed emotions, reinforcing the importance of integrating mind–body awareness.',
    18
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational intervention on *aim inhibition*. The therapist described how individuals may unconsciously lower their goals to avoid the threat of failure, thereby reducing anxiety at the expense of personal growth. Clients shared experiences of "settling" for less demanding tasks, and the group examined how incremental goal-setting can help balance self-protection with achievement.',
    19
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a discussion on *altruism* as a constructive conversion mechanism. The therapist emphasized how helping others often serves as an outlet for internal distress, transforming anxiety into prosocial behavior. Clients reflected on experiences where providing support to others enhanced their own sense of purpose, underscoring altruism as both adaptive and restorative.',
    20
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a session on *displacement* as a conversion strategy in which negative affect is redirected toward a safer target. The therapist illustrated how anger or frustration aimed at an inaccessible source may be unconsciously shifted onto someone less threatening. Clients examined relational consequences of displacement and were encouraged to explore healthier outlets for emotional expression.',
    21
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on *idealization* as a defense mechanism that amplifies the positive qualities of a person or situation while ignoring flaws. The therapist explained how this distortion may serve as a temporary buffer against disappointment but can impair authentic relationships. Clients reflected on times when idealization shaped their perceptions, and balanced appraisal was introduced as a corrective strategy.',
    22
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session on *post-traumatic growth* as a transformative coping process. The therapist highlighted how trauma, though painful, can catalyze personal development, resilience, and new perspectives on life. Clients shared examples of strengths discovered through adversity, reinforcing post-traumatic growth as a constructive form of psychological reorganization.',
    23
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on *reaction formation*. The therapist explained how intolerable impulses are unconsciously managed by adopting exaggerated opposite behaviors, creating incongruence between internal affect and outward expression. Clients explored personal examples of overcompensation and discussed how authenticity can reduce internal conflict.',
    24
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group exploration of *sublimation* as one of the most adaptive conversion mechanisms. The therapist underscored how psychic energy from unacceptable impulses can be redirected into creative, athletic, or professional pursuits. Clients identified personal practices where sublimation transformed distress into productivity, reinforcing its value for resilience and growth.',
    25
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on *substitution* as a mechanism that replaces unattainable or maladaptive goals with safer alternatives. The therapist described how substitution can reduce frustration and preserve self-esteem. Clients processed examples of replacing unhealthy behaviors with constructive choices, underscoring substitution as an important step in behavioral change.',
    26
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational intervention on *symbolization*. The therapist explained how unacceptable or distressing thoughts are often converted into metaphoric symbols, which may appear in dreams, rituals, or creative expression. Clients explored symbolic expressions in their own experiences and were guided to examine the underlying conflicts these may represent.',
    27
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on *trivializing* as a defensive conversion mechanism. The therapist highlighted how minimizing the seriousness of issues allows temporary avoidance but invalidates authentic emotional experience. Clients reflected on times when they downplayed distress, and the therapist reframed acknowledgment as a necessary step toward adaptive resolution.',
    28
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Conversion Mechanisms';
