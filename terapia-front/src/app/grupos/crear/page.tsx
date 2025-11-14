'use client';

import { useState, useEffect } from 'react';

// Forzar renderizado dinámico para evitar prerenderizado (requiere AuthProvider)
export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X, Info, Save, Users, FileText, Calendar } from 'lucide-react';
import { TIPOS_PROGRAMA } from '@/lib/constants';
import { generateId } from '@/lib/utils';
import { getUsuariosActivos } from '@/data/mock-usuarios';
import type { Grupo, Actividad, Usuario } from '@/lib/types';
import Badge from '@/components/ui/bagde';
import UsuarioSelector from '@/components/grupos/usuario-selector';
import TerapeutaSelector from '@/components/grupos/terapeuta-selector';
import NotasFecha from '@/components/grupos/notas-fecha';
import ActiveGroupsCounter from '@/components/grupos/active-groups-counter';
import { useToast } from '@/components/providers/toast-provider';
import { useAuthStore } from '@/store/auth-store';
import { groupsService, ProgramType, Shift, DayOfWeek, type CreateGroupDto, type CreateGroupScheduleDto } from '@/lib/services/groups-service';
import { clinicsService, type Clinic } from '@/lib/services/clinics-service';
import { activitiesService, type Activity } from '@/lib/services/activities-service';
import ActivitySearch from '@/components/ui/activity-search';

// Tipos para actividades sugeridas
interface ActividadSugerida {
  codigo: string;
  titulo: string;
  descripcion: string;
}

const ACTIVIDADES_SUGERIDAS: ActividadSugerida[] = [
  { codigo: 'GS', titulo: 'Group Skills: Communication', descripcion: 'Habilidades de comunicación en grupo' },
  { codigo: 'CB', titulo: 'Cognitive Behavioral Therapy', descripcion: 'Terapia cognitivo conductual' },
  { codigo: 'RT', titulo: 'Recreational Therapy', descripcion: 'Terapia recreacional' },
  { codigo: 'MT', titulo: 'Music Therapy', descripcion: 'Terapia musical' },
  { codigo: 'AT', titulo: 'Art Therapy', descripcion: 'Terapia artística' },
  { codigo: 'PT', titulo: 'Physical Therapy', descripcion: 'Terapia física' },
  { codigo: 'ST', titulo: 'Speech Therapy', descripcion: 'Terapia del habla' },
  { codigo: 'OT', titulo: 'Occupational Therapy', descripcion: 'Terapia ocupacional' }
];

// Variantes de animación
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function CrearGrupoPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { user } = useAuthStore();
  
  // Determinar si el usuario es admin
  const isAdmin = user?.role === 'admin';
  
  // Horarios por turno
  const HORARIOS_TURNO = {
    'Mañana': [
      { startTime: '08:00', endTime: '09:00' },
      { startTime: '09:05', endTime: '10:05' },
      { startTime: '10:20', endTime: '11:20' },
      { startTime: '11:25', endTime: '12:25' }
    ],
    'Tarde': [
      { startTime: '13:00', endTime: '14:00' },
      { startTime: '14:05', endTime: '15:05' },
      { startTime: '15:20', endTime: '16:20' },
      { startTime: '16:25', endTime: '17:25' }
    ]
  };

  // Estados principales
  const [formData, setFormData] = useState<Partial<Grupo> & {
    nombre?: string;
    fechaFin?: string;
    terapeutaId?: string;
  }>({
    nombre: '',
    tipo: undefined,
    turno: undefined,
    semanaInicio: '',
    fechaFin: '',
    horarios: {},
    terapeutaId: user?.id || '', // Asignar automáticamente el terapeuta logueado
    pacientesIds: [],
    estado: 'Activo'
  });
  
  const [selectedClinicId, setSelectedClinicId] = useState<string>('');
  const [terapeutaSeleccionado, setTerapeutaSeleccionado] = useState<string | null>(user?.id || null);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mostrarNotas, setMostrarNotas] = useState(false);
  
  // Estados para clínicas
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoadingClinics, setIsLoadingClinics] = useState(true);
  
  // Estados para actividades
  const [actividadesBackend, setActividadesBackend] = useState<Activity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  // Cargar clínicas al montar el componente
  useEffect(() => {
    const cargarClinicas = async () => {
      try {
        setIsLoadingClinics(true);
        const clinicasData = await clinicsService.getAll();
        setClinics(clinicasData);
      } catch (error) {
        console.error('Error al cargar clínicas:', error);
        addToast('Error al cargar las clínicas', 'error');
      } finally {
        setIsLoadingClinics(false);
      }
    };

    cargarClinicas();
  }, []); // Dependencias vacías para evitar ciclos infinitos

  // Cargar actividades filtradas por tipo de programa
  useEffect(() => {
    const cargarActividades = async () => {
      // Si no hay tipo de programa seleccionado, limpiar actividades
      if (!formData.tipo) {
        setActividadesBackend([]);
        return;
      }

      try {
        setIsLoadingActivities(true);
        console.log(`Cargando actividades del backend para ${formData.tipo}...`);
        const actividadesData = await activitiesService.getBasic(formData.tipo as 'PHP' | 'IOP', false);
        console.log(`Actividades ${formData.tipo} cargadas:`, actividadesData);
        setActividadesBackend(actividadesData);
      } catch (error) {
        console.error('Error al cargar actividades:', error);
        addToast(`Error al cargar las actividades ${formData.tipo}`, 'error');
        setActividadesBackend([]);
      } finally {
        setIsLoadingActivities(false);
      }
    };

    cargarActividades();
  }, [formData.tipo]); // Recargar cuando cambie el tipo de programa

  // Calcular días disponibles basados en el tipo de programa
  const diasDisponibles = formData.tipo ? TIPOS_PROGRAMA[formData.tipo].dias : [];
  
  // Debug: Log del estado de actividades
  console.log('Estado de actividades:', {
    isLoadingActivities,
    actividadesBackend: actividadesBackend.length,
    actividadesBackendData: actividadesBackend
  });

  // Convertir actividad sugerida a Actividad
  const convertirAActividad = (actividad: ActividadSugerida): Actividad => ({
    id: generateId(),
    codigo: actividad.codigo,
    titulo: actividad.titulo,
    descripcion: actividad.descripcion || '',
    duracion: 60,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Crear 4 actividades vacías para un día
  const crearActividadesVacias = () => {
    return Array.from({ length: 4 }, () => ({
      id: generateId(),
      codigo: '',
      titulo: '',
      descripcion: '',
      duracion: 60,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));
  };

  // Manejar cambio de tipo de programa
  const handleTipoChange = (tipo: 'PHP' | 'IOP') => {
    const diasTipo = TIPOS_PROGRAMA[tipo].dias;
    const horariosIniciales: Record<string, { actividades: Actividad[] }> = {};
    
    diasTipo.forEach(dia => {
      horariosIniciales[dia] = {
        actividades: crearActividadesVacias()
      };
    });

    setFormData(prev => ({
      ...prev,
      tipo,
      horarios: horariosIniciales
    }));
    
    // Limpiar actividades del backend al cambiar tipo - se recargarán automáticamente por el useEffect
    setActividadesBackend([]);
  };

  // Agregar nueva actividad
  const agregarActividad = (dia: string) => {
    const nuevaActividad: Actividad = {
      id: generateId(),
      codigo: '',
      titulo: '',
      descripcion: '',
      duracion: 60,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setFormData(prev => ({
      ...prev,
      horarios: {
        ...prev.horarios,
        [dia]: {
          actividades: [...(prev.horarios?.[dia]?.actividades || []), nuevaActividad]
        }
      }
    }));
  };

  // Actualizar actividad existente
  const actualizarActividad = (dia: string, index: number, campo: keyof Actividad, valor: string | number) => {
    setFormData(prev => ({
      ...prev,
      horarios: {
        ...prev.horarios,
        [dia]: {
          actividades: prev.horarios?.[dia]?.actividades.map((act, i) =>
            i === index ? { ...act, [campo]: valor } : act
          ) || []
        }
      }
    }));
  };

  // Eliminar actividad
  const eliminarActividad = (dia: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      horarios: {
        ...prev.horarios,
        [dia]: {
          actividades: prev.horarios?.[dia]?.actividades.filter((_, i) => i !== index) || []
        }
      }
    }));
  };

  // Usar actividad sugerida (del backend)
  const usarActividadSugerida = (dia: string, index: number, actividad: Activity) => {
    actualizarActividad(dia, index, 'titulo', actividad.activityName);
    actualizarActividad(dia, index, 'descripcion', actividad.description || '');
    actualizarActividad(dia, index, 'id', actividad.id); // ✅ Agregar el UUID de la actividad
    // No necesitamos código - el backend solo usa el ID
  };

  // Validar formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.nombre || formData.nombre.trim() === '') {
      nuevosErrores.nombre = 'Debe ingresar un nombre para el grupo';
    }

    if (!selectedClinicId) {
      nuevosErrores.clinica = 'Debe seleccionar una clínica';
    }

    if (!formData.tipo) {
      nuevosErrores.tipo = 'Debe seleccionar un tipo de programa';
    }

    if (!formData.turno) {
      nuevosErrores.turno = 'Debe seleccionar un turno';
    }

    if (!formData.semanaInicio) {
      nuevosErrores.semanaInicio = 'La fecha de inicio es requerida';
    }

    // Validar que todos los días tengan al menos una actividad
    if (formData.tipo && formData.horarios) {
      const diasTipo = TIPOS_PROGRAMA[formData.tipo].dias;
      diasTipo.forEach(dia => {
        const actividades = formData.horarios?.[dia]?.actividades || [];
        if (actividades.length === 0) {
          nuevosErrores[`horarios_${dia}`] = `Debe agregar al menos una actividad para ${dia}`;
        }

        // No validar código - el backend solo necesita el ID de la actividad
      });
    }

    setErrors(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      addToast('Por favor completa todos los campos requeridos', 'warning');
    }

    return Object.keys(nuevosErrores).length === 0;
  };

  // Mapear día del formulario a DayOfWeek
  const mapearDiaADayOfWeek = (dia: string): DayOfWeek => {
    const mapeo: Record<string, DayOfWeek> = {
      'lun': DayOfWeek.MONDAY,
      'mar': DayOfWeek.TUESDAY,
      'mie': DayOfWeek.WEDNESDAY,
      'jue': DayOfWeek.THURSDAY,
      'vie': DayOfWeek.FRIDAY,
      'sab': DayOfWeek.SATURDAY,
      'dom': DayOfWeek.SUNDAY,
    };
    
    return mapeo[dia] || DayOfWeek.MONDAY;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    if (!selectedClinicId) {
      addToast('Debes seleccionar una clínica', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Verificar límite de grupos activos
      if (!canCreateNew) {
        addToast('Ya tienes el máximo de grupos activos permitidos', 'error');
        setIsSubmitting(false);
        return;
      }

      // Mapear horarios a schedules - se crearán después de crear el grupo
      // Por ahora solo preparamos los datos pero no los enviamos en el DTO inicial
      const schedules: Omit<CreateGroupScheduleDto, 'groupId'>[] = [];
      console.log('Mapeando horarios:', formData.horarios);
      const horariosTurno = formData.turno ? HORARIOS_TURNO[formData.turno as 'Mañana' | 'Tarde'] : [];
      
      Object.entries(formData.horarios || {}).forEach(([dia, { actividades }]) => {
        console.log(`Día ${dia}:`, actividades);
        actividades.forEach((actividad, index) => {
          console.log(`Actividad ${index}:`, actividad);
          if (actividad.id && actividad.titulo.trim() !== '' && actividad.id.length > 10) { // Solo actividades del backend con ID válido
            const horario = horariosTurno[index] || horariosTurno[0]; // Fallback al primer horario

            schedules.push({
              dayOfWeek: mapearDiaADayOfWeek(dia),
              activityId: actividad.id,
              startTime: horario.startTime,
              endTime: horario.endTime,
              units: 1 // 1 unidad por actividad
            });
          } else {
            console.warn(`Actividad vacía o sin ID del backend:`, actividad);
          }
        });
      });
      console.log('Schedules finales (sin groupId):', schedules);

      // Preparar datos para el API
      const createGroupDto: CreateGroupDto = {
        groupName: formData.nombre,
        clinicId: selectedClinicId,
        programType: formData.tipo as ProgramType,
        shift: formData.turno as Shift,
        startDate: formData.semanaInicio!,
        endDate: formData.fechaFin || undefined,
        terapeutaId: formData.terapeutaId!,
        pacientesIds: usuariosSeleccionados,
        // Enviar array vacío en lugar de undefined
        schedules: []
      };

      console.log('🔍 Datos del grupo a crear:', {
        groupName: createGroupDto.groupName,
        clinicId: createGroupDto.clinicId,
        programType: createGroupDto.programType,
        shift: createGroupDto.shift,
        startDate: createGroupDto.startDate,
        endDate: createGroupDto.endDate,
        terapeutaId: createGroupDto.terapeutaId,
        pacientesIds: createGroupDto.pacientesIds,
        schedulesCount: createGroupDto.schedules?.length || 0
      });

      console.log('🔍 CreateGroupDto completo:', JSON.stringify(createGroupDto, null, 2));

      console.log('🔍 Usuario actual:', {
        id: user?.id,
        fullName: user?.fullName,
        role: user?.role
      });

      console.log('🔍 Terapeuta ID en formData:', formData.terapeutaId);
      console.log('🔍 Terapeuta seleccionado:', terapeutaSeleccionado);

      // Crear grupo en el backend
      console.log('🚀 Enviando petición al backend...');
      const grupoCreado = await groupsService.create(createGroupDto);
      console.log('✅ Grupo creado exitosamente:', grupoCreado);

      // TODO: Aquí se podrían agregar los schedules y pacientes si el backend lo requiere
      // Por ahora solo creamos el grupo básico

      addToast('¡Grupo creado exitosamente!', 'success');
      router.push('/grupos');
    } catch (error: any) {
      console.error('❌ Error al guardar:', error);
      console.error('❌ Error details:', {
        message: error?.message,
        status: error?.response?.status,
        data: error?.response?.data,
        stack: error?.stack
      });
      
      // ✅ NUEVO: Manejar error específico de límite de grupos
      if (error?.response?.status === 400 && 
          error?.response?.data?.message?.includes('más de 2 grupos activos')) {
        addToast(
          'Ya tienes 2 grupos activos. Debes desactivar un grupo antes de crear uno nuevo.',
          'error'
        );
      } else if (error?.message?.includes('No tienes permisos')) {
        // Si el grupo se creó pero hay un error de permisos, verificar si realmente se creó
        console.log('🔍 Verificando si el grupo se creó a pesar del error de permisos...');
        
        // Esperar un momento y verificar si el grupo aparece en la lista
        setTimeout(async () => {
          try {
            const grupos = await groupsService.getAll();
            const grupoCreado = grupos.find(g => g.clinica.nombre === formData.nombre);
            
            if (grupoCreado) {
              console.log('✅ Grupo encontrado en la lista:', grupoCreado);
              addToast('¡Grupo creado exitosamente!', 'success');
              router.push('/grupos');
            } else {
              console.log('❌ Grupo no encontrado en la lista');
              addToast(
                'Error al crear el grupo. Por favor intenta nuevamente.',
                'error'
              );
            }
          } catch (verifyError) {
            console.error('Error al verificar grupo:', verifyError);
            addToast(
              'Error al verificar el grupo. Por favor revisa la lista de grupos.',
              'warning'
            );
            router.push('/grupos');
          }
        }, 1000);
        
        return; // No ejecutar el resto del catch
      } else {
        const errorMessage = error instanceof Error
          ? error.message
          : 'Error al crear el grupo. Por favor intenta nuevamente.';
        addToast(errorMessage, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar cambio de terapeuta
  const handleTerapeutaChange = (terapeutaId: string | null) => {
    console.log('🔍 Cambiando terapeuta:', terapeutaId);
    setTerapeutaSeleccionado(terapeutaId);
    setFormData(prev => ({
      ...prev,
      terapeutaId: terapeutaId || ''
    }));
  };

  // Manejar cambio de usuarios
  const handleUsuariosChange = (usuarios: string[]) => {
    setUsuariosSeleccionados(usuarios);
    setFormData(prev => ({
      ...prev,
      pacientesIds: usuarios
    }));
  };

  // Manejar cambio de notas
  const handleNotasChange = (notas: any) => {
    // TODO: Implementar manejo de notas
    console.log('Notas cambiadas:', notas);
  };

  // Obtener datos de usuarios seleccionados
  const usuariosSeleccionadosData = usuariosSeleccionados.map(id => 
    getUsuariosActivos().find(u => u.id === id)
  ).filter(Boolean) as Usuario[];

  // Obtener todas las actividades de todos los días
  const todasLasActividades = Object.values(formData.horarios || {})
    .flatMap(horario => horario.actividades);

  // Datos estáticos para evitar ciclos infinitos
  const canCreateNew = true; // Siempre permitir crear grupos

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900 dark:text-gray-100" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Crear Nuevo Grupo</h1>
        </div>
      </motion.div>

      {/* Contador de grupos activos */}
      <motion.div
        className="mb-6"
        variants={itemVariants}
      >
        <ActiveGroupsCounter showAlert={true} />
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Información Básica</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre del Grupo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nombre || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej: Grupo PHP Mañana - Enero 2025"
                className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100 ${
                  errors.nombre ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Clínica <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClinicId}
                onChange={(e) => {
                  setSelectedClinicId(e.target.value);
                  const selectedClinic = clinics.find(c => c.id === e.target.value);
                  if (selectedClinic) {
                    setFormData(prev => ({
                      ...prev,
                      clinica: { nombre: selectedClinic.clinicName, logoUrl: selectedClinic.logoUrl }
                    }));
                  }
                }}
                disabled={isLoadingClinics}
                className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100 ${
                  errors.clinica ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                } ${isLoadingClinics ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">
                  {isLoadingClinics ? 'Cargando clínicas...' : 'Seleccionar clínica'}
                </option>
                {clinics.map(clinic => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.clinicName}
                  </option>
                ))}
              </select>
              {errors.clinica && (
                <p className="mt-1 text-sm text-red-600">{errors.clinica}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Inicio <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.semanaInicio || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, semanaInicio: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100 ${
                  errors.semanaInicio ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.semanaInicio && (
                <p className="mt-1 text-sm text-red-600">{errors.semanaInicio}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Programa <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                {Object.keys(TIPOS_PROGRAMA).map(tipo => (
                  <button
                    key={tipo}
                    type="button"
                    onClick={() => handleTipoChange(tipo as 'PHP' | 'IOP')}
                    className={`px-6 py-3 border-2 rounded-lg transition-all duration-200 font-medium ${
                      formData.tipo === tipo
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold">{tipo}</span>
                      {formData.tipo === tipo && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="text-xs mt-1 opacity-75">
                      {tipo === 'PHP' ? 'Programa Hospitalario Parcial' : 'Programa Intensivo Ambulatorio'}
                    </div>
                  </button>
                ))}
              </div>
              {formData.tipo && (
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-800 dark:text-blue-300">
                      {formData.tipo === 'PHP' 
                        ? 'PHP: Programa Hospitalario Parcial - 5 días por semana'
                        : 'IOP: Programa Intensivo Ambulatorio - 3 días por semana'
                      }
                    </span>
                  </div>
                </div>
              )}
              {errors.tipo && (
                <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Turno <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.turno || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, turno: e.target.value as 'Mañana' | 'Tarde' }))}
                className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100 ${
                  errors.turno ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Seleccionar turno</option>
                {['Mañana', 'Tarde'].map(turno => (
                  <option key={turno} value={turno}>{turno}</option>
                ))}
              </select>
              {errors.turno && (
                <p className="mt-1 text-sm text-red-600">{errors.turno}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Selección de terapeuta y pacientes */}
        <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Personal del Grupo</span>
          </h2>

          {/* Selección de terapeuta - Solo para admin */}
          {isAdmin ? (
            <div className="mb-6">
              <TerapeutaSelector
                terapeutaSeleccionado={terapeutaSeleccionado}
                onTerapeutaChange={handleTerapeutaChange}
              />
            </div>
          ) : (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
                Terapeuta a Cargo
              </h3>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {user?.fullName || user?.username || 'Usuario actual'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Separador */}
          <div className="border-t border-gray-200 dark:border-gray-700 mb-6"></div>

          {/* Selección de pacientes */}
          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-4">
              Pacientes del Grupo
            </h3>

            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-medium mb-1">Selecciona los pacientes para este grupo</p>
                  <p>Puedes seleccionar múltiples pacientes. No hay un número específico requerido - elige los pacientes que participarán en este grupo de terapia.</p>
                </div>
              </div>
            </div>

            <UsuarioSelector
              usuariosSeleccionados={usuariosSeleccionados}
              onUsuariosChange={handleUsuariosChange}
            />

            {usuariosSeleccionados.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-800 dark:text-blue-300">
                    {usuariosSeleccionados.length} paciente(s) seleccionado(s).
                    Podrás agregar notas por fecha una vez que configures las actividades.
                  </span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Mensaje informativo para actividades */}
        {!formData.tipo && (
          <motion.div className="glass-card rounded-lg p-6 border-2 border-dashed border-gray-300 dark:border-gray-600" variants={itemVariants}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Configuración de Actividades
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Selecciona un tipo de programa (PHP o IOP) para configurar las actividades del grupo
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
                <Info className="w-4 h-4" />
                <span>Las actividades aparecerán automáticamente después de seleccionar el tipo</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Configuración de horarios */}
        {formData.tipo ? (
          <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Configuración de Horarios - {formData.tipo}
            </h2>

            {/* Mensaje de carga de actividades */}
            {isLoadingActivities && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-blue-800 dark:text-blue-300">
                    Cargando actividades {formData.tipo}...
                  </span>
                </div>
              </div>
            )}

            {/* Mensaje de error */}
            {!isLoadingActivities && actividadesBackend.length === 0 && formData.tipo && (
              <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-yellow-800 dark:text-yellow-300">
                    No hay actividades disponibles para {formData.tipo}. Por favor, contacta al administrador.
                  </span>
                </div>
              </div>
            )}

            {/* Mensaje de actividades cargadas */}
            {!isLoadingActivities && actividadesBackend.length > 0 && (
              <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-800 dark:text-green-300">
                    {actividadesBackend.length} actividad(es) {formData.tipo} disponible(s)
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {diasDisponibles.map(dia => (
                <div key={dia} className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 capitalize flex items-center space-x-2">
                      <span>{dia}</span>
                      {TIPOS_PROGRAMA[formData.tipo!].dobleDia === dia && (
                        <Badge variant="warning" size="sm">Doble Nota</Badge>
                      )}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formData.turno}
                    </span>
                  </div>

                  {errors[`horarios_${dia}`] && (
                    <p className="text-sm text-red-600 mb-3">{errors[`horarios_${dia}`]}</p>
                  )}

                  <div className="space-y-3">
                    {(formData.horarios?.[dia]?.actividades || []).map((actividad, index) => {
                      const horario = formData.turno ? HORARIOS_TURNO[formData.turno as 'Mañana' | 'Tarde']?.[index] : null;
                      console.log(`🔍 Renderizando actividad ${dia}[${index}]:`, actividad);
                      return (
                        <div key={index} className="grid grid-cols-12 gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                          <div className="col-span-3">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              {index + 1}. {horario?.startTime} - {horario?.endTime}
                            </div>
                          </div>

                          <div className="col-span-9">
                            <ActivitySearch
                              activities={actividadesBackend}
                              onSelect={(activity) => usarActividadSugerida(dia, index, activity)}
                              placeholder="Título de la actividad (opcional)"
                              disabled={isLoadingActivities}
                              className="text-sm"
                              value={actividad.titulo}
                              onChange={(value) => actualizarActividad(dia, index, 'titulo', value)}
                            />
                          </div>

                          {errors[`${dia}_${index}`] && (
                            <div className="col-span-12">
                              <p className="text-xs text-red-600">{errors[`${dia}_${index}`]}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                </div>
              ))}
            </div>
          </motion.div>
        ) : null}

        {/* Notas por fecha */}
        {usuariosSeleccionados.length > 0 && todasLasActividades.length > 0 && (
          <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Notas por Fecha</span>
              </h2>
              <button
                type="button"
                onClick={() => setMostrarNotas(!mostrarNotas)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 text-sm font-medium"
              >
                {mostrarNotas ? 'Ocultar' : 'Mostrar'} Notas
              </button>
            </div>

            {mostrarNotas && (
              <NotasFecha
                usuariosSeleccionados={usuariosSeleccionadosData}
                actividades={todasLasActividades}
                onNotasChange={handleNotasChange}
              />
            )}
          </motion.div>
        )}

        {/* Botones de acción */}
        <motion.div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700" variants={itemVariants}>
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-sidebar-primary text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Crear Grupo</span>
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}
