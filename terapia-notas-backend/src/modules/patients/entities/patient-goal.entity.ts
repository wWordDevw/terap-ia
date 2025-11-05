import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique, Check } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Patient } from './patient.entity';

/**
 * Entidad PatientGoal - RF-004: Metas (Goals) - 4 goals
 * Representa las metas del paciente (máximo 4)
 */
@Entity('patient_goals')
@Unique(['patientId', 'goalNumber'])
@Check('"goal_number" >= 1 AND "goal_number" <= 4')
export class PatientGoal extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'goal_id' })
  id: string;

  @Column({ name: 'goal_number', type: 'int' })
  goalNumber: number; // 1, 2, 3 o 4

  @Column({ name: 'goal_text', type: 'text' })
  goalText: string;

  // Relaciones
  @ManyToOne(() => Patient, (patient) => patient.goals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;
}
