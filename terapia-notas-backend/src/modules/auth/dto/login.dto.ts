import { IsEmail, IsString } from 'class-validator';

/**
 * DTO para login
 */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
