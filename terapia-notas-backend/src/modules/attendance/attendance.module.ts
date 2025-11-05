import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { AbsenceReason } from './entities/absence-reason.entity';
import { GroupPatient } from '../groups/entities/group-patient.entity';

/**
 * Módulo de Asistencia - RF-007 a RF-009
 * Gestiona toda la funcionalidad relacionada con asistencia
 */
@Module({
  imports: [TypeOrmModule.forFeature([Attendance, AbsenceReason, GroupPatient])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
