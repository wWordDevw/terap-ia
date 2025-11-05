import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Activity } from './activity.entity';
import { Subactivity } from './subactivity.entity';

/**
 * Entidad ActivityParagraph - RF-015, RF-034: Párrafos predefinidos alternándolos
 * Representa los párrafos predefinidos para las notas
 */
@Entity('activity_paragraphs')
export class ActivityParagraph extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'paragraph_id' })
  id: string;

  @Column({ name: 'paragraph_text', type: 'text' })
  paragraphText: string;

  @Column({ name: 'paragraph_order', type: 'int', nullable: true })
  paragraphOrder?: number;

  @Column({ name: 'usage_count', type: 'int', default: 0 })
  usageCount: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  // Relaciones
  @ManyToOne(() => Activity, (activity) => activity.paragraphs)
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
