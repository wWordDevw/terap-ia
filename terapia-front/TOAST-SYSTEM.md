# 🎨 Sistema de Toast - Documentación

**Fecha:** 2025-10-11
**Estado:** ✅ Completamente Implementado

---

## 📦 Instalación

El sistema de toast ya está instalado y configurado en el proyecto. Incluye:

- ✅ **framer-motion** - Para animaciones fluidas
- ✅ **Toast Component** - Componente individual de notificación
- ✅ **ToastProvider** - Context provider para gestión global
- ✅ **useToast Hook** - Hook personalizado para usar toasts

---

## 🎯 Características

### ✨ Funcionalidades Principales:

1. **3 Tipos de Toasts:**
   - ✅ `success` - Notificaciones de éxito (verde)
   - ⚠️ `warning` - Advertencias (ámbar)
   - ❌ `error` - Errores (rojo)

2. **Animaciones Fluidas:**
   - Entrada desde la derecha con slide-in
   - Salida suave con fade-out
   - Efecto shimmer en barra de progreso
   - Rotación del botón de cierre al hover

3. **UX Mejorada:**
   - Pausa automática al hacer hover
   - Cierre manual con botón X
   - Barra de progreso animada
   - Stack de múltiples toasts
   - Prevención de duplicados

4. **Accesibilidad:**
   - ARIA labels en botones
   - Colores con alto contraste
   - Animaciones respetan preferencias del usuario

---

## 🚀 Uso Básico

### 1. Importar el Hook

```typescript
import { useToast } from '@/components/providers/toast-provider';
```

### 2. Usar en un Componente

```typescript
export default function MyComponent() {
  const { addToast } = useToast();

  const handleAction = () => {
    // Toast de éxito
    addToast('¡Operación exitosa!', 'success');
  };

  return (
    <button onClick={handleAction}>
      Hacer algo
    </button>
  );
}
```

---

## 📚 Ejemplos de Uso

### Ejemplo 1: Toast de Éxito
```typescript
const { addToast } = useToast();

// Notificación de éxito simple
addToast('¡Datos guardados correctamente!', 'success');

// Con duración personalizada (5 segundos)
addToast('¡Usuario creado exitosamente!', 'success', 5000);
```

**Resultado:**
🟢 Toast verde con ícono de check ✓

---

### Ejemplo 2: Toast de Advertencia
```typescript
const { addToast } = useToast();

// Advertencia simple
addToast('Por favor revisa los campos requeridos', 'warning');

// Advertencia con duración larga
addToast('Esta acción no se puede deshacer', 'warning', 6000);
```

**Resultado:**
🟡 Toast ámbar con ícono de advertencia ⚠️

---

### Ejemplo 3: Toast de Error
```typescript
const { addToast } = useToast();

// Error simple
addToast('Error al procesar la solicitud', 'error');

// Error con mensaje detallado
addToast('No se pudo conectar con el servidor. Intenta nuevamente.', 'error', 4000);
```

**Resultado:**
🔴 Toast rojo con ícono de X ✗

---

### Ejemplo 4: En un Formulario
```typescript
'use client';

import { useState } from 'react';
import { useToast } from '@/components/providers/toast-provider';

export default function FormExample() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validación
      if (!formData.name || !formData.email) {
        addToast('Por favor completa todos los campos', 'warning');
        return;
      }

      // Enviar datos
      await saveData(formData);

      // Éxito
      addToast('¡Formulario enviado correctamente!', 'success');

      // Limpiar formulario
      setFormData({ name: '', email: '' });
    } catch (error) {
      // Error
      addToast('Error al enviar el formulario', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos del formulario */}
    </form>
  );
}
```

---

### Ejemplo 5: En Operaciones CRUD
```typescript
import { useToast } from '@/components/providers/toast-provider';
import { patientsService } from '@/lib/services/patients-service';

export default function PatientsList() {
  const { addToast } = useToast();

  const handleCreatePatient = async (data: PatientData) => {
    try {
      await patientsService.createPatient(data);
      addToast('Paciente creado exitosamente', 'success');
    } catch (error) {
      addToast('Error al crear el paciente', 'error');
    }
  };

  const handleUpdatePatient = async (id: string, data: PatientData) => {
    try {
      await patientsService.updatePatient(id, data);
      addToast('Paciente actualizado', 'success');
    } catch (error) {
      addToast('Error al actualizar el paciente', 'error');
    }
  };

  const handleDeletePatient = async (id: string) => {
    try {
      await patientsService.deletePatient(id);
      addToast('Paciente eliminado', 'success');
    } catch (error) {
      addToast('Error al eliminar el paciente', 'error');
    }
  };

  return (
    <div>
      {/* UI de la lista de pacientes */}
    </div>
  );
}
```

---

### Ejemplo 6: Múltiples Toasts Simultáneos
```typescript
const { addToast } = useToast();

const handleBulkOperation = async () => {
  // Toast inicial
  addToast('Procesando operaciones...', 'warning', 2000);

  try {
    // Operación 1
    await operation1();
    addToast('Operación 1 completada', 'success');

    // Operación 2
    await operation2();
    addToast('Operación 2 completada', 'success');

    // Operación 3
    await operation3();
    addToast('Operación 3 completada', 'success');

    // Toast final
    addToast('¡Todas las operaciones completadas!', 'success', 5000);
  } catch (error) {
    addToast('Error en una de las operaciones', 'error');
  }
};
```

**Resultado:**
Los toasts se apilan verticalmente con un efecto cascada.

---

## 🎨 Personalización

### Duración Predeterminada
```typescript
// Duración por defecto: 3000ms (3 segundos)
addToast('Mensaje', 'success'); // 3s

// Duración personalizada
addToast('Mensaje corto', 'success', 1500); // 1.5s
addToast('Mensaje largo', 'success', 5000); // 5s
```

### Tipos de Toast

| Tipo | Color | Ícono | Uso Recomendado |
|------|-------|-------|-----------------|
| `success` | 🟢 Verde | ✓ | Operaciones exitosas |
| `warning` | 🟡 Ámbar | ⚠️ | Advertencias, validaciones |
| `error` | 🔴 Rojo | ✗ | Errores, fallos |

---

## ⚙️ API Completa

### `useToast()` Hook

```typescript
const { addToast, removeToast, removeAllToasts, toasts } = useToast();
```

#### Métodos:

**`addToast(message, type?, duration?)`**
- **message** (string): Texto a mostrar
- **type** ('success' | 'warning' | 'error'): Tipo de toast (default: 'success')
- **duration** (number): Duración en milisegundos (default: 3000)
- **Retorna:** ID del toast (number) o null si es inválido

**`removeToast(id)`**
- **id** (number): ID del toast a eliminar
- Elimina un toast específico manualmente

**`removeAllToasts()`**
- Elimina todos los toasts activos

**`toasts`**
- Array con todos los toasts activos

---

## 🎭 Eventos Globales

También puedes disparar toasts usando eventos personalizados (útil fuera de React):

```typescript
// Desde cualquier parte del código
window.dispatchEvent(new CustomEvent('showToast', {
  detail: {
    message: '¡Operación completada!',
    type: 'success',
    duration: 3000
  }
}));
```

---

## 🛠️ Implementación en el Proyecto

### Archivos Creados:

1. **`src/components/ui/toast.tsx`**
   - Componente individual del toast
   - Maneja animaciones y ciclo de vida

2. **`src/components/providers/toast-provider.tsx`**
   - Context provider para gestión global
   - Hook `useToast()`
   - Contenedor de stack de toasts

3. **`src/app/layout.tsx`** (modificado)
   - ToastProvider agregado al árbol de componentes

### Integración en Login:

```typescript
// src/app/login/page.tsx
const { addToast } = useToast();

// En el login exitoso
addToast('¡Inicio de sesión exitoso!', 'success');

// En errores
addToast('Error al iniciar sesión', 'error');
```

---

## 📊 Comportamiento

### Stack de Toasts:
```
┌─────────────────────────────┐
│ ✓ Operación 3 completada   │ ← Más reciente (arriba)
└─────────────────────────────┘
    ↓ 10px de desplazamiento
┌─────────────────────────────┐
│ ✓ Operación 2 completada   │
└─────────────────────────────┘
    ↓ 10px de desplazamiento
┌─────────────────────────────┐
│ ✓ Operación 1 completada   │ ← Más antiguo (abajo)
└─────────────────────────────┘
```

### Ciclo de Vida:
1. **Mostrar** → Slide-in desde la derecha (0.3s)
2. **Pausar** → Hover detiene el temporizador
3. **Reanudar** → Mouse leave continúa el temporizador
4. **Ocultar** → Slide-out hacia la derecha (0.3s)
5. **Eliminar** → Removido del DOM

### Prevención de Duplicados:
- No permite 2 toasts con el mismo mensaje y tipo simultáneamente
- Retorna el ID del toast existente si se intenta duplicar

---

## 🎯 Mejores Prácticas

### ✅ DO:
```typescript
// Mensajes claros y concisos
addToast('Paciente guardado correctamente', 'success');

// Usar el tipo correcto
addToast('Campos requeridos faltantes', 'warning');

// Duración apropiada según longitud del mensaje
addToast('Mensaje largo que requiere más tiempo para leer...', 'success', 5000);
```

### ❌ DON'T:
```typescript
// Mensajes vacíos (se previenen automáticamente)
addToast('', 'success'); // No se mostrará

// Mensajes muy largos (máximo 2 líneas recomendado)
addToast('Este es un mensaje extremadamente largo que ocupa mucho espacio...', 'success');

// Crear múltiples toasts iguales
for (let i = 0; i < 5; i++) {
  addToast('Mismo mensaje', 'success'); // Solo se mostrará uno
}
```

---

## 🐛 Troubleshooting

### El toast no aparece:
1. Verifica que `ToastProvider` esté en el layout principal
2. Asegúrate de usar el hook dentro de un componente hijo
3. Verifica que el mensaje no esté vacío

### Múltiples toasts superpuestos:
- Esto es el comportamiento esperado (stack)
- Usa `removeAllToasts()` si necesitas limpiar todos

### El toast se cierra muy rápido:
- Aumenta la duración: `addToast('mensaje', 'success', 5000)`

### El toast no se pausa al hover:
- Verifica que no haya elementos con `pointer-events: none` sobre el toast

---

## 🎨 Estilos y Colores

### Success (Verde):
- Background: `bg-green-500`
- Border: `bg-green-600`
- Progress: `bg-green-300`
- Icon Background: `bg-green-600`

### Warning (Ámbar):
- Background: `bg-amber-500`
- Border: `bg-amber-600`
- Progress: `bg-amber-300`
- Icon Background: `bg-amber-600`

### Error (Rojo):
- Background: `bg-red-500`
- Border: `bg-red-600`
- Progress: `bg-red-300`
- Icon Background: `bg-red-600`

---

## 📱 Responsive

El sistema de toast es completamente responsive:
- **Desktop:** Aparece en la esquina superior derecha
- **Mobile:** Aparece en la parte superior, ancho adaptativo
- **Tablet:** Ancho máximo de 320px-400px

---

## ♿ Accesibilidad

- ✅ ARIA labels en botones de cierre
- ✅ Contraste de color WCAG AA compliant
- ✅ Animaciones respetan `prefers-reduced-motion`
- ✅ Keyboard navigation (tab para navegar, enter para cerrar)

---

## 🚀 Próximas Mejoras (Opcionales)

- [ ] Toast persistentes (sin auto-close)
- [ ] Acciones personalizadas (botones dentro del toast)
- [ ] Posicionamiento configurable (top, bottom, left, right)
- [ ] Sonidos de notificación
- [ ] Límite máximo de toasts simultáneos
- [ ] Animaciones de entrada/salida personalizables

---

## 🎉 Conclusión

El sistema de toast está **100% funcional** y listo para usar en toda la aplicación. Proporciona una excelente experiencia de usuario con:

✅ Animaciones fluidas con Framer Motion
✅ 3 tipos de notificaciones (success, warning, error)
✅ Stack de múltiples toasts
✅ Pausa al hover
✅ Prevención de duplicados
✅ Accesibilidad completa
✅ Responsive design

**Estado:** ✅ PRODUCTION READY

---

**Generado por:** Claude Code
**Fecha:** 2025-10-11
**Versión:** 1.0
