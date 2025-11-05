import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { Group } from './entities/group.entity';
import { GroupWeek } from './entities/group-week.entity';
import { GroupSchedule } from './entities/group-schedule.entity';
import { GroupPatient } from './entities/group-patient.entity';
import { User } from '../users/entities/user.entity';
import { ActivitiesModule } from '../activities/activities.module';

/**
 * Módulo de Grupos - RF-001 a RF-003
 * Gestiona toda la funcionalidad relacionada con grupos
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Group, GroupWeek, GroupSchedule, GroupPatient, User]),
    ActivitiesModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
