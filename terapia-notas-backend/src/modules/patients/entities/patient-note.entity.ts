import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from './patient.entity';

/**
 * Entidad PatientNote - Notas del Paciente
 * Representa las notas asociadas a un paciente
 */
@Entity('patient_notes')
export class PatientNote {
  @PrimaryGeneratedColumn('uuid', { name: 'note_id' })
  id: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'varchar', length: 100 })
  autor: string;

  @Column({ name: 'autor_rol', type: 'varchar', length: 50 })
  autorRol: string;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text' })
  contenido: string;

  @Column({
    type: 'enum',
    enum: ['general', 'medica', 'terapeutica', 'administrativa'],
    default: 'general',
  })
  tipo: 'general' | 'medica' | 'terapeutica' | 'administrativa';

  @Column({
    type: 'enum',
    enum: ['publica', 'privada', 'confidencial'],
    default: 'publica',
  })
  privacidad: 'publica' | 'privada' | 'confidencial';

  @Column({ type: 'simple-array', nullable: true })
  tags?: string[];

  @ManyToOne(() => Patient, (patient) => patient.notas)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
