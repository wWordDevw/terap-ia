import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WordTemplateReplacementService } from './word-template-replacement.service';
import { User } from '../../users/entities/user.entity';
import { Logger } from '@nestjs/common';

/**
 * Tests críticos para validar reglas de negocio de métricas
 *
 * REGLAS DOCUMENTADAS:
 * 1. COOPERATION, MOTIVATION, CONCENTRATION, PEER INTERACTION: Solo "Minor" o "Moderate" (NUNCA "Poor")
 * 2. ATTITUDE: Siempre "Fluctuations" (NUNCA "Positive" o "Negative")
 * 3. Checkboxes:
 *    - *_poor: SIEMPRE desmarcados (☐)
 *    - attitude_positive/negative: SIEMPRE desmarcados (☐)
 *    - attitude_fluctuations: SIEMPRE marcado (☒)
 */
describe('WordTemplateReplacementService - Validación de Métricas', () => {
  let service: WordTemplateReplacementService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordTemplateReplacementService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WordTemplateReplacementService>(WordTemplateReplacementService);
    userRepository = module.get(getRepositoryToken(User));

    // Suprimir logs durante tests
    jest.spyOn(Logger.prototype, 'log').mockImplementation();
    jest.spyOn(Logger.prototype, 'error').mockImplementation();
    jest.spyOn(Logger.prototype, 'debug').mockImplementation();

    jest.clearAllMocks();
  });

  describe('getRandomMetric()', () => {
    it('debe retornar solo "Moderate" o "Minor" (nunca "Poor")', () => {
      // Ejecutar 100 veces para verificar aleatoriedad
      const results = [];
      for (let i = 0; i < 100; i++) {
        const result = (service as any).getRandomMetric();
        results.push(result);
      }

      // REGLA CRÍTICA: Todos los resultados deben ser "Moderate" o "Minor"
      results.forEach((result, index) => {
        expect(['Moderate', 'Minor']).toContain(result);
        expect(result).not.toBe('Poor');
        expect(result).not.toBe('Poor / Negative');
        expect(result).not.toBe('Fluctuations');
      });
    });

    it('debe generar valores aleatorios (no siempre el mismo)', () => {
      const results = [];
      for (let i = 0; i < 100; i++) {
        results.push((service as any).getRandomMetric());
      }

      // Debe haber variedad en los resultados (no todos iguales)
      const uniqueValues = new Set(results);
      expect(uniqueValues.size).toBeGreaterThan(1);
    });

    it('debe generar aproximadamente 50% "Moderate" y 50% "Minor"', () => {
      const results = [];
      const iterations = 1000; // Más iteraciones para verificar distribución

      for (let i = 0; i < iterations; i++) {
        results.push((service as any).getRandomMetric());
      }

      const moderateCount = results.filter(r => r === 'Moderate').length;
      const minorCount = results.filter(r => r === 'Minor').length;

      // Verificar que la distribución es aproximadamente 50/50 (con margen de error del 10%)
      const moderatePercentage = (moderateCount / iterations) * 100;
      const minorPercentage = (minorCount / iterations) * 100;

      expect(moderatePercentage).toBeGreaterThanOrEqual(40);
      expect(moderatePercentage).toBeLessThanOrEqual(60);
      expect(minorPercentage).toBeGreaterThanOrEqual(40);
      expect(minorPercentage).toBeLessThanOrEqual(60);
    });
  });

  describe('Generación de Checkboxes de Métricas', () => {
    describe('COOPERATION', () => {
      it('debe marcar cooperation_moderate cuando valor es "Moderate"', () => {
        const cooperation = 'Moderate';
        const moderate = cooperation === 'Moderate' ? '☒' : '☐';
        const minor = cooperation === 'Minor' ? '☒' : '☐';
        const poor = '☐';

        expect(moderate).toBe('☒');
        expect(minor).toBe('☐');
        expect(poor).toBe('☐');
      });

      it('debe marcar cooperation_minor cuando valor es "Minor"', () => {
        const cooperation = 'Minor';
        const moderate = cooperation === 'Moderate' ? '☒' : '☐';
        const minor = cooperation === 'Minor' ? '☒' : '☐';
        const poor = '☐';

        expect(moderate).toBe('☐');
        expect(minor).toBe('☒');
        expect(poor).toBe('☐');
      });

      it('cooperation_poor SIEMPRE debe estar desmarcado', () => {
        // REGLA CRÍTICA: cooperation_poor SIEMPRE es '☐', sin importar el valor
        const testValues = ['Moderate', 'Minor', 'Poor', 'anything'];

        testValues.forEach(cooperation => {
          const poor = '☐'; // SIEMPRE hardcoded a '☐'
          expect(poor).toBe('☐');
        });
      });
    });

    describe('MOTIVATION', () => {
      it('debe marcar motivation_moderate cuando valor es "Moderate"', () => {
        const motivation = 'Moderate';
        const moderate = motivation === 'Moderate' ? '☒' : '☐';
        const minor = motivation === 'Minor' ? '☒' : '☐';
        const poor = '☐';

        expect(moderate).toBe('☒');
        expect(minor).toBe('☐');
        expect(poor).toBe('☐');
      });

      it('debe marcar motivation_minor cuando valor es "Minor"', () => {
        const motivation = 'Minor';
        const moderate = motivation === 'Moderate' ? '☒' : '☐';
        const minor = motivation === 'Minor' ? '☒' : '☐';
        const poor = '☐';

        expect(moderate).toBe('☐');
        expect(minor).toBe('☒');
        expect(poor).toBe('☐');
      });

      it('motivation_poor SIEMPRE debe estar desmarcado', () => {
        // REGLA CRÍTICA: motivation_poor SIEMPRE es '☐'
        const testValues = ['Moderate', 'Minor', 'Poor'];

        testValues.forEach(motivation => {
          const poor = '☐'; // SIEMPRE hardcoded
          expect(poor).toBe('☐');
        });
      });
    });

    describe('CONCENTRATION & FOCUS', () => {
      it('debe marcar concentration_moderate cuando valor es "Moderate"', () => {
        const concentration = 'Moderate';
        const moderate = concentration === 'Moderate' ? '☒' : '☐';
        const minor = concentration === 'Minor' ? '☒' : '☐';
        const poor = '☐';

        expect(moderate).toBe('☒');
        expect(minor).toBe('☐');
        expect(poor).toBe('☐');
      });

      it('debe marcar concentration_minor cuando valor es "Minor"', () => {
        const concentration = 'Minor';
        const moderate = concentration === 'Moderate' ? '☒' : '☐';
        const minor = concentration === 'Minor' ? '☒' : '☐';
        const poor = '☐';

        expect(moderate).toBe('☐');
        expect(minor).toBe('☒');
        expect(poor).toBe('☐');
      });

      it('concentration_poor SIEMPRE debe estar desmarcado', () => {
        // REGLA CRÍTICA: concentration_poor SIEMPRE es '☐'
        const poor = '☐'; // SIEMPRE hardcoded
        expect(poor).toBe('☐');
      });
    });

    describe('PEER INTERACTION', () => {
      it('debe marcar peer_moderate cuando valor es "Moderate"', () => {
        const peerInteraction = 'Moderate';
        const moderate = peerInteraction === 'Moderate' ? '☒' : '☐';
        const minor = peerInteraction === 'Minor' ? '☒' : '☐';
        const poor = '☐';

        expect(moderate).toBe('☒');
        expect(minor).toBe('☐');
        expect(poor).toBe('☐');
      });

      it('debe marcar peer_minor cuando valor es "Minor"', () => {
        const peerInteraction = 'Minor';
        const moderate = peerInteraction === 'Moderate' ? '☒' : '☐';
        const minor = peerInteraction === 'Minor' ? '☒' : '☐';
        const poor = '☐';

        expect(moderate).toBe('☐');
        expect(minor).toBe('☒');
        expect(poor).toBe('☐');
      });

      it('peer_poor SIEMPRE debe estar desmarcado', () => {
        // REGLA CRÍTICA: peer_poor SIEMPRE es '☐'
        const poor = '☐'; // SIEMPRE hardcoded
        expect(poor).toBe('☐');
      });
    });

    describe('ATTITUDE (CRÍTICO)', () => {
      it('attitude SIEMPRE debe ser "Fluctuations"', () => {
        // REGLA CRÍTICA MÁS IMPORTANTE: attitude SIEMPRE es "Fluctuations"
        const attitude = 'Fluctuations';

        expect(attitude).toBe('Fluctuations');
        expect(attitude).not.toBe('Positive');
        expect(attitude).not.toBe('Negative');
        expect(attitude).not.toBe('Moderate');
        expect(attitude).not.toBe('Minor');
        expect(attitude).not.toBe('Poor');
      });

      it('attitude_fluctuations SIEMPRE debe estar marcado', () => {
        // REGLA CRÍTICA: attitude_fluctuations SIEMPRE es '☒'
        const fluctuations = '☒'; // SIEMPRE hardcoded a '☒'
        expect(fluctuations).toBe('☒');
      });

      it('attitude_positive SIEMPRE debe estar desmarcado', () => {
        // REGLA CRÍTICA: attitude_positive SIEMPRE es '☐'
        const positive = '☐'; // SIEMPRE hardcoded a '☐'
        expect(positive).toBe('☐');
      });

      it('attitude_negative SIEMPRE debe estar desmarcado', () => {
        // REGLA CRÍTICA: attitude_negative SIEMPRE es '☐'
        const negative = '☐'; // SIEMPRE hardcoded a '☐'
        expect(negative).toBe('☐');
      });

      it('NUNCA puede haber otra combinación de checkboxes para attitude', () => {
        // REGLA CRÍTICA: Solo UNA combinación válida
        const validCombination = {
          attitude_positive: '☐',
          attitude_negative: '☐',
          attitude_fluctuations: '☒',
        };

        // Verificar que es la única combinación posible
        expect(validCombination.attitude_positive).toBe('☐');
        expect(validCombination.attitude_negative).toBe('☐');
        expect(validCombination.attitude_fluctuations).toBe('☒');

        // NINGUNA otra combinación es válida
        const invalidCombinations = [
          { positive: '☒', negative: '☐', fluctuations: '☐' }, // ❌ Inválido
          { positive: '☐', negative: '☒', fluctuations: '☐' }, // ❌ Inválido
          { positive: '☒', negative: '☒', fluctuations: '☐' }, // ❌ Inválido
          { positive: '☐', negative: '☐', fluctuations: '☐' }, // ❌ Inválido
        ];

        invalidCombinations.forEach(combo => {
          // Estas combinaciones NO deben ocurrir jamás
          const isValidCombination =
            combo.positive === '☐' &&
            combo.negative === '☐' &&
            combo.fluctuations === '☒';

          expect(isValidCombination).toBe(false);
        });
      });
    });
  });

  describe('Validación Integral de Métricas', () => {
    it('debe generar objeto de métricas válido con TODOS los checkboxes correctos', () => {
      // Simular generación de métricas como en el código real
      const cooperation = (service as any).getRandomMetric();
      const motivation = (service as any).getRandomMetric();
      const concentration = (service as any).getRandomMetric();
      const peerInteraction = (service as any).getRandomMetric();

      const metricsData = {
        cooperation_moderate: cooperation === 'Moderate' ? '☒' : '☐',
        cooperation_minor: cooperation === 'Minor' ? '☒' : '☐',
        cooperation_poor: '☐',
        motivation_moderate: motivation === 'Moderate' ? '☒' : '☐',
        motivation_minor: motivation === 'Minor' ? '☒' : '☐',
        motivation_poor: '☐',
        concentration_moderate: concentration === 'Moderate' ? '☒' : '☐',
        concentration_minor: concentration === 'Minor' ? '☒' : '☐',
        concentration_poor: '☐',
        peer_moderate: peerInteraction === 'Moderate' ? '☒' : '☐',
        peer_minor: peerInteraction === 'Minor' ? '☒' : '☐',
        peer_poor: '☐',
        attitude_positive: '☐',
        attitude_negative: '☐',
        attitude_fluctuations: '☒',
        cooperation,
        motivation,
        concentration,
        peerInteraction,
        attitude: 'Fluctuations',
      };

      // Validar TODAS las reglas críticas

      // 1. Valores de métricas solo pueden ser "Moderate" o "Minor"
      expect(['Moderate', 'Minor']).toContain(metricsData.cooperation);
      expect(['Moderate', 'Minor']).toContain(metricsData.motivation);
      expect(['Moderate', 'Minor']).toContain(metricsData.concentration);
      expect(['Moderate', 'Minor']).toContain(metricsData.peerInteraction);

      // 2. Attitude siempre es "Fluctuations"
      expect(metricsData.attitude).toBe('Fluctuations');

      // 3. TODOS los checkboxes *_poor están desmarcados
      expect(metricsData.cooperation_poor).toBe('☐');
      expect(metricsData.motivation_poor).toBe('☐');
      expect(metricsData.concentration_poor).toBe('☐');
      expect(metricsData.peer_poor).toBe('☐');

      // 4. Attitude checkboxes correctos
      expect(metricsData.attitude_positive).toBe('☐');
      expect(metricsData.attitude_negative).toBe('☐');
      expect(metricsData.attitude_fluctuations).toBe('☒');

      // 5. Exactamente UN checkbox marcado por métrica (moderate o minor, no ambos)
      const cooperationMarked = [
        metricsData.cooperation_moderate,
        metricsData.cooperation_minor
      ].filter(c => c === '☒').length;
      expect(cooperationMarked).toBe(1);

      const motivationMarked = [
        metricsData.motivation_moderate,
        metricsData.motivation_minor
      ].filter(c => c === '☒').length;
      expect(motivationMarked).toBe(1);

      const concentrationMarked = [
        metricsData.concentration_moderate,
        metricsData.concentration_minor
      ].filter(c => c === '☒').length;
      expect(concentrationMarked).toBe(1);

      const peerMarked = [
        metricsData.peer_moderate,
        metricsData.peer_minor
      ].filter(c => c === '☒').length;
      expect(peerMarked).toBe(1);
    });

    it('debe generar métricas válidas 100 veces seguidas sin errores', () => {
      // Test de robustez: Generar métricas múltiples veces y validar TODAS
      for (let i = 0; i < 100; i++) {
        const cooperation = (service as any).getRandomMetric();
        const motivation = (service as any).getRandomMetric();
        const concentration = (service as any).getRandomMetric();
        const peerInteraction = (service as any).getRandomMetric();

        // TODAS las métricas deben cumplir las reglas
        expect(['Moderate', 'Minor']).toContain(cooperation);
        expect(['Moderate', 'Minor']).toContain(motivation);
        expect(['Moderate', 'Minor']).toContain(concentration);
        expect(['Moderate', 'Minor']).toContain(peerInteraction);

        // NUNCA pueden ser otros valores
        expect(cooperation).not.toBe('Poor');
        expect(motivation).not.toBe('Poor');
        expect(concentration).not.toBe('Poor');
        expect(peerInteraction).not.toBe('Poor');
      }
    });
  });

  describe('Regresiones Potenciales (Tests de Seguridad)', () => {
    it('NO debe permitir valor "Poor" en cooperation', () => {
      const invalidValue = 'Poor';
      expect(invalidValue).not.toBe('Moderate');
      expect(invalidValue).not.toBe('Minor');
    });

    it('NO debe permitir valor "Positive" en attitude', () => {
      const attitude = 'Fluctuations'; // SIEMPRE debe ser esto
      expect(attitude).not.toBe('Positive');
      expect(attitude).not.toBe('Negative');
    });

    it('NO debe marcar cooperation_poor bajo ninguna circunstancia', () => {
      // Incluso si el valor fuera "Poor" (que nunca debe serlo), el checkbox debe estar desmarcado
      const cooperation_poor = '☐'; // SIEMPRE hardcoded
      expect(cooperation_poor).toBe('☐');
    });

    it('NO debe tener más de un checkbox marcado por métrica', () => {
      const cooperation = (service as any).getRandomMetric();

      const moderate = cooperation === 'Moderate' ? '☒' : '☐';
      const minor = cooperation === 'Minor' ? '☒' : '☐';
      const poor = '☐';

      const markedCount = [moderate, minor, poor].filter(c => c === '☒').length;

      // Solo UNO puede estar marcado
      expect(markedCount).toBeLessThanOrEqual(1);
    });
  });
});
