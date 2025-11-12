#!/bin/bash

################################################################################
# Script de Configuración de Apps en Dokku
# Ejecutar en el servidor: bash setup-dokku-apps.sh
################################################################################

set -e

echo "========================================="
echo "Configurando Terap-IA en Dokku"
echo "========================================="
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Variables
DB_NAME="terap-ia-db"
BACKEND_APP="terap-ia-backend"
FRONTEND_APP="terap-ia-frontend"
DOMAIN="terap-ia.victalejo.dev"
API_DOMAIN="api.terap-ia.victalejo.dev"

# Generar secretos seguros
echo -e "${GREEN}[1/8] Generando secretos seguros...${NC}"
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
DB_PASSWORD=$(openssl rand -base64 32 | tr -d '\n' | tr -d '=' | tr -d '+' | tr -d '/')

echo "JWT_SECRET generado (64 bytes)"
echo "DB_PASSWORD generado (32 bytes)"
echo ""

# Verificar si el plugin de PostgreSQL está instalado
echo -e "${GREEN}[2/8] Verificando plugin de PostgreSQL...${NC}"
if ! dokku plugin:list | grep -q postgres; then
    echo "Instalando plugin de PostgreSQL..."
    sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres
else
    echo "Plugin de PostgreSQL ya instalado"
fi
echo ""

# Crear base de datos PostgreSQL
echo -e "${GREEN}[3/8] Creando base de datos PostgreSQL...${NC}"
if dokku postgres:exists "$DB_NAME" 2>/dev/null; then
    echo "Base de datos $DB_NAME ya existe"
else
    dokku postgres:create "$DB_NAME"
    echo "Base de datos $DB_NAME creada"
fi
echo ""

# Enlazar base de datos al backend
echo -e "${GREEN}[4/8] Enlazando base de datos al backend...${NC}"
if dokku postgres:linked "$DB_NAME" "$BACKEND_APP" 2>/dev/null; then
    echo "Base de datos ya está enlazada"
else
    dokku postgres:link "$DB_NAME" "$BACKEND_APP"
    echo "Base de datos enlazada al backend"
fi
echo ""

# Configurar variables de entorno del backend
echo -e "${GREEN}[5/8] Configurando variables de entorno del backend...${NC}"
dokku config:set "$BACKEND_APP" \
  NODE_ENV=production \
  PORT=3000 \
  JWT_SECRET="$JWT_SECRET" \
  JWT_EXPIRATION=7d \
  JWT_EXPIRES_IN=24h \
  JWT_REFRESH_EXPIRES_IN=7d \
  GOOGLE_API_KEY="AIzaSyAVPeL2lzOh_-56AOFBXJQ7MYs9B07pZGo" \
  DB_HOST=postgres \
  DB_PORT=5432 \
  DB_USERNAME=postgres \
  DB_DATABASE=terapia_db \
  DB_SSL_ENABLED=false

echo "Variables de entorno del backend configuradas"
echo ""

# Configurar variables de entorno del frontend
echo -e "${GREEN}[6/8] Configurando variables de entorno del frontend...${NC}"
dokku config:set "$FRONTEND_APP" \
  NODE_ENV=production \
  PORT=3001 \
  NEXT_PUBLIC_API_URL="https://$API_DOMAIN/api/v1" \
  NEXT_PUBLIC_SITE_URL="https://$DOMAIN" \
  NEXT_TELEMETRY_DISABLED=1

echo "Variables de entorno del frontend configuradas"
echo ""

# Configurar dominios
echo -e "${GREEN}[7/8] Configurando dominios...${NC}"

# Backend
dokku domains:clear "$BACKEND_APP"
dokku domains:add "$BACKEND_APP" "$API_DOMAIN"
echo "Dominio $API_DOMAIN configurado para backend"

# Frontend
dokku domains:clear "$FRONTEND_APP"
dokku domains:add "$FRONTEND_APP" "$DOMAIN"
echo "Dominio $DOMAIN configurado para frontend"
echo ""

# Configurar volumen persistente para documentos
echo -e "${GREEN}[8/8] Configurando volumen persistente...${NC}"
dokku storage:ensure-directory "$BACKEND_APP-documents"
if ! dokku storage:list "$BACKEND_APP" | grep -q "/var/lib/dokku/data/storage/$BACKEND_APP-documents"; then
    dokku storage:mount "$BACKEND_APP" "/var/lib/dokku/data/storage/$BACKEND_APP-documents:/app/generated-documents"
    echo "Volumen persistente configurado"
else
    echo "Volumen persistente ya existe"
fi
echo ""

# Habilitar websocket support para backend
echo "Habilitando soporte WebSocket para backend..."
dokku nginx:set "$BACKEND_APP" hsts false
dokku nginx:set "$BACKEND_APP" client-max-body-size 50m
echo ""

# Mostrar configuración
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}✓ Configuración completada${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Apps creadas:"
echo "  - $BACKEND_APP"
echo "  - $FRONTEND_APP"
echo ""
echo "Base de datos:"
echo "  - $DB_NAME (PostgreSQL 16)"
echo ""
echo "Dominios configurados:"
echo "  - Frontend: https://$DOMAIN"
echo "  - Backend:  https://$API_DOMAIN"
echo ""
echo "Próximos pasos:"
echo "  1. Desplegar backend: git subtree push --prefix terapia-notas-backend dokku@$HOSTNAME:$BACKEND_APP main"
echo "  2. Desplegar frontend: git subtree push --prefix terapia-front dokku@$HOSTNAME:$FRONTEND_APP main"
echo "  3. Habilitar SSL: dokku letsencrypt:enable $BACKEND_APP && dokku letsencrypt:enable $FRONTEND_APP"
echo ""
echo "Credenciales generadas (GUÁRDALAS EN LUGAR SEGURO):"
echo "---"
echo "JWT_SECRET=$JWT_SECRET"
echo "DB_PASSWORD=$DB_PASSWORD"
echo "---"
echo ""
