-- =============================================
-- TERAPIA NOTA - Inicialización Automática Docker
-- PostgreSQL 16
-- =============================================

-- Este script se ejecuta automáticamente cuando el contenedor
-- de PostgreSQL inicia por primera vez

\echo '========================================='
\echo '  INICIALIZANDO BASE DE DATOS'
\echo '  Terapia Nota System'
\echo '========================================='
\echo ''

-- Ejecutar schema (tablas)
\echo 'Paso 1: Creando tablas...'
\i /docker-entrypoint-initdb.d/schema.sql
\echo '✓ Tablas creadas'
\echo ''

-- Ejecutar vistas
\echo 'Paso 2: Creando vistas...'
\i /docker-entrypoint-initdb.d/09-views.sql
\echo '✓ Vistas creadas'
\echo ''

-- Ejecutar triggers
\echo 'Paso 3: Creando triggers...'
\i /docker-entrypoint-initdb.d/08-triggers.sql
\echo '✓ Triggers creados'
\echo ''

-- Ejecutar migraciones
\echo 'Paso 4: Ejecutando migraciones...'
\i /docker-entrypoint-initdb.d/11-patient-notes-migration.sql
\echo '✓ Migraciones completadas'
\echo ''

\echo '========================================='
\echo '  ¡INICIALIZACIÓN COMPLETADA!'
\echo '========================================='
\echo ''
