'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, X, Clock } from 'lucide-react';
import { useToast } from '@/components/providers/toast-provider';
import { activitiesService, type CreateActivityDto, type UpdateActivityDto, type Activity } from '@/lib/services/activities-service';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

interface ActivityFormProps {
  activity?: Activity;
  onSuccess?: (activity: Activity) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export default function ActivityForm({ 
  activity, 
  onSuccess, 
  onCancel, 
  isEditing = false 
}: ActivityFormProps) {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    activityName: activity?.activityName || '',
    description: activity?.description || '',
    defaultTime: activity?.defaultTime || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.activityName.trim()) {
      newErrors.activityName = 'El nombre de la actividad es requerido';
    }

    // Validar formato de hora si se proporciona
    if (formData.defaultTime && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.defaultTime)) {
      newErrors.defaultTime = 'Formato de hora inválido. Use HH:mm (ej: 09:30)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast('Por favor corrige los errores en el formulario', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      let result: Activity;

      if (isEditing && activity) {
        const updateData: UpdateActivityDto = {
          activityName: formData.activityName,
          description: formData.description || undefined,
          defaultTime: formData.defaultTime || undefined,
        };
        result = await activitiesService.update(activity.id, updateData);
        addToast('Actividad actualizada exitosamente', 'success');
      } else {
        const createData: CreateActivityDto = {
          activityName: formData.activityName,
          description: formData.description || undefined,
          defaultTime: formData.defaultTime || undefined,
        };
        result = await activitiesService.create(createData);
        addToast('Actividad creada exitosamente', 'success');
      }

      onSuccess?.(result);
    } catch (error: any) {
      console.error('Error al guardar actividad:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Error al guardar la actividad';
      addToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <motion.div
      className="glass-card rounded-lg p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {isEditing ? 'Editar Actividad' : 'Nueva Actividad'}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre de la actividad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre de la Actividad <span className="text-red-500">*</span>
          </label>
          <Input
            name="activityName"
            value={formData.activityName}
            onChange={handleInputChange}
            placeholder="Ej: Group Skills: Communication"
            className={errors.activityName ? 'border-red-500' : ''}
            required
          />
          {errors.activityName && (
            <p className="mt-1 text-sm text-red-600">{errors.activityName}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descripción detallada de la actividad..."
          />
        </div>

        {/* Hora predeterminada */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Clock className="w-4 h-4 inline mr-1" />
            Hora Predeterminada
          </label>
          <Input
            type="time"
            name="defaultTime"
            value={formData.defaultTime}
            onChange={handleInputChange}
            className={errors.defaultTime ? 'border-red-500' : ''}
            placeholder="09:30"
          />
          {errors.defaultTime ? (
            <p className="mt-1 text-sm text-red-600">{errors.defaultTime}</p>
          ) : (
            <p className="mt-1 text-sm text-gray-500">
              Formato: HH:mm (ejemplo: 09:30). Dejar vacío si no aplica.
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Guardando...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? 'Actualizar' : 'Crear'}
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
