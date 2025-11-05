import { IsEnum, IsString, IsNumber, IsUUID, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { DayOfWeek } from '../entities/group-schedule.entity';

/**
 * DTO para crear horario de grupo - RF-001
 */
export class CreateGroupScheduleDto {
  @IsUUID()
  groupId: string;

  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IsUUID()
  activityId: string;

  @IsOptional()
  @IsUUID()
  subactivityId?: string;

  @IsString()
  startTime: string; // formato "HH:MM"

  @IsString()
  endTime: string; // formato "HH:MM"

  @IsNumber()
  @Min(0)
  @Max(24)
  units: number;

  @IsOptional()
  @IsString()
  noteCode?: string;

  @IsOptional()
  @IsBoolean()
  isNurseSession?: boolean;
}
