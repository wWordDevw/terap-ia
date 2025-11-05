import { IsString, IsUUID, IsOptional, IsInt, Min } from 'class-validator';

/**
 * DTO para crear un párrafo predefinido - RF-015, RF-034
 */
export class CreateParagraphDto {
  @IsOptional()
  @IsUUID()
  activityId?: string;

  @IsOptional()
  @IsUUID()
  subactivityId?: string;

  @IsString()
  paragraphText: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  paragraphOrder?: number;
}
