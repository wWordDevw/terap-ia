import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
  Res,
  StreamableFile,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { MultidisciplinaryService } from './multidisciplinary.service';
import { GenerateMultidisciplinaryNoteDto } from './dto/generate-multidisciplinary-note.dto';
import { ScheduleMultidisciplinaryDto } from './dto/schedule-multidisciplinary.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { User } from '../users/entities/user.entity';
import * as fs from 'fs';
import { createReadStream } from 'fs';

/**
 * Controlador de juntas multidisciplinarias
 * RF-031 a RF-033
 */
@Controller('multidisciplinary')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.THERAPIST)
export class MultidisciplinaryController {
  constructor(private readonly multidisciplinaryService: MultidisciplinaryService) {}

  /**
   * POST /multidisciplinary/schedules
   * Programar una junta multidisciplinaria
   */
  @Post('schedules')
  @HttpCode(HttpStatus.CREATED)
  async scheduleMultidisciplinary(@Body() dto: ScheduleMultidisciplinaryDto) {
    return await this.multidisciplinaryService.scheduleMultidisciplinary(dto);
  }

  /**
   * GET /multidisciplinary/schedules/patient/:patientId
   * Obtener todos los schedules de un paciente
   */
  @Get('schedules/patient/:patientId')
  async getSchedulesByPatient(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return await this.multidisciplinaryService.getSchedulesByPatient(patientId);
  }

  /**
   * GET /multidisciplinary/schedules/:scheduleId
   * Obtener un schedule específico
   */
  @Get('schedules/:scheduleId')
  async getSchedule(@Param('scheduleId', ParseUUIDPipe) scheduleId: string) {
    return await this.multidisciplinaryService.getSchedule(scheduleId);
  }

  /**
   * POST /multidisciplinary/notes/generate/:scheduleId
   * Generar nota de junta multidisciplinaria
   */
  @Post('notes/generate/:scheduleId')
  @HttpCode(HttpStatus.CREATED)
  async generateNote(
    @Param('scheduleId', ParseUUIDPipe) scheduleId: string,
    @Body() dto: GenerateMultidisciplinaryNoteDto,
    @CurrentUser() user: User,
  ) {
    return await this.multidisciplinaryService.generateNote(scheduleId, dto, user.id);
  }

  /**
   * GET /multidisciplinary/notes/patient/:patientId
   * Obtener todas las notas de un paciente
   */
  @Get('notes/patient/:patientId')
  async getNotesByPatient(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return await this.multidisciplinaryService.getNotesByPatient(patientId);
  }

  /**
   * GET /multidisciplinary/notes/:noteId
   * Obtener una nota específica
   */
  @Get('notes/:noteId')
  async getNote(@Param('noteId', ParseUUIDPipe) noteId: string) {
    return await this.multidisciplinaryService.getNote(noteId);
  }

  /**
   * GET /multidisciplinary/notes/:noteId/download
   * Descargar nota en formato Word
   */
  @Get('notes/:noteId/download')
  async downloadNote(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const note = await this.multidisciplinaryService.getNote(noteId);

    // Verificar que el archivo existe
    if (!note.filePath || !fs.existsSync(note.filePath)) {
      throw new NotFoundException('Archivo de documento Word no encontrado');
    }

    // Configurar headers para descarga
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${note.fileName}"`,
    });

    // Crear stream del archivo y retornarlo
    const file = createReadStream(note.filePath);
    return new StreamableFile(file);
  }
}
