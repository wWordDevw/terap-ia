import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RotationService } from './rotation.service';
import { PatientGoal } from '../../patients/entities/patient-goal.entity';
import { ActivityParagraph } from '../../activities/entities/activity-paragraph.entity';
import { ParagraphUsageHistory } from '../../activities/entities/paragraph-usage-history.entity';
import { GeneratedResponseHistory } from '../../activities/entities/generated-response-history.entity';
import { Subactivity } from '../../activities/entities/subactivity.entity';

describe('RotationService', () => {
  let service: RotationService;
  let patientGoalRepository: Repository<PatientGoal>;
  let activityParagraphRepository: Repository<ActivityParagraph>;
  let paragraphUsageHistoryRepository: Repository<ParagraphUsageHistory>;
  let generatedResponseHistoryRepository: Repository<GeneratedResponseHistory>;
  let subactivityRepository: Repository<Subactivity>;

  // Mock data
  const mockGroupId = 'group-123';
  const mockSubactivityId = 'subactivity-456';
  const mockActivityId = 'activity-789';
  const mockPatientId = 'patient-001';
  const mockGoalId = 'goal-001';
  const mockWeekId = 'week-001';

  const mockParagraph1: Partial<ActivityParagraph> = {
    id: 'para-1',
    paragraphText: 'First paragraph text',
    paragraphOrder: 1,
    usageCount: 0,
    isActive: true,
    subactivityId: mockSubactivityId,
    activityId: mockActivityId,
  };

  const mockParagraph2: Partial<ActivityParagraph> = {
    id: 'para-2',
    paragraphText: 'Second paragraph text',
    paragraphOrder: 2,
    usageCount: 0,
    isActive: true,
    subactivityId: mockSubactivityId,
    activityId: mockActivityId,
  };

  const mockParagraph3: Partial<ActivityParagraph> = {
    id: 'para-3',
    paragraphText: 'Third paragraph text',
    paragraphOrder: 3,
    usageCount: 0,
    isActive: true,
    subactivityId: mockSubactivityId,
    activityId: mockActivityId,
  };

  const mockSubactivity1: Partial<Subactivity> = {
    id: 'sub-1',
    subactivityName: 'Alpha Subactivity', // Alfabéticamente primero
    activityId: mockActivityId,
    isActive: true,
  };

  const mockSubactivity2: Partial<Subactivity> = {
    id: 'sub-2',
    subactivityName: 'Beta Subactivity', // Alfabéticamente segundo
    activityId: mockActivityId,
    isActive: true,
  };

  const mockSubactivity3: Partial<Subactivity> = {
    id: 'sub-3',
    subactivityName: 'Gamma Subactivity', // Alfabéticamente tercero
    activityId: mockActivityId,
    isActive: true,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RotationService,
        {
          provide: getRepositoryToken(PatientGoal),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ActivityParagraph),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            increment: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ParagraphUsageHistory),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(GeneratedResponseHistory),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Subactivity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RotationService>(RotationService);
    patientGoalRepository = module.get(getRepositoryToken(PatientGoal));
    activityParagraphRepository = module.get(getRepositoryToken(ActivityParagraph));
    paragraphUsageHistoryRepository = module.get(getRepositoryToken(ParagraphUsageHistory));
    generatedResponseHistoryRepository = module.get(getRepositoryToken(GeneratedResponseHistory));
    subactivityRepository = module.get(getRepositoryToken(Subactivity));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNextParagraphForObjective', () => {
    describe('con groupId (rotación por grupo)', () => {
      it('debe retornar el primer párrafo cuando no hay historial de uso', async () => {
        // Mock: 3 párrafos ordenados
        const mockQueryBuilder = {
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(null), // Sin historial
        };

        jest.spyOn(paragraphUsageHistoryRepository, 'createQueryBuilder')
          .mockReturnValue(mockQueryBuilder as any);

        jest.spyOn(activityParagraphRepository, 'find')
          .mockResolvedValue([mockParagraph1, mockParagraph2, mockParagraph3] as ActivityParagraph[]);

        const result = await service.getNextParagraphForObjective(mockSubactivityId, mockGroupId);

        expect(result).toEqual(mockParagraph1);
        expect(paragraphUsageHistoryRepository.createQueryBuilder).toHaveBeenCalled();
      });

      it('debe retornar el segundo párrafo cuando el primero fue usado', async () => {
        // Mock: Último uso fue el párrafo 1
        const mockLastUsage = {
          paragraphId: 'para-1',
          paragraph: mockParagraph1,
          usedDate: new Date(),
        };

        const mockQueryBuilder = {
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(mockLastUsage),
        };

        jest.spyOn(paragraphUsageHistoryRepository, 'createQueryBuilder')
          .mockReturnValue(mockQueryBuilder as any);

        jest.spyOn(activityParagraphRepository, 'find')
          .mockResolvedValue([mockParagraph1, mockParagraph2, mockParagraph3] as ActivityParagraph[]);

        const result = await service.getNextParagraphForObjective(mockSubactivityId, mockGroupId);

        expect(result).toEqual(mockParagraph2);
      });

      it('debe reiniciar el ciclo cuando se usó el último párrafo', async () => {
        // Mock: Último uso fue el párrafo 3 (último)
        const mockLastUsage = {
          paragraphId: 'para-3',
          paragraph: mockParagraph3,
          usedDate: new Date(),
        };

        const mockQueryBuilder = {
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(mockLastUsage),
        };

        jest.spyOn(paragraphUsageHistoryRepository, 'createQueryBuilder')
          .mockReturnValue(mockQueryBuilder as any);

        jest.spyOn(activityParagraphRepository, 'find')
          .mockResolvedValue([mockParagraph1, mockParagraph2, mockParagraph3] as ActivityParagraph[]);

        const result = await service.getNextParagraphForObjective(mockSubactivityId, mockGroupId);

        // Debe volver al primer párrafo
        expect(result).toEqual(mockParagraph1);
      });

      it('debe retornar null cuando no hay párrafos disponibles', async () => {
        const mockQueryBuilder = {
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(null),
        };

        jest.spyOn(paragraphUsageHistoryRepository, 'createQueryBuilder')
          .mockReturnValue(mockQueryBuilder as any);

        jest.spyOn(activityParagraphRepository, 'find')
          .mockResolvedValue([]);

        const result = await service.getNextParagraphForObjective(mockSubactivityId, mockGroupId);

        expect(result).toBeNull();
      });

      it('debe ordenar párrafos por paragraphOrder ASC', async () => {
        const mockQueryBuilder = {
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValue(null),
        };

        jest.spyOn(paragraphUsageHistoryRepository, 'createQueryBuilder')
          .mockReturnValue(mockQueryBuilder as any);

        const findSpy = jest.spyOn(activityParagraphRepository, 'find')
          .mockResolvedValue([mockParagraph1] as ActivityParagraph[]);

        await service.getNextParagraphForObjective(mockSubactivityId, mockGroupId);

        expect(findSpy).toHaveBeenCalledWith({
          where: { subactivityId: mockSubactivityId, isActive: true },
          order: { paragraphOrder: 'ASC', id: 'ASC' },
        });
      });
    });

    describe('sin groupId (fallback a lógica antigua)', () => {
      it('debe retornar el primer párrafo cuando no hay groupId', async () => {
        jest.spyOn(activityParagraphRepository, 'find')
          .mockResolvedValue([mockParagraph1, mockParagraph2] as ActivityParagraph[]);

        const result = await service.getNextParagraphForObjective(mockSubactivityId);

        expect(result).toEqual(mockParagraph1);
      });
    });
  });

  describe('getNextSubactivityAndParagraphForActivity', () => {
    it('debe retornar primera subactivity y primer párrafo cuando no hay historial', async () => {
      // Mock: 3 subactivities ordenadas alfabéticamente
      jest.spyOn(subactivityRepository, 'find')
        .mockResolvedValue([mockSubactivity1, mockSubactivity2, mockSubactivity3] as Subactivity[]);

      // Mock: Párrafos de la primera subactivity
      jest.spyOn(activityParagraphRepository, 'find')
        .mockResolvedValue([mockParagraph1, mockParagraph2] as ActivityParagraph[]);

      // Mock: Sin historial
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      jest.spyOn(paragraphUsageHistoryRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getNextSubactivityAndParagraphForActivity(mockGroupId, mockActivityId);

      expect(result.subactivity).toEqual(mockSubactivity1);
      expect(result.paragraph).toEqual(mockParagraph1);
    });

    it('debe avanzar al siguiente párrafo dentro de la misma subactivity', async () => {
      // Mock: Subactivities
      jest.spyOn(subactivityRepository, 'find')
        .mockResolvedValue([mockSubactivity1, mockSubactivity2] as Subactivity[]);

      // Mock: Párrafos de la subactivity 1
      const para1Sub1 = { ...mockParagraph1, id: 'para-1-sub1', paragraphOrder: 1, subactivityId: 'sub-1' };
      const para2Sub1 = { ...mockParagraph2, id: 'para-2-sub1', paragraphOrder: 2, subactivityId: 'sub-1' };

      jest.spyOn(activityParagraphRepository, 'find')
        .mockResolvedValue([para1Sub1, para2Sub1] as ActivityParagraph[]);

      // Mock: Último uso fue para-1-sub1 (primer párrafo de subactivity 1)
      const mockLastUsage = {
        paragraphId: 'para-1-sub1',
        paragraph: { ...para1Sub1, subactivity: mockSubactivity1 },
        usedDate: new Date(),
      };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockLastUsage),
      };

      jest.spyOn(paragraphUsageHistoryRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getNextSubactivityAndParagraphForActivity(mockGroupId, mockActivityId);

      // Debe continuar en subactivity 1, pero con el segundo párrafo
      expect(result.subactivity.id).toBe('sub-1');
      expect(result.paragraph).toEqual(para2Sub1);
    });

    it('debe avanzar a la siguiente subactivity cuando se completan todos los párrafos', async () => {
      // Mock: Subactivities ordenadas alfabéticamente
      jest.spyOn(subactivityRepository, 'find')
        .mockResolvedValueOnce([mockSubactivity1, mockSubactivity2] as Subactivity[])
        .mockResolvedValueOnce([mockSubactivity1, mockSubactivity2] as Subactivity[]);

      // Mock: Párrafos de subactivity 1 (solo 1 párrafo)
      const para1Sub1 = { ...mockParagraph1, id: 'para-1-sub1', paragraphOrder: 1, subactivityId: 'sub-1' };

      // Mock: Párrafos de subactivity 2
      const para1Sub2 = { ...mockParagraph1, id: 'para-1-sub2', paragraphOrder: 1, subactivityId: 'sub-2' };

      // Primera llamada: párrafos de sub-1
      // Segunda llamada: párrafos de sub-2
      jest.spyOn(activityParagraphRepository, 'find')
        .mockResolvedValueOnce([para1Sub1] as ActivityParagraph[])
        .mockResolvedValueOnce([para1Sub2] as ActivityParagraph[]);

      // Mock: Último uso fue el último párrafo de subactivity 1
      const mockLastUsage = {
        paragraphId: 'para-1-sub1',
        paragraph: { ...para1Sub1, subactivity: mockSubactivity1 },
        usedDate: new Date(),
      };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockLastUsage),
      };

      jest.spyOn(paragraphUsageHistoryRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getNextSubactivityAndParagraphForActivity(mockGroupId, mockActivityId);

      // Debe avanzar a subactivity 2, primer párrafo
      expect(result.subactivity).toEqual(mockSubactivity2);
      expect(result.paragraph).toEqual(para1Sub2);
    });

    it('debe reiniciar el ciclo cuando se completan todas las subactivities', async () => {
      // Mock: 2 subactivities
      jest.spyOn(subactivityRepository, 'find')
        .mockResolvedValue([mockSubactivity1, mockSubactivity2] as Subactivity[]);

      // Mock: Párrafos de subactivity 1
      const para1Sub1 = { ...mockParagraph1, id: 'para-1-sub1', paragraphOrder: 1, subactivityId: 'sub-1' };

      // Mock: Solo 1 párrafo en subactivity 2
      const para1Sub2 = { ...mockParagraph1, id: 'para-1-sub2', paragraphOrder: 1, subactivityId: 'sub-2' };

      jest.spyOn(activityParagraphRepository, 'find')
        .mockResolvedValueOnce([para1Sub2] as ActivityParagraph[]) // Para verificar si hay más párrafos en sub-2
        .mockResolvedValueOnce([para1Sub1] as ActivityParagraph[]); // Párrafos de sub-1 (reinicio)

      // Mock: Último uso fue el último párrafo de la última subactivity
      const mockLastUsage = {
        paragraphId: 'para-1-sub2',
        paragraph: { ...para1Sub2, subactivity: mockSubactivity2 },
        usedDate: new Date(),
      };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockLastUsage),
      };

      jest.spyOn(paragraphUsageHistoryRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getNextSubactivityAndParagraphForActivity(mockGroupId, mockActivityId);

      // Debe volver a subactivity 1, primer párrafo
      expect(result.subactivity).toEqual(mockSubactivity1);
      expect(result.paragraph).toEqual(para1Sub1);
    });

    it('debe ordenar subactivities alfabéticamente', async () => {
      const findSpy = jest.spyOn(subactivityRepository, 'find')
        .mockResolvedValue([mockSubactivity1] as Subactivity[]);

      jest.spyOn(activityParagraphRepository, 'find')
        .mockResolvedValue([mockParagraph1] as ActivityParagraph[]);

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      jest.spyOn(paragraphUsageHistoryRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      await service.getNextSubactivityAndParagraphForActivity(mockGroupId, mockActivityId);

      expect(findSpy).toHaveBeenCalledWith({
        where: { activityId: mockActivityId, isActive: true },
        order: { subactivityName: 'ASC' },
      });
    });
  });

  describe('registerUsage', () => {
    it('debe guardar uso en paragraph_usage_history con todos los campos requeridos', async () => {
      const responseText = 'Test client response';

      jest.spyOn(generatedResponseHistoryRepository, 'findOne')
        .mockResolvedValue(null);

      const saveSpy = jest.spyOn(paragraphUsageHistoryRepository, 'save')
        .mockResolvedValue({} as ParagraphUsageHistory);

      jest.spyOn(activityParagraphRepository, 'increment')
        .mockResolvedValue(undefined);

      jest.spyOn(generatedResponseHistoryRepository, 'save')
        .mockResolvedValue({} as GeneratedResponseHistory);

      await service.registerUsage(
        mockPatientId,
        mockGoalId,
        mockParagraph1.id,
        mockSubactivityId,
        responseText,
        mockGroupId,
        mockActivityId,
        mockWeekId,
      );

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          patientId: mockPatientId,
          paragraphId: mockParagraph1.id,
          subactivityId: mockSubactivityId,
          groupId: mockGroupId,
          activityId: mockActivityId,
          weekId: mockWeekId,
        })
      );
    });

    it('debe incrementar usage_count del párrafo', async () => {
      const responseText = 'Test client response';

      jest.spyOn(generatedResponseHistoryRepository, 'findOne')
        .mockResolvedValue(null);

      jest.spyOn(paragraphUsageHistoryRepository, 'save')
        .mockResolvedValue({} as ParagraphUsageHistory);

      const incrementSpy = jest.spyOn(activityParagraphRepository, 'increment')
        .mockResolvedValue(undefined);

      jest.spyOn(generatedResponseHistoryRepository, 'save')
        .mockResolvedValue({} as GeneratedResponseHistory);

      await service.registerUsage(
        mockPatientId,
        mockGoalId,
        mockParagraph1.id,
        mockSubactivityId,
        responseText,
        mockGroupId,
        mockActivityId,
        mockWeekId,
      );

      expect(incrementSpy).toHaveBeenCalledWith(
        { id: mockParagraph1.id },
        'usageCount',
        1
      );
    });

    it('debe crear hash MD5 de la respuesta generada', async () => {
      const responseText = 'Test client response';

      const findOneSpy = jest.spyOn(generatedResponseHistoryRepository, 'findOne')
        .mockResolvedValue(null);

      jest.spyOn(paragraphUsageHistoryRepository, 'save')
        .mockResolvedValue({} as ParagraphUsageHistory);

      jest.spyOn(activityParagraphRepository, 'increment')
        .mockResolvedValue(undefined);

      jest.spyOn(generatedResponseHistoryRepository, 'save')
        .mockResolvedValue({} as GeneratedResponseHistory);

      await service.registerUsage(
        mockPatientId,
        mockGoalId,
        mockParagraph1.id,
        mockSubactivityId,
        responseText,
        mockGroupId,
        mockActivityId,
        mockWeekId,
      );

      // Debe verificar si el hash ya existe
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { responseHash: expect.any(String) }
      });
    });

    it('debe guardar en generated_responses_history para evitar duplicados', async () => {
      const responseText = 'Test client response';

      jest.spyOn(generatedResponseHistoryRepository, 'findOne')
        .mockResolvedValue(null);

      jest.spyOn(paragraphUsageHistoryRepository, 'save')
        .mockResolvedValue({} as ParagraphUsageHistory);

      jest.spyOn(activityParagraphRepository, 'increment')
        .mockResolvedValue(undefined);

      const saveSpy = jest.spyOn(generatedResponseHistoryRepository, 'save')
        .mockResolvedValue({} as GeneratedResponseHistory);

      await service.registerUsage(
        mockPatientId,
        mockGoalId,
        mockParagraph1.id,
        mockSubactivityId,
        responseText,
        mockGroupId,
        mockActivityId,
        mockWeekId,
      );

      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          patientId: mockPatientId,
          responseText: responseText,
          responseHash: expect.any(String),
        })
      );
    });
  });

  describe('edge cases y manejo de errores', () => {
    it('debe manejar error cuando falla la consulta de historial', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockRejectedValue(new Error('Database error')),
      };

      jest.spyOn(paragraphUsageHistoryRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getNextParagraphForObjective(mockSubactivityId, mockGroupId);

      // Debe retornar null en caso de error
      expect(result).toBeNull();
    });

    it('debe manejar párrafos sin paragraphOrder definido', async () => {
      const paragraphWithoutOrder = {
        ...mockParagraph1,
        paragraphOrder: null,
      };

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      jest.spyOn(paragraphUsageHistoryRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      jest.spyOn(activityParagraphRepository, 'find')
        .mockResolvedValue([paragraphWithoutOrder] as ActivityParagraph[]);

      const result = await service.getNextParagraphForObjective(mockSubactivityId, mockGroupId);

      // Debe retornar el párrafo aunque no tenga paragraphOrder
      expect(result).toBeTruthy();
    });

    it('debe retornar null cuando no hay subactivities para una actividad', async () => {
      jest.spyOn(subactivityRepository, 'find')
        .mockResolvedValue([]);

      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      jest.spyOn(paragraphUsageHistoryRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getNextSubactivityAndParagraphForActivity(mockGroupId, mockActivityId);

      expect(result).toBeNull();
    });
  });
});
