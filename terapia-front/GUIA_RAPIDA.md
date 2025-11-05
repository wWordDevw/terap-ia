# 🚀 Guía Rápida - Sistema de Autenticación

## ✅ Sistema Completado

Se ha implementado un sistema completo de autenticación que incluye:

### 📄 Páginas Creadas

1. **Login** (`/login`)
   - Formulario de inicio de sesión
   - Validación de email y contraseña
   - Opción "Recordarme"
   - Link a recuperación de contraseña
   - Link a registro

2. **Registro** (`/login/register`)
   - Formulario completo de registro
   - Validación de contraseñas (mínimo 8 caracteres, mayúsculas, minúsculas, números)
   - Selección de rol (terapeuta, coordinador, administrador)
   - Campo opcional de teléfono

3. **Recuperación de Contraseña** (`/login/forgot-password`)
   - Formulario para solicitar link de recuperación
   - Confirmación visual de envío de email
   - Instrucciones claras para el usuario

4. **Restablecer Contraseña** (`/login/reset-password?token=xxx`)
   - Validación de token
   - Formulario de nueva contraseña
   - Indicadores visuales de fortaleza de contraseña
   - Confirmación de éxito

## 🎨 Características de Diseño

✨ Todas las páginas siguen la estética del sistema:
- Gradiente de azul claro (blue-50) a blanco
- Logo con ícono de corazón en círculo azul
- Componentes con sombras y bordes redondeados
- Animaciones suaves de transición
- Estados de loading con spinner
- Validaciones inline con mensajes de error
- Diseño responsive y centrado

## 🔐 Sistema de Autenticación

### Contexto Global (`AuthContext`)

Proporciona en toda la aplicación:
- `user`: Objeto con datos del usuario autenticado
- `loading`: Estado de carga
- `isAuthenticated`: Boolean de autenticación
- `login(email, password)`: Función para iniciar sesión
- `register(userData)`: Función para registrar usuario
- `logout()`: Función para cerrar sesión
- `updateUser(data)`: Función para actualizar datos del usuario

### Protección de Rutas

El sistema automáticamente:
- ✅ Redirige a `/login` si no estás autenticado
- ✅ Redirige a `/` si estás autenticado e intentas acceder a login
- ✅ Muestra el AppShell (barra lateral) solo en rutas privadas
- ✅ Oculta el AppShell en páginas de autenticación
- ✅ Muestra loading mientras verifica la autenticación

### Perfil de Usuario en Sidebar

La barra lateral ahora incluye:
- Avatar con inicial del nombre
- Nombre completo del usuario
- Rol del usuario
- Menú desplegable con:
  - Mi Perfil
  - Cerrar Sesión

## 🎯 Cómo Usar

### 1. Para acceder al sistema

```
1. Abre http://localhost:3000
2. Serás redirigido a /login
3. Usa cualquier email y contraseña (mínimo 6 caracteres)
4. O crea una cuenta nueva en "Crear una cuenta"
```

### 2. Para usar autenticación en tus componentes

```tsx
'use client';

import { useAuth } from '@/contexts/auth-context';

export default function MiComponente() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <p>Hola, {user?.nombre}</p>
      <p>Rol: {user?.rol}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}
```

### 3. Para proteger una página específica

```tsx
'use client';

import ProtectedRoute from '@/components/auth/protected-route';

export default function PaginaAdmin() {
  return (
    <ProtectedRoute allowedRoles={['administrador']}>
      <div>Solo administradores pueden ver esto</div>
    </ProtectedRoute>
  );
}
```

## 📁 Archivos Creados/Modificados

### Nuevos Archivos
```
✅ src/app/login/page.tsx
✅ src/app/login/register/page.tsx
✅ src/app/login/forgot-password/page.tsx
✅ src/app/login/reset-password/page.tsx
✅ src/app/login/layout.tsx
✅ src/contexts/auth-context.tsx
✅ src/components/layout/app-shell-wrapper.tsx
✅ src/components/auth/protected-route.tsx
✅ src/hooks/use-auth-redirect.ts
✅ AUTENTICACION.md (documentación completa)
✅ GUIA_RAPIDA.md (este archivo)
```

### Archivos Modificados
```
✅ src/app/layout.tsx (integración de AuthProvider)
✅ src/lib/types.ts (tipo AuthUser agregado)
✅ src/components/layout/navigation.tsx (perfil de usuario)
```

## 🔄 Flujo de Usuario

### Login
```
Usuario → /login → Ingresa credenciales → Validación → 
Guardar token → Redireccionar a /
```

### Registro
```
Usuario → /login/register → Completa formulario → Validación → 
Crear cuenta → Guardar token → Redireccionar a /
```

### Recuperación de Contraseña
```
Usuario → /login → "¿Olvidaste tu contraseña?" → 
Ingresa email → Confirmación de envío → 
Email con link → /login/reset-password?token=xxx → 
Nueva contraseña → Éxito → Redireccionar a /login
```

### Cerrar Sesión
```
Usuario → Clic en avatar en sidebar → "Cerrar Sesión" → 
Limpiar sesión → Redireccionar a /login
```

## 🎨 Componentes UI Usados

- `Input`: Campos de texto con validación
- `Button`: Botones con estados de loading
- Iconos de Lucide React:
  - `LogIn`, `UserPlus`: Acciones de autenticación
  - `Mail`, `Lock`: Formularios
  - `Heart`: Logo del sistema
  - `CheckCircle`: Confirmaciones
  - `AlertCircle`: Errores
  - `ArrowLeft`: Navegación de regreso

## 🚨 Notas Importantes

### ⚠️ Implementación Actual (Demo)

El sistema actual usa:
- **localStorage** para tokens (⚠️ no recomendado para producción)
- **Validación simulada** (sin backend real)
- **Datos mock** (no hay base de datos)

### ✅ Para Producción

Debes implementar:

1. **Backend API** real para:
   - `/api/auth/login`
   - `/api/auth/register`
   - `/api/auth/forgot-password`
   - `/api/auth/reset-password`
   - `/api/auth/refresh-token`

2. **Seguridad**:
   - Tokens JWT con expiración
   - Refresh tokens
   - HTTPS obligatorio
   - Rate limiting
   - Validación del lado del servidor
   - CAPTCHA en registro/login

3. **Base de datos** para:
   - Almacenar usuarios
   - Tokens de recuperación
   - Sesiones activas

4. **Email service** para:
   - Enviar links de recuperación
   - Verificación de email
   - Notificaciones

## 🧪 Testing

Para probar el sistema:

1. **Login**
   - Prueba con email válido e inválido
   - Prueba con contraseña corta (< 6 chars)
   - Prueba el checkbox "Recordarme"
   - Verifica redirección después del login

2. **Registro**
   - Prueba validación de contraseña (8+ chars, mayúsculas, minúsculas, números)
   - Prueba que las contraseñas coincidan
   - Prueba diferentes roles
   - Verifica redirección después del registro

3. **Recuperación**
   - Prueba con email válido
   - Verifica mensaje de confirmación
   - Prueba el link "Intenta de nuevo"

4. **Reset Password**
   - Prueba sin token (debe mostrar error)
   - Prueba con token válido
   - Verifica indicadores de fortaleza
   - Verifica redirección después del reset

5. **Protección de Rutas**
   - Intenta acceder a `/` sin login (debe redirigir a `/login`)
   - Después del login, intenta acceder a `/login` (debe redirigir a `/`)
   - Verifica que el AppShell se muestre/oculte correctamente

6. **Perfil en Sidebar**
   - Verifica que muestre el nombre correcto
   - Verifica que muestre el rol correcto
   - Prueba el menú desplegable
   - Prueba el botón de cerrar sesión

## 📞 Próximos Pasos

Para continuar con el desarrollo:

1. **Implementar backend API**
   - Crear endpoints de autenticación
   - Conectar con base de datos
   - Implementar JWT

2. **Agregar más funcionalidades**
   - Perfil de usuario editable
   - Cambio de contraseña desde perfil
   - Verificación de email
   - 2FA (autenticación de dos factores)

3. **Mejorar seguridad**
   - Implementar refresh tokens
   - Agregar rate limiting
   - Implementar CAPTCHA

4. **Testing**
   - Tests unitarios
   - Tests de integración
   - Tests E2E

## 🎉 ¡Listo para Usar!

El sistema está completamente funcional y listo para usar en desarrollo. Solo necesitas:

```bash
# Iniciar el servidor de desarrollo
npm run dev

# Abrir en el navegador
http://localhost:3000
```

¡El sistema te redirigirá automáticamente a login y podrás empezar a probarlo!

