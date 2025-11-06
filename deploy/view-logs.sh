#!/bin/bash

# =============================================
# Script para ver logs de los servicios
# TERAPIA NOTA
# =============================================

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=======================================${NC}"
echo -e "${GREEN}   LOGS DE SERVICIOS${NC}"
echo -e "${GREEN}=======================================${NC}"
echo ""

# Función para mostrar logs de un servicio
show_logs() {
    local service=$1
    local lines=${2:-100}

    echo -e "${BLUE}--- Logs de ${service} (últimas ${lines} líneas) ---${NC}"
    docker logs ${service} --tail ${lines} 2>&1 || echo -e "${RED}Error: No se pudo obtener logs de ${service}${NC}"
    echo ""
}

# Si se pasa un argumento, mostrar solo ese servicio
if [ $# -gt 0 ]; then
    case "$1" in
        backend|be)
            show_logs "terapia-backend" ${2:-100}
            ;;
        frontend|fe)
            show_logs "terapia-frontend" ${2:-100}
            ;;
        postgres|db)
            show_logs "terapia-postgres" ${2:-100}
            ;;
        all)
            show_logs "terapia-postgres" ${2:-50}
            show_logs "terapia-backend" ${2:-50}
            show_logs "terapia-frontend" ${2:-50}
            ;;
        follow|f)
            echo -e "${YELLOW}Siguiendo logs del backend (Ctrl+C para salir)...${NC}"
            docker logs -f terapia-backend
            ;;
        *)
            echo -e "${RED}Servicio desconocido: $1${NC}"
            echo "Uso: $0 [backend|frontend|postgres|all|follow] [líneas]"
            exit 1
            ;;
    esac
else
    # Por defecto, mostrar logs del backend
    show_logs "terapia-backend" 100

    echo -e "${YELLOW}Tip: Usa '$0 follow' para ver logs en tiempo real${NC}"
    echo -e "${YELLOW}Tip: Usa '$0 all' para ver logs de todos los servicios${NC}"
fi
