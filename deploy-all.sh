#!/bin/bash

################################################################################
# Script de Despliegue Completo a Dokku
# Despliega Backend y Frontend en secuencia
################################################################################

set -e  # Exit on error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Despliegue Completo a Dokku${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Este script desplegará:"
echo "  1. Backend (api.terap-ia.victalejo.dev)"
echo "  2. Frontend (terap-ia.victalejo.dev)"
echo ""
echo -e "${YELLOW}Presiona Enter para continuar o Ctrl+C para cancelar${NC}"
read -r

# Desplegar Backend
echo ""
echo -e "${GREEN}[1/2] Desplegando Backend...${NC}"
echo ""
bash ./deploy-backend.sh

# Pequeña pausa entre despliegues
sleep 2

# Desplegar Frontend
echo ""
echo -e "${GREEN}[2/2] Desplegando Frontend...${NC}"
echo ""
bash ./deploy-frontend.sh

# Resumen final
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   ✓ Despliegue Completo Exitoso${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "URLs de la aplicación:"
echo -e "  Frontend: ${GREEN}https://terap-ia.victalejo.dev${NC}"
echo -e "  Backend:  ${GREEN}https://api.terap-ia.victalejo.dev${NC}"
echo ""
echo "Verifica que todo funcione correctamente:"
echo "  curl -I https://terap-ia.victalejo.dev"
echo "  curl https://api.terap-ia.victalejo.dev/api/v1/health"
echo ""
