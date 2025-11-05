/**
 * Servicio de Asistencia
 */

import { apiClient } from '../api-client';

// ==================== ENUMS ====================

export enum AttendanceStatus {
  PRESENT = 'P',
  ABSENT = 'A',
  DISCHARGE = 'D',
}

export enum ReasonType {
  MEDICAL_APPOINTMENT = 'medical_appointment',
  FAMILY_TRIP = 'family_trip',
  HOSPITALIZED = 'hospitalized',
}

// ==================== INTERFACES ====================

export interface Attendance {
  id: string;
  patientId: string;
  weekId: string;
  attendanceDate: string;
  status: AttendanceStatus;
  unitsAttended: number;
  isLocked: boolean;
  lockedAt?: string;
  lockedById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AbsenceReasonRecord {
  id: string;
  attendanceId: string;
  reasonType: ReasonType;
  startDate: string;
  endDate?: string;
  notes?: string;
  createdAt: string;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  dischargeDays: number;
  attendanceRate: number;
}

// ==================== DTOs ====================

export interface MarkAttendanceDto {
  weekId: string;
  patientId: string;
  attendanceDate: string;
  status: AttendanceStatus;
  unitsAttended: number;
}

export interface JustifyAbsenceDto {
  attendanceId: string;
  reasonType: ReasonType;
  startDate: string;
  endDate?: string;
  notes?: string;
}

// ==================== SERVICIO ====================

class AttendanceService {
  private readonly BASE_URL = '/attendance';

  /**
   * POST /attendance
   * Marcar asistencia de un paciente
   */
  async markAttendance(data: MarkAttendanceDto): Promise<Attendance> {
    return apiClient.post<Attendance>(this.BASE_URL, data, true);
  }

  /**
   * GET /attendance/week/:weekId
   * Obtener toda la asistencia de una semana
   */
  async getWeekAttendance(weekId: string): Promise<Attendance[]> {
    return apiClient.get<Attendance[]>(
      `${this.BASE_URL}/week/${weekId}`,
      true
    );
  }

  /**
   * GET /attendance/week/:weekId/patient/:patientId
   * Obtener asistencia de un paciente en una semana especifica
   */
  async getPatientWeekAttendance(
    weekId: string,
    patientId: string
  ): Promise<Attendance[]> {
    return apiClient.get<Attendance[]>(
      `${this.BASE_URL}/week/${weekId}/patient/${patientId}`,
      true
    );
  }

  /**
   * GET /attendance/:id
   * Obtener una asistencia especifica
   */
  async getById(id: string): Promise<Attendance> {
    return apiClient.get<Attendance>(`${this.BASE_URL}/${id}`, true);
  }

  /**
   * PATCH /attendance/:id/lock
   * Bloquear una asistencia
   */
  async lockAttendance(id: string): Promise<Attendance> {
    return apiClient.patch<Attendance>(
      `${this.BASE_URL}/${id}/lock`,
      {},
      true
    );
  }

  /**
   * POST /attendance/week/:weekId/lock-all
   * Bloquear todas las asistencias de una semana
   */
  async lockWeekAttendance(weekId: string): Promise<void> {
    return apiClient.post<void>(
      `${this.BASE_URL}/week/${weekId}/lock-all`,
      {},
      true
    );
  }

  /**
   * POST /attendance/absence/justify
   * Justificar una ausencia
   */
  async justifyAbsence(data: JustifyAbsenceDto): Promise<AbsenceReasonRecord> {
    return apiClient.post<AbsenceReasonRecord>(
      `${this.BASE_URL}/absence/justify`,
      data,
      true
    );
  }

  /**
   * GET /attendance/:id/absence-reasons
   * Obtener razones de ausencia de una asistencia
   */
  async getAbsenceReasons(attendanceId: string): Promise<AbsenceReasonRecord[]> {
    return apiClient.get<AbsenceReasonRecord[]>(
      `${this.BASE_URL}/${attendanceId}/absence-reasons`,
      true
    );
  }

  /**
   * DELETE /attendance/absence-reasons/:reasonId
   * Eliminar una razon de ausencia
   */
  async removeAbsenceReason(reasonId: string): Promise<void> {
    return apiClient.delete<void>(
      `${this.BASE_URL}/absence-reasons/${reasonId}`,
      true
    );
  }

  /**
   * GET /attendance/patient/:patientId/stats
   * Obtener estadisticas de asistencia de un paciente
   */
  async getPatientStats(
    patientId: string,
    startDate?: string,
    endDate?: string
  ): Promise<AttendanceStats> {
    let url = `${this.BASE_URL}/patient/${patientId}/stats`;
    const params = new URLSearchParams();

    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return apiClient.get<AttendanceStats>(url, true);
  }
}

export const attendanceService = new AttendanceService();
