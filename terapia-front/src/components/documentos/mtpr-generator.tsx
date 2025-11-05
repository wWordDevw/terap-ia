'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Download, Eye, AlertTriangle, CheckCircle, Clock, User } from 'lucide-react';
import Badge from '@/components/ui/bagde';
import DocumentPreview from './document-preview';
import { calculateMTPRDates, formatDate, calculateDaysInTreatment, isWorkingDay } from '@/lib/utils';
import type { Paciente, DocumentoMTPR, ProgresoMTPR, TipoProgreso } from '@/lib/types';

interface MTPreviewData {
  pacienteId: string;
  numeroMTPR: number;
  fecha: string;
  diagnosticos: ProgresoMTPR[];
  resumenProgreso: string;
  recomendaciones: string[];
  proximaFecha?: string;
  diasTratamiento: number;
  nivelProgreso: 'Minimal' | 'Moderate';
  asistenciaRate: string;
  diasPresente: number;
  programa: string;
}

interface MTPRGeneratorProps {
  paciente: Paciente;
  className?: string;
}

const MTPRGenerator: React.FC<MTPRGeneratorProps> = ({ paciente, className = '' }) => {
  const [fechasMTPR, setFechasMTPR] = useState<string[]>([]);
  const [selectedFecha, setSelectedFecha] = useState<string>('');
  const [previewData, setPreviewData] = useState<MTPreviewData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Calcular fechas MTPR al montar el componente
  useEffect(() => {
    const fechas = calculateMTPRDates(paciente.ingreso, paciente.discharge);
    setFechasMTPR(fechas);
    
    // Seleccionar la próxima fecha disponible por defecto
    const hoy = new Date().toISOString().split('T')[0];
    const proximaFecha = fechas.find(fecha => fecha >= hoy);
    if (proximaFecha) {
      setSelectedFecha(proximaFecha);
    }
  }, [paciente.ingreso, paciente.discharge]);

  // Obtener el número de MTPR según la fecha
  const getMTPRNumber = (fecha: string): number => {
    const index = fechasMTPR.indexOf(fecha);
    return index + 1;
  };

  // Verificar si una fecha está disponible para generar MTPR
  const isFechaDisponible = (fecha: string): boolean => {
    const fechaObj = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // Solo fechas de hoy en adelante y días hábiles
    return fechaObj >= hoy && isWorkingDay(fecha);
  };

  // Generar progreso por diagnóstico
  const generarProgresoDiagnosticos = (numeroMTPR: number): ProgresoMTPR[] => {
    return paciente.diagnosticos.map((diagnostico, index) => {
      // Lógica para determinar progreso basada en número de MTPR y posición del diagnóstico
      let estado: TipoProgreso = 'No progress';
      
      if (numeroMTPR === 1) {
        // Primera evaluación - progreso mínimo
        estado = index === 0 ? 'Minimal progress' : 'No progress';
      } else if (numeroMTPR === 2) {
        // Segunda evaluación - algún progreso
        estado = index === 0 ? 'Moderate progress' : 'Minimal progress';
      } else {
        // Evaluaciones posteriores - progreso moderado
        estado = index < 2 ? 'Moderate progress' : 'Minimal progress';
      }

      return {
        codigo: diagnostico.codigo,
        estado,
        notas: `Diagnóstico ${diagnostico.tipo.toLowerCase()}: ${diagnostico.descripcion}`
      };
    });
  };

  // Generar recomendaciones según el progreso
  const generarRecomendaciones = (numeroMTPR: number, nivelProgreso: 'Minimal' | 'Moderate'): string[] => {
    const recomendaciones = [
      'Continue current level of care (PHP)',
      'Maintain focus on coping skills development'
    ];

    if (numeroMTPR === 1) {
      recomendaciones.push(
        'Establish routine medication compliance monitoring',
        'Begin family involvement in treatment planning',
        'Focus on psychoeducation and skill building'
      );
    } else if (nivelProgreso === 'Moderate') {
      recomendaciones.push(
        'Consider step-down to IOP level of care within 2-3 weeks',
        'Increase community integration activities',
        'Prepare discharge planning coordination'
      );
    } else {
      recomendaciones.push(
        'Continue PHP level with enhanced therapeutic interventions',
        'Reassess treatment goals and modify as needed',
        'Consider psychiatric medication review'
      );
    }

    return recomendaciones;
  };

  // Generar datos de vista previa
  const generarPreviewData = (fecha: string): MTPreviewData => {
    const numeroMTPR = getMTPRNumber(fecha);
    const diasTratamiento = calculateDaysInTreatment(paciente.ingreso, fecha);
    
    // Simular datos de asistencia (normalmente vendrían de la base de datos)
    const diasPresente = Math.floor(diasTratamiento * 0.85); // 85% asistencia simulada
    const asistenciaRate = `${Math.round((diasPresente / diasTratamiento) * 100)}%`;
    
    // Determinar nivel de progreso basado en número de MTPR y asistencia
    const nivelProgreso: 'Minimal' | 'Moderate' = 
      numeroMTPR >= 2 && diasPresente / diasTratamiento > 0.8 ? 'Moderate' : 'Minimal';

    const diagnosticos = generarProgresoDiagnosticos(numeroMTPR);
    const recomendaciones = generarRecomendaciones(numeroMTPR, nivelProgreso);
    
    // Calcular próxima fecha MTPR
    const currentIndex = fechasMTPR.indexOf(fecha);
    const proximaFecha = currentIndex < fechasMTPR.length - 1 ? fechasMTPR[currentIndex + 1] : undefined;

    return {
      pacienteId: paciente.id,
      numeroMTPR,
      fecha,
      diagnosticos,
      resumenProgreso: `Patient demonstrates ${nivelProgreso.toLowerCase()} progress toward treatment goals. Attendance has been ${asistenciaRate} with active participation in therapeutic activities. Current level of functioning shows improvement in coping skills and emotional regulation.`,
      recomendaciones,
      proximaFecha,
      diasTratamiento,
      nivelProgreso,
      asistenciaRate,
      diasPresente,
      programa: 'PHP' // Esto debería venir del grupo actual del paciente
    };
  };

  // Generar MTPR
  const handleGenerate = async () => {
    if (!selectedFecha) return;

    setIsGenerating(true);
    
    try {
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const preview = generarPreviewData(selectedFecha);
      setPreviewData(preview);
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating MTPR:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Descargar MTPR (simulado)
  const handleDownload = () => {
    if (!previewData) return;
    
    const filename = `MTPR_${paciente.nombre.replace(/\s+/g, '_')}_${previewData.numeroMTPR}_${formatDate(previewData.fecha)}.docx`;
    
    // Simular descarga
    const link = document.createElement('a');
    link.href = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQAAAAIAA==';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (fecha: string) => {
    const hoy = new Date().toISOString().split('T')[0];
    if (fecha < hoy) {
      return <Badge variant="gray" size="sm">Pasado</Badge>;
    } else if (fecha === hoy) {
      return <Badge variant="warning" size="sm">Hoy</Badge>;
    } else if (isFechaDisponible(fecha)) {
      return <Badge variant="success" size="sm">Disponible</Badge>;
    } else {
      return <Badge variant="error" size="sm">No hábil</Badge>;
    }
  };

  if (showPreview && previewData) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Vista Previa - MTPR #{previewData.numeroMTPR}
          </h3>
          <button
            onClick={() => setShowPreview(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            Volver al Generador
          </button>
        </div>
        
        <DocumentPreview
          tipo="mtpr"
          paciente={paciente}
          fecha={previewData.fecha}
          datos={previewData}
          onDownload={handleDownload}
        />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <FileText className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Generador MTPR</h3>
          <p className="text-sm text-gray-600">
            Master Treatment Plan Review para {paciente.nombre}
          </p>
        </div>
      </div>

      {/* Información del paciente */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">Paciente:</span>
            <div className="text-gray-900">{paciente.nombre}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Ingreso:</span>
            <div className="text-gray-900">{formatDate(paciente.ingreso)}</div>
          </div>
          <div>
            <span className="font-medium text-gray-700">Días en tratamiento:</span>
            <div className="text-gray-900">
              {calculateDaysInTreatment(paciente.ingreso)} días
            </div>
          </div>
        </div>
      </div>

      {/* Fechas MTPR */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Fechas MTPR Programadas</h4>
        
        {fechasMTPR.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p>No hay fechas MTPR disponibles para este paciente</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {fechasMTPR.map((fecha, index) => {
              const numeroMTPR = index + 1;
              const isSelected = selectedFecha === fecha;
              const isDisponible = isFechaDisponible(fecha);
              
              return (
                <div
                  key={fecha}
                  onClick={() => isDisponible && setSelectedFecha(fecha)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : isDisponible
                      ? 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">MTPR #{numeroMTPR}</span>
                    {getStatusBadge(fecha)}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(fecha)}</span>
                  </div>
                  
                  {isSelected && (
                    <div className="mt-2 flex items-center space-x-2 text-xs text-blue-700">
                      <CheckCircle className="w-3 h-3" />
                      <span>Seleccionado para generar</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Información de la fecha seleccionada */}
      {selectedFecha && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-900 mb-2">
            MTPR #{getMTPRNumber(selectedFecha)} - {formatDate(selectedFecha)}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <span className="font-medium">Días en tratamiento (hasta fecha MTPR):</span>
              <div>{calculateDaysInTreatment(paciente.ingreso, selectedFecha)} días</div>
            </div>
            <div>
              <span className="font-medium">Diagnósticos a evaluar:</span>
              <div>{paciente.diagnosticos.length} diagnóstico(s)</div>
            </div>
          </div>
        </div>
      )}

      {/* Acciones */}
      <div className="flex items-center justify-end space-x-4">
        {!selectedFecha ? (
          <div className="flex items-center space-x-2 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Selecciona una fecha para generar MTPR</span>
          </div>
        ) : !isFechaDisponible(selectedFecha) ? (
          <div className="flex items-center space-x-2 text-amber-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Fecha no disponible (día no hábil o en el pasado)</span>
          </div>
        ) : (
          <>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-sidebar-primary text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generando...</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Generar Vista Previa</span>
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Notas adicionales */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h5 className="font-medium text-yellow-900 mb-2">Notas Importantes</h5>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Los MTPR se generan cada 30 días a partir del día 18 de ingreso</li>
          <li>• Solo se pueden generar en días hábiles (Lun-Sáb)</li>
          <li>• El progreso se evalúa automáticamente según asistencia y número de MTPR</li>
          <li>• Las recomendaciones se ajustan según el nivel de progreso observado</li>
        </ul>
      </div>
    </div>
  );
};

export default MTPRGenerator;