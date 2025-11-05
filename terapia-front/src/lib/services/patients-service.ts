/**
 * Servicio de Pacientes
 */

import { apiClient } from '../api-client';
import { API_ENDPOINTS } from '../api-config';

// ==================== INTERFACES ====================

export interface PatientGoal {
  id: string;
  goalNumber: number;
  goalText: string;
}

export interface PatientDiagnosis {
  id: string;
  icd10Code: string;
  diagnosisDescription: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface PatientDocument {
  id: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface Patient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  admissionDate: string;
  dischargeDate?: string;
  isActive: boolean;
  clinicId: string;
  goals: PatientGoal[];
  diagnoses: PatientDiagnosis[];
  documents: PatientDocument[];
  createdAt: string;
  updatedAt: string;
}

// ==================== DTOs ====================

export interface CreatePatientGoalDto {
  goalText: string;
}

export interface CreatePatientDiagnosisDto {
  icd10Code: string;
  diagnosisDescription: string;
  isPrimary?: boolean;
}

export interface CreatePatientDto {
  patientNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string | Date;
  admissionDate: string | Date;
  dischargeDate?: string | Date;
  clinicId: string;
  goals: CreatePatientGoalDto[];
  diagnoses: CreatePatientDiagnosisDto[];
}

export interface UpdatePatientDto {
  patientNumber?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string | Date;
  admissionDate?: string | Date;
  dischargeDate?: string | Date;
}

export interface UploadDocumentDto {
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
}

// ==================== SERVICIO ====================

class PatientsService {
  /**
   * GET /patients
   * Obtener todos los pacientes
   */
  async getAll(includeInactive = false): Promise<Patient[]> {
    const url = includeInactive
      ? `${API_ENDPOINTS.patients.base}?includeInactive=true`
      : API_ENDPOINTS.patients.base;
    return apiClient.get<Patient[]>(url, true);
  }

  /**
   * GET /patients/active
   * Obtener solo pacientes activos (sin discharge)
   */
  async getActive(): Promise<Patient[]> {
    return apiClient.get<Patient[]>(`${API_ENDPOINTS.patients.base}/active`, true);
  }

  /**
   * GET /patients/:id
   * Obtener un paciente por ID
   */
  async getById(id: string): Promise<Patient> {
    return apiClient.get<Patient>(API_ENDPOINTS.patients.byId(id), true);
  }

  /**
   * GET /patients/number/:patientNumber
   * Obtener paciente por numero
   */
  async getByNumber(patientNumber: string): Promise<Patient> {
    return apiClient.get<Patient>(
      `${API_ENDPOINTS.patients.base}/number/${patientNumber}`,
      true
    );
  }

  /**
   * POST /patients
   * Crear un nuevo paciente
   */
  async create(data: CreatePatientDto): Promise<Patient> {
    return apiClient.post<Patient>(API_ENDPOINTS.patients.base, data, true);
  }

  /**
   * PATCH /patients/:id
   * Actualizar un paciente
   */
  async update(id: string, data: UpdatePatientDto): Promise<Patient> {
    return apiClient.patch<Patient>(API_ENDPOINTS.patients.byId(id), data, true);
  }

  /**
   * DELETE /patients/:id
   * Desactivar un paciente (soft delete)
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.patients.byId(id), true);
  }

  /**
   * PATCH /patients/:id/discharge
   * Marcar discharge de un paciente
   */
  async discharge(id: string, dischargeDate: string | Date): Promise<Patient> {
    return apiClient.patch<Patient>(
      `${API_ENDPOINTS.patients.byId(id)}/discharge`,
      { dischargeDate },
      true
    );
  }

  // ==================== GOALS ====================

  /**
   * PATCH /patients/:id/goals/:goalNumber
   * Actualizar un goal especifico
   */
  async updateGoal(
    id: string,
    goalNumber: number,
    goalText: string
  ): Promise<PatientGoal> {
    return apiClient.patch<PatientGoal>(
      `${API_ENDPOINTS.patients.byId(id)}/goals/${goalNumber}`,
      { goalText },
      true
    );
  }

  // ==================== DIAGNOSTICOS ====================

  /**
   * POST /patients/:id/diagnoses
   * Agregar un nuevo diagnostico
   */
  async addDiagnosis(
    id: string,
    icd10Code: string,
    diagnosisDescription: string,
    isPrimary = false
  ): Promise<PatientDiagnosis> {
    return apiClient.post<PatientDiagnosis>(
      `${API_ENDPOINTS.patients.byId(id)}/diagnoses`,
      { icd10Code, diagnosisDescription, isPrimary },
      true
    );
  }

  /**
   * DELETE /patients/diagnoses/:diagnosisId
   * Eliminar un diagnostico
   */
  async removeDiagnosis(diagnosisId: string): Promise<void> {
    return apiClient.delete<void>(
      `${API_ENDPOINTS.patients.base}/diagnoses/${diagnosisId}`,
      true
    );
  }

  // ==================== DOCUMENTOS ====================

  /**
   * POST /patients/:id/documents
   * Subir un documento del paciente
   */
  async uploadDocument(
    id: string,
    document: UploadDocumentDto
  ): Promise<PatientDocument> {
    return apiClient.post<PatientDocument>(
      `${API_ENDPOINTS.patients.byId(id)}/documents`,
      document,
      true
    );
  }

  /**
   * GET /patients/:id/documents
   * Obtener todos los documentos de un paciente
   */
  async getDocuments(id: string): Promise<PatientDocument[]> {
    return apiClient.get<PatientDocument[]>(
      `${API_ENDPOINTS.patients.byId(id)}/documents`,
      true
    );
  }

  /**
   * DELETE /patients/documents/:documentId
   * Eliminar un documento
   */
  async removeDocument(documentId: string): Promise<void> {
    return apiClient.delete<void>(
      `${API_ENDPOINTS.patients.base}/documents/${documentId}`,
      true
    );
  }
}

export const patientsService = new PatientsService();
