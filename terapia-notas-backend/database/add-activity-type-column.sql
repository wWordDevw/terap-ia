-- =============================================
-- Migración: Agregar columna activity_type a activities
-- =============================================
-- Este script agrega la columna activity_type para filtrar actividades por tipo (PHP o IOP)
-- =============================================

-- Crear el tipo enum si no existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activitytype') THEN
        CREATE TYPE activitytype AS ENUM ('PHP', 'IOP');
        RAISE NOTICE '✅ Tipo enum activitytype creado';
    ELSE
        RAISE NOTICE '✅ Tipo enum activitytype ya existe';
    END IF;
END $$;

-- Agregar la columna activity_type si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'activities' 
        AND column_name = 'activity_type'
    ) THEN
        ALTER TABLE activities 
        ADD COLUMN activity_type activitytype;
        
        RAISE NOTICE '✅ Columna activity_type agregada a la tabla activities';
    ELSE
        RAISE NOTICE '✅ Columna activity_type ya existe en la tabla activities';
    END IF;
END $$;

-- Comentario en la columna
COMMENT ON COLUMN activities.activity_type IS 'Tipo de actividad: PHP (Partial Hospitalization Program) o IOP (Intensive Outpatient Program)';

-- Verificar que la columna fue agregada
SELECT 
    column_name,
    data_type,
    udt_name,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'activities' 
AND column_name = 'activity_type';
