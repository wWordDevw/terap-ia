-- =============================================
-- MIGRACIÓN: ACTIVIDAD LIFE SKILLS (MARTES)
-- Terapia Nota System - PostgreSQL 16
-- =============================================

-- =============================================
-- 1. ACTIVIDAD PRINCIPAL: LIFE SKILLS
-- =============================================

INSERT INTO activities (activity_name, description) VALUES
('Life Skills', 'Developing practical skills for independent living, family dynamics, and daily functioning to enhance autonomy and self-sufficiency');

-- =============================================
-- 2. OBJETIVOS (SUBACTIVIDADES)
-- =============================================

INSERT INTO subactivities (activity_id, subactivity_name, description)
SELECT 
    activity_id,
    'Role in the Family',
    'Understanding and managing family roles and dynamics for healthier relationships'
FROM activities WHERE activity_name = 'Life Skills'
UNION ALL
SELECT 
    activity_id,
    'Managing Household Tasks',
    'Learning to organize and maintain household responsibilities effectively'
FROM activities WHERE activity_name = 'Life Skills'
UNION ALL
SELECT 
    activity_id,
    'Use of Transportation',
    'Developing skills for independent transportation and mobility'
FROM activities WHERE activity_name = 'Life Skills'
UNION ALL
SELECT 
    activity_id,
    'Independent Skills',
    'Building skills for independent living and self-sufficiency'
FROM activities WHERE activity_name = 'Life Skills'
UNION ALL
SELECT 
    activity_id,
    'Daily Routines',
    'Establishing and maintaining healthy daily routines for stability'
FROM activities WHERE activity_name = 'Life Skills';

-- =============================================
-- 3. PÁRRAFOS PARA "ROLE IN THE FAMILY"
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session focused on family systems theory, guiding clients to examine their roles within their family of origin and how these roles may perpetuate maladaptive patterns in adulthood. The group explored dynamics such as enmeshment, scapegoating, and parentification. Clients reflected on the impact of rigid roles on identity formation and emotional expression. While some clients verbalized increased insight into how these dynamics affect current functioning, others demonstrated resistance to examining long-standing familial narratives.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Role in the Family';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group intervention centered on identifying functional and dysfunctional roles assumed within the family unit, such as the "caretaker," "hero," or "lost child." Clients were invited to assess how early relational conditioning informs current relational expectations and self-concept. The discussion integrated elements of Bowenian theory, emphasizing differentiation of self. The session fostered emotional processing, though several clients required redirection when shifting into defensive or avoidant responses during group sharing.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Role in the Family';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session on the psychological implications of family role internalization and its connection to emotional regulation. Clients explored how inherited expectations shape their relational behaviors and coping strategies. The therapist utilized genogram mapping to help visualize intergenerational patterns. Participants began identifying how these roles may reinforce depressive or anxious symptomatology, though the level of emotional engagement varied across the group.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Role in the Family';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an experiential activity aimed at increasing awareness of clients'' perceived roles within their current family systems. Clients were encouraged to describe the behavioral and emotional responsibilities they carry and how these align or conflict with their needs and values. The therapist emphasized the importance of assertiveness and boundaries in shifting dysfunctional relational patterns. Clients responded with varying degrees of self-awareness; some identified the internal conflict between obligation and autonomy.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Role in the Family';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a process group exploring the psychological burden of sustaining unacknowledged family roles, particularly in high-conflict or emotionally neglectful environments. Clients reflected on how survival roles adopted in childhood continue to influence interpersonal functioning. Through facilitated dialogue, the therapist linked these roles to current challenges in emotional intimacy, self-efficacy, and boundary-setting. Although most clients engaged in reflective discussion, a few demonstrated emotional numbing and required additional support to articulate their internal experiences.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Role in the Family';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group discussion on the psychological impact of role rigidity within dysfunctional family systems. Clients were encouraged to identify patterns where they consistently fulfill roles that undermine their autonomy or emotional well-being, such as "fixer" or "peacekeeper." The therapist introduced the concept of role flexibility as a marker of healthy relational functioning and challenged clients to consider how maintaining fixed roles may contribute to burnout, relational resentment, and identity confusion.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Role in the Family';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a trauma-informed exploration of family roles, encouraging clients to examine how early exposure to instability, neglect, or abuse may have shaped their adaptive functions within the family unit. The session focused on how hyper-responsibility or emotional withdrawal developed as coping strategies and may now interfere with healthy adult functioning. Clients were invited to consider how these roles affect their current relationships, emotional vulnerability, and self-concept.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Role in the Family';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured activity in which clients charted their perceived roles within both childhood and current family systems. Using narrative techniques, clients shared how these roles shaped their sense of duty, emotional expression, and self-worth. The therapist provided psychoeducation on family homeostasis and how certain roles are unconsciously preserved to maintain relational equilibrium, even at the cost of personal growth. Client responses reflected a mix of insight, ambivalence, and emotional discomfort.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Role in the Family';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group exercise that explored the intersection between family roles and emotional regulation. Clients identified how being cast in roles such as "protector" or "emotional sponge" affected their ability to set boundaries or prioritize their own needs. The therapist reinforced the importance of emotional differentiation and self-care in reducing role-based distress and maintaining balanced interpersonal relationships. Several clients verbalized new awareness of role fatigue and its connection to depressive symptoms.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Role in the Family';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in a cognitive-behavioral exploration of how internalized family roles perpetuate core negative beliefs about the self. The group identified automatic thoughts linked to their roles, such as "I must always be in control" or "My needs don''t matter." The therapist guided clients in challenging these cognitions and considering alternative self-narratives. Emotional processing was facilitated, though a few clients exhibited avoidant tendencies when confronted with the possibility of role disengagement.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Life Skills' AND sa.subactivity_name = 'Role in the Family';

