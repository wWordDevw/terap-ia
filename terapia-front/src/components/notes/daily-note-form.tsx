'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, CheckCircle, Plus, X } from 'lucide-react';
import { useToast } from '@/components/providers/toast-provider';
import { notesService } from '@/lib/services/notes-service';
import { activitiesService, type Activity } from '@/lib/services/activities-service';
import type { ActivitySelection, DayOfWeek } from '@/lib/types';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/bagde';

interface DailyNoteFormProps {
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

export default function DailyNoteForm({ 
  patientId, 
  weekId, 
  noteDate, 
  onSuccess, 
  onCancel 
}: DailyNoteFormProps) {
  const { addToast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<ActivitySelection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('Monday');

  // Detectar día de la semana
  useEffect(() => {
    const date = new Date(noteDate);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' }) as DayOfWeek;
    setDayOfWeek(day);
  }, [noteDate]);

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

  const isFriday = dayOfWeek === 'Friday';
  const isWeekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'].includes(dayOfWeek);
  
  const minActivities = isWeekday ? 2 : 1;
  const maxActivities = isWeekday ? 3 : 2;

  const handleAddActivity = (activity: Activity) => {
    if (selectedActivities.length >= maxActivities) {
      addToast(`No puedes agregar más de ${maxActivities} actividades`, 'warning');
      return;
    }

    const newSelection: ActivitySelection = {
      activityId: activity.id,
      subactivityId: undefined,
      paragraphId: undefined,
    };

    setSelectedActivities([...selectedActivities, newSelection]);
  };

  const handleRemoveActivity = (index: number) => {
    setSelectedActivities(selectedActivities.filter((_, i) => i !== index));
  };

  const canSubmit = () => {
    return selectedActivities.length >= minActivities && selectedActivities.length <= maxActivities;
  };

  const handleSubmit = async () => {
    if (!canSubmit()) {
      addToast(`Debe seleccionar entre ${minActivities} y ${maxActivities} actividades`, 'warning');
      return;
    }

    if (isFriday) {
      addToast('Para el viernes, usa el formulario especial de 2 notas separadas', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      await notesService.generateDaily({
        patientId,
        weekId,
        noteDate,
        dayOfWeek: dayOfWeek as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday',
        activities: selectedActivities,
      });

      addToast('Nota generada exitosamente', 'success');
      onSuccess?.();
    } catch (error: any) {
      console.error('Error al generar nota:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Error al generar la nota';
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
          <Calendar className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Generar Nota Diaria
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {dayOfWeek} - {new Date(noteDate).toLocaleDateString()}
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

      {/* Alerta para viernes */}
      {isFriday && (
        <motion.div
          className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
          variants={itemVariants}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                Nota especial para el viernes
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Para el viernes se generan 2 notas separadas. Por favor usa el formulario especial 
                para notas del viernes.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Información de validación */}
      {isWeekday && (
        <motion.div
          className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          variants={itemVariants}
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800 dark:text-blue-200">
              Requisitos para {dayOfWeek}
            </span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Mínimo: {minActivities} actividades | Máximo: {maxActivities} actividades
          </p>
        </motion.div>
      )}

      {/* Contador de actividades */}
      <motion.div
        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
        variants={itemVariants}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-900 dark:text-gray-100">
            Actividades seleccionadas: {selectedActivities.length}/{maxActivities}
          </span>
        </div>
        <Badge 
          variant={canSubmit() ? 'green' : selectedActivities.length < minActivities ? 'red' : 'yellow'}
          size="sm"
        >
          {canSubmit() ? 'Listo' : selectedActivities.length < minActivities ? 'Faltan actividades' : 'Demasiadas actividades'}
        </Badge>
      </motion.div>

      {/* Lista de actividades seleccionadas */}
      {selectedActivities.length > 0 && (
        <motion.div
          className="space-y-2"
          variants={itemVariants}
        >
          <h3 className="font-medium text-gray-900 dark:text-gray-100">
            Actividades Seleccionadas
          </h3>
          {selectedActivities.map((selection, index) => {
            const activity = activities.find(a => a.id === selection.activityId);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
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
                  onClick={() => handleRemoveActivity(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Lista de actividades disponibles */}
      <motion.div
        className="space-y-2"
        variants={itemVariants}
      >
        <h3 className="font-medium text-gray-900 dark:text-gray-100">
          Actividades Disponibles
        </h3>
        <div className="grid gap-2 max-h-60 overflow-y-auto">
          {activities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => handleAddActivity(activity)}
              disabled={selectedActivities.length >= maxActivities}
              className="flex items-center justify-between p-3 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <div className="flex items-center gap-3">
                <Plus className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {activity.activityName}
                  </p>
                  {activity.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.description}
                    </p>
                  )}
                  {activity.defaultTime && (
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Hora: {activity.defaultTime}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>

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
          disabled={!canSubmit() || isSubmitting || isFriday}
          className="min-w-[140px]"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generando...
            </div>
          ) : (
            'Generar Nota'
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
