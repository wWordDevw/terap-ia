import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileStorageService {
  private readonly uploadPath = path.join(process.cwd(), 'uploads');

  constructor() {
    // Crear directorio de uploads si no existe
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File, subfolder?: string): Promise<{ filename: string; filepath: string }> {
    const folder = subfolder ? path.join(this.uploadPath, subfolder) : this.uploadPath;
    
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(folder, filename);
    
    fs.writeFileSync(filepath, file.buffer);
    
    return { filename, filepath };
  }

  getAbsolutePath(relativePath: string): string {
    return path.resolve(relativePath);
  }

  async fileExists(filePath: string): Promise<boolean> {
    return fs.existsSync(filePath);
  }

  async deleteFile(filePath: string): Promise<void> {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  validateFileType(mimetype: string): boolean {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    return allowedTypes.includes(mimetype);
  }

  validateFileSize(size: number): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    return size <= maxSize;
  }
}
