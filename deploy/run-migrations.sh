#!/bin/bash

# =============================================
# Script de ejecución de migraciones
# TERAPIA NOTA - PostgreSQL
# =============================================

set -e

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=======================================${NC}"
echo -e "${GREEN}   EJECUTANDO MIGRACIONES DE BD${NC}"
echo -e "${GREEN}=======================================${NC}"
echo ""

# Esperar a que PostgreSQL esté listo
echo -e "${YELLOW}Esperando a que PostgreSQL esté listo...${NC}"
timeout 60 bash -c 'until docker exec terapia-postgres pg_isready -U postgres; do sleep 2; done' || {
    echo -e "${RED}Error: PostgreSQL no está disponible${NC}"
    exit 1
}
echo -e "${GREEN}✓ PostgreSQL está listo${NC}"
echo ""

# Verificar si la base de datos existe
echo -e "${YELLOW}Verificando base de datos...${NC}"
DB_EXISTS=$(docker exec terapia-postgres psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='terapia_db'" || echo "0")

if [ "$DB_EXISTS" != "1" ]; then
    echo -e "${YELLOW}Base de datos no existe, creándola...${NC}"
    docker exec terapia-postgres psql -U postgres -c "CREATE DATABASE terapia_db;"
    echo -e "${GREEN}✓ Base de datos creada${NC}"
else
    echo -e "${GREEN}✓ Base de datos ya existe${NC}"
fi
echo ""

# Ejecutar schema.sql
echo -e "${YELLOW}Ejecutando schema.sql...${NC}"
if docker exec -i terapia-postgres psql -U postgres -d terapia_db < terapia-notas-backend/database/schema.sql 2>&1 | grep -v "already exists\|ERROR.*relation.*already exists"; then
    echo -e "${GREEN}✓ Schema aplicado (algunos objetos pueden ya existir)${NC}"
else
    echo -e "${YELLOW}⚠ Algunas tablas ya existen, continuando...${NC}"
fi
echo ""

# Ejecutar archivos de migración en orden
echo -e "${YELLOW}Ejecutando migraciones adicionales...${NC}"
MIGRATION_FILES=(
    "terapia-notas-backend/database/09-views.sql"
    "terapia-notas-backend/database/08-triggers.sql"
)

for file in "${MIGRATION_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${YELLOW}  - $(basename $file)${NC}"
        docker exec -i terapia-postgres psql -U postgres -d terapia_db < "$file" 2>&1 | grep -v "already exists\|ERROR.*already exists" || true
    fi
done

echo -e "${GREEN}✓ Migraciones completadas${NC}"
echo ""

echo -e "${GREEN}=======================================${NC}"
echo -e "${GREEN}   ¡MIGRACIONES COMPLETADAS!${NC}"
echo -e "${GREEN}=======================================${NC}"
echo ""
