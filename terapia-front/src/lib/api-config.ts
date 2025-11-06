/**
 * Configuracion de API
 */

// Detectar automáticamente el entorno
const getApiBaseUrl = () => {
  // Si hay variable de entorno definida, usarla
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // En el cliente (navegador), detectar automáticamente
  if (typeof window !== 'undefined') {
    // Si estamos en producción (no localhost), usar ruta relativa
    if (!window.location.hostname.includes('localhost') &&
        !window.location.hostname.includes('127.0.0.1')) {
      return '/api/v1';
    }
  }

  // Fallback para desarrollo
  return 'http://localhost:3100/api/v1';
};

export const API_CONFIG = {
  baseURL: getApiBaseUrl(),
  timeout: 10000,
};

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
    logout: '/auth/logout',
  },
  users: {
    base: '/users',
    byId: (id: string) => `/users/${id}`,
  },
  patients: {
    base: '/patients',
    byId: (id: string) => `/patients/${id}`,
  },
  groups: {
    base: '/groups',
    byId: (id: string) => `/groups/${id}`,
  },
  notes: {
    base: '/notes',
    byId: (id: string) => `/notes/${id}`,
  },
};
