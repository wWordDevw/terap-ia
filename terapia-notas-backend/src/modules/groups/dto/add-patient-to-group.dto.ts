import { IsUUID, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para agregar paciente a un grupo
 */
export class AddPatientToGroupDto {
  @IsUUID()
  patientId: string;

  @IsDate()
  @Type(() => Date)
  joinedDate: Date;
}
