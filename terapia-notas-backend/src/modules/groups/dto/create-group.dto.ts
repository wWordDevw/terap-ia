import { IsEnum, IsString, IsDate, IsOptional, IsUUID, MaxLength, IsArray, ValidateNested, ArrayMinSize, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ProgramType, Shift } from '../entities/group.entity';
import { DayOfWeek } from '../entities/group-schedule.entity';

/**
 * DTO para crear horario de grupo
 */
export class CreateGroupScheduleDto {
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @IsUUID()
  activityId: string;

  @IsString()
  startTime: string; // formato "HH:mm"

  @IsString()
  endTime: string; // formato "HH:mm"

  @IsNumber()
  units: number;
}

/**
 * DTO para crear un grupo - RF-001
 */
export class CreateGroupDto {
  @IsEnum(ProgramType)
  programType: ProgramType;

  @IsEnum(Shift)
  shift: Shift;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  groupName?: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsUUID()
  clinicId: string;

  @IsUUID()
  terapeutaId: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(0)
  pacientesIds: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGroupScheduleDto)
  schedules: CreateGroupScheduleDto[];
}
