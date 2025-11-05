-- =============================================
-- TABLA PARA NOTAS GENERADAS - TERAPIA NOTA
-- PostgreSQL 16
-- RF-015: Generación de notas diarias
-- =============================================

-- Tabla para almacenar las notas diarias generadas
CREATE TABLE IF NOT EXISTS generated_notes (
    note_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(patient_id) NOT NULL,
    week_id UUID REFERENCES group_weeks(week_id) NOT NULL,
    attendance_id UUID REFERENCES attendance(attendance_id),
    note_date DATE NOT NULL,

    -- Goal utilizado (rotación semanal)
    goal_number INTEGER NOT NULL CHECK (goal_number BETWEEN 1 AND 4),
    goal_text TEXT NOT NULL,

    -- Párrafo predefinido utilizado
    paragraph_id UUID REFERENCES activity_paragraphs(paragraph_id),
    paragraph_text TEXT NOT NULL,

    -- Respuesta al tratamiento (única, no repetida)
    response_text TEXT NOT NULL,
    response_hash VARCHAR(64) NOT NULL,

    -- Metadata de asistencia
    attendance_summary JSONB, -- Tabla de asistencia semanal
    program_type VARCHAR(10), -- 'PHP' o 'IOP'
    shift VARCHAR(20), -- 'Mañana' o 'Tarde'

    -- Ruta del archivo generado
    file_path VARCHAR(500),
    file_name VARCHAR(255),

    -- Metadata
    generated_by UUID REFERENCES users(user_id),
    is_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraint: Una nota por paciente por día
    UNIQUE(patient_id, note_date)
);

-- Índices para optimización
CREATE INDEX idx_generated_notes_patient ON generated_notes(patient_id);
CREATE INDEX idx_generated_notes_week ON generated_notes(week_id);
CREATE INDEX idx_generated_notes_date ON generated_notes(note_date);
CREATE INDEX idx_generated_notes_response_hash ON generated_notes(response_hash);

-- Comentarios
COMMENT ON TABLE generated_notes IS 'Almacena las notas diarias generadas para cada paciente (RF-015)';
COMMENT ON COLUMN generated_notes.goal_number IS 'Número del goal utilizado (1-4), rota semanalmente';
COMMENT ON COLUMN generated_notes.response_hash IS 'SHA256 hash para evitar repetición de respuestas';
COMMENT ON COLUMN generated_notes.attendance_summary IS 'Tabla de asistencia semanal en formato JSON';
COMMENT ON COLUMN generated_notes.is_locked IS 'Si está bloqueada, no se puede modificar ni eliminar';
