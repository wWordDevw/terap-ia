import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

/**
 * JWT Strategy para validar tokens
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Validar el payload del JWT
   * Este método se ejecuta automáticamente cuando el token es válido
   */
  async validate(payload: any) {
    const user = await this.usersService.findOne(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    return user; // Se adjunta al request como request.user
  }
}
