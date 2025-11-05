import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Group } from './group.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';

/**
 * Entidad GroupWeek - RF-003: Gestión de Semanas
 * Representa las semanas de trabajo de cada grupo
 */
@Entity('group_weeks')
export class GroupWeek extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'week_id' })
  id: string;

  @Column({ name: 'week_number', type: 'int' })
  weekNumber: number;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({ name: 'is_current', type: 'boolean', default: false })
  isCurrent: boolean;

  @Column({ name: 'notes_generated', type: 'boolean', default: false })
  notesGenerated: boolean;

  @Column({ name: 'notes_generated_at', type: 'timestamp', nullable: true })
  notesGeneratedAt?: Date;

  // Relaciones
  @ManyToOne(() => Group, (group) => group.weeks)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ name: 'group_id', type: 'uuid' })
  groupId: string;

  @OneToMany(() => Attendance, (attendance) => attendance.week)
  attendance: Attendance[];
}
