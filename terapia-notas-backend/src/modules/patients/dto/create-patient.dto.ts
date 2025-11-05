import {
  IsString,
  IsDate,
  IsUUID,
  IsOptional,
  IsArray,
  ValidateNested,
  MaxLength,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para crear una meta del paciente
 */
export class CreatePatientGoalDto {
  @IsString()
  goalText: string;
}

/**
 * DTO para crear un diagnóstico del paciente
 */
export class CreatePatientDiagnosisDto {
  @IsString()
  @MaxLength(20)
  icd10Code: string;

  @IsString()
  diagnosisDescription: string;

  @IsOptional()
  isPrimary?: boolean;
}

/**
 * DTO para crear un paciente - RF-004
 */
export class CreatePatientDto {
  @IsString()
  @MaxLength(50)
  patientNumber: string;

  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @IsDate()
  @Type(() => Date)
  admissionDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dischargeDate?: Date;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  insurance?: string;

  @IsOptional()
  @IsString()
  additionalNotes?: string;

  @IsUUID()
  clinicId: string;

  // 4 goals exactamente - RF-004
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePatientGoalDto)
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  goals: CreatePatientGoalDto[];

  // Al menos un diagnóstico - RF-004
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePatientDiagnosisDto)
  diagnoses: CreatePatientDiagnosisDto[];
}
