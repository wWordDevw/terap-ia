import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';

/**
 * DTO para actualizar un paciente
 * Excluye goals y diagnoses (se actualizan por endpoints separados)
 */
export class UpdatePatientDto extends PartialType(
  OmitType(CreatePatientDto, ['goals', 'diagnoses'] as const),
) {}
