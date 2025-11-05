import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { GeneratedMtpr } from './generated-mtpr.entity';

/**
 * Entidad MtprSchedule
 * RF-018: Programación de MTRPs (Master Treatment Plan Review)
 * Se crea automáticamente al crear un paciente (cada 90 días)
 */
@Entity('mtpr_schedules')
export class MtprSchedule {
  @PrimaryGeneratedColumn('uuid', { name: 'mtpr_schedule_id' })
  id: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;

  @Column({ name: 'review_number', type: 'integer' })
  reviewNumber: number;

  @Column({ name: 'scheduled_date', type: 'date' })
  scheduledDate: Date;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ name: 'completed_date', type: 'date', nullable: true })
  completedDate?: Date;

  @OneToOne(() => GeneratedMtpr, (mtpr) => mtpr.schedule)
  generatedMtpr?: GeneratedMtpr;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
