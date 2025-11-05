/**
 * MTPR Service
 * Servicio para la gestión de Master Treatment Plan Review (MTPR)
 * Maneja el cálculo de fechas y la escalación de progreso de diagnósticos
 */

export interface MTPRDate {
  mtprNumber: number;
  dueDate: Date;
  isPast: boolean;
  isGenerated: boolean;
}

export type ProgressLevel = 'No Progress' | 'Minimal Progress' | 'Moderate Progress';

export interface DiagnosisProgress {
  codigo: string;
  descripcion: string;
  progress: ProgressLevel;
}

export interface MTPRData {
  patient: any; // Patient type from your system
  mtprNumber: number;
  progress: DiagnosisProgress[];
  goals: string[];
  dueDate: Date;
}

class MTPRService {
  /**
   * Calcula todas las fechas de MTPR basadas en la fecha de admisión
   * Primera MTPR: 18 días después de la admisión
   * Subsecuentes: Cada 30 días
   * Salta domingos (mueve a lunes)
   */
  calculateMTPRDates(admissionDate: Date, count: number = 12): MTPRDate[] {
    const mtprDates: MTPRDate[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Primera MTPR: +18 días
    let currentDate = this.addDays(new Date(admissionDate), 18);
    currentDate = this.skipSunday(currentDate);

    mtprDates.push({
      mtprNumber: 1,
      dueDate: new Date(currentDate),
      isPast: currentDate < today,
      isGenerated: false // Este campo se debe actualizar desde el componente
    });

    // MTPRs subsecuentes: +30 días cada uno
    for (let i = 2; i <= count; i++) {
      currentDate = this.addDays(currentDate, 30);
      currentDate = this.skipSunday(currentDate);

      mtprDates.push({
        mtprNumber: i,
        dueDate: new Date(currentDate),
        isPast: currentDate < today,
        isGenerated: false
      });
    }

    return mtprDates;
  }

  /**
   * Calcula el progreso de cada diagnóstico basado en el número de MTPR
   * Reglas de escalación:
   * - MTPR #1: Todos "No Progress"
   * - MTPR #2: Último diagnóstico → "Minimal Progress"
   * - MTPR #3: Últimos 2 diagnósticos → "Minimal Progress"
   * - MTPR #4: Último → "Moderate Progress", Penúltimo → "Minimal Progress"
   * - MTPR #5+: Últimos 2 → "Moderate Progress", Tercero → "Minimal Progress"
   */
  calculateProgress(
    diagnosticos: Array<{ codigo: string; descripcion: string }>,
    mtprNumber: number
  ): DiagnosisProgress[] {
    const progress: DiagnosisProgress[] = diagnosticos.map((diag, index) => ({
      codigo: diag.codigo,
      descripcion: diag.descripcion,
      progress: this.getProgressLevel(index, diagnosticos.length, mtprNumber)
    }));

    return progress;
  }

  /**
   * Determina el nivel de progreso para un diagnóstico específico
   */
  private getProgressLevel(
    index: number,
    totalDiagnoses: number,
    mtprNumber: number
  ): ProgressLevel {
    const positionFromEnd = totalDiagnoses - index;

    // MTPR #1: Todos "No Progress"
    if (mtprNumber === 1) {
      return 'No Progress';
    }

    // MTPR #2: Último diagnóstico → "Minimal Progress"
    if (mtprNumber === 2) {
      return positionFromEnd === 1 ? 'Minimal Progress' : 'No Progress';
    }

    // MTPR #3: Últimos 2 diagnósticos → "Minimal Progress"
    if (mtprNumber === 3) {
      return positionFromEnd <= 2 ? 'Minimal Progress' : 'No Progress';
    }

    // MTPR #4: Último → "Moderate", Penúltimo → "Minimal"
    if (mtprNumber === 4) {
      if (positionFromEnd === 1) return 'Moderate Progress';
      if (positionFromEnd === 2) return 'Minimal Progress';
      return 'No Progress';
    }

    // MTPR #5+: Últimos 2 → "Moderate", Tercero → "Minimal"
    if (mtprNumber >= 5) {
      if (positionFromEnd === 1 || positionFromEnd === 2) return 'Moderate Progress';
      if (positionFromEnd === 3) return 'Minimal Progress';
      return 'No Progress';
    }

    return 'No Progress';
  }

  /**
   * Si la fecha cae en domingo, mueve al lunes
   */
  private skipSunday(date: Date): Date {
    const result = new Date(date);
    if (result.getDay() === 0) { // 0 = Sunday
      result.setDate(result.getDate() + 1);
    }
    return result;
  }

  /**
   * Agrega días a una fecha
   */
  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Formatea una fecha para mostrar en formato legible
   */
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }

  /**
   * Obtiene el color de estado para una MTPR
   */
  getStatusColor(mtpr: MTPRDate): string {
    if (mtpr.isGenerated) return 'green';
    if (mtpr.isPast) return 'red';
    return 'gray';
  }

  /**
   * Obtiene el texto de estado para una MTPR
   */
  getStatusText(mtpr: MTPRDate): string {
    if (mtpr.isGenerated) return 'Generado';
    if (mtpr.isPast) return 'Pendiente';
    return 'Programado';
  }
}

// Exportar instancia singleton
export const mtprService = new MTPRService();
