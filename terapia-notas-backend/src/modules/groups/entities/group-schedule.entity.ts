import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Group } from './group.entity';
import { Activity } from '../../activities/entities/activity.entity';
import { Subactivity } from '../../activities/entities/subactivity.entity';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

/**
 * Entidad GroupSchedule - RF-001: Cargar tabla de horario de actividades
 * Representa el horario de actividades de un grupo
 */
@Entity('group_schedules')
export class GroupSchedule extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'schedule_id' })
  id: string;

  @Column({
    name: 'day_of_week',
    type: 'enum',
    enum: DayOfWeek,
  })
  dayOfWeek: DayOfWeek;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  units: number;

  @Column({ name: 'note_code', type: 'varchar', length: 10, nullable: true })
  noteCode?: string;

  @Column({ name: 'is_nurse_session', type: 'boolean', default: false })
  isNurseSession: boolean;

  // Relaciones
  @ManyToOne(() => Group, (group) => group.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ name: 'group_id', type: 'uuid' })
  groupId: string;

  @ManyToOne(() => Activity)
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @Column({ name: 'activity_id', type: 'uuid' })
  activityId: string;

  @ManyToOne(() => Subactivity, { nullable: true })
  @JoinColumn({ name: 'subactivity_id' })
  subactivity?: Subactivity;

  @Column({ name: 'subactivity_id', type: 'uuid', nullable: true })
  subactivityId?: string;
}
