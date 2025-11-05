'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useToast } from '@/components/providers/toast-provider';
import { AdminRouteProvider } from '@/components/providers/admin-route-provider';
import type { UserRole } from '@/lib/types';
import { usersService } from '@/lib/services/users-service';
import { clinicsService, type Clinic } from '@/lib/services/clinics-service';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
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

export default function CrearUsuarioPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoadingClinics, setIsLoadingClinics] = useState(true);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'therapist' as UserRole,
    clinicId: '',
    isActive: true
  });

  const [validationErrors, setValidationErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    clinicId: '',
  });

  // Cargar clinicas al montar el componente
  useEffect(() => {
    const loadClinics = async () => {
      try {
        const clinicsData = await clinicsService.getAll();
        setClinics(clinicsData);
      } catch (error) {
        console.error('Error al cargar clinicas:', error);
        addToast('Error al cargar las clinicas', 'error');
      } finally {
        setIsLoadingClinics(false);
      }
    };

    loadClinics();
  }, [addToast]);

  const validateForm = () => {
    const errors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      clinicId: '',
    };

    if (!formData.username) {
      errors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      errors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!formData.email) {
      errors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email invalido';
    }

    if (!formData.password) {
      errors.password = 'La contrasena es requerida';
    } else if (formData.password.length < 8) {
      errors.password = 'La contrasena debe tener al menos 8 caracteres';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Debes confirmar la contrasena';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contrasenas no coinciden';
    }

    if (!formData.fullName) {
      errors.fullName = 'El nombre completo es requerido';
    }

    if (!formData.clinicId) {
      errors.clinicId = 'Debes seleccionar una clinica';
    }

    setValidationErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast('Por favor, corrige los errores en el formulario', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar datos para el API (excluir confirmPassword e isActive)
      const createUserDto = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
        clinicId: formData.clinicId || undefined
      };

      // Llamar al API para crear el usuario
      await usersService.createUser(createUserDto);

      addToast('Usuario creado exitosamente', 'success');
      router.push('/usuarios');
    } catch (error) {
      console.error('Error al crear usuario:', error);

      // Mejorar el mensaje de error basado en el tipo de error
      const errorMessage = error instanceof Error
        ? error.message
        : 'Error al crear usuario. Por favor, intenta nuevamente.';

      addToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <AdminRouteProvider>
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        variants={itemVariants}
      >
        <div>
          <Link
            href="/usuarios"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver a usuarios
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Crear Nuevo Usuario</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Completa la informacion para crear un nuevo usuario
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Informacion Personal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className={validationErrors.fullName ? 'border-red-500' : ''}
                placeholder="Dr. Juan Perez"
              />
              {validationErrors.fullName && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre de Usuario <span className="text-red-500">*</span>
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className={validationErrors.username ? 'border-red-500' : ''}
                placeholder="usuario123"
              />
              {validationErrors.username && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={validationErrors.email ? 'border-red-500' : ''}
                placeholder="usuario@clinica.com"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="therapist">Terapeuta</option>
                <option value="nurse">Enfermera/o</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="clinicId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Clinica <span className="text-red-500">*</span>
              </label>
              <select
                id="clinicId"
                name="clinicId"
                value={formData.clinicId}
                onChange={handleChange}
                disabled={isLoadingClinics}
                className={`w-full px-3 py-2 border dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.clinicId ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } ${isLoadingClinics ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <option value="">
                  {isLoadingClinics ? 'Cargando clinicas...' : 'Selecciona una clinica'}
                </option>
                {clinics.map(clinic => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.clinicName}
                  </option>
                ))}
              </select>
              {validationErrors.clinicId && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.clinicId}</p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Credenciales de Acceso
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contrasena <span className="text-red-500">*</span>
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={validationErrors.password ? 'border-red-500' : ''}
                placeholder="Minimo 8 caracteres"
              />
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">La contrasena debe tener al menos 8 caracteres</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar Contrasena <span className="text-red-500">*</span>
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={validationErrors.confirmPassword ? 'border-red-500' : ''}
                placeholder="Repite la contrasena"
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div className="glass-card rounded-lg p-6" variants={itemVariants}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Estado del Usuario
          </h2>

          <div className="flex items-center">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Usuario activo (puede acceder al sistema)
            </label>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Si desactivas esta opcion, el usuario no podra iniciar sesion en el sistema
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-end"
          variants={itemVariants}
        >
          <Link href="/usuarios" className="w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              className="w-full"
            >
              Cancelar
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-sidebar-primary hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-sidebar-primary text-white transition-all duration-700 ease-in-out"
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Creando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Crear Usuario
              </>
            )}
          </Button>
        </motion.div>
      </form>
      </motion.div>
    </AdminRouteProvider>
  );
}
