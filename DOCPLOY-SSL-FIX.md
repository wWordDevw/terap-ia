# Guía para Solucionar Error SSL en Docploy

## Problema Identificado

**Error:** `ERR_CERT_AUTHORITY_INVALID` al acceder a `terap-ia.victalejo.dev`

**DNS:** ✅ Configurado correctamente (IP: 161.97.147.252)

**Causa:** El certificado SSL no se generó correctamente o está en estado inválido en Docploy.

---

## Solución Paso a Paso

### 1. Verificar Estado del Certificado en Docploy

1. Inicia sesión en tu panel de Docploy
2. Ve a tu proyecto/aplicación
3. Busca la sección de **"Dominios"** o **"Custom Domains"**
4. Verifica el estado del certificado SSL para `terap-ia.victalejo.dev`

**Estados posibles:**
- ✅ **Active/Activo** - El certificado está funcionando
- ⏳ **Pending/Pendiente** - Está esperando validación DNS
- ❌ **Failed/Fallido** - El certificado falló al generarse
- ⚠️ **Expired/Expirado** - El certificado venció

---

### 2. Soluciones según el Estado

#### Si el estado es "Pending" (Pendiente):

El certificado está esperando validación DNS.

**Pasos:**
1. Espera 5-15 minutos (la validación puede tomar tiempo)
2. Verifica que los registros DNS estén propagados globalmente:
   - Usa: https://dnschecker.org
   - Busca: `terap-ia.victalejo.dev`
3. Si después de 30 minutos sigue pendiente, elimina y vuelve a agregar el dominio

#### Si el estado es "Failed" (Fallido):

El certificado no pudo generarse.

**Pasos:**
1. En Docploy, elimina el dominio personalizado
2. Espera 2 minutos
3. Vuelve a agregar el dominio `terap-ia.victalejo.dev`
4. Asegúrate de que los registros DNS apunten correctamente:
   - Tipo: A
   - Host: `terap-ia.victalejo.dev` o `terap-ia`
   - Valor: La IP que te proporciona Docploy
5. Espera a que se genere el nuevo certificado

#### Si el estado es "Expired" (Expirado):

El certificado venció y no se renovó automáticamente.

**Pasos:**
1. Fuerza la renovación del certificado en Docploy (botón "Renew" o "Renovar")
2. Si no hay opción de renovar, elimina y vuelve a agregar el dominio

#### Si no aparece el dominio configurado:

**Pasos:**
1. Ve a la sección de dominios personalizados
2. Agrega el dominio: `terap-ia.victalejo.dev`
3. Configura los registros DNS según las instrucciones de Docploy
4. Habilita SSL/HTTPS automático (debería estar habilitado por defecto)

---

### 3. Verificar Configuración DNS en tu Registrador

Asegúrate de que los registros DNS estén correctos:

**Si Docploy te proporciona una IP:**
```
Tipo: A
Host: terap-ia (o @)
Valor: [IP proporcionada por Docploy]
TTL: 3600 (o automático)
```

**Si Docploy te proporciona un CNAME:**
```
Tipo: CNAME
Host: terap-ia
Valor: [dominio proporcionado por Docploy]
TTL: 3600 (o automático)
```

---

### 4. Actualizar Variables de Entorno en Docploy

En tu proyecto de Docploy, asegúrate de configurar las variables de entorno:

**Para el Frontend:**
```env
NEXT_PUBLIC_API_URL=https://terap-ia.victalejo.dev/api/v1
NODE_ENV=production
PORT=3001
```

**Para el Backend:**
```env
BACKEND_PORT=3100
NODE_ENV=production
DB_HOST=[tu-host-de-postgres]
DB_PORT=5432
DB_USERNAME=[tu-usuario]
DB_PASSWORD=[tu-contraseña]
DB_DATABASE=terapia_db
DB_SSL_ENABLED=true
JWT_SECRET=[tu-jwt-secret-seguro]
GOOGLE_API_KEY=[tu-google-api-key]
```

---

### 5. Verificar el Certificado

Después de que el estado sea "Active", verifica el certificado:

**Opción 1: Navegador**
1. Ve a `https://terap-ia.victalejo.dev`
2. Haz clic en el candado en la barra de direcciones
3. Verifica que el certificado sea válido y emitido por "Let's Encrypt"

**Opción 2: Online**
- Usa: https://www.ssllabs.com/ssltest/
- Analiza: `terap-ia.victalejo.dev`

**Opción 3: Línea de comandos**
```bash
openssl s_client -connect terap-ia.victalejo.dev:443 -servername terap-ia.victalejo.dev
```

---

### 6. Problemas Comunes y Soluciones

#### Problema: "El certificado es para otro dominio"

**Solución:**
- Elimina el dominio en Docploy
- Verifica que estás agregando exactamente `terap-ia.victalejo.dev`
- Vuelve a agregarlo

#### Problema: "HSTS impide el acceso"

**Solución:**
1. En Chrome/Edge: Ve a `chrome://net-internals/#hsts`
2. En la sección "Delete domain security policies"
3. Escribe: `terap-ia.victalejo.dev`
4. Haz clic en "Delete"
5. Cierra y vuelve a abrir el navegador

#### Problema: "La página carga pero con errores 404 en las APIs"

**Solución:**
- Verifica que `NEXT_PUBLIC_API_URL` use HTTPS
- Revisa que el backend esté corriendo en Docploy
- Verifica las rutas del reverse proxy/router en Docploy

---

### 7. Desplegar los Cambios

Después de hacer los cambios en el código:

```bash
# Hacer commit de los cambios
git add .
git commit -m "fix: Configurar HTTPS para producción en Docploy"

# Push al repositorio
git push origin master
```

Docploy debería detectar los cambios y hacer un nuevo deploy automáticamente.

---

## Archivos Modificados

- ✅ `.env.production` - Variables de entorno para producción con HTTPS
- ✅ `terapia-front/next.config.ts` - Dominio agregado a la lista permitida
- ✅ `.env.example` - Actualizado con puerto correcto 3100
- ✅ `docker-compose.yml` - Puerto backend corregido a 3100

---

## Contacto Soporte Docploy

Si los pasos anteriores no funcionan:

1. **Documentación:** https://docs.docploy.io (verifica si existe)
2. **Soporte:** Busca en el panel de Docploy un botón de "Support" o "Help"
3. **Comunidad:** Busca en Discord/Slack de Docploy si tienen

---

## Checklist Final

- [ ] DNS configurado correctamente
- [ ] Dominio agregado en Docploy
- [ ] Certificado SSL en estado "Active"
- [ ] Variables de entorno actualizadas en Docploy
- [ ] Código actualizado y pusheado
- [ ] Deploy completado exitosamente
- [ ] Sitio accesible vía HTTPS
- [ ] APIs respondiendo correctamente

---

**Última actualización:** 2025-01-05
