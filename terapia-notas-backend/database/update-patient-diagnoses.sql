-- Actualizar diagnósticos de pacientes con códigos válidos de available_diagnoses
-- Variar los diagnósticos entre Mood Disorders y Anxiety Disorders

-- P001 (Juan Pérez) - Mantener F41.1 pero actualizar descripción
UPDATE patient_diagnoses 
SET diagnosis_description = 'Generalized anxiety disorder'
WHERE patient_id IN (
    SELECT patient_id FROM patients WHERE patient_number = 'P001'
) AND icd10_code = 'F41.1';

-- P002 (María González) - Cambiar a Mood Disorder
UPDATE patient_diagnoses 
SET icd10_code = 'F33.2',
    diagnosis_description = 'Major depressive disorder, recurrent, severe without psychotic symptoms'
WHERE patient_id IN (
    SELECT patient_id FROM patients WHERE patient_number = 'P002'
);

-- P003 (Carlos Rodríguez) - Mantener F41.1 (es válido)
UPDATE patient_diagnoses 
SET diagnosis_description = 'Generalized anxiety disorder'
WHERE patient_id IN (
    SELECT patient_id FROM patients WHERE patient_number = 'P003'
) AND icd10_code = 'F41.1';

-- P004 (Ana Martínez) - Cambiar a Mood Disorder
UPDATE patient_diagnoses 
SET icd10_code = 'F32.1',
    diagnosis_description = 'Major depressive disorder, single episode, moderate'
WHERE patient_id IN (
    SELECT patient_id FROM patients WHERE patient_number = 'P004'
);

-- P005 (Luis Fernández) - Cambiar a otro Anxiety Disorder
UPDATE patient_diagnoses 
SET icd10_code = 'F41.0',
    diagnosis_description = 'Panic disorder (episodic paroxysmal anxiety)'
WHERE patient_id IN (
    SELECT patient_id FROM patients WHERE patient_number = 'P005'
);

-- P006 (Sofía Herrera) - Cambiar a Mood Disorder
UPDATE patient_diagnoses 
SET icd10_code = 'F33.0',
    diagnosis_description = 'Major depressive disorder, recurrent, mild'
WHERE patient_id IN (
    SELECT patient_id FROM patients WHERE patient_number = 'P006'
);

-- P007 (Miguel Torres) - Mantener F41.1 pero actualizar descripción
UPDATE patient_diagnoses 
SET diagnosis_description = 'Generalized anxiety disorder'
WHERE patient_id IN (
    SELECT patient_id FROM patients WHERE patient_number = 'P007'
) AND icd10_code = 'F41.1';

-- P008 (Patricia López) - Cambiar a Mood Disorder
UPDATE patient_diagnoses 
SET icd10_code = 'F32.2',
    diagnosis_description = 'Major depressive disorder, single episode, severe, without psychotic features'
WHERE patient_id IN (
    SELECT patient_id FROM patients WHERE patient_number = 'P008'
);

-- P100 (María Elena) - Actualizar F41.1 y cambiar F32.9 (no válido) por F32.0
UPDATE patient_diagnoses 
SET diagnosis_description = 'Generalized anxiety disorder'
WHERE patient_id IN (
    SELECT patient_id FROM patients WHERE patient_number = 'P100'
) AND icd10_code = 'F41.1';

UPDATE patient_diagnoses 
SET icd10_code = 'F32.0',
    diagnosis_description = 'Major depressive disorder, single episode, mild'
WHERE patient_id IN (
    SELECT patient_id FROM patients WHERE patient_number = 'P100'
) AND icd10_code = 'F32.9';

-- P101 (Juan Pérez IOP) - Cambiar a Mood Disorder con múltiples diagnósticos
UPDATE patient_diagnoses 
SET icd10_code = 'F33.2',
    diagnosis_description = 'Major depressive disorder, recurrent, severe without psychotic symptoms',
    is_primary = true
WHERE patient_id IN (
    SELECT patient_id FROM patients WHERE patient_number = 'P101'
);

-- Agregar diagnóstico secundario para P101 si no existe
INSERT INTO patient_diagnoses (patient_id, icd10_code, diagnosis_description, is_primary)
SELECT p.patient_id, 'F41.1', 'Generalized anxiety disorder', false
FROM patients p
WHERE p.patient_number = 'P101'
AND NOT EXISTS (
    SELECT 1 FROM patient_diagnoses pd 
    WHERE pd.patient_id = p.patient_id AND pd.icd10_code = 'F41.1'
);

-- P103 (Carlos Rodríguez IOP) - Cambiar a Mood Disorder
UPDATE patient_diagnoses 
SET icd10_code = 'F32.1',
    diagnosis_description = 'Major depressive disorder, single episode, moderate'
WHERE patient_id IN (
    SELECT patient_id FROM patients WHERE patient_number = 'P103'
);

-- Agregar diagnóstico secundario para P103
INSERT INTO patient_diagnoses (patient_id, icd10_code, diagnosis_description, is_primary)
SELECT p.patient_id, 'F43.23', 'Adjustment disorder with mixed anxiety and depressed mood', false
FROM patients p
WHERE p.patient_number = 'P103'
AND NOT EXISTS (
    SELECT 1 FROM patient_diagnoses pd 
    WHERE pd.patient_id = p.patient_id AND pd.icd10_code = 'F43.23'
);

-- P104 (Ana Martínez IOP) - Cambiar a Anxiety Disorder diferente
UPDATE patient_diagnoses 
SET icd10_code = 'F41.0',
    diagnosis_description = 'Panic disorder (episodic paroxysmal anxiety)'
WHERE patient_id IN (
    SELECT patient_id FROM patients WHERE patient_number = 'P104'
);

-- Agregar diagnóstico secundario para P104
INSERT INTO patient_diagnoses (patient_id, icd10_code, diagnosis_description, is_primary)
SELECT p.patient_id, 'F33.1', 'Major depressive disorder, recurrent, moderate', false
FROM patients p
WHERE p.patient_number = 'P104'
AND NOT EXISTS (
    SELECT 1 FROM patient_diagnoses pd 
    WHERE pd.patient_id = p.patient_id AND pd.icd10_code = 'F33.1'
);

-- P108 (Patricia López IOP) - Cambiar a Mood Disorder
UPDATE patient_diagnoses 
SET icd10_code = 'F34.1',
    diagnosis_description = 'Dysthymic disorder (Persistent depressive disorder)'
WHERE patient_id IN (
    SELECT patient_id FROM patients WHERE patient_number = 'P108'
);

-- Agregar diagnóstico secundario para P108
INSERT INTO patient_diagnoses (patient_id, icd10_code, diagnosis_description, is_primary)
SELECT p.patient_id, 'F41.1', 'Generalized anxiety disorder', false
FROM patients p
WHERE p.patient_number = 'P108'
AND NOT EXISTS (
    SELECT 1 FROM patient_diagnoses pd 
    WHERE pd.patient_id = p.patient_id AND pd.icd10_code = 'F41.1'
);

-- Verificar que todos los códigos sean válidos
SELECT 
    p.patient_number,
    p.first_name || ' ' || p.last_name as patient_name,
    pd.icd10_code,
    pd.diagnosis_description,
    pd.is_primary,
    CASE 
        WHEN ad.icd10_code IS NOT NULL THEN '✅ Válido'
        ELSE '❌ NO Válido'
    END as validacion
FROM patients p
INNER JOIN patient_diagnoses pd ON p.patient_id = pd.patient_id
LEFT JOIN available_diagnoses ad ON pd.icd10_code = ad.icd10_code AND ad.is_active = true
ORDER BY p.patient_number, pd.is_primary DESC;


