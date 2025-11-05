import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PatientsService } from './patients.service';

/**
 * Servicio de Cancelación Automática de Pacientes
 * Maneja la cancelación automática de pacientes un día después de su alta
 */
@Injectable()
export class PatientCancellationService {
  private readonly logger = new Logger(PatientCancellationService.name);

  constructor(private readonly patientsService: PatientsService) {}

  /**
   * Cron job que se ejecuta todos los días a medianoche
   * Verifica y cancela pacientes que deben ser cancelados automáticamente
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCancellations() {
    this.logger.log('Iniciando verificación de cancelaciones automáticas...');

    try {
      const cancelledPatients = await this.patientsService.checkCancellations();

      if (cancelledPatients.length > 0) {
        this.logger.log(`${cancelledPatients.length} pacientes cancelados automáticamente:`);
        
        for (const patient of cancelledPatients) {
          this.logger.log(`- Paciente ${patient.firstName} ${patient.lastName} (ID: ${patient.id}) cancelado`);
        }
      } else {
        this.logger.log('No hay pacientes para cancelar automáticamente');
      }
    } catch (error) {
      this.logger.error('Error durante la cancelación automática:', error);
    }
  }

  /**
   * Método manual para ejecutar la cancelación (para testing)
   */
  async manualCancellationCheck() {
    this.logger.log('Ejecutando verificación manual de cancelaciones...');
    return await this.handleCancellations();
  }
}
