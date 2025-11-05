-- =============================================
-- PÁRRAFOS PARA "CONFLICT RESOLUTION" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on conflict resolution, focusing on the identification of unhelpful patterns such as defensiveness, passive-aggression, and emotional withdrawal. Clients were guided through role-play exercises to practice assertive expression of needs and active listening during interpersonal disagreements. Emphasis was placed on recognizing physiological responses to conflict and using grounding techniques to regulate emotional reactivity. Clients demonstrated varying levels of insight; one client verbalized awareness of their tendency to escalate arguments but did not attempt to apply any alternative strategy.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a psychoeducational session addressing the cognitive distortions that often contribute to interpersonal conflict, including personalization and mind-reading. Through structured discussion, clients examined recent interpersonal challenges and explored how misinterpretations of intent can escalate emotional tension. The therapist introduced the concept of perspective-taking and modeled reflective communication techniques. While several clients were able to identify alternative interpretations of conflictual scenarios, one client remained resistant and expressed limited motivation to alter their communication style.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a skills-based session on interpersonal conflict resolution, highlighting the role of unmet emotional needs in fueling relational tension. Clients were encouraged to differentiate between reactionary and intentional communication, and to rehearse non-confrontational strategies for boundary-setting. The therapist provided feedback on tone modulation, posture, and timing in conflict navigation. Though engagement was moderate, some clients showed difficulty applying de-escalation strategies during the in-session exercises, indicating the need for further practice.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a process-oriented group focusing on the emotional underpinnings of interpersonal conflict. Clients discussed the impact of unresolved trauma and attachment styles on their conflict responses. The therapist guided the group in identifying behavioral triggers and taught brief interventions to pause impulsive responses. Although the session fostered meaningful reflection, some clients struggled to articulate their emotional needs without reverting to blame, suggesting limited internalization of assertive conflict resolution techniques.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist delivered a didactic and experiential session on conflict resolution strategies, emphasizing the development of negotiation skills and collaborative problem-solving. Clients engaged in dyadic exercises to practice compromise, validate opposing viewpoints, and generate mutually acceptable solutions. The therapist reinforced the use of "I" statements and modeled non-threatening language to minimize defensiveness. One client identified a pattern of escalating conflict through sarcasm but expressed ambivalence about changing this behavior.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured group session on conflict resolution with a focus on differentiating between assertive and aggressive communication. Clients examined the psychological impact of unresolved conflict on mood regulation and relational stability. The therapist introduced conflict mapping techniques to help clients identify the sequence of events leading to interpersonal breakdown. While several clients demonstrated insight into their triggers, one client verbalized a tendency to shut down during confrontation and did not engage in skill rehearsal, reflecting a need for continued support in building confidence with assertive dialogue.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session on conflict resolution, emphasizing the role of emotional dysregulation in escalating interpersonal disputes. Clients participated in guided discussions about ineffective patterns, such as avoidance and passive communication. The therapist introduced stepwise conflict de-escalation techniques, including reflective listening and clarification of intent. Although the group showed interest in the topic, some clients exhibited difficulty tolerating differing perspectives during role-play, suggesting limited application of regulation strategies in moments of perceived threat.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational session on conflict resolution, emphasizing the role of emotional dysregulation in escalating interpersonal disputes. Clients participated in guided discussions about ineffective patterns, such as avoidance and passive communication. The therapist introduced stepwise conflict de-escalation techniques, including reflective listening and clarification of intent. Although the group showed interest in the topic, some clients exhibited difficulty tolerating differing perspectives during role-play, suggesting limited application of regulation strategies in moments of perceived threat.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist provided an experiential session on conflict resolution techniques, guiding clients through structured exercises designed to practice emotional self-regulation and respectful negotiation. Clients explored how core beliefs and negative attribution biases influence their conflict response. The therapist modeled the use of boundary-setting language and encouraged clients to reframe rigid positions into flexible goals. While some clients practiced the skills with moderate fluency, others displayed oppositional behavior when receiving corrective feedback, highlighting areas for future focus in emotional flexibility.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session on conflict resolution, integrating cognitive-behavioral and communication models to address barriers in managing interpersonal tension. Clients were introduced to the "Stop-Think-Respond" framework as a method to slow down impulsive reactions. In small groups, clients role-played conflict scenarios from daily life and received feedback on clarity of expression and emotional tone. One client acknowledged difficulty in recognizing when conflict is escalating and avoided direct engagement, indicating the need for further development of self-monitoring and assertiveness strategies.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Interpersonal Skills' AND sa.subactivity_name = 'Conflict Resolution';
