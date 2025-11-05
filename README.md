# Sistema de Gestión de Terapia (Terap-IA)

Sistema integral de gestión para clínicas de terapia PHP (Partial Hospitalization Program) e IOP (Intensive Outpatient Program) con seguimiento de pacientes, generación automática de notas diarias y MTPR (Master Treatment Plan Review).

## 📋 Tabla de Contenidos

- [Características Principales](#características-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Arquitectura](#arquitectura)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
  - [Opción 1: Docker (Recomendado)](#opción-1-docker-recomendado)
  - [Opción 2: Instalación Local](#opción-2-instalación-local)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Documentation](#api-documentation)
- [Contribución](#contribución)
- [Licencia](#licencia)

## ✨ Características Principales

### Gestión de Pacientes
- ✅ Registro completo de pacientes con información demográfica
- ✅ Gestión de 4 objetivos (goals) por paciente
- ✅ Diagnósticos primarios y secundarios (ICD-10)
- ✅ Tracking de fechas de admisión y discharge
- ✅ Gestión de documentos del paciente

### Seguimiento de Objetivos (Goal Tracking)
- 🎯 **7 Niveles de Progreso**: Not Started, No Progress, Minimal Progress, Moderate Progress, Significant Progress, Achieved, Regression
- 📊 **Evaluaciones Periódicas**: Registro de progreso con porcentaje de completitud (0-100%)
- 📈 **Reportes de Cumplimiento**: Estadísticas detalladas por paciente
- ⚠️ **Alertas Automáticas**: Identificación de objetivos que requieren atención
- 🔄 **Validación Automática**: Coherencia entre nivel de progreso y porcentaje
- 💡 **Recomendaciones Inteligentes**: Sugerencias basadas en el progreso del paciente

### Gestión de Grupos
- 📅 Programación semanal de grupos PHP/IOP
- 🕐 Horarios configurables por día
- 👥 Asignación de pacientes a grupos
- 📝 Tracking de asistencia diaria

### Generación Automática de Notas
- 📄 **Notas Diarias**: Generación automática de progress notes
- 🤖 **IA Integrada**: Respuestas de clientes generadas con Google Gemini
- 📋 **Plantillas Word**: Documentos profesionales con formato predefinido
- ⚡ **Respuestas Rotativas**: Sistema para evitar repetición de respuestas

### Master Treatment Plan Review (MTPR)
- 📊 Generación automática cada 30 días
- ✅ Validación de asistencia (mínimo 50%)
- 📈 Escalación automática de progreso por diagnóstico
- 📝 Tracking de medicación y estado mental
- ⚠️ **Integración con Goal Tracking**: Validación de cumplimiento de objetivos antes de generar MTPR

### Juntas Multidisciplinarias
- 👨‍⚕️ Gestión de equipos multidisciplinarios
- 📋 Generación de minutas de reunión
- 📊 Planificación colaborativa del tratamiento

### Dashboard de Cumplimiento de Objetivos
- 📊 Visualización de progreso general del paciente
- 📈 Gráficas y estadísticas por objetivo
- 🎯 Identificación de objetivos logrados, en progreso y con regresión
- 📅 Timeline de evaluaciones históricas

## 🛠️ Tecnologías Utilizadas

### Backend
- **Framework**: NestJS 11.0.1
- **Lenguaje**: TypeScript 5.x
- **Base de Datos**: PostgreSQL
- **ORM**: TypeORM 0.3.27
- **Autenticación**: JWT (passport-jwt)
- **IA**: Google Generative AI (Gemini)
- **Generación de Documentos**: docx, docx-templates

### Frontend
- **Framework**: Next.js 15.2.4
- **UI Library**: React 19
- **Lenguaje**: TypeScript 5.x
- **State Management**: Zustand
- **Componentes UI**: Radix UI
- **Estilos**: TailwindCSS 4.1.9
- **Manejo de Fechas**: date-fns

### DevOps
- **Containerización**: Docker & Docker Compose
- **Base de Datos**: PostgreSQL 16 Alpine
- **Reverse Proxy**: (Configurar según necesidad)

## 🏗️ Arquitectura

```
terap-ia/
├── terapia-notas-backend/    # Backend API (NestJS)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── patients/         # Gestión de pacientes
│   │   │   ├── groups/           # Gestión de grupos
│   │   │   ├── activities/       # Actividades terapéuticas
│   │   │   ├── attendance/       # Registro de asistencia
│   │   │   ├── notes/            # Generación de notas
│   │   │   ├── mtpr/             # Master Treatment Plan Review
│   │   │   ├── goal-tracking/    # Seguimiento de objetivos
│   │   │   └── multidisciplinary/# Juntas multidisciplinarias
│   │   ├── common/              # Utilidades compartidas
│   │   └── config/              # Configuración
│   └── Dockerfile
│
├── terapia-front/               # Frontend (Next.js)
│   ├── src/
│   │   ├── app/                 # Páginas (App Router)
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── goals/          # Componentes de tracking de objetivos
│   │   │   ├── mtpr/           # Componentes MTPR
│   │   │   └── ui/             # Componentes UI base
│   │   └── lib/
│   │       ├── services/       # Servicios API
│   │       └── types.ts        # Tipos TypeScript
│   └── Dockerfile
│
├── docker-compose.yml           # Orquestación de servicios
├── .env.example                 # Variables de entorno de ejemplo
└── README.md                    # Este archivo
```

## 📋 Requisitos Previos

- **Docker** >= 24.0.0
- **Docker Compose** >= 2.20.0

O para instalación local:
- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **PostgreSQL** >= 14.0

## 🚀 Instalación

### Opción 1: Docker (Recomendado)

1. **Clonar el repositorio**
```bash
git clone https://github.com/wWordDevw/terap-ia.git
cd terap-ia
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus valores
```

Configurar las siguientes variables críticas:
```env
GOOGLE_API_KEY=tu-clave-api-de-google-gemini
JWT_SECRET=una-clave-secreta-muy-segura
DB_PASSWORD=password-seguro-para-postgres
```

3. **Iniciar los servicios**
```bash
docker-compose up -d
```

4. **Verificar el estado de los servicios**
```bash
docker-compose ps
```

5. **Ver logs**
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend
```

6. **Acceder a la aplicación**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432

### Opción 2: Instalación Local

#### Backend

1. **Navegar al directorio del backend**
```bash
cd terapia-notas-backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tu configuración de PostgreSQL y Google API
```

4. **Ejecutar migraciones**
```bash
npm run migration:run
```

5. **Iniciar el servidor**
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

#### Frontend

1. **Navegar al directorio del frontend**
```bash
cd terapia-front
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
# Editar .env.local con la URL del backend
```

4. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run start
```

## ⚙️ Configuración

### Variables de Entorno

#### Backend (.env)
```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your-password
DB_DATABASE=terapia_db

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=7d

# Google AI
GOOGLE_API_KEY=your-google-api-key
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Google Gemini API

Para habilitar la generación de respuestas con IA:

1. Obtener una API key de Google AI: https://makersuite.google.com/app/apikey
2. Configurar en `GOOGLE_API_KEY`

## 📖 Uso

### Gestión de Pacientes

1. **Crear Paciente**
   - Navegar a "Pacientes" > "Crear Nuevo"
   - Completar información demográfica
   - Configurar 4 objetivos (goals)
   - Agregar diagnósticos (ICD-10)

2. **Tracking de Objetivos**
   - Desde el perfil del paciente, ir a "Cumplimiento de Objetivos"
   - Ver dashboard con progreso general
   - Crear nuevas evaluaciones de progreso
   - Ver historial de evaluaciones

3. **Evaluar Progreso de Objetivos**
   - Seleccionar objetivo a evaluar
   - Elegir nivel de progreso (Not Started → Achieved)
   - Ingresar porcentaje de completitud
   - Agregar evidencia y notas
   - Guardar evaluación

### Generación de Notas Diarias

1. **Configurar Grupo**
   - Crear grupo PHP/IOP
   - Asignar pacientes al grupo
   - Configurar horario semanal

2. **Registrar Asistencia**
   - Marcar presente/ausente diariamente
   - Agregar justificaciones si es necesario

3. **Generar Notas**
   - Seleccionar fecha y grupo
   - Sistema genera automáticamente:
     - Respuestas de clientes (con IA o plantillas)
     - Métricas de comportamiento
     - Párrafo de progreso
   - Descargar documento Word

### Master Treatment Plan Review (MTPR)

1. **Validaciones Automáticas**
   - ✅ Mínimo 10 días desde admisión
   - ✅ Asistencia >= 50%
   - ✅ 4 objetivos configurados
   - ⚠️ Validación de cumplimiento de objetivos (advertencia)

2. **Generar MTPR**
   - Sistema muestra alertas si objetivos requieren atención
   - Completar información requerida:
     - Estado mental
     - Medicación actual
     - Progreso de objetivos (texto)
     - Barreras y plan para próximo período
   - Sistema genera documento con:
     - Escalación automática de progreso
     - Cálculo de asistencia
     - Formato profesional

### Dashboard de Cumplimiento

El sistema proporciona visualizaciones completas:

- **Progreso General**: Barra de progreso agregada
- **Estadísticas**: Objetivos logrados, en progreso, sin iniciar, con regresión
- **Por Objetivo**: Tarjetas individuales con:
  - Nivel de progreso actual
  - Porcentaje de completitud
  - Última fecha de evaluación
  - Total de evaluaciones
  - Indicador de evaluación reciente
- **Recomendaciones**: Alertas automáticas para objetivos que requieren atención

## 📁 Estructura del Proyecto

### Backend (NestJS)

```
src/
├── modules/
│   ├── patients/           # Gestión de pacientes
│   │   ├── entities/
│   │   │   ├── patient.entity.ts
│   │   │   ├── patient-goal.entity.ts
│   │   │   └── goal-progress.entity.ts  # ⭐ Tracking de progreso
│   │   ├── patients.service.ts
│   │   └── patients.controller.ts
│   │
│   ├── goal-tracking/     # ⭐ Módulo de tracking de objetivos
│   │   ├── dto/
│   │   │   ├── create-goal-progress.dto.ts
│   │   │   ├── update-goal-progress.dto.ts
│   │   │   └── goal-compliance-report.dto.ts
│   │   ├── goal-tracking.service.ts
│   │   ├── goal-tracking.controller.ts
│   │   └── goal-tracking.module.ts
│   │
│   ├── mtpr/              # Master Treatment Plan Review
│   │   ├── mtpr.service.ts  # ⭐ Con validación de objetivos
│   │   └── mtpr.controller.ts
│   │
│   └── notes/             # Generación de notas
│       ├── notes.service.ts
│       └── templates/
│
└── common/
    ├── entities/base.entity.ts
    └── services/
```

### Frontend (Next.js)

```
src/
├── app/
│   ├── pacientes/
│   │   └── [id]/
│   │       └── goals-compliance/  # ⭐ Página de cumplimiento
│   │           └── page.tsx
│   │
│   └── layout.tsx
│
├── components/
│   ├── goals/             # ⭐ Componentes de objetivos
│   │   ├── goal-compliance-tracker.tsx
│   │   └── index.ts
│   │
│   ├── mtpr/              # ⭐ Con integración de validación
│   │   └── mtpr-generator.tsx
│   │
│   └── ui/                # Componentes base (Radix UI)
│
└── lib/
    ├── services/
    │   ├── goal-tracking-service.ts  # ⭐ Servicio de API
    │   ├── patients-service.ts
    │   └── index.ts
    │
    └── types.ts           # ⭐ Tipos de Goal Tracking
```

## 🔌 API Documentation

### Goal Tracking Endpoints

#### Crear Evaluación de Progreso
```http
POST /goal-tracking
Content-Type: application/json

{
  "patientGoalId": "uuid",
  "assessmentDate": "2025-01-15",
  "progressLevel": "Moderate Progress",
  "percentageComplete": 55,
  "evidence": "El paciente muestra mejora en...",
  "notes": "Continuar con el plan actual",
  "assessedBy": "Dr. Smith"
}
```

#### Obtener Reporte de Cumplimiento
```http
GET /goal-tracking/patient/:patientId/compliance

Response:
{
  "patientId": "uuid",
  "patientName": "John Doe",
  "totalGoals": 4,
  "goalsAchieved": 1,
  "goalsInProgress": 2,
  "goalsNotStarted": 0,
  "goalsWithRegression": 1,
  "overallCompletionPercentage": 58,
  "lastReviewDate": "2025-01-15",
  "goals": [...],
  "recommendations": [...],
  "needsAttention": true
}
```

#### Historial de Progreso
```http
GET /goal-tracking/goal/:goalId/history
```

#### Validar Cumplimiento
```http
GET /goal-tracking/goal/:goalId/validation
```

#### Actualizar Evaluación
```http
PUT /goal-tracking/:progressId
```

#### Eliminar Evaluación
```http
DELETE /goal-tracking/:progressId
```

Para ver la documentación completa de la API, acceder a:
- Swagger UI: http://localhost:3000/api (cuando esté configurado)

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autores

- **Equipo de Desarrollo** - [wWordDevw](https://github.com/wWordDevw)

## 🙏 Agradecimientos

- Google Generative AI por la integración con Gemini
- Comunidad de NestJS y Next.js
- Todos los contribuidores del proyecto

---

**Nota**: Este sistema fue diseñado específicamente para clínicas de terapia PHP/IOP y cumple con los estándares de documentación clínica requeridos.

Para soporte o preguntas, abrir un issue en: https://github.com/wWordDevw/terap-ia/issues
