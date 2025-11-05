import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { PatientGoal } from '../../patients/entities/patient-goal.entity';
import { ActivityParagraph } from '../../activities/entities/activity-paragraph.entity';
import { ParagraphUsageHistory } from '../../activities/entities/paragraph-usage-history.entity';
import { GeneratedResponseHistory } from '../../activities/entities/generated-response-history.entity';
import { createHash } from 'crypto';

@Injectable()
export class RotationService {
  private readonly logger = new Logger(RotationService.name);

  constructor(
    @InjectRepository(PatientGoal)
    private readonly patientGoalRepository: Repository<PatientGoal>,
    @InjectRepository(ActivityParagraph)
    private readonly activityParagraphRepository: Repository<ActivityParagraph>,
    @InjectRepository(ParagraphUsageHistory)
    private readonly paragraphUsageHistoryRepository: Repository<ParagraphUsageHistory>,
    @InjectRepository(GeneratedResponseHistory)
    private readonly generatedResponseHistoryRepository: Repository<GeneratedResponseHistory>,
  ) {}

  /**
   * Obtiene el siguiente objetivo para un paciente
   */
  async getNextObjectiveForPatient(patientId: string): Promise<PatientGoal | null> {
    try {
      const goals = await this.patientGoalRepository.find({
        where: { patientId },
        order: { goalNumber: 'ASC' },
      });

      if (goals.length === 0) {
        return null;
      }

      // Encontrar el objetivo con menor uso
      let minUsage = Infinity;
      let selectedGoal = goals[0];

      for (const goal of goals) {
        const usageCount = await this.getGoalUsageCount(goal.id);
        if (usageCount < minUsage) {
          minUsage = usageCount;
          selectedGoal = goal;
        }
      }

      return selectedGoal;
    } catch (error) {
      this.logger.error(`Error getting next objective for patient ${patientId}: ${error.message}`);
      return null;
    }
  }

  /**
   * Obtiene el siguiente párrafo para un objetivo (subactivity)
   */
  async getNextParagraphForObjective(subactivityId: string): Promise<ActivityParagraph | null> {
    try {
      const paragraphs = await this.activityParagraphRepository.find({
        where: { subactivityId },
        order: { usageCount: 'ASC', id: 'ASC' },
      });

      if (paragraphs.length === 0) {
        return null;
      }

      // Seleccionar el párrafo con menor uso
      return paragraphs[0];
    } catch (error) {
      this.logger.error(`Error getting next paragraph for subactivity ${subactivityId}: ${error.message}`);
      return null;
    }
  }

  /**
   * Obtiene el siguiente párrafo para una actividad (cuando no hay subactivity configurada)
   * Primero busca párrafos directamente asociados a la actividad.
   * Si no encuentra, busca párrafos de subactivities que pertenezcan a la actividad.
   * Retorna el párrafo con la información de la subactivity incluida.
   * @param activityId - ID de la actividad
   * @param scheduleIndex - Índice del schedule (0-3) para rotar entre párrafos y evitar duplicados
   */
  async getNextParagraphForActivity(activityId: string, scheduleIndex?: number): Promise<ActivityParagraph & { subactivity?: any } | null> {
    try {
      // Primero: Buscar párrafos asociados directamente a la actividad (sin subactivity)
      let paragraphs = await this.activityParagraphRepository.find({
        where: { 
          activityId,
          subactivityId: IsNull(), // Solo párrafos sin subactivity
        },
        order: { usageCount: 'ASC', id: 'ASC' },
      });

      // Si no hay párrafos directamente asociados a la actividad,
      // buscar párrafos de subactivities que pertenezcan a la actividad
      if (paragraphs.length === 0) {
        this.logger.debug(`No hay párrafos directos para actividad ${activityId}, buscando en subactivities...`);
        
        paragraphs = await this.activityParagraphRepository
          .createQueryBuilder('paragraph')
          .leftJoinAndSelect('paragraph.subactivity', 'subactivity')
          .where('paragraph.activityId = :activityId', { activityId })
          .andWhere('paragraph.subactivityId IS NOT NULL')
          .andWhere('subactivity.activityId = :activityId', { activityId })
          .andWhere('paragraph.isActive = :isActive', { isActive: true })
          .orderBy('paragraph.usageCount', 'ASC')
          .addOrderBy('paragraph.id', 'ASC')
          .getMany();
        
        if (paragraphs.length > 0) {
          this.logger.debug(`Encontrados ${paragraphs.length} párrafos de subactivities para actividad ${activityId}`);
          // IMPORTANTE: Rotar entre párrafos usando el índice del schedule para evitar duplicados
          // Si no hay scheduleIndex, usar el primero (menos usado)
          const index = scheduleIndex !== undefined ? scheduleIndex % paragraphs.length : 0;
          const selectedParagraph = paragraphs[index] as any;
          if (selectedParagraph.subactivity) {
            this.logger.debug(`Párrafo obtenido de subactivity: ${selectedParagraph.subactivity.subactivityName} (índice: ${index}/${paragraphs.length}, usage_count: ${selectedParagraph.usageCount})`);
          }
          return selectedParagraph;
        }
      }

      if (paragraphs.length === 0) {
        return null;
      }

      // IMPORTANTE: Rotar entre párrafos usando el índice del schedule para evitar duplicados
      const index = scheduleIndex !== undefined ? scheduleIndex % paragraphs.length : 0;
      const selectedParagraph = paragraphs[index] as any;
      this.logger.debug(`Párrafo obtenido directamente de actividad (índice: ${index}/${paragraphs.length})`);
      return selectedParagraph;
    } catch (error) {
      this.logger.error(`Error getting next paragraph for activity ${activityId}: ${error.message}`);
      return null;
    }
  }

  /**
   * Registra el uso de un objetivo y párrafo
   */
  async registerUsage(
    patientId: string,
    goalId: string,
    paragraphId: string,
    subactivityId: string,
    responseText: string,
  ): Promise<void> {
    try {
      // Crear hash de la respuesta para evitar duplicados
      const responseHash = createHash('md5').update(responseText).digest('hex');

      // Verificar si ya existe esta respuesta
      const existingResponse = await this.generatedResponseHistoryRepository.findOne({
        where: { responseHash },
      });

      if (existingResponse) {
        this.logger.warn(`Duplicate response detected for patient ${patientId}`);
        return;
      }

      // Registrar uso del párrafo
      await this.paragraphUsageHistoryRepository.save({
        patientId,
        paragraphId,
        subactivityId,
        usedDate: new Date(),
      });

      // Incrementar contador de uso del párrafo
      await this.activityParagraphRepository.increment(
        { id: paragraphId },
        'usageCount',
        1,
      );

      // Registrar hash de la respuesta generada
      await this.generatedResponseHistoryRepository.save({
        patientId,
        responseText,
        responseHash,
        usedDate: new Date(),
      });

      this.logger.log(`Registered usage for patient ${patientId}, goal ${goalId}, paragraph ${paragraphId}`);
    } catch (error) {
      this.logger.error(`Error registering usage: ${error.message}`);
    }
  }

  /**
   * Obtiene el conteo de uso de un objetivo
   */
  private async getGoalUsageCount(goalId: string): Promise<number> {
    try {
      // Por ahora, devolver 0 ya que no tenemos una relación directa entre goalId y paragraph usage
      // En el futuro, esto podría implementarse con una tabla de relación
      return 0;
    } catch (error) {
      this.logger.error(`Error getting goal usage count: ${error.message}`);
      return 0;
    }
  }
}