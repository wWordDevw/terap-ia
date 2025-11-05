import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Clinic } from '../../clinics/entities/clinic.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  THERAPIST = 'therapist',
  NURSE = 'nurse',
}

/**
 * Entidad User
 * Usuarios del sistema con diferentes roles
 */
@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Exclude() // No exponer el password en las respuestas
  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.THERAPIST,
  })
  role: UserRole;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'last_login', type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @Column({ name: 'signature_image', type: 'text', nullable: true })
  signatureImage?: string; // Imagen de firma en base64

  // Relaciones
  @ManyToOne(() => Clinic, (clinic) => clinic.users, { nullable: true })
  @JoinColumn({ name: 'clinic_id' })
  clinic?: Clinic;

  @Column({ name: 'clinic_id', type: 'uuid', nullable: true })
  clinicId?: string;
}
