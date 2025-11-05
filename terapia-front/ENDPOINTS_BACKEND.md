# 📋 Endpoints del Backend - Mapeo Completo

## ✅ Endpoints Implementados en tu Backend

Según tu `AuthController`, estos son los endpoints disponibles:

### 🔐 Autenticación

| Método | Endpoint | Descripción | DTO | Response |
|--------|----------|-------------|-----|----------|
| `POST` | `/auth/login` | Login de usuario | `LoginDto` | `AuthResponse` |
| `POST` | `/auth/register` | Registro de usuario | `RegisterDto` | `AuthResponse` |
| `POST` | `/auth/refresh` | Refresh token | `RefreshTokenDto` | `AuthResponse` |
| `GET` | `/auth/profile` | Perfil del usuario | - | `User` |
| `POST` | `/auth/logout` | Logout | - | `{ message: string }` |

---

## 🔄 Mapeo Frontend ↔ Backend

### ✅ Implementado Correctamente

| Frontend | Backend | Estado |
|----------|---------|--------|
| `POST /auth/login` | `POST /auth/login` | ✅ Coincide |
| `POST /auth/register` | `POST /auth/register` | ✅ Coincide |
| `POST /auth/refresh` | `POST /auth/refresh` | ✅ Coincide |
| `GET /auth/profile` | `GET /auth/profile` | ✅ Coincide |
| `POST /auth/logout` | `POST /auth/logout` | ✅ Coincide |

### ⚠️ Endpoints Faltantes en tu Backend

| Frontend | Backend | Estado |
|----------|---------|--------|
| `POST /auth/forgot-password` | ❌ No implementado | ⚠️ Falta |
| `POST /auth/reset-password` | ❌ No implementado | ⚠️ Falta |
| `PATCH /users/profile` | ❌ No implementado | ⚠️ Falta |

---

## 📝 DTOs Requeridos

### LoginDto
```typescript
{
  email: string;
  password: string;
}
```

### RegisterDto
```typescript
{
  username: string;        // @IsString() @MaxLength(50)
  email: string;          // @IsEmail() @MaxLength(100)
  password: string;       // @IsString() @MinLength(8) @MaxLength(100)
  fullName: string;       // @IsString() @MaxLength(255)
  role?: UserRole;        // @IsOptional() @IsEnum(UserRole)
  clinicId: string;       // @IsUUID()
}
```

### RefreshTokenDto
```typescript
{
  refreshToken: string;
}
```

### AuthResponse
```typescript
{
  user: User;
  accessToken: string;
  refreshToken?: string;
}
```

### User
```typescript
{
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  clinicId: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🚀 Cómo Probar

### 1. Iniciar Backend
```bash
# En tu proyecto backend
npm run start:dev
# Debe estar en http://localhost:3001
```

### 2. Iniciar Frontend
```bash
# En tu proyecto frontend
npm run dev
# Debe estar en http://localhost:3000
```

### 3. Probar Endpoints

**Login:**
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123"}'
```

**Registro:**
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"Password123",
    "fullName":"Test User",
    "role":"therapist",
    "clinicId":"uuid-de-tu-clinica"
  }'
```

**Profile (con token):**
```bash
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## ⚠️ Endpoints Faltantes

Para que el frontend funcione completamente, necesitas implementar:

### 1. Forgot Password
```typescript
@Post('forgot-password')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Recuperar contraseña' })
forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
  return this.authService.forgotPassword(forgotPasswordDto);
}
```

### 2. Reset Password
```typescript
@Post('reset-password')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Restablecer contraseña' })
resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
  return this.authService.resetPassword(resetPasswordDto);
}
```

### 3. Update Profile
```typescript
@Patch('profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiOperation({ summary: 'Actualizar perfil' })
updateProfile(
  @CurrentUser() user: User,
  @Body() updateProfileDto: UpdateProfileDto
) {
  return this.authService.updateProfile(user.id, updateProfileDto);
}
```

---

## 🔧 Configuración CORS

Asegúrate de que tu backend tenga CORS configurado:

```typescript
// En main.ts
app.enableCors({
  origin: ['http://localhost:3000'],
  credentials: true,
});
```

---

## 📊 Estado Actual

- ✅ **Login** - Funcionando
- ✅ **Registro** - Funcionando  
- ✅ **Refresh Token** - Funcionando
- ✅ **Profile** - Funcionando
- ✅ **Logout** - Funcionando
- ⚠️ **Forgot Password** - Falta implementar
- ⚠️ **Reset Password** - Falta implementar
- ⚠️ **Update Profile** - Falta implementar

---

## 🎯 Próximos Pasos

1. **Implementar endpoints faltantes** en tu backend
2. **Probar el flujo completo** de login/registro
3. **Configurar CORS** correctamente
4. **Implementar recuperación de contraseña** (opcional)

El sistema está listo para los endpoints que ya tienes implementados! 🚀
