import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clinic } from './entities/clinic.entity';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';

/**
 * Servicio de Clínicas - RF-037: Configuración de Clínica
 * Maneja la lógica de negocio para clínicas
 */
@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,
  ) {}

  /**
   * Obtener clínicas activas (público)
   */
  async findActiveClinics(): Promise<Clinic[]> {
    return await this.clinicRepository.find({
      where: { isActive: true },
      select: ['id', 'clinicName', 'address', 'phone', 'email'],
    });
  }

  /**
   * Crear una nueva clínica
   */
  async create(createClinicDto: CreateClinicDto): Promise<Clinic> {
    try {
      const clinic = this.clinicRepository.create(createClinicDto);
      return await this.clinicRepository.save(clinic);
    } catch (error) {
      throw new BadRequestException(
        'Error al crear la clínica: ' + error.message,
      );
    }
  }

  /**
   * Obtener todas las clínicas
   */
  async findAll(includeInactive = false): Promise<Clinic[]> {
    const query = this.clinicRepository.createQueryBuilder('clinic');

    if (!includeInactive) {
      query.where('clinic.isActive = :isActive', { isActive: true });
    }

    return await query
      .leftJoinAndSelect('clinic.users', 'users')
      .leftJoinAndSelect('clinic.groups', 'groups')
      .orderBy('clinic.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Obtener una clínica por ID
   */
  async findOne(id: string): Promise<Clinic> {
    const clinic = await this.clinicRepository.findOne({
      where: { id },
      relations: ['users', 'groups', 'patients'],
    });

    if (!clinic) {
      throw new NotFoundException(`Clínica con ID ${id} no encontrada`);
    }

    return clinic;
  }

  /**
   * Actualizar una clínica
   */
  async update(id: string, updateClinicDto: UpdateClinicDto): Promise<Clinic> {
    const clinic = await this.findOne(id);

    try {
      Object.assign(clinic, updateClinicDto);
      return await this.clinicRepository.save(clinic);
    } catch (error) {
      throw new BadRequestException(
        'Error al actualizar la clínica: ' + error.message,
      );
    }
  }

  /**
   * Desactivar una clínica (soft delete)
   */
  async remove(id: string): Promise<void> {
    const clinic = await this.findOne(id);
    clinic.isActive = false;
    await this.clinicRepository.save(clinic);
  }

  /**
   * Activar una clínica
   */
  async activate(id: string): Promise<Clinic> {
    const clinic = await this.findOne(id);
    clinic.isActive = true;
    return await this.clinicRepository.save(clinic);
  }
}
