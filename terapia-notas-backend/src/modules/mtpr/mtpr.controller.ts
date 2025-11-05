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
import { MtprService } from './mtpr.service';
import { GenerateMtprDto } from './dto/generate-mtpr.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { User } from '../users/entities/user.entity';
import * as fs from 'fs';
import { createReadStream } from 'fs';

/**
 * Controlador de MTPR (Master Treatment Plan Review)
 * RF-018 a RF-027
 */
@Controller('mtpr')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.THERAPIST)
export class MtprController {
  constructor(private readonly mtprService: MtprService) {}

  /**
   * POST /mtpr/generate/:scheduleId
   * Generar un MTPR para un schedule específico
   */
  @Post('generate/:scheduleId')
  @HttpCode(HttpStatus.CREATED)
  async generateMtpr(
    @Param('scheduleId', ParseUUIDPipe) scheduleId: string,
    @Body() generateMtprDto: GenerateMtprDto,
    @CurrentUser() user: User,
  ) {
    return await this.mtprService.generateMtpr(scheduleId, generateMtprDto, user.id);
  }

  /**
   * GET /mtpr/patient/:patientId
   * Obtener todos los MTRPs de un paciente
   */
  @Get('patient/:patientId')
  async getMtprsByPatient(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return await this.mtprService.findByPatient(patientId);
  }

  /**
   * GET /mtpr/:id
   * Obtener un MTPR específico por ID
   */
  @Get(':id')
  async getMtpr(@Param('id', ParseUUIDPipe) id: string) {
    return await this.mtprService.findOne(id);
  }

  /**
   * GET /mtpr/:id/download
   * Descargar un MTPR en formato Word
   */
  @Get(':id/download')
  async downloadMtpr(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const mtpr = await this.mtprService.findOne(id);

    // Verificar que el archivo existe
    if (!mtpr.filePath || !fs.existsSync(mtpr.filePath)) {
      throw new NotFoundException('Archivo de documento Word no encontrado');
    }

    // Configurar headers para descarga
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${mtpr.fileName}"`,
    });

    // Crear stream del archivo y retornarlo
    const file = createReadStream(mtpr.filePath);
    return new StreamableFile(file);
  }

  /**
   * GET /mtpr/schedules/patient/:patientId
   * Obtener todos los schedules de MTPR de un paciente
   */
  @Get('schedules/patient/:patientId')
  async getSchedulesByPatient(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return await this.mtprService.getSchedulesByPatient(patientId);
  }

  /**
   * GET /mtpr/schedule/:scheduleId
   * Obtener un schedule específico de MTPR
   */
  @Get('schedule/:scheduleId')
  async getSchedule(@Param('scheduleId', ParseUUIDPipe) scheduleId: string) {
    return await this.mtprService.getSchedule(scheduleId);
  }
}
