-- Agregar columna created_by a la tabla patients si no existe
-- Esta columna es necesaria para rastrear quién creó cada paciente

DO $$
BEGIN
    -- Verificar si la columna existe antes de agregarla
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'patients'
        AND column_name = 'created_by'
    ) THEN
        -- Agregar la columna created_by
        ALTER TABLE patients
        ADD COLUMN created_by UUID REFERENCES users(user_id);

        RAISE NOTICE 'Columna created_by agregada exitosamente a la tabla patients';
    ELSE
        RAISE NOTICE 'La columna created_by ya existe en la tabla patients';
    END IF;
END $$;
