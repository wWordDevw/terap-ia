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
import { GroupWeek } from './group-week.entity';
import { GroupSchedule } from './group-schedule.entity';
import { GroupPatient } from './group-patient.entity';

export enum ProgramType {
  PHP = 'PHP',
  IOP = 'IOP',
}

export enum Shift {
  MORNING = 'Mañana',
  AFTERNOON = 'Tarde',
}

/**
 * Entidad Group - RF-001: Crear Grupo
 * Representa los grupos de terapia PHP o IOP
 */
@Entity('groups')
export class Group extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'group_id' })
  id: string;

  @Column({ name: 'group_name', type: 'varchar', length: 100, nullable: true })
  groupName?: string;

  @Column({
    name: 'program_type',
    type: 'enum',
    enum: ProgramType,
  })
  programType: ProgramType;

  @Column({
    type: 'enum',
    enum: Shift,
  })
  shift: Shift;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relaciones
  @ManyToOne(() => Clinic, (clinic) => clinic.groups)
  @JoinColumn({ name: 'clinic_id' })
  clinic: Clinic;

  @Column({ name: 'clinic_id', type: 'uuid' })
  clinicId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdById?: string;

  @OneToMany(() => GroupWeek, (week) => week.group)
  weeks: GroupWeek[];

  @OneToMany(() => GroupSchedule, (schedule) => schedule.group)
  schedules: GroupSchedule[];

  @OneToMany(() => GroupPatient, (groupPatient) => groupPatient.group)
  groupPatients: GroupPatient[];
}
