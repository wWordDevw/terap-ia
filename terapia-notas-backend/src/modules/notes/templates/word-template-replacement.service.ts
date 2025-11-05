/**
 * ============================================================================
 * 📋 DOCUMENTACIÓN TÉCNICA: GENERACIÓN DE NOTAS TERAPÉUTICAS
 * ============================================================================
 * 
 * Este servicio genera documentos Word (DOCX) para notas terapéuticas usando
 * templates de Word con reemplazo de variables mediante docx-templates.
 * 
 * 
 * 📊 TABLAS DE BASE DE DATOS UTILIZADAS:
 * ============================================================================
 * 
 * 1. groups (Group entity)
 *    - Campos usados: group_id, group_name, clinic_id, created_by
 *    - Relaciones: clinic, createdBy
 * 
 * 2. group_schedules (GroupSchedule entity)
 *    - Campos usados: schedule_id, group_id, day_of_week, start_time, end_time,
 *                     activity_id, subactivity_id, units
 *    - Relaciones: activity, subactivity
 *    - IMPORTANTE: Si subactivity_id es NULL, el sistema busca párrafos de
 *                  subactivities que pertenezcan a la actividad
 * 
 * 3. activities (Activity entity)
 *    - Campos usados: activity_id, activity_name, description
 *    - Ejemplos: "Interpersonal Skills", "Goal Setting", "Life Skills"
 * 
 * 4. subactivities (Subactivity entity)
 *    - Campos usados: subactivity_id, subactivity_name, description, activity_id
 *    - Ejemplos: "Identifying Realistic Goals", "Social Skills", "Managing Household Tasks"
 *    - IMPORTANTE: Los objetivos (subactivities) NO están siempre configurados en
 *                  group_schedules, pero se pueden obtener automáticamente desde
 *                  los párrafos asociados a subactivities de la actividad
 * 
 * 5. activity_paragraphs (ActivityParagraph entity)
 *    - Campos usados: paragraph_id, paragraph_text, activity_id, subactivity_id,
 *                     usage_count, is_active
 *    - IMPORTANTE: Los párrafos pueden estar asociados:
 *                  a) Directamente a una actividad (subactivity_id IS NULL)
 *                  b) A una subactivity (subactivity_id IS NOT NULL)
 *    - Si no hay subactivity configurada en group_schedules, se buscan párrafos
 *      de subactivities que pertenezcan a la actividad
 * 
 * 6. patients (Patient entity)
 *    - Campos usados: patient_id, patient_number, first_name, last_name
 * 
 * 7. patient_diagnosis (PatientDiagnosis entity)
 *    - Campos usados: patient_id, icd10_code
 * 
 * 8. patient_goals (PatientGoal entity)
 *    - Campos usados: patient_id, goal_text, goal_number
 * 
 * 9. attendance (Attendance entity)
 *    - Campos usados: patient_id, attendance_date, status, absence_reasons
 *    - status: 'P' = Presente, 'A' = Ausente
 * 
 * 
 * 🔄 FLUJO DE GENERACIÓN DE NOTAS:
 * ============================================================================
 * 
 * 1. OBTENER DATOS BASE (NotesService.generateGroupWeekNotes)
 *    └─ Obtiene grupo, semana, pacientes, asistencias
 * 
 * 2. OBTENER ACTIVIDADES POR DÍA (NotesService.getActivitiesForDay)
 *    └─ Para cada día (lunes-viernes):
 *        a) Consulta group_schedules WHERE day_of_week = [día] AND group_id = [grupo]
 *        b) Para cada schedule:
 *           - Si hay subactivity_id:
 *             * Obtiene párrafo por subactivity_id (RotationService.getNextParagraphForObjective)
 *           - Si NO hay subactivity_id pero hay activity_id:
 *             * Obtiene párrafo de subactivity automática (RotationService.getNextParagraphForActivity)
 *             * Retorna: { paragraph, subactivity } con la subactivity encontrada
 * 
 * 3. GENERAR DOCUMENTO POR PACIENTE (WordTemplateReplacementService.generateSinglePatientDocument)
 *    └─ Para cada paciente y fecha:
 *        a) Prepara datos base (clínica, fecha, grupo, códigos, horarios)
 *        b) Prepara datos del paciente (nombre, ID, diagnóstico, goals)
 *        c) Prepara datos de actividades (headers, párrafos):
 *           - getGroupActivityHeader(index, activities)
 *           - getGroupActivityParagraph(index, activities)
 *        d) Genera documento Word con createReport()
 * 
 * 4. CONSTRUIR ZIP (NotesService.generateGroupWeekNotes)
 *    └─ Estructura: [Nombre_Paciente_ID]/MMDD.docx
 *                   [Nombre_Paciente_ID]/MMDD 1.docx (viernes PHP o jueves IOP)
 *                   [Nombre_Paciente_ID]/MMDD 2.docx (viernes PHP o jueves IOP)
 * 
 * 
 * 📝 FORMATO DE DATOS PASADOS AL TEMPLATE:
 * ============================================================================
 * 
 * Datos Base:
 *   - clinical_logo: string (nombre de la clínica)
 *   - clinical_name: string (nombre de la clínica)
 *   - day: string (ej: "Monday", "Tuesday")
 *   - date: string (ej: "21/10/2025")
 *   - group: string (ej: "6")
 *   - code: string (ej: "G0411", "G0410")
 *   - hour_first_activity: string (ej: "1:00 PM to 2:00 PM")
 *   - hour_second_activity: string
 *   - hour_third_activity: string
 *   - hour_fourth_activity: string
 *   - session_1_units: string (ej: "Session 1: 1 Units")
 *   - session_2_units: string
 *   - session_3_units: string
 *   - session_4_units: string
 * 
 * Datos del Paciente:
 *   - patient_name: string (UPPERCASE)
 *   - id: string (antes patient_id)
 *   - patient_icd10: string (ej: "F33.2")
 *   - totalUnits: string (antes patient_totalUnits)
 *   - patient_goal1, patient_goal2, patient_goal3, patient_goal4: string
 *   - goal1_label, goal2_label, goal3_label, goal4_label: string (ej: "GOAL#1")
 *   - goal1_checkbox, goal2_checkbox, goal3_checkbox, goal4_checkbox: string (ej: "☒", "☐")
 * 
 * Datos de Actividades (por índice 1-4):
 *   - patient_group1_header: string (ej: "Group 1: Interpersonal Skills: Social Skills:")
 *   - patient_group1_paragraph: string (texto del párrafo)
 *   - patient_group2_header: string
 *   - patient_group2_paragraph: string
 *   - patient_group3_header: string
 *   - patient_group3_paragraph: string
 *   - patient_group4_header: string
 *   - patient_group4_paragraph: string
 * 
 * Datos de Respuestas del Cliente:
 *   - patient_statement1, patient_statement2, patient_statement3, patient_statement4: string
 *   - patient_intervention1, patient_intervention2, patient_intervention3, patient_intervention4: string
 *   - group1_client_response_label, group2_client_response_label, etc.: string
 * 
 * 
 * 🎯 MAPEO DE ACTIVIDADES A VARIABLES DEL TEMPLATE:
 * ============================================================================
 * 
 * Las actividades obtenidas de group_schedules se mapean a variables del template:
 * 
 *   activities[0] → patient_group1_header, patient_group1_paragraph
 *   activities[1] → patient_group2_header, patient_group2_paragraph
 *   activities[2] → patient_group3_header, patient_group3_paragraph
 *   activities[3] → patient_group4_header, patient_group4_paragraph
 * 
 * IMPORTANTE: Si hay menos de 4 actividades en un día, los grupos faltantes
 *             mostrarán strings vacíos (sin errores).
 * 
 * 
 * 🔍 OBTENCIÓN DE PÁRRAFOS (LÓGICA CRÍTICA):
 * ============================================================================
 * 
 * 1. Si group_schedule.subactivity_id está configurado:
 *    └─ Busca párrafo en activity_paragraphs WHERE subactivity_id = [subactivity_id]
 *       Retorna: párrafo asociado a esa subactivity específica
 * 
 * 2. Si group_schedule.subactivity_id es NULL:
 *    └─ Busca párrafos en activity_paragraphs WHERE activity_id = [activity_id]
 *       Y subactivity_id IS NOT NULL (párrafos de subactivities de esa actividad)
 *       Retorna: primer párrafo encontrado con su subactivity asociada
 *       EFECTO: Usa automáticamente la subactivity del párrafo encontrado para el header
 * 
 * 3. Si no hay párrafos disponibles:
 *    └─ Retorna string vacío (sin fallbacks hardcodeados)
 * 
 * 
 * 📅 GENERACIÓN DE FECHAS Y CÓDIGOS:
 * ============================================================================
 * 
 * Fechas de la Semana:
 *   - getWeekDates(): Retorna lunes a viernes (Monday-Friday)
 *   - Formato fecha: DD/MM/YYYY
 *   - Nombre archivo: MMDD.docx (ej: 1021.docx para Oct 21)
 * 
 * Códigos por Día:
 *   - Lunes: G0411
 *   - Martes: G0410
 *   - Miércoles: G0411
 *   - Jueves: G0410 (G0410 y G0411 para IOP - doble nota)
 *   - Viernes: G0410 y G0411 (doble nota para PHP)
 * 
 * 
 * ⚠️ CONSIDERACIONES IMPORTANTES:
 * ============================================================================
 * 
 * 1. SOLO DATOS DE BASE DE DATOS:
 *    - NO usar fallbacks hardcodeados
 *    - Si no hay datos en BD, retornar strings vacíos
 * 
 * 2. SUBACTIVITIES AUTOMÁTICAS:
 *    - Si no hay subactivity_id en group_schedules, se obtiene automáticamente
 *      desde el párrafo encontrado
 *    - Esto permite que funcionen los horarios sin subactivity configurada
 * 
 * 3. PARALELIZACIÓN:
 *    - Todos los documentos se generan en paralelo con Promise.all()
 *    - Esto mejora significativamente el rendimiento
 * 
 * 4. VALIDACIÓN DE ZIP:
 *    - El ZIP se valida antes de enviarse al frontend
 *    - Debe tener header "PK" (0x50 0x4B) y EOCD válido
 * 
 * 
 * 🔧 MÉTODOS PRINCIPALES:
 * ============================================================================
 * 
 * - generateSinglePatientDocument(): Genera un DOCX individual para un paciente
 * - generateSingleAbsenceDocument(): Genera DOCX para paciente ausente
 * - getGroupActivityHeader(): Obtiene header "Group N: Activity: Subactivity:"
 * - getGroupActivityParagraph(): Obtiene párrafo de la actividad/subactivity
 * - getCodeByDay(): Obtiene código (G0410/G0411) según el día
 * - formatDate(): Formatea fecha DD/MM/YYYY
 * - formatTimeRange(): Formatea rango de horas (ej: "1:00 PM to 2:00 PM")
 * 
 * 
 * 📂 ARCHIVOS RELACIONADOS:
 * ============================================================================
 * 
 * - src/modules/notes/notes.service.ts: Orquesta la generación de notas
 * - src/modules/notes/notes.controller.ts: Endpoints API
 * - src/modules/notes/services/rotation.service.ts: Obtiene párrafos rotativos
 * - src/modules/notes/templates/word-template-replacement.service.ts: Este archivo
 * 
 * Template Word usado:
 * - PHP_CLEAN_TEMPLATE_SIMPLE.docx (template sin bucles, variables individuales)
 * - PHP_CLEAN_TEMPLATE_SIMPLE AUSENCIA.docx (template para notas de ausencia)
 * 
 * ============================================================================
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
const archiver = require('archiver');
import { createReport } from 'docx-templates';
import { OpenAIService } from '../../../common/services/openai.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class WordTemplateReplacementService {
  private readonly logger = new Logger(WordTemplateReplacementService.name);
  private readonly templatePath = path.join(process.cwd(), 'PHP_CLEAN_TEMPLATE.docx');
  private readonly simpleTemplatePath = path.join(process.cwd(), 'PHP_CLEAN_TEMPLATE_SIMPLE.docx');
  private readonly iopSimpleTemplatePath = path.join(process.cwd(), 'IOP_CLEAN_TEMPLATE_SIMPLE.docx');
  private readonly absenceTemplatePath = path.join(process.cwd(), 'PHP_CLEAN_TEMPLATE_SIMPLE AUSENCIA.docx');
  private readonly iopAbsenceTemplatePath = path.join(process.cwd(), 'IOP_CLEAN_TEMPLATE_SIMPLE AUSENCIA.docx');

  constructor(
    private readonly openAIService: OpenAIService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Obtiene la ruta del template simple, permitiendo override por ENV
   * ENV: PHP_SIMPLE_TEMPLATE_PATH (ruta absoluta o relativa)
   */
  private getSimpleTemplatePath(): string {
    const overridePath = process.env.PHP_SIMPLE_TEMPLATE_PATH;
    const resolved = overridePath
      ? path.isAbsolute(overridePath)
        ? overridePath
        : path.join(process.cwd(), overridePath)
      : this.simpleTemplatePath;
    this.logger.log(`📄 Usando template simple: ${resolved}`);
    return resolved;
  }

  /**
   * Obtiene la ruta del template IOP simple, permitiendo override por ENV
   * ENV: IOP_SIMPLE_TEMPLATE_PATH (ruta absoluta o relativa)
   */
  private getIOPTemplatePath(): string {
    const overridePath = process.env.IOP_SIMPLE_TEMPLATE_PATH;
    const resolved = overridePath
      ? path.isAbsolute(overridePath)
        ? overridePath
        : path.join(process.cwd(), overridePath)
      : this.iopSimpleTemplatePath;
    this.logger.log(`📄 Usando template IOP simple: ${resolved}`);
    return resolved;
  }

  /**
   * Obtiene la ruta del template de ausencia PHP
   */
  private getAbsenceTemplatePath(): string {
    // Por ahora, usar path directo (similar a como se hace con templates principales)
    const resolved = this.absenceTemplatePath;
    this.logger.log(`📄 Usando template de ausencia PHP: ${resolved}`);
    return resolved;
  }

  /**
   * Obtiene la ruta del template de ausencia IOP
   */
  private getIOPAbsenceTemplatePath(): string {
    // Por ahora, usar path directo (similar a como se hace con templates principales)
    const resolved = this.iopAbsenceTemplatePath;
    this.logger.log(`📄 Usando template de ausencia IOP: ${resolved}`);
    return resolved;
  }

  /**
   * Obtiene la imagen de firma del terapeuta desde la base de datos (base64)
   * Si no hay firma en BD, intenta leer desde sistema de archivos como fallback
   * Retorna un objeto Image compatible con docx-templates o null si no se encuentra
   */
  private async getTherapistSignatureImage(therapistId?: string): Promise<{
    width: number;
    height: number;
    data: Buffer | string; // Puede ser Buffer o base64 string
    extension: '.png' | '.jpg' | '.jpeg';
    alt?: string;
  } | null> {
    try {
      // PRIORIDAD 1: Obtener desde base de datos si hay therapistId
      if (therapistId) {
        const user = await this.userRepository.findOne({
          where: { id: therapistId },
          // No usar select si signatureImage no está en el select permitido
          // TypeORM requiere que el campo esté definido en la entidad
        });

        if (user?.signatureImage) {
          // Validar formato base64
          const base64Match = user.signatureImage.match(/^data:image\/(jpeg|jpg|png|gif);base64,(.+)$/);
          if (base64Match && base64Match[2]) {
            const extension = `.${base64Match[1] === 'jpeg' ? 'jpg' : base64Match[1]}` as '.png' | '.jpg' | '.jpeg';
            const base64Data = base64Match[2];

            // Tamaño de la imagen en centímetros (reducido para mejor ajuste)
            const width = 4.5; // cm (reducido de 6cm)
            const height = 2; // cm (reducido de 2.5cm)

            this.logger.debug(`✅ Imagen de firma cargada desde BD para ${user.fullName} (${base64Data.length} chars base64, ${width}x${height} cm)`);

            return {
              width,
              height,
              data: base64Data, // base64 string sin el prefijo
              extension,
              alt: `Firma de ${user.fullName}`,
            };
          } else {
            this.logger.warn(`⚠️ Formato de imagen de firma inválido en BD para usuario ${therapistId}`);
          }
        } else {
          this.logger.debug(`ℹ️ No hay firma en BD para usuario ${therapistId}`);
        }
      }

      // PRIORIDAD 2: Fallback a sistema de archivos (para compatibilidad)
      const signaturePath = path.join(process.cwd(), 'firma_example.jpg');
      if (fs.existsSync(signaturePath)) {
        const imageBuffer = fs.readFileSync(signaturePath);
        const ext = path.extname(signaturePath).toLowerCase() as '.png' | '.jpg' | '.jpeg';
        
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
          const width = 4.5; // cm (reducido de 6cm)
          const height = 2; // cm (reducido de 2.5cm)
          this.logger.debug(`✅ Imagen de firma cargada desde sistema de archivos (fallback): ${signaturePath}`);
          return {
            width,
            height,
            data: imageBuffer,
            extension: ext,
            alt: 'Firma del terapeuta',
          };
        }
      }

      this.logger.warn(`⚠️ No se encontró imagen de firma para terapeuta ${therapistId || 'N/A'}`);
      return null;
    } catch (error) {
      this.logger.error(`❌ Error obteniendo imagen de firma: ${error.message}`);
      return null;
    }
  }

  /**
   * Genera un documento Word usando el archivo original como plantilla
   * y reemplazando solo el contenido dinámico
   * 
   * @deprecated Este método usa el template antiguo con bucles.
   * Use generateGroupDayDocumentSimple() que es la versión oficial con PHP_CLEAN_TEMPLATE_SIMPLE.docx
   */
  async generateGroupDayDocument(data: any): Promise<Buffer> {
    try {
      // Usar siempre PHP_CLEAN_TEMPLATE.docx
      const templateBuffer = fs.readFileSync(this.templatePath);
      
      // Preparar los datos para el template con mapeo completo de placeholders
      const templateData = {
        // Header
        clinical_logo: data.group?.clinic || 'FAMILY UNITED HEALTH COMMUNITY',
        clinical_name: data.group?.clinic || 'FAMILY HEALTH COMMUNITY',
        day: this.getDayOfWeek(data.date),
        date: this.formatDate(data.date),
        group: '6',
        code: this.getCodeByDay(data.date, data.group?.programType === 'IOP'),
        setting: '53',
        // Espacio para separar placeholders en el footer
        footer_space: ' ',
        
        // Horarios de actividad desde data.activities
        hour_first_activity: data.activities?.[0] ? this.formatTimeRange(data.activities[0]) : '',
        hour_second_activity: data.activities?.[1] ? this.formatTimeRange(data.activities[1]) : '',
        hour_third_activity: data.activities?.[2] ? this.formatTimeRange(data.activities[2]) : '',
        hour_fourth_activity: data.activities?.[3] ? this.formatTimeRange(data.activities[3]) : '',
        
        // Unidades por sesión
        session_1_units: data.activities?.[0] ? `Session 1: ${data.activities[0].units || 1} Units` : '',
        session_2_units: data.activities?.[1] ? `Session 2: ${data.activities[1].units || 1} Units` : '',
        session_3_units: data.activities?.[2] ? `Session 3: ${data.activities[2].units || 1} Units` : '',
        session_4_units: data.activities?.[3] ? `Session 4: ${data.activities[3].units || 1} Units` : '',
        
        // Terapeuta (datos generales)
        // Función que retorna la imagen de firma para docx-templates (async)
        terapeut_signature_image: async () => await this.getTherapistSignatureImage(
          data.group?.therapistId || data.group?.createdBy?.id
        ),
        terapeut_name: data.therapistName || 'Alina Morales, MSMH',
        
        // Pacientes (para loop) - SOLO incluir pacientes presentes
        patients: data.patients
          ?.filter((patient: any) => patient.isPresent === true)
          .map((patient: any, index: number) => {
            // Calcular total units (solo actividades con datos)
            const totalUnits = this.calculateTotalUnits(data.activities);
            
            // Métricas aleatorias (COOPERATION, MOTIVATION, CONCENTRATION & FOCUS, PEER INTERACTION)
            // Cada llamada genera un valor diferente entre "Moderate" y "Minor"
            const cooperation = this.getRandomMetric();
            const motivation = this.getRandomMetric();
            const concentration = this.getRandomMetric();
            const peerInteraction = this.getRandomMetric();
            
            // DEBUG: Verificar aleatoriedad de métricas
            this.logger.debug(`Métricas generadas para ${patient.name || 'paciente'}: cooperation=${cooperation}, motivation=${motivation}, concentration=${concentration}, peerInteraction=${peerInteraction}`);
            
            // Objetivos del paciente (desde patient.goals) - NO usar defaults
            const goals = patient.goals || [];
            const sortedGoals = [...goals].sort((a, b) => (a.goalNumber || 0) - (b.goalNumber || 0));
            const getGoalDesc = (index: number) => {
              const goal = sortedGoals.find(g => g.goalNumber === index + 1);
              return goal?.goalText || '';
            };
            
            return {
              // Información básica del cliente
              Client_Name: (patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || `PACIENTE ${index + 1}`).toUpperCase(),
              Client_ID: patient.patientNumber || `P${String(index + 1).padStart(3, '0')}`,
              icd10: 'F33.2', // PHP siempre es F33.2
              totalUnits: totalUnits.toString(),
              
              // Objetivos
              client_goal_1: getGoalDesc(0) || '',
              client_goal_2: getGoalDesc(1) || '',
              client_goal_3: getGoalDesc(2) || '',
              client_goal_4: getGoalDesc(3) || '',
              
              // Métricas
              cooperation,
              motivation,
              concentration,
              peerInteraction,
              attitude: 'Fluctuations',
              
              // Actividades del grupo (con formato "Activity: Subactivity: Paragraph")
              Group_1: this.getGroupActivity(1, data.activities),
              Group_2: this.getGroupActivity(2, data.activities),
              Group_3: this.getGroupActivity(3, data.activities),
              Group_4: this.getGroupActivity(4, data.activities),
              
              // Respuestas de IA
              IA_patient_statement_1: this.getClientResponse(1, index),
              IA_therapist_intervention_1: 'PHP Therapist acknowledged how anticipatory anxiety can impair task initiation and provided the client with a visual task breakdown chart to reduce cognitive load and increase follow-through.',
              IA_patient_statement_2: this.getClientResponse(2, index),
              IA_therapist_intervention_2: 'PHP Therapist helped the client recognize this as an internalized belief that reinforces anxiety and poor self-worth. The client was supported in developing a basic self-care routine with simple, time-limited actions to promote emotional regulation and reduce guilt.',
              IA_patient_statement_3: this.getClientResponse(3, index),
              IA_therapist_intervention_3: 'PHP Therapist explored the anxiety-driven avoidance of side effects and emphasized the importance of consistent communication with prescribers. The client was encouraged to track symptoms and medication responses in a journal for review.',
              IA_patient_statement_4: this.getClientResponse(4, index),
              IA_therapist_intervention_4: 'PHP Therapist explained how nutritional choices can worsen anxiety symptoms and guided the client in identifying two small, manageable food swaps to implement over the next week.',
              
              // Progreso
              Progress_Summary: this.getProgressExplanation(patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim(), data.activities),
              
              // Fecha individual para el footer de cada paciente
              date: this.formatDate(data.date),

              // Firma del terapeuta impresa en la nota
              terapeut_name: data.therapistName || 'Alina Morales, MSMH'
            };
          }) || []
      };

      // Log de los datos que se pasan al template
      this.logger.log(`📊 Datos para el template:`);
      this.logger.log(`  Fecha: ${templateData.date} - ${templateData.day}`);
      this.logger.log(`  Pacientes presentes: ${templateData.patients.length}`);
      templateData.patients.forEach((p, i) => {
        this.logger.log(`    ${i + 1}. ${p.Client_Name} (${p.Client_ID}) - ICD: ${p.icd10}`);
      });
      this.logger.log(`  Actividades: ${data.activities?.length || 0}`);
      data.activities?.forEach((act, i) => {
        this.logger.log(`    ${i + 1}. ${act.name}`);
      });

      // Generar el documento usando docx-templates
      this.logger.log(`\n🔄 Iniciando generación de documento con docx-templates...`);
      this.logger.log(`  Template: ${this.templatePath}`);
      this.logger.log(`  Tamaño del template: ${templateBuffer.length} bytes`);
      this.logger.log(`  Pacientes a procesar: ${templateData.patients.length}`);
      
      // Log de datos del primer paciente para debugging
      if (templateData.patients.length > 0) {
        const firstPatient = templateData.patients[0];
        this.logger.log(`  Primer paciente - Client_Name: "${firstPatient.Client_Name}"`);
        this.logger.log(`  Primer paciente - client_goal_1: "${firstPatient.client_goal_1}"`);
        this.logger.log(`  Primer paciente - Group_1: "${firstPatient.Group_1}"`);
      }
      
      // Log de templateData para debugging
      this.logger.log(`\n📝 templateData a enviar a createReport:`);
      this.logger.log(`  clinical_logo: "${templateData.clinical_logo}"`);
      this.logger.log(`  clinical_name: "${templateData.clinical_name}"`);
      this.logger.log(`  day: "${templateData.day}"`);
      this.logger.log(`  date: "${templateData.date}"`);
      this.logger.log(`  group: "${templateData.group}"`);
      this.logger.log(`  code: "${templateData.code}"`);
      this.logger.log(`  patients array length: ${templateData.patients.length}`);
      this.logger.log(`\n  Primer paciente completo:`);
      if (templateData.patients.length > 0) {
        this.logger.log(JSON.stringify(templateData.patients[0], null, 2));
      }
      
      try {
        this.logger.log(`\n🔄 Llamando a createReport...`);
        this.logger.log(`  Delimitador: {{ }}`);
        this.logger.log(`  Tamaño del buffer: ${templateBuffer.length} bytes`);
        this.logger.log(`  Total de propiedades en templateData: ${Object.keys(templateData).length}`);
        this.logger.log(`  Propiedades: ${Object.keys(templateData).join(', ')}`);
        
        // IMPORTANTE: Verificar si el template tiene el bucle FOR
        const templateContent = templateBuffer.toString();
        const hasForLoop = templateContent.includes('{{FOR');
        const hasEndFor = templateContent.includes('{{END-FOR') || templateContent.includes('{{END}}');
        
        this.logger.log(`\n⚠️  VERIFICACIÓN DEL TEMPLATE:`);
        this.logger.log(`  ¿Tiene {{FOR patient IN patients}}? ${hasForLoop}`);
        this.logger.log(`  ¿Tiene {{END-FOR}} o {{END}}? ${hasEndFor}`);
        
        if (!hasForLoop) {
          this.logger.error(`\n❌ PROBLEMA DETECTADO:`);
          this.logger.error(`  El template NO tiene el bucle {{FOR patient IN patients}}`);
          this.logger.error(`  SIN el bucle, las variables {{patient.xxxxx}} NO funcionarán`);
          this.logger.error(`  DEBE agregar {{FOR patient IN patients}} al inicio y {{END-FOR}} al final del bloque de cada paciente`);
        }
        
        
        const report = await createReport({
          template: templateBuffer,
          data: templateData , 
          cmdDelimiter: ['{{', '}}'],
          processLineBreaks: true,
        });
        
        
        this.logger.log(`  ✅ Documento generado, tamaño: ${report.length} bytes`);
      
      // Asegurarse de que el report es un Buffer
      // createReport devuelve un Uint8Array, necesitamos convertirlo a Buffer
      let finalBuffer: Buffer;
      
      if (Buffer.isBuffer(report)) {
        finalBuffer = report;
      } else if (report instanceof Uint8Array || Array.isArray(report)) {
        finalBuffer = Buffer.from(report);
      } else {
        // Convertir cualquier array a Buffer
        finalBuffer = Buffer.from(report as any);
      }
      
      this.logger.log(`  📦 Buffer final - es Buffer: ${Buffer.isBuffer(finalBuffer)}`);
      this.logger.log(`  📦 Buffer final - tamaño: ${finalBuffer.length} bytes`);
      
      return finalBuffer;
      } catch (error) {
        this.logger.error(`Error en createReport: ${error.message}`);
        this.logger.error(`Stack: ${error.stack}`);
        throw error;
      }
    } catch (error) {
      throw new Error(`Error generating document from template: ${error.message}`);
    }
  }

  /**
   * Genera un ZIP con notas semanales usando el template
   */
  async generateGroupWeekNotes(data: any): Promise<Buffer> {
    try {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const chunks: Buffer[] = [];

      archive.on('data', (chunk) => {
        chunks.push(chunk);
      });

      // Generar notas para cada día de la semana
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
      const startDate = new Date(data.startDate || '2025-10-21');

      for (let i = 0; i < days.length; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const dayData = {
          ...data,
          date: currentDate.toISOString().split('T')[0],
          dayOfWeek: days[i]
        };

        const dayNote = await this.generateGroupDayDocument(dayData);
        const fileName = `${data.groupName || 'Group'}_${days[i]}_${currentDate.toISOString().split('T')[0]}.docx`;
        
        archive.append(dayNote, { name: fileName });
      }

      await archive.finalize();

      return new Promise((resolve, reject) => {
        archive.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        archive.on('error', reject);
      });
    } catch (error) {
      throw new Error(`Error generating week notes: ${error.message}`);
    }
  }

  /**
   * Formatea una fecha para mostrar en el documento
   */
  private formatDate(date: string): string {
    const dateObj = this.parseYMD(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Obtiene el día de la semana en español
   */
  private getDayOfWeek(date: string): string {
    const dateObj = this.parseYMD(date);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dateObj.getDay()];
  }

  /**
   * Determina qué goal debe estar marcado según el día de la semana
   * Lunes=1, Martes=2, Miércoles=3, Jueves=4, Viernes=1
   */
  private getSelectedGoalNumber(date: string): number {
    const dayOfWeek = this.getDayOfWeek(date);
    switch (dayOfWeek) {
      case 'Monday': return 1;
      case 'Tuesday': return 2;
      case 'Wednesday': return 3;
      case 'Thursday': return 4;
      case 'Friday': return 1; // Vuelve al primero
      default: return 1;
    }
  }

  /**
   * Parser seguro YYYY-MM-DD sin efectos de zona horaria
   */
  private parseYMD(ymd: string): Date {
    const [y, m, d] = ymd.split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }

  /**
   * Obtiene el código según el día de la semana
   * Lunes: G0411, Martes: G0410, Miércoles: G0411, Jueves: G0410, Viernes: G0410
   * Para IOP: devuelve con guion (G-0410, G-0411)
   * Para PHP: devuelve sin guion (G0410, G0411)
   */
  private getCodeByDay(date: string, isIOP: boolean = false): string {
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    let code: string;
    switch (dayOfWeek) {
      case 1: // Monday (Lunes)
        code = 'G0411';
        break;
      case 2: // Tuesday (Martes)
        code = 'G0410';
        break;
      case 3: // Wednesday (Miércoles)
        code = 'G0411';
        break;
      case 4: // Thursday (Jueves)
        code = 'G0410';
        break;
      case 5: // Friday (Viernes)
        code = 'G0410'; // Para PHP, viernes usa G0410 (y se genera doble nota)
        break;
      default:
        // Para domingo, sábado u otros días, usar G0410 por defecto
        code = 'G0410';
    }
    
    // Para IOP: agregar guion (G-0410, G-0411)
    if (isIOP && code.length === 5) {
      return `${code.substring(0, 1)}-${code.substring(1)}`;
    }
    
    return code;
  }

  /**
   * Obtiene objetivos por defecto
   */
  private getDefaultGoals(): Array<{ description: string; selected: boolean }> {
    return [
      { description: 'Client will identify and resolve the underlying causes of depression, thus elevating mood and interest/pleasure in life.', selected: false },
      { description: 'Client will significantly reduce the overall frequency and intensity of the anxiety symptoms so that daily functioning is improved.', selected: true },
      { description: 'Client will feel refreshed and energetic during wakeful hours.', selected: false },
      { description: 'Client will reach a personal balance between solitary time and interpersonal interaction with others.', selected: false },
    ];
  }

  /**
   * Obtiene el header de la actividad del grupo (parte en negrita)
   * Formato: "Group N: [Activity Name]: [Subactivity Name]:"
   * IMPORTANTE: Filtra texto específico de IOP cuando es PHP (ej: "activities for IOP groups")
   */
  private getGroupActivityHeader(index: number, activities: any[], isIOP: boolean = false): string {
    if (!activities || activities.length === 0) {
      return '';
    }
    
    const activity = activities[index - 1];
    if (!activity) {
      return '';
    }
    
    let activityName = activity.name || activity.activityName || 'Activity';
    
    // Prioridad: subactivityName (de la BD) > description (puede ser subactivity o activity description)
    // IMPORTANTE: description puede ser subactivityName O activity.description dependiendo de cómo se construyó
    let subactivityName = activity.subactivityName || 
                           (activity.description && activity.description !== activity.activityName ? activity.description : null) ||
                           activity.subactivity?.subactivityName || 
                           '';
    
    // CRÍTICO: Si es PHP, filtrar texto específico de IOP de activityName y subactivityName
    if (!isIOP) {
      // Filtrar referencias a "IOP" en activityName
      activityName = activityName.replace(/\s*activities?\s+for\s+IOP\s+groups?/gi, '');
      activityName = activityName.replace(/\s*IOP\s*\-?\s*/gi, '');
      activityName = activityName.trim();
      
      // Filtrar referencias a "IOP" en subactivityName
      if (subactivityName) {
        // Remover texto como "activities for IOP groups - Tuesday:"
        subactivityName = subactivityName.replace(/\s*activities?\s+for\s+IOP\s+groups?\s*\-?\s*/gi, '');
        // Remover días de la semana al final (ej: " - Tuesday:")
        subactivityName = subactivityName.replace(/\s*-\s*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday):?\s*$/i, '');
        subactivityName = subactivityName.replace(/\s*IOP\s*\-?\s*/gi, '');
        subactivityName = subactivityName.trim();
      }
    }
    
    // Si hay subactivity configurada, mostrar: "Group N: Activity: Subactivity:"
    if (subactivityName) {
      return `Group ${index}: ${activityName}: ${subactivityName}:`;
    }
    
    // Si no hay subactivity, solo mostrar actividad
    return `Group ${index}: ${activityName}:`;
  }

  /**
   * Obtiene el párrafo de la actividad del grupo (texto normal)
   * Formato: [Paragraph Text]
   * IMPORTANTE: Reemplaza el tipo de terapeuta (IOP Therapist/PHP Therapist) según el tipo de programa
   */
  private getGroupActivityParagraph(index: number, activities: any[], isIOP: boolean = false): string {
    if (!activities || activities.length === 0) {
      this.logger.debug(`getGroupActivityParagraph(${index}): No hay actividades disponibles`);
      return '';
    }
    
    const activity = activities[index - 1];
    if (!activity) {
      this.logger.debug(`getGroupActivityParagraph(${index}): No hay actividad en índice ${index - 1}`);
      return '';
    }
    
    // DEBUG: Ver qué datos tenemos
    this.logger.debug(`getGroupActivityParagraph(${index}): ${activity.name || activity.activityName}`);
    this.logger.debug(`  - paragraphText: ${activity.paragraphText ? 'SÍ' : 'NO'} (${activity.paragraphText?.length || 0} chars)`);
    this.logger.debug(`  - paragraph: ${activity.paragraph ? 'SÍ' : 'NO'} (${activity.paragraph?.length || 0} chars)`);
    this.logger.debug(`  - subactivityName: ${activity.subactivityName || 'N/A'}`);
    
    // SOLO usar paragraphText de la base de datos (ActivityParagraph)
    // Si no hay párrafo en BD, retornar vacío (sin fallbacks hardcodeados)
    let paragraphText = activity.paragraphText || activity.paragraph || '';
    
    if (!paragraphText) {
      this.logger.warn(`  - ⚠️ No hay paragraphText en BD para ${activity.name || activity.activityName}${activity.subactivityName ? ` - ${activity.subactivityName}` : ''}`);
      return '';
    }
    
    // CRÍTICO: Reemplazar el tipo de terapeuta según el tipo de programa
    // Los párrafos en BD pueden tener "IOP Therapist" o "PHP Therapist" hardcodeado
    // Necesitamos asegurar que coincida con el tipo de programa actual
    const correctTherapistType = isIOP ? 'IOP Therapist' : 'PHP Therapist';
    const wrongTherapistType = isIOP ? 'PHP Therapist' : 'IOP Therapist';
    
    // Reemplazar todas las ocurrencias del tipo de terapeuta incorrecto
    paragraphText = paragraphText.replace(new RegExp(wrongTherapistType, 'g'), correctTherapistType);
    
    return paragraphText;
  }

  /**
   * Obtiene la actividad del grupo por índice en formato oficial (método legacy - mantener por compatibilidad)
   * Formato: "Group N: [Activity Name]: [Subactivity Name]: [Paragraph Text]"
   * Retorna string vacío si no hay actividad (según especificación)
   */
  private getGroupActivity(index: number, activities: any[], isIOP: boolean = false): string {
    const header = this.getGroupActivityHeader(index, activities, isIOP);
    const paragraph = this.getGroupActivityParagraph(index, activities, isIOP);
    
    if (!header && !paragraph) {
      return '';
    }
    
    return paragraph ? `${header} ${paragraph}` : header;
  }

  /**
   * Formatea la respuesta del cliente con la intervención del terapeuta
   * NOTA: "Client Response:" se maneja con variables en el template (group1_client_response_label, etc.)
   * Formato generado: "Group N "[statement]". The therapist [intervention]." (sin "Client Response:")
   * Para Group 3: "Group N "[statement]". Intervention: The therapist [intervention]."
   * Para Group 4: "Group 4: "[statement]". Intervention: The therapist [intervention]."
   */
  private formatClientResponseWithIntervention(
    groupIndex: number,
    statement: string,
    intervention: string
  ): string {
    const quotedStatement = `"${statement}"`;
    
    // Group 4 tiene formato especial (sin "Client Response:" porque va en variable group4_client_response_label)
    if (groupIndex === 4) {
      return `Group 4: ${quotedStatement}. Intervention: The therapist ${intervention}`;
    }
    
    // Group 3 también usa "Intervention:"
    if (groupIndex === 3) {
      return `Group 3 ${quotedStatement}. Intervention: The therapist ${intervention}`;
    }
    
    // Group 1 y 2 usan formato estándar
    return `Group ${groupIndex} ${quotedStatement}. The therapist ${intervention}`;
  }

  /**
   * Obtiene una respuesta del cliente
   * Método síncrono que usa respuestas predefinidas
   */
  private getClientResponse(index: number, patientIndex: number): string {
    // Usar diferentes respuestas para diferentes pacientes
    const responsesByActivity = [
      ["I leave most chores unfinished because I get overwhelmed just thinking about them.", "I usually wait until the mess gets out of control before I do anything.", "If I don't make a list, I forget everything and end up doing nothing.", "I try to do everything at once, and when it gets too much, I just shut down.", "I freeze when I think about all the cleaning I have to do, so I just avoid it.", "If I start cleaning, I get stuck on one thing and forget the rest.", "When I try to organize things, I get overwhelmed and just keep moving stuff around without finishing anything.", "I get frustrated when I can't do everything at once, and then I just shut down."],
      ["When I try to do something for myself, I feel selfish and end up quitting.", "I tend to put everyone else's needs before mine, even when I feel burned out.", "When I try to rest, I feel like I'm being lazy.", "I feel guilty when I relax, like I'm avoiding responsibilities.", "I can't relax unless everything is done, but that rarely happens, so I stay tense all day.", "I don't do much for myself because I feel like I haven't earned it.", "I feel like taking breaks means I'm being lazy, so I just keep pushing myself.", "I feel like if I take time for myself, something bad will happen or I'll fall behind."],
      ["Sometimes I skip my meds if I think they're making me too tired or foggy.", "I didn't want to say anything about the side effects because I thought I was just being difficult.", "Sometimes I avoid taking my meds because I'm afraid they'll make me feel worse.", "When I feel a side effect, I immediately think the worst is happening.", "If I read something negative about my meds, I panic and want to stop taking them.", "I panic if I think I'm getting side effects, even if it's minor.", "I constantly Google my medication side effects, and then I can't stop thinking about what could go wrong.", "Every time I read about a possible side effect, I convince myself it will happen to me."],
      ["I eat a lot of junk food when I'm anxious—it's just easier than cooking.", "I crash in the afternoons after eating heavy meals.", "I get anxious when I skip meals, but I also forget to eat when I'm stressed.", "If I skip my walk or eat junk food, I feel restless and can't focus all day.", "When I eat sugary foods, I get jittery and then more anxious.", "When I skip exercise, I feel more restless and on edge.", "If I miss a healthy meal or snack, I get irritable and start to spiral into negative thoughts.", "When I skip my morning routine exactly right, I start to think the whole day is ruined."]
    ];
    
    const activityResponses = responsesByActivity[index - 1] || [];
    return activityResponses[patientIndex % activityResponses.length] || "No response recorded.";
  }
  
  /**
   * Genera respuesta de cliente con IA (asíncrono)
   */
  private async generateClientResponseWithAI(
    patientName: string,
    activityIndex: number,
    activities: any[],
    isIOP: boolean = false,
    selectedGoalNumber?: number,
    selectedGoalText?: string,
  ): Promise<string> {
    const activity = activities[activityIndex];
    if (!activity) {
      return '';
    }
    
    try {
      const response = await this.openAIService.generateClientResponseForActivity(
        patientName,
        activity.name,
        activity.description || activity.paragraph || '',
        activity.paragraph || activity.description || '',
        isIOP,
        selectedGoalNumber,
        selectedGoalText,
      );
      return response;
    } catch (error) {
      this.logger.error(`Error generating client response with AI: ${error.message}`);
      return this.getClientResponse(activityIndex + 1, 0);
    }
  }

  /**
   * Genera la explicación del progreso
   * IMPORTANTE: El resumen debe tener entre 480 y 560 caracteres para que todo quepa en una sola hoja
   */
  private getProgressExplanation(patientName: string, activities: any[]): string {
    // Resumen por defecto optimizado para tener entre 480 y 560 caracteres
    const defaultSummary = `During the group session, the client demonstrated understanding of how executive dysfunction, poor medication adherence, and unhealthy lifestyle habits can serve as early indicators of a depressive mood. The discussion highlighted how avoidance behaviors and cognitive overload can trigger emotional dysregulation. Similarly, psychoeducation allowed the client to recognize the connection between inconsistent medication use and mood instability. The client needs to continue working on self-esteem and self-care, as internalized guilt and difficulty prioritizing personal needs interfere with consistent preventative behaviors.`;
    
    // Asegurar que el resumen tenga entre 480 y 560 caracteres
    const currentLength = defaultSummary.length;
    if (currentLength >= 480 && currentLength <= 560) {
      return defaultSummary;
    }
    
    // Si es más largo, truncar a 560 caracteres
    if (currentLength > 560) {
      return defaultSummary.substring(0, 557) + '...';
    }
    
    // Si es más corto, expandir ligeramente para llegar a al menos 480
    if (currentLength < 480) {
      const additionalText = ' Additionally, the client should continue developing skills to recognize early warning signs and implement proactive coping strategies.';
      const expanded = defaultSummary + additionalText;
      return expanded.length <= 560 ? expanded : defaultSummary.substring(0, 557) + '...';
    }
    
    return defaultSummary;
  }
  
  /**
   * Genera resumen de progreso con IA (asíncrono)
   */
  private async generateProgressSummaryWithAI(patientName: string, activities: any[]): Promise<string> {
    try {
      const summary = await this.openAIService.generateProgressSummary(patientName, activities);
      return summary;
    } catch (error) {
      this.logger.error(`Error generating progress summary with AI: ${error.message}`);
      return this.getProgressExplanation(patientName, activities);
    }
  }
  
  /**
   * Obtiene métrica aleatoria entre "Moderate" y "Minor"
   * IMPORTANTE: COOPERATION, MOTIVATION, CONCENTRATION & FOCUS, PEER INTERACTION
   * siempre pueden ser "Minor" o "Moderate" (aleatorio)
   * ATTITUDE siempre es "Fluctuations" (no usar este método para attitude)
   */
  private getRandomMetric(): 'Moderate' | 'Minor' {
    // Usar Math.random() para generar verdadera aleatoriedad
    // Cada llamada genera un valor diferente (si no hay seed fija)
    const random = Math.random();
    return random < 0.5 ? 'Minor' : 'Moderate';
  }
  
  /**
   * Calcula el total de unidades basado en actividades con datos
   */
  private calculateTotalUnits(activities: any[]): number {
    if (!activities || activities.length === 0) return 0;
    return activities.filter(act => act.name && act.description).length;
  }
  
  /**
   * Convierte una hora de formato 24h (HH:MM:SS) a formato 12h (H:MM AM/PM)
   */
  private convertTo12Hour(time24: string): string {
    if (!time24) return '';
    
    // Extraer horas y minutos (ignorar segundos si existen)
    const parts = time24.split(':');
    if (parts.length < 2) return time24;
    
    let hours = parseInt(parts[0], 10);
    const minutes = parts[1];
    
    // Determinar AM/PM y ajustar horas
    const period = hours >= 12 ? 'PM' : 'AM';
    if (hours === 0) {
      hours = 12; // Medianoche es 12 AM
    } else if (hours > 12) {
      hours = hours - 12; // 13-23 se convierten a 1-11 PM
    }
    
    // Retornar formato: "H:MM AM/PM"
    return `${hours}:${minutes} ${period}`;
  }

  /**
   * Formatea el rango de horas de una actividad en formato 12h con AM/PM
   * Ejemplo: "8:00 AM to 9:00 AM"
   */
  private formatTimeRange(activity: any): string {
    if (!activity || !activity.startTime || !activity.endTime) return '';
    const startTime12 = this.convertTo12Hour(activity.startTime);
    const endTime12 = this.convertTo12Hour(activity.endTime);
    return `${startTime12} to ${endTime12}`;
  }

  /**
   * Formatea la descripción completa de una actividad
   * Formato: "Actividad: Objetivo: Descripción completa"
   */
  private formatActivityDescription(activity: any): string {
    if (!activity) return '';
    
    const activityName = activity.name || '';
    const objective = activity.objective || activity.subactivity?.name || '';
    const description = activity.description || activity.paragraph || '';
    
    // Formato: "Activity: Objective: Full description"
    if (activityName && objective && description) {
      return `${activityName}: ${objective}: ${description}`;
    } else if (activityName && description) {
      return `${activityName}: ${description}`;
    } else if (activityName) {
      return activityName;
    }
    
    return '';
  }

  /**
   * Genera un documento individual para un paciente (sin crear ZIP)
   * Optimizado para procesamiento paralelo
   * Soporta tanto PHP como IOP según el programType del grupo
   */
  async generateSinglePatientDocument(patient: any, data: any, overrideCode?: string): Promise<Buffer> {
    // LOG CRÍTICO: Confirmar que esta función se está ejecutando - USAR console.log PARA FORZAR VISIBILIDAD
    console.error(`🚨🚨🚨 EJECUTANDO generateSinglePatientDocument para: ${patient.name || patient.firstName || 'paciente desconocido'}`);
    this.logger.error(`🚨 EJECUTANDO generateSinglePatientDocument para: ${patient.name || patient.firstName || 'paciente desconocido'}`);
    
    // Detectar tipo de programa (PHP o IOP)
    const programType = data.group?.programType || 'PHP';
    const isIOP = programType === 'IOP';
    
    // DEBUG: Verificar detección de tipo de programa
    // Cambiar a ERROR y console.error para que siempre se muestre (forzar visibilidad)
    console.error(`🔍🔍🔍 Detección de programa: programType=${programType}, isIOP=${isIOP}, patient=${patient.name}`);
    this.logger.error(`🔍 Detección de programa en generateSinglePatientDocument:`);
    this.logger.error(`   - data.group?.programType: ${data.group?.programType}`);
    this.logger.error(`   - programType: ${programType}`);
    this.logger.error(`   - isIOP: ${isIOP}`);
    this.logger.error(`   - patient: ${patient.name || patient.firstName || 'N/A'}`);
    
    // Seleccionar template según el tipo de programa
    const templatePath = isIOP ? this.getIOPTemplatePath() : this.getSimpleTemplatePath();
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template ${isIOP ? 'IOP' : 'PHP'} simple no encontrado: ${templatePath}`);
    }

    const templateBuffer = fs.readFileSync(templatePath);
    this.logger.log(`📄 Usando template ${isIOP ? 'IOP' : 'PHP'}: ${templatePath}`);

    // Verificar si el paciente está ausente
    // DEBUG: Agregar logs para verificar por qué se marca como ausente
    console.error(`🚨🚨🚨 VERIFICANDO AUSENCIA: patient.isPresent=${patient.isPresent}, patient.attendance?.status=${patient.attendance?.status}, patient.name=${patient.name}`);
    this.logger.error(`🚨 VERIFICANDO AUSENCIA:`);
    this.logger.error(`   - patient.isPresent: ${patient.isPresent}`);
    this.logger.error(`   - patient.attendance?.status: ${patient.attendance?.status}`);
    this.logger.error(`   - patient.name: ${patient.name}`);
    this.logger.error(`   - patient.attendance: ${JSON.stringify(patient.attendance)}`);
    
    // CRÍTICO: Un paciente está ausente si:
    // 1. isPresent es explícitamente false, O
    // 2. attendance.status es 'A', O  
    // 3. attendance es undefined y isPresent no es true
    const isAbsent = patient.isPresent === false || 
                     patient.attendance?.status === 'A' || 
                     (patient.attendance === undefined && patient.isPresent !== true);
    
    console.error(`🚨🚨🚨 RESULTADO isAbsent: ${isAbsent} (isPresent=${patient.isPresent}, status=${patient.attendance?.status || 'undefined'})`);
    this.logger.error(`🚨 RESULTADO isAbsent: ${isAbsent}`);
    
    // CRÍTICO: Si el paciente está ausente pero estamos aquí, hay un problema de lógica
    if (isAbsent) {
      console.error(`🚨🚨🚨 ⚠️ CRÍTICO: Paciente AUSENTE detectado (isPresent=${patient.isPresent}, status=${patient.attendance?.status || 'undefined'}) - DEBE generar nota de ausencia`);
      console.error(`🚨🚨🚨 PACIENTE AUSENTE - Llamando generateSingleAbsenceDocument`);
      this.logger.error(`🚨 PACIENTE AUSENTE - Llamando generateSingleAbsenceDocument`);
      return this.generateSingleAbsenceDocument(patient, data, overrideCode);
    }
    
    console.error(`🚨🚨🚨 PACIENTE PRESENTE - Continuando con generación normal`);
    this.logger.error(`🚨 PACIENTE PRESENTE - Continuando con generación normal`);

    // Extraer diagnóstico ANTES de crear baseData (necesario para headers)
    // CRÍTICO: docx-templates procesa headers PRIMERO, por lo que todas las variables
    // del header deben estar disponibles desde el inicio en baseData
    const patientNumber = patient.patientNumber || patient.id || 'P001';
    
    let diagnosis: string = 'F33.2';
    let diagnosticCodes: string[] = [];
    let diagnosticDescriptions: string[] = [];
    
    if (isIOP) {
      // Para IOP: usar lista completa de diagnósticos
      this.logger.debug(`🔍 Procesando diagnósticos para IOP (ANTES de baseData):`);
      this.logger.debug(`   - patient.diagnosis: ${JSON.stringify(patient.diagnosis)}`);
      this.logger.debug(`   - patient.diagnoses: ${JSON.stringify(patient.diagnoses)}`);
      
      const diagnosesList = Array.isArray(patient.diagnosis) && patient.diagnosis.length > 0
        ? patient.diagnosis.filter((d: any) => d && typeof d === 'object')
        : Array.isArray(patient.diagnoses) && patient.diagnoses.length > 0
        ? patient.diagnoses
        : [];
      
      // Mapear diagnósticos a arrays (hasta 4)
      // IMPORTANTE: El template IOP tiene 4 líneas DIAGNOSIS que usan:
      // - {{diagnostic_code_1}} {{diagnostic_description_1}}
      // - {{diagnostic_code_2}} {{diagnostic_description_2}}
      // - {{diagnostic_code_3}} {{diagnostic_description_3}}
      // - {{diagnostic_code_4}} {{diagnostic_description_4}}
      console.error(`🚨🚨🚨 DEBUG DIAGNÓSTICOS IOP: diagnosesList.length=${diagnosesList.length}`);
      this.logger.debug(`🔍 Procesando ${diagnosesList.length} diagnósticos para IOP`);
      
      for (let i = 0; i < 4; i++) {
        if (diagnosesList[i]) {
          const diag = diagnosesList[i];
          const code = diag.icd10Code || diag.icd10_code || (typeof diag === 'string' ? diag : 'F33.2');
          const desc = diag.diagnosisDescription || diag.diagnosis_description || 'Major depressive disorder, recurrent episode, severe, without psychotic features';
          console.error(`🚨🚨🚨 DEBUG DIAGNÓSTICO ${i+1}: code=${code}, desc=${desc?.substring(0, 50)}`);
          diagnosticCodes.push(code);
          diagnosticDescriptions.push(desc);
        } else {
          // Si no hay más diagnósticos, dejar vacío (no repetir el último)
          diagnosticCodes.push('');
          diagnosticDescriptions.push('');
        }
      }
      
      console.error(`🚨🚨🚨 DEBUG diagnosticCodes final: [${diagnosticCodes.join(', ')}]`);
      
      diagnosis = diagnosticCodes[0] || 'F33.2';
      if (diagnosticCodes.length === 0 || diagnosticCodes.every(c => !c)) {
        diagnosticCodes[0] = 'F33.2';
        diagnosticDescriptions[0] = 'Major depressive disorder, recurrent episode, severe, without psychotic features';
      }
    } else {
      // Para PHP: usar solo el primer diagnóstico
      diagnosis = Array.isArray(patient.diagnosis) && patient.diagnosis.length > 0 
        ? (typeof patient.diagnosis[0] === 'string' 
          ? patient.diagnosis[0] 
          : patient.diagnosis[0]?.icd10Code || patient.diagnosis[0]?.icd10_code || 'F33.2')
        : 'F33.2';
    }
    
    // Preparar datos base
    // IMPORTANTE: date debe ser la fecha formateada DD/MM/YYYY que se usa en header y footer
    // CRÍTICO: Incluir diagnostic_code y diagnostic_description en baseData porque
    // docx-templates procesa headers PRIMERO y necesita estas variables disponibles
    const formattedDate = this.formatDate(data.date);
    const dayName = this.getDayOfWeek(data.date);
    
      // Preparar valores de diagnóstico para el header (disponibles desde el inicio)
      // IMPORTANTE: Para IOP, usar el primer diagnóstico disponible (puede ser el primario)
      // Para PHP, usar el diagnóstico simple
      const diagnosticCodeForHeader = isIOP 
        ? (diagnosticCodes[0] || 'F33.2')
        : (diagnosis || 'F33.2');
      const diagnosticDescriptionForHeader = isIOP
        ? (diagnosticDescriptions[0] || 'Major depressive disorder, recurrent episode, severe, without psychotic features')
        : 'Major depressive disorder, recurrent episode, severe, without psychotic features';
      
      // DEBUG: Verificar que los diagnósticos múltiples se están procesando correctamente
      console.error(`🚨🚨🚨 DEBUG HEADER DIAGNÓSTICO: diagnosticCodeForHeader=${diagnosticCodeForHeader}, diagnosticCodes.length=${diagnosticCodes.length}`);
      if (isIOP && diagnosticCodes.length > 1) {
        console.error(`🚨🚨🚨 DEBUG: IOP tiene ${diagnosticCodes.length} diagnósticos: [${diagnosticCodes.join(', ')}]`);
      }
    
    // LOG CRÍTICO: Verificar valores antes de crear baseData - USAR console.error PARA FORZAR VISIBILIDAD
    console.error(`🚨🚨🚨 ANTES DE CREAR baseData: diagnosticCodeForHeader=${diagnosticCodeForHeader}, diagnosticDescriptionForHeader=${diagnosticDescriptionForHeader?.substring(0, 50)}`);
    
    // CRÍTICO: Verificar actividades antes de formatear horarios y unidades
    // LOG para diagnosticar problema con horarios y unidades en IOP
    console.error(`🚨🚨🚨 DEBUG ACTIVIDADES IOP: data.activities?.length=${data.activities?.length || 0}, isIOP=${isIOP}`);
    if (data.activities && data.activities.length > 0) {
      data.activities.forEach((act: any, idx: number) => {
        console.error(`   [${idx}] name=${act.name || act.activityName || 'N/A'}, startTime=${act.startTime || 'N/A'}, endTime=${act.endTime || 'N/A'}, units=${act.units || 'N/A'}`);
      });
    } else {
      console.error(`   ⚠️⚠️⚠️ ADVERTENCIA: No hay actividades en data.activities para IOP!`);
    }
    
    this.logger.error(`🚨 VERIFICACIÓN ANTES DE CREAR baseData:`);
    this.logger.error(`   - diagnosticCodeForHeader: ${diagnosticCodeForHeader}`);
    this.logger.error(`   - diagnosticDescriptionForHeader: ${diagnosticDescriptionForHeader?.substring(0, 50)}...`);
    
    const baseData = {
      clinical_logo: data.group?.clinicName || data.group?.clinic?.clinicName || 'FAMILY HEALTH COMMUNITY',
      clinical_name: data.group?.clinicName || data.group?.clinic?.clinicName || 'FAMILY HEALTH COMMUNITY',
      day: dayName,
      date: formattedDate, // DD/MM/YYYY para header y footer
      group: '6',
      code: overrideCode || data.overrideCode || this.getCodeByDay(data.date, isIOP),
      // Setting siempre es "Setting 53" - se maneja directamente en el template
      
      // CRÍTICO: Agregar diagnostic_code y diagnostic_description en baseData
      // porque docx-templates procesa headers PRIMERO y necesita estas variables disponibles
      diagnostic_code: diagnosticCodeForHeader,
      diagnostic_description: diagnosticDescriptionForHeader,
      
      hour_first_activity: data.activities?.[0] ? this.formatTimeRange(data.activities[0]) : '',
      hour_second_activity: data.activities?.[1] ? this.formatTimeRange(data.activities[1]) : '',
      hour_third_activity: data.activities?.[2] ? this.formatTimeRange(data.activities[2]) : '',
      hour_fourth_activity: data.activities?.[3] ? this.formatTimeRange(data.activities[3]) : '',
      
      session_1_units: data.activities?.[0] ? `Session 1: ${data.activities[0].units || 1} Units` : '',
      session_2_units: data.activities?.[1] ? `Session 2: ${data.activities[1].units || 1} Units` : '',
      session_3_units: data.activities?.[2] ? `Session 3: ${data.activities[2].units || 1} Units` : '',
      session_4_units: data.activities?.[3] ? `Session 4: ${data.activities[3].units || 1} Units` : '',
      
      // Función que retorna la imagen de firma para docx-templates (async)
      terapeut_signature_image: async () => await this.getTherapistSignatureImage(
        data.group?.therapistId || data.group?.createdBy?.id
      ),
      terapeut_name: data.group?.therapist || 'Alina Morales, MSMH'
    };
    
    // LOG CRÍTICO: Verificar que las variables están en baseData después de crearlo - USAR console.error PARA FORZAR VISIBILIDAD
    const hasDiagnosticCode = 'diagnostic_code' in baseData;
    const hasDiagnosticDesc = 'diagnostic_description' in baseData;
    const diagnosticKeys = Object.keys(baseData).filter(k => k.includes('diagnostic')).join(', ');
    console.error(`🚨🚨🚨 DESPUÉS DE CREAR baseData: hasDiagnosticCode=${hasDiagnosticCode}, hasDiagnosticDesc=${hasDiagnosticDesc}, diagnostic_code=${baseData.diagnostic_code}, diagnosticKeys=${diagnosticKeys}`);
    
    // LOG CRÍTICO: Verificar horarios y unidades generados
    console.error(`🚨🚨🚨 DEBUG HORARIOS Y UNIDADES generados:`);
    console.error(`   hour_first_activity="${baseData.hour_first_activity}"`);
    console.error(`   hour_second_activity="${baseData.hour_second_activity}"`);
    console.error(`   hour_third_activity="${baseData.hour_third_activity}"`);
    console.error(`   hour_fourth_activity="${baseData.hour_fourth_activity}"`);
    console.error(`   session_1_units="${baseData.session_1_units}"`);
    console.error(`   session_2_units="${baseData.session_2_units}"`);
    console.error(`   session_3_units="${baseData.session_3_units}"`);
    console.error(`   session_4_units="${baseData.session_4_units}"`);
    this.logger.error(`🚨 VERIFICACIÓN DE baseData DESPUÉS DE CREARLO:`);
    this.logger.error(`   - diagnostic_code en baseData: ${hasDiagnosticCode ? 'SÍ' : 'NO'}`);
    this.logger.error(`   - diagnostic_code valor: ${baseData.diagnostic_code}`);
    this.logger.error(`   - diagnostic_description en baseData: ${hasDiagnosticDesc ? 'SÍ' : 'NO'}`);
    this.logger.error(`   - diagnostic_description valor: ${baseData.diagnostic_description?.substring(0, 50)}...`);
    this.logger.error(`   - Keys en baseData que contienen 'diagnostic': ${diagnosticKeys}`);

    // NOTA: diagnosis, diagnosticCodes y patientNumber ya se obtuvieron ANTES de crear baseData
    // (ver arriba donde se procesan los diagnósticos antes de baseData)
    
    // Extraer goals
    const goals = patient.goals || [];
    // Ordenar goals por goalNumber para asegurar orden correcto
    const sortedGoals = [...goals].sort((a, b) => (a.goalNumber || 0) - (b.goalNumber || 0));
    const getGoalDescription = (index: number) => {
      // Buscar goal por goalNumber (index + 1 porque goalNumber es 1-based)
      const goal = sortedGoals.find(g => g.goalNumber === index + 1);
      if (goal && typeof goal === 'object') {
        return goal.goalText || '';
      }
      return ''; // NO inventar goals si no existen
    };
    
    // Determinar el goal seleccionado según el día de la semana
    const selectedGoalNumber = this.getSelectedGoalNumber(data.date);
    const selectedGoalText = getGoalDescription(selectedGoalNumber - 1) || '';
    
    // Log de depuración para verificar el goal seleccionado
    console.error(`🚨🚨🚨 DEBUG GOAL SELECTION: date=${data.date}, selectedGoalNumber=${selectedGoalNumber}, selectedGoalText=${selectedGoalText.substring(0, 50)}...`);
    
    // Determinar el prefijo del terapeuta según el tipo de programa
    const therapistPrefix = isIOP ? 'IOP Therapist' : 'PHP Therapist';
    
    // Métricas aleatorias (COOPERATION, MOTIVATION, CONCENTRATION & FOCUS, PEER INTERACTION)
    // Cada llamada genera un valor diferente entre "Moderate" y "Minor"
    const cooperation = this.getRandomMetric();
    const motivation = this.getRandomMetric();
    const concentration = this.getRandomMetric();
    const peerInteraction = this.getRandomMetric();
    
    // DEBUG: Verificar aleatoriedad de métricas
    this.logger.debug(`Métricas generadas: cooperation=${cooperation}, motivation=${motivation}, concentration=${concentration}, peerInteraction=${peerInteraction}`);
    
    // Generar respuestas de cliente y resumen de progreso con Gemini AI
    const patientIndex = data.patients?.indexOf(patient) || 0;
    const patientName = patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Patient';
    
    // Determinar qué grupo corresponde al goal marcado (el grupo que mostrará el response relacionado)
    // Group 1 para Goal#1, Group 2 para Goal#2, Group 3 para Goal#3, Group 4 para Goal#4
    const goalGroupIndex = selectedGoalNumber - 1; // Convertir a índice 0-based
    
    // Generar respuestas de cliente con IA (en paralelo para mejor rendimiento)
    // Solo pasar el goal al grupo correspondiente
    const [clientResponse1, clientResponse2, clientResponse3, clientResponse4, progressSummary] = await Promise.all([
      this.generateClientResponseWithAI(patientName, 0, data.activities || [], isIOP, goalGroupIndex === 0 ? selectedGoalNumber : undefined, goalGroupIndex === 0 ? selectedGoalText : undefined).catch(() => this.getClientResponse(1, patientIndex)),
      this.generateClientResponseWithAI(patientName, 1, data.activities || [], isIOP, goalGroupIndex === 1 ? selectedGoalNumber : undefined, goalGroupIndex === 1 ? selectedGoalText : undefined).catch(() => this.getClientResponse(2, patientIndex)),
      this.generateClientResponseWithAI(patientName, 2, data.activities || [], isIOP, goalGroupIndex === 2 ? selectedGoalNumber : undefined, goalGroupIndex === 2 ? selectedGoalText : undefined).catch(() => this.getClientResponse(3, patientIndex)),
      this.generateClientResponseWithAI(patientName, 3, data.activities || [], isIOP, goalGroupIndex === 3 ? selectedGoalNumber : undefined, goalGroupIndex === 3 ? selectedGoalText : undefined).catch(() => this.getClientResponse(4, patientIndex)),
      this.generateProgressSummaryWithAI(patientName, data.activities || []).catch(() => this.getProgressExplanation(patientName, data.activities || [])),
    ]);
    
    // Extraer solo la declaración del cliente (sin la intervención del terapeuta)
    const extractStatement = (response: string): string => {
      const match = response.match(/^"([^"]+)"/);
      if (match && match[1]) {
        return match[1];
      }
      // Si no hay comillas, intentar extraer la primera oración
      const firstSentence = response.split('.')[0].trim();
      return firstSentence.startsWith('"') ? firstSentence.slice(1) : firstSentence;
    };
    
    const statement1 = extractStatement(clientResponse1);
    const statement2 = extractStatement(clientResponse2);
    const statement3 = extractStatement(clientResponse3);
    const statement4 = extractStatement(clientResponse4);

    // Preparar datos del paciente
    // NOTA: diagnostic_code y diagnostic_description ya están en baseData (agregados arriba)
    // por lo que se heredan automáticamente en patientDataBase con el spread operator
    
    // CRÍTICO: Construir patientData asegurando que las variables IOP estén siempre presentes
    // cuando isIOP es true. Las variables diagnostic_code y diagnostic_description ya están
    // en baseData, por lo que se heredan automáticamente.
    const patientDataBase: any = {
      ...baseData,
      patient_name: (patient.name || 'Patient Name').toUpperCase(),
      id: String(patientNumber || '').trim(),
      patient_icd10: diagnosis,
      totalUnits: this.calculateTotalUnits(data.activities).toString(),
    };
    
    // NOTA: diagnostic_code y diagnostic_description ya están en baseData (agregados arriba)
    // por lo que se heredan automáticamente en patientDataBase con el spread operator
    // No es necesario agregarlas de nuevo aquí
    this.logger.error(`✅ Variables diagnostic heredadas de baseData en patientDataBase:`);
    this.logger.error(`   - diagnostic_code: ${patientDataBase.diagnostic_code}`);
    this.logger.error(`   - diagnostic_description: ${patientDataBase.diagnostic_description?.substring(0, 50)}...`);
    
    // CRÍTICO: Asegurar que las variables indexadas SIEMPRE estén presentes para IOP
    // Incluso si los arrays están incompletos, siempre proporcionar las 4 variables
    const indexedDiagnosticVars: any = {};
    if (isIOP) {
      // IMPORTANTE: El template IOP usa diagnostic_code1 (sin guión bajo)
      // Asegurar que siempre haya 4 variables, incluso si están vacías
      for (let i = 1; i <= 4; i++) {
        const codeKey = `diagnostic_code${i}`;
        const descKey = `diagnostic_description${i}`;
        const codeKeyUnderscore = `diagnostic_code_${i}`;
        const descKeyUnderscore = `diagnostic_description_${i}`;
        
        // Usar el índice correcto (i-1 porque el array es 0-based)
        const codeValue = diagnosticCodes[i - 1] || '';
        const descValue = diagnosticDescriptions[i - 1] || '';
        
        indexedDiagnosticVars[codeKey] = codeValue;
        indexedDiagnosticVars[descKey] = descValue;
        // También agregar versiones con guión bajo por compatibilidad
        indexedDiagnosticVars[codeKeyUnderscore] = codeValue;
        indexedDiagnosticVars[descKeyUnderscore] = descValue;
      }
      
      // DEBUG: Verificar que todas las variables indexadas están presentes
      console.error(`🚨🚨🚨 DEBUG VARIABLES INDEXADAS: diagnostic_code1=${indexedDiagnosticVars.diagnostic_code1}, diagnostic_code2=${indexedDiagnosticVars.diagnostic_code2}, diagnostic_code3=${indexedDiagnosticVars.diagnostic_code3}, diagnostic_code4=${indexedDiagnosticVars.diagnostic_code4}`);
      
      // CRÍTICO: Validar que todas las variables indexadas están presentes y son strings
      for (let i = 1; i <= 4; i++) {
        const codeKey = `diagnostic_code${i}`;
        const descKey = `diagnostic_description${i}`;
        
        if (!(codeKey in indexedDiagnosticVars) || indexedDiagnosticVars[codeKey] === undefined) {
          this.logger.error(`❌ CRÍTICO: ${codeKey} no está presente en indexedDiagnosticVars`);
          indexedDiagnosticVars[codeKey] = i === 1 ? (diagnosticCodes[0] || 'F33.2') : '';
        }
        if (!(descKey in indexedDiagnosticVars) || indexedDiagnosticVars[descKey] === undefined) {
          this.logger.error(`❌ CRÍTICO: ${descKey} no está presente en indexedDiagnosticVars`);
          indexedDiagnosticVars[descKey] = i === 1 ? (diagnosticDescriptions[0] || 'Major depressive disorder, recurrent episode, severe, without psychotic features') : '';
        }
        
        // Asegurar que sean strings
        if (typeof indexedDiagnosticVars[codeKey] !== 'string') {
          indexedDiagnosticVars[codeKey] = String(indexedDiagnosticVars[codeKey] || '');
        }
        if (typeof indexedDiagnosticVars[descKey] !== 'string') {
          indexedDiagnosticVars[descKey] = String(indexedDiagnosticVars[descKey] || '');
        }
      }
    }
    
    // CRÍTICO: Log para verificar que indexedDiagnosticVars tiene las variables antes de crear patientData
    if (isIOP) {
      const indexedKeys = Object.keys(indexedDiagnosticVars);
      console.error(`🚨🚨🚨 indexedDiagnosticVars tiene ${indexedKeys.length} keys: ${indexedKeys.filter(k => k.startsWith('diagnostic_code') || k.startsWith('diagnostic_description')).join(', ')}`);
      console.error(`🚨🚨🚨 diagnostic_code1 en indexedDiagnosticVars: ${indexedDiagnosticVars.diagnostic_code1 || 'FALTANTE'}`);
    }
    
    const patientData: any = {
      ...patientDataBase,
      // Agregar variables indexadas solo para IOP
      ...indexedDiagnosticVars,
      
      // Checkboxes dinámicos según el goal seleccionado
      goal1_checkbox: selectedGoalNumber === 1 ? '☒' : '☐',
      goal2_checkbox: selectedGoalNumber === 2 ? '☒' : '☐',
      goal3_checkbox: selectedGoalNumber === 3 ? '☒' : '☐',
      goal4_checkbox: selectedGoalNumber === 4 ? '☒' : '☐',
      
      goal1_label: 'GOAL#1',
      goal2_label: 'GOAL#2',
      goal3_label: 'GOAL#3',
      goal4_label: 'GOAL#4',
      
      // Combinación de checkbox + label para el template (si el template lo requiere)
      goal1_full: `${selectedGoalNumber === 1 ? '☒' : '☐'}GOAL#1`,
      goal2_full: `${selectedGoalNumber === 2 ? '☒' : '☐'}GOAL#2`,
      goal3_full: `${selectedGoalNumber === 3 ? '☒' : '☐'}GOAL#3`,
      goal4_full: `${selectedGoalNumber === 4 ? '☒' : '☐'}GOAL#4`,
      
      // Solo cargar goals que existen en la BD (NO inventar)
      patient_goal1: getGoalDescription(0) || '',
      patient_goal2: getGoalDescription(1) || '',
      patient_goal3: getGoalDescription(2) || '',
      patient_goal4: getGoalDescription(3) || '',
      
      patient_group1_header: this.getGroupActivityHeader(1, data.activities, isIOP),
      patient_group1_paragraph: this.getGroupActivityParagraph(1, data.activities, isIOP),
      patient_group2_header: this.getGroupActivityHeader(2, data.activities, isIOP),
      patient_group2_paragraph: this.getGroupActivityParagraph(2, data.activities, isIOP),
      patient_group3_header: this.getGroupActivityHeader(3, data.activities, isIOP),
      patient_group3_paragraph: this.getGroupActivityParagraph(3, data.activities, isIOP),
      patient_group4_header: this.getGroupActivityHeader(4, data.activities, isIOP),
      patient_group4_paragraph: this.getGroupActivityParagraph(4, data.activities, isIOP),
      
      patient_group1: this.getGroupActivity(1, data.activities, isIOP),
      patient_group2: this.getGroupActivity(2, data.activities, isIOP),
      patient_group3: this.getGroupActivity(3, data.activities, isIOP),
      patient_group4: this.getGroupActivity(4, data.activities, isIOP),
      
      GROUP1_CLIENT_RESPONSE_LABEL: 'CLIENT RESPONSE',
      // Labels dinámicos: solo el grupo correspondiente al goal marcado tiene la referencia
      group1_client_response_label: selectedGoalNumber === 1 ? `Group 1: Client Response(Goal#${selectedGoalNumber}/Obj${selectedGoalNumber}A)` : 'Group 1 Client Response',
      group2_client_response_label: selectedGoalNumber === 2 ? `Group 2: Client Response(Goal#${selectedGoalNumber}/Obj${selectedGoalNumber}A)` : 'Group 2 Client Response',
      group3_client_response_label: selectedGoalNumber === 3 ? `Group 3: Client Response(Goal#${selectedGoalNumber}/Obj${selectedGoalNumber}A)` : 'Group 3 Client Response',
      group4_client_response_label: selectedGoalNumber === 4 ? `Group 4: Client Response(Goal#${selectedGoalNumber}/Obj${selectedGoalNumber}A)` : 'Group 4 Client Response',
      
      patient_statement1: `"${statement1}". The therapist`,
      patient_statement2: `"${statement2}". The therapist`,
      patient_statement3: `"${statement3}". Intervention: The therapist`,
      patient_statement4: `"${statement4}". Intervention: The therapist`,
      
      patient_intervention1: clientResponse1.includes('The therapist') || clientResponse1.includes('therapist') 
        ? clientResponse1.split(/The therapist|therapist/i)[1]?.trim() || `${therapistPrefix} modeled how to transform vague expressions into clear, goal-directed statements. The therapist prompted the client to rephrase their statement more concretely by asking, "What exactly are you trying to say when you use that phrase?"`
        : `${therapistPrefix} modeled how to transform vague expressions into clear, goal-directed statements. The therapist prompted the client to rephrase their statement more concretely by asking, "What exactly are you trying to say when you use that phrase?"`,
      patient_intervention2: clientResponse2.includes('The therapist') || clientResponse2.includes('therapist')
        ? clientResponse2.split(/The therapist|therapist/i)[1]?.trim() || `${therapistPrefix} guided the client through a step-by-step breakdown of a recent issue they mentioned and helped generate three alternative solutions, highlighting the pros and cons of each. The therapist emphasized that having multiple options increases emotional flexibility and reduces impulsive reactions.`
        : `${therapistPrefix} guided the client through a step-by-step breakdown of a recent issue they mentioned and helped generate three alternative solutions, highlighting the pros and cons of each. The therapist emphasized that having multiple options increases emotional flexibility and reduces impulsive reactions.`,
      patient_intervention3: clientResponse3.includes('The therapist') || clientResponse3.includes('therapist')
        ? clientResponse3.split(/The therapist|therapist/i)[1]?.trim() || `${therapistPrefix} facilitated a role-play scenario in which the client was asked to pause before responding and verbalize what the other person might be experiencing emotionally. The therapist reinforced the importance of slowing down to enhance social attunement.`
        : `${therapistPrefix} facilitated a role-play scenario in which the client was asked to pause before responding and verbalize what the other person might be experiencing emotionally. The therapist reinforced the importance of slowing down to enhance social attunement.`,
      patient_intervention4: clientResponse4.includes('The therapist') || clientResponse4.includes('therapist')
        ? clientResponse4.split(/The therapist|therapist/i)[1]?.trim() || `${therapistPrefix} acknowledged the client's ambivalence and validated their experience. The therapist encouraged the client to explore how support groups offer a structured and safe environment that can gradually restore trust and connection, while still honoring their need for solitude.`
        : `${therapistPrefix} acknowledged the client's ambivalence and validated their experience. The therapist encouraged the client to explore how support groups offer a structured and safe environment that can gradually restore trust and connection, while still honoring their need for solitude.`,
      
      progress_level: 'Moderate Progress',
      patient_progress: progressSummary,
      // Para IOP: agregar patient_progress_level (texto completo requerido por template IOP)
      ...(isIOP && {
        patient_progress_level: progressSummary,
      }),
      
      cooperation_moderate: cooperation === 'Moderate' ? '☒' : '☐',
      cooperation_minor: cooperation === 'Minor' ? '☒' : '☐',
      cooperation_poor: '☐',
      motivation_moderate: motivation === 'Moderate' ? '☒' : '☐',
      motivation_minor: motivation === 'Minor' ? '☒' : '☐',
      motivation_poor: '☐',
      concentration_moderate: concentration === 'Moderate' ? '☒' : '☐',
      concentration_minor: concentration === 'Minor' ? '☒' : '☐',
      concentration_poor: '☐',
      peer_moderate: peerInteraction === 'Moderate' ? '☒' : '☐',
      peer_minor: peerInteraction === 'Minor' ? '☒' : '☐',
      peer_poor: '☐',
      attitude_positive: '☐',
      attitude_negative: '☐',
      attitude_fluctuations: '☒',
      
      cooperation,
      motivation,
      concentration,
      peerInteraction,
      attitude: 'Fluctuations',
      
      // Variables para checkboxes de Attended/Absent
      // Si el paciente está presente (isPresent === true y status !== 'A'), marcar Attended
      // Si está ausente (isPresent === false o status === 'A'), marcar Absent
      attended: patient.isPresent === true && patient.attendance?.status !== 'A' ? '☒' : '☐',
      absent: patient.isPresent === false || patient.attendance?.status === 'A' ? '☒' : '☐',
    };

    // DEBUG: Verificar que diagnostic_code y diagnostic_description están presentes (para ambos tipos)
    // Ahora están presentes tanto para IOP como para PHP
    this.logger.error(`🔍 VERIFICACIÓN FINAL de variables diagnostic antes de generar documento:`);
    this.logger.error(`   - isIOP: ${isIOP}`);
    this.logger.error(`   - programType: ${programType}`);
    this.logger.error(`   - diagnostic_code presente en patientData: ${'diagnostic_code' in patientData}`);
    this.logger.error(`   - diagnostic_code valor: ${patientData.diagnostic_code}`);
    this.logger.error(`   - diagnostic_code tipo: ${typeof patientData.diagnostic_code}`);
    this.logger.error(`   - diagnostic_description presente en patientData: ${'diagnostic_description' in patientData}`);
    this.logger.error(`   - diagnostic_description valor: ${patientData.diagnostic_description?.substring(0, 50)}...`);
    this.logger.error(`   - diagnostic_description tipo: ${typeof patientData.diagnostic_description}`);
    
    // Validar que las variables están presentes y son strings válidos (para ambos tipos)
    if (isIOP || !isIOP) { // Siempre validar para ambos tipos
      
      // CRÍTICO: Validación y corrección de variables (fallback de seguridad)
      // Esto es esencial porque docx-templates procesa headers/footers primero
      if (!('diagnostic_code' in patientData) || patientData.diagnostic_code === undefined || patientData.diagnostic_code === null) {
        this.logger.error(`❌ CRÍTICO: diagnostic_code no está definido o es null/undefined, agregando valor por defecto`);
        patientData.diagnostic_code = 'F33.2';
      }
      if (!('diagnostic_description' in patientData) || patientData.diagnostic_description === undefined || patientData.diagnostic_description === null) {
        this.logger.error(`❌ CRÍTICO: diagnostic_description no está definido o es null/undefined, agregando valor por defecto`);
        patientData.diagnostic_description = 'Major depressive disorder, recurrent episode, severe, without psychotic features';
      }
      
      // Validación final: asegurar que son strings válidos (no undefined, null, o vacíos problemáticos)
      if (typeof patientData.diagnostic_code !== 'string' || patientData.diagnostic_code.trim() === '') {
        this.logger.error(`❌ diagnostic_code no es un string válido, usando valor por defecto`);
        patientData.diagnostic_code = 'F33.2';
      }
      if (typeof patientData.diagnostic_description !== 'string' || patientData.diagnostic_description.trim() === '') {
        this.logger.error(`❌ diagnostic_description no es un string válido, usando valor por defecto`);
        patientData.diagnostic_description = 'Major depressive disorder, recurrent episode, severe, without psychotic features';
      }
      
      // Verificación final: asegurar que las variables existen y son strings
      const finalCheck = {
        hasCode: 'diagnostic_code' in patientData,
        hasDescription: 'diagnostic_description' in patientData,
        codeType: typeof patientData.diagnostic_code,
        descType: typeof patientData.diagnostic_description,
        codeValue: patientData.diagnostic_code,
        descValue: patientData.diagnostic_description?.substring(0, 30)
      };
      
      this.logger.error(`✅ VERIFICACIÓN FINAL COMPLETA:`);
      this.logger.error(`   ${JSON.stringify(finalCheck, null, 2)}`);
      
      if (!finalCheck.hasCode || !finalCheck.hasDescription) {
        this.logger.error(`❌ CRÍTICO: Variables no presentes después de validaciones`);
        throw new Error(`❌ CRÍTICO: Las variables diagnostic_code o diagnostic_description no están presentes en patientData después de todas las validaciones`);
      }
    } else {
      // Si NO es IOP, asegurarse de que NO estén las variables (solo para PHP)
      this.logger.error(`⚠️ No es IOP (programType: ${programType}), las variables diagnostic_code/description NO deberían estar`);
      if ('diagnostic_code' in patientData) {
        this.logger.error(`⚠️ ADVERTENCIA: diagnostic_code presente en patientData pero NO es IOP`);
      }
    }

    // Log final antes de generar documento
    this.logger.error(`📄 Generando documento Word para ${patient.name || 'paciente'}:`);
    this.logger.error(`   - Template: ${isIOP ? 'IOP' : 'PHP'}`);
    this.logger.error(`   - isIOP: ${isIOP}`);
    if (isIOP) {
      this.logger.error(`   - diagnostic_code en patientData: ${'diagnostic_code' in patientData ? 'SÍ' : 'NO'}`);
      if ('diagnostic_code' in patientData) {
        this.logger.error(`   - diagnostic_code valor: ${patientData.diagnostic_code}`);
      } else {
        this.logger.error(`   - ❌ CRÍTICO: diagnostic_code NO está en patientData`);
      }
    }

    // CRÍTICO: Log final antes de createReport para verificar que las variables están presentes - USAR console.error PARA FORZAR VISIBILIDAD
    const hasDiagnosticCodeInPatientData = 'diagnostic_code' in patientData;
    const hasDiagnosticDescInPatientData = 'diagnostic_description' in patientData;
    const diagnosticKeysInPatientData = Object.keys(patientData).filter(k => k.includes('diagnostic')).join(', ');
    console.error(`🚨🚨🚨 ANTES DE createReport: hasDiagnosticCode=${hasDiagnosticCodeInPatientData}, hasDiagnosticDesc=${hasDiagnosticDescInPatientData}, diagnostic_code=${patientData.diagnostic_code}, diagnosticKeys=${diagnosticKeysInPatientData}`);
    
    // CRÍTICO: Verificar que totalUnits está presente y es un string válido
    const hasTotalUnits = 'totalUnits' in patientData;
    const totalUnitsValue = patientData.totalUnits;
    console.error(`🚨🚨🚨 VERIFICACIÓN totalUnits: hasTotalUnits=${hasTotalUnits}, totalUnits=${totalUnitsValue}, tipo=${typeof totalUnitsValue}`);
    if (!hasTotalUnits || totalUnitsValue === undefined || totalUnitsValue === null) {
      this.logger.error(`❌ CRÍTICO: totalUnits no está definido en patientData, agregando valor por defecto`);
      patientData.totalUnits = '0';
    } else if (typeof totalUnitsValue !== 'string') {
      this.logger.error(`❌ CRÍTICO: totalUnits no es un string (es ${typeof totalUnitsValue}), convirtiendo a string`);
      patientData.totalUnits = String(totalUnitsValue);
    }
    
    // CRÍTICO: Verificar que id está presente y es un string válido
    const hasId = 'id' in patientData;
    const idValue = patientData.id;
    console.error(`🚨🚨🚨 VERIFICACIÓN id: hasId=${hasId}, id=${idValue}, tipo=${typeof idValue}`);
    if (!hasId || idValue === undefined || idValue === null) {
      this.logger.error(`❌ CRÍTICO: id no está definido en patientData, agregando valor por defecto`);
      patientData.id = '';
    } else if (typeof idValue !== 'string') {
      this.logger.error(`❌ CRÍTICO: id no es un string (es ${typeof idValue}), convirtiendo a string`);
      patientData.id = String(idValue);
    }
    
    // CRÍTICO: Verificar que las variables indexadas están presentes para IOP
    if (isIOP) {
      for (let i = 1; i <= 4; i++) {
        const codeKey = `diagnostic_code${i}`;
        const descKey = `diagnostic_description${i}`;
        const hasCodeKey = codeKey in patientData;
        const hasDescKey = descKey in patientData;
        console.error(`🚨🚨🚨 VARIABLE INDEXADA ${i}: ${codeKey}=${hasCodeKey ? 'SÍ' : 'NO'} (${patientData[codeKey] || 'vacío'}), ${descKey}=${hasDescKey ? 'SÍ' : 'NO'}`);
        if (!hasCodeKey || !hasDescKey) {
          this.logger.error(`❌ CRÍTICO: Variable indexada ${i} faltante antes de createReport, agregando valores por defecto`);
          // Asegurar que las variables estén presentes con valores por defecto
          if (!hasCodeKey) {
            patientData[codeKey] = i === 1 ? (diagnosticCodes[0] || 'F33.2') : '';
          }
          if (!hasDescKey) {
            patientData[descKey] = i === 1 ? (diagnosticDescriptions[0] || 'Major depressive disorder, recurrent episode, severe, without psychotic features') : '';
          }
        }
        // Asegurar que sean strings
        if (typeof patientData[codeKey] !== 'string') {
          patientData[codeKey] = String(patientData[codeKey] || (i === 1 ? 'F33.2' : ''));
        }
        if (typeof patientData[descKey] !== 'string') {
          patientData[descKey] = String(patientData[descKey] || (i === 1 ? 'Major depressive disorder, recurrent episode, severe, without psychotic features' : ''));
        }
      }
    }
    this.logger.error(`🚨 ANTES DE createReport - Verificación de variables:`);
    this.logger.error(`   - diagnostic_code en patientData: ${hasDiagnosticCodeInPatientData ? 'SÍ' : 'NO'}`);
    this.logger.error(`   - diagnostic_code valor: ${patientData.diagnostic_code}`);
    this.logger.error(`   - diagnostic_description en patientData: ${hasDiagnosticDescInPatientData ? 'SÍ' : 'NO'}`);
    this.logger.error(`   - diagnostic_description valor: ${patientData.diagnostic_description?.substring(0, 50)}...`);
    this.logger.error(`   - Keys en patientData que contienen 'diagnostic': ${diagnosticKeysInPatientData}`);
    
    // Verificar que diagnostic_code y diagnostic_description están presentes
    if (!hasDiagnosticCodeInPatientData || patientData.diagnostic_code === undefined) {
      console.error(`❌❌❌ CRÍTICO: diagnostic_code NO está en patientData antes de createReport! Agregando valor por defecto...`);
      this.logger.error(`❌ CRÍTICO: diagnostic_code NO está en patientData antes de createReport!`);
      this.logger.error(`   - Agregando valor por defecto...`);
      patientData.diagnostic_code = 'F33.2';
    }
    if (!hasDiagnosticDescInPatientData || patientData.diagnostic_description === undefined) {
      console.error(`❌❌❌ CRÍTICO: diagnostic_description NO está en patientData antes de createReport! Agregando valor por defecto...`);
      this.logger.error(`❌ CRÍTICO: diagnostic_description NO está en patientData antes de createReport!`);
      this.logger.error(`   - Agregando valor por defecto...`);
      patientData.diagnostic_description = 'Major depressive disorder, recurrent episode, severe, without psychotic features';
    }
    
    // Generar documento Word
    console.error(`🚨🚨🚨 LLAMANDO A createReport AHORA...`);
    console.error(`🚨🚨🚨 DEBUG CHECKBOXES EN patientData: goal1_checkbox=${patientData.goal1_checkbox}, goal2_checkbox=${patientData.goal2_checkbox}, goal3_checkbox=${patientData.goal3_checkbox}, goal4_checkbox=${patientData.goal4_checkbox}`);
    console.error(`🚨🚨🚨 DEBUG LABELS EN patientData: group1_client_response_label=${patientData.group1_client_response_label}, group2_client_response_label=${patientData.group2_client_response_label}, group3_client_response_label=${patientData.group3_client_response_label}, group4_client_response_label=${patientData.group4_client_response_label}`);
    this.logger.error(`🚨 LLAMANDO A createReport AHORA...`);
    const report = await createReport({
      template: templateBuffer,
      data: patientData,
      cmdDelimiter: ['{{', '}}'],
      processLineBreaks: true,
    });

    return Buffer.isBuffer(report) ? report : Buffer.from(report);
  }

  /**
   * Genera un documento de ausencia individual (sin crear ZIP)
   * Soporta tanto PHP como IOP (usa templates diferentes según el tipo)
   */
  async generateSingleAbsenceDocument(patient: any, data: any, overrideCode?: string): Promise<Buffer> {
    // Detectar tipo de programa (PHP o IOP)
    const programType = data.group?.programType || 'PHP';
    const isIOP = programType === 'IOP';
    
    // Seleccionar template de ausencia según el tipo de programa
    const absencePath = isIOP ? this.getIOPAbsenceTemplatePath() : this.getAbsenceTemplatePath();
    this.logger.log(`🔍 Verificando template de ausencia ${isIOP ? 'IOP' : 'PHP'}: ${absencePath}`);
    this.logger.log(`🔍 Archivo existe: ${fs.existsSync(absencePath)}`);
    
    if (!fs.existsSync(absencePath)) {
      throw new Error(`Template de ausencia ${isIOP ? 'IOP' : 'PHP'} no encontrado: ${absencePath}`);
    }

    const templateBuffer = fs.readFileSync(absencePath);

    // Procesar razón de ausencia
    let absenceReasonText = 'Client was not present';
    if (patient.attendance?.absenceReasons && patient.attendance.absenceReasons.length > 0) {
      const firstReason = patient.attendance.absenceReasons[0];
      const reasonTypeMap: { [key: string]: string } = {
        'medical': 'Medical reason',
        'personal': 'Personal reason',
        'transportation': 'Transportation issue',
        'other': 'Other'
      };
      const reasonTypeValue = firstReason.reasonType || '';
      const reasonType = reasonTypeMap[reasonTypeValue] || reasonTypeValue;
      absenceReasonText = reasonType;
      if (firstReason.notes) {
        absenceReasonText += `: ${firstReason.notes}`;
      }
    }

    // Extraer diagnóstico para header (necesario para templates de ausencia que usan header)
    let diagnosisForAbsence: string = 'F33.2';
    let diagnosticDescriptionForAbsence: string = 'Major depressive disorder, recurrent episode, severe, without psychotic features';
    
    if (Array.isArray(patient.diagnosis) && patient.diagnosis.length > 0) {
      const firstDiagnosis = patient.diagnosis[0];
      if (typeof firstDiagnosis === 'string') {
        diagnosisForAbsence = firstDiagnosis;
      } else if (firstDiagnosis?.icd10Code || firstDiagnosis?.icd10_code) {
        diagnosisForAbsence = firstDiagnosis.icd10Code || firstDiagnosis.icd10_code || 'F33.2';
        diagnosticDescriptionForAbsence = firstDiagnosis.description || firstDiagnosis.icd10Description || diagnosticDescriptionForAbsence;
      }
    }
    
    console.error(`🚨🚨🚨 generateSingleAbsenceDocument: isIOP=${isIOP}, programType=${programType}, absencePath=${absencePath}`);
    console.error(`🚨🚨🚨 generateSingleAbsenceDocument: diagnosisForAbsence=${diagnosisForAbsence}, diagnosticDescriptionForAbsence=${diagnosticDescriptionForAbsence?.substring(0, 50)}`);
    
    // Para IOP: preparar variables indexadas de diagnóstico (hasta 4 diagnósticos)
    const indexedDiagnosticVars: any = {};
    if (isIOP) {
      // Obtener lista completa de diagnósticos
      let diagnosticCodes: string[] = [];
      let diagnosticDescriptions: string[] = [];
      
      const diagnosesList = Array.isArray(patient.diagnosis) && patient.diagnosis.length > 0
        ? patient.diagnosis.filter((d: any) => d && typeof d === 'object')
        : Array.isArray(patient.diagnoses) && patient.diagnoses.length > 0
        ? patient.diagnoses
        : [];
      
      // Mapear diagnósticos a arrays (hasta 4)
      for (let i = 0; i < 4; i++) {
        if (diagnosesList[i]) {
          const diag = diagnosesList[i];
          const code = diag.icd10Code || diag.icd10_code || (typeof diag === 'string' ? diag : 'F33.2');
          const desc = diag.diagnosisDescription || diag.diagnosis_description || 'Major depressive disorder, recurrent episode, severe, without psychotic features';
          diagnosticCodes.push(code);
          diagnosticDescriptions.push(desc);
        } else {
          diagnosticCodes.push('');
          diagnosticDescriptions.push('');
        }
      }
      
      // Si no hay diagnósticos, usar el primero como fallback
      if (diagnosticCodes.length === 0 || diagnosticCodes.every(c => !c)) {
        diagnosticCodes[0] = diagnosisForAbsence;
        diagnosticDescriptions[0] = diagnosticDescriptionForAbsence;
      }
      
      // Crear variables indexadas
      for (let i = 1; i <= 4; i++) {
        const codeKey = `diagnostic_code${i}`;
        const descKey = `diagnostic_description${i}`;
        const codeValue = diagnosticCodes[i - 1] || '';
        const descValue = diagnosticDescriptions[i - 1] || '';
        
        indexedDiagnosticVars[codeKey] = String(codeValue || (i === 1 ? diagnosisForAbsence : ''));
        indexedDiagnosticVars[descKey] = String(descValue || (i === 1 ? diagnosticDescriptionForAbsence : ''));
      }
      
      console.error(`🚨🚨🚨 generateSingleAbsenceDocument IOP: diagnostic_code1=${indexedDiagnosticVars.diagnostic_code1}, diagnostic_code2=${indexedDiagnosticVars.diagnostic_code2}`);
    }
    
    const absenceData = {
      clinical_logo: data.group?.clinicName || data.group?.clinic?.clinicName || 'FAMILY HEALTH COMMUNITY',
      clinical_name: data.group?.clinicName || data.group?.clinic?.clinicName || 'FAMILY HEALTH COMMUNITY',
      day: this.getDayOfWeek(data.date),
      date: this.formatDate(data.date),
      group: '6',
      code: overrideCode || data.overrideCode || this.getCodeByDay(data.date, isIOP),
      
      // CRÍTICO: Agregar diagnostic_code y diagnostic_description en absenceData
      // porque docx-templates procesa headers PRIMERO y necesita estas variables disponibles
      diagnostic_code: diagnosisForAbsence,
      diagnostic_description: diagnosticDescriptionForAbsence,
      
      hour_first_activity: data.activities?.[0] ? this.formatTimeRange(data.activities[0]) : '',
      hour_second_activity: data.activities?.[1] ? this.formatTimeRange(data.activities[1]) : '',
      hour_third_activity: data.activities?.[2] ? this.formatTimeRange(data.activities[2]) : '',
      hour_fourth_activity: data.activities?.[3] ? this.formatTimeRange(data.activities[3]) : '',
      
      session_1_units: data.activities?.[0] ? `Session 1: ${data.activities[0].units || 1} Units` : '',
      session_2_units: data.activities?.[1] ? `Session 2: ${data.activities[1].units || 1} Units` : '',
      session_3_units: data.activities?.[2] ? `Session 3: ${data.activities[2].units || 1} Units` : '',
      session_4_units: data.activities?.[3] ? `Session 4: ${data.activities[3].units || 1} Units` : '',
      
      patient_name: (patient.name || 'Patient Name').toUpperCase(),
      id: String(patient.patientNumber || patient.id || 'P001').trim(),
      patient_icd10: diagnosisForAbsence,
      totalUnits: this.calculateTotalUnits(data.activities).toString(),

      absence_reason: absenceReasonText,

      terapeut_name: data.group?.therapist || 'Alina Morales, MSMH',
      // Función que retorna la imagen de firma para docx-templates (async)
      terapeut_signature_image: async () => await this.getTherapistSignatureImage(
        data.group?.therapistId || data.group?.createdBy?.id
      ),
      
      // Agregar variables indexadas para IOP
      ...indexedDiagnosticVars,
    };

    // CRÍTICO: Verificar que las variables indexadas estén presentes antes de createReport
    if (isIOP) {
      for (let i = 1; i <= 4; i++) {
        const codeKey = `diagnostic_code${i}`;
        const descKey = `diagnostic_description${i}`;
        if (!(codeKey in absenceData) || !absenceData[codeKey]) {
          absenceData[codeKey] = i === 1 ? String(diagnosisForAbsence) : '';
        }
        if (!(descKey in absenceData) || !absenceData[descKey]) {
          absenceData[descKey] = i === 1 ? String(diagnosticDescriptionForAbsence) : '';
        }
      }
      console.error(`🚨🚨🚨 generateSingleAbsenceDocument VERIFICACIÓN: diagnostic_code1=${absenceData.diagnostic_code1}, diagnostic_code2=${absenceData.diagnostic_code2}`);
    }

    const report = await createReport({
      template: templateBuffer,
      data: absenceData,
      cmdDelimiter: ['{{', '}}'],
      processLineBreaks: true,
    });

    return Buffer.isBuffer(report) ? report : Buffer.from(report);
  }

  /**
   * Genera documentos Word individuales usando el template simple (sin bucles)
   * Para cada paciente se genera un documento separado
   */
  async generateIndividualDocuments(data: any): Promise<Buffer> {
    try {
      this.logger.log('🔄 Generando documentos individuales con template simple...');
      
      const simplePath = this.getSimpleTemplatePath();
      // Verificar que existe el template simple
      if (!fs.existsSync(simplePath)) {
        this.logger.error(`❌ Template simple no encontrado: ${simplePath}`);
        throw new Error('Template simple no encontrado');
      }

      const templateBuffer = fs.readFileSync(simplePath);
      this.logger.log(`✅ Template simple encontrado: ${templateBuffer.length} bytes`);

      // Preparar datos base
      const baseData = {
        clinical_logo: data.group?.clinicName || data.group?.clinic?.clinicName || 'FAMILY HEALTH COMMUNITY',
        clinical_name: data.group?.clinicName || data.group?.clinic?.clinicName || 'FAMILY HEALTH COMMUNITY',
        day: this.getDayOfWeek(data.date),
        date: this.formatDate(data.date),
        group: '6',
        code: data.overrideCode || this.getCodeByDay(data.date, data.group?.programType === 'IOP'),
        
        hour_first_activity: data.activities?.[0] ? this.formatTimeRange(data.activities[0]) : '',
        hour_second_activity: data.activities?.[1] ? this.formatTimeRange(data.activities[1]) : '',
        hour_third_activity: data.activities?.[2] ? this.formatTimeRange(data.activities[2]) : '',
        hour_fourth_activity: data.activities?.[3] ? this.formatTimeRange(data.activities[3]) : '',
        
        session_1_units: data.activities?.[0] ? `Session 1: ${data.activities[0].units || 1} Units` : '',
        session_2_units: data.activities?.[1] ? `Session 2: ${data.activities[1].units || 1} Units` : '',
        session_3_units: data.activities?.[2] ? `Session 3: ${data.activities[2].units || 1} Units` : '',
        session_4_units: data.activities?.[3] ? `Session 4: ${data.activities[3].units || 1} Units` : '',
        
        // Función que retorna la imagen de firma para docx-templates (async)
        terapeut_signature_image: async () => await this.getTherapistSignatureImage(
          data.group?.therapistId || data.group?.createdBy?.id
        ),
        terapeut_name: data.group?.therapist || 'Alina Morales, MSMH'
      };

      // Crear ZIP para múltiples documentos
      const archiver = require('archiver');
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      // Generar documento para cada paciente
      for (const patient of data.patients) {
        this.logger.log(`👤 Procesando paciente: ${patient.name} (${patient.id})`);
        
        // Verificar si el paciente está ausente
        // CRÍTICO: Un paciente está ausente si:
        // 1. isPresent es explícitamente false, O
        // 2. attendance.status es 'A', O  
        // 3. attendance es undefined y isPresent no es true
        const isAbsent = patient.isPresent === false || 
                         patient.attendance?.status === 'A' || 
                         (patient.attendance === undefined && patient.isPresent !== true);
        
        // Si está ausente, usar template de ausencia
        if (isAbsent) {
          await this.generateAbsenceDocument(patient, data, archive);
          continue;
        }
        
        // Extraer diagnóstico y número de paciente
        const diagnosis = Array.isArray(patient.diagnosis) && patient.diagnosis.length > 0 
          ? patient.diagnosis[0] 
          : 'F33.2';
        const patientNumber = patient.patientNumber || patient.id || 'P001';
        
        // Extraer goals correctamente (son objetos con .goalText)
        const goals = patient.goals || [];
        const sortedGoals = [...goals].sort((a, b) => (a.goalNumber || 0) - (b.goalNumber || 0));
        const getGoalDescription = (index: number) => {
          // Buscar goal por goalNumber (index + 1 porque goalNumber es 1-based)
          const goal = sortedGoals.find(g => g.goalNumber === index + 1);
          if (goal && typeof goal === 'object') {
            return goal.goalText || '';
          }
          return ''; // NO inventar goals si no existen
        };
        
        // Determinar el goal seleccionado según el día de la semana
        const selectedGoalNumber = this.getSelectedGoalNumber(data.date);
        const selectedGoalText = getGoalDescription(selectedGoalNumber - 1) || '';
        
        // Determinar qué checkbox está seleccionado para cada métrica
        // COOPERATION, MOTIVATION, CONCENTRATION & FOCUS, PEER INTERACTION: aleatorio entre "Moderate" y "Minor"
        const cooperation = this.getRandomMetric();
        const motivation = this.getRandomMetric();
        const concentration = this.getRandomMetric();
        const peerInteraction = this.getRandomMetric();
        
        // DEBUG: Verificar aleatoriedad de métricas
        this.logger.debug(`Métricas generadas para ausencia: cooperation=${cooperation}, motivation=${motivation}, concentration=${concentration}, peerInteraction=${peerInteraction}`);
        
        // Generar respuestas de cliente y resumen de progreso con Gemini AI
        const patientIndex = data.patients.indexOf(patient);
        const patientName = patient.name || `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Patient';
        const isIOP = data.group?.programType === 'IOP';
        
        // Determinar qué grupo corresponde al goal marcado (el grupo que mostrará el response relacionado)
        // Group 1 para Goal#1, Group 2 para Goal#2, Group 3 para Goal#3, Group 4 para Goal#4
        const goalGroupIndex = selectedGoalNumber - 1; // Convertir a índice 0-based
        
        // Generar respuestas de cliente con IA (en paralelo para mejor rendimiento)
        // Solo pasar el goal al grupo correspondiente
        const [clientResponse1, clientResponse2, clientResponse3, clientResponse4, progressSummary] = await Promise.all([
          this.generateClientResponseWithAI(patientName, 0, data.activities || [], isIOP, goalGroupIndex === 0 ? selectedGoalNumber : undefined, goalGroupIndex === 0 ? selectedGoalText : undefined).catch(() => this.getClientResponse(1, patientIndex)),
          this.generateClientResponseWithAI(patientName, 1, data.activities || [], isIOP, goalGroupIndex === 1 ? selectedGoalNumber : undefined, goalGroupIndex === 1 ? selectedGoalText : undefined).catch(() => this.getClientResponse(2, patientIndex)),
          this.generateClientResponseWithAI(patientName, 2, data.activities || [], isIOP, goalGroupIndex === 2 ? selectedGoalNumber : undefined, goalGroupIndex === 2 ? selectedGoalText : undefined).catch(() => this.getClientResponse(3, patientIndex)),
          this.generateClientResponseWithAI(patientName, 3, data.activities || [], isIOP, goalGroupIndex === 3 ? selectedGoalNumber : undefined, goalGroupIndex === 3 ? selectedGoalText : undefined).catch(() => this.getClientResponse(4, patientIndex)),
          this.generateProgressSummaryWithAI(patientName, data.activities || []).catch(() => this.getProgressExplanation(patientName, data.activities || [])),
        ]);
        
        // Extraer solo la declaración del cliente (sin la intervención del terapeuta)
        const extractStatement = (response: string): string => {
          const match = response.match(/^"([^"]+)"/);
          if (match && match[1]) {
            return match[1];
          }
          // Si no hay comillas, intentar extraer la primera oración
          const firstSentence = response.split('.')[0].trim();
          return firstSentence.startsWith('"') ? firstSentence.slice(1) : firstSentence;
        };
        
        const statement1 = extractStatement(clientResponse1);
        const statement2 = extractStatement(clientResponse2);
        const statement3 = extractStatement(clientResponse3);
        const statement4 = extractStatement(clientResponse4);
        
        // Preparar datos específicos del paciente
        const patientData = {
          ...baseData,
          
          // Datos del paciente (sin bucle)
          patient_name: (patient.name || 'Patient Name').toUpperCase(),
          id: String(patientNumber || '').trim(), // Asegurar que no haya espacios ni saltos de línea
          patient_icd10: diagnosis,
          totalUnits: this.calculateTotalUnits(data.activities).toString(),
          
          // Checkboxes dinámicos según el goal seleccionado
          goal1_checkbox: selectedGoalNumber === 1 ? '☒' : '☐',
          goal2_checkbox: selectedGoalNumber === 2 ? '☒' : '☐',
          goal3_checkbox: selectedGoalNumber === 3 ? '☒' : '☐',
          goal4_checkbox: selectedGoalNumber === 4 ? '☒' : '☐',
          
          goal1_label: 'GOAL#1',
          goal2_label: 'GOAL#2',
          goal3_label: 'GOAL#3',
          goal4_label: 'GOAL#4',
          
          // Combinación de checkbox + label para el template (si el template lo requiere)
          goal1_full: `${selectedGoalNumber === 1 ? '☒' : '☐'}GOAL#1`,
          goal2_full: `${selectedGoalNumber === 2 ? '☒' : '☐'}GOAL#2`,
          goal3_full: `${selectedGoalNumber === 3 ? '☒' : '☐'}GOAL#3`,
          goal4_full: `${selectedGoalNumber === 4 ? '☒' : '☐'}GOAL#4`,
          // Solo cargar goals que existen en la BD (NO inventar)
          patient_goal1: getGoalDescription(0) || '',
          patient_goal2: getGoalDescription(1) || '',
          patient_goal3: getGoalDescription(2) || '',
          patient_goal4: getGoalDescription(3) || '',
          
          // Actividades del grupo (separadas en header y párrafo)
          patient_group1_header: this.getGroupActivityHeader(1, data.activities, data.group?.programType === 'IOP'),
          patient_group1_paragraph: this.getGroupActivityParagraph(1, data.activities, data.group?.programType === 'IOP'),
          patient_group2_header: this.getGroupActivityHeader(2, data.activities, data.group?.programType === 'IOP'),
          patient_group2_paragraph: this.getGroupActivityParagraph(2, data.activities, data.group?.programType === 'IOP'),
          patient_group3_header: this.getGroupActivityHeader(3, data.activities, data.group?.programType === 'IOP'),
          patient_group3_paragraph: this.getGroupActivityParagraph(3, data.activities, data.group?.programType === 'IOP'),
          patient_group4_header: this.getGroupActivityHeader(4, data.activities, data.group?.programType === 'IOP'),
          patient_group4_paragraph: this.getGroupActivityParagraph(4, data.activities, data.group?.programType === 'IOP'),
          
          // Mantener variables legacy para compatibilidad
          patient_group1: this.getGroupActivity(1, data.activities, data.group?.programType === 'IOP'),
          patient_group2: this.getGroupActivity(2, data.activities, data.group?.programType === 'IOP'),
          patient_group3: this.getGroupActivity(3, data.activities, data.group?.programType === 'IOP'),
          patient_group4: this.getGroupActivity(4, data.activities, data.group?.programType === 'IOP'),
          
          // Variables de etiquetas para Client Response (se usan en el template, sin ":" porque el template ya lo incluye)
          GROUP1_CLIENT_RESPONSE_LABEL: 'CLIENT RESPONSE',
          // Labels dinámicos: solo el grupo correspondiente al goal marcado tiene la referencia
          group1_client_response_label: selectedGoalNumber === 1 ? `Group 1: Client Response(Goal#${selectedGoalNumber}/Obj${selectedGoalNumber}A)` : 'Group 1 Client Response',
          group2_client_response_label: selectedGoalNumber === 2 ? `Group 2: Client Response(Goal#${selectedGoalNumber}/Obj${selectedGoalNumber}A)` : 'Group 2 Client Response',
          group3_client_response_label: selectedGoalNumber === 3 ? `Group 3: Client Response(Goal#${selectedGoalNumber}/Obj${selectedGoalNumber}A)` : 'Group 3 Client Response',
          group4_client_response_label: selectedGoalNumber === 4 ? `Group 4: Client Response(Goal#${selectedGoalNumber}/Obj${selectedGoalNumber}A)` : 'Group 4 Client Response',
          
          // Respuestas del cliente (solo la declaración entre comillas, sin "Group N" ni "Client Response:")
          patient_statement1: `"${statement1}". The therapist`,
          patient_statement2: `"${statement2}". The therapist`,
          patient_statement3: `"${statement3}". Intervention: The therapist`,
          patient_statement4: `"${statement4}". Intervention: The therapist`,
          
          // Intervenciones del terapeuta (separadas) - extraer de Gemini si está disponible
          patient_intervention1: clientResponse1.includes('The therapist') || clientResponse1.includes('therapist')
            ? clientResponse1.split(/The therapist|therapist/i)[1]?.trim() || 'modeled how to transform vague expressions into clear, goal-directed statements. The therapist prompted the client to rephrase their statement more concretely by asking, "What exactly are you trying to say when you use that phrase?"'
            : 'modeled how to transform vague expressions into clear, goal-directed statements. The therapist prompted the client to rephrase their statement more concretely by asking, "What exactly are you trying to say when you use that phrase?"',
          patient_intervention2: clientResponse2.includes('The therapist') || clientResponse2.includes('therapist')
            ? clientResponse2.split(/The therapist|therapist/i)[1]?.trim() || 'guided the client through a step-by-step breakdown of a recent issue they mentioned and helped generate three alternative solutions, highlighting the pros and cons of each. The therapist emphasized that having multiple options increases emotional flexibility and reduces impulsive reactions.'
            : 'guided the client through a step-by-step breakdown of a recent issue they mentioned and helped generate three alternative solutions, highlighting the pros and cons of each. The therapist emphasized that having multiple options increases emotional flexibility and reduces impulsive reactions.',
          patient_intervention3: clientResponse3.includes('The therapist') || clientResponse3.includes('therapist')
            ? clientResponse3.split(/The therapist|therapist/i)[1]?.trim() || 'facilitated a role-play scenario in which the client was asked to pause before responding and verbalize what the other person might be experiencing emotionally. The therapist reinforced the importance of slowing down to enhance social attunement.'
            : 'facilitated a role-play scenario in which the client was asked to pause before responding and verbalize what the other person might be experiencing emotionally. The therapist reinforced the importance of slowing down to enhance social attunement.',
          patient_intervention4: clientResponse4.includes('The therapist') || clientResponse4.includes('therapist')
            ? clientResponse4.split(/The therapist|therapist/i)[1]?.trim() || 'acknowledged the client\'s ambivalence and validated their experience. The therapist encouraged the client to explore how support groups offer a structured and safe environment that can gradually restore trust and connection, while still honoring their need for solitude.'
            : 'acknowledged the client\'s ambivalence and validated their experience. The therapist encouraged the client to explore how support groups offer a structured and safe environment that can gradually restore trust and connection, while still honoring their need for solitude.',
          
          // Resumen de progreso
          progress_level: 'Moderate Progress',
          patient_progress: progressSummary,
          
          // Checkboxes para COOPERATION
          cooperation_moderate: cooperation === 'Moderate' ? '☒' : '☐',
          cooperation_minor: cooperation === 'Minor' ? '☒' : '☐',
          cooperation_poor: '☐',
          
          // Checkboxes para MOTIVATION
          motivation_moderate: motivation === 'Moderate' ? '☒' : '☐',
          motivation_minor: motivation === 'Minor' ? '☒' : '☐',
          motivation_poor: '☐',
          
          // Checkboxes para CONCENTRATION
          concentration_moderate: concentration === 'Moderate' ? '☒' : '☐',
          concentration_minor: concentration === 'Minor' ? '☒' : '☐',
          concentration_poor: '☐',
          
          // Checkboxes para PEER INTERACTION
          peer_moderate: peerInteraction === 'Moderate' ? '☒' : '☐',
          peer_minor: peerInteraction === 'Minor' ? '☒' : '☐',
          peer_poor: '☐',
          
          // Checkboxes para ATTITUDE (siempre Fluctuations)
          attitude_positive: '☐',
          attitude_negative: '☐',
          attitude_fluctuations: '☒',
          
          // Métricas (para compatibilidad)
          cooperation,
          motivation,
          concentration,
          peerInteraction,
          attitude: 'Fluctuations'
        };

        try {
          // Generar documento Word
          const report = await createReport({
            template: templateBuffer,
            data: patientData,
            cmdDelimiter: ['{{', '}}'],
            processLineBreaks: true,
          });

          // Asegurar Buffer
          const reportBuffer = Buffer.isBuffer(report)
            ? report
            : Buffer.from(report);

          // Nombre del archivo
          const fileName = `${patient.name.replace(/\s+/g, '_')}_${this.formatDate(data.date).replace(/\//g, '-')}.docx`;
          const folderName = `${patient.name.replace(/\s+/g, '_')}_${patient.id}`;
          
          // Agregar al ZIP
          archive.append(reportBuffer, { name: `${folderName}/${fileName}` });
          
          this.logger.log(`✅ Generado: ${fileName}`);
          
        } catch (error) {
          this.logger.error(`❌ Error generando documento para ${patient.name}:`, error.message);
        }
      }

      // Finalizar ZIP
      archive.finalize();
      
      // Convertir a Buffer
      const chunks: Buffer[] = [];
      archive.on('data', (chunk: Buffer) => chunks.push(chunk));
      
      return new Promise((resolve, reject) => {
        archive.on('end', () => {
          const zipBuffer = Buffer.concat(chunks);
          this.logger.log(`🎉 ZIP generado: ${zipBuffer.length} bytes`);
          resolve(zipBuffer);
        });
        
        archive.on('error', (error: Error) => {
          this.logger.error('❌ Error generando ZIP:', error.message);
          reject(error);
        });
      });

    } catch (error) {
      this.logger.error('❌ Error en generateIndividualDocuments:', error.message);
      throw error;
    }
  }

  /**
   * Genera un documento Word usando el template simple (PHP_CLEAN_TEMPLATE_SIMPLE.docx)
   * MÉTODO OFICIAL - Versión principal para generar notas PHP
   * 
   * Este método es la versión oficial que reemplaza al template con bucles.
   * Usa variables directas en lugar de bucles para mejor control del formato.
   * 
   * @param data - Datos del grupo, pacientes, actividades y asistencia
   * @returns Buffer con el documento Word generado
   */
  async generateGroupDayDocumentSimple(data: any): Promise<Buffer> {
    try {
      // Detectar tipo de programa (PHP o IOP)
      const programType = data.group?.programType || 'PHP';
      const isIOP = programType === 'IOP';
      
      // DEBUG: Log del tipo de programa detectado
      this.logger.log(`🔍 Tipo de programa detectado: ${programType} (isIOP: ${isIOP})`);
      this.logger.log(`🔍 data.group: ${JSON.stringify({ id: data.group?.id, programType: data.group?.programType, name: data.group?.name })}`);
      
      this.logger.log(`🔄 Generando documento con template simple ${isIOP ? 'IOP' : 'PHP'} (sin bucles)...`);
      
      // Seleccionar template según el tipo de programa
      const templatePath = isIOP ? this.getIOPTemplatePath() : this.getSimpleTemplatePath();
      
      // Verificar que existe el template
      if (!fs.existsSync(templatePath)) {
        this.logger.error(`❌ Template ${isIOP ? 'IOP' : 'PHP'} simple no encontrado: ${templatePath}`);
        throw new Error(`Template ${isIOP ? 'IOP' : 'PHP'} simple no encontrado`);
      }

      const templateBuffer = fs.readFileSync(templatePath);
      this.logger.log(`✅ Template ${isIOP ? 'IOP' : 'PHP'} simple encontrado: ${templateBuffer.length} bytes`);

      // Obtener primer paciente presente
      const firstPatient = data.patients
        ?.filter((p: any) => p.isPresent !== false)
        ?.[0] || data.patients?.[0];
      
      if (!firstPatient) {
        throw new Error('No hay pacientes disponibles para generar el documento');
      }
      
      // Extraer diagnóstico y número de paciente
      // Para IOP: obtener lista completa de diagnósticos (hasta 4)
      // Para PHP: obtener solo el primer diagnóstico (compatibilidad)
      const patientNumber = firstPatient.patientNumber || firstPatient.id || 'P001';
      
      let diagnosis: string;
      let diagnosticCodes: string[] = [];
      let diagnosticDescriptions: string[] = [];
      
      if (isIOP) {
        // Para IOP: usar lista completa de diagnósticos
        const diagnosesList = Array.isArray(firstPatient.diagnosis) && firstPatient.diagnosis.length > 0
          ? firstPatient.diagnosis.filter((d: any) => d && typeof d === 'object')
          : Array.isArray(firstPatient.diagnoses) && firstPatient.diagnoses.length > 0
          ? firstPatient.diagnoses
          : [];
        
        // Mapear diagnósticos a arrays (hasta 4)
        for (let i = 0; i < 4; i++) {
          if (diagnosesList[i]) {
            const diag = diagnosesList[i];
            diagnosticCodes.push(diag.icd10Code || diag.icd10_code || 'F33.2');
            diagnosticDescriptions.push(diag.diagnosisDescription || diag.diagnosis_description || 'Major depressive disorder, recurrent episode, severe, without psychotic features');
          } else {
            diagnosticCodes.push('');
            diagnosticDescriptions.push('');
          }
        }
        
        // Para compatibilidad, usar el primer diagnóstico
        diagnosis = diagnosticCodes[0] || 'F33.2';
      } else {
        // Para PHP: usar solo el primer diagnóstico (string o código)
        diagnosis = Array.isArray(firstPatient.diagnosis) && firstPatient.diagnosis.length > 0 
          ? (typeof firstPatient.diagnosis[0] === 'string' 
            ? firstPatient.diagnosis[0] 
            : firstPatient.diagnosis[0]?.icd10Code || firstPatient.diagnosis[0]?.icd10_code || 'F33.2')
          : 'F33.2';
      }
      
      // Extraer goals correctamente (son objetos con .goalText)
      const goals = firstPatient.goals || [];
      const sortedGoals = [...goals].sort((a, b) => (a.goalNumber || 0) - (b.goalNumber || 0));
      const getGoalDescription = (index: number) => {
        // Buscar goal por goalNumber (index + 1 porque goalNumber es 1-based)
        const goal = sortedGoals.find(g => g.goalNumber === index + 1);
        if (goal && typeof goal === 'object') {
          return goal.goalText || '';
        }
        return ''; // NO inventar goals si no existen
      };
      
      // Determinar el goal seleccionado según el día de la semana
      const selectedGoalNumber = this.getSelectedGoalNumber(data.date);
      const selectedGoalText = getGoalDescription(selectedGoalNumber - 1) || '';
      
      // Determinar qué checkbox está seleccionado para cada métrica
      // COOPERATION, MOTIVATION, CONCENTRATION & FOCUS, PEER INTERACTION: aleatorio entre "Moderate" y "Minor"
      const cooperation = this.getRandomMetric();
      const motivation = this.getRandomMetric();
      const concentration = this.getRandomMetric();
      const peerInteraction = this.getRandomMetric();
      
      // DEBUG: Verificar aleatoriedad de métricas
      this.logger.debug(`Métricas generadas: cooperation=${cooperation}, motivation=${motivation}, concentration=${concentration}, peerInteraction=${peerInteraction}`);

      // Determinar el prefijo del terapeuta según el tipo de programa
      const therapistPrefix = isIOP ? 'IOP Therapist' : 'PHP Therapist';
      
      // Generar respuestas de cliente y resumen de progreso con Gemini AI
      const patientName = firstPatient.name || `${firstPatient.firstName || ''} ${firstPatient.lastName || ''}`.trim() || 'Patient';
      
      // Determinar qué grupo corresponde al goal marcado (el grupo que mostrará el response relacionado)
      // Group 1 para Goal#1, Group 2 para Goal#2, Group 3 para Goal#3, Group 4 para Goal#4
      const goalGroupIndex = selectedGoalNumber - 1; // Convertir a índice 0-based
      
      // Generar respuestas de cliente con IA (en paralelo para mejor rendimiento)
      // Solo pasar el goal al grupo correspondiente
      const [clientResponse1, clientResponse2, clientResponse3, clientResponse4, progressSummary] = await Promise.all([
        this.generateClientResponseWithAI(patientName, 0, data.activities || [], isIOP, goalGroupIndex === 0 ? selectedGoalNumber : undefined, goalGroupIndex === 0 ? selectedGoalText : undefined).catch(() => this.getClientResponse(1, 0)),
        this.generateClientResponseWithAI(patientName, 1, data.activities || [], isIOP, goalGroupIndex === 1 ? selectedGoalNumber : undefined, goalGroupIndex === 1 ? selectedGoalText : undefined).catch(() => this.getClientResponse(2, 0)),
        this.generateClientResponseWithAI(patientName, 2, data.activities || [], isIOP, goalGroupIndex === 2 ? selectedGoalNumber : undefined, goalGroupIndex === 2 ? selectedGoalText : undefined).catch(() => this.getClientResponse(3, 0)),
        this.generateClientResponseWithAI(patientName, 3, data.activities || [], isIOP, goalGroupIndex === 3 ? selectedGoalNumber : undefined, goalGroupIndex === 3 ? selectedGoalText : undefined).catch(() => this.getClientResponse(4, 0)),
        this.generateProgressSummaryWithAI(patientName, data.activities || []).catch(() => this.getProgressExplanation(patientName, data.activities || [])),
      ]);
      
      // Extraer solo la declaración del cliente (sin la intervención del terapeuta)
      const extractStatement = (response: string): string => {
        const match = response.match(/^"([^"]+)"/);
        if (match && match[1]) {
          return match[1];
        }
        // Si no hay comillas, intentar extraer la primera oración
        const firstSentence = response.split('.')[0].trim();
        return firstSentence.startsWith('"') ? firstSentence.slice(1) : firstSentence;
      };
      
      const statement1 = extractStatement(clientResponse1);
      const statement2 = extractStatement(clientResponse2);
      const statement3 = extractStatement(clientResponse3);
      const statement4 = extractStatement(clientResponse4);

      // Preparar datos para el template simple
      // IMPORTANTE: date debe ser la fecha formateada DD/MM/YYYY que se usa en header y footer
      const formattedDate = this.formatDate(data.date);
      const dayName = this.getDayOfWeek(data.date);
      
      // DEBUG: Verificar datos del grupo y actividades
      this.logger.log(`🔍 Datos del grupo para template: clinicName=${data.group?.clinicName || data.group?.clinic?.clinicName || 'N/A'}, activities.length=${data.activities?.length || 0}`);
      if (data.activities && data.activities.length > 0) {
        this.logger.log(`🔍 Actividades en data.activities:`);
        data.activities.forEach((act: any, idx: number) => {
          this.logger.log(`  [${idx + 1}] ${act.activityName || act.name || 'N/A'}: startTime=${act.startTime || 'N/A'}, endTime=${act.endTime || 'N/A'}, units=${act.units || 'N/A'}, hasParagraph=${!!act.paragraphText}`);
        });
      } else {
        this.logger.warn(`⚠️ data.activities está vacío o undefined para IOP`);
      }
      
      const templateData = {
        clinical_logo: data.group?.clinicName || data.group?.clinic?.clinicName || 'FAMILY HEALTH COMMUNITY',
        clinical_name: data.group?.clinicName || data.group?.clinic?.clinicName || 'FAMILY HEALTH COMMUNITY',
        day: dayName,
        date: formattedDate, // DD/MM/YYYY para header y footer - debe cambiar para cada día
        group: '6',
        code: data.overrideCode || this.getCodeByDay(data.date, data.group?.programType === 'IOP'),
        setting: '53', // Número de setting
        setting_label: 'Setting:', // Label para evitar duplicación
        
        hour_first_activity: data.activities?.[0] ? this.formatTimeRange(data.activities[0]) : '',
        hour_second_activity: data.activities?.[1] ? this.formatTimeRange(data.activities[1]) : '',
        hour_third_activity: data.activities?.[2] ? this.formatTimeRange(data.activities[2]) : '',
        hour_fourth_activity: data.activities?.[3] ? this.formatTimeRange(data.activities[3]) : '',
        
        session_1_units: data.activities?.[0] ? `Session 1: ${data.activities[0].units || 1} Units` : '',
        session_2_units: data.activities?.[1] ? `Session 2: ${data.activities[1].units || 1} Units` : '',
        session_3_units: data.activities?.[2] ? `Session 3: ${data.activities[2].units || 1} Units` : '',
        session_4_units: data.activities?.[3] ? `Session 4: ${data.activities[3].units || 1} Units` : '',
        
        // Datos del primer paciente (para template simple)
        patient_name: (firstPatient.name || 'Patient Name').toUpperCase(),
        id: String(patientNumber || '').trim(), // Asegurar que no haya espacios ni saltos de línea
        patient_icd10: diagnosis,
        totalUnits: this.calculateTotalUnits(data.activities).toString(),
        
        // Diagnósticos múltiples para IOP (hasta 4)
        // El template IOP tiene 4 líneas con {{diagnostic_code}} y {{diagnostic_description}}
        // IMPORTANTE: docx-templates reemplaza TODAS las ocurrencias de {{diagnostic_code}} con el MISMO valor
        ...(isIOP && {
          // Variables simples para el template (docx-templates reemplazará todas las ocurrencias con estos valores)
          // Usamos el primer diagnóstico disponible, o valores vacíos si no hay diagnósticos
          diagnostic_code: diagnosticCodes.length > 0 ? diagnosticCodes[0] : '',
          diagnostic_description: diagnosticDescriptions.length > 0 ? diagnosticDescriptions[0] : '',
          // IMPORTANTE: El template IOP usa diagnostic_code1 (sin guión bajo), no diagnostic_code_1
          diagnostic_code1: diagnosticCodes[0] || '',
          diagnostic_description1: diagnosticDescriptions[0] || '',
          diagnostic_code2: diagnosticCodes[1] || '',
          diagnostic_description2: diagnosticDescriptions[1] || '',
          diagnostic_code3: diagnosticCodes[2] || '',
          diagnostic_description3: diagnosticDescriptions[2] || '',
          diagnostic_code4: diagnosticCodes[3] || '',
          diagnostic_description4: diagnosticDescriptions[3] || '',
          // También agregar versiones con guión bajo por compatibilidad
          diagnostic_code_1: diagnosticCodes[0] || '',
          diagnostic_description_1: diagnosticDescriptions[0] || '',
          diagnostic_code_2: diagnosticCodes[1] || '',
          diagnostic_description_2: diagnosticDescriptions[1] || '',
          diagnostic_code_3: diagnosticCodes[2] || '',
          diagnostic_description_3: diagnosticDescriptions[2] || '',
          diagnostic_code_4: diagnosticCodes[3] || '',
          diagnostic_description_4: diagnosticDescriptions[3] || '',
        }),
        
        // Variables de etiquetas para Goals (se usan en el template)
        goal1_label: 'GOAL#1',
        goal2_label: 'GOAL#2',
        goal3_label: 'GOAL#3',
        goal4_label: 'GOAL#4',
        
        // Checkboxes dinámicos según el goal seleccionado
        goal1_checkbox: selectedGoalNumber === 1 ? '☒' : '☐',
        goal2_checkbox: selectedGoalNumber === 2 ? '☒' : '☐',
        goal3_checkbox: selectedGoalNumber === 3 ? '☒' : '☐',
        goal4_checkbox: selectedGoalNumber === 4 ? '☒' : '☐',
        patient_goal1: getGoalDescription(0) || 'Client will identify and resolve the underlying causes of depression, thus elevating mood and interest/pleasure in life.',
        patient_goal2: getGoalDescription(1) || 'Client will significantly reduce the overall frequency and intensity of the anxiety symptoms so that daily functioning is improved.',
        patient_goal3: getGoalDescription(2) || 'Client will feel refreshed and energetic during wakeful hours.',
        patient_goal4: getGoalDescription(3) || 'Client will reach a personal balance between solitary time and interpersonal interaction with others.',
        
        // Actividades del grupo (separadas en header y párrafo)
        patient_group1_header: this.getGroupActivityHeader(1, data.activities, data.group?.programType === 'IOP'),
        patient_group1_paragraph: this.getGroupActivityParagraph(1, data.activities, data.group?.programType === 'IOP'),
        patient_group2_header: this.getGroupActivityHeader(2, data.activities, data.group?.programType === 'IOP'),
        patient_group2_paragraph: this.getGroupActivityParagraph(2, data.activities, data.group?.programType === 'IOP'),
        patient_group3_header: this.getGroupActivityHeader(3, data.activities, data.group?.programType === 'IOP'),
        patient_group3_paragraph: this.getGroupActivityParagraph(3, data.activities, data.group?.programType === 'IOP'),
        patient_group4_header: this.getGroupActivityHeader(4, data.activities, data.group?.programType === 'IOP'),
        patient_group4_paragraph: this.getGroupActivityParagraph(4, data.activities, data.group?.programType === 'IOP'),
        
        // Mantener variables legacy para compatibilidad
        patient_group1: this.getGroupActivity(1, data.activities, data.group?.programType === 'IOP'),
        patient_group2: this.getGroupActivity(2, data.activities, data.group?.programType === 'IOP'),
        patient_group3: this.getGroupActivity(3, data.activities, data.group?.programType === 'IOP'),
        patient_group4: this.getGroupActivity(4, data.activities, data.group?.programType === 'IOP'),
        
        // Variables de etiquetas para Client Response (se usan en el template, sin ":" porque el template ya lo incluye)
        GROUP1_CLIENT_RESPONSE_LABEL: 'CLIENT RESPONSE',
        // Labels dinámicos: solo el grupo correspondiente al goal marcado tiene la referencia
        group1_client_response_label: selectedGoalNumber === 1 ? `Group 1: Client Response(Goal#${selectedGoalNumber}/Obj${selectedGoalNumber}A)` : 'Group 1 Client Response',
        group2_client_response_label: selectedGoalNumber === 2 ? `Group 2: Client Response(Goal#${selectedGoalNumber}/Obj${selectedGoalNumber}A)` : 'Group 2 Client Response',
        group3_client_response_label: selectedGoalNumber === 3 ? `Group 3: Client Response(Goal#${selectedGoalNumber}/Obj${selectedGoalNumber}A)` : 'Group 3 Client Response',
        group4_client_response_label: selectedGoalNumber === 4 ? `Group 4: Client Response(Goal#${selectedGoalNumber}/Obj${selectedGoalNumber}A)` : 'Group 4 Client Response',
        
        // Respuestas del cliente (solo la declaración entre comillas, sin "Group N")
        patient_statement1: `"${statement1}"`,
        patient_statement2: `"${statement2}"`,
        patient_statement3: `"${statement3}"`,
        patient_statement4: `"${statement4}"`,
        
        // Intervenciones del terapeuta (separadas) - extraer de Gemini si está disponible
        patient_intervention1: clientResponse1.includes('The therapist') || clientResponse1.includes('therapist')
          ? `${therapistPrefix} ${clientResponse1.split(/The therapist|therapist/i)[1]?.trim() || 'modeled how to transform vague expressions into clear, goal-directed statements. The therapist prompted the client to rephrase their statement more concretely by asking, "What exactly are you trying to say when you use that phrase?"'}`
          : `${therapistPrefix} modeled how to transform vague expressions into clear, goal-directed statements. The therapist prompted the client to rephrase their statement more concretely by asking, "What exactly are you trying to say when you use that phrase?"`,
        patient_intervention2: clientResponse2.includes('The therapist') || clientResponse2.includes('therapist')
          ? `${therapistPrefix} ${clientResponse2.split(/The therapist|therapist/i)[1]?.trim() || 'guided the client through a step-by-step breakdown of a recent issue they mentioned and helped generate three alternative solutions, highlighting the pros and cons of each. The therapist emphasized that having multiple options increases emotional flexibility and reduces impulsive reactions.'}`
          : `${therapistPrefix} guided the client through a step-by-step breakdown of a recent issue they mentioned and helped generate three alternative solutions, highlighting the pros and cons of each. The therapist emphasized that having multiple options increases emotional flexibility and reduces impulsive reactions.`,
        patient_intervention3: clientResponse3.includes('The therapist') || clientResponse3.includes('therapist')
          ? `${therapistPrefix} ${clientResponse3.split(/The therapist|therapist/i)[1]?.trim() || 'facilitated a role-play scenario in which the client was asked to pause before responding and verbalize what the other person might be experiencing emotionally. The therapist reinforced the importance of slowing down to enhance social attunement.'}`
          : `${therapistPrefix} facilitated a role-play scenario in which the client was asked to pause before responding and verbalize what the other person might be experiencing emotionally. The therapist reinforced the importance of slowing down to enhance social attunement.`,
        patient_intervention4: clientResponse4.includes('The therapist') || clientResponse4.includes('therapist')
          ? `${therapistPrefix} ${clientResponse4.split(/The therapist|therapist/i)[1]?.trim() || 'acknowledged the client\'s ambivalence and validated their experience. The therapist encouraged the client to explore how support groups offer a structured and safe environment that can gradually restore trust and connection, while still honoring their need for solitude.'}`
          : `${therapistPrefix} acknowledged the client's ambivalence and validated their experience. The therapist encouraged the client to explore how support groups offer a structured and safe environment that can gradually restore trust and connection, while still honoring their need for solitude.`,
        
        // Resumen de progreso
        progress_level: 'Moderate Progress',
        patient_progress_level: progressSummary, // Variable requerida por template IOP - texto explicativo completo
        patient_progress: progressSummary,
        
        // Checkboxes para COOPERATION
        cooperation_moderate: cooperation === 'Moderate' ? '☒' : '☐',
        cooperation_minor: cooperation === 'Minor' ? '☒' : '☐',
        cooperation_poor: '☐',
        
        // Checkboxes para MOTIVATION
        motivation_moderate: motivation === 'Moderate' ? '☒' : '☐',
        motivation_minor: motivation === 'Minor' ? '☒' : '☐',
        motivation_poor: '☐',
        
        // Checkboxes para CONCENTRATION
        concentration_moderate: concentration === 'Moderate' ? '☒' : '☐',
        concentration_minor: concentration === 'Minor' ? '☒' : '☐',
        concentration_poor: '☐',
        
        // Checkboxes para PEER INTERACTION
        peer_moderate: peerInteraction === 'Moderate' ? '☒' : '☐',
        peer_minor: peerInteraction === 'Minor' ? '☒' : '☐',
        peer_poor: '☐',
        
        // Checkboxes para ATTITUDE (siempre Fluctuations)
        attitude_positive: '☐',
        attitude_negative: '☐',
        attitude_fluctuations: '☒',
        
        // Métricas (para compatibilidad)
        cooperation,
        motivation,
        concentration,
        peerInteraction,
        attitude: 'Fluctuations',
        
        // Función que retorna la imagen de firma para docx-templates (async)
        terapeut_signature_image: async () => await this.getTherapistSignatureImage(
          data.group?.therapistId || data.group?.createdBy?.id
        ),
        terapeut_name: data.group?.therapist || data.therapistName || 'Alina Morales, MSMH'
      };

      this.logger.log(`📊 Datos preparados para template simple`);
      this.logger.log(`  Paciente: ${templateData.patient_name}`);
      this.logger.log(`  Fecha: ${templateData.date} - ${templateData.day}`);

      // Generar documento
      const report = await createReport({
        template: templateBuffer,
        data: templateData,
        cmdDelimiter: ['{{', '}}'],
        processLineBreaks: true,
      });

      this.logger.log(`✅ Documento generado exitosamente: ${report.length} bytes`);
      
      // Asegurarse de que el report es un Buffer
      let finalBuffer: Buffer;
      if (Buffer.isBuffer(report)) {
        finalBuffer = report;
      } else if (report instanceof Uint8Array || Array.isArray(report)) {
        finalBuffer = Buffer.from(report);
      } else {
        finalBuffer = Buffer.from(report as any);
      }
      
      return finalBuffer;

    } catch (error) {
      this.logger.error('❌ Error en generateGroupDayDocumentSimple:', error.message);
      this.logger.error('Stack:', error.stack);
      throw error;
    }
  }

  /**
   * Genera un documento de ausencia para un paciente usando el template de ausencia
   */
  private async generateAbsenceDocument(
    patient: any,
    data: any,
    archive: any
  ): Promise<void> {
    try {
      this.logger.log(`📝 Generando nota de ausencia para: ${patient.name}`);
      
      // Detectar tipo de programa (PHP o IOP)
      const programType = data.group?.programType || 'PHP';
      const isIOP = programType === 'IOP';
      
      // Seleccionar template de ausencia según el tipo de programa
      const absencePath = isIOP ? this.getIOPAbsenceTemplatePath() : this.getAbsenceTemplatePath();
      this.logger.log(`🔍 Verificando template de ausencia ${isIOP ? 'IOP' : 'PHP'} para generateAbsenceDocument: ${absencePath}`);
      this.logger.log(`🔍 Archivo existe: ${fs.existsSync(absencePath)}`);
      
      // Verificar que existe el template de ausencia
      if (!fs.existsSync(absencePath)) {
        this.logger.error(`❌ Template de ausencia ${isIOP ? 'IOP' : 'PHP'} no encontrado: ${absencePath}`);
        throw new Error(`Template de ausencia ${isIOP ? 'IOP' : 'PHP'} no encontrado: ${absencePath}`);
      }

      const templateBuffer = fs.readFileSync(absencePath);
      
      // Obtener razón de ausencia
      const attendance = patient.attendance;
      const absenceReasons = attendance?.absenceReasons || [];
      const firstReason = absenceReasons[0];
      
      let absenceReasonText = 'No se proporcionó razón de ausencia.';
      if (firstReason) {
        // Mapear tipos de razón a texto descriptivo en español
        const reasonTypeMap: Record<string, string> = {
          'medical_appointment': 'Cita médica',
          'family_trip': 'Viaje familiar',
          'hospitalized': 'Hospitalizado',
          // También manejar versiones en mayúsculas por compatibilidad
          'MEDICAL_APPOINTMENT': 'Cita médica',
          'FAMILY_TRIP': 'Viaje familiar',
          'HOSPITALIZED': 'Hospitalizado',
        };
        
        const reasonTypeValue = typeof firstReason.reasonType === 'string' 
          ? firstReason.reasonType 
          : String(firstReason.reasonType);
        const reasonType = reasonTypeMap[reasonTypeValue] || reasonTypeValue;
        absenceReasonText = reasonType;
        
        if (firstReason.notes) {
          absenceReasonText += `: ${firstReason.notes}`;
        }
      }
      
      // Preparar datos básicos del header (mismo que el template simple)
      const absenceData = {
        // Header (igual que template simple)
        clinical_logo: data.group?.clinicName || data.group?.clinic?.clinicName || 'FAMILY HEALTH COMMUNITY',
        clinical_name: data.group?.clinicName || data.group?.clinic?.clinicName || 'FAMILY HEALTH COMMUNITY',
        day: this.getDayOfWeek(data.date),
        date: this.formatDate(data.date),
        group: '6',
        code: data.overrideCode || this.getCodeByDay(data.date, data.group?.programType === 'IOP'),
        
        // Horarios y sesiones (alineado con template simple)
        hour_first_activity: data.activities?.[0] ? this.formatTimeRange(data.activities[0]) : '',
        hour_second_activity: data.activities?.[1] ? this.formatTimeRange(data.activities[1]) : '',
        hour_third_activity: data.activities?.[2] ? this.formatTimeRange(data.activities[2]) : '',
        hour_fourth_activity: data.activities?.[3] ? this.formatTimeRange(data.activities[3]) : '',
        
        session_1_units: data.activities?.[0] ? `Session 1: ${data.activities[0].units || 1} Units` : '',
        session_2_units: data.activities?.[1] ? `Session 2: ${data.activities[1].units || 1} Units` : '',
        session_3_units: data.activities?.[2] ? `Session 3: ${data.activities[2].units || 1} Units` : '',
        session_4_units: data.activities?.[3] ? `Session 4: ${data.activities[3].units || 1} Units` : '',
        
        // Información del paciente
        patient_name: (patient.name || 'Patient Name').toUpperCase(),
        id: String(patient.patientNumber || patient.id || 'P001').trim(),
        patient_icd10: Array.isArray(patient.diagnosis) && patient.diagnosis.length > 0 
          ? patient.diagnosis[0] 
          : 'F33.2',
        totalUnits: this.calculateTotalUnits(data.activities).toString(),
        
        // Razón de ausencia
        absence_reason: absenceReasonText,
        
        // Terapeuta
        terapeut_name: data.group?.therapist || 'Alina Morales, MSMH',
        // Función que retorna la imagen de firma para docx-templates (async)
        terapeut_signature_image: async () => await this.getTherapistSignatureImage(
          data.group?.therapistId || data.group?.createdBy?.id
        ),
      };

      // Generar documento Word
      const report = await createReport({
        template: templateBuffer,
        data: absenceData,
        cmdDelimiter: ['{{', '}}'],
        processLineBreaks: true,
      });

      // Asegurar Buffer
      const reportBuffer = Buffer.isBuffer(report)
        ? report
        : Buffer.from(report);

      // Nombre del archivo
      const fileName = `${patient.name.replace(/\s+/g, '_')}_${this.formatDate(data.date).replace(/\//g, '-')}_ABSENCE.docx`;
      const folderName = `${patient.name.replace(/\s+/g, '_')}_${patient.id}`;
      
      // Agregar al ZIP
      archive.append(reportBuffer, { name: `${folderName}/${fileName}` });
      
      this.logger.log(`✅ Nota de ausencia generada: ${fileName}`);
      
    } catch (error) {
      this.logger.error(`❌ Error generando nota de ausencia para ${patient.name}:`, error.message);
      throw error;
    }
  }
}
