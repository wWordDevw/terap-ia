import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MultidisciplinaryController } from './multidisciplinary.controller';
import { MultidisciplinaryService } from './multidisciplinary.service';
import { WordMultidisciplinaryTemplateService } from './templates/word-multidisciplinary-template.service';
import { MultidisciplinarySchedule } from './entities/multidisciplinary-schedule.entity';
import { GeneratedMultidisciplinaryNote } from './entities/generated-multidisciplinary-note.entity';
import { Patient } from '../patients/entities/patient.entity';

/**
 * Módulo de juntas multidisciplinarias
 * RF-031 a RF-033
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      MultidisciplinarySchedule,
      GeneratedMultidisciplinaryNote,
      Patient,
    ]),
  ],
  controllers: [MultidisciplinaryController],
  providers: [MultidisciplinaryService, WordMultidisciplinaryTemplateService],
  exports: [MultidisciplinaryService],
})
export class MultidisciplinaryModule {}
