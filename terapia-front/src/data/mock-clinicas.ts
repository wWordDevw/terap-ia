import type { Clinica } from '@/lib/types';

export const mockClinicas: Clinica[] = [
  {
    id: '1',
    nombre: 'Centro Terapéutico Valle',
    direccion: 'Av. Principal 123, Ciudad de México',
    telefono: '+52-55-1234-5678',
    email: 'info@centrovalle.com',
    logoUrl: '/logos/centro-valle.png',
    activa: true,
    fechaCreacion: '2020-01-15',
  },
  {
    id: '2',
    nombre: 'Instituto de Salud Mental Integral',
    direccion: 'Calle Reforma 456, Guadalajara',
    telefono: '+52-33-9876-5432',
    email: 'contacto@ismi.com.mx',
    logoUrl: '/logos/ismi.png',
    activa: true,
    fechaCreacion: '2019-06-20',
  },
  {
    id: '3',
    nombre: 'Clínica Psiquiátrica del Norte',
    direccion: 'Blvd. Norte 789, Monterrey',
    telefono: '+52-81-5555-1234',
    email: 'admin@clinicanorte.com',
    logoUrl: '/logos/clinica-norte.png',
    activa: true,
    fechaCreacion: '2021-03-10',
  },
  {
    id: '4',
    nombre: 'Centro de Rehabilitación Psicosocial',
    direccion: 'Av. Universidad 321, Puebla',
    telefono: '+52-222-3333-4444',
    email: 'info@rehabpsicosocial.com',
    logoUrl: '/logos/rehab-psicosocial.png',
    activa: true,
    fechaCreacion: '2018-11-05',
  },
  {
    id: '5',
    nombre: 'Hospital Psiquiátrico San José',
    direccion: 'Calle San José 654, Tijuana',
    telefono: '+52-664-7777-8888',
    email: 'contacto@hpsanjose.com',
    logoUrl: '/logos/hospital-san-jose.png',
    activa: true,
    fechaCreacion: '2017-08-12',
  },
];

// Funciones útiles para trabajar con clínicas
export const getClinicaById = (id: string): Clinica | undefined => {
  return mockClinicas.find(clinica => clinica.id === id);
};

export const getClinicasActivas = (): Clinica[] => {
  return mockClinicas.filter(clinica => clinica.activa);
};

export const getClinicasByNombre = (nombre: string): Clinica[] => {
  return mockClinicas.filter(clinica => 
    clinica.nombre.toLowerCase().includes(nombre.toLowerCase())
  );
};
