-- =============================================
-- PÁRRAFOS PARA "COGNITIVE MECHANISMS" (27 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on *aim inhibition* as a cognitive mechanism used to manage frustration and fear of failure. The therapist explained how individuals may unconsciously lower their goals to preserve self-esteem and reduce anxiety. Clients reflected on instances where they set modest objectives to avoid disappointment, and the session emphasized graded goal-setting as a healthier approach.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session on *altruism* as a cognitive defense that transforms internal conflict into prosocial behavior. The therapist highlighted how helping others can serve both as a means of self-regulation and as a strategy for reducing personal distress. Clients shared examples of deriving meaning and relief through altruistic acts, reinforcing the adaptive value of this mechanism.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group exploration of *compartmentalization* as a strategy to manage internal contradictions. The therapist described how separating conflicting thoughts or emotions into distinct domains may help maintain temporary equilibrium, but also prevents full integration of the self. Clients examined personal examples, and the therapist encouraged recognition of compartmentalization patterns that interfere with authenticity.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on *conversion* as a cognitive mechanism in which psychological conflict is transformed into somatic symptoms. The therapist explained how stress may manifest through headaches, gastrointestinal distress, or other physical complaints. Clients reflected on mind–body connections in their own experiences, and the group emphasized the importance of addressing psychological roots rather than focusing solely on physical manifestations.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group intervention on *dissociation* as a coping strategy. The therapist explained how detaching from reality or separating from parts of lived experience may protect against acute distress but risks impairing continuity of identity. Participants processed experiences of "disconnecting" under stress, and grounding techniques were introduced to enhance self-awareness and presence.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational discussion on *introjection* as a defense mechanism. The therapist clarified how individuals internalize attitudes, beliefs, or attributes of others, often unconsciously, as a way of coping with conflict or insecurity. Clients identified positive and negative instances of introjection in their lives, and the session emphasized the importance of developing autonomous self-definition.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on *rationalization* as a cognitive defense that provides plausible justifications for maladaptive behavior. The therapist highlighted how rationalization shields the Ego from guilt while maintaining distorted self-perceptions. Clients reflected on common rationalizations they use, and the therapist guided them toward cultivating accountability and more realistic self-appraisal.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group discussion on *somatization* as a mechanism in which psychological distress converts into bodily symptoms. The therapist explained how unresolved affect may manifest as fatigue, chronic pain, or other physical complaints. Clients processed their own experiences with psychosomatic symptoms, and the therapist emphasized the importance of integrating emotional awareness into health management.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group intervention on *suppression* as a conscious cognitive strategy. The therapist described how intentionally holding back unwanted thoughts or urges may help individuals function temporarily, but risks creating long-term tension. Clients explored times when suppression was useful, and the session focused on balancing restraint with constructive emotional expression.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on *aim inhibition* as a mechanism through which individuals lower their aspirations to minimize the risk of failure. The therapist explained how this process can reduce anxiety temporarily but also limit growth and achievement. Clients discussed personal experiences of setting "safer" goals, and the therapist emphasized graded exposure to challenges as a path toward resilience.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group intervention on *altruism* as a cognitive mechanism that transforms personal distress into prosocial action. The therapist highlighted how helping others often functions as a way to regulate one''s own anxiety and foster a sense of meaning. Clients reflected on times they experienced relief through altruistic behaviors, reinforcing altruism as both adaptive and socially beneficial.',
    11
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group exploration of *compartmentalization* as a defense that separates conflicting emotions into distinct mental domains. The therapist explained how this strategy reduces inner conflict in the short term but interferes with authenticity and integration of the self. Clients identified moments when compartmentalization created distance from their feelings, and the session emphasized healthier integrative practices.',
    12
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on *conversion* as a mechanism where unresolved psychological tension manifests in physical symptoms. The therapist described the link between stress and somatic complaints, underscoring the importance of addressing psychological roots rather than focusing solely on physical manifestations. Clients shared examples of somatic distress linked to stress, and the therapist guided them in exploring psychosomatic connections.',
    13
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group process on *dissociation* as a cognitive defense that separates the self from distressing aspects of reality. The therapist explained how dissociation can serve as a protective strategy during overwhelming stress but risks fragmenting continuity of identity. Clients reflected on experiences of feeling "detached" or "numb," and grounding strategies were introduced to restore presence and cohesion.',
    14
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational discussion on *idealization* as a defense mechanism that emphasizes only positive attributes while neglecting limitations. The therapist explained how this can create unrealistic expectations in relationships and hinder genuine connection. Clients explored personal examples of idealization and were guided toward balanced appraisal as a step toward healthier relational dynamics.',
    15
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group intervention on *intellectualization* as a strategy of overreliance on rational thought to avoid emotional discomfort. The therapist explained how intellectualization may offer temporary stability but blocks affective expression and authentic processing. Clients practiced incorporating both cognitive and emotional perspectives into their narratives, strengthening emotional literacy and self-awareness.',
    16
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group session on *suppression* as a conscious mechanism of deliberately postponing unwanted thoughts. The therapist differentiated suppression from repression, emphasizing its intentional nature. Clients reflected on times they intentionally held back distressing thoughts to function effectively, and the therapist framed suppression as potentially adaptive when paired with planned emotional processing.',
    17
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion on *symbolization* as a defense where unacceptable impulses are expressed indirectly through metaphor, imagery, or symbolic acts. The therapist highlighted its presence in dreams, creative expression, and repetitive behaviors. Clients processed personal experiences where symbolic representation masked deeper conflicts, and the session underscored the importance of interpretation and insight to move toward resolution.',
    18
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on *aim inhibition* as a cognitive strategy used to lower personal aspirations in order to reduce the fear of failure. The therapist explained how this mechanism can temporarily safeguard self-esteem, yet may also limit growth and motivation. Clients reflected on personal examples of setting overly modest goals, and the therapist encouraged them to explore gradual exposure to more challenging objectives.',
    19
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational discussion on *altruism* as a mechanism that transforms intrapsychic conflict into prosocial behavior. The therapist emphasized how engaging in acts of service often regulates personal anxiety and strengthens meaning-making. Group members shared examples of how helping others provided them with relief, reinforcing altruism as a constructive coping strategy.',
    20
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group intervention on *conversion* as a cognitive mechanism that channels unresolved stress into physical manifestations. The therapist highlighted the psychodynamic link between unconscious conflict and psychosomatic symptoms such as headaches, fatigue, or gastrointestinal discomfort. Clients processed their own experiences of stress-related somatic complaints, and the therapist emphasized the value of integrated mind–body awareness.',
    21
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group exploration of *dissociation* as a defense mechanism. The therapist explained how separating from aspects of lived experience can offer temporary protection against overwhelming affect but risks impairing cohesion of identity. Clients reflected on times when dissociation left them feeling detached or fragmented, and grounding strategies were introduced to promote present-moment awareness.',
    22
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session on *identification* as a cognitive defense in which individuals internalize the attributes or behaviors of others. The therapist described how this process can foster belonging and ego strengthening, while also highlighting risks of dependency and loss of authenticity. Participants discussed examples of adopting traits from mentors or peers, and the therapist encouraged selective internalization of adaptive characteristics.',
    23
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a discussion on *intellectualization* as a mechanism of detachment from emotional intensity. The therapist explained how focusing solely on rational analysis provides temporary control but restricts emotional processing. Clients practiced combining factual reasoning with affective expression to promote psychological integration and enhance interpersonal authenticity.',
    24
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group session on *projection* as an unconscious cognitive mechanism in which unwanted impulses are attributed to others. The therapist emphasized how projection temporarily reduces intrapsychic conflict but distorts relationships and reality testing. Clients shared moments where projection escalated interpersonal conflict, and reflective practices were introduced to increase accountability and insight.',
    25
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group exploration of *somatization* as a manifestation of psychological distress in physical symptoms. The therapist explained how unresolved conflicts may surface as chronic pain, fatigue, or other bodily complaints. Clients reflected on their own somatic experiences, and the group was encouraged to integrate emotional awareness into their health management practices.',
    26
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational intervention on *suppression* as a conscious mechanism that intentionally postpones distressing thoughts. The therapist clarified its difference from repression, underscoring that suppression involves deliberate control rather than unconscious exclusion. Clients processed situations where suppression was adaptive in the short term, and the session emphasized the importance of scheduling time for emotional processing.',
    27
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Coping Skills' AND sa.subactivity_name = 'Cognitive Mechanisms';
