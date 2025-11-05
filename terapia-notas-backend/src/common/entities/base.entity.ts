import {
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entidad base abstracta con campos comunes
 * Todas las entidades deben extender de esta clase
 * Nota: El ID debe ser definido en cada entidad con su nombre específico
 */
export abstract class BaseEntity {
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
