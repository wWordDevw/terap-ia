'use client';

import React, { useState } from 'react';
import { Download, Eye, FileText, Calendar, User, Clock, CheckSquare } from 'lucide-react';
import Badge from '@/components/ui/bagde';
import { formatDate, formatTime } from '@/lib/utils';
import type { Paciente, NotaDiaria, DocumentoMTPR, DocumentoMultidisciplinario } from '@/lib/types';

interface DocumentPreviewProps {
  tipo: 'nota-diaria' | 'mtpr' | 'multidisciplinario';
  paciente: Paciente;
  fecha: string;
  datos: any;
  onDownload?: () => void;
  className?: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  tipo,
  paciente,
  fecha,
  datos,
  onDownload,
  className = ''
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Función para simular descarga
  const handleDownload = () => {
    const filename = `${tipo}_${paciente.nombre.replace(/\s+/g, '_')}_${fecha}.docx`;
    
    // Simular descarga
    const link = document.createElement('a');
    link.href = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQAAAAIAA=='; // Placeholder
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    if (onDownload) onDownload();
  };

  const renderNotaDiaria = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900">Daily Progress Note</h2>
          
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Patient:</span> {paciente.nombre}
          </div>
          <div>
            <span className="font-medium">Date:</span> {formatDate(fecha)}
          </div>
          <div>
            <span className="font-medium">Time:</span> {formatTime(new Date())}
          </div>
          <div>
            <span className="font-medium">Chart #:</span> {paciente.numeroClinica}
          </div>
        </div>
      </div>

      {/* Actividades */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Activities Participated</h3>
        {datos.actividades?.map((actividad: any, index: number) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">
                {actividad.codigo} - {actividad.titulo}
              </h4>
              <Badge variant={actividad.asistencia === 'P' ? 'green' : 'gray'}>
                {actividad.asistencia === 'P' ? 'Present' : 'Absent'}
              </Badge>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {actividad.respuesta || 'No specific response documented for this activity.'}
            </p>
          </div>
        ))}
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-blue-900">Cooperation</div>
          <div className="text-lg font-bold text-blue-700">{datos.metricas?.cooperation || 'Good'}</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-green-900">Motivation</div>
          <div className="text-lg font-bold text-green-700">{datos.metricas?.motivation || 'Good'}</div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-purple-900">Participation</div>
          <div className="text-lg font-bold text-purple-700">{datos.metricas?.participation || 'Good'}</div>
        </div>
      </div>

      {/* Goals Progress */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Treatment Goals Progress</h3>
        {paciente.goals.map((goal, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
            <CheckSquare className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <div className="font-medium text-yellow-900">Goal {index + 1}</div>
              <div className="text-sm text-yellow-800">{goal}</div>
              <div className="text-xs text-yellow-600 mt-1">
                Progress: {datos.progreso || 'Minimal progress noted'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Signature */}
      <div className="border-t pt-4 mt-6">
        <div className="text-sm text-gray-600">
          <div className="mb-2">
            <strong>Therapist Signature:</strong> _________________________ 
            <span className="ml-4">Date: {formatDate(new Date())}</span>
          </div>
          <div className="text-xs text-gray-500 italic">
            This document was generated automatically by the Therapeutic Management System
          </div>
        </div>
      </div>
    </div>
  );

  const renderMTPR = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Master Treatment Plan Review (MTPR)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Patient:</span> {paciente.nombre}
          </div>
          <div>
            <span className="font-medium">Review Date:</span> {formatDate(fecha)}
          </div>
          <div>
            <span className="font-medium">Chart #:</span> {paciente.numeroClinica}
          </div>
          <div>
            <span className="font-medium">Admission Date:</span> {formatDate(paciente.ingreso)}
          </div>
          <div>
            <span className="font-medium">Program:</span> {datos.programa || 'PHP'}
          </div>
          <div>
            <span className="font-medium">Days in Treatment:</span> {datos.diasTratamiento || 'N/A'}
          </div>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Treatment Progress Summary</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex justify-between">
            <span>Overall Progress Level:</span>
            <Badge variant={datos.nivelProgreso === 'Moderate' ? 'green' : 'yellow'}>
              {datos.nivelProgreso || 'Minimal'}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Attendance Rate:</span>
            <span className="font-medium">{datos.asistenciaRate || '85%'}</span>
          </div>
          <div className="flex justify-between">
            <span>Days Present:</span>
            <span className="font-medium">{datos.diasPresente || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Current Diagnoses */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Diagnoses</h3>
        <div className="space-y-2">
          {paciente.diagnosticos.map((diagnostico, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <Badge variant="gray">{diagnostico.codigo}</Badge>
              <span className="text-gray-700">{diagnostico.descripcion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Treatment Goals Review */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Treatment Goals Review</h3>
        <div className="space-y-4">
          {paciente.goals.map((goal, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="font-medium text-gray-900 mb-1">Goal {index + 1}:</div>
              <div className="text-gray-700 text-sm mb-2">{goal}</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="font-medium">Status:</span> 
                  <Badge variant="yellow" className="ml-1">In Progress</Badge>
                </div>
                <div>
                  <span className="font-medium">Progress:</span> {datos.nivelProgreso || 'Minimal'}
                </div>
                <div>
                  <span className="font-medium">Target Date:</span> {formatDate(datos.targetDate || new Date())}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clinical Recommendations */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 mb-3">Clinical Recommendations</h3>
        <div className="text-sm text-green-800 space-y-2">
          <div>• Continue current level of care (PHP)</div>
          <div>• Maintain focus on coping skills development</div>
          <div>• Regular medication compliance monitoring</div>
          <div>• Family involvement in treatment planning</div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="border-t pt-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <div className="mb-2">
              <strong>Primary Therapist:</strong>
              <div className="mt-1">
                Signature: _________________________ Date: _______
              </div>
            </div>
          </div>
          <div>
            <div className="mb-2">
              <strong>Clinical Supervisor:</strong>
              <div className="mt-1">
                Signature: _________________________ Date: _______
              </div>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 italic border-t pt-2">
          Next MTPR Due: {formatDate(datos.nextMTPR || new Date())}
        </div>
      </div>
    </div>
  );

  const renderMultidisciplinario = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Multidisciplinary Team Review
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Patient:</span> {paciente.nombre}
          </div>
          <div>
            <span className="font-medium">Review Date:</span> {formatDate(fecha)}
          </div>
          <div>
            <span className="font-medium">Meeting Type:</span> Weekly Team Review
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-900 mb-3">Team Members Present</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-purple-800">
          <div>• Primary Therapist</div>
          <div>• Psychiatrist</div>
          <div>• Nursing Staff</div>
          <div>• Social Worker</div>
          <div>• Program Director</div>
          <div>• Case Manager</div>
        </div>
      </div>

      {/* Discussion Points */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Discussion Summary</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-purple-500 pl-4">
            <div className="font-medium text-purple-900 mb-1">Clinical Progress</div>
            <div className="text-gray-700 text-sm">
              Patient demonstrates {datos.nivelProgreso?.toLowerCase() || 'minimal'} progress in treatment goals. 
              Attendance has been consistent with active participation in group activities.
            </div>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <div className="font-medium text-blue-900 mb-1">Medication Review</div>
            <div className="text-gray-700 text-sm">
              Current medication regimen appears appropriate. No adverse effects reported. 
              Patient compliance is good.
            </div>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <div className="font-medium text-green-900 mb-1">Psychosocial Factors</div>
            <div className="text-gray-700 text-sm">
              Family support system is strong. Housing situation is stable. 
              Financial concerns being addressed with case management.
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-yellow-900 mb-3">Action Items</h3>
        <div className="space-y-2 text-sm text-yellow-800">
          <div className="flex items-start space-x-2">
            <CheckSquare className="w-4 h-4 mt-0.5" />
            <span>Continue current treatment plan with weekly progress monitoring</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckSquare className="w-4 h-4 mt-0.5" />
            <span>Schedule family meeting within next two weeks</span>
          </div>
          <div className="flex items-start space-x-2">
            <CheckSquare className="w-4 h-4 mt-0.5" />
            <span>Coordinate with outpatient provider for discharge planning</span>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="border-t pt-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Team Signatures</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>
              <strong>Primary Therapist:</strong>
              <div className="mt-1">_________________________ Date: _______</div>
            </div>
            <div>
              <strong>Psychiatrist:</strong>
              <div className="mt-1">_________________________ Date: _______</div>
            </div>
            <div>
              <strong>Nursing Supervisor:</strong>
              <div className="mt-1">_________________________ Date: _______</div>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <strong>Social Worker:</strong>
              <div className="mt-1">_________________________ Date: _______</div>
            </div>
            <div>
              <strong>Program Director:</strong>
              <div className="mt-1">_________________________ Date: _______</div>
            </div>
            <div>
              <strong>Case Manager:</strong>
              <div className="mt-1">_________________________ Date: _______</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (tipo) {
      case 'nota-diaria':
        return renderNotaDiaria();
      case 'mtpr':
        return renderMTPR();
      case 'multidisciplinario':
        return renderMultidisciplinario();
      default:
        return <div className="text-gray-500">Tipo de documento no reconocido</div>;
    }
  };

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-white z-50 overflow-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Document Preview</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="bg-sidebar-primary text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download .docx</span>
            </button>
            <button
              onClick={() => setIsFullscreen(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto p-6">
          {renderContent()}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-medium text-gray-900 capitalize">
              {tipo.replace('-', ' ')} Preview
            </h3>
            <div className="text-sm text-gray-600">
              {paciente.nombre} • {formatDate(fecha)}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsFullscreen(true)}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
            title="Vista completa"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            className="bg-sidebar-primary text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-1 text-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default DocumentPreview;