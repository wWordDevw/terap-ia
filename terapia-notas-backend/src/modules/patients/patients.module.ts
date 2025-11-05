import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { PatientCancellationService } from './patient-cancellation.service';
import { Patient } from './entities/patient.entity';
import { PatientGoal } from './entities/patient-goal.entity';
import { GoalProgress } from './entities/goal-progress.entity';
import { PatientDiagnosis } from './entities/patient-diagnosis.entity';
import { PatientDocument } from './entities/patient-document.entity';
import { PatientNote } from './entities/patient-note.entity';
import { AvailableDiagnosis } from './entities/available-diagnosis.entity';
import { GroupPatient } from '../groups/entities/group-patient.entity';
import { FileStorageService } from '../../common/services/file-storage.service';

/**
 * Módulo de Pacientes - RF-004 a RF-006
 * Gestiona toda la funcionalidad relacionada con pacientes
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      PatientGoal,
      GoalProgress,
      PatientDiagnosis,
      PatientDocument,
      PatientNote,
      AvailableDiagnosis,
      GroupPatient,
    ]),
  ],
  controllers: [PatientsController],
  providers: [PatientsService, FileStorageService, PatientCancellationService],
  exports: [PatientsService],
})
export class PatientsModule {}
