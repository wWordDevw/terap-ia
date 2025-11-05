'use client';

import React, { useState } from 'react';
import { Check, X, UserCheck, AlertCircle, MessageSquare, Calendar, TrendingUp } from 'lucide-react';

import { formatDate, getDayNameShort, isToday, isPast, isFuture } from '@/lib/utils';
import { TIPOS_PROGRAMA } from '@/lib/constants';
import type { Paciente, Grupo, RegistroAsistencia, AsistenciaDia, Justificacion } from '@/lib/types';
import Badge from '../ui/bagde';

interface AsistenciaTableProps {
  grupo: Grupo;
  pacientes: Paciente[];
  fechas: string[]; // Array de fechas de la semana
  asistencia: Record<string, RegistroAsistencia>;
  onAsistenciaChange: (pacienteId: string, fecha: string, estado: AsistenciaDia, justificacion?: RegistroAsistencia['justificacion']) => void;
  className?: string;
}

interface ModalJustificacionProps {
  isOpen: boolean;
  paciente: Paciente | null;
  fecha: string;
  onClose: () => void;
  onSave: (justificacion: RegistroAsistencia['justificacion']) => void;
}

const JUSTIFICACIONES: Justificacion[] = [
  'Medical appointment',
  'Family trip',
  'Hospitalized',
  'Personal emergency',
  'Court appearance'
];

const ModalJustificacion: React.FC<ModalJustificacionProps> = ({
  isOpen,
  paciente,
  fecha,
  onClose,
  onSave
}) => {
  const [tipo, setTipo] = useState<Justificacion | ''>('');
  const [rango, setRango] = useState({ desde: '', hasta: '' });
  const [notas, setNotas] = useState('');
  const [isRangoEnabled, setIsRangoEnabled] = useState(false);

  const handleSave = () => {
    if (!tipo) return;

    const justificacion: RegistroAsistencia['justificacion'] = {
      tipo,
      notas: notas.trim() || undefined,
      rango: isRangoEnabled && rango.desde && rango.hasta ? rango : undefined
    };

    onSave(justificacion);
    handleClose();
  };

  const handleClose = () => {
    setTipo('');
    setRango({ desde: '', hasta: '' });
    setNotas('');
    setIsRangoEnabled(false);
    onClose();
  };

  if (!isOpen || !paciente) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Justificar Ausencia
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Paciente:</strong> {paciente.nombre}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Fecha:</strong> {formatDate(fecha)}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Justificación *
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as Justificacion)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar motivo</option>
              {JUSTIFICACIONES.map(justif => (
                <option key={justif} value={justif}>{justif}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={isRangoEnabled}
                onChange={(e) => setIsRangoEnabled(e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
              <span>Ausencia por rango de fechas</span>
            </label>
          </div>

          {isRangoEnabled && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Desde
                </label>
                <input
                  type="date"
                  value={rango.desde}
                  onChange={(e) => setRango(prev => ({ ...prev, desde: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hasta
                </label>
                <input
                  type="date"
                  value={rango.hasta}
                  onChange={(e) => setRango(prev => ({ ...prev, hasta: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas adicionales
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Información adicional sobre la ausencia..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!tipo}
            className="px-4 py-2 bg-sidebar-primary text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Guardar Justificación
          </button>
        </div>
      </div>
    </div>
  );
};

const AsistenciaTable: React.FC<AsistenciaTableProps> = ({
  grupo,
  pacientes,
  fechas,
  asistencia,
  onAsistenciaChange,
  className = ''
}) => {
  const [modalJustificacion, setModalJustificacion] = useState({
    isOpen: false,
    paciente: null as Paciente | null,
    fecha: ''
  });

  // Filtrar fechas según el tipo de programa
   // Filtrar fechas según el tipo de programa
  const diasPrograma = TIPOS_PROGRAMA[grupo.tipo].dias;
  const fechasFiltradas = fechas.filter(fecha => {
    const dia = getDayNameShort(fecha);
    return (diasPrograma as readonly string[]).includes(dia);
  });

  // Obtener el registro de asistencia para un paciente y fecha - CORREGIDO
  const getAsistencia = (pacienteId: string, fecha: string): RegistroAsistencia | null => {
    const key = `${pacienteId}-${fecha}`;
    return asistencia[key] ?? null;
  };

  // Manejar cambio de asistencia
  const handleAsistenciaClick = (paciente: Paciente, fecha: string, nuevoEstado: AsistenciaDia) => {
    const registroActual = getAsistencia(paciente.id, fecha);
    
    // Si es discharge, verificar si ya está dado de alta
    if (nuevoEstado === 'D' && paciente.discharge) {
      const fechaDischarge = new Date(paciente.discharge);
      const fechaClick = new Date(fecha);
      
      if (fechaClick > fechaDischarge) {
        // No permitir cambios después del discharge
        return;
      }
    }

    // Si se marca ausente y no hay justificación, abrir modal
    if (nuevoEstado === 'A' && (!registroActual || !registroActual.justificacion)) {
      setModalJustificacion({
        isOpen: true,
        paciente,
        fecha
      });
      return;
    }

    // Para presente o discharge, cambiar directamente
    onAsistenciaChange(paciente.id, fecha, nuevoEstado);
  };

  // Guardar justificación desde modal
  const handleSaveJustificacion = (justificacion: RegistroAsistencia['justificacion']) => {
    if (modalJustificacion.paciente) {
      onAsistenciaChange(
        modalJustificacion.paciente.id,
        modalJustificacion.fecha,
        'A',
        justificacion
      );
    }
  };

  // Obtener clase CSS para celda de asistencia
  const getCellClass = (estado: AsistenciaDia | null, fecha: string) => {
    const baseClass = 'w-12 h-10 border border-gray-200 cursor-pointer transition-all duration-200 flex items-center justify-center';
    
    if (isFuture(fecha)) {
      return `${baseClass} bg-gray-50 hover:bg-gray-100`;
    }

    switch (estado) {
      case 'P':
        return `${baseClass} bg-green-100 border-green-300 hover:bg-green-200 text-green-800`;
      case 'A':
        return `${baseClass} bg-red-100 border-red-300 hover:bg-red-200 text-red-800`;
      case 'D':
        return `${baseClass} bg-purple-100 border-purple-300 hover:bg-purple-200 text-purple-800`;
      default:
        return `${baseClass} bg-white hover:bg-gray-50`;
    }
  };

  // Calcular estadísticas
  const calcularEstadisticas = () => {
    const fechasPasadas = fechasFiltradas.filter(fecha => isPast(fecha) || isToday(fecha));
    let totalPresentes = 0;
    let totalAusentes = 0;
    let totalAltas = 0;
    let totalSesiones = 0;

    pacientes.forEach(paciente => {
      fechasPasadas.forEach(fecha => {
        const registro = getAsistencia(paciente.id, fecha);
        if (registro) {
          totalSesiones++;
          switch (registro.estado) {
            case 'P':
              totalPresentes++;
              break;
            case 'A':
              totalAusentes++;
              break;
            case 'D':
              totalAltas++;
              break;
          }
        }
      });
    });

    const porcentajeAsistencia = totalSesiones > 0 
      ? Math.round((totalPresentes / totalSesiones) * 100) 
      : 0;

    return {
      totalPresentes,
      totalAusentes,
      totalAltas,
      totalSesiones,
      porcentajeAsistencia
    };
  };

  const estadisticas = calcularEstadisticas();

  // Verificar si un paciente está dado de alta antes de una fecha
  const isPacienteActivo = (paciente: Paciente, fecha: string): boolean => {
    if (!paciente.discharge) return true;
    
    const fechaDischarge = new Date(paciente.discharge);
    const fechaVerificar = new Date(fecha);
    
    return fechaVerificar <= fechaDischarge;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header con estadísticas */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <UserCheck className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Control de Asistencia - {grupo.tipo}
              </h3>
              <p className="text-sm text-gray-600">
                {fechasFiltradas[0] && fechasFiltradas[fechasFiltradas.length - 1] &&
                  `${formatDate(fechasFiltradas[0])} - ${formatDate(fechasFiltradas[fechasFiltradas.length - 1])}`
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{estadisticas.porcentajeAsistencia}%</div>
              <div className="text-xs text-gray-500">Asistencia</div>
            </div>
          </div>
        </div>

        {/* Estadísticas detalladas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium text-green-900">Presentes</span>
            </div>
            <div className="text-2xl font-bold text-green-700 mt-1">{estadisticas.totalPresentes}</div>
          </div>
          
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-medium text-red-900">Ausentes</span>
            </div>
            <div className="text-2xl font-bold text-red-700 mt-1">{estadisticas.totalAusentes}</div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="font-medium text-purple-900">Altas</span>
            </div>
            <div className="text-2xl font-bold text-purple-700 mt-1">{estadisticas.totalAltas}</div>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-blue-900">Total Sesiones</span>
            </div>
            <div className="text-2xl font-bold text-blue-700 mt-1">{estadisticas.totalSesiones}</div>
          </div>
        </div>
      </div>

      {/* Tabla de asistencia */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-4 font-medium text-gray-900 min-w-[200px]">
                Paciente
              </th>
              {fechasFiltradas.map(fecha => {
                const dia = getDayNameShort(fecha);
                const esDobleNota = TIPOS_PROGRAMA[grupo.tipo].dobleDia === dia;
                
                return (
                  <th key={fecha} className="text-center p-2 min-w-[60px]">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900 text-xs uppercase">
                        {dia}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatDate(fecha).split('/').slice(0, 2).join('/')}
                      </div>
                      {esDobleNota && (
                        <Badge variant="warning" size="sm">2x</Badge>
                      )}
                      {isToday(fecha) && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto"></div>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          
          <tbody>
            {pacientes.map(paciente => (
              <tr key={paciente.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <div>
                    <div className="font-medium text-gray-900">{paciente.nombre}</div>
                    <div className="text-sm text-gray-600">#{paciente.numeroClinica}</div>
                    {paciente.discharge && (
                      <div className="text-xs text-purple-600 mt-1">
                        Alta: {formatDate(paciente.discharge)}
                      </div>
                    )}
                  </div>
                </td>
                
                {fechasFiltradas.map(fecha => {
                  const registro = getAsistencia(paciente.id, fecha);
                  const estado = registro?.estado || null;
                  const tieneJustificacion = registro?.justificacion;
                  const pacienteActivo = isPacienteActivo(paciente, fecha);
                  const puedeEditar = !isFuture(fecha) && pacienteActivo;
                  
                  return (
                    <td key={fecha} className="p-1">
                      <div className="flex flex-col items-center space-y-1">
                        {!pacienteActivo ? (
                          <div className="w-12 h-10 border border-gray-200 bg-gray-100 flex items-center justify-center">
                            <span className="text-xs text-gray-400">N/A</span>
                          </div>
                        ) : (
                          <div className="relative">
                            <div className={getCellClass(estado, fecha)}>
                              {estado === 'P' && <Check className="w-4 h-4" />}
                              {estado === 'A' && <X className="w-4 h-4" />}
                              {estado === 'D' && <UserCheck className="w-4 h-4" />}
                              {!estado && puedeEditar && (
                                <div className="text-xs text-gray-400">-</div>
                              )}
                            </div>
                            
                            {/* Dropdown para cambiar estado */}
                            {puedeEditar && (
                              <select
                                value={estado || ''}
                                onChange={(e) => {
                                  const nuevoEstado = e.target.value as AsistenciaDia;
                                  if (nuevoEstado) {
                                    handleAsistenciaClick(paciente, fecha, nuevoEstado);
                                  }
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              >
                                <option value="">-</option>
                                <option value="P">P</option>
                                <option value="A">A</option>
                                <option value="D">D</option>
                              </select>
                            )}
                            
                            {/* Indicador de justificación */}
                            {tieneJustificacion && (
                              <div 
                                className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center cursor-help"
                                title={`Justificación: ${tieneJustificacion.tipo}`}
                              >
                                <MessageSquare className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leyenda */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded flex items-center justify-center">
                <Check className="w-3 h-3 text-green-700" />
              </div>
              <span className="text-gray-700">Presente (P)</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded flex items-center justify-center">
                <X className="w-3 h-3 text-red-700" />
              </div>
              <span className="text-gray-700">Ausente (A)</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-purple-100 border border-purple-300 rounded flex items-center justify-center">
                <UserCheck className="w-3 h-3 text-purple-700" />
              </div>
              <span className="text-gray-700">Discharge (D)</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span className="text-gray-700">Con justificación</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Click en las celdas para cambiar el estado de asistencia
          </div>
        </div>
      </div>

      {/* Modal de justificación */}
      <ModalJustificacion
        isOpen={modalJustificacion.isOpen}
        paciente={modalJustificacion.paciente}
        fecha={modalJustificacion.fecha}
        onClose={() => setModalJustificacion(prev => ({ ...prev, isOpen: false }))}
        onSave={handleSaveJustificacion}
      />
    </div>
  );
};

export default AsistenciaTable;