-- =============================================
-- TABLA DE DIAGNÓSTICOS DISPONIBLES (MAESTRA ICD-10)
-- =============================================
-- Esta tabla contiene los códigos ICD-10 disponibles en el sistema
-- para que el frontend pueda listarlos durante la creación de pacientes

CREATE TABLE IF NOT EXISTS available_diagnoses (
    diagnosis_code_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    icd10_code VARCHAR(20) NOT NULL UNIQUE,
    diagnosis_description VARCHAR(500) NOT NULL,
    category VARCHAR(100), -- Categoría del diagnóstico (ej: Mood Disorders, Anxiety Disorders)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_available_diagnoses_code ON available_diagnoses(icd10_code);
CREATE INDEX IF NOT EXISTS idx_available_diagnoses_active ON available_diagnoses(is_active);
CREATE INDEX IF NOT EXISTS idx_available_diagnoses_category ON available_diagnoses(category);

-- Comentarios
COMMENT ON TABLE available_diagnoses IS 'Tabla maestra de códigos ICD-10 disponibles en el sistema para uso durante la creación de pacientes';
COMMENT ON COLUMN available_diagnoses.icd10_code IS 'Código ICD-10 (ej: F33.2, F41.1)';
COMMENT ON COLUMN available_diagnoses.diagnosis_description IS 'Descripción del diagnóstico';
COMMENT ON COLUMN available_diagnoses.category IS 'Categoría del diagnóstico (ej: Mood Disorders, Anxiety Disorders)';

-- =============================================
-- INSERTAR DIAGNÓSTICOS DISPONIBLES
-- =============================================

-- Mood Disorders (F30–F39)
INSERT INTO available_diagnoses (icd10_code, diagnosis_description, category) VALUES
('F32.0', 'Major depressive disorder, single episode, mild', 'Mood Disorders'),
('F32.1', 'Major depressive disorder, single episode, moderate', 'Mood Disorders'),
('F32.2', 'Major depressive disorder, single episode, severe, without psychotic features', 'Mood Disorders'),
('F32.3', 'Major depressive disorder, single episode, severe, with psychotic features', 'Mood Disorders'),
('F33.0', 'Major depressive disorder, recurrent, mild', 'Mood Disorders'),
('F33.1', 'Major depressive disorder, recurrent, moderate', 'Mood Disorders'),
('F33.2', 'Major depressive disorder, recurrent, severe without psychotic symptoms', 'Mood Disorders'),
('F33.3', 'Major depressive disorder, recurrent, severe with psychotic symptoms', 'Mood Disorders'),
('F34.1', 'Dysthymic disorder (Persistent depressive disorder)', 'Mood Disorders'),
('F31.9', 'Bipolar disorder, unspecified', 'Mood Disorders')
ON CONFLICT (icd10_code) DO UPDATE SET
    diagnosis_description = EXCLUDED.diagnosis_description,
    category = EXCLUDED.category,
    updated_at = CURRENT_TIMESTAMP;

-- Anxiety and Stress-Related Disorders (F40–F48)
INSERT INTO available_diagnoses (icd10_code, diagnosis_description, category) VALUES
('F40.00', 'Agoraphobia, unspecified', 'Anxiety Disorders'),
('F40.10', 'Social phobia, unspecified', 'Anxiety Disorders'),
('F41.0', 'Panic disorder (episodic paroxysmal anxiety)', 'Anxiety Disorders'),
('F41.1', 'Generalized anxiety disorder', 'Anxiety Disorders'),
('F41.9', 'Anxiety disorder, unspecified', 'Anxiety Disorders'),
('F42.9', 'Obsessive-compulsive disorder, unspecified', 'Anxiety Disorders'),
('F43.10', 'Post-traumatic stress disorder, unspecified', 'Anxiety Disorders'),
('F43.11', 'Post-traumatic stress disorder, acute', 'Anxiety Disorders'),
('F43.12', 'Post-traumatic stress disorder, chronic', 'Anxiety Disorders'),
('F43.21', 'Adjustment disorder with depressed mood', 'Anxiety Disorders'),
('F43.22', 'Adjustment disorder with anxiety', 'Anxiety Disorders'),
('F43.23', 'Adjustment disorder with mixed anxiety and depressed mood', 'Anxiety Disorders')
ON CONFLICT (icd10_code) DO UPDATE SET
    diagnosis_description = EXCLUDED.diagnosis_description,
    category = EXCLUDED.category,
    updated_at = CURRENT_TIMESTAMP;

-- Sleep-Related Disorders (G47.xx / F51.xx)
INSERT INTO available_diagnoses (icd10_code, diagnosis_description, category) VALUES
('G47.00', 'Insomnia, unspecified', 'Sleep Disorders'),
('G47.01', 'Insomnia due to medical condition', 'Sleep Disorders'),
('G47.09', 'Other insomnia', 'Sleep Disorders'),
('F51.01', 'Primary insomnia', 'Sleep Disorders'),
('F51.02', 'Adjustment insomnia', 'Sleep Disorders'),
('F51.03', 'Paradoxical insomnia', 'Sleep Disorders')
ON CONFLICT (icd10_code) DO UPDATE SET
    diagnosis_description = EXCLUDED.diagnosis_description,
    category = EXCLUDED.category,
    updated_at = CURRENT_TIMESTAMP;

-- Somatoform & Dissociative Disorders
INSERT INTO available_diagnoses (icd10_code, diagnosis_description, category) VALUES
('F44.81', 'Depersonalization-derealization disorder', 'Dissociative Disorders'),
('F45.1', 'Somatization disorder', 'Somatoform Disorders'),
('F48.2', 'Neurasthenia', 'Somatoform Disorders')
ON CONFLICT (icd10_code) DO UPDATE SET
    diagnosis_description = EXCLUDED.diagnosis_description,
    category = EXCLUDED.category,
    updated_at = CURRENT_TIMESTAMP;

-- Psychosocial & Environmental Factors (Z-codes)
INSERT INTO available_diagnoses (icd10_code, diagnosis_description, category) VALUES
('Z63.4', 'Disappearance and death of family member', 'Psychosocial Factors'),
('Z63.5', 'Disruption of family by separation and divorce', 'Psychosocial Factors'),
('Z63.8', 'Other specified problems related to primary support group', 'Psychosocial Factors'),
('Z72.820', 'Sleep deprivation', 'Psychosocial Factors'),
('Z60.0', 'Problems of adjustment to life-cycle transitions', 'Psychosocial Factors')
ON CONFLICT (icd10_code) DO UPDATE SET
    diagnosis_description = EXCLUDED.diagnosis_description,
    category = EXCLUDED.category,
    updated_at = CURRENT_TIMESTAMP;

-- Other Frequently Used Mental Health Codes
INSERT INTO available_diagnoses (icd10_code, diagnosis_description, category) VALUES
('F50.00', 'Anorexia nervosa, unspecified', 'Eating Disorders'),
('F50.2', 'Bulimia nervosa', 'Eating Disorders'),
('F52.8', 'Other sexual dysfunction not due to substance or known physiological condition', 'Sexual Disorders'),
('F60.3', 'Borderline personality disorder', 'Personality Disorders'),
('F60.5', 'Obsessive-compulsive personality disorder', 'Personality Disorders'),
('F90.0', 'ADHD, predominantly inattentive type', 'Neurodevelopmental Disorders'),
('F90.2', 'ADHD, combined type', 'Neurodevelopmental Disorders'),
('F91.3', 'Oppositional defiant disorder', 'Disruptive Disorders')
ON CONFLICT (icd10_code) DO UPDATE SET
    diagnosis_description = EXCLUDED.diagnosis_description,
    category = EXCLUDED.category,
    updated_at = CURRENT_TIMESTAMP;

-- Verificar diagnósticos insertados
SELECT 
    category,
    COUNT(*) as total,
    STRING_AGG(icd10_code, ', ' ORDER BY icd10_code) as codes
FROM available_diagnoses
WHERE is_active = TRUE
GROUP BY category
ORDER BY category;

