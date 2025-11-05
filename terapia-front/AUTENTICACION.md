# Sistema de Autenticación

Este documento describe el sistema de autenticación implementado en el Sistema de Gestión Terapéutica.

## 📋 Características

- ✅ **Login**: Inicio de sesión con email y contraseña
- ✅ **Registro**: Creación de nuevas cuentas de usuario
- ✅ **Recuperación de contraseña**: Sistema de "Olvidé mi contraseña"
- ✅ **Restablecimiento de contraseña**: Cambio de contraseña con token
- ✅ **Protección de rutas**: Redirección automática según estado de autenticación
- ✅ **Gestión de sesión**: Uso de localStorage para persistencia
- ✅ **Perfil de usuario**: Visualización en la barra lateral
- ✅ **Roles de usuario**: Terapeuta, Coordinador, Administrador

## 🗂️ Estructura de Archivos

### Páginas de Autenticación
```
src/app/login/
├── page.tsx                    # Página de inicio de sesión
├── register/
│   └── page.tsx               # Página de registro
├── forgot-password/
│   └── page.tsx               # Página de recuperación de contraseña
├── reset-password/
│   └── page.tsx               # Página de restablecimiento de contraseña
└── layout.tsx                 # Layout para rutas de autenticación
```

### Contexto y Hooks
```
src/contexts/
└── auth-context.tsx           # Contexto de autenticación global

src/hooks/
└── use-auth-redirect.ts       # Hook para redirecciones basadas en auth
```

### Componentes
```
src/components/
├── auth/
│   └── protected-route.tsx    # Componente para proteger rutas
└── layout/
    ├── app-shell-wrapper.tsx  # Wrapper que maneja rutas públicas/privadas
    └── navigation.tsx         # Barra lateral con perfil de usuario
```

## 🚀 Uso

### 1. Contexto de Autenticación

El `AuthProvider` envuelve toda la aplicación y proporciona el estado de autenticación:

```tsx
import { useAuth } from '@/contexts/auth-context';

function MiComponente() {
  const { user, login, logout, loading, isAuthenticated } = useAuth();
  
  // user contiene la información del usuario autenticado
  // login(email, password) para iniciar sesión
  // logout() para cerrar sesión
  // loading indica si está cargando
  // isAuthenticated es un booleano
}
```

### 2. Proteger Rutas

#### Opción A: Usar el componente ProtectedRoute

```tsx
import ProtectedRoute from '@/components/auth/protected-route';

export default function PaginaProtegida() {
  return (
    <ProtectedRoute allowedRoles={['administrador', 'coordinador']}>
      <div>
        {/* Contenido solo para admins y coordinadores */}
      </div>
    </ProtectedRoute>
  );
}
```

#### Opción B: Usar el hook useAuth directamente

```tsx
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PaginaProtegida() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  if (loading) return <div>Cargando...</div>;
  if (!user) return null;
  
  return <div>Contenido protegido</div>;
}
```

### 3. Información del Usuario

El objeto `user` contiene:

```typescript
{
  id: string;
  email: string;
  nombre: string;
  rol: 'terapeuta' | 'coordinador' | 'administrador';
  telefono?: string;
  avatar?: string;
}
```

## 🎨 Diseño y Estética

El sistema sigue la estética del resto de la aplicación:

- **Colores primarios**: Azul (#2563EB - blue-600)
- **Fondos**: Gradiente de azul claro a blanco
- **Tipografía**: Inter font
- **Componentes**: Bordes redondeados, sombras suaves
- **Iconos**: Lucide React icons

## 🔒 Seguridad

### Implementación Actual (Demo)

⚠️ **Importante**: La implementación actual es para demostración y usa:
- `localStorage` para tokens
- Validación simulada
- Datos mock

### Implementación Recomendada para Producción

Para un entorno de producción, debes implementar:

1. **Backend API**
   ```typescript
   // En auth-context.tsx, reemplazar las funciones de login/register
   const login = async (email: string, password: string) => {
     const response = await fetch('/api/auth/login', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, password })
     });
     
     if (!response.ok) throw new Error('Credenciales inválidas');
     
     const { token, user } = await response.json();
     localStorage.setItem('auth_token', token);
     localStorage.setItem('user', JSON.stringify(user));
     setUser(user);
   };
   ```

2. **Tokens seguros**
   - Usar JWT (JSON Web Tokens)
   - Tokens de acceso cortos (15 minutos)
   - Refresh tokens en httpOnly cookies
   - Validación en cada request

3. **Encriptación**
   - HTTPS en producción
   - Contraseñas hasheadas con bcrypt o argon2
   - Nunca almacenar contraseñas en texto plano

4. **Validaciones adicionales**
   - Rate limiting para prevenir fuerza bruta
   - CAPTCHA en login/registro
   - Verificación de email
   - 2FA (autenticación de dos factores)

5. **Almacenamiento seguro**
   - Considerar cookies httpOnly en lugar de localStorage
   - Implementar refresh token rotation
   - Expiración de tokens

## 📝 Flujos de Usuario

### Flujo de Login

```
1. Usuario visita /login
2. Ingresa email y contraseña
3. Submit → validación del lado del cliente
4. Si es válido → llamada a API
5. Si es exitoso → guardar token y user
6. Redireccionar a /
```

### Flujo de Registro

```
1. Usuario visita /login/register
2. Completa formulario con validaciones
3. Submit → validación del lado del cliente
4. Si es válido → llamada a API
5. Si es exitoso → guardar token y user
6. Redireccionar a /
```

### Flujo de Recuperación de Contraseña

```
1. Usuario visita /login/forgot-password
2. Ingresa email
3. Submit → envía email con link de recuperación
4. Usuario recibe email con token
5. Click en link → /login/reset-password?token=xxx
6. Ingresa nueva contraseña
7. Submit → actualiza contraseña
8. Redireccionar a /login
```

## 🧪 Testing (Recomendado)

Para testing del sistema de autenticación:

```typescript
// Ejemplo con Jest y React Testing Library
describe('AuthContext', () => {
  it('should login user successfully', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });
    
    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });
    
    expect(result.current.user).toBeTruthy();
    expect(result.current.isAuthenticated).toBe(true);
  });
  
  it('should logout user', () => {
    // ... test implementation
  });
});
```

## 🔧 Personalización

### Cambiar rutas públicas

Edita `PUBLIC_ROUTES` en `auth-context.tsx`:

```typescript
const PUBLIC_ROUTES = [
  '/login', 
  '/login/register', 
  '/login/forgot-password',
  '/login/reset-password',
  '/about',  // agregar nueva ruta pública
];
```

### Agregar campos al usuario

1. Actualizar tipo en `src/lib/types.ts`:
```typescript
export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  rol: 'terapeuta' | 'coordinador' | 'administrador';
  telefono?: string;
  avatar?: string;
  departamento?: string;  // nuevo campo
}
```

2. Actualizar formularios y contexto según necesidad

## 📚 Recursos

- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [JWT Best Practices](https://jwt.io/introduction)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## 🐛 Troubleshooting

### Error: "Cannot find module '@/contexts/auth-context'"

Asegúrate de que el archivo existe y que tu `tsconfig.json` tiene configurado el alias `@`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### El usuario no persiste después de recargar

Verifica que:
1. Los datos se guardan correctamente en localStorage
2. El `useEffect` en `AuthProvider` se ejecuta correctamente
3. No hay errores al parsear el JSON

### Redirecciones infinitas

Verifica que:
1. Las rutas públicas están correctamente definidas
2. No hay conflictos en los `useEffect` de redirección
3. El estado `loading` se maneja correctamente

## 📞 Soporte

Para preguntas o problemas, consulta la documentación del proyecto o contacta al equipo de desarrollo.

