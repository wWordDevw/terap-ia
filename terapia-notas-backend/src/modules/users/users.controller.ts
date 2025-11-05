import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UploadSignatureDto } from './dto/upload-signature.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';

/**
 * Controlador de Usuarios - RF-001
 * Gestiona los endpoints REST para usuarios
 * La mayoría de endpoints requieren rol de ADMIN
 */
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users
   * Crear un nuevo usuario con hash de contraseña
   * Solo ADMIN
   */
  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users
   * Obtener todos los usuarios
   * Query param: includeInactive=true para incluir inactivos
   * Solo ADMIN
   */
  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query('includeInactive') includeInactive?: string) {
    const include = includeInactive === 'true';
    return this.usersService.findAll(include);
  }

  /**
   * GET /users/therapists
   * Obtener todos los terapeutas activos
   * Acceso para ADMIN, THERAPIST y NURSE
   */
  @Get('therapists')
  @Roles(UserRole.ADMIN, UserRole.THERAPIST, UserRole.NURSE)
  findActiveTherapists() {
    return this.usersService.findActiveTherapists();
  }

  /**
   * GET /users/:id/signature
   * Obtener la firma del terapeuta (solo base64, sin metadata)
   * IMPORTANTE: Debe estar ANTES de @Get(':id') para evitar conflictos de rutas
   */
  @Get(':id/signature')
  @Roles(UserRole.ADMIN, UserRole.THERAPIST, UserRole.NURSE)
  @HttpCode(HttpStatus.OK)
  getSignature(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getSignature(id);
  }

  /**
   * GET /users/:id
   * Obtener un usuario por ID
   * ADMIN puede obtener cualquier usuario
   * THERAPIST y NURSE solo pueden obtener su propio perfil
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.THERAPIST, UserRole.NURSE)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: User,
  ) {
    // Verificar permisos: ADMIN puede obtener cualquier usuario, otros solo su propio perfil
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException('No tienes permiso para acceder a este usuario');
    }
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /users/:id
   * Actualizar un usuario
   * Solo ADMIN
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * DELETE /users/:id
   * Desactivar un usuario (soft delete)
   * Solo ADMIN
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  /**
   * PATCH /users/:id/change-password
   * Cambiar contraseña de un usuario
   * Todos los usuarios autenticados pueden cambiar su propia contraseña
   */
  @Patch(':id/change-password')
  @Roles(UserRole.ADMIN, UserRole.THERAPIST, UserRole.NURSE)
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  /**
   * POST /users/:id/signature
   * Subir o actualizar la firma del terapeuta en base64
   * ADMIN puede subir para cualquier usuario, THERAPIST solo para sí mismo
   */
  @Post(':id/signature')
  @Roles(UserRole.ADMIN, UserRole.THERAPIST)
  @HttpCode(HttpStatus.OK)
  uploadSignature(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() uploadSignatureDto: UploadSignatureDto,
    @CurrentUser() currentUser: User,
  ) {
    // Verificar permisos: ADMIN puede subir para cualquiera, THERAPIST solo para sí mismo
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException('No tienes permiso para modificar la firma de este usuario');
    }
    return this.usersService.uploadSignature(id, uploadSignatureDto.signatureImage);
  }

}
