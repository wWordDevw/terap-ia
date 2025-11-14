/**
 * Servicio de Actividades
 */

import { apiClient } from '../api-client';

// ==================== INTERFACES ====================

export interface Activity {
  id: string;
  activityName: string;
  description?: string;
  defaultTime?: string; // ✅ NUEVO: Hora predeterminada (formato HH:mm)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subactivity {
  id: string;
  activityId: string;
  subactivityName: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface ActivityParagraph {
  id: string;
  activityId: string;
  subactivityId?: string;
  paragraphText: string;
  paragraphOrder?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
}

// ==================== DTOs ====================

export interface CreateActivityDto {
  activityName: string;
  description?: string;
  defaultTime?: string; // ✅ NUEVO: Hora predeterminada (formato HH:mm)
}

export interface UpdateActivityDto {
  activityName?: string;
  description?: string;
  defaultTime?: string; // ✅ NUEVO: Hora predeterminada (formato HH:mm)
  isActive?: boolean;
}

export interface CreateSubactivityDto {
  activityId?: string;
  subactivityName: string;
  description?: string;
}

export interface CreateParagraphDto {
  activityId?: string;
  subactivityId?: string;
  paragraphText: string;
  paragraphOrder?: number;
}

// ==================== SERVICIO ====================

class ActivitiesService {
  private readonly BASE_URL = '/activities';

  // ==================== ACTIVIDADES ====================

  /**
   * GET /activities
   * Obtener todas las actividades
   */
  async getAll(includeInactive = false): Promise<Activity[]> {
    const url = includeInactive
      ? `${this.BASE_URL}?includeInactive=true`
      : this.BASE_URL;
    return apiClient.get<Activity[]>(url, true);
  }

  /**
   * GET /activities/basic
   * Obtener todas las actividades básicas (sin subactividades ni párrafos)
   * @param activityType - Filtrar por tipo: 'PHP' o 'IOP'
   * @param includeInactive - Incluir actividades inactivas
   */
  async getBasic(activityType?: 'PHP' | 'IOP', includeInactive = false): Promise<Activity[]> {
    const params = new URLSearchParams();
    if (includeInactive) {
      params.append('includeInactive', 'true');
    }
    if (activityType) {
      params.append('activityType', activityType);
    }
    const url = params.toString()
      ? `${this.BASE_URL}/basic?${params.toString()}`
      : `${this.BASE_URL}/basic`;
    return apiClient.get<Activity[]>(url, true);
  }

  /**
   * GET /activities/:id
   * Obtener una actividad por ID
   */
  async getById(id: string): Promise<Activity> {
    return apiClient.get<Activity>(`${this.BASE_URL}/${id}`, true);
  }

  /**
   * POST /activities
   * Crear una nueva actividad
   */
  async create(data: CreateActivityDto): Promise<Activity> {
    return apiClient.post<Activity>(this.BASE_URL, data, true);
  }

  /**
   * PATCH /activities/:id
   * Actualizar una actividad
   */
  async update(id: string, data: UpdateActivityDto): Promise<Activity> {
    return apiClient.patch<Activity>(`${this.BASE_URL}/${id}`, data, true);
  }

  /**
   * DELETE /activities/:id
   * Desactivar una actividad (soft delete)
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`${this.BASE_URL}/${id}`, true);
  }

  // ==================== SUBACTIVIDADES ====================

  /**
   * POST /activities/:id/subactivities
   * Crear una subactividad
   */
  async createSubactivity(
    activityId: string,
    data: Omit<CreateSubactivityDto, 'activityId'>
  ): Promise<Subactivity> {
    return apiClient.post<Subactivity>(
      `${this.BASE_URL}/${activityId}/subactivities`,
      { ...data, activityId },
      true
    );
  }

  /**
   * GET /activities/:id/subactivities
   * Obtener todas las subactividades de una actividad
   */
  async getSubactivities(activityId: string): Promise<Subactivity[]> {
    return apiClient.get<Subactivity[]>(
      `${this.BASE_URL}/${activityId}/subactivities`,
      true
    );
  }

  /**
   * DELETE /activities/subactivities/:subactivityId
   * Eliminar una subactividad
   */
  async removeSubactivity(subactivityId: string): Promise<void> {
    return apiClient.delete<void>(
      `${this.BASE_URL}/subactivities/${subactivityId}`,
      true
    );
  }

  // ==================== PARAGRAFOS ====================

  /**
   * POST /activities/:id/paragraphs
   * Crear un parrafo predefinido
   */
  async createParagraph(
    activityId: string,
    data: Omit<CreateParagraphDto, 'activityId'>
  ): Promise<ActivityParagraph> {
    return apiClient.post<ActivityParagraph>(
      `${this.BASE_URL}/${activityId}/paragraphs`,
      { ...data, activityId },
      true
    );
  }

  /**
   * GET /activities/:id/paragraphs
   * Obtener todos los parrafos de una actividad
   */
  async getParagraphs(
    activityId: string,
    subactivityId?: string
  ): Promise<ActivityParagraph[]> {
    const url = subactivityId
      ? `${this.BASE_URL}/${activityId}/paragraphs?subactivityId=${subactivityId}`
      : `${this.BASE_URL}/${activityId}/paragraphs`;
    return apiClient.get<ActivityParagraph[]>(url, true);
  }

  /**
   * GET /activities/:id/paragraphs/next
   * Obtener proximo parrafo para rotacion
   */
  async getNextParagraph(
    activityId: string,
    subactivityId?: string
  ): Promise<ActivityParagraph> {
    const url = subactivityId
      ? `${this.BASE_URL}/${activityId}/paragraphs/next?subactivityId=${subactivityId}`
      : `${this.BASE_URL}/${activityId}/paragraphs/next`;
    return apiClient.get<ActivityParagraph>(url, true);
  }

  /**
   * PATCH /activities/paragraphs/:paragraphId/increment-usage
   * Incrementar contador de uso de un parrafo
   */
  async incrementParagraphUsage(paragraphId: string): Promise<void> {
    return apiClient.patch<void>(
      `${this.BASE_URL}/paragraphs/${paragraphId}/increment-usage`,
      {},
      true
    );
  }

  /**
   * POST /activities/:id/paragraphs/reset-usage
   * Resetear contadores de uso
   */
  async resetParagraphUsage(activityId: string): Promise<void> {
    return apiClient.post<void>(
      `${this.BASE_URL}/${activityId}/paragraphs/reset-usage`,
      {},
      true
    );
  }

  /**
   * DELETE /activities/paragraphs/:paragraphId
   * Eliminar un parrafo
   */
  async removeParagraph(paragraphId: string): Promise<void> {
    return apiClient.delete<void>(
      `${this.BASE_URL}/paragraphs/${paragraphId}`,
      true
    );
  }
}

export const activitiesService = new ActivitiesService();
