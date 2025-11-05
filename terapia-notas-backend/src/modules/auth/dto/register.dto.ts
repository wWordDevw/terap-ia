import { IsString, IsEmail, IsEnum, IsOptional, MinLength, MaxLength, IsUUID } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

/**
 * DTO para registro de usuario
 */
export class RegisterDto {
  @IsString()
  @MaxLength(50)
  username: string;

  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(100)
  password: string;

  @IsString()
  @MaxLength(255)
  fullName: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsUUID()
  clinicId?: string;
}
