import { Injectable } from '@nestjs/common';
import { IFileStorageService, StorageProvider } from './file-storage.interface';
import { S3StorageService } from './s3-storage.service';
import { AzureStorageService } from './azure-storage.service';
import { LocalStorageService } from './local-storage.service';

export const FILE_STORAGE_SERVICE = 'FILE_STORAGE_SERVICE';

@Injectable()
export class FileStorageFactory {
  static createFileStorageService(): IFileStorageService {
    const provider = process.env.STORAGE_PROVIDER as StorageProvider || StorageProvider.LOCAL;
    
    switch (provider) {
      case StorageProvider.S3:
        return new S3StorageService();
      case StorageProvider.AZURE:
        return new AzureStorageService();
      case StorageProvider.LOCAL:
      default:
        return new LocalStorageService();
    }
  }
}