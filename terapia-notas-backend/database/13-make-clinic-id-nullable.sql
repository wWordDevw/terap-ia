-- Migración: Hacer clinic_id nullable en la tabla users
-- Fecha: 2025-10-21
-- Descripción: Permitir que los usuarios puedan registrarse sin una clínica asignada

-- Modificar la columna clinic_id para permitir NULL
ALTER TABLE users ALTER COLUMN clinic_id DROP NOT NULL;

-- Verificar el cambio
SELECT 
    column_name, 
    is_nullable, 
    data_type 
FROM 
    information_schema.columns 
WHERE 
    table_name = 'users' 
    AND column_name = 'clinic_id';

