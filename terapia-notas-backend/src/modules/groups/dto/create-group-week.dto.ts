import { IsInt, IsDate, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para crear una semana de grupo - RF-003
 */
export class CreateGroupWeekDto {
  @IsUUID()
  groupId: string;

  @IsInt()
  @Min(1)
  weekNumber: number;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
