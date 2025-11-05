/**
 * Servicio de Clinicas
 */

import { apiClient } from '../api-client';

// ==================== INTERFACES ====================

export interface Clinic {
  id: string;
  clinicName: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==================== DTOs ====================

export interface CreateClinicDto {
  clinicName: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

export interface UpdateClinicDto {
  clinicName?: string;
  logoUrl?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive?: boolean;
}

// ==================== SERVICIO ====================

class ClinicsService {
  private readonly BASE_URL = '/clinics';

  /**
   * GET /clinics
   * Obtener todas las clinicas
   */
  async getAll(includeInactive = false): Promise<Clinic[]> {
    const url = includeInactive
      ? `${this.BASE_URL}?includeInactive=true`
      : this.BASE_URL;
    return apiClient.get<Clinic[]>(url, true);
  }

  /**
   * GET /clinics/:id
   * Obtener una clinica por ID
   */
  async getById(id: string): Promise<Clinic> {
    return apiClient.get<Clinic>(`${this.BASE_URL}/${id}`, true);
  }

  /**
   * POST /clinics
   * Crear una nueva clinica
   */
  async create(data: CreateClinicDto): Promise<Clinic> {
    return apiClient.post<Clinic>(this.BASE_URL, data, true);
  }

  /**
   * PATCH /clinics/:id
   * Actualizar una clinica
   */
  async update(id: string, data: UpdateClinicDto): Promise<Clinic> {
    return apiClient.patch<Clinic>(`${this.BASE_URL}/${id}`, data, true);
  }

  /**
   * DELETE /clinics/:id
   * Desactivar una clinica (soft delete)
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`${this.BASE_URL}/${id}`, true);
  }

  /**
   * PATCH /clinics/:id/activate
   * Activar una clinica desactivada
   */
  async activate(id: string): Promise<Clinic> {
    return apiClient.patch<Clinic>(`${this.BASE_URL}/${id}/activate`, {}, true);
  }
}

export const clinicsService = new ClinicsService();
