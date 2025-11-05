import { IsOptional, IsString, IsDate, IsBoolean, IsEnum, MaxLength, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ProgramType, Shift } from '../entities/group.entity';
import { UpdateGroupScheduleDto } from './update-group-schedule.dto';

/**
 * DTO para actualizar un grupo
 */
export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  groupName?: string;

  @IsOptional()
  @IsEnum(ProgramType)
  programType?: ProgramType;

  @IsOptional()
  @IsEnum(Shift, { message: 'shift must be one of the following values: Mañana, Tarde' })
  shift?: Shift;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsUUID()
  clinicId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateGroupScheduleDto)
  schedules?: UpdateGroupScheduleDto[];
}
