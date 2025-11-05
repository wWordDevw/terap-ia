'use client';

import { useEffect, useState } from 'react';
import { useNotifications } from '@/contexts/notification-context';
import { apiClient } from '@/lib/api';
import type { Paciente } from '@/lib/types';

interface UsePatientCancellationProps {
  pacientes: Paciente[];
  onPacienteUpdate: (pacienteId: string, updates: Partial<Paciente>) => void;
}

export function usePatientCancellation({ pacientes, onPacienteUpdate }: UsePatientCancellationProps) {
  const { showWarning, showInfo } = useNotifications();
  const [cancelledToday, setCancelledToday] = useState<Set<string>>(new Set());

  useEffect(() => {
    const checkCancellations = async () => {
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];

      for (const paciente of pacientes) {
        // Solo procesar pacientes con fecha de alta (discharge)
        if (!paciente.discharge) continue;

        const dischargeDate = new Date(paciente.discharge);
        const cancellationDate = new Date(dischargeDate);
        cancellationDate.setDate(cancellationDate.getDate() + 1); // Un día después

        const cancellationDateString = cancellationDate.toISOString().split('T')[0];

        // Si hoy es el día de cancelación y no se ha cancelado ya
        if (cancellationDateString === todayString && !cancelledToday.has(paciente.id)) {
          try {
            // Marcar como cancelado en el backend
            await apiClient.updatePatient(paciente.id, {
              cancellationDate: todayString,
            });

            // Actualizar estado local
            onPacienteUpdate(paciente.id, {
              fechaCancelacion: todayString,
            });

            // Agregar a la lista de cancelados hoy
            setCancelledToday(prev => {
              const newSet = new Set(prev);
              newSet.add(paciente.id);
              return newSet;
            });

            // Mostrar notificación
            showWarning(
              'Paciente Cancelado Automáticamente',
              `${paciente.nombre} ha sido cancelado automáticamente un día después de su fecha de alta (${paciente.discharge}). Ya no se generarán más notas para este paciente.`,
              8000
            );

            console.log(`Paciente ${paciente.nombre} cancelado automáticamente el ${todayString}`);
          } catch (error) {
            console.error('Error al cancelar paciente automáticamente:', error);
          }
        }
      }
    };

    // Verificar cancelaciones inmediatamente
    checkCancellations();

    // Verificar cada hora
    const interval = setInterval(checkCancellations, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [pacientes, onPacienteUpdate, showWarning, cancelledToday]);

  // Función para verificar si un paciente está cancelado
  const isPatientCancelled = (paciente: Paciente): boolean => {
    return !!paciente.fechaCancelacion;
  };

  // Función para verificar si un paciente puede generar notas
  const canGenerateNotes = (paciente: Paciente): boolean => {
    // No puede generar notas si está cancelado
    if (isPatientCancelled(paciente)) return false;
    
    // No puede generar notas si tiene fecha de alta y ya pasó un día
    if (paciente.discharge) {
      const dischargeDate = new Date(paciente.discharge);
      const cancellationDate = new Date(dischargeDate);
      cancellationDate.setDate(cancellationDate.getDate() + 1);
      
      return new Date() < cancellationDate;
    }

    return true;
  };

  // Función para obtener el estado de cancelación
  const getCancellationStatus = (paciente: Paciente): {
    status: 'active' | 'discharged' | 'cancelled' | 'pending_cancellation';
    message: string;
    canGenerateNotes: boolean;
  } => {
    if (isPatientCancelled(paciente)) {
      return {
        status: 'cancelled',
        message: `Cancelado el ${new Date(paciente.fechaCancelacion!).toLocaleDateString()}`,
        canGenerateNotes: false,
      };
    }

    if (paciente.discharge) {
      const dischargeDate = new Date(paciente.discharge);
      const cancellationDate = new Date(dischargeDate);
      cancellationDate.setDate(cancellationDate.getDate() + 1);
      const today = new Date();

      if (today >= cancellationDate) {
        return {
          status: 'pending_cancellation',
          message: `Será cancelado automáticamente el ${cancellationDate.toLocaleDateString()}`,
          canGenerateNotes: false,
        };
      } else {
        return {
          status: 'discharged',
          message: `Alta programada para el ${dischargeDate.toLocaleDateString()}`,
          canGenerateNotes: true,
        };
      }
    }

    return {
      status: 'active',
      message: 'Paciente activo',
      canGenerateNotes: true,
    };
  };

  return {
    isPatientCancelled,
    canGenerateNotes,
    getCancellationStatus,
  };
}
