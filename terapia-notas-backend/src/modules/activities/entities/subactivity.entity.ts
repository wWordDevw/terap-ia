import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Activity } from './activity.entity';

/**
 * Entidad Subactivity
 * Representa las subactividades de cada actividad
 */
@Entity('subactivities')
export class Subactivity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'subactivity_id' })
  id: string;

  @Column({ name: 'subactivity_name', type: 'varchar', length: 255 })
  subactivityName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relaciones
  @ManyToOne(() => Activity, (activity) => activity.subactivities)
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @Column({ name: 'activity_id', type: 'uuid' })
  activityId: string;
}
