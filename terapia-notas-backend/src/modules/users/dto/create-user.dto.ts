import { IsString, IsEmail, IsEnum, IsOptional, MinLength, MaxLength, IsUUID } from 'class-validator';
import { UserRole } from '../entities/user.entity';

/**
 * DTO para crear un usuario
 * RF-001: Gestión de usuarios
 */
export class CreateUserDto {
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

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsUUID()
  clinicId?: string;
}
