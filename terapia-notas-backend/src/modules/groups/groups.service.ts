import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { GroupWeek } from './entities/group-week.entity';
import { GroupSchedule } from './entities/group-schedule.entity';
import { GroupPatient } from './entities/group-patient.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { CreateGroupWeekDto } from './dto/create-group-week.dto';
import { CreateGroupScheduleDto } from './dto/create-group-schedule.dto';
import { AddPatientToGroupDto } from './dto/add-patient-to-group.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { ActivitiesService } from '../activities/activities.service';

/**
 * Servicio de Grupos - RF-001 a RF-003
 * Maneja la lógica de negocio para grupos, semanas, horarios y pacientes
 */
@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupWeek)
    private readonly groupWeekRepository: Repository<GroupWeek>,
    @InjectRepository(GroupSchedule)
    private readonly groupScheduleRepository: Repository<GroupSchedule>,
    @InjectRepository(GroupPatient)
    private readonly groupPatientRepository: Repository<GroupPatient>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly activitiesService: ActivitiesService,
  ) {}

  /**
   * Verificar si el usuario puede acceder a un grupo
   * ADMIN: puede acceder a todos
   * Otros roles: solo pueden acceder a los que crearon
   */
  private canAccessGroup(group: Group, user: User): boolean {
    console.log('🔍 [canAccessGroup] Verificando acceso:', {
      groupId: group.id,
      groupCreatedById: group.createdById,
      userId: user.id,
      userRole: user.role,
      isAdmin: user.role === UserRole.ADMIN,
      hasAccess: user.role === UserRole.ADMIN || group.createdById === user.id
    });
    
    if (user.role === UserRole.ADMIN) {
      return true;
    }
    return group.createdById === user.id;
  }

  /**
   * Verificar acceso y lanzar excepción si no tiene permisos
   */
  private checkAccess(group: Group, user: User): void {
    if (!this.canAccessGroup(group, user)) {
      throw new ForbiddenException('No tienes permisos para acceder a este grupo');
    }
  }

  /**
   * Validar que los schedules sean válidos
   */
  private async validateSchedules(schedules: any[]): Promise<void> {
    if (!schedules || schedules.length === 0) {
      return;
    }

    // Validar que todos los activityId existan
    const activityIds = [...new Set(schedules.map(s => s.activityId))];
    for (const activityId of activityIds) {
      try {
        await this.activitiesService.findOne(activityId);
      } catch (error) {
        throw new BadRequestException(`Actividad con ID ${activityId} no encontrada`);
      }
    }

    // Validar formato de tiempo
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    for (const schedule of schedules) {
      if (!timeRegex.test(schedule.startTime)) {
        throw new BadRequestException(`Formato de hora de inicio inválido: ${schedule.startTime}. Use formato HH:MM`);
      }
      if (!timeRegex.test(schedule.endTime)) {
        throw new BadRequestException(`Formato de hora de fin inválido: ${schedule.endTime}. Use formato HH:MM`);
      }
      
      // Validar que la hora de inicio sea anterior a la de fin
      const startTime = new Date(`2000-01-01T${schedule.startTime}:00`);
      const endTime = new Date(`2000-01-01T${schedule.endTime}:00`);
      if (startTime >= endTime) {
        throw new BadRequestException(`La hora de inicio (${schedule.startTime}) debe ser anterior a la hora de fin (${schedule.endTime})`);
      }
    }
  }

  // ==================== GRUPOS ====================

  /**
   * Crear un nuevo grupo - RF-001
   */
  async create(createGroupDto: CreateGroupDto, user: User): Promise<Group> {
    // Validar que el terapeuta no tenga más de 2 grupos activos
    const activeGroupsCount = await this.groupRepository.count({
      where: {
        createdById: user.id,
        isActive: true,
      },
    });

    if (activeGroupsCount >= 2) {
      throw new BadRequestException(
        'No puedes tener más de 2 grupos activos. Debes desactivar un grupo existente antes de crear uno nuevo.'
      );
    }

    try {
      // Crear el grupo básico
      const group = this.groupRepository.create({
        programType: createGroupDto.programType,
        shift: createGroupDto.shift,
        groupName: createGroupDto.groupName,
        startDate: createGroupDto.startDate,
        endDate: createGroupDto.endDate,
        clinicId: createGroupDto.clinicId,
        createdById: user.id,
      });

      const savedGroup = await this.groupRepository.save(group);

      // Filtrar pacientes que ya están en otros grupos activos
      if (createGroupDto.pacientesIds && createGroupDto.pacientesIds.length > 0) {
        const patientsInOtherGroups = await this.groupPatientRepository
          .createQueryBuilder('gp')
          .leftJoin('gp.group', 'g')
          .where('gp.patientId IN (:...patientIds)', { patientIds: createGroupDto.pacientesIds })
          .andWhere('gp.isActive = :isActive', { isActive: true })
          .andWhere('g.isActive = :groupActive', { groupActive: true })
          .getMany();

        const busyPatientIds = patientsInOtherGroups.map(gp => gp.patientId);
        const availablePatientIds = createGroupDto.pacientesIds.filter(id => !busyPatientIds.includes(id));

        // Agregar solo pacientes disponibles
        for (const patientId of availablePatientIds) {
          const groupPatient = this.groupPatientRepository.create({
            groupId: savedGroup.id,
            patientId: patientId,
            joinedDate: new Date(),
            isActive: true,
          });
          await this.groupPatientRepository.save(groupPatient);
        }
      }

      // Crear horarios si se proporcionaron
      if (createGroupDto.schedules && createGroupDto.schedules.length > 0) {
        for (const schedule of createGroupDto.schedules) {
          const groupSchedule = this.groupScheduleRepository.create({
            groupId: savedGroup.id,
            dayOfWeek: schedule.dayOfWeek,
            activityId: schedule.activityId,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            units: schedule.units,
            isNurseSession: false,
          });
          await this.groupScheduleRepository.save(groupSchedule);
        }
      }

      // Retornar el grupo creado directamente
      return savedGroup;
    } catch (error) {
      throw new BadRequestException('Error al crear el grupo: ' + error.message);
    }
  }

  /**
   * Obtener todos los grupos - RF-002
   * ADMIN: ve todos los grupos
   * Otros roles: solo ven los que crearon
   */
  async findAll(user: User, includeInactive = false): Promise<Group[]> {
    // DEBUG: Log para verificar el usuario
    console.log('🔍 [GroupsService.findAll] Usuario:', {
      id: user?.id,
      email: user?.email,
      role: user?.role,
    });

    const queryOptions: any = {
      where: includeInactive ? {} : { isActive: true },
      relations: [
        'clinic', 
        'groupPatients', 
        'groupPatients.patient',
        'weeks',
        'schedules',
        'schedules.activity',
        'schedules.subactivity'
      ],
      order: { createdAt: 'DESC' },
    };

    // Si no es admin, filtrar por creador
    if (user.role !== UserRole.ADMIN) {
      queryOptions.where = {
        ...queryOptions.where,
        createdById: user.id,
      };
      console.log('🔒 [GroupsService.findAll] Aplicando filtro RBAC para non-admin:', queryOptions.where);
    } else {
      console.log('👑 [GroupsService.findAll] Usuario ADMIN - sin filtro de creador');
    }

    const result = await this.groupRepository.find(queryOptions);
    console.log(`📊 [GroupsService.findAll] Retornando ${result.length} grupos`);

    // Agregar información del terapeuta creador para cada grupo
    for (const group of result) {
      if (group.createdById) {
        try {
          const creator = await this.userRepository.findOne({
            where: { id: group.createdById },
            select: ['id', 'fullName', 'email', 'role']
          });
          if (creator) {
            (group as any).createdBy = creator;
          }
        } catch (error) {
          console.warn(`⚠️ [GroupsService.findAll] No se pudo obtener creador para grupo ${group.id}:`, error.message);
        }
      }
    }

    return result;
  }

  /**
   * Obtener un grupo por ID - RF-002
   */
  async findOne(id: string, user: User): Promise<Group> {
    console.log('🚨🚨🚨 [findOne] MÉTODO EJECUTÁNDOSE - Buscando grupo con ID:', id);
    
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: [
        'clinic',
        'weeks',
        'schedules',
        'schedules.activity',
        'schedules.subactivity',
        'groupPatients',
        'groupPatients.patient',
      ],
    });

    console.log('🔍 [findOne] Grupo encontrado:', {
      found: !!group,
      groupId: group?.id,
      groupCreatedById: group?.createdById,
      groupName: group?.groupName
    });

    if (!group) {
      throw new NotFoundException(`Grupo con ID ${id} no encontrado`);
    }

    // Verificar permisos
    this.checkAccess(group, user);

    // Agregar información del terapeuta creador
    if (group.createdById) {
      try {
        const creator = await this.userRepository.findOne({
          where: { id: group.createdById },
          select: ['id', 'fullName', 'email', 'role']
        });
        if (creator) {
          (group as any).createdBy = creator;
        }
      } catch (error) {
        console.warn(`⚠️ [GroupsService.findOne] No se pudo obtener creador para grupo ${group.id}:`, error.message);
      }
    }

    return group;
  }

  /**
   * Actualizar un grupo
   */
  async update(id: string, updateGroupDto: UpdateGroupDto, user: User): Promise<Group> {
    const group = await this.findOne(id, user);

    // Validaciones adicionales
    if (updateGroupDto.startDate && updateGroupDto.endDate) {
      if (updateGroupDto.startDate >= updateGroupDto.endDate) {
        throw new BadRequestException('La fecha de inicio debe ser anterior a la fecha de fin');
      }
    }

    try {
      // Actualizar solo los campos proporcionados
      const updateData: Partial<Group> = {};
      
      if (updateGroupDto.groupName !== undefined) {
        updateData.groupName = updateGroupDto.groupName;
      }
      if (updateGroupDto.programType !== undefined) {
        updateData.programType = updateGroupDto.programType;
      }
      if (updateGroupDto.shift !== undefined) {
        updateData.shift = updateGroupDto.shift;
      }
      if (updateGroupDto.startDate !== undefined) {
        updateData.startDate = updateGroupDto.startDate;
      }
      if (updateGroupDto.endDate !== undefined) {
        updateData.endDate = updateGroupDto.endDate;
      }
      if (updateGroupDto.isActive !== undefined) {
        updateData.isActive = updateGroupDto.isActive;
      }
      if (updateGroupDto.clinicId !== undefined) {
        updateData.clinicId = updateGroupDto.clinicId;
      }

      // Actualizar el grupo
      await this.groupRepository.update(id, updateData);

      // Procesar schedules si se envían
      if (updateGroupDto.schedules && updateGroupDto.schedules.length > 0) {
        // Validar schedules antes de procesarlos
        await this.validateSchedules(updateGroupDto.schedules);
        
        // Eliminar schedules existentes del grupo
        await this.groupScheduleRepository.delete({ groupId: id });
        
        // Crear nuevos schedules
        const newSchedules = updateGroupDto.schedules.map(schedule => 
          this.groupScheduleRepository.create({
            ...schedule,
            groupId: id,
            isNurseSession: schedule.isNurseSession || false,
          })
        );
        
        await this.groupScheduleRepository.save(newSchedules);
      }

      // Retornar el grupo actualizado con todas las relaciones
      return await this.findOne(id, user);
    } catch (error) {
      throw new BadRequestException('Error al actualizar el grupo: ' + error.message);
    }
  }

  /**
   * Desactivar un grupo (soft delete)
   */
  async remove(id: string, user: User): Promise<void> {
    const group = await this.findOne(id, user);
    group.isActive = false;
    await this.groupRepository.save(group);
  }

  // ==================== SEMANAS - RF-003 ====================

  /**
   * Crear una nueva semana para un grupo
   * Si la semana ya existe, la devuelve en lugar de lanzar error
   */
  async createWeek(createWeekDto: CreateGroupWeekDto, user: User): Promise<GroupWeek> {
    // Verificar que el grupo existe y el usuario tiene permisos
    await this.findOne(createWeekDto.groupId, user);

    // Verificar si ya existe una semana con ese número para este grupo
    const existingWeek = await this.groupWeekRepository.findOne({
      where: {
        groupId: createWeekDto.groupId,
        weekNumber: createWeekDto.weekNumber,
      },
    });

    // Si la semana ya existe, devolverla en lugar de lanzar error
    if (existingWeek) {
      // Usar console.log en lugar de logger si no está disponible
      console.log(
        `Semana ${createWeekDto.weekNumber} ya existe para el grupo ${createWeekDto.groupId}, devolviendo semana existente`,
      );
      return existingWeek;
    }

    try {
      const week = this.groupWeekRepository.create(createWeekDto);
      return await this.groupWeekRepository.save(week);
    } catch (error) {
      throw new BadRequestException('Error al crear la semana: ' + error.message);
    }
  }

  /**
   * Obtener todas las semanas de un grupo
   */
  async getWeeks(groupId: string, user: User): Promise<GroupWeek[]> {
    // Verificar permisos del grupo
    await this.findOne(groupId, user);

    return await this.groupWeekRepository.find({
      where: { groupId },
      relations: ['group', 'attendance'],
      order: { weekNumber: 'ASC' },
    });
  }

  /**
   * Obtener semana actual de un grupo - RF-003
   */
  async getCurrentWeek(groupId: string, user: User): Promise<GroupWeek | null> {
    // Verificar permisos del grupo
    await this.findOne(groupId, user);

    return await this.groupWeekRepository.findOne({
      where: { groupId, isCurrent: true },
      relations: ['group', 'attendance'],
    });
  }

  /**
   * Marcar una semana como actual
   */
  async setCurrentWeek(weekId: string, user: User): Promise<GroupWeek> {
    const week = await this.groupWeekRepository.findOne({
      where: { id: weekId },
      relations: ['group'],
    });

    if (!week) {
      throw new NotFoundException(`Semana con ID ${weekId} no encontrada`);
    }

    // Verificar permisos del grupo
    this.checkAccess(week.group, user);

    // Desmarcar todas las semanas del grupo
    await this.groupWeekRepository.update(
      { groupId: week.groupId },
      { isCurrent: false },
    );

    // Marcar esta semana como actual
    week.isCurrent = true;
    return await this.groupWeekRepository.save(week);
  }

  // ==================== HORARIOS - RF-001 ====================

  /**
   * Crear un horario para el grupo
   */
  async createSchedule(
    createScheduleDto: CreateGroupScheduleDto,
    user: User,
  ): Promise<GroupSchedule> {
    // Verificar que el grupo existe y el usuario tiene permisos
    await this.findOne(createScheduleDto.groupId, user);

    try {
      const schedule = this.groupScheduleRepository.create(createScheduleDto);
      return await this.groupScheduleRepository.save(schedule);
    } catch (error) {
      throw new BadRequestException('Error al crear el horario: ' + error.message);
    }
  }

  /**
   * Obtener todos los horarios de un grupo
   */
  async getSchedules(groupId: string, user: User): Promise<GroupSchedule[]> {
    // Verificar permisos del grupo
    await this.findOne(groupId, user);

    return await this.groupScheduleRepository.find({
      where: { groupId },
      relations: ['activity', 'subactivity'],
      order: {
        dayOfWeek: 'ASC',
        startTime: 'ASC',
      },
    });
  }

  /**
   * Eliminar un horario
   */
  async removeSchedule(scheduleId: string, user: User): Promise<void> {
    const schedule = await this.groupScheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['group'],
    });

    if (!schedule) {
      throw new NotFoundException(`Horario con ID ${scheduleId} no encontrado`);
    }

    // Verificar permisos del grupo
    this.checkAccess(schedule.group, user);

    await this.groupScheduleRepository.remove(schedule);
  }

  // ==================== PACIENTES EN GRUPOS ====================

  /**
   * Agregar un paciente a un grupo - RF-005
   */
  async addPatient(
    groupId: string,
    addPatientDto: AddPatientToGroupDto,
    user: User,
  ): Promise<GroupPatient> {
    // Verificar que el grupo existe y el usuario tiene permisos
    await this.findOne(groupId, user);

    // Verificar si el paciente ya está en el grupo
    const existing = await this.groupPatientRepository.findOne({
      where: {
        groupId,
        patientId: addPatientDto.patientId,
        isActive: true,
      },
    });

    if (existing) {
      throw new BadRequestException('El paciente ya está en este grupo');
    }

    try {
      const groupPatient = this.groupPatientRepository.create({
        groupId,
        ...addPatientDto,
      });
      return await this.groupPatientRepository.save(groupPatient);
    } catch (error) {
      throw new BadRequestException(
        'Error al agregar paciente al grupo: ' + error.message,
      );
    }
  }

  /**
   * Obtener todos los pacientes de un grupo
   */
  async getPatients(groupId: string, user: User): Promise<GroupPatient[]> {
    // Verificar permisos del grupo
    await this.findOne(groupId, user);

    return await this.groupPatientRepository.find({
      where: { groupId, isActive: true },
      relations: ['patient', 'patient.goals', 'patient.diagnoses'],
      order: { joinedDate: 'DESC' },
    });
  }

  /**
   * Remover un paciente de un grupo
   */
  async removePatient(groupId: string, patientId: string, user: User): Promise<void> {
    // Verificar permisos del grupo
    await this.findOne(groupId, user);

    const groupPatient = await this.groupPatientRepository.findOne({
      where: { groupId, patientId, isActive: true },
    });

    if (!groupPatient) {
      throw new NotFoundException('Paciente no encontrado en este grupo');
    }

    groupPatient.isActive = false;
    groupPatient.leftDate = new Date();
    await this.groupPatientRepository.save(groupPatient);
  }
}
