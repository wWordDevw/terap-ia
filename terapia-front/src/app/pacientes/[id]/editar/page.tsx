'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  User,
  FileText,
  Target
} from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useToast } from '@/components/providers/toast-provider';
import { patientsService, type Patient, type UpdatePatientDto } from '@/lib/services/patients-service';

interface FormData {
  firstName: string;
  lastName: string;
  patientNumber: string;
  dateOfBirth: string;
  admissionDate: string;
  dischargeDate: string;
}

interface DiagnosisForm {
  icd10Code: string;
  diagnosisDescription: string;
  isPrimary: boolean;
}

export default function EditarPacientePage() {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useToast();
  const pacienteId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [paciente, setPaciente] = useState<Patient | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    patientNumber: '',
    dateOfBirth: '',
    admissionDate: '',
    dischargeDate: ''
  });

  const [diagnosticos, setDiagnosticos] = useState<DiagnosisForm[]>([]);
  const [newDiagnostico, setNewDiagnostico] = useState<DiagnosisForm>({
    icd10Code: '',
    diagnosisDescription: '',
    isPrimary: false
  });

  const [goals, setGoals] = useState<string[]>(['', '', '', '']);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar datos del paciente
  useEffect(() => {
    const loadPatient = async () => {
      try {
        setIsLoading(true);
        const data = await patientsService.getById(pacienteId);
        setPaciente(data);

        // Cargar datos del formulario
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          patientNumber: data.patientNumber,
          dateOfBirth: data.dateOfBirth,
          admissionDate: data.admissionDate,
          dischargeDate: data.dischargeDate || ''
        });

        // Cargar diagnósticos
        if (data.diagnoses && data.diagnoses.length > 0) {
          setDiagnosticos(data.diagnoses.map(d => ({
            icd10Code: d.icd10Code,
            diagnosisDescription: d.diagnosisDescription,
            isPrimary: d.isPrimary
          })));
        }

        // Cargar objetivos
        if (data.goals && data.goals.length > 0) {
          setGoals(data.goals.map(g => g.goalText));
        }
      } catch (error) {
        console.error('Error al cargar paciente:', error);
        addToast('Paciente no encontrado', 'error');
        router.push('/pacientes');
      } finally {
        setIsLoading(false);
      }
    };

    loadPatient();
  }, [pacienteId, router, addToast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addDiagnostico = () => {
    if (!newDiagnostico.icd10Code || !newDiagnostico.diagnosisDescription) {
      addToast('Completa el código y descripción del diagnóstico', 'error');
      return;
    }

    setDiagnosticos(prev => [...prev, newDiagnostico]);

    setNewDiagnostico({
      icd10Code: '',
      diagnosisDescription: '',
      isPrimary: false
    });
  };

  const removeDiagnostico = (index: number) => {
    setDiagnosticos(prev => prev.filter((_, i) => i !== index));
  };

  const addGoal = () => {
    setGoals(prev => [...prev, '']);
  };

  const updateGoal = (index: number, value: string) => {
    setGoals(prev => prev.map((g, i) => (i === index ? value : g)));
  };

  const removeGoal = (index: number) => {
    setGoals(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.patientNumber.trim()) {
      newErrors.patientNumber = 'El número de clínica es requerido';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'La fecha de nacimiento es requerida';
    }

    if (!formData.admissionDate) {
      newErrors.admissionDate = 'La fecha de ingreso es requerida';
    }

    if (diagnosticos.length === 0) {
      newErrors.diagnosticos = 'Debe agregar al menos un diagnóstico';
    }

    const goalsCompletos = goals.filter(g => g.trim());
    if (goalsCompletos.length < 4) {
      newErrors.goals = 'Debe completar los 4 objetivos de tratamiento requeridos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Actualizar solo los datos básicos del paciente (sin goals ni diagnoses)
      const updateData: UpdatePatientDto = {
        ...formData,
        dischargeDate: formData.dischargeDate || undefined
      };

      console.log('Actualizando paciente con datos:', updateData);

      await patientsService.update(pacienteId, updateData);

      // NOTA: Los goals y diagnoses se actualizan por separado a través de sus propios endpoints
      // Por ahora solo actualizamos los datos básicos del paciente

      addToast('Paciente actualizado exitosamente', 'success');
      router.push(`/pacientes/${pacienteId}`);
    } catch (error) {
      console.error('Error al actualizar paciente:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      addToast(`Error al actualizar el paciente: ${errorMessage}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/pacientes/${pacienteId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Editar Paciente</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Actualiza la información del paciente
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Personal */}
        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Información Personal</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Ej: Juan"
                className={errors.firstName ? 'border-red-500' : ''}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Apellido <span className="text-red-500">*</span>
              </label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Ej: Pérez García"
                className={errors.lastName ? 'border-red-500' : ''}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de Clínica <span className="text-red-500">*</span>
              </label>
              <Input
                name="patientNumber"
                value={formData.patientNumber}
                onChange={handleInputChange}
                placeholder="Ej: P009"
                className={errors.patientNumber ? 'border-red-500' : ''}
              />
              {errors.patientNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.patientNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Nacimiento <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={errors.dateOfBirth ? 'border-red-500' : ''}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Ingreso <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleInputChange}
                className={errors.admissionDate ? 'border-red-500' : ''}
              />
              {errors.admissionDate && (
                <p className="mt-1 text-sm text-red-600">{errors.admissionDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Alta Programada (Opcional)
              </label>
              <Input
                type="date"
                name="dischargeDate"
                value={formData.dischargeDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Diagnósticos */}
        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Diagnósticos</h2>
          </div>

          {errors.diagnosticos && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.diagnosticos}</p>
            </div>
          )}

          {/* Lista de diagnósticos */}
          {diagnosticos.length > 0 && (
            <div className="mb-4 space-y-2">
              {diagnosticos.map((diag, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-purple-900 dark:text-purple-100">{diag.icd10Code}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        diag.isPrimary
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-200 text-purple-800 dark:bg-purple-700 dark:text-purple-100'
                      }`}>
                        {diag.isPrimary ? 'Primario' : 'Secundario'}
                      </span>
                    </div>
                    <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">{diag.diagnosisDescription}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDiagnostico(index)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Formulario para nuevo diagnóstico */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-3">
              <Input
                placeholder="Código ICD-10"
                value={newDiagnostico.icd10Code}
                onChange={(e) =>
                  setNewDiagnostico(prev => ({ ...prev, icd10Code: e.target.value.toUpperCase() }))
                }
              />
            </div>
            <div className="md:col-span-5">
              <Input
                placeholder="Descripción del diagnóstico"
                value={newDiagnostico.diagnosisDescription}
                onChange={(e) =>
                  setNewDiagnostico(prev => ({ ...prev, diagnosisDescription: e.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <select
                value={newDiagnostico.isPrimary ? 'primary' : 'secondary'}
                onChange={(e) =>
                  setNewDiagnostico(prev => ({ ...prev, isPrimary: e.target.value === 'primary' }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="primary">Primario</option>
                <option value="secondary">Secundario</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Button type="button" onClick={addDiagnostico} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>
        </div>

        {/* Objetivos de Tratamiento */}
        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Objetivos de Tratamiento</h2>
            </div>
            <Button type="button" onClick={addGoal} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Objetivo
            </Button>
          </div>

          {errors.goals && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.goals}</p>
            </div>
          )}

          <div className="space-y-3">
            {goals.map((goal, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Objetivo ${index + 1}`}
                  value={goal}
                  onChange={(e) => updateGoal(index, e.target.value)}
                  className="flex-1"
                />
                {goals.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeGoal(index)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-8">
          <Link href={`/pacientes/${pacienteId}`}>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="min-w-[150px] transition-all duration-700 ease-in-out">
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Actualizando...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Actualizar Paciente
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
