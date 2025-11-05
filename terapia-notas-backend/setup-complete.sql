-- Script completo de inicialización
-- Ejecutar conectado a la base de datos terapia_nota_db

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

\echo 'Extensiones creadas correctamente'
\echo 'Ejecutando schema.sql...'
\i 'C:/Users/andrw/Downloads/Open To Work/Workana/Sofi/terapia-nota-backend/database/schema.sql'

\echo 'Ejecutando views.sql...'
\i 'C:/Users/andrw/Downloads/Open To Work/Workana/Sofi/terapia-nota-backend/database/views.sql'

\echo 'Ejecutando triggers.sql...'
\i 'C:/Users/andrw/Downloads/Open To Work/Workana/Sofi/terapia-nota-backend/database/triggers.sql'

\echo '========================================='
\echo '  INICIALIZACIÓN COMPLETADA!'
\echo '========================================='
