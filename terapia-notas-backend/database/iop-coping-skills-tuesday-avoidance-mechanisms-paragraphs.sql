-- =============================================
-- IOP: Coping Skills - MARTES - Avoidance Mechanisms
-- =============================================
-- Este script inserta los 46 párrafos para "Avoidance Mechanisms"
-- de la actividad "Coping Skills" para IOP del día MARTES
-- =============================================

DO $$
DECLARE
    v_activity_id UUID;
    v_subactivity_id UUID;
    v_paragraph_count INTEGER;
BEGIN
    -- Obtener la actividad "Coping Skills"
    SELECT activity_id INTO v_activity_id
    FROM activities
    WHERE LOWER(activity_name) = 'coping skills'
    LIMIT 1;

    IF v_activity_id IS NULL THEN
        RAISE EXCEPTION 'Actividad "Coping Skills" no encontrada. Ejecuta primero el script de creación de la actividad.';
    END IF;

    RAISE NOTICE '✅ Actividad "Coping Skills" encontrada con ID: %', v_activity_id;

    -- Obtener o crear la subactividad "Avoidance Mechanisms"
    SELECT subactivity_id INTO v_subactivity_id
    FROM subactivities
    WHERE activity_id = v_activity_id
    AND LOWER(subactivity_name) = 'avoidance mechanisms'
    LIMIT 1;

    IF v_subactivity_id IS NULL THEN
        INSERT INTO subactivities (activity_id, subactivity_name, description, is_active)
        VALUES (v_activity_id, 'Avoidance Mechanisms', 'Recognizing and addressing avoidance-based coping strategies', TRUE)
        RETURNING subactivity_id INTO v_subactivity_id;
        RAISE NOTICE '✅ Subactividad "Avoidance Mechanisms" creada con ID: %', v_subactivity_id;
    ELSE
        RAISE NOTICE '✅ Subactividad "Avoidance Mechanisms" ya existe con ID: %', v_subactivity_id;
    END IF;

    -- Eliminar párrafos existentes para esta subactividad (para evitar duplicados)
    DELETE FROM activity_paragraphs
    WHERE activity_id = v_activity_id
    AND subactivity_id = v_subactivity_id;

    RAISE NOTICE '🗑️  Párrafos existentes eliminados para evitar duplicados';

    -- Insertar los 46 párrafos
    INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
    VALUES
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational session on avoidance as a common yet maladaptive mechanism for coping with distress. The therapist explained how both physical withdrawal and mental disengagement may provide temporary relief but ultimately reinforce anxiety and unresolved conflict. Clients reflected on situations in which avoidance delayed problem-solving, and strategies for gradual exposure were introduced as healthier alternatives.', 1),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a group discussion on denial as a defensive strategy that refuses to acknowledge painful realities. The therapist highlighted how denial can initially protect the psyche from overwhelming affect but, over time, leads to distorted reality testing and emotional stagnation. Participants examined personal examples of minimizing or rejecting uncomfortable truths, and the therapist guided them toward cognitive reframing techniques to foster acceptance.', 2),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided an exploration of fantasy as an avoidance mechanism that offers escape from intolerable stressors. The therapist noted how immersion in imagined scenarios can provide short-term comfort but detracts from engagement with concrete challenges. Clients processed examples of withdrawing into fantasy when confronted with difficulties, and the session emphasized grounding practices to maintain balance between imagination and reality.', 3),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a session on intellectualization as a strategy to circumvent affective discomfort by overemphasizing logic. The therapist underscored how cognitive detachment may reduce immediate distress but limits emotional processing and relational authenticity. Group members practiced integrating affective awareness with rational analysis, fostering a more holistic response to stressors.', 4),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a psychoeducational intervention on passive aggression as an indirect form of avoidance. The therapist explained how resistance through sarcasm, procrastination, or intentional inefficiency serves to evade direct confrontation while expressing covert hostility. Clients reflected on interpersonal consequences of this mechanism, and assertive communication was modeled as a corrective approach.', 5),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group discussion on regression as an unconscious retreat to earlier developmental behaviors under stress. The therapist described how reverting to childlike patterns—such as dependency or helplessness—temporarily alleviates distress but undermines adult functioning. Clients examined personal examples of regressive behavior, and the therapist emphasized the importance of strengthening ego capacities through adaptive skills.', 6),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a session on rationalization as an avoidance strategy that creates seemingly logical justifications for maladaptive choices. The therapist highlighted how this mechanism masks accountability and reinforces cycles of avoidance. Clients practiced identifying rationalizations in their narratives, and corrective feedback was offered to promote insight and responsibility.', 7),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group exploration of symbolization as an unconscious avoidance mechanism in which intolerable thoughts are transformed into metaphor or symbolic imagery. The therapist explained how symbolization can displace anxiety into indirect forms of expression, often visible in dreams or repetitive behaviors. Clients processed examples of symbolic substitution and were guided to interpret meaning while moving toward conscious acknowledgment of the underlying issue.', 8),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group discussion on avoidance as a defense that provides temporary relief but maintains long-term dysfunction. The therapist explained how both physical withdrawal and cognitive detachment can shield individuals from distressing stimuli, yet ultimately reinforce anxiety and inhibit adaptive coping. Clients reflected on times they delayed confrontation, and the group explored gradual exposure as an alternative strategy.', 9),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a session on denial as an unconscious mechanism that refuses to acknowledge painful realities. The therapist highlighted how denial protects the psyche in the short term but fosters distorted reality testing and delayed emotional processing. Group members examined personal examples where denial prolonged suffering, and the therapist introduced reframing exercises aimed at fostering acceptance and insight.', 10),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a psychoeducational intervention on distancing as a method of emotional disengagement. The therapist explained how detachment from situations or people perceived as threatening can prevent immediate discomfort, but it also restricts intimacy and problem resolution. Clients identified scenarios in which they relied on distancing, and the session emphasized healthy boundary-setting as a more adaptive alternative.', 11),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a session on fantasy as an avoidance mechanism that offers temporary escape into imagined worlds. The therapist underscored how excessive reliance on fantasy can interfere with active problem-solving and engagement with reality. Clients processed their use of fantasy during times of stress, and mindfulness-based grounding techniques were introduced to encourage present-focused coping.', 12),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a group exploration of intellectualization as a strategy that prioritizes logic while minimizing affect. The therapist explained how focusing exclusively on rational arguments may reduce emotional intensity but simultaneously block authentic processing. Clients practiced integrating emotional language into narratives, reinforcing the therapeutic value of combining cognition and affect for holistic adaptation.', 13),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a discussion on passive aggression as a covert avoidance mechanism. The therapist clarified how resistance through sarcasm, procrastination, or intentional inefficiency serves to evade direct confrontation. Group members analyzed the relational consequences of such behavior, and assertive communication techniques were modeled to promote healthier expression.', 14),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational session on regression as a defense in which individuals unconsciously revert to earlier developmental stages. The therapist emphasized how behaviors such as dependency or helplessness may emerge under stress, offering temporary comfort but limiting functional autonomy. Clients identified personal examples and were encouraged to strengthen adult coping skills.', 15),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a session on repression as an unconscious strategy of keeping unacceptable thoughts outside awareness. The therapist discussed how repressed material often reemerges in disguised forms, contributing to somatic complaints or intrusive thoughts. Clients reflected on the costs of repression, and the therapist underscored the importance of safe therapeutic spaces for gradual integration of suppressed content.', 16),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a group intervention on trivializing as an avoidance defense. The therapist explained how minimizing the significance of distressing issues reduces immediate tension but invalidates experiences and delays resolution. Participants reflected on times they downplayed serious problems, and the therapist reframed acknowledgment as a crucial step toward effective coping.', 17),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group session on acting out as an avoidance mechanism. The therapist explained how impulsive behaviors often serve as a discharge of unresolved inner conflict, allowing individuals to bypass reflection and emotional processing. Clients shared examples of situations where they yielded to urges rather than tolerating discomfort, and the therapist introduced impulse-regulation strategies to support healthier coping.', 18),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a psychoeducational intervention on denial as a defense that protects the Ego from intolerable realities. The therapist highlighted how refusal to acknowledge painful events may create short-term relief but undermines reality testing and emotional adjustment. Clients reflected on instances where denial delayed healing, and the session emphasized acceptance as a prerequisite for adaptive change.', 19),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a discussion on distancing as a subtle avoidance response. The therapist described how emotional withdrawal and relational detachment can prevent immediate tension but also hinder intimacy and problem resolution. Participants examined situations where they created distance to avoid vulnerability, and strategies for maintaining healthy boundaries without withdrawal were introduced.', 20),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group exploration of fantasy as a defensive escape. The therapist explained how retreating into imagined scenarios can soften distress but also impair engagement with real-life challenges. Clients reflected on their use of fantasy during stress, and grounding techniques were practiced to encourage present-moment awareness and balanced coping.', 21),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a session on performing rituals as an avoidance mechanism. The therapist explained how repetitive patterns or routines may provide temporary relief from anxiety while covertly delaying confrontation of the core issue. Clients explored their reliance on rituals during stressful moments, and the group discussed the difference between adaptive structure and maladaptive avoidance.', 22),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group discussion on projection as an unconscious avoidance defense. The therapist explained how disowning unwanted feelings by attributing them to others helps reduce internal conflict but creates interpersonal distortion. Clients processed examples where projection escalated relational difficulties, and the therapist encouraged reflective practices to strengthen accountability and insight.', 23),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a psychoeducational session on regression as a reversion to earlier developmental stages under stress. The therapist highlighted how childlike behaviors such as dependency or helplessness may provide comfort while undermining functional autonomy. Clients reflected on examples of regressive tendencies, and the therapist emphasized the importance of ego strengthening and adult coping strategies.', 24),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a group exploration of rationalization as an intellectual strategy that masks avoidance. The therapist explained how creating logical justifications for maladaptive actions minimizes guilt but blocks self-awareness. Participants identified rationalizations in their own narratives, and corrective feedback was provided to promote authentic responsibility and growth.', 25),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a session on trivializing as a mechanism of avoidance. The therapist discussed how minimizing significant problems can invalidate experiences and delay effective intervention. Clients reflected on times when they downplayed their struggles, and the therapist reframed acknowledgment of difficulties as a necessary step toward constructive resolution.', 26),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational group focused on avoidance and denial as defense mechanisms that provide short-term relief but create long-term emotional stagnation. The therapist explained how avoidance prevents individuals from confronting distressing realities, leading to suppressed emotions and maladaptive behaviors. Clients identified areas in their lives where avoidance dominates and explored strategies for gradual exposure and cognitive restructuring.', 27),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a session on acting out as a behavioral manifestation of unresolved inner conflict. The therapist described how impulsive reactions serve as temporary tension release but hinder emotional insight and self-regulation. Clients reflected on recent impulsive behaviors and practiced grounding and mindfulness techniques to enhance awareness before action.', 28),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a discussion on denial as a primitive defense mechanism used to protect the psyche from overwhelming truths. The therapist emphasized how refusal to acknowledge painful experiences creates emotional detachment and delays healing. Clients processed examples of self-denial and discussed the role of acceptance as a foundation for psychological growth.', 29),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a psychoeducational exploration of displacement as an unconscious redirection of emotional energy. The therapist explained that anger or frustration often gets projected onto safer targets, creating interpersonal strain. Clients examined their own tendencies toward misdirected anger and practiced identifying the original source of emotional distress.', 30),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group on distancing as an emotional withdrawal mechanism. The therapist explained how detachment from people or situations perceived as threatening can preserve temporary stability but inhibit intimacy and authentic processing. Clients explored patterns of emotional avoidance and developed plans to increase tolerance for vulnerability.', 31),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a session on fantasy as a form of psychological escape. The therapist discussed how imaginative detachment can soothe anxiety but also create disconnection from real-life problem-solving. Clients shared experiences of retreating into fantasy and explored mindfulness practices to strengthen presence and reality engagement.', 32),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a group discussion on idealization as a defense that distorts perception by magnifying positives and dismissing flaws. The therapist explained how this mechanism can lead to disappointment and relational imbalance. Clients reflected on how over-idealizing people or goals has impacted their expectations and practiced using balanced evaluation to foster emotional stability.', 33),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational session on intellectualization as a coping strategy that prioritizes logic over emotion. The therapist explained that focusing solely on facts provides control but prevents emotional processing. Clients practiced integrating cognitive and affective awareness to develop more holistic self-understanding.', 34),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a group exploration of passive aggression as a covert form of avoidance and hostility. The therapist illustrated how procrastination, sarcasm, or subtle resistance express anger indirectly. Clients identified passive-aggressive patterns in their relationships and practiced assertive communication techniques to promote authenticity.', 35),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a session on performing rituals as a behavioral delay mechanism. The therapist explained how repetitive routines can give a false sense of control while postponing emotional engagement. Clients discussed habits that function as avoidance rituals and developed strategies to address core issues directly.', 36),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a discussion on projection as an externalizing defense that attributes one''s own discomfort to others. The therapist emphasized how projection distorts interpersonal understanding and hinders accountability. Clients reflected on recent experiences of misinterpreting others'' intentions and learned to identify internal triggers underlying those projections.', 37),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a psychoeducational intervention on rationalization as a mechanism that creates seemingly logical explanations for maladaptive behavior. The therapist discussed how rationalization protects self-esteem but prevents accountability and genuine insight. Clients practiced identifying rationalizations in their narratives and reframed them into realistic, responsible perspectives.', 38),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a group session on reaction formation as a defense characterized by exaggerated behavior opposite to true feelings. The therapist explained how this incongruence fosters internal tension and confusion. Clients explored examples of overcompensation and learned to replace rigid self-control with emotional honesty.', 39),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational group on regression as a temporary return to earlier developmental behaviors when under stress. The therapist explained that while regression may offer short-term comfort, it undermines autonomy and problem-solving. Clients identified regressive tendencies and developed adult coping strategies for maintaining emotional independence.', 40),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a discussion on repression as an unconscious process of pushing distressing memories or emotions out of awareness. The therapist explained how repressed material often resurfaces through anxiety, somatic symptoms, or intrusive thoughts. Clients discussed the importance of safe therapeutic exploration and emotional integration for healing.', 41),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a session on symbolization as an unconscious transformation of distress into metaphorical expression. The therapist highlighted how symbolic behaviors or dreams often represent underlying conflict. Clients shared examples of recurring themes or symbols in their lives and practiced interpreting emotional meaning behind them.', 42),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a group exploration of trivializing as a subtle defense that minimizes the emotional impact of significant issues. The therapist explained how this mechanism fosters denial and emotional detachment. Clients reflected on situations where they downplayed personal pain and discussed how acknowledgment can enhance self-awareness and empathy.', 43),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational group on avoidance behavior as a cycle that perpetuates anxiety. The therapist explained how evading stressors reinforces fear and reduces coping confidence. Clients explored exposure-based strategies to gradually confront avoided situations and strengthen emotional resilience.', 44),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a group session integrating denial, avoidance, and repression as interconnected defenses. The therapist explained how these mechanisms shield individuals from emotional overload but sustain maladaptive patterns. Clients identified which defenses they rely on most and created personalized plans for replacing avoidance with active problem-solving.', 45),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a reflective closing session emphasizing the transformation of defensive avoidance into adaptive coping. The therapist reinforced that acknowledging discomfort is a prerequisite for growth. Clients committed to practicing emotional tolerance, mindfulness, and assertive communication to replace denial-based defenses with conscious resilience.', 46);

    -- Verificar inserción
    SELECT COUNT(*) INTO v_paragraph_count
    FROM activity_paragraphs
    WHERE activity_id = v_activity_id
    AND subactivity_id = v_subactivity_id;

    RAISE NOTICE '✅✅✅ COMPLETADO: % párrafos insertados para "Avoidance Mechanisms" ✅✅✅', v_paragraph_count;

END $$;

-- Verificar inserción
SELECT 
    a.activity_name,
    sa.subactivity_name,
    COUNT(ap.paragraph_id) as total_paragraphs,
    MIN(ap.paragraph_order) as min_order,
    MAX(ap.paragraph_order) as max_order
FROM activities a
JOIN subactivities sa ON sa.activity_id = a.activity_id
JOIN activity_paragraphs ap ON ap.subactivity_id = sa.subactivity_id
WHERE LOWER(a.activity_name) = 'coping skills'
AND LOWER(sa.subactivity_name) = 'avoidance mechanisms'
GROUP BY a.activity_name, sa.subactivity_name
ORDER BY a.activity_name, sa.subactivity_name;

