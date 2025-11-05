/**
 * Servicio de Goal Tracking y Cumplimiento de Objetivos
 */

import { apiClient } from '../api-client';
import { API_ENDPOINTS } from '../api-config';
import type {
  GoalProgress,
  GoalComplianceReport,
  ProgressLevel,
} from '../types';

// ==================== DTOs ====================

export interface CreateGoalProgressDto {
  patientGoalId: string;
  assessmentDate: string; // Format: YYYY-MM-DD
  progressLevel: ProgressLevel;
  percentageComplete: number; // 0-100
  evidence?: string;
  notes?: string;
  assessedBy?: string;
}

export interface UpdateGoalProgressDto {
  assessmentDate?: string;
  progressLevel?: ProgressLevel;
  percentageComplete?: number;
  evidence?: string;
  notes?: string;
  assessedBy?: string;
}

export interface GoalValidationResult {
  isCompleted: boolean;
  currentLevel: ProgressLevel;
  percentageComplete: number;
  message: string;
}

// ==================== SERVICIO ====================

class GoalTrackingService {
  /**
   * POST /goal-tracking
   * Crear una nueva evaluación de progreso para un objetivo
   */
  async createProgressAssessment(data: CreateGoalProgressDto): Promise<GoalProgress> {
    return apiClient.post<GoalProgress>('/goal-tracking', data, true);
  }

  /**
   * PUT /goal-tracking/:id
   * Actualizar una evaluación de progreso existente
   */
  async updateProgressAssessment(
    progressId: string,
    data: UpdateGoalProgressDto
  ): Promise<GoalProgress> {
    return apiClient.put<GoalProgress>(`/goal-tracking/${progressId}`, data, true);
  }

  /**
   * GET /goal-tracking/goal/:goalId/history
   * Obtener el historial completo de progreso de un objetivo específico
   */
  async getGoalHistory(goalId: string): Promise<GoalProgress[]> {
    return apiClient.get<GoalProgress[]>(
      `/goal-tracking/goal/${goalId}/history`,
      true
    );
  }

  /**
   * GET /goal-tracking/patient/:patientId/compliance
   * Obtener el reporte de cumplimiento de objetivos de un paciente
   */
  async getPatientCompliance(patientId: string): Promise<GoalComplianceReport> {
    return apiClient.get<GoalComplianceReport>(
      `/goal-tracking/patient/${patientId}/compliance`,
      true
    );
  }

  /**
   * GET /goal-tracking/goal/:goalId/validation
   * Validar si un objetivo específico está cumplido
   */
  async validateGoalCompletion(goalId: string): Promise<GoalValidationResult> {
    return apiClient.get<GoalValidationResult>(
      `/goal-tracking/goal/${goalId}/validation`,
      true
    );
  }

  /**
   * GET /goal-tracking/patient/:patientId/assessments
   * Obtener todas las evaluaciones de progreso de un paciente
   */
  async getPatientAssessments(patientId: string): Promise<GoalProgress[]> {
    return apiClient.get<GoalProgress[]>(
      `/goal-tracking/patient/${patientId}/assessments`,
      true
    );
  }

  /**
   * DELETE /goal-tracking/:id
   * Eliminar una evaluación de progreso
   */
  async deleteProgressAssessment(progressId: string): Promise<void> {
    return apiClient.delete<void>(`/goal-tracking/${progressId}`, true);
  }

  /**
   * Utilidad: Convertir nivel de progreso a porcentaje sugerido
   */
  getPercentageSuggestion(level: ProgressLevel): number {
    const suggestions: Record<ProgressLevel, number> = {
      'Not Started': 0,
      'No Progress': 5,
      'Minimal Progress': 25,
      'Moderate Progress': 55,
      'Significant Progress': 85,
      'Achieved': 100,
      'Regression': 0,
    };
    return suggestions[level] || 0;
  }

  /**
   * Utilidad: Determinar nivel de progreso basado en porcentaje
   */
  getLevelFromPercentage(percentage: number): ProgressLevel {
    if (percentage === 0) return 'Not Started';
    if (percentage < 10) return 'No Progress';
    if (percentage < 40) return 'Minimal Progress';
    if (percentage < 70) return 'Moderate Progress';
    if (percentage < 100) return 'Significant Progress';
    return 'Achieved';
  }

  /**
   * Utilidad: Obtener color para visualización según nivel de progreso
   */
  getProgressColor(level: ProgressLevel): string {
    const colors: Record<ProgressLevel, string> = {
      'Not Started': '#6b7280', // gray
      'No Progress': '#ef4444', // red
      'Minimal Progress': '#f59e0b', // amber
      'Moderate Progress': '#3b82f6', // blue
      'Significant Progress': '#10b981', // green
      'Achieved': '#059669', // emerald
      'Regression': '#dc2626', // dark red
    };
    return colors[level] || '#6b7280';
  }

  /**
   * Utilidad: Obtener etiqueta en español para nivel de progreso
   */
  getProgressLabel(level: ProgressLevel): string {
    const labels: Record<ProgressLevel, string> = {
      'Not Started': 'No Iniciado',
      'No Progress': 'Sin Progreso',
      'Minimal Progress': 'Progreso Mínimo',
      'Moderate Progress': 'Progreso Moderado',
      'Significant Progress': 'Progreso Significativo',
      'Achieved': 'Logrado',
      'Regression': 'Regresión',
    };
    return labels[level] || level;
  }
}

// Exportar instancia única del servicio
export const goalTrackingService = new GoalTrackingService();
