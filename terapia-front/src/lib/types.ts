// ========================================
// TIPOS PRINCIPALES DEL DOMINIO
// ========================================

export interface Grupo {
  id: string;
  clinica: { nombre: string; logoUrl?: string };
  tipo: 'PHP' | 'IOP';
  turno: 'Mañana' | 'Tarde';
  semanaInicio: string;
  horarios: Record<string, { actividades: Actividad[] }>;
  pacientesIds: string[];
  fechaCreacion: string;
  estado: 'Activo' | 'Archivado' | 'Inactivo';
}

export interface Paciente {
  id: string;
  nombre: string;
  numeroClinica: string;
  numeroPaciente: string; // Nuevo campo: número único del paciente
  clinicaId: string; // Nuevo campo: ID de la clínica
  clinicaNombre: string; // Nuevo campo: nombre de la clínica
  nacimiento: string;
  ingreso: string;
  discharge?: string;
  fechaCancelacion?: string; // Nuevo campo: fecha de cancelación automática
  diagnosticos: Diagnostico[];
  goals: string[];
  documentos: Documento[];
  firmas?: Firma[];
  contactoEmergencia?: ContactoEmergencia;
  seguro?: string;
  notasAdicionales?: string;
  notas: NotaPaciente[]; // Nuevo campo: apartado de notas del paciente
}

export interface Actividad {
  id: string;
  codigo: string;     // Iniciales/código nota por franja (ej: 'GS', 'CB')
  titulo: string;     // Título completo (ej: 'Group Skills: Communication')
  descripcion?: string;
  duracion?: number;  // Duración en minutos
  defaultTime?: string; // ✅ NUEVO: Hora predeterminada (formato HH:mm)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}


// ========================================
// TIPOS DE ASISTENCIA Y JUSTIFICACIONES
// ========================================

export type AsistenciaDia = 'P' | 'A' | 'D'; // Presente, Ausente, Discharge

export type Justificacion = 
  | 'Medical appointment'
  | 'Family trip'
  | 'Hospitalized'
  | 'Personal emergency'
  | 'Court appearance';

export interface RegistroAsistencia {
  pacienteId: string;
  fecha: string; // ISO date string
  estado: AsistenciaDia;
  justificacion?: {
    tipo: Justificacion;
    rango?: {
      desde: string;
      hasta: string;
    };
    notas?: string;
  };
  registradoPor?: string;
  fechaRegistro?: string;
}




export interface Diagnostico {
  codigo: string;       // Código ICD-10 (ej: "F32.9")
  descripcion: string;  // Descripción completa
  tipo: 'Primario' | 'Secundario';
  fecha?: string;       // Fecha de diagnóstico
  activo: boolean;
}


// ========================================
// TIPOS DE DOCUMENTOS Y FIRMAS
// ========================================

export interface Documento {
  id: string;
  nombre: string;
  url: string;
  fecha: string;
  tipo: 'pdf' | 'docx' | 'doc' | 'jpg' | 'png';
  tamaño?: number; // En bytes
  descripcion?: string;
  subidoPor?: string;
}

export interface Firma {
  nombre: string;
  rol: string;
  imagenUrl: string;
  fecha: string;
  licencia?: string;
}

export interface ContactoEmergencia {
  nombre: string;
  relacion: string;
  telefono: string;
  email?: string;
}

export interface NotaPaciente {
  id: string;
  fecha: string;
  autor: string;
  autorRol: string;
  titulo: string;
  contenido: string;
  tipo: 'general' | 'medica' | 'terapeutica' | 'administrativa';
  privacidad: 'publica' | 'privada' | 'confidencial';
  tags?: string[];
  archivosAdjuntos?: Documento[];
}

export interface Clinica {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  logoUrl?: string;
  activa: boolean;
  fechaCreacion: string;
}

// ========================================
// TIPOS DE MÉTRICAS Y PROGRESO
// ========================================

export type MetricaValor = 'Moderate' | 'Minor';

export interface MetricasType {
  cooperation: MetricaValor;
  motivation: MetricaValor;
  focus: MetricaValor;
  peer: MetricaValor;
}

export type TipoProgreso = 'No progress' | 'Minimal progress' | 'Moderate progress';

export interface ProgresoMTPR {
  codigo: string; // Código ICD-10
  estado: TipoProgreso;
  notas?: string;
}

// ========================================
// TIPOS DE GOAL TRACKING Y CUMPLIMIENTO
// ========================================

/**
 * Niveles de progreso para los objetivos del paciente
 */
export type ProgressLevel =
  | 'Not Started'
  | 'No Progress'
  | 'Minimal Progress'
  | 'Moderate Progress'
  | 'Significant Progress'
  | 'Achieved'
  | 'Regression';

/**
 * Evaluación de progreso de un objetivo del paciente
 */
export interface GoalProgress {
  id: string;
  patientGoalId: string;
  assessmentDate: string; // ISO date string
  progressLevel: ProgressLevel;
  percentageComplete: number; // 0-100
  evidence?: string;
  notes?: string;
  assessedBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Información detallada de un objetivo del paciente con su progreso
 */
export interface GoalInfo {
  goalId: string;
  goalNumber: number; // 1-4
  goalText: string;
  currentProgress: ProgressLevel;
  percentageComplete: number; // 0-100
  lastAssessmentDate: string | null;
  totalAssessments: number;
  hasRecentAssessment: boolean; // ¿Tiene evaluación en los últimos 30 días?
}

/**
 * Reporte de cumplimiento de objetivos de un paciente
 */
export interface GoalComplianceReport {
  patientId: string;
  patientName: string;
  totalGoals: number; // Siempre 4
  goalsAchieved: number;
  goalsInProgress: number;
  goalsNotStarted: number;
  goalsWithRegression: number;
  overallCompletionPercentage: number; // 0-100
  lastReviewDate: string | null;
  goals: GoalInfo[];
  recommendations: string[];
  needsAttention: boolean; // True si hay objetivos sin progreso o con regresión
}

// ========================================
// TIPOS DE NOTAS Y DOCUMENTACIÓN
// ========================================

export interface NotaDiaria {
  id: string;
  fecha: string;
  grupoId: string;
  dia: string; // 'lun', 'mar', etc.
  pacientes: Array<{
    pacienteId: string;
    nombre: string;
    numeroClinica: string;
    unidades: number;
    icd10Primario: string;
    goalsSemana: string[]; // 4 goals rotativos
    metricas: MetricasType;
    actividades: Array<{
      actividad: Actividad;
      parrafoBase: string;
      respuestaCliente: string;
      goalVinculado: string;
    }>;
    parrafoFinal: string; // Progress was Minimal/Moderate
    tipoProgreso: 'Minimal' | 'Moderate';
  }>;
  generadoPor?: string;
  fechaGeneracion?: string;
  estado: 'Borrador' | 'Completado' | 'Enviado';
}

export interface DocumentoMTPR {
  id: string;
  pacienteId: string;
  numeroMTPR: number; // 1, 2, 3, etc.
  fecha: string;
  diagnosticos: ProgresoMTPR[];
  resumenProgreso: string;
  recomendaciones: string[];
  proximaFecha?: string;
  firmas: Firma[];
  estado: 'Pendiente' | 'Completado' | 'Enviado';
  generadoPor?: string;
  fechaGeneracion?: string;
}

export interface DocumentoMultidisciplinario {
  id: string;
  pacienteId: string;
  fecha: string;
  equipoTratamiento: Array<{
    nombre: string;
    rol: string;
    evaluacion: string;
    recomendaciones: string[];
  }>;
  planCoordinacion: string;
  objetivos: string[];
  firmas: Firma[];
  estado: 'Pendiente' | 'Completado' | 'Enviado';
}

// ========================================
// TIPOS DE UI Y COMPONENTES
// ========================================

export interface ModalState<T = any> {
  show: boolean;
  data?: T;
  loading?: boolean;
  error?: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface TableColumn<T = any> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

export interface FilterState {
  search: string;
  tipo?: 'PHP' | 'IOP';
  turno?: 'Mañana' | 'Tarde';
  estado?: 'Activo' | 'Archivado' | 'Inactivo';
  fechaDesde?: string;
  fechaHasta?: string;
}

// ========================================
// TIPOS DE CONFIGURACIÓN Y CONSTANTES
// ========================================

export interface TipoProgramaConfig {
  dias: string[];
  dobleDia: string;
  nombre: string;
  descripcion: string;
}

export interface ConfiguracionSistema {
  tiposPrograma: Record<'PHP' | 'IOP', TipoProgramaConfig>;
  coloresEstado: Record<string, string>;
  formatosFecha: Record<string, string>;
  limitesArchivo: {
    maxSize: number; // En bytes
    tiposPermitidos: string[];
  };
}

// ========================================
// TIPOS DE API Y ESTADO
// ========================================

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface LoadingState {
  grupos: boolean;
  pacientes: boolean;
  asistencia: boolean;
  documentos: boolean;
  general: boolean;
}

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// ========================================
// TIPOS DE HOOKS PERSONALIZADOS
// ========================================

export interface UseAsistenciaReturn {
  asistencia: Record<string, RegistroAsistencia>;
  setAsistencia: React.Dispatch<React.SetStateAction<Record<string, RegistroAsistencia>>>;
  updateAsistencia: (pacienteId: string, fecha: string, estado: AsistenciaDia, justificacion?: RegistroAsistencia['justificacion']) => void;
  getAsistencia: (pacienteId: string, fecha: string) => RegistroAsistencia | null;
  getEstadisticas: (fechas: string[], pacientesIds: string[]) => {
    presentes: number;
    ausentes: number;
    altas: number;
    porcentajeAsistencia: number;
  };
}

export interface UseMTPRDatesReturn {
  fechasMTPR: string[];
  proximaFecha: string | null;
  fechasPasadas: string[];
  fechasFuturas: string[];
  esFechaValida: (fecha: string) => boolean;
  getMTPRNumber: (fecha: string) => number;
}

// ========================================
// TIPOS DE VALIDACIÓN
// ========================================

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [field: string]: ValidationRule;
}

// ========================================
// TIPOS DE EVENTOS Y CALLBACKS
// ========================================

export type EventCallback<T = any> = (data: T) => void;

export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PageProps {
  params: { [key: string]: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// ========================================
// TIPOS PARA NUEVAS FUNCIONALIDADES
// ========================================

// Tipos para actividades con hora predeterminada
export interface CreateActivityDto {
  activityName: string;
  description?: string;
  defaultTime?: string; // Formato HH:mm
}

export interface UpdateActivityDto {
  activityName?: string;
  description?: string;
  defaultTime?: string; // Formato HH:mm
  isActive?: boolean;
}

// Tipos para selección de actividades
export interface ActivitySelection {
  activityId: string;
  subactivityId?: string;
  paragraphId?: string;
}

// Tipos para notas diarias (lunes-jueves)
export interface GenerateDailyNoteDto {
  patientId: string;
  weekId: string;
  noteDate: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
  activities: ActivitySelection[]; // 2-3 actividades
}

// Tipos para notas del viernes
export interface GenerateFridayNotesDto {
  patientId: string;
  weekId: string;
  noteDate: string;
  firstNoteActivities: ActivitySelection[]; // 1-2 actividades
  secondNoteActivities: ActivitySelection[]; // 1-2 actividades
}

// Tipos para validación de grupos
export interface GroupLimitInfo {
  currentActiveGroups: number;
  maxActiveGroups: number;
  canCreateNew: boolean;
}

// Tipos para días de la semana
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

// ========================================
// TIPOS DE EXPORTACIÓN/IMPORTACIÓN
// ========================================

export interface ExportOptions {
  formato: 'docx' | 'pdf' | 'excel';
  incluirFirmas: boolean;
  plantilla?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

export interface ImportResult {
  exitosos: number;
  fallidos: number;
  errores: Array<{
    fila: number;
    error: string;
  }>;
}

// ========================================
// TIPOS UNION ÚTILES
// ========================================

export type EstadoDocumento = 'Borrador' | 'Pendiente' | 'Completado' | 'Enviado' | 'Archivado';
export type TipoDocumento = 'MTPR' | 'Multidisciplinario' | 'Nota Diaria' | 'Evaluación';
export type RolUsuario = 'Terapeuta' | 'Psiquiatra' | 'Coordinador' | 'Administrador';
export type EstadoPaciente = 'Activo' | 'Alta' | 'Transferido' | 'Suspendido';

// ========================================
// TIPOS DE CONFIGURACIÓN DE USUARIO
// ========================================

export interface PreferenciasUsuario {
  tema: 'claro' | 'oscuro' | 'auto';
  idioma: 'es' | 'en';
  timezone: string;
  notificaciones: {
    email: boolean;
    push: boolean;
    recordatorios: boolean;
  };
  vistaPorDefecto: 'lista' | 'cards' | 'tabla';
}

export type UserRole = 'admin' | 'therapist' | 'nurse';

export interface Usuario {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  clinicId: string;
  clinic?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Tipo simplificado para autenticación
export interface AuthUser {
  id: string;
  email: string;
  nombre: string;
  rol: 'terapeuta' | 'coordinador' | 'administrador';
  telefono?: string;
  avatar?: string;
}