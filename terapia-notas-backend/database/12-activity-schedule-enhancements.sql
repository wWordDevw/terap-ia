-- =============================================
-- MIGRACIÓN: Mejoras en Actividades y Horarios
-- =============================================

-- Agregar campo de hora predeterminada a actividades
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS default_time TIME;

-- Comentario
COMMENT ON COLUMN activities.default_time IS 'Hora predeterminada para la actividad (formato HH:MM:SS)';

-- Crear índice para mejorar consultas
CREATE INDEX IF NOT EXISTS idx_activities_default_time ON activities(default_time);

\echo '========================================='
\echo '  MIGRACIÓN DE ACTIVIDADES COMPLETADA'
\echo '========================================='
