import { IsUUID } from 'class-validator';

export class GenerateWeekNotesDto {
  @IsUUID()
  groupId: string;

  @IsUUID()
  weekId: string;
}