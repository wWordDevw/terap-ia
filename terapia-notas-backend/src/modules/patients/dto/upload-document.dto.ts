import { IsEnum, IsString, MaxLength, IsOptional, IsNumber } from 'class-validator';
import { DocumentType } from '../entities/patient-document.entity';

/**
 * DTO para subir documento - RF-004, RF-036
 */
export class UploadDocumentDto {
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsString()
  @MaxLength(255)
  documentName: string;

  @IsString()
  filePath: string; // Ruta donde se guardó el archivo

  @IsOptional()
  @IsNumber()
  fileSize?: number;

  @IsOptional()
  @IsString()
  uploadedById?: string; // ID del usuario que subió el documento
}
