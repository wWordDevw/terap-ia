# 🚀 Inicio Rápido - Sistema de Autenticación

## ✅ ¡Todo Listo!

El sistema de autenticación está completamente implementado y listo para usar.

---

## 🎯 Pasos para Empezar

### 1️⃣ Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

### 2️⃣ Abrir en el Navegador

```
http://localhost:3000
```

### 3️⃣ Serás Redirigido Automáticamente

El sistema te redirigirá a `/login` automáticamente.

---

## 🔐 Credenciales para Probar

### Opción 1: Usa Cualquier Email
```
Email: test@example.com
Contraseña: password123
```

### Opción 2: Crea una Cuenta Nueva
1. Click en "Crear una cuenta"
2. Completa el formulario
3. Usa una contraseña con:
   - Mínimo 8 caracteres
   - Al menos una mayúscula
   - Al menos una minúscula
   - Al menos un número

**Ejemplo de contraseña válida:** `MiPass123`

---

## 📋 ¿Qué Puedes Probar?

### ✅ Login
- Validación de email
- Validación de contraseña
- Mensajes de error
- Estado de loading
- Redirección después del login

### ✅ Registro
- Validación de todos los campos
- Contraseñas seguras
- Confirmación de contraseña
- Selección de rol
- Redirección después del registro

### ✅ Recuperación de Contraseña
- Solicitar link de recuperación
- Confirmación de envío de email
- Instrucciones claras

### ✅ Restablecer Contraseña
- Validación de token (prueba con: `/login/reset-password?token=test123`)
- Nueva contraseña
- Indicadores de fortaleza en tiempo real
- Confirmación de éxito

### ✅ Navegación
- Intenta acceder a `/` sin login (te redirige a login)
- Después del login, intenta acceder a `/login` (te redirige a /)
- Verifica que la barra lateral aparezca solo cuando estás autenticado

### ✅ Perfil de Usuario
- Click en tu avatar en la barra lateral
- Verifica tu nombre y rol
- Prueba "Cerrar Sesión"
- Verifica que te redirige a login

---

## 🎨 Páginas Disponibles

| URL | Descripción |
|-----|-------------|
| `/login` | Página de inicio de sesión |
| `/login/register` | Página de registro |
| `/login/forgot-password` | Recuperación de contraseña |
| `/login/reset-password?token=xxx` | Restablecer contraseña |
| `/` | Dashboard (requiere login) |
| `/grupos` | Grupos (requiere login) |
| `/pacientes` | Pacientes (requiere login) |

---

## 🔄 Flujo Típico

```
1. Visita localhost:3000
   ↓
2. Redirigido a /login
   ↓
3. Ingresa credenciales o crea cuenta
   ↓
4. Redirigido a /
   ↓
5. Navega por el sistema
   ↓
6. Click en avatar → Cerrar sesión
   ↓
7. Redirigido a /login
```

---

## 💡 Tips

### Desarrollo
- Usa el email `admin@test.com` con cualquier contraseña para simular un administrador
- Los datos se guardan en localStorage de tu navegador
- Para "resetear" todo: abre DevTools → Application → Clear storage

### Pruebas
- Abre dos navegadores diferentes para probar múltiples sesiones
- Usa modo incógnito para pruebas limpias
- Prueba en dispositivos móviles (responsive)

### Depuración
- Abre DevTools → Console para ver errores
- Abre DevTools → Application → Local Storage para ver los datos guardados
- Verifica que `auth_token` y `user` estén guardados después del login

---

## 📚 Documentación Completa

Para más información, consulta:

- **`RESUMEN_IMPLEMENTACION.md`** - Vista general completa del sistema
- **`AUTENTICACION.md`** - Documentación técnica detallada
- **`GUIA_RAPIDA.md`** - Guía de uso y ejemplos de código
- **`src/app/login/demo-credentials.md`** - Credenciales de ejemplo

---

## 🐛 Problemas Comunes

### El login no funciona
- ✅ Verifica que usas un email válido (formato correcto)
- ✅ Verifica que la contraseña tiene mínimo 6 caracteres

### No me redirige después del login
- ✅ Verifica la consola para errores
- ✅ Recarga la página
- ✅ Limpia el localStorage

### El AppShell (sidebar) no aparece
- ✅ Verifica que estás en una ruta privada (/, /grupos, /pacientes)
- ✅ Verifica que estás autenticado (revisa localStorage)
- ✅ Recarga la página

### Se cerró mi sesión automáticamente
- ✅ Es normal si limpiaste el localStorage
- ✅ Vuelve a iniciar sesión

---

## ✨ Características Destacadas

### 🎨 Diseño Moderno
- Gradiente azul profesional
- Animaciones suaves
- Iconos intuitivos
- Responsive en todos los dispositivos

### 🔒 Validaciones Robustas
- Email válido requerido
- Contraseñas seguras
- Mensajes de error claros
- Feedback instantáneo

### ⚡ Experiencia Fluida
- Estados de loading
- Redirecciones automáticas
- Persistencia de sesión
- Sin parpadeos ni recargas

### 🎯 Protección de Rutas
- Redirección automática
- Manejo de permisos
- Estados de loading

---

## 🎉 ¡Disfruta!

El sistema está completamente funcional y listo para usar.

```bash
# Paso 1: Iniciar servidor
npm run dev

# Paso 2: Abrir navegador
# http://localhost:3000

# Paso 3: ¡Disfrutar! 🎉
```

---

**¿Necesitas ayuda?**  
Consulta la documentación completa en los archivos MD incluidos.

**¿Listo para producción?**  
Lee `AUTENTICACION.md` sección "Para Producción" para los siguientes pasos.

