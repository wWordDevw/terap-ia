#!/bin/bash

################################################################################
# Script de Configuración Inicial del Servidor para Terap-IA
# Configura Docker, Nginx, SSL, Firewall y todas las dependencias necesarias
#
# Uso: bash setup-server.sh
# Ejecutar como root en el servidor: 147.93.184.62
################################################################################

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

################################################################################
# Configuración
################################################################################

DOMAIN="terap-ia.victalejo.dev"
EMAIL="admin@victalejo.dev"  # Cambiar por tu email para Let's Encrypt
DEPLOY_PATH="/var/www/terap-ia"
REPO_URL="https://github.com/YOUR_USERNAME/terap-ia.git"  # Cambiar por tu repo

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
    echo -e "${RED}[✗]${NC} $1" >&2
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

log_step() {
    echo ""
    echo -e "${PURPLE}==>${NC} $1"
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        log_error "Este script debe ejecutarse como root"
        exit 1
    fi
}

################################################################################
# Paso 1: Actualizar sistema
################################################################################

update_system() {
    log_step "Paso 1: Actualizando el sistema"

    apt-get update
    apt-get upgrade -y
    apt-get autoremove -y

    log_success "Sistema actualizado"
}

################################################################################
# Paso 2: Instalar dependencias básicas
################################################################################

install_dependencies() {
    log_step "Paso 2: Instalando dependencias básicas"

    apt-get install -y \
        curl \
        wget \
        git \
        vim \
        nano \
        htop \
        net-tools \
        build-essential \
        software-properties-common \
        apt-transport-https \
        ca-certificates \
        gnupg \
        lsb-release \
        ufw \
        certbot \
        python3-certbot-nginx \
        sshpass

    log_success "Dependencias instaladas"
}

################################################################################
# Paso 3: Instalar Docker
################################################################################

install_docker() {
    log_step "Paso 3: Instalando Docker"

    # Verificar si Docker ya está instalado
    if command -v docker &> /dev/null; then
        log_info "Docker ya está instalado"
        docker --version
        return 0
    fi

    # Desinstalar versiones antiguas
    apt-get remove -y docker docker-engine docker.io containerd runc || true

    # Agregar repositorio oficial de Docker
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    # Instalar Docker
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    # Habilitar y iniciar Docker
    systemctl enable docker
    systemctl start docker

    # Verificar instalación
    docker --version

    log_success "Docker instalado exitosamente"
}

################################################################################
# Paso 4: Instalar Docker Compose (standalone)
################################################################################

install_docker_compose() {
    log_step "Paso 4: Instalando Docker Compose"

    # Verificar si docker-compose ya está instalado
    if command -v docker-compose &> /dev/null; then
        log_info "Docker Compose ya está instalado"
        docker-compose --version
        return 0
    fi

    # Instalar docker-compose
    DOCKER_COMPOSE_VERSION="v2.24.5"
    curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

    # Crear symlink
    ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

    # Verificar instalación
    docker-compose --version

    log_success "Docker Compose instalado exitosamente"
}

################################################################################
# Paso 5: Configurar firewall (UFW)
################################################################################

configure_firewall() {
    log_step "Paso 5: Configurando firewall (UFW)"

    # Deshabilitar UFW temporalmente
    ufw --force disable

    # Configurar reglas por defecto
    ufw default deny incoming
    ufw default allow outgoing

    # Permitir SSH
    ufw allow 22/tcp

    # Permitir HTTP y HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp

    # Habilitar UFW
    ufw --force enable

    # Mostrar estado
    ufw status

    log_success "Firewall configurado"
}

################################################################################
# Paso 6: Instalar y configurar Nginx
################################################################################

install_nginx() {
    log_step "Paso 6: Instalando Nginx"

    # Verificar si Nginx ya está instalado
    if command -v nginx &> /dev/null; then
        log_info "Nginx ya está instalado"
        nginx -v
    else
        apt-get install -y nginx
    fi

    # Habilitar y iniciar Nginx
    systemctl enable nginx
    systemctl start nginx

    # Crear directorio para cache
    mkdir -p /var/cache/nginx/terap-ia
    chown -R www-data:www-data /var/cache/nginx

    log_success "Nginx instalado"
}

################################################################################
# Paso 7: Clonar repositorio
################################################################################

clone_repository() {
    log_step "Paso 7: Clonando repositorio"

    # Crear directorio padre
    mkdir -p /var/www

    # Clonar si no existe
    if [ ! -d "$DEPLOY_PATH" ]; then
        log_info "Clonando repositorio..."
        git clone "$REPO_URL" "$DEPLOY_PATH"
    else
        log_info "El repositorio ya existe, actualizando..."
        cd "$DEPLOY_PATH"
        git pull origin master
    fi

    log_success "Repositorio clonado/actualizado"
}

################################################################################
# Paso 8: Configurar Nginx para el dominio
################################################################################

configure_nginx_site() {
    log_step "Paso 8: Configurando Nginx para ${DOMAIN}"

    # Copiar configuración
    if [ -f "${DEPLOY_PATH}/deploy/nginx-ssl.conf" ]; then
        cp "${DEPLOY_PATH}/deploy/nginx-ssl.conf" "/etc/nginx/sites-available/terap-ia"
    else
        log_warning "Archivo nginx-ssl.conf no encontrado en el repositorio"
        return 1
    fi

    # Crear symlink
    ln -sf /etc/nginx/sites-available/terap-ia /etc/nginx/sites-enabled/

    # Eliminar configuración por defecto si existe
    rm -f /etc/nginx/sites-enabled/default

    # Crear directorio para certbot
    mkdir -p /var/www/certbot

    # Probar configuración (comentar temporalmente las líneas SSL)
    sed -i 's/ssl_certificate/#ssl_certificate/g' /etc/nginx/sites-available/terap-ia
    sed -i 's/listen 443 ssl/listen 443/g' /etc/nginx/sites-available/terap-ia

    if nginx -t; then
        systemctl reload nginx
        log_success "Configuración de Nginx aplicada"
    else
        log_error "Error en la configuración de Nginx"
        return 1
    fi
}

################################################################################
# Paso 9: Obtener certificado SSL
################################################################################

obtain_ssl_certificate() {
    log_step "Paso 9: Obteniendo certificado SSL para ${DOMAIN}"

    # Verificar que el dominio apunte al servidor
    log_info "Verificando que ${DOMAIN} apunte a este servidor..."

    SERVER_IP=$(curl -s ifconfig.me)
    DOMAIN_IP=$(dig +short ${DOMAIN} | tail -n1)

    log_info "IP del servidor: ${SERVER_IP}"
    log_info "IP del dominio: ${DOMAIN_IP}"

    if [ "$SERVER_IP" != "$DOMAIN_IP" ]; then
        log_warning "El dominio no apunta a este servidor"
        log_warning "Por favor configura el DNS antes de continuar"
        read -p "¿Deseas continuar de todas formas? (y/n) " -r
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "Saltando configuración de SSL"
            return 0
        fi
    fi

    # Obtener certificado
    certbot --nginx -d "${DOMAIN}" --email "${EMAIL}" --agree-tos --non-interactive --redirect

    # Restaurar configuración completa de Nginx
    if [ -f "${DEPLOY_PATH}/deploy/nginx-ssl.conf" ]; then
        cp "${DEPLOY_PATH}/deploy/nginx-ssl.conf" "/etc/nginx/sites-available/terap-ia"
        systemctl reload nginx
    fi

    # Configurar renovación automática
    systemctl enable certbot.timer
    systemctl start certbot.timer

    log_success "Certificado SSL obtenido y configurado"
}

################################################################################
# Paso 10: Configurar variables de entorno
################################################################################

configure_environment() {
    log_step "Paso 10: Configurando variables de entorno"

    cd "$DEPLOY_PATH"

    if [ ! -f ".env" ]; then
        if [ -f ".env.production" ]; then
            cp .env.production .env
            log_warning "Archivo .env creado desde .env.production"
            log_warning "¡IMPORTANTE! Editar /var/www/terap-ia/.env con valores seguros:"
            log_warning "  - DB_PASSWORD"
            log_warning "  - JWT_SECRET"
            log_warning "  - GOOGLE_API_KEY"
        else
            log_error "No se encontró .env.production"
            return 1
        fi
    else
        log_info "Archivo .env ya existe"
    fi

    log_success "Variables de entorno configuradas"
}

################################################################################
# Paso 11: Crear directorio de backups
################################################################################

setup_backups() {
    log_step "Paso 11: Configurando backups"

    # Crear directorio de backups
    mkdir -p /var/backups/terap-ia
    chmod 700 /var/backups/terap-ia

    # Configurar cron para backups diarios a las 2 AM
    CRON_JOB="0 2 * * * cd ${DEPLOY_PATH} && bash deploy/backup-db.sh backup >> /var/log/terap-ia-backup.log 2>&1"

    # Verificar si ya existe el cron job
    if ! crontab -l 2>/dev/null | grep -q "backup-db.sh"; then
        (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
        log_success "Cron job de backup configurado"
    else
        log_info "Cron job de backup ya existe"
    fi
}

################################################################################
# Paso 12: Generar parámetros Diffie-Hellman
################################################################################

generate_dhparam() {
    log_step "Paso 12: Generando parámetros Diffie-Hellman (esto puede tardar varios minutos)"

    if [ ! -f /etc/nginx/dhparam.pem ]; then
        openssl dhparam -out /etc/nginx/dhparam.pem 2048
        log_success "Parámetros DH generados"
    else
        log_info "dhparam.pem ya existe"
    fi
}

################################################################################
# Paso 13: Iniciar aplicación
################################################################################

start_application() {
    log_step "Paso 13: Iniciando aplicación"

    cd "$DEPLOY_PATH"

    # Construir e iniciar contenedores
    docker-compose build
    docker-compose up -d

    # Esperar a que los servicios inicien
    log_info "Esperando 20 segundos para que los servicios inicien..."
    sleep 20

    # Verificar estado
    docker-compose ps

    log_success "Aplicación iniciada"
}

################################################################################
# Paso 14: Verificar instalación
################################################################################

verify_installation() {
    log_step "Paso 14: Verificando instalación"

    cd "$DEPLOY_PATH"

    if [ -f "deploy/health-check.sh" ]; then
        bash deploy/health-check.sh
    else
        log_info "Verificando contenedores..."
        docker-compose ps
    fi

    log_success "Verificación completada"
}

################################################################################
# Función principal
################################################################################

main() {
    echo ""
    echo -e "${BLUE}=====================================${NC}"
    echo -e "${BLUE}  Setup Servidor Terap-IA${NC}"
    echo -e "${BLUE}=====================================${NC}"
    echo ""

    # Verificar que se ejecuta como root
    check_root

    # Ejecutar todos los pasos
    update_system
    install_dependencies
    install_docker
    install_docker_compose
    configure_firewall
    install_nginx
    clone_repository
    configure_nginx_site
    obtain_ssl_certificate
    configure_environment
    setup_backups
    generate_dhparam
    start_application
    verify_installation

    echo ""
    echo -e "${GREEN}=====================================${NC}"
    echo -e "${GREEN}  ¡Configuración Completada!${NC}"
    echo -e "${GREEN}=====================================${NC}"
    echo ""
    echo -e "Dominio: ${GREEN}https://${DOMAIN}${NC}"
    echo -e "Backend API: ${GREEN}https://${DOMAIN}/api/v1${NC}"
    echo -e "Swagger Docs: ${GREEN}https://${DOMAIN}/api/docs${NC}"
    echo ""
    echo -e "${YELLOW}Pasos siguientes:${NC}"
    echo -e "1. Editar variables de entorno: ${BLUE}nano /var/www/terap-ia/.env${NC}"
    echo -e "2. Reiniciar servicios: ${BLUE}cd /var/www/terap-ia && docker-compose restart${NC}"
    echo -e "3. Ver logs: ${BLUE}cd /var/www/terap-ia && docker-compose logs -f${NC}"
    echo -e "4. Ejecutar backup manual: ${BLUE}cd /var/www/terap-ia && bash deploy/backup-db.sh${NC}"
    echo ""
    echo -e "${GREEN}=====================================${NC}"
}

# Ejecutar
main "$@"
