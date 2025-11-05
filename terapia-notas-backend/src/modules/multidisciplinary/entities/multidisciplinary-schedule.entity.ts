import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { MtprSchedule } from '../../mtpr/entities/mtpr-schedule.entity';
import { GeneratedMultidisciplinaryNote } from './generated-multidisciplinary-note.entity';

/**
 * Entidad MultidisciplinarySchedule
 * RF-031: Programación de juntas multidisciplinarias
 * Se crea automáticamente junto con cada MTPR schedule
 */
@Entity('multidisciplinary_schedules')
export class MultidisciplinarySchedule {
  @PrimaryGeneratedColumn('uuid', { name: 'multidisciplinary_schedule_id' })
  id: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;

  @ManyToOne(() => MtprSchedule)
  @JoinColumn({ name: 'mtpr_schedule_id' })
  mtprSchedule?: MtprSchedule;

  @Column({ name: 'mtpr_schedule_id', type: 'uuid', nullable: true })
  mtprScheduleId?: string;

  @Column({ name: 'review_number', type: 'integer' })
  reviewNumber: number;

  @Column({ name: 'period_start_date', type: 'date' })
  periodStartDate: Date;

  @Column({ name: 'period_end_date', type: 'date' })
  periodEndDate: Date;

  @Column({ name: 'scheduled_date', type: 'date', nullable: true })
  scheduledDate?: Date;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ name: 'completed_date', type: 'date', nullable: true })
  completedDate?: Date;

  @OneToOne(() => GeneratedMultidisciplinaryNote, (note) => note.schedule)
  generatedNote?: GeneratedMultidisciplinaryNote;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
