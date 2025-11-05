import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { MtprSchedule } from './entities/mtpr-schedule.entity';
import { GeneratedMtpr } from './entities/generated-mtpr.entity';
import { GenerateMtprDto } from './dto/generate-mtpr.dto';
import { Patient } from '../patients/entities/patient.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { PatientGoal } from '../patients/entities/patient-goal.entity';
import { WordMtprTemplateService } from './templates/word-mtpr-template.service';
import { GoalTrackingService } from '../goal-tracking/goal-tracking.service';

/**
 * Servicio de MTPR (Master Treatment Plan Review)
 * RF-018 a RF-027: Gestión y generación de MTRPs
 */
@Injectable()
export class MtprService {
  constructor(
    @InjectRepository(MtprSchedule)
    private readonly scheduleRepository: Repository<MtprSchedule>,
    @InjectRepository(GeneratedMtpr)
    private readonly mtprRepository: Repository<GeneratedMtpr>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(PatientGoal)
    private readonly goalRepository: Repository<PatientGoal>,
    private readonly wordMtprTemplateService: WordMtprTemplateService,
    private readonly goalTrackingService: GoalTrackingService,
  ) {}

  /**
   * Genera un MTPR para un schedule específico
   * RF-018 a RF-027
   */
  async generateMtpr(
    scheduleId: string,
    generateMtprDto: GenerateMtprDto,
    userId?: string,
  ): Promise<GeneratedMtpr> {
    // 1. Validar que el schedule existe
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['patient'],
    });

    if (!schedule) {
      throw new NotFoundException(`MTPR schedule con ID ${scheduleId} no encontrado`);
    }

    if (schedule.isCompleted) {
      throw new BadRequestException('Este MTPR ya ha sido completado');
    }

    // 2. Validar que han pasado al menos 10 días desde admisión (RF-018)
    const daysSinceAdmission = this.calculateDaysBetween(
      schedule.patient.admissionDate,
      new Date(),
    );

    if (daysSinceAdmission < 10) {
      throw new BadRequestException(
        `No se puede generar MTPR. Deben pasar al menos 10 días desde la admisión. Días transcurridos: ${daysSinceAdmission}`,
      );
    }

    // 3. Calcular período del MTPR (desde último MTPR o admisión)
    const periodDates = await this.calculateMtprPeriod(schedule);

    // 4. Validar asistencia >= 50% (RF-018)
    const attendanceStats = await this.calculateAttendanceStats(
      schedule.patientId,
      periodDates.startDate,
      periodDates.endDate,
    );

    if (attendanceStats.percentage < 50) {
      throw new BadRequestException(
        `No se puede generar MTPR. La asistencia debe ser >= 50%. Asistencia actual: ${attendanceStats.percentage.toFixed(2)}%`,
      );
    }

    // 5. Obtener goals del paciente
    const goals = await this.goalRepository.find({
      where: { patientId: schedule.patientId },
      order: { goalNumber: 'ASC' },
    });

    if (goals.length < 4) {
      throw new BadRequestException(
        'El paciente debe tener 4 goals configurados para generar el MTPR',
      );
    }

    // 6. Validar cumplimiento de objetivos (advertencia, no bloquea)
    const goalsCompliance = await this.validateGoalsProgress(schedule.patientId);
    if (goalsCompliance.needsAttention) {
      console.warn(
        `[MTPR ${schedule.reviewNumber}] Advertencia - Objetivos requieren atención:`,
        goalsCompliance.warnings,
      );
    }

    // 7. Crear el MTPR
    const mtpr = this.mtprRepository.create({
      patientId: schedule.patientId,
      scheduleId: schedule.id,
      reviewNumber: schedule.reviewNumber,
      reviewDate: new Date(),
      periodStartDate: periodDates.startDate,
      periodEndDate: periodDates.endDate,
      mentalStatus: generateMtprDto.mentalStatus,
      currentMedications: generateMtprDto.currentMedications,
      treatmentInterventions: generateMtprDto.treatmentInterventions,
      goal1Progress: generateMtprDto.goal1Progress,
      goal2Progress: generateMtprDto.goal2Progress,
      goal3Progress: generateMtprDto.goal3Progress,
      goal4Progress: generateMtprDto.goal4Progress,
      barriers: generateMtprDto.barriers,
      planNextPeriod: generateMtprDto.planNextPeriod,
      dischargePlanning: generateMtprDto.dischargePlanning,
      attendancePercentage: attendanceStats.percentage,
      totalDaysAttended: attendanceStats.daysAttended,
      totalDaysScheduled: attendanceStats.daysScheduled,
      generatedById: userId,
    });

    const savedMtpr = await this.mtprRepository.save(mtpr);

    // 8. Generar documento Word
    try {
      const mtprWithRelations = await this.mtprRepository.findOne({
        where: { id: savedMtpr.id },
        relations: ['patient', 'schedule'],
      });

      if (mtprWithRelations) {
        // Cargar goals para el template
        const goalsForTemplate = await this.goalRepository.find({
          where: { patientId: schedule.patientId },
          order: { goalNumber: 'ASC' },
        });

        const buffer = await this.wordMtprTemplateService.generateMtpr(
          mtprWithRelations,
          goalsForTemplate,
        );
        const fileName = this.wordMtprTemplateService.generateFileName(
          schedule.patientId,
          schedule.reviewNumber,
        );
        const filePath = await this.wordMtprTemplateService.saveDocument(buffer, fileName);

        savedMtpr.fileName = fileName;
        savedMtpr.filePath = filePath;
        await this.mtprRepository.save(savedMtpr);
      }
    } catch (error) {
      console.error('Error generando documento Word del MTPR:', error);
    }

    // 9. Marcar schedule como completado
    schedule.isCompleted = true;
    schedule.completedDate = new Date();
    await this.scheduleRepository.save(schedule);

    return savedMtpr;
  }

  /**
   * Calcula el período del MTPR (desde último MTPR o desde admisión)
   */
  private async calculateMtprPeriod(schedule: MtprSchedule): Promise<{
    startDate: Date;
    endDate: Date;
  }> {
    let startDate: Date;
    const endDate = new Date();

    if (schedule.reviewNumber === 1) {
      // Primer MTPR: desde admisión
      startDate = schedule.patient.admissionDate;
    } else {
      // MTPR subsecuente: desde la fecha del MTPR anterior
      const previousMtpr = await this.mtprRepository.findOne({
        where: {
          patientId: schedule.patientId,
          reviewNumber: schedule.reviewNumber - 1,
        },
        order: { reviewDate: 'DESC' },
      });

      if (previousMtpr) {
        startDate = previousMtpr.reviewDate;
      } else {
        // Si no se encuentra el anterior, usar admisión
        startDate = schedule.patient.admissionDate;
      }
    }

    return { startDate, endDate };
  }

  /**
   * Calcula las estadísticas de asistencia para un período
   * RF-018: Debe ser >= 50% para poder generar MTPR
   */
  private async calculateAttendanceStats(
    patientId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<{
    percentage: number;
    daysAttended: number;
    daysScheduled: number;
  }> {
    // Obtener todos los registros de asistencia en el período
    const attendance = await this.attendanceRepository.find({
      where: {
        patientId,
        attendanceDate: Between(startDate, endDate),
      },
    });

    let daysAttended = 0;
    const daysScheduled = attendance.length;

    attendance.forEach((record) => {
      // Contar como "attended" si status es P (Present)
      if (record.status === 'P') {
        daysAttended++;
      }
    });

    const percentage = daysScheduled > 0 ? (daysAttended / daysScheduled) * 100 : 0;

    return {
      percentage,
      daysAttended,
      daysScheduled,
    };
  }

  /**
   * Calcula días entre dos fechas
   */
  private calculateDaysBetween(startDate: Date, endDate: Date): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Obtiene todos los MTRPs de un paciente
   */
  async findByPatient(patientId: string): Promise<GeneratedMtpr[]> {
    return await this.mtprRepository.find({
      where: { patientId },
      relations: ['patient', 'schedule'],
      order: { reviewDate: 'DESC' },
    });
  }

  /**
   * Obtiene un MTPR por ID
   */
  async findOne(id: string): Promise<GeneratedMtpr> {
    const mtpr = await this.mtprRepository.findOne({
      where: { id },
      relations: ['patient', 'schedule', 'generatedBy'],
    });

    if (!mtpr) {
      throw new NotFoundException(`MTPR con ID ${id} no encontrado`);
    }

    return mtpr;
  }

  /**
   * Obtiene todos los schedules de un paciente
   */
  async getSchedulesByPatient(patientId: string): Promise<MtprSchedule[]> {
    return await this.scheduleRepository.find({
      where: { patientId },
      relations: ['patient', 'generatedMtpr'],
      order: { scheduledDate: 'ASC' },
    });
  }

  /**
   * Obtiene un schedule por ID
   */
  async getSchedule(scheduleId: string): Promise<MtprSchedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['patient', 'generatedMtpr'],
    });

    if (!schedule) {
      throw new NotFoundException(`MTPR schedule con ID ${scheduleId} no encontrado`);
    }

    return schedule;
  }

  /**
   * Valida el progreso de los objetivos del paciente
   * Retorna advertencias si algún objetivo requiere atención
   */
  private async validateGoalsProgress(patientId: string): Promise<{
    needsAttention: boolean;
    warnings: string[];
    complianceReport: any;
  }> {
    try {
      const complianceReport = await this.goalTrackingService.getPatientGoalsComplianceReport(patientId);

      const warnings: string[] = [];

      // Objetivos sin evaluaciones recientes
      const goalsWithoutRecentAssessment = complianceReport.goals.filter(
        (g) => !g.hasRecentAssessment,
      );
      if (goalsWithoutRecentAssessment.length > 0) {
        warnings.push(
          `${goalsWithoutRecentAssessment.length} objetivo(s) sin evaluación en los últimos 30 días`,
        );
      }

      // Objetivos con regresión
      if (complianceReport.goalsWithRegression > 0) {
        warnings.push(
          `${complianceReport.goalsWithRegression} objetivo(s) con regresión`,
        );
      }

      // Objetivos sin iniciar
      if (complianceReport.goalsNotStarted === complianceReport.totalGoals) {
        warnings.push('Ningún objetivo ha sido evaluado aún');
      }

      return {
        needsAttention: complianceReport.needsAttention,
        warnings,
        complianceReport,
      };
    } catch (error) {
      // Si no hay evaluaciones de objetivos, es una advertencia pero no un error bloqueante
      console.warn('No se pudo validar el cumplimiento de objetivos:', error.message);
      return {
        needsAttention: true,
        warnings: ['No se encontraron evaluaciones de progreso de objetivos'],
        complianceReport: null,
      };
    }
  }
}
