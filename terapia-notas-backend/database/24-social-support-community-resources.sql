-- =============================================
-- PÁRRAFOS PARA "COMMUNITY RESOURCES" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational group focused on increasing awareness and utilization of community-based resources as a means of strengthening social support networks. Clients were introduced to local services including housing assistance, food banks, vocational programs, and mental health agencies. The discussion explored how engagement with external resources can buffer stress, enhance functioning, and reduce isolation.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Community Resources';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group session examining the psychological impact of resource scarcity and the role of community support in improving quality of life. Clients reflected on barriers to accessing support—such as stigma, fear of rejection, or lack of information—and were encouraged to identify at least one local resource they could explore to meet current needs. Therapist reinforced the importance of proactive help-seeking as a skill tied to resilience and autonomy.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Community Resources';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a strengths-based discussion centered on recognizing community assets as an extension of one''s social support system. Clients engaged in a mapping activity to identify relevant agencies and organizations available within their neighborhoods. Emphasis was placed on shifting from self-reliant coping to collaborative engagement with trusted community supports in moments of crisis or instability.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Community Resources';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a solution-focused intervention aimed at reducing client dependence on informal, potentially unreliable sources of support by increasing familiarity with formal community resources. Clients shared past experiences—both positive and negative—with systems of care, and therapist assisted in reframing these narratives to promote renewed willingness to seek structured assistance.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Community Resources';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a resource navigation workshop where clients practiced locating and contacting local services that address social determinants of health. Therapist highlighted how lack of connection to stable housing, food, or transportation can exacerbate psychological distress. Clients were supported in drafting a personalized resource list to reinforce self-efficacy and preparedness for future stressors.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Community Resources';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on the connection between community engagement and psychological well-being. Clients explored how access to structured external resources—such as peer support groups, libraries, crisis centers, and nonprofit programs—can enhance social inclusion and reduce emotional isolation. Therapist encouraged clients to reflect on previous patterns of self-isolation and identify at least one resource to initiate contact with over the coming week.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Community Resources';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group discussion focused on demystifying the process of accessing community resources. Clients expressed common concerns including difficulty navigating systems, fear of judgment, and past negative experiences with social services. The therapist introduced step-by-step strategies for building comfort in approaching support agencies and emphasized assertiveness in advocating for one''s needs.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Community Resources';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in a group activity focused on linking unmet basic needs with available community services. The therapist presented scenarios involving housing instability, food insecurity, and lack of employment, and clients were prompted to identify which local supports could intervene. Emphasis was placed on building awareness of how systemic supports contribute to psychological stability and functional improvement.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Community Resources';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a strengths-oriented session on recognizing and utilizing natural and formal support systems. Clients completed a guided worksheet identifying personal barriers to community involvement and were encouraged to list three resources they had not yet accessed. Therapist reinforced the concept that seeking help is a form of self-empowerment rather than dependency.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Community Resources';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted an interactive session in which clients collaborated to create a resource guide for common needs among peers in the program. Through this collaborative task, clients increased familiarity with mental health hotlines, legal aid services, addiction recovery centers, and vocational training programs. The therapist highlighted how contributing to shared resource knowledge promotes self-efficacy and a sense of collective support.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Social Support' AND sa.subactivity_name = 'Community Resources';



