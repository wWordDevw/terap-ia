/**
 * Servicio de Gestión de Firmas
 * Maneja la carga, almacenamiento y uso de firmas digitales
 */

export interface Signature {
  id: string;
  userId: string;
  signatureType: 'therapist' | 'supervisor' | 'medical_director';
  imageUrl: string;
  uploadedAt: Date;
}

class SignatureService {
  private readonly STORAGE_KEY = 'user_signatures';

  /**
   * Subir nueva firma (simulado - en producción iría al backend)
   */
  async uploadSignature(
    file: File,
    type: Signature['signatureType']
  ): Promise<Signature> {
    return new Promise((resolve, reject) => {
      // Validar tipo de archivo
      if (!file.type.match(/image\/(png|jpeg|jpg)/)) {
        reject(new Error('Solo se permiten archivos PNG o JPEG'));
        return;
      }

      // Validar tamaño (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        reject(new Error('El archivo debe ser menor a 2MB'));
        return;
      }

      // Convertir a base64
      const reader = new FileReader();

      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;

        const signature: Signature = {
          id: this.generateId(),
          userId: 'current-user', // En producción vendría del contexto de auth
          signatureType: type,
          imageUrl,
          uploadedAt: new Date()
        };

        // Guardar en localStorage (en producción sería API call)
        this.saveSignature(signature);

        resolve(signature);
      };

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Obtener todas las firmas del usuario actual
   */
  async getMySignatures(): Promise<Signature[]> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];

      const signatures: Signature[] = JSON.parse(stored);
      return signatures.map(sig => ({
        ...sig,
        uploadedAt: new Date(sig.uploadedAt)
      }));
    } catch (error) {
      console.error('Error loading signatures:', error);
      return [];
    }
  }

  /**
   * Obtener firma por tipo
   */
  async getSignatureByType(type: Signature['signatureType']): Promise<Signature | null> {
    const signatures = await this.getMySignatures();
    return signatures.find(sig => sig.signatureType === type) || null;
  }

  /**
   * Eliminar firma
   */
  async deleteSignature(id: string): Promise<void> {
    try {
      const signatures = await this.getMySignatures();
      const filtered = signatures.filter(sig => sig.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting signature:', error);
      throw new Error('No se pudo eliminar la firma');
    }
  }

  /**
   * Actualizar firma existente
   */
  async updateSignature(id: string, file: File): Promise<Signature> {
    // Obtener firma existente
    const signatures = await this.getMySignatures();
    const existing = signatures.find(sig => sig.id === id);

    if (!existing) {
      throw new Error('Firma no encontrada');
    }

    // Eliminar la antigua
    await this.deleteSignature(id);

    // Subir la nueva con el mismo tipo
    return this.uploadSignature(file, existing.signatureType);
  }

  /**
   * Guardar firma en localStorage
   */
  private saveSignature(signature: Signature): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const signatures: Signature[] = stored ? JSON.parse(stored) : [];

      // Eliminar firma anterior del mismo tipo (solo una por tipo)
      const filtered = signatures.filter(
        sig => sig.signatureType !== signature.signatureType
      );

      filtered.push(signature);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error saving signature:', error);
      throw new Error('No se pudo guardar la firma');
    }
  }

  /**
   * Generar ID único
   */
  private generateId(): string {
    return `sig_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Limpiar todas las firmas (útil para desarrollo)
   */
  async clearAllSignatures(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

export const signatureService = new SignatureService();
