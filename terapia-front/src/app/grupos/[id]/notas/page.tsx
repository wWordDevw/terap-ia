'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Download, 
  ArrowLeft, 
  Calendar, 
  Users, 
  FileText,
  Clock,
  Edit3,
  Eye,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Target,
  Brain,
  Stethoscope
} from 'lucide-react';
import Badge from '@/components/ui/bagde';
import Button from '@/components/ui/button';
import Textarea from '@/components/ui/textarea';
import Dialog from '@/components/ui/dialog';
import { groupsService } from '@/lib/services/groups-service';
import { patientsService } from '@/lib/services/patients-service';
import { parrafosRotativos, getParrafoPorIndice, getNextParrafoRotativo, getNextParrafoProgreso, getRespuestaClienteBase } from '@/data/paragrafos-rotativos';
import { TIPOS_PROGRAMA } from '@/lib/constants';
import { formatDate, getWeekDates, calculateWeeksUntilDischarge } from '@/lib/utils';
import type { Grupo, Paciente, MetricasType } from '@/lib/types';
import { documentGeneratorService, type NotaData } from '@/lib/services/document-generator';
import { useToast } from '@/components/providers/toast-provider';

interface NotaPaciente {
  pacienteId: string;
  nombre: string;
  numeroClinica: string;
  icd10Primario: string;
  unidades: number;
  metricas: MetricasType;
  respuestasActividades: Record<string, string>;
  tipoProgreso: 'Minimal' | 'Moderate';
}

export default function NotasSemanaPage() {
  const params = useParams();
  const grupoId = params.id as string;
  const { addToast } = useToast();

  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [semanaActual] = useState('2025-10-06');
  const [metricas, setMetricas] = useState<Record<string, MetricasType>>({});
  const [respuestasCliente, setRespuestasCliente] = useState<Record<string, string>>({});
  const [notasGeneradas, setNotasGeneradas] = useState(false);
  const [vistaPreviaExpandida, setVistaPreviaExpandida] = useState<Record<string, boolean>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);

  // Estados para validación de respuestas únicas
  const [duplicateKeys, setDuplicateKeys] = useState<Set<string>>(new Set());
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);

  // Estados para paginación de días
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single'); // 'single' para un día, 'all' para todos

  // Ref para evitar mostrar múltiples toasts de "no pacientes"
  const noPatientsToastShown = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar datos del grupo desde el API
        const grupoData = await groupsService.getById(grupoId);

        console.log('📋 Datos del grupo cargados:', grupoData);

        // Convertir schedules del API al formato esperado por horarios
        const horariosConvertidos: any = {};
        if (grupoData.schedules && grupoData.schedules.length > 0) {
          grupoData.schedules.forEach((schedule: any) => {
            const diaMap: any = {
              'monday': 'lun',
              'tuesday': 'mar',
              'wednesday': 'mie',
              'thursday': 'jue',
              'friday': 'vie',
              'saturday': 'sab',
              'sunday': 'dom'
            };
            const dia = diaMap[schedule.dayOfWeek.toLowerCase()];

            if (!horariosConvertidos[dia]) {
              horariosConvertidos[dia] = { actividades: [] };
            }

            horariosConvertidos[dia].actividades.push({
              codigo: schedule.activity?.code || 'N/A',
              titulo: schedule.activity?.name || 'Actividad',
              descripcion: schedule.activity?.description || '',
            });
          });
        }

        // Convertir el grupo del API al formato esperado
        const grupoAdaptado: any = {
          id: grupoData.id,
          nombre: grupoData.groupName || `Grupo ${grupoData.programType}`,
          tipo: grupoData.programType,
          turno: grupoData.shift,
          clinica: {
            id: grupoData.clinicId,
            nombre: 'Clínica', // TODO: Cargar nombre real desde el API de clínicas
          },
          horarios: horariosConvertidos,
          pacientesIds: grupoData.groupPatients?.map((gp: any) => gp.patientId) || [],
        };

        setGrupo(grupoAdaptado);

        // Cargar pacientes desde el API usando groupPatients
        if (grupoData.groupPatients && grupoData.groupPatients.length > 0) {
          const pacientesPromises = grupoData.groupPatients
            .filter((gp: any) => gp.isActive)
            .map((gp: any) => patientsService.getById(gp.patientId));

          const pacientesData = await Promise.all(pacientesPromises);

          // Adaptar pacientes al formato esperado
          const pacientesAdaptados = pacientesData.map((p: any) => ({
            id: p.id,
            nombre: `${p.firstName} ${p.lastName}`,
            numeroClinica: p.patientNumber || 'N/A',
            numeroPaciente: p.patientNumber || 'N/A',
            clinicaId: p.clinicId || '',
            clinicaNombre: p.clinic?.name || 'N/A',
            nacimiento: p.dateOfBirth || '',
            ingreso: p.admissionDate || '',
            discharge: p.dischargeDate || null,
            fechaCancelacion: p.cancellationDate || null,
            goals: p.goals?.map((g: any) => g.goalText) || ['Improve coping skills', 'Enhance emotional regulation'],
            diagnosticos: p.diagnoses?.map((d: any) => ({
              codigo: d.icd10Code,
              descripcion: d.description,
              tipo: d.isPrimary ? 'Primario' : 'Secundario',
              activo: true
            })) || [],
            documentos: [],
            notas: []
          }));

          console.log(`👥 ${pacientesAdaptados.length} pacientes cargados`);
          setPacientes(pacientesAdaptados);
        } else {
          console.warn('⚠️ No hay pacientes asignados a este grupo');
          // Mostrar toast solo una vez usando ref
          if (!noPatientsToastShown.current) {
            addToast('Este grupo no tiene pacientes asignados', 'warning');
            noPatientsToastShown.current = true;
          }
        }

      } catch (error) {
        console.error('Error al cargar datos del grupo:', error);
        addToast('Error al cargar el grupo', 'error');
      }
    };

    if (grupoId) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grupoId]);

  // Debug: Log cuando cambia el día actual (solo si grupo existe)
  useEffect(() => {
    if (grupo) {
      const diasPrograma = TIPOS_PROGRAMA[grupo.tipo].dias;
      const weekDates = getWeekDates(semanaActual);
      const diasSemana = diasPrograma.map(dia => {
        const diaIndex = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'].indexOf(dia);
        return weekDates[diaIndex];
      });
      const currentDay = diasPrograma[currentDayIndex];
      const fechaDiaActual = diasSemana[currentDayIndex];
      console.log('Día actual cambiado:', currentDayIndex, currentDay, fechaDiaActual);
    }
  }, [currentDayIndex, grupo, semanaActual]);

  if (!grupo) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Grupo no encontrado</p>
        <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mt-2 inline-block">
          Volver a la lista
        </Link>
      </div>
    );
  }

  const diasPrograma = TIPOS_PROGRAMA[grupo.tipo].dias;
  const weekDates = getWeekDates(semanaActual);
  const diasSemana = diasPrograma.map(dia => {
    const diaIndex = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'].indexOf(dia);
    return weekDates[diaIndex];
  });

  // Lógica de paginación de días
  const diasParaMostrar = viewMode === 'single'
    ? [diasPrograma[currentDayIndex]]
    : diasPrograma;

  const totalDias = diasPrograma.length;
  const currentDay = diasPrograma[currentDayIndex];
  const fechaDiaActual = diasSemana[currentDayIndex];

  // Funciones de navegación
  const goToPreviousDay = () => {
    setCurrentDayIndex(prev => {
      const newIndex = Math.max(0, prev - 1);
      console.log('Navegando al día anterior:', newIndex, diasPrograma[newIndex]);
      return newIndex;
    });
  };

  const goToNextDay = () => {
    setCurrentDayIndex(prev => {
      const newIndex = Math.min(totalDias - 1, prev + 1);
      console.log('Navegando al día siguiente:', newIndex, diasPrograma[newIndex]);
      return newIndex;
    });
  };

  const goToDay = (dayIndex: number) => {
    console.log('Navegando al día:', dayIndex, diasPrograma[dayIndex]);
    setCurrentDayIndex(dayIndex);
  };

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'single' ? 'all' : 'single');
  };

  const updateMetrica = (pacienteId: string, dia: string, metrica: keyof MetricasType, valor: 'Moderate' | 'Minor') => {
    setMetricas(prev => ({
      ...prev,
      [`${pacienteId}-${dia}`]: {
        ...prev[`${pacienteId}-${dia}`],
        [metrica]: valor
      }
    }));
  };

  const updateRespuestaCliente = (key: string, valor: string) => {
    const trimmedValue = valor.trim().toLowerCase();

    // Update the response
    setRespuestasCliente(prev => ({
      ...prev,
      [key]: valor
    }));

    // Validate uniqueness (ignore empty and very short responses)
    if (trimmedValue.length < 20) {
      // Remove from duplicates if it was there (user is editing)
      setDuplicateKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
      return;
    }

    // Check if this response already exists in other fields
    const otherResponses = Object.entries(respuestasCliente)
      .filter(([k, _]) => k !== key)
      .map(([_, v]) => v.trim().toLowerCase());

    if (otherResponses.includes(trimmedValue)) {
      addToast('⚠️ Esta respuesta ya fue usada. Las respuestas deben ser únicas.', 'warning');
      setDuplicateKeys(prev => new Set(prev).add(key));
      setShowDuplicateWarning(true);
    } else {
      // Remove from duplicates if it's now unique
      setDuplicateKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });

      // Hide warning if no more duplicates
      if (duplicateKeys.size <= 1) {
        setShowDuplicateWarning(false);
      }
    }
  };

  const getProgressType = (paciente: Paciente): 'Minimal' | 'Moderate' => {
    if (!paciente.discharge) return 'Minimal';
    
    const weeksUntilDischarge = calculateWeeksUntilDischarge(new Date(), new Date(paciente.discharge));
    return weeksUntilDischarge <= 3 ? 'Moderate' : 'Minimal';
  };

  const generarYDescargarNotas = async () => {
    if (!grupo || pacientes.length === 0) {
      addToast('No hay datos suficientes para generar las notas', 'warning');
      return;
    }

    // Validate no duplicates exist
    if (duplicateKeys.size > 0) {
      addToast(`No se pueden generar documentos con ${duplicateKeys.size} respuesta(s) duplicada(s). Por favor, corrige las respuestas duplicadas.`, 'error', 5000);
      return;
    }

    setIsGenerating(true);

    try {
      // Preparar datos de las notas para toda la semana
      const notasSemana: NotaData[] = [];

      for (let diaIndex = 0; diaIndex < diasPrograma.length; diaIndex++) {
        const dia = diasPrograma[diaIndex];
        const actividades = grupo.horarios[dia]?.actividades || [];
        const fechaDia = diasSemana[diaIndex];

        // Por cada paciente, crear una nota
        for (const paciente of pacientes) {
          const key = `${paciente.id}-${dia}`;
          const pacienteMetricas = metricas[key] || {
            cooperation: 'Moderate',
            motivation: 'Moderate',
            focus: 'Moderate',
            peer: 'Moderate'
          };

          const notaData: NotaData = {
            paciente: {
              nombre: paciente.nombre,
              numeroExpediente: paciente.numeroClinica,
              fechaNacimiento: paciente.nacimiento || 'N/A',
              metas: [paciente.goals[diaIndex % paciente.goals.length]], // Only one goal per day, rotating
              diagnosticos: paciente.diagnosticos.map(d => `${d.codigo} - ${d.descripcion}`),
            },
            fecha: fechaDia,
            actividades: actividades.map((act, actIndex) => {
              const respuestaKey = `${paciente.id}-${dia}-${actIndex}`;
              return {
                codigo: act.codigo,
                titulo: act.titulo,
                descripcion: act.descripcion,
                parrafo: getNextParrafoRotativo(actIndex), // Use new rotation system
                respuestaPaciente: respuestasCliente[respuestaKey] || getRespuestaClienteBase(),
              };
            }),
            asistencia: 'P' as const, // TODO: Obtener del estado real de asistencia
            terapeuta: {
              nombre: 'Dr. Nombre del Terapeuta', // TODO: Obtener del usuario autenticado
            },
            tipoPrograma: grupo.tipo,
            diaSemana: dia as 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes',
          };

          notasSemana.push(notaData);

          // Check if this is a double day and generate second note
          const esDobleDia = TIPOS_PROGRAMA[grupo.tipo].dobleDia === dia;

          if (esDobleDia) {
            // Generate SECOND note for this day with DIFFERENT paragraphs
            const notaData2: NotaData = {
              paciente: {
                nombre: paciente.nombre,
                numeroExpediente: paciente.numeroClinica,
                fechaNacimiento: paciente.nacimiento || 'N/A',
                metas: [paciente.goals[diaIndex % paciente.goals.length]], // Same goal for consistency
                diagnosticos: paciente.diagnosticos.map(d => `${d.codigo} - ${d.descripcion}`),
              },
              fecha: fechaDia,
              actividades: actividades.map((act, actIndex) => {
                const respuestaKey = `${paciente.id}-${dia}-${actIndex}-nota2`; // Different key for second note
                return {
                  codigo: act.codigo,
                  titulo: act.titulo,
                  descripcion: act.descripcion,
                  parrafo: getNextParrafoRotativo(actIndex + 100), // Offset to get different paragraph
                  respuestaPaciente: respuestasCliente[respuestaKey] || getRespuestaClienteBase(),
                };
              }),
              asistencia: 'P' as const,
              terapeuta: {
                nombre: 'Dr. Nombre del Terapeuta',
              },
              tipoPrograma: grupo.tipo,
              diaSemana: dia as 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes',
            };

            notasSemana.push(notaData2);
          }
        }
      }

      // Generar todas las notas
      addToast(`Generando ${notasSemana.length} documentos...`, 'success', 2000);

      await documentGeneratorService.generarNotasSemana(notasSemana);

      setNotasGeneradas(true);
      addToast(`¡${notasSemana.length} documentos generados exitosamente!`, 'success');

    } catch (error) {
      console.error('Error al generar documentos:', error);
      addToast('Error al generar los documentos. Verifica que los templates estén configurados correctamente.', 'error', 5000);
    } finally {
      setIsGenerating(false);
    }
  };

  const generarVistaPrevia = () => {
    if (!grupo || pacientes.length === 0) {
      addToast('No hay datos suficientes para generar la vista previa', 'warning');
      return;
    }

    try {
      // Preparar datos de vista previa para toda la semana
      const notasPreview: any[] = [];

      for (let diaIndex = 0; diaIndex < diasPrograma.length; diaIndex++) {
        const dia = diasPrograma[diaIndex];
        const actividades = grupo.horarios[dia]?.actividades || [];
        const fechaDia = diasSemana[diaIndex];

        // Por cada paciente, crear una vista previa
        for (const paciente of pacientes) {
          const key = `${paciente.id}-${dia}`;
          const pacienteMetricas = metricas[key] || {
            cooperation: 'Moderate',
            motivation: 'Moderate',
            focus: 'Moderate',
            peer: 'Moderate'
          };

          const actividadesConRespuestas = actividades.map((act, actIndex) => {
            const respuestaKey = `${paciente.id}-${dia}-${actIndex}`;
            return {
              codigo: act.codigo,
              titulo: act.titulo,
              parrafo: getNextParrafoRotativo(actIndex), // Use new rotation system
              respuesta: respuestasCliente[respuestaKey] || `Client demonstrated progress in ${paciente.goals?.[diaIndex % paciente.goals.length]?.toLowerCase() || 'therapeutic goals'}.`
            };
          });

          const progressType = getProgressType(paciente);

          notasPreview.push({
            paciente: {
              nombre: paciente.nombre,
              numeroClinica: paciente.numeroClinica,
              icd10: paciente.diagnosticos[0]?.codigo || 'N/A'
            },
            fecha: fechaDia,
            dia,
            metricas: pacienteMetricas,
            actividades: actividadesConRespuestas,
            progressType,
            unidades: actividades.length
          });

          // Check if this is a double day and generate second preview
          const esDobleDia = TIPOS_PROGRAMA[grupo.tipo].dobleDia === dia;

          if (esDobleDia) {
            // Generate SECOND preview for this day with DIFFERENT paragraphs
            const actividadesConRespuestas2 = actividades.map((act, actIndex) => {
              const respuestaKey = `${paciente.id}-${dia}-${actIndex}-nota2`; // Different key for second note
              return {
                codigo: act.codigo,
                titulo: act.titulo,
                parrafo: getNextParrafoRotativo(actIndex + 100), // Offset to get different paragraph
                respuesta: respuestasCliente[respuestaKey] || `Client demonstrated progress in ${paciente.goals?.[diaIndex % paciente.goals.length]?.toLowerCase() || 'therapeutic goals'}.`
              };
            });

            notasPreview.push({
              paciente: {
                nombre: paciente.nombre,
                numeroClinica: paciente.numeroClinica,
                icd10: paciente.diagnosticos[0]?.codigo || 'N/A'
              },
              fecha: fechaDia,
              dia,
              metricas: pacienteMetricas,
              actividades: actividadesConRespuestas2,
              progressType,
              unidades: actividades.length,
              isSecondNote: true // Flag to identify second note in preview
            });
          }
        }
      }

      setPreviewData(notasPreview);
      setShowPreviewModal(true);
      setNotasGeneradas(true);
    } catch (error) {
      console.error('Error al generar vista previa:', error);
      addToast('Error al generar la vista previa', 'error');
    }
  };

  const toggleVistaPrevia = (dia: string) => {
    setVistaPreviaExpandida(prev => ({
      ...prev,
      [dia]: !prev[dia]
    }));
  };

  const getTotalNotasAGenerar = (): number => {
    let total = diasPrograma.length;
    // Agregar nota extra para día de doble nota
    if (TIPOS_PROGRAMA[grupo.tipo].dobleDia) {
      total += 1;
    }
    return total;
  };

  const getTotalUnidades = (): number => {
    return diasPrograma.reduce((total, dia) => {
      const actividades = grupo.horarios[dia]?.actividades || [];
      return total + actividades.length;
    }, 0);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link
            href={`/grupos/${grupo.id}`}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Volver a asistencia"
          >
            <ArrowLeft className="w-5 h-5 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notas Semanales</h1>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-gray-600 dark:text-gray-400">{grupo.clinica.nombre}</span>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <Badge variant={grupo.tipo.toLowerCase() as 'php' | 'iop'}>{grupo.tipo}</Badge>
              <Badge variant="default">{grupo.turno}</Badge>
              <span className="text-gray-400 dark:text-gray-500">•</span>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(semanaActual)} - {formatDate(
                  new Date(new Date(semanaActual).getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {/* Controles de vista */}
          <Button
            onClick={toggleViewMode}
            variant={viewMode === 'single' ? 'default' : 'outline'}
            size="sm"
            className="flex items-center space-x-2"
          >
            <Calendar className="w-4 h-4" />
            <span>{viewMode === 'single' ? 'Vista Día' : 'Vista Semana'}</span>
          </Button>
          
          <Button 
            onClick={generarVistaPrevia}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Generar Vista Previa</span>
          </Button>
          <Button
            onClick={generarYDescargarNotas}
            variant="default"
            disabled={isGenerating}
            className="flex items-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generando...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Descargar .docx</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Controles de navegación de días */}
      {viewMode === 'single' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 mb-6">
          <div className="flex items-center justify-between">
            {/* Información del día actual */}
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                Día {currentDayIndex + 1} de {totalDias}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                  {currentDay} - {formatDate(fechaDiaActual)}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {grupo.horarios[currentDay]?.actividades.length || 0} actividades • {pacientes.length} pacientes
                </p>
              </div>
            </div>

            {/* Controles de navegación */}
            <div className="flex items-center space-x-3">
              <button
                onClick={goToPreviousDay}
                disabled={currentDayIndex === 0}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Anterior</span>
              </button>

              {/* Botón de debug temporal */}
              <button
                onClick={() => {
                  console.log('Estado actual:', { currentDayIndex, currentDay, totalDias, diasPrograma });
                  setCurrentDayIndex(1);
                }}
                className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded"
              >
                Debug: Ir a Martes
              </button>

              {/* Selector de días */}
              <div className="flex items-center space-x-1">
                {diasPrograma.map((dia, index) => (
                  <button
                    key={dia}
                    onClick={() => goToDay(index)}
                    className={`px-3 py-2 text-sm font-medium rounded-md capitalize ${
                      currentDayIndex === index
                        ? 'bg-sidebar-primary text-white'
                        : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    {dia}
                  </button>
                ))}
              </div>

              <button
                onClick={goToNextDay}
                disabled={currentDayIndex === totalDias - 1}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Siguiente</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Información de la semana */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pacientes.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pacientes activos</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{diasPrograma.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Días de programa</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
          <div className="flex items-center">
            <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400 mr-3" />
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{getTotalUnidades()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total actividades</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 p-4">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-amber-600 dark:text-amber-400 mr-3" />
            <div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{getTotalNotasAGenerar()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Notas a generar</div>
            </div>
          </div>
        </div>
      </div>

      {/* Duplicate Warning Banner */}
      {duplicateKeys.size > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-red-900 dark:text-red-200">Respuestas Duplicadas Detectadas</h3>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                Se han detectado <strong>{duplicateKeys.size}</strong> respuesta(s) duplicada(s). Los documentos no se pueden generar hasta que todas las respuestas sean únicas.
                Por favor, revisa las respuestas marcadas con el indicador "Duplicada" y modifícalas para que sean únicas.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alert informativo */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-200">Sistema de Generación Automática</h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
              Los párrafos de actividades se rotan automáticamente para evitar repeticiones. Las respuestas del cliente
              deben ser únicas por actividad. El progreso cambia a "Moderate" en las últimas 3 semanas antes del discharge.
            </p>
            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
              {grupo.tipo === 'PHP' ? 'Los viernes' : 'Los jueves'} generan documentación doble automáticamente.
            </div>
          </div>
        </div>
      </div>

      {/* Notas por día */}
      <div className="space-y-8">
        {diasParaMostrar.map((dia) => {
          const diaIndex = diasPrograma.indexOf(dia as any);
          const fechaDia = diasSemana[diaIndex];
          const actividades = grupo.horarios[dia]?.actividades || [];
          const esDobleDia = TIPOS_PROGRAMA[grupo.tipo].dobleDia === dia;
          const expandido = vistaPreviaExpandida[dia];

          return (
            <div key={dia} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
              {/* Header del día */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 capitalize flex items-center space-x-3">
                      <span>{dia}</span>
                      <span className="text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-base font-normal text-gray-600 dark:text-gray-400">{formatDate(fechaDia)}</span>
                      {esDobleDia && <Badge variant="warning">Doble Nota</Badge>}
                      {viewMode === 'single' && (
                        <Badge variant="info" className="ml-2">
                          Día {diaIndex + 1} de {totalDias}
                        </Badge>
                      )}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Actividades: {actividades.map(a => a.codigo).join(', ')} •
                      {actividades.length} unidades por paciente •
                      {esDobleDia ? 2 : 1} nota(s) a generar
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                      <div>Pacientes: {pacientes.length}</div>
                      <div>Caracteres estimados: ~{(actividades.length * pacientes.length * 150).toLocaleString()}</div>
                    </div>
                    <Button
                      onClick={() => toggleVistaPrevia(dia)}
                      variant="outline"
                      size="sm"
                    >
                      {expandido ? 'Contraer' : 'Expandir'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Encabezado común de nota */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Encabezado Común de Nota
                  </h3>
                  <div className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                    <p><strong>Clínica:</strong> {grupo.clinica.nombre}</p>
                    <p><strong>Programa:</strong> {grupo.tipo} - {grupo.turno}</p>
                    <p><strong>Fecha:</strong> {formatDate(fechaDia)}</p>
                    <p><strong>Unidades:</strong> {actividades.length} unidades por paciente</p>
                    <p><strong>Enfermería:</strong> 0 (registrado en franja correspondiente)</p>
                  </div>
                </div>

                {/* Tabla de métricas */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Métricas Editables del Día
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100 border-r dark:border-gray-600">Paciente</th>
                          <th className="px-4 py-3 text-center font-medium text-gray-900 dark:text-gray-100 border-r dark:border-gray-600">Attitude</th>
                          <th className="px-4 py-3 text-center font-medium text-gray-900 dark:text-gray-100 border-r dark:border-gray-600">Cooperation</th>
                          <th className="px-4 py-3 text-center font-medium text-gray-900 dark:text-gray-100 border-r dark:border-gray-600">Motivation</th>
                          <th className="px-4 py-3 text-center font-medium text-gray-900 dark:text-gray-100 border-r dark:border-gray-600">Focus</th>
                          <th className="px-4 py-3 text-center font-medium text-gray-900 dark:text-gray-100">Peer Interaction</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pacientes.map(paciente => {
                          const key = `${paciente.id}-${dia}`;
                          const pacienteMetricas = metricas[key] || {
                            cooperation: 'Moderate',
                            motivation: 'Moderate', 
                            focus: 'Moderate',
                            peer: 'Moderate'
                          };

                          return (
                            <tr key={paciente.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 border-r dark:border-gray-600">
                                <div>
                                  <div>{paciente.nombre}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">{paciente.numeroClinica}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center border-r dark:border-gray-600">
                                <Badge variant="success" className="text-xs">Appropriate</Badge>
                              </td>
                              {(['cooperation', 'motivation', 'focus', 'peer'] as const).map(metrica => (
                                <td key={metrica} className="px-4 py-3 text-center border-r dark:border-gray-600 last:border-r-0">
                                  <select
                                    value={pacienteMetricas[metrica]}
                                    onChange={(e) => updateMetrica(paciente.id, dia, metrica, e.target.value as 'Moderate' | 'Minor')}
                                    className={`text-xs border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                      pacienteMetricas[metrica] === 'Moderate' ? 'border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300' : 'border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                                    }`}
                                  >
                                    <option value="Moderate">Moderate</option>
                                    <option value="Minor">Minor</option>
                                  </select>
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    💡 Attitude se mantiene constante como "Appropriate". Las demás métricas son editables.
                  </p>
                </div>

                {/* Actividades del día */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Actividades y Contenido Terapéutico
                  </h3>
                  <div className="space-y-6">
                    {actividades.map((actividad, actIndex) => {
                      // Show a preview of what the rotating system will generate
                      const parrafoBase = getParrafoPorIndice(actIndex);

                      return (
                        <div key={actIndex} className="border-l-4 border-blue-500 dark:border-blue-400 pl-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                            {actividad.titulo} ({actividad.codigo})
                          </h4>

                          {/* Párrafo base */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Párrafo rotativo para actividad #{actIndex + 1}:
                            </label>
                            <div className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700 italic text-sm leading-relaxed">
                              {parrafoBase}
                            </div>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              ✨ Este párrafo será seleccionado aleatoriamente del pool sin repetir hasta usar todos
                            </p>
                          </div>

                          {/* Respuestas por paciente */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-gray-800 dark:text-gray-200">Respuestas individuales por paciente:</h5>
                              <Badge variant="info" className="text-xs">
                                Goal rotativo del día {diaIndex + 1}
                              </Badge>
                            </div>

                            {pacientes.map(paciente => {
                              const goalDelDia = paciente.goals[diaIndex % paciente.goals.length];
                              const respuestaKey = `${paciente.id}-${dia}-${actIndex}`;
                              const respuestaActual = respuestasCliente[respuestaKey] || `Client demonstrated progress in ${goalDelDia.toLowerCase()}.`;
                              const isDuplicate = duplicateKeys.has(respuestaKey);

                              return (
                                <div key={paciente.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                      <strong className="text-gray-900 dark:text-gray-100">{paciente.nombre}</strong>
                                      <Badge variant="default" className="text-xs">{paciente.numeroClinica}</Badge>
                                      {isDuplicate && (
                                        <Badge variant="error" className="text-xs">Duplicada</Badge>
                                      )}
                                    </div>
                                    <div className="text-right">
                                      <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded mb-1">
                                        Goal: {goalDelDia}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        ICD-10: {paciente.diagnosticos[0]?.codigo || 'N/A'}
                                      </div>
                                    </div>
                                  </div>

                                  <Textarea
                                    value={respuestaActual}
                                    onChange={(e: { target: { value: string; }; }) => updateRespuestaCliente(respuestaKey, e.target.value)}
                                    placeholder="Respuesta específica del cliente para esta actividad..."
                                    className={`text-sm ${isDuplicate ? 'border-2 border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20' : ''}`}
                                    rows={3}
                                  />

                                  {isDuplicate && (
                                    <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded flex items-center text-xs text-red-700 dark:text-red-300">
                                      <AlertTriangle className="w-3 h-3 mr-1 flex-shrink-0" />
                                      <span>Esta respuesta ya fue usada. Por favor, ingresa una respuesta única.</span>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between mt-2">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      Esta respuesta debe ser única y no repetirse en otras actividades
                                    </p>
                                    <div className="text-xs text-gray-400 dark:text-gray-500">
                                      {respuestaActual.length} caracteres
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Párrafo final de progreso */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-200 mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Párrafo Final de Progreso Automático
                  </h4>
                  <div className="space-y-4">
                    {pacientes.map(paciente => {
                      const progressType = getProgressType(paciente);
                      const weeksUntilDischarge = paciente.discharge ?
                        calculateWeeksUntilDischarge(new Date(), new Date(paciente.discharge)) : null;

                      return (
                        <div key={paciente.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                          <div className="flex items-center justify-between mb-3">
                            <strong className="text-gray-900 dark:text-gray-100">{paciente.nombre}:</strong>
                            <div className="flex items-center space-x-2">
                              <Badge variant={progressType === 'Moderate' ? 'success' : 'warning'}>
                                Progress: {progressType}
                              </Badge>
                              {weeksUntilDischarge && (
                                <Badge variant="info" className="text-xs">
                                  {weeksUntilDischarge} semanas para alta
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded italic">
                            "Progress was <strong>{progressType}</strong> across all therapeutic domains. Patient continues to engage in treatment activities and demonstrate understanding of core concepts.
                            {progressType === 'Moderate' ? (
                              <span className="text-green-700 dark:text-green-400">
                                {' '}Significant improvement noted in key therapeutic areas with strong preparation for discharge transition and community reintegration.
                              </span>
                            ) : (
                              <span className="text-blue-700 dark:text-blue-400">
                                {' '}Continued focus on skill development and practical application remains essential for therapeutic advancement.
                              </span>
                            )}"
                          </div>

                          {paciente.discharge && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Discharge programado para {formatDate(paciente.discharge)}
                              {weeksUntilDischarge && weeksUntilDischarge <= 3 && (
                                <span className="ml-2 text-amber-600 dark:text-amber-400">
                                  (Últimas 3 semanas - progreso automático "Moderate")
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Vista previa expandida */}
                {expandido && (
                  <div className="bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                      <Eye className="w-4 h-4 mr-2" />
                      Vista Previa de Nota Generada
                    </h4>
                    <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3 bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700 max-h-96 overflow-y-auto">
                      <div className="border-b dark:border-gray-700 pb-2 mb-3">
                        <p><strong>Clínica:</strong> {grupo.clinica.nombre}</p>
                        <p><strong>Fecha:</strong> {formatDate(fechaDia)} • <strong>Tipo:</strong> {grupo.tipo} {grupo.turno}</p>
                      </div>

                      {actividades.map((actividad, actIndex) => (
                        <div key={actIndex} className="mb-4">
                          <h5 className="font-medium text-blue-900 dark:text-blue-300 mb-2">{actividad.titulo}</h5>
                          <p className="mb-2 text-xs text-gray-600 dark:text-gray-400 italic">
                            (Párrafo rotativo será seleccionado al generar)
                          </p>
                          <div className="ml-4 space-y-1">
                            {pacientes.map(paciente => {
                              const respuestaKey = `${paciente.id}-${dia}-${actIndex}`;
                              const respuesta = respuestasCliente[respuestaKey];
                              return (
                                <p key={paciente.id} className="text-xs">
                                  <strong>{paciente.nombre}:</strong> {respuesta}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer del día */}
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t dark:border-gray-600">
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                    <span className="flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      {esDobleDia ? '2 notas' : '1 nota'} se generará{esDobleDia ? 'n' : ''} para este día
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {pacientes.length} pacientes incluidos
                    </span>
                  </div>
                  <span className="text-gray-500 dark:text-gray-400">
                    ~{(actividades.length * pacientes.length * 150).toLocaleString()} caracteres estimados
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Vista Previa */}
      <Dialog
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        title="Vista Previa de Notas Semanales"
        size="xl"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Resumen general */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900 dark:text-blue-200">Resumen de Generación</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Se generarán {previewData.length} documentos ({pacientes.length} pacientes × {diasPrograma.length} días)
                </p>
                <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                  Total de unidades: {getTotalUnidades()} por paciente
                </div>
              </div>
            </div>
          </div>

          {/* Lista de notas por día */}
          {diasPrograma.map((dia, diaIndex) => {
            const notasDelDia = previewData.filter(n => n.dia === dia);
            if (notasDelDia.length === 0) return null;

            return (
              <div key={dia} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                {/* Header del día */}
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
                      {dia} - {formatDate(diasSemana[diaIndex])}
                    </h3>
                    <Badge variant="default" className="text-xs">
                      {notasDelDia.length} {notasDelDia.length === 1 ? 'nota' : 'notas'}
                    </Badge>
                  </div>
                </div>

                {/* Notas de pacientes */}
                <div className="divide-y dark:divide-gray-700">
                  {notasDelDia.map((nota, index) => (
                    <div key={index} className="p-4 bg-white dark:bg-gray-800">
                      {/* Info del paciente */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {nota.paciente.nombre.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                {nota.paciente.nombre}
                              </h4>
                              {nota.isSecondNote && (
                                <Badge variant="warning" className="text-xs">Nota #2</Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>#{nota.paciente.numeroClinica}</span>
                              <span>•</span>
                              <span>ICD-10: {nota.paciente.icd10}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="success" className="text-xs mb-1">
                            Progress: {nota.progressType}
                          </Badge>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {nota.unidades} unidades
                          </div>
                        </div>
                      </div>

                      {/* Métricas */}
                      <div className="mb-3">
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Métricas:</div>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="default" className="text-xs">
                            Attitude: Appropriate
                          </Badge>
                          <Badge variant={nota.metricas.cooperation === 'Moderate' ? 'success' : 'warning'} className="text-xs">
                            Cooperation: {nota.metricas.cooperation}
                          </Badge>
                          <Badge variant={nota.metricas.motivation === 'Moderate' ? 'success' : 'warning'} className="text-xs">
                            Motivation: {nota.metricas.motivation}
                          </Badge>
                          <Badge variant={nota.metricas.focus === 'Moderate' ? 'success' : 'warning'} className="text-xs">
                            Focus: {nota.metricas.focus}
                          </Badge>
                          <Badge variant={nota.metricas.peer === 'Moderate' ? 'success' : 'warning'} className="text-xs">
                            Peer: {nota.metricas.peer}
                          </Badge>
                        </div>
                      </div>

                      {/* Actividades */}
                      <div className="space-y-3">
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300">Actividades:</div>
                        {nota.actividades.map((act: any, actIndex: number) => (
                          <div key={actIndex} className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-xs">
                            <div className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                              {act.codigo} - {act.titulo}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 italic mb-2">
                              {act.parrafo}
                            </div>
                            <div className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-2 rounded border dark:border-gray-600">
                              <span className="font-medium">Respuesta: </span>
                              {act.respuesta}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Progress Note */}
                      <div className="mt-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded text-xs">
                        <div className="font-medium text-green-900 dark:text-green-200 mb-1">
                          Párrafo Final de Progreso:
                        </div>
                        <div className="text-green-800 dark:text-green-300 italic">
                          Progress was <strong>{nota.progressType}</strong> across all therapeutic domains.
                          Patient continues to engage in treatment activities and demonstrate understanding of core concepts.
                          {nota.progressType === 'Moderate' ? (
                            <span> Significant improvement noted in key therapeutic areas with strong preparation for discharge transition and community reintegration.</span>
                          ) : (
                            <span> Continued focus on skill development and practical application remains essential for therapeutic advancement.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Footer con acciones */}
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 pt-4 -mx-6 px-6 -mb-6 pb-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                  Vista previa generada exitosamente
                </div>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowPreviewModal(false)}
                  variant="outline"
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    setShowPreviewModal(false);
                    generarYDescargarNotas();
                  }}
                  variant="default"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Generar Documentos</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

    </div>
  );
}