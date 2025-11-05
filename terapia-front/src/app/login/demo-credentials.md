# 🔐 Credenciales de Demostración

Como este es un sistema de demostración sin backend real, puedes usar **cualquier combinación** de email y contraseña para iniciar sesión.

## ✅ Requisitos Mínimos

### Para Login
- **Email**: Cualquier email válido (formato: algo@algo.com)
- **Contraseña**: Mínimo 6 caracteres

### Para Registro
- **Nombre**: Mínimo 3 caracteres
- **Email**: Formato válido
- **Contraseña**: Mínimo 8 caracteres con mayúsculas, minúsculas y números
- **Confirmar Contraseña**: Debe coincidir
- **Rol**: Selecciona entre Terapeuta, Coordinador o Administrador

## 📝 Ejemplos de Credenciales

Puedes usar estos ejemplos o crear los tuyos:

### Usuario 1 - Terapeuta
```
Email: maria.garcia@clinic.com
Contraseña: Terapeuta123
Rol: Terapeuta
```

### Usuario 2 - Coordinador
```
Email: juan.lopez@clinic.com
Contraseña: Coordin123
Rol: Coordinador
```

### Usuario 3 - Administrador
```
Email: admin@clinic.com
Contraseña: Admin123
Rol: Administrador
```

## 💡 Nota

Recuerda que estos son solo ejemplos. En el sistema demo actual:
- No se verifican las credenciales contra una base de datos
- Los datos se almacenan localmente en tu navegador
- Al cerrar sesión, los datos permanecen en localStorage

## 🚀 Para Producción

En un entorno de producción real, deberás:
1. Implementar autenticación real con backend
2. Usar base de datos para almacenar usuarios
3. Hashear contraseñas con bcrypt o argon2
4. Implementar tokens JWT
5. Agregar verificación de email
6. Implementar rate limiting

Consulta `AUTENTICACION.md` para más detalles.

