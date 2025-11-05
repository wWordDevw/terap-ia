import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Check } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PatientGoal } from './patient-goal.entity';

/**
 * Niveles de progreso para los objetivos del paciente
 */
export enum ProgressLevel {
  NOT_STARTED = 'Not Started',
  NO_PROGRESS = 'No Progress',
  MINIMAL_PROGRESS = 'Minimal Progress',
  MODERATE_PROGRESS = 'Moderate Progress',
  SIGNIFICANT_PROGRESS = 'Significant Progress',
  ACHIEVED = 'Achieved',
  REGRESSION = 'Regression',
}

/**
 * Entidad GoalProgress - Tracking de progreso de objetivos
 * Permite registrar evaluaciones periódicas del progreso hacia cada objetivo del paciente
 */
@Entity('goal_progress')
@Check('"percentage_complete" >= 0 AND "percentage_complete" <= 100')
export class GoalProgress extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'progress_id' })
  id: string;

  @Column({ name: 'assessment_date', type: 'date' })
  assessmentDate: Date;

  @Column({
    name: 'progress_level',
    type: 'varchar',
    length: 50,
    default: ProgressLevel.NOT_STARTED,
  })
  progressLevel: ProgressLevel;

  @Column({ name: 'percentage_complete', type: 'int', default: 0 })
  percentageComplete: number; // 0-100

  @Column({ name: 'evidence', type: 'text', nullable: true })
  evidence: string; // Evidencia del progreso (respuestas de clientes, comportamientos observados, etc.)

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string; // Notas adicionales del terapeuta

  @Column({ name: 'assessed_by', type: 'varchar', length: 255, nullable: true })
  assessedBy: string; // Nombre o ID del terapeuta que realizó la evaluación

  // Relaciones
  @ManyToOne(() => PatientGoal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_goal_id' })
  patientGoal: PatientGoal;

  @Column({ name: 'patient_goal_id', type: 'uuid' })
  patientGoalId: string;
}
