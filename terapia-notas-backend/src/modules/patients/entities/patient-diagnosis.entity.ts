import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Patient } from './patient.entity';

/**
 * Entidad PatientDiagnosis - RF-004: Código de diagnóstico (ICD-10)
 * Representa los diagnósticos del paciente
 */
@Entity('patient_diagnoses')
export class PatientDiagnosis extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'diagnosis_id' })
  id: string;

  @Column({ name: 'icd10_code', type: 'varchar', length: 20 })
  icd10Code: string;

  @Column({ name: 'diagnosis_description', type: 'text' })
  diagnosisDescription: string;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary: boolean;

  // Relaciones
  @ManyToOne(() => Patient, (patient) => patient.diagnoses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;
}
