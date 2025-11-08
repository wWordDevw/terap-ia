@echo off
REM Script para instalar Nginx y configurar SSL

echo ===============================================
echo   Instalacion de Nginx y SSL
echo ===============================================
echo.

REM Verificar que Python este instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python no esta instalado
    echo Por favor instala Python desde https://www.python.org/
    pause
    exit /b 1
)

REM Instalar dependencias si no estan
pip show paramiko >nul 2>&1
if errorlevel 1 (
    echo Instalando dependencias...
    pip install -q paramiko
)

REM Ejecutar script de instalacion
python "%~dp0install-nginx-ssl.py"

echo.
pause
