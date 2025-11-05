-- =============================================
-- PÁRRAFOS PARA "NUTRITION, EXERCISE AND LIFESTYLE CHANGES" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session focusing on the interrelation between nutrition, physical activity, and emotional well-being. Clients explored how dietary imbalances and sedentary behaviors can contribute to mood dysregulation, fatigue, and poor sleep quality. The therapist guided clients in identifying one small, sustainable lifestyle change to promote overall wellness.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Nutrition, Exercise and Lifestyle Changes';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group discussion on the psychological barriers that impede the maintenance of a healthy lifestyle, such as low motivation, distorted self-perceptions, and all-or-nothing thinking. Clients were encouraged to examine their cognitive distortions related to body image and self-discipline, and collaboratively generated realistic behavioral goals aligned with their current level of functioning.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Nutrition, Exercise and Lifestyle Changes';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of behavioral activation through structured routines involving exercise and nutritional planning. Clients examined how poor lifestyle habits can reinforce depressive symptomatology. The therapist promoted gradual implementation of healthy routines and emphasized the importance of consistency over intensity to support long-term change.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Nutrition, Exercise and Lifestyle Changes';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session highlighting the link between gut health, nutrient absorption, and psychological functioning, including the impact of processed foods and sugar on anxiety and mood swings. Clients discussed their current dietary patterns and the therapist provided psychoeducation on mindful eating and incremental habit shifts.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Nutrition, Exercise and Lifestyle Changes';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session examining the role of exercise and diet in the regulation of stress hormones and the enhancement of neurotransmitter activity. Clients engaged in self-reflection to identify maladaptive lifestyle habits and were encouraged to develop an individualized plan that incorporates both physical movement and nutritional awareness as preventive strategies against emotional dysregulation.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Nutrition, Exercise and Lifestyle Changes';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session focused on psychoeducation regarding the physiological and psychological benefits of regular exercise, balanced nutrition, and adequate hydration. Clients explored how these elements support cognitive clarity, emotional stability, and energy regulation. Participants identified one area of personal improvement and reflected on internal barriers to implementing change.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Nutrition, Exercise and Lifestyle Changes';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the topic of lifestyle restructuring as a means to improve mental and physical health. Clients discussed the role of daily routines, nutritional intake, and movement in stabilizing mood and enhancing self-efficacy. The therapist encouraged clients to track current habits and develop insight into patterns that perpetuate emotional distress.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Nutrition, Exercise and Lifestyle Changes';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a discussion on the reciprocal relationship between mental health symptoms and poor lifestyle choices. Clients examined how fatigue, low mood, and anxiety often result in neglecting self-care, including nutrition and physical activity. The group brainstormed practical strategies to initiate lifestyle changes within their current capacities.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Nutrition, Exercise and Lifestyle Changes';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a mindfulness-based health education session, emphasizing the importance of intentional eating, gentle exercise, and restorative routines in emotional regulation. Clients were invited to reflect on their relationship with food, body image, and self-care, while the therapist reinforced the link between consistent healthy practices and long-term psychological resilience.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Nutrition, Exercise and Lifestyle Changes';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted an experiential session where clients evaluated the emotional consequences of inactivity, poor diet, and chaotic routines. The therapist introduced motivational interviewing techniques to explore ambivalence and strengthen commitment to health-related behavior change. Clients expressed varied levels of readiness, and the session concluded with individual goal-setting for small, realistic lifestyle modifications.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Nutrition, Exercise and Lifestyle Changes';



