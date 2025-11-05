import { apiClient } from '../api-client';

export enum DocumentType {
  MASTER_TREATMENT_PLAN = 'master_treatment_plan',
  ASSESSMENT = 'assessment',
  MEDICAL_RECORD = 'medical_record',
  LAB_RESULT = 'lab_result',
  PRESCRIPTION = 'prescription',
  INSURANCE = 'insurance',
  CONSENT_FORM = 'consent_form',
  DISCHARGE_SUMMARY = 'discharge_summary',
  PROGRESS_NOTE = 'progress_note',
  OTHER = 'other',
}

export interface PatientDocument {
  id: string;
  patientId: string;
  documentType: DocumentType;
  documentName: string;
  filePath: string;
  fileSize?: number;
  mimeType?: string;
  description?: string;
  uploadedAt: Date;
  uploadedBy?: {
    id: string;
    fullName: string;
  };
}

export interface UploadDocumentData {
  file: File;
  documentType: DocumentType;
  description?: string;
}

/**
 * Servicio para gestión de documentos de pacientes
 */
class PatientDocumentsService {
  private baseUrl = '/patients';

  /**
   * Obtener todos los documentos de un paciente
   */
  async getDocuments(patientId: string): Promise<PatientDocument[]> {
    return apiClient.get<PatientDocument[]>(
      `${this.baseUrl}/${patientId}/documents`,
      true
    );
  }

  /**
   * Subir un documento para un paciente
   */
  async uploadDocument(
    patientId: string,
    data: UploadDocumentData
  ): Promise<PatientDocument> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('documentType', data.documentType);
    if (data.description) {
      formData.append('description', data.description);
    }

    return apiClient.postFormData<PatientDocument>(
      `${this.baseUrl}/${patientId}/documents`,
      formData,
      true
    );
  }

  /**
   * Descargar un documento
   */
  async downloadDocument(documentId: string, fileName: string): Promise<void> {
    const blob = await apiClient.getBlob(
      `${this.baseUrl}/documents/${documentId}/download`,
      true
    );

    // Crear un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Eliminar un documento
   */
  async deleteDocument(documentId: string): Promise<void> {
    await apiClient.delete<void>(`${this.baseUrl}/documents/${documentId}`, true);
  }

  /**
   * Obtener nombre legible del tipo de documento
   */
  getDocumentTypeLabel(type: DocumentType): string {
    const labels: Record<DocumentType, string> = {
      [DocumentType.MASTER_TREATMENT_PLAN]: 'Plan de Tratamiento',
      [DocumentType.ASSESSMENT]: 'Evaluación',
      [DocumentType.MEDICAL_RECORD]: 'Historia Clínica',
      [DocumentType.LAB_RESULT]: 'Resultado de Laboratorio',
      [DocumentType.PRESCRIPTION]: 'Receta Médica',
      [DocumentType.INSURANCE]: 'Seguro',
      [DocumentType.CONSENT_FORM]: 'Formulario de Consentimiento',
      [DocumentType.DISCHARGE_SUMMARY]: 'Resumen de Alta',
      [DocumentType.PROGRESS_NOTE]: 'Nota de Progreso',
      [DocumentType.OTHER]: 'Otro',
    };
    return labels[type] || 'Desconocido';
  }

  /**
   * Formatear tamaño de archivo
   */
  formatFileSize(bytes?: number): string {
    if (!bytes) return 'Desconocido';

    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /**
   * Obtener icono según el tipo MIME
   */
  getFileIcon(mimeType?: string): string {
    if (!mimeType) return '📄';

    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📕';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType === 'text/plain') return '📃';

    return '📄';
  }

  /**
   * Validar archivo antes de subir
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // Validar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'El archivo es demasiado grande. El tamaño máximo es 10MB.',
      };
    }

    // Validar tipo
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Tipo de archivo no permitido. Solo se permiten PDF, imágenes y documentos de Office.',
      };
    }

    return { valid: true };
  }
}

export const patientDocumentsService = new PatientDocumentsService();
