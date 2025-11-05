import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';
import { User } from '../../users/entities/user.entity';

export enum DocumentType {
  MASTER_TREATMENT_PLAN = 'master_treatment_plan',
  ASSESSMENT = 'assessment',
  MEDICAL_RECORD = 'medical_record',
  LAB_RESULT = 'lab_result',
  PRESCRIPTION = 'prescription',
  INSURANCE = 'insurance',
  CONSENT_FORM = 'consent_form',
  DISCHARGE_SUMMARY = 'discharge_summary',
  PROGRESS_NOTE = 'progress_note',
  OTHER = 'other',
}

/**
 * Entidad PatientDocument - RF-004, RF-036: Opción para subir documentos del paciente
 * Representa los documentos subidos de un paciente
 * Nota: No extiende de BaseEntity porque usa uploaded_at en lugar de created_at/updated_at
 */
@Entity('patient_documents')
export class PatientDocument {
  @PrimaryGeneratedColumn('uuid', { name: 'document_id' })
  id: string;

  @Column({
    name: 'document_type',
    type: 'enum',
    enum: DocumentType,
  })
  documentType: DocumentType;

  @Column({ name: 'document_name', type: 'varchar', length: 255 })
  documentName: string;

  @Column({ name: 'file_path', type: 'varchar', length: 500 })
  filePath: string;

  @Column({ name: 'file_size', type: 'int', nullable: true })
  fileSize?: number;

  @Column({ name: 'uploaded_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  // Relaciones
  @ManyToOne(() => Patient, (patient) => patient.documents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy?: User;

  @Column({ name: 'uploaded_by', type: 'uuid', nullable: true })
  uploadedById?: string;
}
