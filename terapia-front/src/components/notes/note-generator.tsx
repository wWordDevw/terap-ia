'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText } from 'lucide-react';
import DailyNoteForm from './daily-note-form';
import FridayNoteForm from './friday-note-form';
import type { DayOfWeek } from '@/lib/types';

interface NoteGeneratorProps {
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

export default function NoteGenerator({ 
  patientId, 
  weekId, 
  noteDate, 
  onSuccess, 
  onCancel 
}: NoteGeneratorProps) {
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('Monday');

  // Detectar día de la semana
  const detectDayOfWeek = (date: string): DayOfWeek => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { weekday: 'long' }) as DayOfWeek;
  };

  // Actualizar día de la semana cuando cambie la fecha
  useState(() => {
    setDayOfWeek(detectDayOfWeek(noteDate));
  });

  const isFriday = dayOfWeek === 'Friday';
  const isWeekday = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'].includes(dayOfWeek);

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header con información del día */}
      <motion.div
        className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        variants={itemVariants}
      >
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full">
          <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Generador de Notas Diarias
          </h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Fecha:</strong> {new Date(noteDate).toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isFriday ? '2 notas separadas' : '1 nota'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Información específica del día */}
      <motion.div
        className="p-4 rounded-lg border"
        variants={itemVariants}
        style={{
          backgroundColor: isFriday ? '#fef3c7' : '#dbeafe',
          borderColor: isFriday ? '#f59e0b' : '#3b82f6'
        }}
      >
        <div className="flex items-start gap-3">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{
              backgroundColor: isFriday ? '#f59e0b' : '#3b82f6'
            }}
          >
            <span className="text-white text-sm font-bold">
              {isFriday ? 'V' : dayOfWeek.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {isFriday ? 'Notas especiales del viernes' : `Nota para ${dayOfWeek}`}
            </h3>
            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              {isFriday ? (
                <ul className="list-disc list-inside space-y-1">
                  <li>Se generan <strong>2 notas separadas</strong></li>
                  <li>Cada nota debe tener entre <strong>1 y 2 actividades</strong></li>
                  <li>Total: <strong>2-4 actividades</strong> distribuidas en 2 notas</li>
                </ul>
              ) : isWeekday ? (
                <ul className="list-disc list-inside space-y-1">
                  <li>Se genera <strong>1 nota</strong></li>
                  <li>Debe tener entre <strong>2 y 3 actividades</strong></li>
                  <li>Recomendado: <strong>3 actividades</strong> para mayor detalle</li>
                </ul>
              ) : (
                <p>Los fines de semana no requieren notas diarias regulares.</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Formulario específico según el día */}
      <motion.div variants={itemVariants}>
        {isFriday ? (
          <FridayNoteForm
            patientId={patientId}
            weekId={weekId}
            noteDate={noteDate}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        ) : isWeekday ? (
          <DailyNoteForm
            patientId={patientId}
            weekId={weekId}
            noteDate={noteDate}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No se requieren notas para este día
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Los fines de semana no requieren notas diarias regulares.
            </p>
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cerrar
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
