#!/bin/bash

# =============================================
# Script de instalación de base de datos
# TERAPIA NOTA - PostgreSQL 16
# =============================================

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuración por defecto (puedes modificarla)
DB_NAME="terapia_nota_db"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

echo -e "${GREEN}=======================================${NC}"
echo -e "${GREEN}   INSTALACIÓN DE BASE DE DATOS${NC}"
echo -e "${GREEN}   Terapia Nota System${NC}"
echo -e "${GREEN}=======================================${NC}"
echo ""

# Verificar que PostgreSQL está instalado
if ! command -v psql &> /dev/null; then
    echo -e "${RED}Error: PostgreSQL no está instalado${NC}"
    echo "Por favor instala PostgreSQL 16 antes de continuar"
    exit 1
fi

echo -e "${YELLOW}Configuración:${NC}"
echo "  Base de datos: $DB_NAME"
echo "  Usuario: $DB_USER"
echo "  Host: $DB_HOST"
echo "  Puerto: $DB_PORT"
echo ""

# Preguntar si desea continuar
read -p "¿Desea continuar con la instalación? (s/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Instalación cancelada"
    exit 0
fi

# Crear base de datos
echo -e "${YELLOW}Paso 1: Creando base de datos...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Base de datos creada exitosamente${NC}"
else
    echo -e "${YELLOW}⚠ La base de datos ya existe o hubo un error${NC}"
fi

# Ejecutar schema
echo -e "${YELLOW}Paso 2: Creando tablas...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f schema.sql
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Tablas creadas exitosamente${NC}"
else
    echo -e "${RED}✗ Error al crear tablas${NC}"
    exit 1
fi

# Ejecutar vistas
echo -e "${YELLOW}Paso 3: Creando vistas...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f views.sql
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Vistas creadas exitosamente${NC}"
else
    echo -e "${RED}✗ Error al crear vistas${NC}"
    exit 1
fi

# Ejecutar triggers
echo -e "${YELLOW}Paso 4: Creando triggers y funciones...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f triggers.sql
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Triggers creados exitosamente${NC}"
else
    echo -e "${RED}✗ Error al crear triggers${NC}"
    exit 1
fi

# Preguntar si desea cargar datos de ejemplo
echo ""
read -p "¿Desea cargar datos de ejemplo? (s/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo -e "${YELLOW}Paso 5: Cargando datos de ejemplo...${NC}"
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f seed.sql
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Datos de ejemplo cargados${NC}"
    else
        echo -e "${RED}✗ Error al cargar datos de ejemplo${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}=======================================${NC}"
echo -e "${GREEN}   ¡INSTALACIÓN COMPLETADA!${NC}"
echo -e "${GREEN}=======================================${NC}"
echo ""
echo "Base de datos: $DB_NAME"
echo "Puedes conectarte usando:"
echo "  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME"
echo ""
echo "Credenciales de usuarios de prueba (si cargaste datos de ejemplo):"
echo "  - admin@terapia.com / password123"
echo "  - therapist1@terapia.com / password123"
echo "  - nurse1@terapia.com / password123"
echo ""
