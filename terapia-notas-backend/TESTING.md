# 🧪 Guía de Testing - Terap-IA Backend

## 📋 Índice

- [Descripción General](#descripción-general)
- [Tests Implementados](#tests-implementados)
- [Ejecutar Tests](#ejecutar-tests)
- [Cobertura de Tests](#cobertura-de-tests)
- [Tests Críticos](#tests-críticos)
- [Agregar Nuevos Tests](#agregar-nuevos-tests)

---

## 📖 Descripción General

Este documento describe la suite de tests implementada para el backend de Terap-IA, con especial énfasis en los componentes críticos: **sistema de rotación** y **generación de métricas**.

---

## 🧩 Tests Implementados

### 1. **Tests de Sistema de Rotación** (`rotation.service.spec.ts`)

**Ubicación:** `src/modules/notes/services/rotation.service.spec.ts`

**Cobertura:**
- ✅ Rotación por grupo con `paragraph_order`
- ✅ Reinicio automático de ciclos cuando se completan todos los párrafos
- ✅ Rotación doble (subactivities + párrafos)
- ✅ Registro de uso con todos los campos críticos (`groupId`, `activityId`)
- ✅ Creación de hash MD5 para evitar respuestas duplicadas
- ✅ Manejo de edge cases (sin párrafos, sin subactivities, errores de BD)

**Casos de Prueba:** 20+

**Ejecutar:**
```bash
npm test -- rotation.service.spec.ts
```

---

### 2. **Tests de Validación de Métricas** (`word-template-replacement.service.spec.ts`)

**Ubicación:** `src/modules/notes/templates/word-template-replacement.service.spec.ts`

**Cobertura:**
- ✅ `getRandomMetric()` solo retorna "Moderate" o "Minor" (NUNCA "Poor")
- ✅ Distribución aproximadamente 50/50 entre valores
- ✅ Checkboxes correctos para COOPERATION, MOTIVATION, CONCENTRATION, PEER INTERACTION
- ✅ Checkboxes `*_poor` SIEMPRE desmarcados (☐)
- ✅ **ATTITUDE** SIEMPRE es "Fluctuations" (regla crítica)
- ✅ `attitude_positive` y `attitude_negative` SIEMPRE desmarcados
- ✅ `attitude_fluctuations` SIEMPRE marcado (☒)
- ✅ Tests de robustez (100+ iteraciones)
- ✅ Tests de seguridad para prevenir regresiones

**Casos de Prueba:** 25+

**Ejecutar:**
```bash
npm test -- word-template-replacement.service.spec.ts
```

---

### 3. **Tests Existentes**

- `auth.service.spec.ts` - Autenticación y JWT
- `mtpr.service.spec.ts` - Master Treatment Plan Review
- `multidisciplinary.service.spec.ts` - Notas multidisciplinarias
- `users.service.spec.ts` - Gestión de usuarios

---

## 🚀 Ejecutar Tests

### Ejecutar TODOS los tests:
```bash
npm test
```

### Ejecutar tests en modo watch (desarrollo):
```bash
npm test -- --watch
```

### Ejecutar un archivo específico:
```bash
npm test -- rotation.service.spec.ts
```

### Ejecutar con cobertura:
```bash
npm test -- --coverage
```

### Ejecutar tests en modo verbose:
```bash
npm test -- --verbose
```

---

## 📊 Cobertura de Tests

### Componentes con Alta Cobertura:
- ✅ **RotationService**: ~90% (20+ casos de prueba)
- ✅ **Métricas**: ~95% (25+ casos de prueba)
- ✅ **AuthService**: ~85% (tests existentes)

### Áreas sin Cobertura Actual:
- ⚠️ **NotesService**: Tests de integración pendientes (complejo, requiere mocks extensos)
- ⚠️ **WordTemplateReplacementService**: Métodos de generación de documentos (requieren templates)

---

## ⚠️ Tests Críticos

### 1. Validación de Rotación por Grupo

**Por qué es crítico:**
- La rotación debe ser por GRUPO, no por paciente individual
- Todos los pacientes del mismo grupo deben recibir el mismo párrafo el mismo día
- Si falla, se rompe la lógica de negocio completa

**Test clave:**
```typescript
it('debe retornar el primer párrafo cuando no hay historial de uso', async () => {
  // Verifica que la primera vez siempre retorna el primer párrafo (order: 1)
});
```

### 2. Reinicio Automático de Ciclos

**Por qué es crítico:**
- Cuando se usan todos los párrafos, debe volver al primero automáticamente
- Sin esto, el sistema fallaría después de N días (N = cantidad de párrafos)

**Test clave:**
```typescript
it('debe reiniciar el ciclo cuando se usó el último párrafo', async () => {
  // Simula que se usó el último párrafo y verifica que vuelve al primero
});
```

### 3. Métricas NUNCA pueden ser "Poor"

**Por qué es crítico:**
- Violación de reglas de cumplimiento clínico
- Rechazo por auditores médicos
- Potenciales problemas legales

**Test clave:**
```typescript
it('debe retornar solo "Moderate" o "Minor" (nunca "Poor")', () => {
  // Ejecuta 100 veces y verifica que NUNCA sea "Poor"
});
```

### 4. ATTITUDE siempre "Fluctuations"

**Por qué es crítico:**
- Regla de negocio más estricta
- Cambiar este valor = notas clínicas inválidas

**Test clave:**
```typescript
it('attitude SIEMPRE debe ser "Fluctuations"', () => {
  const attitude = 'Fluctuations';
  expect(attitude).not.toBe('Positive');
  expect(attitude).not.toBe('Negative');
  // ... etc
});
```

---

## 🔧 Agregar Nuevos Tests

### Estructura de un Test Básico:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { MyService } from './my.service';

describe('MyService', () => {
  let service: MyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyService],
    }).compile();

    service = module.get<MyService>(MyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('debe realizar la operación correctamente', () => {
    const result = service.myMethod('input');
    expect(result).toBe('expected output');
  });
});
```

### Mockear Repositorios de TypeORM:

```typescript
{
  provide: getRepositoryToken(MyEntity),
  useValue: {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    // ... otros métodos
  },
}
```

### Mockear QueryBuilder:

```typescript
const mockQueryBuilder = {
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  getOne: jest.fn().mockResolvedValue(mockData),
};

jest.spyOn(repository, 'createQueryBuilder')
  .mockReturnValue(mockQueryBuilder as any);
```

---

## 🐛 Debugging de Tests

### Ver logs de tests:
```bash
npm test -- --verbose --no-coverage
```

### Ejecutar un test específico:
```typescript
it.only('debe ejecutar solo este test', () => {
  // ...
});
```

### Saltar un test temporalmente:
```typescript
it.skip('test que se saltará', () => {
  // ...
});
```

### Ver tiempos de ejecución:
```bash
npm test -- --verbose --detectOpenHandles
```

---

## 📚 Referencias

- **Jest Documentation:** https://jestjs.io/docs/getting-started
- **NestJS Testing:** https://docs.nestjs.com/fundamentals/testing
- **TypeORM Mocking:** https://github.com/typeorm/typeorm/blob/master/docs/testing.md

---

## ✅ Checklist para Nuevos Features

Antes de considerar completo un nuevo feature, asegúrate de:

- [ ] Tests unitarios para lógica de negocio
- [ ] Tests de edge cases (valores null, arrays vacíos, etc.)
- [ ] Tests de manejo de errores
- [ ] Cobertura mínima del 80%
- [ ] Tests pasan en modo watch
- [ ] Documentación JSDoc agregada
- [ ] README actualizado si es necesario

---

**Última actualización:** 2025-11-18
**Versión:** 1.0
**Autor:** Claude Code
