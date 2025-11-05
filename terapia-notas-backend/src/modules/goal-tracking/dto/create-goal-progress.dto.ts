import { IsNotEmpty, IsString, IsInt, IsEnum, IsOptional, Min, Max, IsDateString } from 'class-validator';
import { ProgressLevel } from '../../patients/entities/goal-progress.entity';

/**
 * DTO para crear una nueva evaluación de progreso de objetivo
 */
export class CreateGoalProgressDto {
  @IsNotEmpty()
  @IsString()
  patientGoalId: string;

  @IsNotEmpty()
  @IsDateString()
  assessmentDate: string; // Formato ISO: YYYY-MM-DD

  @IsNotEmpty()
  @IsEnum(ProgressLevel)
  progressLevel: ProgressLevel;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(100)
  percentageComplete: number;

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
