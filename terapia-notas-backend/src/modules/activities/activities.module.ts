import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { Activity } from './entities/activity.entity';
import { Subactivity } from './entities/subactivity.entity';
import { ActivityParagraph } from './entities/activity-paragraph.entity';

/**
 * Módulo de Actividades
 * Gestiona toda la funcionalidad relacionada con actividades
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, Subactivity, ActivityParagraph]),
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
