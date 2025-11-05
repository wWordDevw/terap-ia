import { IsString, IsNotEmpty, IsArray, ValidateNested, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class ParticipantDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsOptional()
  signature?: string;
}

/**
 * DTO para generar una nota multidisciplinaria
 * RF-031 a RF-033
 */
export class GenerateMultidisciplinaryNoteDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParticipantDto)
  participants: ParticipantDto[];

  @IsString()
  @IsNotEmpty()
  caseSummary: string;

  @IsString()
  @IsNotEmpty()
  teamDiscussion: string;

  @IsString()
  @IsNotEmpty()
  currentStatus: string;

  @IsString()
  @IsNotEmpty()
  recommendations: string;

  @IsString()
  @IsNotEmpty()
  actionPlan: string;

  @IsString()
  @IsOptional()
  followUpPlan?: string;

  @IsDateString()
  @IsOptional()
  nextMeetingDate?: string;
}
