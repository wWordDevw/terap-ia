import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CreateSubactivityDto } from './dto/create-subactivity.dto';
import { CreateParagraphDto } from './dto/create-paragraph.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

/**
 * Controlador de Actividades
 * Gestiona los endpoints REST para actividades, subactividades y párrafos
 * Requiere autenticación y rol de ADMIN o THERAPIST
 */
@Controller('activities')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.THERAPIST)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  // ==================== ACTIVIDADES ====================

  /**
   * POST /activities
   * Crear una nueva actividad
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }

  /**
   * GET /activities/basic
   * Obtener todas las actividades sin subactividades ni párrafos
   * Query params:
   * - includeInactive: boolean (opcional) - Incluir actividades inactivas
   * - activityType: string (opcional) - Filtrar por tipo: 'PHP' o 'IOP'
   */
  @Get('basic')
  findAllBasic(
    @Query('includeInactive') includeInactive?: string,
    @Query('activityType') activityType?: string,
  ) {
    const include = includeInactive === 'true';
    return this.activitiesService.findAllBasic(include, activityType);
  }

  /**
   * GET /activities
   * Obtener todas las actividades con sus subactividades y párrafos
   * Query params:
   * - includeInactive: boolean (opcional) - Incluir actividades inactivas
   * - activityType: string (opcional) - Filtrar por tipo: 'PHP' o 'IOP'
   */
  @Get()
  findAll(
    @Query('includeInactive') includeInactive?: string,
    @Query('activityType') activityType?: string,
  ) {
    const include = includeInactive === 'true';
    return this.activitiesService.findAll(include, activityType);
  }

  /**
   * GET /activities/:id
   * Obtener una actividad por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.activitiesService.findOne(id);
  }

  /**
   * PATCH /activities/:id
   * Actualizar una actividad
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(id, updateActivityDto);
  }

  /**
   * DELETE /activities/:id
   * Desactivar una actividad (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.activitiesService.remove(id);
  }

  // ==================== SUBACTIVIDADES ====================

  /**
   * POST /activities/:id/subactivities
   * Crear una subactividad
   */
  @Post(':id/subactivities')
  @HttpCode(HttpStatus.CREATED)
  createSubactivity(
    @Param('id', ParseUUIDPipe) activityId: string,
    @Body() createSubactivityDto: CreateSubactivityDto,
  ) {
    createSubactivityDto.activityId = activityId;
    return this.activitiesService.createSubactivity(createSubactivityDto);
  }

  /**
   * GET /activities/:id/subactivities
   * Obtener todas las subactividades de una actividad
   */
  @Get(':id/subactivities')
  getSubactivities(@Param('id', ParseUUIDPipe) activityId: string) {
    return this.activitiesService.getSubactivities(activityId);
  }

  /**
   * DELETE /activities/subactivities/:subactivityId
   * Eliminar una subactividad
   */
  @Delete('subactivities/:subactivityId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeSubactivity(
    @Param('subactivityId', ParseUUIDPipe) subactivityId: string,
  ) {
    return this.activitiesService.removeSubactivity(subactivityId);
  }

  // ==================== PÁRRAFOS - RF-015, RF-034 ====================

  /**
   * POST /activities/:id/paragraphs
   * Crear un párrafo predefinido
   */
  @Post(':id/paragraphs')
  @HttpCode(HttpStatus.CREATED)
  createParagraph(
    @Param('id', ParseUUIDPipe) activityId: string,
    @Body() createParagraphDto: CreateParagraphDto,
  ) {
    createParagraphDto.activityId = activityId;
    return this.activitiesService.createParagraph(createParagraphDto);
  }

  /**
   * GET /activities/:id/paragraphs
   * Obtener todos los párrafos de una actividad
   * Query param opcional: subactivityId
   */
  @Get(':id/paragraphs')
  getParagraphs(
    @Param('id', ParseUUIDPipe) activityId: string,
    @Query('subactivityId') subactivityId?: string,
  ) {
    return this.activitiesService.getParagraphs(activityId, subactivityId);
  }

  /**
   * GET /activities/:id/paragraphs/next
   * Obtener próximo párrafo para rotación - RF-034
   */
  @Get(':id/paragraphs/next')
  getNextParagraph(
    @Param('id', ParseUUIDPipe) activityId: string,
    @Query('subactivityId') subactivityId?: string,
  ) {
    return this.activitiesService.getNextParagraph(activityId, subactivityId);
  }

  /**
   * PATCH /activities/paragraphs/:paragraphId/increment-usage
   * Incrementar contador de uso de un párrafo
   */
  @Patch('paragraphs/:paragraphId/increment-usage')
  @HttpCode(HttpStatus.NO_CONTENT)
  incrementParagraphUsage(
    @Param('paragraphId', ParseUUIDPipe) paragraphId: string,
  ) {
    return this.activitiesService.incrementParagraphUsage(paragraphId);
  }

  /**
   * POST /activities/:id/paragraphs/reset-usage
   * Resetear contadores de uso
   */
  @Post(':id/paragraphs/reset-usage')
  @HttpCode(HttpStatus.NO_CONTENT)
  resetParagraphUsage(@Param('id', ParseUUIDPipe) activityId: string) {
    return this.activitiesService.resetParagraphUsage(activityId);
  }

  /**
   * DELETE /activities/paragraphs/:paragraphId
   * Eliminar un párrafo
   */
  @Delete('paragraphs/:paragraphId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeParagraph(@Param('paragraphId', ParseUUIDPipe) paragraphId: string) {
    return this.activitiesService.removeParagraph(paragraphId);
  }
}
