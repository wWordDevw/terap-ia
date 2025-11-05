import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { JustifyAbsenceDto } from './dto/justify-absence.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

/**
 * Controlador de Asistencia - RF-007 a RF-009
 * Gestiona los endpoints REST para asistencia y ausencias
 * Requiere autenticación y rol de ADMIN, THERAPIST o NURSE
 */
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.THERAPIST, UserRole.NURSE)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  /**
   * POST /attendance
   * Marcar asistencia de un paciente - RF-007
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  markAttendance(@Body() markAttendanceDto: MarkAttendanceDto) {
    return this.attendanceService.markAttendance(markAttendanceDto);
  }

  /**
   * GET /attendance/week/:weekId
   * Obtener toda la asistencia de una semana
   */
  @Get('week/:weekId')
  getWeekAttendance(@Param('weekId', ParseUUIDPipe) weekId: string) {
    return this.attendanceService.getWeekAttendance(weekId);
  }

  /**
   * GET /attendance/week/:weekId/patient/:patientId
   * Obtener asistencia de un paciente en una semana específica
   */
  @Get('week/:weekId/patient/:patientId')
  getPatientWeekAttendance(
    @Param('weekId', ParseUUIDPipe) weekId: string,
    @Param('patientId', ParseUUIDPipe) patientId: string,
  ) {
    return this.attendanceService.getPatientWeekAttendance(weekId, patientId);
  }

  /**
   * GET /attendance/:id
   * Obtener una asistencia específica
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.attendanceService.findOne(id);
  }

  /**
   * PATCH /attendance/:id/lock
   * Bloquear una asistencia - RF-009
   */
  @Patch(':id/lock')
  lockAttendance(@Param('id', ParseUUIDPipe) id: string) {
    return this.attendanceService.lockAttendance(id);
  }

  /**
   * POST /attendance/week/:weekId/lock-all
   * Bloquear todas las asistencias de una semana
   */
  @Post('week/:weekId/lock-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  lockWeekAttendance(@Param('weekId', ParseUUIDPipe) weekId: string) {
    return this.attendanceService.lockWeekAttendance(weekId);
  }

  /**
   * POST /attendance/absence/justify
   * Justificar una ausencia - RF-008
   */
  @Post('absence/justify')
  @HttpCode(HttpStatus.CREATED)
  justifyAbsence(@Body() justifyAbsenceDto: JustifyAbsenceDto) {
    return this.attendanceService.justifyAbsence(justifyAbsenceDto);
  }

  /**
   * GET /attendance/:id/absence-reasons
   * Obtener razones de ausencia de una asistencia
   */
  @Get(':id/absence-reasons')
  getAbsenceReasons(@Param('id', ParseUUIDPipe) attendanceId: string) {
    return this.attendanceService.getAbsenceReasons(attendanceId);
  }

  /**
   * DELETE /attendance/absence-reasons/:reasonId
   * Eliminar una razón de ausencia
   */
  @Delete('absence-reasons/:reasonId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAbsenceReason(@Param('reasonId', ParseUUIDPipe) reasonId: string) {
    return this.attendanceService.removeAbsenceReason(reasonId);
  }

  /**
   * GET /attendance/patient/:patientId/stats
   * Obtener estadísticas de asistencia de un paciente
   * Query params opcionales: startDate, endDate
   */
  @Get('patient/:patientId/stats')
  getPatientStats(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.attendanceService.getPatientStats(patientId, start, end);
  }

  /**
   * GET /attendance/group/:groupId/date/:date
   * Obtener asistencia de todos los pacientes de un grupo en una fecha específica
   */
  @Get('group/:groupId/date/:date')
  getGroupDateAttendance(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Param('date') date: string,
  ) {
    return this.attendanceService.getGroupDateAttendance(groupId, date);
  }
}
