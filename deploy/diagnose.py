#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de Diagnóstico para Terap-IA
Ejecuta diagnóstico remoto del servidor vía SSH
"""

import paramiko
import sys
import time
import platform
from datetime import datetime

# Configurar encoding para Windows
if platform.system() == 'Windows':
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer, 'strict')
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.buffer, 'strict')

# Configuración del servidor
SERVER_CONFIG = {
    'hostname': '147.93.184.62',
    'username': 'root',
    'password': 'Alejo2026',
    'port': 22,
    'timeout': 10
}

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
    NC = '\033[0m'  # No Color

def print_header(text):
    print(f"\n{Colors.BLUE}{'='*50}{Colors.NC}")
    print(f"{Colors.BLUE}{text:^50}{Colors.NC}")
    print(f"{Colors.BLUE}{'='*50}{Colors.NC}\n")

def print_step(step, total, text):
    print(f"{Colors.BLUE}[{step}/{total}]{Colors.NC} {text}")

def print_success(text):
    print(f"{Colors.GREEN}{CHECK_MARK}{Colors.NC} {text}")

def print_error(text):
    print(f"{Colors.RED}{CROSS_MARK}{Colors.NC} {text}")

def print_warning(text):
    print(f"{Colors.YELLOW}{WARNING_MARK}{Colors.NC} {text}")

def execute_command(ssh, command, description=""):
    """Ejecuta un comando SSH y retorna la salida"""
    try:
        if description:
            print(f"  {Colors.PURPLE}→{Colors.NC} {description}")

        stdin, stdout, stderr = ssh.exec_command(command)
        exit_status = stdout.channel.recv_exit_status()

        output = stdout.read().decode('utf-8')
        error = stderr.read().decode('utf-8')

        return {
            'success': exit_status == 0,
            'output': output,
            'error': error,
            'exit_code': exit_status
        }
    except Exception as e:
        return {
            'success': False,
            'output': '',
            'error': str(e),
            'exit_code': -1
        }

def connect_to_server():
    """Conecta al servidor vía SSH"""
    print_step(1, 10, "Conectando al servidor...")

    try:
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

def check_directory(ssh):
    """Verifica que el directorio del proyecto exista"""
    print_step(2, 10, "Verificando directorio del proyecto...")

    result = execute_command(ssh, f"test -d {DEPLOY_PATH} && echo 'exists' || echo 'not exists'")

    if 'exists' in result['output']:
        print_success(f"Directorio existe: {DEPLOY_PATH}")
        return True
    else:
        print_error(f"Directorio no existe: {DEPLOY_PATH}")
        return False

def check_docker(ssh):
    """Verifica que Docker esté instalado"""
    print_step(3, 10, "Verificando Docker...")

    result = execute_command(ssh, "docker --version")

    if result['success']:
        print_success(f"Docker instalado: {result['output'].strip()}")
        return True
    else:
        print_error("Docker no está instalado")
        return False

def check_docker_compose(ssh):
    """Verifica Docker Compose"""
    print_step(4, 10, "Verificando Docker Compose...")

    # Intentar v2 primero
    result = execute_command(ssh, "docker compose version")
    if result['success']:
        print_success(f"Docker Compose v2: {result['output'].strip()}")
        return 'docker compose'

    # Intentar v1
    result = execute_command(ssh, "docker-compose --version")
    if result['success']:
        print_success(f"Docker Compose v1: {result['output'].strip()}")
        return 'docker-compose'

    print_error("Docker Compose no está instalado")
    return None

def check_containers(ssh, docker_compose_cmd):
    """Verifica el estado de los contenedores"""
    print_step(5, 10, "Verificando estado de contenedores...")

    result = execute_command(
        ssh,
        f"cd {DEPLOY_PATH} && {docker_compose_cmd} ps"
    )

    print("\n" + result['output'])

    # Verificar servicios individuales
    services = ['backend', 'frontend', 'postgres']
    running_services = []

    for service in services:
        result = execute_command(
            ssh,
            f"cd {DEPLOY_PATH} && {docker_compose_cmd} ps {service} | grep -i 'up'"
        )

        if result['success'] and result['output'].strip():
            print_success(f"{service.capitalize()} corriendo")
            running_services.append(service)
        else:
            print_error(f"{service.capitalize()} NO está corriendo")

    return running_services

def get_backend_logs(ssh):
    """Obtiene los últimos logs del backend"""
    print_step(6, 10, "Obteniendo logs del backend...")

    commands = [
        "docker logs terapia-backend --tail 30",
        "docker logs terap-ia-backend-1 --tail 30",
        f"docker logs $(cd {DEPLOY_PATH} && docker compose ps -q backend) --tail 30"
    ]

    for cmd in commands:
        result = execute_command(ssh, cmd)
        if result['success'] and result['output']:
            print(f"\n{Colors.YELLOW}{'='*50}{Colors.NC}")
            print(f"{Colors.YELLOW}Últimos 30 logs del backend:{Colors.NC}")
            print(f"{Colors.YELLOW}{'='*50}{Colors.NC}")
            print(result['output'])
            return result['output']

    print_warning("No se pudieron obtener logs del backend")
    return None

def check_ports(ssh):
    """Verifica los puertos en uso"""
    print_step(7, 10, "Verificando puertos...")

    result = execute_command(
        ssh,
        "netstat -tlnp 2>/dev/null | grep -E ':3001|:3100|:5432|:80|:443' || ss -tlnp | grep -E ':3001|:3100|:5432|:80|:443'"
    )

    if result['output']:
        print("\nPuertos en uso:")
        print(result['output'])
    else:
        print_warning("No se pudieron verificar puertos")

def check_disk_space(ssh):
    """Verifica espacio en disco"""
    print_step(8, 10, "Verificando espacio en disco...")

    result = execute_command(ssh, "df -h /")

    if result['success']:
        lines = result['output'].strip().split('\n')
        if len(lines) >= 2:
            print(f"\n{lines[0]}")
            print(f"{lines[1]}")

            # Extraer porcentaje de uso
            parts = lines[1].split()
            if len(parts) >= 5:
                usage = parts[4].replace('%', '')
                try:
                    usage_int = int(usage)
                    if usage_int < 80:
                        print_success(f"Espacio en disco: {usage}% usado")
                    elif usage_int < 90:
                        print_warning(f"Espacio en disco: {usage}% usado (considerar limpieza)")
                    else:
                        print_error(f"Espacio en disco crítico: {usage}% usado")
                except:
                    pass

def check_memory(ssh):
    """Verifica uso de memoria"""
    print_step(9, 10, "Verificando memoria...")

    result = execute_command(ssh, "free -h")

    if result['success']:
        print("\n" + result['output'])

def check_docker_stats(ssh):
    """Muestra estadísticas de Docker"""
    print_step(10, 10, "Obteniendo estadísticas de Docker...")

    result = execute_command(
        ssh,
        'docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"'
    )

    if result['success']:
        print("\n" + result['output'])
    else:
        print_warning("No se pudieron obtener estadísticas de Docker")

def show_recommendations(running_services, docker_compose_cmd):
    """Muestra recomendaciones basadas en el diagnóstico"""
    print_header("Recomendaciones")

    if len(running_services) < 3:
        print(f"{Colors.RED}⚠ Algunos servicios no están corriendo{Colors.NC}\n")
        print(f"{Colors.YELLOW}Comandos para solucionar:{Colors.NC}")
        print(f"  {Colors.GREEN}# Conectarse al servidor{Colors.NC}")
        print(f"  ssh root@{SERVER_CONFIG['hostname']}\n")
        print(f"  {Colors.GREEN}# Ir al directorio del proyecto{Colors.NC}")
        print(f"  cd {DEPLOY_PATH}\n")
        print(f"  {Colors.GREEN}# Iniciar servicios{Colors.NC}")
        print(f"  {docker_compose_cmd} up -d\n")
        print(f"  {Colors.GREEN}# Ver logs en tiempo real{Colors.NC}")
        print(f"  {docker_compose_cmd} logs -f backend\n")
        print(f"  {Colors.GREEN}# Si persiste el problema, reconstruir{Colors.NC}")
        print(f"  {docker_compose_cmd} down")
        print(f"  {docker_compose_cmd} build --no-cache")
        print(f"  {docker_compose_cmd} up -d")
    else:
        print_success("Todos los servicios están corriendo")
        print(f"\n{Colors.GREEN}URLs del sistema:{Colors.NC}")
        print(f"  Frontend:  https://terap-ia.victalejo.dev")
        print(f"  API:       https://terap-ia.victalejo.dev/api/v1")
        print(f"  Docs:      https://terap-ia.victalejo.dev/api/docs")

def main():
    """Función principal"""
    print_header("Diagnóstico Terap-IA")
    print(f"Servidor: {SERVER_CONFIG['hostname']}")
    print(f"Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")

    # Conectar al servidor
    ssh = connect_to_server()
    if not ssh:
        sys.exit(1)

    try:
        # Verificar directorio
        if not check_directory(ssh):
            print_error("El proyecto no está instalado en el servidor")
            sys.exit(1)

        # Verificar Docker
        if not check_docker(ssh):
            print_error("Docker no está instalado")
            sys.exit(1)

        # Verificar Docker Compose
        docker_compose_cmd = check_docker_compose(ssh)
        if not docker_compose_cmd:
            print_error("Docker Compose no está instalado")
            sys.exit(1)

        # Verificar contenedores
        running_services = check_containers(ssh, docker_compose_cmd)

        # Obtener logs del backend
        get_backend_logs(ssh)

        # Verificar puertos
        check_ports(ssh)

        # Verificar recursos
        check_disk_space(ssh)
        check_memory(ssh)
        check_docker_stats(ssh)

        # Mostrar recomendaciones
        show_recommendations(running_services, docker_compose_cmd)

    finally:
        ssh.close()
        print(f"\n{Colors.BLUE}Diagnóstico completado{Colors.NC}\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Diagnóstico interrumpido por el usuario{Colors.NC}")
        sys.exit(0)
    except Exception as e:
        print(f"\n{Colors.RED}Error inesperado: {e}{Colors.NC}")
        sys.exit(1)
