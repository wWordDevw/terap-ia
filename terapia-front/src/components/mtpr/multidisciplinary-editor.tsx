'use client';

import React, { useState, useEffect } from 'react';
import { documentGeneratorService } from '@/lib/services/document-generator';
import { mtprService } from '@/lib/services/mtpr-service';
import Button from '@/components/ui/button';

export interface Objective {
  description: string;
  status: 'Not Started' | 'In Progress' | 'Achieved';
  targetDate?: string;
  notes?: string;
}

export interface GoalObjectives {
  goal: string;
  progress: 'No Progress' | 'Minimal Progress' | 'Moderate Progress';
  objectives: [Objective, Objective]; // Siempre 2 objetivos
}

export interface MultidisciplinaryData {
  patient: any;
  mtprNumber: number;
  dueDate: Date;
  goalsWithObjectives: GoalObjectives[];
}

interface MultidisciplinaryEditorProps {
  patient: any;
  mtprNumber: number;
  dueDate: Date;
  goals: string[];
  onGenerated?: () => void;
  onCancel?: () => void;
}

export default function MultidisciplinaryEditor({
  patient,
  mtprNumber,
  dueDate,
  goals,
  onGenerated,
  onCancel
}: MultidisciplinaryEditorProps) {
  const [goalsWithObjectives, setGoalsWithObjectives] = useState<GoalObjectives[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Inicializar con goals del paciente
    const initial: GoalObjectives[] = goals.map(goal => ({
      goal,
      progress: 'Minimal Progress',
      objectives: [
        {
          description: '',
          status: 'Not Started',
          notes: ''
        },
        {
          description: '',
          status: 'Not Started',
          notes: ''
        }
      ]
    }));

    setGoalsWithObjectives(initial);
  }, [goals]);

  const updateProgress = (goalIndex: number, progress: GoalObjectives['progress']) => {
    setGoalsWithObjectives(prev => {
      const updated = [...prev];
      updated[goalIndex] = {
        ...updated[goalIndex],
        progress
      };
      return updated;
    });
  };

  const updateObjective = (
    goalIndex: number,
    objIndex: number,
    field: keyof Objective,
    value: string
  ) => {
    setGoalsWithObjectives(prev => {
      const updated = [...prev];
      const objectives = [...updated[goalIndex].objectives] as [Objective, Objective];
      objectives[objIndex] = {
        ...objectives[objIndex],
        [field]: value
      };
      updated[goalIndex] = {
        ...updated[goalIndex],
        objectives
      };
      return updated;
    });
  };

  const validateForm = (): boolean => {
    for (let i = 0; i < goalsWithObjectives.length; i++) {
      const goalObj = goalsWithObjectives[i];

      // Verificar que cada objetivo tenga una descripción
      for (let j = 0; j < goalObj.objectives.length; j++) {
        const obj = goalObj.objectives[j];
        if (!obj.description.trim()) {
          alert(`Por favor, complete el objetivo ${j + 1} del goal: "${goalObj.goal}"`);
          return false;
        }
      }
    }

    return true;
  };

  const handleGenerate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsGenerating(true);

      const data: MultidisciplinaryData = {
        patient,
        mtprNumber,
        dueDate,
        goalsWithObjectives
      };

      await documentGeneratorService.generateMultidisciplinary(data);

      alert(`Documento Multidisciplinario #${mtprNumber} generado exitosamente`);
      onGenerated?.();
    } catch (error) {
      console.error('Error generating multidisciplinary document:', error);
      alert(`Error al generar documento: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!goals || goals.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-800">
          El paciente no tiene metas definidas. No se puede generar el documento multidisciplinario.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">
          Documento Multidisciplinario MTPR #{mtprNumber}
        </h3>
        <p className="text-sm text-blue-800">
          Complete 2 objetivos medibles para cada meta del tratamiento.
          Cada objetivo debe ser específico, medible y tener un estado de progreso.
        </p>
      </div>

      {goalsWithObjectives.map((goalObj, goalIndex) => (
        <div key={goalIndex} className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm">
          <div className="mb-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Meta {goalIndex + 1}: {goalObj.goal}
            </h4>

            {/* Progress Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Progreso:
              </label>
              <select
                value={goalObj.progress}
                onChange={(e) => updateProgress(goalIndex, e.target.value as GoalObjectives['progress'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="No Progress">No Progress</option>
                <option value="Minimal Progress">Minimal Progress</option>
                <option value="Moderate Progress">Moderate Progress</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {goalObj.objectives.map((obj, objIndex) => (
              <div key={objIndex} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h5 className="text-sm font-semibold text-gray-700 mb-3">
                  Objetivo {objIndex + 1}:
                </h5>

                <div className="space-y-3">
                  {/* Description */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Descripción del Objetivo (Requerido):
                    </label>
                    <textarea
                      value={obj.description}
                      onChange={(e) => updateObjective(goalIndex, objIndex, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Ej: El paciente identificará 3 desencadenantes de ansiedad en sesiones grupales..."
                      required
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Estado:
                    </label>
                    <select
                      value={obj.status}
                      onChange={(e) => updateObjective(goalIndex, objIndex, 'status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Achieved">Achieved</option>
                    </select>
                  </div>

                  {/* Target Date */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Fecha Objetivo (Opcional):
                    </label>
                    <input
                      type="date"
                      value={obj.targetDate || ''}
                      onChange={(e) => updateObjective(goalIndex, objIndex, 'targetDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Notas Adicionales (Opcional):
                    </label>
                    <textarea
                      value={obj.notes || ''}
                      onChange={(e) => updateObjective(goalIndex, objIndex, 'notes', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                      placeholder="Notas sobre el progreso, barreras, o estrategias..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={isGenerating}
          >
            Cancelar
          </Button>
        )}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-green-600 hover:bg-green-700"
        >
          {isGenerating ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generando...
            </span>
          ) : (
            'Generar Documento Multidisciplinario'
          )}
        </Button>
      </div>
    </div>
  );
}
