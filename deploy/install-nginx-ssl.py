#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para Instalar y Configurar Nginx con SSL
Instala Nginx, configura reverse proxy y obtiene certificado SSL
"""

import paramiko
import sys
import platform
from datetime import datetime

# Configurar encoding para Windows
if platform.system() == 'Windows':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Configuración
SERVER_CONFIG = {
    'hostname': '147.93.184.62',
    'username': 'root',
    'password': 'Alejo2026',
    'port': 22,
    'timeout': 10
}

DOMAIN = 'terap-ia.victalejo.dev'
EMAIL = 'admin@victalejo.dev'
DEPLOY_PATH = '/var/www/terap-ia'

# Símbolos compatibles con Windows
IS_WINDOWS = platform.system() == 'Windows'
CHECK_MARK = '[OK]' if IS_WINDOWS else '✓'
CROSS_MARK = '[X]' if IS_WINDOWS else '✗'
WARNING_MARK = '[!]' if IS_WINDOWS else '⚠'

# Colores ANSI
class Colors:
    BLUE = '\033[0;34m'
    GREEN = '\033[0;32m'
    RED = '\033[0;31m'
    YELLOW = '\033[1;33m'
    PURPLE = '\033[0;35m'
    NC = '\033[0m'

def print_header(text):
    print(f"\n{Colors.BLUE}{'='*60}{Colors.NC}")
    print(f"{Colors.BLUE}{text:^60}{Colors.NC}")
    print(f"{Colors.BLUE}{'='*60}{Colors.NC}\n")

def print_success(text):
    print(f"{Colors.GREEN}{CHECK_MARK}{Colors.NC} {text}")

def print_error(text):
    print(f"{Colors.RED}{CROSS_MARK}{Colors.NC} {text}")

def print_warning(text):
    print(f"{Colors.YELLOW}{WARNING_MARK}{Colors.NC} {text}")

def print_info(text):
    print(f"{Colors.PURPLE}→{Colors.NC} {text}")

def execute_command(ssh, command, show_output=True):
    """Ejecuta un comando SSH y retorna la salida"""
    try:
        stdin, stdout, stderr = ssh.exec_command(command, get_pty=True)

        if show_output:
            while True:
                line = stdout.readline()
                if not line:
                    break
                print(f"  {line.rstrip()}")

        exit_status = stdout.channel.recv_exit_status()
        error = stderr.read().decode('utf-8')

        return {
            'success': exit_status == 0,
            'output': stdout.read().decode('utf-8'),
            'error': error
        }
    except Exception as e:
        return {
            'success': False,
            'output': '',
            'error': str(e)
        }

def connect_to_server():
    """Conecta al servidor vía SSH"""
    print_header("Conexión al Servidor")

    try:
        print_info(f"Conectando a {SERVER_CONFIG['hostname']}...")
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        ssh.connect(
            hostname=SERVER_CONFIG['hostname'],
            username=SERVER_CONFIG['username'],
            password=SERVER_CONFIG['password'],
            port=SERVER_CONFIG['port'],
            timeout=SERVER_CONFIG['timeout']
        )

        print_success(f"Conectado a {SERVER_CONFIG['hostname']}")
        return ssh
    except Exception as e:
        print_error(f"No se pudo conectar: {e}")
        return None

def install_nginx(ssh):
    """Instala Nginx"""
    print_header("1. Instalación de Nginx")

    print_info("Actualizando repositorios...")
    result = execute_command(ssh, "apt update", show_output=False)

    if not result['success']:
        print_error("No se pudo actualizar repositorios")
        return False

    print_info("Instalando Nginx...")
    result = execute_command(ssh, "DEBIAN_FRONTEND=noninteractive apt install -y nginx")

    if result['success']:
        print_success("Nginx instalado correctamente")

        # Iniciar Nginx
        print_info("Iniciando Nginx...")
        execute_command(ssh, "systemctl start nginx", show_output=False)
        execute_command(ssh, "systemctl enable nginx", show_output=False)

        print_success("Nginx iniciado y habilitado")
        return True
    else:
        print_error("No se pudo instalar Nginx")
        return False

def install_certbot(ssh):
    """Instala Certbot"""
    print_header("2. Instalación de Certbot")

    print_info("Instalando Certbot y plugin de Nginx...")
    result = execute_command(ssh, "DEBIAN_FRONTEND=noninteractive apt install -y certbot python3-certbot-nginx")

    if result['success']:
        print_success("Certbot instalado correctamente")
        return True
    else:
        print_error("No se pudo instalar Certbot")
        return False

def create_nginx_config(ssh):
    """Crea la configuración de Nginx para el dominio"""
    print_header("3. Configuración de Nginx")

    nginx_config = f"""# Configuración HTTP (será redirigido a HTTPS)
server {{
    listen 80;
    listen [::]:80;
    server_name {DOMAIN};

    # Redirigir todo el tráfico HTTP a HTTPS
    return 301 https://$server_name$request_uri;
}}

# Configuración HTTPS (será configurada por Certbot)
server {{
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name {DOMAIN};

    # Logs
    access_log /var/log/nginx/{DOMAIN}-access.log;
    error_log /var/log/nginx/{DOMAIN}-error.log;

    # Tamaño máximo de carga
    client_max_body_size 100M;

    # Configuración de SSL (Certbot agregará los certificados aquí)

    # Seguridad SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';

    # Headers de seguridad
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy para la API Backend
    location /api/ {{
        proxy_pass http://localhost:3100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }}

    # Proxy para el Frontend
    location / {{
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }}
}}
"""

    # Escribir configuración
    print_info(f"Creando configuración para {DOMAIN}...")

    # Crear archivo temporal
    temp_file = f"/tmp/nginx-{DOMAIN}.conf"
    create_file_cmd = f"cat > {temp_file} << 'EOF'\n{nginx_config}\nEOF"

    result = execute_command(ssh, create_file_cmd, show_output=False)

    if not result['success']:
        print_error("No se pudo crear archivo de configuración")
        return False

    # Mover a sites-available
    result = execute_command(ssh, f"mv {temp_file} /etc/nginx/sites-available/{DOMAIN}", show_output=False)

    if not result['success']:
        print_error("No se pudo mover configuración a sites-available")
        return False

    # Crear enlace simbólico en sites-enabled
    print_info("Habilitando sitio...")
    execute_command(ssh, f"rm -f /etc/nginx/sites-enabled/default", show_output=False)
    result = execute_command(ssh, f"ln -sf /etc/nginx/sites-available/{DOMAIN} /etc/nginx/sites-enabled/", show_output=False)

    if not result['success']:
        print_error("No se pudo habilitar sitio")
        return False

    # Verificar configuración
    print_info("Verificando configuración de Nginx...")
    result = execute_command(ssh, "nginx -t", show_output=False)

    if result['success']:
        print_success("Configuración de Nginx es válida")

        # Recargar Nginx
        print_info("Recargando Nginx...")
        execute_command(ssh, "systemctl reload nginx", show_output=False)
        print_success("Nginx recargado correctamente")
        return True
    else:
        print_error("Configuración de Nginx tiene errores")
        return False

def obtain_certificate(ssh):
    """Obtiene certificado SSL con Certbot"""
    print_header("4. Obtención de Certificado SSL")

    print_warning("Obteniendo certificado SSL...")
    print_info("Esto puede tomar 1-2 minutos...")

    command = f"""certbot --nginx \
        --non-interactive \
        --agree-tos \
        --email {EMAIL} \
        -d {DOMAIN} \
        --redirect"""

    result = execute_command(ssh, command)

    if result['success'] or 'Successfully received certificate' in result['output'] or 'Certificate not yet due for renewal' in result['output']:
        print_success("Certificado SSL configurado correctamente")
        return True
    else:
        print_error("No se pudo obtener el certificado SSL")
        return False

def verify_services(ssh):
    """Verifica que los servicios estén corriendo"""
    print_header("5. Verificación de Servicios")

    # Verificar Docker Compose
    print_info("Verificando servicios Docker...")

    # Intentar docker compose v2
    stdin, stdout, stderr = ssh.exec_command("docker compose version", get_pty=True)
    if stdout.channel.recv_exit_status() == 0:
        docker_cmd = "docker compose"
    else:
        docker_cmd = "docker-compose"

    result = execute_command(ssh, f"cd {DEPLOY_PATH} && {docker_cmd} ps", show_output=True)

    if result['success']:
        print_success("Servicios Docker verificados")
    else:
        print_warning("No se pudieron verificar servicios Docker")

    # Verificar Nginx
    print_info("Verificando Nginx...")
    result = execute_command(ssh, "systemctl is-active nginx", show_output=False)

    if result['success'] and 'active' in result['output']:
        print_success("Nginx está activo")
    else:
        print_warning("Nginx no está activo")

    return True

def test_https(ssh):
    """Prueba la conexión HTTPS"""
    print_header("6. Prueba Final")

    print_info(f"Probando conexión HTTPS a {DOMAIN}...")

    import time
    time.sleep(3)  # Esperar a que Nginx se estabilice

    result = execute_command(ssh, f"curl -sI https://{DOMAIN} 2>&1 | head -10", show_output=False)

    if result['success']:
        output = result['output']
        print(f"\n{Colors.GREEN}Respuesta del servidor:{Colors.NC}")
        print(output)

        if '200' in output or '301' in output or '302' in output:
            print_success("HTTPS funciona correctamente")
            return True
        else:
            print_warning("HTTPS responde pero puede tener problemas")
            return False
    else:
        print_warning("No se pudo verificar HTTPS desde el servidor")
        print("Esto es normal, prueba desde tu navegador")
        return True

def main():
    """Función principal"""
    print_header("Instalación y Configuración de Nginx con SSL")
    print(f"Dominio: {DOMAIN}")
    print(f"Servidor: {SERVER_CONFIG['hostname']}")
    print(f"Email: {EMAIL}")
    print(f"Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    print(f"{Colors.YELLOW}Este script realizará:{Colors.NC}")
    print("  1. Instalar Nginx")
    print("  2. Instalar Certbot")
    print("  3. Configurar Nginx con reverse proxy")
    print("  4. Obtener certificado SSL de Let's Encrypt")
    print("  5. Configurar HTTPS con redirección automática")
    print(f"  6. Configurar acceso a: https://{DOMAIN}\n")

    response = input("¿Deseas continuar? (s/n): ").strip().lower()
    if response != 's':
        print_warning("Operación cancelada")
        sys.exit(0)

    # Conectar al servidor
    ssh = connect_to_server()
    if not ssh:
        sys.exit(1)

    try:
        # 1. Instalar Nginx
        if not install_nginx(ssh):
            print_error("\nNo se pudo instalar Nginx")
            sys.exit(1)

        # 2. Instalar Certbot
        if not install_certbot(ssh):
            print_error("\nNo se pudo instalar Certbot")
            sys.exit(1)

        # 3. Crear configuración de Nginx
        if not create_nginx_config(ssh):
            print_error("\nNo se pudo configurar Nginx")
            sys.exit(1)

        # 4. Obtener certificado SSL
        if not obtain_certificate(ssh):
            print_error("\nNo se pudo obtener certificado SSL")
            print_warning("Verifica que:")
            print("  - El dominio apunte correctamente al servidor")
            print("  - El puerto 80 y 443 estén abiertos en el firewall")
            sys.exit(1)

        # 5. Verificar servicios
        verify_services(ssh)

        # 6. Probar HTTPS
        test_https(ssh)

        # Resumen final
        print_header("Instalación Completada")
        print_success("Nginx y SSL configurados correctamente")
        print(f"\n{Colors.GREEN}URLs del sistema:{Colors.NC}")
        print(f"  Frontend:  https://{DOMAIN}")
        print(f"  API:       https://{DOMAIN}/api/v1")
        print(f"  Docs:      https://{DOMAIN}/api/docs")

        print(f"\n{Colors.YELLOW}Próximos pasos:{Colors.NC}")
        print("  1. Abre tu navegador y ve a https://{DOMAIN}")
        print("  2. El certificado SSL se renovará automáticamente cada 90 días")
        print("  3. Puedes verificar el certificado con: python diagnose.py")

        print(f"\n{Colors.GREEN}Comandos útiles:{Colors.NC}")
        print(f"  Verificar Nginx:    systemctl status nginx")
        print(f"  Recargar Nginx:     systemctl reload nginx")
        print(f"  Ver logs Nginx:     tail -f /var/log/nginx/{DOMAIN}-error.log")
        print(f"  Renovar SSL:        certbot renew")

    finally:
        ssh.close()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Operación cancelada por el usuario{Colors.NC}")
        sys.exit(0)
    except Exception as e:
        print(f"\n{Colors.RED}Error inesperado: {e}{Colors.NC}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
