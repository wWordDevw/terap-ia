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
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { CreatePatientNoteDto } from './dto/create-patient-note.dto';
import { UpdatePatientNoteDto } from './dto/update-patient-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { FileStorageService } from '../../common/services/file-storage.service';
import { DocumentType } from './entities/patient-document.entity';
import { createReadStream } from 'fs';

/**
 * Controlador de Pacientes - RF-004 a RF-006
 * Gestiona los endpoints REST para pacientes
 * Requiere autenticación y rol de ADMIN, THERAPIST o NURSE
 */
@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.THERAPIST, UserRole.NURSE)
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  /**
   * POST /patients
   * Crear un nuevo paciente - RF-004
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createPatientDto: CreatePatientDto,
    @CurrentUser() user: User,
  ) {
    return this.patientsService.create(createPatientDto, user);
  }

  /**
   * GET /patients
   * Obtener todos los pacientes
   */
  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query('includeInactive') includeInactive?: string,
  ) {
    const include = includeInactive === 'true';
    return this.patientsService.findAll(user, include);
  }

  /**
   * GET /patients/active
   * Obtener solo pacientes activos (sin discharge) - RF-005
   */
  @Get('active')
  findActive(@CurrentUser() user: User) {
    return this.patientsService.findActive(user);
  }

  /**
   * GET /patients/diagnoses/available
   * Obtener todos los diagnósticos disponibles en el sistema
   * Endpoint para usar durante la creación de pacientes en el frontend
   * CRÍTICO: Debe estar ANTES de todas las rutas dinámicas (@Get(':id'), @Delete('diagnoses/:diagnosisId'), etc.)
   * para que NestJS la registre correctamente
   */
  @Get('diagnoses/available')
  getAvailableDiagnoses() {
    return this.patientsService.getAvailableDiagnoses();
  }

  /**
   * GET /patients/number/:patientNumber
   * Obtener paciente por número
   * IMPORTANTE: Debe estar ANTES de @Get(':id') para que funcione correctamente
   */
  @Get('number/:patientNumber')
  findByNumber(
    @Param('patientNumber') patientNumber: string,
    @CurrentUser() user: User,
  ) {
    return this.patientsService.findByNumber(patientNumber, user);
  }

  /**
   * GET /patients/:id
   * Obtener un paciente por ID
   * IMPORTANTE: Esta ruta debe estar DESPUÉS de todas las rutas específicas
   */
  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.patientsService.findOne(id, user);
  }

  /**
   * PATCH /patients/:id
   * Actualizar un paciente
   */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @CurrentUser() user: User,
  ) {
    return this.patientsService.update(id, updatePatientDto, user);
  }

  /**
   * DELETE /patients/:id
   * Desactivar un paciente (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.patientsService.remove(id, user);
  }

  /**
   * PATCH /patients/:id/discharge
   * Marcar discharge de un paciente - RF-006
   */
  @Patch(':id/discharge')
  discharge(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('dischargeDate') dischargeDate: Date,
    @CurrentUser() user: User,
  ) {
    return this.patientsService.discharge(id, new Date(dischargeDate), user);
  }

  // ==================== GOALS ====================

  /**
   * PATCH /patients/:id/goals/:goalNumber
   * Actualizar un goal específico
   */
  @Patch(':id/goals/:goalNumber')
  updateGoal(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('goalNumber') goalNumber: string,
    @Body('goalText') goalText: string,
    @CurrentUser() user: User,
  ) {
    return this.patientsService.updateGoal(id, parseInt(goalNumber), goalText, user);
  }

  // ==================== DIAGNÓSTICOS ====================

  /**
   * POST /patients/:id/diagnoses
   * Agregar un nuevo diagnóstico
   */
  @Post(':id/diagnoses')
  @HttpCode(HttpStatus.CREATED)
  addDiagnosis(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('icd10Code') icd10Code: string,
    @Body('diagnosisDescription') diagnosisDescription: string,
    @Body('isPrimary') isPrimary: boolean,
    @CurrentUser() user: User,
  ) {
    return this.patientsService.addDiagnosis(
      id,
      icd10Code,
      diagnosisDescription,
      user,
      isPrimary,
    );
  }

  /**
   * DELETE /patients/diagnoses/:diagnosisId
   * Eliminar un diagnóstico
   */
  @Delete('diagnoses/:diagnosisId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeDiagnosis(
    @Param('diagnosisId', ParseUUIDPipe) diagnosisId: string,
    @CurrentUser() user: User,
  ) {
    return this.patientsService.removeDiagnosis(diagnosisId, user);
  }

  // ==================== DOCUMENTOS - RF-004, RF-036 ====================

  /**
   * POST /patients/:id/documents
   * Subir un documento del paciente con archivo
   */
  @Post(':id/documents')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Param('id', ParseUUIDPipe) patientId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('documentType') documentType: DocumentType,
    @CurrentUser() user: User,
    @Body('description') description?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún archivo');
    }

    // Validar tipo de archivo
    if (!this.fileStorageService.validateFileType(file.mimetype)) {
      throw new BadRequestException(
        'Tipo de archivo no permitido. Solo se permiten PDF, imágenes y documentos de Office.',
      );
    }

    // Validar tamaño (10MB máximo)
    if (!this.fileStorageService.validateFileSize(file.size)) {
      throw new BadRequestException(
        'El archivo es demasiado grande. El tamaño máximo es 10MB.',
      );
    }

    // Guardar archivo físicamente
    const { filename, filepath } = await this.fileStorageService.saveFile(
      file,
      'patients',
    );

    // Guardar registro en base de datos
    const document = await this.patientsService.uploadDocument(
      patientId,
      {
        documentType: documentType || DocumentType.OTHER,
        documentName: file.originalname,
        filePath: filepath,
        fileSize: file.size,
      },
      user,
    );

    return document;
  }

  /**
   * GET /patients/:id/documents
   * Obtener todos los documentos de un paciente
   */
  @Get(':id/documents')
  getDocuments(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.patientsService.getDocuments(id, user);
  }

  /**
   * GET /patients/documents/:documentId/download
   * Descargar un documento
   */
  @Get('documents/:documentId/download')
  async downloadDocument(
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @Res({ passthrough: true }) res: Response,
    @CurrentUser() user: User,
  ): Promise<StreamableFile> {
    const document = await this.patientsService.getDocument(documentId, user);

    const filePath = this.fileStorageService.getAbsolutePath(
      document.filePath,
    );

    // Verificar que el archivo existe
    if (!(await this.fileStorageService.fileExists(document.filePath))) {
      throw new BadRequestException('El archivo no existe en el servidor');
    }

    const file = createReadStream(filePath);

    // Establecer headers para descarga
    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${document.documentName}"`,
    });

    return new StreamableFile(file);
  }

  /**
   * DELETE /patients/documents/:documentId
   * Eliminar un documento (registro y archivo físico)
   */
  @Delete('documents/:documentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeDocument(
    @Param('documentId', ParseUUIDPipe) documentId: string,
    @CurrentUser() user: User,
  ) {
    const { filePath } = await this.patientsService.removeDocument(documentId, user);

    // Eliminar archivo físico
    await this.fileStorageService.deleteFile(filePath);

    return;
  }

  // ==================== ENDPOINTS PARA NOTAS DEL PACIENTE ====================

  /**
   * GET /patients/:id/notes
   * Obtener todas las notas de un paciente
   */
  @Get(':id/notes')
  async getNotes(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.patientsService.getNotes(id, user);
  }

  /**
   * POST /patients/:id/notes
   * Crear una nota para un paciente
   */
  @Post(':id/notes')
  @HttpCode(HttpStatus.CREATED)
  async addNote(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createNoteDto: CreatePatientNoteDto,
    @CurrentUser() user: User,
  ) {
    return await this.patientsService.addNote(id, createNoteDto, user);
  }

  /**
   * GET /patients/:id/notes/:noteId
   * Obtener una nota específica
   */
  @Get(':id/notes/:noteId')
  async getNote(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @CurrentUser() user: User,
  ) {
    return await this.patientsService.getNote(id, noteId, user);
  }

  /**
   * PATCH /patients/:id/notes/:noteId
   * Actualizar una nota
   */
  @Patch(':id/notes/:noteId')
  async updateNote(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Body() updateNoteDto: UpdatePatientNoteDto,
    @CurrentUser() user: User,
  ) {
    return await this.patientsService.updateNote(id, noteId, updateNoteDto, user);
  }

  /**
   * DELETE /patients/:id/notes/:noteId
   * Eliminar una nota
   */
  @Delete(':id/notes/:noteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteNote(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @CurrentUser() user: User,
  ) {
    await this.patientsService.deleteNote(id, noteId, user);
  }
}
