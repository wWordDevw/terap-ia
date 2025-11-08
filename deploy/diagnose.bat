@echo off
REM Script para ejecutar diagnóstico de Terap-IA desde Windows

echo ===============================================
echo   Diagnóstico Terap-IA
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

echo [1/3] Verificando Python...
python --version

REM Verificar/Instalar dependencias
echo.
echo [2/3] Instalando dependencias...
pip install -q paramiko

REM Ejecutar script de diagnóstico
echo.
echo [3/3] Ejecutando diagnóstico...
echo.
python "%~dp0diagnose.py"

echo.
pause
