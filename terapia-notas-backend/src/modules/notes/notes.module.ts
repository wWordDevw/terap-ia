import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { WordTemplateService } from './templates/word-template.service';
import { WordTemplateReplacementService } from './templates/word-template-replacement.service';
import { OpenAIService } from '../../common/services/openai.service';
import { RotationService } from './services/rotation.service';
import { Group } from '../groups/entities/group.entity';
import { GroupWeek } from '../groups/entities/group-week.entity';
import { GroupPatient } from '../groups/entities/group-patient.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { PatientDiagnosis } from '../patients/entities/patient-diagnosis.entity';
import { GroupSchedule } from '../groups/entities/group-schedule.entity';
import { Subactivity } from '../activities/entities/subactivity.entity';
import { PatientGoal } from '../patients/entities/patient-goal.entity';
import { ActivityParagraph } from '../activities/entities/activity-paragraph.entity';
import { ParagraphUsageHistory } from '../activities/entities/paragraph-usage-history.entity';
import { GeneratedResponseHistory } from '../activities/entities/generated-response-history.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Group,
      GroupWeek,
      GroupPatient,
      Patient,
      Attendance,
      PatientDiagnosis,
      GroupSchedule,
      Subactivity,
      PatientGoal,
      ActivityParagraph,
      ParagraphUsageHistory,
      GeneratedResponseHistory,
      User,
    ]),
  ],
  controllers: [NotesController],
  providers: [NotesService, WordTemplateService, WordTemplateReplacementService, OpenAIService, RotationService],
  exports: [NotesService],
})
export class NotesModule {}