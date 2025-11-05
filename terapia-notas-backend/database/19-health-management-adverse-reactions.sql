-- =============================================
-- PÁRRAFOS PARA "ADVERSE REACTIONS AND RISKS OF DRUG USE" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session focused on increasing client awareness of the physiological, psychological, and social consequences of substance misuse. The discussion highlighted the cumulative impact of drug use on neurological function, mood regulation, and interpersonal stability. Clients were encouraged to reflect on prior experiences with side effects or negative outcomes. One client demonstrated limited insight, minimizing the risks and expressing ambivalence toward harm reduction strategies.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Adverse Reactions and Risks of Drug Use';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group session examining the spectrum of adverse drug reactions, including allergic responses, dependency risk, cognitive impairment, and emotional lability. Through guided discussion, clients identified substances they had used and explored long-term health implications. Although most participants contributed personal examples, one client remained guarded and avoided acknowledging potential health consequences linked to prior use.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Adverse Reactions and Risks of Drug Use';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a structured discussion on the interaction between prescribed medications and non-prescribed substances, emphasizing the risks of polypharmacy and self-medication. Clients reviewed case scenarios and explored how drug combinations can potentiate anxiety, depression, or psychotic symptoms. While several clients engaged in problem-solving around safer practices, one client voiced mistrust in medical advice and denied any personal vulnerability to adverse reactions.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Adverse Reactions and Risks of Drug Use';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a didactic session on how individual factors—such as age, metabolism, and mental health status—influence drug tolerance and sensitivity to side effects. Clients explored how ignoring early signs of adverse reactions may escalate into medical crises or psychiatric decompensation. Despite receiving clear examples and clinical input, one client dismissed the material as irrelevant, showing no readiness to apply safety measures to their own context.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Adverse Reactions and Risks of Drug Use';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a harm-reduction framework to help clients identify and mitigate the risks associated with recreational or habitual substance use. Topics included overdose prevention, recognizing warning signs of toxicity, and the role of informed consent in pharmacological treatment. The group participated in a risk-assessment worksheet, though one client failed to complete the activity, citing a belief that "nothing bad has happened yet," reflecting poor insight and low risk perception.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Adverse Reactions and Risks of Drug Use';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session addressing the neurobiological effects of chronic drug use and how they contribute to emotional dysregulation, impaired judgment, and increased vulnerability to psychiatric symptoms. Clients discussed personal experiences with side effects such as mood swings, insomnia, or cognitive fog. One client passively observed but did not verbalize concerns or demonstrate readiness to alter current behaviors, indicating limited insight into personal risk.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Adverse Reactions and Risks of Drug Use';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a group discussion focused on identifying early warning signs of adverse reactions, including gastrointestinal distress, cardiovascular symptoms, and psychological agitation. Clients were encouraged to distinguish between expected side effects and dangerous responses requiring immediate attention. Despite clear instruction, one participant appeared disengaged and expressed skepticism about the need for monitoring, demonstrating minimal investment in self-management.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Adverse Reactions and Risks of Drug Use';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a session on the consequences of using illicit substances in combination with psychotropic medications, highlighting increased risks for serotonin syndrome, liver toxicity, and erratic mood shifts. The therapist encouraged collaborative safety planning. Most clients demonstrated interest, though one minimized the severity of past incidents and expressed no intent to modify current patterns, reflecting poor risk appraisal.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Adverse Reactions and Risks of Drug Use';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist provided education on the long-term consequences of substance misuse, such as compromised immune function, hormonal imbalance, and diminished stress tolerance. Clients explored how these effects could interfere with progress in mental health recovery. Although the therapist invited self-reflection, one client remained concrete in thinking and failed to link past drug use to current health concerns.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Adverse Reactions and Risks of Drug Use';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated an interactive group exploring myths versus facts about drug safety, especially regarding the misuse of prescription medications. Clients completed a quiz and engaged in discussion about dosage adherence, interaction risks, and the role of informed decision-making. While the group benefited from clarification, one individual demonstrated resistance to feedback and failed to integrate corrective information, indicating continued denial of vulnerability.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Adverse Reactions and Risks of Drug Use';

