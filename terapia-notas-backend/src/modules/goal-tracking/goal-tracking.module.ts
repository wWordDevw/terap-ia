import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalTrackingController } from './goal-tracking.controller';
import { GoalTrackingService } from './goal-tracking.service';
import { GoalProgress } from '../patients/entities/goal-progress.entity';
import { PatientGoal } from '../patients/entities/patient-goal.entity';
import { Patient } from '../patients/entities/patient.entity';

/**
 * Módulo de Goal Tracking
 * Gestiona el seguimiento y cumplimiento de objetivos del paciente
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      GoalProgress,
      PatientGoal,
      Patient,
    ]),
  ],
  controllers: [GoalTrackingController],
  providers: [GoalTrackingService],
  exports: [GoalTrackingService],
})
export class GoalTrackingModule {}
