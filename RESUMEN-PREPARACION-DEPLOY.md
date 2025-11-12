# ✅ Resumen: Preparación de Terap-IA para Despliegue en Dokku

## 🎯 Arquitectura Implementada

**Apps Separadas en Dokku** (recomendación seguida):
- ✅ **terap-ia-backend**: NestJS + PostgreSQL
- ✅ **terap-ia-frontend**: Next.js 15 standalone
- ✅ **terap-ia-db**: PostgreSQL 16 (plugin dokku-postgres)

**Dominios configurados:**
- Frontend: `https://terap-ia.victalejo.dev`
- Backend API: `https://api.terap-ia.victalejo.dev`

---

## 📝 Archivos Creados/Modificados

### 1. **Configuración de Next.js** ✅
**Archivo:** [`terapia-front/next.config.ts`](terapia-front/next.config.ts)

**Cambio principal:**
- Ajustado para soportar apps separadas en Dokku
- Rewrites deshabilitados en producción (apps sin red compartida)
- Frontend llama directamente a API pública usando `NEXT_PUBLIC_API_URL`

```typescript
// Producción Dokku: Sin rewrites (apps separadas)
// Desarrollo: Rewrites a localhost:3100
if (process.env.NODE_ENV === 'production' && !useDockerCompose) {
  return []; // Sin rewrite en Dokku
}
```

---

### 2. **Scripts de Despliegue Local** ✅

#### [`deploy-backend.sh`](deploy-backend.sh)
- Despliega solo el backend usando `git subtree`
- Usa clave SSH AURORA (`~/.ssh/aurora`)
- Maneja errores con fallback a force push
- Muestra comandos útiles post-despliegue

#### [`deploy-frontend.sh`](deploy-frontend.sh)
- Despliega solo el frontend usando `git subtree`
- Configuración idéntica al backend
- Independiente del backend

#### [`deploy-all.sh`](deploy-all.sh)
- Ejecuta ambos scripts en secuencia
- Resumen final con URLs

**Uso:**
```bash
bash ./deploy-backend.sh   # Solo backend
bash ./deploy-frontend.sh  # Solo frontend
bash ./deploy-all.sh       # Ambos
```

---

### 3. **GitHub Actions CI/CD** ✅

**Archivo:** [`.github/workflows/deploy-dokku.yml`](.github/workflows/deploy-dokku.yml)

**Características:**
- ✅ **Deploy selectivo**: Detecta cambios en `terapia-front/` o `terapia-notas-backend/`
- ✅ **Parallel jobs**: Backend y frontend se despliegan en paralelo si ambos cambiaron
- ✅ **Verificación automática**: Healthchecks post-deploy
- ✅ **Force push fallback**: Si git subtree falla
- ✅ **Clave SSH AURORA**: Usa `DOKKU_SSH_PRIVATE_KEY` secret

**Trigger:**
- Push a `main` o `master`
- Cambios en carpetas `terapia-front/` o `terapia-notas-backend/`
- Manual: "Run workflow"

**GitHub Secrets necesarios:**
- `DOKKU_SSH_PRIVATE_KEY`: Contenido de `~/.ssh/aurora`
- `DOKKU_HOST`: `147.93.184.62`
- `DOKKU_BACKEND_APP`: `terap-ia-backend`
- `DOKKU_FRONTEND_APP`: `terap-ia-frontend`

---

### 4. **Script de Configuración del Servidor** ✅

**Archivo:** [`deploy/setup-dokku-apps.sh`](deploy/setup-dokku-apps.sh)

**Ejecuta automáticamente:**
1. Genera JWT_SECRET y DB_PASSWORD seguros (openssl)
2. Instala plugin dokku-postgres (si no existe)
3. Crea base de datos PostgreSQL
4. Enlaza BD con backend
5. Configura variables de entorno (backend y frontend)
6. Configura dominios
7. Crea volumen persistente para documentos
8. Habilita soporte WebSocket
9. Configura límites de Nginx

**Para ejecutar:**
```bash
# Copiar al servidor y ejecutar
scp deploy/setup-dokku-apps.sh root@147.93.184.62:/tmp/
ssh root@147.93.184.62 "bash /tmp/setup-dokku-apps.sh"
```

---

### 5. **Instrucciones de Despliegue Manual** ✅

**Archivo:** [`INSTRUCCIONES-DEPLOY-DOKKU.md`](INSTRUCCIONES-DEPLOY-DOKKU.md)

**Contiene:**
- Comandos paso a paso para configurar el servidor
- Instrucciones de despliegue local
- Configuración de SSL/HTTPS
- Setup de CI/CD en GitHub
- Comandos útiles de troubleshooting
- Guía completa de principio a fin

---

## 🔧 Variables de Entorno Configuradas

### Backend (terap-ia-backend):
```bash
NODE_ENV=production
PORT=3000
JWT_SECRET=[GENERADO_64_BYTES]
JWT_EXPIRATION=7d
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
GOOGLE_API_KEY=AIzaSyAVPeL2lzOh_-56AOFBXJQ7MYs9B07pZGo
DATABASE_URL=[AUTO_GENERADO_POR_DOKKU_POSTGRES]
```

### Frontend (terap-ia-frontend):
```bash
NODE_ENV=production
PORT=3001
NEXT_PUBLIC_API_URL=https://api.terap-ia.victalejo.dev/api/v1
NEXT_PUBLIC_SITE_URL=https://terap-ia.victalejo.dev
NEXT_TELEMETRY_DISABLED=1
```

---

## 📦 Configuración de PostgreSQL

- **Plugin**: dokku-postgres
- **Versión**: PostgreSQL 16
- **Base de datos**: terap-ia-db
- **Enlace**: Automático con backend (variable `DATABASE_URL`)
- **Migraciones**: Automáticas en cada deploy (ejecutadas por `docker-entrypoint.sh`)
- **Volumen**: Persistente automático por Dokku

---

## 🗂️ Volumen Persistente

**Documentos generados (Word .docx):**
- Host: `/var/lib/dokku/data/storage/terap-ia-backend-documents`
- Contenedor: `/app/generated-documents`
- Montado en: `terap-ia-backend`

---

## 🌐 Configuración de Dominios y SSL

### DNS (ya configurado):
```
terap-ia.victalejo.dev → 147.93.184.62
api.terap-ia.victalejo.dev → 147.93.184.62
```

### SSL/HTTPS:
- Let's Encrypt (gratuito, auto-renovación)
- Configurar DESPUÉS del primer despliegue
- Comandos en [`INSTRUCCIONES-DEPLOY-DOKKU.md`](INSTRUCCIONES-DEPLOY-DOKKU.md#parte-3-configurar-ssl)

---

## 🚀 Flujo de Despliegue

### Primera vez (Manual):
1. **Servidor**: Ejecutar comandos de configuración (ver instrucciones)
2. **Local**: `bash ./deploy-backend.sh` (5-10 min)
3. **Local**: `bash ./deploy-frontend.sh` (5-10 min)
4. **Servidor**: Configurar SSL con Let's Encrypt
5. **GitHub**: Configurar secrets para CI/CD

### Despliegues posteriores (Automático):
1. Hacer cambios en código
2. Commit y push a `main`
3. GitHub Actions despliega automáticamente solo lo que cambió
4. ✅ Listo

---

## ✅ Checklist de Estado

### Preparación del Código:
- ✅ Next.js configurado para apps separadas
- ✅ Dockerfiles optimizados (multi-stage)
- ✅ Migraciones automáticas habilitadas
- ✅ Scripts de despliegue creados
- ✅ GitHub Actions workflow configurado
- ✅ Documentación completa

### Configuración del Servidor:
- ✅ Apps creadas en Dokku
- ⏳ PostgreSQL plugin instalado (script preparado)
- ⏳ Base de datos creada y enlazada
- ⏳ Variables de entorno configuradas
- ⏳ Dominios configurados
- ⏳ Volumen persistente creado

### Despliegue:
- ⏳ Backend desplegado
- ⏳ Frontend desplegado
- ⏳ SSL/HTTPS habilitado
- ⏳ Aplicación verificada

### CI/CD:
- ✅ Workflow configurado
- ⏳ GitHub secrets configurados
- ⏳ Deploy automático probado

---

## 📊 Próximos Pasos (En Orden)

### 1. Configurar el Servidor ⏳
Ejecuta los comandos en [`INSTRUCCIONES-DEPLOY-DOKKU.md`](INSTRUCCIONES-DEPLOY-DOKKU.md) Parte 1.

O ejecuta el script automático:
```bash
scp deploy/setup-dokku-apps.sh root@147.93.184.62:/tmp/
ssh root@147.93.184.62 "bash /tmp/setup-dokku-apps.sh"
```

**Tiempo estimado**: 5-10 minutos

---

### 2. Desplegar Backend y Frontend ⏳
```bash
# Dar permisos (solo primera vez)
chmod +x deploy-backend.sh deploy-frontend.sh deploy-all.sh

# Desplegar ambos
bash ./deploy-all.sh
```

**Tiempo estimado**: 10-15 minutos total

---

### 3. Verificar Despliegue ⏳
```bash
# Ver logs
ssh root@147.93.184.62 "dokku logs terap-ia-backend -t"
ssh root@147.93.184.62 "dokku logs terap-ia-frontend -t"

# Probar endpoints
curl https://api.terap-ia.victalejo.dev/api/v1/health
curl https://terap-ia.victalejo.dev
```

---

### 4. Configurar SSL ⏳
```bash
ssh root@147.93.184.62

# Instalar plugin
sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git

# Habilitar SSL
dokku letsencrypt:set terap-ia-backend email tu@email.com
dokku letsencrypt:enable terap-ia-backend

dokku letsencrypt:set terap-ia-frontend email tu@email.com
dokku letsencrypt:enable terap-ia-frontend

# Auto-renovación
dokku letsencrypt:cron-job --add
```

**Tiempo estimado**: 2-3 minutos

---

### 5. Configurar GitHub Actions ⏳
1. Ve a https://github.com/TU-USUARIO/terap-ia/settings/secrets/actions
2. Agrega secrets:
   - `DOKKU_SSH_PRIVATE_KEY`: Contenido de `cat ~/.ssh/aurora`
   - `DOKKU_HOST`: `147.93.184.62`
   - `DOKKU_BACKEND_APP`: `terap-ia-backend`
   - `DOKKU_FRONTEND_APP`: `terap-ia-frontend`

**Tiempo estimado**: 2 minutos

---

## 📚 Documentación de Referencia

1. **Guía Universal de Dokku**: [DOKKU-UNIVERSAL-GUIDE.md](DOKKU-UNIVERSAL-GUIDE.md)
2. **Instrucciones de Despliegue**: [INSTRUCCIONES-DEPLOY-DOKKU.md](INSTRUCCIONES-DEPLOY-DOKKU.md)
3. **Este resumen**: [RESUMEN-PREPARACION-DEPLOY.md](RESUMEN-PREPARACION-DEPLOY.md)

---

## 🔍 Archivos Importantes Creados

```
terap-ia/
├── .github/
│   └── workflows/
│       └── deploy-dokku.yml          ← CI/CD automático ✅
├── deploy/
│   ├── setup-dokku-apps.sh           ← Setup servidor ✅
│   └── [60+ scripts existentes]
├── terapia-front/
│   ├── next.config.ts                ← Ajustado para Dokku ✅
│   ├── Dockerfile                    ← Listo (ya existía) ✅
│   └── ...
├── terapia-notas-backend/
│   ├── Dockerfile                    ← Listo (ya existía) ✅
│   ├── docker-entrypoint.sh          ← Migraciones auto ✅
│   └── ...
├── deploy-backend.sh                 ← Script deploy ✅
├── deploy-frontend.sh                ← Script deploy ✅
├── deploy-all.sh                     ← Script deploy ✅
├── INSTRUCCIONES-DEPLOY-DOKKU.md     ← Guía paso a paso ✅
├── RESUMEN-PREPARACION-DEPLOY.md     ← Este archivo ✅
└── DOKKU-UNIVERSAL-GUIDE.md          ← Referencia ✅
```

---

## 💡 Notas Importantes

1. **Clave SSH AURORA**: Todos los scripts usan `~/.ssh/aurora` automáticamente
2. **Git subtree**: Permite desplegar subcarpetas independientemente
3. **Migraciones**: Se ejecutan automáticamente al iniciar el backend
4. **PostgreSQL**: Gestionado por plugin de Dokku (backups, snapshots fáciles)
5. **WebSockets**: Soportado nativamente en Nginx de Dokku
6. **Documentos**: Persistentes en volumen montado

---

## 🎉 Resultado Final Esperado

Después de completar todos los pasos:

✅ Backend en: `https://api.terap-ia.victalejo.dev`
✅ Frontend en: `https://terap-ia.victalejo.dev`
✅ Base de datos PostgreSQL funcionando
✅ SSL/HTTPS configurado y auto-renovable
✅ CI/CD automático en cada push
✅ Documentos persistentes en volumen
✅ Migraciones automáticas en cada deploy

**¡Listo para producción! 🚀**

---

## 📞 Soporte

Si algo falla:
1. Ver logs: `dokku logs <app-name> -t`
2. Ver estado: `dokku ps:report <app-name>`
3. Consultar troubleshooting en [`INSTRUCCIONES-DEPLOY-DOKKU.md`](INSTRUCCIONES-DEPLOY-DOKKU.md#troubleshooting)
4. Revisar [`DOKKU-UNIVERSAL-GUIDE.md`](DOKKU-UNIVERSAL-GUIDE.md)

---

**Generado automáticamente por Claude Code**
**Fecha**: 2025-11-12
