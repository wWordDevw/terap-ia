import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Attendance } from './attendance.entity';

export enum ReasonType {
  MEDICAL_APPOINTMENT = 'medical_appointment',
  FAMILY_TRIP = 'family_trip',
  HOSPITALIZED = 'hospitalized',
}

/**
 * Entidad AbsenceReason - RF-008: Justificar Ausencias
 * Representa las razones de ausencia de un paciente
 */
@Entity('absence_reasons')
export class AbsenceReason extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'reason_id' })
  id: string;

  @Column({
    name: 'reason_type',
    type: 'enum',
    enum: ReasonType,
  })
  reasonType: ReasonType;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relaciones
  @ManyToOne(() => Attendance, (attendance) => attendance.absenceReasons, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attendance_id' })
  attendance: Attendance;

  @Column({ name: 'attendance_id', type: 'uuid' })
  attendanceId: string;
}
