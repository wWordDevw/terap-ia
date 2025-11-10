import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Group } from '../groups/entities/group.entity';
import { GroupWeek } from '../groups/entities/group-week.entity';
import { GroupPatient } from '../groups/entities/group-patient.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { User } from '../users/entities/user.entity';
import { WordTemplateService } from './templates/word-template.service';
import { WordTemplateReplacementService } from './templates/word-template-replacement.service';
import { OpenAIService } from '../../common/services/openai.service';
import { RotationService } from './services/rotation.service';
import { PatientDiagnosis } from '../patients/entities/patient-diagnosis.entity';
import { GroupSchedule } from '../groups/entities/group-schedule.entity';
import { Subactivity } from '../activities/entities/subactivity.entity';
import { PatientGoal } from '../patients/entities/patient-goal.entity';
const archiver = require('archiver');

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupWeek)
    private readonly groupWeekRepository: Repository<GroupWeek>,
    @InjectRepository(GroupPatient)
    private readonly groupPatientRepository: Repository<GroupPatient>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(PatientDiagnosis)
    private readonly patientDiagnosisRepository: Repository<PatientDiagnosis>,
    @InjectRepository(GroupSchedule)
    private readonly groupScheduleRepository: Repository<GroupSchedule>,
    @InjectRepository(Subactivity)
    private readonly subactivityRepository: Repository<Subactivity>,
    @InjectRepository(PatientGoal)
    private readonly patientGoalRepository: Repository<PatientGoal>,
    private readonly wordTemplateService: WordTemplateService,
    private readonly wordTemplateReplacementService: WordTemplateReplacementService,
    private readonly openAIService: OpenAIService,
    private readonly rotationService: RotationService,
  ) {}

  /**
   * Genera notas semanales completas para un grupo
   */
  async generateGroupWeekNotes(dto: { groupId: string; weekId: string }, user: User): Promise<Buffer> {
    this.logger.log(`Generating week notes for group ${dto.groupId}, week ${dto.weekId}`);

    // Validar que el grupo existe
    const group = await this.groupRepository.findOne({
      where: { id: dto.groupId, isActive: true },
      relations: ['clinic', 'createdBy'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${dto.groupId} not found`);
    }

    // Validar que la semana existe
    const week = await this.groupWeekRepository.findOne({
      where: { id: dto.weekId, groupId: dto.groupId },
    });

    if (!week) {
      throw new NotFoundException(`Week with ID ${dto.weekId} not found for group ${dto.groupId}`);
    }

    // Obtener fechas de la semana según el tipo de programa
    const weekDates = this.getWeekDates(week, group.programType);

    // CRÍTICO: Log detallado de fechas generadas
    console.error(`🚨🚨🚨 DEBUG getWeekDates: week.startDate=${week.startDate}, programType=${group.programType}`);
    console.error(`🚨🚨🚨 DEBUG weekDates generadas (${weekDates.length} días):`);
    weekDates.forEach((d, i) => {
      console.error(`   [${i}] ${d.dayName}: ${d.date} (formato YYYY-MM-DD)`);
      // CRÍTICO: Log especial para viernes
      if (d.dayName === 'Friday') {
        console.error(`   ⭐⭐ VIERNES ENCONTRADO: ${d.date} (índice ${i})`);
      }
    });
    this.logger.log(`🚀 OPTIMIZACIÓN: Generando notas semanales en paralelo para ${weekDates.length} días`);
    
    // Validar que sean exactamente 5 días (lunes a viernes)
    if (weekDates.length !== 5) {
      this.logger.error(`❌ ERROR: Se esperaban 5 días (lunes-viernes), pero se generaron ${weekDates.length}`);
      throw new BadRequestException(`Error calculando fechas de semana: se esperaban 5 días, se generaron ${weekDates.length}`);
    }

    // Pre-cargar TODOS los datos una sola vez (optimización)
    const groupPatients = await this.groupPatientRepository.find({
      where: { group: { id: dto.groupId } },
      relations: ['patient'],
    });

    if (groupPatients.length === 0) {
      throw new NotFoundException(`No patients found for group ${dto.groupId}`);
    }

    // CRÍTICO: Log de los pacientes obtenidos del grupo para verificar que sean correctos
    console.error(`🚨🚨🚨 DEBUG PACIENTES DEL GRUPO: groupId=${dto.groupId}, programType=${group.programType}, groupName=${group.groupName || 'N/A'}`);
    console.error(`   Total pacientes encontrados: ${groupPatients.length}`);
    groupPatients.forEach((gp, idx) => {
      console.error(`   [${idx}] patientId=${gp.patient.id}, patientNumber=${gp.patient.patientNumber}, name=${gp.patient.firstName} ${gp.patient.lastName}`);
    });

    const therapistName = group.createdBy 
      ? group.createdBy.fullName || 'Alina Morales, MSMH'
      : 'Alina Morales, MSMH';

    // Obtener IDs de pacientes
    const patientIds = groupPatients.map(gp => gp.patient.id);
    
    // CRÍTICO: Log de los patientIds que se usarán para buscar asistencias
    console.error(`🚨🚨🚨 DEBUG patientIds para buscar asistencias: [${patientIds.join(', ')}]`);

    // BATCH QUERIES: Pre-cargar todos los datos necesarios en batch
    this.logger.log('📊 Pre-cargando datos en batch (optimizado)...');
    
    // Usar método diferente según el tipo de programa
    const isIOP = group.programType === 'IOP';
    
    const [diagnosesMap, diagnosesListMap, goalsMap, attendanceMap, schedulesMap] = await Promise.all([
      isIOP ? Promise.resolve(new Map<string, string>()) : this.getAllPatientDiagnoses(patientIds), // Para IOP no necesitamos el map simple
      isIOP ? this.getAllPatientDiagnosesList(patientIds) : Promise.resolve(new Map<string, PatientDiagnosis[]>()), // Para IOP necesitamos lista completa
      this.getAllPatientGoals(patientIds),
      this.getAllWeekAttendances(patientIds, weekDates, week.id),
      this.getAllWeekSchedules(dto.groupId, weekDates),
    ]);
    
    // CRÍTICO: Log del mapa de asistencias después de construirlo
    console.error(`🚨🚨🚨 DEBUG ATTENDANCE MAP DESPUÉS DE getAllWeekAttendances:`);
    console.error(`   attendanceMap.size: ${attendanceMap.size} pacientes`);
    attendanceMap.forEach((patientMap, patientId) => {
      const patient = groupPatients.find(gp => gp.patient.id === patientId);
      const patientNumber = patient?.patient.patientNumber || 'N/A';
      const patientName = patient ? `${patient.patient.firstName} ${patient.patient.lastName}` : 'N/A';
      const patientDates = Array.from(patientMap.keys());
      console.error(`   - patientId=${patientId}, patientNumber=${patientNumber}, name=${patientName}`);
      console.error(`     Fechas: [${patientDates.join(', ')}]`);
      patientMap.forEach((attendance, dateKey) => {
        console.error(`       ${dateKey}: status=${attendance.status}, attendanceId=${attendance.id}`);
      });
    });

    // Construir datos de pacientes usando los maps
    const patientsData = groupPatients.map(gp => {
      if (isIOP) {
        // Para IOP: usar lista completa de diagnósticos (hasta 4)
        const diagnosesList = diagnosesListMap.get(gp.patient.id) || [];
        return {
          id: gp.patient.id,
          name: `${gp.patient.firstName} ${gp.patient.lastName}`,
          patientNumber: gp.patient.patientNumber,
          diagnosis: diagnosesList, // Array de objetos PatientDiagnosis
          diagnoses: diagnosesList, // Alias para compatibilidad
          goals: goalsMap.get(gp.patient.id) || [],
        };
      } else {
        // Para PHP: usar solo el código más reciente (compatibilidad)
        return {
          id: gp.patient.id,
          name: `${gp.patient.firstName} ${gp.patient.lastName}`,
          patientNumber: gp.patient.patientNumber,
          diagnosis: [diagnosesMap.get(gp.patient.id) || 'F33.2'],
          goals: goalsMap.get(gp.patient.id) || [],
        };
      }
    });

    // Cache de párrafos por día (no compartido entre días para permitir rotación)
    // Cada día tiene su propio cache para evitar consultas duplicadas en la misma generación
    const dayDataResults = await Promise.all(
      weekDates.map(async (dayData) => {
        // Crear cache por día para permitir rotación entre días
        const paragraphsCache = new Map<string, any>();
        const dayName = dayData.dayName.toLowerCase();
        const schedules = schedulesMap.get(dayName) || [];
        
        // DEBUG: Verificar schedules encontrados
        console.error(`🚨🚨🚨 DEBUG SCHEDULES: día=${dayData.dayName}, dayName=${dayName}, schedules encontrados=${schedules.length}`);
        this.logger.debug(`🔍 Schedules para ${dayData.dayName}: ${schedules.length} horarios`);
        
        // CRÍTICO: SIEMPRE generar notas, incluso si no hay schedules para este día
        // Si no hay schedules para este día, usar fallback de cualquier otro día disponible
        let schedulesToUse = schedules;
        if (schedules.length === 0) {
          console.error(`⚠️⚠️⚠️ No hay schedules para ${dayData.dayName}, usando fallback de cualquier día disponible...`);
          
          // Obtener schedules de cualquier día disponible (Monday, Wednesday, Tuesday, Thursday)
          // Prioridad: Monday > Wednesday > Tuesday > Thursday
          const fallbackDays = ['monday', 'wednesday', 'tuesday', 'thursday', 'friday'];
          for (const fallbackDay of fallbackDays) {
            const fallbackSchedules = schedulesMap.get(fallbackDay);
            if (fallbackSchedules && fallbackSchedules.length > 0) {
              schedulesToUse = fallbackSchedules;
              console.error(`✅ Usando schedules de ${fallbackDay} como fallback (${schedulesToUse.length} schedules) para ${dayData.dayName}`);
              break;
            }
          }
          
          if (schedulesToUse.length === 0) {
            // Si aún no hay schedules, obtener CUALQUIER schedule del grupo (sin importar el día)
            console.error(`⚠️⚠️⚠️ No hay schedules en ningún día, obteniendo CUALQUIER schedule del grupo...`);
            const allSchedules = Array.from(schedulesMap.values()).flat();
            if (allSchedules.length > 0) {
              schedulesToUse = allSchedules;
              console.error(`✅ Usando ${allSchedules.length} schedules de cualquier día del grupo`);
            } else {
              console.error(`❌❌❌ ADVERTENCIA: No se encontraron schedules en ningún día del grupo`);
              console.error(`❌❌❌ Keys en schedulesMap: [${Array.from(schedulesMap.keys()).join(', ')}]`);
              console.error(`⚠️⚠️⚠️ Continuando de todos modos - se generarán notas sin actividades específicas`);
            }
          }
        } else {
          schedules.forEach((s, i) => {
            console.error(`🚨🚨🚨   Schedule ${i+1}: ${s.activity?.activityName || 'N/A'}, dayOfWeek=${s.dayOfWeek}`);
          });
        }
        
        // CRÍTICO: SIEMPRE obtener actividades, incluso si schedulesToUse está vacío
        // Si no hay schedules, getActivitiesForDay debe retornar un array vacío o actividades por defecto
        let activities = await this.getActivitiesForDay(dayData.date, dto.groupId, schedulesToUse.length > 0 ? schedulesToUse : undefined, paragraphsCache);
        
        // CRÍTICO: Si no hay actividades, usar actividades de cualquier otro día como fallback
        if (activities.length === 0) {
          console.error(`⚠️⚠️⚠️ No se generaron actividades para ${dayData.dayName}, usando actividades de otros días como fallback...`);
          
          // Intentar obtener actividades de otros días (en orden de prioridad)
          for (const otherDayData of weekDates) {
            if (otherDayData.dayName !== dayData.dayName) {
              const otherDayName = otherDayData.dayName.toLowerCase();
              const otherSchedules = schedulesMap.get(otherDayName) || [];
              if (otherSchedules.length > 0) {
                const otherActivities = await this.getActivitiesForDay(otherDayData.date, dto.groupId, otherSchedules, paragraphsCache);
                if (otherActivities.length > 0) {
                  activities = otherActivities;
                  console.error(`✅ Usando ${otherActivities.length} actividades de ${otherDayData.dayName} para ${dayData.dayName}`);
                  break;
                }
              }
            }
          }
          
          // Si aún no hay actividades, obtener CUALQUIER actividad disponible del grupo
          if (activities.length === 0) {
            console.error(`⚠️⚠️⚠️ No hay actividades en ningún día, obteniendo CUALQUIER actividad del grupo...`);
            for (const fallbackDay of ['monday', 'wednesday', 'tuesday', 'thursday', 'friday']) {
              const fallbackSchedules = schedulesMap.get(fallbackDay);
              if (fallbackSchedules && fallbackSchedules.length > 0) {
                const fallbackActivities = await this.getActivitiesForDay(dayData.date, dto.groupId, fallbackSchedules, paragraphsCache);
                if (fallbackActivities.length > 0) {
                  activities = fallbackActivities;
                  console.error(`✅ Usando ${fallbackActivities.length} actividades de ${fallbackDay}`);
                  break;
                }
              }
            }
          }
          
          if (activities.length === 0) {
            console.error(`⚠️⚠️⚠️ ADVERTENCIA: No hay actividades disponibles para ${dayData.dayName}`);
            console.error(`⚠️⚠️⚠️ Continuando de todos modos - se generarán notas con actividades vacías`);
          }
        }
        
        // DEBUG: Verificar actividades generadas
        console.error(`🚨🚨🚨 DEBUG ACTIVITIES: día=${dayData.dayName}, actividades finales=${activities.length}`);
        if (activities.length > 0) {
          activities.forEach((act: any, idx: number) => {
            console.error(`   [${idx}] name=${act.name || act.activityName || 'N/A'}, startTime=${act.startTime || 'N/A'}, endTime=${act.endTime || 'N/A'}, units=${act.units || 'N/A'}`);
          });
        } else {
          console.error(`   ⚠️⚠️⚠️ ADVERTENCIA CRÍTICA: No hay actividades después del fallback para ${dayData.dayName}`);
        }
        
        // Obtener asistencias del mapa pre-cargado
        const attendances: Attendance[] = [];
        // dayData.date ya es un string YYYY-MM-DD (ver getWeekDates), usarlo directamente como key
        const dateKey = dayData.date; // Ya es string 'YYYY-MM-DD'
        
        this.logger.debug(`🔍 Buscando asistencias para fecha: ${dateKey} (${dayData.dayName})`);
        this.logger.debug(`🔍 Tamaño de attendanceMap: ${attendanceMap.size} pacientes`);
        console.error(`🚨🚨🚨 DEBUG ASISTENCIAS: fecha=${dateKey}, attendanceMap.size=${attendanceMap.size}`);
        
        // DEBUG: Listar todos los patientId en el mapa
        const patientIdsInMap: string[] = [];
        attendanceMap.forEach((patientMap, patientId) => {
          patientIdsInMap.push(patientId);
          
          // CRÍTICO: Log detallado de qué fechas tiene este paciente en el mapa
          const patientDates = Array.from(patientMap.keys());
          console.error(`🚨🚨🚨 DEBUG: Paciente ${patientId} tiene asistencias para fechas: [${patientDates.join(', ')}]`);
          
          const attendance = patientMap.get(dateKey);
          if (attendance) {
            this.logger.debug(`✅ Asistencia encontrada: paciente=${patientId}, fecha=${dateKey}, status=${attendance.status}`);
            console.error(`🚨🚨🚨 ✅ Asistencia encontrada: paciente=${patientId}, fecha=${dateKey}, status=${attendance.status}, weekId=${attendance.weekId || 'N/A'}`);
            attendances.push(attendance);
          } else {
            this.logger.debug(`❌ No se encontró asistencia para paciente=${patientId}, fecha=${dateKey}`);
            console.error(`🚨🚨🚨 ❌ No se encontró asistencia para paciente=${patientId}, fecha=${dateKey}`);
            console.error(`   Fechas disponibles para este paciente: [${patientDates.join(', ')}]`);
            console.error(`   Fecha buscada: ${dateKey}`);
            
            // CRÍTICO: Verificar si hay problema con formato de fecha
            // Intentar buscar con diferentes formatos si no se encuentra
            let found = false;
            for (const availableDate of patientDates) {
              if (availableDate === dateKey) {
                found = true;
                break;
              }
            }
            if (!found && patientDates.length > 0) {
              console.error(`   ⚠️ Fecha ${dateKey} no coincide con ninguna fecha disponible`);
              console.error(`   Esto puede indicar un problema de formato de fecha`);
            }
          }
        });
        
        console.error(`🚨🚨🚨 DEBUG patientIds en attendanceMap: [${patientIdsInMap.join(', ')}]`);
        
        this.logger.debug(`📊 Total asistencias encontradas para ${dateKey}: ${attendances.length}`);
        console.error(`🚨🚨🚨 DEBUG ASISTENCIAS: fecha=${dateKey}, encontradas=${attendances.length}, total_pacientes=${attendanceMap.size}`);
        
        return { dayData, activities: activities, attendances };
      })
    );

    // Generar promesas de documentos para procesar en lotes
    this.logger.log('⚡ Preparando generación de documentos (con límite de concurrencia)...');
    const documentPromises: Array<Promise<{ folderName: string; fileName: string; buffer: Buffer }>> = [];

    // CRÍTICO: Log inicial del procesamiento de días
    console.error(`🚨🚨🚨 DEBUG INICIO PROCESAMIENTO: dayDataResults.length=${dayDataResults.length}, group.programType=${group.programType}`);
    dayDataResults.forEach((dayResult, idx) => {
      console.error(`   [${idx}] ${dayResult.dayData.dayName} (${dayResult.dayData.date})`);
    });

    for (const { dayData, activities, attendances } of dayDataResults) {
      const mmdd = this.formatMMDD(dayData.date);
      const isFridayPHP = dayData.dayName === 'Friday' && group.programType === 'PHP';
      const isThursdayIOP = dayData.dayName === 'Thursday' && group.programType === 'IOP';
      const isFridayIOP = dayData.dayName === 'Friday' && group.programType === 'IOP';
      // CRÍTICO: IOP también genera notas los viernes (no solo jueves con doble nota)
      const needsDoubleNote = isFridayPHP || isThursdayIOP;
      
      // CRÍTICO: Log del día procesado
      console.error(`🚨🚨🚨 DEBUG PROCESANDO DÍA: ${dayData.dayName} (${dayData.date}), mmdd=${mmdd}, isFridayIOP=${isFridayIOP}, needsDoubleNote=${needsDoubleNote}, attendances=${attendances.length}, activities=${activities.length}`);

      const baseTemplateData = {
        group: {
          id: group.id,
          name: group.groupName || 'Group',
          clinic: group.clinic?.clinicName || 'FAMILY HEALTH COMMUNITY',
          clinicName: group.clinic?.clinicName || 'FAMILY HEALTH COMMUNITY',
          therapist: therapistName,
          therapistId: group.createdBy?.id, // ID del terapeuta para obtener firma desde BD
          createdBy: group.createdBy, // Usuario completo del terapeuta
          programType: group.programType, // PHP o IOP - necesario para seleccionar template correcto
        },
          date: dayData.date,
        activities,
        patients: patientsData, // Datos pre-cargados
      };
      
      // CRÍTICO: Verificar actividades en baseTemplateData antes de pasar a generateSinglePatientDocument
      console.error(`🚨🚨🚨 DEBUG baseTemplateData.activities: length=${baseTemplateData.activities?.length || 0}, día=${dayData.dayName}`);
      if (baseTemplateData.activities && baseTemplateData.activities.length > 0) {
        baseTemplateData.activities.forEach((act: any, idx: number) => {
          console.error(`   [${idx}] name=${act.name || act.activityName || 'N/A'}, startTime=${act.startTime || 'N/A'}, endTime=${act.endTime || 'N/A'}, units=${act.units || 'N/A'}`);
        });
      } else {
        console.error(`   ⚠️⚠️⚠️ CRÍTICO: baseTemplateData.activities está vacío para ${dayData.dayName}`);
      }

      // CRÍTICO: Log de todas las asistencias disponibles para este día
      console.error(`🚨🚨🚨 DEBUG ASISTENCIAS DISPONIBLES para ${dayData.date} (${dayData.dayName}):`);
      console.error(`   Total asistencias encontradas: ${attendances.length}`);
      attendances.forEach((att, idx) => {
        console.error(`   [${idx}] patientId=${att.patientId}, status=${att.status}, date=${att.attendanceDate}, weekId=${att.weekId || 'N/A'}`);
      });
      console.error(`   PatientIds en asistencias: [${attendances.map(a => a.patientId).join(', ')}]`);
      
      // CRÍTICO: Log de todos los pacientes
      console.error(`🚨🚨🚨 DEBUG PACIENTES para este día:`);
      patientsData.forEach((pat, idx) => {
        console.error(`   [${idx}] name=${pat.name}, id=${pat.id}, patientNumber=${pat.patientNumber || 'N/A'}`);
      });
      console.error(`   PatientIds en pacientes: [${patientsData.map(p => p.id).join(', ')}]`);

      // Generar documentos para todos los pacientes del día
      for (const patientData of patientsData) {
        // CRÍTICO: Intentar buscar la asistencia de múltiples formas
        let attendance = attendances.find(a => a.patientId === patientData.id);
        
        // Si no se encuentra por ID directo, intentar por patientNumber
        if (!attendance && patientData.patientNumber) {
          // Buscar por patientNumber a través del objeto patient en la asistencia
          attendance = attendances.find(a => a.patient?.patientNumber === patientData.patientNumber);
          if (attendance) {
            console.error(`🚨🚨🚨 ✅ Asistencia encontrada por patientNumber: ${patientData.patientNumber}`);
          }
        }
        
        // CRÍTICO: Log detallado de la búsqueda
        console.error(`🚨🚨🚨 DEBUG BÚSQUEDA ASISTENCIA:`);
        console.error(`   Paciente: ${patientData.name}`);
        console.error(`   patientId buscado: ${patientData.id} (tipo: ${typeof patientData.id})`);
        console.error(`   patientNumber: ${patientData.patientNumber || 'N/A'}`);
        console.error(`   Fecha: ${dayData.date}`);
        if (attendance) {
          console.error(`   ✅ ASISTENCIA ENCONTRADA:`);
          console.error(`      - patientId en asistencia: ${attendance.patientId} (tipo: ${typeof attendance.patientId})`);
          console.error(`      - patientNumber en asistencia: ${attendance.patient?.patientNumber || 'N/A'}`);
          console.error(`      - status: ${attendance.status}`);
          console.error(`      - attendanceDate: ${attendance.attendanceDate}`);
        } else {
          console.error(`   ❌ ASISTENCIA NO ENCONTRADA`);
          console.error(`   IDs disponibles en asistencias: [${attendances.map(a => a.patientId).join(', ')}]`);
          console.error(`   PatientNumbers disponibles: [${attendances.map(a => a.patient?.patientNumber || 'N/A').join(', ')}]`);
        }
        
        // CRÍTICO: isPresent solo es true si attendance existe Y status === 'P'
        // Si attendance es undefined o status !== 'P', entonces isPresent debe ser false
        const isPresent = attendance !== undefined && attendance.status === 'P';
        const folderName = `${patientData.name.replace(/\s+/g, '_')}_${patientData.id}`;
        
        // CRÍTICO: Log antes de generar nota para viernes IOP
        if (isFridayIOP) {
          console.error(`🚨🚨🚨 DEBUG VIERNES IOP: paciente=${patientData.name}, date=${dayData.date}, isPresent=${isPresent}, mmdd=${mmdd}, fileName será: ${needsDoubleNote ? `${mmdd} 1.docx` : `${mmdd}.docx`}`);
        }

        // DEBUG: Verificar asistencia encontrada con más detalle
        console.error(`🚨🚨🚨 DEBUG ASISTENCIA PACIENTE: paciente=${patientData.name}, id=${patientData.id}, date=${dayData.date}, attendance=${attendance ? 'ENCONTRADA' : 'NO ENCONTRADA'}, status=${attendance?.status || 'N/A'}, isPresent=${isPresent}`);
        this.logger.debug(`🔍 Asistencia para ${patientData.name} (${dayData.date}): ${attendance ? `status=${attendance.status}, isPresent=${isPresent}` : 'NO ENCONTRADA - se generará nota de ausencia'}`);
        
        // CRÍTICO: Log adicional para verificar la lógica
        if (attendance && attendance.status === 'A') {
          console.error(`🚨🚨🚨 ⚠️ PACIENTE AUSENTE DETECTADO: ${patientData.name} tiene status='A' - DEBE generar nota de ausencia`);
        } else if (!attendance) {
          console.error(`🚨🚨🚨 ⚠️ SIN ASISTENCIA REGISTRADA: ${patientData.name} no tiene asistencia para ${dayData.date} - DEBE generar nota de ausencia`);
        }

        const patientWithAttendance = {
          ...patientData,
          isPresent,
          attendance,
        };

        // CRÍTICO: Verificar ANTES de generar si el paciente está ausente
        // Si está ausente, generar nota de ausencia directamente
        const isAbsent = !isPresent || attendance?.status === 'A';
        
        if (isAbsent) {
          console.error(`🚨🚨🚨 ⚠️ PACIENTE AUSENTE - Generando nota de AUSENCIA directamente para ${patientData.name} (${dayData.date})`);
          this.logger.debug(`🔍 Paciente ausente detectado: ${patientData.name} (${dayData.date}) - generando nota de ausencia`);
          
          // Primera nota del día (ausencia)
          const fileName1 = needsDoubleNote ? `${mmdd} 1.docx` : `${mmdd}.docx`;
          documentPromises.push(
            this.wordTemplateReplacementService
              .generateSingleAbsenceDocument(patientWithAttendance, baseTemplateData)
              .then(buffer => ({ folderName, fileName: fileName1, buffer }))
              .catch(err => {
                this.logger.error(`Error generando nota de ausencia para ${patientData.name} (${dayData.date}): ${err.message}`);
                throw err;
              })
          );
        } else {
          console.error(`🚨🚨🚨 ✅ PACIENTE PRESENTE - Generando nota NORMAL para ${patientData.name} (${dayData.date})`);
          this.logger.debug(`🔍 Paciente presente: ${patientData.name} (${dayData.date}) - generando nota normal`);
          
          // Primera nota del día (normal)
          const fileName1 = needsDoubleNote ? `${mmdd} 1.docx` : `${mmdd}.docx`;
          documentPromises.push(
            this.wordTemplateReplacementService
              .generateSinglePatientDocument(patientWithAttendance, baseTemplateData)
              .then(buffer => ({ folderName, fileName: fileName1, buffer }))
              .catch(err => {
                this.logger.error(`Error generando documento para ${patientData.name} (${dayData.date}): ${err.message}`);
                throw err;
              })
          );
        }

        // Segunda nota para viernes PHP o jueves IOP (solo si el paciente está presente)
        if (needsDoubleNote && !isAbsent) {
          const fileName2 = `${mmdd} 2.docx`;
          console.error(`🚨🚨🚨 Generando segunda nota NORMAL para ${patientData.name} (${dayData.date})`);
          documentPromises.push(
            this.wordTemplateReplacementService
              .generateSinglePatientDocument(patientWithAttendance, { ...baseTemplateData, overrideCode: 'G0411' })
              .then(buffer => ({ folderName, fileName: fileName2, buffer }))
              .catch(err => {
                this.logger.error(`Error generando segunda nota para ${patientData.name} (${dayData.date}): ${err.message}`);
                throw err;
              })
          );
        } else if (needsDoubleNote && isAbsent) {
          // Si está ausente, también generar segunda nota de ausencia
          const fileName2 = `${mmdd} 2.docx`;
          console.error(`🚨🚨🚨 Generando segunda nota de AUSENCIA para ${patientData.name} (${dayData.date})`);
          documentPromises.push(
            this.wordTemplateReplacementService
              .generateSingleAbsenceDocument(patientWithAttendance, { ...baseTemplateData, overrideCode: 'G0411' })
              .then(buffer => ({ folderName, fileName: fileName2, buffer }))
              .catch(err => {
                this.logger.error(`Error generando segunda nota de ausencia para ${patientData.name} (${dayData.date}): ${err.message}`);
                throw err;
              })
          );
        }
      }
    }

    // Procesar documentos en lotes para limitar concurrencia
    const BATCH_SIZE = 15; // Procesar 15 documentos a la vez
    const batches: Array<Array<Promise<{ folderName: string; fileName: string; buffer: Buffer }>>> = [];
    
    for (let i = 0; i < documentPromises.length; i += BATCH_SIZE) {
      batches.push(documentPromises.slice(i, i + BATCH_SIZE));
    }

    this.logger.log(`📦 Procesando ${documentPromises.length} documentos en ${batches.length} lotes de hasta ${BATCH_SIZE} documentos cada uno...`);
    
    const allDocuments: Array<{ folderName: string; fileName: string; buffer: Buffer }> = [];
    
    for (let i = 0; i < batches.length; i++) {
      const batchResults = await this.processDocumentBatch(batches[i], i + 1, BATCH_SIZE);
      allDocuments.push(...batchResults);
    }

    const documents = allDocuments;
    this.logger.log(`✅ Generados ${documents.length} documentos en total (procesados en ${batches.length} lotes)`);
    
    // Validar que los documentos no estén vacíos
    const validDocuments = documents.filter(doc => {
      if (!doc.buffer || doc.buffer.length === 0) {
        this.logger.warn(`⚠️ Documento vacío: ${doc.folderName}/${doc.fileName}`);
        return false;
      }
      return true;
    });
    
    if (validDocuments.length === 0) {
      throw new Error('No se generaron documentos válidos para el ZIP');
    }
    
    this.logger.log(`✅ ${validDocuments.length} documentos válidos de ${documents.length} totales`);

    // Construir ZIP final usando PassThrough para capturar correctamente los datos
    this.logger.log('📦 Construyendo ZIP final...');
    const archiver = require('archiver');
    const { PassThrough } = require('stream');
    
    const archive = archiver('zip', { zlib: { level: 9 } });
    const passthrough = new PassThrough();
    const chunks: Buffer[] = [];

    // Conectar archiver al passthrough stream
    archive.pipe(passthrough);

    // Retornar Promise que espera el evento 'end' del passthrough (cuando el ZIP esté completamente generado)
    // IMPORTANTE: Registrar handlers ANTES de finalize() para no perder eventos
    return new Promise<Buffer>((resolve, reject) => {
      // Capturar datos del passthrough stream (NO directamente del archive)
      passthrough.on('data', (chunk: Buffer) => {
        if (chunk && chunk.length > 0) {
          chunks.push(chunk);
        }
      });

      // Escuchar eventos del passthrough stream (que recibe los datos del archive)
      passthrough.on('end', () => {
        const zipBuffer = Buffer.concat(chunks);
        this.logger.log(`🎉 ZIP semanal generado: ${zipBuffer.length} bytes, ${validDocuments.length} documentos`);
        
        // DEBUG: Verificar detalles del ZIP
        this.logger.log(`[DEBUG] Total chunks recolectados: ${chunks.length}`);
        this.logger.log(`[DEBUG] Tamaño total de chunks: ${chunks.reduce((sum, ch) => sum + ch.length, 0)} bytes`);
        this.logger.log(`[DEBUG] Tamaño del ZIP final: ${zipBuffer.length} bytes`);
        this.logger.log(`[DEBUG] Header ZIP (primeros 10 bytes): ${zipBuffer.slice(0, 10).toString('hex')}`);
        this.logger.log(`[DEBUG] Últimos 10 bytes: ${zipBuffer.slice(-10).toString('hex')}`);
        
        // Verificar que el ZIP tiene contenido válido (debe empezar con "PK")
        if (zipBuffer.length < 100 || zipBuffer[0] !== 0x50 || zipBuffer[1] !== 0x4B) {
          this.logger.error(`❌ ZIP parece vacío o corrupto (${zipBuffer.length} bytes, header: ${zipBuffer.slice(0, 2).toString('hex')})`);
          this.logger.error(`[DEBUG] Primeros 50 bytes (hex): ${zipBuffer.slice(0, 50).toString('hex')}`);
          reject(new Error('ZIP generado está vacío o corrupto'));
          return;
        }
        
        // Verificar EOCD (End of Central Directory) - debe tener "PK" cerca del final
        const eocdOffset = zipBuffer.length - 22;
        const hasValidEnd = eocdOffset >= 0 && zipBuffer[eocdOffset] === 0x50 && zipBuffer[eocdOffset + 1] === 0x4B;
        if (!hasValidEnd) {
          this.logger.warn(`⚠️ ZIP puede estar incompleto. EOCD no encontrado en offset ${eocdOffset}`);
          this.logger.warn(`[DEBUG] Últimos 30 bytes (hex): ${zipBuffer.slice(-30).toString('hex')}`);
        } else {
          // Verificar que el EOCD tiene la firma correcta (50 4B 05 06)
          const eocdSignature = zipBuffer.slice(eocdOffset, eocdOffset + 4);
          if (eocdSignature[0] === 0x50 && eocdSignature[1] === 0x4B && eocdSignature[2] === 0x05 && eocdSignature[3] === 0x06) {
            this.logger.log(`✅ EOCD válido encontrado: ${eocdSignature.toString('hex')}`);
          } else {
            this.logger.warn(`⚠️ EOCD tiene firma inesperada: ${eocdSignature.toString('hex')} (esperado: 504b0506)`);
          }
        }
        
        this.logger.log(`✅ ZIP válido generado: ${zipBuffer.length} bytes`);
        resolve(zipBuffer);
      });

      passthrough.on('error', (err: Error) => {
        this.logger.error(`❌ Error en passthrough stream: ${err.message}`);
        this.logger.error(`Stack: ${err.stack}`);
        reject(err);
      });
      
      // Escuchar errores del archive
      archive.on('error', (err: Error) => {
        this.logger.error(`❌ Error en archive generando ZIP: ${err.message}`);
        this.logger.error(`Stack: ${err.stack}`);
        reject(err);
      });

      archive.on('warning', (err: Error & { code?: string }) => {
        if (err.code === 'ENOENT') {
          this.logger.warn(`⚠️ Warning del archiver: ${err.message}`);
        } else {
          this.logger.error(`❌ Warning crítico del archiver: ${err.message}`);
          reject(err);
        }
      });

      // Agregar todos los documentos al ZIP
      this.logger.log(`📝 Agregando ${validDocuments.length} documentos válidos al ZIP...`);
      
      for (const { folderName, fileName, buffer } of validDocuments) {
        const fullPath = `${folderName}/${fileName}`;
        if (!buffer || buffer.length === 0) {
          this.logger.warn(`⚠️ Documento vacío o inválido: ${fullPath}`);
          continue;
        }
        
        // Asegurar que tenemos un Buffer válido
        const bufferCopy = Buffer.isBuffer(buffer) ? Buffer.from(buffer) : Buffer.from(buffer as any);
        
        // Verificar que el buffer tenga contenido válido (debe empezar con "PK" para ZIP/DOCX)
        if (bufferCopy.length < 4 || bufferCopy[0] !== 0x50 || bufferCopy[1] !== 0x4B) {
          this.logger.warn(`⚠️ Buffer no parece ser un DOCX válido: ${fullPath} (${bufferCopy.length} bytes, header: ${bufferCopy.slice(0, 4).toString('hex')})`);
        }
        
        archive.append(bufferCopy, { name: fullPath });
        this.logger.debug(`✅ Agregado: ${fullPath} (${bufferCopy.length} bytes)`);
      }
      
      this.logger.log(`✅ Todos los documentos agregados al ZIP`);

      // Finalizar ZIP DESPUÉS de registrar todos los handlers
      archive.finalize();
    });
  }

  /**
   * Genera una nota diaria para un grupo
   * MÉTODO OFICIAL - Usa el template simple (PHP_CLEAN_TEMPLATE_SIMPLE.docx)
   * Soporta notas de ausencia automáticamente para pacientes que no asistieron
   */
  async generateGroupDayNote(dto: { groupId: string; date: string }, user: User): Promise<Buffer> {
    this.logger.log(`Generating day note for group ${dto.groupId}, date ${dto.date}`);

    // Convertir groupId a número si es necesario
    // Usar el método simple con UUID directamente
    return await this.generateGroupDayNoteSimple(dto.groupId, dto.date);
  }

  /**
   * Genera notas diarias usando el template simple (PHP_CLEAN_TEMPLATE_SIMPLE.docx)
   * MÉTODO OFICIAL - Versión principal para generar notas PHP
   * 
   * Características:
   * - Usa template sin bucles para mejor control de formato
   * - Soporta doble nota automática para viernes en grupos PHP (códigos G0410 y G0410)
   * - Genera código dinámico (G0410/G0411) según el día de la semana
   * - Formato optimizado para documentos individuales y grupales
   * 
   * @param groupId - ID numérico del grupo
   * @param date - Fecha en formato string (YYYY-MM-DD)
   * @returns Buffer con el documento Word generado o ZIP si es viernes PHP
   */
  async generateGroupDayNoteSimple(groupId: string, date: string): Promise<Buffer> {
    this.logger.log(`Generating simple group day note for group ${groupId} on ${date}`);

    // Usar UUID de grupo directamente
    const groupIdString = groupId;

    // Obtener datos del grupo y pacientes (mismo proceso que el método original)
    const group = await this.groupRepository.findOne({
      where: { id: groupIdString },
      relations: ['clinic', 'createdBy'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    const groupPatients = await this.groupPatientRepository.find({
      where: { group: { id: groupIdString } },
      relations: ['patient'],
    });

    if (groupPatients.length === 0) {
      throw new NotFoundException(`No patients found for group ${groupId}`);
    }

    // Obtener actividades del día
    const activities = await this.getActivitiesForDate(groupId, date);
    
    // Obtener asistencias del día con razones de ausencia
    const attendanceDate = new Date(date);
    const attendances = await this.attendanceRepository.find({
      where: { 
        attendanceDate: attendanceDate
      },
      relations: ['patient', 'absenceReasons'],
    });

    // Obtener nombre del terapeuta
    const therapistName = group.createdBy 
      ? group.createdBy.fullName || 'Alina Morales, MSMH'
      : 'Alina Morales, MSMH';

    // Detectar tipo de programa
    // DEBUG: Verificar programType del grupo
    this.logger.log(`🔍 Grupo obtenido: ${group.groupName || 'N/A'}, programType: ${group.programType || 'N/A'}, raw: ${JSON.stringify({ programType: group.programType })}`);
    
    const isIOP = group.programType === 'IOP';
    this.logger.log(`🔍 isIOP: ${isIOP}`);

    // Preparar datos para el template
    const templateData = {
      group: {
        id: group.id,
        name: group.groupName || 'Group',
        clinic: group.clinic?.clinicName || 'FAMILY HEALTH COMMUNITY',
        clinicName: group.clinic?.clinicName || 'FAMILY HEALTH COMMUNITY',
        therapist: therapistName,
        therapistId: group.createdBy?.id,
        createdBy: group.createdBy,
        programType: group.programType || 'PHP', // PHP o IOP - necesario para seleccionar template correcto (fallback a PHP)
      },
      date: date,
      patients: await Promise.all(groupPatients.map(async (gp) => {
        const attendance = attendances.find(a => a.patientId === gp.patient.id);
        const isPresent = attendance?.status === 'P';
        
        // Para IOP, necesitamos obtener todos los diagnósticos (hasta 4)
        // Para PHP, solo el más reciente
        let diagnosis: any;
        
        if (isIOP) {
          const diagnosesList = await this.patientDiagnosisRepository.find({
            where: { patientId: gp.patient.id },
            order: { isPrimary: 'DESC', createdAt: 'DESC' },
            take: 4,
          });
          diagnosis = diagnosesList.length > 0 ? diagnosesList : [{
            id: '',
            icd10Code: 'F33.2',
            diagnosisDescription: 'Major depressive disorder, recurrent episode, severe, without psychotic features',
            isPrimary: true,
            patientId: gp.patient.id,
          } as PatientDiagnosis];
        } else {
          diagnosis = [await this.getPatientDiagnosis(gp.patient.id)]; // Array para consistencia
        }
        
        return {
        id: gp.patient.id,
          name: `${gp.patient.firstName} ${gp.patient.lastName}`,
          patientNumber: gp.patient.patientNumber,
          diagnosis,
          diagnoses: diagnosis, // Alias para compatibilidad con IOP
        goals: await this.getPatientGoals(gp.patient.id),
          isPresent: isPresent,
          attendance: attendance, // Incluir objeto attendance con absenceReasons
        };
      })),
      activities: activities,
      attendanceSummary: {
        totalPatients: groupPatients.length,
        presentCount: attendances.filter(a => a.status === 'P').length,
        absentCount: attendances.filter(a => a.status === 'A').length,
        attendanceRate: Math.round((attendances.filter(a => a.status === 'P').length / groupPatients.length) * 100),
      },
    };

    // Verificar si es viernes PHP o jueves IOP para generar doble nota
    const dateObj = new Date(date);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 1 = Monday, ..., 4 = Thursday, 5 = Friday
    const isThursday = dayOfWeek === 4;
    const isFriday = dayOfWeek === 5;
    const isPHP = group.programType === 'PHP';
    // isIOP ya está declarado arriba (línea 443)
    const isFridayPHP = isFriday && isPHP;
    const isThursdayIOP = isThursday && isIOP;
    const needsDoubleNote = isFridayPHP || isThursdayIOP;

    // Si es viernes PHP o jueves IOP, generar dos documentos
    if (needsDoubleNote) {
      const dayType = isFridayPHP ? 'viernes PHP' : 'jueves IOP';
      this.logger.log(`🔄 ${dayType} detectado - generando doble nota (dos documentos)`);
      
      try {
        const archiver = require('archiver');
        const archive = archiver('zip', { zlib: { level: 9 } });
        const chunks: Buffer[] = [];

        archive.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        // Generar primer documento (G0410)
        const documentBuffer1 = await this.wordTemplateReplacementService.generateGroupDayDocumentSimple({
          ...templateData,
          overrideCode: 'G0410',
        });
        const fileName1 = `Group_${groupId}_${date}_Note_1.docx`;
        archive.append(documentBuffer1, { name: fileName1 });

        // Generar segundo documento (código G0411)
        const documentBuffer2 = await this.wordTemplateReplacementService.generateGroupDayDocumentSimple({
          ...templateData,
          overrideCode: 'G0411',
        });
        const fileName2 = `Group_${groupId}_${date}_Note_2.docx`;
        archive.append(documentBuffer2, { name: fileName2 });

        await archive.finalize();

        return new Promise<Buffer>((resolve, reject) => {
          archive.on('end', () => {
            const zipBuffer = Buffer.concat(chunks);
            this.logger.log(`✅ ZIP generado con doble nota para ${dayType}: ${zipBuffer.length} bytes`);
            resolve(zipBuffer);
          });
          
          archive.on('error', (err: Error) => {
            this.logger.error(`❌ Error generando ZIP para doble nota: ${err.message}`);
            reject(err);
          });
        });
      } catch (error) {
        this.logger.error(`Error generating double note for ${dayType}: ${error.message}`);
        // Fallback: generar solo un documento
        this.logger.log('Falling back to single document...');
      const documentBuffer = await this.wordTemplateReplacementService.generateGroupDayDocumentSimple(templateData);
      return documentBuffer;
      }
    }

    // Para otros días o grupos IOP, generar documento único (sin fallback al template antiguo)
      const documentBuffer = await this.wordTemplateReplacementService.generateGroupDayDocumentSimple(templateData);
      this.logger.log(`Generated simple Word document for group ${templateData.group.name} on ${templateData.date}`);
      return documentBuffer;
  }

  /**
   * Genera documentos individuales para cada paciente usando el template simple
   * MÉTODO OFICIAL - Versión principal para generar notas individuales por paciente
   * 
   * Características:
   * - Genera un documento Word por paciente en un archivo ZIP
   * - Detecta automáticamente pacientes ausentes y genera notas de ausencia
   * - Usa PHP_CLEAN_TEMPLATE_SIMPLE.docx para pacientes presentes
   * - Usa PHP_CLEAN_TEMPLATE_SIMPLE AUSENCIA.docx para pacientes ausentes
   * - Incluye razón de ausencia cuando está disponible
   * 
   * @param groupId - ID numérico del grupo
   * @param date - Fecha en formato string (YYYY-MM-DD)
   * @returns Buffer ZIP con todos los documentos individuales
   */
  async generateIndividualPatientNotes(groupId: number, date: string): Promise<Buffer> {
    this.logger.log(`Generating individual patient notes for group ${groupId} on ${date}`);

    // Convertir groupId a string para las consultas (Group.id es string)
    const groupIdString = String(groupId);

    // Obtener datos del grupo y pacientes (mismo proceso que el método original)
    const group = await this.groupRepository.findOne({
      where: { id: groupIdString },
      relations: ['clinic', 'createdBy'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${groupId} not found`);
    }

    const groupPatients = await this.groupPatientRepository.find({
      where: { group: { id: groupIdString } },
      relations: ['patient'],
    });

    if (groupPatients.length === 0) {
      throw new NotFoundException(`No patients found for group ${groupId}`);
    }

    // Obtener actividades del día
    const activities = await this.getActivitiesForDate(groupId, date);
    
    // Obtener asistencias del día con razones de ausencia
    const attendanceDate = new Date(date);
    const attendances = await this.attendanceRepository.find({
      where: { 
        attendanceDate: attendanceDate
      },
      relations: ['patient', 'absenceReasons'],
    });

    // Obtener nombre del terapeuta
    const therapistName = group.createdBy 
      ? group.createdBy.fullName || 'Alina Morales, MSMH'
      : 'Alina Morales, MSMH';

    // Preparar datos para el template
    const templateData = {
      group: {
        id: group.id,
        name: group.groupName || 'Group',
        clinic: group.clinic?.clinicName || 'FAMILY HEALTH COMMUNITY',
        therapist: therapistName,
      },
      date: date,
      patients: await Promise.all(groupPatients.map(async (gp) => {
        const attendance = attendances.find(a => a.patientId === gp.patient.id);
        const isPresent = attendance?.status === 'P';
        
        return {
        id: gp.patient.id,
          name: `${gp.patient.firstName} ${gp.patient.lastName}`,
          patientNumber: gp.patient.patientNumber,
          diagnosis: [await this.getPatientDiagnosis(gp.patient.id)], // Array para consistencia
        goals: await this.getPatientGoals(gp.patient.id),
          isPresent: isPresent,
          attendance: attendance, // Incluir objeto attendance con absenceReasons
        };
      })),
      activities: activities,
      attendanceSummary: {
        totalPatients: groupPatients.length,
        presentCount: attendances.filter(a => a.status === 'P').length,
        absentCount: attendances.filter(a => a.status === 'A').length,
        attendanceRate: Math.round((attendances.filter(a => a.status === 'P').length / groupPatients.length) * 100),
      },
    };

    // Generar documentos individuales usando el template simple
    try {
      const zipBuffer = await this.wordTemplateReplacementService.generateIndividualDocuments(templateData);
      this.logger.log(`Generated individual patient notes ZIP for group ${templateData.group.name} on ${templateData.date}`);
      return zipBuffer;
    } catch (error) {
      this.logger.error(`Error generating individual patient notes: ${error.message}`);
      throw new BadRequestException('Error generating individual patient notes');
    }
  }

  /**
   * Obtiene las fechas de la semana según el tipo de programa
   */
  private getWeekDates(week: GroupWeek, programType: string): Array<{ date: string; dayName: string }> {
    // Calcular el lunes de la semana laboral (sin importar qué día sea startDate)
    // IOP y PHP: Lunes a Viernes (5 días laborables, excluyendo sábado y domingo)
    const startDate = new Date(week.startDate);
    startDate.setHours(0, 0, 0, 0);
    
    // CRÍTICO: Parsear fecha de forma segura para evitar problemas de zona horaria
    // Si week.startDate es string YYYY-MM-DD, parsearlo manualmente
    let parsedStartDate: Date;
    if (typeof week.startDate === 'string') {
      const dateStr = week.startDate as string;
      const [year, month, day] = dateStr.split('-').map(Number);
      parsedStartDate = new Date(year, month - 1, day);
    } else {
      parsedStartDate = new Date(week.startDate);
    }
    parsedStartDate.setHours(0, 0, 0, 0);
    
    // Obtener el día de la semana (0=domingo, 1=lunes, ..., 6=sábado)
    const dayOfWeek = parsedStartDate.getDay();
    
    // DEBUG: Log del día de inicio
    console.error(`🚨🚨🚨 DEBUG getWeekDates: week.startDate=${week.startDate}, dayOfWeek=${dayOfWeek} (${['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek]})`);
    
    // Calcular cuántos días retroceder para llegar al lunes
    // Si es domingo (0), retroceder 6 días; si es lunes (1), no retroceder; etc.
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    // Calcular el lunes de la semana laboral
    const mondayDate = new Date(parsedStartDate);
    mondayDate.setDate(parsedStartDate.getDate() - daysToMonday);
    
    // DEBUG: Verificar que el lunes sea realmente lunes
    const mondayDayOfWeek = mondayDate.getDay();
    if (mondayDayOfWeek !== 1) {
      this.logger.error(`❌ ERROR: La fecha calculada como lunes no es lunes! dayOfWeek=${mondayDayOfWeek}, fecha=${mondayDate.toISOString()}`);
      throw new BadRequestException(`Error calculando lunes de semana: fecha calculada no es lunes`);
    }
    
    const dates: Array<{ date: string; dayName: string }> = [];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    // Generar 5 días (lunes a viernes)
    for (let i = 0; i < 5; i++) {
      const date = new Date(mondayDate);
      date.setDate(mondayDate.getDate() + i);
      
      // Formatear fecha como YYYY-MM-DD sin problemas de zona horaria
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      
      // Verificar que el día de la semana sea correcto
      const actualDayOfWeek = date.getDay();
      const expectedDayIndex = i; // Monday=1, Tuesday=2, etc.
      if (actualDayOfWeek !== expectedDayIndex + 1) {
        this.logger.error(`❌ ERROR: Día ${i} (esperado ${dayNames[i]}) tiene dayOfWeek=${actualDayOfWeek}`);
      }
      
      dates.push({
        date: dateString,
        dayName: dayNames[i],
      });
      
      console.error(`🚨🚨🚨 DEBUG getWeekDates día ${i}: ${dayNames[i]} = ${dateString}`);
      
      // CRÍTICO: Log especial para viernes
      if (dayNames[i] === 'Friday') {
        console.error(`🚨🚨🚨 ✅ VIERNES INCLUIDO: ${dateString} (índice ${i})`);
      }
    }

    return dates;
  }

  /**
   * Obtiene el día de la semana como string
   */
  private getDayOfWeek(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

  /**
   * Crea archivo ZIP con todas las notas de la semana
   */
  private async createZipWithWeekNotes(
    dayNotes: Array<{ date: string; dayName: string; buffer: Buffer; fileName?: string }>,
    groupName: string,
    weekNumber: number,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const chunks: Buffer[] = [];

      archive.on('data', (chunk) => {
        chunks.push(chunk);
      });

      archive.on('end', () => {
        const buffer = Buffer.concat(chunks);
        this.logger.log(`Created ZIP with ${dayNotes.length} notes for group ${groupName}, week ${weekNumber}`);
        resolve(buffer);
      });

      archive.on('error', (err) => {
        this.logger.error(`Error creating ZIP: ${err.message}`);
        reject(err);
      });

      // Agregar cada nota al ZIP
      dayNotes.forEach(({ date, dayName, buffer, fileName: customFileName }) => {
        // Si tiene nombre personalizado (desde ZIP de viernes), usarlo
        const fileName = customFileName || this.generateDayFileName(date, dayName, groupName);
        archive.append(buffer, { name: fileName });
      });

      archive.finalize();
    });
  }

  /**
   * Verifica si un buffer es un archivo ZIP
   */
  private isZipBuffer(buffer: Buffer): boolean {
    // ZIP files start with "PK" (50 4B)
    return buffer.length > 2 && buffer[0] === 0x50 && buffer[1] === 0x4B;
  }

  /**
   * Genera nombre de archivo para una nota diaria
   * Formato: Group_Day_YYYYMMDD.docx (o Group_Day_YYYYMMDD_Note_N.docx para viernes PHP)
   */
  private generateDayFileName(date: string, dayName: string, groupName: string, noteNumber?: number): string {
    const dateStr = date.replace(/-/g, '');
    if (noteNumber) {
      return `Group_Day_${dateStr}_Note_${noteNumber}.docx`;
    }
    return `Group_Day_${dateStr}.docx`;
  }

  private formatMMDD(date: string): string {
    const d = new Date(date);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${mm}${dd}`;
  }

  /**
   * Obtiene las actividades para un día específico desde el horario del grupo en la base de datos
   * Si schedules está proporcionado, usa esos datos en lugar de hacer una query nueva
   */
  private async getActivitiesForDay(
    date: string, 
    groupId: string, 
    schedules?: any[], 
    paragraphsCache?: Map<string, any>
  ): Promise<any[]> {
    const dayOfWeek = new Date(date).getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];

    try {
      let daySchedules = schedules;
      
      // Si no se proporcionaron schedules pre-cargados, obtenerlos de la BD
      if (!daySchedules) {
      this.logger.log(`Consultando horarios para grupo ${groupId}, día ${dayName}`);
      
        daySchedules = await this.groupScheduleRepository
        .createQueryBuilder('schedule')
        .leftJoinAndSelect('schedule.activity', 'activity')
        .leftJoinAndSelect('schedule.subactivity', 'subactivity')
        .where('schedule.groupId = :groupId', { groupId })
        .andWhere('LOWER(schedule.dayOfWeek) = LOWER(:dayOfWeek)', { dayOfWeek: dayName })
        .orderBy('schedule.startTime', 'ASC')
        .getMany();

        this.logger.log(`Encontrados ${daySchedules.length} horarios para el día ${dayName}`);
      } else {
        this.logger.debug(`Usando horarios pre-cargados para el día ${dayName} (${daySchedules.length} horarios)`);
      }

      // Si hay horarios configurados, usarlos
      if (daySchedules.length > 0) {
        // Obtener párrafos para cada subactivity usando RotationService o cache
        const activities = await Promise.all(
          daySchedules.map(async (schedule, idx) => {
            let paragraphText = '';
            
            // DEBUG: Log de schedule
            this.logger.debug(`[${idx + 1}] Schedule: ${schedule.activity?.activityName || 'N/A'}`);
            this.logger.debug(`  - Subactivity ID: ${schedule.subactivity?.id || 'NO CONFIGURADA'}`);
            this.logger.debug(`  - Subactivity Name: ${schedule.subactivity?.subactivityName || 'N/A'}`);
            
            // Obtener párrafo: si hay subactivity, buscar por subactivity; si no, buscar por activity
            let foundSubactivity = schedule.subactivity;
            let foundSubactivityName = schedule.subactivity?.subactivityName || '';
            
            if (schedule.subactivity?.id) {
              // Si hay subactivity configurada, rotar entre párrafos de esa subactivity
              // IMPORTANTE: Usar rotación por grupo+subactivity para que todos los pacientes compartan el ciclo
              // El cache se usa solo para evitar múltiples consultas en la misma generación del mismo día
              // pero la rotación debe avanzar entre diferentes días/generaciones
              const cacheKey = `subactivity_${groupId}_${schedule.subactivity.id}`;
              let paragraph = paragraphsCache?.get(cacheKey);
              
              // Solo usar cache si es la primera vez que se consulta en esta generación del mismo día
              // Esto evita múltiples consultas para el mismo schedule en el mismo día
              // La rotación avanza automáticamente entre días porque cada día tiene su propio cache
              if (!paragraph) {
                paragraph = await this.rotationService.getNextParagraphForObjective(
                  schedule.subactivity.id,
                  groupId // Pasar groupId para rotación correcta por grupo+subactivity
                );
                // Guardar en cache solo para este día para evitar consultas duplicadas
                // La rotación avanza porque cada día consulta independientemente
                if (paragraph && paragraphsCache) {
                  paragraphsCache.set(cacheKey, paragraph);
                }
              }
              
              paragraphText = paragraph?.paragraphText || '';
              this.logger.debug(`  - Paragraph obtenido por subactivity configurada: ${paragraphText ? 'SÍ' : 'NO'} (${paragraphText.length} chars)`);
              if (paragraphText) {
                this.logger.debug(`  - Primeros 100 chars del párrafo: ${paragraphText.substring(0, 100)}...`);
              }
            } else if (schedule.activity?.id) {
              // Si no hay subactivity configurada, buscar párrafo de subactivity que pertenezca a la actividad
              // IMPORTANTE: Usar rotación por grupo+actividad (compartida entre todos los pacientes)
              // El cache se usa solo para evitar múltiples consultas en la misma generación del mismo día
              // pero la rotación debe avanzar entre diferentes días/generaciones
              // IMPORTANTE: No usar cache compartido entre días para que la rotación avance correctamente
              const cacheKey = `activity_${groupId}_${schedule.activity.id}`;
              let paragraph = paragraphsCache?.get(cacheKey);
              
              // Solo usar cache si es la primera vez que se consulta en esta generación del mismo día
              // Esto evita múltiples consultas para el mismo schedule en el mismo día
              // La rotación avanza automáticamente entre días porque cada día tiene su propio cache
              if (!paragraph) {
                paragraph = await this.rotationService.getNextParagraphForActivity(
                  schedule.activity.id,
                  groupId // Pasar groupId para rotación correcta por grupo+actividad
                ) as any;
                // Guardar en cache solo para este día para evitar consultas duplicadas
                // La rotación avanza porque cada día consulta independientemente
                if (paragraph && paragraphsCache) {
                  paragraphsCache.set(cacheKey, paragraph);
                }
              }
              
              paragraphText = paragraph?.paragraphText || '';
              
              // Si el párrafo viene de una subactivity (aunque no esté configurada en el schedule),
              // usar esa información para el header
              if (paragraph && paragraph.subactivity) {
                foundSubactivity = paragraph.subactivity;
                foundSubactivityName = paragraph.subactivity.subactivityName || '';
                this.logger.debug(`  - Paragraph obtenido de subactivity automática: ${foundSubactivityName} (índice schedule: ${idx})`);
              }
              
              this.logger.debug(`  - Paragraph obtenido por activity: ${paragraphText ? 'SÍ' : 'NO'} (${paragraphText.length} chars)`);
              if (paragraphText) {
                this.logger.debug(`  - Primeros 100 chars del párrafo: ${paragraphText.substring(0, 100)}...`);
              } else {
                this.logger.warn(`  - ⚠️ No hay párrafo en BD para actividad ${schedule.activity?.activityName || 'Activity'}`);
              }
            } else {
              this.logger.warn(`  - ⚠️ No hay actividad ni subactivity configurada`);
            }
            
            return {
          name: schedule.activity?.activityName || 'Activity',
              activityName: schedule.activity?.activityName || 'Activity',
          description: foundSubactivityName || schedule.activity?.description || '',
              subactivityName: foundSubactivityName,
              subactivity: foundSubactivity || schedule.subactivity,
          objective: schedule.activity?.description || '',
              paragraph: paragraphText,
              paragraphText: paragraphText,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          units: schedule.units,
            };
          })
        );
        
        this.logger.log(`✅ Actividades configuradas para ${dayName}:`);
        console.error(`🚨🚨🚨 getActivitiesForDay: ${activities.length} actividades generadas para ${dayName}`);
        activities.forEach((act, i) => {
          this.logger.log(`  ${i + 1}. ${act.name}${act.subactivityName ? ` - ${act.subactivityName}` : ''} (${act.startTime}-${act.endTime})`);
          this.logger.log(`     - Párrafo: ${act.paragraphText ? `${act.paragraphText.length} chars` : 'VACÍO'}`);
          console.error(`   [${i}] name=${act.name || act.activityName || 'N/A'}, startTime=${act.startTime || 'N/A'}, endTime=${act.endTime || 'N/A'}, units=${act.units || 'N/A'}`);
        });
        return activities;
      }

      // Si no hay horarios configurados, log warning pero no fallar
      this.logger.warn(`No se encontraron horarios configurados para el grupo ${groupId} en el día ${dayName}`);
      
    } catch (error) {
      this.logger.error(`Error obteniendo actividades para el día ${date}: ${error.message}`);
    }
    
    // Devuelve un array vacío si no hay horarios configurados
    // Esto permitirá que el template use valores por defecto
    return [];
  }

  /**
   * Obtiene los objetivos de un paciente
   */
  private async getPatientGoals(patientId: string): Promise<any[]> {
    try {
      const goals = await this.patientGoalRepository.find({
        where: { patientId },
        order: { goalNumber: 'ASC' },
      });

      if (goals.length > 0) {
        return goals.map(goal => ({
          description: goal.goalText,
          goalNumber: goal.goalNumber,
        }));
      }

      // Devolver objetivos por defecto si no hay objetivos específicos
      return [
        { description: 'Client will identify and resolve the underlying causes of depression, thus elevating mood and interest/pleasure in life.', goalNumber: 1 },
        { description: 'Client will significantly reduce the overall frequency and intensity of the anxiety symptoms so that daily functioning is improved.', goalNumber: 2 },
        { description: 'Client will feel refreshed and energetic during wakeful hours.', goalNumber: 3 },
        { description: 'Client will reach a personal balance between solitary time and interpersonal interaction with others.', goalNumber: 4 },
      ];
    } catch (error) {
      this.logger.error(`Error getting patient goals: ${error.message}`);
      return [];
    }
  }

  /**
   * Batch query: Obtiene diagnósticos de todos los pacientes en una sola consulta
   */
  private async getAllPatientDiagnoses(patientIds: string[]): Promise<Map<string, string>> {
    try {
      if (patientIds.length === 0) return new Map();

      // Obtener todos los diagnósticos para los pacientes y luego filtrar el más reciente de cada uno
      const allDiagnoses = await this.patientDiagnosisRepository.find({
        where: { patientId: In(patientIds) },
        order: { patientId: 'ASC', createdAt: 'DESC' },
      });

      const diagnosisMap = new Map<string, string>();
      
      // Agrupar por paciente y tomar el más reciente (el primero por orden DESC)
      const patientSeen = new Set<string>();
      allDiagnoses.forEach(d => {
        if (!patientSeen.has(d.patientId)) {
          diagnosisMap.set(d.patientId, d.icd10Code || 'F33.2');
          patientSeen.add(d.patientId);
        }
      });

      // Agregar valores por defecto para pacientes sin diagnóstico
      patientIds.forEach(id => {
        if (!diagnosisMap.has(id)) {
          diagnosisMap.set(id, 'F33.2');
        }
      });

      this.logger.debug(`✅ Obtenidos ${diagnosisMap.size} diagnósticos para ${patientIds.length} pacientes (batch query)`);
      return diagnosisMap;
    } catch (error) {
      this.logger.error(`Error getting all patient diagnoses: ${error.message}`);
      // Devolver map con valores por defecto en caso de error
      const defaultMap = new Map<string, string>();
      patientIds.forEach(id => defaultMap.set(id, 'F33.2'));
      return defaultMap;
    }
  }

  /**
   * Batch query: Obtiene todos los diagnósticos de cada paciente (hasta 4 por paciente)
   * Usado para notas IOP que requieren múltiples diagnósticos
   */
  private async getAllPatientDiagnosesList(patientIds: string[]): Promise<Map<string, PatientDiagnosis[]>> {
    try {
      if (patientIds.length === 0) return new Map();

      // Obtener todos los diagnósticos para los pacientes
      const allDiagnoses = await this.patientDiagnosisRepository.find({
        where: { patientId: In(patientIds) },
        order: { isPrimary: 'DESC', createdAt: 'DESC' }, // Primero primario, luego más recientes
      });

      const diagnosisMap = new Map<string, PatientDiagnosis[]>();
      
      // Agrupar por paciente y limitar a máximo 4 diagnósticos por paciente
      // IMPORTANTE: Ordenar por isPrimary DESC (primario primero) y luego por createdAt DESC
      patientIds.forEach(patientId => {
        const patientDiagnoses = allDiagnoses
          .filter(d => d.patientId === patientId)
          .sort((a, b) => {
            // Primero ordenar por isPrimary (true primero)
            if (a.isPrimary !== b.isPrimary) {
              return a.isPrimary ? -1 : 1;
            }
            // Si ambos tienen el mismo isPrimary, ordenar por fecha de creación (más reciente primero)
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })
          .slice(0, 4); // Limitar a máximo 4
        
        if (patientDiagnoses.length > 0) {
          diagnosisMap.set(patientId, patientDiagnoses);
        } else {
          // Si no hay diagnóstico, crear uno por defecto
          const defaultDiagnosis = {
            id: '',
            icd10Code: 'F33.2',
            diagnosisDescription: 'Major depressive disorder, recurrent episode, severe, without psychotic features',
            isPrimary: true,
            patientId,
          } as PatientDiagnosis;
          diagnosisMap.set(patientId, [defaultDiagnosis]);
        }
      });

      this.logger.debug(`✅ Obtenidos diagnósticos completos para ${diagnosisMap.size} pacientes (batch query)`);
      return diagnosisMap;
    } catch (error) {
      this.logger.error(`Error getting all patient diagnoses list: ${error.message}`);
      // Devolver map con valores por defecto en caso de error
      const defaultMap = new Map<string, PatientDiagnosis[]>();
      patientIds.forEach(id => {
        defaultMap.set(id, [{
          id: '',
          icd10Code: 'F33.2',
          diagnosisDescription: 'Major depressive disorder, recurrent episode, severe, without psychotic features',
          isPrimary: true,
          patientId: id,
        } as PatientDiagnosis]);
      });
      return defaultMap;
    }
  }

  /**
   * Batch query: Obtiene goals de todos los pacientes en una sola consulta
   */
  private async getAllPatientGoals(patientIds: string[]): Promise<Map<string, any[]>> {
    try {
      if (patientIds.length === 0) return new Map();

      const goals = await this.patientGoalRepository.find({
        where: { patientId: patientIds as any },
        order: { patientId: 'ASC', goalNumber: 'ASC' },
      });

      const goalsMap = new Map<string, any[]>();
      
      // Agrupar goals por paciente
      goals.forEach(goal => {
        if (!goalsMap.has(goal.patientId)) {
          goalsMap.set(goal.patientId, []);
        }
        goalsMap.get(goal.patientId)!.push({
          description: goal.goalText,
          goalNumber: goal.goalNumber,
        });
      });

      // Agregar objetivos por defecto para pacientes sin goals
      const defaultGoals = [
        { description: 'Client will identify and resolve the underlying causes of depression, thus elevating mood and interest/pleasure in life.', goalNumber: 1 },
        { description: 'Client will significantly reduce the overall frequency and intensity of the anxiety symptoms so that daily functioning is improved.', goalNumber: 2 },
        { description: 'Client will feel refreshed and energetic during wakeful hours.', goalNumber: 3 },
        { description: 'Client will reach a personal balance between solitary time and interpersonal interaction with others.', goalNumber: 4 },
      ];
      patientIds.forEach(id => {
        if (!goalsMap.has(id)) {
          goalsMap.set(id, defaultGoals);
        }
      });

      this.logger.debug(`✅ Obtenidos goals para ${goalsMap.size} pacientes (batch query)`);
      return goalsMap;
    } catch (error) {
      this.logger.error(`Error getting all patient goals: ${error.message}`);
      // Devolver map con valores por defecto en caso de error
      const defaultGoals = [
        { description: 'Client will identify and resolve the underlying causes of depression, thus elevating mood and interest/pleasure in life.', goalNumber: 1 },
        { description: 'Client will significantly reduce the overall frequency and intensity of the anxiety symptoms so that daily functioning is improved.', goalNumber: 2 },
        { description: 'Client will feel refreshed and energetic during wakeful hours.', goalNumber: 3 },
        { description: 'Client will reach a personal balance between solitary time and interpersonal interaction with others.', goalNumber: 4 },
      ];
      const defaultMap = new Map<string, any[]>();
      patientIds.forEach(id => defaultMap.set(id, defaultGoals));
      return defaultMap;
    }
  }

  /**
   * Obtiene las actividades para una fecha específica (alias de getActivitiesForDay)
   */
  private async getActivitiesForDate(groupId: number | string, date: string): Promise<any[]> {
    // IMPORTANTE: Pasar parámetros en orden correcto: date, groupId (no schedules, así que se consultan de BD)
    return this.getActivitiesForDay(date, String(groupId));
  }

  /**
   * Obtiene el diagnóstico de un paciente
   */
  private async getPatientDiagnosis(patientId: string): Promise<string> {
    try {
      const diagnosis = await this.patientDiagnosisRepository.findOne({
        where: { patientId },
        order: { createdAt: 'DESC' },
      });

      if (diagnosis) {
        return diagnosis.icd10Code || 'F33.2';
      }

      // Devolver diagnóstico por defecto si no hay diagnóstico específico
      return 'F33.2';
    } catch (error) {
      this.logger.error(`Error getting patient diagnosis: ${error.message}`);
      return 'F33.2';
    }
  }

  /**
   * Batch query: Obtiene todas las asistencias de la semana en una sola consulta
   */
  private async getAllWeekAttendances(
    patientIds: string[],
    weekDates: Array<{ date: string; dayName: string }>,
    weekId: string
  ): Promise<Map<string, Map<string, Attendance>>> {
    try {
      if (patientIds.length === 0 || weekDates.length === 0) return new Map();

      // Usar las fechas calculadas directamente (ya están en formato YYYY-MM-DD)
      const dateStrings = weekDates.map(d => d.date);
      const firstDate = new Date(dateStrings[0] + 'T00:00:00');
      const lastDate = new Date(dateStrings[dateStrings.length - 1] + 'T23:59:59');
      
      this.logger.debug(`🔍 Buscando asistencias para weekId=${weekId}, fechas desde ${dateStrings[0]} hasta ${dateStrings[dateStrings.length - 1]}`);

      // CRÍTICO: Log detallado antes de buscar
      console.error(`🚨🚨🚨 DEBUG getAllWeekAttendances ANTES DE BUSCAR:`);
      console.error(`   - patientIds: [${patientIds.join(', ')}]`);
      console.error(`   - weekId: ${weekId}`);
      console.error(`   - Fechas: [${dateStrings.join(', ')}]`);
      console.error(`   - firstDate: ${firstDate.toISOString()}`);
      console.error(`   - lastDate: ${lastDate.toISOString()}`);
      
      // CRÍTICO: Probar buscar con y sin weekId para verificar si weekId está causando problemas
      // Primero buscar sin weekId para ver todas las asistencias en el rango de fechas
      const attendancesWithoutWeekId = await this.attendanceRepository.find({
        where: {
          patientId: In(patientIds),
          attendanceDate: Between(firstDate, lastDate),
        },
        relations: ['patient', 'absenceReasons'],
      });
      
      console.error(`🚨🚨🚨 DEBUG: Asistencias SIN weekId: ${attendancesWithoutWeekId.length} registros`);
      
      // Ahora buscar con weekId
      const attendances = await this.attendanceRepository.find({
        where: {
          patientId: In(patientIds),
          attendanceDate: Between(firstDate, lastDate),
          weekId: weekId, // FILTRAR POR weekId para obtener solo las asistencias de esta semana específica
        },
        relations: ['patient', 'absenceReasons'],
      });
      
      this.logger.debug(`🔍 Asistencias encontradas en BD: ${attendances.length} registros para weekId=${weekId}`);
      console.error(`🚨🚨🚨 DEBUG: Asistencias CON weekId=${weekId}: ${attendances.length} registros`);
      
      // CRÍTICO: Si hay menos asistencias con weekId que sin weekId, hay un problema
      // Si hay MUCHAS más asistencias sin weekId, significa que las asistencias no tienen el weekId correcto
      // En este caso, usaremos todas las asistencias en el rango de fechas (sin filtrar por weekId)
      if (attendancesWithoutWeekId.length > attendances.length) {
        const difference = attendancesWithoutWeekId.length - attendances.length;
        console.error(`⚠️⚠️⚠️ ADVERTENCIA: Se encontraron ${attendancesWithoutWeekId.length} asistencias sin weekId pero solo ${attendances.length} con weekId=${weekId}`);
        console.error(`   Diferencia: ${difference} asistencias`);
        console.error(`   Esto indica que las asistencias tienen un weekId diferente o NULL`);
        
        // Si la diferencia es significativa (más del 50% o si no hay ninguna con weekId), usar todas
        if (attendances.length === 0 || difference > attendancesWithoutWeekId.length * 0.5) {
          console.error(`❌❌❌ CRÍTICO: No hay suficientes asistencias con weekId=${weekId}`);
          console.error(`   Usaremos TODAS las asistencias encontradas en el rango de fechas (sin filtrar por weekId)`);
          console.error(`   Esto asegura que se generen notas para todas las fechas`);
          
          // USAR todas las asistencias sin filtrar por weekId
          attendances.length = 0;
          attendances.push(...attendancesWithoutWeekId);
          
          // CRÍTICO: Log de cada asistencia para verificar patientIds
          console.error(`🚨🚨🚨 DEBUG: Asistencias usadas (sin filtrar por weekId):`);
          attendances.forEach((att, idx) => {
            let attDate: string;
            if (att.attendanceDate instanceof Date) {
              attDate = att.attendanceDate.toISOString().split('T')[0];
            } else if (typeof att.attendanceDate === 'string') {
              const dateStr = att.attendanceDate as string;
              attDate = dateStr.includes('T') 
                ? dateStr.split('T')[0] 
                : dateStr;
            } else {
              attDate = String(att.attendanceDate);
            }
            const patientNumber = att.patient?.patientNumber || 'N/A';
            const patientName = att.patient ? `${att.patient.firstName} ${att.patient.lastName}` : 'N/A';
            console.error(`   [${idx}] patientId=${att.patientId}, patientNumber=${patientNumber}, name=${patientName}, date=${attDate}, status=${att.status}, weekId=${att.weekId || 'NULL'}`);
            
            // CRÍTICO: Verificar si el patientId está en la lista de patientIds esperados
            if (!patientIds.includes(att.patientId)) {
              console.error(`   ⚠️⚠️⚠️ PROBLEMA: patientId=${att.patientId} NO está en la lista de patientIds esperados del grupo!`);
              console.error(`   patientIds esperados: [${patientIds.join(', ')}]`);
            }
          });
        }
      }

      // CRÍTICO: Filtrar asistencias para asegurar que SOLO sean de los pacientes del grupo
      const validAttendances = attendances.filter(att => {
        const isValid = patientIds.includes(att.patientId);
        if (!isValid) {
          const patientNumber = att.patient?.patientNumber || 'N/A';
          const patientName = att.patient ? `${att.patient.firstName} ${att.patient.lastName}` : 'N/A';
          console.error(`🚨🚨🚨 ⚠️ FILTRANDO ASISTENCIA INVÁLIDA: patientId=${att.patientId} (${patientName}, ${patientNumber}) no pertenece a este grupo`);
        }
        return isValid;
      });
      
      if (validAttendances.length !== attendances.length) {
        console.error(`🚨🚨🚨 ⚠️ FILTRADAS ${attendances.length - validAttendances.length} asistencias que no pertenecen a este grupo`);
      }
      
      // Crear mapa: patientId -> dateString -> Attendance
      const attendanceMap = new Map<string, Map<string, Attendance>>();
      
      validAttendances.forEach(att => {
        // CRÍTICO: Parsear fecha de forma segura
        // attendanceDate puede ser Date, string YYYY-MM-DD, o string ISO
        let attendanceDate: Date;
        if (att.attendanceDate instanceof Date) {
          attendanceDate = att.attendanceDate;
        } else if (typeof att.attendanceDate === 'string') {
          const dateStr = att.attendanceDate as string;
          // Si es string, puede ser YYYY-MM-DD o ISO string
          if (dateStr.includes('T')) {
            // ISO string
            attendanceDate = new Date(dateStr);
          } else {
            // YYYY-MM-DD
            const [year, month, day] = dateStr.split('-').map(Number);
            attendanceDate = new Date(year, month - 1, day);
          }
        } else {
          attendanceDate = new Date(att.attendanceDate as any);
        }
        
        // Formatear como YYYY-MM-DD sin problemas de zona horaria
        const year = attendanceDate.getFullYear();
        const month = String(attendanceDate.getMonth() + 1).padStart(2, '0');
        const day = String(attendanceDate.getDate()).padStart(2, '0');
        const dateKey = `${year}-${month}-${day}`;
        
        // CRÍTICO: Log detallado de cada asistencia para debugging
        console.error(`🚨🚨🚨 DEBUG ASISTENCIA: patientId=${att.patientId}, attendanceDate original=${att.attendanceDate}, dateKey=${dateKey}, status=${att.status}, weekId=${att.weekId || 'N/A'}`);
        
        if (!attendanceMap.has(att.patientId)) {
          attendanceMap.set(att.patientId, new Map());
        }
        
        // CRÍTICO: Si ya existe una asistencia para esta fecha, verificar cuál tiene prioridad
        const existingAttendance = attendanceMap.get(att.patientId)!.get(dateKey);
        if (existingAttendance) {
          // Si ya existe, comparar status y priorizar 'A' (ausente) sobre 'P' si hay conflicto
          // O mejor: priorizar la más reciente (updatedAt más reciente)
          const existingUpdatedAt = existingAttendance.updatedAt instanceof Date 
            ? existingAttendance.updatedAt.getTime()
            : new Date(existingAttendance.updatedAt).getTime();
          const newUpdatedAt = att.updatedAt instanceof Date 
            ? att.updatedAt.getTime()
            : new Date(att.updatedAt).getTime();
          
          // Si hay conflicto (diferentes status), usar la más reciente
          if (existingAttendance.status !== att.status) {
            console.error(`🚨🚨🚨 ⚠️ CONFLICTO DE STATUS: Ya existe asistencia para ${dateKey} con status=${existingAttendance.status}, nueva tiene status=${att.status}`);
            console.error(`   existingAttendanceId=${existingAttendance.id}, newAttendanceId=${att.id}`);
            console.error(`   existingUpdatedAt=${existingUpdatedAt}, newUpdatedAt=${newUpdatedAt}`);
            
            if (newUpdatedAt > existingUpdatedAt) {
              console.error(`   ✅ Usando la MÁS RECIENTE (nueva): status=${att.status}`);
              attendanceMap.get(att.patientId)!.set(dateKey, att);
            } else {
              console.error(`   ✅ Manteniendo la MÁS RECIENTE (existente): status=${existingAttendance.status}`);
            }
          } else {
            // Mismo status, usar la más reciente
            if (newUpdatedAt > existingUpdatedAt) {
              attendanceMap.get(att.patientId)!.set(dateKey, att);
            }
          }
        } else {
          // No existe, agregar normalmente
          attendanceMap.get(att.patientId)!.set(dateKey, att);
        }
      });

      this.logger.debug(`✅ Obtenidas ${attendances.length} asistencias para ${patientIds.length} pacientes en ${weekDates.length} días (batch query)`);
      console.error(`🚨🚨🚨 DEBUG getAllWeekAttendances: weekId=${weekId}, attendances=${attendances.length}, attendanceMap.size=${attendanceMap.size}`);
      
      // DEBUG: Verificar estructura del mapa DESPUÉS de construir
      
      if (attendanceMap.size === 0 && attendances.length > 0) {
        console.error(`❌❌❌ CRÍTICO: attendanceMap está vacío aunque hay ${attendances.length} asistencias!`);
        attendances.forEach((att, index) => {
          const attendanceDate = att.attendanceDate instanceof Date 
            ? att.attendanceDate 
            : new Date(att.attendanceDate);
          const dateKey = attendanceDate.toISOString().split('T')[0];
          console.error(`   - attendance[${index}]: patientId=${att.patientId}, date=${dateKey}, status=${att.status}, attendanceDate type=${typeof att.attendanceDate}`);
        });
      } else {
        console.error(`✅✅✅ DEBUG MAPA CONSTRUIDO: attendanceMap.size=${attendanceMap.size}, attendances=${attendances.length}`);
        
      // CRÍTICO: Log detallado de TODAS las asistencias obtenidas de BD
      console.error(`🚨🚨🚨 DEBUG TODAS LAS ASISTENCIAS DE BD:`);
      console.error(`   patientIds esperados del grupo: [${patientIds.join(', ')}]`);
      attendances.forEach((att, idx) => {
        let attDate: string;
        if (att.attendanceDate instanceof Date) {
          attDate = att.attendanceDate.toISOString().split('T')[0];
        } else if (typeof att.attendanceDate === 'string') {
          const dateStr = att.attendanceDate as string;
          attDate = dateStr.includes('T') 
            ? dateStr.split('T')[0] 
            : dateStr;
        } else {
          attDate = String(att.attendanceDate);
        }
        const patientNumber = att.patient?.patientNumber || 'N/A';
        const patientName = att.patient ? `${att.patient.firstName} ${att.patient.lastName}` : 'N/A';
        console.error(`   [${idx}] patientId=${att.patientId}, patientNumber=${patientNumber}, name=${patientName}, date=${attDate}, status=${att.status}, attendanceId=${att.id}, weekId=${att.weekId || 'N/A'}`);
        
        // CRÍTICO: Verificar si el patientId está en la lista de patientIds esperados
        if (!patientIds.includes(att.patientId)) {
          console.error(`   ⚠️⚠️⚠️ ERROR CRÍTICO: patientId=${att.patientId} (${patientName}, ${patientNumber}) NO pertenece a este grupo!`);
          console.error(`   Esta asistencia debería ser FILTRADA`);
        }
      });
      }
      
      return attendanceMap;
    } catch (error) {
      this.logger.error(`Error getting all week attendances: ${error.message}`);
      return new Map();
    }
  }

  /**
   * Batch query: Obtiene todos los horarios de la semana en una sola consulta
   */
  private async getAllWeekSchedules(
    groupId: string,
    weekDates: Array<{ date: string; dayName: string }>
  ): Promise<Map<string, any[]>> {
    try {
      const dayNames = weekDates.map(d => d.dayName.toLowerCase());
      
      const schedules = await this.groupScheduleRepository
        .createQueryBuilder('schedule')
        .leftJoinAndSelect('schedule.activity', 'activity')
        .leftJoinAndSelect('schedule.subactivity', 'subactivity')
        .where('schedule.groupId = :groupId', { groupId })
        .andWhere('LOWER(schedule.dayOfWeek) IN (:...dayNames)', { dayNames })
        .orderBy('schedule.dayOfWeek', 'ASC')
        .addOrderBy('schedule.startTime', 'ASC')
        .getMany();

      // Agrupar por día de la semana
      const schedulesByDay = new Map<string, any[]>();
      schedules.forEach(schedule => {
        const dayKey = schedule.dayOfWeek.toLowerCase();
        if (!schedulesByDay.has(dayKey)) {
          schedulesByDay.set(dayKey, []);
        }
        schedulesByDay.get(dayKey)!.push(schedule);
      });

      this.logger.debug(`✅ Obtenidos ${schedules.length} horarios para ${dayNames.length} días (batch query)`);
      return schedulesByDay;
    } catch (error) {
      this.logger.error(`Error getting all week schedules: ${error.message}`);
      return new Map();
    }
  }

  /**
   * Procesa documentos en lotes para limitar concurrencia
   */
  private async processDocumentBatch(
    batch: Array<Promise<{ folderName: string; fileName: string; buffer: Buffer }>>,
    batchNumber: number,
    batchSize: number
  ): Promise<Array<{ folderName: string; fileName: string; buffer: Buffer }>> {
    this.logger.log(`⚡ Procesando lote ${batchNumber} (${batch.length} documentos)...`);
    const results = await Promise.allSettled(batch);
    
    const documents: Array<{ folderName: string; fileName: string; buffer: Buffer }> = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        documents.push(result.value);
      } else {
        this.logger.error(`❌ Error en documento ${index + 1} del lote ${batchNumber}: ${result.reason?.message || result.reason}`);
      }
    });
    
    this.logger.log(`✅ Lote ${batchNumber} completado: ${documents.length}/${batch.length} documentos generados exitosamente`);
    return documents;
  }
}
