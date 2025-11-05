import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MultidisciplinarySchedule } from './entities/multidisciplinary-schedule.entity';
import { GeneratedMultidisciplinaryNote } from './entities/generated-multidisciplinary-note.entity';
import { GenerateMultidisciplinaryNoteDto } from './dto/generate-multidisciplinary-note.dto';
import { ScheduleMultidisciplinaryDto } from './dto/schedule-multidisciplinary.dto';
import { Patient } from '../patients/entities/patient.entity';
import { WordMultidisciplinaryTemplateService } from './templates/word-multidisciplinary-template.service';

/**
 * Servicio de juntas multidisciplinarias
 * RF-031 a RF-033
 */
@Injectable()
export class MultidisciplinaryService {
  constructor(
    @InjectRepository(MultidisciplinarySchedule)
    private readonly scheduleRepository: Repository<MultidisciplinarySchedule>,
    @InjectRepository(GeneratedMultidisciplinaryNote)
    private readonly noteRepository: Repository<GeneratedMultidisciplinaryNote>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly wordTemplateService: WordMultidisciplinaryTemplateService,
  ) {}

  /**
   * Programa una junta multidisciplinaria manualmente
   * RF-031
   */
  async scheduleMultidisciplinary(
    dto: ScheduleMultidisciplinaryDto,
  ): Promise<MultidisciplinarySchedule> {
    // Validar que el paciente existe
    const patient = await this.patientRepository.findOne({
      where: { id: dto.patientId },
    });

    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${dto.patientId} no encontrado`);
    }

    // Determinar el review number (contar schedules existentes + 1)
    const existingSchedules = await this.scheduleRepository.count({
      where: { patientId: dto.patientId },
    });

    const schedule = this.scheduleRepository.create({
      patientId: dto.patientId,
      mtprScheduleId: dto.mtprScheduleId,
      reviewNumber: existingSchedules + 1,
      scheduledDate: new Date(dto.scheduledDate),
      periodStartDate: patient.admissionDate,
      periodEndDate: new Date(dto.scheduledDate),
    });

    return await this.scheduleRepository.save(schedule);
  }

  /**
   * Genera una nota de junta multidisciplinaria
   * RF-031 a RF-033
   */
  async generateNote(
    scheduleId: string,
    dto: GenerateMultidisciplinaryNoteDto,
    userId?: string,
  ): Promise<GeneratedMultidisciplinaryNote> {
    // 1. Validar que el schedule existe
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['patient'],
    });

    if (!schedule) {
      throw new NotFoundException(
        `Multidisciplinary schedule con ID ${scheduleId} no encontrado`,
      );
    }

    if (schedule.isCompleted) {
      throw new BadRequestException('Esta junta ya ha sido completada');
    }

    // 2. Validar que hay al menos 2 participantes
    if (!dto.participants || dto.participants.length < 2) {
      throw new BadRequestException(
        'Debe haber al menos 2 participantes en la junta multidisciplinaria',
      );
    }

    // 3. Crear la nota
    const note = this.noteRepository.create({
      patientId: schedule.patientId,
      scheduleId: schedule.id,
      meetingDate: new Date(),
      reviewNumber: schedule.reviewNumber,
      participants: dto.participants,
      caseSummary: dto.caseSummary,
      teamDiscussion: dto.teamDiscussion,
      currentStatus: dto.currentStatus,
      recommendations: dto.recommendations,
      actionPlan: dto.actionPlan,
      followUpPlan: dto.followUpPlan,
      nextMeetingDate: dto.nextMeetingDate ? new Date(dto.nextMeetingDate) : undefined,
      generatedById: userId,
    });

    const savedNote = await this.noteRepository.save(note);

    // 4. Generar documento Word
    try {
      const noteWithRelations = await this.noteRepository.findOne({
        where: { id: savedNote.id },
        relations: ['patient', 'schedule'],
      });

      if (noteWithRelations) {
        const buffer = await this.wordTemplateService.generateNote(noteWithRelations);
        const fileName = this.wordTemplateService.generateFileName(
          schedule.patientId,
          schedule.reviewNumber,
        );
        const filePath = await this.wordTemplateService.saveDocument(buffer, fileName);

        savedNote.fileName = fileName;
        savedNote.filePath = filePath;
        await this.noteRepository.save(savedNote);
      }
    } catch (error) {
      console.error('Error generando documento Word de junta multidisciplinaria:', error);
    }

    // 5. Marcar schedule como completado
    schedule.isCompleted = true;
    schedule.completedDate = new Date();
    await this.scheduleRepository.save(schedule);

    return savedNote;
  }

  /**
   * Obtiene todos los schedules de un paciente
   */
  async getSchedulesByPatient(patientId: string): Promise<MultidisciplinarySchedule[]> {
    return await this.scheduleRepository.find({
      where: { patientId },
      relations: ['patient', 'generatedNote'],
      order: { scheduledDate: 'ASC' },
    });
  }

  /**
   * Obtiene un schedule específico
   */
  async getSchedule(scheduleId: string): Promise<MultidisciplinarySchedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: scheduleId },
      relations: ['patient', 'generatedNote'],
    });

    if (!schedule) {
      throw new NotFoundException(
        `Multidisciplinary schedule con ID ${scheduleId} no encontrado`,
      );
    }

    return schedule;
  }

  /**
   * Obtiene todas las notas de un paciente
   */
  async getNotesByPatient(patientId: string): Promise<GeneratedMultidisciplinaryNote[]> {
    return await this.noteRepository.find({
      where: { patientId },
      relations: ['patient', 'schedule'],
      order: { meetingDate: 'DESC' },
    });
  }

  /**
   * Obtiene una nota específica
   */
  async getNote(noteId: string): Promise<GeneratedMultidisciplinaryNote> {
    const note = await this.noteRepository.findOne({
      where: { id: noteId },
      relations: ['patient', 'schedule', 'generatedBy'],
    });

    if (!note) {
      throw new NotFoundException(
        `Multidisciplinary note con ID ${noteId} no encontrada`,
      );
    }

    return note;
  }
}
