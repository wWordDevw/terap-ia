import { IsString, IsNotEmpty, Matches } from 'class-validator';

/**
 * DTO para subir firma del terapeuta en base64
 * Valida que el base64 sea válido y que sea una imagen
 */
export class UploadSignatureDto {
  @IsString()
  @IsNotEmpty({ message: 'La imagen de firma es requerida' })
  @Matches(/^data:image\/(jpeg|jpg|png|gif);base64,/, {
    message: 'La imagen debe ser base64 válido con formato data:image/[tipo];base64,...',
  })
  signatureImage: string; // Base64 completo: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}

