-- =============================================
-- IOP: Coping Skills - MARTES - Conversion Mechanisms
-- =============================================
-- Este script inserta los 48 párrafos para "Conversion Mechanisms"
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

    -- Obtener o crear la subactividad "Conversion Mechanisms"
    SELECT subactivity_id INTO v_subactivity_id
    FROM subactivities
    WHERE activity_id = v_activity_id
    AND LOWER(subactivity_name) = 'conversion mechanisms'
    LIMIT 1;

    IF v_subactivity_id IS NULL THEN
        INSERT INTO subactivities (activity_id, subactivity_name, description, is_active)
        VALUES (v_activity_id, 'Conversion Mechanisms', 'Understanding conversion and somatization as coping strategies', TRUE)
        RETURNING subactivity_id INTO v_subactivity_id;
        RAISE NOTICE '✅ Subactividad "Conversion Mechanisms" creada con ID: %', v_subactivity_id;
    ELSE
        RAISE NOTICE '✅ Subactividad "Conversion Mechanisms" ya existe con ID: %', v_subactivity_id;
    END IF;

    -- Eliminar párrafos existentes para esta subactividad (para evitar duplicados)
    DELETE FROM activity_paragraphs
    WHERE activity_id = v_activity_id
    AND subactivity_id = v_subactivity_id;

    RAISE NOTICE '🗑️  Párrafos existentes eliminados para evitar duplicados';

    -- Insertar los 48 párrafos
    INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
    VALUES
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational session on conversion as a defense mechanism where unresolved psychological distress manifests in physical symptoms. The therapist explained how unconscious intrapsychic conflict can present as bodily pain or dysfunction, masking the true emotional root. Clients reflected on personal experiences of somatic complaints linked to stress, and the group was guided to explore the importance of addressing psychological rather than purely physical dimensions.', 1),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a group discussion on somatization as a conversion mechanism. The therapist highlighted how emotional conflict or anxiety may be unconsciously expressed through chronic fatigue, headaches, or gastrointestinal discomfort. Participants shared instances where their bodies "spoke" the unexpressed distress of their minds, and the therapist emphasized the therapeutic goal of integrating emotional awareness into health management.', 2),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a session on sublimation as a transformative coping strategy. The therapist described how instinctual drives and unresolved psychic tension can be redirected into socially acceptable or creative outlets. Clients examined examples where frustration or aggression had been channeled into art, exercise, or productive work, underscoring sublimation as one of the most adaptive forms of conversion.', 3),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group exploration of substitution as a cognitive conversion mechanism. The therapist explained how unmet desires or maladaptive behaviors are often replaced with safer alternatives, reducing distress while preserving functionality. Clients processed experiences of substituting unhealthy habits with constructive activities, reinforcing substitution as a stepping stone toward long-term adaptive change.', 4),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a psychoeducational intervention on reaction formation within the spectrum of conversion mechanisms. The therapist described how individuals unconsciously overcompensate by adopting an exaggerated opposite stance to conceal unacceptable impulses. Group members reflected on relational patterns where excessive virtue or compliance masked underlying hostility, and the session emphasized authenticity as a corrective path.', 5),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a discussion on symbolization as a conversion mechanism that translates forbidden or intolerable thoughts into metaphorical representations. The therapist explained how this process is often evident in dreams, symbolic rituals, or displaced imagery. Clients reflected on their own experiences of indirect expression, and the therapist guided them toward exploring the latent meaning beneath symbolic behaviors.', 6),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group session on post-traumatic growth as a constructive conversion process. The therapist highlighted how traumatic experiences, though painful, can be transformed into sources of resilience, meaning-making, and personal development. Clients shared examples of strength gained through adversity, and the therapist emphasized growth as a form of psychological reorganization that integrates suffering into a broader narrative of survival.', 7),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a group intervention on trivializing as a subtle conversion mechanism. The therapist explained how minimizing the significance of painful events serves as a way to disguise the real issue behind a smaller frame, creating the illusion of reduced threat. Clients identified times when they trivialized distress to avoid confrontation, and the therapist reframed acknowledgment of difficulties as an essential step toward authentic coping.', 8),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group exploration of conversion as a defense mechanism where unresolved psychological stress manifests in somatic form. The therapist explained how unconscious intrapsychic conflict may be expressed through physical symptoms such as paralysis, loss of sensation, or chronic pain without medical explanation. Clients reflected on experiences of physical discomfort linked to emotional distress, and the session emphasized the need to address underlying psychological roots.', 9),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a psychoeducational session on somatization as a conversion process. The therapist highlighted how anxiety, guilt, or unresolved conflict can surface as bodily complaints, masking emotional suffering. Clients discussed personal examples of psychosomatic illness, and the therapist reinforced the importance of integrating psychological assessment into physical health care.', 10),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a discussion on sublimation as one of the most adaptive conversion mechanisms. The therapist emphasized how psychic energy stemming from unacceptable impulses or stress can be redirected into socially constructive activities such as art, sports, or creative expression. Clients identified personal situations where sublimation transformed distress into productivity, underscoring its value for resilience.', 11),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group intervention on substitution as a coping strategy that replaces harmful or unattainable objectives with safer alternatives. The therapist explained how this mechanism allows individuals to reduce frustration while maintaining functionality. Clients reflected on instances where they redirected maladaptive behaviors into healthier replacements, reinforcing substitution as a stepping stone toward long-term change.', 12),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a session on reaction formation as a conversion defense. The therapist explained how intolerable impulses are concealed by exaggerated opposite behaviors, creating incongruence between internal states and external expression. Group members explored relational examples where rigid moral or virtuous postures masked underlying hostility, and authenticity was emphasized as a therapeutic objective.', 13),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a psychoeducational intervention on aim inhibition. The therapist explained how individuals may unconsciously lower goals to shield themselves from the anxiety of potential failure. Clients reflected on personal experiences of setting "safer" objectives, and the therapist emphasized how incremental goal expansion can foster both self-efficacy and resilience.', 14),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a discussion on post-traumatic growth as a constructive conversion mechanism. The therapist underscored how traumatic experiences can catalyze meaning-making, personal transformation, and increased resilience. Clients shared examples of finding new strengths after adversity, and the session reframed trauma not only as loss, but also as an opportunity for profound reorganization.', 15),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a group discussion on symbolization as a conversion process in which distressing thoughts are transformed into metaphorical or symbolic representations. The therapist explained its frequent expression in dreams, rituals, or creative output. Clients processed examples of symbolic displacement in their lives, and the therapist encouraged them to explore the underlying meaning hidden beneath these representations.', 16),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a session on trivializing as a defense that diminishes the significance of distressing experiences. The therapist highlighted how this conversion mechanism reduces perceived threat but invalidates authentic emotions. Clients reflected on moments when they minimized personal struggles, and the group emphasized the importance of acknowledgment as the first step toward adaptive resolution.', 17),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group session on conversion as a defense mechanism that translates unresolved psychological conflict into physical symptoms. The therapist explained how stress or inner conflict may manifest as bodily sensations, such as pain or paralysis, without a medical cause. Clients were encouraged to explore how somatic complaints can serve as a mask for unprocessed emotions, reinforcing the importance of integrating mind–body awareness.', 18),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a psychoeducational intervention on aim inhibition. The therapist described how individuals may unconsciously lower their goals to avoid the threat of failure, thereby reducing anxiety at the expense of personal growth. Clients shared experiences of "settling" for less demanding tasks, and the group examined how incremental goal-setting can help balance self-protection with achievement.', 19),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a discussion on altruism as a constructive conversion mechanism. The therapist emphasized how helping others often serves as an outlet for internal distress, transforming anxiety into prosocial behavior. Clients reflected on experiences where providing support to others enhanced their own sense of purpose, underscoring altruism as both adaptive and restorative.', 20),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a session on displacement as a conversion strategy in which negative affect is redirected toward a safer target. The therapist illustrated how anger or frustration aimed at an inaccessible source may be unconsciously shifted onto someone less threatening. Clients examined relational consequences of displacement and were encouraged to explore healthier outlets for emotional expression.', 21),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group discussion on idealization as a defense mechanism that amplifies the positive qualities of a person or situation while ignoring flaws. The therapist explained how this distortion may serve as a temporary buffer against disappointment but can impair authentic relationships. Clients reflected on times when idealization shaped their perceptions, and balanced appraisal was introduced as a corrective strategy.', 22),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a psychoeducational session on post-traumatic growth as a transformative coping process. The therapist highlighted how trauma, though painful, can catalyze personal development, resilience, and new perspectives on life. Clients shared examples of strengths discovered through adversity, reinforcing post-traumatic growth as a constructive form of psychological reorganization.', 23),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a session on reaction formation. The therapist explained how intolerable impulses are unconsciously managed by adopting exaggerated opposite behaviors, creating incongruence between internal affect and outward expression. Clients explored personal examples of overcompensation and discussed how authenticity can reduce internal conflict.', 24),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a group exploration of sublimation as one of the most adaptive conversion mechanisms. The therapist underscored how psychic energy from unacceptable impulses can be redirected into creative, athletic, or professional pursuits. Clients identified personal practices where sublimation transformed distress into productivity, reinforcing its value for resilience and growth.', 25),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a session on substitution as a mechanism that replaces unattainable or maladaptive goals with safer alternatives. The therapist described how substitution can reduce frustration and preserve self-esteem. Clients processed examples of replacing unhealthy behaviors with constructive choices, underscoring substitution as an important step in behavioral change.', 26),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a psychoeducational intervention on symbolization. The therapist explained how unacceptable or distressing thoughts are often converted into metaphoric symbols, which may appear in dreams, rituals, or creative expression. Clients explored symbolic expressions in their own experiences and were guided to examine the underlying conflicts these may represent.', 27),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a group session on trivializing as a defensive conversion mechanism. The therapist highlighted how minimizing the seriousness of issues allows temporary avoidance but invalidates authentic emotional experience. Clients reflected on times when they downplayed distress, and the therapist reframed acknowledgment as a necessary step toward adaptive resolution.', 28),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational group focused on transformative coping mechanisms, emphasizing how the mind unconsciously reshapes distress into alternate forms of expression. The therapist explained how mechanisms such as sublimation, substitution, and reaction formation allow emotional energy to be redirected in socially acceptable or less distressing ways. Clients discussed personal examples of these transformations and reflected on how awareness can foster healthier adaptation.', 29),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a session on aim inhibition as a cognitive adaptation strategy that lowers one''s goals to reduce frustration and anxiety. The therapist explained how this mechanism protects self-esteem by adjusting expectations but may limit personal growth if overused. Clients examined situations where they settled for less to avoid disappointment and explored ways to balance realism with ambition.', 30),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a group discussion on altruism as a positive transformation of internal distress into acts of service. The therapist illustrated how helping others can relieve personal anxiety and promote meaning-making. Clients shared instances of altruistic behavior as a coping method and identified boundaries to prevent emotional exhaustion or codependency.', 31),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational session on conversion as a mechanism in which emotional conflict manifests through physical symptoms. The therapist explained that unconscious transformation of distress into bodily sensations can obscure underlying psychological issues. Clients reflected on psychosomatic experiences and discussed how emotional awareness and expression can reduce physical tension.', 32),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a group on displacement as a coping mechanism that transfers emotional energy from a threatening source to a safer target. The therapist discussed how this transformation often occurs unconsciously, offering temporary relief while misdirecting resolution. Clients identified recent examples of displaced anger and practiced mindfulness to identify root causes of emotional reactivity.', 33),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a group exploration of idealization as a defense that transforms emotional uncertainty into exaggerated admiration. The therapist explained that this process can temporarily protect self-worth but may lead to disillusionment when reality contradicts fantasy. Clients examined relationships or goals they had idealized and discussed developing balanced, reality-based perspectives.', 34),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a session on post-traumatic growth as a transformative mechanism through which individuals use trauma as a catalyst for personal development. The therapist discussed how confronting adversity can promote resilience, gratitude, and deeper life purpose. Clients identified strengths they discovered through hardship and created action steps to maintain this positive transformation.', 35),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a psychoeducational discussion on reaction formation as a mechanism where unacceptable impulses are converted into their opposite behaviors. The therapist described how this transformation reduces internal tension but creates incongruence between emotions and actions. Clients explored examples of overcompensation and practiced acknowledging true emotions as part of authentic coping.', 36),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a session on somatization as an unconscious transformation of psychological distress into physical symptoms. The therapist explained that this conversion often masks unresolved emotional pain and can result in chronic tension or fatigue. Clients explored the mind–body connection and practiced identifying emotional triggers behind physical discomfort.', 37),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational group on sublimation as an adaptive coping strategy that channels inner conflict into socially acceptable outlets. The therapist highlighted how creativity, physical activity, and productivity can redirect energy constructively. Clients discussed ways to use sublimation to manage frustration and enhance emotional regulation.', 38),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a group discussion on substitution as a mechanism where unmet desires or unattainable goals are replaced with more achievable alternatives. The therapist explained how substitution can transform disappointment into manageable motivation. Clients reflected on personal experiences of redirecting goals and discussed balancing flexibility with persistence.', 39),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a psychoeducational session on symbolization as a mechanism that converts complex emotional content into metaphoric or symbolic expressions. The therapist explained how symbolic behaviors or dreams often reveal hidden internal conflict. Clients explored recurring symbols in their art, writing, or imagination to deepen emotional insight.', 40),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a discussion on trivializing as a defense mechanism that transforms emotional threat into perceived insignificance. The therapist explained how minimizing distress may protect from vulnerability but invalidates genuine emotion. Clients reflected on instances where they downplayed pain and practiced emotional validation to foster self-acceptance.', 41),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational group on conversion mechanisms as psychological transformations that mask the source of distress. The therapist explained how anxiety or guilt can manifest through altered behaviors, attitudes, or somatic symptoms. Clients explored how unacknowledged conflict may resurface indirectly and practiced techniques for identifying emotional authenticity.', 42),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a group exploration of sublimation as an example of healthy psychological transformation. The therapist emphasized that this mechanism allows individuals to redirect aggressive or sexual impulses into productive outlets such as art or exercise. Clients identified positive activities that help them manage emotional energy constructively.', 43),
    (v_activity_id, v_subactivity_id, 'IOP Therapist led a session on reaction formation and idealization as mechanisms of emotional transformation. The therapist discussed how both defenses mask deeper insecurities by converting discomfort into exaggerated positivity. Clients shared experiences of overcompensation and practiced balanced self-reflection to increase emotional congruence.', 44),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a psychoeducational session on somatization and conversion as examples of hidden transformation. The therapist explained how the body can express psychological conflict when emotions remain repressed. Clients discussed the importance of emotional awareness in preventing psychosomatic patterns and practiced relaxation and expressive writing exercises.', 45),
    (v_activity_id, v_subactivity_id, 'IOP Therapist guided a group reflection on post-traumatic growth as an example of adaptive transformation. The therapist explained how reframing trauma through meaning-making enhances resilience and psychological flexibility. Clients identified personal growth that emerged after hardship and explored strategies to maintain post-traumatic resilience.', 46),
    (v_activity_id, v_subactivity_id, 'IOP Therapist conducted a group discussion on symbolization and creative expression as therapeutic forms of psychological transformation. The therapist highlighted how metaphor, art, and writing can externalize internal conflict safely. Clients participated in brief creative exercises to translate emotion into symbolic representation and gain insight into unconscious processes.', 47),
    (v_activity_id, v_subactivity_id, 'IOP Therapist facilitated a closing group integrating transformative coping mechanisms within the broader context of emotional adaptation. The therapist emphasized that transformation occurs when distress is redirected rather than suppressed. Clients reflected on how awareness of these mechanisms can increase self-regulation, promote authenticity, and strengthen resilience in daily functioning.', 48);

    -- Verificar inserción
    SELECT COUNT(*) INTO v_paragraph_count
    FROM activity_paragraphs
    WHERE activity_id = v_activity_id
    AND subactivity_id = v_subactivity_id;

    RAISE NOTICE '✅✅✅ COMPLETADO: % párrafos insertados para "Conversion Mechanisms" ✅✅✅', v_paragraph_count;

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
AND LOWER(sa.subactivity_name) = 'conversion mechanisms'
GROUP BY a.activity_name, sa.subactivity_name
ORDER BY a.activity_name, sa.subactivity_name;

