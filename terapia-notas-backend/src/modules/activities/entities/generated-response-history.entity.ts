import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { Activity } from './activity.entity';

/**
 * Entidad GeneratedResponseHistory
 * Evita repetición de respuestas al tratamiento - RF-035
 */
@Entity('generated_responses_history')
export class GeneratedResponseHistory {
  @PrimaryGeneratedColumn('uuid', { name: 'response_id' })
  id: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;

  @Column({ name: 'response_text', type: 'text' })
  responseText: string;

  @Column({ name: 'response_hash', type: 'varchar', length: 64 })
  responseHash: string;

  @ManyToOne(() => Activity, { nullable: true })
  @JoinColumn({ name: 'activity_id' })
  activity?: Activity;

  @Column({ name: 'activity_id', type: 'uuid', nullable: true })
  activityId?: string;

  @Column({ name: 'goal_number', type: 'integer', nullable: true })
  goalNumber?: number;

  @Column({ name: 'used_date', type: 'date' })
  usedDate: Date;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
