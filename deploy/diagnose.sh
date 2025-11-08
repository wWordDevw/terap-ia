#!/bin/bash

################################################################################
# Script de Diagnóstico Rápido para Terap-IA
# Ejecutar este script en el servidor cuando algo falla
################################################################################

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}  Diagnóstico Terap-IA${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# 1. Verificar directorio
echo -e "${BLUE}[1/8]${NC} Verificando directorio..."
if [ -d "/var/www/terap-ia" ]; then
    echo -e "${GREEN}✓${NC} Directorio existe"
    cd /var/www/terap-ia
else
    echo -e "${RED}✗${NC} Directorio no existe: /var/www/terap-ia"
    exit 1
fi
echo ""

# 2. Verificar Docker
echo -e "${BLUE}[2/8]${NC} Verificando Docker..."
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker instalado: $(docker --version)"
else
    echo -e "${RED}✗${NC} Docker no está instalado"
    exit 1
fi
echo ""

# 3. Verificar Docker Compose
echo -e "${BLUE}[3/8]${NC} Verificando Docker Compose..."
if docker compose version &> /dev/null 2>&1; then
    DOCKER_COMPOSE="docker compose"
    echo -e "${GREEN}✓${NC} Docker Compose v2: $(docker compose version)"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
    echo -e "${GREEN}✓${NC} Docker Compose v1: $(docker-compose --version)"
else
    echo -e "${RED}✗${NC} Docker Compose no está instalado"
    exit 1
fi
echo ""

# 4. Estado de contenedores
echo -e "${BLUE}[4/8]${NC} Estado de contenedores:"
$DOCKER_COMPOSE ps
echo ""

# 5. Contenedores corriendo
echo -e "${BLUE}[5/8]${NC} Verificando servicios..."
BACKEND_RUNNING=$($DOCKER_COMPOSE ps backend 2>/dev/null | grep -c "Up" || echo "0")
FRONTEND_RUNNING=$($DOCKER_COMPOSE ps frontend 2>/dev/null | grep -c "Up" || echo "0")
POSTGRES_RUNNING=$($DOCKER_COMPOSE ps postgres 2>/dev/null | grep -c "Up" || echo "0")

if [ "$BACKEND_RUNNING" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Backend corriendo"
else
    echo -e "${RED}✗${NC} Backend NO está corriendo"
fi

if [ "$FRONTEND_RUNNING" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Frontend corriendo"
else
    echo -e "${RED}✗${NC} Frontend NO está corriendo"
fi

if [ "$POSTGRES_RUNNING" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} PostgreSQL corriendo"
else
    echo -e "${RED}✗${NC} PostgreSQL NO está corriendo"
fi
echo ""

# 6. Últimos logs de errores
echo -e "${BLUE}[6/8]${NC} Últimos errores del backend (últimas 20 líneas):"
echo -e "${YELLOW}---${NC}"
docker logs terapia-backend --tail 20 2>/dev/null || \
docker logs terap-ia-backend-1 --tail 20 2>/dev/null || \
docker logs $(docker ps -q -f name=backend) --tail 20 2>/dev/null || \
echo "No se pudieron obtener logs del backend"
echo -e "${YELLOW}---${NC}"
echo ""

# 7. Verificar puertos
echo -e "${BLUE}[7/8]${NC} Verificando puertos..."
netstat -tlnp 2>/dev/null | grep -E ':3001|:3100|:5432|:80|:443' || ss -tlnp | grep -E ':3001|:3100|:5432|:80|:443'
echo ""

# 8. Uso de recursos
echo -e "${BLUE}[8/8]${NC} Uso de recursos:"
echo -e "${YELLOW}Disco:${NC}"
df -h / | tail -1
echo -e "${YELLOW}Memoria:${NC}"
free -h | grep Mem
echo -e "${YELLOW}Docker stats (instantánea):${NC}"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" 2>/dev/null || echo "No se pudo obtener stats"
echo ""

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}  Diagnóstico Completado${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""
echo -e "${YELLOW}Comandos útiles para investigar:${NC}"
echo -e "  Ver logs del backend: ${GREEN}docker logs -f terapia-backend${NC}"
echo -e "  Ver logs del frontend: ${GREEN}docker logs -f terapia-frontend${NC}"
echo -e "  Reiniciar servicios: ${GREEN}docker compose restart${NC}"
echo -e "  Reconstruir y reiniciar: ${GREEN}docker compose down && docker compose up -d --build${NC}"
echo ""
