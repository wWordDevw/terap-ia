/**
 * Servicio de Autenticacion
 */

import { apiClient } from '../api-client';
import { API_ENDPOINTS } from '../api-config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role?: 'admin' | 'therapist' | 'nurse';
  clinicId?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: 'admin' | 'therapist' | 'nurse';
  clinicId?: string;
  lastLogin?: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

class AuthService {
  /**
   * Guardar token en cookies
   */
  private setCookie(name: string, value: string, days: number) {
    if (typeof document === 'undefined') return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  /**
   * Eliminar cookie
   */
  private deleteCookie(name: string) {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  /**
   * Login de usuario
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.auth.login,
      credentials
    );

    // Guardar tokens en localStorage y cookies
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Guardar en cookies para el middleware
      this.setCookie('accessToken', response.accessToken, 1); // 1 día
      this.setCookie('refreshToken', response.refreshToken, 7); // 7 días
    }

    return response;
  }

  /**
   * Registro de usuario
   */
  async register(data: RegisterData): Promise<LoginResponse> {
    // Crear una copia de los datos y eliminar clinicId si está vacío o undefined
    const cleanData: Partial<RegisterData> = {
      username: data.username,
      email: data.email,
      password: data.password,
      fullName: data.fullName,
    };

    // Solo agregar role si existe
    if (data.role) {
      cleanData.role = data.role;
    }

    // Solo agregar clinicId si existe y no está vacío
    if (data.clinicId && data.clinicId.trim() !== '') {
      cleanData.clinicId = data.clinicId;
    }

    console.log('Datos a enviar al backend:', cleanData);

    const response = await apiClient.post<LoginResponse>(
      API_ENDPOINTS.auth.register,
      cleanData as RegisterData
    );

    // Guardar tokens en localStorage y cookies
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));

      // Guardar en cookies para el middleware
      this.setCookie('accessToken', response.accessToken, 1); // 1 día
      this.setCookie('refreshToken', response.refreshToken, 7); // 7 días
    }

    return response;
  }

  /**
   * Logout de usuario
   */
  async logout(): Promise<void> {
    try {
      // Llamar al endpoint de logout (opcional)
      await apiClient.post(API_ENDPOINTS.auth.logout, undefined, true);
    } catch (error) {
      console.error('Error al hacer logout:', error);
    } finally {
      // Limpiar localStorage y cookies
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        // Eliminar cookies
        this.deleteCookie('accessToken');
        this.deleteCookie('refreshToken');
      }
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<string> {
    if (typeof window === 'undefined') {
      throw new Error('No se puede refrescar el token en el servidor');
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No hay refresh token');
    }

    const response = await apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.auth.refresh,
      { refreshToken }
    );

    // Actualizar accessToken en localStorage y cookie
    localStorage.setItem('accessToken', response.accessToken);
    this.setCookie('accessToken', response.accessToken, 1);

    return response.accessToken;
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  async getProfile(): Promise<AuthUser> {
    const response = await apiClient.get<AuthUser>(
      API_ENDPOINTS.auth.profile,
      true
    );

    // Actualizar usuario en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(response));
    }

    return response;
  }

  /**
   * Verificar si el usuario esta autenticado
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  /**
   * Obtener usuario almacenado
   */
  getStoredUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Obtener token almacenado
   */
  getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }
}

export const authService = new AuthService();
