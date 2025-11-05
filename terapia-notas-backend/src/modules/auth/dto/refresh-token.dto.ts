import { IsString } from 'class-validator';

/**
 * DTO para refresh token
 */
export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
