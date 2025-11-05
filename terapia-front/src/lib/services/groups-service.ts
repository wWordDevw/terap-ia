/**
 * Servicio de Grupos
 */

import { apiClient } from '../api-client';
import { API_ENDPOINTS } from '../api-config';
import type { Grupo } from '../types';

// ==================== ENUMS ====================

export enum ProgramType {
  PHP = 'PHP',
  IOP = 'IOP',
}

export enum Shift {
  MORNING = 'Mañana',
  AFTERNOON = 'Tarde',
}

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

// ==================== INTERFACES ====================

export interface GroupWeek {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  createdAt: string;
}

export interface GroupSchedule {
  id: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  units: number;
  noteCode?: string;
  isNurseSession: boolean;
  activityId: string;
  subactivityId?: string;
  createdAt: string;
}

export interface GroupPatient {
  id: string;
  patientId: string;
  groupId: string;
  joinedDate: string;
  leftDate?: string;
  isActive: boolean;
}

export interface Group {
  id: string;
  groupName?: string;
  programType: ProgramType;
  shift: Shift;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  clinicId: string;
  createdById?: string;
  weeks?: GroupWeek[];
  schedules?: GroupSchedule[];
  groupPatients?: GroupPatient[];
  createdAt: string;
  updatedAt: string;
}

// ==================== DTOs ====================

export interface CreateGroupDto {
  programType: ProgramType;
  shift: Shift;
  groupName?: string;
  startDate: string | Date;
  endDate?: string | Date;
  clinicId: string;
}

export interface UpdateGroupDto {
  groupName?: string;
  programType?: ProgramType;
  shift?: Shift;
  startDate?: string | Date;
  endDate?: string | Date;
  isActive?: boolean;
}

export interface CreateGroupWeekDto {
  groupId: string;
  weekNumber: number;
  startDate: string | Date;
  endDate: string | Date;
}

export interface CreateGroupScheduleDto {
  groupId: string;
  dayOfWeek: DayOfWeek;
  activityId: string;
  subactivityId?: string;
  startTime: string;
  endTime: string;
  units: number;
  noteCode?: string;
  isNurseSession?: boolean;
}

export interface AddPatientToGroupDto {
  patientId: string;
  joinedDate: string | Date;
}

// ==================== SERVICIO ====================

class GroupsService {
  // ==================== GRUPOS ====================

  /**
   * GET /groups
   * Obtener todos los grupos
   */
  async getAll(includeInactive = false): Promise<Grupo[]> {
    const url = includeInactive
      ? `${API_ENDPOINTS.groups.base}?includeInactive=true`
      : API_ENDPOINTS.groups.base;
    return apiClient.get<Grupo[]>(url, true);
  }

  /**
   * GET /groups/:id
   * Obtener un grupo por ID
   */
  async getById(id: string): Promise<Group> {
    return apiClient.get<Group>(API_ENDPOINTS.groups.byId(id), true);
  }

  /**
   * POST /groups
   * Crear un nuevo grupo
   */
  async create(data: CreateGroupDto): Promise<Group> {
    return apiClient.post<Group>(API_ENDPOINTS.groups.base, data, true);
  }

  /**
   * PATCH /groups/:id
   * Actualizar un grupo
   */
  async update(id: string, data: UpdateGroupDto): Promise<Group> {
    return apiClient.patch<Group>(API_ENDPOINTS.groups.byId(id), data, true);
  }

  /**
   * DELETE /groups/:id
   * Desactivar un grupo (soft delete)
   */
  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(API_ENDPOINTS.groups.byId(id), true);
  }

  // ==================== SEMANAS ====================

  /**
   * POST /groups/:id/weeks
   * Crear una nueva semana para el grupo
   */
  async createWeek(groupId: string, data: Omit<CreateGroupWeekDto, 'groupId'>): Promise<GroupWeek> {
    return apiClient.post<GroupWeek>(
      `${API_ENDPOINTS.groups.byId(groupId)}/weeks`,
      { ...data, groupId },
      true
    );
  }

  /**
   * GET /groups/:id/weeks
   * Obtener todas las semanas de un grupo
   */
  async getWeeks(groupId: string): Promise<GroupWeek[]> {
    return apiClient.get<GroupWeek[]>(
      `${API_ENDPOINTS.groups.byId(groupId)}/weeks`,
      true
    );
  }

  /**
   * GET /groups/:id/weeks/current
   * Obtener la semana actual del grupo
   */
  async getCurrentWeek(groupId: string): Promise<GroupWeek> {
    return apiClient.get<GroupWeek>(
      `${API_ENDPOINTS.groups.byId(groupId)}/weeks/current`,
      true
    );
  }

  /**
   * PATCH /groups/weeks/:weekId/set-current
   * Marcar una semana como actual
   */
  async setCurrentWeek(weekId: string): Promise<GroupWeek> {
    return apiClient.patch<GroupWeek>(
      `${API_ENDPOINTS.groups.base}/weeks/${weekId}/set-current`,
      {},
      true
    );
  }

  // ==================== HORARIOS ====================

  /**
   * POST /groups/:id/schedules
   * Crear un horario para el grupo
   */
  async createSchedule(
    groupId: string,
    data: Omit<CreateGroupScheduleDto, 'groupId'>
  ): Promise<GroupSchedule> {
    return apiClient.post<GroupSchedule>(
      `${API_ENDPOINTS.groups.byId(groupId)}/schedules`,
      { ...data, groupId },
      true
    );
  }

  /**
   * GET /groups/:id/schedules
   * Obtener todos los horarios de un grupo
   */
  async getSchedules(groupId: string): Promise<GroupSchedule[]> {
    return apiClient.get<GroupSchedule[]>(
      `${API_ENDPOINTS.groups.byId(groupId)}/schedules`,
      true
    );
  }

  /**
   * DELETE /groups/schedules/:scheduleId
   * Eliminar un horario
   */
  async removeSchedule(scheduleId: string): Promise<void> {
    return apiClient.delete<void>(
      `${API_ENDPOINTS.groups.base}/schedules/${scheduleId}`,
      true
    );
  }

  // ==================== PACIENTES ====================

  /**
   * POST /groups/:id/patients
   * Agregar un paciente al grupo
   */
  async addPatient(
    groupId: string,
    data: AddPatientToGroupDto
  ): Promise<GroupPatient> {
    return apiClient.post<GroupPatient>(
      `${API_ENDPOINTS.groups.byId(groupId)}/patients`,
      data,
      true
    );
  }

  /**
   * GET /groups/:id/patients
   * Obtener todos los pacientes del grupo
   */
  async getPatients(groupId: string): Promise<GroupPatient[]> {
    return apiClient.get<GroupPatient[]>(
      `${API_ENDPOINTS.groups.byId(groupId)}/patients`,
      true
    );
  }

  /**
   * DELETE /groups/:id/patients/:patientId
   * Remover un paciente del grupo
   */
  async removePatient(groupId: string, patientId: string): Promise<void> {
    return apiClient.delete<void>(
      `${API_ENDPOINTS.groups.byId(groupId)}/patients/${patientId}`,
      true
    );
  }

  // ==================== VALIDACIONES DE LÍMITE ====================

  /**
   * GET /groups/active-count
   * Obtener información sobre el límite de grupos activos del terapeuta actual
   */
  async getActiveGroupsCount(): Promise<{
    currentActiveGroups: number;
    maxActiveGroups: number;
    canCreateNew: boolean;
  }> {
    return apiClient.get<{
      currentActiveGroups: number;
      maxActiveGroups: number;
      canCreateNew: boolean;
    }>(`${API_ENDPOINTS.groups.base}/active-count`, true);
  }

  /**
   * Helper para validar si se puede crear un nuevo grupo
   */
  async canCreateNewGroup(): Promise<{
    canCreate: boolean;
    message?: string;
  }> {
    try {
      const limitInfo = await this.getActiveGroupsCount();
      
      if (!limitInfo.canCreateNew) {
        return {
          canCreate: false,
          message: `No puedes tener más de ${limitInfo.maxActiveGroups} grupos activos. Debes desactivar un grupo existente antes de crear uno nuevo.`
        };
      }

      return { canCreate: true };
    } catch (error) {
      console.error('Error al verificar límite de grupos:', error);
      return {
        canCreate: false,
        message: 'Error al verificar el límite de grupos activos'
      };
    }
  }

  /**
   * Helper para obtener grupos activos del terapeuta actual
   */
  async getActiveGroups(): Promise<Grupo[]> {
    const allGroups = await this.getAll();
    return allGroups.filter(group => group.estado === 'Activo');
  }
}

export const groupsService = new GroupsService();
