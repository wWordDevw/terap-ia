'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  Info,
  TrendingUp,
  UserCheck,
  UserX,
  UserMinus,
  UserPlus
} from 'lucide-react';
import Badge from '@/components/ui/bagde';
import Button from '@/components/ui/button';
import Dialog from '@/components/ui/dialog';
import { groupsService, type Group, type GroupWeek } from '@/lib/services/groups-service';
import { patientsService, type Patient } from '@/lib/services/patients-service';
import { attendanceService, type Attendance, AttendanceStatus, ReasonType } from '@/lib/services/attendance-service';
import { useToast } from '@/components/providers/toast-provider';
import { TIPOS_PROGRAMA } from '@/lib/constants';
import { formatDate, getWeekDates, isToday, isPast, getDayNameShort } from '@/lib/utils';
import type { AsistenciaDia, Justificacion, RegistroAsistencia } from '@/lib/types';

export default function GrupoSemanaPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const grupoId = params.id as string;

  const [grupo, setGrupo] = useState<Group | null>(null);
  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [semanaActual, setSemanaActual] = useState('2025-10-06'); // Lunes actual
  const [asistencia, setAsistencia] = useState<Record<string, RegistroAsistencia>>({});
  const [modalJustificacion, setModalJustificacion] = useState({
    show: false,
    pacienteId: '',
    fecha: '',
    pacienteNombre: '',
    attendanceId: ''
  });
  const [semanaProcesada, setSemanaProcesada] = useState(false);
  const [modalAddPatient, setModalAddPatient] = useState(false);
  const [availablePatients, setAvailablePatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  // Estados para backend
  const [currentWeek, setCurrentWeek] = useState<GroupWeek | null>(null);
  const [weekId, setWeekId] = useState<string | null>(null);
  const [weekLocked, setWeekLocked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Funciones auxiliares
  const getStartOfWeek = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lunes
    return new Date(d.setDate(diff));
  };

  const getEndOfWeek = (startDate: Date): Date => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6); // 7 días (lunes a domingo)
    return endDate;
  };

  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const getDayDate = (dia: string, weekStart: string): string => {
    const dias = ['lun', 'mar', 'mie', 'jue', 'vie'];
    const dayIndex = dias.indexOf(dia);
    if (dayIndex === -1) return weekStart;

    const date = new Date(weekStart);
    date.setDate(date.getDate() + dayIndex);
    return date.toISOString().split('T')[0];
  };

  const getDayName = (dateString: string): string => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay();
    const dias = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
    return dias[dayOfWeek];
  };

  // Cargar asistencia de la semana
  const loadWeekAttendance = async (weekIdParam: string) => {
    try {
      const attendance = await attendanceService.getWeekAttendance(weekIdParam);

      // Convertir a formato del estado local
      const asistenciaMap: Record<string, RegistroAsistencia> = {};

      attendance.forEach(record => {
        const dia = getDayName(record.attendanceDate);
        const key = `${record.patientId}-${record.attendanceDate}`;
        asistenciaMap[key] = {
          pacienteId: record.patientId,
          fecha: record.attendanceDate,
          estado: record.status as AsistenciaDia,
          justificacion: undefined, // TODO: Cargar justificaciones
          registradoPor: 'Sistema',
          fechaRegistro: record.createdAt
        };
      });

      setAsistencia(asistenciaMap);

      // Verificar si la semana está bloqueada
      const isLocked = attendance.some(a => a.isLocked);
      if (isLocked) {
        setWeekLocked(true);
        setSemanaProcesada(true);
        addToast('Esta semana ya fue procesada y está bloqueada', 'warning');
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
      // No mostrar error si la semana aún no tiene asistencia
    }
  };

  useEffect(() => {
    const loadGroupData = async () => {
      try {
        setIsLoading(true);
        // Cargar datos del grupo
        const groupData = await groupsService.getById(grupoId);
        setGrupo(groupData);

        // Cargar pacientes del grupo
        const groupPatients = await groupsService.getPatients(grupoId);
        const patientIds = groupPatients.filter(gp => gp.isActive).map(gp => gp.patientId);

        // Cargar detalles de cada paciente
        const patientsData = await Promise.all(
          patientIds.map(id => patientsService.getById(id))
        );
        setPacientes(patientsData);

        // Cargar o crear semana actual
        try {
          let week: GroupWeek | null = await groupsService.getCurrentWeek(grupoId);

          if (!week) {
            // Si no existe semana actual, intentar obtener todas las semanas
            try {
              const allWeeks = await groupsService.getWeeks(grupoId);

              if (allWeeks && allWeeks.length > 0) {
                // Usar la semana más reciente
                const sortedWeeks = allWeeks.sort((a, b) =>
                  new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                );
                week = sortedWeeks[0];

                // Marcar como semana actual
                try {
                  week = await groupsService.setCurrentWeek(week.id);
                  addToast('Semana existente marcada como actual', 'success');
                } catch (setError) {
                  // Si falla marcar como actual, aún podemos usar la semana
                  console.warn('Could not set as current week:', setError);
                }
              } else {
                // No hay semanas, crear nueva
                const startDate = getStartOfWeek(new Date());
                const endDate = getEndOfWeek(startDate);

                week = await groupsService.createWeek(grupoId, {
                  weekNumber: getWeekNumber(startDate),
                  startDate: startDate.toISOString(),
                  endDate: endDate.toISOString()
                });

                addToast('Nueva semana creada automáticamente', 'success');
              }
            } catch (createError) {
              console.error('Error creating/loading week:', createError);
              addToast('No se pudo cargar la semana actual. Continúa sin semana activa.', 'warning');
              // Continuar sin semana activa
              week = null;
            }
          }

          if (week) {
            setCurrentWeek(week);
            setWeekId(week.id);
            setSemanaActual(new Date(week.startDate).toISOString().split('T')[0]);

            // Cargar asistencia de la semana
            await loadWeekAttendance(week.id);
          }
        } catch (weekError) {
          console.error('Error loading week:', weekError);
          // No mostrar toast aquí, ya se mostró arriba si fue necesario
        }
      } catch (error) {
        console.error('Error al cargar grupo:', error);
        addToast('Error al cargar el grupo', 'error');
        router.push('/grupos');
      } finally {
        setIsLoading(false);
      }
    };

    loadGroupData();
  }, [grupoId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!grupo) {
    return (
      <div className="text-center py-12">
        <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Grupo no encontrado</p>
        <Link href="/grupos" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-2 inline-block">
          Volver a la lista de grupos
        </Link>
      </div>
    );
  }

  const diasPrograma = TIPOS_PROGRAMA[grupo.programType].dias;
  const weekDates = getWeekDates(semanaActual);
  const diasSemana = diasPrograma.map(dia => {
    const diaIndex = ['lun', 'mar', 'mie', 'jue', 'vie', 'sab', 'dom'].indexOf(dia);
    return weekDates[diaIndex];
  });

  // Funciones de manejo de asistencia
  const handleAsistenciaChange = async (pacienteId: string, fecha: string, estado: AsistenciaDia) => {
    if (weekLocked) {
      addToast('Esta semana está bloqueada y no se puede modificar', 'error');
      return;
    }

    if (!weekId) {
      addToast('No hay semana activa', 'error');
      return;
    }

    // Variables para revertir cambios en caso de error
    const key = `${pacienteId}-${fecha}`;
    const prevState = asistencia[key];

    try {
      setIsSaving(true);

      // Actualizar estado local inmediatamente (optimistic update)

      setAsistencia(prev => ({
        ...prev,
        [key]: {
          pacienteId,
          fecha,
          estado,
          justificacion: undefined,
          registradoPor: 'Usuario Actual',
          fechaRegistro: new Date().toISOString()
        }
      }));

      // Guardar en backend
      const unitsAttended = estado === 'P'
        ? (grupo?.programType === 'PHP' ? 6 : 3)
        : 0;

      const attendanceRecord = await attendanceService.markAttendance({
        weekId: weekId,
        patientId: pacienteId,
        attendanceDate: fecha,
        status: estado as any,
        unitsAttended: unitsAttended
      });

      // Si es ausencia, abrir modal de justificación
      if (estado === 'A') {
        const paciente = pacientes.find(p => p.id === pacienteId);
        setModalJustificacion({
          show: true,
          pacienteId,
          fecha,
          pacienteNombre: `${paciente?.firstName || ''} ${paciente?.lastName || ''}`,
          attendanceId: attendanceRecord.id
        });
      }

      addToast('Asistencia guardada exitosamente', 'success');
    } catch (error) {
      console.error('Error saving attendance:', error);
      addToast('Error al guardar asistencia', 'error');

      // Revertir cambio optimista
      if (prevState) {
        setAsistencia(prev => ({
          ...prev,
          [key]: prevState
        }));
      } else {
        setAsistencia(prev => {
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleJustificacion = async (tipo: Justificacion) => {
    if (!modalJustificacion.attendanceId) {
      addToast('No se encontró el registro de asistencia', 'error');
      return;
    }

    try {
      setIsSaving(true);

      // Mapear tipos de justificación al backend
      const reasonTypeMap: Record<string, ReasonType> = {
        'Medical appointment': ReasonType.MEDICAL_APPOINTMENT,
        'Family trip': ReasonType.FAMILY_TRIP,
        'Hospitalized': ReasonType.HOSPITALIZED,
      };

      const reasonType = reasonTypeMap[tipo] || ReasonType.MEDICAL_APPOINTMENT;

      // Guardar justificación en backend
      await attendanceService.justifyAbsence({
        attendanceId: modalJustificacion.attendanceId,
        reasonType: reasonType,
        startDate: modalJustificacion.fecha,
        endDate: modalJustificacion.fecha,
        notes: `Justificación: ${tipo}`
      });

      // Actualizar estado local
      const key = `${modalJustificacion.pacienteId}-${modalJustificacion.fecha}`;
      setAsistencia(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          justificacion: { tipo, rango: undefined }
        }
      }));

      addToast('Justificación guardada exitosamente', 'success');
      setModalJustificacion({ show: false, pacienteId: '', fecha: '', pacienteNombre: '', attendanceId: '' });
    } catch (error) {
      console.error('Error saving justification:', error);
      addToast('Error al guardar justificación', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const getEstadoAsistencia = (pacienteId: string, fecha: string): AsistenciaDia => {
    const paciente = pacientes.find(p => p.id === pacienteId);
    
    // Si tiene dischargeDate y la fecha es >= dischargeDate, mostrar D
    if (paciente?.dischargeDate && new Date(fecha) >= new Date(paciente.dischargeDate)) {
      return 'D';
    }
    
    const key = `${pacienteId}-${fecha}`;
    return asistencia[key]?.estado || 'P';
  };

  const isDisabled = (pacienteId: string, fecha: string): boolean => {
    const paciente = pacientes.find(p => p.id === pacienteId);
    return paciente?.dischargeDate ? new Date(fecha) >= new Date(paciente.dischargeDate) : false;
  };

  const getJustificacion = (pacienteId: string, fecha: string): string | null => {
    const key = `${pacienteId}-${fecha}`;
    return asistencia[key]?.justificacion?.tipo || null;
  };

  // Estadísticas de asistencia
  const getAsistenciaStats = () => {
    let presentes = 0;
    let ausentes = 0;
    let altas = 0;
    let totalRegistros = 0;

    diasSemana.forEach(fecha => {
      pacientes.forEach(paciente => {
        const estado = getEstadoAsistencia(paciente.id, fecha);
        totalRegistros++;
        
        if (estado === 'P') presentes++;
        else if (estado === 'A') ausentes++;
        else if (estado === 'D') altas++;
      });
    });

    const porcentajeAsistencia = totalRegistros > 0 ? 
      Math.round((presentes / (presentes + ausentes)) * 100) : 0;

    return { presentes, ausentes, altas, totalRegistros, porcentajeAsistencia };
  };

  const stats = getAsistenciaStats();

  // Navegación de semanas
  const prevWeek = () => {
    const prev = new Date(semanaActual);
    prev.setDate(prev.getDate() - 7);
    setSemanaActual(prev.toISOString().split('T')[0]);
    setSemanaProcesada(false);
  };

  const nextWeek = () => {
    const next = new Date(semanaActual);
    next.setDate(next.getDate() + 7);
    setSemanaActual(next.toISOString().split('T')[0]);
    setSemanaProcesada(false);
  };

  const procesarSemana = async () => {
    if (!weekId) {
      addToast('No hay semana activa para procesar', 'error');
      return;
    }

    if (weekLocked) {
      addToast('Esta semana ya fue procesada', 'warning');
      return;
    }

    try {
      setIsSaving(true);

      // Validar que todas las asistencias estén marcadas
      const unmarked: string[] = [];
      diasSemana.forEach(fecha => {
        pacientes.forEach(paciente => {
          const key = `${paciente.id}-${fecha}`;
          if (!asistencia[key] && !paciente.dischargeDate) {
            unmarked.push(`${paciente.firstName} ${paciente.lastName} - ${formatDate(fecha)}`);
          }
        });
      });

      if (unmarked.length > 0) {
        addToast(
          `Faltan marcar ${unmarked.length} asistencias. Por favor, completa todos los registros.`,
          'error'
        );
        return;
      }

      // Validar que todas las ausencias estén justificadas
      const unjustified: string[] = [];
      Object.entries(asistencia).forEach(([key, record]) => {
        if (record.estado === 'A' && !record.justificacion) {
          const paciente = pacientes.find(p => p.id === record.pacienteId);
          unjustified.push(`${paciente?.firstName || ''} ${paciente?.lastName || ''} - ${formatDate(record.fecha)}`);
        }
      });

      if (unjustified.length > 0) {
        addToast(
          `Faltan justificar ${unjustified.length} ausencias. Todas las ausencias deben estar justificadas.`,
          'error'
        );
        return;
      }

      // Bloquear toda la asistencia de la semana
      await attendanceService.lockWeekAttendance(weekId);

      setSemanaProcesada(true);
      setWeekLocked(true);

      addToast('Semana procesada y bloqueada exitosamente', 'success');

      // Redirigir a página de generación de notas con weekId
      setTimeout(() => {
        router.push(`/grupos/${grupoId}/notas?weekId=${weekId}`);
      }, 1500);
    } catch (error) {
      console.error('Error processing week:', error);
      addToast('Error al procesar la semana', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const resetSemana = () => {
    if (confirm('¿Estás seguro de que deseas resetear toda la asistencia de esta semana?')) {
      setAsistencia(prev => {
        const newAsistencia = { ...prev };
        diasSemana.forEach(fecha => {
          pacientes.forEach(paciente => {
            const key = `${paciente.id}-${fecha}`;
            delete newAsistencia[key];
          });
        });
        return newAsistencia;
      });
      setSemanaProcesada(false);
    }
  };

  const openAddPatientModal = async () => {
    try {
      // Cargar todos los pacientes activos
      const allPatients = await patientsService.getActive();

      // Filtrar los que NO están en el grupo
      const currentPatientIds = pacientes.map(p => p.id);
      const available = allPatients.filter(p => !currentPatientIds.includes(p.id));

      setAvailablePatients(available);
      setModalAddPatient(true);
    } catch (error) {
      console.error('Error al cargar pacientes disponibles:', error);
      addToast('Error al cargar pacientes disponibles', 'error');
    }
  };

  const handleAddPatient = async () => {
    if (!selectedPatientId) {
      addToast('Selecciona un paciente', 'warning');
      return;
    }

    try {
      await groupsService.addPatient(grupoId, {
        patientId: selectedPatientId,
        joinedDate: new Date().toISOString()
      });

      addToast('Paciente agregado exitosamente', 'success');
      setModalAddPatient(false);
      setSelectedPatientId('');

      // Recargar pacientes del grupo
      const groupPatients = await groupsService.getPatients(grupoId);
      const patientIds = groupPatients.filter(gp => gp.isActive).map(gp => gp.patientId);
      const patientsData = await Promise.all(
        patientIds.map(id => patientsService.getById(id))
      );
      setPacientes(patientsData);
    } catch (error) {
      console.error('Error al agregar paciente:', error);
      addToast('Error al agregar paciente al grupo', 'error');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              {grupo.groupName || `Grupo ${grupo.programType}`}
            </h1>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
              <div className="flex items-center space-x-2">
                <Badge variant={grupo.programType.toLowerCase() as 'php' | 'iop'}>{grupo.programType}</Badge>
                <Badge variant="default">{grupo.shift}</Badge>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span>{pacientes.length} pacientes</span>
              </div>
              <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span>{diasPrograma.length} días/semana</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 w-full lg:w-auto">
            <Button
              onClick={openAddPatientModal}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 flex-1 sm:flex-none justify-center text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/20"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Agregar Paciente</span>
              <span className="sm:hidden">Agregar</span>
            </Button>
            {semanaProcesada && (
              <Button
                onClick={resetSemana}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
              >
                Resetear Semana
              </Button>
            )}
            <Button
              onClick={procesarSemana}
              disabled={semanaProcesada}
              variant={semanaProcesada ? "outline" : "default"}
              className="flex items-center space-x-2 flex-1 sm:flex-none justify-center"
              size="sm"
            >
              {semanaProcesada ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Semana Procesada</span>
                  <span className="sm:hidden">Procesada</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span className="hidden sm:inline">Procesar Semana</span>
                  <span className="sm:hidden">Procesar</span>
                </>
              )}
            </Button>
            <Link
              href={`/grupos/${grupo.id}/notas`}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 flex items-center space-x-2 transition-colors flex-1 sm:flex-none justify-center text-sm"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Ver Notas</span>
              <span className="sm:hidden">Notas</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Week Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-4 sm:mb-6">
        <Button
          onClick={prevWeek}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Semana Anterior</span>
          <span className="sm:hidden">Anterior</span>
        </Button>

        <div className="text-center">
          <div className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            {formatDate(diasSemana[0])} - {formatDate(diasSemana[diasSemana.length - 1])}
          </div>
          <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Semana del {getDayNameShort(diasSemana[0])} al {getDayNameShort(diasSemana[diasSemana.length - 1])}
          </div>
        </div>

        <Button
          onClick={nextWeek}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2 w-full sm:w-auto justify-center"
        >
          <span className="hidden sm:inline">Semana Siguiente</span>
          <span className="sm:hidden">Siguiente</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <UserCheck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400 mr-2 sm:mr-3" />
            <div>
              <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{stats.presentes}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Presentes</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <UserX className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 dark:text-red-400 mr-2 sm:mr-3" />
            <div>
              <div className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">{stats.ausentes}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Ausentes</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <UserMinus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600 dark:text-gray-400 mr-2 sm:mr-3" />
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.altas}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Altas</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center">
            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400 mr-2 sm:mr-3" />
            <div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {isNaN(stats.porcentajeAsistencia) ? 0 : stats.porcentajeAsistencia}%
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Asistencia</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400 mr-2 sm:mr-3" />
            <div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalRegistros}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total registros</div>
            </div>
          </div>
        </div>
      </div>

      {/* Información del programa */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900 dark:text-blue-100">
              Información del Programa {grupo.programType}
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
              {grupo.programType === 'PHP' ? (
                <>Programa de Hospitalización Parcial: Lunes a Viernes. <strong>Viernes</strong> requiere doble documentación.</>
              ) : (
                <>Programa Intensivo Ambulatorio: Lunes a Jueves. <strong>Jueves</strong> requiere doble documentación.</>
              )}
            </p>
            <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
              Días activos: {diasPrograma.join(', ').toUpperCase()} •
              Doble nota: {TIPOS_PROGRAMA[grupo.programType].dobleDia.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Aviso de scroll horizontal en móvil */}
      <div className="lg:hidden bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-3 mb-4">
        <div className="flex items-start">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-300">
            Desliza horizontalmente para ver todos los días de la semana
          </p>
        </div>
      </div>

      {/* Tabla de Asistencia */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            Registro de Asistencia Semanal
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            P = Presente, A = Ausente (requiere justificación), D = Discharge/Alta
          </p>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky left-0 bg-gray-50 dark:bg-gray-900 z-10 min-w-[200px]">
                  Paciente
                </th>
                {diasPrograma.map((dia, index) => {
                  const fecha = diasSemana[index];
                  const actividades: any[] = []; // TODO: Obtener actividades del backend
                  const esHoy = isToday(fecha);
                  const esPasado = isPast(fecha);
                  const esDobleDia = TIPOS_PROGRAMA[grupo.programType].dobleDia === dia;

                  return (
                    <th key={dia} className="px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider min-w-[140px] relative">
                      <div className="space-y-2">
                        {/* Día y fecha */}
                        <div className={`font-semibold ${esHoy ? 'text-blue-700 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'} capitalize`}>
                          {dia}
                          {esHoy && <span className="ml-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1 rounded">HOY</span>}
                        </div>
                        <div className={`text-xs ${esHoy ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
                          {formatDate(fecha)}
                        </div>

                        {/* Actividades */}
                        <div className="space-y-1 mt-2">
                          {actividades.slice(0, 3).map(act => (
                            <div key={act.codigo} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                              {act.codigo}
                            </div>
                          ))}
                          {actividades.length > 3 && (
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              +{actividades.length - 3} más
                            </div>
                          )}
                        </div>

                        {/* Indicador de doble nota */}
                        {esDobleDia && (
                          <div className="mt-2">
                            <Badge variant="warning" className="text-xs">Doble Nota</Badge>
                          </div>
                        )}

                        {/* Indicador visual de estado */}
                        <div className={`absolute top-0 left-0 w-full h-1 ${
                          esHoy ? 'bg-blue-500 dark:bg-blue-600' : esPasado ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}></div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pacientes.map(paciente => {
                const tieneAlta = paciente.dischargeDate;
                const fechaAlta = paciente.dischargeDate ? new Date(paciente.dischargeDate) : null;

                return (
                  <tr key={paciente.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-200 dark:border-gray-700">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          <Link
                            href={`/pacientes/${paciente.id}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {`${paciente.firstName} ${paciente.lastName}`}
                          </Link>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                          <span>{paciente.patientNumber}</span>
                          {paciente.diagnoses.length > 0 && (
                            <Badge variant="gray">{paciente.diagnoses[0]?.icd10Code}</Badge>
                          )}
                        </div>
                        {tieneAlta && (
                          <div className="mt-1">
                            <Badge variant="default" className="text-xs">
                              Alta: {formatDate(paciente.dischargeDate!)}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </td>

                    {diasSemana.map((fecha, diaIndex) => {
                      const estado = getEstadoAsistencia(paciente.id, fecha);
                      const disabled = isDisabled(paciente.id, fecha);
                      const justificacion = getJustificacion(paciente.id, fecha);
                      const esHoy = isToday(fecha);
                      const esPasado = isPast(fecha);

                      return (
                        <td key={fecha} className={`px-4 py-4 whitespace-nowrap text-center relative ${
                          esHoy ? 'bg-blue-50 dark:bg-blue-900/20' : esPasado ? 'bg-gray-50 dark:bg-gray-700/50' : ''
                        }`}>
                          {disabled ? (
                            <div className="flex flex-col items-center space-y-1">
                              <Badge variant="default">D</Badge>
                              <span className="text-xs text-gray-500 dark:text-gray-400">Alta</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center space-y-2">
                              <select
                                value={estado}
                                onChange={(e) => handleAsistenciaChange(paciente.id, fecha, e.target.value as AsistenciaDia)}
                                disabled={weekLocked || isSaving}
                                className={`text-sm border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                  estado === 'P' ? 'border-green-300 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-900/30 dark:text-green-300' :
                                  estado === 'A' ? 'border-red-300 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                  'border-gray-300 bg-gray-50 text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
                                }`}
                              >
                                <option value="P">P</option>
                                <option value="A">A</option>
                                <option value="D">D</option>
                              </select>

                              {/* Mostrar justificación si existe */}
                              {justificacion && (
                                <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded border border-red-200 dark:border-red-800">
                                  {justificacion === 'Medical appointment' && 'Cita médica'}
                                  {justificacion === 'Family trip' && 'Viaje familiar'}
                                  {justificacion === 'Hospitalized' && 'Hospitalizado'}
                                  {justificacion === 'Personal emergency' && 'Emergencia'}
                                  {justificacion === 'Court appearance' && 'Cita judicial'}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leyenda y notas */}
      <div className="mt-4 sm:mt-6 grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Leyenda de Asistencia</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Badge variant="success">P</Badge>
              <span className="text-gray-700 dark:text-gray-300">Presente - Participó en todas las actividades del día</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="error">A</Badge>
              <span className="text-gray-700 dark:text-gray-300">Ausente - Requiere justificación obligatoria</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="default">D</Badge>
              <span className="text-gray-700 dark:text-gray-300">Discharge/Alta - Paciente dado de alta</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Notas Importantes</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <span>Las ausencias deben justificarse para generar notas completas</span>
            </div>
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <span>Los {grupo.programType === 'PHP' ? 'viernes' : 'jueves'} requieren doble documentación</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <span>Solo se generan notas para días con asistencia "Presente"</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de Justificación */}
      <Dialog
        isOpen={modalJustificacion.show}
        onClose={() => setModalJustificacion({ show: false, pacienteId: '', fecha: '', pacienteNombre: '', attendanceId: '' })}
        title={`Justificación de Ausencia`}
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Información de la Ausencia</h4>
            <div className="mt-2 text-sm text-blue-800 dark:text-blue-300">
              <p><strong>Paciente:</strong> {modalJustificacion.pacienteNombre}</p>
              <p><strong>Fecha:</strong> {formatDate(modalJustificacion.fecha)}</p>
              <p className="mt-1 text-xs">Selecciona el motivo de la ausencia para completar el registro:</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleJustificacion('Medical appointment')}
              className="w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">Medical appointment</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Cita médica programada o emergencia médica</div>
            </button>

            <button
              onClick={() => handleJustificacion('Family trip')}
              className="w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">Family trip</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Viaje familiar o compromiso familiar importante</div>
            </button>

            <button
              onClick={() => handleJustificacion('Hospitalized')}
              className="w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">Hospitalized</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Hospitalización o internamiento médico</div>
            </button>

            <button
              onClick={() => handleJustificacion('Personal emergency')}
              className="w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">Personal emergency</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Emergencia personal o familiar</div>
            </button>

            <button
              onClick={() => handleJustificacion('Court appearance')}
              className="w-full text-left px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <div className="font-medium text-gray-900 dark:text-gray-100">Court appearance</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Comparecencia judicial o legal</div>
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={() => setModalJustificacion({ show: false, pacienteId: '', fecha: '', pacienteNombre: '', attendanceId: '' })}
              variant="outline"
              className="w-full"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Modal de Agregar Paciente */}
      <Dialog
        isOpen={modalAddPatient}
        onClose={() => {
          setModalAddPatient(false);
          setSelectedPatientId('');
        }}
        title="Agregar Paciente al Grupo"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">Selecciona un paciente</h4>
            <p className="mt-1 text-sm text-blue-800 dark:text-blue-300">
              Selecciona un paciente activo para agregarlo al grupo. Solo se muestran pacientes que no están actualmente en el grupo.
            </p>
          </div>

          {availablePatients.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No hay pacientes disponibles para agregar</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                Todos los pacientes activos ya están en este grupo
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availablePatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatientId(patient.id)}
                  className={`w-full text-left px-4 py-3 border rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedPatientId === patient.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-600'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {patient.firstName} {patient.lastName}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {patient.patientNumber}
                        </span>
                        {patient.diagnoses && patient.diagnoses.length > 0 && (
                          <Badge variant="gray" className="text-xs">
                            {patient.diagnoses[0]?.icd10Code}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {selectedPatientId === patient.id && (
                      <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={() => {
                setModalAddPatient(false);
                setSelectedPatientId('');
              }}
              variant="outline"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddPatient}
              disabled={!selectedPatientId}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:text-gray-500"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Agregar Paciente
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}