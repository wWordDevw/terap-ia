import { IsUUID, IsString, IsDateString } from 'class-validator';

export class GenerateDayNoteDto {
  @IsUUID()
  groupId: string;

  @IsString()
  @IsDateString()
  date: string; // YYYY-MM-DD
}