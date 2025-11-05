import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientNoteDto } from './create-patient-note.dto';

/**
 * DTO para actualizar una nota del paciente
 */
export class UpdatePatientNoteDto extends PartialType(CreatePatientNoteDto) {}
