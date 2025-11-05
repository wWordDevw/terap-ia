import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MtprController } from './mtpr.controller';
import { MtprService } from './mtpr.service';
import { WordMtprTemplateService } from './templates/word-mtpr-template.service';
import { MtprSchedule } from './entities/mtpr-schedule.entity';
import { GeneratedMtpr } from './entities/generated-mtpr.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { PatientGoal } from '../patients/entities/patient-goal.entity';
import { GoalTrackingModule } from '../goal-tracking/goal-tracking.module';

/**
 * Módulo de MTPR (Master Treatment Plan Review)
 * RF-018 a RF-027
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      MtprSchedule,
      GeneratedMtpr,
      Patient,
      Attendance,
      PatientGoal,
    ]),
    GoalTrackingModule,
  ],
  controllers: [MtprController],
  providers: [MtprService, WordMtprTemplateService],
  exports: [MtprService],
})
export class MtprModule {}
