export interface IFileStorageService {
  uploadFile(buffer: Buffer, fileName: string, contentType?: string): Promise<string>;
  getFileAsBase64(fileUrl: string): Promise<string>;
}

export enum StorageProvider {
  S3 = 'S3',
  AZURE = 'AZURE',
  LOCAL = 'LOCAL'
}