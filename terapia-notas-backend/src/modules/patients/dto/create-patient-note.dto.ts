import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray, MaxLength } from 'class-validator';

/**
 * DTO para crear una nota del paciente
 */
export class CreatePatientNoteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  contenido: string;

  @IsEnum(['general', 'medica', 'terapeutica', 'administrativa'])
  @IsOptional()
  tipo?: 'general' | 'medica' | 'terapeutica' | 'administrativa';

  @IsEnum(['publica', 'privada', 'confidencial'])
  @IsOptional()
  privacidad?: 'publica' | 'privada' | 'confidencial';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
