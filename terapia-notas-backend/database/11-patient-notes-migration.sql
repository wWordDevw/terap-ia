-- =============================================
-- MIGRACIÓN: Sistema de Notas del Paciente
-- =============================================

-- Agregar nuevos campos a la tabla patients
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS cancellation_date DATE,
ADD COLUMN IF NOT EXISTS insurance VARCHAR(100),
ADD COLUMN IF NOT EXISTS additional_notes TEXT;

-- Crear tabla patient_notes
CREATE TABLE IF NOT EXISTS patient_notes (
    note_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fecha DATE NOT NULL,
    autor VARCHAR(100) NOT NULL,
    autor_rol VARCHAR(50) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'general' CHECK (tipo IN ('general', 'medica', 'terapeutica', 'administrativa')),
    privacidad VARCHAR(20) NOT NULL DEFAULT 'publica' CHECK (privacidad IN ('publica', 'privada', 'confidencial')),
    tags TEXT[], -- Array de strings para etiquetas
    patient_id UUID NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_patient_notes_patient_id ON patient_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_notes_fecha ON patient_notes(fecha);
CREATE INDEX IF NOT EXISTS idx_patient_notes_tipo ON patient_notes(tipo);
CREATE INDEX IF NOT EXISTS idx_patient_notes_privacidad ON patient_notes(privacidad);

-- Crear trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_patient_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_patient_notes_updated_at
    BEFORE UPDATE ON patient_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_patient_notes_updated_at();

-- Comentarios para documentación
COMMENT ON TABLE patient_notes IS 'Notas asociadas a los pacientes del sistema';
COMMENT ON COLUMN patient_notes.note_id IS 'Identificador único de la nota';
COMMENT ON COLUMN patient_notes.fecha IS 'Fecha de la nota';
COMMENT ON COLUMN patient_notes.autor IS 'Nombre del autor de la nota';
COMMENT ON COLUMN patient_notes.autor_rol IS 'Rol del autor de la nota';
COMMENT ON COLUMN patient_notes.titulo IS 'Título de la nota';
COMMENT ON COLUMN patient_notes.contenido IS 'Contenido de la nota';
COMMENT ON COLUMN patient_notes.tipo IS 'Tipo de nota: general, medica, terapeutica, administrativa';
COMMENT ON COLUMN patient_notes.privacidad IS 'Nivel de privacidad: publica, privada, confidencial';
COMMENT ON COLUMN patient_notes.tags IS 'Etiquetas asociadas a la nota';
COMMENT ON COLUMN patient_notes.patient_id IS 'ID del paciente al que pertenece la nota';
COMMENT ON COLUMN patient_notes.created_at IS 'Fecha de creación del registro';
COMMENT ON COLUMN patient_notes.updated_at IS 'Fecha de última actualización del registro';

-- Comentarios para los nuevos campos de patients
COMMENT ON COLUMN patients.cancellation_date IS 'Fecha de cancelación automática del paciente';
COMMENT ON COLUMN patients.insurance IS 'Información del seguro del paciente';
COMMENT ON COLUMN patients.additional_notes IS 'Notas adicionales del paciente';

\echo '========================================='
\echo '  MIGRACIÓN DE NOTAS COMPLETADA'
\echo '========================================='
