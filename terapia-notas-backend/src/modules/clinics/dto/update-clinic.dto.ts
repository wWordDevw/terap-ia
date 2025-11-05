import { PartialType } from '@nestjs/mapped-types';
import { CreateClinicDto } from './create-clinic.dto';

/**
 * DTO para actualizar una clínica
 * Todos los campos son opcionales
 */
export class UpdateClinicDto extends PartialType(CreateClinicDto) {}
