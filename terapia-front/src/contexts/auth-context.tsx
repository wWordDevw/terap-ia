'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient, type User, type RegisterDto, type LoginDto, type ForgotPasswordDto, type ResetPasswordDto, UserRole } from '@/lib/api';
import { STORAGE_KEYS } from '@/lib/constants';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  forgotPassword: (data: ForgotPasswordDto) => Promise<void>;
  resetPassword: (data: ResetPasswordDto) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Rutas públicas que no requieren autenticación
const PUBLIC_ROUTES = ['/login', '/login/register', '/login/forgot-password', '/login/reset-password'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Cargar usuario desde localStorage al montar
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Verificar si el token sigue siendo válido
          try {
            const profile = await apiClient.getProfile();
            setUser(profile);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
          } catch (error) {
            // Intentar refresh token si el access token es inválido
            try {
              const refreshResponse = await apiClient.refreshToken();
              localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, refreshResponse.accessToken);
              
              // Obtener perfil actualizado
              const profile = await apiClient.getProfile();
              setUser(profile);
              localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(profile));
            } catch (refreshError) {
              // Refresh token también inválido, limpiar datos
              console.error('Refresh token inválido:', refreshError);
              localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
              localStorage.removeItem(STORAGE_KEYS.USER);
              localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
              setUser(null);
            }
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // Redirigir basado en autenticación
  useEffect(() => {
    if (loading) return;

    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

    if (!user && !isPublicRoute) {
      // Usuario no autenticado intentando acceder a ruta privada
      router.push('/login');
    } else if (user && isPublicRoute) {
      // Usuario autenticado intentando acceder a ruta pública
      router.push('/');
    }
  }, [user, loading, pathname, router]);

  const login = async (data: LoginDto) => {
    try {
      const response = await apiClient.login(data);
      
      // Guardar tokens y datos del usuario
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.accessToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      
      if (response.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
      }
      
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      const response = await apiClient.register(data);
      
      // El registro solo retorna el usuario, no tokens
      // Necesitamos hacer login automático después del registro
      const loginResponse = await apiClient.login({
        email: data.email,
        password: data.password,
      });
      
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, loginResponse.accessToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loginResponse.user));
      if (loginResponse.refreshToken) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, loginResponse.refreshToken);
      }
      setUser(loginResponse.user);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const forgotPassword = async (data: ForgotPasswordDto) => {
    try {
      // Nota: Este endpoint no está implementado en tu backend aún
      // await apiClient.forgotPassword(data);
      
      // Simulación temporal hasta que implementes el endpoint
      console.warn('Forgot password endpoint not implemented in backend yet');
      throw new Error('Funcionalidad de recuperación de contraseña no disponible temporalmente');
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  const resetPassword = async (data: ResetPasswordDto) => {
    try {
      // Nota: Este endpoint no está implementado en tu backend aún
      // await apiClient.resetPassword(data);
      
      // Simulación temporal hasta que implementes el endpoint
      console.warn('Reset password endpoint not implemented in backend yet');
      throw new Error('Funcionalidad de restablecimiento de contraseña no disponible temporalmente');
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Limpiar datos locales independientemente del resultado del API
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      setUser(null);
      router.push('/login');
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      // Nota: Este endpoint no está implementado en tu backend aún
      // const updatedUser = await apiClient.updateProfile(userData);
      
      // Simulación temporal - actualizar solo localmente
      console.warn('Update profile endpoint not implemented in backend yet');
      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

