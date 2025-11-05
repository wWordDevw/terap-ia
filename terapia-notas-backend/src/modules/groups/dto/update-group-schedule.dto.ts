import { IsEnum, IsString, IsNumber, IsUUID, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { DayOfWeek } from '../entities/group-schedule.entity';

/**
 * DTO para actualizar horario de grupo (sin groupId)
 * Se usa en la actualización de grupos donde el groupId viene del parámetro de la URL
 */
export class UpdateGroupScheduleDto {
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
