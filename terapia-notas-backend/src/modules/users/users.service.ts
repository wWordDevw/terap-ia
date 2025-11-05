import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

/**
 * Servicio de Usuarios - RF-001: Gestión de Usuarios
 * Maneja la lógica de negocio para usuarios con hash de contraseñas
 */
@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Hashear contraseña
   */
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verificar contraseña
   */
  async validatePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Crear un nuevo usuario con hash de contraseña
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Verificar si el email ya existe
      const existingEmail = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('El email ya está registrado');
      }

      // Verificar si el username ya existe
      const existingUsername = await this.userRepository.findOne({
        where: { username: createUserDto.username },
      });

      if (existingUsername) {
        throw new ConflictException('El username ya está registrado');
      }

      // Hash de la contraseña
      const passwordHash = await this.hashPassword(createUserDto.password);

      // Crear usuario
      const user = this.userRepository.create({
        ...createUserDto,
        passwordHash,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(
        'Error al crear el usuario: ' + error.message,
      );
    }
  }

  /**
   * Obtener todos los usuarios
   */
  async findAll(includeInactive = false): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder('user');

    if (!includeInactive) {
      query.where('user.isActive = :isActive', { isActive: true });
    }

    return await query
      .leftJoinAndSelect('user.clinic', 'clinic')
      .orderBy('user.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Obtener un usuario por ID
   */
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['clinic'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  /**
   * Buscar usuario por email (para autenticación)
   */
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email, isActive: true },
      relations: ['clinic'],
    });
  }

  /**
   * Buscar usuario por username
   */
  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username, isActive: true },
      relations: ['clinic'],
    });
  }

  /**
   * Actualizar un usuario
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    try {
      // Si se incluye una nueva contraseña, hashearla
      if (updateUserDto.password) {
        const passwordHash = await this.hashPassword(updateUserDto.password);
        Object.assign(user, { ...updateUserDto, passwordHash });
        delete updateUserDto.password; // Remover password del DTO
      } else {
        Object.assign(user, updateUserDto);
      }

      return await this.userRepository.save(user);
    } catch (error) {
      throw new BadRequestException(
        'Error al actualizar el usuario: ' + error.message,
      );
    }
  }

  /**
   * Desactivar un usuario (soft delete)
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.userRepository.save(user);
  }

  /**
   * Cambiar contraseña de usuario
   */
  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Validar contraseña actual
    const isValidPassword = await this.validatePassword(
      changePasswordDto.currentPassword,
      user.passwordHash,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    // Hash de la nueva contraseña
    user.passwordHash = await this.hashPassword(changePasswordDto.newPassword);
    await this.userRepository.save(user);
  }

  /**
   * Actualizar última fecha de login
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, { lastLogin: new Date() });
  }

  /**
   * Obtener todos los terapeutas activos
   */
  async findActiveTherapists(): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.THERAPIST })
      .andWhere('user.isActive = :isActive', { isActive: true })
      .orderBy('user.fullName', 'ASC')
      .getMany();
  }

  /**
   * Subir o actualizar la firma del terapeuta en base64
   * Valida que el base64 sea válido y que no exceda 2MB (aproximadamente)
   */
  async uploadSignature(userId: string, signatureImageBase64: string): Promise<{ message: string; userId: string }> {
    const user = await this.findOne(userId);

    // Validar formato base64
    if (!signatureImageBase64.startsWith('data:image/')) {
      throw new BadRequestException('El formato de imagen debe ser base64 con prefijo data:image/...');
    }

    // Extraer solo el base64 (sin el prefijo data:image/...)
    const base64Match = signatureImageBase64.match(/^data:image\/(jpeg|jpg|png|gif);base64,(.+)$/);
    if (!base64Match || !base64Match[2]) {
      throw new BadRequestException('El formato base64 no es válido');
    }

    // Validar tamaño (aproximadamente 2MB en base64 = ~1.5MB en binario)
    // Base64 es aproximadamente 33% más grande que el binario
    const base64Data = base64Match[2];
    const sizeInBytes = (base64Data.length * 3) / 4;
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (sizeInBytes > maxSize) {
      throw new BadRequestException(`La imagen es demasiado grande. Tamaño máximo: 2MB (actual: ${(sizeInBytes / 1024 / 1024).toFixed(2)}MB)`);
    }

    // Validar que sea base64 válido intentando decodificarlo
    try {
      Buffer.from(base64Data, 'base64');
    } catch (error) {
      throw new BadRequestException('El contenido base64 no es válido');
    }

    // Guardar en BD (el base64 completo con prefijo)
    user.signatureImage = signatureImageBase64;
    await this.userRepository.save(user);

    return {
      message: 'Firma actualizada exitosamente',
      userId: user.id,
    };
  }

  /**
   * Obtener la firma del terapeuta (solo base64)
   */
  async getSignature(userId: string): Promise<{ signatureImage: string | null }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'signatureImage'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    return {
      signatureImage: user.signatureImage || null,
    };
  }
}
