import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { GoalTrackingService } from './goal-tracking.service';
import { CreateGoalProgressDto } from './dto/create-goal-progress.dto';
import { UpdateGoalProgressDto } from './dto/update-goal-progress.dto';
import { GoalProgress } from '../patients/entities/goal-progress.entity';
import { GoalComplianceReportDto } from './dto/goal-compliance-report.dto';

/**
 * Controller para gestionar el tracking y cumplimiento de objetivos
 */
@Controller('goal-tracking')
export class GoalTrackingController {
  constructor(private readonly goalTrackingService: GoalTrackingService) {}

  /**
   * POST /goal-tracking
   * Crea una nueva evaluación de progreso para un objetivo
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProgressAssessment(
    @Body() createDto: CreateGoalProgressDto,
  ): Promise<GoalProgress> {
    return await this.goalTrackingService.assessGoalProgress(createDto);
  }

  /**
   * PUT /goal-tracking/:id
   * Actualiza una evaluación de progreso existente
   */
  @Put(':id')
  async updateProgressAssessment(
    @Param('id') id: string,
    @Body() updateDto: UpdateGoalProgressDto,
  ): Promise<GoalProgress> {
    return await this.goalTrackingService.updateGoalProgress(id, updateDto);
  }

  /**
   * GET /goal-tracking/goal/:goalId/history
   * Obtiene el historial completo de progreso de un objetivo específico
   */
  @Get('goal/:goalId/history')
  async getGoalHistory(@Param('goalId') goalId: string): Promise<GoalProgress[]> {
    return await this.goalTrackingService.getGoalProgressHistory(goalId);
  }

  /**
   * GET /goal-tracking/patient/:patientId/compliance
   * Obtiene el reporte de cumplimiento de objetivos de un paciente
   */
  @Get('patient/:patientId/compliance')
  async getPatientCompliance(
    @Param('patientId') patientId: string,
  ): Promise<GoalComplianceReportDto> {
    return await this.goalTrackingService.getPatientGoalsComplianceReport(patientId);
  }

  /**
   * GET /goal-tracking/goal/:goalId/validation
   * Valida si un objetivo específico está cumplido
   */
  @Get('goal/:goalId/validation')
  async validateGoalCompletion(@Param('goalId') goalId: string): Promise<{
    isCompleted: boolean;
    currentLevel: string;
    percentageComplete: number;
    message: string;
  }> {
    return await this.goalTrackingService.validateGoalCompletion(goalId);
  }

  /**
   * GET /goal-tracking/patient/:patientId/assessments
   * Obtiene todas las evaluaciones de progreso de un paciente
   */
  @Get('patient/:patientId/assessments')
  async getPatientAssessments(
    @Param('patientId') patientId: string,
  ): Promise<GoalProgress[]> {
    return await this.goalTrackingService.getPatientAllProgressAssessments(patientId);
  }

  /**
   * DELETE /goal-tracking/:id
   * Elimina una evaluación de progreso
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProgressAssessment(@Param('id') id: string): Promise<void> {
    return await this.goalTrackingService.deleteGoalProgress(id);
  }
}
