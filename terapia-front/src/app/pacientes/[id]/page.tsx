'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  FileText,
  Heart,
  Shield,
  Target,
  User,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  ClipboardCheck
} from 'lucide-react';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/bagde';
import { patientsService, type Patient } from '@/lib/services/patients-service';
import { patientDocumentsService } from '@/lib/services/patient-documents-service';
import { useToast } from '@/components/providers/toast-provider';
import PatientDocuments from '@/components/patients/patient-documents';
import MTPRGenerator from '@/components/mtpr/mtpr-generator';
import PatientHistory from '@/components/patients/patient-history';

export default function PacienteDetallePage() {
  const params = useParams();
  const pacienteId = params.id as string;
  const { addToast } = useToast();

  const [paciente, setPaciente] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'diagnosticos' | 'documentos' | 'mtpr' | 'historial'>('general');
  const [documentCount, setDocumentCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadPatient = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await patientsService.getById(pacienteId);
        if (isMounted) {
          setPaciente(data);
        }
      } catch (error) {
        console.error('Error al cargar paciente:', error);
        if (isMounted) {
          setHasError(true);
          addToast('Error al cargar el paciente', 'error');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPatient();

    return () => {
      isMounted = false;
    };
  }, [pacienteId]); // Solo depende de pacienteId

  // Cargar contador de documentos
  useEffect(() => {
    let isMounted = true;

    const loadDocumentCount = async () => {
      try {
        const documents = await patientDocumentsService.getDocuments(pacienteId);
        if (isMounted) {
          setDocumentCount(documents.length);
        }
      } catch (error) {
        console.error('Error al cargar documentos:', error);
        // No mostramos toast aquí para no interferir con la carga del paciente
      }
    };

    loadDocumentCount();

    return () => {
      isMounted = false;
    };
  }, [pacienteId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/pacientes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Paciente no encontrado</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            El paciente que buscas no existe o fue eliminado.
          </p>
          <Link href="/pacientes">
            <Button>Volver a Pacientes</Button>
          </Link>
        </div>
      </div>
    );
  }

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const calcularDiasPrograma = (fechaIngreso: string, fechaAlta?: string) => {
    const fin = fechaAlta ? new Date(fechaAlta) : new Date();
    const inicio = new Date(fechaIngreso);
    const diff = fin.getTime() - inicio.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getEstadoPaciente = () => {
    if (!paciente.dischargeDate) return { label: 'Activo', color: 'green', icon: CheckCircle };
    const dischargeDate = new Date(paciente.dischargeDate);
    const today = new Date();
    const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    if (dischargeDate <= today) {
      return { label: 'Alta', color: 'gray', icon: CheckCircle };
    } else if (dischargeDate <= in30Days) {
      return { label: 'Próxima Alta', color: 'orange', icon: Clock };
    }
    return { label: 'Activo', color: 'green', icon: CheckCircle };
  };

  const fullName = `${paciente.firstName} ${paciente.lastName}`;
  const edad = calcularEdad(paciente.dateOfBirth);
  const diasPrograma = calcularDiasPrograma(paciente.admissionDate, paciente.dischargeDate);
  const estado = getEstadoPaciente();
  const EstadoIcon = estado.icon;
  const diagnosticoPrimario = paciente.diagnoses?.find(d => d.isPrimary);

  const tabs = [
    { id: 'general' as const, label: 'Información General', icon: User },
    { id: 'diagnosticos' as const, label: 'Diagnósticos', icon: FileText },
    { id: 'documentos' as const, label: 'Documentos', icon: Download },
    { id: 'mtpr' as const, label: 'MTPR', icon: ClipboardCheck },
    { id: 'historial' as const, label: 'Historial', icon: Clock }
  ];

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-4 w-full sm:w-auto">
          <Link href="/pacientes">
            <Button variant="outline" size="sm" className="flex-shrink-0">
              <ArrowLeft className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Volver</span>
            </Button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
              {fullName}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {paciente.patientNumber} • {edad} años • {diasPrograma} días en programa
            </p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link href={`/pacientes/${paciente.id}/editar`} className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full">
              <Edit className="w-4 h-4 mr-2" />
              <span>Editar</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              estado.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
              estado.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
              'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              <EstadoIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Estado</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{estado.label}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Diagnósticos</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{paciente.diagnoses?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Objetivos</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{paciente.goals?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Documentos</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{documentCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <div className="flex min-w-max sm:min-w-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Información Personal */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Número de Clínica</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">{paciente.patientNumber}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Nacimiento</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                      {new Date(paciente.dateOfBirth).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} ({edad} años)
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Ingreso</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                      {new Date(paciente.admissionDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  {paciente.dischargeDate && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Fecha de Alta</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100 mt-1">
                        {new Date(paciente.dischargeDate).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Objetivos de Tratamiento */}
              {paciente.goals && paciente.goals.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                    Objetivos de Tratamiento
                  </h3>
                  <div className="space-y-2">
                    {paciente.goals.map((goal, index) => (
                      <div key={goal.id || index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-green-900 dark:text-green-100">{goal.goalText}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Diagnósticos Tab */}
          {activeTab === 'diagnosticos' && (
            <div className="space-y-4">
              {diagnosticoPrimario && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Diagnóstico Primario</h3>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-purple-900 dark:text-purple-100">{diagnosticoPrimario.icd10Code}</span>
                          <Badge variant="default" className="bg-purple-600">
                            Primario
                          </Badge>
                        </div>
                        <p className="text-sm text-purple-800 dark:text-purple-200">{diagnosticoPrimario.diagnosisDescription}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paciente.diagnoses && paciente.diagnoses.filter(d => !d.isPrimary).length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Diagnósticos Secundarios</h3>
                  <div className="space-y-3">
                    {paciente.diagnoses
                      .filter(d => !d.isPrimary)
                      .map((diag, index) => (
                        <div key={diag.id || index} className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-base font-bold text-purple-900 dark:text-purple-100">{diag.icd10Code}</span>
                                <Badge variant="default" className="bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-100">
                                  Secundario
                                </Badge>
                              </div>
                              <p className="text-sm text-purple-800 dark:text-purple-200">{diag.diagnosisDescription}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Documentos Tab */}
          {activeTab === 'documentos' && (
            <PatientDocuments
              patientId={pacienteId}
              onDocumentCountChange={setDocumentCount}
            />
          )}

          {/* MTPR Tab */}
          {activeTab === 'mtpr' && (
            <MTPRGenerator
              patient={paciente}
              diagnosticos={paciente.diagnoses?.map(d => ({
                codigo: d.icd10Code,
                descripcion: d.diagnosisDescription
              })) || []}
              goals={paciente.goals?.map(g => g.goalText) || []}
            />
          )}

          {/* Historial Tab */}
          {activeTab === 'historial' && (
            <PatientHistory patient={paciente} />
          )}
        </div>
      </div>
    </div>
  );
}
