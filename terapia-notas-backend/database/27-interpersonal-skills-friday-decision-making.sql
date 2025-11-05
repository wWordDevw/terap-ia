-- =============================================
-- PÁRRAFOS PARA "DECISION MAKING" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on decision-making frameworks for interpersonal situations. Clients learned the DECIDE model (Define, Explore, Consider, Identify, Decide, Evaluate) and practiced applying it to relationship choices. The therapist emphasized the importance of gathering information and considering multiple perspectives before making decisions that affect others. Participants engaged in group exercises to practice these skills.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on identifying personal values and how they influence interpersonal decision-making. Clients explored their core beliefs and how these impact choices in relationships. The therapist guided participants through exercises to clarify their priorities and boundaries. The group discussed how understanding personal values can lead to more authentic and satisfying relationship decisions.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skills-building session on collaborative decision-making in relationships. Clients practiced techniques for involving others in the decision-making process while maintaining personal autonomy. The therapist taught methods for seeking input, weighing options together, and reaching consensus. Participants role-played scenarios involving joint decisions with family members or partners.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on managing emotions during difficult interpersonal decisions. Clients learned to recognize when strong emotions might cloud judgment and practiced techniques for emotional regulation. The therapist introduced the concept of "cooling off" periods and seeking support when facing challenging relationship choices. Several clients shared personal examples and received feedback.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on evaluating the consequences of interpersonal decisions. Clients practiced considering both short-term and long-term impacts of their choices on relationships. The therapist taught techniques for anticipating potential outcomes and preparing for different scenarios. Participants engaged in exercises to develop contingency plans for their decisions.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational group on decision-making under pressure in interpersonal contexts. Clients learned to identify when they feel rushed or pressured to make quick decisions. The therapist taught techniques for buying time, gathering more information, and seeking advice when appropriate. The group practiced assertiveness skills for setting boundaries around decision-making timelines.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a session on learning from past interpersonal decision-making mistakes. Clients reflected on previous choices that had negative consequences for relationships. The therapist guided participants through exercises to identify patterns and develop strategies for avoiding similar mistakes. The group discussed how to repair relationships after poor decisions and rebuild trust.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a skills-based session on communicating decisions effectively to others. Clients practiced delivering difficult news or unpopular choices in a respectful and clear manner. The therapist taught techniques for explaining reasoning, acknowledging others'' feelings, and offering support during transitions. Participants role-played various scenarios involving challenging interpersonal communications.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session on building confidence in interpersonal decision-making. Clients explored common fears and insecurities that prevent them from making choices in relationships. The therapist introduced techniques for building self-trust and learning to tolerate uncertainty. The group practiced making small decisions and gradually building up to more significant relationship choices.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on creating decision-making support systems. Clients learned to identify trusted individuals who can provide perspective and guidance on relationship choices. The therapist emphasized the importance of seeking diverse viewpoints while maintaining personal autonomy. Participants practiced asking for advice effectively and evaluating the quality of input received.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Decision Making';



