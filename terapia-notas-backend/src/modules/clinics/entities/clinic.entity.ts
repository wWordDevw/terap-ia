import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { Group } from '../../groups/entities/group.entity';
import { Patient } from '../../patients/entities/patient.entity';

/**
 * Entidad Clinic - RF-037: Configuración de Clínica
 * Representa las clínicas del sistema
 */
@Entity('clinics')
export class Clinic extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'clinic_id' })
  id: string;

  @Column({ name: 'clinic_name', type: 'varchar', length: 255 })
  clinicName: string;

  @Column({ name: 'logo_url', type: 'varchar', length: 500, nullable: true })
  logoUrl?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relaciones
  @OneToMany(() => User, (user) => user.clinic)
  users: User[];

  @OneToMany(() => Group, (group) => group.clinic)
  groups: Group[];

  @OneToMany(() => Patient, (patient) => patient.clinic)
  patients: Patient[];
}
