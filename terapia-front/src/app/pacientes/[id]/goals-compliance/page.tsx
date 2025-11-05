'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { GoalComplianceTracker } from '@/components/goals';
import { patientsService } from '@/lib/services';
import type { Patient } from '@/lib/services/patients-service';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Página de análisis de cumplimiento de objetivos de un paciente
 * Ruta: /pacientes/[id]/goals-compliance
 */
export default function GoalsCompliancePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      setError(null);
      const patientData = await patientsService.getById(patientId);
      setPatient(patientData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar el paciente');
      console.error('Error loading patient:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push(`/pacientes/${patientId}`);
  };

  const handleNewAssessment = () => {
    // TODO: Abrir modal o navegar a formulario de nueva evaluación
    console.log('Nueva evaluación de progreso');
  };

  const handleExportReport = () => {
    // TODO: Implementar exportación de reporte
    console.log('Exportar reporte de cumplimiento');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>{error || 'No se pudo cargar el paciente'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const patientName = `${patient.firstName} ${patient.lastName}`;

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al perfil del paciente
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Cumplimiento de Objetivos
            </h1>
            <p className="text-gray-600">
              {patientName} • #{patient.patientNumber}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleNewAssessment}
              variant="default"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nueva Evaluación
            </Button>
            <Button
              onClick={handleExportReport}
              variant="outline"
            >
              <FileText className="mr-2 h-4 w-4" />
              Exportar Reporte
            </Button>
          </div>
        </div>
      </div>

      {/* Información del paciente */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información del Paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Fecha de Nacimiento:</span>
              <div className="font-medium">
                {new Date(patient.dateOfBirth).toLocaleDateString('es-ES')}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Fecha de Admisión:</span>
              <div className="font-medium">
                {new Date(patient.admissionDate).toLocaleDateString('es-ES')}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Estado:</span>
              <div className="font-medium">
                {patient.isActive ? (
                  <span className="text-green-600">Activo</span>
                ) : (
                  <span className="text-gray-500">Inactivo</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objetivos del paciente */}
      {patient.goals && patient.goals.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Objetivos del Paciente</CardTitle>
            <CardDescription>4 objetivos configurados</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {patient.goals.map((goal, index) => (
                <li key={goal.id} className="flex items-start">
                  <span className="font-medium text-gray-700 mr-2">
                    {index + 1}.
                  </span>
                  <span className="text-gray-900">{goal.goalText}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      )}

      {/* Tracker de cumplimiento */}
      <GoalComplianceTracker
        patientId={patientId}
        patientName={patientName}
      />
    </div>
  );
}
