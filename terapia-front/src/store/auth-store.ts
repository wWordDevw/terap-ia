/**
 * Store de Autenticacion usando Zustand
 */

import { create } from 'zustand';
import { authService, AuthUser, LoginCredentials, RegisterData } from '@/lib/services/auth-service';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  loadUserFromStorage: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /**
   * Login de usuario
   */
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al iniciar sesion',
      });
      throw error;
    }
  },

  /**
   * Registro de usuario
   */
  register: async (data: RegisterData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Error al registrar usuario',
      });
      throw error;
    }
  },

  /**
   * Logout de usuario
   */
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      // Aunque falle el logout en el servidor, limpiamos el estado local
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  /**
   * Refresh token
   */
  refreshToken: async () => {
    try {
      await authService.refreshToken();
      // El token se actualiza automaticamente en el servicio
    } catch (error) {
      // Si falla el refresh, hacemos logout
      set({
        user: null,
        isAuthenticated: false,
        error: 'Sesion expirada',
      });
    }
  },

  /**
   * Cargar usuario desde localStorage
   */
  loadUserFromStorage: () => {
    const user = authService.getStoredUser();
    const isAuthenticated = authService.isAuthenticated();
    set({
      user,
      isAuthenticated,
    });
  },

  /**
   * Limpiar error
   */
  clearError: () => {
    set({ error: null });
  },
}));
