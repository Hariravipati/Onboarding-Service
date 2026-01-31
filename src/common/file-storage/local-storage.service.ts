import { Injectable, Logger } from '@nestjs/common';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { IFileStorageService } from './file-storage.interface';

@Injectable()
export class LocalStorageService implements IFileStorageService {
  private readonly logger = new Logger(LocalStorageService.name);
  private readonly uploadPath = process.env.LOCAL_UPLOAD_PATH || './uploads';

  async uploadFile(
    buffer: Buffer,
    fileName: string,
    contentType?: string,
  ): Promise<string> {
    try {
      if (!existsSync(this.uploadPath)) {
        mkdirSync(this.uploadPath, { recursive: true });
      }

      const uniqueFileName = `${Date.now()}_${fileName}`;
      const filePath = join(this.uploadPath, uniqueFileName);
      
      writeFileSync(filePath, buffer);
      
      const url = `${process.env.BASE_URL || 'http://localhost:3000'}/uploads/${uniqueFileName}`;
      this.logger.log(`Document uploaded locally: ${url}`);
      return url;
    } catch (error) {
      this.logger.error('Failed to upload document locally', error);
      throw error;
    }
  }

  async getFileAsBase64(fileUrl: string): Promise<string> {
    try {
      const fileName = fileUrl.split('/').pop();
      const filePath = join(this.uploadPath, fileName);
      
      if (!existsSync(filePath)) {
        throw new Error('File not found');
      }
      
      const buffer = readFileSync(filePath);
      return buffer.toString('base64');
    } catch (error) {
      this.logger.error('Failed to get file as base64', error);
      throw error;
    }
  }
}