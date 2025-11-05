import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User, UserRole } from '../users/entities/user.entity';

/**
 * Servicio de Autenticación
 * Maneja login, logout y generación de tokens JWT
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Validar credenciales de usuario
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isValidPassword = await this.usersService.validatePassword(
      password,
      user.passwordHash,
    );

    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  /**
   * Login de usuario
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Actualizar última fecha de login
    await this.usersService.updateLastLogin(user.id);

    // Generar tokens
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: 604800, // 7 días en segundos
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        clinicId: user.clinicId,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Registro de nuevo usuario
   */
  async register(registerDto: RegisterDto) {
    try {
      // Verificar si el email ya existe
      const existingUserByEmail = await this.usersService.findByEmail(registerDto.email);
      if (existingUserByEmail) {
        throw new ConflictException('El email ya está registrado');
      }

      // Verificar si el username ya existe
      const existingUserByUsername = await this.usersService.findByUsername(registerDto.username);
      if (existingUserByUsername) {
        throw new ConflictException('El nombre de usuario ya está en uso');
      }

      // Crear el usuario con rol por defecto THERAPIST si no se especifica
      const userData = {
        username: registerDto.username,
        email: registerDto.email,
        password: registerDto.password,
        fullName: registerDto.fullName,
        role: registerDto.role || UserRole.THERAPIST,
        clinicId: registerDto.clinicId,
      };

      const user = await this.usersService.create(userData);

      // Por ahora, retornar solo la información del usuario sin JWT
      return {
        message: 'Usuario registrado exitosamente',
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          clinicId: user.clinicId,
        },
      };
    } catch (error) {
      console.error('Error en register:', error);
      throw error;
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const user = await this.usersService.findOne(payload.sub);

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Usuario no autorizado');
      }

      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const newAccessToken = this.jwtService.sign(newPayload);

      return {
        accessToken: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }

  /**
   * Obtener perfil de usuario autenticado
   */
  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      clinicId: user.clinicId,
      lastLogin: user.lastLogin,
    };
  }
}
