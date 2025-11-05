'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  X,
  Plus,
  Trash2,
  User,
  FileText,
  Heart,
  Shield,
  Target
} from 'lucide-react';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useToast } from '@/components/providers/toast-provider';
import type { Diagnostico } from '@/lib/types';
import { patientsService, type CreatePatientDto } from '@/lib/services/patients-service';
import { clinicsService } from '@/lib/services/clinics-service';

interface FormData {
  nombre: string;
  numeroClinica: string;
  nacimiento: string;
  ingreso: string;
  discharge: string;
  seguro: string;
  notasAdicionales: string;
}

interface ContactoEmergenciaForm {
  nombre: string;
  relacion: string;
  telefono: string;
  email: string;
}

// Configuración de animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function CrearPacientePage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    numeroClinica: '',
    nacimiento: '',
    ingreso: new Date().toISOString().split('T')[0],
    discharge: '',
    seguro: '',
    notasAdicionales: ''
  });

  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([]);
  const [newDiagnostico, setNewDiagnostico] = useState({
    codigo: '',
    descripcion: '',
    tipo: 'Primario' as 'Primario' | 'Secundario'
  });

  const [goals, setGoals] = useState<string[]>(['', '', '', '']); // 4 goals requeridos

  const [contactoEmergencia, setContactoEmergencia] = useState<ContactoEmergenciaForm>({
    nombre: '',
    relacion: '',
    telefono: '',
    email: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clinicId, setClinicId] = useState<string | null>(null);
  const [isLoadingClinic, setIsLoadingClinic] = useState(true);

  // Cargar la clínica al montar el componente
  useEffect(() => {
    const loadClinic = async () => {
      try {
        const clinics = await clinicsService.getAll();
        if (clinics.length > 0) {
          setClinicId(clinics[0].id);
        } else {
          addToast('No hay clínicas disponibles. Contacte al administrador.', 'error');
        }
      } catch (error) {
        console.error('Error al cargar clínicas:', error);
        addToast('Error al cargar información de clínicas', 'error');
      } finally {
        setIsLoadingClinic(false);
      }
    };

    loadClinic();
  }, [addToast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContactoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactoEmergencia(prev => ({ ...prev, [name]: value }));
  };

  const addDiagnostico = () => {
    if (!newDiagnostico.codigo || !newDiagnostico.descripcion) {
      addToast('Completa el código y descripción del diagnóstico', 'error');
      return;
    }

    setDiagnosticos(prev => [
      ...prev,
      {
        ...newDiagnostico,
        activo: true
      }
    ]);

    setNewDiagnostico({
      codigo: '',
      descripcion: '',
      tipo: 'Secundario'
    });
  };

  const removeDiagnostico = (index: number) => {
    setDiagnosticos(prev => prev.filter((_, i) => i !== index));
  };

  const addGoal = () => {
    if (goals.length < 4) {
      setGoals(prev => [...prev, '']);
    }
  };

  const updateGoal = (index: number, value: string) => {
    setGoals(prev => prev.map((g, i) => (i === index ? value : g)));
  };

  const removeGoal = (index: number) => {
    if (goals.length > 4) {
      setGoals(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.numeroClinica.trim()) {
      newErrors.numeroClinica = 'El número de clínica es requerido';
    }

    if (!formData.nacimiento) {
      newErrors.nacimiento = 'La fecha de nacimiento es requerida';
    }

    if (!formData.ingreso) {
      newErrors.ingreso = 'La fecha de ingreso es requerida';
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

    if (!clinicId) {
      addToast('No se ha cargado la información de la clínica. Intente nuevamente.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Separar el nombre en firstName y lastName
      const nombreParts = formData.nombre.trim().split(' ');
      const firstName = nombreParts[0];
      const lastName = nombreParts.slice(1).join(' ') || nombreParts[0];

      // Preparar datos en el formato que espera el backend
      const createPatientDto: CreatePatientDto = {
        patientNumber: formData.numeroClinica,
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: formData.nacimiento,
        admissionDate: formData.ingreso,
        dischargeDate: formData.discharge || undefined,
        clinicId: clinicId, // Usar el clinicId cargado dinámicamente
        goals: goals.map(goalText => ({ goalText })),
        diagnoses: diagnosticos.map(d => ({
          icd10Code: d.codigo,
          diagnosisDescription: d.descripcion,
          isPrimary: d.tipo === 'Primario'
        }))
      };

      console.log('Enviando datos al backend:', createPatientDto);

      // Llamar al servicio del backend
      const createdPatient = await patientsService.create(createPatientDto);

      console.log('Paciente creado:', createdPatient);

      addToast('Paciente creado exitosamente', 'success');
      router.push('/pacientes');
    } catch (error) {
      console.error('Error al crear paciente:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      addToast(`Error al crear el paciente: ${errorMessage}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        variants={itemVariants}
      >
        <div className="flex items-center gap-4">
          <Link href="/pacientes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Nuevo Paciente</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Completa la información del paciente
            </p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Personal */}
        <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Información Personal</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <Input
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Juan Carlos Pérez García"
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && (
                <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de Clínica <span className="text-red-500">*</span>
              </label>
              <Input
                name="numeroClinica"
                value={formData.numeroClinica}
                onChange={handleInputChange}
                placeholder="Ej: P009"
                className={errors.numeroClinica ? 'border-red-500' : ''}
              />
              {errors.numeroClinica && (
                <p className="mt-1 text-sm text-red-600">{errors.numeroClinica}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Nacimiento <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                name="nacimiento"
                value={formData.nacimiento}
                onChange={handleInputChange}
                className={errors.nacimiento ? 'border-red-500' : ''}
              />
              {errors.nacimiento && (
                <p className="mt-1 text-sm text-red-600">{errors.nacimiento}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Ingreso <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                name="ingreso"
                value={formData.ingreso}
                onChange={handleInputChange}
                className={errors.ingreso ? 'border-red-500' : ''}
              />
              {errors.ingreso && (
                <p className="mt-1 text-sm text-red-600">{errors.ingreso}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Alta Programada (Opcional)
              </label>
              <Input
                type="date"
                name="discharge"
                value={formData.discharge}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </motion.div>

        {/* Diagnósticos */}
        <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Diagnósticos</h2>
          </div>

          {errors.diagnosticos && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600">{errors.diagnosticos}</p>
            </div>
          )}

          {/* Lista de diagnósticos */}
          {diagnosticos.length > 0 && (
            <div className="mb-4 space-y-2">
              {diagnosticos.map((diag, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-purple-900 dark:text-purple-300">{diag.codigo}</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        diag.tipo === 'Primario'
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200'
                      }`}>
                        {diag.tipo}
                      </span>
                    </div>
                    <p className="text-sm text-purple-800 dark:text-purple-300 mt-1">{diag.descripcion}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDiagnostico(index)}
                    className="text-red-600 hover:text-red-800 ml-2"
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
                value={newDiagnostico.codigo}
                onChange={(e) =>
                  setNewDiagnostico(prev => ({ ...prev, codigo: e.target.value.toUpperCase() }))
                }
              />
            </div>
            <div className="md:col-span-5">
              <Input
                placeholder="Descripción del diagnóstico"
                value={newDiagnostico.descripcion}
                onChange={(e) =>
                  setNewDiagnostico(prev => ({ ...prev, descripcion: e.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <select
                value={newDiagnostico.tipo}
                onChange={(e) =>
                  setNewDiagnostico(prev => ({ ...prev, tipo: e.target.value as 'Primario' | 'Secundario' }))
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Primario">Primario</option>
                <option value="Secundario">Secundario</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Button type="button" onClick={addDiagnostico} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Objetivos de Tratamiento */}
        <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Objetivos de Tratamiento <span className="text-red-500">*</span>
              </h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">(4 requeridos)</span>
            </div>
          </div>

          {errors.goals && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600">{errors.goals}</p>
            </div>
          )}

          <div className="space-y-3">
            {goals.map((goal, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Objetivo ${index + 1} (requerido)`}
                  value={goal}
                  onChange={(e) => updateGoal(index, e.target.value)}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Información de Seguro */}
        <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Información de Seguro</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Compañía de Seguro
            </label>
            <Input
              name="seguro"
              value={formData.seguro}
              onChange={handleInputChange}
              placeholder="Ej: Blue Cross Blue Shield"
            />
          </div>
        </motion.div>

        {/* Contacto de Emergencia */}
        <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contacto de Emergencia</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre Completo
              </label>
              <Input
                name="nombre"
                value={contactoEmergencia.nombre}
                onChange={handleContactoChange}
                placeholder="Ej: María López"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Relación
              </label>
              <Input
                name="relacion"
                value={contactoEmergencia.relacion}
                onChange={handleContactoChange}
                placeholder="Ej: Madre, Esposo, Hermana"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teléfono
              </label>
              <Input
                name="telefono"
                value={contactoEmergencia.telefono}
                onChange={handleContactoChange}
                placeholder="+1-555-0123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={contactoEmergencia.email}
                onChange={handleContactoChange}
                placeholder="contacto@email.com"
              />
            </div>
          </div>
        </motion.div>

        {/* Notas Adicionales */}
        <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notas Adicionales</h2>
          </div>

          <textarea
            name="notasAdicionales"
            value={formData.notasAdicionales}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Información adicional relevante sobre el paciente..."
          />
        </motion.div>

        {/* Actions */}
        <motion.div className="flex justify-end gap-3 pb-8" variants={itemVariants}>
          <Link href="/pacientes">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting || isLoadingClinic} className="min-w-[120px]">
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Guardando...
              </div>
            ) : isLoadingClinic ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Cargando...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Paciente
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
