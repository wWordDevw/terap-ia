import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { Subactivity } from './entities/subactivity.entity';
import { ActivityParagraph } from './entities/activity-paragraph.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CreateSubactivityDto } from './dto/create-subactivity.dto';
import { CreateParagraphDto } from './dto/create-paragraph.dto';

/**
 * Servicio de Actividades
 * Maneja la lógica de negocio para actividades, subactividades y párrafos
 */
@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Subactivity)
    private readonly subactivityRepository: Repository<Subactivity>,
    @InjectRepository(ActivityParagraph)
    private readonly paragraphRepository: Repository<ActivityParagraph>,
  ) {}

  // ==================== ACTIVIDADES ====================

  /**
   * Crear una nueva actividad
   */
  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    try {
      const activity = this.activityRepository.create(createActivityDto);
      return await this.activityRepository.save(activity);
    } catch (error) {
      throw new BadRequestException(
        'Error al crear la actividad: ' + error.message,
      );
    }
  }

  /**
   * Obtener todas las actividades
   * @param includeInactive - Incluir actividades inactivas
   * @param activityType - Filtrar por tipo de actividad (PHP o IOP)
   */
  async findAll(
    includeInactive = false,
    activityType?: string,
  ): Promise<Activity[]> {
    const query = this.activityRepository
      .createQueryBuilder('activity')
      .leftJoinAndSelect('activity.subactivities', 'subactivities')
      .leftJoinAndSelect('activity.paragraphs', 'paragraphs');

    const conditions: string[] = [];
    const params: Record<string, any> = {};

    if (!includeInactive) {
      conditions.push('activity.isActive = :isActive');
      params.isActive = true;
    }

    if (activityType && (activityType === 'PHP' || activityType === 'IOP')) {
      conditions.push('activity.activityType = :activityType');
      params.activityType = activityType;
    }

    if (conditions.length > 0) {
      query.where(conditions.join(' AND '), params);
    }

    return await query.orderBy('activity.activityName', 'ASC').getMany();
  }

  /**
   * Obtener todas las actividades sin subactividades ni párrafos
   * @param includeInactive - Incluir actividades inactivas
   * @param activityType - Filtrar por tipo de actividad (PHP o IOP)
   */
  async findAllBasic(
    includeInactive = false,
    activityType?: string,
  ): Promise<Activity[]> {
    const query = this.activityRepository.createQueryBuilder('activity');

    const conditions: string[] = [];
    const params: Record<string, any> = {};

    if (!includeInactive) {
      conditions.push('activity.isActive = :isActive');
      params.isActive = true;
    }

    if (activityType && (activityType === 'PHP' || activityType === 'IOP')) {
      conditions.push('activity.activityType = :activityType');
      params.activityType = activityType;
    }

    if (conditions.length > 0) {
      query.where(conditions.join(' AND '), params);
    }

    return await query.orderBy('activity.activityName', 'ASC').getMany();
  }

  /**
   * Obtener una actividad por ID
   */
  async findOne(id: string): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id },
      relations: ['subactivities', 'paragraphs'],
    });

    if (!activity) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }

    return activity;
  }

  /**
   * Actualizar una actividad
   */
  async update(
    id: string,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    const activity = await this.findOne(id);

    try {
      Object.assign(activity, updateActivityDto);
      return await this.activityRepository.save(activity);
    } catch (error) {
      throw new BadRequestException(
        'Error al actualizar la actividad: ' + error.message,
      );
    }
  }

  /**
   * Desactivar una actividad (soft delete)
   */
  async remove(id: string): Promise<void> {
    const activity = await this.findOne(id);
    activity.isActive = false;
    await this.activityRepository.save(activity);
  }

  // ==================== SUBACTIVIDADES ====================

  /**
   * Crear una subactividad
   */
  async createSubactivity(
    createSubactivityDto: CreateSubactivityDto,
  ): Promise<Subactivity> {
    // Verificar que activityId está presente
    if (!createSubactivityDto.activityId) {
      throw new BadRequestException('activityId es requerido');
    }

    // Verificar que la actividad existe
    await this.findOne(createSubactivityDto.activityId);

    try {
      const subactivity = this.subactivityRepository.create(createSubactivityDto);
      return await this.subactivityRepository.save(subactivity);
    } catch (error) {
      throw new BadRequestException(
        'Error al crear la subactividad: ' + error.message,
      );
    }
  }

  /**
   * Obtener todas las subactividades de una actividad
   */
  async getSubactivities(activityId: string): Promise<Subactivity[]> {
    return await this.subactivityRepository.find({
      where: { activityId, isActive: true },
      relations: ['activity'],
      order: { subactivityName: 'ASC' },
    });
  }

  /**
   * Eliminar una subactividad
   */
  async removeSubactivity(subactivityId: string): Promise<void> {
    const subactivity = await this.subactivityRepository.findOne({
      where: { id: subactivityId },
    });

    if (!subactivity) {
      throw new NotFoundException(
        `Subactividad con ID ${subactivityId} no encontrada`,
      );
    }

    subactivity.isActive = false;
    await this.subactivityRepository.save(subactivity);
  }

  // ==================== PÁRRAFOS - RF-015, RF-034 ====================

  /**
   * Crear un párrafo predefinido
   */
  async createParagraph(
    createParagraphDto: CreateParagraphDto,
  ): Promise<ActivityParagraph> {
    // Verificar que activityId está presente
    if (!createParagraphDto.activityId) {
      throw new BadRequestException('activityId es requerido');
    }

    // Verificar que la actividad existe
    await this.findOne(createParagraphDto.activityId);

    // Si hay subactividad, verificar que existe
    if (createParagraphDto.subactivityId) {
      const subactivity = await this.subactivityRepository.findOne({
        where: { id: createParagraphDto.subactivityId },
      });

      if (!subactivity) {
        throw new NotFoundException('Subactividad no encontrada');
      }
    }

    try {
      const paragraph = this.paragraphRepository.create(createParagraphDto);
      return await this.paragraphRepository.save(paragraph);
    } catch (error) {
      throw new BadRequestException(
        'Error al crear el párrafo: ' + error.message,
      );
    }
  }

  /**
   * Obtener todos los párrafos de una actividad
   */
  async getParagraphs(
    activityId: string,
    subactivityId?: string,
  ): Promise<ActivityParagraph[]> {
    const query = this.paragraphRepository
      .createQueryBuilder('paragraph')
      .where('paragraph.activityId = :activityId', { activityId })
      .andWhere('paragraph.isActive = :isActive', { isActive: true });

    if (subactivityId) {
      query.andWhere('paragraph.subactivityId = :subactivityId', {
        subactivityId,
      });
    }

    return await query
      .orderBy('paragraph.usageCount', 'ASC')
      .addOrderBy('paragraph.paragraphOrder', 'ASC')
      .getMany();
  }

  /**
   * Obtener próximo párrafo no usado para rotación - RF-034
   * Retorna el párrafo menos usado
   */
  async getNextParagraph(
    activityId: string,
    subactivityId?: string,
  ): Promise<ActivityParagraph | null> {
    const paragraphs = await this.getParagraphs(activityId, subactivityId);

    if (paragraphs.length === 0) {
      return null;
    }

    // Retornar el primero (ya ordenado por usageCount ASC)
    return paragraphs[0];
  }

  /**
   * Incrementar contador de uso de un párrafo
   * Se llama cuando se usa el párrafo en una nota
   */
  async incrementParagraphUsage(paragraphId: string): Promise<void> {
    const paragraph = await this.paragraphRepository.findOne({
      where: { id: paragraphId },
    });

    if (paragraph) {
      paragraph.usageCount += 1;
      await this.paragraphRepository.save(paragraph);
    }
  }

  /**
   * Resetear contadores de uso de párrafos
   * Útil cuando se termina un ciclo de rotación
   */
  async resetParagraphUsage(activityId: string): Promise<void> {
    await this.paragraphRepository.update(
      { activityId },
      { usageCount: 0 },
    );
  }

  /**
   * Eliminar un párrafo
   */
  async removeParagraph(paragraphId: string): Promise<void> {
    const paragraph = await this.paragraphRepository.findOne({
      where: { id: paragraphId },
    });

    if (!paragraph) {
      throw new NotFoundException(`Párrafo con ID ${paragraphId} no encontrado`);
    }

    paragraph.isActive = false;
    await this.paragraphRepository.save(paragraph);
  }
}
