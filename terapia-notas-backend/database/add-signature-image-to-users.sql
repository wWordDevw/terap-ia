-- =============================================
-- MIGRACIÓN: Agregar campo signature_image a tabla users
-- =============================================
-- Fecha: 2025-01-31
-- Descripción: Agrega campo para almacenar firma del terapeuta en base64

-- Agregar columna signature_image (TEXT) para almacenar imagen en base64
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS signature_image TEXT;

-- Comentario en la columna
COMMENT ON COLUMN users.signature_image IS 'Imagen de firma del terapeuta en formato base64';

