@echo off
REM Script para reiniciar servicios de Terap-IA desde Windows

echo ===============================================
echo   Reiniciar Servicios Terap-IA
echo ===============================================
echo.

REM Verificar que Python esté instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python no está instalado
    echo Por favor instala Python desde https://www.python.org/
    pause
    exit /b 1
)

REM Instalar dependencias si no están
pip show paramiko >nul 2>&1
if errorlevel 1 (
    echo Instalando dependencias...
    pip install -q paramiko
)

REM Ejecutar script de reinicio
python "%~dp0restart-services.py"

echo.
pause
