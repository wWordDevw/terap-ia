-- =============================================
-- PÁRRAFOS PARA "COPING ALTERNATIVES" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on developing adaptive coping alternatives to manage emotional discomfort. Clients explored the difference between coping mechanisms that offer short-term relief (e.g., emotional eating, isolation) versus those that support long-term wellness (e.g., exercise, journaling, structured social interaction). One client acknowledged reliance on avoidant strategies but expressed ambivalence toward change, reflecting limited readiness to implement healthier alternatives.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Coping Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group focused on identifying maladaptive behaviors that interfere with physical and emotional well-being, such as substance use, poor diet, or excessive screen time. The therapist introduced a functional analysis framework to help clients understand the triggers and consequences of these behaviors. While several clients engaged in reflection, one struggled to generate viable alternative behaviors, indicating the need for further skill development in behavioral substitution.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Coping Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session examining how lifestyle factors interact with emotional coping. Clients were encouraged to recognize how lack of sleep, dehydration, and unstructured days exacerbate mood dysregulation. The therapist introduced micro-interventions, including mindfulness breaks and movement routines, to build coping consistency. One client verbalized insight into their patterns but did not identify an action plan, demonstrating insight without behavioral commitment.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Coping Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session aimed at enhancing self-awareness around habitual coping tendencies and encouraging the intentional practice of healthier alternatives. Clients explored personal narratives around stress response and reflected on their current strategies. The therapist modeled grounding and distraction techniques. Despite modeling and peer sharing, one client appeared disengaged and did not attempt to apply the discussed alternatives during the session.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Coping Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced the concept of personalized coping menus as a practical tool to support emotional regulation through daily routines. Clients identified at least three low-effort coping strategies they could access during distress. Examples included deep breathing, stretching, hydration, and music. One client noted difficulty distinguishing between distraction and avoidance and requested further clarification, indicating emerging insight but no demonstrated integration of strategies.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Coping Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured group session on recognizing and replacing self-defeating coping habits with healthier alternatives. The discussion centered on how routines such as overworking, substance use, and social withdrawal may temporarily mask distress but ultimately worsen psychological functioning. Clients were prompted to identify one maladaptive behavior and collaboratively brainstorm sustainable alternatives. One client acknowledged the cycle of avoidance through sleep but did not commit to practicing any new strategies.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Coping Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a cognitive-behavioral session exploring the role of intentional lifestyle choices in supporting emotional regulation. Clients examined the impact of routine behaviors—such as hydration, movement, and screen use—on stress response and mood stability. The therapist provided a handout on evidence-based coping strategies. Although several clients contributed examples of healthy alternatives, one remained passive and expressed doubt about the usefulness of any technique, indicating resistance to behavior change.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Coping Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a psychoeducational group examining the difference between reactive and proactive coping. Clients reflected on times they engaged in self-sabotaging behaviors in response to stress and were guided in reframing those events using a solution-focused approach. The therapist emphasized building a "coping toolkit" tailored to each client''s strengths. One client was able to describe maladaptive patterns but struggled to generate personal examples of alternative coping, suggesting limited generalization of concepts.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Coping Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a mindfulness-integrated session focused on identifying moment-to-moment coping alternatives that promote regulation without avoidance. Clients practiced a brief grounding technique and then discussed potential strategies that could be substituted for common impulsive reactions. Though several clients described willingness to experiment with alternatives, one did not complete the activity or verbalize any specific intention, reflecting poor engagement and no observed skill adoption.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Coping Alternatives';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a group discussion on the intersection between coping and long-term health outcomes, highlighting how emotional distress often manifests in physical health issues. Clients were encouraged to recognize early warning signs of dysregulation and to select one coping strategy that aligns with their wellness goals. While most clients could name one adaptive option, one client focused only on barriers and expressed skepticism about change, indicating insight without commitment to action.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Healthy Living' AND sa.subactivity_name = 'Coping Alternatives';



