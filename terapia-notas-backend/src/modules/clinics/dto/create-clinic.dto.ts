import { IsString, IsEmail, IsOptional, IsBoolean, MaxLength } from 'class-validator';

/**
 * DTO para crear una clínica - RF-037
 */
export class CreateClinicDto {
  @IsString()
  @MaxLength(255)
  clinicName: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
