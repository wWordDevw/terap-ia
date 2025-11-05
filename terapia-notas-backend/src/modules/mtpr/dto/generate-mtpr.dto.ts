import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MedicationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  dosage: string;

  @IsString()
  @IsOptional()
  frequency?: string;
}

/**
 * DTO para generar un MTPR (Master Treatment Plan Review)
 * RF-018 a RF-027
 */
export class GenerateMtprDto {
  @IsString()
  @IsNotEmpty()
  mentalStatus: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicationDto)
  @IsOptional()
  currentMedications?: MedicationDto[];

  @IsString()
  @IsNotEmpty()
  treatmentInterventions: string;

  @IsString()
  @IsNotEmpty()
  goal1Progress: string;

  @IsString()
  @IsNotEmpty()
  goal2Progress: string;

  @IsString()
  @IsNotEmpty()
  goal3Progress: string;

  @IsString()
  @IsNotEmpty()
  goal4Progress: string;

  @IsString()
  @IsOptional()
  barriers?: string;

  @IsString()
  @IsNotEmpty()
  planNextPeriod: string;

  @IsString()
  @IsOptional()
  dischargePlanning?: string;
}
