# 🐍 Scripts Python para Gestión Remota de Terap-IA

Scripts Python para diagnosticar y reiniciar servicios remotamente vía SSH.

## 📋 Requisitos

- Python 3.7 o superior
- pip (gestor de paquetes de Python)

## 🚀 Instalación

### 1. Instalar Python

**Windows:**
- Descargar desde: https://www.python.org/downloads/
- Durante la instalación, marcar "Add Python to PATH"

**Linux/Mac:**
```bash
# Python ya viene instalado, verificar versión
python3 --version
```

### 2. Instalar Dependencias

```bash
# Desde el directorio deploy/
pip install -r requirements.txt

# O directamente
pip install paramiko
```

## 🔍 Script 1: Diagnóstico (diagnose.py)

Ejecuta un diagnóstico completo del servidor.

### Uso

**Windows (opción 1 - doble clic):**
```
Hacer doble clic en: diagnose.bat
```

**Windows (opción 2 - línea de comandos):**
```cmd
cd deploy
python diagnose.py
```

**Linux/Mac:**
```bash
cd deploy
python3 diagnose.py
```

### ¿Qué hace?

1. ✅ Conecta al servidor vía SSH
2. ✅ Verifica que el proyecto esté instalado
3. ✅ Verifica Docker y Docker Compose
4. ✅ Muestra estado de todos los contenedores
5. ✅ Obtiene últimos logs del backend
6. ✅ Verifica puertos en uso
7. ✅ Muestra uso de disco y memoria
8. ✅ Muestra estadísticas de Docker
9. ✅ Da recomendaciones de solución

### Ejemplo de Salida

```
==================================================
              Diagnóstico Terap-IA
==================================================

Servidor: 147.93.184.62
Hora: 2025-11-06 15:30:45

[1/10] Conectando al servidor...
✓ Conectado a 147.93.184.62

[2/10] Verificando directorio del proyecto...
✓ Directorio existe: /var/www/terap-ia

[3/10] Verificando Docker...
✓ Docker instalado: Docker version 24.0.5

[4/10] Verificando Docker Compose...
✓ Docker Compose v2: Docker Compose version v2.20.2

[5/10] Verificando estado de contenedores...
NAME                IMAGE               STATUS
terapia-backend     terapia_backend     Up 2 hours
terapia-frontend    terapia_frontend    Up 2 hours
terapia-postgres    postgres:16-alpine  Up 2 hours

✓ Backend corriendo
✓ Frontend corriendo
✓ PostgreSQL corriendo

[6/10] Obteniendo logs del backend...
==================================================
Últimos 30 logs del backend:
==================================================
[Nest] 1  - 11/06/2024, 3:30:45 PM     LOG [NestApplication] Nest application successfully started
...

==================================================
              Recomendaciones
==================================================
✓ Todos los servicios están corriendo

URLs del sistema:
  Frontend:  https://terap-ia.victalejo.dev
  API:       https://terap-ia.victalejo.dev/api/v1
  Docs:      https://terap-ia.victalejo.dev/api/docs
```

## 🔄 Script 2: Reiniciar Servicios (restart-services.py)

Reinicia servicios remotamente con opciones interactivas.

### Uso

**Modo Interactivo (recomendado):**
```bash
cd deploy
python restart-services.py
```

Mostrará un menú:
```
==================================================
        Reiniciar Servicios Terap-IA
==================================================

Selecciona una opción:

  1. Reiniciar todos los servicios (rápido)
  2. Reconstruir y reiniciar (completo, tarda más)
  3. Reiniciar solo Backend
  4. Reiniciar solo Frontend
  5. Reiniciar solo PostgreSQL
  0. Salir

Opción:
```

**Modo Línea de Comandos:**
```bash
# Reiniciar todos
python restart-services.py all

# Reconstruir completamente
python restart-services.py rebuild

# Reiniciar servicio específico
python restart-services.py backend
python restart-services.py frontend
python restart-services.py postgres
```

### Opciones Explicadas

#### 1. Reiniciar todos (rápido) - `all`
- Reinicia los 3 servicios
- No reconstruye imágenes
- Duración: ~30 segundos
- Usar cuando: El código no ha cambiado

#### 2. Reconstruir y reiniciar (completo) - `rebuild`
- Detiene servicios
- Reconstruye imágenes desde cero
- Inicia servicios
- Ejecuta migraciones
- Duración: ~3-5 minutos
- Usar cuando: Actualizaste código o dependencias

#### 3-5. Reiniciar servicio específico
- Reinicia solo el servicio seleccionado
- Duración: ~20 segundos
- Usar cuando: Solo un servicio tiene problemas

## 🆘 Flujo de Resolución de Problemas

### Problema: El sitio no carga

1. **Ejecutar diagnóstico:**
   ```bash
   python diagnose.py
   ```

2. **Ver qué servicios están caídos**

3. **Reiniciar servicios:**
   - Si es solo un servicio: Opción 3, 4 o 5
   - Si son todos: Opción 1
   - Si persiste: Opción 2 (reconstruir)

### Problema: Backend devuelve errores 500

1. **Ejecutar diagnóstico y ver logs**
2. **Reiniciar backend:**
   ```bash
   python restart-services.py backend
   ```
3. **Si persiste, reconstruir:**
   ```bash
   python restart-services.py rebuild
   ```

### Problema: Cambios de código no se ven

**Debes reconstruir:**
```bash
python restart-services.py rebuild
```

## 🔐 Configuración de Servidor

Si necesitas cambiar la configuración del servidor, edita estos archivos:

**diagnose.py:**
```python
SERVER_CONFIG = {
    'hostname': '147.93.184.62',
    'username': 'root',
    'password': 'Alejo2026',
    'port': 22,
    'timeout': 10
}
```

**restart-services.py:**
```python
SERVER_CONFIG = {
    'hostname': '147.93.184.62',
    'username': 'root',
    'password': 'Alejo2026',
    'port': 22,
    'timeout': 10
}
```

## 📝 Notas

- Los scripts se conectan vía SSH automáticamente
- No necesitas instalar nada en el servidor
- Los scripts muestran output en tiempo real
- Puedes cancelar con Ctrl+C en cualquier momento
- Los scripts son seguros, no modifican configuración

## 🔍 Troubleshooting

### Error: "ModuleNotFoundError: No module named 'paramiko'"

**Solución:**
```bash
pip install paramiko
```

### Error: "Connection timeout"

**Posibles causas:**
- El servidor está apagado
- Firewall bloqueando puerto 22
- IP incorrecta

**Solución:**
```bash
# Verificar conectividad
ping 147.93.184.62

# Verificar SSH
telnet 147.93.184.62 22
```

### Error: "Authentication failed"

**Solución:**
- Verificar usuario y contraseña en los scripts
- Asegurarse de que el usuario tiene acceso SSH

## 💡 Tips

1. **Ejecuta diagnóstico primero** antes de reiniciar
2. **Guarda los logs** que muestra el diagnóstico para análisis
3. **Usa rebuild solo cuando sea necesario**, es más lento
4. **Si rebuild falla**, conéctate manualmente vía SSH para ver el error

## 🚀 Atajos Rápidos

**Windows - Crear acceso directo:**
1. Clic derecho en escritorio → Nuevo → Acceso directo
2. Ubicación: `python C:\ruta\a\deploy\diagnose.py`
3. Nombrar: "Diagnóstico Terap-IA"

**Linux/Mac - Crear alias:**
```bash
# Agregar a ~/.bashrc o ~/.zshrc
alias terap-diagnose='cd /ruta/a/deploy && python3 diagnose.py'
alias terap-restart='cd /ruta/a/deploy && python3 restart-services.py'

# Usar:
terap-diagnose
terap-restart
```

## 📞 Soporte

Si los scripts no funcionan:
1. Verifica que Python esté instalado: `python --version`
2. Verifica que paramiko esté instalado: `pip show paramiko`
3. Verifica conectividad: `ping 147.93.184.62`
4. Revisa los mensajes de error del script

---

**Última actualización:** 2025-11-06
