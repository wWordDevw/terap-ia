'use client';

import React, { useState, useEffect } from 'react';
import { mtprService, MTPRDate, MTPRData } from '@/lib/services/mtpr-service';
import { documentGeneratorService } from '@/lib/services/document-generator';
import { goalTrackingService } from '@/lib/services';
import type { GoalComplianceReport } from '@/lib/types';
import MultidisciplinaryEditor from './multidisciplinary-editor';

interface MTPRGeneratorProps {
  patient: any;
  diagnosticos: Array<{ codigo: string; descripcion: string }>;
  goals?: string[];
}

export default function MTPRGenerator({ patient, diagnosticos, goals = [] }: MTPRGeneratorProps) {
  const [mtprDates, setMtprDates] = useState<MTPRDate[]>([]);
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [generatedMTPRs, setGeneratedMTPRs] = useState<Set<number>>(new Set());
  const [showMultidisciplinaryEditor, setShowMultidisciplinaryEditor] = useState(false);
  const [selectedMTPRForMulti, setSelectedMTPRForMulti] = useState<{ mtprNumber: number; dueDate: Date } | null>(null);
  const [goalsCompliance, setGoalsCompliance] = useState<GoalComplianceReport | null>(null);
  const [loadingCompliance, setLoadingCompliance] = useState(false);

  useEffect(() => {
    if (patient?.admisionDate) {
      // Calcular fechas de MTPR
      const dates = mtprService.calculateMTPRDates(new Date(patient.admisionDate), 12);

      // Actualizar con los MTPRs ya generados (esto debería venir del backend)
      // Por ahora, inicializamos vacío
      const updatedDates = dates.map(d => ({
        ...d,
        isGenerated: generatedMTPRs.has(d.mtprNumber)
      }));

      setMtprDates(updatedDates);
    }
  }, [patient, generatedMTPRs]);

  // Cargar reporte de cumplimiento de objetivos
  useEffect(() => {
    if (patient?.id) {
      loadGoalsCompliance();
    }
  }, [patient?.id]);

  const loadGoalsCompliance = async () => {
    if (!patient?.id) return;

    try {
      setLoadingCompliance(true);
      const report = await goalTrackingService.getPatientCompliance(patient.id);
      setGoalsCompliance(report);
    } catch (error) {
      console.error('Error loading goals compliance:', error);
      // No mostramos error al usuario, solo advertencia si es necesario
    } finally {
      setLoadingCompliance(false);
    }
  };

  const handleGenerateMTPR = async (mtprNumber: number) => {
    try {
      setLoading(prev => ({ ...prev, [mtprNumber]: true }));

      // Validar cumplimiento de objetivos (advertencia, no bloquea)
      if (goalsCompliance?.needsAttention) {
        const warnings = goalsCompliance.recommendations.join('\n');
        const proceed = window.confirm(
          `ADVERTENCIA - Los objetivos del paciente requieren atención:\n\n${warnings}\n\n¿Desea continuar con la generación del MTPR?`
        );
        if (!proceed) {
          setLoading(prev => ({ ...prev, [mtprNumber]: false }));
          return;
        }
      }

      // Calcular progreso para este MTPR
      const progress = mtprService.calculateProgress(diagnosticos, mtprNumber);

      // Buscar la fecha correspondiente
      const mtprDate = mtprDates.find(d => d.mtprNumber === mtprNumber);
      if (!mtprDate) {
        throw new Error('MTPR date not found');
      }

      // Preparar datos del MTPR
      const mtprData: MTPRData = {
        patient,
        mtprNumber,
        progress,
        goals,
        dueDate: mtprDate.dueDate
      };

      // Generar documento
      await documentGeneratorService.generateMTPR(mtprData);

      // Marcar como generado
      setGeneratedMTPRs(prev => {
        const newSet = new Set(prev);
        newSet.add(mtprNumber);
        return newSet;
      });

      // Actualizar las fechas
      setMtprDates(prev => prev.map(d =>
        d.mtprNumber === mtprNumber ? { ...d, isGenerated: true } : d
      ));

      alert(`MTPR #${mtprNumber} generado exitosamente`);
    } catch (error) {
      console.error('Error generating MTPR:', error);
      alert(`Error al generar MTPR #${mtprNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(prev => ({ ...prev, [mtprNumber]: false }));
    }
  };

  const handleGenerateMultidisciplinary = (mtprNumber: number) => {
    const mtprDate = mtprDates.find(d => d.mtprNumber === mtprNumber);
    if (!mtprDate) {
      alert('MTPR date not found');
      return;
    }

    setSelectedMTPRForMulti({
      mtprNumber,
      dueDate: mtprDate.dueDate
    });
    setShowMultidisciplinaryEditor(true);
  };

  const handleMultidisciplinaryGenerated = () => {
    setShowMultidisciplinaryEditor(false);
    setSelectedMTPRForMulti(null);
  };

  const handleCancelMultidisciplinary = () => {
    setShowMultidisciplinaryEditor(false);
    setSelectedMTPRForMulti(null);
  };

  if (!patient?.admisionDate) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-800">
          El paciente no tiene fecha de admisión. No se pueden calcular las fechas de MTPR.
        </p>
      </div>
    );
  }

  // Si se está mostrando el editor multidisciplinario
  if (showMultidisciplinaryEditor && selectedMTPRForMulti) {
    return (
      <div className="space-y-4">
        <MultidisciplinaryEditor
          patient={patient}
          mtprNumber={selectedMTPRForMulti.mtprNumber}
          dueDate={selectedMTPRForMulti.dueDate}
          goals={goals}
          onGenerated={handleMultidisciplinaryGenerated}
          onCancel={handleCancelMultidisciplinary}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Alerta de cumplimiento de objetivos */}
      {goalsCompliance && goalsCompliance.needsAttention && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Los objetivos del paciente requieren atención
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  {goalsCompliance.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
              <p className="mt-2 text-xs text-yellow-600">
                Progreso general: {goalsCompliance.overallCompletionPercentage}% •
                Objetivos logrados: {goalsCompliance.goalsAchieved}/{goalsCompliance.totalGoals}
              </p>
            </div>
          </div>
        </div>
      )}

      {goalsCompliance && !goalsCompliance.needsAttention && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Los objetivos están siendo monitoreados adecuadamente
              </h3>
              <p className="mt-2 text-xs text-green-600">
                Progreso general: {goalsCompliance.overallCompletionPercentage}% •
                Objetivos logrados: {goalsCompliance.goalsAchieved}/{goalsCompliance.totalGoals}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Master Treatment Plan Review (MTPR)
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Fecha de admisión: {mtprService.formatDate(new Date(patient.admisionDate))}
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {mtprDates.map((mtpr) => (
              <div
                key={mtpr.mtprNumber}
                className={`
                  flex items-center justify-between p-4 rounded-lg border-2
                  ${mtpr.isGenerated ? 'bg-green-50 border-green-300' : ''}
                  ${!mtpr.isGenerated && mtpr.isPast ? 'bg-red-50 border-red-300' : ''}
                  ${!mtpr.isGenerated && !mtpr.isPast ? 'bg-gray-50 border-gray-300' : ''}
                `}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`
                        w-12 h-12 rounded-full flex items-center justify-center font-bold text-white
                        ${mtpr.isGenerated ? 'bg-green-500' : ''}
                        ${!mtpr.isGenerated && mtpr.isPast ? 'bg-red-500' : ''}
                        ${!mtpr.isGenerated && !mtpr.isPast ? 'bg-gray-400' : ''}
                      `}
                    >
                      #{mtpr.mtprNumber}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      MTPR #{mtpr.mtprNumber}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Fecha: {mtprService.formatDate(mtpr.dueDate)}
                    </p>
                    <p className="text-xs mt-1">
                      <span
                        className={`
                          inline-flex items-center px-2 py-1 rounded-full font-medium
                          ${mtpr.isGenerated ? 'bg-green-100 text-green-800' : ''}
                          ${!mtpr.isGenerated && mtpr.isPast ? 'bg-red-100 text-red-800' : ''}
                          ${!mtpr.isGenerated && !mtpr.isPast ? 'bg-gray-100 text-gray-800' : ''}
                        `}
                      >
                        {mtprService.getStatusText(mtpr)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleGenerateMTPR(mtpr.mtprNumber)}
                    disabled={mtpr.isGenerated || loading[mtpr.mtprNumber]}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-colors
                      ${mtpr.isGenerated
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                      }
                      ${loading[mtpr.mtprNumber] ? 'opacity-50 cursor-wait' : ''}
                    `}
                  >
                    {loading[mtpr.mtprNumber] ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generando...
                      </span>
                    ) : mtpr.isGenerated ? (
                      'Generado'
                    ) : (
                      'Generar MTPR'
                    )}
                  </button>

                  <button
                    onClick={() => handleGenerateMultidisciplinary(mtpr.mtprNumber)}
                    disabled={loading[mtpr.mtprNumber]}
                    className="px-4 py-2 rounded-lg font-medium transition-colors bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800"
                  >
                    Multidisciplinario
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Información sobre progreso de diagnósticos */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Información sobre Progreso de Diagnósticos
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• MTPR #1: Todos los diagnósticos → "No Progress"</li>
          <li>• MTPR #2: Último diagnóstico → "Minimal Progress"</li>
          <li>• MTPR #3: Últimos 2 diagnósticos → "Minimal Progress"</li>
          <li>• MTPR #4: Último → "Moderate Progress", Penúltimo → "Minimal Progress"</li>
          <li>• MTPR #5+: Últimos 2 → "Moderate Progress", Tercero → "Minimal Progress"</li>
        </ul>
      </div>
    </div>
  );
}
