import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';

export const ROLES_KEY = 'roles';

/**
 * Decorador para definir roles requeridos en un endpoint
 * Uso: @Roles(UserRole.ADMIN, UserRole.THERAPIST)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
