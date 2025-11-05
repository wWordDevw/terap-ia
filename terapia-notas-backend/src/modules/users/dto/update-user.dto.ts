import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, MinLength, MaxLength, IsBoolean } from 'class-validator';

/**
 * DTO para actualizar un usuario
 * Todos los campos son opcionales
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(100)
  password?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
