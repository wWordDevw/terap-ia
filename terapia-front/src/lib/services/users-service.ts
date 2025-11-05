/**
 * Servicio de Usuarios
 */

import { apiClient } from '../api-client';
import { API_ENDPOINTS } from '../api-config';
import type { UserRole } from '../types';

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  clinicId?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  clinicId?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  fullName?: string;
  role?: UserRole;
  clinicId?: string;
  isActive?: boolean;
}

class UsersService {
  /**
   * Crear nuevo usuario
   */
  async createUser(data: CreateUserDto): Promise<User> {
    const response = await apiClient.post<User>(
      API_ENDPOINTS.users.base,
      data,
      true // requiresAuth
    );

    return response;
  }

  /**
   * Obtener todos los usuarios
   */
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>(
      API_ENDPOINTS.users.base,
      true
    );

    return response;
  }

  /**
   * Obtener usuario por ID
   */
  async getUserById(id: string): Promise<User> {
    const response = await apiClient.get<User>(
      API_ENDPOINTS.users.byId(id),
      true
    );

    return response;
  }

  /**
   * Obtener usuario por ID (alias de getUserById)
   */
  async getUser(id: string): Promise<User> {
    return this.getUserById(id);
  }

  /**
   * Actualizar usuario
   */
  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const response = await apiClient.patch<User>(
      API_ENDPOINTS.users.byId(id),
      data,
      true
    );

    return response;
  }

  /**
   * Eliminar usuario
   */
  async deleteUser(id: string): Promise<void> {
    await apiClient.delete<void>(
      API_ENDPOINTS.users.byId(id),
      true
    );
  }
}

export const usersService = new UsersService();
