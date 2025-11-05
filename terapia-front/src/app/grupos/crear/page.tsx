'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, X, Info, Save, Users, FileText } from 'lucide-react';
import { TIPOS_PROGRAMA } from '@/lib/constants';
import { generateId } from '@/lib/utils';
import { getUsuariosActivos } from '@/data/mock-usuarios';
import type { Grupo, Actividad, Usuario } from '@/lib/types';
import Badge from '@/components/ui/bagde';
import UsuarioSelector from '@/components/grupos/usuario-selector';
import NotasFecha from '@/components/grupos/notas-fecha';
import ActiveGroupsCounter from '@/components/grupos/active-groups-counter';
import { useToast } from '@/components/providers/toast-provider';
import { groupsService, ProgramType, Shift, type CreateGroupDto } from '@/lib/services/groups-service';
import { clinicsService, type Clinic } from '@/lib/services/clinics-service';

const TURNOS = ['Mañana', 'Tarde'] as const;

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
  { codigo: 'PE', titulo: 'Psychoeducation', descripcion: 'Psicoeducación' },
  { codigo: 'GR', titulo: 'Group Reflection', descripcion: 'Reflexión grupal' },
  { codigo: 'MW', titulo: 'Mindfulness & Wellness', descripcion: 'Mindfulness y bienestar' },
  { codigo: 'SP', titulo: 'Social Skills Practice', descripcion: 'Práctica de habilidades sociales' },
  { codigo: 'CP', titulo: 'Coping Skills', descripcion: 'Habilidades de afrontamiento' }
];

// Configuración de animaciones
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

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoadingClinics, setIsLoadingClinics] = useState(true);
  const [selectedClinicId, setSelectedClinicId] = useState<string>('');

  const [formData, setFormData] = useState<Partial<Grupo>>({
    clinica: { nombre: '', logoUrl: undefined },
    tipo: undefined,
    turno: undefined,
    semanaInicio: '',
    horarios: {},
    pacientesIds: [],
    estado: 'Activo'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState<string[]>([]);
  const [notas, setNotas] = useState<any[]>([]);
  const [mostrarNotas, setMostrarNotas] = useState(false);

  // Cargar clínicas al montar el componente
  useEffect(() => {
    const loadClinics = async () => {
      try {
        const clinicsData = await clinicsService.getAll();
        setClinics(clinicsData);
      } catch (error) {
        console.error('Error al cargar clínicas:', error);
        addToast('Error al cargar las clínicas', 'error');
      } finally {
        setIsLoadingClinics(false);
      }
    };

    loadClinics();
  }, [addToast]);

  // Obtener días según el tipo de programa
  const diasDisponibles = formData.tipo ? TIPOS_PROGRAMA[formData.tipo].dias : [];

  // Obtener usuarios seleccionados
  const usuariosSeleccionadosData = getUsuariosActivos().filter(usuario => 
    usuariosSeleccionados.includes(usuario.id)
  );

  // Obtener todas las actividades del grupo (sin duplicados)
  const todasLasActividades = formData.horarios ? 
    Object.values(formData.horarios)
      .flatMap(horario => horario.actividades)
      .map(act => ({ 
        codigo: act.codigo, 
        titulo: act.titulo,
        id: `${act.codigo}-${act.titulo}` // ID único para evitar duplicados
      }))
      .filter((actividad, index, array) => 
        array.findIndex(a => a.id === actividad.id) === index
      )
    : [];

  // Manejar cambio de usuarios
  const handleUsuariosChange = (usuariosIds: string[]) => {
    setUsuariosSeleccionados(usuariosIds);
  };

  // Manejar cambio de notas
  const handleNotasChange = (nuevasNotas: any[]) => {
    setNotas(nuevasNotas);
  };

  // Inicializar horarios cuando cambia el tipo
  const handleTipoChange = (tipo: 'PHP' | 'IOP') => {
    const diasTipo = TIPOS_PROGRAMA[tipo].dias;
    const nuevosHorarios: Record<string, { actividades: Actividad[] }> = {};
    
    diasTipo.forEach(dia => {
      nuevosHorarios[dia] = { actividades: [] };
    });
    
    setFormData(prev => ({
      ...prev,
      tipo,
      horarios: nuevosHorarios
    }));
  };

  // Convertir ActividadSugerida a Actividad
  const convertirAActividad = (actividad: ActividadSugerida): Actividad => ({
    id: `temp-${Date.now()}-${Math.random()}`,
    codigo: actividad.codigo,
    titulo: actividad.titulo,
    descripcion: actividad.descripcion,
    duracion: 60, // Duración por defecto
    defaultTime: '09:00', // Hora por defecto
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Agregar actividad a un día específico
  const agregarActividad = (dia: string) => {
    const nuevaActividad: ActividadSugerida = {
      codigo: '',
      titulo: '',
      descripcion: ''
    };

    setFormData(prev => ({
      ...prev,
      horarios: {
        ...prev.horarios,
        [dia]: {
          actividades: [...(prev.horarios?.[dia]?.actividades || []), convertirAActividad(nuevaActividad)]
        }
      }
    }));
  };

  // Actualizar actividad específica
  const actualizarActividad = (dia: string, index: number, campo: keyof Actividad, valor: string) => {
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

  // Usar actividad sugerida
  const usarActividadSugerida = (dia: string, index: number, actividad: ActividadSugerida) => {
    actualizarActividad(dia, index, 'codigo', actividad.codigo);
    actualizarActividad(dia, index, 'titulo', actividad.titulo);
    actualizarActividad(dia, index, 'descripcion', actividad.descripcion || '');
  };

  // Validar formulario
  const validarFormulario = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

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

        // Validar que todas las actividades tengan código y título
        actividades.forEach((act, index) => {
          if (!act.codigo || !act.titulo) {
            nuevosErrores[`${dia}_${index}`] = 'Código y título son requeridos';
          }
        });
      });
    }

    setErrors(nuevosErrores);

    // Mostrar toast de error si hay errores de validación
    if (Object.keys(nuevosErrores).length > 0) {
      addToast('Por favor completa todos los campos requeridos', 'warning');
    }

    return Object.keys(nuevosErrores).length === 0;
  };

  // Guardar grupo
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
      // ✅ NUEVO: Validar límite de grupos activos antes de crear
      const canCreate = await groupsService.canCreateNewGroup();
      if (!canCreate.canCreate) {
        addToast(canCreate.message || 'No puedes crear más grupos activos', 'error');
        setIsSubmitting(false);
        return;
      }

      // Preparar datos para el API
      const createGroupDto: CreateGroupDto = {
        programType: formData.tipo === 'PHP' ? ProgramType.PHP : ProgramType.IOP,
        shift: formData.turno === 'Mañana' ? Shift.MORNING : Shift.AFTERNOON,
        groupName: formData.clinica?.nombre,
        startDate: formData.semanaInicio!,
        clinicId: selectedClinicId
      };

      // Crear grupo en el backend
      const grupoCreado = await groupsService.create(createGroupDto);

      // TODO: Aquí se podrían agregar los schedules y pacientes si el backend lo requiere
      // Por ahora solo creamos el grupo básico

      addToast('¡Grupo creado exitosamente!', 'success');
      router.push('/grupos');
    } catch (error: any) {
      console.error('Error al guardar:', error);
      
      // ✅ NUEVO: Manejar error específico de límite de grupos
      if (error?.response?.status === 400 && 
          error?.response?.data?.message?.includes('más de 2 grupos activos')) {
        addToast(
          'Ya tienes 2 grupos activos. Debes desactivar un grupo antes de crear uno nuevo.',
          'error'
        );
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
                className={`w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  semanaInicio: e.target.value
                }))}
                className={`w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                    className={`px-4 py-2 border rounded-md transition-colors ${
                      formData.tipo === tipo
                        ? 'bg-sidebar-primary text-white border-blue-600'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tipo}
                  </button>
                ))}
              </div>
              {formData.tipo && (
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm text-blue-800 dark:text-blue-300">
                      {formData.tipo}: {TIPOS_PROGRAMA[formData.tipo].dias.join(', ')}
                      {formData.tipo === 'PHP' && ' (doble nota el viernes)'}
                      {formData.tipo === 'IOP' && ' (doble nota el jueves)'}
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
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  turno: e.target.value as 'Mañana' | 'Tarde'
                }))}
                className={`w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.turno ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Seleccionar turno</option>
                {TURNOS.map(turno => (
                  <option key={turno} value={turno}>{turno}</option>
                ))}
              </select>
              {errors.turno && (
                <p className="mt-1 text-sm text-red-600">{errors.turno}</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Selección de usuarios */}
        <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Usuarios del Sistema</span>
          </h2>

          <UsuarioSelector
            usuariosSeleccionados={usuariosSeleccionados}
            onUsuariosChange={handleUsuariosChange}
          />

          {usuariosSeleccionados.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-blue-800 dark:text-blue-300">
                  {usuariosSeleccionados.length} usuario(s) seleccionado(s).
                  Podrás agregar notas por fecha una vez que configures las actividades.
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Configuración de horarios */}
        {formData.tipo && (
          <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Configuración de Horarios - {formData.tipo}
            </h2>

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
                    <button
                      type="button"
                      onClick={() => agregarActividad(dia)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-500 flex items-center space-x-1 text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Agregar Actividad</span>
                    </button>
                  </div>

                  {errors[`horarios_${dia}`] && (
                    <p className="text-sm text-red-600 mb-3">{errors[`horarios_${dia}`]}</p>
                  )}

                  <div className="space-y-3">
                    {(formData.horarios?.[dia]?.actividades || []).map((actividad, index) => (
                      <div key={index} className="grid grid-cols-12 gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <div className="col-span-2">
                          <input
                            type="text"
                            placeholder="Código"
                            value={actividad.codigo}
                            onChange={(e) => actualizarActividad(dia, index, 'codigo', e.target.value)}
                            className={`w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:text-gray-100 ${
                              errors[`${dia}_${index}`] ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                          />
                        </div>

                        <div className="col-span-8">
                          <input
                            type="text"
                            placeholder="Título de la actividad"
                            value={actividad.titulo}
                            onChange={(e) => actualizarActividad(dia, index, 'titulo', e.target.value)}
                            className={`w-full px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:text-gray-100 ${
                              errors[`${dia}_${index}`] ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                            } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                          />
                        </div>

                        <div className="col-span-1">
                          <div className="relative">
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  const actividadSugerida = ACTIVIDADES_SUGERIDAS.find(a => a.codigo === e.target.value);
                                  if (actividadSugerida) {
                                    usarActividadSugerida(dia, index, actividadSugerida);
                                  }
                                }
                              }}
                              className="w-full px-1 py-1 text-xs border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                              <option value="">📋</option>
                              {ACTIVIDADES_SUGERIDAS.map((act, actIndex) => (
                                <option key={`${act.codigo}-${actIndex}`} value={act.codigo}>
                                  {act.codigo}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-span-1">
                          <button
                            type="button"
                            onClick={() => eliminarActividad(dia, index)}
                            className="w-full p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          >
                            <X className="w-4 h-4 mx-auto" />
                          </button>
                        </div>

                        {errors[`${dia}_${index}`] && (
                          <div className="col-span-12">
                            <p className="text-xs text-red-600">{errors[`${dia}_${index}`]}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {(formData.horarios?.[dia]?.actividades || []).length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center py-4">
                      No hay actividades configuradas para este día
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

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