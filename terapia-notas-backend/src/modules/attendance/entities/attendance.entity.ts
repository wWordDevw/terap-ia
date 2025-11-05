import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { GroupWeek } from '../../groups/entities/group-week.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { User } from '../../users/entities/user.entity';
import { AbsenceReason } from './absence-reason.entity';

export enum AttendanceStatus {
  PRESENT = 'P',
  ABSENT = 'A',
  DISCHARGE = 'D',
}

/**
 * Entidad Attendance - RF-007: Marcar Asistencia Diaria
 * Representa el registro diario de asistencia
 */
@Entity('attendance')
@Unique(['weekId', 'patientId', 'attendanceDate'])
export class Attendance extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'attendance_id' })
  id: string;

  @Column({ name: 'attendance_date', type: 'date' })
  attendanceDate: Date;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
  })
  status: AttendanceStatus;

  @Column({ name: 'units_attended', type: 'decimal', precision: 4, scale: 2, default: 0 })
  unitsAttended: number;

  @Column({ name: 'is_locked', type: 'boolean', default: false })
  isLocked: boolean; // RF-009: Bloqueo de cambios

  @Column({ name: 'locked_at', type: 'timestamp', nullable: true })
  lockedAt?: Date;

  // Relaciones
  @ManyToOne(() => GroupWeek, (week) => week.attendance)
  @JoinColumn({ name: 'week_id' })
  week: GroupWeek;

  @Column({ name: 'week_id', type: 'uuid' })
  weekId: string;

  @ManyToOne(() => Patient, (patient) => patient.attendance)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient;

  @Column({ name: 'patient_id', type: 'uuid' })
  patientId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'locked_by' })
  lockedBy?: User;

  @Column({ name: 'locked_by', type: 'uuid', nullable: true })
  lockedById?: string;

  @OneToMany(() => AbsenceReason, (reason) => reason.attendance, {
    cascade: true,
  })
  absenceReasons: AbsenceReason[];
}
