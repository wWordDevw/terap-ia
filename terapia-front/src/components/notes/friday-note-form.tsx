'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, CheckCircle, Plus, X } from 'lucide-react';
import { useToast } from '@/components/providers/toast-provider';
import { notesService } from '@/lib/services/notes-service';
import { activitiesService, type Activity } from '@/lib/services/activities-service';
import type { ActivitySelection } from '@/lib/types';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/bagde';

interface FridayNoteFormProps {
  patientId: string;
  weekId: string;
  noteDate: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

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

export default function FridayNoteForm({ 
  patientId, 
  weekId, 
  noteDate, 
  onSuccess, 
  onCancel 
}: FridayNoteFormProps) {
  const { addToast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [firstNoteActivities, setFirstNoteActivities] = useState<ActivitySelection[]>([]);
  const [secondNoteActivities, setSecondNoteActivities] = useState<ActivitySelection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar actividades disponibles
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true);
        const data = await activitiesService.getAll();
        setActivities(data.filter(activity => activity.isActive));
      } catch (error) {
        console.error('Error al cargar actividades:', error);
        addToast('Error al cargar las actividades', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, []);

  const handleAddActivity = (activity: Activity, noteType: 'first' | 'second') => {
    const currentActivities = noteType === 'first' ? firstNoteActivities : secondNoteActivities;
    
    if (currentActivities.length >= 2) {
      addToast(`Máximo 2 actividades por nota`, 'warning');
      return;
    }

    const newSelection: ActivitySelection = {
      activityId: activity.id,
      subactivityId: undefined,
      paragraphId: undefined,
    };

    if (noteType === 'first') {
      setFirstNoteActivities([...currentActivities, newSelection]);
    } else {
      setSecondNoteActivities([...currentActivities, newSelection]);
    }
  };

  const handleRemoveActivity = (index: number, noteType: 'first' | 'second') => {
    if (noteType === 'first') {
      setFirstNoteActivities(firstNoteActivities.filter((_, i) => i !== index));
    } else {
      setSecondNoteActivities(secondNoteActivities.filter((_, i) => i !== index));
    }
  };

  const canSubmit = () => {
    return (
      firstNoteActivities.length >= 1 && firstNoteActivities.length <= 2 &&
      secondNoteActivities.length >= 1 && secondNoteActivities.length <= 2
    );
  };

  const handleSubmit = async () => {
    if (!canSubmit()) {
      addToast('Cada nota debe tener entre 1 y 2 actividades', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      await notesService.generateFriday({
        patientId,
        weekId,
        noteDate,
        firstNoteActivities,
        secondNoteActivities,
      });

      addToast('Notas del viernes generadas exitosamente', 'success');
      onSuccess?.();
    } catch (error: any) {
      console.error('Error al generar notas del viernes:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Error al generar las notas';
      addToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Cargando actividades...</p>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center gap-3">
          <Calendar className="w-6 h-6 text-purple-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Generar Notas del Viernes
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Viernes - {new Date(noteDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        )}
      </motion.div>

      {/* Información especial */}
      <motion.div
        className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-purple-800 dark:text-purple-200">
            Notas especiales del viernes
          </span>
        </div>
        <p className="text-sm text-purple-700 dark:text-purple-300">
          Se generan 2 notas separadas. Cada nota debe tener entre 1 y 2 actividades.
        </p>
      </motion.div>

      {/* Contador general */}
      <motion.div
        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            Progreso: {firstNoteActivities.length + secondNoteActivities.length} actividades seleccionadas
          </span>
        </div>
        <Badge 
          variant={canSubmit() ? 'green' : 'yellow'}
          size="sm"
        >
          {canSubmit() ? 'Listo para generar' : 'Completa ambas notas'}
        </Badge>
      </motion.div>

      {/* Formulario de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primera Nota */}
        <motion.div
          className="space-y-4"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Primera Nota
            </h3>
            <Badge 
              variant={firstNoteActivities.length >= 1 && firstNoteActivities.length <= 2 ? 'green' : 'red'}
              size="sm"
            >
              {firstNoteActivities.length}/2
            </Badge>
          </div>

          {/* Actividades de la primera nota */}
          <div className="space-y-2">
            {firstNoteActivities.map((selection, index) => {
              const activity = activities.find(a => a.id === selection.activityId);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {activity?.activityName}
                      </p>
                      {activity?.defaultTime && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Hora: {activity.defaultTime}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveActivity(index, 'first')}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Lista de actividades disponibles para primera nota */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Agregar actividad:
            </h4>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {activities.map((activity) => (
                <button
                  key={`first-${activity.id}`}
                  onClick={() => handleAddActivity(activity, 'first')}
                  disabled={firstNoteActivities.length >= 2}
                  className="w-full flex items-center gap-2 p-2 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {activity.activityName}
                    </p>
                    {activity.defaultTime && (
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Hora: {activity.defaultTime}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Segunda Nota */}
        <motion.div
          className="space-y-4"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Segunda Nota
            </h3>
            <Badge 
              variant={secondNoteActivities.length >= 1 && secondNoteActivities.length <= 2 ? 'green' : 'red'}
              size="sm"
            >
              {secondNoteActivities.length}/2
            </Badge>
          </div>

          {/* Actividades de la segunda nota */}
          <div className="space-y-2">
            {secondNoteActivities.map((selection, index) => {
              const activity = activities.find(a => a.id === selection.activityId);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {activity?.activityName}
                      </p>
                      {activity?.defaultTime && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Hora: {activity.defaultTime}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveActivity(index, 'second')}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Lista de actividades disponibles para segunda nota */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Agregar actividad:
            </h4>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {activities.map((activity) => (
                <button
                  key={`second-${activity.id}`}
                  onClick={() => handleAddActivity(activity, 'second')}
                  disabled={secondNoteActivities.length >= 2}
                  className="w-full flex items-center gap-2 p-2 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {activity.activityName}
                    </p>
                    {activity.defaultTime && (
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        Hora: {activity.defaultTime}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Botones de acción */}
      <motion.div
        className="flex justify-end gap-3 pt-4"
        variants={itemVariants}
      >
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit() || isSubmitting}
          className="min-w-[180px]"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generando...
            </div>
          ) : (
            'Generar 2 Notas del Viernes'
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
