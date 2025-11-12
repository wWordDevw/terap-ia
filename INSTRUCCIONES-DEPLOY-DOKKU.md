# 🚀 Instrucciones de Despliegue Terap-IA en Dokku

## Parte 1: Configuración en el Servidor Dokku

Conéctate al servidor y ejecuta estos comandos:

```bash
# Conectar al servidor
ssh root@147.93.184.62
```

### 1. Verificar apps existentes
```bash
dokku apps:list
```

Las apps `terap-ia-backend` y `terap-ia-frontend` ya fueron creadas.

---

### 2. Instalar Plugin de PostgreSQL (si no está instalado)
```bash
# Verificar si está instalado
dokku plugin:list | grep postgres

# Si NO está instalado, instalar:
sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres
```

---

### 3. Crear Base de Datos PostgreSQL
```bash
# Crear base de datos
dokku postgres:create terap-ia-db

# Enlazar con el backend
dokku postgres:link terap-ia-db terap-ia-backend

# Verificar enlace
dokku postgres:info terap-ia-db
```

---

### 4. Configurar Variables de Entorno

#### Backend:
```bash
# Generar secretos
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n')
DB_PASSWORD=$(openssl rand -base64 32 | tr -d '\n')

# Configurar variables
dokku config:set terap-ia-backend \
  NODE_ENV=production \
  PORT=3000 \
  JWT_SECRET="$JWT_SECRET" \
  JWT_EXPIRATION=7d \
  JWT_EXPIRES_IN=24h \
  JWT_REFRESH_EXPIRES_IN=7d \
  GOOGLE_API_KEY="AIzaSyAVPeL2lzOh_-56AOFBXJQ7MYs9B07pZGo"

# Verificar variables
dokku config terap-ia-backend
```

#### Frontend:
```bash
dokku config:set terap-ia-frontend \
  NODE_ENV=production \
  PORT=3001 \
  NEXT_PUBLIC_API_URL="https://api.terap-ia.victalejo.dev/api/v1" \
  NEXT_PUBLIC_SITE_URL="https://terap-ia.victalejo.dev" \
  NEXT_TELEMETRY_DISABLED=1

# Verificar variables
dokku config terap-ia-frontend
```

---

### 5. Configurar Dominios

#### Backend:
```bash
dokku domains:clear terap-ia-backend
dokku domains:add terap-ia-backend api.terap-ia.victalejo.dev
dokku domains:report terap-ia-backend
```

#### Frontend:
```bash
dokku domains:clear terap-ia-frontend
dokku domains:add terap-ia-frontend terap-ia.victalejo.dev
dokku domains:report terap-ia-frontend
```

---

### 6. Configurar Volumen Persistente para Documentos
```bash
# Crear directorio
dokku storage:ensure-directory terap-ia-backend-documents

# Montar volumen
dokku storage:mount terap-ia-backend /var/lib/dokku/data/storage/terap-ia-backend-documents:/app/generated-documents

# Verificar
dokku storage:list terap-ia-backend
```

---

### 7. Configurar Nginx (opcional pero recomendado)
```bash
# Aumentar tamaño máximo de archivo
dokku nginx:set terap-ia-backend client-max-body-size 50m
dokku nginx:set terap-ia-frontend client-max-body-size 20m

# Desactivar HSTS temporal (hasta configurar SSL)
dokku nginx:set terap-ia-backend hsts false
dokku nginx:set terap-ia-frontend hsts false
```

---

## Parte 2: Despliegue desde tu Máquina Local

### 1. Dar permisos a los scripts de despliegue
```bash
# En Windows Git Bash o WSL
cd v:\WORDEV\terap-ia

chmod +x deploy-backend.sh
chmod +x deploy-frontend.sh
chmod +x deploy-all.sh
```

### 2. Configurar Git Remotes (automático al ejecutar scripts)

Los scripts ya configuran los remotes automáticamente, pero si quieres hacerlo manualmente:

```bash
# Backend
git remote add dokku-backend dokku@147.93.184.62:terap-ia-backend

# Frontend
git remote add dokku-frontend dokku@147.93.184.62:terap-ia-frontend

# Verificar
git remote -v
```

### 3. Desplegar Backend
```bash
bash ./deploy-backend.sh
```

**Esto puede tomar 5-10 minutos** (build de Docker, instalación de dependencias, migraciones).

### 4. Desplegar Frontend
```bash
bash ./deploy-frontend.sh
```

**Esto puede tomar 5-10 minutos** (build de Next.js standalone).

### 5. Verificar Despliegue
```bash
# Verificar logs del backend
ssh root@147.93.184.62 "dokku logs terap-ia-backend -t"

# Verificar logs del frontend
ssh root@147.93.184.62 "dokku logs terap-ia-frontend -t"

# Ver estado
ssh root@147.93.184.62 "dokku ps:report terap-ia-backend"
ssh root@147.93.184.62 "dokku ps:report terap-ia-frontend"
```

---

## Parte 3: Configurar SSL (Después del Despliegue)

Una vez que el backend y frontend estén desplegados y funcionando:

```bash
# Conectar al servidor
ssh root@147.93.184.62

# Instalar plugin de Let's Encrypt (si no está instalado)
sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git

# Configurar email
dokku letsencrypt:set terap-ia-backend email tu@email.com
dokku letsencrypt:set terap-ia-frontend email tu@email.com

# Habilitar SSL
dokku letsencrypt:enable terap-ia-backend
dokku letsencrypt:enable terap-ia-frontend

# Habilitar auto-renovación
dokku letsencrypt:cron-job --add

# Ahora SÍ habilitar HSTS
dokku nginx:set terap-ia-backend hsts true
dokku nginx:set terap-ia-frontend hsts true
```

---

## Parte 4: Verificación Final

### 1. Verificar que los servicios responden
```bash
# Backend
curl -I https://api.terap-ia.victalejo.dev/api/v1/health

# Frontend
curl -I https://terap-ia.victalejo.dev
```

### 2. Probar en el navegador
- Frontend: https://terap-ia.victalejo.dev
- Backend API: https://api.terap-ia.victalejo.dev/api/v1/health

---

## Parte 5: Configurar CI/CD en GitHub

### 1. Agregar GitHub Secrets

Ve a: https://github.com/TU-USUARIO/terap-ia/settings/secrets/actions

Agrega estos secrets:

- **DOKKU_SSH_PRIVATE_KEY**: Contenido de `~/.ssh/aurora` (clave privada completa)
- **DOKKU_HOST**: `147.93.184.62`
- **DOKKU_BACKEND_APP**: `terap-ia-backend`
- **DOKKU_FRONTEND_APP**: `terap-ia-frontend`

Para obtener la clave privada AURORA:
```bash
cat ~/.ssh/aurora
```

Copia TODO el contenido (desde `-----BEGIN OPENSSH PRIVATE KEY-----` hasta `-----END OPENSSH PRIVATE KEY-----`)

### 2. Verificar Workflow

El workflow en `.github/workflows/deploy-dokku.yml` ya está configurado. Cada vez que hagas push a `main`:
- Si cambias `terapia-notas-backend/`, se desplegará solo el backend
- Si cambias `terapia-front/`, se desplegará solo el frontend
- Si usas "Run workflow" manualmente, desplegará ambos

---

## Comandos Útiles

### Ver logs en tiempo real
```bash
ssh root@147.93.184.62 "dokku logs terap-ia-backend -t"
ssh root@147.93.184.62 "dokku logs terap-ia-frontend -t"
```

### Reiniciar servicios
```bash
ssh root@147.93.184.62 "dokku ps:restart terap-ia-backend"
ssh root@147.93.184.62 "dokku ps:restart terap-ia-frontend"
```

### Ver configuración
```bash
ssh root@147.93.184.62 "dokku config terap-ia-backend"
ssh root@147.93.184.62 "dokku config terap-ia-frontend"
```

### Ejecutar migraciones manualmente
```bash
ssh root@147.93.184.62 "dokku enter terap-ia-backend web bash"
# Dentro del contenedor:
cd database
psql $DATABASE_URL -f 00-init.sql
```

### Ver estado de base de datos
```bash
ssh root@147.93.184.62 "dokku postgres:info terap-ia-db"
ssh root@147.93.184.62 "dokku postgres:list"
```

### Backup de base de datos
```bash
ssh root@147.93.184.62 "dokku postgres:export terap-ia-db > backup-$(date +%Y%m%d).sql"
```

---

## Troubleshooting

### Backend no arranca
```bash
# Ver logs
ssh root@147.93.184.62 "dokku logs terap-ia-backend --tail 100"

# Verificar variables de entorno
ssh root@147.93.184.62 "dokku config terap-ia-backend"

# Reconstruir
ssh root@147.93.184.62 "dokku ps:rebuild terap-ia-backend"
```

### Frontend no conecta al backend
- Verificar que `NEXT_PUBLIC_API_URL` esté correctamente configurado
- Verificar que el backend responda en https://api.terap-ia.victalejo.dev/api/v1/health
- Verificar CORS en el backend

### SSL no funciona
- Asegurarse de que el DNS apunte correctamente al servidor
- Esperar propagación DNS (puede tomar hasta 24 horas)
- Verificar que los puertos 80 y 443 estén abiertos en el firewall

---

## Resumen

1. ✅ Apps creadas: `terap-ia-backend`, `terap-ia-frontend`
2. ✅ Base de datos: PostgreSQL con plugin dokku-postgres
3. ✅ Variables de entorno: Configuradas con secretos generados
4. ✅ Dominios: api.terap-ia.victalejo.dev y terap-ia.victalejo.dev
5. ✅ Scripts de despliegue: deploy-backend.sh, deploy-frontend.sh, deploy-all.sh
6. ✅ CI/CD: GitHub Actions configurado para despliegue automático
7. ⏳ SSL: Configurar después del primer despliegue

**¡Listo para desplegar! 🚀**
