'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Edit, Save, RotateCcw, Eye, Download, Users, Clock, CheckSquare, X } from 'lucide-react';
import Badge from '@/components/ui/bagde';
import DocumentPreview from './document-preview';
import { formatDate, getDayNameShort, capitalize } from '@/lib/utils';
import { TIPOS_PROGRAMA } from '@/lib/constants';
import type { Paciente, Grupo, NotaDiaria, MetricasType, MetricaValor, Actividad } from '@/lib/types';

interface ActividadPaciente {
  actividad: Actividad;
  parrafoBase: string;
  respuestaCliente: string;
  goalVinculado: string;
}

interface PacienteNota {
  pacienteId: string;
  nombre: string;
  numeroClinica: string;
  unidades: number;
  icd10Primario: string;
  goalsSemana: string[];
  metricas: MetricasType;
  actividades: ActividadPaciente[];
  parrafoFinal: string;
  tipoProgreso: 'Minimal' | 'Moderate';
}

interface NotasDiariasProps {
  grupo: Grupo;
  pacientes: Paciente[];
  fecha: string;
  asistencia: Record<string, 'P' | 'A' | 'D'>;
  className?: string;
}

// Párrafos base rotativos para diferentes actividades
const PARAGRAFOS_BASE: Record<string, string[]> = {
  'GS': [
    'Patient participated in group skills session focusing on communication techniques and interpersonal effectiveness.',
    'During group skills training, patient engaged in exercises designed to improve social communication and conflict resolution.',
    'Patient attended group skills session working on emotional regulation and effective communication strategies.',
    'In group skills practice, patient demonstrated engagement in learning communication patterns and boundary setting.'
  ],
  'CB': [
    'Patient participated in cognitive behavioral therapy session exploring thought patterns and behavioral interventions.',
    'During CBT group, patient worked on identifying cognitive distortions and developing healthier thinking patterns.',
    'Patient engaged in cognitive behavioral therapy focusing on mood management and behavioral activation techniques.',
    'In CBT session, patient practiced challenging negative thoughts and implementing coping strategies.'
  ],
  'RT': [
    'Patient participated in recreational therapy activities designed to promote social interaction and stress reduction.',
    'During recreational therapy, patient engaged in therapeutic activities promoting teamwork and healthy leisure skills.',
    'Patient attended recreational therapy session focusing on building social connections and improving mood.',
    'In recreational therapy, patient demonstrated participation in structured activities promoting wellness and recovery.'
  ],
  'DEFAULT': [
    'Patient participated actively in therapeutic activities and demonstrated appropriate engagement throughout the session.',
    'During the therapeutic session, patient showed willingness to engage and participate in treatment activities.',
    'Patient attended therapeutic programming and demonstrated adequate participation in scheduled activities.',
    'In today\'s therapeutic session, patient engaged appropriately and followed program structure and expectations.'
  ]
};

// Goals rotativos por paciente (simulados)
const GOALS_POOL = [
  'Patient will demonstrate improved coping skills when experiencing anxiety or stress',
  'Patient will identify and implement healthy communication strategies in interpersonal relationships',
  'Patient will develop and maintain a consistent self-care routine to support mental health',
  'Patient will utilize learned mindfulness techniques to manage emotional dysregulation',
  'Patient will demonstrate improved problem-solving skills when facing daily challenges',
  'Patient will establish and maintain healthy boundaries in personal relationships',
  'Patient will participate actively in treatment activities to support recovery goals',
  'Patient will identify personal triggers and implement appropriate coping strategies'
];

const NotasDiarias: React.FC<NotasDiariasProps> = ({
  grupo,
  pacientes,
  fecha,
  asistencia,
  className = ''
}) => {
  const [notasData, setNotasData] = useState<NotaDiaria | null>(null);
  const [editingPatient, setEditingPatient] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [rotationIndex, setRotationIndex] = useState<Record<string, number>>({});
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [notasPerPage, setNotasPerPage] = useState(5);

  const dia = getDayNameShort(fecha);
  const actividades = grupo.horarios[dia]?.actividades || [];
  const pacientesPresentes = pacientes.filter(p => asistencia[p.id] === 'P');

  // Lógica de paginación
  const totalNotas = notasData?.pacientes.length || 0;
  const totalPages = Math.ceil(totalNotas / notasPerPage);
  const startIndex = (currentPage - 1) * notasPerPage;
  const endIndex = startIndex + notasPerPage;
  const notasPaginadas = notasData?.pacientes.slice(startIndex, endIndex) || [];

  // Funciones de paginación
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handleNotasPerPageChange = (newNotasPerPage: number) => {
    setNotasPerPage(newNotasPerPage);
    setCurrentPage(1); // Reset a la primera página
  };

  // Función para obtener párrafo rotativo
  const getParagrafoRotativo = (codigoActividad: string, pacienteId: string): string => {
    const key = `${codigoActividad}-${pacienteId}`;
    const paragrafos = PARAGRAFOS_BASE[codigoActividad] || PARAGRAFOS_BASE['DEFAULT'];
    const currentIndex = rotationIndex[key] || 0;
    
    return paragrafos[currentIndex % paragrafos.length];
  };

  // Función para rotar párrafo
  const rotarParrafo = (codigoActividad: string, pacienteId: string) => {
    const key = `${codigoActividad}-${pacienteId}`;
    setRotationIndex(prev => ({
      ...prev,
      [key]: (prev[key] || 0) + 1
    }));
    
    // Actualizar el párrafo en las notas
    if (notasData) {
      const nuevasNotas = { ...notasData };
      const pacienteIndex = nuevasNotas.pacientes.findIndex(p => p.pacienteId === pacienteId);
      
      if (pacienteIndex !== -1) {
        const actividadIndex = nuevasNotas.pacientes[pacienteIndex].actividades.findIndex(
          a => a.actividad.codigo === codigoActividad
        );
        
        if (actividadIndex !== -1) {
          nuevasNotas.pacientes[pacienteIndex].actividades[actividadIndex].parrafoBase = 
            getParagrafoRotativo(codigoActividad, pacienteId);
          setNotasData(nuevasNotas);
        }
      }
    }
  };

  // Función para obtener goals rotativos
  const getGoalsRotativos = (pacienteId: string): string[] => {
    const seed = pacienteId.charCodeAt(0) + new Date(fecha).getDate();
    const startIndex = seed % GOALS_POOL.length;
    const goals = [];
    
    for (let i = 0; i < 4; i++) {
      goals.push(GOALS_POOL[(startIndex + i) % GOALS_POOL.length]);
    }
    
    return goals;
  };

  // Generar métricas por defecto
  const getMetricasDefault = (): MetricasType => ({
    cooperation: 'Moderate',
    motivation: 'Moderate',
    focus: 'Moderate',
    peer: 'Moderate'
  });

  // Generar notas iniciales
  const generarNotasIniciales = () => {
    if (pacientesPresentes.length === 0) return null;

    const pacientesNotas: PacienteNota[] = pacientesPresentes.map(paciente => {
      const actividadesPaciente: ActividadPaciente[] = actividades.map(actividad => ({
        actividad: {
          id: `temp-${actividad.codigo}-${Date.now()}`,
          codigo: actividad.codigo,
          titulo: actividad.titulo,
          descripcion: actividad.descripcion || '',
          duracion: actividad.duracion || 60,
          defaultTime: actividad.defaultTime || '09:00',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        parrafoBase: getParagrafoRotativo(actividad.codigo, paciente.id),
        respuestaCliente: '',
        goalVinculado: getGoalsRotativos(paciente.id)[0] // Primer goal como default
      }));

      // Determinar progreso (Minimal para primeras semanas, Moderate después)
      const diasEnTratamiento = Math.floor(
        (new Date(fecha).getTime() - new Date(paciente.ingreso).getTime()) / (1000 * 60 * 60 * 24)
      );
      const tipoProgreso: 'Minimal' | 'Moderate' = diasEnTratamiento > 14 ? 'Moderate' : 'Minimal';

      return {
        pacienteId: paciente.id,
        nombre: paciente.nombre,
        numeroClinica: paciente.numeroClinica,
        unidades: actividades.length, // Una unidad por actividad
        icd10Primario: paciente.diagnosticos[0]?.codigo || 'F99',
        goalsSemana: getGoalsRotativos(paciente.id),
        metricas: getMetricasDefault(),
        actividades: actividadesPaciente,
        parrafoFinal: `Progress was ${tipoProgreso.toLowerCase()}.`,
        tipoProgreso
      };
    });

    const nuevaNota: NotaDiaria = {
      id: `nota_${fecha}_${grupo.id}`,
      fecha,
      grupoId: grupo.id,
      dia,
      pacientes: pacientesNotas,
      estado: 'Borrador',
      generadoPor: 'Sistema',
      fechaGeneracion: new Date().toISOString()
    };

    return nuevaNota;
  };

  // Inicializar notas al montar
  useEffect(() => {
    if (pacientesPresentes.length > 0 && !notasData) {
      setIsGenerating(true);
      setTimeout(() => {
        const notas = generarNotasIniciales();
        setNotasData(notas);
        setIsGenerating(false);
      }, 1000);
    }
  }, [pacientesPresentes.length]);

  // Manejar edición
  const handleEdit = (pacienteId: string, field: string, currentValue: string) => {
    setEditingPatient(pacienteId);
    setEditingField(field);
    setTempValue(currentValue);
  };

  const handleSave = () => {
    if (!notasData || !editingPatient || !editingField) return;

    const nuevasNotas = { ...notasData };
    const pacienteIndex = nuevasNotas.pacientes.findIndex(p => p.pacienteId === editingPatient);
    
    if (pacienteIndex !== -1) {
      const [field, subfield, index] = editingField.split('.');
      
      if (field === 'metricas' && subfield) {
        (nuevasNotas.pacientes[pacienteIndex].metricas as any)[subfield] = tempValue as MetricaValor;
      } else if (field === 'actividades' && subfield && index !== undefined) {
        const actIndex = parseInt(index);
        if (subfield === 'respuestaCliente') {
          nuevasNotas.pacientes[pacienteIndex].actividades[actIndex].respuestaCliente = tempValue;
        }
      } else if (field === 'parrafoFinal') {
        nuevasNotas.pacientes[pacienteIndex].parrafoFinal = tempValue;
      }
    }

    setNotasData(nuevasNotas);
    setEditingPatient(null);
    setEditingField(null);
    setTempValue('');
  };

  const handleCancel = () => {
    setEditingPatient(null);
    setEditingField(null);
    setTempValue('');
  };

  // Generar nueva versión completa
  const handleRegenerate = () => {
    setIsGenerating(true);
    setRotationIndex({}); // Reset rotaciones
    
    setTimeout(() => {
      const notas = generarNotasIniciales();
      setNotasData(notas);
      setIsGenerating(false);
    }, 1500);
  };

  // Preparar datos para preview
  const preparePreviewData = () => {
    if (!notasData) return null;

    return {
      fecha: notasData.fecha,
      programa: grupo.tipo,
      actividades: actividades,
      pacientes: notasData.pacientes,
      grupoInfo: {
        clinica: grupo.clinica.nombre,
        turno: grupo.turno
      }
    };
  };

  if (pacientesPresentes.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sin Pacientes Presentes
          </h3>
          <p className="text-gray-600">
            No hay pacientes marcados como presentes para {formatDate(fecha)}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Las notas diarias solo se generan para pacientes con asistencia "P"
          </p>
        </div>
      </div>
    );
  }

  if (showPreview && notasData) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Vista Previa - Notas {formatDate(fecha)}
          </h3>
          <button
            onClick={() => setShowPreview(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Volver al Editor
          </button>
        </div>
        
        <DocumentPreview
          tipo="nota-diaria"
          paciente={pacientesPresentes[0]} // Para el header, usa el primer paciente
          fecha={fecha}
          datos={preparePreviewData()}
        />
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Generando Notas Diarias
          </h3>
          <p className="text-gray-600">
            Creando párrafos únicos para cada paciente y actividad...
          </p>
        </div>
      </div>
    );
  }

  if (!notasData) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al Generar Notas</h3>
          <p className="text-gray-600">
            No se pudieron generar las notas para esta fecha
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Notas Diarias - {formatDate(fecha)}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{capitalize(dia)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{pacientesPresentes.length} pacientes presentes</span>
                </span>
                <Badge variant={grupo.tipo === 'PHP' ? 'php' : 'iop'}>
                  {grupo.tipo}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRegenerate}
              disabled={isGenerating}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
              title="Regenerar todas las notas"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setShowPreview(true)}
              className="bg-sidebar-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Vista Previa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controles de paginación */}
      {totalNotas > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            {/* Selector de notas por página */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Mostrar:
              </label>
              <select
                value={notasPerPage}
                onChange={(e) => handleNotasPerPageChange(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value={3}>3 notas</option>
                <option value={5}>5 notas</option>
                <option value={10}>10 notas</option>
                <option value={15}>15 notas</option>
                <option value={20}>20 notas</option>
              </select>
              <span className="text-sm text-gray-600">
                de {totalNotas} notas totales
              </span>
            </div>

            {/* Información de página */}
            <div className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </div>
          </div>
        </div>
      )}

      {/* Notas por paciente */}
      <div className="space-y-6">
        {notasPaginadas.map((pacienteNota, pacienteIndex) => (
          <div key={pacienteNota.pacienteId} className="bg-white rounded-lg shadow-sm border">
            {/* Header del paciente */}
            <div className="border-b p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {pacienteNota.nombre}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <span>Chart: {pacienteNota.numeroClinica}</span>
                    <span>ICD-10: {pacienteNota.icd10Primario}</span>
                    <span>Units: {pacienteNota.unidades}</span>
                  </div>
                </div>
                <Badge 
                  variant={pacienteNota.tipoProgreso === 'Moderate' ? 'success' : 'warning'}
                >
                  {pacienteNota.tipoProgreso} Progress
                </Badge>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Métricas */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Daily Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(pacienteNota.metricas).map(([metrica, valor]) => (
                    <div key={metrica} className="bg-gray-50 p-3 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                        {metrica}
                      </label>
                      {editingPatient === pacienteNota.pacienteId && editingField === `metricas.${metrica}` ? (
                        <div className="flex items-center space-x-2">
                          <select
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="Minor">Minor</option>
                            <option value="Moderate">Moderate</option>
                          </select>
                          <button onClick={handleSave} className="text-green-600 hover:text-green-700">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={handleCancel} className="text-red-600 hover:text-red-700">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="flex items-center justify-between cursor-pointer"
                          onClick={() => handleEdit(pacienteNota.pacienteId, `metricas.${metrica}`, valor)}
                        >
                          <Badge variant={valor === 'Moderate' ? 'success' : 'warning'} size="sm">
                            {valor}
                          </Badge>
                          <Edit className="w-3 h-3 text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actividades */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Activity Notes</h4>
                <div className="space-y-4">
                  {pacienteNota.actividades.map((actividadNota, actIndex) => (
                    <div key={actIndex} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">
                          {actividadNota.actividad.codigo} - {actividadNota.actividad.titulo}
                        </h5>
                        <button
                          onClick={() => rotarParrafo(actividadNota.actividad.codigo, pacienteNota.pacienteId)}
                          className="text-blue-600 hover:text-blue-700 p-1 rounded"
                          title="Rotar párrafo base"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {/* Párrafo base */}
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-sm text-blue-900">
                            {actividadNota.parrafoBase}
                          </p>
                        </div>
                        
                        {/* Respuesta del cliente */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Client Response:
                          </label>
                          {editingPatient === pacienteNota.pacienteId && 
                           editingField === `actividades.respuestaCliente.${actIndex}` ? (
                            <div className="space-y-2">
                              <textarea
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                                placeholder="Describe specific client response or behavior..."
                              />
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={handleSave}
                                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                >
                                  Save
                                </button>
                                <button 
                                  onClick={handleCancel}
                                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div 
                              className="bg-gray-50 p-3 rounded cursor-pointer hover:bg-gray-100 transition-colors min-h-[60px] flex items-center"
                              onClick={() => handleEdit(pacienteNota.pacienteId, `actividades.respuestaCliente.${actIndex}`, actividadNota.respuestaCliente)}
                            >
                              {actividadNota.respuestaCliente ? (
                                <p className="text-sm text-gray-900">{actividadNota.respuestaCliente}</p>
                              ) : (
                                <p className="text-sm text-gray-500 italic">Click to add specific client response...</p>
                              )}
                              <Edit className="w-4 h-4 text-gray-400 ml-auto" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Párrafo final de progreso */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Progress Summary</h4>
                {editingPatient === pacienteNota.pacienteId && editingField === 'parrafoFinal' ? (
                  <div className="space-y-2">
                    <textarea
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                    />
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={handleSave}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button 
                        onClick={handleCancel}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="bg-yellow-50 border border-yellow-200 p-3 rounded cursor-pointer hover:bg-yellow-100 transition-colors"
                    onClick={() => handleEdit(pacienteNota.pacienteId, 'parrafoFinal', pacienteNota.parrafoFinal)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-yellow-900 font-medium">{pacienteNota.parrafoFinal}</p>
                      <Edit className="w-4 h-4 text-yellow-600" />
                    </div>
                  </div>
                )}
              </div>

              {/* Goals actuales */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Current Week Goals</h4>
                <div className="space-y-2">
                  {pacienteNota.goalsSemana.slice(0, 2).map((goal, goalIndex) => (
                    <div key={goalIndex} className="flex items-start space-x-2 text-sm">
                      <CheckSquare className="w-4 h-4 text-green-600 mt-0.5" />
                      <span className="text-gray-700">{goal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controles de navegación de páginas */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center justify-between">
            {/* Botón anterior */}
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Anterior</span>
            </button>

            {/* Números de página */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNumber
                        ? 'bg-sidebar-primary text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            {/* Botón siguiente */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Siguiente</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Footer con información del día */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>📅 {formatDate(fecha)} ({capitalize(dia)})</span>
            <span>🏥 {grupo.clinica.nombre}</span>
            <span>⏰ {grupo.turno}</span>
          </div>
          <div className="flex items-center space-x-2">
            {TIPOS_PROGRAMA[grupo.tipo].dobleDia === dia && (
              <Badge variant="warning" size="sm">Doble Nota</Badge>
            )}
            <Badge variant="info" size="sm">{actividades.length} Activities</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotasDiarias;