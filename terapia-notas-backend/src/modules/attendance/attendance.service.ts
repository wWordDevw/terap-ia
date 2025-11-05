import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { AbsenceReason } from './entities/absence-reason.entity';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { JustifyAbsenceDto } from './dto/justify-absence.dto';
import { GroupPatient } from '../groups/entities/group-patient.entity';

/**
 * Servicio de Asistencia - RF-007 a RF-009
 * Maneja la lógica de negocio para asistencia y ausencias
 */
@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(AbsenceReason)
    private readonly absenceReasonRepository: Repository<AbsenceReason>,
    @InjectRepository(GroupPatient)
    private readonly groupPatientRepository: Repository<GroupPatient>,
  ) {}

  /**
   * Marcar asistencia de un paciente - RF-007
   */
  async markAttendance(
    markAttendanceDto: MarkAttendanceDto,
    userId?: string,
  ): Promise<Attendance> {
    // Verificar si ya existe asistencia para este día
    const existing = await this.attendanceRepository.findOne({
      where: {
        weekId: markAttendanceDto.weekId,
        patientId: markAttendanceDto.patientId,
        attendanceDate: markAttendanceDto.attendanceDate,
      },
    });

    // RF-009: No permitir cambios si ya está bloqueada
    if (existing && existing.isLocked) {
      throw new ForbiddenException(
        'Esta asistencia ya está registrada y no se puede modificar (RF-009)',
      );
    }

    try {
      if (existing) {
        // Actualizar existente
        Object.assign(existing, {
          status: markAttendanceDto.status,
          unitsAttended: markAttendanceDto.unitsAttended,
        });
        return await this.attendanceRepository.save(existing);
      } else {
        // Crear nueva
        const attendance = this.attendanceRepository.create(markAttendanceDto);
        return await this.attendanceRepository.save(attendance);
      }
    } catch (error) {
      throw new BadRequestException(
        'Error al marcar asistencia: ' + error.message,
      );
    }
  }

  /**
   * Obtener asistencia de una semana
   */
  async getWeekAttendance(weekId: string): Promise<Attendance[]> {
    return await this.attendanceRepository.find({
      where: { weekId },
      relations: ['patient', 'absenceReasons'],
      order: {
        attendanceDate: 'ASC',
        patient: { lastName: 'ASC', firstName: 'ASC' },
      },
    });
  }

  /**
   * Obtener asistencia de un paciente en una semana
   */
  async getPatientWeekAttendance(
    weekId: string,
    patientId: string,
  ): Promise<Attendance[]> {
    return await this.attendanceRepository.find({
      where: { weekId, patientId },
      relations: ['absenceReasons'],
      order: { attendanceDate: 'ASC' },
    });
  }

  /**
   * Obtener una asistencia específica
   */
  async findOne(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({
      where: { id },
      relations: ['patient', 'week', 'absenceReasons'],
    });

    if (!attendance) {
      throw new NotFoundException(`Asistencia con ID ${id} no encontrada`);
    }

    return attendance;
  }

  /**
   * Bloquear asistencia - RF-009
   * Una vez bloqueada, no se puede modificar
   */
  async lockAttendance(id: string, userId?: string): Promise<Attendance> {
    const attendance = await this.findOne(id);

    attendance.isLocked = true;
    attendance.lockedAt = new Date();
    if (userId) {
      attendance.lockedById = userId;
    }

    return await this.attendanceRepository.save(attendance);
  }

  /**
   * Bloquear todas las asistencias de una semana
   * Se ejecuta cuando se generan las notas - RF-010
   */
  async lockWeekAttendance(weekId: string, userId?: string): Promise<void> {
    const attendances = await this.getWeekAttendance(weekId);

    for (const attendance of attendances) {
      if (!attendance.isLocked) {
        await this.lockAttendance(attendance.id, userId);
      }
    }
  }

  /**
   * Justificar ausencia - RF-008
   */
  async justifyAbsence(
    justifyAbsenceDto: JustifyAbsenceDto,
  ): Promise<AbsenceReason> {
    // Verificar que la asistencia existe y está marcada como ausente
    const attendance = await this.findOne(justifyAbsenceDto.attendanceId);

    if (attendance.status !== AttendanceStatus.ABSENT) {
      throw new BadRequestException(
        'Solo se pueden justificar ausencias (status = A)',
      );
    }

    try {
      const reason = this.absenceReasonRepository.create(justifyAbsenceDto);
      return await this.absenceReasonRepository.save(reason);
    } catch (error) {
      throw new BadRequestException(
        'Error al justificar ausencia: ' + error.message,
      );
    }
  }

  /**
   * Obtener razones de ausencia de una asistencia
   */
  async getAbsenceReasons(attendanceId: string): Promise<AbsenceReason[]> {
    return await this.absenceReasonRepository.find({
      where: { attendanceId },
      order: { startDate: 'DESC' },
    });
  }

  /**
   * Eliminar una razón de ausencia
   */
  async removeAbsenceReason(reasonId: string): Promise<void> {
    const reason = await this.absenceReasonRepository.findOne({
      where: { id: reasonId },
    });

    if (!reason) {
      throw new NotFoundException(`Razón de ausencia con ID ${reasonId} no encontrada`);
    }

    await this.absenceReasonRepository.remove(reason);
  }

  /**
   * Obtener estadísticas de asistencia de un paciente
   */
  async getPatientStats(
    patientId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<{
    totalDays: number;
    present: number;
    absent: number;
    discharge: number;
    totalUnits: number;
  }> {
    const query = this.attendanceRepository
      .createQueryBuilder('attendance')
      .where('attendance.patientId = :patientId', { patientId });

    if (startDate) {
      query.andWhere('attendance.attendanceDate >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('attendance.attendanceDate <= :endDate', { endDate });
    }

    const attendances = await query.getMany();

    return {
      totalDays: attendances.length,
      present: attendances.filter((a) => a.status === AttendanceStatus.PRESENT)
        .length,
      absent: attendances.filter((a) => a.status === AttendanceStatus.ABSENT)
        .length,
      discharge: attendances.filter((a) => a.status === AttendanceStatus.DISCHARGE)
        .length,
      totalUnits: attendances.reduce((sum, a) => sum + Number(a.unitsAttended), 0),
    };
  }

  /**
   * Obtener asistencia de todos los pacientes de un grupo en una fecha específica
   */
  async getGroupDateAttendance(
    groupId: string,
    date: string,
  ): Promise<{
    groupId: string;
    date: string;
    dayOfWeek: string;
    attendances: Array<{
      id: string;
      patientId: string;
      patientName: string;
      patientNumber: string;
      status: 'P' | 'A' | 'D';
      unitsAttended: number;
      isLocked: boolean;
      absenceReason?: {
        id: string;
        reasonType: string;
        startDate: string;
        endDate?: string;
        notes?: string;
      };
    }>;
    summary: {
      totalPatients: number;
      presentCount: number;
      absentCount: number;
      dischargeCount: number;
      attendanceRate: number;
    };
  }> {
    const attendanceDate = new Date(date);
    const dayOfWeek = attendanceDate.toLocaleDateString('es-ES', { weekday: 'long' });

    // Obtener todos los pacientes del grupo
    const groupPatients = await this.groupPatientRepository
      .createQueryBuilder('gp')
      .leftJoinAndSelect('gp.patient', 'patient')
      .leftJoinAndSelect('gp.group', 'group')
      .where('gp.groupId = :groupId', { groupId })
      .andWhere('gp.isActive = :isActive', { isActive: true })
      .andWhere('group.isActive = :groupActive', { groupActive: true })
      .getMany();

    // Obtener asistencias del día
    const attendances = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.patient', 'patient')
      .leftJoinAndSelect('attendance.absenceReasons', 'absenceReasons')
      .where('attendance.attendanceDate = :date', { date: attendanceDate })
      .andWhere('attendance.patientId IN (:...patientIds)', {
        patientIds: groupPatients.map(gp => gp.patientId),
      })
      .getMany();

    // Crear mapa de asistencias por patientId
    const attendanceMap = new Map();
    attendances.forEach(att => {
      attendanceMap.set(att.patientId, att);
    });

    // Procesar cada paciente del grupo
    const processedAttendances = groupPatients.map(gp => {
      const attendance = attendanceMap.get(gp.patientId);
      const patient = gp.patient;

      if (attendance) {
        return {
          id: attendance.id,
          patientId: patient.id,
          patientName: `${patient.firstName} ${patient.lastName}`,
          patientNumber: patient.patientNumber,
          status: attendance.status,
          unitsAttended: attendance.unitsAttended,
          isLocked: attendance.isLocked,
          absenceReason: attendance.absenceReasons?.[0] ? {
            id: attendance.absenceReasons[0].id,
            reasonType: attendance.absenceReasons[0].reasonType,
            startDate: attendance.absenceReasons[0].startDate instanceof Date 
              ? attendance.absenceReasons[0].startDate.toISOString().split('T')[0]
              : attendance.absenceReasons[0].startDate,
            endDate: attendance.absenceReasons[0].endDate 
              ? (attendance.absenceReasons[0].endDate instanceof Date 
                ? attendance.absenceReasons[0].endDate.toISOString().split('T')[0]
                : attendance.absenceReasons[0].endDate)
              : undefined,
            notes: attendance.absenceReasons[0].notes,
          } : undefined,
        };
      } else {
        // Si no hay registro de asistencia, considerar como ausente
        return {
          id: null,
          patientId: patient.id,
          patientName: `${patient.firstName} ${patient.lastName}`,
          patientNumber: patient.patientNumber,
          status: 'A' as const,
          unitsAttended: 0,
          isLocked: false,
          absenceReason: undefined,
        };
      }
    });

    // Calcular resumen
    const totalPatients = processedAttendances.length;
    const presentCount = processedAttendances.filter(a => a.status === 'P').length;
    const absentCount = processedAttendances.filter(a => a.status === 'A').length;
    const dischargeCount = processedAttendances.filter(a => a.status === 'D').length;
    const attendanceRate = totalPatients > 0 ? (presentCount / totalPatients) * 100 : 0;

    return {
      groupId,
      date,
      dayOfWeek,
      attendances: processedAttendances,
      summary: {
        totalPatients,
        presentCount,
        absentCount,
        dischargeCount,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
      },
    };
  }
}
