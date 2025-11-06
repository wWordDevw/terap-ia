#!/bin/bash

################################################################################
# Script de Notificaciones de WhatsApp
# Utiliza la API de WhatsApp para enviar mensajes al grupo de notificaciones
################################################################################

# Configuración de la API (se puede sobrescribir con variables de entorno)
WHATSAPP_API_URL="${WHATSAPP_API_URL:-https://wapi.iaportafolio.com/api/sendText}"
WHATSAPP_API_KEY="${WHATSAPP_API_KEY}"
WHATSAPP_CHAT_ID="${WHATSAPP_CHAT_ID:-120363403770897835@g.us}"
WHATSAPP_SESSION="${WHATSAPP_SESSION:-victalejo}"

# Colores para la terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

################################################################################
# Función: send_whatsapp_message
# Descripción: Envía un mensaje de WhatsApp a través de la API
# Parámetros:
#   $1 - Mensaje a enviar
# Retorna: 0 si éxito, 1 si error
################################################################################
send_whatsapp_message() {
    local message="$1"

    # Validar que se proporcionó un mensaje
    if [ -z "$message" ]; then
        echo -e "${RED}Error: No se proporcionó ningún mensaje${NC}" >&2
        return 1
    fi

    # Validar que existe la API key
    if [ -z "$WHATSAPP_API_KEY" ]; then
        echo -e "${RED}Error: WHATSAPP_API_KEY no está configurada${NC}" >&2
        return 1
    fi

    # Crear el payload JSON
    local json_payload=$(cat <<EOF
{
  "chatId": "${WHATSAPP_CHAT_ID}",
  "text": "${message}",
  "session": "${WHATSAPP_SESSION}"
}
EOF
)

    # Enviar la petición
    local response=$(curl -s -w "\n%{http_code}" -X POST \
        "${WHATSAPP_API_URL}" \
        -H "accept: application/json" \
        -H "X-Api-Key: ${WHATSAPP_API_KEY}" \
        -H "Content-Type: application/json" \
        -d "$json_payload")

    # Separar el código de estado HTTP
    local http_code=$(echo "$response" | tail -n1)
    local response_body=$(echo "$response" | sed '$d')

    # Verificar el resultado
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✓ Mensaje enviado exitosamente${NC}"
        return 0
    else
        echo -e "${RED}✗ Error al enviar mensaje. Código HTTP: ${http_code}${NC}" >&2
        echo -e "${RED}Respuesta: ${response_body}${NC}" >&2
        return 1
    fi
}

################################################################################
# Funciones de notificación predefinidas
################################################################################

# Notificar inicio de despliegue
notify_deploy_start() {
    local env="${1:-production}"
    local commit="${2:-unknown}"
    local branch="${3:-master}"

    local message="🚀 *Despliegue Iniciado*

📦 Proyecto: Terap-IA
🌍 Ambiente: ${env}
🌿 Branch: ${branch}
📝 Commit: ${commit}
⏰ Hora: $(date '+%Y-%m-%d %H:%M:%S')

Iniciando proceso de despliegue..."

    send_whatsapp_message "$message"
}

# Notificar éxito de despliegue
notify_deploy_success() {
    local env="${1:-production}"
    local duration="${2:-unknown}"
    local url="${3:-https://terap-ia.victalejo.dev}"

    local message="✅ *Despliegue Exitoso*

📦 Proyecto: Terap-IA
🌍 Ambiente: ${env}
⏱️  Duración: ${duration}
🔗 URL: ${url}
⏰ Hora: $(date '+%Y-%m-%d %H:%M:%S')

¡El sistema está funcionando correctamente!"

    send_whatsapp_message "$message"
}

# Notificar fallo de despliegue
notify_deploy_failure() {
    local env="${1:-production}"
    local error="${2:-Error desconocido}"
    local step="${3:-unknown}"

    local message="❌ *Despliegue Fallido*

📦 Proyecto: Terap-IA
🌍 Ambiente: ${env}
⚠️  Paso fallido: ${step}
❗ Error: ${error}
⏰ Hora: $(date '+%Y-%m-%d %H:%M:%S')

Por favor revisar los logs."

    send_whatsapp_message "$message"
}

# Notificar backup completado
notify_backup_success() {
    local backup_file="${1:-unknown}"
    local size="${2:-unknown}"

    local message="💾 *Backup Completado*

📦 Proyecto: Terap-IA
📁 Archivo: ${backup_file}
📊 Tamaño: ${size}
⏰ Hora: $(date '+%Y-%m-%d %H:%M:%S')

Backup realizado exitosamente."

    send_whatsapp_message "$message"
}

# Notificar error de backup
notify_backup_failure() {
    local error="${1:-Error desconocido}"

    local message="❌ *Backup Fallido*

📦 Proyecto: Terap-IA
❗ Error: ${error}
⏰ Hora: $(date '+%Y-%m-%d %H:%M:%S')

Por favor revisar la configuración de backups."

    send_whatsapp_message "$message"
}

# Notificar healthcheck fallido
notify_healthcheck_failure() {
    local service="${1:-unknown}"
    local error="${2:-Service unreachable}"

    local message="⚠️  *Health Check Fallido*

📦 Proyecto: Terap-IA
🔧 Servicio: ${service}
❗ Error: ${error}
⏰ Hora: $(date '+%Y-%m-%d %H:%M:%S')

El servicio podría estar experimentando problemas."

    send_whatsapp_message "$message"
}

################################################################################
# Uso del script desde línea de comandos
################################################################################

# Si se ejecuta directamente (no como source)
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    case "$1" in
        deploy-start)
            notify_deploy_start "$2" "$3" "$4"
            ;;
        deploy-success)
            notify_deploy_success "$2" "$3" "$4"
            ;;
        deploy-failure)
            notify_deploy_failure "$2" "$3" "$4"
            ;;
        backup-success)
            notify_backup_success "$2" "$3"
            ;;
        backup-failure)
            notify_backup_failure "$2"
            ;;
        healthcheck-failure)
            notify_healthcheck_failure "$2" "$3"
            ;;
        custom)
            send_whatsapp_message "$2"
            ;;
        *)
            echo "Uso: $0 {deploy-start|deploy-success|deploy-failure|backup-success|backup-failure|healthcheck-failure|custom} [args...]"
            echo ""
            echo "Ejemplos:"
            echo "  $0 deploy-start production abc123 master"
            echo "  $0 deploy-success production '2m 30s' https://terap-ia.victalejo.dev"
            echo "  $0 deploy-failure production 'Build failed' build"
            echo "  $0 backup-success backup-2024-01-01.sql 150MB"
            echo "  $0 backup-failure 'Disk full'"
            echo "  $0 healthcheck-failure backend 'Connection refused'"
            echo "  $0 custom 'Mensaje personalizado'"
            exit 1
            ;;
    esac
fi
