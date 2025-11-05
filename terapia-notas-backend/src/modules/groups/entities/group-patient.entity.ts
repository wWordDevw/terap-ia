import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Group } from './group.entity';
import { Patient } from '../../patients/entities/patient.entity';

/**
 * Entidad GroupPatient
 * Relación muchos a muchos entre grupos y pacientes
 * Nota: No extiende de BaseEntity porque solo tiene created_at (no updated_at)
 */
@Entity('group_patients')
@Unique(['groupId', 'patientId'])
export class GroupPatient {
  @PrimaryGeneratedColumn('uuid', { name: 'group_patient_id' })
  id: string;

  @Column({ name: 'joined_date', type: 'date' })
  joinedDate: Date;

  @Column({ name: 'left_date', type: 'date', nullable: true })
  leftDate?: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => Group, (group) => group.groupPatients)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ name: 'group_id', type: 'uuid' })
  groupId: string;

  @ManyToOne(() => Patient, (patient) => patient.groupPatients)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;
}
