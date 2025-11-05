import { IsEnum, IsDate, IsString, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ReasonType } from '../entities/absence-reason.entity';

/**
 * DTO para justificar ausencia - RF-008
 */
export class JustifyAbsenceDto {
  @IsUUID()
  attendanceId: string;

  @IsEnum(ReasonType)
  reasonType: ReasonType;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsString()
  notes?: string;
}
