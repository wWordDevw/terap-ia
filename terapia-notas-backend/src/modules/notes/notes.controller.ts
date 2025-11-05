import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  StreamableFile,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { NotesService } from './notes.service';
// import { GenerateWeekNotesDto } from './dto/generate-week-notes.dto';
// import { GenerateDayNoteDto } from './dto/generate-day-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { User } from '../users/entities/user.entity';

@Controller('notes')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.ADMIN, UserRole.THERAPIST)
export class NotesController {
  
  constructor(private readonly notesService: NotesService) {}

  /**
   * POST /notes/generate-group-week
   * Generar notas semanales completas para un grupo
   */
  @Post('generate-group-week')
  @HttpCode(HttpStatus.OK)
  async generateGroupWeekNotes(
    @Body() dto: { groupId: string; weekId: string },
    // @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    // Usuario mock para testing
    const user: any = { id: 'test-user', role: UserRole.ADMIN };
    const buffer = await this.notesService.generateGroupWeekNotes(dto, user);
    
    // DEBUG: Validar y loggear el buffer
    console.log(`[CONTROLLER] Buffer recibido del servicio: ${buffer?.length || 0} bytes`);
    console.log(`[CONTROLLER] Es Buffer: ${Buffer.isBuffer(buffer)}`);
    console.log(`[CONTROLLER] Header ZIP (primeros 4 bytes): ${buffer ? buffer.slice(0, 4).toString('hex') : 'N/A'}`);
    
    // Validar que el buffer no esté vacío
    if (!buffer || buffer.length === 0) {
      throw new BadRequestException('El ZIP generado está vacío');
    }

    // Verificar que el ZIP tiene el header correcto (PK)
    if (buffer[0] !== 0x50 || buffer[1] !== 0x4B) {
      console.error(`[CONTROLLER] ⚠️ ZIP no tiene header válido. Primeros bytes: ${buffer.slice(0, 8).toString('hex')}`);
      throw new BadRequestException('El ZIP generado está corrupto (no tiene header PK válido)');
    }

    // Verificar EOCD (End of Central Directory)
    const eocdOffset = buffer.length - 22;
    if (eocdOffset >= 0) {
      const eocdSignature = buffer.slice(eocdOffset, eocdOffset + 4);
      const hasValidEocd = eocdSignature[0] === 0x50 && eocdSignature[1] === 0x4B && 
                          eocdSignature[2] === 0x05 && eocdSignature[3] === 0x06;
      if (!hasValidEocd) {
        console.error(`[CONTROLLER] ⚠️ ZIP EOCD inválido: ${eocdSignature.toString('hex')} (esperado: 504b0506)`);
        console.error(`[CONTROLLER] Últimos 30 bytes: ${buffer.slice(-30).toString('hex')}`);
      } else {
        console.log(`[CONTROLLER] ✅ EOCD válido: ${eocdSignature.toString('hex')}`);
      }
    }

    // Crear una copia del buffer para asegurar que no se modifique
    const safeBuffer = Buffer.from(buffer);

    // DEBUG: Guardar el ZIP en el servidor para verificación (opcional, solo para debug)
    try {
      const fs = require('fs');
      const debugPath = `/app/debug-zip-${Date.now()}.zip`;
      fs.writeFileSync(debugPath, safeBuffer);
      console.log(`[CONTROLLER] 💾 ZIP guardado para debug: ${debugPath} (${safeBuffer.length} bytes)`);
    } catch (debugErr) {
      console.warn(`[CONTROLLER] ⚠️ No se pudo guardar debug ZIP: ${debugErr.message}`);
    }

    // Configurar headers para descarga (sin passthrough, controlamos la respuesta directamente)
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="Group_Week_${Date.now()}.zip"`,
      'Content-Length': safeBuffer.length.toString(),
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });

    console.log(`[CONTROLLER] ✅ Enviando ZIP: ${safeBuffer.length} bytes, header: ${safeBuffer.slice(0, 2).toString('hex')}`);
    console.log(`[CONTROLLER] ✅ Últimos 10 bytes del ZIP: ${safeBuffer.slice(-10).toString('hex')}`);
    console.log(`[CONTROLLER] ✅ EOCD bytes: ${safeBuffer.slice(eocdOffset, eocdOffset + 4).toString('hex')}`);
    
    // Enviar el buffer directamente usando res.send() en lugar de StreamableFile
    res.send(safeBuffer);
  }

  /**
   * POST /notes/generate-group-day
   * Generar nota diaria para un grupo (OFICIAL - PHP Template Simple)
   * Usa PHP_CLEAN_TEMPLATE_SIMPLE.docx con soporte automático para notas de ausencia
   */
  @Post('generate-group-day')
  @HttpCode(HttpStatus.OK)
  async generateGroupDayNote(
    @Body() dto: { groupId: string; date: string },
    // @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    // Usuario mock para testing
    const user: any = { id: 'test-user', role: UserRole.ADMIN };
    const buffer = await this.notesService.generateGroupDayNote(dto, user);
    
    // Configurar headers para descarga
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="Group_Day_${dto.date.replace(/-/g, '')}.docx"`,
      'Content-Length': buffer.length,
    });

    return new StreamableFile(buffer);
  }

  /**
   * POST /notes/generate-individual-notes
   * Generar notas individuales por paciente para un grupo (OFICIAL - PHP Template Simple)
   * Retorna un ZIP con documentos separados por paciente
   * Incluye automáticamente notas de ausencia para pacientes que no asistieron
   */
  @Post('generate-individual-notes')
  @HttpCode(HttpStatus.OK)
  async generateIndividualNotes(
    @Body() dto: { groupId: string; date: string },
    // @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    // Convertir groupId a número (el método espera número pero el DTO es string)
    const groupIdNumber = typeof dto.groupId === 'string' ? parseInt(dto.groupId, 10) : dto.groupId;
    
    if (isNaN(groupIdNumber)) {
      throw new BadRequestException(`Invalid groupId: ${dto.groupId}`);
    }
    
    const buffer = await this.notesService.generateIndividualPatientNotes(groupIdNumber, dto.date);
    
    // Configurar headers para descarga de ZIP
    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="Individual_Notes_Group_${dto.groupId}_${dto.date.replace(/-/g, '')}.zip"`,
      'Content-Length': buffer.length,
    });

    return new StreamableFile(buffer);
  }
}