#!/bin/bash

################################################################################
# Script de Backup de Base de Datos PostgreSQL
# Realiza backups automáticos de la base de datos y los almacena
################################################################################

set -e  # Salir en caso de error

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

################################################################################
# Configuración
################################################################################

# Directorio de backups
BACKUP_DIR="${BACKUP_DIR:-/var/backups/terap-ia}"
PROJECT_DIR="${PROJECT_DIR:-/var/www/terap-ia}"

# Nombre del contenedor de PostgreSQL
DB_CONTAINER="${DB_CONTAINER:-terap-ia-postgres-1}"

# Variables de base de datos (se cargan desde .env si existe)
if [ -f "${PROJECT_DIR}/.env" ]; then
    source "${PROJECT_DIR}/.env"
fi

DB_NAME="${DB_DATABASE:-terapia_db}"
DB_USER="${DB_USERNAME:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"

# Retención de backups (días)
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# Timestamp para el nombre del archivo
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DB_NAME}_${TIMESTAMP}.sql"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"

################################################################################
# Funciones
################################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

################################################################################
# Función principal de backup
################################################################################

create_backup() {
    log_info "Iniciando backup de la base de datos..."

    # Crear directorio de backups si no existe
    mkdir -p "${BACKUP_DIR}"

    # Verificar que el contenedor está corriendo
    if ! docker ps | grep -q "${DB_CONTAINER}"; then
        log_error "El contenedor de PostgreSQL no está corriendo: ${DB_CONTAINER}"

        # Notificar fallo si el script de notificaciones existe
        if [ -f "${PROJECT_DIR}/deploy/notify-whatsapp.sh" ]; then
            source "${PROJECT_DIR}/deploy/notify-whatsapp.sh"
            notify_backup_failure "Contenedor PostgreSQL no está corriendo"
        fi

        exit 1
    fi

    log_info "Realizando dump de la base de datos..."

    # Realizar el backup usando pg_dump dentro del contenedor
    if docker exec "${DB_CONTAINER}" pg_dump -U "${DB_USER}" "${DB_NAME}" > "${BACKUP_PATH}"; then
        log_success "Backup creado exitosamente: ${BACKUP_FILE}"
    else
        log_error "Falló la creación del backup"

        # Notificar fallo
        if [ -f "${PROJECT_DIR}/deploy/notify-whatsapp.sh" ]; then
            source "${PROJECT_DIR}/deploy/notify-whatsapp.sh"
            notify_backup_failure "pg_dump falló"
        fi

        exit 1
    fi

    # Comprimir el backup
    log_info "Comprimiendo backup..."
    gzip "${BACKUP_PATH}"
    BACKUP_PATH="${BACKUP_PATH}.gz"
    BACKUP_FILE="${BACKUP_FILE}.gz"

    # Obtener tamaño del archivo
    BACKUP_SIZE=$(du -h "${BACKUP_PATH}" | cut -f1)

    log_success "Backup comprimido: ${BACKUP_SIZE}"

    # Verificar integridad del backup
    log_info "Verificando integridad del backup..."
    if gzip -t "${BACKUP_PATH}"; then
        log_success "Backup verificado correctamente"
    else
        log_error "El backup está corrupto"

        # Notificar fallo
        if [ -f "${PROJECT_DIR}/deploy/notify-whatsapp.sh" ]; then
            source "${PROJECT_DIR}/deploy/notify-whatsapp.sh"
            notify_backup_failure "Backup corrupto"
        fi

        exit 1
    fi

    # Limpiar backups antiguos
    cleanup_old_backups

    # Listar backups disponibles
    list_backups

    # Notificar éxito
    if [ -f "${PROJECT_DIR}/deploy/notify-whatsapp.sh" ]; then
        source "${PROJECT_DIR}/deploy/notify-whatsapp.sh"
        notify_backup_success "${BACKUP_FILE}" "${BACKUP_SIZE}"
    fi

    log_success "Proceso de backup completado"
}

################################################################################
# Función para limpiar backups antiguos
################################################################################

cleanup_old_backups() {
    log_info "Limpiando backups antiguos (más de ${RETENTION_DAYS} días)..."

    # Encontrar y eliminar backups antiguos
    local deleted_count=0
    while IFS= read -r old_backup; do
        if [ -n "$old_backup" ]; then
            log_info "Eliminando: $(basename "$old_backup")"
            rm -f "$old_backup"
            ((deleted_count++))
        fi
    done < <(find "${BACKUP_DIR}" -name "backup_*.sql.gz" -type f -mtime +${RETENTION_DAYS})

    if [ $deleted_count -gt 0 ]; then
        log_success "Eliminados ${deleted_count} backups antiguos"
    else
        log_info "No hay backups antiguos para eliminar"
    fi
}

################################################################################
# Función para listar backups disponibles
################################################################################

list_backups() {
    log_info "Backups disponibles:"
    echo ""

    local backup_count=0
    local total_size=0

    while IFS= read -r backup; do
        if [ -n "$backup" ]; then
            local filename=$(basename "$backup")
            local size=$(du -h "$backup" | cut -f1)
            local date=$(stat -c %y "$backup" 2>/dev/null || stat -f "%Sm" "$backup" 2>/dev/null || echo "unknown")

            echo "  - ${filename} (${size}) - ${date}"
            ((backup_count++))
        fi
    done < <(find "${BACKUP_DIR}" -name "backup_*.sql.gz" -type f | sort -r)

    echo ""
    log_info "Total de backups: ${backup_count}"

    # Calcular espacio total usado
    local total_space=$(du -sh "${BACKUP_DIR}" 2>/dev/null | cut -f1)
    log_info "Espacio usado: ${total_space}"
}

################################################################################
# Función para restaurar un backup
################################################################################

restore_backup() {
    local backup_file="$1"

    if [ -z "$backup_file" ]; then
        log_error "Debe especificar el archivo de backup a restaurar"
        echo "Uso: $0 restore <backup_file>"
        list_backups
        exit 1
    fi

    # Si no tiene ruta completa, buscar en el directorio de backups
    if [ ! -f "$backup_file" ]; then
        backup_file="${BACKUP_DIR}/${backup_file}"
    fi

    if [ ! -f "$backup_file" ]; then
        log_error "Archivo de backup no encontrado: $backup_file"
        exit 1
    fi

    log_warning "ADVERTENCIA: Esta operación sobrescribirá la base de datos actual"
    read -p "¿Está seguro de que desea continuar? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        log_info "Restauración cancelada"
        exit 0
    fi

    log_info "Restaurando backup: $(basename "$backup_file")"

    # Descomprimir si es necesario
    if [[ "$backup_file" == *.gz ]]; then
        log_info "Descomprimiendo backup..."
        gunzip -c "$backup_file" > /tmp/restore_temp.sql
        local sql_file="/tmp/restore_temp.sql"
    else
        local sql_file="$backup_file"
    fi

    # Restaurar el backup
    log_info "Restaurando base de datos..."

    if docker exec -i "${DB_CONTAINER}" psql -U "${DB_USER}" -d "${DB_NAME}" < "$sql_file"; then
        log_success "Base de datos restaurada exitosamente"
    else
        log_error "Falló la restauración de la base de datos"
        exit 1
    fi

    # Limpiar archivo temporal
    [ -f /tmp/restore_temp.sql ] && rm -f /tmp/restore_temp.sql

    log_success "Restauración completada"
}

################################################################################
# Punto de entrada principal
################################################################################

main() {
    case "${1:-backup}" in
        backup)
            create_backup
            ;;
        restore)
            restore_backup "$2"
            ;;
        list)
            list_backups
            ;;
        cleanup)
            cleanup_old_backups
            list_backups
            ;;
        *)
            echo "Uso: $0 {backup|restore|list|cleanup}"
            echo ""
            echo "Comandos:"
            echo "  backup          - Crear un nuevo backup"
            echo "  restore <file>  - Restaurar un backup específico"
            echo "  list            - Listar backups disponibles"
            echo "  cleanup         - Limpiar backups antiguos"
            exit 1
            ;;
    esac
}

# Ejecutar
main "$@"
