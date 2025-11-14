#!/bin/sh
set -e

# =============================================
# Docker Entrypoint para Backend
# Ejecuta migraciones antes de iniciar
# =============================================

echo "🚀 Iniciando backend..."

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando a PostgreSQL..."
until nc -z $DB_HOST $DB_PORT 2>/dev/null; do
  echo "   PostgreSQL no está listo, esperando..."
  sleep 2
done
echo "✅ PostgreSQL está listo"

# Función para ejecutar SQL con reintentos
run_sql() {
  local sql_file=$1
  local description=$2

  if [ -f "$sql_file" ]; then
    echo "   Ejecutando: $description"
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -d $DB_DATABASE -f "$sql_file" 2>&1 | grep -v "already exists\|ERROR.*relation.*already exists" || true
  else
    echo "   ⚠️  Archivo no encontrado: $sql_file"
  fi
}

# Verificar si la base de datos existe
echo "💾 Verificando base de datos..."
DB_EXISTS=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_DATABASE'" 2>/dev/null || echo "0")

if [ "$DB_EXISTS" != "1" ]; then
  echo "📁 Creando base de datos $DB_DATABASE..."
  PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -c "CREATE DATABASE $DB_DATABASE;" 2>/dev/null || echo "   Base de datos ya existe"
else
  echo "✅ Base de datos existe"
fi

# Ejecutar migraciones
echo "🔄 Ejecutando migraciones..."

# 1. Schema principal
run_sql "database/schema.sql" "Schema principal (tablas)"

# 2. Migraciones específicas críticas (en orden)
run_sql "database/add-activity-type-column.sql" "Columna activity_type"
run_sql "database/add-signature-image-to-users.sql" "Columna signature_image"

# 3. Triggers y funciones
run_sql "database/08-triggers.sql" "Triggers y funciones"

# 4. Vistas (después de triggers)
run_sql "database/09-views.sql" "Vistas"

# 5. Otros archivos de migración numerados (si existen)
for migration_file in database/[0-9][0-9]-*.sql; do
  if [ -f "$migration_file" ] && [ "$migration_file" != "database/08-triggers.sql" ] && [ "$migration_file" != "database/09-views.sql" ]; then
    filename=$(basename "$migration_file")
    run_sql "$migration_file" "$filename"
  fi
done

echo "✅ Migraciones completadas"
echo ""
echo "🎯 Iniciando aplicación NestJS..."
echo ""

# Iniciar la aplicación
exec node dist/main
