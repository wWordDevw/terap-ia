# Base de Datos - Terapia Nota System

## 📋 Descripción

Este directorio contiene todos los scripts SQL necesarios para crear y configurar la base de datos PostgreSQL del sistema Terapia Nota.

## 📁 Archivos

- **schema.sql**: Definición completa de todas las tablas, índices y constraints
- **views.sql**: Vistas SQL para consultas optimizadas
- **triggers.sql**: Triggers y funciones para lógica de negocio automática
- **queries.sql**: Consultas SQL comunes documentadas
- **seed.sql**: Datos iniciales para desarrollo y pruebas
- **install.sh**: Script automatizado de instalación

## 🚀 Instalación Rápida

### Opción 1: Script Automatizado (Recomendado)

```bash
cd database
chmod +x install.sh
./install.sh
```

### Opción 2: Manual

```bash
# 1. Crear base de datos
createdb terapia_nota_db

# 2. Ejecutar scripts en orden
psql -d terapia_nota_db -f schema.sql
psql -d terapia_nota_db -f views.sql
psql -d terapia_nota_db -f triggers.sql
psql -d terapia_nota_db -f seed.sql  # Opcional: datos de ejemplo
```

## 📊 Estructura de la Base de Datos

### Tablas Principales

#### 1. Configuración
- `clinics`: Información de clínicas
- `users`: Usuarios del sistema (admin, therapist, nurse)

#### 2. Gestión de Grupos (RF-001 a RF-003)
- `groups`: Grupos PHP o IOP
- `group_weeks`: Semanas de trabajo
- `group_schedules`: Horarios de actividades

#### 3. Gestión de Pacientes (RF-004 a RF-006)
- `patients`: Información de pacientes
- `patient_goals`: 4 metas por paciente
- `patient_diagnoses`: Diagnósticos ICD-10
- `patient_documents`: Documentos subidos
- `group_patients`: Relación pacientes-grupos

#### 4. Actividades
- `activities`: Catálogo de actividades
- `subactivities`: Subactividades
- `activity_paragraphs`: Párrafos predefinidos

#### 5. Asistencia (RF-007 a RF-009)
- `attendance`: Registro diario (P/A/D)
- `absence_reasons`: Justificaciones de ausencias

#### 6. MTPR y Multidisciplinario (RF-018 a RF-033)
- `mtpr_schedules`: Calendario de MTPR
- `multidisciplinary_schedules`: Calendario Multidisciplinario
- `signatures`: Firmas digitales

#### 7. Gestión de Contenido (RF-034, RF-035)
- `paragraph_usage_history`: Evita repetición de párrafos
- `generated_responses_history`: Evita repetición de respuestas

#### 8. Auditoría
- `audit_log`: Registro de cambios

## 🔍 Vistas Disponibles

- `v_active_patients`: Pacientes activos con información completa
- `v_upcoming_mtprs`: Próximos MTRPs pendientes
- `v_weekly_attendance`: Asistencia semanal
- `v_group_week_patients`: Pacientes por grupo y semana
- `v_group_schedules`: Horarios de grupo
- `v_patient_goals`: Metas de pacientes
- `v_patient_diagnoses`: Diagnósticos de pacientes

## ⚡ Triggers Automáticos

1. **calculate_mtpr_dates**: Calcula automáticamente fechas de MTPR al crear paciente
   - Primer MTPR: 18 días después de admission_date
   - Siguientes: cada 30 días
   - Solo días hábiles (lunes a sábado)

2. **prevent_locked_attendance_update**: Bloquea modificación de asistencia registrada

3. **auto_mark_discharge_attendance**: Marca automáticamente con 'D' la asistencia en fecha de discharge

4. **audit_patient_changes**: Registra cambios en pacientes

5. **update_updated_at_column**: Actualiza timestamp automáticamente

6. **validate_attendance_for_mtpr**: Valida que paciente estuvo presente antes de generar MTPR

7. **prevent_attendance_after_discharge**: Evita registrar asistencia después del discharge

## 🔐 Usuarios de Prueba

Si cargaste los datos de ejemplo (`seed.sql`):

| Email | Password | Rol |
|-------|----------|-----|
| admin@terapia.com | password123 | admin |
| therapist1@terapia.com | password123 | therapist |
| nurse1@terapia.com | password123 | nurse |

## 📝 Consultas Útiles

Ver archivo `queries.sql` para consultas documentadas incluyendo:

- Obtener pacientes de un grupo
- Obtener horario de actividades
- Registrar asistencia
- Obtener próximo párrafo no usado
- Verificar respuestas duplicadas
- Generar información para MTPR
- Reportes y estadísticas

## 🔧 Mantenimiento

### Backup

```bash
pg_dump terapia_nota_db > backup_$(date +%Y%m%d).sql
```

### Restaurar

```bash
psql terapia_nota_db < backup_20250105.sql
```

### Limpiar y reinstalar

```bash
dropdb terapia_nota_db
./install.sh
```

## 📌 Notas Importantes

1. **Sincronización con TypeORM**: El archivo `database.config.ts` en NestJS tiene `synchronize: true` solo en desarrollo. En producción debe ser `false` y usar migraciones.

2. **Extensiones requeridas**:
   - uuid-ossp (para UUIDs)
   - pgcrypto (para hashing de passwords)

3. **Seguridad**: Cambiar passwords de usuarios de prueba en producción.

4. **Performance**: Los índices están optimizados para las consultas más frecuentes.

## 🆘 Solución de Problemas

### Error: "database already exists"
```bash
dropdb terapia_nota_db
createdb terapia_nota_db
```

### Error: "permission denied"
Asegúrate de tener permisos de superusuario o usar el usuario correcto:
```bash
psql -U postgres
```

### Error: "extension does not exist"
```sql
CREATE EXTENSION "uuid-ossp";
CREATE EXTENSION "pgcrypto";
```

## 📚 Referencias

- Requerimientos Funcionales: RF-001 a RF-042
- PostgreSQL 16 Documentation: https://www.postgresql.org/docs/16/
- TypeORM Documentation: https://typeorm.io/
