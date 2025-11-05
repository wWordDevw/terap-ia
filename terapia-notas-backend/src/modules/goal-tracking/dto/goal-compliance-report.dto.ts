import { ProgressLevel } from '../../patients/entities/goal-progress.entity';

/**
 * Información detallada de un objetivo del paciente
 */
export interface GoalInfo {
  goalId: string;
  goalNumber: number;
  goalText: string;
  currentProgress: ProgressLevel;
  percentageComplete: number;
  lastAssessmentDate: Date | null;
  totalAssessments: number;
  hasRecentAssessment: boolean; // ¿Tiene evaluación en los últimos 30 días?
}

/**
 * DTO para el reporte de cumplimiento de objetivos de un paciente
 */
export class GoalComplianceReportDto {
  patientId: string;
  patientName: string;
  totalGoals: number;
  goalsAchieved: number;
  goalsInProgress: number;
  goalsNotStarted: number;
  goalsWithRegression: number;
  overallCompletionPercentage: number;
  lastReviewDate: Date | null;
  goals: GoalInfo[];
  recommendations: string[];
  needsAttention: boolean; // True si hay objetivos sin progreso o con regresión
}
