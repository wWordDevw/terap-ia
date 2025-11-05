## 📡 API Completa - Terapia Nota Backend

### Base URL

```
http://localhost:3000/api/v1
```

---

## 🏥 Clinics (RF-037)

### Crear Clínica
```http
POST /api/v1/clinics
Content-Type: application/json

{
  "clinicName": "Centro de Terapia Integral",
  "logoUrl": "https://example.com/logo.png",
  "address": "123 Main St",
  "phone": "305-555-0100",
  "email": "info@clinica.com"
}
```

### Listar Clínicas
```http
GET /api/v1/clinics?includeInactive=false
```

### Obtener Clínica
```http
GET /api/v1/clinics/:id
```

### Actualizar Clínica
```http
PATCH /api/v1/clinics/:id
```

### Desactivar/Activar
```http
DELETE /api/v1/clinics/:id
PATCH /api/v1/clinics/:id/activate
```

---

## 📋 Groups (RF-001 a RF-003)

### Crear Grupo
```http
POST /api/v1/groups
Content-Type: application/json

{
  "programType": "PHP",  // PHP o IOP
  "shift": "Mañana",     // Mañana o Tarde
  "groupName": "PHP Morning Jan 2025",
  "startDate": "2025-01-06",
  "clinicId": "uuid"
}
```

### Listar Grupos
```http
GET /api/v1/groups?includeInactive=false
```

### Obtener Grupo
```http
GET /api/v1/groups/:id
```

### Actualizar/Desactivar Grupo
```http
PATCH /api/v1/groups/:id
DELETE /api/v1/groups/:id
```

### Gestión de Semanas (RF-003)

#### Crear Semana
```http
POST /api/v1/groups/:id/weeks
Content-Type: application/json

{
  "weekNumber": 1,
  "startDate": "2025-01-06",
  "endDate": "2025-01-10"
}
```

#### Listar Semanas
```http
GET /api/v1/groups/:id/weeks
```

#### Obtener Semana Actual
```http
GET /api/v1/groups/:id/weeks/current
```

#### Marcar Semana como Actual
```http
PATCH /api/v1/groups/weeks/:weekId/set-current
```

### Gestión de Horarios (RF-001)

#### Crear Horario
```http
POST /api/v1/groups/:id/schedules
Content-Type: application/json

{
  "dayOfWeek": "monday",
  "activityId": "uuid",
  "subactivityId": "uuid",  // opcional
  "startTime": "09:00",
  "endTime": "10:30",
  "units": 1.5,
  "noteCode": "NOTE1",      // opcional
  "isNurseSession": false
}
```

#### Listar Horarios
```http
GET /api/v1/groups/:id/schedules
```

#### Eliminar Horario
```http
DELETE /api/v1/groups/schedules/:scheduleId
```

### Gestión de Pacientes en Grupos

#### Agregar Paciente al Grupo (RF-005)
```http
POST /api/v1/groups/:id/patients
Content-Type: application/json

{
  "patientId": "uuid",
  "joinedDate": "2025-01-06"
}
```

#### Listar Pacientes del Grupo
```http
GET /api/v1/groups/:id/patients
```

#### Remover Paciente del Grupo
```http
DELETE /api/v1/groups/:id/patients/:patientId
```

---

## 👥 Patients (RF-004 a RF-006)

### Crear Paciente (RF-004)
```http
POST /api/v1/patients
Content-Type: application/json

{
  "patientNumber": "12345",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-01-15",
  "admissionDate": "2025-01-06",
  "dischargeDate": "2025-03-06",  // opcional
  "clinicId": "uuid",
  "goals": [
    { "goalText": "Reduce anxiety symptoms" },
    { "goalText": "Improve coping skills" },
    { "goalText": "Enhance social interaction" },
    { "goalText": "Develop healthy routines" }
  ],
  "diagnoses": [
    {
      "icd10_code": "F41.1",
      "diagnosisDescription": "Generalized Anxiety Disorder",
      "isPrimary": true
    }
  ]
}
```

### Listar Pacientes
```http
GET /api/v1/patients?includeInactive=false
```

### Listar Pacientes Activos (sin discharge) - RF-005
```http
GET /api/v1/patients/active
```

### Obtener Paciente
```http
GET /api/v1/patients/:id
GET /api/v1/patients/number/:patientNumber
```

### Actualizar Paciente
```http
PATCH /api/v1/patients/:id
```

### Marcar Discharge (RF-006)
```http
PATCH /api/v1/patients/:id/discharge
Content-Type: application/json

{
  "dischargeDate": "2025-03-06"
}
```

### Gestión de Goals (RF-013)

#### Actualizar Goal
```http
PATCH /api/v1/patients/:id/goals/:goalNumber
Content-Type: application/json

{
  "goalText": "Updated goal text"
}
```

### Gestión de Diagnósticos

#### Agregar Diagnóstico
```http
POST /api/v1/patients/:id/diagnoses
Content-Type: application/json

{
  "icd10Code": "F32.1",
  "diagnosisDescription": "Major Depressive Disorder",
  "isPrimary": false
}
```

#### Eliminar Diagnóstico
```http
DELETE /api/v1/patients/diagnoses/:diagnosisId
```

### Gestión de Documentos (RF-004, RF-036)

#### Subir Documento
```http
POST /api/v1/patients/:id/documents
Content-Type: application/json

{
  "documentType": "master_treatment_plan",
  "documentName": "Treatment Plan 2025",
  "filePath": "/uploads/patient-123/treatment-plan.pdf",
  "fileSize": 102400
}
```

#### Listar Documentos
```http
GET /api/v1/patients/:id/documents
```

#### Eliminar Documento
```http
DELETE /api/v1/patients/documents/:documentId
```

---

## 📊 Activities

### Crear Actividad
```http
POST /api/v1/activities
Content-Type: application/json

{
  "activityName": "Group Therapy",
  "description": "Terapia grupal estándar"
}
```

### Listar Actividades
```http
GET /api/v1/activities?includeInactive=false
```

### Obtener/Actualizar/Desactivar
```http
GET /api/v1/activities/:id
PATCH /api/v1/activities/:id
DELETE /api/v1/activities/:id
```

### Gestión de Subactividades

#### Crear Subactividad
```http
POST /api/v1/activities/:id/subactivities
Content-Type: application/json

{
  "subactivityName": "Coping Skills",
  "description": "Desarrollo de habilidades de afrontamiento"
}
```

#### Listar/Eliminar
```http
GET /api/v1/activities/:id/subactivities
DELETE /api/v1/activities/subactivities/:subactivityId
```

### Gestión de Párrafos (RF-015, RF-034)

#### Crear Párrafo Predefinido
```http
POST /api/v1/activities/:id/paragraphs
Content-Type: application/json

{
  "subactivityId": "uuid",  // opcional
  "paragraphText": "The client actively participated...",
  "paragraphOrder": 1
}
```

#### Listar Párrafos
```http
GET /api/v1/activities/:id/paragraphs?subactivityId=uuid
```

#### Obtener Próximo Párrafo (Rotación) - RF-034
```http
GET /api/v1/activities/:id/paragraphs/next?subactivityId=uuid
```

#### Incrementar Uso de Párrafo
```http
PATCH /api/v1/activities/paragraphs/:paragraphId/increment-usage
```

#### Resetear Contadores
```http
POST /api/v1/activities/:id/paragraphs/reset-usage
```

#### Eliminar Párrafo
```http
DELETE /api/v1/activities/paragraphs/:paragraphId
```

---

## ✅ Attendance (RF-007 a RF-009)

### Marcar Asistencia (RF-007)
```http
POST /api/v1/attendance
Content-Type: application/json

{
  "weekId": "uuid",
  "patientId": "uuid",
  "attendanceDate": "2025-01-06",
  "status": "P",  // P, A, o D
  "unitsAttended": 1.5
}
```

### Consultar Asistencia

#### Por Semana
```http
GET /api/v1/attendance/week/:weekId
```

#### Por Paciente en Semana
```http
GET /api/v1/attendance/week/:weekId/patient/:patientId
```

#### Individual
```http
GET /api/v1/attendance/:id
```

### Bloquear Asistencia (RF-009)

#### Bloquear Individual
```http
PATCH /api/v1/attendance/:id/lock
```

#### Bloquear Toda la Semana
```http
POST /api/v1/attendance/week/:weekId/lock-all
```

### Justificar Ausencias (RF-008)
```http
POST /api/v1/attendance/absence/justify
Content-Type: application/json

{
  "attendanceId": "uuid",
  "reasonType": "medical_appointment",  // medical_appointment, family_trip, hospitalized
  "startDate": "2025-01-06",
  "endDate": "2025-01-08",  // opcional
  "notes": "Doctor appointment"
}
```

### Gestión de Justificaciones

#### Listar Razones
```http
GET /api/v1/attendance/:id/absence-reasons
```

#### Eliminar Razón
```http
DELETE /api/v1/attendance/absence-reasons/:reasonId
```

### Estadísticas de Paciente
```http
GET /api/v1/attendance/patient/:patientId/stats?startDate=2025-01-01&endDate=2025-03-31

Respuesta:
{
  "totalDays": 60,
  "present": 55,
  "absent": 3,
  "discharge": 2,
  "totalUnits": 82.5
}
```

---

## 🔐 Códigos de Estado HTTP

- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado
- `204 No Content` - Operación exitosa sin contenido
- `400 Bad Request` - Datos inválidos
- `403 Forbidden` - Operación no permitida (ej: modificar asistencia bloqueada)
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

---

## 📝 Validaciones

### Globales (ValidationPipe)
- Tipos de datos automáticos
- Campos requeridos vs opcionales
- Rangos numéricos (min, max)
- Formatos (email, UUID, fecha)

### Específicas del Negocio

**Patients:**
- Exactamente 4 goals requeridos
- Al menos 1 diagnóstico
- Número de paciente único

**Attendance:**
- No modificar si está bloqueada (RF-009)
- Solo justificar ausencias (status = A)

**Groups:**
- Program type: PHP o IOP
- Shift: Mañana o Tarde

**Documents:**
- Tipos permitidos: master_treatment_plan, assessment, other

---

## 🧪 Ejemplos con cURL

### Crear Paciente Completo
```bash
curl -X POST http://localhost:3000/api/v1/patients \
  -H "Content-Type: application/json" \
  -d '{
    "patientNumber": "12345",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15",
    "admissionDate": "2025-01-06",
    "clinicId": "clinic-uuid",
    "goals": [
      {"goalText": "Reduce anxiety"},
      {"goalText": "Improve coping"},
      {"goalText": "Enhance social skills"},
      {"goalText": "Develop routines"}
    ],
    "diagnoses": [
      {
        "icd10Code": "F41.1",
        "diagnosisDescription": "Generalized Anxiety Disorder",
        "isPrimary": true
      }
    ]
  }'
```

### Marcar Asistencia
```bash
curl -X POST http://localhost:3000/api/v1/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "weekId": "week-uuid",
    "patientId": "patient-uuid",
    "attendanceDate": "2025-01-06",
    "status": "P",
    "unitsAttended": 1.5
  }'
```

### Crear Grupo con Horario
```bash
# 1. Crear grupo
GROUP_ID=$(curl -X POST http://localhost:3000/api/v1/groups \
  -H "Content-Type: application/json" \
  -d '{
    "programType": "PHP",
    "shift": "Mañana",
    "groupName": "PHP Morning Jan 2025",
    "startDate": "2025-01-06",
    "clinicId": "clinic-uuid"
  }' | jq -r '.id')

# 2. Agregar horario
curl -X POST http://localhost:3000/api/v1/groups/$GROUP_ID/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "dayOfWeek": "monday",
    "activityId": "activity-uuid",
    "startTime": "09:00",
    "endTime": "10:30",
    "units": 1.5
  }'
```

---

## 📊 Total de Endpoints Implementados

| Módulo | Endpoints |
|--------|-----------|
| Clinics | 6 |
| Groups | 15 |
| Patients | 14 |
| Activities | 14 |
| Attendance | 10 |
| **TOTAL** | **59 endpoints** |

---

## 🎯 Requerimientos Funcionales Cubiertos

✅ **RF-001** - Crear Grupo
✅ **RF-002** - Visualizar Grupos
✅ **RF-003** - Gestión de Semanas
✅ **RF-004** - Crear Perfil de Paciente (4 goals, diagnósticos, documentos)
✅ **RF-005** - Auto-completar Lista de Pacientes
✅ **RF-006** - Gestión de Alta (Discharge)
✅ **RF-007** - Marcar Asistencia Diaria (P/A/D)
✅ **RF-008** - Justificar Ausencias
✅ **RF-009** - Bloqueo de Cambios
✅ **RF-013** - Goals (4 por paciente, no modificables)
✅ **RF-015** - Párrafos predefinidos
✅ **RF-034** - Alternancia de Párrafos
✅ **RF-036** - Gestión de Documentos
✅ **RF-037** - Configuración de Clínica

**Próximamente:**
- RF-010 a RF-017: Generación de Notas Diarias
- RF-018 a RF-026: MTPR
- RF-027 a RF-033: Multidisciplinario
