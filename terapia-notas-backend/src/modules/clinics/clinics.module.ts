import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClinicsController } from './clinics.controller';
import { ClinicsService } from './clinics.service';
import { Clinic } from './entities/clinic.entity';

/**
 * Módulo de Clínicas
 * Gestiona toda la funcionalidad relacionada con clínicas
 */
@Module({
  imports: [TypeOrmModule.forFeature([Clinic])],
  controllers: [ClinicsController],
  providers: [ClinicsService],
  exports: [ClinicsService], // Exportar para usar en otros módulos
})
export class ClinicsModule {}
