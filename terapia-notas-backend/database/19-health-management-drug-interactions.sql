-- =============================================
-- PÁRRAFOS PARA "DRUG INTERACTIONS, SIDE EFFECTS, RISKS" (10 párrafos)
-- =============================================

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a psychoeducational session on the physiological and psychological implications of drug interactions and side effects. Clients were encouraged to identify any past experiences with adverse reactions or polypharmacy complications. Emphasis was placed on the importance of transparency with providers, adherence to prescribed regimens, and early reporting of unusual symptoms.',
    1
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Drug Interactions, Side Effects, Risks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist conducted a session focused on enhancing clients'' health literacy regarding the risks associated with mixing prescribed medications with over-the-counter substances, supplements, or illicit drugs. Using real-world scenarios, the group discussed the dangers of serotonin syndrome, liver toxicity, and cognitive impairment, reinforcing the need for consistent medical monitoring.',
    2
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Drug Interactions, Side Effects, Risks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a group discussion examining common side effects of psychotropic medications and how these may impact daily functioning, mood regulation, and treatment adherence. Clients reflected on their current regimens, shared personal challenges, and explored strategies for communicating concerns with their prescribers in a constructive manner.',
    3
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Drug Interactions, Side Effects, Risks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist introduced a risk-benefit framework for evaluating medication compliance, highlighting how untreated symptoms can outweigh certain tolerable side effects. Clients were guided to track and document physical, emotional, or behavioral changes since starting or adjusting medications, promoting greater insight into patterns and reactions.',
    4
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Drug Interactions, Side Effects, Risks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist engaged clients in an interactive session analyzing case examples of harmful drug interactions and misuse. The group explored how substance use, whether recreational or as self-medication, can interfere with prescribed treatments and compromise recovery goals. The importance of pharmacist consultation and medication reconciliation was emphasized.',
    5
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Drug Interactions, Side Effects, Risks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist facilitated a group session aimed at increasing awareness of the cumulative effects of drug interactions, especially among clients managing multiple prescriptions. Clients were educated on the role of metabolism, enzyme inhibition, and organ system vulnerabilities (e.g., hepatic or renal) in adverse drug responses. Discussion included strategies to track medication schedules and avoid duplication or contraindicated combinations.',
    6
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Drug Interactions, Side Effects, Risks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist provided psychoeducation on how side effects of medications can mimic or exacerbate psychiatric symptoms, such as fatigue, agitation, or mood instability. Clients were encouraged to distinguish between expected pharmacological effects and concerning changes, enhancing their ability to self-monitor and report effectively to prescribing clinicians.',
    7
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Drug Interactions, Side Effects, Risks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist led a reflective session in which clients explored the emotional and behavioral risks associated with poor medication adherence due to side effects. Topics included stigma, fear of dependency, and past negative experiences. The group processed how these factors can lead to avoidance and destabilization, and reviewed supportive tools to increase adherence while advocating for needed adjustments.',
    8
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Drug Interactions, Side Effects, Risks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist guided a session exploring the potential for dangerous interactions between prescribed medications and non-prescribed substances such as alcohol, nicotine, herbal remedies, and street drugs. Clients identified personal risk factors and reviewed steps for harm reduction, including open communication with providers and the use of medication tracking tools.',
    9
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Drug Interactions, Side Effects, Risks';

INSERT INTO activity_paragraphs (activity_id, subactivity_id, paragraph_text, paragraph_order)
SELECT 
    a.activity_id,
    sa.subactivity_id,
    'PHP Therapist initiated a group discussion on the importance of understanding black box warnings, package inserts, and pharmacist consultations. Clients learned how to access and interpret medication information and how to advocate for themselves when side effects interfere with functioning. Emphasis was placed on collaborative decision-making and shared responsibility in treatment planning.',
    10
FROM activities a
JOIN subactivities sa ON a.activity_id = sa.activity_id
WHERE a.activity_name = 'Health Management' AND sa.subactivity_name = 'Drug Interactions, Side Effects, Risks';

