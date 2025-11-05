import { IsEnum, IsDate, IsNumber, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '../entities/attendance.entity';

/**
 * DTO para marcar asistencia - RF-007
 */
export class MarkAttendanceDto {
  @IsUUID()
  weekId: string;

  @IsUUID()
  patientId: string;

  @IsDate()
  @Type(() => Date)
  attendanceDate: Date;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsNumber()
  @Min(0)
  unitsAttended: number;
}
