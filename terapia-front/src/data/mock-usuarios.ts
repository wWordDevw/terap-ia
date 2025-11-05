import type { Usuario } from '@/lib/types';

export const mockUsuarios: Usuario[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@terapia.com',
    fullName: 'Dr. María González',
    role: 'admin',
    isActive: true,
    lastLogin: '2025-10-11T08:30:00.000Z',
    clinicId: '1',
    clinic: {
      id: '1',
      name: 'Clínica Central'
    },
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2025-10-11T08:30:00.000Z'
  },
  {
    id: '2',
    username: 'drjohnson',
    email: 'johnson@terapia.com',
    fullName: 'Dr. Robert Johnson',
    role: 'therapist',
    isActive: true,
    lastLogin: '2025-10-10T16:45:00.000Z',
    clinicId: '1',
    clinic: {
      id: '1',
      name: 'Clínica Central'
    },
    createdAt: '2024-02-20T09:00:00.000Z',
    updatedAt: '2025-10-10T16:45:00.000Z'
  },
  {
    id: '3',
    username: 'analopez',
    email: 'ana.lopez@terapia.com',
    fullName: 'Lic. Ana López',
    role: 'therapist',
    isActive: true,
    lastLogin: '2025-10-11T07:15:00.000Z',
    clinicId: '1',
    clinic: {
      id: '1',
      name: 'Clínica Central'
    },
    createdAt: '2024-03-10T11:30:00.000Z',
    updatedAt: '2025-10-11T07:15:00.000Z'
  },
  {
    id: '4',
    username: 'carlosmartinez',
    email: 'carlos.martinez@terapia.com',
    fullName: 'Enf. Carlos Martínez',
    role: 'nurse',
    isActive: true,
    lastLogin: '2025-10-11T06:00:00.000Z',
    clinicId: '1',
    clinic: {
      id: '1',
      name: 'Clínica Central'
    },
    createdAt: '2024-04-05T08:00:00.000Z',
    updatedAt: '2025-10-11T06:00:00.000Z'
  },
  {
    id: '5',
    username: 'sofiarodriguez',
    email: 'sofia.rodriguez@terapia.com',
    fullName: 'Dra. Sofía Rodríguez',
    role: 'therapist',
    isActive: true,
    lastLogin: '2025-10-09T14:20:00.000Z',
    clinicId: '2',
    clinic: {
      id: '2',
      name: 'Clínica Norte'
    },
    createdAt: '2024-05-15T10:00:00.000Z',
    updatedAt: '2025-10-09T14:20:00.000Z'
  },
  {
    id: '6',
    username: 'luisgomez',
    email: 'luis.gomez@terapia.com',
    fullName: 'Enf. Luis Gómez',
    role: 'nurse',
    isActive: true,
    lastLogin: '2025-10-10T18:30:00.000Z',
    clinicId: '2',
    clinic: {
      id: '2',
      name: 'Clínica Norte'
    },
    createdAt: '2024-06-01T09:00:00.000Z',
    updatedAt: '2025-10-10T18:30:00.000Z'
  },
  {
    id: '7',
    username: 'mariaperez',
    email: 'maria.perez@terapia.com',
    fullName: 'Lic. María Pérez',
    role: 'therapist',
    isActive: false,
    lastLogin: '2025-09-15T12:00:00.000Z',
    clinicId: '1',
    clinic: {
      id: '1',
      name: 'Clínica Central'
    },
    createdAt: '2024-07-10T10:30:00.000Z',
    updatedAt: '2025-09-15T12:00:00.000Z'
  },
  {
    id: '8',
    username: 'pedrosanchez',
    email: 'pedro.sanchez@terapia.com',
    fullName: 'Dr. Pedro Sánchez',
    role: 'therapist',
    isActive: true,
    lastLogin: '2025-10-10T15:45:00.000Z',
    clinicId: '1',
    clinic: {
      id: '1',
      name: 'Clínica Central'
    },
    createdAt: '2024-08-20T11:00:00.000Z',
    updatedAt: '2025-10-10T15:45:00.000Z'
  },
  {
    id: '9',
    username: 'lauratorres',
    email: 'laura.torres@terapia.com',
    fullName: 'Enf. Laura Torres',
    role: 'nurse',
    isActive: true,
    lastLogin: '2025-10-11T05:30:00.000Z',
    clinicId: '1',
    clinic: {
      id: '1',
      name: 'Clínica Central'
    },
    createdAt: '2024-09-05T09:30:00.000Z',
    updatedAt: '2025-10-11T05:30:00.000Z'
  },
  {
    id: '10',
    username: 'jorgediaz',
    email: 'jorge.diaz@terapia.com',
    fullName: 'Lic. Jorge Díaz',
    role: 'therapist',
    isActive: false,
    lastLogin: '2025-08-20T10:00:00.000Z',
    clinicId: '2',
    clinic: {
      id: '2',
      name: 'Clínica Norte'
    },
    createdAt: '2024-10-01T08:00:00.000Z',
    updatedAt: '2025-08-20T10:00:00.000Z'
  }
];

export const getUsuariosActivos = (): Usuario[] => {
  return mockUsuarios.filter(usuario => usuario.isActive);
};

export const getUsuarioById = (id: string): Usuario | null => {
  return mockUsuarios.find(usuario => usuario.id === id) || null;
};
