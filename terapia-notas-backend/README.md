# 📋 Terapia Nota - Backend System

Sistema backend para la gestión automatizada de notas terapéuticas, asistencia y documentación de pacientes en programas PHP (Partial Hospitalization Program) e IOP (Intensive Outpatient Program).

## 🚀 Características Principales

### ✅ Gestión de Grupos (RF-001 a RF-003)
- Creación de grupos PHP o IOP con turnos Mañana/Tarde
- Gestión de semanas de trabajo
- Horarios personalizados de actividades por día
- PHP: Lunes a Viernes (Viernes genera 2 notas)
- IOP: Lunes a Jueves (Jueves genera 2 notas)

### 👥 Gestión de Pacientes (RF-004 a RF-006)
- Perfiles completos de pacientes
- 4 Goals (metas) por paciente
- Diagnósticos ICD-10
- Gestión de documentos
- Control automático de discharge/alta

### 📝 Registro de Asistencia (RF-007 a RF-009)
- Marcación diaria: P (Presente), A (Ausente), D (Discharge)
- Justificaciones de ausencias
- Bloqueo de cambios después del registro
- Marcado automático de discharge

### 📄 Generación de Notas Diarias (RF-010 a RF-017)
- Generación automática semanal
- Una nota por día para todo el grupo
- Descarga en formato Word (.docx)
- Rotación de goals semanalmente
- Evaluación conductual personalizada
- Alternancia inteligente de párrafos (sin repetición)

### 📊 MTPR - Master Treatment Plan Review (RF-018 a RF-026)
- Calendario automático: 18 días primer MTPR, luego cada 30 días
- Solo días hábiles (lunes a sábado)
- Validación de asistencia del paciente
- Progresión automática de progress
- Gestión de firmas digitales

### 🏥 Multidisciplinario (RF-027 a RF-033)
- Sincronizado con calendario MTPR
- Máximo 2 objetivos por goal
- Una página por goal
- Formato Word descargable

## 🛠️ Stack Tecnológico

- **Framework**: NestJS 11
- **Base de Datos**: PostgreSQL 16
- **ORM**: TypeORM
- **Runtime**: Node.js 24+
- **Lenguaje**: TypeScript

## 📋 Prerequisitos

- Node.js 24.3.0 o superior
- npm 11.4.2 o superior
- PostgreSQL 16
- Git

## 🔧 Instalación

### 1. Clonar repositorio

```bash
git clone <repository-url>
cd terapia-nota-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y ajusta los valores:

```bash
cp .env.example .env
```

Edita `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password_aqui
DB_DATABASE=terapia_nota_db

PORT=3000
NODE_ENV=development

JWT_SECRET=tu_secreto_seguro_aqui
JWT_EXPIRES_IN=24h
```

### 4. Instalar base de datos

#### Opción A: Script automatizado (Recomendado)

```bash
npm run db:install
```

#### Opción B: Manual

```bash
cd database
chmod +x install.sh
./install.sh
```

Esto creará:
- ✅ Base de datos `terapia_nota_db`
- ✅ 33 tablas con relaciones
- ✅ 7 vistas optimizadas
- ✅ 8 triggers automáticos
- ✅ Datos de ejemplo (opcional)

### 5. Iniciar servidor

```bash
# Modo desarrollo (con auto-reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

El servidor estará disponible en: `http://localhost:3000`

### 🐳 Opción Docker (Recomendado para desarrollo)

Si prefieres usar Docker y evitar configurar PostgreSQL localmente:

```bash
# Iniciar todo con Docker Compose
npm run docker:up

# Ver logs
npm run docker:logs

# Detener contenedores
npm run docker:down

# Modo desarrollo con hot-reload
npm run docker:dev
```

**Ventajas de Docker**:
- ✅ PostgreSQL 16 incluido y auto-configurado
- ✅ Base de datos inicializada automáticamente
- ✅ No requiere instalación local de PostgreSQL
- ✅ Ambiente consistente entre desarrolladores

Ver [DOCKER-SETUP.md](./DOCKER-SETUP.md) para documentación completa de Docker.

## 📁 Estructura del Proyecto

```
terapia-nota-backend/
├── database/
│   ├── schema.sql          # Definición de tablas
│   ├── views.sql           # Vistas SQL
│   ├── triggers.sql        # Triggers y funciones
│   ├── queries.sql         # Consultas comunes
│   ├── seed.sql            # Datos de ejemplo
│   ├── install.sh          # Script de instalación
│   └── README.md           # Documentación de BD
├── src/
│   ├── config/
│   │   └── database.config.ts  # Configuración TypeORM
│   ├── app.module.ts       # Módulo principal
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts             # Punto de entrada
├── .env                    # Variables de entorno
├── .env.example            # Plantilla de variables
├── package.json
├── tsconfig.json
└── README.md               # Este archivo
```

## 🗄️ Base de Datos

### Estructura Principal

**33 Tablas** organizadas en:

1. **Configuración**: clinics, users
2. **Grupos**: groups, group_weeks, group_schedules
3. **Pacientes**: patients, patient_goals, patient_diagnoses, patient_documents
4. **Actividades**: activities, subactivities, activity_paragraphs
5. **Asistencia**: attendance, absence_reasons
6. **MTPR**: mtpr_schedules, multidisciplinary_schedules, signatures
7. **Control**: paragraph_usage_history, generated_responses_history
8. **Auditoría**: audit_log

### Triggers Automáticos

1. **calculate_mtpr_dates**: Calcula automáticamente fechas de MTPR
2. **prevent_locked_attendance_update**: Bloquea cambios en asistencia
3. **auto_mark_discharge_attendance**: Marca discharge automáticamente
4. **audit_patient_changes**: Registra cambios para auditoría
5. **update_updated_at_column**: Actualiza timestamps
6. **validate_attendance_for_mtpr**: Valida asistencia antes de MTPR
7. **prevent_attendance_after_discharge**: Evita asistencia post-discharge

Ver más detalles en [database/README.md](database/README.md)

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run start:dev         # Iniciar en modo desarrollo
npm run start:debug       # Iniciar con debugger

# Construcción
npm run build             # Compilar proyecto

# Base de datos
npm run db:install        # Instalar BD completa
npm run db:create         # Solo crear BD
npm run db:drop           # Eliminar BD
npm run db:reset          # Resetear BD completa

# Testing
npm run test              # Tests unitarios
npm run test:watch        # Tests en modo watch
npm run test:cov          # Coverage
npm run test:e2e          # Tests e2e

# Calidad de código
npm run lint              # Ejecutar ESLint
npm run format            # Formatear con Prettier
```

## 🔐 Usuarios de Prueba

Si instalaste los datos de ejemplo:

| Email | Password | Rol |
|-------|----------|-----|
| admin@terapia.com | password123 | admin |
| therapist1@terapia.com | password123 | therapist |
| nurse1@terapia.com | password123 | nurse |

⚠️ **IMPORTANTE**: Cambiar estos passwords en producción.

## 🚦 Endpoints API

### Health Check

```bash
GET http://localhost:3000
```

Respuesta:
```json
{
  "message": "Hello World!"
}
```

*Más endpoints serán documentados a medida que se desarrollen los módulos.*

## 📚 Requerimientos Funcionales

Este sistema implementa 42 requerimientos funcionales (RF-001 a RF-042) organizados en:

### Prioridad CRÍTICA (Fase 1)
- ✅ RF-001 a RF-009: Gestión de grupos y asistencia
- ✅ RF-010 a RF-017: Generación de notas diarias
- ✅ RF-037: Configuración de clínica

### Prioridad IMPORTANTE (Fase 2)
- ✅ RF-018 a RF-026: MTPR
- ✅ RF-027 a RF-033: Multidisciplinario

### Prioridad NECESARIA (Fase 3)
- ✅ RF-034 a RF-042: Validaciones y gestión de contenido

## 🔍 Próximos Pasos

1. **Crear entidades TypeORM** para todas las tablas
2. **Desarrollar módulos NestJS**:
   - ClinicsModule
   - GroupsModule
   - PatientsModule
   - AttendanceModule
   - NotesModule
   - MtprModule
3. **Implementar lógica de generación de documentos Word**
4. **Crear sistema de autenticación JWT**
5. **Desarrollar endpoints REST API**
6. **Agregar tests unitarios y e2e**

## 🐛 Solución de Problemas

### Error: Cannot connect to database

```bash
# Verificar que PostgreSQL está corriendo
sudo service postgresql status

# En Windows/WSL
sudo service postgresql start

# Verificar credenciales en .env
cat .env
```

### Error: Database does not exist

```bash
npm run db:create
npm run db:install
```

### Error: TypeORM sync issues

En `.env` cambiar a:
```env
NODE_ENV=development
```

Esto habilitará `synchronize: true` en TypeORM.

## 📖 Documentación Adicional

- [Documentación de Base de Datos](database/README.md)
- [Requerimientos Funcionales](docs/requirements.md) *(próximamente)*
- [Guía de API](docs/api-guide.md) *(próximamente)*

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👥 Equipo

- **Backend Developer**: [Tu Nombre]
- **Database Architect**: [Tu Nombre]

## 📞 Contacto

Para soporte y consultas: [tu-email@example.com]

---

**Construido con** ❤️ **usando NestJS y PostgreSQL**
