import type { Grupo, Actividad } from '@/lib/types';

// Simple activity interface for mock data
interface MockActividad {
  codigo: string;
  titulo: string;
  descripcion: string;
  duracion: number;
}

// Mock group interface that uses MockActividad
interface MockGrupo extends Omit<Grupo, 'horarios'> {
  horarios: Record<string, { actividades: MockActividad[] }>;
}

// Helper function to create MockActividad objects
const createActividad = (codigo: string, titulo: string, descripcion: string, duracion: number): MockActividad => ({
  codigo,
  titulo,
  descripcion,
  duracion
});

// Helper function to convert MockActividad to Actividad
const convertToActividad = (mockActividad: MockActividad): Actividad => ({
  id: `mock-${mockActividad.codigo}-${Date.now()}`,
  codigo: mockActividad.codigo,
  titulo: mockActividad.titulo,
  descripcion: mockActividad.descripcion,
  duracion: mockActividad.duracion,
  defaultTime: '09:00',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});

// Helper function to convert MockGrupo to Grupo
const convertToGrupo = (mockGrupo: MockGrupo): Grupo => ({
  ...mockGrupo,
  horarios: Object.fromEntries(
    Object.entries(mockGrupo.horarios).map(([dia, horario]) => [
      dia,
      {
        actividades: horario.actividades.map(convertToActividad)
      }
    ])
  )
});

export const mockGrupos: MockGrupo[] = [
  {
    id: '1',
    clinica: { 
      nombre: 'Centro Terapéutico Valle Verde', 
      logoUrl: '/logos/centro-valle-verde.png' 
    },
    tipo: 'PHP',
    turno: 'Mañana',
    semanaInicio: '2025-10-06', // Lunes actual
    horarios: {
      lun: { 
        actividades: [
          { codigo: 'GS', titulo: 'Group Skills: Communication and Interpersonal Effectiveness', descripcion: 'Focus on building effective communication skills and healthy relationships', duracion: 60 },
          { codigo: 'RT', titulo: 'Recreational Therapy: Creative Expression', descripcion: 'Art and music therapy for emotional expression', duracion: 90 },
          { codigo: 'MT', titulo: 'Mindfulness and Meditation Training', descripcion: 'Developing mindfulness practices for emotional regulation', duracion: 45 }
        ]
      },
      mar: { 
        actividades: [
          createActividad('CB', 'Cognitive Behavioral Therapy: Thought Patterns', 'Identifying and challenging negative thought patterns', 75),
          createActividad('AT', 'Art Therapy: Visual Expression', 'Using art as a medium for processing emotions and trauma', 60),
          createActividad('GR', 'Group Reflection and Processing', 'Peer support and shared experiences discussion', 45)
        ]
      },
      mie: { 
        actividades: [
          { codigo: 'MS', titulo: 'Mindfulness Session: Body Awareness', descripcion: 'Body scan meditation and somatic awareness practices', duracion: 50 },
          { codigo: 'PE', titulo: 'Physical Exercise and Movement Therapy', descripcion: 'Incorporating physical activity for mental health', duracion: 60 },
          { codigo: 'GD', titulo: 'Group Discussion: Recovery Topics', descripcion: 'Structured discussions on recovery and wellness topics', duracion: 75 }
        ]
      },
      jue: { 
        actividades: [
          { codigo: 'ST', titulo: 'Social Training: Relationship Skills', descripcion: 'Practicing social skills and relationship building', duracion: 60 },
          { codigo: 'RP', titulo: 'Relapse Prevention Planning', descripcion: 'Developing personalized relapse prevention strategies', duracion: 90 },
          { codigo: 'GI', titulo: 'Group Integration and Support', descripcion: 'Building group cohesion and peer support networks', duracion: 45 }
        ]
      },
      vie: { 
        actividades: [
          { codigo: 'WR', titulo: 'Weekly Review and Goal Setting', descripcion: 'Reviewing progress and setting goals for the following week', duracion: 60 },
          { codigo: 'PL', titulo: 'Planning Session: Discharge Preparation', descripcion: 'Preparing for transition and aftercare planning', duracion: 75 },
          { codigo: 'GC', titulo: 'Group Closure and Reflection', descripcion: 'Weekly wrap-up and emotional processing', duracion: 45 }
        ]
      }
    },
    pacientesIds: ['1', '2', '3'], // Ana, Carlos, María
    fechaCreacion: '2025-09-15',
    estado: 'Activo'
  },
  {
    id: '2',
    clinica: { 
      nombre: 'Instituto de Salud Mental Horizonte', 
      logoUrl: '/logos/instituto-horizonte.png' 
    },
    tipo: 'IOP',
    turno: 'Tarde',
    semanaInicio: '2025-10-06',
    horarios: {
      lun: { 
        actividades: [
          { codigo: 'DBT', titulo: 'Dialectical Behavior Therapy: Emotion Regulation', descripcion: 'DBT skills training for managing intense emotions', duracion: 90 },
          { codigo: 'PM', titulo: 'Peer Mentorship and Support', descripcion: 'Peer-led support groups and mentorship activities', duracion: 60 },
          { codigo: 'JT', titulo: 'Journaling and Therapeutic Writing', descripcion: 'Using writing as a therapeutic tool for self-reflection', duracion: 45 }
        ]
      },
      mar: { 
        actividades: [
          { codigo: 'FT', titulo: 'Family Therapy: Communication Workshop', descripcion: 'Working with family systems and improving communication', duracion: 75 },
          { codigo: 'SA', titulo: 'Substance Abuse Education and Prevention', descripcion: 'Education about addiction and recovery processes', duracion: 60 },
          { codigo: 'RG', titulo: 'Recovery Group: Sharing and Support', descripcion: 'Open sharing group for recovery experiences', duracion: 90 }
        ]
      },
      mie: { 
        actividades: [
          { codigo: 'TF', titulo: 'Trauma-Focused Therapy: EMDR Preparation', descripcion: 'Preparing for and processing traumatic experiences', duracion: 90 },
          { codigo: 'LS', titulo: 'Life Skills: Daily Living and Independence', descripcion: 'Practical skills for independent living and self-care', duracion: 60 },
          { codigo: 'MG', titulo: 'Meditation Group: Advanced Practices', descripcion: 'Advanced meditation techniques for emotional balance', duracion: 45 }
        ]
      },
      jue: { 
        actividades: [
          { codigo: 'VR', titulo: 'Vocational Rehabilitation: Work Readiness', descripcion: 'Preparing for return to work and career development', duracion: 75 },
          { codigo: 'CS', titulo: 'Coping Skills: Practical Applications', descripcion: 'Learning and practicing various coping strategies', duracion: 60 },
          { codigo: 'EP', titulo: 'Evening Processing and Integration', descripcion: 'End-of-week processing and skill integration', duracion: 90 }
        ]
      }
    },
    pacientesIds: ['4', '5'], // James, Isabella
    fechaCreacion: '2025-09-20',
    estado: 'Activo'
  },
  {
    id: '3',
    clinica: { 
      nombre: 'Centro de Bienestar Mental Serenidad', 
      logoUrl: undefined 
    },
    tipo: 'PHP',
    turno: 'Mañana',
    semanaInicio: '2025-10-06',
    horarios: {
      lun: { 
        actividades: [
          { codigo: 'IP', titulo: 'Individual Therapy Preparation Group', descripcion: 'Preparing for individual therapy sessions', duracion: 60 },
          { codigo: 'NE', titulo: 'Nutrition Education and Meal Planning', descripcion: 'Nutritional counseling and healthy eating habits', duracion: 75 },
          { codigo: 'YT', titulo: 'Yoga Therapy and Mindful Movement', descripcion: 'Combining yoga with therapeutic principles', duracion: 60 }
        ]
      },
      mar: { 
        actividades: [
          { codigo: 'AG', titulo: 'Anger Management: Healthy Expression', descripcion: 'Learning to manage and express anger appropriately', duracion: 90 },
          { codigo: 'SP', titulo: 'Spiritual Practice and Meaning-Making', descripcion: 'Exploring spirituality and personal values', duracion: 45 },
          { codigo: 'SG', titulo: 'Support Group: Shared Experiences', descripcion: 'Peer support for similar diagnoses and experiences', duracion: 75 }
        ]
      },
      mie: { 
        actividades: [
          { codigo: 'BF', titulo: 'Biofeedback Training: Body Awareness', descripcion: 'Using biofeedback for stress and anxiety management', duracion: 60 },
          { codigo: 'OT', titulo: 'Occupational Therapy: Functional Skills', descripcion: 'Improving daily functioning and occupational skills', duracion: 90 },
          { codigo: 'MH', titulo: 'Mental Health Education: Psychoeducation', descripcion: 'Learning about mental health conditions and treatments', duracion: 45 }
        ]
      },
      jue: { 
        actividades: [
          { codigo: 'DT', titulo: 'Drama Therapy: Role Playing and Expression', descripcion: 'Using drama and role-play for therapeutic growth', duracion: 75 },
          { codigo: 'FS', titulo: 'Financial Skills: Money Management', descripcion: 'Practical financial planning and budgeting skills', duracion: 60 },
          { codigo: 'CG', titulo: 'Community Group: Social Integration', descripcion: 'Preparing for community reintegration', duracion: 90 }
        ]
      },
      vie: { 
        actividades: [
          { codigo: 'TP', titulo: 'Treatment Planning: Goal Review', descripcion: 'Reviewing and updating individual treatment goals', duracion: 75 },
          { codigo: 'RS', titulo: 'Recreation and Social Activity', descripcion: 'Structured recreational activities and social interaction', duracion: 60 },
          { codigo: 'WW', titulo: 'Weekly Wrap-up: Achievements and Challenges', descripcion: 'Celebrating progress and addressing challenges', duracion: 45 }
        ]
      }
    },
    pacientesIds: ['6', '7'], // Michael, Sophie
    fechaCreacion: '2025-09-25',
    estado: 'Activo'
  },
  {
    id: '4',
    clinica: { 
      nombre: 'Clínica de Salud Mental Nueva Esperanza', 
      logoUrl: '/logos/nueva-esperanza.png' 
    },
    tipo: 'IOP',
    turno: 'Mañana',
    semanaInicio: '2025-10-06',
    horarios: {
      lun: { 
        actividades: [
          { codigo: 'PP', titulo: 'Psychosis Prevention: Reality Testing', descripcion: 'Skills for managing psychotic symptoms and reality testing', duracion: 90 },
          { codigo: 'SM', titulo: 'Stress Management: Advanced Techniques', descripcion: 'Comprehensive stress reduction and management strategies', duracion: 60 },
          { codigo: 'PH', titulo: 'Personal Hygiene and Self-Care', descripcion: 'Maintaining personal care and hygiene routines', duracion: 45 }
        ]
      },
      mar: { 
        actividades: [
          { codigo: 'MC', titulo: 'Medication Compliance: Education and Support', descripcion: 'Understanding medications and maintaining compliance', duracion: 75 },
          { codigo: 'SI', titulo: 'Social Integration: Community Skills', descripcion: 'Building skills for successful community living', duracion: 90 },
          { codigo: 'CR', titulo: 'Crisis Response: Safety Planning', descripcion: 'Developing crisis response and safety plans', duracion: 60 }
        ]
      },
      mie: { 
        actividades: [
          { codigo: 'CT', titulo: 'Cognitive Training: Executive Function', descripcion: 'Improving cognitive function and executive skills', duracion: 75 },
          { codigo: 'HM', titulo: 'Harm Reduction: Practical Strategies', descripcion: 'Harm reduction approaches for various risk behaviors', duracion: 60 },
          { codigo: 'GF', titulo: 'Group Fitness: Physical and Mental Health', descripcion: 'Physical activity tailored for mental health benefits', duracion: 90 }
        ]
      },
      jue: { 
        actividades: [
          { codigo: 'RT', titulo: 'Reality Testing: Cognitive Restructuring', descripcion: 'Advanced cognitive restructuring and reality testing', duracion: 90 },
          { codigo: 'AP', titulo: 'Aftercare Planning: Transition Preparation', descripcion: 'Comprehensive discharge and aftercare planning', duracion: 75 },
          { codigo: 'GS', titulo: 'Group Synthesis: Weekly Integration', descripcion: 'Integrating the week\'s learning and experiences', duracion: 60 }
        ]
      }
    },
    pacientesIds: ['8'], // David
    fechaCreacion: '2025-10-01',
    estado: 'Activo'
  },
  {
    id: '5',
    clinica: { 
      nombre: 'Centro Terapéutico Armonía', 
      logoUrl: undefined 
    },
    tipo: 'PHP',
    turno: 'Tarde',
    semanaInicio: '2025-09-30',
    horarios: {
      lun: { 
        actividades: [
          { codigo: 'GT', titulo: 'Group Therapy: Process and Insight', descripcion: 'Traditional group therapy focusing on insight and process', duracion: 90 },
          { codigo: 'EF', titulo: 'Expressive Arts: Emotional Freedom', descripcion: 'Using various art forms for emotional expression', duracion: 60 },
          { codigo: 'MW', titulo: 'Mindful Walking: Nature Therapy', descripcion: 'Outdoor mindfulness practice and nature connection', duracion: 45 }
        ]
      },
      mar: { 
        actividades: [
          { codigo: 'PT', titulo: 'Pet Therapy: Animal-Assisted Healing', descripcion: 'Therapeutic interactions with trained therapy animals', duracion: 60 },
          { codigo: 'MU', titulo: 'Music Therapy: Sound and Healing', descripcion: 'Using music for therapeutic and emotional healing', duracion: 75 },
          { codigo: 'JM', titulo: 'Journaling and Memory Work', descripcion: 'Therapeutic writing and memory processing', duracion: 90 }
        ]
      },
      mie: { 
        actividades: [
          { codigo: 'BT', titulo: 'Breathing Techniques: Anxiety Management', descripcion: 'Advanced breathing techniques for anxiety and stress', duracion: 45 },
          { codigo: 'IG', titulo: 'Insight Group: Deep Processing', descripcion: 'Deep psychological insight and self-understanding', duracion: 90 },
          { codigo: 'HT', titulo: 'Horticulture Therapy: Growth and Nurturing', descripcion: 'Gardening and plant care as therapeutic activity', duracion: 60 }
        ]
      },
      jue: { 
        actividades: [
          { codigo: 'FF', titulo: 'Family Focus: Relationship Healing', descripcion: 'Working on family relationships and communication', duracion: 75 },
          { codigo: 'SP', titulo: 'Spiritual Practice: Inner Peace', descripcion: 'Exploring spirituality and inner peace practices', duracion: 60 },
          { codigo: 'CP', titulo: 'Creative Projects: Collaborative Art', descripcion: 'Group creative projects and collaborative expression', duracion: 90 }
        ]
      },
      vie: { 
        actividades: [
          { codigo: 'LR', titulo: 'Life Review: Past, Present, Future', descripcion: 'Comprehensive life review and future planning', duracion: 90 },
          { codigo: 'GG', titulo: 'Gratitude Group: Positive Psychology', descripcion: 'Practicing gratitude and positive psychology principles', duracion: 45 },
          { codigo: 'CC', titulo: 'Community Circle: Shared Wisdom', descripcion: 'Sharing wisdom and supporting each other\'s journey', duracion: 75 }
        ]
      }
    },
    pacientesIds: [], // Grupo sin pacientes asignados aún
    fechaCreacion: '2025-09-28',
    estado: 'Activo'
  },
  {
    id: '6',
    clinica: { 
      nombre: 'Centro Valle Verde - Unidad Especializada', 
      logoUrl: '/logos/centro-valle-verde.png' 
    },
    tipo: 'PHP',
    turno: 'Mañana',
    semanaInicio: '2025-09-23',
    horarios: {
      lun: { 
        actividades: [
          { codigo: 'OG', titulo: 'Orientation Group: Program Introduction', descripcion: 'Introduction to program structure and expectations', duracion: 60 }
        ]
      },
      mar: { 
        actividades: [
          { codigo: 'BG', titulo: 'Basic Group: Fundamental Skills', descripcion: 'Basic therapeutic skills and group participation', duracion: 90 }
        ]
      },
      mie: { 
        actividades: [
          { codigo: 'SG', titulo: 'Skills Group: Practical Applications', descripcion: 'Practical application of learned therapeutic skills', duracion: 75 }
        ]
      },
      jue: { 
        actividades: [
          { codigo: 'PG', titulo: 'Progress Group: Goal Achievement', descripcion: 'Reviewing progress toward individual goals', duracion: 60 }
        ]
      },
      vie: { 
        actividades: [
          { codigo: 'CG', titulo: 'Closure Group: Weekly Summary', descripcion: 'Weekly closure and preparation for following week', duracion: 45 }
        ]
      }
    },
    pacientesIds: [],
    fechaCreacion: '2025-08-15',
    estado: 'Archivado' // Grupo archivado
  }
];

// Funciones utilitarias para trabajar con grupos
export const getGrupoById = (id: string): Grupo | undefined => {
  const mockGrupo = mockGrupos.find(grupo => grupo.id === id);
  return mockGrupo ? convertToGrupo(mockGrupo) : undefined;
};

export const getGruposActivos = (): Grupo[] => {
  return mockGrupos
    .filter(grupo => grupo.estado === 'Activo')
    .map(convertToGrupo);
};

export const getGruposArchivados = (): Grupo[] => {
  return mockGrupos
    .filter(grupo => grupo.estado === 'Archivado')
    .map(convertToGrupo);
};

export const getGruposByTipo = (tipo: 'PHP' | 'IOP'): Grupo[] => {
  return mockGrupos
    .filter(grupo => grupo.tipo === tipo)
    .map(convertToGrupo);
};

export const getGruposByTurno = (turno: 'Mañana' | 'Tarde'): Grupo[] => {
  return mockGrupos
    .filter(grupo => grupo.turno === turno)
    .map(convertToGrupo);
};

export const getGruposConPacientes = (): Grupo[] => {
  return mockGrupos
    .filter(grupo => grupo.pacientesIds.length > 0)
    .map(convertToGrupo);
};

export const getGruposSinPacientes = (): Grupo[] => {
  return mockGrupos
    .filter(grupo => grupo.pacientesIds.length === 0)
    .map(convertToGrupo);
};

export const searchGrupos = (searchTerm: string): Grupo[] => {
  const term = searchTerm.toLowerCase();
  return mockGrupos
    .filter(grupo => 
      grupo.clinica.nombre.toLowerCase().includes(term) ||
      grupo.tipo.toLowerCase().includes(term) ||
      grupo.turno.toLowerCase().includes(term)
    )
    .map(convertToGrupo);
};

// Estadísticas de grupos
export const getEstadisticasGrupos = () => {
  const total = mockGrupos.length;
  const activos = getGruposActivos().length;
  const archivados = getGruposArchivados().length;
  const php = getGruposByTipo('PHP').length;
  const iop = getGruposByTipo('IOP').length;
  const manana = getGruposByTurno('Mañana').length;
  const tarde = getGruposByTurno('Tarde').length;
  const conPacientes = getGruposConPacientes().length;
  const sinPacientes = getGruposSinPacientes().length;

  const totalPacientes = mockGrupos.reduce((acc, grupo) => acc + grupo.pacientesIds.length, 0);
  const promedioPacientesPorGrupo = totalPacientes > 0 ? Math.round(totalPacientes / conPacientes * 100) / 100 : 0;

  const totalActividades = mockGrupos.reduce((acc, grupo) => {
    return acc + Object.values(grupo.horarios).reduce((diaAcc, dia) => diaAcc + dia.actividades.length, 0);
  }, 0);

  return {
    total,
    activos,
    archivados,
    php,
    iop,
    manana,
    tarde,
    conPacientes,
    sinPacientes,
    totalPacientes,
    promedioPacientesPorGrupo,
    totalActividades,
    promedioActividadesPorGrupo: Math.round(totalActividades / total * 100) / 100
  };
};

// Función para obtener actividades de un día específico de un grupo
export const getActividadesByDia = (grupoId: string, dia: string) => {
  const grupo = getGrupoById(grupoId);
  if (!grupo || !grupo.horarios[dia]) return [];
  return grupo.horarios[dia].actividades;
};

// Función para obtener el total de unidades de un grupo por día
export const getUnidadesByDia = (grupoId: string, dia: string): number => {
  const actividades = getActividadesByDia(grupoId, dia);
  return actividades.reduce((total, actividad) => total + (actividad.duracion || 60) / 60, 0);
};