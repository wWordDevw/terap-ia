import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { PatientGoal } from './entities/patient-goal.entity';
import { PatientDiagnosis } from './entities/patient-diagnosis.entity';
import { PatientDocument } from './entities/patient-document.entity';
import { PatientNote } from './entities/patient-note.entity';
import { AvailableDiagnosis } from './entities/available-diagnosis.entity';
import { GroupPatient } from '../groups/entities/group-patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { CreatePatientNoteDto } from './dto/create-patient-note.dto';
import { UpdatePatientNoteDto } from './dto/update-patient-note.dto';
import { User, UserRole } from '../users/entities/user.entity';

/**
 * Servicio de Pacientes - RF-004 a RF-006
 * Maneja la lógica de negocio para pacientes, goals, diagnósticos y documentos
 */
@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(PatientGoal)
    private readonly goalRepository: Repository<PatientGoal>,
    @InjectRepository(PatientDiagnosis)
    private readonly diagnosisRepository: Repository<PatientDiagnosis>,
    @InjectRepository(PatientDocument)
    private readonly documentRepository: Repository<PatientDocument>,
    @InjectRepository(PatientNote)
    private readonly noteRepository: Repository<PatientNote>,
    @InjectRepository(AvailableDiagnosis)
    private readonly availableDiagnosisRepository: Repository<AvailableDiagnosis>,
    @InjectRepository(GroupPatient)
    private readonly groupPatientRepository: Repository<GroupPatient>,
  ) {}

  /**
   * Verificar si el usuario puede acceder a un paciente
   * ADMIN: puede acceder a todos
   * THERAPIST/NURSE: puede acceder si son miembros de grupos donde está el paciente
   * Otros roles: solo pueden acceder a los que crearon
   */
  private async canAccessPatient(patient: Patient, user: User): Promise<boolean> {
    if (user.role === UserRole.ADMIN) {
      return true;
    }
    
    // Si el paciente fue creado por el usuario, tiene acceso
    if (patient.createdById === user.id) {
      return true;
    }
    
    // Para THERAPIST y NURSE: verificar si están en algún grupo con este paciente
    if (user.role === UserRole.THERAPIST || user.role === UserRole.NURSE) {
      const groupPatients = await this.groupPatientRepository
        .createQueryBuilder('gp')
        .innerJoinAndSelect('gp.group', 'group')
        .where('gp.patientId = :patientId', { patientId: patient.id })
        .andWhere('gp.isActive = :isActive', { isActive: true })
        .andWhere('group.isActive = :isActive', { isActive: true })
        .getMany();
      
      // Verificar si el terapeuta creador del grupo coincide con el usuario actual
      for (const gp of groupPatients) {
        const group = gp.group;
        if (group && group.createdById === user.id) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Verificar acceso y lanzar excepción si no tiene permisos
   */
  private async checkAccess(patient: Patient, user: User): Promise<void> {
    if (!await this.canAccessPatient(patient, user)) {
      throw new ForbiddenException('No tienes permisos para acceder a este paciente');
    }
  }

  /**
   * Crear un nuevo paciente - RF-004
   * Incluye 4 goals y diagnósticos
   */
  async create(createPatientDto: CreatePatientDto, user: User): Promise<Patient> {
    const { goals, diagnoses, ...patientData } = createPatientDto;

    // Verificar que no exista otro paciente con el mismo número
    const existing = await this.patientRepository.findOne({
      where: { patientNumber: patientData.patientNumber },
    });

    if (existing) {
      throw new BadRequestException(
        `Ya existe un paciente con el número ${patientData.patientNumber}`,
      );
    }

    try {
      // Crear paciente y asignar el creador
      const patient = this.patientRepository.create({
        ...patientData,
        createdBy: user,
      });
      const savedPatient = await this.patientRepository.save(patient);

      // Crear los 4 goals
      const goalsToCreate = goals.map((goal, index) => {
        return this.goalRepository.create({
          patientId: savedPatient.id,
          goalNumber: index + 1,
          goalText: goal.goalText,
        });
      });
      await this.goalRepository.save(goalsToCreate);

      // Crear diagnósticos
      const diagnosesToCreate = diagnoses.map((diagnosis) => {
        return this.diagnosisRepository.create({
          patientId: savedPatient.id,
          ...diagnosis,
        });
      });
      await this.diagnosisRepository.save(diagnosesToCreate);

      // Retornar paciente con relaciones
      return await this.findOne(savedPatient.id, user);
    } catch (error) {
      throw new BadRequestException(
        'Error al crear el paciente: ' + error.message,
      );
    }
  }

  /**
   * Obtener todos los pacientes
   * RF-005: Auto-completar Lista de Pacientes
   * ADMIN: ve todos los pacientes
   * Otros roles: solo ven los que crearon
   */
  async findAll(user: User, includeInactive = false): Promise<Patient[]> {
    const query = this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.clinic', 'clinic')
      .leftJoinAndSelect('patient.goals', 'goals')
      .leftJoinAndSelect('patient.diagnoses', 'diagnoses')
      .orderBy('goals.goalNumber', 'ASC');

    // Si no es admin, filtrar por creador
    if (user.role !== UserRole.ADMIN) {
      query.andWhere('patient.created_by = :userId', { userId: user.id });
    }

    if (!includeInactive) {
      query.andWhere('patient.isActive = :isActive', { isActive: true });
    }

    return await query.getMany();
  }

  /**
   * Obtener pacientes activos (sin discharge) que NO están en otros grupos activos
   * RF-005: Excluir pacientes que ya tuvieron discharge
   * ADMIN: ve todos los pacientes
   * Otros roles: solo ven los que crearon
   */
  async findActive(user: User): Promise<Patient[]> {
    // Primero obtener todos los pacientes activos
    const allPatients = await this.patientRepository.find({
      where: {
        isActive: true,
        dischargeDate: IsNull(),
        ...(user.role !== UserRole.ADMIN ? { createdById: user.id } : {}),
      },
      relations: ['clinic', 'goals', 'diagnoses'],
      order: {
        lastName: 'ASC',
        firstName: 'ASC',
      },
    });

    // Obtener IDs de pacientes que ya están en grupos activos
    const patientsInGroups = await this.groupPatientRepository
      .createQueryBuilder('gp')
      .leftJoin('gp.group', 'g')
      .select('gp.patientId')
      .where('gp.isActive = :isActive', { isActive: true })
      .andWhere('g.isActive = :groupActive', { groupActive: true })
      .getMany();

    const busyPatientIds = patientsInGroups.map(gp => gp.patientId);

    // Filtrar pacientes que NO están en grupos activos
    return allPatients.filter(patient => !busyPatientIds.includes(patient.id));
  }

  /**
   * Obtener un paciente por ID
   */
  async findOne(id: string, user: User): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: [
        'clinic',
        'goals',
        'diagnoses',
        'documents',
        'groupPatients',
        'groupPatients.group',
      ],
      order: {
        goals: { goalNumber: 'ASC' },
      },
    });

    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    // Verificar permisos
    await this.checkAccess(patient, user);

    return patient;
  }

  /**
   * Obtener paciente por número
   */
  async findByNumber(patientNumber: string, user: User): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { patientNumber },
      relations: ['clinic', 'goals', 'diagnoses', 'documents'],
      order: {
        goals: { goalNumber: 'ASC' },
      },
    });

    if (!patient) {
      throw new NotFoundException(
        `Paciente con número ${patientNumber} no encontrado`,
      );
    }

    // Verificar permisos
    await this.checkAccess(patient, user);

    return patient;
  }

  /**
   * Actualizar un paciente
   */
  async update(id: string, updatePatientDto: UpdatePatientDto, user: User): Promise<Patient> {
    const patient = await this.findOne(id, user);

    try {
      Object.assign(patient, updatePatientDto);
      await this.patientRepository.save(patient);
      return await this.findOne(id, user);
    } catch (error) {
      throw new BadRequestException(
        'Error al actualizar el paciente: ' + error.message,
      );
    }
  }

  /**
   * Desactivar un paciente (soft delete)
   */
  async remove(id: string, user: User): Promise<void> {
    const patient = await this.findOne(id, user);
    patient.isActive = false;
    await this.patientRepository.save(patient);
  }

  /**
   * Marcar discharge de un paciente - RF-006
   */
  async discharge(id: string, dischargeDate: Date, user: User): Promise<Patient> {
    const patient = await this.findOne(id, user);

    if (patient.dischargeDate) {
      throw new BadRequestException('El paciente ya tiene fecha de discharge');
    }

    patient.dischargeDate = dischargeDate;
    patient.isActive = false;
    await this.patientRepository.save(patient);

    return await this.findOne(id, user);
  }

  // ==================== GOALS ====================

  /**
   * Actualizar un goal específico - RF-013: Goals NO se pueden modificar
   * (excepto en casos autorizados)
   */
  async updateGoal(
    patientId: string,
    goalNumber: number,
    goalText: string,
    user: User,
  ): Promise<PatientGoal> {
    // Verificar permisos del paciente primero
    await this.findOne(patientId, user);

    const goal = await this.goalRepository.findOne({
      where: { patientId, goalNumber },
    });

    if (!goal) {
      throw new NotFoundException(
        `Goal ${goalNumber} no encontrado para este paciente`,
      );
    }

    goal.goalText = goalText;
    return await this.goalRepository.save(goal);
  }

  // ==================== DIAGNÓSTICOS ====================

  /**
   * Agregar un nuevo diagnóstico
   */
  async addDiagnosis(
    patientId: string,
    icd10Code: string,
    diagnosisDescription: string,
    user: User,
    isPrimary = false,
  ): Promise<PatientDiagnosis> {
    await this.findOne(patientId, user);

    // Si es primario, desmarcar otros como primarios
    if (isPrimary) {
      await this.diagnosisRepository.update(
        { patientId },
        { isPrimary: false },
      );
    }

    const diagnosis = this.diagnosisRepository.create({
      patientId,
      icd10Code,
      diagnosisDescription,
      isPrimary,
    });

    return await this.diagnosisRepository.save(diagnosis);
  }

  /**
   * Eliminar un diagnóstico
   */
  async removeDiagnosis(diagnosisId: string, user: User): Promise<void> {
    const diagnosis = await this.diagnosisRepository.findOne({
      where: { id: diagnosisId },
      relations: ['patient'],
    });

    if (!diagnosis) {
      throw new NotFoundException(`Diagnóstico con ID ${diagnosisId} no encontrado`);
    }

    // Verificar permisos del paciente
    await this.checkAccess(diagnosis.patient, user);

    await this.diagnosisRepository.remove(diagnosis);
  }

  // ==================== DIAGNÓSTICOS DISPONIBLES ====================

  /**
   * Obtener todos los diagnósticos disponibles en el sistema
   * Retorna los diagnósticos agrupados por categoría para uso en frontend
   */
  async getAvailableDiagnoses(): Promise<{
    categories: Record<string, Array<{
      id: string;
      code: string;
      diagnosis: string;
      category: string;
    }>>;
  }> {
    const diagnoses = await this.availableDiagnosisRepository.find({
      where: { isActive: true },
      order: { category: 'ASC', icd10Code: 'ASC' },
    });

    // Agrupar por categoría
    const categories: Record<string, Array<{
      id: string;
      code: string;
      diagnosis: string;
      category: string;
    }>> = {};

    diagnoses.forEach((diag) => {
      const category = diag.category || 'Other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({
        id: diag.id,
        code: diag.icd10Code,
        diagnosis: diag.diagnosisDescription,
        category: category,
      });
    });

    return { categories };
  }

  // ==================== DOCUMENTOS - RF-004, RF-036 ====================

  /**
   * Subir un documento del paciente
   */
  async uploadDocument(
    patientId: string,
    uploadDocumentDto: UploadDocumentDto,
    user: User,
    uploadedById?: string,
  ): Promise<PatientDocument> {
    await this.findOne(patientId, user);

    const document = this.documentRepository.create({
      patientId,
      ...uploadDocumentDto,
      uploadedById,
    });

    return await this.documentRepository.save(document);
  }

  /**
   * Obtener todos los documentos de un paciente
   */
  async getDocuments(patientId: string, user: User): Promise<PatientDocument[]> {
    await this.findOne(patientId, user);

    return await this.documentRepository.find({
      where: { patientId },
      relations: ['uploadedBy'],
      order: { uploadedAt: 'DESC' },
    });
  }

  /**
   * Obtener un documento por ID
   */
  async getDocument(documentId: string, user: User): Promise<PatientDocument> {
    const document = await this.documentRepository.findOne({
      where: { id: documentId },
      relations: ['patient', 'uploadedBy'],
    });

    if (!document) {
      throw new NotFoundException(`Documento con ID ${documentId} no encontrado`);
    }

    // Verificar permisos del paciente
    await this.checkAccess(document.patient, user);

    return document;
  }

  /**
   * Eliminar un documento
   * Nota: La eliminación física del archivo se debe hacer desde el controlador
   * usando el FileStorageService
   */
  async removeDocument(documentId: string, user: User): Promise<{ filePath: string }> {
    const document = await this.getDocument(documentId, user);
    const filePath = document.filePath;
    await this.documentRepository.remove(document);
    return { filePath }; // Devolver solo la ruta del archivo para eliminarlo físicamente
  }

  // ==================== MÉTODOS PARA NOTAS DEL PACIENTE ====================

  /**
   * Crear una nota para un paciente
   */
  async addNote(patientId: string, createNoteDto: CreatePatientNoteDto, user: User): Promise<PatientNote> {
    const patient = await this.findOne(patientId, user);
    
    const note = this.noteRepository.create({
      ...createNoteDto,
      patientId: patient.id,
      autor: user.fullName,
      autorRol: user.role,
      fecha: new Date(),
    });

    return await this.noteRepository.save(note);
  }

  /**
   * Obtener todas las notas de un paciente
   */
  async getNotes(patientId: string, user: User): Promise<PatientNote[]> {
    await this.findOne(patientId, user); // Verificar acceso al paciente
    
    return await this.noteRepository.find({
      where: { patientId },
      order: { fecha: 'DESC' },
    });
  }

  /**
   * Obtener una nota específica
   */
  async getNote(patientId: string, noteId: string, user: User): Promise<PatientNote> {
    await this.findOne(patientId, user); // Verificar acceso al paciente
    
    const note = await this.noteRepository.findOne({
      where: { id: noteId, patientId },
    });

    if (!note) {
      throw new NotFoundException(`Nota con ID ${noteId} no encontrada`);
    }

    return note;
  }

  /**
   * Actualizar una nota
   */
  async updateNote(patientId: string, noteId: string, updateNoteDto: UpdatePatientNoteDto, user: User): Promise<PatientNote> {
    const note = await this.getNote(patientId, noteId, user);
    
    Object.assign(note, updateNoteDto);
    return await this.noteRepository.save(note);
  }

  /**
   * Eliminar una nota
   */
  async deleteNote(patientId: string, noteId: string, user: User): Promise<void> {
    const note = await this.getNote(patientId, noteId, user);
    await this.noteRepository.remove(note);
  }

  /**
   * Verificar pacientes que deben ser cancelados automáticamente
   * Este método se ejecutaría en un cron job
   */
  async checkCancellations(): Promise<Patient[]> {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Buscar pacientes con discharge de ayer que no estén cancelados
    const patientsToCancel = await this.patientRepository.find({
      where: {
        dischargeDate: yesterday,
        cancellationDate: IsNull(),
        isActive: true,
      },
    });

    // Cancelar pacientes automáticamente
    for (const patient of patientsToCancel) {
      patient.cancellationDate = today;
      patient.isActive = false;
      await this.patientRepository.save(patient);
    }

    return patientsToCancel;
  }

  /**
   * Buscar pacientes por fecha de alta (para el cron job)
   */
  async findByDischargeDate(date: Date): Promise<Patient[]> {
    return await this.patientRepository.find({
      where: {
        dischargeDate: date,
        cancellationDate: IsNull(),
        isActive: true,
      },
    });
  }
}
