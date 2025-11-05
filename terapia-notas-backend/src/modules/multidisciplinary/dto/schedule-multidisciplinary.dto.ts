import { IsUUID, IsDateString, IsOptional } from 'class-validator';

/**
 * DTO para programar una junta multidisciplinaria
 * RF-031
 */
export class ScheduleMultidisciplinaryDto {
  @IsUUID()
  patientId: string;

  @IsDateString()
  scheduledDate: string;

  @IsUUID()
  @IsOptional()
  mtprScheduleId?: string;
}
