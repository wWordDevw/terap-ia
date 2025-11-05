import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupWeekDto } from './dto/create-group-week.dto';
import { CreateGroupScheduleDto } from './dto/create-group-schedule.dto';
import { AddPatientToGroupDto } from './dto/add-patient-to-group.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';

/**
 * Controlador de Grupos - RF-001 a RF-003
 * Gestiona los endpoints REST para grupos, semanas, horarios y pacientes
 * Requiere autenticación y rol de ADMIN o THERAPIST
 */
@Controller('groups')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.THERAPIST)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  // ==================== GRUPOS ====================

  /**
   * POST /groups
   * Crear un nuevo grupo - RF-001
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createGroupDto: CreateGroupDto,
    @CurrentUser() user: User,
  ) {
    return this.groupsService.create(createGroupDto, user);
  }

  /**
   * GET /groups
   * Obtener todos los grupos - RF-002
   */
  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query('includeInactive') includeInactive?: string,
  ) {
    const include = includeInactive === 'true';
    return this.groupsService.findAll(user, include);
  }

  /**
   * GET /groups/:id
   * Obtener un grupo por ID - RF-002
   */
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.groupsService.findOne(id, user);
  }

  /**
   * PUT /groups/:id
   * Actualizar un grupo
   */
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @CurrentUser() user: User,
  ) {
    return this.groupsService.update(id, updateGroupDto, user);
  }

  /**
   * DELETE /groups/:id
   * Desactivar un grupo (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.groupsService.remove(id, user);
  }

  // ==================== SEMANAS - RF-003 ====================

  /**
   * POST /groups/:id/weeks
   * Crear una nueva semana para el grupo
   */
  @Post(':id/weeks')
  @HttpCode(HttpStatus.CREATED)
  createWeek(
    @Param('id', ParseUUIDPipe) groupId: string,
    @Body() createWeekDto: CreateGroupWeekDto,
    @CurrentUser() user: User,
  ) {
    createWeekDto.groupId = groupId; // Asegurar que el groupId coincida
    return this.groupsService.createWeek(createWeekDto, user);
  }

  /**
   * GET /groups/:id/weeks
   * Obtener todas las semanas de un grupo
   */
  @Get(':id/weeks')
  getWeeks(
    @Param('id', ParseUUIDPipe) groupId: string,
    @CurrentUser() user: User,
  ) {
    return this.groupsService.getWeeks(groupId, user);
  }

  /**
   * GET /groups/:id/weeks/current
   * Obtener la semana actual del grupo - RF-003
   */
  @Get(':id/weeks/current')
  getCurrentWeek(
    @Param('id', ParseUUIDPipe) groupId: string,
    @CurrentUser() user: User,
  ) {
    return this.groupsService.getCurrentWeek(groupId, user);
  }

  /**
   * PATCH /groups/weeks/:weekId/set-current
   * Marcar una semana como actual
   */
  @Patch('weeks/:weekId/set-current')
  setCurrentWeek(
    @Param('weekId', ParseUUIDPipe) weekId: string,
    @CurrentUser() user: User,
  ) {
    return this.groupsService.setCurrentWeek(weekId, user);
  }

  // ==================== HORARIOS - RF-001 ====================

  /**
   * POST /groups/:id/schedules
   * Crear un horario para el grupo
   */
  @Post(':id/schedules')
  @HttpCode(HttpStatus.CREATED)
  createSchedule(
    @Param('id', ParseUUIDPipe) groupId: string,
    @Body() createScheduleDto: CreateGroupScheduleDto,
    @CurrentUser() user: User,
  ) {
    createScheduleDto.groupId = groupId;
    return this.groupsService.createSchedule(createScheduleDto, user);
  }

  /**
   * GET /groups/:id/schedules
   * Obtener todos los horarios de un grupo
   */
  @Get(':id/schedules')
  getSchedules(
    @Param('id', ParseUUIDPipe) groupId: string,
    @CurrentUser() user: User,
  ) {
    return this.groupsService.getSchedules(groupId, user);
  }

  /**
   * DELETE /groups/schedules/:scheduleId
   * Eliminar un horario
   */
  @Delete('schedules/:scheduleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeSchedule(
    @Param('scheduleId', ParseUUIDPipe) scheduleId: string,
    @CurrentUser() user: User,
  ) {
    return this.groupsService.removeSchedule(scheduleId, user);
  }

  // ==================== PACIENTES ====================

  /**
   * POST /groups/:id/patients
   * Agregar un paciente al grupo - RF-005
   */
  @Post(':id/patients')
  @HttpCode(HttpStatus.CREATED)
  addPatient(
    @Param('id', ParseUUIDPipe) groupId: string,
    @Body() addPatientDto: AddPatientToGroupDto,
    @CurrentUser() user: User,
  ) {
    return this.groupsService.addPatient(groupId, addPatientDto, user);
  }

  /**
   * GET /groups/:id/patients
   * Obtener todos los pacientes del grupo
   */
  @Get(':id/patients')
  getPatients(
    @Param('id', ParseUUIDPipe) groupId: string,
    @CurrentUser() user: User,
  ) {
    return this.groupsService.getPatients(groupId, user);
  }

  /**
   * DELETE /groups/:id/patients/:patientId
   * Remover un paciente del grupo
   */
  @Delete(':id/patients/:patientId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removePatient(
    @Param('id', ParseUUIDPipe) groupId: string,
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @CurrentUser() user: User,
  ) {
    return this.groupsService.removePatient(groupId, patientId, user);
  }
}
