#!/bin/bash

################################################################################
# Script de Despliegue del Frontend a Dokku
# App: terap-ia-frontend
# Dominio: terap-ia.victalejo.dev
################################################################################

set -e  # Exit on error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración
DOKKU_HOST="147.93.184.62"
DOKKU_APP="terap-ia-frontend"
DOKKU_USER="dokku"
SOURCE_DIR="terapia-front"
BRANCH="main"
SSH_KEY="$HOME/.ssh/aurora"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Desplegando Frontend a Dokku${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Host: $DOKKU_HOST"
echo "App: $DOKKU_APP"
echo "Dir: $SOURCE_DIR"
echo "Branch: $BRANCH"
echo ""

# Verificar que estamos en un repositorio git
if [ ! -d .git ]; then
    echo -e "${RED}Error: No estás en la raíz del repositorio git${NC}"
    exit 1
fi

# Verificar que existe la carpeta del frontend
if [ ! -d "$SOURCE_DIR" ]; then
    echo -e "${RED}Error: No se encontró la carpeta $SOURCE_DIR${NC}"
    exit 1
fi

# Verificar que existe la clave SSH
if [ ! -f "$SSH_KEY" ]; then
    echo -e "${RED}Error: No se encontró la clave SSH en $SSH_KEY${NC}"
    exit 1
fi

# Verificar que no hay cambios sin commitear
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}Advertencia: Tienes cambios sin commitear${NC}"
    echo -e "${YELLOW}Continuar de todos modos? (y/n)${NC}"
    read -r response
    if [ "$response" != "y" ]; then
        echo "Despliegue cancelado"
        exit 0
    fi
fi

# Configurar remote si no existe
REMOTE_NAME="dokku-frontend"
if git remote | grep -q "^${REMOTE_NAME}$"; then
    echo -e "${YELLOW}Remote '$REMOTE_NAME' ya existe, actualizando URL...${NC}"
    git remote set-url "$REMOTE_NAME" "dokku@${DOKKU_HOST}:${DOKKU_APP}"
else
    echo -e "${GREEN}Agregando remote '$REMOTE_NAME'...${NC}"
    git remote add "$REMOTE_NAME" "dokku@${DOKKU_HOST}:${DOKKU_APP}"
fi

# Desplegar usando git subtree
echo -e "${GREEN}Desplegando $SOURCE_DIR a Dokku...${NC}"
echo -e "${YELLOW}Esto puede tomar varios minutos...${NC}"
echo ""

GIT_SSH_COMMAND="ssh -i $SSH_KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=no" \
  git subtree push --prefix "$SOURCE_DIR" "$REMOTE_NAME" "$BRANCH" || {
    echo ""
    echo -e "${RED}Error en el despliegue${NC}"
    echo -e "${YELLOW}Intentando con force push...${NC}"

    # Si falla, intentar con force
    git push "$REMOTE_NAME" \`git subtree split --prefix "$SOURCE_DIR" "$BRANCH"\`:refs/heads/"$BRANCH" --force
}

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Frontend desplegado exitosamente${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "URL: ${GREEN}https://terap-ia.victalejo.dev${NC}"
echo ""
echo "Comandos útiles:"
echo "  - Ver logs: ssh -i $SSH_KEY dokku@$DOKKU_HOST logs $DOKKU_APP -t"
echo "  - Reiniciar: ssh -i $SSH_KEY dokku@$DOKKU_HOST ps:restart $DOKKU_APP"
echo "  - Estado: ssh -i $SSH_KEY dokku@$DOKKU_HOST ps:report $DOKKU_APP"
echo ""
