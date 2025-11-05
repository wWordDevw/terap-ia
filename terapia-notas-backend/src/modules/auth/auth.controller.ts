import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

/**
 * Controlador de Autenticación
 * Gestiona los endpoints de login, logout y refresh token
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   * Login de usuario
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de usuario', description: 'Autentica un usuario con email y contraseña, retorna tokens JWT' })
  @ApiResponse({ status: 200, description: 'Login exitoso, retorna access token y refresh token' })
  @ApiResponse({ status: 401, description: 'Credenciales incorrectas' })
  @ApiBody({ type: LoginDto })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * POST /auth/register
   * Registro de nuevo usuario
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registro de usuario', description: 'Registra un nuevo usuario en el sistema' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 409, description: 'Email o username ya registrado' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  /**
   * POST /auth/refresh
   * Refresh token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh token', description: 'Obtiene un nuevo access token usando el refresh token' })
  @ApiResponse({ status: 200, description: 'Nuevo access token generado' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  @ApiBody({ type: RefreshTokenDto })
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  /**
   * GET /auth/profile
   * Obtener perfil del usuario autenticado
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obtener perfil', description: 'Obtiene el perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  getProfile(@CurrentUser() user: User) {
    return this.authService.getProfile(user.id);
  }

  /**
   * POST /auth/logout
   * Logout (en el cliente se debe eliminar el token)
   */
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout', description: 'Cierra la sesión del usuario (eliminar token del cliente)' })
  @ApiResponse({ status: 200, description: 'Logout exitoso' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  logout() {
    return { message: 'Logout exitoso' };
  }
}
