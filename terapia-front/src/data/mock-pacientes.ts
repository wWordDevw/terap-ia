import type { Paciente } from '@/lib/types';

export const mockPacientes: Paciente[] = [
  {
    id: '1',
    nombre: 'Ana García López',
    numeroClinica: 'P001',
    numeroPaciente: 'P001',
    clinicaId: '1',
    clinicaNombre: 'Centro Terapéutico Valle',
    nacimiento: '1990-05-15',
    ingreso: '2025-09-18',
    discharge: undefined, // Paciente activo
    fechaCancelacion: undefined,
    diagnosticos: [
      { codigo: 'F32.1', descripcion: 'Major Depressive Disorder, single episode, moderate', tipo: 'Primario', activo: true },
      { codigo: 'F41.1', descripcion: 'Generalized Anxiety Disorder', tipo: 'Secundario', activo: true },
      { codigo: 'F60.3', descripcion: 'Borderline Personality Disorder', tipo: 'Secundario', activo: true }
    ],
    goals: [
      'Improve emotional regulation skills through DBT techniques',
      'Develop healthy coping mechanisms for anxiety and depression',
      'Enhance interpersonal relationships and communication skills',
      'Build self-esteem and confidence in daily activities'
    ],
    documentos: [
      {
        id: 'doc1',
        nombre: 'Initial_Assessment_Ana_Garcia.pdf',
        url: '/documents/initial-assessment-ana.pdf',
        fecha: '2025-09-18',
        tipo: 'pdf',
        tamaño: 1024000,
        descripcion: 'Initial psychiatric assessment and intake evaluation',
        subidoPor: 'Dr. Martinez'
      },
      {
        id: 'doc2',
        nombre: 'Medical_History_Ana_Garcia.docx',
        url: '/documents/medical-history-ana.docx',
        fecha: '2025-09-19',
        tipo: 'docx',
        tamaño: 512000,
        descripcion: 'Complete medical and psychiatric history',
        subidoPor: 'Nurse Johnson'
      }
    ],
    firmas: undefined,
    contactoEmergencia: {
      nombre: 'María López (Madre)',
      relacion: 'Mother',
      telefono: '+1-555-0123',
      email: 'maria.lopez@email.com'
    },
    seguro: 'Blue Cross Blue Shield',
    notasAdicionales: 'Patient responds well to group therapy. Has shown significant progress in emotional regulation.',
    notas: []
  },
  {
    id: '2',
    nombre: 'Carlos Mendez Rivera',
    numeroClinica: 'P002',
    numeroPaciente: 'P002',
    clinicaId: '2',
    clinicaNombre: 'Instituto de Salud Mental Integral',
    nacimiento: '1985-03-22',
    ingreso: '2025-09-20',
    discharge: undefined, // Paciente activo
    fechaCancelacion: undefined,
    diagnosticos: [
      { codigo: 'F33.2', descripcion: 'Major Depressive Disorder, recurrent, severe without psychotic features', tipo: 'Primario', activo: true },
      { codigo: 'F10.20', descripcion: 'Alcohol Use Disorder, moderate', tipo: 'Secundario', activo: true }
    ],
    goals: [
      'Maintain sobriety and prevent relapse through structured support',
      'Address underlying depression with evidence-based interventions',
      'Rebuild family relationships damaged by substance abuse',
      'Develop effective stress management and coping techniques'
    ],
    documentos: [
      {
        id: 'doc3',
        nombre: 'Substance_Abuse_Assessment_Carlos.pdf',
        url: '/documents/substance-assessment-carlos.pdf',
        fecha: '2025-09-20',
        tipo: 'pdf',
        tamaño: 890000,
        descripcion: 'Comprehensive substance abuse evaluation and history',
        subidoPor: 'LCSW Thompson'
      }
    ],
    firmas: undefined,
    contactoEmergencia: {
      nombre: 'Elena Mendez (Esposa)',
      relacion: 'Spouse',
      telefono: '+1-555-0456',
      email: 'elena.mendez@email.com'
    },
    seguro: 'Aetna Health Insurance',
    notasAdicionales: '45 days sober upon admission. Highly motivated for recovery. Family support available.',
    notas: []
  },
  {
    id: '3',
    nombre: 'María Rodriguez Santos',
    numeroClinica: 'P003',
    numeroPaciente: 'P003',
    clinicaId: '3',
    clinicaNombre: 'Clínica Psiquiátrica del Norte',
    nacimiento: '1992-11-08',
    ingreso: '2025-09-25',
    discharge: '2025-11-15', // Paciente con discharge programado
    fechaCancelacion: undefined,
    diagnosticos: [
      { codigo: 'F43.10', descripcion: 'Post-traumatic Stress Disorder', tipo: 'Primario', activo: true },
      { codigo: 'F50.00', descripcion: 'Anorexia Nervosa', tipo: 'Secundario', activo: true }
    ],
    goals: [
      'Process traumatic experiences through trauma-focused therapy',
      'Normalize eating patterns and develop healthy food relationships',
      'Build positive self-image and body acceptance',
      'Strengthen support network and family relationships'
    ],
    documentos: [
      {
        id: 'doc4',
        nombre: 'Trauma_Assessment_Maria.pdf',
        url: '/documents/trauma-assessment-maria.pdf',
        fecha: '2025-09-25',
        tipo: 'pdf',
        tamaño: 1200000,
        descripcion: 'PTSD assessment using PCL-5 and clinical interview',
        subidoPor: 'Dr. Williams'
      },
      {
        id: 'doc5',
        nombre: 'Eating_Disorder_Evaluation_Maria.docx',
        url: '/documents/eating-disorder-maria.docx',
        fecha: '2025-09-26',
        tipo: 'docx',
        tamaño: 750000,
        descripcion: 'Comprehensive eating disorder assessment and meal planning',
        subidoPor: 'RD Anderson'
      }
    ],
    firmas: undefined,
    contactoEmergencia: {
      nombre: 'José Rodriguez (Padre)',
      relacion: 'Father',
      telefono: '+1-555-0789',
      email: 'jose.rodriguez@email.com'
    },
    seguro: 'UnitedHealthcare',
    notasAdicionales: 'Making excellent progress. Discharge planned for mid-November with intensive outpatient follow-up.',
    notas: []
  }
];

// Funciones útiles para trabajar con los datos mock
export const getPacienteById = (id: string): Paciente | undefined => {
  return mockPacientes.find(paciente => paciente.id === id);
};

export const getPacientesByIds = (ids: string[]): Paciente[] => {
  return mockPacientes.filter(paciente => ids.includes(paciente.id));
};

export const getPacientesActivos = (): Paciente[] => {
  return mockPacientes.filter(paciente => !paciente.discharge || new Date(paciente.discharge) > new Date());
};

export const getPacientesConAlta = (): Paciente[] => {
  return mockPacientes.filter(paciente => paciente.discharge && new Date(paciente.discharge) <= new Date());
};

export const getPacientesByDiagnostico = (codigoICD: string): Paciente[] => {
  return mockPacientes.filter(paciente => 
    paciente.diagnosticos.some(diag => diag.codigo === codigoICD)
  );
};

export const getPacientesConDocumentos = (): Paciente[] => {
  return mockPacientes.filter(paciente => paciente.documentos.length > 0);
};

// Estadísticas útiles
export const getEstadisticasPacientes = () => {
  const total = mockPacientes.length;
  const activos = getPacientesActivos().length;
  const conAlta = getPacientesConAlta().length;
  const conDocumentos = getPacientesConDocumentos().length;
  
  const diagnosticosMasComunes = mockPacientes
    .flatMap(p => p.diagnosticos)
    .reduce((acc, diag) => {
      acc[diag.codigo] = (acc[diag.codigo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  return {
    total,
    activos,
    conAlta,
    conDocumentos,
    diagnosticosMasComunes,
    promedioDocumentosPorPaciente: Math.round(mockPacientes.reduce((acc, p) => acc + p.documentos.length, 0) / total * 100) / 100
  };
};