#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para Reiniciar Servicios de Terap-IA
Reinicia los servicios remotamente vía SSH
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
    NC = '\033[0m'

def print_header(text):
    print(f"\n{Colors.BLUE}{'='*50}{Colors.NC}")
    print(f"{Colors.BLUE}{text:^50}{Colors.NC}")
    print(f"{Colors.BLUE}{'='*50}{Colors.NC}\n")

def print_success(text):
    print(f"{Colors.GREEN}{CHECK_MARK}{Colors.NC} {text}")

def print_error(text):
    print(f"{Colors.RED}{CROSS_MARK}{Colors.NC} {text}")

def print_warning(text):
    print(f"{Colors.YELLOW}{WARNING_MARK}{Colors.NC} {text}")

def execute_command(ssh, command, show_output=True):
    """Ejecuta un comando SSH y retorna la salida"""
    try:
        stdin, stdout, stderr = ssh.exec_command(command)

        # Mostrar output en tiempo real si se solicita
        if show_output:
            while True:
                line = stdout.readline()
                if not line:
                    break
                print(f"  {line.rstrip()}")

        exit_status = stdout.channel.recv_exit_status()
        error = stderr.read().decode('utf-8')

        if error and show_output:
            print(f"{Colors.RED}{error}{Colors.NC}")

        return exit_status == 0
    except Exception as e:
        print_error(f"Error ejecutando comando: {e}")
        return False

def connect_to_server():
    """Conecta al servidor vía SSH"""
    print(f"🔌 Conectando a {SERVER_CONFIG['hostname']}...")

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

def restart_services(ssh, option='all'):
    """Reinicia los servicios"""
    print_header(f"Reiniciando Servicios - Opción: {option}")

    # Determinar comando de docker compose
    print("🔍 Detectando Docker Compose...")
    stdin, stdout, stderr = ssh.exec_command("docker compose version")
    if stdout.channel.recv_exit_status() == 0:
        docker_cmd = "docker compose"
        print_success("Docker Compose v2 detectado")
    else:
        docker_cmd = "docker-compose"
        print_success("Docker Compose v1 detectado")

    if option == 'all':
        # Reiniciar todos los servicios
        print(f"\n🔄 Reiniciando todos los servicios...")
        success = execute_command(ssh, f"cd {DEPLOY_PATH} && {docker_cmd} restart")

        if success:
            print_success("Servicios reiniciados")
            print("\n⏳ Esperando 30 segundos para que los servicios inicien...")
            time.sleep(30)
        else:
            print_error("Falló el reinicio")
            return False

    elif option == 'rebuild':
        # Reconstruir completamente
        print(f"\n🛑 Deteniendo servicios...")
        execute_command(ssh, f"cd {DEPLOY_PATH} && {docker_cmd} down")

        print(f"\n🏗️  Construyendo imágenes...")
        success = execute_command(ssh, f"cd {DEPLOY_PATH} && {docker_cmd} build --no-cache")

        if not success:
            print_error("Falló la construcción")
            return False

        print(f"\n🚀 Iniciando servicios...")
        success = execute_command(ssh, f"cd {DEPLOY_PATH} && {docker_cmd} up -d")

        if success:
            print_success("Servicios iniciados")
            print("\n⏳ Esperando 40 segundos para que los servicios inicien y ejecuten migraciones...")
            time.sleep(40)
        else:
            print_error("Falló el inicio")
            return False

    elif option in ['backend', 'frontend', 'postgres']:
        # Reiniciar servicio específico
        print(f"\n🔄 Reiniciando {option}...")
        success = execute_command(ssh, f"cd {DEPLOY_PATH} && {docker_cmd} restart {option}")

        if success:
            print_success(f"{option} reiniciado")
            print("\n⏳ Esperando 20 segundos...")
            time.sleep(20)
        else:
            print_error(f"Falló el reinicio de {option}")
            return False

    # Verificar estado
    print(f"\n📊 Estado de servicios:")
    execute_command(ssh, f"cd {DEPLOY_PATH} && {docker_cmd} ps")

    # Mostrar logs del backend
    print(f"\n📋 Últimos logs del backend:")
    execute_command(ssh, "docker logs terapia-backend --tail 30 2>/dev/null || docker logs terap-ia-backend-1 --tail 30")

    return True

def show_menu():
    """Muestra el menú de opciones"""
    print_header("Reiniciar Servicios Terap-IA")
    print("Selecciona una opción:\n")
    print("  1. Reiniciar todos los servicios (rápido)")
    print("  2. Reconstruir y reiniciar (completo, tarda más)")
    print("  3. Reiniciar solo Backend")
    print("  4. Reiniciar solo Frontend")
    print("  5. Reiniciar solo PostgreSQL")
    print("  0. Salir\n")

    try:
        choice = input("Opción: ").strip()
        return choice
    except KeyboardInterrupt:
        print("\n\nCancelado por el usuario")
        sys.exit(0)

def main():
    """Función principal"""
    # Mostrar menú si no hay argumentos
    if len(sys.argv) > 1:
        option = sys.argv[1]
    else:
        choice = show_menu()

        options_map = {
            '1': 'all',
            '2': 'rebuild',
            '3': 'backend',
            '4': 'frontend',
            '5': 'postgres',
            '0': None
        }

        option = options_map.get(choice)

        if option is None:
            if choice == '0':
                print("Saliendo...")
                sys.exit(0)
            else:
                print_error("Opción inválida")
                sys.exit(1)

    # Conectar al servidor
    ssh = connect_to_server()
    if not ssh:
        sys.exit(1)

    try:
        # Reiniciar servicios
        success = restart_services(ssh, option)

        if success:
            print_header("Completado")
            print_success("Servicios reiniciados correctamente")
            print(f"\n{Colors.GREEN}URLs del sistema:{Colors.NC}")
            print(f"  Frontend:  https://terap-ia.victalejo.dev")
            print(f"  API:       https://terap-ia.victalejo.dev/api/v1")
            print(f"  Docs:      https://terap-ia.victalejo.dev/api/docs")
        else:
            print_header("Error")
            print_error("No se pudieron reiniciar los servicios")
            print("\nPor favor ejecuta el diagnóstico: python diagnose.py")
            sys.exit(1)

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
        sys.exit(1)
