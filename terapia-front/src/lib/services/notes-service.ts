/**
 * Servicio de Notas Diarias
 */

import { apiClient } from '../api-client';
import { API_ENDPOINTS } from '../api-config';
import type { 
  GenerateDailyNoteDto, 
  GenerateFridayNotesDto, 
  ActivitySelection 
} from '../types';

// ==================== INTERFACES ====================

export interface GeneratedNote {
  id: string;
  patientId: string;
  weekId: string;
  attendanceId?: string;
  noteDate: string;
  goalNumber: number;
  goalText: string;
  paragraphId?: string;
  paragraphText: string;
  responseText: string;
  responseHash: string;
  attendanceSummary?: any;
  programType?: string;
  shift?: string;
  filePath?: string;
  fileName?: string;
  generatedById?: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== DTOs ====================

export interface GenerateNoteDto {
  patientId: string;
  weekId: string;
  noteDate: string;
  responseText?: string;
}

// ==================== SERVICIO ====================

class NotesService {
  /**
   * POST /notes/generate
   * Generar una nota diaria para un paciente
   */
  async generateNote(data: GenerateNoteDto): Promise<GeneratedNote> {
    return apiClient.post<GeneratedNote>(
      `${API_ENDPOINTS.notes.base}/generate`,
      data,
      true
    );
  }

  /**
   * GET /notes/patient/:patientId
   * Obtener todas las notas de un paciente
   */
  async getNotesByPatient(patientId: string): Promise<GeneratedNote[]> {
    return apiClient.get<GeneratedNote[]>(
      `${API_ENDPOINTS.notes.base}/patient/${patientId}`,
      true
    );
  }

  /**
   * GET /notes/:id
   * Obtener una nota especifica por ID
   */
  async getById(id: string): Promise<GeneratedNote> {
    return apiClient.get<GeneratedNote>(API_ENDPOINTS.notes.byId(id), true);
  }

  /**
   * GET /notes/:id/download
   * Descargar una nota en formato Word
   * Retorna una URL para descargar el archivo
   */
  async downloadNote(id: string): Promise<Blob> {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('accessToken')
      : null;

    const response = await fetch(
      `${API_ENDPOINTS.notes.byId(id)}/download`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error al descargar la nota');
    }

    return response.blob();
  }

  /**
   * Helper para descargar y guardar el archivo
   */
  async downloadAndSave(id: string, fileName?: string): Promise<void> {
    const blob = await this.downloadNote(id);

    // Obtener el nombre del archivo desde los headers o usar el proporcionado
    const finalFileName = fileName || `nota_${id}.docx`;

    // Crear un link temporal y hacer click para descargar
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  /**
   * DELETE /notes/:id
   * Eliminar una nota (solo si no esta bloqueada)
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.notes.byId(id), true);
  }

  // ==================== NUEVOS MÉTODOS ====================

  /**
   * POST /notes/daily
   * Generar nota diaria para lunes-jueves (2-3 actividades)
   */
  async generateDaily(data: GenerateDailyNoteDto): Promise<GeneratedNote> {
    return apiClient.post<GeneratedNote>(
      `${API_ENDPOINTS.notes.base}/daily`,
      data,
      true
    );
  }

  /**
   * POST /notes/friday
   * Generar 2 notas separadas para el viernes (1-2 actividades cada una)
   */
  async generateFriday(data: GenerateFridayNotesDto): Promise<{
    firstNote: GeneratedNote;
    secondNote: GeneratedNote;
  }> {
    return apiClient.post<{
      firstNote: GeneratedNote;
      secondNote: GeneratedNote;
    }>(
      `${API_ENDPOINTS.notes.base}/friday`,
      data,
      true
    );
  }

  /**
   * Helper para validar actividades según el día
   */
  validateActivitiesForDay(activities: ActivitySelection[], dayOfWeek: string): {
    isValid: boolean;
    message?: string;
  } {
    const count = activities.length;

    if (dayOfWeek === 'Friday') {
      return {
        isValid: false,
        message: 'Para el viernes, usa el método generateFriday con 2 notas separadas'
      };
    }

    if (['Monday', 'Tuesday', 'Wednesday', 'Thursday'].includes(dayOfWeek)) {
      if (count < 2) {
        return {
          isValid: false,
          message: 'Debe seleccionar al menos 2 actividades para lunes-jueves'
        };
      }
      if (count > 3) {
        return {
          isValid: false,
          message: 'No puede seleccionar más de 3 actividades para lunes-jueves'
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Helper para validar actividades del viernes
   */
  validateFridayActivities(
    firstNote: ActivitySelection[], 
    secondNote: ActivitySelection[]
  ): {
    isValid: boolean;
    message?: string;
  } {
    if (firstNote.length < 1 || firstNote.length > 2) {
      return {
        isValid: false,
        message: 'La primera nota debe tener entre 1 y 2 actividades'
      };
    }

    if (secondNote.length < 1 || secondNote.length > 2) {
      return {
        isValid: false,
        message: 'La segunda nota debe tener entre 1 y 2 actividades'
      };
    }

    return { isValid: true };
  }
}

export const notesService = new NotesService();
