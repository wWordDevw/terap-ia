# 🚀 Guía de Despliegue - Terap-IA

Documentación completa para el despliegue automatizado de Terap-IA en producción.

## 📋 Tabla de Contenidos

- [Información del Servidor](#información-del-servidor)
- [Requisitos Previos](#requisitos-previos)
- [Configuración Inicial del Servidor](#configuración-inicial-del-servidor)
- [Configuración de GitHub](#configuración-de-github)
- [Despliegue Automático (CI/CD)](#despliegue-automático-cicd)
- [Despliegue Manual](#despliegue-manual)
- [Gestión de Backups](#gestión-de-backups)
- [Monitoreo y Health Checks](#monitoreo-y-health-checks)
- [Notificaciones de WhatsApp](#notificaciones-de-whatsapp)
- [Troubleshooting](#troubleshooting)

---

## 🖥️ Información del Servidor

- **IP:** 147.93.184.62
- **Usuario:** root
- **Dominio:** terap-ia.victalejo.dev
- **Protocolo:** HTTPS con certificado SSL/TLS (Let's Encrypt)

### Puertos

- **22:** SSH
- **80:** HTTP (redirige a HTTPS)
- **443:** HTTPS (Frontend + API)
- **3001:** Frontend (interno Docker)
- **3100:** Backend API (interno Docker)
- **5432:** PostgreSQL (interno Docker, no expuesto)

---

## ✅ Requisitos Previos

### 1. Configuración DNS

Asegúrate de que el dominio apunte al servidor:

```bash
# Verificar DNS
nslookup terap-ia.victalejo.dev
# Debe resolver a: 147.93.184.62
```

Si no apunta correctamente, configura un registro A en tu proveedor DNS:

```
Tipo: A
Nombre: terap-ia.victalejo.dev
Valor: 147.93.184.62
TTL: 3600
```

### 2. Acceso SSH al Servidor

Prueba la conexión SSH:

```bash
ssh root@147.93.184.62
# O con contraseña
sshpass -p 'Alejo2026' ssh root@147.93.184.62
```

### 3. Repositorio Git

Asegúrate de tener acceso al repositorio de GitHub y que esté actualizado.

---

## 🔧 Configuración Inicial del Servidor

### Opción 1: Configuración Automática (Recomendado)

El script `setup-server.sh` configura todo automáticamente:

```bash
# Desde tu máquina local
scp deploy/setup-server.sh root@147.93.184.62:/tmp/

# Conectarse al servidor
ssh root@147.93.184.62

# Editar el script para configurar tu repositorio
nano /tmp/setup-server.sh
# Cambiar: REPO_URL="https://github.com/YOUR_USERNAME/terap-ia.git"
# Cambiar: EMAIL="tu-email@dominio.com"

# Ejecutar el script
bash /tmp/setup-server.sh
```

El script instalará y configurará:
- ✅ Docker y Docker Compose
- ✅ Nginx como reverse proxy
- ✅ Certificado SSL con Let's Encrypt
- ✅ Firewall (UFW)
- ✅ Backups automáticos
- ✅ Variables de entorno
- ✅ Aplicación corriendo

### Opción 2: Configuración Manual

Si prefieres configurar manualmente, sigue estos pasos:

#### 1. Instalar Docker

```bash
# Actualizar sistema
apt-get update && apt-get upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

#### 2. Instalar Nginx y Certbot

```bash
apt-get install -y nginx certbot python3-certbot-nginx
systemctl enable nginx
systemctl start nginx
```

#### 3. Configurar Firewall

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

#### 4. Clonar Repositorio

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/YOUR_USERNAME/terap-ia.git
cd terap-ia
```

#### 5. Configurar Nginx

```bash
cp deploy/nginx-ssl.conf /etc/nginx/sites-available/terap-ia
ln -s /etc/nginx/sites-available/terap-ia /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Editar temporalmente para obtener SSL
nano /etc/nginx/sites-available/terap-ia
# Comentar las líneas de ssl_certificate

nginx -t
systemctl reload nginx
```

#### 6. Obtener Certificado SSL

```bash
certbot --nginx -d terap-ia.victalejo.dev --email tu-email@dominio.com --agree-tos --non-interactive --redirect

# Restaurar configuración completa
cp deploy/nginx-ssl.conf /etc/nginx/sites-available/terap-ia
systemctl reload nginx
```

#### 7. Configurar Variables de Entorno

```bash
cd /var/www/terap-ia
cp .env.production .env

# Editar con valores seguros
nano .env
```

Cambiar obligatoriamente:
- `DB_PASSWORD` - Contraseña segura para PostgreSQL
- `JWT_SECRET` - Secreto para JWT (mínimo 64 caracteres)
- `GOOGLE_API_KEY` - Tu API key de Google Gemini

Generar secretos seguros:
```bash
openssl rand -base64 64
```

#### 8. Iniciar Aplicación

```bash
docker-compose build
docker-compose up -d

# Ver logs
docker-compose logs -f
```

---

## ⚙️ Configuración de GitHub

### 1. Configurar GitHub Secrets

Ve a tu repositorio → Settings → Secrets and variables → Actions → New repository secret

Crea los siguientes secrets:

| Secret Name | Valor | Descripción |
|-------------|-------|-------------|
| `SSH_HOST` | `147.93.184.62` | IP del servidor |
| `SSH_USER` | `root` | Usuario SSH |
| `SSH_PASSWORD` | `Alejo2026` | Contraseña SSH |
| `SSH_PRIVATE_KEY` | (opcional) | Clave privada SSH si prefieres usarla |
| `DB_PASSWORD` | Tu contraseña de DB | Contraseña de PostgreSQL |
| `JWT_SECRET` | Tu secreto JWT | Secreto para tokens JWT |
| `GOOGLE_API_KEY` | Tu API Key | Google Gemini API Key |
| `WHATSAPP_API_URL` | `https://wapi.iaportafolio.com/api/sendText` | URL API WhatsApp |
| `WHATSAPP_API_KEY` | `ZR1UZEUaANUd2UUke3ZTbdFtCrXEwQV7` | API Key de WhatsApp |
| `WHATSAPP_CHAT_ID` | `120363403770897835@g.us` | ID del grupo WhatsApp |
| `WHATSAPP_SESSION` | `victalejo` | Sesión de WhatsApp |

### 2. Verificar Workflow

El workflow está en [.github/workflows/deploy.yml](../.github/workflows/deploy.yml).

Se ejecuta automáticamente cuando:
- ✅ Haces push a la rama `master`
- ✅ Creas un pull request
- ✅ Lo ejecutas manualmente desde GitHub Actions

---

## 🤖 Despliegue Automático (CI/CD)

### Despliegue desde GitHub Actions

El despliegue se ejecuta automáticamente al hacer push a `master`:

```bash
git add .
git commit -m "feat: Nueva funcionalidad"
git push origin master
```

### Despliegue Manual desde GitHub

1. Ve a tu repositorio en GitHub
2. Click en "Actions"
3. Selecciona "Deploy to Production"
4. Click en "Run workflow"
5. Selecciona la rama (master)
6. Click en "Run workflow"

### Flujo del Despliegue Automático

1. **Build y Test** - Compila backend y frontend, ejecuta tests
2. **Notificación Inicio** - Envía mensaje a WhatsApp indicando inicio
3. **Backup** - Crea backup de la base de datos
4. **Despliegue** - Actualiza código, reconstruye contenedores, reinicia servicios
5. **Migraciones Automáticas** - El backend ejecuta migraciones al iniciar
6. **Verificación de Logs** - Muestra logs del backend para confirmar inicio correcto
7. **Health Check** - Verifica que todos los servicios estén funcionando
8. **Limpieza** - Elimina recursos Docker no utilizados
9. **Notificación Final** - Envía mensaje de éxito o error

### Notificaciones

Recibirás notificaciones de WhatsApp en cada etapa:
- 🚀 Inicio de despliegue
- ✅ Despliegue exitoso con URL y duración
- ❌ Error en despliegue con detalles
- 📊 Reporte de monitoreo post-despliegue

---

## 🛠️ Despliegue Manual

### Desde tu Máquina Local

```bash
# Opción 1: Usando el script deploy.sh
export SSH_HOST=147.93.184.62
export SSH_USER=root
export SSH_PASSWORD='Alejo2026'
export DEPLOY_PATH=/var/www/terap-ia
export DOMAIN=terap-ia.victalejo.dev

bash deploy/deploy.sh

# Opción 2: SSH directo
ssh root@147.93.184.62
cd /var/www/terap-ia
git pull origin master
docker-compose down
docker-compose build --no-cache
docker-compose up -d
bash deploy/health-check.sh
```

### Desde el Servidor

```bash
ssh root@147.93.184.62
cd /var/www/terap-ia

# Actualizar código
git pull origin master

# Reiniciar servicios
docker-compose down
docker-compose build
docker-compose up -d

# Verificar estado
docker-compose ps
docker-compose logs -f
```

---

## 🗄️ Gestión de Migraciones de Base de Datos

### Migraciones Automáticas

⚡ **Las migraciones se ejecutan automáticamente cuando el backend inicia.** No necesitas hacer nada manualmente.

El backend tiene un entrypoint que:
1. Espera a que PostgreSQL esté listo
2. Crea la base de datos si no existe
3. Ejecuta todas las migraciones (schema, views, triggers)
4. Inicia la aplicación NestJS

### Ejecutar Migraciones Manualmente (Opcional)

Si necesitas ejecutar migraciones manualmente por alguna razón:

```bash
# Opción 1: Usando el script del deploy
cd /var/www/terap-ia
bash deploy/run-migrations.sh

# Opción 2: Directamente en el contenedor
docker exec -it terapia-postgres psql -U postgres -d terapia_db -f terapia-notas-backend/database/schema.sql
```

### Ver Estado de la Base de Datos

```bash
# Conectarse a PostgreSQL
docker exec -it terapia-postgres psql -U postgres -d terapia_db

# Listar tablas
\dt

# Ver estructura de una tabla
\d nombre_tabla

# Salir
\q
```

### Solucionar Errores 500 de Base de Datos

Si el backend devuelve errores 500, probablemente es un problema de migración:

```bash
# 1. Ver logs del backend para identificar el error
bash deploy/view-logs.sh backend
# Los logs mostrarán si las migraciones se ejecutaron correctamente

# 2. Si las migraciones fallaron, reiniciar el backend para reintentarlas
docker-compose restart backend

# 3. Verificar logs nuevamente para ver si se solucionó
bash deploy/view-logs.sh follow

# 4. Si persiste el problema, ejecutar migraciones manualmente
bash deploy/run-migrations.sh
docker-compose restart backend
```

---

## 💾 Gestión de Backups

### Crear Backup Manual

```bash
# Desde el servidor
cd /var/www/terap-ia
bash deploy/backup-db.sh backup
```

### Listar Backups Disponibles

```bash
bash deploy/backup-db.sh list
```

### Restaurar Backup

```bash
# Listar backups primero
bash deploy/backup-db.sh list

# Restaurar un backup específico
bash deploy/backup-db.sh restore backup_terapia_db_20240101_120000.sql.gz
```

### Backups Automáticos

Los backups se ejecutan automáticamente:
- ⏰ Cada día a las 2:00 AM (configurado en cron)
- 💾 Antes de cada despliegue (GitHub Actions)
- 📁 Se guardan en `/var/backups/terap-ia/`
- 🗑️ Se eliminan automáticamente después de 30 días

### Verificar Cron de Backups

```bash
crontab -l | grep backup
# Debe mostrar: 0 2 * * * cd /var/www/terap-ia && bash deploy/backup-db.sh backup
```

---

## 🏥 Monitoreo y Health Checks

### Ejecutar Health Check Completo

```bash
cd /var/www/terap-ia
bash deploy/health-check.sh check
```

### Checks Individuales

```bash
# Verificar contenedores Docker
bash deploy/health-check.sh docker

# Verificar PostgreSQL
bash deploy/health-check.sh postgres

# Verificar Backend API
bash deploy/health-check.sh backend

# Verificar Frontend
bash deploy/health-check.sh frontend

# Verificar Nginx
bash deploy/health-check.sh nginx

# Verificar SSL
bash deploy/health-check.sh ssl

# Verificar recursos del sistema
bash deploy/health-check.sh system
```

### Ver Logs

```bash
# Usar el script view-logs.sh (recomendado)
bash deploy/view-logs.sh backend      # Ver logs del backend
bash deploy/view-logs.sh frontend     # Ver logs del frontend
bash deploy/view-logs.sh postgres     # Ver logs de la base de datos
bash deploy/view-logs.sh all          # Ver logs de todos los servicios
bash deploy/view-logs.sh follow       # Seguir logs del backend en tiempo real

# O usar docker-compose directamente
docker-compose logs -f                # Todos los servicios
docker-compose logs -f backend        # Solo backend
docker-compose logs -f frontend       # Solo frontend
docker-compose logs -f postgres       # Solo PostgreSQL

# Logs de Nginx
tail -f /var/log/nginx/terap-ia-access.log
tail -f /var/log/nginx/terap-ia-error.log
```

### Comandos Útiles

```bash
# Ver estado de contenedores
docker-compose ps

# Ver uso de recursos
docker stats

# Ver espacio en disco
df -h

# Ver uso de memoria
free -h

# Reiniciar un servicio específico
docker-compose restart backend
docker-compose restart frontend
docker-compose restart postgres
```

---

## 📱 Notificaciones de WhatsApp

### Enviar Notificación Personalizada

```bash
cd /var/www/terap-ia
source deploy/notify-whatsapp.sh

# Mensaje personalizado
send_whatsapp_message "Tu mensaje aquí"

# O usar desde línea de comandos
bash deploy/notify-whatsapp.sh custom "Tu mensaje aquí"
```

### Tipos de Notificaciones Disponibles

```bash
# Inicio de despliegue
bash deploy/notify-whatsapp.sh deploy-start production abc123 master

# Despliegue exitoso
bash deploy/notify-whatsapp.sh deploy-success production "2m 30s" https://terap-ia.victalejo.dev

# Despliegue fallido
bash deploy/notify-whatsapp.sh deploy-failure production "Error de build" build

# Backup exitoso
bash deploy/notify-whatsapp.sh backup-success backup-2024-01-01.sql 150MB

# Backup fallido
bash deploy/notify-whatsapp.sh backup-failure "Disco lleno"

# Health check fallido
bash deploy/notify-whatsapp.sh healthcheck-failure backend "Connection refused"
```

---

## 🔧 Troubleshooting

### Problema: Contenedores no inician

```bash
# Ver logs de error
docker-compose logs

# Verificar variables de entorno
cat .env

# Verificar puertos
netstat -tulpn | grep -E '3001|3100|5432'

# Reiniciar todo
docker-compose down
docker-compose up -d
```

### Problema: Base de datos no conecta

```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps postgres

# Ver logs de PostgreSQL
docker-compose logs postgres

# Probar conexión
docker exec -it $(docker-compose ps -q postgres) psql -U postgres -d terapia_db
```

### Problema: SSL no funciona

```bash
# Verificar certificado
certbot certificates

# Renovar certificado
certbot renew --dry-run

# Renovar forzado
certbot renew --force-renewal

# Verificar configuración de Nginx
nginx -t

# Recargar Nginx
systemctl reload nginx
```

### Problema: Backend devuelve 502

```bash
# Verificar que backend está corriendo
docker-compose ps backend

# Ver logs del backend
docker-compose logs backend

# Verificar puerto interno
docker exec $(docker-compose ps -q backend) netstat -tulpn | grep 3000

# Reiniciar backend
docker-compose restart backend
```

### Problema: Despliegue falla en GitHub Actions

1. Revisa los logs en GitHub Actions
2. Verifica que todos los secrets estén configurados
3. Verifica conectividad SSH al servidor
4. Ejecuta el despliegue manual para identificar el problema

```bash
# Probar SSH desde Actions
ssh -o StrictHostKeyChecking=no root@147.93.184.62 'echo "SSH OK"'
```

### Problema: Sin espacio en disco

```bash
# Ver espacio disponible
df -h

# Limpiar imágenes Docker antiguas
docker system prune -a --volumes -f

# Limpiar backups antiguos
bash deploy/backup-db.sh cleanup

# Limpiar logs
truncate -s 0 /var/log/nginx/*.log
```

### Problema: Alta carga de CPU/Memoria

```bash
# Ver procesos
htop
docker stats

# Reiniciar servicios con límites
docker-compose down
# Editar docker-compose.yml para agregar límites de recursos
docker-compose up -d
```

---

## 📚 Recursos Adicionales

### URLs Importantes

- **Frontend:** https://terap-ia.victalejo.dev
- **Backend API:** https://terap-ia.victalejo.dev/api/v1
- **Swagger Docs:** https://terap-ia.victalejo.dev/api/docs
- **GitHub Actions:** https://github.com/YOUR_USERNAME/terap-ia/actions

### Archivos de Configuración

- [docker-compose.yml](../docker-compose.yml) - Orquestación de contenedores
- [nginx-ssl.conf](nginx-ssl.conf) - Configuración Nginx con SSL
- [.env.production](../.env.production) - Variables de entorno de producción
- [deploy.yml](../.github/workflows/deploy.yml) - GitHub Actions workflow

### Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| [setup-server.sh](setup-server.sh) | Configuración inicial del servidor |
| [deploy.sh](deploy.sh) | Despliegue automático vía SSH |
| [backup-db.sh](backup-db.sh) | Gestión de backups de PostgreSQL |
| [health-check.sh](health-check.sh) | Verificación de servicios |
| [notify-whatsapp.sh](notify-whatsapp.sh) | Envío de notificaciones |
| [run-migrations.sh](run-migrations.sh) | Ejecutar migraciones de base de datos |
| [view-logs.sh](view-logs.sh) | Ver logs de los servicios |

---

## 🆘 Soporte

Si tienes problemas con el despliegue:

1. Revisa esta documentación
2. Ejecuta los health checks
3. Revisa los logs de los servicios
4. Verifica las notificaciones de WhatsApp
5. Revisa los logs de GitHub Actions

---

## ✅ Checklist de Despliegue

Antes de hacer tu primer despliegue, verifica:

- [ ] DNS apunta al servidor (147.93.184.62)
- [ ] Acceso SSH al servidor funcionando
- [ ] Docker y Docker Compose instalados
- [ ] Nginx instalado y configurado
- [ ] Certificado SSL obtenido
- [ ] Variables de entorno configuradas (.env)
- [ ] Secrets de GitHub configurados
- [ ] Repositorio actualizado
- [ ] Backup automático configurado
- [ ] Notificaciones de WhatsApp funcionando

---

**Última actualización:** 2024
**Versión:** 1.0.0
