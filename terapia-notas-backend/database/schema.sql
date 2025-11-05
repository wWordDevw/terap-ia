-- =============================================
-- TERAPIA NOTA - ESQUEMA DE BASE DE DATOS
-- PostgreSQL 16
-- =============================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 1. TABLAS DE CONFIGURACIÓN
-- =============================================

-- Tabla de clínicas
CREATE TABLE clinics (
    clinic_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(500),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios del sistema
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'admin', 'therapist', 'nurse'
    clinic_id UUID REFERENCES clinics(clinic_id),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 2. GESTIÓN DE GRUPOS (RF-001 a RF-003)
-- =============================================

-- Tabla de grupos
CREATE TABLE groups (
    group_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES clinics(clinic_id) NOT NULL,
    program_type VARCHAR(10) NOT NULL CHECK (program_type IN ('PHP', 'IOP')),
    shift VARCHAR(20) NOT NULL CHECK (shift IN ('Mañana', 'Tarde')),
    group_name VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de semanas de grupo (RF-003)
CREATE TABLE group_weeks (
    week_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(group_id) NOT NULL,
    week_number INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    notes_generated BOOLEAN DEFAULT FALSE,
    notes_generated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, week_number)
);

-- =============================================
-- 3. GESTIÓN DE PACIENTES (RF-004 a RF-006)
-- =============================================

-- Tabla de pacientes (RF-004)
CREATE TABLE patients (
    patient_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_id UUID REFERENCES clinics(clinic_id) NOT NULL,
    patient_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    admission_date DATE NOT NULL,
    discharge_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de metas de pacientes (RF-004) - 4 goals por paciente
CREATE TABLE patient_goals (
    goal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE NOT NULL,
    goal_number INTEGER NOT NULL CHECK (goal_number BETWEEN 1 AND 4),
    goal_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(patient_id, goal_number)
);

-- Tabla de diagnósticos de pacientes (RF-004)
CREATE TABLE patient_diagnoses (
    diagnosis_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE NOT NULL,
    icd10_code VARCHAR(20) NOT NULL,
    diagnosis_description TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de documentos de pacientes (RF-004, RF-036)
CREATE TABLE patient_documents (
    document_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE NOT NULL,
    document_type VARCHAR(50) NOT NULL, -- 'master_treatment_plan', 'assessment', 'other'
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    uploaded_by UUID REFERENCES users(user_id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relación muchos a muchos: pacientes en grupos
CREATE TABLE group_patients (
    group_patient_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(group_id) NOT NULL,
    patient_id UUID REFERENCES patients(patient_id) NOT NULL,
    joined_date DATE NOT NULL,
    left_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, patient_id)
);

-- =============================================
-- 4. ACTIVIDADES Y HORARIOS
-- =============================================

-- Tabla de actividades
CREATE TABLE activities (
    activity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de subactividades
CREATE TABLE subactivities (
    subactivity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES activities(activity_id) NOT NULL,
    subactivity_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de horarios de grupo (RF-001)
CREATE TABLE group_schedules (
    schedule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES groups(group_id) ON DELETE CASCADE NOT NULL,
    day_of_week VARCHAR(20) NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    activity_id UUID REFERENCES activities(activity_id) NOT NULL,
    subactivity_id UUID REFERENCES subactivities(subactivity_id),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    units DECIMAL(4,2) NOT NULL,
    note_code VARCHAR(10), -- Para identificar notas especiales (ej: viernes PHP, jueves IOP)
    is_nurse_session BOOLEAN DEFAULT FALSE, -- RF-011: marcar cuando trabaja enfermera (unidades = 0)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 5. REGISTRO DE ASISTENCIA (RF-007 a RF-009)
-- =============================================

-- Tabla de asistencia diaria (RF-007)
CREATE TABLE attendance (
    attendance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_id UUID REFERENCES group_weeks(week_id) NOT NULL,
    patient_id UUID REFERENCES patients(patient_id) NOT NULL,
    attendance_date DATE NOT NULL,
    status CHAR(1) NOT NULL CHECK (status IN ('P', 'A', 'D')), -- P=Presente, A=Ausente, D=Discharge
    units_attended DECIMAL(4,2) DEFAULT 0,
    is_locked BOOLEAN DEFAULT FALSE, -- RF-009: bloqueo de cambios
    locked_at TIMESTAMP,
    locked_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(week_id, patient_id, attendance_date)
);

-- Tabla de razones de ausencia (RF-008)
CREATE TABLE absence_reasons (
    reason_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attendance_id UUID REFERENCES attendance(attendance_id) ON DELETE CASCADE NOT NULL,
    reason_type VARCHAR(50) NOT NULL CHECK (reason_type IN ('medical_appointment', 'family_trip', 'hospitalized')),
    start_date DATE NOT NULL,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 6. MTPR (RF-018 a RF-026)
-- =============================================

-- Tabla de calendario de MTPR (RF-018, RF-019)
CREATE TABLE mtpr_schedules (
    mtpr_schedule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE NOT NULL,
    review_number INTEGER NOT NULL,
    scheduled_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    generated_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(patient_id, review_number)
);

-- Tabla de firmas para MTPR (RF-025)
CREATE TABLE signatures (
    signature_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(patient_id) NOT NULL,
    signature_type VARCHAR(50) NOT NULL, -- 'therapist', 'supervisor', 'patient'
    signature_image_path VARCHAR(500),
    signer_name VARCHAR(255) NOT NULL,
    first_used_mtpr UUID REFERENCES mtpr_schedules(mtpr_schedule_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(patient_id, signature_type)
);

-- =============================================
-- 7. MULTIDISCIPLINARIO (RF-027 a RF-033)
-- =============================================

-- Tabla de calendario multidisciplinario (RF-027, RF-028)
CREATE TABLE multidisciplinary_schedules (
    multi_schedule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(patient_id) ON DELETE CASCADE NOT NULL,
    mtpr_schedule_id UUID REFERENCES mtpr_schedules(mtpr_schedule_id) NOT NULL,
    review_number INTEGER NOT NULL,
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    generated_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 8. GESTIÓN DE CONTENIDO (RF-034, RF-035)
-- =============================================

-- Tabla de párrafos predefinidos por actividad (RF-015, RF-034)
CREATE TABLE activity_paragraphs (
    paragraph_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES activities(activity_id) NOT NULL,
    subactivity_id UUID REFERENCES subactivities(subactivity_id),
    paragraph_text TEXT NOT NULL,
    paragraph_order INTEGER,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de historial de uso de párrafos (RF-034)
CREATE TABLE paragraph_usage_history (
    usage_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    paragraph_id UUID REFERENCES activity_paragraphs(paragraph_id) NOT NULL,
    group_id UUID REFERENCES groups(group_id) NOT NULL,
    week_id UUID REFERENCES group_weeks(week_id) NOT NULL,
    patient_id UUID REFERENCES patients(patient_id) NOT NULL,
    used_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de historial de respuestas generadas (RF-035)
CREATE TABLE generated_responses_history (
    response_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(patient_id) NOT NULL,
    response_text TEXT NOT NULL,
    response_hash VARCHAR(64) NOT NULL, -- SHA256 del texto
    activity_id UUID REFERENCES activities(activity_id),
    goal_number INTEGER,
    used_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 9. AUDITORÍA
-- =============================================

-- Tabla de log de auditoría
CREATE TABLE audit_log (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id),
    action VARCHAR(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE', 'GENERATE_NOTE'
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 10. ÍNDICES PARA OPTIMIZACIÓN
-- =============================================

-- Índices para mejora de rendimiento
CREATE INDEX idx_patients_clinic ON patients(clinic_id);
CREATE INDEX idx_patients_number ON patients(patient_number);
CREATE INDEX idx_patients_active ON patients(is_active);
CREATE INDEX idx_patients_discharge ON patients(discharge_date);

CREATE INDEX idx_attendance_week ON attendance(week_id);
CREATE INDEX idx_attendance_patient ON attendance(patient_id);
CREATE INDEX idx_attendance_date ON attendance(attendance_date);
CREATE INDEX idx_attendance_status ON attendance(status);

CREATE INDEX idx_mtpr_patient ON mtpr_schedules(patient_id);
CREATE INDEX idx_mtpr_date ON mtpr_schedules(scheduled_date);
CREATE INDEX idx_mtpr_completed ON mtpr_schedules(is_completed);

CREATE INDEX idx_group_weeks_group ON group_weeks(group_id);
CREATE INDEX idx_group_weeks_current ON group_weeks(is_current);

CREATE INDEX idx_group_patients_group ON group_patients(group_id);
CREATE INDEX idx_group_patients_patient ON group_patients(patient_id);
CREATE INDEX idx_group_patients_active ON group_patients(is_active);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- =============================================
-- COMENTARIOS EN TABLAS
-- =============================================

COMMENT ON TABLE clinics IS 'Catálogo de clínicas (RF-037)';
COMMENT ON TABLE groups IS 'Grupos de terapia PHP o IOP (RF-001)';
COMMENT ON TABLE group_weeks IS 'Semanas de trabajo de cada grupo (RF-003)';
COMMENT ON TABLE patients IS 'Información de pacientes (RF-004)';
COMMENT ON TABLE patient_goals IS 'Metas de pacientes - 4 por cada uno (RF-004)';
COMMENT ON TABLE attendance IS 'Registro diario de asistencia (RF-007)';
COMMENT ON TABLE absence_reasons IS 'Justificaciones de ausencias (RF-008)';
COMMENT ON TABLE mtpr_schedules IS 'Calendario de MTPR (RF-018)';
COMMENT ON TABLE multidisciplinary_schedules IS 'Calendario Multidisciplinario (RF-027)';
COMMENT ON TABLE activity_paragraphs IS 'Párrafos predefinidos para notas (RF-034)';
COMMENT ON TABLE generated_responses_history IS 'Evita repetición de respuestas (RF-035)';
