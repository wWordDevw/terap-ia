import { IsString, IsOptional, MaxLength, Matches, IsEnum } from 'class-validator';
import { ActivityType } from '../entities/activity.entity';

/**
 * DTO para crear una actividad
 */
export class CreateActivityDto {
  @IsString()
  @MaxLength(255)
  activityName: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'La hora debe estar en formato HH:mm o HH:mm:ss'
  })
  defaultTime?: string;

  @IsOptional()
  @IsEnum(ActivityType, {
    message: 'El tipo de actividad debe ser PHP o IOP'
  })
  activityType?: ActivityType;
}
