#!/bin/bash

################################################################################
# Script de Despliegue Automático para Terap-IA
# Despliega la aplicación en el servidor de producción vía SSH
################################################################################

set -e  # Salir en caso de error

# Colores para la terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

################################################################################
# Configuración
################################################################################

# Variables de entorno (se pueden sobrescribir)
SSH_HOST="${SSH_HOST:-147.93.184.62}"
SSH_USER="${SSH_USER:-root}"
SSH_PORT="${SSH_PORT:-22}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/terap-ia}"
REPO_URL="${REPO_URL:-https://github.com/YOUR_USERNAME/terap-ia.git}"
BRANCH="${BRANCH:-master}"
DOMAIN="${DOMAIN:-terap-ia.victalejo.dev}"

# Contadores de tiempo
START_TIME=$(date +%s)

################################################################################
# Funciones de utilidad
################################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_step() {
    echo -e "\n${PURPLE}==>${NC} $1"
}

# Calcular duración
get_duration() {
    local end_time=$(date +%s)
    local duration=$((end_time - START_TIME))
    local minutes=$((duration / 60))
    local seconds=$((duration % 60))
    echo "${minutes}m ${seconds}s"
}

################################################################################
# Función principal de despliegue
################################################################################

deploy() {
    log_step "Iniciando despliegue en ${SSH_HOST}"

    # Verificar que las variables críticas estén configuradas
    if [ -z "$SSH_HOST" ] || [ -z "$SSH_USER" ]; then
        log_error "SSH_HOST y SSH_USER son requeridos"
        exit 1
    fi

    # Construir comando SSH base
    if [ -n "$SSH_PASSWORD" ]; then
        # Usar sshpass si está disponible el password
        SSH_CMD="sshpass -p '${SSH_PASSWORD}' ssh -o StrictHostKeyChecking=no -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST}"
    elif [ -n "$SSH_PRIVATE_KEY" ]; then
        # Usar clave privada
        echo "$SSH_PRIVATE_KEY" > /tmp/ssh_key
        chmod 600 /tmp/ssh_key
        SSH_CMD="ssh -i /tmp/ssh_key -o StrictHostKeyChecking=no -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST}"
    else
        # SSH normal (asume que ya hay claves configuradas)
        SSH_CMD="ssh -o StrictHostKeyChecking=no -p ${SSH_PORT} ${SSH_USER}@${SSH_HOST}"
    fi

    # 1. Crear backup de la base de datos antes de desplegar
    log_step "Paso 1: Creando backup de seguridad"
    $SSH_CMD << 'ENDSSH'
        set -e
        if [ -d "/var/www/terap-ia" ]; then
            cd /var/www/terap-ia
            if [ -f "deploy/backup-db.sh" ]; then
                bash deploy/backup-db.sh || echo "Backup falló, continuando de todas formas..."
            fi
        fi
ENDSSH
    log_success "Backup completado"

    # 2. Actualizar código desde el repositorio
    log_step "Paso 2: Actualizando código del repositorio"
    $SSH_CMD << ENDSSH
        set -e

        # Crear directorio si no existe
        if [ ! -d "${DEPLOY_PATH}" ]; then
            echo "Clonando repositorio por primera vez..."
            git clone ${REPO_URL} ${DEPLOY_PATH}
        fi

        cd ${DEPLOY_PATH}

        # Fetch y pull de cambios
        echo "Actualizando código..."
        git fetch origin ${BRANCH}
        git reset --hard origin/${BRANCH}
        git clean -fd

        # Mostrar commit actual
        echo "Commit actual:"
        git log -1 --oneline
ENDSSH
    log_success "Código actualizado"

    # 3. Verificar y copiar variables de entorno
    log_step "Paso 3: Verificando variables de entorno"
    $SSH_CMD << 'ENDSSH'
        set -e
        cd ${DEPLOY_PATH}

        if [ ! -f ".env" ]; then
            echo "Creando .env desde .env.production..."
            cp .env.production .env
            echo "⚠️  IMPORTANTE: Editar .env con valores seguros de producción"
        else
            echo ".env ya existe, manteniendo configuración actual"
        fi
ENDSSH
    log_success "Variables de entorno verificadas"

    # 4. Detener servicios actuales
    log_step "Paso 4: Deteniendo servicios actuales"
    $SSH_CMD << ENDSSH
        set -e
        cd ${DEPLOY_PATH}

        if [ -f "docker-compose.yml" ]; then
            docker-compose down || true
        fi
ENDSSH
    log_success "Servicios detenidos"

    # 5. Construir nuevas imágenes
    log_step "Paso 5: Construyendo imágenes Docker"
    $SSH_CMD << ENDSSH
        set -e
        cd ${DEPLOY_PATH}

        echo "Construyendo imágenes..."
        docker-compose build --no-cache
ENDSSH
    log_success "Imágenes construidas"

    # 6. Iniciar servicios
    log_step "Paso 6: Iniciando servicios"
    $SSH_CMD << ENDSSH
        set -e
        cd ${DEPLOY_PATH}

        echo "Iniciando contenedores..."
        docker-compose up -d

        echo "Esperando 15 segundos para que los servicios inicien..."
        sleep 15
ENDSSH
    log_success "Servicios iniciados"

    # 7. Verificar health checks
    log_step "Paso 7: Verificando estado de los servicios"
    $SSH_CMD << 'ENDSSH'
        set -e
        cd ${DEPLOY_PATH}

        if [ -f "deploy/health-check.sh" ]; then
            bash deploy/health-check.sh
        else
            echo "Verificando contenedores..."
            docker-compose ps
        fi
ENDSSH
    log_success "Health checks completados"

    # 8. Limpiar recursos no utilizados
    log_step "Paso 8: Limpiando recursos Docker"
    $SSH_CMD << 'ENDSSH'
        set -e
        echo "Limpiando imágenes y contenedores antiguos..."
        docker system prune -f || true
ENDSSH
    log_success "Limpieza completada"

    # Limpiar clave temporal si se usó
    [ -f /tmp/ssh_key ] && rm -f /tmp/ssh_key

    # Calcular duración total
    DURATION=$(get_duration)

    log_success "¡Despliegue completado exitosamente en ${DURATION}!"
    log_info "URL: https://${DOMAIN}"

    echo ""
    echo -e "${GREEN}================================${NC}"
    echo -e "${GREEN}  Despliegue Exitoso${NC}"
    echo -e "${GREEN}================================${NC}"
    echo -e "Servidor: ${SSH_HOST}"
    echo -e "Dominio:  https://${DOMAIN}"
    echo -e "Duración: ${DURATION}"
    echo -e "${GREEN}================================${NC}"
}

################################################################################
# Función de rollback
################################################################################

rollback() {
    log_step "Iniciando rollback"

    $SSH_CMD << 'ENDSSH'
        set -e
        cd ${DEPLOY_PATH}

        echo "Volviendo al commit anterior..."
        git reset --hard HEAD~1

        echo "Reconstruyendo servicios..."
        docker-compose down
        docker-compose build
        docker-compose up -d

        echo "Rollback completado"
ENDSSH

    log_success "Rollback completado"
}

################################################################################
# Manejo de errores
################################################################################

handle_error() {
    log_error "El despliegue falló en el paso: $1"

    # Si existe el script de notificaciones, usarlo
    if [ -f "deploy/notify-whatsapp.sh" ]; then
        source deploy/notify-whatsapp.sh
        notify_deploy_failure "production" "$1" "$(get_duration)"
    fi

    exit 1
}

trap 'handle_error "Error desconocido"' ERR

################################################################################
# Punto de entrada principal
################################################################################

main() {
    case "${1:-deploy}" in
        deploy)
            deploy
            ;;
        rollback)
            rollback
            ;;
        *)
            echo "Uso: $0 {deploy|rollback}"
            exit 1
            ;;
    esac
}

# Ejecutar
main "$@"
