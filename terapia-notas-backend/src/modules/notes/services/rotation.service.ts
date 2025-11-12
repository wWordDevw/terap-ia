import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThanOrEqual } from 'typeorm';
import { PatientGoal } from '../../patients/entities/patient-goal.entity';
import { ActivityParagraph } from '../../activities/entities/activity-paragraph.entity';
import { ParagraphUsageHistory } from '../../activities/entities/paragraph-usage-history.entity';
import { GeneratedResponseHistory } from '../../activities/entities/generated-response-history.entity';
import { Subactivity } from '../../activities/entities/subactivity.entity';
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
    @InjectRepository(Subactivity)
    private readonly subactivityRepository: Repository<Subactivity>,
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
   * Rotación por grupo+subactivity: rota entre párrafos ordenados por paragraphOrder
   * @param subactivityId - ID de la subactivity (objetivo)
   * @param groupId - ID del grupo (opcional, para rotación por grupo)
   */
  async getNextParagraphForObjective(
    subactivityId: string,
    groupId?: string,
  ): Promise<ActivityParagraph | null> {
    try {
      // Si hay groupId, usar rotación por grupo+subactivity
      if (groupId) {
        return await this.getNextParagraphForSubactivityWithGroup(groupId, subactivityId);
      }

      // Fallback: usar lógica antigua (por usageCount)
      const paragraphs = await this.activityParagraphRepository.find({
        where: { subactivityId, isActive: true },
        order: { paragraphOrder: 'ASC', id: 'ASC' },
      });

      if (paragraphs.length === 0) {
        return null;
      }

      // Seleccionar el primer párrafo (menor paragraphOrder)
      return paragraphs[0];
    } catch (error) {
      this.logger.error(
        `Error getting next paragraph for subactivity ${subactivityId}: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * Obtiene el siguiente párrafo para una subactivity con rotación por grupo
   * Rota entre párrafos ordenados por paragraphOrder
   */
  private async getNextParagraphForSubactivityWithGroup(
    groupId: string,
    subactivityId: string,
  ): Promise<ActivityParagraph | null> {
    try {
      // Obtener todos los párrafos de la subactivity ordenados por paragraphOrder
      const paragraphs = await this.activityParagraphRepository.find({
        where: { subactivityId, isActive: true },
        order: { paragraphOrder: 'ASC', id: 'ASC' },
      });

      if (paragraphs.length === 0) {
        return null;
      }

      // Consultar último uso para este grupo+subactivity
      const lastUsage = await this.paragraphUsageHistoryRepository
        .createQueryBuilder('usage')
        .leftJoinAndSelect('usage.paragraph', 'paragraph')
        .where('usage.groupId = :groupId', { groupId })
        .andWhere('usage.subactivityId = :subactivityId', { subactivityId })
        .orderBy('usage.usedDate', 'DESC')
        .addOrderBy('usage.createdAt', 'DESC')
        .getOne();

      if (lastUsage && lastUsage.paragraph) {
        const lastParagraphOrder = lastUsage.paragraph.paragraphOrder ?? null;

        if (lastParagraphOrder !== null) {
          // Encontrar el índice del último párrafo usado
          const lastIndex = paragraphs.findIndex(
            (p) => (p.paragraphOrder ?? 999) === lastParagraphOrder,
          );

          if (lastIndex !== -1 && lastIndex < paragraphs.length - 1) {
            // Hay más párrafos, usar el siguiente
            const nextParagraph = paragraphs[lastIndex + 1];
            this.logger.log(
              `[ROTACIÓN] Grupo ${groupId.substring(0, 8)}..., Subactivity ${subactivityId.substring(0, 8)}...: usando siguiente párrafo (order: ${nextParagraph.paragraphOrder ?? 'null'})`,
            );
            return nextParagraph;
          }
        }
      }

      // Primera vez o se completaron todos los párrafos, usar el primero
      const firstParagraph = paragraphs[0];
      this.logger.log(
        `[ROTACIÓN] Grupo ${groupId.substring(0, 8)}..., Subactivity ${subactivityId.substring(0, 8)}...: usando primer párrafo (order: ${firstParagraph.paragraphOrder ?? 'null'})`,
      );
      return firstParagraph;
    } catch (error) {
      this.logger.error(
        `Error getting next paragraph for subactivity with group ${subactivityId}: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * Obtiene el siguiente objetivo (subactivity) y párrafo para una actividad
   * Rotación por grupo+actividad: primero rota entre objetivos (alfabético), luego entre párrafos
   * @param groupId - ID del grupo
   * @param activityId - ID de la actividad
   * @returns Párrafo con su subactivity incluida
   */
  async getNextSubactivityAndParagraphForActivity(
    groupId: string,
    activityId: string,
  ): Promise<(ActivityParagraph & { subactivity?: any }) | null> {
    try {
      // 1. Obtener todas las subactivities de la actividad ordenadas alfabéticamente
      const subactivities = await this.subactivityRepository.find({
        where: {
          activityId,
          isActive: true,
        },
        order: { subactivityName: 'ASC' },
      });

      if (subactivities.length === 0) {
        this.logger.warn(`No hay subactivities activas para actividad ${activityId}`);
        // Si no hay subactivities, buscar párrafos directamente asociados a la actividad
        return this.getNextParagraphForActivityWithoutSubactivities(activityId);
      }

      // 2. Consultar último uso en paragraph_usage_history para grupo+actividad
      const lastUsage = await this.paragraphUsageHistoryRepository
        .createQueryBuilder('usage')
        .leftJoinAndSelect('usage.paragraph', 'paragraph')
        .leftJoinAndSelect('paragraph.subactivity', 'subactivity')
        .where('usage.groupId = :groupId', { groupId })
        .andWhere('paragraph.activityId = :activityId', { activityId })
        .orderBy('usage.usedDate', 'DESC')
        .addOrderBy('usage.createdAt', 'DESC')
        .getOne();

      let lastUsedSubactivityId: string | null = null;
      let lastUsedParagraphOrder: number | null = null;

      if (lastUsage && lastUsage.subactivityId) {
        lastUsedSubactivityId = lastUsage.subactivityId;
        if (lastUsage.paragraph?.paragraphOrder !== null && lastUsage.paragraph?.paragraphOrder !== undefined) {
          lastUsedParagraphOrder = lastUsage.paragraph.paragraphOrder;
        }
      }

      // 3. Determinar siguiente objetivo a usar
      let nextSubactivityIndex = 0;
      let nextParagraphOrder: number | null = null; // null = usar el primero disponible

      if (lastUsedSubactivityId) {
        // Encontrar el índice del último objetivo usado
        const lastSubactivityIndex = subactivities.findIndex(
          (sub) => sub.id === lastUsedSubactivityId,
        );

        if (lastSubactivityIndex !== -1) {
          // Obtener todos los párrafos del último objetivo usado, ordenados por paragraphOrder
          const lastSubactivityParagraphs = await this.activityParagraphRepository.find({
            where: {
              subactivityId: lastUsedSubactivityId,
              isActive: true,
            },
            order: {
              paragraphOrder: 'ASC',
              id: 'ASC',
            },
          });

          // Determinar si hay más párrafos en el mismo objetivo
          if (
            lastUsedParagraphOrder !== null &&
            lastSubactivityParagraphs.length > 0
          ) {
            // Encontrar el índice del último párrafo usado
            const lastParagraphIndex = lastSubactivityParagraphs.findIndex(
              (p) => (p.paragraphOrder ?? 999) === lastUsedParagraphOrder,
            );

            if (
              lastParagraphIndex !== -1 &&
              lastParagraphIndex < lastSubactivityParagraphs.length - 1
            ) {
              // Hay más párrafos en el mismo objetivo
              nextSubactivityIndex = lastSubactivityIndex;
              const nextParagraph = lastSubactivityParagraphs[lastParagraphIndex + 1];
              nextParagraphOrder = nextParagraph.paragraphOrder ?? null;
              this.logger.debug(
                `Continuando con mismo objetivo "${subactivities[nextSubactivityIndex].subactivityName}", siguiente párrafo (order: ${nextParagraphOrder ?? 'null'})`,
              );
            } else {
              // No hay más párrafos en este objetivo, pasar al siguiente objetivo
              nextSubactivityIndex = (lastSubactivityIndex + 1) % subactivities.length;
              nextParagraphOrder = null; // Usar el primer párrafo del nuevo objetivo
              this.logger.debug(
                `Avanzando al siguiente objetivo: "${subactivities[nextSubactivityIndex].subactivityName}"`,
              );
            }
          } else {
            // No hay información de paragraphOrder, pasar al siguiente objetivo
            nextSubactivityIndex = (lastSubactivityIndex + 1) % subactivities.length;
            nextParagraphOrder = null;
          }
        } else {
          // El último objetivo usado ya no existe, empezar desde el primero
          this.logger.debug(
            `Último objetivo usado (${lastUsedSubactivityId}) ya no existe, empezando desde el primero`,
          );
          nextSubactivityIndex = 0;
          nextParagraphOrder = null;
        }
      } else {
        // Primera vez que se usa esta actividad para este grupo
        this.logger.debug(
          `Primera vez usando actividad ${activityId} para grupo ${groupId}, usando primer objetivo`,
        );
        nextSubactivityIndex = 0;
        nextParagraphOrder = null;
      }

      // 4. Obtener el siguiente párrafo del objetivo seleccionado
      const selectedSubactivity = subactivities[nextSubactivityIndex];
      const paragraphs = await this.activityParagraphRepository
        .createQueryBuilder('paragraph')
        .leftJoinAndSelect('paragraph.subactivity', 'subactivity')
        .where('paragraph.subactivityId = :subactivityId', {
          subactivityId: selectedSubactivity.id,
        })
        .andWhere('paragraph.isActive = :isActive', { isActive: true })
        .orderBy('COALESCE(paragraph.paragraphOrder, 999)', 'ASC')
        .addOrderBy('paragraph.id', 'ASC')
        .getMany();

      if (paragraphs.length === 0) {
        this.logger.warn(
          `No hay párrafos para subactivity ${selectedSubactivity.subactivityName}`,
        );
        return null;
      }

      // Buscar el párrafo según el orden deseado
      let selectedParagraph: ActivityParagraph;

      if (nextParagraphOrder !== null) {
        // Buscar el párrafo con el paragraphOrder específico
        const foundParagraph = paragraphs.find(
          (p) => p.paragraphOrder === nextParagraphOrder,
        );
        
        if (foundParagraph) {
          selectedParagraph = foundParagraph;
        } else {
          // Si no se encuentra exacto, buscar el siguiente párrafo con order mayor
          const nextParagraph = paragraphs.find(
            (p) => (p.paragraphOrder ?? 999) > nextParagraphOrder,
          );
          selectedParagraph = nextParagraph || paragraphs[0];
          this.logger.debug(
            `No se encontró párrafo con order ${nextParagraphOrder}, usando ${selectedParagraph === nextParagraph ? 'siguiente' : 'primero'} disponible (order: ${selectedParagraph.paragraphOrder ?? 'null'})`,
          );
        }
      } else {
        // Usar el primer párrafo disponible (menor paragraphOrder)
        selectedParagraph = paragraphs[0];
        this.logger.debug(
          `Usando primer párrafo disponible (order: ${selectedParagraph.paragraphOrder ?? 'null'})`,
        );
      }

      this.logger.log(
        `[ROTACIÓN] Grupo ${groupId.substring(0, 8)}..., Actividad ${activityId.substring(0, 8)}...: Objetivo "${selectedSubactivity.subactivityName}" (order: ${selectedParagraph.paragraphOrder ?? 'null'})`,
      );

      return selectedParagraph as any;
    } catch (error) {
      this.logger.error(
        `Error getting next subactivity and paragraph for activity ${activityId}: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * Obtiene el siguiente párrafo para una actividad sin subactivities
   * (fallback cuando no hay subactivities configuradas)
   */
  private async getNextParagraphForActivityWithoutSubactivities(
    activityId: string,
  ): Promise<ActivityParagraph | null> {
    try {
      const paragraphs = await this.activityParagraphRepository.find({
        where: {
          activityId,
          subactivityId: IsNull(),
          isActive: true,
        },
        order: { paragraphOrder: 'ASC', id: 'ASC' },
      });

      if (paragraphs.length === 0) {
        return null;
      }

      return paragraphs[0];
    } catch (error) {
      this.logger.error(
        `Error getting paragraph for activity without subactivities ${activityId}: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * Obtiene el siguiente párrafo para una actividad (cuando no hay subactivity configurada)
   * Ahora usa la rotación correcta por grupo+actividad
   * @param activityId - ID de la actividad
   * @param groupId - ID del grupo (requerido para rotación correcta)
   */
  async getNextParagraphForActivity(
    activityId: string,
    groupId?: string,
  ): Promise<ActivityParagraph & { subactivity?: any } | null> {
    try {
      // Si hay groupId, usar la nueva lógica de rotación
      if (groupId) {
        return await this.getNextSubactivityAndParagraphForActivity(groupId, activityId);
      }

      // Fallback: si no hay groupId, usar la lógica antigua (para compatibilidad)
      this.logger.warn(
        `getNextParagraphForActivity llamado sin groupId, usando fallback. ActivityId: ${activityId}`,
      );
      return await this.getNextParagraphForActivityWithoutSubactivities(activityId);
    } catch (error) {
      this.logger.error(`Error getting next paragraph for activity ${activityId}: ${error.message}`);
      return null;
    }
  }

  /**
   * Registra el uso de un objetivo y párrafo
   * IMPORTANTE: Debe incluir groupId y activityId para tracking correcto de rotación
   */
  async registerUsage(
    patientId: string,
    goalId: string,
    paragraphId: string,
    subactivityId: string,
    responseText: string,
    groupId?: string,
    activityId?: string,
    weekId?: string,
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

      // Obtener el párrafo para obtener activityId si no se proporciona
      let finalActivityId = activityId;
      if (!finalActivityId && paragraphId) {
        const paragraph = await this.activityParagraphRepository.findOne({
          where: { id: paragraphId },
        });
        if (paragraph) {
          finalActivityId = paragraph.activityId;
        }
      }

      // Registrar uso del párrafo con groupId y activityId para tracking
      const usageData: any = {
        patientId,
        paragraphId,
        subactivityId: subactivityId || null,
        usedDate: new Date(),
      };

      // Agregar groupId y weekId solo si están disponibles
      if (groupId) {
        usageData.groupId = groupId;
      }
      if (weekId) {
        usageData.weekId = weekId;
      }

      await this.paragraphUsageHistoryRepository.save(usageData);

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

      this.logger.log(
        `Registered usage for patient ${patientId}, goal ${goalId}, paragraph ${paragraphId}, group ${groupId || 'N/A'}, activity ${finalActivityId || 'N/A'}`,
      );
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