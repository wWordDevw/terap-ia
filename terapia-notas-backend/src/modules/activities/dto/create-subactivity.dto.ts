import { IsString, IsUUID, IsOptional, MaxLength } from 'class-validator';

/**
 * DTO para crear una subactividad
 */
export class CreateSubactivityDto {
  @IsOptional()
  @IsUUID()
  activityId?: string;

  @IsString()
  @MaxLength(255)
  subactivityName: string;

  @IsOptional()
  @IsString()
  description?: string;
}
