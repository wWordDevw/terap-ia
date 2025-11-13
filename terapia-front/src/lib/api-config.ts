/**
 * Configuracion de API
 */

// Detectar automáticamente el entorno
const getApiBaseUrl = () => {
  // SIEMPRE usar variable de entorno si está definida (tiene prioridad)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Fallback para desarrollo local (solo si no hay variable de entorno)
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
