import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Clinic } from '../../clinics/entities/clinic.entity';
import { User } from '../../users/entities/user.entity';
import { PatientGoal } from './patient-goal.entity';
import { PatientDiagnosis } from './patient-diagnosis.entity';
import { PatientDocument } from './patient-document.entity';
import { PatientNote } from './patient-note.entity';
import { GroupPatient } from '../../groups/entities/group-patient.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';

/**
 * Entidad Patient - RF-004: Crear Perfil de Paciente
 * Representa los pacientes del sistema
 */
@Entity('patients')
export class Patient extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'patient_id' })
  id: string;

  @Column({
    name: 'patient_number',
    type: 'varchar',
    length: 50,
    unique: true,
  })
  patientNumber: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @Column({ name: 'admission_date', type: 'date' })
  admissionDate: Date;

  @Column({ name: 'discharge_date', type: 'date', nullable: true })
  dischargeDate?: Date;

  @Column({ name: 'cancellation_date', type: 'date', nullable: true })
  cancellationDate?: Date;

  @Column({ name: 'insurance', type: 'varchar', length: 100, nullable: true })
  insurance?: string;

  @Column({ name: 'additional_notes', type: 'text', nullable: true })
  additionalNotes?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relaciones
  @ManyToOne(() => Clinic, (clinic) => clinic.patients)
  @JoinColumn({ name: 'clinic_id' })
  clinic: Clinic;

  @Column({ name: 'clinic_id', type: 'uuid' })
  clinicId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'created_by', type: 'uuid', nullable: true, select: false })
  createdById?: string;

  @OneToMany(() => PatientGoal, (goal) => goal.patient, { cascade: true })
  goals: PatientGoal[];

  @OneToMany(() => PatientDiagnosis, (diagnosis) => diagnosis.patient, {
    cascade: true,
  })
  diagnoses: PatientDiagnosis[];

  @OneToMany(() => PatientDocument, (document) => document.patient, {
    cascade: true,
  })
  documents: PatientDocument[];

  @OneToMany(() => GroupPatient, (groupPatient) => groupPatient.patient)
  groupPatients: GroupPatient[];

  @OneToMany(() => Attendance, (attendance) => attendance.patient)
  attendance: Attendance[];

  @OneToMany(() => PatientNote, (note) => note.patient, { cascade: true })
  notas: PatientNote[];
}
