import { IsString, IsInt, IsEnum, IsOptional, Min, Max, IsDateString } from 'class-validator';
import { ProgressLevel } from '../../patients/entities/goal-progress.entity';

/**
 * DTO para actualizar una evaluación de progreso de objetivo
 */
export class UpdateGoalProgressDto {
  @IsOptional()
  @IsDateString()
  assessmentDate?: string;

  @IsOptional()
  @IsEnum(ProgressLevel)
  progressLevel?: ProgressLevel;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  percentageComplete?: number;

  @IsOptional()
  @IsString()
  evidence?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  assessedBy?: string;
}
