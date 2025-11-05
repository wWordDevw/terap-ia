// Application constants

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    PROFILE: '/users/profile',
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
} as const;

export const USER_ROLES = {
  ADMIN: 'admin',
  COORDINATOR: 'coordinator',
  THERAPIST: 'therapist',
} as const;

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 100,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
  },
  FULL_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 255,
  },
  EMAIL: {
    MAX_LENGTH: 100,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} as const;

export const TIPOS_PROGRAMA = {
  PHP: {
    dias: ['lun', 'mar', 'mie', 'jue', 'vie'],
    dobleDia: 'vie',
    nombre: 'PHP',
    descripcion: 'Programa Hospitalario Parcial',
  },
  IOP: {
    dias: ['lun', 'mar', 'mie', 'jue', 'vie'],
    dobleDia: 'jue',
    nombre: 'IOP',
    descripcion: 'Programa Intensivo Ambulatorio',
  },
} as const;

export const TURNOS = {
  MANANA: 'Mañana',
  TARDE: 'Tarde',
} as const;