import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  StreamableFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';
import { User } from '../users/entities/user.entity';

@Controller('notes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.THERAPIST)
export class NotesControllerSimple {
  
  /**
   * POST /notes/generate-group-week
   * Endpoint temporal para probar la funcionalidad
   */
  @Post('generate-group-week')
  @HttpCode(HttpStatus.OK)
  async generateGroupWeekNotes(
    @Body() dto: { groupId: string; weekId: string },
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    
    // Crear un buffer simple para prueba
    const testContent = `Test RAR file for group ${dto.groupId} and week ${dto.weekId}`;
    const buffer = Buffer.from(testContent, 'utf8');
    
    // Configurar headers para descarga
    res.set({
      'Content-Type': 'application/x-rar-compressed',
      'Content-Disposition': `attachment; filename="Group_Week_${Date.now()}.rar"`,
    });

    return new StreamableFile(buffer);
  }
}
