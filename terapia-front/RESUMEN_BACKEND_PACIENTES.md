# 📋 Resumen de Cambios para el Backend - Funcionalidades de Pacientes

## 🎯 Funcionalidades Implementadas en el Frontend

### ✅ 1. **Cancelación Automática de Pacientes**
- **Descripción:** Los pacientes se cancelan automáticamente un día después de su fecha de alta
- **Comportamiento:** Ya no se generan más notas para pacientes cancelados
- **Notificaciones:** El sistema muestra alertas cuando un paciente es cancelado automáticamente

### ✅ 2. **Apartado de Notas del Paciente**
- **Descripción:** Sistema completo de notas para cada paciente
- **Tipos de notas:** General, Médica, Terapéutica, Administrativa
- **Niveles de privacidad:** Pública, Privada, Confidencial
- **Funcionalidades:** Crear, editar, eliminar, filtrar, etiquetar

### ✅ 3. **Campos Adicionales en Creación de Pacientes**
- **Número de paciente:** Campo único para identificación
- **Clínica como select:** Dropdown con clínicas disponibles
- **Validaciones:** Campos requeridos y validaciones específicas

---

## 🔧 Cambios Necesarios en el Backend

### 1. **Entidad Paciente (Patient Entity)**

```typescript
// Agregar estos campos a la entidad Patient
export class Patient {
  // ... campos existentes ...
  
  @Column({ unique: true })
  numeroPaciente: string; // Nuevo campo
  
  @Column()
  clinicaId: string; // Nuevo campo
  
  @Column()
  clinicaNombre: string; // Nuevo campo
  
  @Column({ nullable: true })
  fechaCancelacion?: Date; // Nuevo campo
  
  @OneToMany(() => PatientNote, note => note.patient)
  notas: PatientNote[]; // Nueva relación
}
```

### 2. **Entidad Clínica (Clinic Entity)**

```typescript
export class Clinic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  direccion: string;

  @Column()
  telefono: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ default: true })
  activa: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @OneToMany(() => Patient, patient => patient.clinica)
  pacientes: Patient[];
}
```

### 3. **Entidad Nota del Paciente (PatientNote Entity)**

```typescript
export class PatientNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fecha: Date;

  @Column()
  autor: string;

  @Column()
  autorRol: string;

  @Column()
  titulo: string;

  @Column('text')
  contenido: string;

  @Column({
    type: 'enum',
    enum: ['general', 'medica', 'terapeutica', 'administrativa'],
    default: 'general'
  })
  tipo: 'general' | 'medica' | 'terapeutica' | 'administrativa';

  @Column({
    type: 'enum',
    enum: ['publica', 'privada', 'confidencial'],
    default: 'publica'
  })
  privacidad: 'publica' | 'privada' | 'confidencial';

  @Column('simple-array', { nullable: true })
  tags?: string[];

  @ManyToOne(() => Patient, patient => patient.notas)
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column()
  patientId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 4. **DTOs Actualizados**

#### CreatePatientDto
```typescript
export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  numeroPaciente: string;

  @IsString()
  @IsNotEmpty()
  clinicaId: string;

  @IsDateString()
  nacimiento: string;

  @IsDateString()
  ingreso: string;

  @IsOptional()
  @IsDateString()
  discharge?: string;

  @IsOptional()
  @IsString()
  seguro?: string;

  @IsOptional()
  @IsString()
  notasAdicionales?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDiagnosticoDto)
  diagnosticos?: CreateDiagnosticoDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  goals?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateContactoEmergenciaDto)
  contactoEmergencia?: CreateContactoEmergenciaDto;
}
```

#### CreatePatientNoteDto
```typescript
export class CreatePatientNoteDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  contenido: string;

  @IsEnum(['general', 'medica', 'terapeutica', 'administrativa'])
  @IsOptional()
  tipo?: 'general' | 'medica' | 'terapeutica' | 'administrativa';

  @IsEnum(['publica', 'privada', 'confidencial'])
  @IsOptional()
  privacidad?: 'publica' | 'privada' | 'confidencial';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
```

### 5. **Endpoints Necesarios**

#### Pacientes
```typescript
// GET /api/v1/patients - Listar pacientes
// GET /api/v1/patients/:id - Obtener paciente por ID
// POST /api/v1/patients - Crear paciente
// PUT /api/v1/patients/:id - Actualizar paciente
// DELETE /api/v1/patients/:id - Eliminar paciente
// GET /api/v1/patients/:id/notes - Obtener notas del paciente
// POST /api/v1/patients/:id/notes - Crear nota para paciente
// PUT /api/v1/patients/:id/notes/:noteId - Actualizar nota
// DELETE /api/v1/patients/:id/notes/:noteId - Eliminar nota
```

#### Clínicas
```typescript
// GET /api/v1/clinics - Listar clínicas
// GET /api/v1/clinics/:id - Obtener clínica por ID
// POST /api/v1/clinics - Crear clínica
// PUT /api/v1/clinics/:id - Actualizar clínica
// DELETE /api/v1/clinics/:id - Eliminar clínica
```

### 6. **Servicios Necesarios**

#### PatientService
```typescript
@Injectable()
export class PatientService {
  // ... métodos existentes ...

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    // Validar que el número de paciente sea único
    // Validar que la clínica exista
    // Crear el paciente con los nuevos campos
  }

  async addNote(patientId: string, createNoteDto: CreatePatientNoteDto): Promise<PatientNote> {
    // Crear nota para el paciente
  }

  async getNotes(patientId: string): Promise<PatientNote[]> {
    // Obtener todas las notas del paciente
  }

  async updateNote(patientId: string, noteId: string, updateNoteDto: UpdatePatientNoteDto): Promise<PatientNote> {
    // Actualizar nota específica
  }

  async deleteNote(patientId: string, noteId: string): Promise<void> {
    // Eliminar nota específica
  }

  async checkCancellations(): Promise<void> {
    // Verificar pacientes que deben ser cancelados automáticamente
    // Este método se ejecutaría en un cron job
  }
}
```

#### ClinicService
```typescript
@Injectable()
export class ClinicService {
  async findAll(): Promise<Clinic[]> {
    // Obtener todas las clínicas activas
  }

  async findOne(id: string): Promise<Clinic> {
    // Obtener clínica por ID
  }

  async create(createClinicDto: CreateClinicDto): Promise<Clinic> {
    // Crear nueva clínica
  }

  async update(id: string, updateClinicDto: UpdateClinicDto): Promise<Clinic> {
    // Actualizar clínica
  }

  async remove(id: string): Promise<void> {
    // Eliminar clínica (soft delete)
  }
}
```

### 7. **Cron Job para Cancelación Automática**

```typescript
@Injectable()
export class PatientCancellationService {
  constructor(
    private readonly patientService: PatientService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  @Cron('0 0 * * *') // Ejecutar todos los días a medianoche
  async handleCancellations() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Buscar pacientes con discharge de ayer
    const patientsToCancel = await this.patientService.findByDischargeDate(yesterday);

    for (const patient of patientsToCancel) {
      await this.patientService.update(patient.id, {
        fechaCancelacion: today,
      });

      // Aquí podrías enviar notificaciones, logs, etc.
      console.log(`Paciente ${patient.nombre} cancelado automáticamente`);
    }
  }
}
```

### 8. **Validaciones Adicionales**

```typescript
// Validar que el número de paciente sea único
@IsUnique('numeroPaciente', Patient, 'El número de paciente ya existe')

// Validar que la clínica exista
@IsExists('id', Clinic, 'La clínica no existe')

// Validar fechas
@IsDateString()
@IsBefore('ingreso', { message: 'La fecha de nacimiento debe ser anterior al ingreso' })
nacimiento: string;
```

---

## 🚀 Orden de Implementación Recomendado

1. **Crear entidad Clinic** y sus DTOs
2. **Actualizar entidad Patient** con los nuevos campos
3. **Crear entidad PatientNote** y sus DTOs
4. **Implementar ClinicService** y endpoints
5. **Actualizar PatientService** con nuevos métodos
6. **Implementar endpoints de notas**
7. **Configurar cron job** para cancelación automática
8. **Agregar validaciones** y constraints
9. **Crear migraciones** de base de datos
10. **Probar integración** con el frontend

---

## 📊 Base de Datos

### Tablas a crear/modificar:
- `clinics` (nueva)
- `patients` (modificar - agregar campos)
- `patient_notes` (nueva)

### Índices recomendados:
- `patients.numero_paciente` (único)
- `patients.clinica_id` (índice)
- `patient_notes.patient_id` (índice)
- `patient_notes.fecha` (índice)

---

## 🔗 Integración con Frontend

El frontend ya está preparado para consumir estos endpoints:
- ✅ Formulario de creación con nuevos campos
- ✅ Componente de notas funcional
- ✅ Hook para cancelación automática
- ✅ Notificaciones integradas

Solo necesitas implementar los endpoints en el backend siguiendo la estructura de DTOs proporcionada.
