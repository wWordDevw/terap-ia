# 🏗️ Arquitectura del Proyecto - Terapia Nota Backend

## 📐 Principios de Diseño

Este proyecto sigue los principios de **Clean Code** y **Clean Architecture**:

- **Separación de responsabilidades**: Cada capa tiene una responsabilidad específica
- **Modularidad**: Código organizado en módulos independientes
- **Escalabilidad**: Fácil de extender con nuevas funcionalidades
- **Mantenibilidad**: Código claro, documentado y fácil de entender
- **Testabilidad**: Estructura que facilita la creación de tests

## 🗂️ Estructura del Proyecto

```
src/
├── common/                      # Código compartido entre módulos
│   ├── decorators/             # Decoradores personalizados
│   ├── filters/                # Filtros de excepciones
│   ├── guards/                 # Guards de autenticación/autorización
│   ├── interceptors/           # Interceptores HTTP
│   ├── pipes/                  # Pipes de transformación
│   └── entities/
│       └── base.entity.ts      # Entidad base con id, timestamps
│
├── config/                      # Configuraciones
│   └── database.config.ts      # Configuración de TypeORM/PostgreSQL
│
├── modules/                     # Módulos de la aplicación
│   ├── clinics/                # Módulo de Clínicas (RF-037)
│   │   ├── entities/
│   │   │   └── clinic.entity.ts
│   │   ├── dto/
│   │   │   ├── create-clinic.dto.ts
│   │   │   └── update-clinic.dto.ts
│   │   ├── clinics.controller.ts
│   │   ├── clinics.service.ts
│   │   └── clinics.module.ts
│   │
│   ├── users/                   # Módulo de Usuarios
│   │   └── entities/
│   │       └── user.entity.ts
│   │
│   ├── groups/                  # Módulo de Grupos (RF-001 a RF-003)
│   │   └── entities/
│   │       ├── group.entity.ts
│   │       ├── group-week.entity.ts
│   │       ├── group-schedule.entity.ts
│   │       └── group-patient.entity.ts
│   │
│   ├── patients/                # Módulo de Pacientes (RF-004 a RF-006)
│   │   └── entities/
│   │       ├── patient.entity.ts
│   │       ├── patient-goal.entity.ts
│   │       ├── patient-diagnosis.entity.ts
│   │       └── patient-document.entity.ts
│   │
│   ├── activities/              # Módulo de Actividades
│   │   └── entities/
│   │       ├── activity.entity.ts
│   │       ├── subactivity.entity.ts
│   │       └── activity-paragraph.entity.ts
│   │
│   ├── attendance/              # Módulo de Asistencia (RF-007 a RF-009)
│   │   └── entities/
│   │       ├── attendance.entity.ts
│   │       └── absence-reason.entity.ts
│   │
│   ├── mtpr/                    # Módulo MTPR (RF-018 a RF-026)
│   │   └── entities/
│   │
│   └── notes/                   # Módulo de Generación de Notas
│       └── entities/
│
├── app.module.ts                # Módulo raíz
└── main.ts                      # Punto de entrada
```

## 🔄 Flujo de Datos (Request-Response)

```
┌──────────┐
│  Client  │
└────┬─────┘
     │ HTTP Request
     ▼
┌──────────────────┐
│   Controller     │ ◄─── Validación (ValidationPipe)
│  (Capa REST)     │
└────┬─────────────┘
     │ Llama al servicio
     ▼
┌──────────────────┐
│    Service       │ ◄─── Lógica de negocio
│ (Capa de lógica) │
└────┬─────────────┘
     │ Usa Repository
     ▼
┌──────────────────┐
│   Repository     │ ◄─── TypeORM (ORM)
│  (Capa de datos) │
└────┬─────────────┘
     │ SQL Query
     ▼
┌──────────────────┐
│   PostgreSQL     │
│   (Base de datos)│
└──────────────────┘
```

## 📦 Capas de la Arquitectura

### 1. **Capa de Presentación (Controllers)**

**Responsabilidad**: Manejar peticiones HTTP y respuestas

```typescript
@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Post()
  create(@Body() dto: CreateClinicDto) {
    return this.clinicsService.create(dto);
  }
}
```

**Características**:
- Define los endpoints REST
- Valida datos de entrada (DTOs)
- Maneja códigos de estado HTTP
- Parsea parámetros (UUID, Query params, etc.)

### 2. **Capa de Lógica de Negocio (Services)**

**Responsabilidad**: Implementar reglas de negocio y orquestación

```typescript
@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,
  ) {}

  async create(dto: CreateClinicDto): Promise<Clinic> {
    const clinic = this.clinicRepository.create(dto);
    return await this.clinicRepository.save(clinic);
  }
}
```

**Características**:
- Lógica de negocio centralizada
- Validaciones complejas
- Manejo de transacciones
- Orquestación entre múltiples repositorios

### 3. **Capa de Acceso a Datos (Repositories)**

**Responsabilidad**: Interactuar con la base de datos

```typescript
@InjectRepository(Clinic)
private readonly clinicRepository: Repository<Clinic>
```

**Características**:
- Abstracción de TypeORM
- Queries SQL automáticas
- Relaciones entre entidades
- Transacciones

### 4. **Capa de Dominio (Entities)**

**Responsabilidad**: Representar el modelo de datos

```typescript
@Entity('clinics')
export class Clinic extends BaseEntity {
  @Column()
  clinicName: string;

  @OneToMany(() => User, user => user.clinic)
  users: User[];
}
```

**Características**:
- Mapeo ORM con decoradores
- Relaciones entre entidades
- Validaciones a nivel de base de datos

### 5. **Capa de Transferencia de Datos (DTOs)**

**Responsabilidad**: Validar y transformar datos de entrada/salida

```typescript
export class CreateClinicDto {
  @IsString()
  @MaxLength(255)
  clinicName: string;

  @IsEmail()
  @IsOptional()
  email?: string;
}
```

**Características**:
- Validación con class-validator
- Transformación de tipos
- Documentación implícita de la API

## 🔌 Inyección de Dependencias

NestJS usa un sistema de **Dependency Injection** robusto:

```typescript
// El módulo registra providers y controllers
@Module({
  imports: [TypeOrmModule.forFeature([Clinic])],
  controllers: [ClinicsController],
  providers: [ClinicsService],
  exports: [ClinicsService], // Exportar para otros módulos
})
export class ClinicsModule {}

// El servicio se inyecta automáticamente
@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}
  // NestJS inyecta ClinicsService automáticamente
}
```

**Ventajas**:
- Bajo acoplamiento
- Fácil de testear (mocking)
- Gestión automática del ciclo de vida

## 🛡️ Validación y Transformación

### Validación Global

```typescript
// main.ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,              // Remueve campos no definidos
    forbidNonWhitelisted: true,   // Error si hay campos extras
    transform: true,              // Transforma tipos automáticamente
  }),
);
```

### DTOs con Validación

```typescript
export class CreateClinicDto {
  @IsString()           // Debe ser string
  @MaxLength(255)       // Máximo 255 caracteres
  clinicName: string;

  @IsEmail()           // Debe ser email válido
  @IsOptional()        // Campo opcional
  email?: string;
}
```

## 🔗 Relaciones entre Entidades

### One-to-Many

```typescript
// Clinic tiene muchos Users
@Entity('clinics')
export class Clinic {
  @OneToMany(() => User, user => user.clinic)
  users: User[];
}

// User pertenece a una Clinic
@Entity('users')
export class User {
  @ManyToOne(() => Clinic, clinic => clinic.users)
  clinic: Clinic;
}
```

### Many-to-Many (con tabla intermedia)

```typescript
// Group <-> Patient (a través de GroupPatient)
@Entity('group_patients')
export class GroupPatient {
  @ManyToOne(() => Group)
  group: Group;

  @ManyToOne(() => Patient)
  patient: Patient;
}
```

## 📝 Patrones Implementados

### 1. **Repository Pattern**
TypeORM actúa como capa de abstracción sobre SQL.

### 2. **DTO Pattern**
Validación y transformación de datos de entrada/salida.

### 3. **Module Pattern**
Encapsulación de funcionalidad relacionada.

### 4. **Dependency Injection**
Gestión automática de dependencias.

### 5. **Soft Delete**
Desactivación en lugar de eliminación física.

```typescript
async remove(id: string): Promise<void> {
  const clinic = await this.findOne(id);
  clinic.isActive = false; // Soft delete
  await this.clinicRepository.save(clinic);
}
```

## 🔐 Seguridad

### Variables de Entorno

```typescript
// .env
DB_PASSWORD=secure_password
JWT_SECRET=super_secret_key
```

### Exclusión de Campos Sensibles

```typescript
@Entity('users')
export class User {
  @Exclude() // No se expone en respuestas
  @Column()
  passwordHash: string;
}
```

## 🧪 Testing (Próximamente)

Estructura de tests:

```
src/modules/clinics/
├── clinics.controller.spec.ts    # Tests del controller
├── clinics.service.spec.ts       # Tests del service
└── __mocks__/                    # Mocks para testing
```

## 📊 Base de Datos

### Naming Conventions

- **Tablas**: `snake_case` plural (ej: `patient_goals`)
- **Columnas**: `snake_case` (ej: `first_name`)
- **Entities**: `PascalCase` singular (ej: `PatientGoal`)
- **Propiedades**: `camelCase` (ej: `firstName`)

TypeORM maneja la conversión automáticamente.

## 🚀 Próximos Pasos

1. ✅ Completar módulos restantes (Groups, Patients, Activities, Attendance)
2. ✅ Implementar autenticación JWT
3. ✅ Crear módulo de generación de documentos Word
4. ✅ Implementar MTPR y Multidisciplinario
5. ✅ Agregar tests unitarios y e2e
6. ✅ Documentación Swagger/OpenAPI

## 📚 Referencias

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
