import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Subactivity } from './subactivity.entity';
import { ActivityParagraph } from './activity-paragraph.entity';

export enum ActivityType {
  PHP = 'PHP',
  IOP = 'IOP',
}

/**
 * Entidad Activity
 * Representa las actividades del sistema (Group Therapy, Skills Training, etc.)
 */
@Entity('activities')
export class Activity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'activity_id' })
  id: string;

  @Column({ name: 'activity_name', type: 'varchar', length: 255 })
  activityName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'default_time', type: 'time', nullable: true })
  defaultTime?: string;

  @Column({
    name: 'activity_type',
    type: 'enum',
    enum: ActivityType,
    nullable: true,
  })
  activityType?: ActivityType;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relaciones
  @OneToMany(() => Subactivity, (subactivity) => subactivity.activity)
  subactivities: Subactivity[];

  @OneToMany(() => ActivityParagraph, (paragraph) => paragraph.activity)
  paragraphs: ActivityParagraph[];
}
