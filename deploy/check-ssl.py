#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para Verificar y Configurar SSL en Terap-IA
Verifica DNS, certificado SSL y configuración de Nginx
"""

import paramiko
import sys
import platform
import subprocess
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
EMAIL = 'admin@victalejo.dev'  # Para Let's Encrypt

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

def execute_command(ssh, command):
    """Ejecuta un comando SSH y retorna la salida"""
    try:
        stdin, stdout, stderr = ssh.exec_command(command)
        exit_status = stdout.channel.recv_exit_status()
        output = stdout.read().decode('utf-8')
        error = stderr.read().decode('utf-8')

        return {
            'success': exit_status == 0,
            'output': output,
            'error': error
        }
    except Exception as e:
        return {
            'success': False,
            'output': '',
            'error': str(e)
        }

def check_dns():
    """Verifica la resolución DNS del dominio"""
    print_header("1. Verificación DNS")

    try:
        print_info(f"Verificando resolución DNS de {DOMAIN}...")
        result = subprocess.run(['nslookup', DOMAIN],
                              capture_output=True,
                              text=True,
                              timeout=10)

        if SERVER_CONFIG['hostname'] in result.stdout:
            print_success(f"DNS apunta correctamente a {SERVER_CONFIG['hostname']}")
            return True
        else:
            print_error(f"DNS NO apunta a {SERVER_CONFIG['hostname']}")
            print(f"\nResultado de nslookup:\n{result.stdout}")
            return False
    except Exception as e:
        print_warning(f"No se pudo verificar DNS: {e}")
        return False

def connect_to_server():
    """Conecta al servidor vía SSH"""
    print_header("2. Conexión al Servidor")

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

def check_nginx(ssh):
    """Verifica que Nginx esté instalado y corriendo"""
    print_header("3. Verificación Nginx")

    # Verificar instalación
    result = execute_command(ssh, "nginx -v")
    if not result['success']:
        print_error("Nginx no está instalado")
        return False

    version = result['error'].strip()  # nginx pone version en stderr
    print_success(f"Nginx instalado: {version}")

    # Verificar estado
    result = execute_command(ssh, "systemctl is-active nginx")
    if result['output'].strip() == 'active':
        print_success("Nginx está activo")
    else:
        print_warning("Nginx NO está activo")
        print_info("Intentando iniciar Nginx...")
        result = execute_command(ssh, "systemctl start nginx")
        if result['success']:
            print_success("Nginx iniciado correctamente")
        else:
            print_error("No se pudo iniciar Nginx")
            return False

    # Verificar configuración
    result = execute_command(ssh, "nginx -t")
    if result['success']:
        print_success("Configuración de Nginx es válida")
    else:
        print_error("Configuración de Nginx tiene errores:")
        print(result['error'])
        return False

    return True

def check_certbot(ssh):
    """Verifica que Certbot esté instalado"""
    print_header("4. Verificación Certbot")

    result = execute_command(ssh, "certbot --version")
    if result['success']:
        print_success(f"Certbot instalado: {result['output'].strip()}")
        return True
    else:
        print_warning("Certbot no está instalado")
        print_info("Instalando Certbot...")

        result = execute_command(ssh, "apt update && apt install -y certbot python3-certbot-nginx")
        if result['success']:
            print_success("Certbot instalado correctamente")
            return True
        else:
            print_error("No se pudo instalar Certbot")
            print(result['error'])
            return False

def check_certificate(ssh):
    """Verifica el estado del certificado SSL"""
    print_header("5. Verificación Certificado SSL")

    cert_path = f"/etc/letsencrypt/live/{DOMAIN}/fullchain.pem"

    # Verificar si existe el certificado
    result = execute_command(ssh, f"test -f {cert_path} && echo 'exists' || echo 'not exists'")

    if 'not exists' in result['output']:
        print_warning(f"No existe certificado para {DOMAIN}")
        return False

    print_success(f"Certificado existe en {cert_path}")

    # Verificar validez del certificado
    result = execute_command(ssh, f"openssl x509 -in {cert_path} -noout -dates -subject")
    if result['success']:
        print(f"\n{Colors.GREEN}Información del certificado:{Colors.NC}")
        print(result['output'])

        # Verificar que el dominio coincida
        result = execute_command(ssh, f"openssl x509 -in {cert_path} -noout -text | grep -A1 'Subject Alternative Name'")
        if DOMAIN in result['output']:
            print_success(f"Certificado es válido para {DOMAIN}")
            return True
        else:
            print_error(f"Certificado NO es para {DOMAIN}")
            print(result['output'])
            return False

    return False

def obtain_certificate(ssh):
    """Obtiene un nuevo certificado SSL con Certbot"""
    print_header("6. Obtención de Certificado SSL")

    print_warning("Se va a solicitar un nuevo certificado SSL")
    print_info("Esto puede tomar 1-2 minutos...")

    # Detener Nginx temporalmente
    print_info("Deteniendo Nginx temporalmente...")
    execute_command(ssh, "systemctl stop nginx")

    # Obtener certificado con método standalone
    command = f"""certbot certonly \
        --standalone \
        --non-interactive \
        --agree-tos \
        --email {EMAIL} \
        -d {DOMAIN} \
        --force-renewal"""

    print_info(f"Ejecutando: certbot certonly para {DOMAIN}...")
    result = execute_command(ssh, command)

    if result['success'] or 'Successfully received certificate' in result['output']:
        print_success("Certificado obtenido exitosamente")
        print(result['output'])

        # Reiniciar Nginx
        print_info("Reiniciando Nginx...")
        execute_command(ssh, "systemctl start nginx")

        return True
    else:
        print_error("No se pudo obtener el certificado")
        print(result['output'])
        print(result['error'])

        # Reiniciar Nginx de todas formas
        execute_command(ssh, "systemctl start nginx")
        return False

def check_nginx_ssl_config(ssh):
    """Verifica la configuración SSL en Nginx"""
    print_header("7. Verificación Configuración SSL en Nginx")

    # Verificar si existe archivo de configuración
    result = execute_command(ssh, f"test -f /etc/nginx/sites-available/{DOMAIN} && echo 'exists' || echo 'not exists'")

    if 'not exists' in result['output']:
        print_warning(f"No existe configuración de Nginx para {DOMAIN}")
        return False

    # Verificar que está habilitado
    result = execute_command(ssh, f"test -L /etc/nginx/sites-enabled/{DOMAIN} && echo 'enabled' || echo 'disabled'")

    if 'disabled' in result['output']:
        print_warning("Configuración no está habilitada")
        print_info("Habilitando configuración...")
        execute_command(ssh, f"ln -sf /etc/nginx/sites-available/{DOMAIN} /etc/nginx/sites-enabled/")
        print_success("Configuración habilitada")
    else:
        print_success("Configuración de Nginx está habilitada")

    # Mostrar configuración SSL
    result = execute_command(ssh, f"grep -A5 'ssl_certificate' /etc/nginx/sites-available/{DOMAIN}")
    if result['success']:
        print(f"\n{Colors.GREEN}Configuración SSL actual:{Colors.NC}")
        print(result['output'])

    return True

def reload_nginx(ssh):
    """Recarga la configuración de Nginx"""
    print_header("8. Recarga de Nginx")

    # Verificar configuración primero
    result = execute_command(ssh, "nginx -t")
    if not result['success']:
        print_error("Configuración de Nginx tiene errores:")
        print(result['error'])
        return False

    # Recargar
    print_info("Recargando Nginx...")
    result = execute_command(ssh, "systemctl reload nginx")

    if result['success']:
        print_success("Nginx recargado exitosamente")
        return True
    else:
        print_error("No se pudo recargar Nginx")
        print(result['error'])
        return False

def test_https(ssh):
    """Prueba la conexión HTTPS"""
    print_header("9. Prueba de Conexión HTTPS")

    print_info(f"Probando conexión a https://{DOMAIN}...")
    result = execute_command(ssh, f"curl -sI https://{DOMAIN} | head -5")

    if result['success']:
        print(f"\n{Colors.GREEN}Respuesta del servidor:{Colors.NC}")
        print(result['output'])

        if '200 OK' in result['output'] or '301' in result['output'] or '302' in result['output']:
            print_success("HTTPS está funcionando correctamente")
            return True
        else:
            print_warning("HTTPS responde pero puede tener problemas")
            return False
    else:
        print_error("No se pudo conectar por HTTPS")
        print(result['error'])
        return False

def main():
    """Función principal"""
    print_header("Diagnóstico y Configuración SSL")
    print(f"Dominio: {DOMAIN}")
    print(f"Servidor: {SERVER_CONFIG['hostname']}")
    print(f"Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    # 1. Verificar DNS
    dns_ok = check_dns()
    if not dns_ok:
        print_error("\nEl DNS no apunta al servidor correcto")
        print(f"Asegúrate de que {DOMAIN} apunta a {SERVER_CONFIG['hostname']}")
        print("\nNo se puede continuar sin DNS correcto.")
        sys.exit(1)

    # 2. Conectar al servidor
    ssh = connect_to_server()
    if not ssh:
        sys.exit(1)

    try:
        # 3. Verificar Nginx
        if not check_nginx(ssh):
            print_error("\nProblemas con Nginx. Por favor revisa manualmente.")
            sys.exit(1)

        # 4. Verificar Certbot
        if not check_certbot(ssh):
            print_error("\nNo se pudo instalar Certbot")
            sys.exit(1)

        # 5. Verificar certificado existente
        cert_exists = check_certificate(ssh)

        # 6. Si no existe o es inválido, obtener nuevo certificado
        if not cert_exists:
            print_warning("\nSe necesita obtener un nuevo certificado SSL")
            response = input(f"\n¿Deseas obtener un certificado SSL para {DOMAIN}? (s/n): ").strip().lower()

            if response == 's':
                if not obtain_certificate(ssh):
                    print_error("\nNo se pudo obtener el certificado")
                    sys.exit(1)
            else:
                print_warning("Operación cancelada por el usuario")
                sys.exit(0)

        # 7. Verificar configuración Nginx
        check_nginx_ssl_config(ssh)

        # 8. Recargar Nginx
        reload_nginx(ssh)

        # 9. Probar HTTPS
        test_https(ssh)

        # Resumen final
        print_header("Resumen Final")
        print_success("Diagnóstico completado")
        print(f"\n{Colors.GREEN}URLs del sistema:{Colors.NC}")
        print(f"  HTTPS:     https://{DOMAIN}")
        print(f"  Frontend:  https://{DOMAIN}")
        print(f"  API:       https://{DOMAIN}/api/v1")
        print(f"  Docs:      https://{DOMAIN}/api/docs")

        print(f"\n{Colors.YELLOW}Nota:{Colors.NC} Espera 1-2 minutos para que el certificado se propague")
        print(f"Si aún ves errores de SSL, prueba:")
        print(f"  1. Limpia el caché del navegador")
        print(f"  2. Prueba en modo incógnito")
        print(f"  3. Verifica que el DNS esté actualizado (puede tardar hasta 24h)")

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
