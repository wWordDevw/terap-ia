import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoalProgress, ProgressLevel } from '../patients/entities/goal-progress.entity';
import { PatientGoal } from '../patients/entities/patient-goal.entity';
import { Patient } from '../patients/entities/patient.entity';
import { CreateGoalProgressDto } from './dto/create-goal-progress.dto';
import { UpdateGoalProgressDto } from './dto/update-goal-progress.dto';
import { GoalComplianceReportDto, GoalInfo } from './dto/goal-compliance-report.dto';

/**
 * Servicio para gestionar el tracking y cumplimiento de objetivos del paciente
 */
@Injectable()
export class GoalTrackingService {
  constructor(
    @InjectRepository(GoalProgress)
    private goalProgressRepository: Repository<GoalProgress>,
    @InjectRepository(PatientGoal)
    private patientGoalRepository: Repository<PatientGoal>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  /**
   * Crea una nueva evaluación de progreso para un objetivo
   */
  async assessGoalProgress(createDto: CreateGoalProgressDto): Promise<GoalProgress> {
    // Verificar que el objetivo existe
    const patientGoal = await this.patientGoalRepository.findOne({
      where: { id: createDto.patientGoalId },
    });

    if (!patientGoal) {
      throw new NotFoundException(
        `Objetivo con ID ${createDto.patientGoalId} no encontrado`,
      );
    }

    // Validar que el percentage_complete sea coherente con el progress_level
    this.validateProgressCoherence(createDto.progressLevel, createDto.percentageComplete);

    // Crear la evaluación de progreso
    const goalProgress = this.goalProgressRepository.create({
      patientGoalId: createDto.patientGoalId,
      assessmentDate: new Date(createDto.assessmentDate),
      progressLevel: createDto.progressLevel,
      percentageComplete: createDto.percentageComplete,
      evidence: createDto.evidence,
      notes: createDto.notes,
      assessedBy: createDto.assessedBy,
    });

    return await this.goalProgressRepository.save(goalProgress);
  }

  /**
   * Actualiza una evaluación de progreso existente
   */
  async updateGoalProgress(
    progressId: string,
    updateDto: UpdateGoalProgressDto,
  ): Promise<GoalProgress> {
    const goalProgress = await this.goalProgressRepository.findOne({
      where: { id: progressId },
    });

    if (!goalProgress) {
      throw new NotFoundException(
        `Evaluación de progreso con ID ${progressId} no encontrada`,
      );
    }

    // Si se actualiza el nivel o porcentaje, validar coherencia
    const newLevel = updateDto.progressLevel || goalProgress.progressLevel;
    const newPercentage = updateDto.percentageComplete !== undefined
      ? updateDto.percentageComplete
      : goalProgress.percentageComplete;

    this.validateProgressCoherence(newLevel, newPercentage);

    // Actualizar campos
    Object.assign(goalProgress, {
      ...(updateDto.assessmentDate && { assessmentDate: new Date(updateDto.assessmentDate) }),
      ...(updateDto.progressLevel && { progressLevel: updateDto.progressLevel }),
      ...(updateDto.percentageComplete !== undefined && { percentageComplete: updateDto.percentageComplete }),
      ...(updateDto.evidence !== undefined && { evidence: updateDto.evidence }),
      ...(updateDto.notes !== undefined && { notes: updateDto.notes }),
      ...(updateDto.assessedBy && { assessedBy: updateDto.assessedBy }),
    });

    return await this.goalProgressRepository.save(goalProgress);
  }

  /**
   * Obtiene el historial de progreso de un objetivo específico
   */
  async getGoalProgressHistory(patientGoalId: string): Promise<GoalProgress[]> {
    const patientGoal = await this.patientGoalRepository.findOne({
      where: { id: patientGoalId },
    });

    if (!patientGoal) {
      throw new NotFoundException(`Objetivo con ID ${patientGoalId} no encontrado`);
    }

    return await this.goalProgressRepository.find({
      where: { patientGoalId },
      order: { assessmentDate: 'DESC' },
    });
  }

  /**
   * Obtiene el reporte de cumplimiento de objetivos de un paciente
   */
  async getPatientGoalsComplianceReport(patientId: string): Promise<GoalComplianceReportDto> {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
      relations: ['goals'],
    });

    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${patientId} no encontrado`);
    }

    const goals = patient.goals;

    if (goals.length === 0) {
      throw new BadRequestException(
        'El paciente no tiene objetivos configurados',
      );
    }

    // Obtener información detallada de cada objetivo
    const goalsInfo: GoalInfo[] = await Promise.all(
      goals.map(async (goal) => {
        const progressHistory = await this.goalProgressRepository.find({
          where: { patientGoalId: goal.id },
          order: { assessmentDate: 'DESC' },
        });

        const latestProgress = progressHistory[0] || null;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const hasRecentAssessment = latestProgress
          ? new Date(latestProgress.assessmentDate) >= thirtyDaysAgo
          : false;

        return {
          goalId: goal.id,
          goalNumber: goal.goalNumber,
          goalText: goal.goalText,
          currentProgress: latestProgress?.progressLevel || ProgressLevel.NOT_STARTED,
          percentageComplete: latestProgress?.percentageComplete || 0,
          lastAssessmentDate: latestProgress?.assessmentDate || null,
          totalAssessments: progressHistory.length,
          hasRecentAssessment,
        };
      }),
    );

    // Calcular estadísticas
    const goalsAchieved = goalsInfo.filter(
      (g) => g.currentProgress === ProgressLevel.ACHIEVED,
    ).length;

    const goalsInProgress = goalsInfo.filter(
      (g) => [
        ProgressLevel.MINIMAL_PROGRESS,
        ProgressLevel.MODERATE_PROGRESS,
        ProgressLevel.SIGNIFICANT_PROGRESS,
      ].includes(g.currentProgress),
    ).length;

    const goalsNotStarted = goalsInfo.filter(
      (g) => [ProgressLevel.NOT_STARTED, ProgressLevel.NO_PROGRESS].includes(g.currentProgress),
    ).length;

    const goalsWithRegression = goalsInfo.filter(
      (g) => g.currentProgress === ProgressLevel.REGRESSION,
    ).length;

    const overallCompletionPercentage = Math.round(
      goalsInfo.reduce((sum, g) => sum + g.percentageComplete, 0) / goals.length,
    );

    // Determinar la fecha de última revisión (la más reciente de todos los goals)
    const allAssessmentDates = goalsInfo
      .map((g) => g.lastAssessmentDate)
      .filter((d) => d !== null)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const lastReviewDate = allAssessmentDates[0] || null;

    // Generar recomendaciones
    const recommendations = this.generateRecommendations(goalsInfo);

    // Determinar si necesita atención
    const needsAttention = goalsWithRegression > 0 ||
      goalsInfo.some((g) => !g.hasRecentAssessment) ||
      goalsNotStarted === goals.length;

    return {
      patientId,
      patientName: `${patient.firstName} ${patient.lastName}`,
      totalGoals: goals.length,
      goalsAchieved,
      goalsInProgress,
      goalsNotStarted,
      goalsWithRegression,
      overallCompletionPercentage,
      lastReviewDate,
      goals: goalsInfo,
      recommendations,
      needsAttention,
    };
  }

  /**
   * Valida si un objetivo específico está cumplido
   */
  async validateGoalCompletion(patientGoalId: string): Promise<{
    isCompleted: boolean;
    currentLevel: ProgressLevel;
    percentageComplete: number;
    message: string;
  }> {
    const progressHistory = await this.goalProgressRepository.find({
      where: { patientGoalId },
      order: { assessmentDate: 'DESC' },
      take: 1,
    });

    if (progressHistory.length === 0) {
      return {
        isCompleted: false,
        currentLevel: ProgressLevel.NOT_STARTED,
        percentageComplete: 0,
        message: 'El objetivo no tiene evaluaciones registradas',
      };
    }

    const latestProgress = progressHistory[0];
    const isCompleted = latestProgress.progressLevel === ProgressLevel.ACHIEVED;

    return {
      isCompleted,
      currentLevel: latestProgress.progressLevel,
      percentageComplete: latestProgress.percentageComplete,
      message: isCompleted
        ? 'El objetivo ha sido completado'
        : `El objetivo está en nivel: ${latestProgress.progressLevel} (${latestProgress.percentageComplete}%)`,
    };
  }

  /**
   * Obtiene todas las evaluaciones de progreso de un paciente
   */
  async getPatientAllProgressAssessments(patientId: string): Promise<GoalProgress[]> {
    const patient = await this.patientRepository.findOne({
      where: { id: patientId },
      relations: ['goals'],
    });

    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${patientId} no encontrado`);
    }

    const goalIds = patient.goals.map((g) => g.id);

    if (goalIds.length === 0) {
      return [];
    }

    return await this.goalProgressRepository
      .createQueryBuilder('gp')
      .where('gp.patient_goal_id IN (:...goalIds)', { goalIds })
      .leftJoinAndSelect('gp.patientGoal', 'goal')
      .orderBy('gp.assessment_date', 'DESC')
      .getMany();
  }

  /**
   * Elimina una evaluación de progreso
   */
  async deleteGoalProgress(progressId: string): Promise<void> {
    const result = await this.goalProgressRepository.delete(progressId);

    if (result.affected === 0) {
      throw new NotFoundException(
        `Evaluación de progreso con ID ${progressId} no encontrada`,
      );
    }
  }

  /**
   * Valida que el porcentaje de completitud sea coherente con el nivel de progreso
   */
  private validateProgressCoherence(level: ProgressLevel, percentage: number): void {
    const validationRules = {
      [ProgressLevel.NOT_STARTED]: { min: 0, max: 0 },
      [ProgressLevel.NO_PROGRESS]: { min: 0, max: 10 },
      [ProgressLevel.MINIMAL_PROGRESS]: { min: 10, max: 40 },
      [ProgressLevel.MODERATE_PROGRESS]: { min: 40, max: 70 },
      [ProgressLevel.SIGNIFICANT_PROGRESS]: { min: 70, max: 99 },
      [ProgressLevel.ACHIEVED]: { min: 100, max: 100 },
      [ProgressLevel.REGRESSION]: { min: 0, max: 100 }, // Puede ser cualquier valor
    };

    const rule = validationRules[level];
    if (percentage < rule.min || percentage > rule.max) {
      throw new BadRequestException(
        `El porcentaje ${percentage}% no es coherente con el nivel "${level}". ` +
        `Rango esperado: ${rule.min}-${rule.max}%`,
      );
    }
  }

  /**
   * Genera recomendaciones basadas en el estado de los objetivos
   */
  private generateRecommendations(goalsInfo: GoalInfo[]): string[] {
    const recommendations: string[] = [];

    // Objetivos sin evaluaciones recientes
    const goalsWithoutRecentAssessment = goalsInfo.filter((g) => !g.hasRecentAssessment);
    if (goalsWithoutRecentAssessment.length > 0) {
      recommendations.push(
        `${goalsWithoutRecentAssessment.length} objetivo(s) no han sido evaluados en los últimos 30 días. ` +
        `Se recomienda realizar una evaluación actualizada.`,
      );
    }

    // Objetivos con regresión
    const goalsWithRegression = goalsInfo.filter(
      (g) => g.currentProgress === ProgressLevel.REGRESSION,
    );
    if (goalsWithRegression.length > 0) {
      recommendations.push(
        `${goalsWithRegression.length} objetivo(s) muestran regresión. ` +
        `Se requiere atención inmediata y ajuste del plan de tratamiento.`,
      );
    }

    // Objetivos sin progreso
    const goalsWithNoProgress = goalsInfo.filter(
      (g) => g.currentProgress === ProgressLevel.NO_PROGRESS && g.totalAssessments >= 2,
    );
    if (goalsWithNoProgress.length > 0) {
      recommendations.push(
        `${goalsWithNoProgress.length} objetivo(s) no muestran progreso después de múltiples evaluaciones. ` +
        `Considerar modificar las intervenciones o replantear el objetivo.`,
      );
    }

    // Objetivos sin iniciar
    const goalsNotStarted = goalsInfo.filter(
      (g) => g.currentProgress === ProgressLevel.NOT_STARTED && g.totalAssessments === 0,
    );
    if (goalsNotStarted.length > 0) {
      recommendations.push(
        `${goalsNotStarted.length} objetivo(s) no han sido evaluados aún. ` +
        `Se recomienda iniciar el seguimiento lo antes posible.`,
      );
    }

    // Todo bien
    if (recommendations.length === 0) {
      recommendations.push(
        'Todos los objetivos están siendo monitoreados adecuadamente. Continuar con el plan actual.',
      );
    }

    return recommendations;
  }
}
