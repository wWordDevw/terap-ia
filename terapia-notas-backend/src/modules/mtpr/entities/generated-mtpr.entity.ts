import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { MtprSchedule } from './mtpr-schedule.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Entidad GeneratedMtpr
 * RF-018 a RF-027: Documento MTPR generado
 * Almacena la información del MTPR generado
 */
@Entity('generated_mtprs')
export class GeneratedMtpr {
  @PrimaryGeneratedColumn('uuid', { name: 'mtpr_id' })
  id: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;

  @OneToOne(() => MtprSchedule)
  @JoinColumn({ name: 'mtpr_schedule_id' })
  schedule: MtprSchedule;

  @Column({ name: 'mtpr_schedule_id', type: 'uuid' })
  scheduleId: string;

  @Column({ name: 'review_number', type: 'integer' })
  reviewNumber: number;

  @Column({ name: 'review_date', type: 'date' })
  reviewDate: Date;

  @Column({ name: 'period_start_date', type: 'date' })
  periodStartDate: Date;

  @Column({ name: 'period_end_date', type: 'date' })
  periodEndDate: Date;

  // Mental Status
  @Column({ name: 'mental_status', type: 'text' })
  mentalStatus: string;

  // Current Medications
  @Column({ name: 'current_medications', type: 'jsonb', nullable: true })
  currentMedications?: Record<string, any>;

  // Treatment Interventions
  @Column({ name: 'treatment_interventions', type: 'text' })
  treatmentInterventions: string;

  // Progress on Goals (4 goals)
  @Column({ name: 'goal1_progress', type: 'text' })
  goal1Progress: string;

  @Column({ name: 'goal2_progress', type: 'text' })
  goal2Progress: string;

  @Column({ name: 'goal3_progress', type: 'text' })
  goal3Progress: string;

  @Column({ name: 'goal4_progress', type: 'text' })
  goal4Progress: string;

  // Barriers to Treatment
  @Column({ name: 'barriers', type: 'text', nullable: true })
  barriers?: string;

  // Plan for Next 90 Days
  @Column({ name: 'plan_next_period', type: 'text' })
  planNextPeriod: string;

  // Discharge Planning
  @Column({ name: 'discharge_planning', type: 'text', nullable: true })
  dischargePlanning?: string;

  // Attendance Summary
  @Column({ name: 'attendance_percentage', type: 'decimal', precision: 5, scale: 2 })
  attendancePercentage: number;

  @Column({ name: 'total_days_attended', type: 'integer' })
  totalDaysAttended: number;

  @Column({ name: 'total_days_scheduled', type: 'integer' })
  totalDaysScheduled: number;

  // File Information
  @Column({ name: 'file_name', type: 'varchar', nullable: true })
  fileName?: string;

  @Column({ name: 'file_path', type: 'varchar', nullable: true })
  filePath?: string;

  // Who generated it
  @ManyToOne(() => User)
  @JoinColumn({ name: 'generated_by' })
  generatedBy?: User;

  @Column({ name: 'generated_by', type: 'uuid', nullable: true })
  generatedById?: string;

  @Column({ name: 'is_locked', type: 'boolean', default: false })
  isLocked: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
