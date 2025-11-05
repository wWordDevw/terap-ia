import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

/**
 * Entidad AvailableDiagnosis - Tabla maestra de códigos ICD-10 disponibles
 * Representa los diagnósticos disponibles en el sistema para asignar a pacientes
 */
@Entity('available_diagnoses')
export class AvailableDiagnosis extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'diagnosis_code_id' })
  id: string;

  @Column({ name: 'icd10_code', type: 'varchar', length: 20, unique: true })
  icd10Code: string;

  @Column({ name: 'diagnosis_description', type: 'varchar', length: 500 })
  diagnosisDescription: string;

  @Column({ name: 'category', type: 'varchar', length: 100, nullable: true })
  category?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}

