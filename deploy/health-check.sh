#!/bin/bash

################################################################################
# Script de Health Check para Terap-IA
# Verifica el estado de todos los servicios después del despliegue
################################################################################

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

################################################################################
# Configuración
################################################################################

PROJECT_DIR="${PROJECT_DIR:-/var/www/terap-ia}"
DOMAIN="${DOMAIN:-terap-ia.victalejo.dev}"
BACKEND_PORT="${BACKEND_PORT:-3100}"
FRONTEND_PORT="${FRONTEND_PORT:-3001}"

# Timeout para las peticiones (segundos)
TIMEOUT=10

# Contador de errores
ERRORS=0

################################################################################
# Funciones
################################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
    ((ERRORS++))
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

################################################################################
# Checks individuales
################################################################################

check_docker_containers() {
    log_info "Verificando contenedores Docker..."

    cd "${PROJECT_DIR}"

    # Verificar que docker-compose esté instalado
    if ! command -v docker-compose &> /dev/null; then
        log_error "docker-compose no está instalado"
        return 1
    fi

    # Listar contenedores
    local containers=$(docker-compose ps --services)

    for service in $containers; do
        local status=$(docker-compose ps -q "$service" 2>/dev/null)

        if [ -z "$status" ]; then
            log_error "Servicio no encontrado: $service"
            continue
        fi

        local running=$(docker inspect -f '{{.State.Running}}' $(docker-compose ps -q "$service") 2>/dev/null)
        local health=$(docker inspect -f '{{.State.Health.Status}}' $(docker-compose ps -q "$service") 2>/dev/null || echo "none")

        if [ "$running" = "true" ]; then
            if [ "$health" = "healthy" ]; then
                log_success "Servicio corriendo y saludable: $service"
            elif [ "$health" = "none" ]; then
                log_success "Servicio corriendo: $service (sin healthcheck)"
            else
                log_warning "Servicio corriendo pero no saludable: $service (estado: $health)"
            fi
        else
            log_error "Servicio detenido: $service"
        fi
    done
}

check_postgres() {
    log_info "Verificando PostgreSQL..."

    cd "${PROJECT_DIR}"

    # Cargar variables de entorno
    if [ -f ".env" ]; then
        source .env
    fi

    local db_container=$(docker-compose ps -q postgres 2>/dev/null)

    if [ -z "$db_container" ]; then
        log_error "Contenedor de PostgreSQL no encontrado"
        return 1
    fi

    # Verificar conexión a la base de datos
    if docker exec "$db_container" pg_isready -U "${DB_USERNAME:-postgres}" &> /dev/null; then
        log_success "PostgreSQL está aceptando conexiones"
    else
        log_error "PostgreSQL no está respondiendo"
        return 1
    fi

    # Verificar que la base de datos existe
    if docker exec "$db_container" psql -U "${DB_USERNAME:-postgres}" -lqt | cut -d \| -f 1 | grep -qw "${DB_DATABASE:-terapia_db}"; then
        log_success "Base de datos existe: ${DB_DATABASE:-terapia_db}"
    else
        log_error "Base de datos no existe: ${DB_DATABASE:-terapia_db}"
        return 1
    fi
}

check_backend() {
    log_info "Verificando Backend API..."

    # Verificar endpoint de salud (si existe)
    local backend_url="http://localhost:${BACKEND_PORT}/api/v1/health"

    if curl -sf --connect-timeout "$TIMEOUT" "$backend_url" &> /dev/null; then
        log_success "Backend respondiendo en puerto ${BACKEND_PORT}"
    else
        # Intentar con endpoint alternativo
        backend_url="http://localhost:${BACKEND_PORT}/api/v1"
        if curl -sf --connect-timeout "$TIMEOUT" "$backend_url" &> /dev/null; then
            log_success "Backend respondiendo en puerto ${BACKEND_PORT}"
        else
            log_error "Backend no responde en puerto ${BACKEND_PORT}"
            return 1
        fi
    fi

    # Verificar Swagger docs
    local swagger_url="http://localhost:${BACKEND_PORT}/api/docs"
    if curl -sf --connect-timeout "$TIMEOUT" "$swagger_url" &> /dev/null; then
        log_success "Documentación Swagger disponible"
    else
        log_warning "Documentación Swagger no disponible"
    fi
}

check_frontend() {
    log_info "Verificando Frontend..."

    local frontend_url="http://localhost:${FRONTEND_PORT}"

    if curl -sf --connect-timeout "$TIMEOUT" "$frontend_url" &> /dev/null; then
        log_success "Frontend respondiendo en puerto ${FRONTEND_PORT}"
    else
        log_error "Frontend no responde en puerto ${FRONTEND_PORT}"
        return 1
    fi

    # Verificar que Next.js está sirviendo correctamente
    local response=$(curl -s --connect-timeout "$TIMEOUT" "$frontend_url" | head -n 10)
    if echo "$response" | grep -q "<!DOCTYPE html>"; then
        log_success "Frontend sirviendo HTML correctamente"
    else
        log_warning "Frontend responde pero no está sirviendo HTML"
    fi
}

check_nginx() {
    log_info "Verificando Nginx..."

    # Verificar que nginx está instalado
    if ! command -v nginx &> /dev/null; then
        log_warning "Nginx no está instalado (esto es opcional)"
        return 0
    fi

    # Verificar que nginx está corriendo
    if systemctl is-active --quiet nginx; then
        log_success "Nginx está corriendo"
    else
        log_warning "Nginx no está corriendo"
        return 0
    fi

    # Verificar configuración de nginx
    if nginx -t &> /dev/null; then
        log_success "Configuración de Nginx es válida"
    else
        log_error "Configuración de Nginx tiene errores"
        return 1
    fi
}

check_ssl_certificate() {
    log_info "Verificando certificado SSL..."

    # Verificar que el dominio responde con HTTPS
    if curl -sf --connect-timeout "$TIMEOUT" "https://${DOMAIN}" &> /dev/null; then
        log_success "HTTPS respondiendo en ${DOMAIN}"
    else
        log_warning "HTTPS no responde en ${DOMAIN} (podría no estar configurado aún)"
        return 0
    fi

    # Verificar fecha de expiración del certificado
    local cert_expiry=$(echo | openssl s_client -servername "${DOMAIN}" -connect "${DOMAIN}:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)

    if [ -n "$cert_expiry" ]; then
        log_success "Certificado SSL válido hasta: $cert_expiry"
    else
        log_warning "No se pudo verificar el certificado SSL"
    fi
}

check_disk_space() {
    log_info "Verificando espacio en disco..."

    local disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

    if [ "$disk_usage" -lt 80 ]; then
        log_success "Espacio en disco: ${disk_usage}% usado"
    elif [ "$disk_usage" -lt 90 ]; then
        log_warning "Espacio en disco: ${disk_usage}% usado (considerar limpieza)"
    else
        log_error "Espacio en disco crítico: ${disk_usage}% usado"
    fi
}

check_memory() {
    log_info "Verificando memoria..."

    local mem_usage=$(free | awk 'NR==2 {printf "%.0f", $3*100/$2}')

    if [ "$mem_usage" -lt 80 ]; then
        log_success "Uso de memoria: ${mem_usage}%"
    elif [ "$mem_usage" -lt 90 ]; then
        log_warning "Uso de memoria alto: ${mem_usage}%"
    else
        log_error "Uso de memoria crítico: ${mem_usage}%"
    fi
}

################################################################################
# Función principal
################################################################################

run_health_checks() {
    echo ""
    echo -e "${BLUE}=====================================${NC}"
    echo -e "${BLUE}  Health Check - Terap-IA${NC}"
    echo -e "${BLUE}=====================================${NC}"
    echo ""

    # Ejecutar todos los checks
    check_docker_containers
    echo ""

    check_postgres
    echo ""

    check_backend
    echo ""

    check_frontend
    echo ""

    check_nginx
    echo ""

    check_ssl_certificate
    echo ""

    check_disk_space
    echo ""

    check_memory
    echo ""

    # Resumen final
    echo -e "${BLUE}=====================================${NC}"

    if [ $ERRORS -eq 0 ]; then
        echo -e "${GREEN}✓ Todos los checks pasaron exitosamente${NC}"
        echo -e "${BLUE}=====================================${NC}"
        return 0
    else
        echo -e "${RED}✗ Se encontraron ${ERRORS} error(es)${NC}"
        echo -e "${BLUE}=====================================${NC}"

        # Notificar fallo si el script existe
        if [ -f "${PROJECT_DIR}/deploy/notify-whatsapp.sh" ]; then
            source "${PROJECT_DIR}/deploy/notify-whatsapp.sh"
            notify_healthcheck_failure "Múltiples servicios" "${ERRORS} checks fallaron"
        fi

        return 1
    fi
}

################################################################################
# Punto de entrada
################################################################################

main() {
    case "${1:-check}" in
        check)
            run_health_checks
            ;;
        docker)
            check_docker_containers
            ;;
        postgres|db)
            check_postgres
            ;;
        backend|api)
            check_backend
            ;;
        frontend|web)
            check_frontend
            ;;
        nginx)
            check_nginx
            ;;
        ssl)
            check_ssl_certificate
            ;;
        system)
            check_disk_space
            check_memory
            ;;
        *)
            echo "Uso: $0 {check|docker|postgres|backend|frontend|nginx|ssl|system}"
            echo ""
            echo "Comandos:"
            echo "  check     - Ejecutar todos los health checks"
            echo "  docker    - Verificar contenedores Docker"
            echo "  postgres  - Verificar PostgreSQL"
            echo "  backend   - Verificar Backend API"
            echo "  frontend  - Verificar Frontend"
            echo "  nginx     - Verificar Nginx"
            echo "  ssl       - Verificar certificado SSL"
            echo "  system    - Verificar recursos del sistema"
            exit 1
            ;;
    esac
}

# Ejecutar
main "$@"
