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
import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

/**
 * Controlador de Clínicas - RF-037
 * Gestiona los endpoints REST para clínicas
 * Requiere autenticación y rol de ADMIN
 */
@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  /**
   * GET /clinics/public
   * Obtener clínicas activas (público, sin autenticación)
   */
  @Get('public')
  findActiveClinics() {
    return this.clinicsService.findActiveClinics();
  }

  /**
   * POST /clinics
   * Crear una nueva clínica
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClinicDto: CreateClinicDto) {
    return this.clinicsService.create(createClinicDto);
  }

  /**
   * GET /clinics
   * Obtener todas las clínicas
   * Query param: includeInactive=true para incluir inactivas
   */
  @Get()
  findAll(@Query('includeInactive') includeInactive?: string) {
    const include = includeInactive === 'true';
    return this.clinicsService.findAll(include);
  }

  /**
   * GET /clinics/:id
   * Obtener una clínica por ID
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.clinicsService.findOne(id);
  }

  /**
   * PATCH /clinics/:id
   * Actualizar una clínica
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClinicDto: UpdateClinicDto,
  ) {
    return this.clinicsService.update(id, updateClinicDto);
  }

  /**
   * DELETE /clinics/:id
   * Desactivar una clínica (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.clinicsService.remove(id);
  }

  /**
   * PATCH /clinics/:id/activate
   * Activar una clínica desactivada
   */
  @Patch(':id/activate')
  activate(@Param('id', ParseUUIDPipe) id: string) {
    return this.clinicsService.activate(id);
  }
}
