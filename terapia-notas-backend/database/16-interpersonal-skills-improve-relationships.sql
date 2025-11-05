-- =============================================
-- PÁRRAFOS PARA "IMPROVE RELATIONSHIPS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured session on enhancing interpersonal relationships by identifying patterns of miscommunication and emotional disengagement. Clients explored how unresolved past experiences and maladaptive relational schemas often lead to recurring conflict or detachment. The therapist introduced reflective listening and emotional validation as foundational tools to promote empathy and improve relational dynamics. Although the client listened attentively, they demonstrated limited insight into their own relational patterns and did not engage in experiential exercises, indicating minimal application of skills discussed.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session centered on strengthening interpersonal connections through assertive expression and boundary recognition. Clients examined how over-accommodation and emotional suppression compromise relational authenticity. The therapist guided the group in identifying current relationships characterized by imbalance and introduced techniques to restructure dynamics based on mutual respect and self-awareness. The client showed mild engagement but refrained from sharing specific relational challenges or practicing assertive communication, suggesting continued difficulty translating insight into action.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a skills-building group on interpersonal functioning, emphasizing the role of emotional regulation and vulnerability in fostering secure attachments. Clients processed the impact of avoidant or anxious interpersonal styles and participated in role-play designed to increase tolerance for relational discomfort. The therapist modeled reparative communication strategies and encouraged practice. The client observed but did not participate actively or reflect on any current relationship stressors, indicating no observable progress in addressing interpersonal avoidance.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on improving relationship quality through the development of perspective-taking and cognitive flexibility. Clients were encouraged to analyze how assumptions, cognitive distortions, and unresolved emotional needs interfere with intimacy and trust. The therapist introduced a structured journaling method to track relational triggers and evaluate responses. While the client verbalized general agreement with the content, they remained emotionally distant and did not complete the exercise, reflecting resistance to vulnerability and interpersonal insight.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group process focused on building interpersonal competence by addressing defense mechanisms such as blame-shifting and stonewalling. Clients examined their roles in relational breakdowns and were introduced to dialectical strategies for maintaining connection during conflict. Through therapist-facilitated dialogue, clients identified at least one interpersonal pattern to challenge. The client remained passive, did not disclose relevant examples, and avoided feedback, indicating no meaningful engagement with the skills presented.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session focused on enhancing relationship quality through the development of empathy and non-defensive communication. Clients explored the emotional cost of reactive behaviors and the benefits of pausing before responding. The therapist introduced grounding techniques to reduce reactivity in high-stress relational exchanges. While the client acknowledged past impulsive responses in conflict, they did not identify strategies to improve or demonstrate willingness to practice de-escalation techniques, reflecting minimal engagement in relational change.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on strengthening interpersonal bonds by fostering authenticity and emotional congruence in communication. The group discussed how masking true feelings or adapting to please others can create emotional dissonance and resentment. The therapist encouraged clients to identify moments when they had suppressed their voice in important relationships. The client remained reserved, did not contribute to the group dialogue, and showed difficulty identifying personal examples, suggesting continued avoidance of emotional vulnerability.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session on the role of active repair strategies in maintaining interpersonal relationships. Clients reviewed common conflict cycles and learned techniques to initiate accountability, including apology frameworks and non-defensive feedback. The therapist modeled language for emotional responsibility and invited clients to rehearse reparative conversations. Although the client expressed interest, they did not participate in the role-play or identify a relational issue to address, indicating no direct application of the skills introduced.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on identifying relational patterns rooted in childhood attachment experiences. Clients explored how early caregiving models influence current behaviors such as clinging, withdrawing, or over-functioning in relationships. The therapist guided the group in connecting current relational challenges to underlying fears of rejection or abandonment. The client demonstrated passive participation and did not offer self-reflection or examples, showing no observable insight into their interpersonal dynamics.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a cognitive-behavioral session on challenging relational assumptions and increasing constructive engagement in conflict. Clients examined distorted beliefs such as "If they really cared, they would know" and "I have to handle everything on my own." The therapist encouraged clients to test these beliefs through behavioral experiments and open dialogue. The client appeared attentive but did not verbalize any relational beliefs or commit to trying new communication approaches, indicating no measurable change in interpersonal functioning.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Improve Relationships';
