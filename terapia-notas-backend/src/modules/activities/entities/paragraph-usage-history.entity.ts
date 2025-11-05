import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ActivityParagraph } from './activity-paragraph.entity';
import { Subactivity } from './subactivity.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { GroupWeek } from '../../groups/entities/group-week.entity';
import { Group } from '../../groups/entities/group.entity';

/**
 * Entidad ParagraphUsageHistory
 * Registra el historial de uso de párrafos - RF-034
 */
@Entity('paragraph_usage_history')
export class ParagraphUsageHistory {
  @PrimaryGeneratedColumn('uuid', { name: 'usage_id' })
  id: string;

  @ManyToOne(() => ActivityParagraph)
  @JoinColumn({ name: 'paragraph_id' })
  paragraph: ActivityParagraph;

  @Column({ name: 'paragraph_id', type: 'uuid' })
  paragraphId: string;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'group_id' })
  group: Group;

  @Column({ name: 'group_id', type: 'uuid' })
  groupId: string;

  @ManyToOne(() => GroupWeek)
  @JoinColumn({ name: 'week_id' })
  week: GroupWeek;

  @Column({ name: 'week_id', type: 'uuid' })
  weekId: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;

  @Column({ name: 'used_date', type: 'date' })
  usedDate: Date;

  // Relación con subactividad (objetivo)
  @ManyToOne(() => Subactivity, { nullable: true })
  @JoinColumn({ name: 'subactivity_id' })
  subactivity?: Subactivity;

  @Column({ name: 'subactivity_id', type: 'uuid', nullable: true })
  subactivityId?: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
