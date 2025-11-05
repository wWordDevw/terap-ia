# API de Generación de Notas Terapéuticas

## Descripción General

Esta API permite generar notas diarias y semanales completas para grupos terapéuticos, incluyendo:

- **Notas diarias**: Genera un documento Word (.docx) con todos los pacientes del grupo para un día específico
- **Notas semanales**: Genera un archivo comprimido (.rar) con todas las notas de la semana
- **Lógica especial para viernes**: Para grupos PHP, genera dos notas separadas (actividades 1-2 y 3-4) comprimidas en un ZIP
- **Pacientes ausentes**: Solo incluye header básico sin actividades ni métricas
- **Integración con OpenAI**: Genera respuestas terapéuticas únicas para cada paciente
- **Sistema de rotación**: Evita repetición de objetivos y párrafos

## Endpoints

### 1. Generar Nota Diaria de Grupo

**POST** `/api/v1/notes/generate-group-day`

Genera una nota diaria completa para un grupo específico.

#### Request Body

```json
{
  "groupId": "123e4567-e89b-12d3-a456-426614174000",
  "date": "2025-10-24"
}
```

#### Parámetros

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `groupId` | string (UUID) | Sí | ID del grupo para el cual generar la nota |
| `date` | string (YYYY-MM-DD) | Sí | Fecha para la cual generar la nota |

#### Response

- **Content-Type**: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **Content-Disposition**: `attachment; filename="Group_Day_20251024.docx"`
- **Body**: Buffer del archivo Word

#### Lógica Especial

- **Viernes + Grupo PHP**: Genera dos notas separadas (Part 1 y Part 2) comprimidas en un archivo ZIP
- **Pacientes Ausentes**: Solo incluye header con nombre, ID, ICD-10 y razón de ausencia
- **Pacientes Presentes**: Incluye nota completa con actividades, objetivos, respuestas del cliente y métricas

#### Ejemplo de Uso

```bash
curl -X POST "http://localhost:3002/api/v1/notes/generate-group-day" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "123e4567-e89b-12d3-a456-426614174000",
    "date": "2025-10-24"
  }' \
  --output "Group_Day_20251024.docx"
```

### 2. Generar Notas Semanales de Grupo

**POST** `/api/v1/notes/generate-group-week`

Genera notas semanales completas para un grupo específico.

#### Request Body

```json
{
  "groupId": "123e4567-e89b-12d3-a456-426614174000",
  "weekId": "456e7890-e89b-12d3-a456-426614174001"
}
```

#### Parámetros

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `groupId` | string (UUID) | Sí | ID del grupo para el cual generar las notas |
| `weekId` | string (UUID) | Sí | ID de la semana del grupo |

#### Response

- **Content-Type**: `application/x-rar-compressed`
- **Content-Disposition**: `attachment; filename="Group_Week_1234567890.rar"`
- **Body**: Buffer del archivo RAR

#### Estructura del Archivo RAR

```
Group_Week_2025-10-20.rar
├── Monday_20251020.docx
├── Tuesday_20251021.docx
├── Wednesday_20251022.docx
├── Thursday_20251023.docx
└── Friday_20251024.zip (contiene Note1.docx y Note2.docx)
```

#### Lógica por Tipo de Programa

- **PHP**: Genera notas para lunes a viernes (5 días)
- **IOP**: Genera notas para lunes, miércoles y viernes (3 días)
- **Viernes PHP**: Incluye archivo ZIP con dos notas separadas

#### Ejemplo de Uso

```bash
curl -X POST "http://localhost:3002/api/v1/notes/generate-group-week" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "groupId": "123e4567-e89b-12d3-a456-426614174000",
    "weekId": "456e7890-e89b-12d3-a456-426614174001"
  }' \
  --output "Group_Week_2025-10-20.rar"
```

## Estructura del Documento Word

### Header del Documento

```
FAMILY UNITED HEALTH COMMUNITY

DAILY PROGRESS NOTE / GROUP THERAPY – PARTIAL HOSPITALIZATION PROGRAM
(DAILY PROGRESS NOTE / GROUP THERAPY – PARTIAL HOSPITALIZATION PROGRAM - PART 1/2 para viernes PHP)

SERVICE DAY/DATE: Tuesday 07/01/2025

GROUP 6

Code G0410

Setting: 53

Begin-End Time
1:00 PM to 2:00 PM 
2:05 PM to 3:05 PM
3:20 PM to 4:20 PM
4:25 PM to 5:25 PM

Setting: 53

Session 1: 1 Units
Session 2: 1 Units
Session 3: 1 Units 
Session 4: 1 Units
```

### Sección por Paciente

#### Paciente Presente (Nota Completa)

```
Client Name: MIGUEL APA

Total Units: 4

Client ID #: P0127

ICD-10 Code: F33.2

Goals/Objective Addressed from Client treatment Plan:

☐GOAL#1: Client will identify and resolve the underlying causes of depression, thus elevating mood and interest/pleasure in life.

☒GOAL#2: Client will significantly reduce the overall frequency and intensity of the anxiety symptoms so that daily functioning is improved.

☐GOAL#3: Client will feel refreshed and energetic during wakeful hours.

☐GOAL#4: Client will reach a personal balance between solitary time and interpersonal interaction with others.

CLIENT RESPONSE TO ACTIVITIES/PROGRESS TOWARD MEETING TREATMENT PLAN GOALS AND OBJECTIVES/PLAN FOR CONTINUED DEVELOPMENT

COOPERATION
☐ Moderate 
☒ Minor 

MOTIVATION
☐ Moderate
☒ Minor

CONCENTRATION & FOCUS
☐ Moderate
☒ Minor

PEER INTERACTION
☐ Moderate
☒ Minor

ATTITUDE
☐ Positive
☐ Negative
☒ Fluctuations

SKILL SETS ADDRESSED/ACTIVITIES PROVIDED BY FACILITATOR TO BUILD CLIENT SKILLS:

Group 1: Life Skills: Managing Household Task: PHP Therapist conducted a skills-training session emphasizing the role of executive functioning in successful household task management. Clients discussed how impaired planning and initiation often lead to disorganized living environments and emotional dysregulation. The therapist modeled adaptive strategies such as prioritization matrices and cue-based habit formation.

Group 2: Self-Esteem: Practice Self-Care: PHP Therapist introduced the session by defining self-care as an essential component of self-esteem maintenance and resilience. Through guided discussion, clients examined the internalized beliefs that hinder their ability to prioritize their needs, such as guilt or low self-worth. The group collaborated on developing individualized self-care plans that addressed emotional, physical, and psychological domains, with an emphasis on consistency over perfection.

Group 1 Client Response: "I leave most chores unfinished because I get overwhelmed just thinking about them." PHP Therapist acknowledged how anticipatory anxiety can impair task initiation and provided the client with a visual task breakdown chart to reduce cognitive load and increase follow-through.

Group 2 Client Response (Goal#2/Obj2B): "When I try to do something for myself, I feel selfish and end up quitting." PHP Therapist helped the client recognize this as an internalized belief that reinforces anxiety and poor self-worth. The client was supported in developing a basic self-care routine with simple, time-limited actions to promote emotional regulation and reduce guilt.

Progress towards meeting goals and objectives: (Significant progress, Moderate Progress, Minimal Progress, No Progress, Regression, Decompensating, Unable to determine currently) Please explain: Progress was Minimal. During the group session, the client was able to understand how executive dysfunction, poor medication adherence, and unhealthy lifestyle habits can serve as early indicators or contributors to a depressive mood. The discussion of life skills: managing household task highlighted how avoidance behaviors and cognitive overload can trigger emotional dysregulation. Similarly, psychoeducation on health management: drug interactions, side effects, risks allowed the client to recognize the connection between inconsistent medication use and mood instability. The exploration of dietary patterns during healthy living: nutrition, exercise, and lifestyle changes revealed how impulsive food choices, especially during periods of anxiety, may perpetuate emotional lows. The client needs to continue working on self-esteem: practice self-care, as internalized guilt and difficulty prioritizing personal needs are likely interfering with the implementation of consistent preventative behaviors.
```

#### Paciente Ausente (Solo Header)

```
Client Name: ANA MARTINEZ

Total Units: 0

Client ID #: P004

ICD-10 Code: F33.1

Status: Absent | Reason: medical_appointment
```

### Resumen de Asistencia

```
ATTENDANCE SUMMARY

Total Patients: 6 | Present: 4 | Absent: 2 | Discharged: 0 | Attendance Rate: 66.7%
```

### Firma del Terapeuta

```
07/01/2025

Alina Morales, MSMH

Group Facilitator Signature/ Credentials

Date

Group Facilitator (print legibly)
```

## Lógica de Evaluación de Pacientes

### Métricas de Comportamiento

El sistema genera automáticamente las siguientes métricas para cada paciente presente:

#### COOPERATION, MOTIVATION, CONCENTRATION & FOCUS, PEER INTERACTION
- **Valores posibles**: Solo "Moderate" o "Minor"
- **Lógica**: Selección aleatoria entre las dos opciones
- **Restricción**: **NUNCA** se selecciona "Poor"

#### ATTITUDE
- **Valor fijo**: Siempre "Fluctuations"
- **Lógica**: Siempre se marca ☒ Fluctuations
- **Restricción**: **NUNCA** se selecciona "Positive" o "Negative"

### Ejemplo de Generación
```
COOPERATION
☐ Moderate 
☒ Minor 

MOTIVATION
☒ Moderate
☐ Minor

CONCENTRATION & FOCUS
☐ Moderate
☒ Minor

PEER INTERACTION
☒ Moderate
☐ Minor

ATTITUDE
☐ Positive
☐ Negative
☒ Fluctuations
```

## Sistema de Rotación

### Rotación de Objetivos (Subactivities)

- **Por paciente + actividad**: Cada paciente tiene su propio ciclo de objetivos por actividad
- **Ciclo completo**: Cuando se agotan todos los objetivos de una actividad, reinicia con el menos usado recientemente
- **Registro de uso**: Se guarda en `paragraph_usage_history` con `subactivityId`

### Rotación de Párrafos

- **Por paciente + objetivo**: Cada paciente tiene su propio ciclo de párrafos por objetivo
- **Orden por `paragraph_order`**: Los párrafos se usan en orden secuencial
- **Ciclo completo**: Cuando se agotan todos los párrafos de un objetivo, reinicia con el menos usado recientemente

### Integración con OpenAI

- **Respuestas únicas**: Cada respuesta del cliente se genera usando OpenAI con contexto específico
- **Validación de unicidad**: Se usa hash SHA256 para evitar respuestas duplicadas
- **Fallback**: Si no hay API key de OpenAI, usa respuestas mock predefinidas
- **Contexto**: Incluye nombre del paciente, actividad, objetivo, meta, párrafo y tipo de progreso

## Validaciones del Backend

### Validaciones de Grupo

- Grupo debe existir y estar activo
- Fecha debe estar dentro del rango del grupo (startDate - endDate)
- Usuario debe ser terapeuta del grupo o admin

### Validaciones de Semana

- Semana debe existir y estar asociada al grupo
- Usuario debe tener permisos para el grupo

### Validaciones de Asistencia

- Debe haber asistencias registradas para el día
- Pacientes sin registro de asistencia se consideran ausentes

### Validaciones de Actividades

- Debe haber schedules configurados para el día
- Viernes PHP debe tener al menos 4 actividades para doble nota

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 400 | Datos de entrada inválidos |
| 401 | Token de autorización inválido o expirado |
| 403 | No tienes permisos para generar notas para este grupo |
| 404 | Grupo no encontrado o inactivo |
| 404 | Semana no encontrada |
| 500 | Error interno del servidor |

## Configuración Requerida

### Variables de Entorno

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4
```

### Dependencias

```json
{
  "openai": "^4.0.0",
  "docx": "^8.0.0",
  "archiver": "^6.0.0"
}
```

## Consideraciones de Performance

- **Generación de semana**: Puede tomar 30-60 segundos (5 días × 6 pacientes × 4 actividades × OpenAI calls)
- **Rate limits de OpenAI**: Implementar retry logic y manejo de errores
- **Tamaño de archivos**: Documentos Word ~100KB cada uno, .rar ~500KB para semana
- **Concurrencia**: Limitar generaciones simultáneas para no exceder rate limits

## Ejemplos de Respuestas de Error

### Grupo No Encontrado

```json
{
  "statusCode": 404,
  "message": "Grupo con ID 123e4567-e89b-12d3-a456-426614174000 no encontrado o inactivo",
  "error": "Not Found"
}
```

### Fecha Fuera de Rango

```json
{
  "statusCode": 400,
  "message": "La fecha 2025-12-31 está fuera del rango del grupo (2025-01-15 - 2025-06-15)",
  "error": "Bad Request"
}
```

### Sin Permisos

```json
{
  "statusCode": 403,
  "message": "No tienes permisos para generar notas para este grupo",
  "error": "Forbidden"
}
```

### Viernes Sin Suficientes Actividades

```json
{
  "statusCode": 400,
  "message": "Friday debe tener al menos 4 actividades para generar doble nota",
  "error": "Bad Request"
}
```
