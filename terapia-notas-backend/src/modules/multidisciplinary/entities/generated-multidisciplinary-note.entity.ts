import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { MultidisciplinarySchedule } from './multidisciplinary-schedule.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Entidad GeneratedMultidisciplinaryNote
 * RF-031 a RF-033: Nota de junta multidisciplinaria generada
 */
@Entity('generated_multidisciplinary_notes')
export class GeneratedMultidisciplinaryNote {
  @PrimaryGeneratedColumn('uuid', { name: 'note_id' })
  id: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;

  @OneToOne(() => MultidisciplinarySchedule)
  @JoinColumn({ name: 'multidisciplinary_schedule_id' })
  schedule: MultidisciplinarySchedule;

  @Column({ name: 'multidisciplinary_schedule_id', type: 'uuid' })
  scheduleId: string;

  @Column({ name: 'meeting_date', type: 'date' })
  meetingDate: Date;

  @Column({ name: 'review_number', type: 'integer' })
  reviewNumber: number;

  // Participantes de la junta (JSON array)
  @Column({ name: 'participants', type: 'jsonb' })
  participants: Array<{
    name: string;
    role: string;
    signature?: string;
  }>;

  // Case Summary
  @Column({ name: 'case_summary', type: 'text' })
  caseSummary: string;

  // Team Discussion
  @Column({ name: 'team_discussion', type: 'text' })
  teamDiscussion: string;

  // Current Status
  @Column({ name: 'current_status', type: 'text' })
  currentStatus: string;

  // Recommendations
  @Column({ name: 'recommendations', type: 'text' })
  recommendations: string;

  // Action Plan
  @Column({ name: 'action_plan', type: 'text' })
  actionPlan: string;

  // Follow-up Plan
  @Column({ name: 'follow_up_plan', type: 'text', nullable: true })
  followUpPlan?: string;

  // Next Meeting Date
  @Column({ name: 'next_meeting_date', type: 'date', nullable: true })
  nextMeetingDate?: Date;

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
