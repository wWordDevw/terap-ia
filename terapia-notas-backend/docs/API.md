# 📡 Documentación API - Terapia Nota Backend

## Base URL

```
http://localhost:3000/api/v1
```

## Autenticación

*Próximamente: JWT Bearer Token*

---

## 🏥 Clinics

### Crear Clínica

```http
POST /api/v1/clinics
```

**Body:**
```json
{
  "clinicName": "Centro de Terapia Integral",
  "logoUrl": "https://example.com/logo.png",
  "address": "123 Main St, Miami, FL",
  "phone": "305-555-0100",
  "email": "info@terapiaintegral.com",
  "isActive": true
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "clinicName": "Centro de Terapia Integral",
  "logoUrl": "https://example.com/logo.png",
  "address": "123 Main St, Miami, FL",
  "phone": "305-555-0100",
  "email": "info@terapiaintegral.com",
  "isActive": true,
  "createdAt": "2025-01-05T10:00:00.000Z",
  "updatedAt": "2025-01-05T10:00:00.000Z"
}
```

---

### Obtener Todas las Clínicas

```http
GET /api/v1/clinics
```

**Query Parameters:**
- `includeInactive` (opcional): `true` | `false` (default: false)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "clinicName": "Centro de Terapia Integral",
    "logoUrl": "https://example.com/logo.png",
    "address": "123 Main St, Miami, FL",
    "phone": "305-555-0100",
    "email": "info@terapiaintegral.com",
    "isActive": true,
    "users": [],
    "groups": [],
    "createdAt": "2025-01-05T10:00:00.000Z",
    "updatedAt": "2025-01-05T10:00:00.000Z"
  }
]
```

---

### Obtener Clínica por ID

```http
GET /api/v1/clinics/:id
```

**Path Parameters:**
- `id`: UUID de la clínica

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "clinicName": "Centro de Terapia Integral",
  "logoUrl": "https://example.com/logo.png",
  "address": "123 Main St, Miami, FL",
  "phone": "305-555-0100",
  "email": "info@terapiaintegral.com",
  "isActive": true,
  "users": [...],
  "groups": [...],
  "patients": [...],
  "createdAt": "2025-01-05T10:00:00.000Z",
  "updatedAt": "2025-01-05T10:00:00.000Z"
}
```

**Errores:**
- `404 Not Found`: Clínica no encontrada

---

### Actualizar Clínica

```http
PATCH /api/v1/clinics/:id
```

**Path Parameters:**
- `id`: UUID de la clínica

**Body:** (todos los campos son opcionales)
```json
{
  "clinicName": "Nuevo Nombre",
  "phone": "305-555-9999"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "clinicName": "Nuevo Nombre",
  "phone": "305-555-9999",
  ...
}
```

---

### Desactivar Clínica

```http
DELETE /api/v1/clinics/:id
```

**Path Parameters:**
- `id`: UUID de la clínica

**Response:** `204 No Content`

> Nota: Esto es un soft delete. La clínica se marca como `isActive: false`.

---

### Activar Clínica

```http
PATCH /api/v1/clinics/:id/activate
```

**Path Parameters:**
- `id`: UUID de la clínica

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "clinicName": "Centro de Terapia Integral",
  "isActive": true,
  ...
}
```

---

## 📋 Grupos

*Próximamente*

---

## 👥 Pacientes

*Próximamente*

---

## 📊 Actividades

*Próximamente*

---

## ✅ Asistencia

*Próximamente*

---

## 🔍 MTPR

*Próximamente*

---

## 📄 Notas

*Próximamente*

---

## ❌ Códigos de Error

### 400 Bad Request
Datos de entrada inválidos o falta información requerida.

**Ejemplo:**
```json
{
  "statusCode": 400,
  "message": [
    "clinicName should not be empty",
    "email must be an email"
  ],
  "error": "Bad Request"
}
```

### 404 Not Found
Recurso no encontrado.

**Ejemplo:**
```json
{
  "statusCode": 404,
  "message": "Clínica con ID abc-123 no encontrada",
  "error": "Not Found"
}
```

### 500 Internal Server Error
Error interno del servidor.

**Ejemplo:**
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## 🧪 Ejemplos con cURL

### Crear Clínica

```bash
curl -X POST http://localhost:3000/api/v1/clinics \
  -H "Content-Type: application/json" \
  -d '{
    "clinicName": "Centro de Terapia Integral",
    "email": "info@terapia.com",
    "phone": "305-555-0100"
  }'
```

### Obtener Todas las Clínicas

```bash
curl http://localhost:3000/api/v1/clinics
```

### Obtener Clínica por ID

```bash
curl http://localhost:3000/api/v1/clinics/abc-123-def-456
```

### Actualizar Clínica

```bash
curl -X PATCH http://localhost:3000/api/v1/clinics/abc-123 \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "305-555-9999"
  }'
```

### Desactivar Clínica

```bash
curl -X DELETE http://localhost:3000/api/v1/clinics/abc-123
```

---

## 📝 Notas

- Todas las fechas están en formato ISO 8601
- Los IDs son UUIDs v4
- Todas las respuestas son en formato JSON
- La API usa prefijo `/api/v1`
- CORS está habilitado para desarrollo
