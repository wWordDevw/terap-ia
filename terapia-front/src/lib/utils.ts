import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind CSS de manera inteligente
 * Evita conflictos y duplicados usando clsx + tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formatea una fecha en formato español DD/MM/YYYY
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formatea una fecha en formato completo español
 */
export function formatDateLong(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Formatea una hora en formato HH:MM (24 horas)
 */
export function formatTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

/**
 * Formatea una hora en formato 12 horas con AM/PM
 */
export function formatTime12(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

/**
 * Formatea fecha y hora completa
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return `${formatDate(dateObj)} ${formatTime(dateObj)}`;
}

/**
 * Obtiene las fechas de una semana completa (7 días) a partir de una fecha de inicio
 */
export function getWeekDates(startDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
}

/**
 * Calcula las fechas de MTPR según las reglas de negocio:
 * - Primera fecha: 18 días después del ingreso
 * - Siguientes: cada 30 días por 6 meses o hasta discharge
 * - Solo días hábiles (lun-sáb), no domingos
 */
export function calculateMTPRDates(ingresoDate: string, dischargeDate?: string | null): string[] {
  const dates: string[] = [];
  const ingreso = new Date(ingresoDate);
  
  // Primera fecha: 18 días después del ingreso
  let currentDate = new Date(ingreso);
  currentDate.setDate(ingreso.getDate() + 18);
  
  // Ajustar al siguiente día hábil si cae en domingo
  if (currentDate.getDay() === 0) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Fecha límite: discharge o 6 meses después del ingreso
  const endDate = dischargeDate 
    ? new Date(dischargeDate) 
    : new Date(ingreso.getTime() + (6 * 30 * 24 * 60 * 60 * 1000));
  
  while (currentDate <= endDate) {
    // Solo agregar si no es domingo
    if (currentDate.getDay() !== 0) {
      dates.push(currentDate.toISOString().split('T')[0]);
    }
    
    // Siguiente fecha: 30 días después
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 30);
    
    // Ajustar al siguiente día hábil si cae en domingo
    if (currentDate.getDay() === 0) {
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  return dates;
}

/**
 * Calcula los días que un paciente ha estado en tratamiento
 */
export function calculateDaysInTreatment(ingresoDate: string, dischargeDate?: string | null): number {
  const ingreso = new Date(ingresoDate);
  const endDate = dischargeDate ? new Date(dischargeDate) : new Date();
  
  const diffTime = Math.abs(endDate.getTime() - ingreso.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Calcula cuántas semanas faltan hasta el discharge
 */
export function calculateWeeksUntilDischarge(currentDate: Date, dischargeDate: Date): number {
  const diffTime = dischargeDate.getTime() - currentDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.ceil(diffDays / 7);
  
  return Math.max(0, diffWeeks);
}

/**
 * Obtiene el nombre del día en español
 */
export function getDayName(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('es-ES', { weekday: 'long' });
}

/**
 * Obtiene el nombre del día abreviado (3 letras)
 */
export function getDayNameShort(date: string | Date): string {
  const dayNames = ['dom', 'lun', 'mar', 'mie', 'jue', 'vie', 'sab'];
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dayNames[dateObj.getDay()];
}

/**
 * Verifica si una fecha es día hábil (lun-sáb)
 */
export function isWorkingDay(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const day = dateObj.getDay();
  
  return day >= 1 && day <= 6; // 1=lun, 6=sáb
}

/**
 * Verifica si una fecha es hoy
 */
export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return dateObj.toDateString() === today.toDateString();
}

/**
 * Verifica si una fecha está en el pasado
 */
export function isPast(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return dateObj < today;
}

/**
 * Verifica si una fecha está en el futuro
 */
export function isFuture(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  return dateObj > today;
}

/**
 * Formatea un tamaño de archivo en bytes a formato legible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Genera un ID único simple
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Capitaliza la primera letra de un string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Obtiene las iniciales de un nombre completo
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Debounce una función
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Obtiene un rango de fechas para mostrar en formato legible
 */
export function getDateRange(startDate: string, endDate: string): string {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  
  return `${start} - ${end}`;
}

/**
 * Calcula la edad en años a partir de una fecha de nacimiento
 */
export function calculateAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Formatea un número como porcentaje
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Trunca un texto a una longitud específica
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
}

/**
 * Valida si un email tiene formato válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Obtiene el estado de una fecha respecto a hoy
 */
export function getDateStatus(date: string | Date): 'past' | 'today' | 'future' {
  if (isToday(date)) return 'today';
  if (isPast(date)) return 'past';
  return 'future';
}

/**
 * Convierte un string a formato slug (URL friendly)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .trim()
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-'); // Remover guiones duplicados
}