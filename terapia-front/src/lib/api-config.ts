/**
 * Configuracion de API
 */

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
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
